import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  Bookmark,
  BookmarkCheck,
  Search,
  Clock,
  Printer,
  ChevronRight,
  X,
  Award,
  List,
  Sparkles,
  Lightbulb,
  FileText,
  CheckCircle2,
  Check,
  Download,
  DownloadCloud,
  HardDrive,
  Trash2,
} from 'lucide-react';
import { GradeLevel, NoteChapter, ViewTab, Language } from '../types';
import { SAMPLE_NOTES } from '../data/notesData';
import { SUBJECTS, GRADES } from '../data/gradesAndSubjects';
import { TRANSLATIONS, SUBJECT_TRANSLATIONS } from '../lib/translations';
import { saveNoteOffline, deleteOfflineNote, isNoteOffline, getOfflineNotes } from '../lib/offlineStorage';

interface NotesViewProps {
  language: Language;
  selectedGrade: GradeLevel | 'All';
  onGradeChange: (grade: GradeLevel | 'All') => void;
  selectedSubjectFilter: string;
  onSubjectFilterChange: (subject: string) => void;
  bookmarks: string[]; // array of noteIds
  onToggleBookmark: (noteId: string) => void;
  onTabChange: (tab: ViewTab) => void;
  onSelectSubjectForQuiz: (subjectName: string) => void;
  notes?: NoteChapter[];
  completedNotes?: string[];
  onToggleNoteCompletion?: (noteId: string) => void;
}

