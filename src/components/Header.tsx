import React, { useState, useEffect, useRef } from 'react';
import {
  Volume2,
  VolumeX,
  Sun,
  Moon,
  Star,
  Menu,
  X,
  Sparkles,
  Award,
  ChevronRight
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { ThemeMode } from '../types';
import { sound } from '../utils/soundEngine';

interface HeaderProps {
  theme: ThemeMode;
  toggleTheme: () => void;
  isSoundOn: boolean;
  toggleSound: () => void;
  onStarClick: () => void;
  easterEggClicks: number;
  stardustCount?: number;
  rewardStardust?: (amount: number) => void;
}

interface StardustLevel {
  level: number;
  title: string;
  min: number;
  max: number;
  perk: string;
}

const STARDUST_LEVELS: StardustLevel[] = [
  { level: 1, title: 'Dream Novice', min: 0, max: 30, perk: 'Nursery Stargazing & Audio Lab' },
  { level: 2, title: 'Starlight Apprentice', min: 30, max: 75, perk: 'Lullaby Harmonic Chimes' },
  { level: 3, title: 'Celestial Navigator', min: 75, max: 140, perk: 'Delivery Route Fast Orbit' },
  { level: 4, title: 'Master Dream Engineer', min: 140, max: 240, perk: 'Nebula Resonance Shield' },
  { level: 5, title: 'Cosmic Guardian', min: 240, max: 400, perk: 'Midnight Sanctuary Blessing' },
  { level: 6, title: 'Infinite Dream Weaver', min: 400, max: 1000, perk: 'Eternal Slumber Constellation' },
];

function getStardustLevel(count: number) {
  let current = STARDUST_LEVELS[0];
  for (let i = STARDUST_LEVELS.length - 1; i >= 0; i--) {
    if (count >= STARDUST_LEVELS[i].min) {
      current = STARDUST_LEVELS[i];
      break;
    }
  }
  const next = STARDUST_LEVELS.find((l) => l.level === current.level + 1) || null;
  const range = (next ? next.min : current.max) - current.min;
  const currentInRange = Math.max(0, count - current.min);
  const progress = Math.min(100, Math.max(0, Math.round((currentInRange / range) * 100)));
  return { current, next, progress };
}

export const Header: React.FC<HeaderProps> = ({
  theme,
  toggleTheme,
  isSoundOn,
  toggleSound,
  onStarClick,
  easterEggClicks,
  stardustCount = 15,
  rewardStardust,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [isLevelPopoverOpen, setIsLevelPopoverOpen] = useState(false);
  const [floatingParticles, setFloatingParticles] = useState<{ id: number; text: string; x: number; y: number }[]>([]);
  const [isStarBouncing, setIsStarBouncing] = useState(false);

  // Level-up notification state
  const [levelUpModal, setLevelUpModal] = useState<{
    level: number;
    title: string;
    perk: string;
  } | null>(null);

  const lastScrollYRef = useRef(0);
  const prevLevelRef = useRef<number>(getStardustLevel(stardustCount).current.level);

  const levelInfo = getStardustLevel(stardustCount);

  // Detect Level Up and trigger celebration
  useEffect(() => {
    const currentLvl = levelInfo.current.level;
    if (currentLvl > prevLevelRef.current) {
      setLevelUpModal({
        level: currentLvl,
        title: levelInfo.current.title,
        perk: levelInfo.current.perk,
      });

      // Triumphant chime
      sound.playEasterEggChime();

      // Confetti burst
      try {
        confetti({
          particleCount: 110,
          spread: 80,
          origin: { y: 0.18 },
          colors: ['#fbbf24', '#f59e0b', '#ec4899', '#8b5cf6', '#38bdf8', '#34d399'],
          ticks: 220,
        });
      } catch {
        // Ignore
      }
    }
    prevLevelRef.current = currentLvl;
  }, [stardustCount, levelInfo.current.level]);

  // Scroll down hide behavior
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY <= 20) {
        setIsVisible(true);
      } else if (currentScrollY > lastScrollYRef.current && currentScrollY > 40) {
        setIsVisible(false);
        setMobileMenuOpen(false);
        setIsLevelPopoverOpen(false);
      } else if (currentScrollY < lastScrollYRef.current - 5) {
        setIsVisible(true);
      }

      lastScrollYRef.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Home', href: '#home' },
    { label: 'About', href: '#about' },
    { label: 'Projects', href: '#projects' },
    { label: 'Story', href: '#story' },
    { label: 'Guestbook', href: '#guestbook' },
  ];

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    sound.playClick(659.25);
    setMobileMenuOpen(false);
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSoundBtn = () => {
    toggleSound();
    if (!isSoundOn) {
      setTimeout(() => sound.playSparkle(), 50);
    }
  };

  const handleThemeBtn = () => {
    sound.playClick(theme === 'day' ? 440 : 880);
    toggleTheme();
  };

  const handleStarRewardClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    // Satisfying star squish animation
    setIsStarBouncing(true);
    setTimeout(() => setIsStarBouncing(false), 300);

    // Floating particle text "+10 ✨"
    const rect = e.currentTarget.getBoundingClientRect();
    const newId = Date.now() + Math.random();
    setFloatingParticles((prev) => [
      ...prev,
      { id: newId, text: '+10 ✨', x: rect.left + rect.width / 2, y: rect.top - 10 },
    ]);

    setTimeout(() => {
      setFloatingParticles((prev) => prev.filter((p) => p.id !== newId));
    }, 1000);

    // Trigger star click handler
    onStarClick();
  };

  return (
    <>
      {/* Floating Stardust particles when user clicks Star */}
      {floatingParticles.map((particle) => (
        <div
          key={particle.id}
          className="fixed pointer-events-none z-50 font-bold text-xs sm:text-sm text-amber-300 drop-shadow-[0_0_8px_rgba(251,191,36,0.9)] animate-out fade-out slide-out-to-top-8 duration-1000"
          style={{ left: particle.x - 20, top: particle.y }}
        >
          {particle.text}
        </div>
      ))}

      {/* Level-Up Celebration Modal */}
      {levelUpModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div
            className={`max-w-md w-full rounded-3xl p-6 sm:p-8 border shadow-2xl relative text-center space-y-4 animate-in zoom-in-95 duration-300 ${
              theme === 'day'
                ? 'bg-gradient-to-b from-[#fffaf4] to-[#fdeedf] border-[#f3c4d3] text-[#5c4033]'
                : 'bg-gradient-to-b from-[#24213d] to-[#17172c] border-amber-400/40 text-[#fff0e8]'
            }`}
          >
            {/* Glowing Medal / Star Icon */}
            <div className="relative mx-auto w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-400 to-pink-500 flex items-center justify-center shadow-lg shadow-amber-500/30 animate-bounce">
              <Award className="w-8 h-8 text-white" />
              <Sparkles className="w-5 h-5 text-amber-200 absolute -top-2 -right-2 animate-spin-slow" />
            </div>

            <div>
              <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-amber-400/20 text-amber-500 border border-amber-400/30">
                🎉 Level Up!
              </span>
              <h3 className="font-serif text-2xl sm:text-3xl font-bold mt-2">
                Level {levelUpModal.level}: {levelUpModal.title}
              </h3>
              <p className="text-xs sm:text-sm opacity-80 mt-1 font-sans">
                Congratulations! Pip is cheering for your dream engineering milestones.
              </p>
            </div>

            {/* Unlocked Perk Card */}
            <div
              className={`p-3.5 rounded-2xl border text-left text-xs font-sans space-y-1 ${
                theme === 'day'
                  ? 'bg-white/80 border-[#f3c4d3]'
                  : 'bg-black/30 border-white/10 text-white'
              }`}
            >
              <div className="flex items-center gap-1.5 font-bold text-amber-400">
                <Sparkles className="w-3.5 h-3.5" /> Unlocked Dream Clearance
              </div>
              <p className="opacity-75">{levelUpModal.perk}</p>
            </div>

            <button
              onClick={() => {
                sound.playClick(700);
                setLevelUpModal(null);
              }}
              type="button"
              className="w-full py-3 rounded-2xl font-bold text-sm text-stone-950 bg-gradient-to-r from-amber-300 via-amber-400 to-pink-400 hover:from-amber-400 hover:to-pink-500 shadow-lg shadow-amber-500/20 active:scale-95 transition-all"
            >
              Claim Stardust Badge & Continue ✨
            </button>
          </div>
        </div>
      )}

      {/* Main Header Container */}
      <header
        className={`sticky top-3 z-40 px-3 sm:px-6 max-w-7xl mx-auto transition-all duration-300 ease-in-out ${
          isVisible
            ? 'translate-y-0 opacity-100'
            : '-translate-y-28 opacity-0 pointer-events-none'
        }`}
      >
        <nav
          aria-label="Main Navigation"
          className={`w-full mx-auto px-4 sm:px-6 py-2 sm:py-2.5 rounded-full transition-all duration-300 shadow-lg border backdrop-blur-md flex items-center justify-between relative overflow-hidden ${
            isVisible
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 -translate-y-4 pointer-events-none invisible'
          } ${
            theme === 'day'
              ? 'bg-[#fff8f1]/90 border-[#f3c4d3] shadow-stone-200/50 text-[#5c4033]'
              : 'bg-[#17172c]/90 border-[#e65d96]/30 shadow-black/40 text-[#fff0e8]'
          }`}
        >
          {/* Ambient Progress Underline: fills up along bottom border of nav */}
          <div className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-black/5 dark:bg-white/5 pointer-events-none">
            <div
              className="h-full bg-gradient-to-r from-amber-400 via-pink-400 to-indigo-400 transition-all duration-500 ease-out relative"
              style={{ width: `${levelInfo.progress}%` }}
            >
              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-amber-300 shadow-[0_0_6px_#fbbf24]" />
            </div>
          </div>

          {/* Brand Zone */}
          <a
            href="#home"
            onClick={(e) => handleNavClick(e, '#home')}
            className="flex items-center gap-2.5 sm:gap-3 group shrink-0"
          >
            <div className="relative w-9 h-9 sm:w-11 sm:h-11 rounded-full overflow-hidden p-0.5 border-2 transition-transform duration-300 group-hover:scale-105 border-amber-400/80 bg-amber-50">
              <img
                src="/assets/pip_avatar_cloud.png"
                alt="Pip the baby skull avatar"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.currentTarget as HTMLElement).style.display = 'none';
                }}
              />
            </div>
            <div className="flex flex-col">
              <span className="font-serif font-bold text-sm sm:text-base tracking-tight leading-tight whitespace-nowrap">
                Pip's Midnight Observatory
              </span>
              <span className="text-[10px] tracking-wide uppercase opacity-75 font-sans hidden sm:inline">
                Junior Dream Engineer
              </span>
            </div>
          </a>

          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex items-center gap-6 font-medium text-sm">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href)}
                className={`transition-colors py-1 relative whitespace-nowrap group hover:opacity-100 ${
                  theme === 'day'
                    ? 'text-[#5c4033]/80 hover:text-[#a34063]'
                    : 'text-[#fff0e8]/80 hover:text-[#e65d96]'
                }`}
              >
                {link.label}
                <span
                  className={`absolute bottom-0 left-0 w-0 h-0.5 rounded-full transition-all duration-300 group-hover:w-full ${
                    theme === 'day' ? 'bg-[#a34063]' : 'bg-[#e65d96]'
                  }`}
                />
              </a>
            ))}
          </div>

          {/* Stardust Progress Bar & Action Controls Zone */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            
            {/* Visual Stardust Progress Bar Pill */}
            <div className="relative">
              <button
                onClick={() => {
                  sound.playClick(600);
                  setIsLevelPopoverOpen(!isLevelPopoverOpen);
                }}
                type="button"
                aria-label="View Stardust Level Progress"
                title={`Level ${levelInfo.current.level}: ${levelInfo.current.title} (${stardustCount} Stardust · ${levelInfo.progress}% to next level)`}
                className={`px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full border flex items-center gap-2 transition-all duration-200 group hover:scale-[1.02] shadow-sm ${
                  theme === 'day'
                    ? 'bg-amber-50/90 border-amber-300/80 text-amber-900 shadow-amber-900/5'
                    : 'bg-[#252243]/90 border-amber-400/30 text-amber-200 shadow-black/20'
                }`}
              >
                {/* Star Icon with Shimmer */}
                <div className="flex items-center gap-1 font-bold text-xs">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400 group-hover:rotate-12 transition-transform" />
                  <span className="font-mono text-[11px] sm:text-xs tabular-nums font-semibold">
                    {stardustCount}
                  </span>
                </div>

                {/* Progress Track */}
                <div className="hidden xs:flex flex-col gap-0.5 items-start">
                  <div className="w-14 sm:w-20 h-1.5 bg-black/10 dark:bg-white/15 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-amber-400 via-pink-400 to-indigo-400 rounded-full transition-all duration-500 ease-out"
                      style={{ width: `${levelInfo.progress}%` }}
                    />
                  </div>
                </div>

                {/* Level Badge */}
                <span className="text-[10px] font-sans px-1.5 py-0.2 rounded-md font-semibold bg-amber-400/20 text-amber-600 dark:text-amber-300 whitespace-nowrap">
                  Lvl {levelInfo.current.level}
                </span>
              </button>

              {/* Stardust Progress Details Dropdown Popover */}
              {isLevelPopoverOpen && (
                <div
                  className={`absolute right-0 top-full mt-2 w-64 p-4 rounded-2xl border shadow-xl z-30 space-y-3 animate-in fade-in zoom-in-95 ${
                    theme === 'day'
                      ? 'bg-white border-[#f3c4d3] text-[#5c4033]'
                      : 'bg-[#1e1c38] border-white/15 text-white'
                  }`}
                >
                  <div className="flex items-center justify-between border-b pb-2 border-black/10 dark:border-white/10">
                    <div className="flex items-center gap-1.5 font-bold text-xs">
                      <Award className="w-4 h-4 text-amber-400" />
                      <span>{levelInfo.current.title}</span>
                    </div>
                    <span className="text-[10px] font-mono opacity-70">
                      Level {levelInfo.current.level}
                    </span>
                  </div>

                  {/* Level Progress Slider Details */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-[11px] opacity-75 font-sans">
                      <span>Progress to {levelInfo.next?.title || 'Max Level'}</span>
                      <span className="font-mono font-bold">{levelInfo.progress}%</span>
                    </div>
                    <div className="w-full h-2 bg-stone-200 dark:bg-white/10 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-amber-400 via-pink-400 to-indigo-400 rounded-full transition-all duration-500"
                        style={{ width: `${levelInfo.progress}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-[10px] opacity-60 font-mono">
                      <span>{stardustCount} ✨</span>
                      <span>{levelInfo.next ? `${levelInfo.next.min} ✨` : 'MAX'}</span>
                    </div>
                  </div>

                  {/* Stardust Reward Tip */}
                  <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-[11px] font-sans flex items-start gap-2">
                    <Star className="w-4 h-4 text-amber-400 shrink-0 mt-0.5 fill-amber-400" />
                    <p className="opacity-90 leading-tight">
                      <strong>Tip:</strong> Click the <span className="text-amber-500 font-semibold">⭐ Star button</span> in the header to gather <strong>+10 Stardust</strong> anytime!
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Sound Toggle */}
            <button
              onClick={handleSoundBtn}
              type="button"
              aria-label={isSoundOn ? 'Mute soothing audio' : 'Unmute soothing audio'}
              title={isSoundOn ? 'Sound is ON (gentle music & chimes)' : 'Sound is OFF (click to enable)'}
              className={`p-2 rounded-full transition-all duration-200 border relative ${
                isSoundOn
                  ? theme === 'day'
                    ? 'bg-amber-100 text-amber-800 border-amber-300 shadow-sm'
                    : 'bg-amber-500/20 text-amber-300 border-amber-400/40 shadow-sm shadow-amber-500/20'
                  : theme === 'day'
                  ? 'bg-white/70 hover:bg-white text-stone-600 border-stone-200'
                  : 'bg-[#24213d]/80 hover:bg-[#24213d] text-stone-300 border-purple-900/50'
              }`}
            >
              {isSoundOn ? (
                <Volume2 className="w-4 h-4 animate-pulse" />
              ) : (
                <VolumeX className="w-4 h-4 opacity-60" />
              )}
            </button>

            {/* Day / Night Theme Toggle */}
            <button
              onClick={handleThemeBtn}
              type="button"
              aria-label={`Switch to ${theme === 'day' ? 'Night' : 'Day'} mode`}
              title={`Switch to ${theme === 'day' ? 'Night' : 'Day'} mode`}
              className={`p-2 rounded-full transition-all duration-200 border ${
                theme === 'day'
                  ? 'bg-[#fdeedf] text-amber-700 hover:bg-amber-100 border-[#f3c4d3]'
                  : 'bg-[#24213d] text-amber-300 hover:bg-purple-900/60 border-purple-800'
              }`}
            >
              {theme === 'day' ? (
                <Moon className="w-4 h-4 text-purple-700" />
              ) : (
                <Sun className="w-4 h-4 text-amber-300 animate-spin-slow" />
              )}
            </button>

            {/* Easter Egg & Stardust Reward Star Button */}
            <button
              onClick={handleStarRewardClick}
              type="button"
              aria-label="Collect Stardust Reward"
              title="Click to gather +10 Stardust! (5 clicks unlock secret dream)"
              className={`p-2 rounded-full transition-all duration-200 border relative group active:scale-90 ${
                isStarBouncing ? 'scale-125 ring-2 ring-amber-400' : ''
              } ${
                theme === 'day'
                  ? 'bg-amber-50 text-amber-600 hover:bg-amber-100 border-amber-300 shadow-sm'
                  : 'bg-yellow-400/15 text-yellow-300 hover:bg-yellow-400/25 border-yellow-400/40 shadow-amber-500/10'
              }`}
            >
              <Star
                className={`w-4 h-4 transition-transform group-hover:rotate-45 fill-yellow-400 text-yellow-400 drop-shadow`}
              />
              
              {/* Easter egg counter badge */}
              {easterEggClicks > 0 && easterEggClicks < 5 && (
                <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-pink-500 text-white rounded-full text-[9px] font-bold flex items-center justify-center">
                  {easterEggClicks}
                </span>
              )}
            </button>

            {/* Mobile Menu Hamburger */}
            <button
              onClick={() => {
                sound.playClick();
                setMobileMenuOpen(!mobileMenuOpen);
              }}
              type="button"
              aria-label="Toggle mobile menu"
              className="lg:hidden p-2 rounded-full text-current hover:opacity-80"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </nav>

        {/* Mobile Menu Dropdown */}
        {mobileMenuOpen && (
          <div
            className={`lg:hidden mt-2 p-4 rounded-2xl shadow-xl border backdrop-blur-xl animate-in fade-in slide-in-from-top-2 duration-200 ${
              theme === 'day'
                ? 'bg-[#fff8f1]/95 border-[#f3c4d3] text-[#5c4033]'
                : 'bg-[#17172c]/95 border-[#e65d96]/30 text-[#fff0e8]'
            }`}
          >
            <div className="flex flex-col gap-2.5">
              {/* Mobile Stardust Progress Card */}
              <div className="p-3 rounded-xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 space-y-1.5">
                <div className="flex items-center justify-between text-xs font-semibold">
                  <span className="flex items-center gap-1 text-amber-400">
                    <Star className="w-3.5 h-3.5 fill-amber-400" /> {stardustCount} Stardust
                  </span>
                  <span>Lvl {levelInfo.current.level}: {levelInfo.current.title}</span>
                </div>
                <div className="w-full h-1.5 bg-black/10 dark:bg-white/10 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-amber-400 via-pink-400 to-indigo-400 rounded-full"
                    style={{ width: `${levelInfo.progress}%` }}
                  />
                </div>
              </div>

              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.href)}
                  className={`px-3 py-2 rounded-xl text-sm font-medium transition-colors ${
                    theme === 'day'
                      ? 'hover:bg-[#fdeedf] text-[#5c4033]'
                      : 'hover:bg-[#24213d] text-[#fff0e8]'
                  }`}
                >
                  {link.label}
                </a>
              ))}
              
              <div className="pt-2 border-t border-stone-200/50 dark:border-stone-700/50 flex items-center justify-between text-xs opacity-80 px-1">
                <span>haX.baby Hackathon 2026</span>
                <span className="flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-amber-400" /> Pip's Nursery
                </span>
              </div>
            </div>
          </div>
        )}
      </header>
    </>
  );
};
