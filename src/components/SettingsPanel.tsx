import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  X,
  User,
  Calendar,
  VenusAndMars,
  Sparkles,
  Palette,
  Save,
  Bookmark,
  Clock,
  Trash2,
} from 'lucide-react';
import { UserSettings, THEMES, ThemeId, BookmarkEntry, ReadingHistoryEntry } from '../hooks/useLocalStorage';

interface SettingsPanelProps {
  isOpen: boolean;
  onClose: () => void;
  settings: UserSettings;
  onSave: (updates: Partial<UserSettings>) => void;
}

export default function SettingsPanel({ isOpen, onClose, settings, onSave }: SettingsPanelProps) {
  const [name, setName] = useState(settings.name);
  const [dob, setDob] = useState(settings.dob);
  const [age, setAge] = useState(settings.age);
  const [sex, setSex] = useState(settings.sex);
  const [theme, setTheme] = useState<ThemeId>(settings.theme);
  const [saved, setSaved] = useState(false);

  if (!isOpen) return null;

  const handleSave = () => {
    onSave({ name, dob, age, sex, theme });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleRemoveBookmark = (key: string) => {
    onSave({ bookmarks: settings.bookmarks.filter((b) => b.key !== key) });
  };

  const handleClearHistory = () => {
    onSave({ readingHistory: [] });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      {/* Panel */}
      <motion.div
        initial={{ y: 30, scale: 0.95, opacity: 0 }}
        animate={{ y: 0, scale: 1, opacity: 1 }}
        exit={{ y: 20, scale: 0.95, opacity: 0 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className="relative w-full max-w-lg max-h-[85vh] overflow-y-auto scrollbar-hide bg-[#0c0c10] border border-white/[0.06] rounded-[2rem] p-8 shadow-2xl"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-xl font-serif text-white flex items-center gap-3">
            <Sparkles className="w-5 h-5 text-white/50" />
            Settings
          </h2>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/50 hover:text-white transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-8">
          {/* Profile Section */}
          <div>
            <h3 className="text-white/40 text-xs uppercase tracking-widest mb-4 flex items-center gap-2">
              <User className="w-3 h-3" /> Profile
            </h3>
            <div className="space-y-4">
              <div>
                <label className="text-white/30 text-[10px] uppercase tracking-widest mb-1.5 block">Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 bg-white/[0.03] border border-white/[0.08] rounded-xl text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-white/20 transition-all"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-white/30 text-[10px] uppercase tracking-widest mb-1.5 flex items-center gap-1.5 block">
                    <Calendar className="w-3 h-3" /> DOB
                  </label>
                  <input
                    type="date"
                    value={dob}
                    onChange={(e) => setDob(e.target.value)}
                    className="w-full px-4 py-3 bg-white/[0.03] border border-white/[0.08] rounded-xl text-white text-sm focus:outline-none focus:border-white/20 transition-all [color-scheme:dark]"
                  />
                </div>
                <div>
                  <label className="text-white/30 text-[10px] uppercase tracking-widest mb-1.5 block">Age</label>
                  <input
                    type="number"
                    min={1}
                    max={150}
                    value={age}
                    onChange={(e) => setAge(parseInt(e.target.value) || 0)}
                    className="w-full px-4 py-3 bg-white/[0.03] border border-white/[0.08] rounded-xl text-white text-sm focus:outline-none focus:border-white/20 transition-all"
                  />
                </div>
              </div>
              <div>
                <label className="text-white/30 text-[10px] uppercase tracking-widest mb-1.5 flex items-center gap-1.5 block">
                  <VenusAndMars className="w-3 h-3" /> Sex
                </label>
                <div className="flex gap-2">
                  {(['male', 'female', 'other'] as const).map((option) => (
                    <button
                      key={option}
                      onClick={() => setSex(option)}
                      className={`flex-1 py-2.5 px-3 rounded-xl border text-xs font-medium transition-all capitalize ${
                        sex === option
                          ? 'bg-white/10 border-white/20 text-white'
                          : 'bg-white/[0.02] border-white/[0.05] text-white/40 hover:text-white/70'
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Theme Section */}
          <div>
            <h3 className="text-white/40 text-xs uppercase tracking-widest mb-4 flex items-center gap-2">
              <Palette className="w-3 h-3" /> Theme
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {THEMES.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setTheme(t.id)}
                  className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${
                    theme === t.id
                      ? 'border-white/20 bg-white/10'
                      : 'border-white/[0.05] bg-white/[0.02] hover:border-white/10'
                  }`}
                >
                  <div
                    className="w-5 h-5 rounded-full border border-white/10 shrink-0"
                    style={{ backgroundColor: t.accent }}
                  />
                  <span className="text-white text-xs">{t.label}</span>
                </button>
              ))}
            </div>
          </div>


        </div>

        {/* Bookmarks Section */}
        {settings.bookmarks.length > 0 && (
          <div>
            <h3 className="text-white/40 text-xs uppercase tracking-widest mb-4 flex items-center gap-2">
              <Bookmark className="w-3 h-3" /> Saved Bookmarks ({settings.bookmarks.length})
            </h3>
            <div className="space-y-2 max-h-48 overflow-y-auto scrollbar-hide">
              {settings.bookmarks.map((bm) => (
                <div key={bm.key} className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/[0.05]">
                  <div className="w-8 h-10 rounded bg-white/[0.03] border border-white/[0.05] shrink-0 overflow-hidden flex items-center justify-center">
                    <Bookmark className="w-3 h-3 text-white/30" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-xs font-medium truncate">{bm.title}</p>
                    <p className="text-white/40 text-[10px] truncate">{bm.author}</p>
                  </div>
                  <button
                    onClick={() => handleRemoveBookmark(bm.key)}
                    className="w-7 h-7 rounded-lg bg-white/5 hover:bg-red-500/10 flex items-center justify-center text-white/30 hover:text-red-400 transition-all shrink-0"
                    title="Remove bookmark"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Reading History Section */}
        {settings.readingHistory.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white/40 text-xs uppercase tracking-widest flex items-center gap-2">
                <Clock className="w-3 h-3" /> Reading History ({settings.readingHistory.length})
              </h3>
              <button
                onClick={handleClearHistory}
                className="text-white/30 hover:text-red-400 text-[10px] transition-colors"
              >
                Clear all
              </button>
            </div>
            <div className="space-y-2 max-h-48 overflow-y-auto scrollbar-hide">
              {[...settings.readingHistory].reverse().slice(0, 10).map((entry) => (
                <div key={entry.key + entry.lastReadAt} className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/[0.05]">
                  <div className="w-8 h-10 rounded bg-white/[0.03] border border-white/[0.05] shrink-0 overflow-hidden flex items-center justify-center">
                    <Clock className="w-3 h-3 text-white/30" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-xs font-medium truncate">{entry.title}</p>
                    <p className="text-white/40 text-[10px]">
                      {entry.author} · {entry.progress}%
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Save Button */}
        <button
          onClick={handleSave}
          className="w-full mt-6 py-3.5 rounded-2xl bg-white text-black font-semibold text-sm flex items-center justify-center gap-2 hover:bg-white/90 transition-all"
        >
          {saved ? (
            <>
              <Save className="w-4 h-4" /> Saved!
            </>
          ) : (
            <>
              <Save className="w-4 h-4" /> Save Changes
            </>
          )}
        </button>
      </motion.div>
    </motion.div>
  );
}
