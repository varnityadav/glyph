import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Search,
  X,
  BookOpen,
  User,
  ExternalLink,
  Loader2,
  Star,
  Bookmark,
  BookmarkCheck,
  Eye,
} from 'lucide-react';
import {
  searchAll,
  searchBooks,
  searchAuthors,
  getCoverUrl,
  getBookUrl,
  OLSearchResult,
  OLAuthorResult,
} from '../services/openLibrary';
import { BookmarkEntry } from '../hooks/useLocalStorage';

interface SearchResultsProps {
  isOpen: boolean;
  onClose: () => void;
  initialQuery?: string;
  bookmarks: BookmarkEntry[];
  onToggleBookmark: (book: { key: string; title: string; author: string; coverId?: number; ia?: string }) => void;
  onReadingOpen: (book: { key: string; title: string; author: string; coverId?: number; ia?: string }) => void;
  onReadInApp?: (book: { title: string; author: string; ia?: string; workKey?: string; coverId?: number }) => void;
}

type ViewMode = 'all' | 'books' | 'authors';

export default function SearchResults({ isOpen, onClose, initialQuery = '', bookmarks, onToggleBookmark, onReadingOpen, onReadInApp }: SearchResultsProps) {
  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState<{
    books: OLSearchResult[];
    authors: OLAuthorResult[];
  }>({ books: [], authors: [] });
  const [loading, setLoading] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>('all');
  const [searched, setSearched] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  useEffect(() => {
    if (initialQuery) {
      setQuery(initialQuery);
      performSearch(initialQuery);
    }
  }, [initialQuery]);

  const performSearch = useCallback(async (q: string) => {
    if (!q.trim()) return;
    setLoading(true);
    setSearched(true);
    try {
      const data = await searchAll(q, { limit: 30 });
      setResults(data);
    } catch (err) {
      console.error('Search failed:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    performSearch(query);
  };

  const displayBooks =
    viewMode === 'authors' ? [] : viewMode === 'all' ? results.books : results.books;
  const displayAuthors =
    viewMode === 'books' ? [] : viewMode === 'all' ? results.authors : results.authors;

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-16 sm:pt-24"
    >
      <div className="absolute inset-0 bg-black/70 backdrop-blur-md" onClick={onClose} />

      <motion.div
        initial={{ y: -10, scale: 0.98, opacity: 0 }}
        animate={{ y: 0, scale: 1, opacity: 1 }}
        exit={{ y: -10, scale: 0.98, opacity: 0 }}
        transition={{ type: 'spring', damping: 30, stiffness: 350 }}
        className="relative w-full max-w-3xl max-h-[80vh] bg-[#0c0c10] border border-white/[0.06] rounded-[2rem] overflow-hidden flex flex-col shadow-2xl"
      >
        {/* Search Bar */}
        <div className="p-4 border-b border-white/[0.05] shrink-0">
          <form onSubmit={handleSearch} className="flex items-center gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search books, authors, topics..."
                className="w-full pl-11 pr-4 py-3 bg-white/[0.03] border border-white/[0.08] rounded-xl text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-white/20 transition-all"
              />
            </div>
            <button
              type="submit"
              disabled={!query.trim() || loading}
              className="px-5 py-3 bg-white/10 hover:bg-white/15 disabled:opacity-30 rounded-xl text-white text-sm font-medium transition-all"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Search'}
            </button>
            <button
              onClick={onClose}
              className="w-9 h-9 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/50 hover:text-white transition-all shrink-0"
            >
              <X className="w-4 h-4" />
            </button>
          </form>

          {/* View Mode Tabs */}
          {searched && !loading && (
            <div className="flex gap-1 mt-3">
              {(['all', 'books', 'authors'] as const).map((mode) => (
                <button
                  key={mode}
                  onClick={() => setViewMode(mode)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all capitalize ${
                    viewMode === mode
                      ? 'bg-white/10 text-white'
                      : 'text-white/40 hover:text-white/70'
                  }`}
                >
                  {mode === 'all' ? 'All' : mode}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Results */}
        <div className="flex-1 overflow-y-auto scrollbar-hide p-4">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-16 gap-4">
              <Loader2 className="w-8 h-8 text-white/30 animate-spin" />
              <p className="text-white/30 text-sm">Searching the cosmos...</p>
            </div>
          ) : !searched ? (
            <div className="flex flex-col items-center justify-center py-16 gap-4">
              <BookOpen className="w-12 h-12 text-white/10" />
              <p className="text-white/30 text-sm">Search millions of books from OpenLibrary</p>
            </div>
          ) : results.books.length === 0 && results.authors.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 gap-4">
              <Search className="w-12 h-12 text-white/10" />
              <p className="text-white/30 text-sm">No results found for "{query}"</p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Author Results */}
              {displayAuthors.length > 0 && (
                <div>
                  {viewMode === 'all' && (
                    <h3 className="text-white/40 text-xs uppercase tracking-widest mb-3 flex items-center gap-2">
                      <User className="w-3 h-3" /> Authors ({displayAuthors.length})
                    </h3>
                  )}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {displayAuthors.map((author) => (
                      <a
                        key={author.key}
                        href={getBookUrl(author.key)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/[0.05] hover:bg-white/[0.05] transition-all group"
                      >
                        <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center shrink-0">
                          <User className="w-5 h-5 text-white/40" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-white text-sm font-medium truncate">{author.name}</p>
                          {author.top_work && (
                            <p className="text-white/40 text-xs truncate">{author.top_work}</p>
                          )}
                        </div>
                        <ExternalLink className="w-3.5 h-3.5 text-white/20 group-hover:text-white/50 transition-colors shrink-0" />
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {/* Book Results */}
              {displayBooks.length > 0 && (
                <div>
                  {viewMode === 'all' && (
                    <h3 className="text-white/40 text-xs uppercase tracking-widest mb-3 flex items-center gap-2">
                      <BookOpen className="w-3 h-3" /> Books ({displayBooks.length})
                    </h3>
                  )}
                  <div className="grid grid-cols-1 gap-2">
                    {displayBooks.map((book) => (
                      <BookResultCard
                        key={book.key}
                        book={book}
                        isBookmarked={bookmarks.some((b) => b.key === book.key)}
                        onToggleBookmark={() =>
                          onToggleBookmark({
                            key: book.key,
                            title: book.title,
                            author: book.author_name?.join(', ') || 'Unknown Author',
                            coverId: book.cover_i,
                            ia: book.ia?.[0],
                          })
                        }
                        onReadingOpen={() =>
                          onReadingOpen({
                            key: book.key,
                            title: book.title,
                            author: book.author_name?.join(', ') || 'Unknown Author',
                            coverId: book.cover_i,
                            ia: book.ia?.[0],
                          })
                        }
                        onReadInApp={() =>
                          onReadInApp?.({
                            title: book.title,
                            author: book.author_name?.join(', ') || 'Unknown Author',
                            ia: book.ia?.[0],
                            workKey: book.key,
                            coverId: book.cover_i,
                          })
                        }
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

function BookResultCard({
  book,
  isBookmarked,
  onToggleBookmark,
  onReadingOpen,
  onReadInApp,
  ..._rest
}: {
  book: OLSearchResult;
  isBookmarked: boolean;
  onToggleBookmark: () => void;
  onReadingOpen: () => void;
  onReadInApp?: () => void;
  key?: string | number;
}) {
  const coverUrl = book.cover_i
    ? getCoverUrl(book.cover_i, 'M')
    : book.isbn?.[0]
    ? `https://covers.openlibrary.org/b/isbn/${book.isbn[0]}-M.jpg`
    : null;
  const canRead = book.has_fulltext && book.ia && book.ia.length > 0;

  return (
    <div className="flex gap-4 p-4 rounded-xl bg-white/[0.02] border border-white/[0.05] hover:bg-white/[0.04] transition-all group">
      {/* Cover */}
      <div className="w-14 h-20 rounded-lg bg-white/[0.03] border border-white/[0.05] shrink-0 overflow-hidden flex items-center justify-center">
        {coverUrl ? (
          <img
            src={coverUrl}
            alt={book.title}
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none';
              (e.target as HTMLImageElement).parentElement!.classList.add('flex', 'items-center', 'justify-center');
            }}
          />
        ) : (
          <BookOpen className="w-5 h-5 text-white/20" />
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="text-white text-sm font-medium truncate">{book.title}</p>
        {book.author_name && (
          <p className="text-white/40 text-xs truncate">{book.author_name.join(', ')}</p>
        )}
        <div className="flex items-center gap-3 mt-2">
          {book.first_publish_year && (
            <span className="text-white/30 text-[10px]">{book.first_publish_year}</span>
          )}
          {canRead && (
            <span className="text-emerald-400/70 text-[10px] flex items-center gap-1">
              <Eye className="w-3 h-3" /> Readable
            </span>
          )}
          {book.availability?.is_preview_only && (
            <span className="text-amber-400/70 text-[10px]">Preview</span>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1.5 shrink-0">
        {/* Read in App button - only for books with digitized text */}
        {canRead && onReadInApp && (
          <button
            onClick={() => {
              onReadingOpen();
              onReadInApp();
            }}
            className="w-8 h-8 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 flex items-center justify-center text-emerald-400/80 hover:text-emerald-400 transition-all"
            title="Read in app"
          >
            <BookOpen className="w-4 h-4" />
          </button>
        )}
        {/* Bookmark Toggle */}
        <button
          onClick={onToggleBookmark}
          className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${
            isBookmarked
              ? 'bg-amber-500/15 text-amber-400 hover:bg-amber-500/20'
              : 'bg-white/5 hover:bg-white/10 text-white/50 hover:text-white'
          }`}
          title={isBookmarked ? 'Remove bookmark' : 'Add bookmark'}
        >
          {isBookmarked ? (
            <BookmarkCheck className="w-4 h-4" />
          ) : (
            <Bookmark className="w-4 h-4" />
          )}
        </button>
        <a
          href={getBookUrl(book.key)}
          target="_blank"
          rel="noopener noreferrer"
          className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/50 hover:text-white transition-all"
          title="View on OpenLibrary"
        >
          <ExternalLink className="w-4 h-4" />
        </a>
      </div>
    </div>
  );
}
