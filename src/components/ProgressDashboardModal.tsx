import React, { useState } from 'react';
import {
  Award,
  Bookmark,
  X,
  BookOpen,
  Trophy,
  Trash2,
  CheckCircle2,
  Save,
  LogIn,
  TrendingUp,
  FileCheck,
  Timer,
  Flame,
  Clock,
} from 'lucide-react';
import { QuizAttempt, ViewTab, StudentUser, CertificateRecord, GradeLevel, SubjectStream, NoteChapter, Language } from '../types';
import { SAMPLE_NOTES } from '../data/notesData';
import { TRANSLATIONS } from '../lib/translations';

interface ProgressDashboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookmarks: string[];
  quizAttempts: QuizAttempt[];
  currentUser: StudentUser | null;
  notes?: NoteChapter[];
  language?: Language;
  onUpdateProfile: (updated: Partial<StudentUser>) => void;
  onOpenAuth: () => void;
  onRemoveBookmark: (noteId: string) => void;
  onClearQuizHistory: () => void;
  onTabChange: (tab: ViewTab) => void;
  onSelectSubjectForNotes: (subjectName: string) => void;
  onViewCertificate: (cert: CertificateRecord) => void;
}

export const ProgressDashboardModal: React.FC<ProgressDashboardModalProps> = ({
  isOpen,
  onClose,
  bookmarks,
  quizAttempts,
  currentUser,
  notes,
  language = 'en',
  onUpdateProfile,
  onOpenAuth,
  onRemoveBookmark,
  onClearQuizHistory,
  onTabChange,
  onSelectSubjectForNotes,
  onViewCertificate,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'profile' | 'certificates' | 'history'>('overview');
  const t = TRANSLATIONS[language] || TRANSLATIONS.en;
  
  // Profile editing state
  const [editName, setEditName] = useState(currentUser?.name || 'Scholar Student');
  const [editGrade, setEditGrade] = useState<GradeLevel>(currentUser?.grade || 'Grade 12');
  const [editStream, setEditStream] = useState<SubjectStream>(currentUser?.stream || 'Natural Science');
  const [editTargetScore, setEditTargetScore] = useState(currentUser?.targetScore || 580);
  const [editBio, setEditBio] = useState(currentUser?.bio || 'Dedicated to secondary academic excellence.');
  const [saveSuccess, setSaveSuccess] = useState(false);

  if (!isOpen) return null;

  const notesList = notes || SAMPLE_NOTES;
  const totalNotesCount = notesList.length;
  const completedNotesCount = (currentUser?.notesCompleted || []).length;
  const progressPercentage = totalNotesCount > 0 ? Math.min(100, Math.round((completedNotesCount / totalNotesCount) * 100)) : 0;

  // Calculate quiz statistics
  const totalQuizzes = quizAttempts.length;
  const totalQuizScore = quizAttempts.reduce((acc, q) => acc + (q.score || 0), 0);
  const avgAccuracy =
    totalQuizzes > 0
      ? Math.round(quizAttempts.reduce((acc, q) => acc + q.percentage, 0) / totalQuizzes)
      : 0;

  const bookmarkedNotesList = notesList.filter((n) => bookmarks.includes(n.id));

  // Compute earned certificates from quiz attempts scoring >= 70%
  const generatedCertificates: CertificateRecord[] = quizAttempts
    .filter((q) => q.percentage >= 70)
    .map((q) => ({
      id: `cert-${q.id}`,
      studentName: currentUser?.name || 'Scholar Student',
      subjectName: `${q.subjectName} (${q.grade})`,
      grade: q.grade,
      issueDate: q.date,
      scorePercentage: q.percentage,
      certificateNumber: `EYOEL-${q.subjectName.substring(0, 3).toUpperCase()}-${Math.floor(10000 + Math.random() * 90000)}`,
      distinction:
        q.percentage >= 90
          ? 'First Class Honors'
          : q.percentage >= 80
          ? 'Excellence Distinction'
          : 'Proficiency Pass',
    }));

  const allCertificates = currentUser?.certificates && currentUser.certificates.length > 0
    ? [...currentUser.certificates, ...generatedCertificates.filter(gc => !currentUser.certificates.some(c => c.id === gc.id))]
    : generatedCertificates;

  const totalFocusMinutes = currentUser?.totalStudyMinutes || 0;
  const totalFocusHours = (totalFocusMinutes / 60).toFixed(1);
  const totalPomodoroSessions = currentUser?.pomodoroSessionsCompleted || 0;

  // Dynamic Academic Badges
  const badges = [
    {
      name: language === 'am' ? 'እንኳን ደህና መጡ' : language === 'om' ? 'Baga Nagaan Dhuftan' : 'Welcome Scholar',
      unlocked: true,
      desc: language === 'am' ? 'በእዮኤል እንዳለ በለጠ የትምህርት ፖርታል ተመዝግበዋል' : language === 'om' ? 'Sirna barnootaa Eyoel Endale Belete keessatti galmooftaniittu' : 'Enrolled in Eyoel Endale Belete Grade 9–12 Portal',
      icon: '🎓',
    },
    {
      name: language === 'am' ? 'የትኩረት ጀማሪ' : language === 'om' ? 'Jalqaba Xiyyeeffannoo' : 'Focus Initiate',
      unlocked: totalFocusMinutes >= 25,
      desc: language === 'am' ? '25+ ደቂቃ የትኩረት ሰዓት አጠናቀዋል' : language === 'om' ? 'Daqiiqaa 25+ xiyyeeffannoo xumurtaniittu' : 'Completed 25+ minutes of focused Pomodoro study',
      icon: '⏱️',
    },
    {
      name: language === 'am' ? 'የትኩረት ልሂቅ' : language === 'om' ? 'Gahumsa Xiyyeeffannoo' : 'Deep Work Scholar',
      unlocked: totalFocusMinutes >= 100,
      desc: language === 'am' ? '100+ ደቂቃ የጠለቀ የትኩረት ሰዓት አጠናቀዋል' : language === 'om' ? 'Daqiiqaa 100+ xiyyeeffannoo cimaa xumurtaniittu' : 'Logged 100+ minutes of deep focus sessions',
      icon: '🔥',
    },
    {
      name: language === 'am' ? 'የመጀመሪያ ፈተና ተጠናቋል' : language === 'om' ? 'Qorumsa Jalqabaa Xumurame' : 'First Exam Completed',
      unlocked: totalQuizzes >= 1,
      desc: language === 'am' ? '1+ የ20 ጥያቄዎች ፈተና ወስደዋል' : language === 'om' ? 'Qorumsa gaaffilee 20 1+ fudhattaniittu' : 'Completed 1+ 20-Question Exam Assessment',
      icon: '📝',
    },
    {
      name: language === 'am' ? 'የልህቀት ማዕረግ' : language === 'om' ? 'Sadarkaa Gahumsaa' : 'Excellence Distinction',
      unlocked: avgAccuracy >= 80 && totalQuizzes >= 1,
      desc: language === 'am' ? '80%+ አማካይ ውጤት አስመዝግበዋል' : language === 'om' ? 'Qabxii giddugaleessaa 80%+ galmeessitaniittu' : 'Achieved 80%+ Average Accuracy Score',
      icon: '🏆',
    },
    {
      name: language === 'am' ? 'ንቁ አንባቢ' : language === 'om' ? 'Dubbisaa Cimaa' : 'Reading Champion',
      unlocked: completedNotesCount >= 1 || bookmarks.length >= 2,
      desc: language === 'am' ? 'የትምህርት ምዕራፎችን አጠናቀዋል' : language === 'om' ? 'Boqonnaa barnootaa dubbistanii xumurtaniittu' : 'Reviewed and completed study chapters',
      icon: '📚',
    },
    {
      name: language === 'am' ? 'የክብር ሰርተፊኬት ባለቤት' : language === 'om' ? 'Abbaa Waraqaa Ragaa' : 'Honor Roll Scholar',
      unlocked: allCertificates.length >= 1,
      desc: language === 'am' ? 'ይፋዊ ሰርተፊኬት አግኝተዋል' : language === 'om' ? 'Waraqaa ragaa fudhattaniittu' : 'Earned an Official Subject Certificate',
      icon: '📜',
    },
    {
      name: language === 'am' ? 'የስርዓተ-ትምህርት አዋቂ' : language === 'om' ? 'Ogeessa Sirna Barnootaa' : 'Curriculum Master',
      unlocked: progressPercentage >= 50,
      desc: language === 'am' ? '50%+ የስርዓተ-ትምህርት ምዕራፎችን አጠናቀዋል' : language === 'om' ? 'Boqonnaa 50%+ xumurtaniittu' : 'Completed 50%+ of all curriculum chapters',
      icon: '🌟',
    },
  ];

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateProfile({
      name: editName,
      grade: editGrade,
      stream: editStream,
      targetScore: editTargetScore,
      bio: editBio,
    });
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-[#111112] rounded-3xl max-w-3xl w-full border border-[#2D2D30] shadow-2xl relative my-8 max-h-[88vh] overflow-hidden flex flex-col text-white">
        
        {/* Header */}
        <div className="p-5 border-b border-[#2D2D30] flex items-center justify-between bg-[#0E0E10]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#C5A059] text-black font-bold flex items-center justify-center text-xl font-serif">
              {currentUser?.avatar || '🎓'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-serif font-bold text-white">
                  {currentUser ? currentUser.name : t.dashboard}
                </h2>
                {currentUser && (
                  <span className="px-2 py-0.5 rounded-full bg-[#2D2D30] text-[#C5A059] text-[10px] font-bold uppercase">
                    {currentUser.grade}
                  </span>
                )}
              </div>
              <span className="text-xs text-slate-400">
                {currentUser
                  ? `${currentUser.stream} • ${language === 'am' ? 'ግብ' : language === 'om' ? 'Galma' : 'Target'}: ${currentUser.targetScore}/600`
                  : language === 'am'
                  ? 'የፈተና ውጤቶችዎን፣ የተጠናቀቁ ትምህርቶችንና ሰርተፊኬቶችዎን ይከታተሉ።'
                  : language === 'om'
                  ? 'Qabxii qorumsaa, barnoota xumurameefi waraqaa ragaa hordofaa.'
                  : 'Track your personal quiz scores, completed lessons, and certificates.'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {!currentUser && (
              <button
                onClick={() => {
                  onClose();
                  onOpenAuth();
                }}
                className="px-3 py-1.5 rounded-full bg-[#C5A059] text-black font-bold text-xs uppercase tracking-wider flex items-center gap-1 hover:bg-[#b08e4c] transition"
              >
                <LogIn className="w-3.5 h-3.5" /> {t.authLogin}
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Navigation Tabs */}
        <div className="px-5 py-2.5 bg-[#161618] border-b border-[#2D2D30] flex items-center gap-3 overflow-x-auto text-xs font-semibold uppercase tracking-wider">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap ${
              activeTab === 'overview'
                ? 'bg-[#C5A059] text-black font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            {language === 'am' ? 'አጠቃላይ እይታ' : language === 'om' ? 'Waliigala' : 'Overview & Stats'}
          </button>
          <button
            onClick={() => setActiveTab('profile')}
            className={`px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap ${
              activeTab === 'profile'
                ? 'bg-[#C5A059] text-black font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            {language === 'am' ? 'የተማሪ ፕሮፋይል' : language === 'om' ? 'Piroofaayilii Barataa' : 'Student Profile'}
          </button>
          <button
            onClick={() => setActiveTab('certificates')}
            className={`px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'certificates'
                ? 'bg-[#C5A059] text-black font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Award className="w-3.5 h-3.5" /> {t.certTitle} ({allCertificates.length})
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'history'
                ? 'bg-[#C5A059] text-black font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" /> {t.bookmarks} ({quizAttempts.length})
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 p-6 overflow-y-auto space-y-6 bg-[#0E0E10]">
          
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Progress Summary Card */}
              <div className="p-5 rounded-2xl bg-[#161618] border border-[#2D2D30] space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#C5A059] uppercase tracking-wider flex items-center gap-1.5">
                    <TrendingUp className="w-4 h-4" /> {t.progress}
                  </span>
                  <span className="text-xs font-mono font-bold text-white">
                    {completedNotesCount} / {totalNotesCount} ({progressPercentage}%)
                  </span>
                </div>
                {/* Progress Bar */}
                <div className="w-full h-3 rounded-full bg-[#1F1F23] overflow-hidden border border-[#2D2D30]">
                  <div
                    className="h-full bg-gradient-to-r from-[#C5A059] to-amber-300 transition-all duration-500 rounded-full"
                    style={{ width: `${progressPercentage}%` }}
                  />
                </div>
              </div>

              {/* Metric Cards (6 cards in responsive grid) */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
                <div className="p-3.5 rounded-2xl bg-[#1A1A1C] border border-[#2D2D30] text-center">
                  <span className="block text-xl font-bold font-mono text-[#C5A059]">
                    {totalQuizScore} pts
                  </span>
                  <span className="text-[9px] font-semibold text-slate-400 uppercase tracking-wider">
                    {t.totalScore}
                  </span>
                </div>

                <div className="p-3.5 rounded-2xl bg-[#1A1A1C] border border-[#2D2D30] text-center">
                  <span className="block text-xl font-bold font-mono text-white">
                    {completedNotesCount}
                  </span>
                  <span className="text-[9px] font-semibold text-slate-400 uppercase tracking-wider">
                    {t.completedLessons}
                  </span>
                </div>

                <div className="p-3.5 rounded-2xl bg-[#1A1A1C] border border-[#2D2D30] text-center">
                  <span className="block text-xl font-bold font-mono text-white">
                    {totalQuizzes}
                  </span>
                  <span className="text-[9px] font-semibold text-slate-400 uppercase tracking-wider">
                    {language === 'am' ? 'ፈተናዎች' : language === 'om' ? 'Qorumsa' : 'Exams'}
                  </span>
                </div>

                <div className="p-3.5 rounded-2xl bg-[#1A1A1C] border border-[#2D2D30] text-center">
                  <span className="block text-xl font-bold font-mono text-emerald-400">
                    {avgAccuracy}%
                  </span>
                  <span className="text-[9px] font-semibold text-slate-400 uppercase tracking-wider">
                    {language === 'am' ? 'አማካይ ውጤት' : language === 'om' ? 'Giddu-galeessa' : 'Accuracy'}
                  </span>
                </div>

                <div className="p-3.5 rounded-2xl bg-[#1A1A1C] border border-[#C5A059]/40 text-center">
                  <span className="block text-xl font-bold font-mono text-[#C5A059]">
                    {totalFocusMinutes}m
                  </span>
                  <span className="text-[9px] font-semibold text-slate-300 uppercase tracking-wider">
                    {language === 'am' ? 'የትኩረት ደቂቃ' : language === 'om' ? 'Xiyyeeffannoo' : 'Focus Time'}
                  </span>
                </div>

                <div className="p-3.5 rounded-2xl bg-[#1A1A1C] border border-[#2D2D30] text-center">
                  <span className="block text-xl font-bold font-mono text-amber-300">
                    {totalPomodoroSessions}
                  </span>
                  <span className="text-[9px] font-semibold text-slate-400 uppercase tracking-wider">
                    {language === 'am' ? 'የትኩረት ዙሮች' : language === 'om' ? 'Marsaa' : 'Sessions'}
                  </span>
                </div>
              </div>

              {/* Academic Badges */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-widest text-[#C5A059] flex items-center gap-1.5">
                  <Trophy className="w-4 h-4" /> {t.badges}:
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {badges.map((b, i) => (
                    <div
                      key={i}
                      className={`p-3.5 rounded-2xl border text-xs flex items-center gap-3 transition-colors ${
                        b.unlocked
                          ? 'bg-[#1A1A1C] border-[#C5A059] text-white shadow-lg shadow-[#C5A059]/5'
                          : 'bg-[#161618] border-[#2D2D30] text-slate-500 opacity-50'
                      }`}
                    >
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl shrink-0 ${
                        b.unlocked ? 'bg-[#C5A059] text-black' : 'bg-[#2D2D30] text-slate-500'
                      }`}>
                        {b.icon}
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-sm text-white">{b.name}</span>
                          {b.unlocked && (
                            <span className="text-[10px] font-bold text-[#C5A059]">✓</span>
                          )}
                        </div>
                        <span className="text-[11px] text-slate-400 block mt-0.5">{b.desc}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: PROFILE */}
          {activeTab === 'profile' && (
            <form onSubmit={handleSaveProfile} className="space-y-4 max-w-lg">
              {saveSuccess && (
                <div className="p-3 rounded-xl bg-emerald-950/50 border border-emerald-700 text-emerald-300 text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" /> {language === 'am' ? 'ፕሮፋይልዎ በተሳካ ሁኔታ ተቀምጧል!' : language === 'om' ? 'Piroofaayiliin milkaa\'inaan kuufameera!' : 'Profile updated successfully in Firestore!'}
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                  {language === 'am' ? 'የተማሪ ሙሉ ስም' : language === 'om' ? 'Maqaa Barataa' : 'Student Full Name'}
                </label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#1A1A1C] border border-[#2D2D30] text-white text-xs focus:outline-none focus:border-[#C5A059]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                    {language === 'am' ? 'የክፍል ደረጃ' : language === 'om' ? 'Sadarkaa Kutaa' : 'Grade Level'}
                  </label>
                  <select
                    value={editGrade}
                    onChange={(e) => setEditGrade(e.target.value as GradeLevel)}
                    className="w-full px-3 py-2.5 rounded-xl bg-[#1A1A1C] border border-[#2D2D30] text-white text-xs focus:outline-none focus:border-[#C5A059]"
                  >
                    <option value="Grade 9">Grade 9</option>
                    <option value="Grade 10">Grade 10</option>
                    <option value="Grade 11">Grade 11</option>
                    <option value="Grade 12">Grade 12</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                    {language === 'am' ? 'የትምህርት ዘርፍ' : language === 'om' ? 'Damee Barnootaa' : 'Stream'}
                  </label>
                  <select
                    value={editStream}
                    onChange={(e) => setEditStream(e.target.value as SubjectStream)}
                    className="w-full px-3 py-2.5 rounded-xl bg-[#1A1A1C] border border-[#2D2D30] text-white text-xs focus:outline-none focus:border-[#C5A059]"
                  >
                    <option value="Natural Science">Natural Science</option>
                    <option value="Social Science">Social Science</option>
                    <option value="General">General</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                  {language === 'am' ? 'የውጤት ግብ (ከ 600)' : language === 'om' ? 'Galma Qabxii (600 keessaa)' : 'Target Score (Out of 600)'}
                </label>
                <input
                  type="number"
                  min={300}
                  max={600}
                  value={editTargetScore}
                  onChange={(e) => setEditTargetScore(Number(e.target.value))}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#1A1A1C] border border-[#2D2D30] text-white text-xs focus:outline-none focus:border-[#C5A059]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                  {language === 'am' ? 'የትምህርት ግቦችና ማስታወሻ' : language === 'om' ? 'Galmaafi Yaada Barnootaa' : 'Academic Goal & Notes'}
                </label>
                <textarea
                  rows={3}
                  value={editBio}
                  onChange={(e) => setEditBio(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#1A1A1C] border border-[#2D2D30] text-white text-xs focus:outline-none focus:border-[#C5A059]"
                />
              </div>

              <button
                type="submit"
                className="px-6 py-2.5 rounded-full bg-[#C5A059] text-black font-bold text-xs uppercase tracking-wider flex items-center gap-2 hover:bg-[#d8b168] transition"
              >
                <Save className="w-4 h-4" /> {language === 'am' ? 'መረጃ አስቀምጥ' : language === 'om' ? 'Oodeeffannoo Olkaayi' : 'Save Profile'}
              </button>
            </form>
          )}

          {/* TAB 3: CERTIFICATES */}
          {activeTab === 'certificates' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400">
                  {language === 'am' ? '70% ወይም ከዚያ በላይ ለተመዘገበባቸው የትምህርት አይነቶች የተሰጡ ሰርተፊኬቶች:' : language === 'om' ? 'Waraqaa ragaa qabxii 70% oliif kenname:' : 'Accredited subject certificates awarded for exam scores ≥ 70%:'}
                </span>
              </div>

              {allCertificates.length === 0 ? (
                <div className="p-8 text-center bg-[#161618] rounded-2xl border border-[#2D2D30] space-y-3">
                  <Award className="w-10 h-10 text-slate-600 mx-auto" />
                  <p className="text-sm text-slate-300 font-bold">
                    {language === 'am' ? 'እስካሁን የተገኘ ሰርተፊኬት የለም' : language === 'om' ? 'Waraqaan ragaa ammayyuu hin argamne' : 'No certificates earned yet'}
                  </p>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto">
                    {language === 'am' ? 'ሰርተፊኬት ለማግኘት በፈተናዎች 70% እና ከዚያ በላይ ያስመዝግቡ!' : language === 'om' ? 'Waraqaa ragaa argachuuf qorumsa irratti 70% galmeessaa!' : 'Score 70% or above on any Grade 9–12 subject exam to unlock an accredited certificate!'}
                  </p>
                  <button
                    onClick={() => {
                      onTabChange('quizzes');
                      onClose();
                    }}
                    className="px-5 py-2.5 rounded-full bg-[#C5A059] text-black font-bold text-xs uppercase tracking-wider hover:bg-[#b08e4c] transition"
                  >
                    {t.btnTakeQuiz}
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {allCertificates.map((cert) => (
                    <div
                      key={cert.id}
                      className="p-5 rounded-2xl bg-[#1A1A1C] border border-[#C5A059]/40 hover:border-[#C5A059] space-y-3 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-serif font-bold text-[#C5A059] uppercase tracking-wider">
                          EYOEL ENDALE BELETE
                        </span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-950 text-emerald-400 border border-emerald-800">
                          {cert.scorePercentage}% Score
                        </span>
                      </div>

                      <div>
                        <h4 className="text-sm font-bold text-white">{cert.subjectName}</h4>
                        <span className="text-[11px] text-slate-400 block">{cert.distinction}</span>
                        <span className="text-[10px] text-slate-500 block font-mono mt-1">ID: {cert.certificateNumber}</span>
                      </div>

                      <button
                        onClick={() => onViewCertificate(cert)}
                        className="w-full py-2 rounded-xl bg-[#161618] border border-[#2D2D30] hover:border-[#C5A059] text-[#C5A059] text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors"
                      >
                        <FileCheck className="w-3.5 h-3.5" /> {t.printCert}
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 4: SAVED NOTES & HISTORY */}
          {activeTab === 'history' && (
            <div className="space-y-6">
              {/* Bookmarked Notes */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-widest text-[#C5A059]">
                  {t.bookmarks} ({bookmarkedNotesList.length}):
                </h3>
                {bookmarkedNotesList.length === 0 ? (
                  <p className="text-xs text-slate-500 italic">{language === 'am' ? 'ምንም የተቀመጡ ማስታወሻዎች የሉም።' : language === 'om' ? 'Qabxiin olkaawame hin jiru.' : 'No notes bookmarked yet.'}</p>
                ) : (
                  <div className="space-y-2">
                    {bookmarkedNotesList.map((note) => (
                      <div
                        key={note.id}
                        className="p-3 rounded-xl bg-[#1A1A1C] border border-[#2D2D30] flex items-center justify-between text-xs"
                      >
                        <div className="flex items-center gap-2">
                          <BookOpen className="w-4 h-4 text-[#C5A059]" />
                          <span>{note.title} ({note.grade})</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => {
                              onSelectSubjectForNotes(note.subjectName);
                              onTabChange('notes');
                              onClose();
                            }}
                            className="px-3 py-1 rounded-full bg-[#C5A059] text-black text-[11px] font-bold uppercase"
                          >
                            {t.btnReadChapter}
                          </button>
                          <button
                            onClick={() => onRemoveBookmark(note.id)}
                            className="text-slate-400 hover:text-rose-400 p-1"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Quiz Attempts */}
              <div className="space-y-3 pt-4 border-t border-[#2D2D30]">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold uppercase tracking-widest text-[#C5A059]">
                    {language === 'am' ? 'የፈተና ታሪክ' : language === 'om' ? 'Seenaa Qorumsaa' : 'Exam Submission History'} ({quizAttempts.length}):
                  </h3>
                  {quizAttempts.length > 0 && (
                    <button
                      onClick={onClearQuizHistory}
                      className="text-[11px] font-semibold text-rose-400 hover:underline uppercase"
                    >
                      {language === 'am' ? 'ታሪክ አጽዳ' : language === 'om' ? 'Haqi' : 'Clear History'}
                    </button>
                  )}
                </div>

                {quizAttempts.length === 0 ? (
                  <p className="text-xs text-slate-500 italic">{language === 'am' ? 'ምንም የተወሰዱ ፈተናዎች የሉም።' : language === 'om' ? 'Qorumsi fudhatame hin jiru.' : 'No exam attempts recorded yet.'}</p>
                ) : (
                  <div className="space-y-2">
                    {quizAttempts.map((attempt) => (
                      <div
                        key={attempt.id}
                        className="p-3 rounded-xl bg-[#1A1A1C] border border-[#2D2D30] flex items-center justify-between text-xs"
                      >
                        <div>
                          <span className="font-bold block text-white">{attempt.quizTitle}</span>
                          <span className="text-[10px] text-slate-400">{attempt.date} • {attempt.grade} • {attempt.score}/{attempt.totalQuestions} Correct</span>
                        </div>
                        <span className="font-bold text-sm text-[#C5A059]">
                          {attempt.percentage}%
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
