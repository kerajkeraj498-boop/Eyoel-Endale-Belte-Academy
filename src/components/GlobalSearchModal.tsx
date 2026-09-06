import React, { useState } from 'react';
import { Search, X, BookOpen, Award, Layers, ChevronRight } from 'lucide-react';
import { ViewTab } from '../types';
import { SUBJECTS } from '../data/gradesAndSubjects';
import { SAMPLE_NOTES } from '../data/notesData';
import { SAMPLE_QUIZZES } from '../data/quizzesData';

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTabChange: (tab: ViewTab) => void;
  onSelectSubjectForNotes: (subjectName: string) => void;
  onSelectSubjectForQuiz: (subjectName: string) => void;
}

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({
  isOpen,
  onClose,
  onTabChange,
  onSelectSubjectForNotes,
  onSelectSubjectForQuiz,
}) => {
  const [query, setQuery] = useState('');

  if (!isOpen) return null;

  const matchedSubjects = query.trim()
    ? SUBJECTS.filter(
        (s) =>
          s.name.toLowerCase().includes(query.toLowerCase()) ||
          s.code.toLowerCase().includes(query.toLowerCase()) ||
          s.description.toLowerCase().includes(query.toLowerCase())
      )
    : [];

  const matchedNotes = query.trim()
    ? SAMPLE_NOTES.filter(
        (n) =>
          n.title.toLowerCase().includes(query.toLowerCase()) ||
          n.summary.toLowerCase().includes(query.toLowerCase()) ||
          n.subjectName.toLowerCase().includes(query.toLowerCase())
      )
    : [];

  const matchedQuizzes = query.trim()
    ? SAMPLE_QUIZZES.filter(
        (q) =>
          q.title.toLowerCase().includes(query.toLowerCase()) ||
          q.subjectName.toLowerCase().includes(query.toLowerCase())
      )
    : [];

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/80 backdrop-blur-sm p-4 pt-16 sm:pt-24">
      <div className="bg-[#111112] rounded-3xl max-w-2xl w-full border border-[#2D2D30] shadow-2xl overflow-hidden flex flex-col max-h-[80vh]">
        
        {/* Search Header */}
        <div className="p-4 border-b border-[#2D2D30] flex items-center gap-3">
          <Search className="w-5 h-5 text-[#C5A059] shrink-0" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search notes, subjects, or quizzes..."
            className="w-full bg-transparent text-white text-sm focus:outline-none placeholder:text-slate-500"
          />
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Results List */}
        <div className="p-4 overflow-y-auto space-y-6">
          {!query.trim() ? (
            <div className="text-center py-8 text-xs text-slate-400">
              Type keywords to search Grade 9–12 subjects, chapter notes, and practice quizzes.
            </div>
          ) : (
            <>
              {/* Subjects */}
              {matchedSubjects.length > 0 && (
                <div className="space-y-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#C5A059] flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-[#C5A059]" /> Subjects ({matchedSubjects.length})
                  </span>
                  <div className="space-y-1.5">
                    {matchedSubjects.map((s) => (
                      <button
                        key={s.id}
                        onClick={() => {
                          onTabChange('subjects');
                          onClose();
                        }}
                        className="w-full p-3 rounded-xl bg-[#1A1A1C] border border-[#2D2D30] hover:border-[#C5A059] text-left flex items-center justify-between text-xs font-semibold text-slate-200"
                      >
                        <div>
                          <span className="font-bold text-[#C5A059] mr-2">{s.code}</span>
                          {s.name}
                        </div>
                        <ChevronRight className="w-4 h-4 text-slate-400" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Notes */}
              {matchedNotes.length > 0 && (
                <div className="space-y-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#C5A059] flex items-center gap-1.5">
                    <BookOpen className="w-3.5 h-3.5 text-[#C5A059]" /> Notes & Summaries ({matchedNotes.length})
                  </span>
                  <div className="space-y-1.5">
                    {matchedNotes.map((n) => (
                      <button
                        key={n.id}
                        onClick={() => {
                          onSelectSubjectForNotes(n.subjectName);
                          onTabChange('notes');
                          onClose();
                        }}
                        className="w-full p-3 rounded-xl bg-[#1A1A1C] border border-[#2D2D30] hover:border-[#C5A059] text-left flex items-center justify-between text-xs font-semibold text-slate-200"
                      >
                        <div>
                          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-[#2D2D30] text-[#C5A059] mr-2 uppercase">
                            {n.grade}
                          </span>
                          {n.title}
                        </div>
                        <ChevronRight className="w-4 h-4 text-slate-400" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quizzes */}
              {matchedQuizzes.length > 0 && (
                <div className="space-y-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#C5A059] flex items-center gap-1.5">
                    <Award className="w-3.5 h-3.5 text-[#C5A059]" /> Quizzes ({matchedQuizzes.length})
                  </span>
                  <div className="space-y-1.5">
                    {matchedQuizzes.map((q) => (
                      <button
                        key={q.id}
                        onClick={() => {
                          onSelectSubjectForQuiz(q.subjectName);
                          onTabChange('quizzes');
                          onClose();
                        }}
                        className="w-full p-3 rounded-xl bg-[#1A1A1C] border border-[#2D2D30] hover:border-[#C5A059] text-left flex items-center justify-between text-xs font-semibold text-slate-200"
                      >
                        <div>
                          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-[#2D2D30] text-[#C5A059] mr-2 uppercase">
                            {q.grade}
                          </span>
                          {q.title}
                        </div>
                        <ChevronRight className="w-4 h-4 text-slate-400" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {matchedSubjects.length === 0 && matchedNotes.length === 0 && matchedQuizzes.length === 0 && (
                <div className="text-center py-8 text-xs text-slate-400">
                  No matching resources found for "{query}". Try another search term.
                </div>
              )}
            </>
          )}
        </div>

      </div>
    </div>
  );
};

