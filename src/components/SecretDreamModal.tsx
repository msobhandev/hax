import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Sparkles, X, Star, Heart, Moon, Compass, Award } from 'lucide-react';
import { ThemeMode } from '../types';
import { sound } from '../utils/soundEngine';

interface SecretDreamModalProps {
  isOpen: boolean;
  onClose: () => void;
  theme: ThemeMode;
}

export const SecretDreamModal: React.FC<SecretDreamModalProps> = ({ isOpen, onClose, theme }) => {
  useEffect(() => {
    if (isOpen) {
      sound.playEasterEggChime();

      // Launch gentle starlight confetti
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#f59e0b', '#ec4899', '#8b5cf6', '#60a5fa', '#fef08a'],
        });
      } catch {
        // Ignore if confetti fails
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-300">
      <div
        className={`relative w-full max-w-lg rounded-3xl p-6 sm:p-8 border shadow-2xl transition-all scale-100 animate-in zoom-in-95 duration-200 ${
          theme === 'day'
            ? 'bg-[#fffdf9] border-amber-300 text-[#5c4033]'
            : 'bg-[#24213d] border-pink-500/40 text-[#fff0e8]'
        }`}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          type="button"
          aria-label="Close secret dream modal"
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-stone-500/10 text-current transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center space-y-2 mb-6">
          <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-amber-400 to-pink-500 mx-auto flex items-center justify-center shadow-lg shadow-pink-500/20 animate-pulse">
            <Star className="w-8 h-8 text-white fill-white" />
          </div>

          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-pink-500 font-sans">
            <Sparkles className="w-3.5 h-3.5" />
            Easter Egg Discovered!
          </div>

          <h3 className="font-serif text-2xl sm:text-3xl font-bold">
            Secret Dream Unlocked!
          </h3>
          <p className="text-xs sm:text-sm opacity-80 font-sans max-w-sm mx-auto">
            You tapped the starlight star 5 times. Pip has granted you the rare, classified blueprint:
          </p>
        </div>

        {/* Dream Blueprint Card */}
        <div className="p-4 sm:p-5 rounded-2xl bg-black/5 dark:bg-white/5 border border-amber-400/30 space-y-3 font-sans text-xs">
          <div className="flex items-center justify-between pb-2 border-b border-stone-200/40 dark:border-stone-800/60">
            <span className="font-serif font-bold text-sm flex items-center gap-1.5 text-amber-500">
              <Award className="w-4 h-4" />
              Formula #7: The Golden Cloud Slumber
            </span>
            <span className="opacity-60 text-[10px]">Tier: Honorary Dream Engineer</span>
          </div>

          <div className="space-y-1.5 opacity-85 leading-relaxed">
            <p><strong>Ingredients:</strong></p>
            <ul className="list-disc list-inside space-y-1 pl-1">
              <li>3 pinchfuls of pulverized moonstone dust</li>
              <li>1 warm cup of herbal chamomile steeped under Ursa Major</li>
              <li>A single whisper of the <em>Goodnight World</em> chime</li>
              <li>A fluffy quilt folded at a 45-degree angle</li>
            </ul>
          </div>

          <div className="p-3 rounded-xl bg-amber-400/10 border border-amber-400/20 text-amber-600 dark:text-amber-300 text-[11px] italic">
            "Those who look closely at the stars are never truly alone in the dark." — Pip
          </div>
        </div>

        {/* Action Button */}
        <div className="mt-6 flex justify-center">
          <button
            onClick={onClose}
            type="button"
            className={`px-6 py-2.5 rounded-full font-medium text-sm text-white shadow-md transition-all active:scale-95 ${
              theme === 'day' ? 'bg-[#a34063]' : 'bg-[#e65d96]'
            }`}
          >
            Thank You, Pip! (Keep Dream Safe)
          </button>
        </div>
      </div>
    </div>
  );
};
