import React, { useState } from 'react';
import { Send, Compass, CheckCircle2, Sparkles, Navigation, Stars } from 'lucide-react';
import { ThemeMode, DreamDestination } from '../../types';
import { sound } from '../../utils/soundEngine';

interface DreamDeliveryRoutesProps {
  theme: ThemeMode;
  onRewardStardust?: (amount: number) => void;
}

interface LandmarkMeta {
  icon: string;
  badgeLabel: string;
  badgeColor: string;
}

const LANDMARK_METAS: Record<string, LandmarkMeta> = {
  'cloud-village': {
    icon: '☁️',
    badgeLabel: 'Sky Dwellings',
    badgeColor: 'border-sky-300 text-sky-800 bg-sky-50 dark:text-sky-200 dark:bg-sky-950/80',
  },
  'starry-forest': {
    icon: '🌲',
    badgeLabel: 'Luminous Hollows',
    badgeColor: 'border-emerald-300 text-emerald-800 bg-emerald-50 dark:text-emerald-200 dark:bg-emerald-950/80',
  },
  'moonlit-lake': {
    icon: '🌙',
    badgeLabel: 'Starry Waters',
    badgeColor: 'border-indigo-300 text-indigo-800 bg-indigo-50 dark:text-indigo-200 dark:bg-indigo-950/80',
  },
  'midnight-observatory': {
    icon: '🔭',
    badgeLabel: 'Observatory Summit',
    badgeColor: 'border-amber-300 text-amber-800 bg-amber-50 dark:text-amber-200 dark:bg-amber-950/80',
  },
};

const DESTINATIONS: DreamDestination[] = [
  {
    id: 'cloud-village',
    name: 'Cloud Village',
    coordinates: { x: 21, y: 19 },
    description: 'High in the cotton-candy troposphere where baby sky-lambs rest.',
    dreamType: 'Marshmallow Cloud Drift',
    delivered: true,
    lore: 'The residents here sleep upon fluffy updrafts. Pip delivers warm vapor lullabies that turn stormy clouds into warm pink dusk mists.',
  },
  {
    id: 'starry-forest',
    name: 'Starry Forest',
    coordinates: { x: 77, y: 22 },
    description: 'An ancient pine hollow where bioluminescent acorns twinkle in the dark.',
    dreamType: 'Pinecone Acorn Lullaby',
    delivered: true,
    lore: 'Tiny woodland mice and sleepy barn owls nest in the hollows. Pip sends down starry lanterns so no creature is afraid of midnight shadows.',
  },
  {
    id: 'moonlit-lake',
    name: 'Moonlit Lake',
    coordinates: { x: 25, y: 77 },
    description: 'A mirror-like lake reflecting constellations and swimming silver fish.',
    dreamType: 'Water Lily Reverie',
    delivered: false,
    lore: 'Gentle water lilies fold their petals when the moon rises. Pip floats glowing glass lanterns across the ripples to whisper goodnight to the water sprites.',
  },
  {
    id: 'midnight-observatory',
    name: 'Midnight Observatory',
    coordinates: { x: 79, y: 64 },
    description: "Pip's cozy home base and highest telescope perch above the nursery.",
    dreamType: 'Stardust Blueprint Synthesis',
    delivered: true,
    lore: 'Where every dream begins. Pip maps planetary conjunctions and weaves lullaby music boxes into celestial postal packages.',
  },
];

const FLOATING_CLOUDS = [
  { id: 'c1', top: '10%', duration: '26s', delay: '0s', width: '130px', height: '52px', opacity: 0.85 },
  { id: 'c2', top: '38%', duration: '34s', delay: '-12s', width: '170px', height: '65px', opacity: 0.9 },
  { id: 'c3', top: '66%', duration: '30s', delay: '-5s', width: '145px', height: '58px', opacity: 0.8 },
  { id: 'c4', top: '24%', duration: '22s', delay: '-17s', width: '115px', height: '46px', opacity: 0.75 },
];

