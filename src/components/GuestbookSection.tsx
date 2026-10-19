import React, { useState, useEffect } from 'react';
import { MessageSquare, Send, CheckCircle2, Trash2, Sparkles, Heart } from 'lucide-react';
import { ThemeMode, GuestbookEntry } from '../types';
import { sound } from '../utils/soundEngine';

interface GuestbookSectionProps {
  theme: ThemeMode;
}

const SEED_ENTRIES: GuestbookEntry[] = [
  {
    id: 'seed-1',
    name: 'Barnaby the Owl',
    message: 'Hoot! Your Starry Window lullaby helped all three of my owlets fall fast asleep through the dawn.',
    stamp: '🌙',
    date: 'Oct 17, 2026',
    isUserAdded: false,
  },
  {
    id: 'seed-2',
    name: 'Mimi the Star-catcher',
    message: 'Pip, thank you for the Heart Lantern! The honey-amber glow chases the dark bedroom shadows away so gently.',
    stamp: '🌟',
    date: 'Oct 16, 2026',
    isUserAdded: false,
  },
  {
    id: 'seed-3',
    name: 'Little Bear',
    message: 'Warm honey milk and cloud dreams are my favorites now. Pip is the best dream engineer ever! Zzz...',
    stamp: '🍯',
    date: 'Oct 15, 2026',
    isUserAdded: false,
  },
  {
    id: 'seed-4',
    name: 'Flora the Moth',
    message: 'Your nightlights are the gentlest in the entire forest. Not harsh at all, just soothing starlight.',
    stamp: '🌸',
    date: 'Oct 14, 2026',
    isUserAdded: false,
  },
];

const STAMPS = ['🌟', '🌙', '💤', '🌸', '🍯', '☁️'];

