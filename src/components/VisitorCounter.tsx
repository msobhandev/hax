import React, { useState, useEffect } from 'react';
import { Eye, Sparkles } from 'lucide-react';
import { ThemeMode } from '../types';
import { sound } from '../utils/soundEngine';

interface VisitorCounterProps {
  theme: ThemeMode;
}

export const VisitorCounter: React.FC<VisitorCounterProps> = ({ theme }) => {
  const [count, setCount] = useState<number>(1042);
  const [justBumped, setJustBumped] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('pip_visit_count');
      const initial = stored ? parseInt(stored, 10) : 1042;
      const next = initial + 1;
      setCount(next);
      localStorage.setItem('pip_visit_count', next.toString());
    } catch {
      setCount(1043);
    }
  }, []);

  const handleTossStar = () => {
    sound.playSparkle();
    setJustBumped(true);
    const next = count + 1;
    setCount(next);
    try {
      localStorage.setItem('pip_visit_count', next.toString());
    } catch {
      // Ignore
    }
    setTimeout(() => setJustBumped(false), 600);
  };

  // Format count into 6 digits: 001043
  const formattedDigits = count.toString().padStart(6, '0').split('');

  return (
    <div
      className={`p-6 rounded-3xl border shadow-lg max-w-md mx-auto text-center transition-all ${
        theme === 'day'
          ? 'bg-[#fffdf9] border-[#f3c4d3] text-[#5c4033]'
          : 'bg-[#24213d] border-[#e65d96]/30 text-[#fff0e8]'
      }`}
    >
      <div className="flex items-center justify-center gap-1.5 text-xs font-sans font-semibold uppercase tracking-wider opacity-70 mb-2">
        <Eye className="w-3.5 h-3.5 text-amber-500" />
        <span>Local Observatory Visitor Odometer</span>
      </div>

      <p className="text-[11px] opacity-60 font-sans mb-4">
        (Saved locally in your browser storage · Demo Mode)
      </p>

      {/* Retro Roller Odometer */}
      <div className="inline-flex items-center gap-1 p-2 rounded-xl bg-stone-900 border-2 border-amber-400/50 shadow-inner">
        {formattedDigits.map((digit, idx) => (
          <div
            key={idx}
            className={`w-7 sm:w-8 h-10 sm:h-11 rounded-lg bg-black text-amber-400 font-mono text-xl sm:text-2xl font-bold flex items-center justify-center border border-stone-800 shadow-md ${
              justBumped && idx >= 4 ? 'animate-bounce text-yellow-300' : ''
            }`}
          >
            {digit}
          </div>
        ))}
      </div>

      {/* Interaction button */}
      <div className="mt-4">
        <button
          onClick={handleTossStar}
          type="button"
          className={`px-4 py-2 rounded-full text-xs font-medium border flex items-center gap-2 mx-auto active:scale-95 transition-all shadow-sm ${
            theme === 'day'
              ? 'bg-[#fdeedf] hover:bg-[#fae2cd] text-[#a34063] border-[#f3c4d3]'
              : 'bg-[#17172c] hover:bg-stone-900 text-[#e65d96] border-purple-800'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>Toss a Lucky Bedtime Star (+1)</span>
        </button>
      </div>
    </div>
  );
};
