import React from 'react';
import { Heart, Sparkles, Star, Moon, Compass, Coffee, Feather, ShieldCheck } from 'lucide-react';
import { ThemeMode } from '../types';

interface AboutSectionProps {
  theme: ThemeMode;
}

export const AboutSection: React.FC<AboutSectionProps> = ({ theme }) => {
  const skills = [
    { name: 'Lullaby Composition', level: 98, icon: Star, desc: 'Tuning gentle frequencies to soothe bedtime worries.' },
    { name: 'Star Weaving', level: 95, icon: Sparkles, desc: 'Spinning starlight rays into warm bedtime blankets.' },
    { name: 'Lantern Crafting', level: 92, icon: Moon, desc: 'Forging flicker-free ambient lights for nursery corners.' },
    { name: 'Dream Routing', level: 96, icon: Compass, desc: 'Plotting smooth winds across mountain and forest paths.' },
  ];

  const favoriteThings = [
    { name: 'Warm Milk with Honey', icon: Coffee, desc: 'Best served in a ceramic mug at 8:30 PM' },
    { name: 'Constellation Maps', icon: Compass, desc: 'Tracing Ursa Minor and the Sleepy Lamb' },
    { name: 'Fluffy Cumulus Clouds', icon: Feather, desc: 'Harvested fresh for pillow-stuffing' },
    { name: 'Bedtime Lullabies', icon: Star, desc: 'Played on an antique clockwork music box' },
  ];

  return (
    <section id="about" className="py-12 sm:py-20 px-4 sm:px-6 max-w-7xl mx-auto">
      {/* Section Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3 mb-12">
        <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider font-sans px-3 py-1 rounded-full border border-pink-400/30 bg-pink-500/10 text-pink-500">
          <Heart className="w-3.5 h-3.5 fill-pink-500/40" />
          Meet the Dream Engineer
        </div>
        <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-current">
          About Little Pip
        </h2>
        <p className="text-sm sm:text-base opacity-80 font-sans leading-relaxed">
          Get to know the gentle soul behind the Midnight Observatory's sweetest lullabies and warmest nightlights.
        </p>
      </div>

      {/* Main Grid: Portrait & Bio Split */}
      <div
        className={`rounded-3xl p-6 sm:p-10 border shadow-xl transition-all duration-300 ${
          theme === 'day'
            ? 'bg-[#fffdf9] border-[#f3c4d3] text-[#5c4033]'
            : 'bg-[#24213d] border-[#e65d96]/30 text-[#fff0e8]'
        }`}
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Portrait Column */}
          <div className="lg:col-span-5 flex flex-col items-center">
            <div
              className={`relative w-full max-w-xs sm:max-w-sm rounded-3xl p-3 sm:p-4 border-2 shadow-2xl transition-transform duration-500 hover:scale-[1.02] ${
                theme === 'day'
                  ? 'bg-gradient-to-b from-[#fff8f1] to-[#fdeedf] border-[#f3c4d3]'
                  : 'bg-gradient-to-b from-[#1e1b38] to-[#121124] border-purple-800'
              }`}
            >
              <div className="relative rounded-2xl overflow-hidden aspect-[4/5] bg-stone-900 border border-amber-300/30">
                <img
                  src="/assets/pip_portrait.png"
                  alt="Pip official portrait: cute sleepy skull baby with glowing amber eyes and starry nightcap"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.currentTarget as HTMLElement).style.display = 'none';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
                
                <div className="absolute bottom-3 left-3 right-3 text-center text-white/95 text-xs font-serif italic py-1 px-3 rounded-xl bg-black/40 backdrop-blur-md border border-white/10">
                  Pip · Junior Dream Engineer
                </div>
              </div>

              {/* Character Details Pill Bar */}
              <div className="mt-4 grid grid-cols-2 gap-2 text-xs font-sans text-center">
                <div className="p-2 rounded-xl bg-black/5 dark:bg-white/5 border border-stone-200/50 dark:border-stone-800">
                  <span className="opacity-60 block text-[10px]">Species</span>
                  <span className="font-semibold text-pink-500">Sleepy Skull Baby</span>
                </div>
                <div className="p-2 rounded-xl bg-black/5 dark:bg-white/5 border border-stone-200/50 dark:border-stone-800">
                  <span className="opacity-60 block text-[10px]">Station</span>
                  <span className="font-semibold text-amber-500">Midnight Nursery</span>
                </div>
              </div>
            </div>
          </div>

          {/* Bio & Details Column */}
          <div className="lg:col-span-7 space-y-6">
            <div className="space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider opacity-60 font-sans">
                Official Biography
              </span>
              <h3 className="font-serif text-2xl sm:text-3xl font-bold leading-tight">
                "Small baby. Big dreams."
              </h3>
              
              {/* Exact user biography quotation */}
              <blockquote className="p-5 rounded-2xl border bg-black/5 dark:bg-white/5 border-pink-400/20 italic font-serif text-base sm:text-lg leading-relaxed opacity-95">
                "Pip has always been fascinated by the little things that help the world feel safe at night. One evening, Pip discovered that a tiny melody could comfort a worried creature and that a small lantern could make a dark room feel warm. Since then, Pip has been building dreams, collecting stars, and helping the neighborhood drift into peaceful sleep."
              </blockquote>
            </div>

            {/* Personality & Species description */}
            <div className="space-y-2 text-xs sm:text-sm leading-relaxed opacity-85 font-sans">
              <p>
                Pip is recognizable everywhere by a round skull face, glowing warm amber eyes that never judge, a tiny crooked smile, and a beloved navy-purple nightcap sprinkled with golden stars and finished with a soft pink bow.
              </p>
            </div>

            {/* Favorite Things */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider opacity-60 font-sans mb-3">
                Pip's Favorite Comforts
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {favoriteThings.map((fav) => {
                  const Icon = fav.icon;
                  return (
                    <div
                      key={fav.name}
                      className="p-3 rounded-xl border bg-black/5 dark:bg-white/5 border-stone-200/50 dark:border-stone-800 flex items-start gap-3 text-xs"
                    >
                      <div className="p-1.5 rounded-lg bg-pink-500/10 text-pink-500 shrink-0">
                        <Icon className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="font-semibold block font-sans">{fav.name}</span>
                        <span className="opacity-70 text-[11px] font-sans">{fav.desc}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Skills & Metrics */}
            <div className="pt-2">
              <h4 className="text-xs font-bold uppercase tracking-wider opacity-60 font-sans mb-3">
                Dream-Engineering Competencies
              </h4>
              <div className="space-y-3 font-sans">
                {skills.map((skill) => {
                  return (
                    <div key={skill.name} className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="font-medium">{skill.name}</span>
                        <span className="font-mono text-amber-500 font-bold">{skill.level}%</span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-stone-200 dark:bg-stone-800 overflow-hidden">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-pink-500 to-amber-400 transition-all duration-1000"
                          style={{ width: `${skill.level}%` }}
                        />
                      </div>
                      <p className="text-[11px] opacity-60">{skill.desc}</p>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
};