export const GuestbookSection: React.FC<GuestbookSectionProps> = ({ theme }) => {
  const [entries, setEntries] = useState<GuestbookEntry[]>(SEED_ENTRIES);
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [selectedStamp, setSelectedStamp] = useState('🌟');
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem('pip_guestbook_entries');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setEntries(parsed);
        }
      }
    } catch {
      // Ignore
    }
  }, []);

  const saveToStorage = (newEntries: GuestbookEntry[]) => {
    setEntries(newEntries);
    try {
      localStorage.setItem('pip_guestbook_entries', JSON.stringify(newEntries));
    } catch {
      // Ignore
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);

    const trimmedName = name.trim();
    const trimmedMessage = message.trim();

    if (!trimmedName) {
      setError('Please provide your name or sleepy moniker.');
      return;
    }
    if (trimmedName.length > 40) {
      setError('Name must be 40 characters or fewer.');
      return;
    }
    if (!trimmedMessage) {
      setError('Please write a gentle bedtime note for Pip.');
      return;
    }
    if (trimmedMessage.length > 200) {
      setError('Message must be under 200 characters.');
      return;
    }

    sound.playSparkle();

    const newEntry: GuestbookEntry = {
      id: `user-${Date.now()}`,
      name: trimmedName,
      message: trimmedMessage,
      stamp: selectedStamp,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      isUserAdded: true,
    };

    const updated = [newEntry, ...entries];
    saveToStorage(updated);

    setName('');
    setMessage('');
    setSuccessMsg('✨ Your cozy note has been added to the Observatory Log!');
    setTimeout(() => setSuccessMsg(null), 5000);
  };

  const handleDelete = (id: string) => {
    sound.playClick(400);
    const updated = entries.filter((e) => e.id !== id);
    saveToStorage(updated);
  };

  return (
    <section id="guestbook" className="py-12 sm:py-20 px-4 sm:px-6 max-w-7xl mx-auto space-y-12">
      {/* Section Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider font-sans px-3 py-1 rounded-full border border-pink-400/30 bg-pink-500/10 text-pink-500">
          <MessageSquare className="w-3.5 h-3.5" />
          Observatory Visitor Log
        </div>
        <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-current">
          The Bedtime Guestbook
        </h2>
        <p className="text-sm sm:text-base opacity-80 font-sans leading-relaxed">
          Leave a warm note for Pip before bedtime! Each message is signed with your favorite starlight stamp.
        </p>

        {/* Honest Disclaimer Banner */}
        <div className="inline-block text-xs px-3.5 py-1.5 rounded-xl border border-stone-300/60 dark:border-stone-700/60 opacity-80 font-sans">
          📌 <span className="font-medium">Browser-Local Guestbook:</span> Notes are stored locally on your device in your browser.
        </div>
      </div>

      {/* Guestbook Form & Entries Split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left: Input Form */}
        <div
          className={`lg:col-span-5 p-6 sm:p-8 rounded-3xl border shadow-xl transition-all ${
            theme === 'day'
              ? 'bg-[#fffdf9] border-[#f3c4d3] text-[#5c4033]'
              : 'bg-[#24213d] border-[#e65d96]/30 text-[#fff0e8]'
          }`}
        >
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <h3 className="font-serif text-xl sm:text-2xl font-bold">Leave a Note for Pip</h3>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 font-sans text-xs">
            {/* Name Input */}
            <div className="space-y-1.5">
              <label htmlFor="guest-name" className="block font-semibold opacity-80">
                Your Name or Moniker <span className="text-pink-500">*</span>
              </label>
              <input
                id="guest-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                maxLength={40}
                placeholder="e.g. Barnaby the Owl, Sleepy Traveler..."
                className={`w-full px-4 py-2.5 rounded-xl border text-sm transition-all focus:outline-none focus:ring-2 ${
                  theme === 'day'
                    ? 'bg-white border-stone-200 focus:ring-[#a34063]/30 focus:border-[#a34063]'
                    : 'bg-[#17172c] border-purple-900/60 focus:ring-[#e65d96]/40 focus:border-[#e65d96]'
                }`}
              />
            </div>

            {/* Stamp Selector */}
            <div className="space-y-1.5">
              <span className="block font-semibold opacity-80">
                Choose a Bedtime Stamp:
              </span>
              <div className="flex gap-2">
                {STAMPS.map((stamp) => (
                  <button
                    key={stamp}
                    type="button"
                    onClick={() => {
                      sound.playClick();
                      setSelectedStamp(stamp);
                    }}
                    className={`w-9 h-9 rounded-xl border text-lg flex items-center justify-center transition-all ${
                      selectedStamp === stamp
                        ? 'bg-pink-500/20 border-pink-400 scale-110 shadow-sm'
                        : 'border-stone-300/40 dark:border-stone-700/40 hover:bg-stone-500/10'
                    }`}
                  >
                    {stamp}
                  </button>
                ))}
              </div>
            </div>

            {/* Message Input */}
            <div className="space-y-1.5">
              <div className="flex justify-between">
                <label htmlFor="guest-message" className="font-semibold opacity-80">
                  Your Message <span className="text-pink-500">*</span>
                </label>
                <span className="opacity-60 tabular-nums">
                  {message.length} / 200
                </span>
              </div>
              <textarea
                id="guest-message"
                rows={3}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                maxLength={200}
                placeholder="Share a bedtime wish, thank Pip for a lullaby, or suggest a starry dream..."
                className={`w-full px-4 py-2.5 rounded-xl border text-sm transition-all focus:outline-none focus:ring-2 resize-none ${
                  theme === 'day'
                    ? 'bg-white border-stone-200 focus:ring-[#a34063]/30 focus:border-[#a34063]'
                    : 'bg-[#17172c] border-purple-900/60 focus:ring-[#e65d96]/40 focus:border-[#e65d96]'
                }`}
              />
            </div>

            {/* Error Message */}
            {error && (
              <p className="text-xs text-rose-500 bg-rose-500/10 p-2.5 rounded-xl border border-rose-500/20">
                {error}
              </p>
            )}

            {/* Success Message */}
            {successMsg && (
              <div className="flex items-center gap-1.5 text-xs text-emerald-500 bg-emerald-500/10 p-2.5 rounded-xl border border-emerald-500/20">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{successMsg}</span>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              className={`w-full py-3 px-4 rounded-xl font-medium text-sm transition-all duration-300 text-white shadow-md flex items-center justify-center gap-2 active:scale-98 ${
                theme === 'day'
                  ? 'bg-[#a34063] hover:bg-[#8b3252]'
                  : 'bg-[#e65d96] hover:bg-[#d44883]'
              }`}
            >
              <Send className="w-4 h-4" />
              <span>Post to Bedtime Log</span>
            </button>
          </form>
        </div>

        {/* Right: Message Cards Feed */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-stone-200/50 dark:border-stone-800">
            <span className="text-xs uppercase font-semibold opacity-60 font-sans">
              Recent Visitor Notes ({entries.length})
            </span>
            <span className="text-xs opacity-60 font-sans flex items-center gap-1">
              <Heart className="w-3 h-3 text-pink-400 fill-pink-400" /> Whispers from sleepy friends
            </span>
          </div>

          <div className="space-y-3.5 max-h-[500px] overflow-y-auto pr-1">
            {entries.map((entry) => (
              <div
                key={entry.id}
                className={`p-4 sm:p-5 rounded-2xl border transition-all shadow-sm ${
                  theme === 'day'
                    ? 'bg-[#fffdf9] border-[#f3c4d3] text-[#5c4033]'
                    : 'bg-[#24213d] border-[#e65d96]/30 text-[#fff0e8]'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <span className="text-2xl p-1 bg-stone-100 dark:bg-stone-800 rounded-xl shadow-inner">
                      {entry.stamp}
                    </span>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-serif font-bold text-base leading-tight">
                          {entry.name}
                        </h4>
                        {entry.isUserAdded && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-pink-500/10 text-pink-500 font-semibold font-sans">
                            You
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] opacity-60 font-sans">
                        {entry.date}
                      </span>
                    </div>
                  </div>

                  {entry.isUserAdded && (
                    <button
                      onClick={() => handleDelete(entry.id)}
                      type="button"
                      aria-label="Delete your note"
                      title="Remove your message"
                      className="p-1.5 rounded-lg opacity-40 hover:opacity-100 hover:text-rose-500 transition-opacity"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>

                <p className="mt-3 text-xs sm:text-sm opacity-85 leading-relaxed font-sans italic">
                  "{entry.message}"
                </p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};
