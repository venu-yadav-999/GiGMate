
import React, { useState, useRef } from 'react';
// Added Language to imports
import { EarningEntry, Platform, ImportMethod, Language } from '../types';
import { PLATFORM_COLORS } from '../constants';
import { Plus, ChevronDown, ListFilter, IndianRupee, RefreshCw, Camera, Smartphone, Check, X, Loader2, Image as ImageIcon } from 'lucide-react';
import { parseSMS, getMockSMS } from '../services/smsService';

interface Props {
  earnings: EarningEntry[];
  onAdd: (entry: Omit<EarningEntry, 'id'>) => void;
  // Added language to Props
  language: Language;
}

// Destructured language from props
const EarningsTracker: React.FC<Props> = ({ earnings, onAdd, language }) => {
  const [showForm, setShowForm] = useState(false);
  const [platform, setPlatform] = useState<Platform>('Swiggy');
  const [amount, setAmount] = useState('');
  const [orders, setOrders] = useState('');
  const [hours, setHours] = useState('');
  const [syncing, setSyncing] = useState(false);
  const [capturing, setCapturing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd({
      platform,
      amount: parseFloat(amount),
      orders: parseInt(orders),
      durationHours: parseFloat(hours),
      date: new Date().toISOString().split('T')[0],
      importMethod: 'MANUAL'
    });
    setAmount('');
    setOrders('');
    setHours('');
    setShowForm(false);
  };

  const handleSyncSMS = () => {
    setSyncing(true);
    setTimeout(() => {
      const mockSMS = getMockSMS();
      let importedCount = 0;
      mockSMS.forEach(sms => {
        const parsed = parseSMS(sms);
        if (parsed) {
          onAdd(parsed as Omit<EarningEntry, 'id'>);
          importedCount++;
        }
      });
      setSyncing(false);
      alert(`Sync complete! ${importedCount} entries imported from SMS.`);
    }, 2000);
  };

  const handlePhotoCapture = () => {
    setCapturing(true);
    // Simulate camera/processing
    setTimeout(() => {
      setCapturing(false);
      setAmount('450');
      setOrders('6');
      setPlatform('Blinkit');
      setShowForm(true);
      alert('Photo analyzed! Please verify the details.');
    }, 2500);
  };

  return (
    <div className="p-4 space-y-6">
      <div className="flex justify-between items-center">
        <div>
           <h2 className="text-2xl font-black text-gray-800 tracking-tight italic">Earning Hub</h2>
           <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Auto-sync active</p>
        </div>
        <div className="flex gap-2">
           <button 
             onClick={handleSyncSMS}
             disabled={syncing}
             className="bg-blue-50 text-gigmate-blue p-2.5 rounded-2xl shadow-sm border border-blue-100 active:scale-95 transition-all disabled:opacity-50"
             title="Sync SMS"
           >
             {syncing ? <Loader2 size={20} className="animate-spin" /> : <RefreshCw size={20} />}
           </button>
           <button 
             onClick={() => setShowForm(!showForm)}
             className="bg-gigmate-green text-white p-2.5 rounded-2xl shadow-lg shadow-green-100 active:scale-95 transition-all"
             title="Add Manual"
           >
             <Plus size={20} />
           </button>
        </div>
      </div>

      {/* Sync Status Banner */}
      <div className="bg-gradient-to-r from-gigmate-blue/10 to-indigo-50 p-4 rounded-3xl border border-blue-100 flex items-center justify-between">
         <div className="flex items-center gap-3">
            <div className="bg-white p-2 rounded-xl shadow-sm">
               <Smartphone className="text-gigmate-blue" size={18} />
            </div>
            <div>
               <p className="text-xs font-black text-gray-800">Auto-Import Ready</p>
               <p className="text-[10px] text-gray-500 font-medium">Syncing with Swiggy & Uber</p>
            </div>
         </div>
         <span className="flex h-2 w-2 rounded-full bg-gigmate-green animate-pulse"></span>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-[2.5rem] shadow-xl border border-gray-100 space-y-5 animate-in slide-in-from-top-4 duration-300">
          <div className="flex justify-between items-center mb-2">
             <h3 className="font-black text-gray-800 italic">Add Record</h3>
             <button type="button" onClick={() => setShowForm(false)} className="text-gray-300"><X size={20} /></button>
          </div>

          <div className="flex gap-2 mb-4">
             <button 
               type="button"
               onClick={handlePhotoCapture}
               disabled={capturing}
               className="flex-1 flex items-center justify-center gap-2 bg-gray-50 text-gray-600 py-3 rounded-2xl text-xs font-bold border border-gray-100 active:bg-gray-100 transition-colors"
             >
               {capturing ? <Loader2 size={16} className="animate-spin" /> : <Camera size={16} />} 
               Scan Receipt
             </button>
          </div>

          <div>
            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 ml-1">Platform</label>
            <div className="relative">
              <select 
                value={platform} 
                onChange={(e) => setPlatform(e.target.value as Platform)}
                className="w-full p-4 bg-gray-50 rounded-2xl border-2 border-transparent focus:border-gigmate-green focus:bg-white text-sm font-black text-gray-800 appearance-none outline-none transition-all shadow-inner"
              >
                {['Swiggy', 'Zomato', 'Uber', 'Rapido', 'Zepto', 'Blinkit'].map(p => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                 <ChevronDown size={18} />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 ml-1">Total ₹</label>
              <input 
                type="number" 
                value={amount} 
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                className="w-full p-4 bg-gray-50 rounded-2xl border-2 border-transparent focus:border-gigmate-green focus:bg-white text-lg font-black text-gigmate-blue outline-none transition-all shadow-inner"
                required
              />
            </div>
            <div>
              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 ml-1">Orders</label>
              <input 
                type="number" 
                value={orders} 
                onChange={(e) => setOrders(e.target.value)}
                placeholder="0"
                className="w-full p-4 bg-gray-50 rounded-2xl border-2 border-transparent focus:border-gigmate-green focus:bg-white text-lg font-black text-gray-800 outline-none transition-all shadow-inner"
              />
            </div>
          </div>

          <button type="submit" className="w-full bg-gigmate-green text-white py-4 rounded-2xl font-black shadow-lg shadow-green-100 active:scale-95 transition-all text-lg flex items-center justify-center gap-2">
            <Check size={20} /> Save Earning
          </button>
        </form>
      )}

      <div className="space-y-4">
        {earnings.map((entry) => (
          <div key={entry.id} className="bg-white p-5 rounded-[2rem] border border-gray-100 shadow-sm flex justify-between items-center group active:bg-gray-50 transition-all hover:shadow-md hover:border-gigmate-green/20">
            <div className="flex items-center gap-4">
              <div className={`${PLATFORM_COLORS[entry.platform]} w-14 h-14 rounded-2xl flex items-center justify-center text-white font-black text-lg shadow-lg relative overflow-hidden`}>
                {entry.platform.charAt(0)}
                {/* Method Icon overlay */}
                <div className="absolute bottom-0 right-0 bg-white/20 p-1 backdrop-blur-sm">
                  {entry.importMethod === 'SMS' && <Smartphone size={10} />}
                  {entry.importMethod === 'PHOTO' && <Camera size={10} />}
                  {entry.importMethod === 'MANUAL' && <Plus size={10} />}
                </div>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <p className="font-black text-gray-800 italic">{entry.platform}</p>
                  <span className="text-[8px] font-black text-white px-1.5 py-0.5 rounded bg-gray-300 uppercase tracking-tighter">
                    {entry.importMethod}
                  </span>
                </div>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-0.5">{entry.date} • {entry.orders} orders</p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-black text-gigmate-blue text-lg">₹{entry.amount}</p>
              <div className="flex items-center justify-end gap-1 mt-0.5">
                 <Check size={10} className="text-gigmate-green" />
                 <span className="text-[10px] text-gigmate-green font-black uppercase tracking-widest">Verified</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EarningsTracker;
