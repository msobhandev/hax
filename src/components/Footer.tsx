import React from 'react';
import { Heart, Sparkles, Moon, Sun, ArrowUp } from 'lucide-react';
import { ThemeMode } from '../types';
import { sound } from '../utils/soundEngine';

interface FooterProps {
  theme: ThemeMode;
}

export const Footer: React.FC<FooterProps> = ({ theme }) => {
  const scrollToTop = () => {
    sound.playClick(880);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navLinks = [
    { label: 'Home', href: '#home' },
    { label: 'About', href: '#about' },
    { label: 'Projects', href: '#projects' },
    { label: 'Story', href: '#story' },
    { label: 'Guestbook', href: '#guestbook' },
  ];

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    sound.playClick();
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer
      className={`border-t transition-colors duration-500 pt-12 pb-16 px-4 sm:px-6 relative overflow-hidden ${
        theme === 'day'
          ? 'bg-[#fff8f1] border-[#f3c4d3] text-[#5c4033]'
          : 'bg-[#121124] border-purple-900/60 text-[#fff0e8]'
      }`}
    >
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Top Footer Row */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-8 border-b border-stone-200/50 dark:border-stone-800">
          
          {/* Logo & Avatar */}
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full overflow-hidden p-0.5 border-2 border-amber-400 bg-amber-50 shadow-md">
              <img
                src="/assets/pip_avatar_cloud.png"
                alt="Pip logo"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.currentTarget as HTMLElement).style.display = 'none';
                }}
              />
            </div>
            <div>
              <h4 className="font-serif font-bold text-lg leading-tight">
                Pip's Midnight Observatory
              </h4>
              <p className="text-xs opacity-70 font-sans">
                Junior Dream Engineer · Midnight Nursery
              </p>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="flex flex-wrap items-center justify-center gap-6 text-sm font-medium font-sans">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href)}
                className={`transition-colors hover:underline ${
                  theme === 'day' ? 'hover:text-[#a34063]' : 'hover:text-[#e65d96]'
                }`}
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Scroll to Top */}
          <button
            onClick={scrollToTop}
            type="button"
            aria-label="Scroll back to top of observatory"
            className={`p-3 rounded-full border shadow-sm transition-transform hover:scale-105 active:scale-90 ${
              theme === 'day'
                ? 'bg-white hover:bg-stone-50 border-[#f3c4d3] text-[#5c4033]'
                : 'bg-[#24213d] hover:bg-purple-900/60 border-purple-800 text-[#fff0e8]'
            }`}
          >
            <ArrowUp className="w-4 h-4" />
          </button>
        </div>

        {/* Bottom Credits & Copyright */}
        <div className="flex flex-col sm:flex-row items-center justify-between text-xs font-sans opacity-80 gap-4 text-center sm:text-left">
          <div className="space-y-1">
            <p className="flex items-center justify-center sm:justify-start gap-1 font-medium">
              Made with love, starlight, and lots of dreams.
              <Heart className="w-3.5 h-3.5 text-pink-500 fill-pink-500" />
            </p>
            <p>© 2026 Pip · All dreams reserved.</p>
          </div>

          <div className="flex items-center gap-2">
            <span
              className={`px-3 py-1 rounded-full border text-[11px] font-semibold ${
                theme === 'day'
                  ? 'bg-[#fdeedf] border-[#f3c4d3] text-[#a34063]'
                  : 'bg-[#24213d] border-purple-800 text-[#e65d96]'
              }`}
            >
              haX.baby Baby's First Website Hackathon 2026
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
