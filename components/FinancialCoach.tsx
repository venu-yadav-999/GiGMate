
import React, { useState } from 'react';
import { getFinancialAdvice } from '../services/geminiService';
import { EarningEntry, ExpenseEntry, Language } from '../types';
import { MessageSquare, Send, Sparkles, Receipt, Link, ShieldCheck, Lock, Eye, EyeOff, IndianRupee } from 'lucide-react';
import { useTranslation } from '../services/i18nService';

interface Props {
  earnings: EarningEntry[];
  expenses: ExpenseEntry[];
  onAddExpense: (entry: Omit<ExpenseEntry, 'id'>) => void;
  language: Language;
}

const FinancialCoach: React.FC<Props> = ({ earnings, expenses, onAddExpense, language }) => {
  const [query, setQuery] = useState('');
  const [chat, setChat] = useState<{role: 'user' | 'ai', text: string, sources?: any[]}[]>([]);
  const [loading, setLoading] = useState(false);
  const [showVault, setShowVault] = useState(false);
  const [vaultUnlocked, setVaultUnlocked] = useState(false);

  const { t } = useTranslation(language);
  const totalEarnings = earnings.reduce((sum, e) => sum + e.amount, 0);

  const handleAsk = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    const userMsg = query;
    setChat(prev => [...prev, { role: 'user', text: userMsg }]);
    setQuery('');
    setLoading(true);

    const context = `The user is an Indian gig worker who earned ₹${totalEarnings} this month.`;
    const result = await getFinancialAdvice(userMsg, context);
    
    setChat(prev => [...prev, { role: 'ai', text: result.text, sources: result.sources }]);
    setLoading(false);
  };

  const handleUnlockVault = () => {
    setLoading(true);
    setTimeout(() => {
      setVaultUnlocked(true);
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="p-4 flex flex-col h-full space-y-4">
      {/* Security Vault Section */}
      <section className="bg-slate-900 rounded-[2rem] p-6 text-white overflow-hidden relative shadow-xl shadow-slate-200">
         <div className="relative z-10 flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
               <div className="bg-white/10 p-2 rounded-xl border border-white/10">
                  <ShieldCheck className="text-gigmate-green" size={20} />
               </div>
               <h3 className="font-black italic tracking-tight">{t.securityVault}</h3>
            </div>
            {!vaultUnlocked && (
              <button 
                onClick={handleUnlockVault}
                className="bg-gigmate-green px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-green-900/50 active:scale-95 transition-all"
              >
                Unlock
              </button>
            )}
         </div>

         {!vaultUnlocked ? (
           <div className="flex flex-col items-center py-4 space-y-3 relative z-10">
              <Lock size={32} className="text-white/20" />
              <p className="text-[10px] text-white/40 font-bold uppercase tracking-widest text-center">Biometric Lock Simulation Active</p>
           </div>
         ) : (
           <div className="space-y-4 animate-in fade-in zoom-in duration-500 relative z-10">
              <div className="bg-white/5 border border-white/10 p-3 rounded-2xl flex justify-between items-center">
                 <div>
                    <p className="text-[8px] text-white/40 font-bold uppercase">PAN Number</p>
                    <p className="text-sm font-black tracking-widest">ABCDE1234F</p>
                 </div>
                 <EyeOff size={14} className="text-white/20" />
              </div>
              <div className="bg-white/5 border border-white/10 p-3 rounded-2xl flex justify-between items-center">
                 <div>
                    <p className="text-[8px] text-white/40 font-bold uppercase">Primary Bank (SBI)</p>
                    <p className="text-sm font-black tracking-widest">**** 9082</p>
                 </div>
                 <EyeOff size={14} className="text-white/20" />
              </div>
              <button onClick={() => setVaultUnlocked(false)} className="w-full text-[10px] text-white/40 font-bold uppercase hover:text-white transition-colors py-2">Lock Vault</button>
           </div>
         )}
         <div className="absolute top-0 right-0 w-32 h-32 bg-gigmate-blue/10 rounded-full blur-[60px] -translate-y-12 translate-x-12"></div>
      </section>

      {/* AI Coach Header */}
      <div className="bg-green-50 p-4 rounded-xl border border-green-100 flex items-center justify-between">
        <div className="flex items-center gap-3">
            <div className="bg-gigmate-green text-white p-2 rounded-lg shadow-md shadow-green-100">
                <Sparkles size={18} />
            </div>
            <div>
                <h3 className="font-bold text-green-900 tracking-tight">GigMate Coach</h3>
                <p className="text-[10px] text-green-700 font-bold uppercase">Tax, Loans & Safety</p>
            </div>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 min-h-[200px] bg-gray-50/50 rounded-3xl p-4 overflow-y-auto space-y-4 border border-gray-100">
        {chat.length === 0 && (
          <div className="text-center py-10">
            <div className="bg-white p-5 rounded-full inline-block mb-4 shadow-sm border border-gray-50">
                <MessageSquare className="text-gray-200" size={32} />
            </div>
            <p className="text-xs text-gray-400 font-medium">Ask your AI financial partner</p>
          </div>
        )}

        {chat.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] p-4 rounded-3xl text-xs font-medium ${
              msg.role === 'user' 
              ? 'bg-gigmate-blue text-white rounded-br-none shadow-lg shadow-blue-100' 
              : 'bg-white text-gray-800 border border-gray-100 shadow-sm rounded-bl-none'
            }`}>
              <div className="whitespace-pre-wrap leading-relaxed">{msg.text}</div>
              {msg.sources && msg.sources.length > 0 && (
                <div className="mt-3 pt-3 border-t border-gray-100">
                  <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Sources</p>
                  <div className="flex flex-wrap gap-2">
                    {msg.sources.slice(0, 2).map((s: any, idx: number) => (
                      <a key={idx} href={s.uri} target="_blank" className="flex items-center gap-1 text-gigmate-blue bg-blue-50 px-2 py-1 rounded-full text-[9px] hover:underline truncate font-black uppercase">
                        <Link size={8} /> {s.title || 'Govt Info'}
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <form onSubmit={handleAsk} className="relative">
        <input 
          type="text" 
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Ask about 44ADA, Health Insurance..."
          className="w-full pl-6 pr-14 py-5 bg-white rounded-[2rem] shadow-xl border-none focus:ring-2 focus:ring-gigmate-green text-sm font-medium"
        />
        <button 
          type="submit"
          className="absolute right-2.5 top-1/2 -translate-y-1/2 p-3 bg-gigmate-green text-white rounded-[1.5rem] hover:bg-green-600 disabled:opacity-50 shadow-lg active:scale-95 transition-all"
          disabled={loading}
        >
          <Send size={20} />
        </button>
      </form>
    </div>
  );
};

export default FinancialCoach;
