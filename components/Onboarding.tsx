
import React, { useState } from 'react';
import { PlatformName, Language, VehicleType, UserProfile, Theme } from '../types';
import { PLATFORM_COLORS } from '../constants';
import { Check, MapPin, Camera, Bell, ShieldCheck, ChevronRight, Bike, Truck, Car, Navigation, Smartphone, Sparkles, Languages, Target } from 'lucide-react';

interface Props {
  onComplete: (profile: UserProfile) => void;
}

const LANGUAGES = [
  { id: 'en', label: 'English', native: 'English' },
  { id: 'hi', label: 'Hindi', native: 'हिन्दी' },
  { id: 'ta', label: 'Tamil', native: 'தமிழ்' },
  { id: 'te', label: 'Telugu', native: 'తెలుగు' },
  { id: 'bn', label: 'Bengali', native: 'বাংলা' },
];

const PLATFORMS: PlatformName[] = ['Swiggy', 'Zomato', 'Uber', 'Rapido', 'Zepto', 'Blinkit'];

const Onboarding: React.FC<Props> = ({ onComplete }) => {
  const [step, setStep] = useState<'welcome' | 'lang' | 'platforms' | 'vehicle' | 'goals' | 'permissions'>('welcome');
  const [profile, setProfile] = useState<Partial<UserProfile>>({
    language: 'en',
    platforms: [],
    vehicle: 'bike',
    dailyGoal: 1500,
    hoursPreference: 'Full Time',
    theme: 'light'
  });

  const next = () => {
    if (step === 'welcome') setStep('lang');
    else if (step === 'lang') setStep('platforms');
    else if (step === 'platforms') setStep('vehicle');
    else if (step === 'vehicle') setStep('goals');
    else if (step === 'goals') setStep('permissions');
    else onComplete(profile as UserProfile);
  };

  const togglePlatform = (p: PlatformName) => {
    const current = profile.platforms || [];
    if (current.includes(p)) setProfile({ ...profile, platforms: current.filter(x => x !== p) });
    else setProfile({ ...profile, platforms: [...current, p] });
  };

  return (
    <div className="flex flex-col h-full bg-white dark:bg-gray-900 animate-in slide-in-from-bottom duration-500 overflow-hidden relative">
      <div className="h-1 w-full bg-gray-100 dark:bg-gray-800">
        <div
          className="h-full bg-gigmate-green transition-all duration-500"
          style={{ width: `${(Object.keys(profile).length / 6) * 100}%` }}
        />
      </div>

      <div className="flex-1 p-8 overflow-y-auto hide-scrollbar">
        {step === 'welcome' && (
          <div className="h-full flex flex-col items-center justify-center text-center">
            <div>
              <img src="/logo.png" alt="GigMate Logo" className="h-35 mx-auto object-contain" />
            </div>
            <p className="text-lg text-gray-600 font-medium px-4">The all-in-one partner app for Indian gig workers. Earn more, track better.</p>
          </div>
        )}

        {step === 'lang' && (
          <div className="space-y-6 animate-in slide-in-from-right">
            <div className="flex items-center gap-3">
              <Languages className="text-gigmate-blue" />
              <h2 className="text-2xl font-black italic">Select Language</h2>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {LANGUAGES.map(l => (
                <button
                  key={l.id}
                  onClick={() => setProfile({ ...profile, language: l.id as Language })}
                  className={`p-5 rounded-[2rem] border-2 text-left transition-all ${profile.language === l.id
                    ? 'border-gigmate-green bg-green-50'
                    : 'border-gray-50 bg-white'
                    }`}
                >
                  <p className={`font-black text-lg ${profile.language === l.id ? 'text-gigmate-green' : 'text-gray-800'}`}>{l.native}</p>
                  <p className="text-[10px] font-bold text-gray-400 uppercase">{l.label}</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 'platforms' && (
          <div className="space-y-6 animate-in slide-in-from-right">
            <h2 className="text-2xl font-black italic">Your Platforms</h2>
            <div className="grid grid-cols-2 gap-3">
              {PLATFORMS.map(p => (
                <button
                  key={p}
                  onClick={() => togglePlatform(p)}
                  className={`p-5 rounded-[2rem] border-2 transition-all flex flex-col items-center gap-3 ${profile.platforms?.includes(p) ? 'border-gigmate-green bg-green-50' : 'border-gray-50 bg-white'
                    }`}
                >
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white font-black text-xl shadow-sm ${PLATFORM_COLORS[p]}`}>
                    {p.charAt(0)}
                  </div>
                  <span className="font-bold text-xs">{p}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 'vehicle' && (
          <div className="space-y-6 animate-in slide-in-from-right">
            <h2 className="text-2xl font-black italic">Vehicle Type</h2>
            <div className="grid grid-cols-2 gap-4">
              {[
                { id: 'bike', icon: <Bike /> },
                { id: 'scooter', icon: <Navigation /> },
                { id: 'car', icon: <Car /> },
                { id: 'cycle', icon: <Bike /> },
              ].map(v => (
                <button
                  key={v.id}
                  onClick={() => setProfile({ ...profile, vehicle: v.id as VehicleType })}
                  className={`p-6 rounded-[2rem] border-2 flex flex-col items-center gap-3 transition-all ${profile.vehicle === v.id ? 'border-gigmate-green bg-green-50' : 'border-gray-50 bg-white'
                    }`}
                >
                  <div className="text-gigmate-blue">{v.icon}</div>
                  <span className="font-black italic capitalize">{v.id}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 'goals' && (
          <div className="space-y-8 animate-in slide-in-from-right">
            <h2 className="text-2xl font-black italic text-center">Set Your Daily Goal</h2>
            <div className="bg-gigmate-green p-8 rounded-[2.5rem] text-white text-center shadow-xl">
              <p className="text-[10px] font-black uppercase tracking-widest opacity-70">Target Earning</p>
              <h3 className="text-5xl font-black tracking-tighter italic">₹{profile.dailyGoal}</h3>
            </div>
            <input
              type="range"
              min="500"
              max="5000"
              step="100"
              value={profile.dailyGoal}
              onChange={(e) => setProfile({ ...profile, dailyGoal: parseInt(e.target.value) })}
              className="w-full accent-gigmate-green"
            />
          </div>
        )}

        {step === 'permissions' && (
          <div className="space-y-6 animate-in slide-in-from-right">
            <h2 className="text-2xl font-black italic text-center">Almost Ready!</h2>
            <div className="space-y-4">
              {[
                { icon: <MapPin className="text-blue-500" />, title: 'Location', desc: 'For live demand maps' },
                { icon: <ShieldCheck className="text-green-500" />, title: 'Security', desc: 'Secure data syncing' },
              ].map((p, i) => (
                <div key={i} className="flex items-center gap-4 p-5 bg-gray-50 rounded-[2rem] border border-gray-100">
                  <div className="p-3 bg-white rounded-xl shadow-sm">{p.icon}</div>
                  <div>
                    <h4 className="font-black text-sm">{p.title}</h4>
                    <p className="text-[10px] text-gray-400 font-bold">{p.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="p-8 border-t border-gray-100">
        <button
          onClick={next}
          className="w-full bg-gigmate-green text-white py-5 rounded-[2rem] font-black text-lg shadow-xl flex items-center justify-center gap-3 active-scale transition-all"
        >
          {step === 'permissions' ? 'Start Riding' : 'Continue'} <ChevronRight size={24} />
        </button>
      </div>
    </div >
  );
};

export default Onboarding;
