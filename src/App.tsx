import React, { useState, useEffect, useCallback } from 'react';
import { books, zodiacData } from './data';
import {
  Sun,
  Bookmark,
  X,
  BookOpen,
  Clock,
  Play,
  Star,
  Heart,
  MessageSquare,
  ChevronRight,
  Zap,
  Search,
  Settings,
  User,
  BookmarkCheck,
  History,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import ReaderOverlay, { type ReadableBook } from './components/ReaderOverlay';
import CelestialBackground from './components/CelestialBackground';
import OnboardingModal from './components/OnboardingModal';
import SettingsPanel from './components/SettingsPanel';
import SearchResults from './components/SearchResults';
import { useLocalStorage, DEFAULT_USER_SETTINGS, applyTheme, UserSettings, BookmarkEntry, ReadingHistoryEntry } from './hooks/useLocalStorage';

export default function App() {
  const [settings, setSettings] = useLocalStorage<UserSettings>('glyph-settings', DEFAULT_USER_SETTINGS);
  const [activeBook, setActiveBook] = useState<typeof books[0] | null>(null);
  const [readingBook, setReadingBook] = useState<typeof books[0] | null>(books[0]);
  const [readingSearchBook, setReadingSearchBook] = useState<ReadableBook | null>(null);
  const [isReading, setIsReading] = useState(false);
  const [readingProgress, setReadingProgress] = useState(42);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [isOnboarding, setIsOnboarding] = useState(!settings.onboardingComplete);

  // Apply theme on mount and when theme changes
  useEffect(() => {
    applyTheme(settings.theme);
  }, [settings.theme]);

  // Apply user's background color
  useEffect(() => {
    document.body.style.backgroundColor = 'var(--theme-bg)';
  }, [settings.theme]);

  const todayZodiac = zodiacData.find(z => z.id === 'gemini') || zodiacData[0];

  const handleOnboardingComplete = useCallback((updates: Partial<UserSettings>) => {
    setSettings(prev => ({ ...prev, ...updates }));
    setIsOnboarding(false);
  }, [setSettings]);

  const handleSettingsSave = useCallback((updates: Partial<UserSettings>) => {
    setSettings(prev => ({ ...prev, ...updates }));
  }, [setSettings]);

  // Bookmark toggle handler
  const handleToggleBookmark = useCallback(
    (book: { key: string; title: string; author: string; coverId?: number; ia?: string }) => {
      setSettings((prev) => {
        const exists = prev.bookmarks.find((b) => b.key === book.key);
        if (exists) {
          return { ...prev, bookmarks: prev.bookmarks.filter((b) => b.key !== book.key) };
        }
        const newBookmark: BookmarkEntry = {
          key: book.key,
          title: book.title,
          author: book.author,
          coverId: book.coverId,
          ia: book.ia,
          addedAt: new Date().toISOString(),
        };
        return { ...prev, bookmarks: [...prev.bookmarks, newBookmark] };
      });
    },
    [setSettings]
  );

  // Handle opening a search result book in the in-app reader
  const handleReadInApp = useCallback((book: ReadableBook) => {
    setReadingSearchBook(book);
    setIsReading(true);
    setReadingProgress(0);
  }, []);

  // Handle closing the reader
  const handleCloseReader = useCallback(() => {
    setIsReading(false);
    setReadingSearchBook(null);
  }, []);

  // Reading history handler
  const handleReadingOpen = useCallback(
    (book: { key: string; title: string; author: string; coverId?: number; ia?: string }) => {
      setSettings((prev) => {
        const now = new Date().toISOString();
        const existing = prev.readingHistory.find((r) => r.key === book.key);
        if (existing) {
          return {
            ...prev,
            readingHistory: prev.readingHistory.map((r) =>
              r.key === book.key ? { ...r, lastReadAt: now, progress: Math.min(r.progress + 5, 100) } : r
            ),
          };
        }
        const newEntry: ReadingHistoryEntry = {
          key: book.key,
          title: book.title,
          author: book.author,
          coverId: book.coverId,
          ia: book.ia,
          openedAt: now,
          lastReadAt: now,
          progress: 5,
        };
        return { ...prev, readingHistory: [...prev.readingHistory, newEntry] };
      });
    },
    [setSettings]
  );

  const handleSearchSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setShowSearchResults(true);
    }
  }, [searchQuery]);

  return (
    <>
      {/* Immersive Background */}
      <CelestialBackground />

      {/* Onboarding Modal - First time user */}
      {isOnboarding && (
        <OnboardingModal onComplete={handleOnboardingComplete} />
      )}

      {/* Main App Content */}
      <div className="relative z-10 min-h-screen text-white font-sans selection:bg-white/20">
        <div className="max-w-[1400px] mx-auto p-4 md:p-8 lg:p-10 flex flex-col h-screen overflow-y-auto scrollbar-hide">
          {/* Header */}
          <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 shrink-0">
            {/* Left: Brand + Zodiac insight */}
            <div className="flex items-center gap-4 bg-white/[0.03] p-3 rounded-[1.5rem] border border-white/[0.06] shadow-lg backdrop-blur-md">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[var(--theme-accent)]/10 flex items-center justify-center border border-[var(--theme-accent)]/20">
                  <Sun className="w-5 h-5" style={{ color: 'var(--theme-accent)' }} />
                </div>
                <div className="flex flex-col">
                  <span className="text-white/40 text-[10px] uppercase tracking-widest font-medium">{todayZodiac.name} Season</span>
                  <span className="text-white/90 text-sm font-medium">{settings.name || 'Reader'}'s Library</span>
                </div>
              </div>
              <div className="w-[1px] h-8 bg-white/10 hidden sm:block" />
              <div className="flex-col hidden sm:flex max-w-[220px]">
                <span className="text-white/40 text-[10px] uppercase tracking-widest font-medium">Daily Insight</span>
                <span className="text-white/60 text-xs truncate" title={todayZodiac.daily}>{todayZodiac.daily}</span>
              </div>
            </div>

            {/* Right: Search + Settings + Profile */}
            <div className="flex items-center gap-3 w-full md:w-auto">
              {/* Search bar - opens search results */}
              <form onSubmit={handleSearchSubmit} className="relative flex-1 md:flex-initial">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                <input
                  type="text"
                  placeholder="Search books & authors..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full md:w-56 pl-10 pr-10 py-2.5 bg-white/[0.03] hover:bg-white/[0.05] border border-white/[0.06] rounded-full text-sm text-white placeholder:text-white/25 focus:outline-none focus:border-white/20 focus:w-full md:focus:w-72 transition-all"
                />
                {searchQuery.trim() && (
                  <button
                    type="submit"
                    className="absolute right-1 top-1/2 -translate-y-1/2 px-3 py-1.5 bg-white/10 rounded-full text-[10px] text-white/60 hover:text-white hover:bg-white/15 transition-all"
                  >
                    Go
                  </button>
                )}
              </form>

              {/* Settings Button */}
              <button
                onClick={() => setShowSettings(true)}
                className="w-9 h-9 rounded-full bg-white/[0.03] border border-white/[0.06] hover:bg-white/[0.06] flex items-center justify-center transition-all text-white/50 hover:text-white/80"
                title="Settings"
              >
                <Settings className="w-4 h-4" />
              </button>

              {/* User Avatar */}
              <div className="w-9 h-9 rounded-full bg-[var(--theme-accent)]/20 overflow-hidden border border-white/10 shrink-0 flex items-center justify-center">
                {settings.name ? (
                  <span className="text-xs font-medium" style={{ color: 'var(--theme-accent)' }}>
                    {settings.name.charAt(0).toUpperCase()}
                  </span>
                ) : (
                  <User className="w-4 h-4 text-white/50" />
                )}
              </div>
            </div>
          </header>

          {/* Main Content */}
          <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Sidebar - Reading Activity + Quote */}
            <div className="lg:col-span-4 flex flex-col gap-6 mb-8 lg:mb-0">
              {/* Currently Reading */}
              <div className="bg-white/[0.02] border border-white/[0.05] rounded-[2rem] p-6 flex flex-col relative overflow-hidden group">
                <div
                  className="absolute top-0 right-0 w-32 h-32 blur-[60px] pointer-events-none opacity-30"
                  style={{ backgroundColor: 'var(--theme-accent)', opacity: 0.15 }}
                />

                <p className="text-white/40 text-xs uppercase tracking-widest font-medium mb-5 flex items-center gap-2">
                  <Zap className="w-4 h-4" style={{ color: 'var(--theme-accent)' }} /> Reading Activity
                </p>

                <div className="flex items-center gap-5 mb-6">
                  <div
                    className={`w-16 h-22 rounded-xl shadow-2xl border border-white/10 shrink-0 relative overflow-hidden flex items-center justify-center ${readingBook?.coverColor || 'bg-white/5'}`}
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent mix-blend-overlay" />
                    <BookOpen className="w-6 h-6 text-white/40" />
                  </div>
                  <div className="flex flex-col min-w-0">
                    <h3 className="font-serif text-xl text-white mb-0.5 leading-tight truncate">{readingBook?.title}</h3>
                    <p className="text-white/50 text-xs mb-3 truncate">{readingBook?.author}</p>
                    <div className="flex items-center gap-2 text-white/40 text-[10px]">
                      <Clock className="w-3 h-3" />
                      <span>~{Math.round(readingBook?.readTimeMn! * (1 - readingProgress / 100))} min left</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <div className="flex justify-between text-[10px] font-medium">
                    <span className="text-white/50">Chapter 6</span>
                    <span className="text-white/80">{readingProgress}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full relative transition-all duration-700"
                      style={{ width: `${readingProgress}%`, backgroundColor: 'var(--theme-accent)' }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent to-white/30" />
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => setIsReading(true)}
                  className="mt-5 bg-white text-black font-semibold py-3 px-5 rounded-2xl hover:scale-[1.02] active:scale-[0.98] transition-transform flex items-center justify-center gap-2 text-sm"
                >
                  Continue Reading <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              {/* Bookmarks */}
              {settings.bookmarks.length > 0 && (
                <div className="bg-white/[0.02] border border-white/[0.05] rounded-[2rem] p-5">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-white/40 text-xs uppercase tracking-widest flex items-center gap-2">
                      <BookmarkCheck className="w-3 h-3" /> Bookmarks ({settings.bookmarks.length})
                    </h3>
                    <button
                      onClick={() => setShowSettings(true)}
                      className="text-white/30 hover:text-white/60 text-[10px] transition-colors"
                    >
                      Manage
                    </button>
                  </div>
                  <div className="space-y-2 max-h-40 overflow-y-auto scrollbar-hide">
                    {settings.bookmarks.slice(0, 4).map((bm) => (
                      <div key={bm.key} className="flex items-center gap-3 p-2 rounded-lg bg-white/[0.02] hover:bg-white/[0.04] transition-colors group cursor-pointer">
                        <div className="w-8 h-10 rounded bg-white/[0.03] border border-white/[0.05] shrink-0 overflow-hidden flex items-center justify-center">
                          <Bookmark className="w-3 h-3 text-white/30" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-white text-xs font-medium truncate">{bm.title}</p>
                          <p className="text-white/40 text-[10px] truncate">{bm.author}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Reading History */}
              {settings.readingHistory.length > 0 && (
                <div className="bg-white/[0.02] border border-white/[0.05] rounded-[2rem] p-5">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-white/40 text-xs uppercase tracking-widest flex items-center gap-2">
                      <History className="w-3 h-3" /> Recent Reads
                    </h3>
                  </div>
                  <div className="space-y-2 max-h-40 overflow-y-auto scrollbar-hide">
                    {[...settings.readingHistory].reverse().slice(0, 4).map((entry) => (
                      <div key={entry.key + entry.lastReadAt} className="flex items-center gap-3 p-2 rounded-lg bg-white/[0.02] hover:bg-white/[0.04] transition-colors group">
                        <div className="w-8 h-10 rounded bg-white/[0.03] border border-white/[0.05] shrink-0 overflow-hidden flex items-center justify-center">
                          <Clock className="w-3 h-3 text-white/30" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-white text-xs font-medium truncate">{entry.title}</p>
                          <p className="text-white/40 text-[10px]">{entry.progress}% · {new Date(entry.lastReadAt).toLocaleDateString()}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Quote Card */}
              {settings.bookmarks.length === 0 && settings.readingHistory.length === 0 && (
                <div className="bg-white/[0.02] border border-white/[0.05] rounded-[2rem] p-6 relative flex flex-col justify-center min-h-[160px]">
                  <div className="absolute top-5 left-5 text-white/[0.06]">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                    </svg>
                  </div>
                  <p className="font-serif text-lg text-white/80 leading-relaxed relative z-10 italic mt-2">
                    "Where light touches, shadows are cast. To walk in the light, one must first befriend the dark."
                  </p>
                  <p className="text-white/40 text-xs mt-4 font-medium">— S. Vance, Echoes of the Ego</p>
                </div>
              )}
            </div>

            {/* Right: Book Gallery */}
            <div className="lg:col-span-8 flex flex-col">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <h2 className="text-xl font-serif text-white">Curated Library</h2>
                  <span className="hidden sm:inline-block bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] uppercase tracking-widest font-semibold px-2 py-1 rounded-md">
                    + OpenLibrary
                  </span>
                </div>
                <button
                  onClick={() => setShowSearchResults(true)}
                  className="text-white/40 text-xs hover:text-white/80 transition-colors flex items-center gap-1"
                >
                  <Search className="w-3 h-3" /> Search millions <ChevronRight className="w-3 h-3" />
                </button>
              </div>

              {/* Books Scroll */}
              <div className="flex gap-5 overflow-x-auto pb-8 scrollbar-hide snap-x snap-mandatory">
                {books.map((book) => (
                  <div
                    key={book.id}
                    onClick={() => setActiveBook(book)}
                    className="min-w-[220px] max-w-[220px] shrink-0 snap-start cursor-pointer group flex flex-col"
                  >
                    <div
                      className={`w-full aspect-[2/3] rounded-[1.5rem] shadow-2xl relative overflow-hidden mb-4 border border-white/5 group-hover:border-white/15 transition-all duration-300 ${book.coverColor} flex items-center justify-center`}
                    >
                      <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent mix-blend-overlay" />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors z-10" />

                      <motion.div
                        whileHover={{ scale: 1.1 }}
                        transition={{ duration: 0.3 }}
                        className="w-14 h-14 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center border border-white/20 z-20"
                      >
                        <BookOpen className="w-6 h-6 text-white/70" />
                      </motion.div>

                      <div className="absolute bottom-3 left-3 right-3 bg-black/40 backdrop-blur-md rounded-xl p-2.5 border border-white/10 transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 z-30 flex items-center justify-between">
                        <span className="text-white text-[10px] font-medium">Open</span>
                        <Play className="w-3 h-3 text-white" />
                      </div>
                    </div>

                    <div className="flex flex-col px-0.5">
                      <span
                        className="text-[10px] uppercase tracking-widest font-semibold mb-1"
                        style={{ color: 'var(--theme-accent)', opacity: 0.7 }}
                      >
                        {book.category}
                      </span>
                      <h3 className="font-serif text-base text-white mb-0.5 leading-tight group-hover:text-white/80 transition-colors truncate">
                        {book.title}
                      </h3>
                      <p className="text-white/50 text-xs mb-2">{book.author}</p>

                      <div className="flex items-center gap-2 text-[10px] text-white/50">
                        <span className="flex items-center gap-1">
                          <Star className="w-3 h-3 text-amber-400 fill-amber-400" /> {book.rating}
                        </span>
                        <span className="w-1 h-1 rounded-full bg-white/20" />
                        <span>{book.readTimeMn} min</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Book Detail Modal */}
      <AnimatePresence>
        {activeBook && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
          >
            <div className="absolute inset-0 bg-black/80 backdrop-blur-xl" onClick={() => setActiveBook(null)} />

            <motion.div
              initial={{ y: 40, scale: 0.95 }}
              animate={{ y: 0, scale: 1 }}
              exit={{ y: 20, scale: 0.95 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="relative w-full max-w-4xl bg-[#121215] border border-white/10 rounded-[2rem] overflow-hidden flex flex-col md:flex-row max-h-[85vh] shadow-2xl"
            >
              <button
                onClick={() => setActiveBook(null)}
                className="absolute top-4 right-4 z-50 w-8 h-8 bg-black/50 rounded-full flex items-center justify-center text-white/50 hover:text-white border border-white/10"
              >
                <X className="w-4 h-4" />
              </button>

              <div className={`md:w-5/12 ${activeBook.coverColor} relative p-8 flex items-center justify-center`}>
                <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent mix-blend-overlay" />
                <div className="w-full aspect-[2/3] max-w-[240px] rounded-2xl shadow-2xl bg-black/20 border border-white/20 overflow-hidden flex items-center justify-center group">
                  <BookOpen className="w-12 h-12 text-white/30 group-hover:scale-110 transition-transform duration-500" />
                </div>
              </div>

              <div className="flex-1 p-8 md:p-10 flex flex-col overflow-y-auto scrollbar-hide">
                <span className="text-[var(--theme-accent)] text-xs uppercase tracking-widest font-semibold mb-2 opacity-70">
                  {activeBook.category}
                </span>
                <h2 className="text-3xl font-serif text-white mb-2">{activeBook.title}</h2>
                <p className="text-white/60 text-lg mb-6">{activeBook.author}</p>

                <div className="flex items-center gap-4 mb-8">
                  <button
                    onClick={() => {
                      setReadingBook(activeBook);
                      setIsReading(true);
                    }}
                    className="flex-1 bg-white text-black py-3 rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-gray-200 transition-colors"
                  >
                    <BookOpen className="w-4 h-4" /> Read Now
                  </button>
                  <button className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white hover:bg-white/10 transition-colors">
                    <Bookmark className="w-5 h-5" />
                  </button>
                </div>

                <p className="text-white/80 leading-relaxed mb-10 text-sm">{activeBook.excerpt}</p>

                {/* Reviews */}
                <div className="mt-auto">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-white font-medium text-base flex items-center gap-2">
                      <MessageSquare className="w-4 h-4 text-white/40" /> Reader Commentary
                    </h3>
                    <span className="flex items-center gap-1 text-xs bg-amber-500/10 text-amber-500 px-2 py-1 rounded-md font-medium">
                      <Star className="w-3 h-3 fill-amber-500" /> {activeBook.rating}
                    </span>
                  </div>

                  <div className="space-y-3">
                    {activeBook.reviews?.map((review) => (
                      <div key={review.id} className="bg-white/[0.03] border border-white/[0.05] rounded-2xl p-4 flex flex-col gap-2.5">
                        <div className="flex items-center gap-3">
                          <img src={review.avatarUrl} alt={review.username} className="w-7 h-7 rounded-full border border-white/10" />
                          <div className="flex flex-col">
                            <span className="text-white/90 text-xs font-medium">{review.username}</span>
                            <span className="text-white/40 text-[10px]">{review.date}</span>
                          </div>
                        </div>
                        <p className="text-white/60 text-xs leading-relaxed">{review.content}</p>
                        <div className="flex items-center gap-4 text-white/40 pt-1.5 border-t border-white/5 text-[10px]">
                          <span className="flex items-center gap-1 hover:text-red-400 cursor-pointer transition-colors">
                            <Heart className="w-3 h-3" /> {review.likes}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Reader Overlay */}
      <ReaderOverlay
        book={isReading ? (readingSearchBook || readingBook) : null}
        onClose={handleCloseReader}
      />

      {/* Search Results */}
      <AnimatePresence>
        {showSearchResults && (
          <SearchResults
            isOpen={showSearchResults}
            onClose={() => setShowSearchResults(false)}
            initialQuery={searchQuery}
            bookmarks={settings.bookmarks}
            onToggleBookmark={handleToggleBookmark}
            onReadingOpen={handleReadingOpen}
            onReadInApp={handleReadInApp}
          />
        )}
      </AnimatePresence>

      {/* Settings Panel */}
      <AnimatePresence>
        {showSettings && (
          <SettingsPanel
            isOpen={showSettings}
            onClose={() => setShowSettings(false)}
            settings={settings}
            onSave={handleSettingsSave}
          />
        )}
      </AnimatePresence>
    </>
  );
}
