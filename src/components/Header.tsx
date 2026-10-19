import React, { useState } from 'react';
import { Volume2, VolumeX, Sun, Moon, Star, Menu, X, Sparkles } from 'lucide-react';
import { ThemeMode } from '../types';
import { sound } from '../utils/soundEngine';

interface HeaderProps {
  theme: ThemeMode;
  toggleTheme: () => void;
  isSoundOn: boolean;
  toggleSound: () => void;
  onStarClick: () => void;
  easterEggClicks: number;
}

export const Header: React.FC<HeaderProps> = ({
  theme,
  toggleTheme,
  isSoundOn,
  toggleSound,
  onStarClick,
  easterEggClicks,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
      // It's turning ON
      setTimeout(() => sound.playSparkle(), 50);
    }
  };

  const handleThemeBtn = () => {
    sound.playClick(theme === 'day' ? 440 : 880);
    toggleTheme();
  };

  return (
    <header className="sticky top-3 z-40 px-3 sm:px-6 max-w-7xl mx-auto transition-all duration-300">
      <nav
        aria-label="Main Navigation"
        className={`w-full mx-auto px-4 sm:px-6 py-2.5 sm:py-3 rounded-full transition-all duration-300 shadow-lg border backdrop-blur-md flex items-center justify-between ${
          theme === 'day'
            ? 'bg-[#fff8f1]/90 border-[#f3c4d3] shadow-stone-200/50 text-[#5c4033]'
            : 'bg-[#17172c]/90 border-[#e65d96]/30 shadow-black/40 text-[#fff0e8]'
        }`}
      >
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
                // Fallback to cute icon if image fails
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

        {/* Action Controls Zone */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
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

          {/* Easter Egg Star Button */}
          <button
            onClick={onStarClick}
            type="button"
            aria-label="Starlight Easter Egg"
            title={
              easterEggClicks < 5
                ? `Click for starlight (${5 - easterEggClicks} left for secret dream)`
                : 'Secret dream unlocked!'
            }
            className={`p-2 rounded-full transition-transform active:scale-90 border relative group ${
              theme === 'day'
                ? 'bg-amber-50 text-amber-600 hover:bg-amber-100 border-amber-200'
                : 'bg-yellow-400/10 text-yellow-300 hover:bg-yellow-400/20 border-yellow-400/30'
            }`}
          >
            <Star
              className={`w-4 h-4 transition-transform group-hover:rotate-45 ${
                easterEggClicks > 0 ? 'fill-yellow-400 text-yellow-400' : ''
              }`}
            />
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
  );
};
