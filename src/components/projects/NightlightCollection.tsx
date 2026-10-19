import React, { useState } from 'react';
import { Star, Heart, Moon, Cloud, Power, SunMedium } from 'lucide-react';
import { ThemeMode, LanternItem } from '../../types';
import { sound } from '../../utils/soundEngine';

interface NightlightCollectionProps {
  theme: ThemeMode;
}

const INITIAL_LANTERNS: LanternItem[] = [
  {
    id: 'star',
    name: 'Star Lantern',
    glowColor: 'amber',
    description: 'Forged from fallen starlight to guide sleepy thoughts safely back to bed.',
    isOn: true,
    intensity: 85,
  },
  {
    id: 'heart',
    name: 'Heart Lantern',
    glowColor: 'rose',
    description: 'Filled with warm honey-amber warmth to comfort little creatures before sleep.',
    isOn: true,
    intensity: 90,
  },
  {
    id: 'moon',
    name: 'Moon Lantern',
    glowColor: 'sky',
    description: 'Captures cool crescent moonbeams for soothing worried nursery dreams.',
    isOn: true,
    intensity: 75,
  },
  {
    id: 'cloud',
    name: 'Cloud Lantern',
    glowColor: 'violet',
    description: 'A soft floating mist lantern that creates gentle shadows across the ceiling.',
    isOn: false,
    intensity: 60,
  },
];

