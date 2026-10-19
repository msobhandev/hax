import React from 'react';
import { ThemeMode } from '../types';
import { LullabyLab } from './projects/LullabyLab';
import { NightlightCollection } from './projects/NightlightCollection';
import { DreamDeliveryRoutes } from './projects/DreamDeliveryRoutes';
import { Sparkles } from 'lucide-react';

interface ProjectsProps {
  theme: ThemeMode;
  isSoundOn: boolean;
  toggleSound: () => void;
  onRewardStardust?: (amount: number) => void;
}

export const Projects: React.FC<ProjectsProps> = ({
  theme,
  isSoundOn,
  toggleSound,
  onRewardStardust,
}) => {
  return (
    <section id="projects" className="py-12 sm:py-20 px-4 sm:px-6 max-w-7xl mx-auto space-y-12">
      {/* Section Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider font-sans px-3 py-1 rounded-full border border-pink-400/30 bg-pink-500/10 text-pink-500">
          <Sparkles className="w-3.5 h-3.5" />
          Midnight Nursery Inventions
        </div>
        <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-current">
          Interactive Dream Projects
        </h2>
        <p className="text-sm sm:text-base opacity-80 font-sans leading-relaxed">
          Every sleepy creature deserves gentle slumber. Explore Pip's working lullaby synthesizer, glowing nightlights, and celestial delivery routes.
        </p>
      </div>

      {/* Project 1: The Lullaby Lab */}
      <LullabyLab theme={theme} isSoundOn={isSoundOn} toggleSound={toggleSound} />

      {/* Project 2: Nightlight Collection */}
      <NightlightCollection theme={theme} />

      {/* Project 3: Dream Delivery Routes */}
      <DreamDeliveryRoutes theme={theme} onRewardStardust={onRewardStardust} />
    </section>
  );
};