export const NotesView: React.FC<NotesViewProps> = ({
  language,
  selectedGrade,
  onGradeChange,
  selectedSubjectFilter,
  onSubjectFilterChange,
  bookmarks,
  onToggleBookmark,
  onTabChange,
  onSelectSubjectForQuiz,
  notes,
  completedNotes = [],
  onToggleNoteCompletion,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeNoteModal, setActiveNoteModal] = useState<NoteChapter | null>(null);
  const [showOfflineOnly, setShowOfflineOnly] = useState(false);
  const [offlineIds, setOfflineIds] = useState<string[]>([]);

  // Reader Customizer State
  const [fontSize, setFontSize] = useState<'sm' | 'base' | 'lg'>('base');

  useEffect(() => {
    try {
      const saved = getOfflineNotes();
      setOfflineIds(saved.map((n) => n.id));
    } catch {
      // Ignore
    }
  }, []);

  const handleToggleOffline = (note: NoteChapter) => {
    if (offlineIds.includes(note.id)) {
      deleteOfflineNote(note.id);
      setOfflineIds((prev) => prev.filter((id) => id !== note.id));
    } else {
      saveNoteOffline(note);
      setOfflineIds((prev) => [...prev, note.id]);
    }
  };

  const t = TRANSLATIONS[language] || TRANSLATIONS.en;
  const notesList = notes || SAMPLE_NOTES;

  // Filter notes
  const filteredNotes = notesList.filter((note) => {
    const matchesOffline = !showOfflineOnly || offlineIds.includes(note.id);
    const matchesGrade = selectedGrade === 'All' || note.grade === selectedGrade;
    const matchesSubject = selectedSubjectFilter === 'All' || note.subjectName.toLowerCase() === selectedSubjectFilter.toLowerCase();
    const localizedSubject = SUBJECT_TRANSLATIONS[note.subjectName]?.[language] || note.subjectName;
    const matchesSearch =
      note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.subjectName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      localizedSubject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.keyTerms.some((kt) => kt.term.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesOffline && matchesGrade && matchesSubject && matchesSearch;
  });

  const handlePrintNote = () => {
    window.print();
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 bg-[#0A0A0B]">
      
      {/* Title Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[#2D2D30]">
        <div>
          <div className="flex items-center gap-2 text-[#C5A059] font-bold text-xs uppercase tracking-[0.2em] mb-1">
            <BookOpen className="w-4 h-4" /> {t.navNotes}
          </div>
          <h1 className="text-2xl sm:text-4xl font-serif font-semibold text-white tracking-tight">
            {t.notesHeading}
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
            {t.notesSub}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-full bg-[#161618] border border-[#2D2D30] text-[#C5A059]">
            {filteredNotes.length} {language === 'am' ? 'ማስታወሻዎች' : language === 'om' ? 'Qabxiiwwan' : 'Notes Available'}
          </span>
          <span className="text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-full bg-[#161618] border border-[#2D2D30] text-emerald-400">
            {completedNotes.length} {language === 'am' ? 'የተጠናቀቁ' : language === 'om' ? 'Xumuraman' : 'Completed'}
          </span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="space-y-4">
        <div className="relative">
          <Search className="w-4 h-4 text-[#C5A059] absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder={t.searchNotesPlaceholder}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#111112] border border-[#2D2D30] rounded-xl pl-11 pr-4 py-3 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#C5A059] transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Grade & Offline Filters */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mr-1">
            {t.filterByGrade}:
          </span>
          <button
            onClick={() => {
              setShowOfflineOnly(false);
              onGradeChange('All');
            }}
            className={`px-3 py-1.5 rounded-full text-xs font-bold transition-colors ${
              selectedGrade === 'All' && !showOfflineOnly
                ? 'bg-[#C5A059] text-black shadow-md'
                : 'bg-[#111112] text-slate-300 border border-[#2D2D30] hover:border-[#C5A059]'
            }`}
          >
            {t.allGrades}
          </button>
          {GRADES.map((g) => (
            <button
              key={g.level}
              onClick={() => {
                setShowOfflineOnly(false);
                onGradeChange(g.level);
              }}
              className={`px-3 py-1.5 rounded-full text-xs font-bold transition-colors ${
                selectedGrade === g.level && !showOfflineOnly
                  ? 'bg-[#C5A059] text-black shadow-md'
                  : 'bg-[#111112] text-slate-300 border border-[#2D2D30] hover:border-[#C5A059]'
              }`}
            >
              {language === 'am' ? g.level.replace('Grade ', 'ክፍል ') : language === 'om' ? g.level.replace('Grade ', 'Kutaa ') : g.level}
            </button>
          ))}

          {/* Offline Saved Notes Filter */}
          <button
            onClick={() => setShowOfflineOnly(!showOfflineOnly)}
            className={`px-3 py-1.5 rounded-full text-xs font-bold transition-colors flex items-center gap-1.5 ${
              showOfflineOnly
                ? 'bg-emerald-500 text-black shadow-md'
                : 'bg-[#111112] text-slate-300 border border-[#2D2D30] hover:border-emerald-500'
            }`}
            title="Show offline cached notes"
          >
            <HardDrive className="w-3.5 h-3.5" />
            <span>{language === 'am' ? 'ከመስመር ውጭ የወረዱ' : language === 'om' ? 'Kuusaa Offline' : 'Offline Notes'} ({offlineIds.length})</span>
          </button>
        </div>

        {/* Subject Selector Filter */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider whitespace-nowrap mr-1">
            {t.filterBySubject}:
          </span>
          <button
            onClick={() => onSubjectFilterChange('All')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
              selectedSubjectFilter === 'All'
                ? 'bg-[#1A1A1C] text-[#C5A059] border border-[#C5A059]'
                : 'bg-[#111112] text-slate-400 border border-[#2D2D30] hover:text-white'
            }`}
          >
            {language === 'am' ? 'ሁሉም ትምህርቶች' : language === 'om' ? 'Barnoota Hunda' : 'All Subjects'}
          </button>
          {SUBJECTS.map((sub) => {
            const locName = SUBJECT_TRANSLATIONS[sub.name]?.[language] || sub.name;
            return (
              <button
                key={sub.id}
                onClick={() => onSubjectFilterChange(sub.name)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                  selectedSubjectFilter.toLowerCase() === sub.name.toLowerCase()
                    ? 'bg-[#1A1A1C] text-[#C5A059] border border-[#C5A059]'
                    : 'bg-[#111112] text-slate-400 border border-[#2D2D30] hover:text-white'
                }`}
              >
                {locName}
              </button>
            );
          })}
        </div>
      </div>

      {/* Notes Grid */}
      {filteredNotes.length === 0 ? (
        <div className="text-center py-16 bg-[#111112] rounded-2xl border border-[#2D2D30] p-8">
          <BookOpen className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <h3 className="text-lg font-serif font-bold text-white mb-1">
            {t.noNotesFound}
          </h3>
          <p className="text-xs text-slate-400">
            {language === 'am' ? 'እባክዎ የተለየ የትምህርት አይነት ወይም የክፍል ደረጃ ይሞክሩ።' : language === 'om' ? 'Mee gosa barnootaa ykn kutaalee biraa filadhaa.' : 'Try selecting another grade or subject filter above.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredNotes.map((note) => {
            const isBookmarked = bookmarks.includes(note.id);
            const isCompleted = completedNotes.includes(note.id);
            const localizedSubject = SUBJECT_TRANSLATIONS[note.subjectName]?.[language] || note.subjectName;

            return (
              <div
                key={note.id}
                className="rounded-2xl bg-[#111112] border border-[#2D2D30] p-6 hover:border-[#C5A059] transition-all flex flex-col justify-between group"
              >
                <div>
                  {/* Top Bar */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#1A1A1C] text-[#C5A059] border border-[#C5A059]/30 uppercase">
                        {language === 'am' ? note.grade.replace('Grade ', 'ክፍል ') : language === 'om' ? note.grade.replace('Grade ', 'Kutaa ') : note.grade}
                      </span>
                      <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                        {localizedSubject}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      {/* Offline Download Button */}
                      <button
                        onClick={() => handleToggleOffline(note)}
                        className={`p-1.5 rounded-lg border transition-colors ${
                          offlineIds.includes(note.id)
                            ? 'bg-emerald-950 border-emerald-600 text-emerald-400'
                            : 'bg-[#111112] border-[#2D2D30] text-slate-500 hover:text-emerald-400'
                        }`}
                        title={offlineIds.includes(note.id) ? 'Saved for offline study' : 'Save for offline study'}
                      >
                        <HardDrive className="w-4 h-4" />
                      </button>

                      {isCompleted && (
                        <span className="p-1 rounded-md bg-emerald-500/20 text-emerald-400 border border-emerald-500/30" title="Completed">
                          <Check className="w-3.5 h-3.5" />
                        </span>
                      )}
                      <button
                        onClick={() => onToggleBookmark(note.id)}
                        className={`p-1.5 rounded-lg border transition-colors ${
                          isBookmarked
                            ? 'bg-[#1A1A1C] border-[#C5A059] text-[#C5A059]'
                            : 'bg-[#111112] border-[#2D2D30] text-slate-500 hover:text-white'
                        }`}
                        title={isBookmarked ? t.bookmarked : t.bookmarkLesson}
                      >
                        {isBookmarked ? (
                          <BookmarkCheck className="w-4 h-4 fill-[#C5A059]" />
                        ) : (
                          <Bookmark className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  <span className="text-[10px] font-bold text-[#C5A059] tracking-wider uppercase block mb-1">
                    {language === 'am' ? `ምዕራፍ ${note.chapterNumber}` : language === 'om' ? `Boqonnaa ${note.chapterNumber}` : `Chapter ${note.chapterNumber}`}
                  </span>

                  <h3 className="text-base sm:text-lg font-serif font-bold text-white group-hover:text-[#C5A059] transition-colors">
                    {note.title}
                  </h3>

                  <p className="text-xs text-slate-400 mt-2 line-clamp-3 leading-relaxed">
                    {note.summary}
                  </p>

                  {/* Metadata */}
                  <div className="mt-4 flex items-center gap-4 text-xs font-medium text-slate-400">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-[#C5A059]" /> {note.readingTimeMinutes} {t.readTime}
                    </span>
                    {note.formulas && note.formulas.length > 0 && (
                      <span className="flex items-center gap-1 text-[#C5A059]">
                        <Sparkles className="w-3.5 h-3.5" /> {language === 'am' ? 'ቀመሮች አሉት' : language === 'om' ? 'Formulaawwan Qaba' : 'Formulas Included'}
                      </span>
                    )}
                  </div>
                </div>

                {/* Read button */}
                <div className="mt-6 pt-4 border-t border-[#2D2D30] flex items-center gap-2">
                  <button
                    onClick={() => setActiveNoteModal(note)}
                    className="flex-1 py-2.5 px-4 rounded-xl bg-[#1A1A1C] border border-[#2D2D30] hover:border-[#C5A059] text-white font-bold text-xs uppercase tracking-wider transition-colors flex items-center justify-center gap-2"
                  >
                    {language === 'am' ? 'ሙሉውን አንብብ' : language === 'om' ? 'Guutuu Dubbisi' : 'Read Full Note'} <ChevronRight className="w-4 h-4 text-[#C5A059]" />
                  </button>

                  {onToggleNoteCompletion && (
                    <button
                      onClick={() => onToggleNoteCompletion(note.id)}
                      className={`p-2.5 rounded-xl border transition ${
                        isCompleted
                          ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400'
                          : 'bg-[#1A1A1C] border-[#2D2D30] text-slate-400 hover:text-white'
                      }`}
                      title={isCompleted ? t.markIncomplete : t.markCompleted}
                    >
                      <CheckCircle2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Note Reader Modal */}
      {activeNoteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-2 sm:p-4 overflow-y-auto">
          <div className="bg-[#111112] text-white rounded-3xl max-w-4xl w-full border border-[#2D2D30] p-6 sm:p-10 shadow-2xl relative my-6 max-h-[92vh] overflow-y-auto">
            {/* Modal Controls Header */}
            <div className="sticky top-0 -mt-6 -mx-6 sm:-mt-10 sm:-mx-10 px-6 py-4 sm:px-10 bg-[#111112]/95 backdrop-blur-md border-b border-[#2D2D30] z-20 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold px-2.5 py-1 rounded bg-[#1A1A1C] text-[#C5A059] border border-[#2D2D30] uppercase">
                  {language === 'am' ? activeNoteModal.grade.replace('Grade ', 'ክፍል ') : language === 'om' ? activeNoteModal.grade.replace('Grade ', 'Kutaa ') : activeNoteModal.grade} • {SUBJECT_TRANSLATIONS[activeNoteModal.subjectName]?.[language] || activeNoteModal.subjectName}
                </span>
                {completedNotes.includes(activeNoteModal.id) && (
                  <span className="text-xs font-bold px-2.5 py-1 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 uppercase flex items-center gap-1">
                    <Check className="w-3 h-3" /> {language === 'am' ? 'የተጠናቀቀ' : language === 'om' ? 'Xumurameera' : 'Completed'}
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2">
                {/* Complete Lesson Button */}
                {onToggleNoteCompletion && (
                  <button
                    onClick={() => onToggleNoteCompletion(activeNoteModal.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition ${
                      completedNotes.includes(activeNoteModal.id)
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                        : 'bg-[#1A1A1C] text-slate-300 hover:text-white border border-[#2D2D30]'
                    }`}
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    {completedNotes.includes(activeNoteModal.id) ? t.markIncomplete : t.markCompleted}
                  </button>
                )}

                {/* Font Size Toggles */}
                <div className="flex items-center bg-[#1A1A1C] border border-[#2D2D30] rounded-lg p-1 text-xs">
                  <button
                    onClick={() => setFontSize('sm')}
                    className={`px-2 py-0.5 rounded ${fontSize === 'sm' ? 'bg-[#C5A059] text-black font-bold' : 'text-slate-400'}`}
                  >
                    A-
                  </button>
                  <button
                    onClick={() => setFontSize('base')}
                    className={`px-2 py-0.5 rounded ${fontSize === 'base' ? 'bg-[#C5A059] text-black font-bold' : 'text-slate-400'}`}
                  >
                    A
                  </button>
                  <button
                    onClick={() => setFontSize('lg')}
                    className={`px-2 py-0.5 rounded ${fontSize === 'lg' ? 'bg-[#C5A059] text-black font-bold' : 'text-slate-400'}`}
                  >
                    A+
                  </button>
                </div>

                {/* Save Offline Button */}
                <button
                  onClick={() => handleToggleOffline(activeNoteModal)}
                  className={`p-2 rounded-lg border transition-colors flex items-center gap-1 text-xs font-semibold ${
                    offlineIds.includes(activeNoteModal.id)
                      ? 'bg-emerald-950 border-emerald-600 text-emerald-400'
                      : 'bg-[#1A1A1C] text-slate-300 hover:text-emerald-400 border border-[#2D2D30]'
                  }`}
                  title={offlineIds.includes(activeNoteModal.id) ? 'Saved for offline study (click to remove)' : 'Save for offline reading'}
                >
                  <HardDrive className="w-4 h-4" />
                  <span className="hidden sm:inline">
                    {offlineIds.includes(activeNoteModal.id) ? 'Offline Saved' : 'Save Offline'}
                  </span>
                </button>

                {/* Print/Export */}
                <button
                  onClick={handlePrintNote}
                  className="p-2 rounded-lg bg-[#1A1A1C] text-slate-300 hover:text-white border border-[#2D2D30] transition-colors"
                  title={t.printNotes}
                >
                  <Printer className="w-4 h-4" />
                </button>

                {/* Bookmark */}
                <button
                  onClick={() => onToggleBookmark(activeNoteModal.id)}
                  className="p-2 rounded-lg bg-[#1A1A1C] text-slate-300 hover:text-white border border-[#2D2D30] transition-colors"
                  title={t.bookmarkLesson}
                >
                  {bookmarks.includes(activeNoteModal.id) ? (
                    <BookmarkCheck className="w-4 h-4 text-[#C5A059] fill-[#C5A059]" />
                  ) : (
                    <Bookmark className="w-4 h-4" />
                  )}
                </button>

                {/* Close */}
                <button
                  onClick={() => setActiveNoteModal(null)}
                  className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-[#1A1A1C]"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Note Header Title */}
            <div className="pt-6 space-y-3">
              <span className="text-xs font-bold text-[#C5A059] uppercase tracking-widest">
                {language === 'am' ? `ምዕራፍ ${activeNoteModal.chapterNumber} የጥናት ማስታወሻ` : language === 'om' ? `Boqonnaa ${activeNoteModal.chapterNumber} Qabxii Qo'annoo` : `Chapter ${activeNoteModal.chapterNumber} Study Sheet`}
              </span>
              <h1 className="text-2xl sm:text-4xl font-serif font-bold tracking-tight text-white">
                {activeNoteModal.title}
              </h1>

              <div className="flex items-center gap-4 text-xs font-medium text-slate-400">
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-[#C5A059]" /> {activeNoteModal.readingTimeMinutes} {t.readTime}
                </span>
                <span>•</span>
                <span>EYOEL ENDALE BELETE</span>
              </div>
            </div>

            {/* Summary Banner */}
            <div className="mt-6 p-4 rounded-2xl bg-[#1A1A1C] border border-[#2D2D30] text-slate-300 text-xs sm:text-sm leading-relaxed">
              <span className="font-bold block mb-1 text-[#C5A059] uppercase tracking-wider text-xs">
                {t.executiveSummary}:
              </span>
              {activeNoteModal.summary}
            </div>

            {/* Table of Contents Sticky Box */}
            <div className="mt-6 p-4 rounded-2xl bg-[#161618] border border-[#2D2D30]">
              <span className="text-xs font-bold uppercase tracking-widest text-[#C5A059] flex items-center gap-2 mb-2">
                <List className="w-4 h-4" /> {t.tableOfContents}:
              </span>
              <div className="flex flex-wrap gap-2">
                {activeNoteModal.tableOfContents.map((toc, i) => (
                  <span
                    key={i}
                    className="px-2.5 py-1 rounded-md bg-[#1A1A1C] text-xs font-medium text-slate-300 border border-[#2D2D30]"
                  >
                    {toc}
                  </span>
                ))}
              </div>
            </div>

            {/* Formulas Box (if available) */}
            {activeNoteModal.formulas && activeNoteModal.formulas.length > 0 && (
              <div className="mt-8 space-y-3">
                <h3 className="text-lg font-serif font-bold flex items-center gap-2 text-[#C5A059]">
                  <Sparkles className="w-5 h-5" /> {t.keyFormulas}
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {activeNoteModal.formulas.map((f, i) => (
                    <div
                      key={i}
                      className="p-4 rounded-2xl bg-[#161618] border border-[#2D2D30] space-y-1.5"
                    >
                      <span className="text-xs font-bold text-[#C5A059] uppercase tracking-wider">{f.name}</span>
                      <div className="p-2 rounded-xl bg-[#0A0A0B] font-mono text-sm font-bold text-center text-white border border-[#2D2D30]">
                        {f.formula}
                      </div>
                      <p className="text-[11px] text-slate-400">{f.explanation}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Main Content Sections */}
            <div className="mt-8 space-y-8">
              {activeNoteModal.content.map((sec, idx) => (
                <div key={idx} className="space-y-4">
                  <h3 className="text-xl font-serif font-bold text-white border-b border-[#2D2D30] pb-2">
                    {sec.sectionTitle}
                  </h3>

                  <p
                    className={`leading-relaxed text-slate-300 ${
                      fontSize === 'sm' ? 'text-xs leading-relaxed' : fontSize === 'lg' ? 'text-base leading-loose' : 'text-sm leading-relaxed'
                    }`}
                  >
                    {sec.body}
                  </p>

                  {sec.bulletPoints && sec.bulletPoints.length > 0 && (
                    <ul className="space-y-2 my-3 pl-2">
                      {sec.bulletPoints.map((bp, bpIdx) => (
                        <li key={bpIdx} className="flex items-start gap-2 text-xs sm:text-sm text-slate-300">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#C5A059] mt-2 shrink-0" />
                          <span>{bp}</span>
                        </li>
                      ))}
                    </ul>
                  )}

                  {sec.calloutBox && (
                    <div className="p-4 rounded-2xl bg-[#1A1A1C] border border-[#C5A059]/40 flex items-start gap-3 my-4">
                      <Lightbulb className="w-5 h-5 text-[#C5A059] shrink-0 mt-0.5" />
                      <div>
                        <span className="text-xs font-bold uppercase tracking-wider text-[#C5A059] block">
                          {sec.calloutBox.title}
                        </span>
                        <p className="text-xs text-slate-300 mt-1">{sec.calloutBox.text}</p>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Key Terms & Glossary */}
            {activeNoteModal.keyTerms && activeNoteModal.keyTerms.length > 0 && (
              <div className="mt-10 pt-6 border-t border-[#2D2D30] space-y-4">
                <h3 className="text-lg font-serif font-bold flex items-center gap-2 text-[#C5A059]">
                  <FileText className="w-5 h-5" /> {t.glossaryTerms}
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {activeNoteModal.keyTerms.map((termItem, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-xl bg-[#161618] border border-[#2D2D30] space-y-1"
                    >
                      <span className="text-xs font-bold text-white block">{termItem.term}</span>
                      <p className="text-[11px] text-slate-400 leading-relaxed">{termItem.definition}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Bottom Actions */}
            <div className="mt-10 pt-6 border-t border-[#2D2D30] flex flex-col sm:flex-row items-center justify-between gap-4">
              <button
                onClick={() => {
                  onSelectSubjectForQuiz(activeNoteModal.subjectName);
                  setActiveNoteModal(null);
                  onTabChange('quizzes');
                }}
                className="w-full sm:w-auto py-3 px-6 rounded-full bg-[#C5A059] hover:bg-[#d8b168] text-black font-bold text-xs uppercase tracking-wider transition-colors flex items-center justify-center gap-2 shadow-lg shadow-[#C5A059]/20"
              >
                <Award className="w-4 h-4" /> {t.startQuiz}
              </button>

              <button
                onClick={() => setActiveNoteModal(null)}
                className="w-full sm:w-auto py-3 px-6 rounded-full bg-[#1A1A1C] border border-[#2D2D30] hover:border-[#C5A059] text-slate-300 hover:text-white font-bold text-xs uppercase tracking-wider transition-colors"
              >
                {language === 'am' ? 'ዝጋ' : language === 'om' ? 'Cufi' : 'Close Reader'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