export const NightlightCollection: React.FC<NightlightCollectionProps> = ({ theme }) => {
  const [lanterns, setLanterns] = useState<LanternItem[]>(INITIAL_LANTERNS);
  const [globalBrightness, setGlobalBrightness] = useState<number>(85);

  const glowingCount = lanterns.filter((l) => l.isOn).length;

  const toggleLantern = (id: string) => {
    sound.playSparkle();
    setLanterns((prev) =>
      prev.map((item) => (item.id === id ? { ...item, isOn: !item.isOn } : item))
    );
  };

  const handleAllToggle = (state: boolean) => {
    sound.playClick(state ? 783.99 : 440);
    setLanterns((prev) => prev.map((item) => ({ ...item, isOn: state })));
  };

  const renderLanternIcon = (id: string, isOn: boolean) => {
    const iconClass = `w-7 h-7 sm:w-8 sm:h-8 transition-transform duration-300 ${
      isOn ? 'scale-110 drop-shadow-md' : 'opacity-40 scale-90'
    }`;

    switch (id) {
      case 'star':
        return <Star className={`${iconClass} text-amber-400 fill-amber-400`} />;
      case 'heart':
        return <Heart className={`${iconClass} text-rose-400 fill-rose-400`} />;
      case 'moon':
        return <Moon className={`${iconClass} text-sky-300 fill-sky-300`} />;
      case 'cloud':
        return <Cloud className={`${iconClass} text-purple-300 fill-purple-300`} />;
      default:
        return <Star className={iconClass} />;
    }
  };

  const getGlowStyles = (color: string, isOn: boolean, intensity: number) => {
    if (!isOn) return '';
    const alpha = (intensity / 100) * (globalBrightness / 100);

    switch (color) {
      case 'amber':
        return `shadow-[0_0_35px_rgba(251,191,36,${alpha.toFixed(2)})] border-amber-400 ring-2 ring-amber-400/30`;
      case 'rose':
        return `shadow-[0_0_35px_rgba(244,63,94,${alpha.toFixed(2)})] border-rose-400 ring-2 ring-rose-400/30`;
      case 'sky':
        return `shadow-[0_0_35px_rgba(56,189,248,${alpha.toFixed(2)})] border-sky-400 ring-2 ring-sky-400/30`;
      case 'violet':
        return `shadow-[0_0_35px_rgba(168,85,247,${alpha.toFixed(2)})] border-purple-400 ring-2 ring-purple-400/30`;
      default:
        return '';
    }
  };

  return (
    <div
      className={`rounded-3xl p-6 sm:p-8 border shadow-xl transition-all duration-300 ${
        theme === 'day'
          ? 'bg-[#fffdf9] border-[#f3c4d3] text-[#5c4033]'
          : 'bg-[#24213d] border-[#e65d96]/30 text-[#fff0e8]'
      }`}
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-stone-200/60 dark:border-stone-800 gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span
              className={`text-xs font-bold tracking-wider uppercase font-sans ${
                theme === 'day' ? 'text-[#a34063]' : 'text-[#e65d96]'
              }`}
            >
              Project 02 · Illuminated Bedtime
            </span>
            <span className="text-xs opacity-50">·</span>
            <span className="text-xs font-sans opacity-70">Interactive Lanterns</span>
          </div>
          <h3 className="font-serif text-2xl sm:text-3xl font-bold">
            Nightlight Collection
          </h3>
        </div>

        {/* Live Status Counter & Master Controls */}
        <div className="flex items-center gap-2 flex-wrap">
          <span
            className={`text-xs px-3 py-1.5 rounded-full font-sans border font-medium ${
              glowingCount > 0
                ? 'bg-amber-400/15 text-amber-500 border-amber-400/30'
                : 'bg-stone-500/10 text-stone-500 border-stone-500/20'
            }`}
          >
            {glowingCount} of {lanterns.length} lanterns glowing
          </span>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => handleAllToggle(true)}
              type="button"
              className="text-xs px-3 py-1.5 rounded-full font-medium transition-colors bg-amber-400/20 hover:bg-amber-400/30 text-amber-600 dark:text-amber-300 border border-amber-400/30"
            >
              Turn All On
            </button>
            <button
              onClick={() => handleAllToggle(false)}
              type="button"
              className="text-xs px-3 py-1.5 rounded-full font-medium transition-colors bg-stone-500/10 hover:bg-stone-500/20 text-current border border-stone-400/30"
            >
              Turn All Off
            </button>
          </div>
        </div>
      </div>

      {/* Intro info bar & Brightness Slider */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between py-4 border-b border-stone-200/40 dark:border-stone-800/60 text-xs gap-3">
        <p className="opacity-80 font-sans max-w-lg">
          Click on any lantern to ignite or tuck it into sleep. Each lantern produces gentle, flicker-free starlight tuned for nursery resting hours.
        </p>

        <div className="flex items-center gap-2 shrink-0">
          <SunMedium className="w-4 h-4 opacity-70 text-amber-400" />
          <span className="opacity-70 font-sans">Glow Level:</span>
          <input
            type="range"
            min={30}
            max={100}
            value={globalBrightness}
            onChange={(e) => setGlobalBrightness(Number(e.target.value))}
            aria-label="Adjust nursery starlight brightness"
            className="w-24 h-1.5 rounded-lg appearance-none cursor-pointer accent-amber-400 bg-stone-200 dark:bg-stone-700"
          />
          <span className="font-mono text-[11px] w-8">{globalBrightness}%</span>
        </div>
      </div>

      {/* The 4 Lantern Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 pt-6">
        {lanterns.map((lantern) => {
          const glowStyle = getGlowStyles(lantern.glowColor, lantern.isOn, lantern.intensity);

          return (
            <div
              key={lantern.id}
              onClick={() => toggleLantern(lantern.id)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  toggleLantern(lantern.id);
                }
              }}
              className={`p-5 rounded-2xl border transition-all duration-500 cursor-pointer text-center flex flex-col justify-between items-center group relative overflow-hidden select-none ${
                lantern.isOn
                  ? theme === 'day'
                    ? 'bg-amber-50/70 border-amber-300'
                    : 'bg-[#17172c] border-purple-800'
                  : theme === 'day'
                  ? 'bg-stone-100/50 border-stone-200 opacity-60 hover:opacity-85'
                  : 'bg-stone-900/40 border-stone-800 opacity-50 hover:opacity-80'
              } ${glowStyle}`}
            >
              {/* Top Status & Switch */}
              <div className="w-full flex items-center justify-between text-[11px] mb-4">
                <span className="opacity-60 font-sans capitalize">{lantern.id} Mode</span>
                <span
                  className={`px-2 py-0.5 rounded-full font-bold uppercase text-[9px] tracking-wider transition-colors ${
                    lantern.isOn
                      ? 'bg-amber-400/20 text-amber-500'
                      : 'bg-stone-500/20 text-stone-400'
                  }`}
                >
                  {lantern.isOn ? 'Glowing' : 'Resting'}
                </span>
              </div>

              {/* Lantern Visual Housing with Glow Aura */}
              <div className="relative my-3 flex items-center justify-center">
                {/* Glowing halo behind */}
                {lantern.isOn && (
                  <div
                    className={`absolute inset-0 rounded-full blur-xl scale-150 transition-opacity duration-500 ${
                      lantern.glowColor === 'amber'
                        ? 'bg-amber-400/40'
                        : lantern.glowColor === 'rose'
                        ? 'bg-rose-400/40'
                        : lantern.glowColor === 'sky'
                        ? 'bg-sky-400/40'
                        : 'bg-purple-400/40'
                    }`}
                  />
                )}

                {/* Lantern Physical Housing Shape */}
                <div
                  className={`relative w-20 h-20 rounded-2xl border-2 flex items-center justify-center transition-all duration-300 shadow-md ${
                    lantern.isOn
                      ? 'bg-white/90 dark:bg-stone-800/90 border-amber-300/80 scale-105'
                      : 'bg-stone-200/50 dark:bg-stone-800/40 border-stone-400/30'
                  }`}
                >
                  {renderLanternIcon(lantern.id, lantern.isOn)}
                </div>
              </div>

              {/* Lantern Name & Lore */}
              <div className="mt-2 space-y-1">
                <h4 className="font-serif font-bold text-lg leading-tight group-hover:text-amber-500 transition-colors">
                  {lantern.name}
                </h4>
                <p className="text-xs opacity-75 font-sans leading-relaxed line-clamp-3">
                  {lantern.description}
                </p>
              </div>

              {/* Toggle Action Affordance */}
              <div className="mt-4 pt-3 border-t border-stone-200/50 dark:border-stone-800/60 w-full flex items-center justify-center gap-1.5 text-xs font-medium">
                <Power className={`w-3.5 h-3.5 ${lantern.isOn ? 'text-amber-500' : 'opacity-40'}`} />
                <span className={lantern.isOn ? 'text-amber-500' : 'opacity-60'}>
                  {lantern.isOn ? 'Click to Dim' : 'Click to Light'}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
