import React from 'react';
import { Sparkles, Moon, Compass, Heart, ArrowDown, Eye, Stars } from 'lucide-react';
import { ThemeMode } from '../types';
import { sound } from '../utils/soundEngine';

interface HeroProps {
  theme: ThemeMode;
  isFocusMode: boolean;
  toggleFocusMode: () => void;
  onExploreWork: () => void;
  onMeetPip: () => void;
  onOpenTelescope: () => void;
  stardustCount: number;
}

export const Hero: React.FC<HeroProps> = ({
  theme,
  isFocusMode,
  toggleFocusMode,
  onExploreWork,
  onMeetPip,
  onOpenTelescope,
  stardustCount,
}) => {
  const [reactionMsg, setReactionMsg] = React.useState<string | null>(null);

  const dayReactions = [
    'Zzz... five more minutes of cloud fluff... ☁️',
    'Mmm... dreaming of warm milk & honey 🍯',
    'Snug as a little bug in a quilt... 💤',
    'Tip: Switch to Night Mode to see my telescope in action! ✨',
  ];

  const nightReactions = [
    'Look at that shooting star over Moonlit Lake! ✨',
    'My telescope just found Ursa Somnus! 🔭',
    'Which lullaby shall we play tonight? 🎵',
    'The lanterns are glowing so nicely across the valley. 🌙',
  ];

  const handlePipClick = () => {
    sound.playSleepyCute();
    const list = theme === 'day' ? dayReactions : nightReactions;
    const randomMsg = list[Math.floor(Math.random() * list.length)];
    setReactionMsg(randomMsg);
    setTimeout(() => {
      setReactionMsg(null);
    }, 4000);
  };
  return (
    <section
      id="home"
      className="relative pt-6 sm:pt-10 pb-12 sm:pb-20 px-4 sm:px-6 max-w-7xl mx-auto overflow-hidden transition-all duration-500"
    >
      {/* Background Decorative Starlight & Clouds */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden select-none -z-10">
        <div
          className={`absolute top-12 left-10 w-72 h-72 rounded-full blur-3xl transition-opacity duration-700 ${
            theme === 'day'
              ? 'bg-amber-200/40 opacity-70'
              : 'bg-indigo-600/20 opacity-90'
          }`}
        />
        <div
          className={`absolute bottom-10 right-8 w-80 h-80 rounded-full blur-3xl transition-opacity duration-700 ${
            theme === 'day'
              ? 'bg-pink-200/40 opacity-60'
              : 'bg-purple-700/20 opacity-80'
          }`}
        />
      </div>

      {/* Hero 3-Column / Center Featured Composition */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-6 items-center">
        
        {/* LEFT COLUMN: Badge, Status, Headline, Description, Buttons, Decorative labels */}
        <div
          className={`lg:col-span-4 flex flex-col justify-center space-y-6 transition-all duration-500 ${
            isFocusMode ? 'opacity-40 hover:opacity-90' : 'opacity-100'
          }`}
        >
          {/* Badge & Status */}
          <div className="flex flex-col gap-2.5">
            <div className="flex items-center gap-2">
              <span
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium font-sans border ${
                  theme === 'day'
                    ? 'bg-[#fdeedf] text-[#a34063] border-[#f3c4d3]'
                    : 'bg-[#24213d] text-[#e65d96] border-[#e65d96]/30'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                haX.baby Hackathon 2026
              </span>
            </div>

            <div
              className={`inline-flex items-center gap-2 text-xs font-sans font-medium ${
                theme === 'day' ? 'text-stone-600' : 'text-purple-200/80'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-emerald-400 ring-2 ring-emerald-400/30 animate-pulse" />
              <span>Junior Dream Engineer · On Shift</span>
            </div>
          </div>

          {/* Headline */}
          <h1
            className={`font-serif text-4xl sm:text-5xl lg:text-[3.25rem] font-bold tracking-tight leading-[1.1] ${
              theme === 'day' ? 'text-[#5c4033]' : 'text-[#fff0e8]'
            }`}
          >
            Small baby. <br />
            <span
              className={`italic font-normal ${
                theme === 'day' ? 'text-[#a34063]' : 'text-[#e65d96]'
              }`}
            >
              Big dreams.
            </span>
          </h1>

          {/* Description */}
          <p
            className={`text-base sm:text-lg leading-relaxed font-sans max-w-md ${
              theme === 'day' ? 'text-[#5c4033]/85' : 'text-[#fff0e8]/85'
            }`}
          >
            I create lullabies, nightlights, and dreamy adventures for sleepy little creatures.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={() => {
                sound.playClick(783.99);
                onExploreWork();
              }}
              type="button"
              className={`px-5 py-2.5 rounded-full font-medium text-sm transition-all duration-300 shadow-md hover:shadow-lg active:scale-95 flex items-center gap-2 ${
                theme === 'day'
                  ? 'bg-[#a34063] hover:bg-[#8b3252] text-white shadow-pink-900/15'
                  : 'bg-[#e65d96] hover:bg-[#d44883] text-white shadow-pink-500/20'
              }`}
            >
              <span>Explore My Work</span>
              <ArrowDown className="w-4 h-4 animate-bounce" />
            </button>

            <button
              onClick={() => {
                sound.playClick(659.25);
                onMeetPip();
              }}
              type="button"
              className={`px-5 py-2.5 rounded-full font-medium text-sm transition-all duration-300 border active:scale-95 flex items-center gap-2 ${
                theme === 'day'
                  ? 'border-[#f3c4d3] hover:bg-[#fdeedf] text-[#5c4033]'
                  : 'border-[#e65d96]/40 hover:bg-[#24213d] text-[#fff0e8]'
              }`}
            >
              <span>Meet Pip</span>
              <Heart className="w-3.5 h-3.5 text-pink-400 fill-pink-400/50" />
            </button>
          </div>

          {/* Decorative Feature Labels */}
          <div className="pt-3 border-t border-stone-200/60 dark:border-stone-800/80 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs font-sans opacity-80">
            <span className="flex items-center gap-1.5">
              <span className="text-amber-500">★</span> Cozy Ambience
            </span>
            <span aria-hidden="true" className="opacity-40">·</span>
            <span className="flex items-center gap-1.5">
              <Compass className="w-3.5 h-3.5 text-indigo-400" /> Star Navigation
            </span>
            <span aria-hidden="true" className="opacity-40">·</span>
            <span className="flex items-center gap-1.5">
              <Moon className="w-3.5 h-3.5 text-amber-300" /> Sweet Dreams Guaranteed
            </span>
          </div>
        </div>

        {/* CENTER COLUMN: Large Beautiful Illustration of Pip (Sleeping in Day, Stargazing in Night) */}
        <div className="lg:col-span-5 flex flex-col justify-center items-center relative">
          
          {/* Cute Pip Reaction Bubble */}
          {reactionMsg && (
            <div className="absolute -top-12 z-30 px-4 py-2 rounded-2xl bg-amber-400 text-stone-900 font-medium text-xs shadow-xl border border-amber-300 animate-in fade-in slide-in-from-bottom-2 duration-300 flex items-center gap-1.5 pointer-events-none">
              <Sparkles className="w-3.5 h-3.5 text-stone-900 shrink-0" />
              <span>{reactionMsg}</span>
              <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-amber-400 rotate-45" />
            </div>
          )}

          <div
            className={`relative w-full max-w-md sm:max-w-lg rounded-3xl p-3 sm:p-4 transition-all duration-700 shadow-2xl border ${
              theme === 'day'
                ? 'bg-gradient-to-b from-[#fffdf9] to-[#fdeedf] border-[#f3c4d3] shadow-stone-300/40'
                : 'bg-gradient-to-b from-[#24213d] to-[#17172c] border-[#e65d96]/30 shadow-indigo-950/60 ring-1 ring-pink-500/20'
            } ${isFocusMode ? 'scale-105 ring-4 ring-amber-400/50 shadow-amber-400/20' : ''}`}
          >
            {/* Illustrated Artwork Frame - Clickable for cute Pip reaction */}
            <div
              onClick={handlePipClick}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handlePipClick();
                }
              }}
              title={theme === 'day' ? 'Click to whisper sweet dreams to Pip!' : 'Click to say hello to Pip!'}
              className="relative rounded-2xl overflow-hidden aspect-[4/3] bg-stone-900 group cursor-pointer focus:outline-none"
            >
              <img
                key={theme}
                src={
                  theme === 'day'
                    ? '/assets/images/pip_sleeping_day_mode_1792341233526.jpg'
                    : '/assets/images/hero_pip_observatory_1792338662055.jpg'
                }
                alt={
                  theme === 'day'
                    ? 'Pip peacefully sleeping in a cozy sunlit wooden rocking crib with a warm patchwork quilt'
                    : 'Pip in the cozy Midnight Observatory with telescope, starlight books, and glowing lanterns'
                }
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover transition-all duration-700 group-hover:scale-105 animate-in fade-in"
              />

              {/* Gentle overlay gradient for storybook depth */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />

              {/* Floating Caption / Badge */}
              <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs text-white/95 px-3 py-1.5 rounded-xl backdrop-blur-md bg-black/40 border border-white/10">
                <div className="flex items-center gap-1.5">
                  <Stars className="w-3.5 h-3.5 text-amber-300 animate-spin-slow" />
                  <span className="font-medium font-serif">
                    {theme === 'day' ? 'Cozy Nursery Crib' : 'Observatory Tower #4'}
                  </span>
                </div>
                <span className="text-[11px] opacity-90 font-sans">
                  {theme === 'day' ? '💤 Day Nap · 10:30 AM' : '✨ 9:45 PM Stargazing'}
                </span>
              </div>
            </div>

            {/* Bottom storybook accent caption */}
            <div className="mt-3 px-2 flex items-center justify-between text-xs font-sans">
              <span className={`italic ${theme === 'day' ? 'text-[#5c4033]/80' : 'text-[#fff0e8]/80'}`}>
                {theme === 'day'
                  ? '"Shh... Pip is catching up on sleep after weaving midnight stars."'
                  : '"Every bedtime star has a lullaby waiting inside."'}
              </span>
              <span className="text-amber-500 font-bold">
                {theme === 'day' ? '💤 Pip (Click me!)' : '✨ Pip (Click me!)'}
              </span>
            </div>
          </div>

          {/* Interactive Stargazer Telescope Trigger & Stardust Bank */}
          <div className="w-full max-w-md sm:max-w-lg mt-3 flex items-center justify-between gap-3 px-1">
            <button
              onClick={() => {
                sound.playSparkle();
                onOpenTelescope();
              }}
              type="button"
              className={`flex-1 py-2 px-4 rounded-2xl text-xs font-semibold font-sans transition-all duration-200 border flex items-center justify-center gap-2 active:scale-95 shadow-sm ${
                theme === 'day'
                  ? 'bg-amber-100/80 hover:bg-amber-200/80 text-amber-900 border-amber-300'
                  : 'bg-purple-900/40 hover:bg-purple-900/60 text-amber-300 border-amber-400/40'
              }`}
            >
              <Compass className="w-3.5 h-3.5 text-amber-400 animate-spin-slow" />
              <span>Look Through Telescope</span>
            </button>

            <div
              className={`px-3 py-2 rounded-2xl text-xs font-sans font-medium border flex items-center gap-1.5 shrink-0 ${
                theme === 'day'
                  ? 'bg-white border-[#f3c4d3] text-[#5c4033]'
                  : 'bg-[#24213d] border-purple-800 text-[#fff0e8]'
              }`}
              title="Stardust collected from stargazing & delivering dreams"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>{stardustCount} Stardust</span>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Character Status Card & Functional Focus Mode Toggle */}
        <div
          className={`lg:col-span-3 flex flex-col space-y-4 transition-all duration-500 ${
            isFocusMode ? 'opacity-90 ring-2 ring-amber-400/40 rounded-2xl p-2' : 'opacity-100'
          }`}
        >
          {/* Status Card */}
          <div
            className={`p-5 rounded-2xl border transition-all duration-300 shadow-md ${
              theme === 'day'
                ? 'bg-[#fffdf9] border-[#f3c4d3] text-[#5c4033]'
                : 'bg-[#24213d] border-[#e65d96]/30 text-[#fff0e8]'
            }`}
          >
            <div className="flex items-center justify-between pb-3 border-b border-stone-200/60 dark:border-stone-800">
              <span className="text-xs uppercase tracking-wider font-semibold opacity-70">
                Dream Status
              </span>
              <span
                className={`text-[11px] px-2 py-0.5 rounded-full font-medium border ${
                  theme === 'day'
                    ? 'bg-amber-500/10 text-amber-700 border-amber-400/30'
                    : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                }`}
              >
                {theme === 'day' ? 'Off Shift · Sleeping' : 'Live Shift'}
              </span>
            </div>

            <div className="space-y-3 pt-3 text-xs">
              <div>
                <p className="opacity-60 text-[11px]">
                  {theme === 'day' ? 'Currently Dreaming' : 'Currently Weaving'}
                </p>
                <p className="font-semibold text-sm">
                  {theme === 'day' ? 'Warm Honeyclouds & Sunbeams' : 'Gentle Cloud Dreams'}
                </p>
              </div>

              <div>
                <div className="flex justify-between text-[11px] mb-1">
                  <span className="opacity-60">Sleepiness Gauge</span>
                  <span className="font-semibold text-amber-500">
                    {theme === 'day' ? '100% Deep Sleep' : '84% Cozy'}
                  </span>
                </div>
                <div className="w-full h-2 rounded-full bg-stone-200 dark:bg-stone-800 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-amber-400 to-pink-500 transition-all duration-1000"
                    style={{ width: theme === 'day' ? '100%' : '84%' }}
                  />
                </div>
              </div>

              <div>
                <p className="opacity-60 text-[11px]">Current Location</p>
                <p className="font-medium">
                  {theme === 'day' ? 'Nursery Crib (Warm Patchwork Quilt)' : 'Midnight Observatory 4th Tier'}
                </p>
              </div>

              <div>
                <p className="opacity-60 text-[11px]">Favorite Snack</p>
                <p className="font-medium">
                  {theme === 'day' ? 'Warm Chamomile with Honey' : 'Starberry Cookies & Warm Honey Milk'}
                </p>
              </div>
            </div>

            {/* Functional Focus-Mode Switch */}
            <div className="mt-4 pt-3 border-t border-stone-200/60 dark:border-stone-800">
              <button
                onClick={() => {
                  sound.playClick(isFocusMode ? 523.25 : 783.99);
                  toggleFocusMode();
                }}
                type="button"
                className={`w-full py-2 px-3 rounded-xl text-xs font-medium transition-all duration-200 flex items-center justify-between border ${
                  isFocusMode
                    ? 'bg-amber-400 text-stone-900 border-amber-300 shadow-md font-semibold'
                    : theme === 'day'
                    ? 'bg-[#fdeedf] hover:bg-[#f7dfcb] text-[#5c4033] border-[#f3c4d3]'
                    : 'bg-[#17172c] hover:bg-stone-900 text-[#fff0e8] border-purple-900/60'
                }`}
              >
                <span className="flex items-center gap-1.5">
                  <Eye className="w-3.5 h-3.5" />
                  {isFocusMode ? 'Focus Mode Active' : 'Bedtime Focus Mode'}
                </span>
                <span
                  className={`w-2 h-2 rounded-full ${
                    isFocusMode ? 'bg-stone-900' : 'bg-stone-400'
                  }`}
                />
              </button>
              <p className="text-[10px] opacity-60 mt-1.5 text-center">
                {isFocusMode ? 'Dims non-essentials for restful gazing' : 'Click to dim distractions'}
              </p>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
