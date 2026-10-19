import React, { useState, useEffect } from 'react';
import { X, Sparkles, Compass, CheckCircle2, RotateCcw, Stars, ArrowLeft } from 'lucide-react';
import { ThemeMode } from '../types';
import { sound } from '../utils/soundEngine';

interface TelescopeStargazerProps {
  isOpen: boolean;
  onClose: () => void;
  theme: ThemeMode;
  onRewardStardust: (amount: number) => void;
}

interface Constellation {
  id: string;
  name: string;
  lore: string;
  stars: { id: number; x: number; y: number; label: string }[];
  lines: [number, number][]; // pairs of star IDs
}

const CONSTELLATIONS: Constellation[] = [
  {
    id: 'ursa-somnus',
    name: 'Ursa Somnus (The Sleepy Bear)',
    lore: 'Ancient nursery legend says whenever this celestial bear rolls over in his starry cave, gentle autumn breezes blow sleepy dreams across the valley.',
    stars: [
      { id: 1, x: 25, y: 35, label: 'Nose' },
      { id: 2, x: 42, y: 30, label: 'Eye' },
      { id: 3, x: 62, y: 40, label: 'Ear' },
      { id: 4, x: 50, y: 65, label: 'Paw' },
      { id: 5, x: 75, y: 68, label: 'Tail' },
    ],
    lines: [
      [1, 2],
      [2, 3],
      [2, 4],
      [3, 5],
      [4, 5],
    ],
  },
  {
    id: 'honey-teapot',
    name: 'The Honey Teapot',
    lore: 'Pip watches this constellation at 8:30 PM. Starlight pours from its spout into the Milky Way like soothing chamomile tea.',
    stars: [
      { id: 1, x: 28, y: 45, label: 'Handle' },
      { id: 2, x: 45, y: 32, label: 'Lid' },
      { id: 3, x: 72, y: 38, label: 'Spout' },
      { id: 4, x: 62, y: 65, label: 'Base Right' },
      { id: 5, x: 38, y: 65, label: 'Base Left' },
    ],
    lines: [
      [1, 5],
      [1, 2],
      [2, 3],
      [3, 4],
      [4, 5],
      [2, 5],
    ],
  },
  {
    id: 'celestial-cradle',
    name: 'The Celestial Cradle',
    lore: 'The original constellation charted by Pip. A rocking boat of stars that carries little travelers safely through midnight mists.',
    stars: [
      { id: 1, x: 30, y: 40, label: 'Pillow' },
      { id: 2, x: 70, y: 40, label: 'Footboard' },
      { id: 3, x: 65, y: 70, label: 'Rocker Right' },
      { id: 4, x: 35, y: 70, label: 'Rocker Left' },
    ],
    lines: [
      [1, 2],
      [2, 3],
      [3, 4],
      [4, 1],
    ],
  },
];

