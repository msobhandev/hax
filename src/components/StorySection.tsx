import React, { useState } from 'react';
import { BookOpen, ChevronLeft, ChevronRight, Sparkles, Star } from 'lucide-react';
import { ThemeMode, StoryScene } from '../types';
import { sound } from '../utils/soundEngine';

interface StorySectionProps {
  theme: ThemeMode;
}

const STORY_SCENES: StoryScene[] = [
  {
    id: 1,
    title: 'A Quiet Beginning',
    subtitle: 'Chapter I · Twilight in the Cradle',
    text: 'Before the Midnight Observatory held its telescope high, the nursery was merely a quiet corner where twilight gathered on empty wooden sills. Pip was small—even smaller than now—sleeping in a woven wicker cradle beneath a pale crescent moon. While others worried about the encroaching shadows, Pip listened to the quiet rhythm of falling dusk. Pip noticed how even the smallest glimmer of starlight could banish the cold from a windowpane, and wondered how to bottle that light for those who felt alone in the dark.',
    image: '/assets/images/story_quiet_beginning_1792338662353.jpg',
    fallbackColor: '#2d334d',
  },
  {
    id: 2,
    title: 'Discovering Dreams',
    subtitle: 'Chapter II · The Golden Note of Starlight',
    text: 'One twilight, a stray melody drifted through the cracked window from the high mountain winds. Pip reached out with tiny skeleton hands and caught a golden note of starlight between fingertips. When Pip hummed the frequency softly into the cradle blanket, the room began to glow with lavender mist. Constellations danced on the bedroom ceiling, forming playful sheep and smiling bears. For the first time, Pip realized that melodies weren’t just sounds—they were maps that carried little creatures across the bridge into peaceful, worry-free sleep.',
    image: '/assets/images/story_discovering_dreams_1792338663031.jpg',
    fallbackColor: '#222340',
  },
  {
    id: 3,
    title: 'The First Nightlight',
    subtitle: 'Chapter III · The Star of Honey & Amber',
    text: "The very first lantern Pip built was fashioned from a fallen wooden star-frame, copper wires, and a warm honey-amber glowworm who needed a cozy home for the winter. Placed carefully upon a child's bedside shelf, the lantern didn't glare or buzz; instead, it bathed the entire room in a soothing, candle-like honey embrace. Children who previously feared the shadows began asking to watch the star-lantern breathe as they closed their eyes. Pip saw a crying baby smile and fall asleep, knowing then what their true calling would be.",
    image: '/assets/images/story_first_nightlight_1792338663808.jpg',
    fallbackColor: '#302636',
  },
  {
    id: 4,
    title: 'A Dream Engineer',
    subtitle: 'Chapter IV · The Observatory Tower',
    text: 'Today, atop the highest winding spiral of the Midnight Observatory, Pip holds the proud title of Junior Dream Engineer. Surrounded by antique books, stardust vials, and brass compasses, Pip drafts bedtime blueprints every night. Each evening before dusk falls, Pip weaves custom lullabies into music boxes, checks the lantern batteries, and charts starlight couriers across the four realms. It is quiet, delicate work—but every sleeping child across the valley can rest easily knowing Pip is on watch, keeping the stars shining bright.',
    image: '/assets/images/story_dream_engineer_1792338663637.jpg',
    fallbackColor: '#1d1933',
  },
];

