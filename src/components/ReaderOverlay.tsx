import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Bookmark, Zap, Clock, BookOpen, ChevronRight } from 'lucide-react';
import { Book } from '../data';

export default function ReaderOverlay({ book, onClose }: { book: Book | null; onClose: () => void }) {
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [progress, setProgress] = useState(0);

  // Mock progress simulation based on scroll could be added here
  useEffect(() => {
    if (book) {
      // randomly set progress on open for demo purposes, or pull from local storage
      setProgress(Math.floor(Math.random() * 80) + 5); 
    }
  }, [book]);

  return (
    <AnimatePresence>
      {book && (
        <motion.div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 lg:p-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/90 backdrop-blur-md" onClick={onClose}></div>
          
          {/* Reader container */}
          <motion.div 
            className="relative w-full max-w-6xl h-full max-h-[90vh] bg-[#101010] border border-[#DEDBC8]/10 rounded-[2rem] overflow-hidden flex flex-col lg:flex-row shadow-2xl"
            initial={{ y: 20, scale: 0.95 }}
            animate={{ y: 0, scale: 1 }}
            exit={{ y: 20, scale: 0.95 }}
          >
            {/* Left Sidebar Dashboard */}
            <div className="w-full lg:w-72 bg-[#0A0A0A] border-r border-[#DEDBC8]/10 p-8 flex flex-col gap-8 shrink-0">
               <div>
                 <p className="font-sans text-[#DEDBC8]/50 text-xs tracking-widest uppercase mb-2">Currently Reading</p>
                 <h2 className="font-serif text-[#DEDBC8] text-2xl font-medium tracking-tight leading-none mb-2">{book.title}</h2>
                 <p className="font-sans text-[#DEDBC8]/70 text-sm">{book.author}</p>
               </div>

               <div className="flex flex-col gap-6 mt-4 border-t border-[#DEDBC8]/10 pt-6">
                 {/* Progress Dashboard */}
                 <div className="flex flex-col gap-2">
                   <div className="flex items-center gap-3 text-[#DEDBC8]/80 text-sm font-medium">
                     <Clock className="w-4 h-4 text-[#DEDBC8]/50" /> 
                     <span>Est. {Math.round(book.readTimeMn * (1 - progress/100))} min remaining</span>
                   </div>
                   <div className="w-full bg-white/5 rounded-full h-1.5 mt-1 overflow-hidden">
                      <div className="bg-[#DEDBC8] h-full rounded-full transition-all duration-1000" style={{ width: `${progress}%` }}></div>
                   </div>
                   <p className="text-right text-[10px] text-[#DEDBC8]/40">{progress}% Completed</p>
                 </div>

                 <div className="flex items-center gap-3 text-[#DEDBC8]/80 text-sm font-medium">
                   <BookOpen className="w-4 h-4 text-[#DEDBC8]/50" /> 
                   <span>{Math.max(1, Math.floor(book.chapters.length * (progress/100)))} / {book.chapters.length} Chapters</span>
                 </div>

                 <div className="flex items-center gap-3 text-[#DEDBC8]/80 text-sm font-medium">
                   <Zap className="w-4 h-4 text-amber-500/80" /> 
                   <span>7 Day Learning Streak</span>
                 </div>
               </div>

               <div className="mt-auto flex flex-col gap-3">
                 <button 
                   onClick={() => setIsBookmarked(!isBookmarked)}
                   className={`flex items-center justify-center gap-2 w-full py-3 rounded-xl border transition-all text-sm font-medium ${
                     isBookmarked 
                     ? 'bg-[#DEDBC8]/10 border-[#DEDBC8]/30 text-[#DEDBC8]' 
                     : 'bg-transparent border-[#DEDBC8]/10 text-[#DEDBC8]/70 hover:bg-white/5 hover:text-[#DEDBC8]'
                   }`}
                 >
                   <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-current' : ''}`} />
                   {isBookmarked ? 'Bookmarked' : 'Add Bookmark'}
                 </button>
               </div>
            </div>

            {/* Reading Content Area */}
            <div className="flex-1 flex flex-col relative bg-[#131313]">
              <div className="absolute top-6 right-6 z-10">
                <button 
                  onClick={onClose}
                  className="w-10 h-10 shadow-lg rounded-full bg-black/50 border border-white/10 hover:bg-black/80 flex items-center justify-center transition-colors text-white/70 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-8 lg:p-16 space-y-16 scrollbar-hide scroll-smooth">
                {book.chapters.map((chapter, idx) => (
                  <div key={idx} className="max-w-2xl mx-auto">
                    <h3 className="font-sans text-[#DEDBC8]/50 text-xs tracking-[0.2em] uppercase mb-8 text-center">{chapter.title}</h3>
                    <p className="font-serif text-[#DEDBC8]/90 text-xl lg:text-2xl leading-[1.8] tracking-[-0.01em]">
                      {chapter.content}
                    </p>
                    
                    {/* Mock continued content generator */}
                    <div className="mt-8 space-y-6 opacity-30 blur-[1px]">
                      <div className="h-4 bg-[#DEDBC8]/40 rounded w-full"></div>
                      <div className="h-4 bg-[#DEDBC8]/40 rounded w-[90%]"></div>
                      <div className="h-4 bg-[#DEDBC8]/40 rounded w-[95%]"></div>
                      <div className="h-4 bg-[#DEDBC8]/40 rounded w-[80%]"></div>
                    </div>
                  </div>
                ))}

                <div className="max-w-2xl mx-auto flex justify-center py-12">
                   <button className="flex items-center gap-2 text-[#DEDBC8]/50 hover:text-[#DEDBC8] text-sm uppercase tracking-widest transition-colors group">
                     Next Chapter <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                   </button>
                </div>
              </div>
            </div>

          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
