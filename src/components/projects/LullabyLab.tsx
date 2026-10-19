import React, { useState, useEffect, useRef } from 'react';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Shuffle,
  Repeat,
  Heart,
  Sparkles,
  Volume2,
  Moon,
  Sliders,
  Star,
  Clock,
  Waves
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
    duration: 136, // 2:16
    description: 'Golden morning warmth, soft chime arpeggios to welcome the day (Grieg: Morning Mood).',
    mood: 'Gentle & Uplifting',
    stars: 5,
    artwork: '/assets/lullaby/sunrise_lullaby.svg',
    audioUrl: '/audio/lullaby/track_1_sunrise.mp3',
  },
  {
    id: 'track-2',
    title: 'Starry Window',
    duration: 184, // 3:04
    description: 'Delicate glockenspiel notes reflecting off cool evening glass (Chopin: Nocturne Op. 9).',
    mood: 'Dreamy & Twinkling',
    stars: 5,
    artwork: '/assets/lullaby/starry_window.svg',
    audioUrl: '/audio/lullaby/track_2_starry_window.mp3',
  },
  {
    id: 'track-3',
    title: 'Moonlight Forest',
    duration: 238, // 3:58
    description: 'Deep woodland harp tones with peaceful night wind whispers (Beethoven: Moonlight Sonata).',
    mood: 'Mysterious & Soothing',
    stars: 4,
    artwork: '/assets/lullaby/moonlight_forest.svg',
    audioUrl: '/audio/lullaby/track_3_moonlight_forest.mp3',
  },
  {
    id: 'track-4',
    title: 'Cloud Parade',
    duration: 126, // 2:06
    description: 'Playful marshmallow clouds bouncing over twilight hills (Tchaikovsky: Sugar Plum Fairy).',
    mood: 'Warm & Cozy',
    stars: 5,
    artwork: '/assets/lullaby/cloud_parade.svg',
    audioUrl: '/audio/lullaby/track_4_cloud_parade.mp3',
  },
  {
    id: 'track-5',
    title: 'Goodnight World',
    duration: 198, // 3:18
    description: 'The final sleepy chime slowing down as sleepy eyes close (Grieg: Notturno Op. 54).',
    mood: 'Deep Sleep & Rest',
    stars: 5,
    artwork: '/assets/lullaby/goodnight_world.svg',
    audioUrl: '/audio/lullaby/track_5_goodnight_world.mp3',
  },
];

