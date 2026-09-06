import React, { useState } from 'react';
import {
  Layers,
  BookOpen,
  Award,
  Search,
  ChevronRight,
  X,
  CheckCircle2,
  Atom,
  Calculator,
  FlaskConical,
  Dna,
  Laptop,
  Landmark,
  Scale,
  Globe,
  TrendingUp,
} from 'lucide-react';
import { GradeLevel, Subject, SubjectStream, ViewTab, Language } from '../types';
import { SUBJECTS, GRADES } from '../data/gradesAndSubjects';
import { TRANSLATIONS, SUBJECT_TRANSLATIONS } from '../lib/translations';

interface SubjectsViewProps {
  language: Language;
  selectedGrade: GradeLevel | 'All';
  onGradeChange: (grade: GradeLevel | 'All') => void;
  onTabChange: (tab: ViewTab) => void;
  onSelectSubjectForNotes: (subjectName: string) => void;
  onSelectSubjectForQuiz: (subjectName: string) => void;
}

export const SubjectsView: React.FC<SubjectsViewProps> = ({
  language,
  selectedGrade,
  onGradeChange,
  onTabChange,
  onSelectSubjectForNotes,
  onSelectSubjectForQuiz,
}) => {
  const [selectedStream, setSelectedStream] = useState<SubjectStream | 'All'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSubjectModal, setActiveSubjectModal] = useState<Subject | null>(null);

  const t = TRANSLATIONS[language] || TRANSLATIONS.en;

  // Helper to map icon names
  const renderSubjectIcon = (iconName: string) => {
    switch (iconName) {
      case 'Calculator': return <Calculator className="w-6 h-6 text-[#C5A059]" />;
      case 'Atom': return <Atom className="w-6 h-6 text-[#C5A059]" />;
      case 'FlaskConical': return <FlaskConical className="w-6 h-6 text-[#C5A059]" />;
      case 'Dna': return <Dna className="w-6 h-6 text-[#C5A059]" />;
      case 'BookOpen': return <BookOpen className="w-6 h-6 text-[#C5A059]" />;
      case 'Laptop': return <Laptop className="w-6 h-6 text-[#C5A059]" />;
      case 'Landmark': return <Landmark className="w-6 h-6 text-[#C5A059]" />;
      case 'Scale': return <Scale className="w-6 h-6 text-[#C5A059]" />;
      case 'Globe': return <Globe className="w-6 h-6 text-[#C5A059]" />;
      case 'TrendingUp': return <TrendingUp className="w-6 h-6 text-[#C5A059]" />;
      default: return <Layers className="w-6 h-6 text-[#C5A059]" />;
    }
  };

  // Filter subjects based on grade, stream, and search
  const filteredSubjects = SUBJECTS.filter((sub) => {
    const matchesGrade = selectedGrade === 'All' || sub.grades.includes(selectedGrade);
    const matchesStream = selectedStream === 'All' || sub.stream === selectedStream || sub.stream === 'General';
    const localizedName = SUBJECT_TRANSLATIONS[sub.name]?.[language] || sub.name;
    const matchesSearch =
      sub.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      localizedName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sub.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sub.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sub.topics.some((topic) => topic.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesGrade && matchesStream && matchesSearch;
  });

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 bg-[#0A0A0B]">
      
      {/* Title & Overview Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[#2D2D30]">
        <div>
          <div className="flex items-center gap-2 text-[#C5A059] font-bold text-xs uppercase tracking-[0.2em] mb-1">
            <Layers className="w-4 h-4" /> {t.navCurriculum}
          </div>
          <h1 className="text-2xl sm:text-4xl font-serif font-semibold text-white tracking-tight">
            {t.subjectsHeading}
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
            {t.subjectsSub}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-full bg-[#161618] border border-[#2D2D30] text-[#C5A059]">
            {filteredSubjects.length} {language === 'am' ? 'የትምህርት አይነቶች' : language === 'om' ? 'Gosoota Barnootaa' : 'Subjects Listed'}
          </span>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="space-y-4">
        {/* Search Input */}
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

        {/* Grade & Stream Selector Pills */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* Grade Pills */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mr-1">
              {t.filterByGrade}:
            </span>
            <button
              onClick={() => onGradeChange('All')}
              className={`px-3 py-1.5 rounded-full text-xs font-bold transition-colors ${
                selectedGrade === 'All'
                  ? 'bg-[#C5A059] text-black shadow-md'
                  : 'bg-[#111112] text-slate-300 border border-[#2D2D30] hover:border-[#C5A059]'
              }`}
            >
              {t.allGrades}
            </button>
            {GRADES.map((g) => (
              <button
                key={g.level}
                onClick={() => onGradeChange(g.level)}
                className={`px-3 py-1.5 rounded-full text-xs font-bold transition-colors ${
                  selectedGrade === g.level
                    ? 'bg-[#C5A059] text-black shadow-md'
                    : 'bg-[#111112] text-slate-300 border border-[#2D2D30] hover:border-[#C5A059]'
                }`}
              >
                {language === 'am' ? g.level.replace('Grade ', 'ክፍል ') : language === 'om' ? g.level.replace('Grade ', 'Kutaa ') : g.level}
              </button>
            ))}
          </div>

          {/* Stream Filter Pills */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mr-1">
              {language === 'am' ? 'ዘርፍ' : language === 'om' ? 'Damee' : 'Stream'}:
            </span>
            {(['All', 'Natural Science', 'Social Science', 'General'] as (SubjectStream | 'All')[]).map((stream) => {
              let label = stream;
              if (stream === 'All') label = t.streamAll as any;
              else if (stream === 'Natural Science') label = t.streamNatural as any;
              else if (stream === 'Social Science') label = t.streamSocial as any;
              else if (stream === 'General') label = t.streamGeneral as any;

              return (
                <button
                  key={stream}
                  onClick={() => setSelectedStream(stream)}
                  className={`px-3 py-1 rounded-full text-[11px] font-semibold uppercase tracking-wider transition-colors ${
                    selectedStream === stream
                      ? 'bg-[#1A1A1C] text-[#C5A059] border border-[#C5A059]'
                      : 'bg-[#111112] text-slate-400 border border-[#2D2D30] hover:text-white'
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Subject Cards Grid */}
      {filteredSubjects.length === 0 ? (
        <div className="text-center py-16 bg-[#111112] rounded-2xl border border-[#2D2D30] p-8">
          <Layers className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <h3 className="text-lg font-serif font-bold text-white mb-1">
            {t.noNotesFound}
          </h3>
          <p className="text-xs text-slate-400">
            {language === 'am' ? 'እባክዎ የተለየ የፍለጋ ቃል ወይም የክፍል ደረጃ ይሞክሩ።' : language === 'om' ? 'Mee jecha biraatiin ykn kutaalee biraatiin yaalaa.' : 'Try adjusting your search criteria or grade level filters.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSubjects.map((subject) => {
            const localizedName = SUBJECT_TRANSLATIONS[subject.name]?.[language] || subject.name;
            return (
              <div
                key={subject.id}
                className="rounded-2xl bg-[#111112] border border-[#2D2D30] p-6 hover:border-[#C5A059] transition-all flex flex-col justify-between group"
              >
                <div>
                  {/* Top Badges */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <div className="w-10 h-10 rounded-xl bg-[#1A1A1C] border border-[#2D2D30] flex items-center justify-center">
                        {renderSubjectIcon(subject.icon)}
                      </div>
                      <div>
                        <span className="text-[10px] font-bold text-[#C5A059] tracking-wider uppercase block">
                          {subject.code}
                        </span>
                        <span className="text-[10px] text-slate-400 uppercase tracking-wider">
                          {subject.stream}
                        </span>
                      </div>
                    </div>

                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#1A1A1C] text-slate-300 border border-[#2D2D30]">
                      {subject.unitCount} {t.unitsCount}
                    </span>
                  </div>

                  {/* Subject Name */}
                  <h3 className="text-lg font-serif font-bold text-white group-hover:text-[#C5A059] transition-colors">
                    {localizedName}
                  </h3>

                  <p className="text-xs text-slate-400 mt-2 line-clamp-3 leading-relaxed">
                    {subject.description}
                  </p>

                  {/* Grades Badges */}
                  <div className="mt-4 pt-3 border-t border-[#2D2D30] flex flex-wrap items-center gap-1.5">
                    {subject.grades.map((g) => (
                      <span
                        key={g}
                        className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-[#1A1A1C] text-[#C5A059] border border-[#C5A059]/30"
                      >
                        {language === 'am' ? g.replace('Grade ', 'ክፍል ') : language === 'om' ? g.replace('Grade ', 'Kutaa ') : g}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Action Footer */}
                <div className="mt-6 pt-4 border-t border-[#2D2D30] space-y-2">
                  <button
                    onClick={() => setActiveSubjectModal(subject)}
                    className="w-full py-2.5 px-4 rounded-xl bg-[#1A1A1C] hover:border-[#C5A059] border border-[#2D2D30] text-white font-bold text-xs uppercase tracking-wider transition-colors flex items-center justify-center gap-2"
                  >
                    {language === 'am' ? 'አጠቃላይ እይታና ምዕራፎች' : language === 'om' ? 'Ibsaafi Yuuniitota' : 'Overview & Units'} <ChevronRight className="w-4 h-4 text-[#C5A059]" />
                  </button>

                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        onSelectSubjectForNotes(subject.name);
                        onTabChange('notes');
                      }}
                      className="flex-1 py-2 px-3 rounded-lg bg-[#C5A059] hover:bg-[#d8b168] text-black font-bold text-xs uppercase tracking-wider transition-colors flex items-center justify-center gap-1.5"
                    >
                      <BookOpen className="w-3.5 h-3.5" /> {t.navNotes}
                    </button>

                    <button
                      onClick={() => {
                        onSelectSubjectForQuiz(subject.name);
                        onTabChange('quizzes');
                      }}
                      className="flex-1 py-2 px-3 rounded-lg bg-[#1A1A1C] border border-[#2D2D30] hover:border-[#C5A059] text-white font-bold text-xs uppercase tracking-wider transition-colors flex items-center justify-center gap-1.5"
                    >
                      <Award className="w-3.5 h-3.5 text-[#C5A059]" /> {t.navQuizzes}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Subject Detail Modal */}
      {activeSubjectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 overflow-y-auto">
          <div className="bg-[#111112] rounded-3xl max-w-2xl w-full border border-[#2D2D30] p-6 sm:p-8 space-y-6 shadow-2xl relative my-8">
            <button
              onClick={() => setActiveSubjectModal(null)}
              className="absolute top-6 right-6 p-2 rounded-full text-slate-400 hover:text-white hover:bg-[#1A1A1C]"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-[#1A1A1C] border border-[#2D2D30] flex items-center justify-center">
                {renderSubjectIcon(activeSubjectModal.icon)}
              </div>
              <div>
                <span className="text-xs font-bold text-[#C5A059] uppercase tracking-widest">
                  {activeSubjectModal.code} • {activeSubjectModal.stream}
                </span>
                <h2 className="text-2xl font-serif font-bold text-white">
                  {SUBJECT_TRANSLATIONS[activeSubjectModal.name]?.[language] || activeSubjectModal.name}
                </h2>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {activeSubjectModal.description}
            </p>

            {/* Target Grades */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-widest text-[#C5A059] mb-2">
                {language === 'am' ? 'የክፍል ደረጃዎች:' : language === 'om' ? 'Kutaalee Barnootaa:' : 'Grade Coverage:'}
              </h4>
              <div className="flex flex-wrap gap-2">
                {activeSubjectModal.grades.map((g) => (
                  <span
                    key={g}
                    className="px-3 py-1 rounded-lg text-xs font-bold uppercase bg-[#1A1A1C] text-[#C5A059] border border-[#C5A059]/30"
                  >
                    {language === 'am' ? g.replace('Grade ', 'ክፍል ') : language === 'om' ? g.replace('Grade ', 'Kutaa ') : g}
                  </span>
                ))}
              </div>
            </div>

            {/* Topic Units List */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-widest text-[#C5A059] mb-2">
                {language === 'am'
                  ? `የስርዓተ-ትምህርት ምዕራፎች (${activeSubjectModal.topics.length} ዋና ዋና ክፍሎች):`
                  : language === 'om'
                  ? `Mata-dureewwan Silabasii (${activeSubjectModal.topics.length} Yuuniitota Ijoo):`
                  : `Syllabus Topics (${activeSubjectModal.topics.length} Key Units):`}
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {activeSubjectModal.topics.map((topicItem, index) => (
                  <div
                    key={index}
                    className="p-3 rounded-xl bg-[#1A1A1C] text-xs font-medium text-slate-200 flex items-center gap-2 border border-[#2D2D30]"
                  >
                    <CheckCircle2 className="w-4 h-4 text-[#C5A059] shrink-0" />
                    <span>{topicItem}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Direct Action Buttons */}
            <div className="pt-4 border-t border-[#2D2D30] flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => {
                  onSelectSubjectForNotes(activeSubjectModal.name);
                  setActiveSubjectModal(null);
                  onTabChange('notes');
                }}
                className="flex-1 py-3 px-4 rounded-full bg-[#C5A059] hover:bg-[#d8b168] text-black font-bold text-xs uppercase tracking-wider transition-colors flex items-center justify-center gap-2"
              >
                <BookOpen className="w-4 h-4" /> {t.btnViewNotes}
              </button>

              <button
                onClick={() => {
                  onSelectSubjectForQuiz(activeSubjectModal.name);
                  setActiveSubjectModal(null);
                  onTabChange('quizzes');
                }}
                className="flex-1 py-3 px-4 rounded-full bg-[#1A1A1C] border border-[#2D2D30] hover:border-[#C5A059] text-white font-bold text-xs uppercase tracking-wider transition-colors flex items-center justify-center gap-2"
              >
                <Award className="w-4 h-4 text-[#C5A059]" /> {t.btnTakeQuiz}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
