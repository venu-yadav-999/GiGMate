
import React, { useMemo } from 'react';
import { EarningEntry, ExpenseEntry, Language } from '../types';
import { PLATFORM_COLORS } from '../constants';
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, PieChart, Pie
} from 'recharts';
import { TrendingUp, Zap, Award, Target, Trophy, Clock, Star, AlertTriangle } from 'lucide-react';
import { useTranslation } from '../services/i18nService';

interface Props {
  earnings: EarningEntry[];
  expenses: ExpenseEntry[];
  language: Language;
}

const Dashboard: React.FC<Props> = ({ earnings, expenses, language }) => {
  const { t } = useTranslation(language);

  // Memoized Calculations for Performance
  const totalEarnings = useMemo(() => earnings.reduce((sum, e) => sum + e.amount, 0), [earnings]);
  
  const platformData = useMemo(() => {
    const groups: Record<string, number> = {};
    earnings.forEach(e => {
      groups[e.platform] = (groups[e.platform] || 0) + e.amount;
    });
    return Object.entries(groups).map(([name, value]) => ({ name, value }));
  }, [earnings]);

  const milestones = [
    { title: 'Early Bird', icon: <Clock size={16} />, desc: 'Started before 7 AM', status: 'COMPLETED' },
    { title: 'Super Captain', icon: <Trophy size={16} />, desc: '10+ rides today', status: 'IN_PROGRESS' },
    { title: 'Review Star', icon: <Star size={16} />, desc: '5 consecutive 5-star ratings', status: 'LOCKED' },
  ];

  if (earnings.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8 text-center space-y-4">
        <div className="bg-gray-100 dark:bg-gray-800 p-8 rounded-full">
           <AlertTriangle size={48} className="text-gray-400" />
        </div>
        <h3 className="text-xl font-black italic">No data yet</h3>
        <p className="text-sm text-gray-500 font-medium">Start syncing your earnings to see your performance metrics here.</p>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-6 animate-in fade-in duration-500 transition-colors">
      {/* Summary Card */}
      <section className="bg-gradient-to-br from-gigmate-green to-gigmate-blue rounded-[2.5rem] p-8 text-white shadow-2xl relative overflow-hidden">
        <div className="relative z-10 flex justify-between items-start">
          <div>
            <div className="flex items-center gap-2 mb-1">
               <Target size={14} className="text-white/60" />
               <p className="text-white/80 text-[10px] font-bold uppercase tracking-widest">{t.monthlyEarnings}</p>
            </div>
            <h2 className="text-4xl font-black tracking-tighter italic">₹{totalEarnings.toLocaleString('en-IN')}</h2>
          </div>
          <div className="bg-white/20 p-3 rounded-2xl backdrop-blur-md border border-white/20 shadow-lg">
            <TrendingUp size={28} />
          </div>
        </div>
        
        <div className="mt-8 flex gap-6 relative z-10 border-t border-white/10 pt-6">
          <div className="flex-1">
            <p className="text-white/60 text-[10px] uppercase tracking-widest font-black mb-1">Platforms</p>
            <p className="text-xl font-black">{platformData.length}</p>
          </div>
          <div className="flex-1">
            <p className="text-white/60 text-[10px] uppercase tracking-widest font-black mb-1">Daily Avg</p>
            <p className="text-xl font-black">₹{Math.round(totalEarnings / 30)}</p>
          </div>
        </div>

        <div className="absolute -bottom-12 -right-12 w-48 h-48 bg-white/10 rounded-full blur-3xl"></div>
      </section>

      {/* Stats Cards */}
      <section className="grid grid-cols-2 gap-4">
         <div className="bg-white dark:bg-gray-800 p-5 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700">
            <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">{t.vsLastWeek}</h4>
            <div className="flex items-baseline gap-1 text-gigmate-green">
               <span className="text-xl font-black tracking-tighter">+12%</span>
               <TrendingUp size={12} />
            </div>
         </div>
         <div className="bg-white dark:bg-gray-800 p-5 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700">
            <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">{t.totalOrders}</h4>
            <div className="flex items-baseline gap-1 text-gigmate-blue">
               <span className="text-xl font-black tracking-tighter">{earnings.reduce((s, e) => s + e.orders, 0)}</span>
            </div>
         </div>
      </section>

      {/* Charting Section */}
      <section className="bg-white dark:bg-gray-800 p-6 rounded-[2.5rem] border border-gray-100 dark:border-gray-700 shadow-sm space-y-6">
         <div className="flex items-center justify-between">
            <h3 className="font-black flex items-center gap-3 italic">
               <div className="w-1.5 h-6 bg-gigmate-green rounded-full"></div> 
               Earning Distribution
            </h3>
         </div>
         
         <div className="flex items-center gap-4">
            <div className="h-32 w-32">
               <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                     <Pie
                        data={platformData}
                        innerRadius={25}
                        outerRadius={40}
                        paddingAngle={5}
                        dataKey="value"
                     >
                        {platformData.map((entry, index) => (
                           <Cell key={`cell-${index}`} fill={PLATFORM_COLORS[entry.name as any] || '#39b54a'} />
                        ))}
                     </Pie>
                  </PieChart>
               </ResponsiveContainer>
            </div>
            <div className="flex-1 space-y-2">
               {platformData.map((item, i) => (
                  <div key={i} className="flex items-center justify-between">
                     <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${PLATFORM_COLORS[item.name as any]}`}></div>
                        <span className="text-[10px] font-bold text-gray-500">{item.name}</span>
                     </div>
                     <span className="text-[10px] font-black">₹{item.value}</span>
                  </div>
               ))}
            </div>
         </div>
      </section>

      {/* Milestones Horizontal Scroll */}
      <section className="space-y-4">
         <h3 className="font-black text-sm tracking-tight italic px-2">Milestones</h3>
         <div className="flex gap-3 overflow-x-auto pb-4 hide-scrollbar">
            {milestones.map((m, i) => (
               <div key={i} className={`flex-shrink-0 w-36 p-4 rounded-3xl border-2 transition-all shadow-sm ${
                 m.status === 'COMPLETED' ? 'bg-green-50/10 border-gigmate-green/20' : 
                 m.status === 'IN_PROGRESS' ? 'bg-blue-50/10 border-gigmate-blue/20' : 'bg-gray-50/10 border-gray-100/10 opacity-60'
               }`}>
                  <div className={`w-10 h-10 rounded-2xl flex items-center justify-center mb-3 shadow-md ${
                    m.status === 'COMPLETED' ? 'bg-gigmate-green text-white' : 
                    m.status === 'IN_PROGRESS' ? 'bg-gigmate-blue text-white' : 'bg-gray-200 text-gray-400'
                  }`}>
                     {m.icon}
                  </div>
                  <h4 className="text-xs font-black">{m.title}</h4>
                  <p className="text-[9px] text-gray-400 font-bold mt-1 leading-tight">{m.desc}</p>
               </div>
            ))}
         </div>
      </section>
    </div>
  );
};

export default Dashboard;
