import React, { useState } from 'react';
import { X, Sparkles, ChevronLeft, ChevronRight, RotateCcw } from 'lucide-react';
import { FLASHCARDS_DATA } from '../data/flashcardsData';

interface FlashcardsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FlashcardsModal: React.FC<FlashcardsModalProps> = ({ isOpen, onClose }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  if (!isOpen) return null;

  const currentCard = FLASHCARDS_DATA[currentIndex];

  const handleNext = () => {
    setIsFlipped(false);
    setCurrentIndex((prev) => (prev + 1) % FLASHCARDS_DATA.length);
  };

  const handlePrev = () => {
    setIsFlipped(false);
    setCurrentIndex((prev) => (prev - 1 + FLASHCARDS_DATA.length) % FLASHCARDS_DATA.length);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-[#111112] rounded-3xl max-w-xl w-full border border-[#2D2D30] p-6 sm:p-8 space-y-6 shadow-2xl relative">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#2D2D30]">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[#C5A059]" />
            <h2 className="text-xl font-serif font-bold text-white">
              Revision Flashcards
            </h2>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Status */}
        <div className="flex items-center justify-between text-xs font-bold text-slate-400 uppercase tracking-wider">
          <span className="px-2.5 py-1 rounded bg-[#1A1A1C] text-[#C5A059] border border-[#2D2D30]">
            {currentCard.grade} • {currentCard.subjectName} ({currentCard.topic})
          </span>
          <span>
            Card {currentIndex + 1} of {FLASHCARDS_DATA.length}
          </span>
        </div>

        {/* Flashcard Body */}
        <div
          onClick={() => setIsFlipped(!isFlipped)}
          className={`min-h-[200px] sm:min-h-[240px] p-8 rounded-2xl border cursor-pointer transition-all duration-300 flex flex-col items-center justify-center text-center select-none ${
            isFlipped
              ? 'bg-[#1A1A1C] border-[#C5A059] text-white shadow-xl'
              : 'bg-[#161618] border-[#2D2D30] text-slate-200 hover:border-[#C5A059]/60'
          }`}
        >
          <span className="text-[10px] font-bold uppercase tracking-widest text-[#C5A059] mb-3">
            {isFlipped ? 'Answer & Explanation' : 'Click / Tap Card to Reveal Answer'}
          </span>

          <p className="text-base sm:text-lg font-serif font-bold leading-relaxed">
            {isFlipped ? currentCard.back : currentCard.front}
          </p>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between pt-2">
          <button
            onClick={handlePrev}
            className="px-4 py-2.5 rounded-full bg-[#161618] border border-[#2D2D30] text-slate-300 font-bold text-xs hover:text-white uppercase tracking-wider flex items-center gap-1"
          >
            <ChevronLeft className="w-4 h-4" /> Previous
          </button>

          <button
            onClick={() => setIsFlipped(!isFlipped)}
            className="px-4 py-2.5 rounded-full bg-[#1A1A1C] text-[#C5A059] font-bold text-xs border border-[#2D2D30] hover:border-[#C5A059] uppercase tracking-wider flex items-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Flip Card
          </button>

          <button
            onClick={handleNext}
            className="px-5 py-2.5 rounded-full bg-[#C5A059] hover:bg-[#d8b168] text-black font-bold text-xs uppercase tracking-wider flex items-center gap-1"
          >
            Next <ChevronRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
};