export const TelescopeStargazer: React.FC<TelescopeStargazerProps> = ({
  isOpen,
  onClose,
  theme,
  onRewardStardust,
}) => {
  const [selectedConstellationIdx, setSelectedConstellationIdx] = useState(0);
  const [connectedStarIds, setConnectedStarIds] = useState<number[]>([]);
  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        sound.playClick(440);
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const constellation = CONSTELLATIONS[selectedConstellationIdx];

  const handleStarClick = (starId: number) => {
    if (connectedStarIds.includes(starId)) return;

    const newConnected = [...connectedStarIds, starId];
    setConnectedStarIds(newConnected);
    sound.playStarNote(newConnected.length);

    if (newConnected.length === constellation.stars.length) {
      setIsCompleted(true);
      sound.playSparkle();
      onRewardStardust(10);
    }
  };

  const handleReset = () => {
    sound.playClick(440);
    setConnectedStarIds([]);
    setIsCompleted(false);
  };

  const switchConstellation = (idx: number) => {
    sound.playClick(600);
    setSelectedConstellationIdx(idx);
    setConnectedStarIds([]);
    setIsCompleted(false);
  };

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          sound.playClick(440);
          onClose();
        }
      }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-in fade-in duration-300 overflow-y-auto"
    >
      <div
        className={`relative w-full max-w-2xl rounded-3xl p-5 sm:p-7 border shadow-2xl transition-all my-auto max-h-[90vh] overflow-y-auto ${
          theme === 'day'
            ? 'bg-[#fffdf9] border-amber-300 text-[#5c4033]'
            : 'bg-[#1b1933] border-pink-500/40 text-[#fff0e8]'
        }`}
      >
        {/* Top Header Bar with Dedicated Back Button */}
        <div className="flex items-center justify-between gap-3 pb-3 mb-2 border-b border-stone-200/50 dark:border-stone-800/60">
          <button
            onClick={() => {
              sound.playClick(440);
              onClose();
            }}
            type="button"
            className={`px-3.5 py-1.5 rounded-xl border text-xs font-semibold font-sans flex items-center gap-1.5 transition-all active:scale-95 shadow-sm ${
              theme === 'day'
                ? 'bg-[#fdeedf] hover:bg-[#fad8bd] text-[#a34063] border-[#f3c4d3]'
                : 'bg-[#24213d] hover:bg-purple-900/60 text-pink-300 border-purple-700'
            }`}
            aria-label="Return to observatory homepage"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>← Back to Observatory</span>
          </button>

          <button
            onClick={() => {
              sound.playClick(440);
              onClose();
            }}
            type="button"
            aria-label="Close telescope"
            className="p-1.5 rounded-full hover:bg-stone-500/10 text-current transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Title */}
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs font-bold uppercase tracking-wider font-sans text-amber-500 flex items-center gap-1.5">
            <Compass className="w-3.5 h-3.5" />
            Pip's Brass Stargazer Lens
          </span>
          <span className="text-xs opacity-50">·</span>
          <span className="text-xs opacity-75 font-sans">Interactive Constellation Map</span>
        </div>
        <h3 className="font-serif text-2xl sm:text-3xl font-bold">
          {constellation.name}
        </h3>
        <p className="text-xs sm:text-sm opacity-80 font-sans mt-1">
          Click the glowing stars inside the telescope lens to connect them into Pip's starlight map!
        </p>

        {/* Constellation Selector Tabs */}
        <div className="flex flex-wrap gap-2 my-4">
          {CONSTELLATIONS.map((c, idx) => (
            <button
              key={c.id}
              onClick={() => switchConstellation(idx)}
              type="button"
              className={`text-xs px-3 py-1.5 rounded-xl border font-medium font-sans transition-all ${
                idx === selectedConstellationIdx
                  ? theme === 'day'
                    ? 'bg-[#a34063] text-white border-pink-400 shadow-sm'
                    : 'bg-[#e65d96] text-white border-pink-400 shadow-sm'
                  : 'border-stone-300/50 dark:border-stone-700 hover:bg-stone-500/10 text-current opacity-80'
              }`}
            >
              {c.name.split(' ')[0]}
            </button>
          ))}
        </div>

        {/* Round Brass Telescope Viewport */}
        <div className="relative mx-auto w-full aspect-square max-w-xs sm:max-w-sm rounded-full border-4 border-amber-400/80 shadow-[0_0_40px_rgba(245,158,11,0.25)] overflow-hidden bg-gradient-to-b from-[#090814] via-[#100e26] to-[#181335] select-none my-2 ring-8 ring-stone-900/40">
          
          {/* Subtle Reticle Crosshair & Measurement Rings */}
          <div className="absolute inset-0 pointer-events-none opacity-20">
            <div className="absolute inset-8 rounded-full border border-dashed border-amber-300/60" />
            <div className="absolute inset-20 rounded-full border border-amber-300/40" />
            <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-[1px] bg-amber-400/30" />
            <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-[1px] bg-amber-400/30" />
          </div>

          {/* SVG Connecting Lines */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none">
            {constellation.lines.map(([starAId, starBId], idx) => {
              const starA = constellation.stars.find((s) => s.id === starAId);
              const starB = constellation.stars.find((s) => s.id === starBId);
              if (!starA || !starB) return null;

              const isLineActive =
                connectedStarIds.includes(starAId) && connectedStarIds.includes(starBId);

              return (
                <line
                  key={idx}
                  x1={`${starA.x}%`}
                  y1={`${starA.y}%`}
                  x2={`${starB.x}%`}
                  y2={`${starB.y}%`}
                  stroke={isLineActive ? '#facc15' : 'rgba(255,255,255,0.1)'}
                  strokeWidth={isLineActive ? '2.5' : '1'}
                  strokeDasharray={isLineActive ? undefined : '3,4'}
                  className={isLineActive ? 'drop-shadow-[0_0_8px_rgba(250,204,21,0.8)]' : ''}
                />
              );
            })}
          </svg>

          {/* Clickable Stars */}
          {constellation.stars.map((star) => {
            const isConnected = connectedStarIds.includes(star.id);
            return (
              <button
                key={star.id}
                onClick={() => handleStarClick(star.id)}
                type="button"
                style={{ left: `${star.x}%`, top: `${star.y}%` }}
                aria-label={`Connect star ${star.label}`}
                className="absolute -translate-x-1/2 -translate-y-1/2 p-2 group focus:outline-none"
              >
                {/* Glow ring */}
                <span
                  className={`absolute inset-0 rounded-full transition-all duration-300 ${
                    isConnected
                      ? 'bg-amber-400/40 animate-ping'
                      : 'bg-white/10 group-hover:bg-amber-300/30 group-hover:scale-125'
                  }`}
                />
                
                {/* Core Star */}
                <div
                  className={`relative w-4 h-4 rounded-full border transition-all duration-300 flex items-center justify-center ${
                    isConnected
                      ? 'bg-yellow-300 border-amber-100 shadow-[0_0_15px_#fde047] scale-125'
                      : 'bg-white/70 border-white/40 group-hover:bg-amber-200'
                  }`}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-white" />
                </div>

                {/* Star Label */}
                <span className="absolute top-5 left-1/2 -translate-x-1/2 text-[9px] font-sans whitespace-nowrap text-amber-200/90 font-medium tracking-tight drop-shadow">
                  {star.label}
                </span>
              </button>
            );
          })}

          {/* Completion Celebration Overlay */}
          {isCompleted && (
            <div className="absolute inset-0 bg-amber-400/10 backdrop-blur-[1px] flex flex-col items-center justify-center p-4 text-center animate-in zoom-in-95 pointer-events-none">
              <Stars className="w-8 h-8 text-yellow-300 animate-spin-slow mb-1" />
              <span className="font-serif font-bold text-sm text-yellow-200 drop-shadow">
                Constellation Mapped!
              </span>
              <span className="text-[11px] text-amber-100 font-sans mt-0.5">
                +10 Stardust Collected! ✨
              </span>
            </div>
          )}
        </div>

        {/* Lore / Status Footer */}
        <div className="mt-3 p-3.5 rounded-2xl bg-black/5 dark:bg-white/5 border border-stone-200/50 dark:border-stone-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <p className="opacity-80 font-sans italic max-w-md">
            "{constellation.lore}"
          </p>

          <div className="flex items-center gap-2 shrink-0">
            <span className="opacity-70 font-mono">
              {connectedStarIds.length}/{constellation.stars.length} stars
            </span>
            <button
              onClick={handleReset}
              type="button"
              className="p-1.5 rounded-lg border hover:bg-stone-500/10 text-current flex items-center gap-1 font-sans"
              title="Reset constellation"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          </div>
        </div>

        {/* Dedicated Return to Homepage Action Bar */}
        <div className="mt-4 pt-3.5 border-t border-stone-200/50 dark:border-stone-800/60 flex flex-col sm:flex-row items-center justify-between gap-3">
          <button
            onClick={() => {
              sound.playClick(440);
              onClose();
            }}
            type="button"
            className={`w-full sm:w-auto px-5 py-2.5 rounded-2xl text-xs font-semibold font-sans flex items-center justify-center gap-2 text-white shadow-md transition-all active:scale-95 ${
              theme === 'day'
                ? 'bg-[#a34063] hover:bg-[#8b3252]'
                : 'bg-[#e65d96] hover:bg-[#d44883]'
            }`}
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Observatory Homepage</span>
          </button>

          <span className="text-[11px] opacity-65 font-sans hidden sm:inline">
            Press <kbd className="px-1.5 py-0.5 rounded bg-black/10 dark:bg-white/10 font-mono text-[10px]">Esc</kbd> or click outside to exit
          </span>
        </div>
      </div>
    </div>
  );
};
