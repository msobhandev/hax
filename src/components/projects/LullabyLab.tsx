import React, { useState, useEffect, useRef } from 'react';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Shuffle,
  Repeat,
  Heart,
  Music2,
  Sparkles,
  Volume2
} from 'lucide-react';
import { ThemeMode, LullabyTrack } from '../../types';
import { sound } from '../../utils/soundEngine';

interface LullabyLabProps {
  theme: ThemeMode;
  isSoundOn: boolean;
  toggleSound: () => void;
}

const TRACKS: LullabyTrack[] = [
  {
    id: 'track-1',
    title: 'Sunrise Lullaby',
    duration: 156, // 2:36
    description: 'Golden morning warmth, soft chime arpeggios to welcome the day.',
    mood: 'Gentle & Uplifting',
    stars: 5,
  },
  {
    id: 'track-2',
    title: 'Starry Window',
    duration: 184, // 3:04
    description: 'Delicate glockenspiel notes reflecting off cool evening glass.',
    mood: 'Dreamy & Twinkling',
    stars: 5,
  },
  {
    id: 'track-3',
    title: 'Moonlight Forest',
    duration: 210, // 3:30
    description: 'Deep woodland harp tones with peaceful night wind whispers.',
    mood: 'Mysterious & Soothing',
    stars: 4,
  },
  {
    id: 'track-4',
    title: 'Cloud Parade',
    duration: 142, // 2:22
    description: 'Playful marshmallow clouds bouncing over the twilight hills.',
    mood: 'Warm & Cozy',
    stars: 5,
  },
  {
    id: 'track-5',
    title: 'Goodnight World',
    duration: 198, // 3:18
    description: 'The final sleepy chime slowing down as sleepy eyes close.',
    mood: 'Deep Sleep & Rest',
    stars: 5,
  },
];

