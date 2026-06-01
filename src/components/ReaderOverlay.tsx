import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Bookmark,
  Clock,
  BookOpen,
  ChevronRight,
  ChevronLeft,
  Loader2,
  Minus,
  Plus,
  ArrowUp,
  ExternalLink,
} from 'lucide-react';
import { Book } from '../data';
import { getBookTextContent, splitTextIntoSections } from '../services/openLibrary';

export interface ReadableBook {
  title: string;
  author: string;
  ia?: string;
  workKey?: string;
  coverId?: number;
  key?: string;
}

interface ReaderOverlayProps {
  book: Book | ReadableBook | null;
  onClose: () => void;
}

export default function ReaderOverlay({ book, onClose }: ReaderOverlayProps) {
  const [textSections, setTextSections] = useState<{ title: string; content: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [fontSize, setFontSize] = useState(18);
  const [currentSection, setCurrentSection] = useState(0);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Check if this is a local demo book (has chapters) or a search result
  const isLocalBook = book && 'chapters' in book;

  // Load content when book changes
  useEffect(() => {
    if (!book) return;
    setLoading(true);
    setError(null);
    setProgress(0);
    setCurrentSection(0);

    if (isLocalBook) {
      // Local demo book — use existing chapters
      const b = book as Book;
      setTextSections(b.chapters.map((ch) => ({ title: ch.title, content: ch.content })));
      setLoading(false);
    } else if ((book as ReadableBook).ia) {
      // Search result with Internet Archive identifier — fetch real text
      const rb = book as ReadableBook;
      getBookTextContent(rb.ia!)
        .then((result) => {
          const sections = splitTextIntoSections(result.text);
          setTextSections(sections);
        })
        .catch((err) => {
          setError(err.message || 'Could not load book content.');
        })
        .finally(() => setLoading(false));
    } else {
      setError('This book is not available for in-app reading.');
      setLoading(false);
    }
  }, [book]);

  // Track scroll progress
  const handleScroll = useCallback(() => {
    const el = scrollContainerRef.current;
    if (!el) return;
    const scrollTop = el.scrollTop;
    const scrollHeight = el.scrollHeight - el.clientHeight;
    if (scrollHeight > 0) {
      setProgress(Math.min(100, Math.round((scrollTop / scrollHeight) * 100)));
    }
  }, []);

  // Navigate to section
  const scrollToSection = useCallback((index: number) => {
    const el = scrollContainerRef.current;
    if (!el) return;
    const sectionEl = el.querySelector(`[data-section-index="${index}"]`);
    if (sectionEl) {
      sectionEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setCurrentSection(index);
    }
  }, []);

  if (!book) return null;

  const iaIdentifier = !isLocalBook ? (book as ReadableBook).ia : undefined;
  const bookTitle = book.title;
  const bookAuthor = book.author;

  return (
    <AnimatePresence>
      {book && (
        <motion.div
          className="fixed inset-0 z-50 flex"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/95 backdrop-blur-xl" />

          <motion.div
            className="relative w-full h-full flex flex-col lg:flex-row"
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 10, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* === Left Sidebar === */}
            <div className="w-full lg:w-72 bg-black/40 border-b lg:border-b-0 lg:border-r border-white/[0.04] p-6 flex flex-col gap-6 shrink-0 z-10">
              {/* Close button - top */}
              <button
                onClick={onClose}
                className="w-9 h-9 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/50 hover:text-white transition-all self-start"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Book info */}
              <div className="flex flex-col gap-2">
                <p className="text-white/30 text-[10px] uppercase tracking-widest font-medium">
                  Now Reading
                </p>
                <h2 className="font-serif text-white text-xl font-medium leading-tight">
                  {bookTitle}
                </h2>
                <p className="text-white/50 text-sm">{bookAuthor}</p>
              </div>

              {/* Progress */}
              <div className="flex flex-col gap-2 border-t border-white/[0.04] pt-4">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-white/40">Progress</span>
                  <span className="text-white/80 font-medium">{progress}%</span>
                </div>
                <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{ width: `${progress}%`, backgroundColor: 'var(--theme-accent)' }}
                  />
                </div>

                {textSections.length > 0 && (
                  <p className="text-white/30 text-[10px] mt-1">
                    Section {currentSection + 1} of {textSections.length}
                  </p>
                )}
              </div>

              {/* Table of contents */}
              {textSections.length > 1 && (
                <div className="flex flex-col gap-1.5 border-t border-white/[0.04] pt-4 overflow-y-auto scrollbar-hide flex-1 min-h-0">
                  <p className="text-white/30 text-[10px] uppercase tracking-widest font-medium mb-2">
                    Sections
                  </p>
                  {textSections.map((section, idx) => (
                    <button
                      key={idx}
                      onClick={() => scrollToSection(idx)}
                      className={`text-left px-3 py-1.5 rounded-lg text-xs transition-all ${
                        currentSection === idx
                          ? 'bg-white/10 text-white font-medium'
                          : 'text-white/40 hover:text-white/70 hover:bg-white/[0.03]'
                      }`}
                    >
                      {section.title}
                    </button>
                  ))}
                </div>
              )}

              {/* Controls at bottom */}
              <div className="flex flex-col gap-3 border-t border-white/[0.04] pt-4 mt-auto">
                {/* Font size */}
                <div className="flex items-center justify-between">
                  <span className="text-white/30 text-[10px] uppercase tracking-widest">
                    Text Size
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setFontSize((s) => Math.max(12, s - 1))}
                      className="w-7 h-7 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/50 hover:text-white transition-all"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="text-white/60 text-xs w-6 text-center">{fontSize}</span>
                    <button
                      onClick={() => setFontSize((s) => Math.min(28, s + 1))}
                      className="w-7 h-7 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/50 hover:text-white transition-all"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                </div>

                {/* Bookmark */}
                <button
                  onClick={() => setIsBookmarked(!isBookmarked)}
                  className={`flex items-center justify-center gap-2 w-full py-2.5 rounded-xl border transition-all text-xs font-medium ${
                    isBookmarked
                      ? 'bg-amber-500/10 border-amber-500/20 text-amber-400'
                      : 'bg-white/[0.02] border-white/[0.06] text-white/50 hover:text-white/80 hover:bg-white/[0.04]'
                  }`}
                >
                  <Bookmark className={`w-3.5 h-3.5 ${isBookmarked ? 'fill-amber-400' : ''}`} />
                  {isBookmarked ? 'Bookmarked' : 'Bookmark'}
                </button>

                {/* Scroll to top */}
                <button
                  onClick={() => {
                    scrollContainerRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="flex items-center justify-center gap-2 w-full py-2 rounded-xl text-white/30 hover:text-white/60 transition-all text-[10px]"
                >
                  <ArrowUp className="w-3 h-3" /> Scroll to Top
                </button>

                {/* External link */}
                {iaIdentifier && (
                  <a
                    href={`https://archive.org/details/${iaIdentifier}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-1.5 w-full py-2 rounded-xl text-white/20 hover:text-white/50 transition-all text-[10px]"
                  >
                    <ExternalLink className="w-3 h-3" /> Open on Archive.org
                  </a>
                )}
              </div>
            </div>

            {/* === Reading Content === */}
            <div className="flex-1 flex flex-col relative min-w-0">
              {/* Top bar with close (mobile) */}
              <div className="lg:hidden absolute top-4 right-4 z-20">
                <button
                  onClick={onClose}
                  className="w-9 h-9 rounded-full bg-black/50 border border-white/10 flex items-center justify-center text-white/50 hover:text-white transition-all"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Content area */}
              <div
                ref={scrollContainerRef}
                onScroll={handleScroll}
                className="flex-1 overflow-y-auto scrollbar-hide scroll-smooth p-6 md:p-10 lg:p-16"
              >
                {loading ? (
                  <div className="flex flex-col items-center justify-center h-full gap-4">
                    <Loader2 className="w-8 h-8 text-white/30 animate-spin" />
                    <p className="text-white/30 text-sm">Loading book content...</p>
                    <p className="text-white/20 text-xs">Fetching from Internet Archive</p>
                  </div>
                ) : error ? (
                  <div className="flex flex-col items-center justify-center h-full gap-4 max-w-md mx-auto text-center">
                    <BookOpen className="w-12 h-12 text-white/10" />
                    <p className="text-white/50 text-sm">{error}</p>
                    <p className="text-white/30 text-xs">
                      Try searching for a different book. Books with the "Readable" badge have
                      digitized text available.
                    </p>
                    <button
                      onClick={onClose}
                      className="mt-4 px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white/80 text-sm transition-all"
                    >
                      Go back
                    </button>
                  </div>
                ) : textSections.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full gap-4">
                    <Loader2 className="w-8 h-8 text-white/30 animate-spin" />
                    <p className="text-white/30 text-sm">Preparing reader...</p>
                  </div>
                ) : (
                  <div className="max-w-3xl mx-auto">
                    {/* Book title header */}
                    <div className="text-center mb-12 pb-12 border-b border-white/[0.04]">
                      <h1 className="font-serif text-3xl md:text-4xl text-white mb-3 leading-tight">
                        {bookTitle}
                      </h1>
                      <p className="text-white/50 text-base">by {bookAuthor}</p>
                    </div>

                    {/* Sections */}
                    {textSections.map((section, idx) => (
                      <div
                        key={idx}
                        data-section-index={idx}
                        className="mb-16 scroll-mt-8"
                      >
                        {/* Section heading */}
                        <h2 className="font-sans text-white/40 text-xs tracking-[0.2em] uppercase mb-8 text-center">
                          {section.title}
                        </h2>

                        {/* Content */}
                        <div
                          className="font-serif text-white/85 leading-[1.9] tracking-wide space-y-5"
                          style={{ fontSize: `${fontSize}px` }}
                        >
                          {section.content.split(/\n\n+/).map((paragraph, pIdx) => (
                            <p key={pIdx} className="text-balance">
                              {paragraph}
                            </p>
                          ))}
                        </div>

                        {/* Section divider */}
                        {idx < textSections.length - 1 && (
                          <div className="flex items-center justify-center gap-3 mt-12 mb-8">
                            <span className="w-1.5 h-1.5 rounded-full bg-white/10" />
                            <span className="w-1.5 h-1.5 rounded-full bg-white/10" />
                            <span className="w-1.5 h-1.5 rounded-full bg-white/10" />
                          </div>
                        )}
                      </div>
                    ))}

                    {/* End of book */}
                    <div className="text-center py-12 border-t border-white/[0.04] mt-8">
                      <BookOpen className="w-8 h-8 text-white/10 mx-auto mb-3" />
                      <p className="text-white/30 text-sm font-serif italic">
                        — End —
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Bottom navigation bar */}
              {textSections.length > 1 && !loading && !error && (
                <div className="shrink-0 border-t border-white/[0.04] bg-black/40 backdrop-blur-md px-4 py-3 flex items-center justify-between">
                  <button
                    onClick={() => {
                      const prev = Math.max(0, currentSection - 1);
                      scrollToSection(prev);
                    }}
                    disabled={currentSection === 0}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs text-white/50 hover:text-white disabled:opacity-20 disabled:cursor-not-allowed transition-all"
                  >
                    <ChevronLeft className="w-3.5 h-3.5" /> Previous
                  </button>

                  <span className="text-white/30 text-[10px]">
                    {currentSection + 1} / {textSections.length}
                  </span>

                  <button
                    onClick={() => {
                      const next = Math.min(textSections.length - 1, currentSection + 1);
                      scrollToSection(next);
                    }}
                    disabled={currentSection === textSections.length - 1}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs text-white/50 hover:text-white disabled:opacity-20 disabled:cursor-not-allowed transition-all"
                  >
                    Next <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
