
import React, { useState, useEffect, useMemo } from 'react';
import { getDemandHotspots } from '../services/geminiService';
import { DemandPredictionEngine, getMockWeather, getMockEvent } from '../services/predictionService';
import { Hotspot, WeatherData, LocalEvent, Language } from '../types';
import { useTranslation } from '../services/i18nService';
import { Navigation, RefreshCw, CloudRain, Calendar, Zap, Target, Sliders, Map as MapIcon, LocateFixed, Info, Sparkles } from 'lucide-react';

interface Props {
  language: Language;
}

const DemandMap: React.FC<Props> = ({ language }) => {
  const [hotspots, setHotspots] = useState<Hotspot[]>([]);
  const [loading, setLoading] = useState(true);
  const [city] = useState('Bangalore');
  const [mode, setMode] = useState<'LIVE' | 'PREDICTED'>('PREDICTED');
  const [weather] = useState<WeatherData>(getMockWeather());
  const [event] = useState<LocalEvent>(getMockEvent());
  const [myLocation, setMyLocation] = useState({ x: 42, y: 52 });

  const { t } = useTranslation(language);

  // Real-time location jitter (Production Simulation)
  useEffect(() => {
    const interval = setInterval(() => {
      setMyLocation(prev => ({
        x: Math.min(95, Math.max(5, prev.x + (Math.random() - 0.5) * 0.15)),
        y: Math.min(95, Math.max(5, prev.y + (Math.random() - 0.5) * 0.15))
      }));
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      if (mode === 'LIVE') {
        const data = await getDemandHotspots(city);
        setHotspots(data);
      } else {
        const data = await DemandPredictionEngine.predictNextHour(city, weather, event);
        setHotspots(data);
      }
    } catch (e) {
      console.error("Map Data Error", e);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, [city, mode]);

  const top3 = useMemo(() => hotspots.slice(0, 3), [hotspots]);

  return (
    <div className="flex flex-col h-full bg-gray-50/50 animate-in fade-in duration-700">
      {/* Dynamic Map Controller */}
      <div className="p-4 flex justify-between items-center bg-white/80 backdrop-blur-md sticky top-0 z-40 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gigmate-blue/10 rounded-xl text-gigmate-blue">
            <MapIcon size={20} />
          </div>
          <div>
            <h2 className="text-lg font-black italic tracking-tighter leading-none">{t.demandRadar}</h2>
            <div className="flex items-center gap-1.5 mt-1">
               <span className="w-1.5 h-1.5 rounded-full bg-gigmate-green animate-pulse"></span>
               <p className="text-[8px] font-bold text-gray-400 uppercase tracking-widest">{city} Central</p>
            </div>
          </div>
        </div>
        
        <div className="bg-gray-100 p-1 rounded-2xl flex border border-gray-200">
          <button 
            onClick={() => setMode('LIVE')}
            className={`px-4 py-1.5 rounded-xl text-[9px] font-black transition-all ${mode === 'LIVE' ? 'bg-white shadow-md text-gigmate-blue' : 'text-gray-400'}`}
          >
            LIVE
          </button>
          <button 
            onClick={() => setMode('PREDICTED')}
            className={`px-4 py-1.5 rounded-xl text-[9px] font-black transition-all ${mode === 'PREDICTED' ? 'bg-white shadow-md text-gigmate-green' : 'text-gray-400'}`}
          >
            AI FORECAST
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Map Container */}
        <div className="relative h-[340px] bg-[#f0f2f5] rounded-[2.5rem] border-4 border-white shadow-2xl overflow-hidden group">
          {/* Street Map Visual Simulation */}
          <div className="absolute inset-0 opacity-20 pointer-events-none">
             <div className="absolute top-1/3 left-0 right-0 h-4 bg-gray-400 -rotate-2"></div>
             <div className="absolute top-2/3 left-0 right-0 h-8 bg-gray-400 rotate-3"></div>
             <div className="absolute left-1/4 top-0 bottom-0 w-4 bg-gray-400 -rotate-3"></div>
             <div className="absolute left-3/4 top-0 bottom-0 w-6 bg-gray-400 rotate-1"></div>
             <div className="absolute inset-0" style={{ backgroundImage: 'linear-gradient(#d1d5db 1px, transparent 1px), linear-gradient(90deg, #d1d5db 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
          </div>

          {/* User Marker */}
          <div 
            className="absolute transform -translate-x-1/2 -translate-y-1/2 z-20 transition-all duration-1000"
            style={{ left: `${myLocation.x}%`, top: `${myLocation.y}%` }}
          >
            <div className="relative">
              <div className="w-10 h-10 bg-gigmate-blue/20 rounded-full animate-pulse flex items-center justify-center">
                 <div className="w-3.5 h-3.5 bg-gigmate-blue border-2 border-white rounded-full shadow-lg"></div>
              </div>
              <div className="absolute -top-7 left-1/2 -translate-x-1/2 bg-white px-2 py-0.5 rounded-full shadow-md border border-gray-100 whitespace-nowrap">
                <span className="text-[7px] font-black text-gigmate-blue uppercase">Partner Location</span>
              </div>
            </div>
          </div>

          {/* Hotspots Heatmap */}
          {!loading && hotspots.map((spot, i) => (
            <div 
              key={i}
              className="absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-1000"
              style={{ left: `${spot.coordinates.x}%`, top: `${spot.coordinates.y}%` }}
            >
              {/* Blur Heat Layer */}
              <div className={`absolute inset-0 rounded-full blur-xl opacity-30 ${spot.intensity > 8 ? 'bg-red-500 scale-150' : 'bg-gigmate-green scale-125'}`} 
                   style={{ width: `${spot.intensity * 14}px`, height: `${spot.intensity * 14}px` }}></div>
              
              {/* Core Pin */}
              <div className={`relative p-2.5 rounded-full shadow-xl border-2 border-white transition-transform hover:scale-150 cursor-pointer ${spot.intensity > 8 ? 'bg-red-500' : 'bg-gigmate-green'}`}>
                <Navigation size={12} className="text-white fill-current rotate-45" />
              </div>
            </div>
          ))}

          {/* Context Widgets */}
          <div className="absolute top-4 left-4 right-4 flex justify-between pointer-events-none">
             <div className="bg-white/95 backdrop-blur-md px-3 py-2 rounded-2xl shadow-xl border border-white flex items-center gap-2 pointer-events-auto">
                <CloudRain size={14} className="text-gigmate-blue" />
                <p className="text-[9px] font-black text-gray-800">{weather.temp}°C {weather.condition}</p>
             </div>
             <div className="bg-white/95 backdrop-blur-md px-3 py-2 rounded-2xl shadow-xl border border-white flex items-center gap-2 pointer-events-auto">
                <Calendar size={14} className="text-red-500" />
                <p className="text-[9px] font-black text-red-500">{event.name}</p>
             </div>
          </div>

          {loading && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/60 backdrop-blur-md z-30">
               <RefreshCw size={32} className="text-gigmate-green animate-spin mb-4" />
               <p className="text-[10px] font-black text-gigmate-green uppercase tracking-widest animate-pulse">Running ML Forecast...</p>
            </div>
          )}

          <button onClick={() => setMyLocation({x: 50, y: 50})} className="absolute bottom-4 right-4 bg-white p-3 rounded-2xl shadow-xl text-gigmate-blue active:scale-90 transition-all border border-gray-100">
             <LocateFixed size={22} />
          </button>
        </div>

        {/* Top 3 Hotspots Listing */}
        <section className="space-y-4">
           <div className="flex items-center justify-between px-2">
              <h3 className="font-black text-gray-800 text-sm tracking-tight italic uppercase flex items-center gap-2">
                 <Target size={16} className="text-red-500" /> Top {t.hotspots}
              </h3>
              <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest italic">Updated Just Now</span>
           </div>
           
           <div className="grid gap-3">
              {loading ? (
                 [1, 2, 3].map(i => <div key={i} className="h-28 bg-white rounded-[2.5rem] animate-pulse border border-gray-100" />)
              ) : (
                 top3.map((spot, i) => (
                    <div key={i} className="bg-white p-5 rounded-[2.5rem] border border-gray-100 shadow-sm flex items-center justify-between group hover:shadow-xl hover:border-gigmate-green/30 transition-all duration-300 relative overflow-hidden">
                       <div className="absolute top-0 left-0 bg-gray-900 text-white px-3 py-1 rounded-br-2xl font-black text-[10px]">ZONE {i+1}</div>
                       <div className="flex items-center gap-5 pt-3">
                          <div className={`w-16 h-16 rounded-3xl flex flex-col items-center justify-center text-white shadow-xl relative overflow-hidden ${spot.intensity > 8 ? 'bg-red-500' : 'bg-gigmate-green'}`}>
                             <span className="text-[7px] font-black opacity-60 uppercase tracking-widest">Bonus</span>
                             <span className="text-lg font-black">{spot.expectedIncentive}</span>
                             <div className="absolute inset-0 bg-white/10 opacity-50"></div>
                          </div>
                          <div>
                             <h4 className="font-black text-gray-800 text-sm italic">{spot.area}</h4>
                             <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest mt-0.5">{spot.demandReason}</p>
                             <div className="flex items-center gap-3 mt-2">
                                <span className="text-[8px] font-black text-gigmate-blue bg-blue-50 px-2 py-0.5 rounded-full">{spot.distance}</span>
                                <div className="flex items-center gap-1">
                                   <Zap size={10} className="text-gigmate-yellow fill-current" />
                                   <span className="text-[8px] font-black text-gigmate-yellow uppercase">Fast Orders</span>
                                </div>
                             </div>
                          </div>
                       </div>
                       <button className="bg-gray-50 p-4 rounded-3xl group-hover:bg-gigmate-green group-hover:text-white transition-all text-gray-300 shadow-inner">
                          <Navigation size={22} className="rotate-45" />
                       </button>
                    </div>
                 ))
              )}
           </div>
        </section>

        {/* AI Insight Section */}
        <section className="bg-white p-6 rounded-[2.5rem] border-2 border-dashed border-gray-200 relative overflow-hidden group">
           <div className="flex gap-4 relative z-10">
              <div className="bg-gigmate-green/10 p-3 rounded-2xl text-gigmate-green self-start animate-bounce">
                 <Sparkles size={22} />
              </div>
              <div>
                 <p className="text-[9px] font-black text-gigmate-green uppercase tracking-[0.2em] mb-1">{t.aiInsight}</p>
                 <h4 className="text-sm font-black text-gray-800 mb-2">Move towards HSR Sector 2</h4>
                 <p className="text-[11px] text-gray-500 leading-relaxed font-medium italic">
                    "Our ML model predicts a <span className="text-red-500 font-bold">45% increase</span> in order volume near HSR in the next 20 mins due to rain patterns. Head south now to capture early bookings."
                 </p>
              </div>
           </div>
        </section>
      </div>
    </div>
  );
};

export default DemandMap;
