import React, { useState, useEffect } from 'react';
import { ThemeMode } from './types';
import { sound } from './utils/soundEngine';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { AboutSection } from './components/AboutSection';
import { Projects } from './components/Projects';
import { StorySection } from './components/StorySection';
import { GuestbookSection } from './components/GuestbookSection';
import { VisitorCounter } from './components/VisitorCounter';
import { Footer } from './components/Footer';
import { SecretDreamModal } from './components/SecretDreamModal';
import { SparkleTrail } from './components/SparkleTrail';
import { TelescopeStargazer } from './components/TelescopeStargazer';
import { NightStarfieldCanvas } from './components/NightStarfieldCanvas';

export default function App() {
  const [theme, setTheme] = useState<ThemeMode>(() => {
    try {
      const saved = localStorage.getItem('pip_theme');
      if (saved === 'day' || saved === 'night') return saved;
    } catch {
      // Ignore
    }
    return 'day';
  });

  const [isSoundOn, setIsSoundOn] = useState(false);
  const [isFocusMode, setIsFocusMode] = useState(false);
  const [easterEggClicks, setEasterEggClicks] = useState(0);
  const [isSecretDreamOpen, setIsSecretDreamOpen] = useState(false);
  const [isTelescopeOpen, setIsTelescopeOpen] = useState(false);
  const [stardustCount, setStardustCount] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('pip_stardust');
      return saved ? parseInt(saved, 10) : 15;
    } catch {
      return 15;
    }
  });

  const rewardStardust = (amount: number) => {
    setStardustCount((prev) => {
      const next = prev + amount;
      try {
        localStorage.setItem('pip_stardust', next.toString());
      } catch {
        // Ignore
      }
      return next;
    });
  };

  // Sync theme with document class & localStorage
  useEffect(() => {
    try {
      localStorage.setItem('pip_theme', theme);
    } catch {
      // Ignore
    }
    if (theme === 'night') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  // Sync soundEngine
  useEffect(() => {
    sound.setSoundEnabled(isSoundOn);
  }, [isSoundOn]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'day' ? 'night' : 'day'));
  };

  const toggleSound = () => {
    setIsSoundOn((prev) => !prev);
  };

  const toggleFocusMode = () => {
    setIsFocusMode((prev) => !prev);
  };

  const handleStarClick = () => {
    sound.playSparkle();
    const nextCount = easterEggClicks + 1;
    setEasterEggClicks(nextCount);
    if (nextCount >= 5) {
      setIsSecretDreamOpen(true);
      setEasterEggClicks(0);
    }
  };

  const scrollToProjects = () => {
    const el = document.getElementById('projects');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToAbout = () => {
    const el = document.getElementById('about');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div
      className={`min-h-screen transition-colors duration-500 selection:bg-pink-400 selection:text-white ${
        theme === 'day'
          ? 'bg-[#fff8f1] text-[#5c4033]'
          : 'bg-[#17172c] text-[#fff0e8]'
      }`}
    >
      {/* Sparkle cursor trail for desktop */}
      <SparkleTrail />

      {/* 3D Interactive Night Mode Starfield moving with cursor */}
      {theme === 'night' && <NightStarfieldCanvas />}

      {/* Secret Dream Easter Egg Modal */}
      <SecretDreamModal
        isOpen={isSecretDreamOpen}
        onClose={() => setIsSecretDreamOpen(false)}
        theme={theme}
      />

      {/* Brass Telescope Stargazer Modal */}
      <TelescopeStargazer
        isOpen={isTelescopeOpen}
        onClose={() => setIsTelescopeOpen(false)}
        theme={theme}
        onRewardStardust={rewardStardust}
      />

      {/* Header Navigation */}
      <Header
        theme={theme}
        toggleTheme={toggleTheme}
        isSoundOn={isSoundOn}
        toggleSound={toggleSound}
        onStarClick={handleStarClick}
        easterEggClicks={easterEggClicks}
      />

      {/* Main Content Area */}
      <main className="space-y-4">
        {/* Hero Section */}
        <Hero
          theme={theme}
          isFocusMode={isFocusMode}
          toggleFocusMode={toggleFocusMode}
          onExploreWork={scrollToProjects}
          onMeetPip={scrollToAbout}
          onOpenTelescope={() => setIsTelescopeOpen(true)}
          stardustCount={stardustCount}
        />

        {/* About Section */}
        <div className={`transition-opacity duration-500 ${isFocusMode ? 'opacity-30' : 'opacity-100'}`}>
          <AboutSection theme={theme} />
        </div>

        {/* Projects Section (Lullaby Lab, Nightlight Collection, Dream Routes) */}
        <div className={`transition-opacity duration-500 ${isFocusMode ? 'scale-[1.01]' : 'opacity-100'}`}>
          <Projects
            theme={theme}
            isSoundOn={isSoundOn}
            toggleSound={toggleSound}
            onRewardStardust={rewardStardust}
          />
        </div>

        {/* Story Section */}
        <div className={`transition-opacity duration-500 ${isFocusMode ? 'opacity-30' : 'opacity-100'}`}>
          <StorySection theme={theme} />
        </div>

        {/* Visitor Counter */}
        <div className={`py-6 px-4 transition-opacity duration-500 ${isFocusMode ? 'opacity-30' : 'opacity-100'}`}>
          <VisitorCounter theme={theme} />
        </div>

        {/* Guestbook Section */}
        <div className={`transition-opacity duration-500 ${isFocusMode ? 'opacity-30' : 'opacity-100'}`}>
          <GuestbookSection theme={theme} />
        </div>
      </main>

      {/* Footer */}
      <Footer theme={theme} />
    </div>
  );
}