export const LullabyLab: React.FC<LullabyLabProps> = ({ theme, isSoundOn, toggleSound }) => {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [trackDuration, setTrackDuration] = useState(136);
  const [isShuffle, setIsShuffle] = useState(false);
  const [repeatMode, setRepeatMode] = useState<'off' | 'all' | 'one'>('all');
  const [favorites, setFavorites] = useState<string[]>(['track-1']);
  
  // Interactive feature states
  const [sleepTimerMinutes, setSleepTimerMinutes] = useState<number | null>(null);
  const [sleepTimerRemaining, setSleepTimerRemaining] = useState<number | null>(null);
  const [isSleepTimerMenuOpen, setIsSleepTimerMenuOpen] = useState(false);
  
  const [isAmbienceMenuOpen, setIsAmbienceMenuOpen] = useState(false);
  const [activeAmbience, setActiveAmbience] = useState<'none' | 'rain' | 'wind' | 'stardust'>('none');
  
  const [isVisualMode, setIsVisualMode] = useState(false);

  const currentTrack = TRACKS[currentTrackIndex];
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const progressBarRef = useRef<HTMLDivElement | null>(null);

  // Initialize audio source on mount
  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.src = TRACKS[0].audioUrl || '';
      audio.volume = isSoundOn ? 0.85 : 0;
      audio.muted = !isSoundOn;
    }
  }, []);

  // Handle global sound mute/unmute
  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.volume = isSoundOn ? 0.85 : 0;
      audio.muted = !isSoundOn;
    }
  }, [isSoundOn]);

  // Handle sleep timer countdown
  useEffect(() => {
    if (sleepTimerRemaining === null || sleepTimerRemaining <= 0) return;

    const timer = window.setInterval(() => {
      setSleepTimerRemaining((prev) => {
        if (prev === null || prev <= 1) {
          setIsPlaying(false);
          setSleepTimerMinutes(null);
          if (audioRef.current) audioRef.current.pause();
          sound.stopLullaby();
          sound.stopAmbience();
          setActiveAmbience('none');
          return null;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [sleepTimerRemaining]);

  // Clean, rock-solid track switching and playback
  const changeTrackAndPlay = (index: number, seekTime: number = 0) => {
    const audio = audioRef.current;
    if (!audio) return;

    sound.stopLullaby(); // Ensure synth chimes don't conflict

    const targetTrack = TRACKS[index];
    setCurrentTrackIndex(index);
    setTrackDuration(targetTrack.duration);
    setElapsedTime(seekTime);

    if (!isSoundOn) {
      toggleSound();
    }

    audio.muted = false;
    audio.volume = 0.85;

    // Check if source changed
    const targetUrl = targetTrack.audioUrl || '';
    if (!audio.src || !audio.src.endsWith(targetUrl)) {
      audio.src = targetUrl;
    }

    audio.currentTime = seekTime;

    const playPromise = audio.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          setIsPlaying(true);
        })
        .catch((err) => {
          console.warn('Audio play restricted, falling back to synth chimes:', err);
          sound.playLullabyPattern(targetTrack.title);
          setIsPlaying(true);
        });
    }
  };

  const handleTogglePlay = () => {
    sound.playClick(659.25);
    const audio = audioRef.current;
    if (!audio) return;

    if (!isSoundOn) {
      toggleSound();
    }

    if (isPlaying) {
      audio.pause();
      sound.stopLullaby();
      setIsPlaying(false);
    } else {
      sound.stopLullaby();
      audio.muted = false;
      audio.volume = 0.85;

      const currentUrl = currentTrack.audioUrl || '';
      if (!audio.src || !audio.src.endsWith(currentUrl)) {
        audio.src = currentUrl;
        audio.currentTime = elapsedTime;
      }

      audio.play().catch(() => {
        sound.playLullabyPattern(currentTrack.title);
      });
      setIsPlaying(true);
    }
  };

  const handleNext = () => {
    sound.playClick(783.99);
    const nextIdx = isShuffle
      ? Math.floor(Math.random() * TRACKS.length)
      : (currentTrackIndex + 1) % TRACKS.length;
    changeTrackAndPlay(nextIdx);
  };

  const handlePrev = () => {
    sound.playClick(523.25);
    const audio = audioRef.current;
    if (elapsedTime > 3 && audio) {
      audio.currentTime = 0;
      setElapsedTime(0);
    } else {
      const prevIdx = (currentTrackIndex - 1 + TRACKS.length) % TRACKS.length;
      changeTrackAndPlay(prevIdx);
    }
  };

  const handleSelectTrack = (index: number) => {
    sound.playClick(600 + index * 40);
    changeTrackAndPlay(index);
  };

  // Extended playback & progress bar seeking handler
  const handleProgressBarClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!progressBarRef.current || !audioRef.current) return;
    const rect = progressBarRef.current.getBoundingClientRect();
    const clickX = Math.max(0, Math.min(rect.width, e.clientX - rect.left));
    const pct = clickX / rect.width;

    const audio = audioRef.current;
    const dur = (audio.duration && !isNaN(audio.duration) && isFinite(audio.duration) && audio.duration > 0)
      ? audio.duration
      : currentTrack.duration;

    const newTime = Math.max(0, Math.min(dur, Math.round(pct * dur)));

    setElapsedTime(newTime);
    audio.currentTime = newTime;

    // If paused, immediately start playing from this exact position
    if (!isPlaying) {
      changeTrackAndPlay(currentTrackIndex, newTime);
    }
  };

  const handleTimeUpdate = () => {
    const audio = audioRef.current;
    if (audio) {
      const currentSec = Math.floor(audio.currentTime);
      setElapsedTime(currentSec);
    }
  };

  const handleLoadedMetadata = () => {
    const audio = audioRef.current;
    if (audio && audio.duration && !isNaN(audio.duration) && isFinite(audio.duration)) {
      setTrackDuration(Math.floor(audio.duration));
    }
  };

  const handleTrackEnded = () => {
    if (repeatMode === 'one') {
      const audio = audioRef.current;
      if (audio) {
        audio.currentTime = 0;
        audio.play().catch(() => {});
      }
      setElapsedTime(0);
    } else if (isShuffle) {
      const nextIndex = Math.floor(Math.random() * TRACKS.length);
      changeTrackAndPlay(nextIndex);
    } else if (repeatMode === 'all') {
      const nextIndex = (currentTrackIndex + 1) % TRACKS.length;
      changeTrackAndPlay(nextIndex);
    } else {
      setIsPlaying(false);
      setElapsedTime(0);
    }
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

  const handleSetSleepTimer = (minutes: number) => {
    sound.playClick(520);
    if (sleepTimerMinutes === minutes) {
      setSleepTimerMinutes(null);
      setSleepTimerRemaining(null);
    } else {
      setSleepTimerMinutes(minutes);
      setSleepTimerRemaining(minutes * 60);
    }
    setIsSleepTimerMenuOpen(false);
  };

  const handleToggleAmbience = (type: 'rain' | 'wind' | 'stardust') => {
    sound.playClick(440);
    if (!isSoundOn) toggleSound();

    if (activeAmbience === type) {
      sound.stopAmbience();
      setActiveAmbience('none');
    } else {
      sound.startAmbience(type);
      setActiveAmbience(type);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const isFavorited = favorites.includes(currentTrack.id);
  const effectiveDuration = (audioRef.current?.duration && !isNaN(audioRef.current.duration) && isFinite(audioRef.current.duration) && audioRef.current.duration > 0)
    ? Math.floor(audioRef.current.duration)
    : trackDuration || currentTrack.duration;

  const progressPercent = Math.min(100, Math.max(0, (elapsedTime / effectiveDuration) * 100));

  // Audio Equalizer Wave Heights (18 bars matching screenshot wave)
  const waveBars = [3, 4, 12, 22, 16, 28, 20, 32, 24, 30, 26, 18, 24, 14, 8, 4, 3, 2];

  return (
    <div
      className={`rounded-3xl p-6 sm:p-8 sm:px-10 border shadow-2xl transition-all duration-500 relative overflow-hidden ${
        isVisualMode
          ? 'ring-4 ring-purple-400/50 shadow-purple-900/40'
          : ''
      } ${
        theme === 'day'
          ? 'bg-gradient-to-b from-[#f7f0ea] to-[#eee2d7] border-[#e8c8bb] text-[#4a3528]'
          : 'bg-gradient-to-b from-[#1b1933] to-[#141327] border-[#39345e] text-[#f4effa]'
      }`}
    >
      {/* Persistent HTML5 Audio Element - No JSX src attribute to avoid React DOM reconciliation collisions */}
      <audio
        ref={audioRef}
        preload="auto"
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={handleTrackEnded}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onError={() => {
          console.warn('Audio tag encountered error, falling back to synth chimes');
          sound.playLullabyPattern(currentTrack.title);
        }}
      />

      {/* Visual Mode Atmospheric Nebula Backing */}
      {isVisualMode && (
        <div className="absolute inset-0 pointer-events-none opacity-25 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-300 via-pink-500 to-indigo-900 animate-pulse duration-1000" />
      )}

      {/* Top Header of The Lullaby Lab */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-black/10 dark:border-white/10 gap-4 relative z-10">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span
              className={`text-[11px] font-bold tracking-wider uppercase font-sans ${
                theme === 'day' ? 'text-[#8c3555]' : 'text-[#f48fb1]'
              }`}
            >
              PROJECT 01 - DREAM AUDIO • High Quality Music Box
            </span>
          </div>
          <h3 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight">
            The Lullaby Lab
          </h3>
        </div>

        <div className="flex items-center gap-3">
          {!isSoundOn && (
            <button
              onClick={toggleSound}
              type="button"
              className="text-xs text-amber-500 font-sans flex items-center gap-1.5 bg-amber-500/10 px-3 py-1.5 rounded-full border border-amber-500/25 hover:bg-amber-500/20 transition-colors"
            >
              <Volume2 className="w-3.5 h-3.5" />
              Unmute Audio
            </button>
          )}

          {/* Playing Synth Pill Badge */}
          <span
            className={`text-xs px-3.5 py-1.5 rounded-full font-sans font-medium border flex items-center gap-1.5 transition-all duration-300 ${
              isPlaying
                ? theme === 'day'
                  ? 'bg-teal-500/20 text-teal-800 border-teal-500/30 shadow-sm'
                  : 'bg-teal-400/20 text-teal-200 border-teal-400/30 shadow-[0_0_12px_rgba(45,212,191,0.2)]'
                : 'bg-stone-500/10 text-stone-500 border-stone-500/20'
            }`}
          >
            <span className={isPlaying ? 'animate-spin-slow' : ''}>♪</span>
            {isPlaying ? 'Playing High-Res Audio' : 'Ready to Sleep'}
          </span>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 pt-8 items-start relative z-10">
        
        {/* LEFT COLUMN: Dedicated Album Artwork & Visualizer */}
        <div className="lg:col-span-4 flex flex-col items-center justify-center">
          {/* Dedicated Song Image Artwork Card */}
          <div
            className={`relative w-56 sm:w-64 aspect-square rounded-3xl p-3 border shadow-2xl flex items-center justify-center overflow-hidden transition-all duration-500 group ${
              isPlaying
                ? 'ring-4 ring-amber-400/40 shadow-amber-500/20 scale-[1.02]'
                : 'hover:scale-[1.01]'
            } ${
              theme === 'day'
                ? 'bg-white/90 border-[#e8c8bb]'
                : 'bg-[#232040]/90 border-white/10'
            }`}
          >
            {/* Dedicated artwork for selected song */}
            <img
              key={currentTrack.id}
              src={currentTrack.artwork || '/assets/lullaby/sunrise_lullaby.svg'}
              alt={`${currentTrack.title} dedicated artwork`}
              className="w-full h-full object-cover rounded-2xl transition-all duration-700 animate-in fade-in zoom-in-95"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src = '/assets/pip_lullaby_box.png';
              }}
            />

            {/* Subtle glow overlay when playing */}
            {isPlaying && (
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-white/10 pointer-events-none rounded-2xl" />
            )}
          </div>

          {/* Equalizer Wave bar below artwork: · · || ||||| ||||||| · · · */}
          <div className="flex items-center justify-center gap-1.5 h-8 mt-5 px-3 py-1">
            {waveBars.map((baseH, idx) => {
              const activeHeight = isPlaying
                ? Math.max(3, baseH * (0.6 + Math.sin(elapsedTime * 3 + idx * 0.8) * 0.4))
                : idx < 2 || idx > 15
                ? 3
                : 4;

              return (
                <div
                  key={idx}
                  className={`w-1 rounded-full transition-all duration-200 ${
                    idx < 2 || idx > 15
                      ? 'w-1 h-1 rounded-full'
                      : ''
                  } ${
                    isPlaying
                      ? theme === 'day'
                        ? 'bg-gradient-to-t from-[#a34063] to-amber-500'
                        : 'bg-gradient-to-t from-[#e65d96] to-sky-300'
                      : 'bg-stone-300 dark:bg-stone-700'
                  }`}
                  style={{
                    height: idx < 2 || idx > 15 ? '4px' : `${activeHeight}px`,
                  }}
                />
              );
            })}
          </div>
        </div>

        {/* CENTER COLUMN: Main Glass Player Card */}
        <div className="lg:col-span-6 flex flex-col justify-between">
          <div
            className={`rounded-3xl p-6 sm:p-7 border backdrop-blur-xl shadow-2xl transition-all duration-300 space-y-5 ${
              theme === 'day'
                ? 'bg-white/85 border-[#f1d2c6] shadow-stone-300/40'
                : 'bg-[#211f3d]/85 border-white/15 shadow-black/50 text-white'
            }`}
          >
            {/* Top Row: Mood Badge + Track Index & Heart / Playing Indicator */}
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <span
                    className={`text-xs px-2.5 py-0.5 rounded font-semibold font-sans tracking-wide ${
                      theme === 'day'
                        ? 'bg-amber-100 text-amber-800 border border-amber-300'
                        : 'bg-amber-500/25 text-amber-300 border border-amber-400/30'
                    }`}
                  >
                    {currentTrack.mood}
                  </span>
                  <span className="text-xs opacity-60 font-sans">
                    Track {currentTrackIndex + 1} of {TRACKS.length}
                  </span>
                </div>
                
                {/* Song Title */}
                <h4 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight">
                  {currentTrack.title}
                </h4>
                
                {/* Description */}
                <p className="text-xs sm:text-sm opacity-75 mt-1 font-sans leading-relaxed">
                  {currentTrack.description}
                </p>
              </div>

              {/* Heart Favorite & Playing State */}
              <div className="flex flex-col items-center gap-1 shrink-0 ml-3">
                <button
                  onClick={() => toggleFavorite(currentTrack.id)}
                  type="button"
                  aria-label={isFavorited ? 'Remove from favorites' : 'Add to favorites'}
                  className={`w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200 border ${
                    isFavorited
                      ? 'bg-pink-500/20 text-pink-500 border-pink-400/40 shadow-sm shadow-pink-500/20 scale-105'
                      : 'bg-white/40 dark:bg-black/20 text-stone-400 border-black/10 dark:border-white/10 hover:text-pink-400'
                  }`}
                >
                  <Heart
                    className={`w-4 h-4 transition-transform ${
                      isFavorited ? 'fill-pink-500 scale-110' : ''
                    }`}
                  />
                </button>
                <span className="text-[11px] font-sans opacity-70">
                  {isPlaying ? 'Playing' : 'Paused'}
                </span>
              </div>
            </div>

            {/* Scrubber Progress Bar with Glowing Star Head */}
            <div className="space-y-1.5 pt-1">
              <div
                ref={progressBarRef}
                onClick={handleProgressBarClick}
                className="relative w-full h-3 flex items-center cursor-pointer group py-1"
                role="slider"
                aria-label="Track playback progress"
                aria-valuenow={elapsedTime}
                aria-valuemin={0}
                aria-valuemax={effectiveDuration}
              >
                {/* Progress Track Background */}
                <div className="w-full h-1.5 bg-stone-300/70 dark:bg-white/20 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-amber-400 via-pink-400 to-pink-500 rounded-full transition-all duration-150"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>

                {/* Glowing Star Scrubber Head */}
                <div
                  className="absolute -translate-x-1/2 pointer-events-none transition-all duration-150 flex items-center justify-center drop-shadow-[0_0_8px_rgba(251,191,36,0.9)]"
                  style={{ left: `${progressPercent}%` }}
                >
                  <Star className="w-4 h-4 fill-amber-300 text-amber-300 transition-transform group-hover:scale-125" />
                </div>
              </div>

              {/* Time stamps */}
              <div className="flex justify-between text-xs font-mono tabular-nums opacity-65 px-0.5">
                <span>{formatTime(elapsedTime)}</span>
                <span>{formatTime(effectiveDuration)}</span>
              </div>
            </div>

            {/* Transport Controls (Shuffle, Prev, Play/Pause Pill, Next, Repeat) */}
            <div className="flex items-center justify-center gap-5 sm:gap-7 pt-1">
              {/* Shuffle */}
              <button
                onClick={() => {
                  sound.playClick();
                  setIsShuffle(!isShuffle);
                }}
                type="button"
                aria-label="Toggle shuffle"
                title={isShuffle ? 'Shuffle is ON' : 'Shuffle is OFF'}
                className={`p-2 rounded-full transition-all duration-200 ${
                  isShuffle
                    ? 'text-pink-500 bg-pink-500/15 ring-1 ring-pink-500/30'
                    : 'opacity-50 hover:opacity-100 hover:bg-black/5 dark:hover:bg-white/10'
                }`}
              >
                <Shuffle className="w-4 h-4" />
              </button>

              {/* SkipBack */}
              <button
                onClick={handlePrev}
                type="button"
                aria-label="Previous track"
                className="p-2.5 rounded-full hover:bg-black/5 dark:hover:bg-white/10 active:scale-90 transition-transform"
              >
                <SkipBack className="w-5 h-5 fill-current opacity-85" />
              </button>

              {/* Play / Pause Pill Button */}
              <button
                onClick={handleTogglePlay}
                type="button"
                aria-label={isPlaying ? 'Pause lullaby' : 'Play lullaby'}
                className={`w-16 h-12 rounded-2xl flex items-center justify-center shadow-lg active:scale-95 transition-all duration-200 ${
                  theme === 'day'
                    ? 'bg-[#faa160] hover:bg-[#f8954d] text-stone-900 shadow-amber-900/20'
                    : 'bg-[#ffc288] hover:bg-[#ffb673] text-stone-950 shadow-black/40'
                }`}
              >
                {isPlaying ? (
                  <Pause className="w-6 h-6 fill-current" />
                ) : (
                  <Play className="w-6 h-6 fill-current translate-x-0.5" />
                )}
              </button>

              {/* SkipForward */}
              <button
                onClick={handleNext}
                type="button"
                aria-label="Next track"
                className="p-2.5 rounded-full hover:bg-black/5 dark:hover:bg-white/10 active:scale-90 transition-transform"
              >
                <SkipForward className="w-5 h-5 fill-current opacity-85" />
              </button>

              {/* Repeat */}
              <button
                onClick={cycleRepeat}
                type="button"
                aria-label="Cycle repeat mode"
                title={`Repeat: ${repeatMode}`}
                className={`p-2 rounded-full transition-all duration-200 relative ${
                  repeatMode !== 'off'
                    ? 'text-pink-500 bg-pink-500/15 ring-1 ring-pink-500/30'
                    : 'opacity-50 hover:opacity-100 hover:bg-black/5 dark:hover:bg-white/10'
                }`}
              >
                <Repeat className="w-4 h-4" />
                {repeatMode === 'one' && (
                  <span className="absolute -top-1 -right-1 text-[9px] font-bold">1</span>
                )}
              </button>
            </div>

            {/* Playlist Grid with Dedicated Song Thumbnails */}
            <div className="pt-2 border-t border-black/10 dark:border-white/10">
              <p className="text-xs font-semibold opacity-60 uppercase tracking-wider mb-2.5 font-sans">
                Playlist
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {TRACKS.map((track, idx) => {
                  const isSelected = currentTrackIndex === idx;

                  return (
                    <button
                      key={track.id}
                      onClick={() => handleSelectTrack(idx)}
                      type="button"
                      className={`text-left p-2 rounded-xl text-xs transition-all duration-200 flex items-center justify-between border group ${
                        isSelected
                          ? theme === 'day'
                            ? 'bg-amber-100/80 border-amber-300 text-stone-900 font-semibold shadow-sm'
                            : 'bg-white/20 border-white/30 text-white font-semibold shadow-md'
                          : 'hover:bg-black/5 dark:hover:bg-white/10 border-transparent text-current opacity-85 hover:opacity-100'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        {/* Miniature Artwork Thumbnail */}
                        <div className="w-7 h-7 rounded-lg overflow-hidden shrink-0 border border-black/10 dark:border-white/20 bg-stone-800">
                          <img
                            src={track.artwork || '/assets/lullaby/sunrise_lullaby.svg'}
                            alt=""
                            className="w-full h-full object-cover"
                          />
                        </div>

                        <span className="opacity-50 font-mono text-[11px] shrink-0">
                          {idx + 1}.
                        </span>
                        
                        <span className="truncate">{track.title}</span>
                      </div>

                      <span className="opacity-55 font-mono text-[11px] shrink-0 ml-1.5">
                        {formatTime(track.duration)}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

          </div>
        </div>

        {/* RIGHT COLUMN: Feature Action Buttons (Sleep Timer, Ambience Mix, Visual Mode) */}
        <div className="lg:col-span-2 flex flex-col gap-3">
          {/* 1. Sleep Timer Card / Button */}
          <div className="relative">
            <button
              onClick={() => setIsSleepTimerMenuOpen(!isSleepTimerMenuOpen)}
              type="button"
              className={`w-full p-3.5 rounded-2xl border text-left transition-all duration-200 flex items-center gap-3 shadow-md hover:scale-[1.02] ${
                sleepTimerMinutes
                  ? 'bg-amber-500/25 border-amber-400/40 text-amber-300'
                  : theme === 'day'
                  ? 'bg-white/80 border-[#e8c8bb] hover:bg-white text-stone-800'
                  : 'bg-[#232040]/80 border-white/10 hover:bg-[#232040] text-stone-200'
              }`}
            >
              <div className="w-8 h-8 rounded-xl bg-amber-400/20 text-amber-400 flex items-center justify-center shrink-0">
                <Moon className="w-4 h-4" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-xs font-semibold leading-tight">Sleep Timer</div>
                <div className="text-[10px] opacity-70 truncate">
                  {sleepTimerRemaining
                    ? `${formatTime(sleepTimerRemaining)} left`
                    : '15, 30, 60 mnt'}
                </div>
              </div>
            </button>

            {/* Sleep Timer Options Dropdown */}
            {isSleepTimerMenuOpen && (
              <div
                className={`absolute right-0 top-full mt-2 w-48 p-2 rounded-2xl border shadow-xl z-30 animate-in fade-in zoom-in-95 ${
                  theme === 'day'
                    ? 'bg-white border-stone-200 text-stone-800'
                    : 'bg-[#1e1c38] border-white/15 text-white'
                }`}
              >
                <div className="px-2 py-1 text-[11px] font-semibold opacity-60 flex items-center gap-1">
                  <Clock className="w-3 h-3" /> Select duration
                </div>
                {[15, 30, 60].map((mins) => (
                  <button
                    key={mins}
                    onClick={() => handleSetSleepTimer(mins)}
                    type="button"
                    className={`w-full text-left px-3 py-1.5 rounded-xl text-xs flex items-center justify-between transition-colors ${
                      sleepTimerMinutes === mins
                        ? 'bg-amber-400/25 font-bold text-amber-500'
                        : 'hover:bg-black/5 dark:hover:bg-white/10'
                    }`}
                  >
                    <span>{mins} minutes</span>
                    {sleepTimerMinutes === mins && <span className="text-[10px]">Active</span>}
                  </button>
                ))}
                {sleepTimerMinutes && (
                  <button
                    onClick={() => handleSetSleepTimer(0)}
                    type="button"
                    className="w-full text-left px-3 py-1.5 rounded-xl text-xs text-rose-400 hover:bg-rose-500/10 mt-1"
                  >
                    Cancel Timer
                  </button>
                )}
              </div>
            )}
          </div>

          {/* 2. Ambience Mix Card / Button */}
          <div className="relative">
            <button
              onClick={() => setIsAmbienceMenuOpen(!isAmbienceMenuOpen)}
              type="button"
              className={`w-full p-3.5 rounded-2xl border text-left transition-all duration-200 flex items-center gap-3 shadow-md hover:scale-[1.02] ${
                activeAmbience !== 'none'
                  ? 'bg-sky-500/25 border-sky-400/40 text-sky-300'
                  : theme === 'day'
                  ? 'bg-white/80 border-[#e8c8bb] hover:bg-white text-stone-800'
                  : 'bg-[#232040]/80 border-white/10 hover:bg-[#232040] text-stone-200'
              }`}
            >
              <div className="w-8 h-8 rounded-xl bg-sky-400/20 text-sky-400 flex items-center justify-center shrink-0">
                <Sliders className="w-4 h-4" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-xs font-semibold leading-tight">Ambience Mix</div>
                <div className="text-[10px] opacity-70 capitalize truncate">
                  {activeAmbience !== 'none' ? `Playing: ${activeAmbience}` : 'Background audio'}
                </div>
              </div>
            </button>

            {/* Ambience Mix Dropdown */}
            {isAmbienceMenuOpen && (
              <div
                className={`absolute right-0 top-full mt-2 w-48 p-2 rounded-2xl border shadow-xl z-30 animate-in fade-in zoom-in-95 ${
                  theme === 'day'
                    ? 'bg-white border-stone-200 text-stone-800'
                    : 'bg-[#1e1c38] border-white/15 text-white'
                }`}
              >
                <div className="px-2 py-1 text-[11px] font-semibold opacity-60 flex items-center gap-1">
                  <Waves className="w-3 h-3" /> Nature Sounds
                </div>
                {[
                  { id: 'stardust', label: '✨ Stardust Hum' },
                  { id: 'wind', label: '🍃 Night Wind' },
                  { id: 'rain', label: '🌧️ Sleepy Rain' },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() =>
                      handleToggleAmbience(item.id as 'rain' | 'wind' | 'stardust')
                    }
                    type="button"
                    className={`w-full text-left px-3 py-1.5 rounded-xl text-xs flex items-center justify-between transition-colors ${
                      activeAmbience === item.id
                        ? 'bg-sky-400/25 font-bold text-sky-400'
                        : 'hover:bg-black/5 dark:hover:bg-white/10'
                    }`}
                  >
                    <span>{item.label}</span>
                    {activeAmbience === item.id && (
                      <span className="text-[10px] text-emerald-400">ON</span>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* 3. Visual Mode Card / Button */}
          <button
            onClick={() => {
              sound.playSparkle();
              setIsVisualMode(!isVisualMode);
            }}
            type="button"
            className={`w-full p-3.5 rounded-2xl border text-left transition-all duration-200 flex items-center gap-3 shadow-md hover:scale-[1.02] ${
              isVisualMode
                ? 'bg-pink-500/25 border-pink-400/40 text-pink-300 ring-2 ring-pink-400/30'
                : theme === 'day'
                ? 'bg-white/80 border-[#e8c8bb] hover:bg-white text-stone-800'
                : 'bg-[#232040]/80 border-white/10 hover:bg-[#232040] text-stone-200'
            }`}
          >
            <div className="w-8 h-8 rounded-xl bg-pink-400/20 text-pink-400 flex items-center justify-center shrink-0">
              <Sparkles className="w-4 h-4" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-xs font-semibold leading-tight">Visual Mode</div>
              <div className="text-[10px] opacity-70">
                {isVisualMode ? '✨ Active' : 'Starlight glow'}
              </div>
            </div>
          </button>
        </div>

      </div>
    </div>
  );
};
