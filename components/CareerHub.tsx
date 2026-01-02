
import React, { useState } from 'react';
import { BookOpen, Briefcase, Users, Star, ArrowRight, Bug, Heart, Send } from 'lucide-react';
import { Language } from '../types';
import { useTranslation } from '../services/i18nService';

interface Props {
  language: Language;
}

const CareerHub: React.FC<Props> = ({ language }) => {
  const [feedback, setFeedback] = useState('');
  const [submitted, setSubmitted] = useState(false);
  
  const { t } = useTranslation(language);

  const courses = [
    { title: 'Advanced Bike Maintenance', provider: 'Royal Enfield', duration: '2 Weeks', rating: 4.8 },
    { title: 'English for Delivery Excellence', provider: 'British Council', duration: '4 Weeks', rating: 4.9 },
  ];

  const handleFeedbackSubmit = () => {
    if (!feedback.trim()) return;
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
    setFeedback('');
  };

  return (
    <div className="p-4 space-y-6 pb-12">
      {/* Beta Feedback Zone */}
      <section className="bg-yellow-50 border-2 border-gigmate-yellow/20 rounded-[2.5rem] p-6 shadow-sm relative overflow-hidden">
         <div className="flex items-center gap-3 mb-4">
            <div className="bg-gigmate-yellow p-2 rounded-xl text-white shadow-md">
               <Bug size={20} />
            </div>
            <div>
               <h3 className="font-black italic text-sm tracking-tight">{t.betaFeedback}</h3>
               <p className="text-[10px] font-bold text-gigmate-yellow uppercase">First 50 Testers Only</p>
            </div>
         </div>
         
         {!submitted ? (
            <div className="space-y-3">
               <textarea 
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  placeholder="Tell us what to improve..."
                  className="w-full bg-white border-2 border-gray-100 rounded-2xl p-4 text-xs font-medium focus:ring-2 focus:ring-gigmate-yellow focus:border-transparent outline-none transition-all h-24"
               />
               <button 
                  onClick={handleFeedbackSubmit}
                  className="w-full bg-gigmate-yellow text-white py-4 rounded-2xl font-black shadow-lg shadow-yellow-100 flex items-center justify-center gap-2 active:scale-95 transition-all text-xs"
               >
                  Send Feedback <Send size={14} />
               </button>
            </div>
         ) : (
            <div className="py-6 flex flex-col items-center justify-center animate-in zoom-in duration-300">
               <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-md mb-2">
                  <Heart className="text-red-500 fill-current" size={24} />
               </div>
               <p className="text-xs font-black text-gigmate-yellow italic">Thank you, Partner!</p>
            </div>
         )}
      </section>

      <section>
        <div className="flex justify-between items-center mb-4 px-1">
          <h2 className="text-xl font-black text-gray-800 italic tracking-tight">Level Up</h2>
          <span className="text-[10px] font-black text-gigmate-green bg-green-50 px-3 py-1 rounded-full border border-green-100 shadow-sm uppercase">Elite Level 4</span>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gradient-to-br from-gigmate-green to-green-700 p-5 rounded-[2rem] text-white shadow-xl shadow-green-100 overflow-hidden relative group transition-all">
            <BookOpen size={24} className="mb-3 opacity-80" />
            <h3 className="font-black italic text-sm">Skills Hub</h3>
            <p className="text-[10px] font-bold opacity-60 uppercase tracking-widest mt-1">12 Available</p>
            <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full blur-2xl -translate-y-12 translate-x-12 group-hover:scale-150 transition-transform duration-700"></div>
          </div>
          <div className="bg-gradient-to-br from-gigmate-blue to-indigo-800 p-5 rounded-[2rem] text-white shadow-xl shadow-blue-100 overflow-hidden relative group transition-all">
            <Users size={24} className="mb-3 opacity-80" />
            <h3 className="font-black italic text-sm">Refer & Earn</h3>
            <p className="text-[10px] font-bold opacity-60 uppercase tracking-widest mt-1">₹2,000 / Lead</p>
            <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full blur-2xl -translate-y-12 translate-x-12 group-hover:scale-150 transition-transform duration-700"></div>
          </div>
        </div>
      </section>

      <section>
        <h3 className="font-black text-gray-800 text-sm mb-4 px-1 italic flex items-center gap-2">
            <Star size={16} className="text-gigmate-yellow fill-current" /> Learning Path
        </h3>
        <div className="space-y-4">
          {courses.map((course, i) => (
            <div key={i} className="bg-white p-5 rounded-[2rem] border border-gray-100 shadow-sm flex items-center justify-between group hover:border-gigmate-green hover:shadow-lg transition-all">
              <div>
                <h4 className="font-black text-gray-800 text-sm italic">{course.title}</h4>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">{course.provider} • {course.duration}</p>
                <div className="flex items-center gap-1.5 mt-2">
                  <Star size={12} className="text-gigmate-yellow fill-current" />
                  <span className="text-[10px] font-black text-gray-600">{course.rating} Rating</span>
                </div>
              </div>
              <button className="bg-gray-50 p-4 rounded-2xl group-hover:bg-gigmate-green group-hover:text-white transition-all text-gray-400 shadow-inner">
                <ArrowRight size={20} />
              </button>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-gray-900 text-white p-8 rounded-[3rem] relative overflow-hidden shadow-2xl">
        <div className="relative z-10">
            <div className="flex items-center gap-3 mb-3">
               <div className="w-10 h-10 bg-gigmate-green rounded-2xl flex items-center justify-center font-black text-lg shadow-lg">G</div>
               <h3 className="font-black italic text-xl">Community</h3>
            </div>
            <p className="text-xs text-gray-400 leading-relaxed mb-6 font-medium">
                Join 50k+ partners across India to discuss routes, platform hacks, and safety.
            </p>
            <button className="bg-white text-gray-900 px-6 py-4 rounded-[1.5rem] text-xs font-black uppercase tracking-widest flex items-center gap-3 shadow-xl active:scale-95 transition-all">
                Join Whatsapp <ArrowRight size={14} className="text-gigmate-green" />
            </button>
        </div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-gigmate-blue/20 blur-[80px] rounded-full -translate-y-24 translate-x-24"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-gigmate-green/10 blur-[80px] rounded-full translate-y-24 -translate-x-24"></div>
      </section>
    </div>
  );
};

export default CareerHub;