export const StorySection: React.FC<StorySectionProps> = ({ theme }) => {
  const [activeSceneIndex, setActiveSceneIndex] = useState(0);

  const activeScene = STORY_SCENES[activeSceneIndex];

  const handleNext = () => {
    sound.playClick(783.99);
    setActiveSceneIndex((prev) => (prev + 1) % STORY_SCENES.length);
  };

  const handlePrev = () => {
    sound.playClick(523.25);
    setActiveSceneIndex((prev) => (prev - 1 + STORY_SCENES.length) % STORY_SCENES.length);
  };

  const selectScene = (idx: number) => {
    sound.playClick(600 + idx * 60);
    setActiveSceneIndex(idx);
  };

  return (
    <section id="story" className="py-12 sm:py-20 px-4 sm:px-6 max-w-7xl mx-auto space-y-10">
      {/* Section Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider font-sans px-3 py-1 rounded-full border border-pink-400/30 bg-pink-500/10 text-pink-500">
          <BookOpen className="w-3.5 h-3.5" />
          Illustrated Bedtime Tale
        </div>
        <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-current">
          Pip's Storybook Odyssey
        </h2>
        <p className="text-sm sm:text-base opacity-80 font-sans leading-relaxed">
          How a tiny skeleton baby with a dream-engineering cap came to illuminate bedtime for the entire valley.
        </p>
      </div>

      {/* DESKTOP VIEW: Horizontal Interactive Timeline & Scene Spotlight */}
      <div className="hidden md:block">
        {/* Horizontal Timeline Track */}
        <div className="flex items-center justify-between max-w-4xl mx-auto mb-8 relative">
          {/* Connector Line */}
          <div
            className={`absolute top-1/2 left-0 right-0 -translate-y-1/2 h-1 rounded-full z-0 ${
              theme === 'day' ? 'bg-[#f3c4d3]' : 'bg-purple-900/60'
            }`}
          />
          
          {/* Scene Step Buttons */}
          {STORY_SCENES.map((scene, idx) => {
            const isActive = idx === activeSceneIndex;
            return (
              <button
                key={scene.id}
                onClick={() => selectScene(idx)}
                type="button"
                className={`relative z-10 flex flex-col items-center group focus:outline-none transition-transform duration-300 ${
                  isActive ? 'scale-110' : 'opacity-70 hover:opacity-100 hover:scale-105'
                }`}
              >
                <div
                  className={`w-12 h-12 rounded-full border-2 flex items-center justify-center font-serif font-bold text-sm shadow-md transition-all ${
                    isActive
                      ? theme === 'day'
                        ? 'bg-[#a34063] text-white border-amber-300 ring-4 ring-pink-300/40'
                        : 'bg-[#e65d96] text-white border-amber-300 ring-4 ring-pink-500/30'
                      : theme === 'day'
                      ? 'bg-white text-[#5c4033] border-pink-200'
                      : 'bg-[#24213d] text-[#fff0e8] border-purple-700'
                  }`}
                >
                  {scene.id}
                </div>
                <span className="mt-2 text-xs font-sans font-medium whitespace-nowrap text-current">
                  {scene.title}
                </span>
              </button>
            );
          })}
        </div>

        {/* Active Scene Card (Split View) */}
        <div
          className={`rounded-3xl p-8 border shadow-2xl transition-all duration-500 ${
            theme === 'day'
              ? 'bg-[#fffdf9] border-[#f3c4d3] text-[#5c4033]'
              : 'bg-[#24213d] border-[#e65d96]/30 text-[#fff0e8]'
          }`}
        >
          <div className="grid grid-cols-12 gap-8 items-center">
            {/* Left: Scene Illustration */}
            <div className="col-span-6">
              <div className="relative rounded-2xl overflow-hidden aspect-[4/3] border-2 border-amber-400/30 shadow-lg group">
                <img
                  src={activeScene.image}
                  alt={activeScene.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  onError={(e) => {
                    (e.currentTarget as HTMLElement).style.display = 'none';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />
                <div className="absolute bottom-3 left-3 text-white text-xs font-serif italic backdrop-blur-md bg-black/40 px-3 py-1 rounded-xl border border-white/10">
                  {activeScene.subtitle}
                </div>
              </div>
            </div>

            {/* Right: Scene Story Text & Navigation */}
            <div className="col-span-6 flex flex-col justify-between space-y-6">
              <div>
                <span className="text-xs uppercase font-sans tracking-widest opacity-60 font-semibold block mb-1">
                  Scene {activeScene.id} of {STORY_SCENES.length}
                </span>
                <h3 className="font-serif text-3xl font-bold mb-4 text-current">
                  {activeScene.title}
                </h3>
                <p className="font-serif text-base lg:text-lg leading-relaxed opacity-90 italic">
                  "{activeScene.text}"
                </p>
              </div>

              {/* Prev / Next Buttons */}
              <div className="flex items-center justify-between pt-4 border-t border-stone-200/50 dark:border-stone-800">
                <button
                  onClick={handlePrev}
                  type="button"
                  className="px-4 py-2 rounded-xl border text-xs font-medium flex items-center gap-1.5 hover:bg-stone-500/10 transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Previous Scene</span>
                </button>

                <div className="flex items-center gap-1.5">
                  {STORY_SCENES.map((_, i) => (
                    <span
                      key={i}
                      className={`w-2 h-2 rounded-full transition-all ${
                        i === activeSceneIndex ? 'w-5 bg-pink-500' : 'bg-stone-400/40'
                      }`}
                    />
                  ))}
                </div>

                <button
                  onClick={handleNext}
                  type="button"
                  className={`px-4 py-2 rounded-xl text-xs font-medium flex items-center gap-1.5 text-white shadow-md transition-all active:scale-95 ${
                    theme === 'day' ? 'bg-[#a34063]' : 'bg-[#e65d96]'
                  }`}
                >
                  <span>Next Scene</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* MOBILE VIEW: Vertical Illustrated Timeline */}
      <div className="md:hidden space-y-8">
        {STORY_SCENES.map((scene, idx) => (
          <div
            key={scene.id}
            className={`rounded-2xl p-5 border shadow-lg space-y-4 ${
              theme === 'day'
                ? 'bg-[#fffdf9] border-[#f3c4d3] text-[#5c4033]'
                : 'bg-[#24213d] border-[#e65d96]/30 text-[#fff0e8]'
            }`}
          >
            <div className="flex items-center gap-3">
              <span
                className={`w-8 h-8 rounded-full flex items-center justify-center font-serif font-bold text-xs shrink-0 ${
                  theme === 'day'
                    ? 'bg-[#a34063] text-white'
                    : 'bg-[#e65d96] text-white'
                }`}
              >
                {scene.id}
              </span>
              <div>
                <span className="text-[10px] uppercase font-sans opacity-60 tracking-wider block">
                  {scene.subtitle}
                </span>
                <h4 className="font-serif text-xl font-bold leading-tight">
                  {scene.title}
                </h4>
              </div>
            </div>

            <div className="relative rounded-xl overflow-hidden aspect-[4/3] border border-amber-400/30">
              <img
                src={scene.image}
                alt={scene.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.currentTarget as HTMLElement).style.display = 'none';
                }}
              />
            </div>

            <p className="font-serif text-sm leading-relaxed opacity-90 italic">
              "{scene.text}"
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};
