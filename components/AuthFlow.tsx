
import React, { useState } from 'react';
import { Smartphone, ChevronRight, Lock, Loader2, Zap } from 'lucide-react';

interface Props {
  onSuccess: (phone: string) => void;
}

const AuthFlow: React.FC<Props> = ({ onSuccess }) => {
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState(['', '', '', '']);
  const [loading, setLoading] = useState(false);

  const handlePhoneSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (phone.length === 10) {
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
        setStep('otp');
      }, 1500);
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 3) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }

    if (newOtp.every(v => v !== '') && index === 3) {
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
        onSuccess(phone);
      }, 1500);
    }
  };

  return (
    <div className="flex flex-col h-full bg-white p-6 justify-center animate-in fade-in zoom-in duration-500 overflow-hidden relative">
      {/* Background blobs for logo-inspired feel */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-gigmate-blue/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-gigmate-green/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>

      <div className="mb-10 text-center relative z-10">
        <div className="mx-auto mb-8 relative group">
          <img src="/icon.png" alt="GigMate Icon" className="w-35 h-35 mx-auto rounded-[2.5rem]" />
        </div>
      </div>

      {step === 'phone' ? (
        <form onSubmit={handlePhoneSubmit} className="space-y-6 relative z-10">
          <div>
            <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-3 px-1">Mobile Number</label>
            <div className="flex items-center bg-gray-50 border-2 border-gray-100 rounded-3xl p-5 focus-within:border-gigmate-green focus-within:bg-white transition-all shadow-sm">
              <span className="text-gray-400 font-black mr-3 border-r border-gray-200 pr-4">+91</span>
              <input
                type="tel"
                maxLength={10}
                placeholder="98765 43210"
                className="bg-transparent border-none focus:ring-0 text-xl font-black tracking-[0.15em] w-full text-gigmate-blue placeholder:text-gray-300"
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                autoFocus
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={phone.length < 10 || loading}
            className="w-full bg-gigmate-green text-white py-5 rounded-[2rem] font-black text-lg shadow-xl shadow-green-100 flex items-center justify-center gap-3 hover:bg-green-600 disabled:opacity-50 transition-all active:scale-95"
          >
            {loading ? <Loader2 className="animate-spin" size={24} /> : <>Login Now <ChevronRight size={24} /></>}
          </button>
          <p className="text-center text-[10px] text-gray-400 font-medium">By continuing, you agree to our Terms & Privacy Policy</p>
        </form>
      ) : (
        <div className="space-y-8 animate-in slide-in-from-right duration-300 relative z-10">
          <div className="text-center">
            <h2 className="text-2xl font-black text-gigmate-blue">Verification Code</h2>
            <p className="text-sm font-medium text-gray-500 mt-2">We sent a 4-digit code to <span className="text-gigmate-green font-bold">+91 {phone}</span></p>
          </div>

          <div className="flex justify-center gap-4">
            {otp.map((digit, idx) => (
              <input
                key={idx}
                id={`otp-${idx}`}
                type="tel"
                maxLength={1}
                className="w-16 h-20 bg-gray-50 border-2 border-gray-100 rounded-3xl text-center text-3xl font-black text-gigmate-blue focus:border-gigmate-green focus:bg-white transition-all outline-none shadow-sm focus:shadow-lg focus:shadow-green-50"
                value={digit}
                onChange={(e) => handleOtpChange(idx, e.target.value)}
              />
            ))}
          </div>

          <div className="text-center space-y-4">
            <button className="text-sm text-gigmate-blue font-black hover:underline px-4 py-2 bg-blue-50 rounded-full">Resend Code</button>
            <div className="bg-blue-50/50 p-5 rounded-3xl flex items-start gap-4 border border-blue-100">
              <div className="bg-white p-2 rounded-xl shadow-sm"><Lock className="text-gigmate-blue" size={20} /></div>
              <p className="text-[11px] text-blue-700 leading-relaxed font-medium text-left">
                GigMate keeps your earnings data secure. We will never share your number or financial details with third parties.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AuthFlow;