export const LullabyLab: React.FC<LullabyLabProps> = ({ theme, isSoundOn, toggleSound }) => {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [isShuffle, setIsShuffle] = useState(false);
  const [repeatMode, setRepeatMode] = useState<'off' | 'all' | 'one'>('all');
  const [favorites, setFavorites] = useState<string[]>(['track-1', 'track-5']);

  const currentTrack = TRACKS[currentTrackIndex];
  const progressTimerRef = useRef<number | null>(null);

  // Handle timer tick when playing
  useEffect(() => {
    if (isPlaying) {
      sound.playLullabyPattern(currentTrack.title);
      progressTimerRef.current = window.setInterval(() => {
        setElapsedTime((prev) => {
          if (prev >= currentTrack.duration) {
            handleTrackEnd();
            return 0;
          }
          return prev + 1;
        });
      }, 1000);
    } else {
      sound.stopLullaby();
      if (progressTimerRef.current !== null) {
        clearInterval(progressTimerRef.current);
        progressTimerRef.current = null;
      }
    }

    return () => {
      sound.stopLullaby();
      if (progressTimerRef.current !== null) {
        clearInterval(progressTimerRef.current);
      }
    };
  }, [isPlaying, currentTrackIndex]);

  const handleTrackEnd = () => {
    if (repeatMode === 'one') {
      setElapsedTime(0);
      sound.playLullabyPattern(currentTrack.title);
    } else if (isShuffle) {
      const randomIndex = Math.floor(Math.random() * TRACKS.length);
      setCurrentTrackIndex(randomIndex);
      setElapsedTime(0);
    } else if (repeatMode === 'all') {
      setCurrentTrackIndex((prev) => (prev + 1) % TRACKS.length);
      setElapsedTime(0);
    } else {
      setIsPlaying(false);
      setElapsedTime(0);
    }
  };

  const handleTogglePlay = () => {
    sound.playClick(659.25);
    // If sound is globally muted and user hits play, remind or optionally suggest unmuting
    if (!isSoundOn && !isPlaying) {
      toggleSound();
    }
    setIsPlaying(!isPlaying);
  };

  const handleNext = () => {
    sound.playClick(783.99);
    setElapsedTime(0);
    if (isShuffle) {
      const nextIndex = Math.floor(Math.random() * TRACKS.length);
      setCurrentTrackIndex(nextIndex);
    } else {
      setCurrentTrackIndex((prev) => (prev + 1) % TRACKS.length);
    }
  };

  const handlePrev = () => {
    sound.playClick(523.25);
    setElapsedTime(0);
    if (elapsedTime > 3) {
      setElapsedTime(0);
    } else {
      setCurrentTrackIndex((prev) => (prev - 1 + TRACKS.length) % TRACKS.length);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = Number(e.target.value);
    setElapsedTime(newTime);
  };

  const toggleFavorite = (trackId: string) => {
    sound.playClick(880);
    setFavorites((prev) =>
      prev.includes(trackId) ? prev.filter((id) => id !== trackId) : [...prev, trackId]
    );
  };

  const cycleRepeat = () => {
    sound.playClick();
    if (repeatMode === 'off') setRepeatMode('all');
    else if (repeatMode === 'all') setRepeatMode('one');
    else setRepeatMode('off');
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const isFavorited = favorites.includes(currentTrack.id);

  return (
    <div
      className={`rounded-3xl p-6 sm:p-8 border shadow-xl transition-all duration-300 ${
        theme === 'day'
          ? 'bg-[#fffdf9] border-[#f3c4d3] text-[#5c4033]'
          : 'bg-[#24213d] border-[#e65d96]/30 text-[#fff0e8]'
      }`}
    >
      {/* Header of Project Card */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-stone-200/60 dark:border-stone-800 gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span
              className={`text-xs font-bold tracking-wider uppercase font-sans ${
                theme === 'day' ? 'text-[#a34063]' : 'text-[#e65d96]'
              }`}
            >
              Project 01 · Dream Audio
            </span>
            <span className="text-xs opacity-50">·</span>
            <span className="text-xs font-sans opacity-70">Web Audio API Synth</span>
          </div>
          <h3 className="font-serif text-2xl sm:text-3xl font-bold">The Lullaby Lab</h3>
        </div>

        <div className="flex items-center gap-2">
          {!isSoundOn && (
            <span className="text-xs text-amber-500 font-sans flex items-center gap-1 bg-amber-500/10 px-2.5 py-1 rounded-full border border-amber-500/20">
              <Volume2 className="w-3.5 h-3.5" />
              Audio muted in top bar
            </span>
          )}
          <span
            className={`text-xs px-3 py-1 rounded-full font-sans border font-medium ${
              isPlaying
                ? 'bg-emerald-500/15 text-emerald-500 border-emerald-500/30 animate-pulse'
                : 'bg-stone-500/10 text-stone-500 border-stone-500/20'
            }`}
          >
            {isPlaying ? '♪ Playing Synth' : 'Ready to Sleep'}
          </span>
        </div>
      </div>

      {/* Main Music Player Layout */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 sm:gap-8 pt-6 items-center">
        
        {/* Left: Album / Music Box Artwork */}
        <div className="md:col-span-5 flex flex-col items-center">
          <div
            className={`relative w-44 sm:w-56 aspect-square rounded-2xl p-3 border shadow-inner flex items-center justify-center overflow-hidden transition-all duration-500 ${
              isPlaying ? 'ring-4 ring-pink-400/40' : ''
            } ${
              theme === 'day'
                ? 'bg-[#fdeedf] border-[#f3c4d3]'
                : 'bg-[#17172c] border-purple-900/60'
            }`}
          >
            <img
              src="/assets/pip_lullaby_box.png"
              alt="Pip's hand-crafted Lullaby Box"
              referrerPolicy="no-referrer"
              className={`w-full h-full object-contain transition-transform duration-700 ${
                isPlaying ? 'scale-105 rotate-1' : 'scale-95'
              }`}
              onError={(e) => {
                (e.currentTarget as HTMLElement).style.display = 'none';
              }}
            />

            {/* Floating Music Notes Animation when playing */}
            {isPlaying && (
              <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                <Sparkles className="absolute top-4 right-4 w-5 h-5 text-amber-400 animate-bounce" />
                <Music2 className="absolute bottom-4 left-4 w-4 h-4 text-pink-400 animate-pulse" />
              </div>
            )}
          </div>

          {/* Equalizer Visualizer Bars */}
          <div className="flex items-end gap-1.5 h-7 mt-4">
            {[40, 75, 55, 90, 60, 85, 45, 95, 70, 50].map((height, idx) => (
              <div
                key={idx}
                className={`w-1 rounded-full transition-all duration-300 ${
                  isPlaying
                    ? theme === 'day'
                      ? 'bg-[#a34063]'
                      : 'bg-[#e65d96]'
                    : 'bg-stone-300 dark:bg-stone-700'
                }`}
                style={{
                  height: isPlaying ? `${Math.max(15, (height * (idx % 2 === 0 ? 1 : 0.7)))}%` : '20%',
                  transition: 'height 0.25s ease',
                }}
              />
            ))}
          </div>
        </div>

        {/* Right: Player Controls & Playlist */}
        <div className="md:col-span-7 flex flex-col justify-between space-y-5">
          {/* Track Info & Favorite */}
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-sans px-2 py-0.5 rounded bg-amber-400/15 text-amber-500 font-semibold">
                  {currentTrack.mood}
                </span>
                <span className="text-xs opacity-60">Track {currentTrackIndex + 1} of 5</span>
              </div>
              <h4 className="font-serif text-2xl font-bold mt-1 text-current">
                {currentTrack.title}
              </h4>
              <p className="text-xs sm:text-sm opacity-75 mt-1 font-sans">
                {currentTrack.description}
              </p>
            </div>

            <button
              onClick={() => toggleFavorite(currentTrack.id)}
              type="button"
              aria-label={isFavorited ? 'Remove from favorites' : 'Add to favorites'}
              className={`p-2.5 rounded-full border transition-all active:scale-90 ${
                isFavorited
                  ? 'bg-pink-500/20 text-pink-500 border-pink-400/40'
                  : 'bg-stone-100 dark:bg-stone-800 text-stone-400 border-transparent hover:text-pink-400'
              }`}
            >
              <Heart
                className={`w-5 h-5 ${isFavorited ? 'fill-pink-500' : ''}`}
              />
            </button>
          </div>

          {/* Progress Bar & Time */}
          <div className="space-y-1.5">
            <input
              type="range"
              min={0}
              max={currentTrack.duration}
              value={elapsedTime}
              onChange={handleSeek}
              aria-label="Seek track"
              className="w-full h-2 rounded-lg appearance-none cursor-pointer accent-pink-500 bg-stone-200 dark:bg-stone-700"
            />
            <div className="flex justify-between text-xs font-mono tabular-nums opacity-70">
              <span>{formatTime(elapsedTime)}</span>
              <span>{formatTime(currentTrack.duration)}</span>
            </div>
          </div>

          {/* Transport Controls (Shuffle, Prev, Play, Next, Repeat) */}
          <div className="flex items-center justify-between sm:justify-center sm:gap-6 pt-1">
            {/* Shuffle */}
            <button
              onClick={() => {
                sound.playClick();
                setIsShuffle(!isShuffle);
              }}
              type="button"
              aria-label="Toggle shuffle"
              title={isShuffle ? 'Shuffle is ON' : 'Shuffle is OFF'}
              className={`p-2 rounded-full transition-colors ${
                isShuffle
                  ? 'text-pink-500 bg-pink-500/10'
                  : 'opacity-50 hover:opacity-100 text-current'
              }`}
            >
              <Shuffle className="w-4 h-4" />
            </button>

            {/* Prev */}
            <button
              onClick={handlePrev}
              type="button"
              aria-label="Previous track"
              className="p-3 rounded-full hover:bg-stone-500/10 active:scale-90 transition-transform text-current"
            >
              <SkipBack className="w-5 h-5" />
            </button>

            {/* Play / Pause Primary CTA */}
            <button
              onClick={handleTogglePlay}
              type="button"
              aria-label={isPlaying ? 'Pause lullaby' : 'Play lullaby'}
              className={`w-14 h-14 rounded-full flex items-center justify-center text-white shadow-lg active:scale-95 transition-all duration-200 ${
                theme === 'day'
                  ? 'bg-[#a34063] hover:bg-[#8b3252] shadow-pink-900/20'
                  : 'bg-[#e65d96] hover:bg-[#d44883] shadow-pink-500/30'
              }`}
            >
              {isPlaying ? (
                <Pause className="w-6 h-6 fill-white" />
              ) : (
                <Play className="w-6 h-6 fill-white translate-x-0.5" />
              )}
            </button>

            {/* Next */}
            <button
              onClick={handleNext}
              type="button"
              aria-label="Next track"
              className="p-3 rounded-full hover:bg-stone-500/10 active:scale-90 transition-transform text-current"
            >
              <SkipForward className="w-5 h-5" />
            </button>

            {/* Repeat */}
            <button
              onClick={cycleRepeat}
              type="button"
              aria-label="Cycle repeat mode"
              title={`Repeat: ${repeatMode}`}
              className={`p-2 rounded-full transition-colors relative ${
                repeatMode !== 'off'
                  ? 'text-pink-500 bg-pink-500/10'
                  : 'opacity-50 hover:opacity-100 text-current'
              }`}
            >
              <Repeat className="w-4 h-4" />
              {repeatMode === 'one' && (
                <span className="absolute -top-1 -right-1 text-[9px] font-bold">1</span>
              )}
            </button>
          </div>

          {/* Playlist Track Selection List */}
          <div className="pt-2">
            <p className="text-xs font-semibold opacity-60 mb-2 font-sans">Playlist</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {TRACKS.map((track, idx) => (
                <button
                  key={track.id}
                  onClick={() => {
                    sound.playClick(600 + idx * 50);
                    setCurrentTrackIndex(idx);
                    setElapsedTime(0);
                    setIsPlaying(true);
                  }}
                  type="button"
                  className={`text-left p-2.5 rounded-xl text-xs transition-all flex items-center justify-between border ${
                    currentTrackIndex === idx
                      ? theme === 'day'
                        ? 'bg-[#fdeedf] border-[#f3c4d3] text-[#a34063] font-semibold'
                        : 'bg-[#17172c] border-[#e65d96]/40 text-[#e65d96] font-semibold'
                      : 'hover:bg-stone-500/5 border-transparent text-current opacity-80'
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    <span className="opacity-50 w-4 font-mono">{idx + 1}.</span>
                    <span className="truncate">{track.title}</span>
                  </div>
                  <span className="opacity-50 font-mono text-[11px] shrink-0 ml-1">
                    {formatTime(track.duration)}
                  </span>
                </button>
              ))}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