export const DreamDeliveryRoutes: React.FC<DreamDeliveryRoutesProps> = ({
  theme,
  onRewardStardust,
}) => {
  const [destinations, setDestinations] = useState<DreamDestination[]>(DESTINATIONS);
  const [selectedId, setSelectedId] = useState<string>('cloud-village');
  const [isDelivering, setIsDelivering] = useState(false);
  const [deliveryMessage, setDeliveryMessage] = useState<string | null>(null);

  const selectedDestination = destinations.find((d) => d.id === selectedId) || destinations[0];
  const deliveredCount = destinations.filter((d) => d.delivered).length;

  const handleSelectDest = (id: string) => {
    sound.playClick(600);
    setSelectedId(id);
    setDeliveryMessage(null);
  };

  const handleDeliverDream = () => {
    sound.playSparkle();
    setIsDelivering(true);
    setDeliveryMessage(`Courier dispatched with ${selectedDestination.dreamType}...`);

    setTimeout(() => {
      setDestinations((prev) =>
        prev.map((dest) => (dest.id === selectedId ? { ...dest, delivered: true } : dest))
      );
      setIsDelivering(false);
      setDeliveryMessage(`✨ Dream successfully delivered to ${selectedDestination.name}! (+5 Stardust)`);
      if (onRewardStardust) {
        onRewardStardust(5);
      }
    }, 1100);
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
              Project 03 · Celestial Logistics
            </span>
            <span className="text-xs opacity-50">·</span>
            <span className="text-xs font-sans opacity-70">Realistic Storybook Landscape Map</span>
          </div>
          <h3 className="font-serif text-2xl sm:text-3xl font-bold">
            Dream Delivery Routes
          </h3>
        </div>

        {/* Live Visited Counter */}
        <div className="flex items-center gap-2">
          <span
            className={`text-xs px-3 py-1.5 rounded-full font-sans border font-medium flex items-center gap-1.5 ${
              deliveredCount === destinations.length
                ? 'bg-emerald-500/15 text-emerald-500 border-emerald-500/30'
                : 'bg-amber-400/15 text-amber-500 border-amber-400/30'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            {deliveredCount} of {destinations.length} destinations delivered
          </span>
        </div>
      </div>

      {/* Main Map & Detail Split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 pt-6">
        
        {/* Left: Realistic Storybook Terrain Canvas with Floating Clouds */}
        <div className="lg:col-span-7 flex flex-col">
          <div
            className={`relative w-full aspect-[4/3] rounded-3xl border-2 overflow-hidden shadow-2xl flex items-center justify-center select-none group ${
              theme === 'day'
                ? 'border-[#f3c4d3] shadow-amber-900/10'
                : 'border-purple-900/60 shadow-indigo-950/60 ring-1 ring-pink-500/20'
            }`}
          >
            {/* 1. High-Detail Storybook Terrain Artwork Base */}
            <img
              src="/assets/images/dream_map_terrain_1792378443691.jpg"
              alt="Storybook relief map of the valley showing Cloud Village, Starry Forest, Moonlit Lake, and Midnight Observatory"
              referrerPolicy="no-referrer"
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.02]"
            />

            {/* 2. Atmospheric Lighting Filter */}
            <div
              className={`absolute inset-0 pointer-events-none transition-colors duration-500 ${
                theme === 'day'
                  ? 'bg-amber-400/10 mix-blend-overlay'
                  : 'bg-indigo-950/25 mix-blend-multiply'
              }`}
            />

            {/* 3. Luminous Starlight Flight Routes SVG */}
            <svg
              className="absolute inset-0 w-full h-full pointer-events-none z-10"
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
            >
              {/* Route: Observatory -> Cloud Village */}
              <path
                d="M 79 64 Q 50 35 21 19"
                fill="none"
                stroke={theme === 'day' ? '#f59e0b' : '#fde047'}
                strokeWidth="1.2"
                strokeDasharray="2,3"
                className="opacity-75 drop-shadow-[0_0_4px_rgba(250,204,21,0.8)]"
              />
              {/* Route: Observatory -> Starry Forest */}
              <path
                d="M 79 64 Q 85 45 77 22"
                fill="none"
                stroke={theme === 'day' ? '#10b981' : '#34d399'}
                strokeWidth="1.2"
                strokeDasharray="2,3"
                className="opacity-75 drop-shadow-[0_0_4px_rgba(52,211,153,0.8)]"
              />
              {/* Route: Observatory -> Moonlit Lake */}
              <path
                d="M 79 64 Q 52 75 25 77"
                fill="none"
                stroke={theme === 'day' ? '#6366f1' : '#818cf8'}
                strokeWidth="1.2"
                strokeDasharray="2,3"
                className="opacity-75 drop-shadow-[0_0_4px_rgba(129,140,248,0.8)]"
              />
              {/* Route: Moonlit Lake -> Cloud Village */}
              <path
                d="M 25 77 Q 15 45 21 19"
                fill="none"
                stroke={theme === 'day' ? '#ec4899' : '#f472b6'}
                strokeWidth="1.2"
                strokeDasharray="2,3"
                className="opacity-65 drop-shadow-[0_0_4px_rgba(244,114,182,0.8)]"
              />
            </svg>

            {/* 4. Realistic Floating Clouds with Terrain Drop-Shadows */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden z-15">
              {FLOATING_CLOUDS.map((cloud) => (
                <React.Fragment key={cloud.id}>
                  {/* Soft Terrain Drop-Shadow (offset below cloud) */}
                  <div
                    style={{
                      top: `calc(${cloud.top} + 20px)`,
                      width: cloud.width,
                      height: cloud.height,
                      animationDuration: cloud.duration,
                      animationDelay: cloud.delay,
                      transform: 'scaleY(0.6)',
                    }}
                    className="absolute animate-map-cloud rounded-full filter blur-[8px] bg-slate-950/30"
                  />

                  {/* Fluffy Floating Cloud Body */}
                  <div
                    style={{
                      top: cloud.top,
                      width: cloud.width,
                      height: cloud.height,
                      animationDuration: cloud.duration,
                      animationDelay: cloud.delay,
                      opacity: cloud.opacity,
                    }}
                    className="absolute animate-map-cloud"
                  >
                    <svg viewBox="0 0 100 45" className="w-full h-full drop-shadow-md">
                      <defs>
                        <linearGradient id={`cloud-grad-${cloud.id}`} x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.95" />
                          <stop offset="60%" stopColor="#fdf2f8" stopOpacity="0.9" />
                          <stop offset="100%" stopColor="#e0e7ff" stopOpacity="0.8" />
                        </linearGradient>
                      </defs>
                      <path
                        d="M 20 35 A 15 15 0 0 1 35 15 A 20 20 0 0 1 70 12 A 16 16 0 0 1 85 25 A 14 14 0 0 1 75 40 L 22 40 A 10 10 0 0 1 20 35 Z"
                        fill={`url(#cloud-grad-${cloud.id})`}
                      />
                    </svg>
                  </div>
                </React.Fragment>
              ))}
            </div>

            {/* 5. Illustrated 3D Landmark Destination Badges */}
            {destinations.map((dest) => {
              const isSelected = dest.id === selectedId;
              const meta = LANDMARK_METAS[dest.id] || {
                icon: '📍',
                badgeLabel: dest.name,
                badgeColor: 'border-stone-300 text-stone-700 bg-white',
              };

              return (
                <button
                  key={dest.id}
                  onClick={() => handleSelectDest(dest.id)}
                  type="button"
                  style={{
                    left: `${dest.coordinates.x}%`,
                    top: `${dest.coordinates.y}%`,
                  }}
                  className={`absolute -translate-x-1/2 -translate-y-1/2 group focus:outline-none transition-all duration-300 z-20 ${
                    isSelected ? 'scale-125 z-30' : 'hover:scale-110 opacity-90 hover:opacity-100'
                  }`}
                  aria-label={`Select ${dest.name}`}
                >
                  {/* Glowing Status Ring */}
                  {isSelected && (
                    <span className="absolute -inset-2.5 rounded-full bg-amber-400/40 animate-ping pointer-events-none" />
                  )}

                  {/* 3D-Styled Landmark Badge */}
                  <div
                    className={`px-3 py-1.5 rounded-2xl flex items-center gap-1.5 shadow-xl border-2 transition-all backdrop-blur-md ${
                      isSelected
                        ? theme === 'day'
                          ? 'bg-[#a34063] text-white border-amber-300 shadow-pink-900/30 ring-2 ring-pink-400/50'
                          : 'bg-[#e65d96] text-white border-amber-300 shadow-pink-500/40 ring-2 ring-amber-300/60'
                        : meta.badgeColor
                    }`}
                  >
                    <span className="text-sm drop-shadow-sm">{meta.icon}</span>
                    <div className="flex flex-col text-left">
                      <span className="text-xs font-serif font-bold whitespace-nowrap leading-none">
                        {dest.name}
                      </span>
                      <span className="text-[9px] opacity-75 font-sans whitespace-nowrap leading-tight">
                        {dest.delivered ? '★ Delivered' : '• Pending'}
                      </span>
                    </div>
                  </div>
                </button>
              );
            })}

            {/* 6. Flying Star Courier Animation along route */}
            {isDelivering && (
              <div
                style={{
                  left: `${selectedDestination.coordinates.x}%`,
                  top: `${selectedDestination.coordinates.y}%`,
                }}
                className="absolute -translate-x-1/2 -translate-y-1/2 z-40 pointer-events-none transition-all duration-700"
              >
                <div className="px-4 py-2 rounded-full bg-amber-400 text-stone-900 font-bold text-xs shadow-2xl flex items-center gap-1.5 animate-bounce border border-amber-200">
                  <Sparkles className="w-4 h-4 text-white fill-white" />
                  <span>Starlight Courier Delivered! ✨</span>
                </div>
              </div>
            )}

            {/* Top-Right Starmap Legend */}
            <div className="absolute top-3 left-3 flex items-center gap-1.5 text-[11px] font-serif px-2.5 py-1 rounded-xl bg-black/40 text-white backdrop-blur-md border border-white/10 z-20">
              <Compass className="w-3.5 h-3.5 text-amber-300 animate-spin-slow" />
              <span>Midnight Valley Cartography</span>
            </div>
          </div>

          {/* Map Destination Quick Selector Pill Strip */}
          <div className="flex flex-wrap gap-2 mt-4">
            {destinations.map((dest) => (
              <button
                key={dest.id}
                onClick={() => handleSelectDest(dest.id)}
                type="button"
                className={`text-xs px-3.5 py-2 rounded-xl border transition-all font-medium font-sans flex items-center gap-1.5 ${
                  dest.id === selectedId
                    ? theme === 'day'
                      ? 'bg-[#fdeedf] border-[#a34063] text-[#a34063] shadow-sm font-semibold'
                      : 'bg-[#17172c] border-[#e65d96] text-[#e65d96] shadow-sm font-semibold'
                    : 'bg-transparent border-stone-300/60 dark:border-stone-800 opacity-75 hover:opacity-100 text-current'
                }`}
              >
                <span>{LANDMARK_METAS[dest.id]?.icon || '📍'}</span>
                <span>{dest.name}</span>
                {dest.delivered && <span className="text-amber-500 font-bold">✓</span>}
              </button>
            ))}
          </div>
        </div>

        {/* Right: Selected Realm Lore & Delivery Action */}
        <div className="lg:col-span-5 flex flex-col justify-between space-y-4">
          <div
            className={`p-6 rounded-2xl border transition-all shadow-sm ${
              theme === 'day'
                ? 'bg-[#fdeedf]/60 border-[#f3c4d3]'
                : 'bg-[#17172c] border-purple-900/60'
            }`}
          >
            <div className="flex items-center justify-between pb-3 border-b border-stone-200/50 dark:border-stone-800">
              <span className="text-xs font-semibold uppercase tracking-wider opacity-60 font-sans">
                Destination Log
              </span>
              <span
                className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${
                  selectedDestination.delivered
                    ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20'
                    : 'bg-amber-500/10 text-amber-500 border border-amber-500/20'
                }`}
              >
                {selectedDestination.delivered ? 'Dream Delivered' : 'Pending Delivery'}
              </span>
            </div>

            <div className="flex items-center gap-2 mt-4">
              <span className="text-2xl">{LANDMARK_METAS[selectedDestination.id]?.icon}</span>
              <h4 className="font-serif text-2xl sm:text-3xl font-bold text-current leading-tight">
                {selectedDestination.name}
              </h4>
            </div>

            <p className="text-xs opacity-70 mt-1 font-sans">
              {selectedDestination.description}
            </p>

            <div className="my-4 p-3.5 rounded-xl bg-black/5 dark:bg-white/5 border border-stone-200/50 dark:border-stone-800 text-xs space-y-2 font-sans">
              <div className="flex justify-between">
                <span className="opacity-60">Bedtime Specialty:</span>
                <span className="font-semibold text-amber-500">
                  {selectedDestination.dreamType}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="opacity-60">Current Status:</span>
                <span className="font-medium">
                  {selectedDestination.delivered ? 'Safe & Sleeping Peacefully' : 'Awaiting Starlight Parcel'}
                </span>
              </div>
            </div>

            <p className="text-xs sm:text-sm opacity-85 leading-relaxed font-sans italic">
              "{selectedDestination.lore}"
            </p>
          </div>

          {/* Delivery Feedback Banner if triggered */}
          {deliveryMessage && (
            <div className="p-3.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-600 dark:text-emerald-300 text-xs font-medium text-center animate-in fade-in">
              {deliveryMessage}
            </div>
          )}

          {/* Deliver a Dream Action Button */}
          <button
            onClick={handleDeliverDream}
            disabled={isDelivering}
            type="button"
            className={`w-full py-3 px-5 rounded-2xl font-medium text-sm transition-all duration-300 shadow-md flex items-center justify-center gap-2 text-white active:scale-98 disabled:opacity-60 ${
              theme === 'day'
                ? 'bg-[#a34063] hover:bg-[#8b3252] shadow-pink-900/15'
                : 'bg-[#e65d96] hover:bg-[#d44883] shadow-pink-500/25'
            }`}
          >
            {isDelivering ? (
              <>
                <Sparkles className="w-4 h-4 animate-spin" />
                <span>Dispatching Starlight Courier...</span>
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                <span>
                  {selectedDestination.delivered
                    ? `Send Another Dream to ${selectedDestination.name}`
                    : `Deliver a Dream to ${selectedDestination.name}`}
                </span>
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
};
