import React, { useState } from 'react';
import {
  Award,
  BookOpen,
  Bookmark,
  CheckCircle2,
  Clock,
  Flame,
  Globe,
  GraduationCap,
  KeyRound,
  Layers,
  LayoutDashboard,
  LogOut,
  Moon,
  Save,
  Settings,
  ShieldCheck,
  Sparkles,
  Sun,
  Timer,
  TrendingUp,
  Trophy,
  User,
  Zap,
  ArrowUpRight,
  HelpCircle,
  FileCheck,
  AlertCircle,
  ExternalLink,
  ChevronRight,
  BarChart3,
  Calendar,
  FileText,
} from 'lucide-react';
import {
  StudentUser,
  QuizAttempt,
  CertificateRecord,
  Subject,
  NoteChapter,
  Quiz,
  GradeLevel,
  SubjectStream,
  Language,
  ViewTab,
} from '../types';
import { TRANSLATIONS, SUBJECT_TRANSLATIONS } from '../lib/translations';
import { logoutStudent, resetPassword, updateUserProfile } from '../lib/firebase';

interface DashboardViewProps {
  currentUser: StudentUser;
  language: Language;
  onLanguageChange: (lang: Language) => void;
  darkMode: boolean;
  onToggleDarkMode: () => void;
  onTabChange: (tab: ViewTab) => void;
  subjects: Subject[];
  notes: NoteChapter[];
  quizzes: Quiz[];
  quizAttempts: QuizAttempt[];
  bookmarks: string[];
  onUpdateProfile: (updated: Partial<StudentUser>) => void;
  onSelectSubjectForNotes: (subjectName: string) => void;
  onSelectSubjectForQuiz: (subjectName: string) => void;
  onViewCertificate: (cert: CertificateRecord) => void;
  onOpenCertificateStudio: () => void;
  onOpenAITutor: () => void;
  onOpenFlashcards: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  currentUser,
  language,
  onLanguageChange,
  darkMode,
  onToggleDarkMode,
  onTabChange,
  subjects,
  notes,
  quizzes,
  quizAttempts,
  bookmarks,
  onUpdateProfile,
  onSelectSubjectForNotes,
  onSelectSubjectForQuiz,
  onViewCertificate,
  onOpenCertificateStudio,
  onOpenAITutor,
  onOpenFlashcards,
}) => {
  const [activeTab, setActiveTab] = useState<'courses' | 'progress' | 'certificates' | 'profile' | 'settings'>('courses');
  
  // Profile edit state
  const [name, setName] = useState(currentUser.name);
  const [username, setUsername] = useState(currentUser.username || currentUser.email.split('@')[0]);
  const [grade, setGrade] = useState<GradeLevel>(currentUser.grade || 'Grade 12');
  const [stream, setStream] = useState<SubjectStream>(currentUser.stream || 'Natural Science');
  const [targetScore, setTargetScore] = useState(currentUser.targetScore || 580);
  const [bio, setBio] = useState(currentUser.bio || 'Dedicated student at Eyoel Academy.');
  const [avatar, setAvatar] = useState(currentUser.avatar || '🎓');
  const [savingProfile, setSavingProfile] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Settings & Security state
  const [resetEmailSent, setResetEmailSent] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);
  const [resetError, setResetError] = useState('');
  const [studyReminders, setStudyReminders] = useState(true);
  const [autoSaveProgress, setAutoSaveProgress] = useState(true);

  const t = TRANSLATIONS[language] || TRANSLATIONS.en;

  // Filter student courses matching their Grade Level & Stream
  const enrolledSubjects = subjects.filter((s) => {
    const gradeMatch = s.grades.includes(grade);
    const streamMatch = s.stream === 'General' || s.stream === stream;
    return gradeMatch && streamMatch;
  });

  // Calculate academic stats
  const completedNotesCount = (currentUser.notesCompleted || []).length;
  const totalNotesAvailable = notes.filter((n) => n.grade === grade).length || 1;
  const noteCompletionPercent = Math.min(100, Math.round((completedNotesCount / totalNotesAvailable) * 100));

  const totalQuizzesTaken = quizAttempts.length;
  const totalCorrectQuestions = quizAttempts.reduce((acc, q) => acc + (q.score || 0), 0);
  const avgQuizAccuracy =
    totalQuizzesTaken > 0
      ? Math.round(quizAttempts.reduce((acc, q) => acc + (q.percentage || 0), 0) / totalQuizzesTaken)
      : 0;

  const totalFocusMinutes = currentUser.totalStudyMinutes || 0;
  const totalFocusHours = (totalFocusMinutes / 60).toFixed(1);
  const pomodoroSessions = currentUser.pomodoroSessionsCompleted || 0;

  // Certificates list
  const earnedCertificates = currentUser.certificates && currentUser.certificates.length > 0
    ? currentUser.certificates
    : quizAttempts
        .filter((q) => q.percentage >= 75)
        .map((q) => ({
          id: `cert-${q.id}`,
          studentName: currentUser.name,
          subjectName: `${q.subjectName} (${q.grade})`,
          grade: q.grade,
          issueDate: q.date,
          scorePercentage: q.percentage,
          certificateNumber: `EYOEL-${q.subjectName.substring(0, 3).toUpperCase()}-${Math.floor(10000 + Math.random() * 90000)}`,
          distinction: (q.percentage >= 90 ? 'First Class Honors' : q.percentage >= 80 ? 'Excellence Distinction' : 'Proficiency Pass') as any,
        }));

  // Handle saving profile changes
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingProfile(true);
    try {
      const updates: Partial<StudentUser> = {
        name: name.trim(),
        username: username.trim().toLowerCase().replace(/[^a-z0-9._-]/g, ''),
        grade,
        stream,
        targetScore: Number(targetScore),
        bio: bio.trim(),
        avatar,
      };
      await updateUserProfile(currentUser.id, updates);
      onUpdateProfile(updates);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      console.error('Failed to update profile:', err);
      // Fallback local update
      onUpdateProfile({ name, username, grade, stream, targetScore, bio, avatar });
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } finally {
      setSavingProfile(false);
    }
  };

  // Handle sending password reset email
  const handleTriggerPasswordReset = async () => {
    setResetLoading(true);
    setResetError('');
    try {
      await resetPassword(currentUser.email);
      setResetEmailSent(true);
      setTimeout(() => setResetEmailSent(false), 6000);
    } catch (err: any) {
      setResetError(err?.message || 'Could not send reset link. Please check your email.');
    } finally {
      setResetLoading(false);
    }
  };

  // Handle Logout
  const handleLogout = async () => {
    try {
      await logoutStudent();
      onUpdateProfile({} as any);
      onTabChange('home');
    } catch (err) {
      console.warn('Logout error, switching to guest mode:', err);
      onTabChange('home');
    }
  };

  const avatarOptions = ['🎓', '🦁', '⭐', '🚀', '🔬', '💡', '📚', '🏆', '🦅', '🧠', '🛡️'];

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-[#0A0A0C] text-slate-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* =========================================================================
            TOP WELCOME HERO & STUDENT DOSSIER BANNER
            ========================================================================= */}
        <div className="relative rounded-3xl bg-gradient-to-r from-[#16161A] via-[#121215] to-[#1A1A1F] border border-[#2D2D32] p-6 sm:p-8 shadow-2xl overflow-hidden">
          {/* Subtle background glow */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#C5A059]/10 rounded-full blur-[100px] pointer-events-none" />
          <div className="absolute bottom-0 left-1/3 w-64 h-64 bg-amber-500/5 rounded-full blur-[80px] pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            
            {/* User Greeting & Bio */}
            <div className="flex items-center gap-4 sm:gap-5">
              <div className="relative group">
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-[#1F1F24] border-2 border-[#C5A059] flex items-center justify-center text-3xl sm:text-4xl shadow-xl shadow-[#C5A059]/20">
                  {currentUser.avatar || '🎓'}
                </div>
                <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-emerald-500 border-2 border-[#121215] flex items-center justify-center text-[10px] text-white font-bold" title="Active Scholar Status">
                  ✓
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-[#C5A059]/20 text-[#C5A059] border border-[#C5A059]/40 uppercase tracking-wider">
                    {currentUser.role === 'admin' ? '🛡️ Administrator' : '🎓 Enrolled Scholar'}
                  </span>
                  <span className="text-[10px] font-semibold text-slate-400">
                    ID: @{currentUser.username || currentUser.email.split('@')[0]}
                  </span>
                </div>

                <h1 className="text-2xl sm:text-3xl font-serif font-bold text-white tracking-wide">
                  {language === 'am' ? `እንኳን ደህና መጡ፣ ${currentUser.name}!` : language === 'om' ? `Baga nagaan dhufte, ${currentUser.name}!` : `Welcome back, ${currentUser.name}!`}
                </h1>

                <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
                  {currentUser.bio || `${currentUser.grade} • ${currentUser.stream} • Candidate at Eyoel Academy`}
                </p>
              </div>
            </div>

            {/* Quick Action Buttons */}
            <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto justify-start md:justify-end">
              <button
                onClick={() => onTabChange('planner')}
                className="px-3.5 py-2 rounded-xl bg-[#1A1A1E] hover:bg-[#25252A] border border-[#2D2D32] text-[#C5A059] font-bold text-xs uppercase tracking-wider flex items-center gap-2 transition-colors"
                title="Personal Study Planner"
              >
                <Calendar className="w-4 h-4" />
                <span>{language === 'am' ? 'እቅድ' : language === 'om' ? 'Karoora' : 'Planner'}</span>
              </button>

              <button
                onClick={() => onTabChange('leaderboard')}
                className="px-3.5 py-2 rounded-xl bg-[#1A1A1E] hover:bg-[#25252A] border border-[#2D2D32] text-amber-400 font-bold text-xs uppercase tracking-wider flex items-center gap-2 transition-colors"
                title="Leaderboard & Badges"
              >
                <Trophy className="w-4 h-4" />
                <span>{language === 'am' ? 'ደረጃ' : language === 'om' ? 'Sadarkaa' : 'Ranks'}</span>
              </button>

              <button
                onClick={() => onTabChange('analytics')}
                className="px-3.5 py-2 rounded-xl bg-[#1A1A1E] hover:bg-[#25252A] border border-[#2D2D32] text-blue-400 font-bold text-xs uppercase tracking-wider flex items-center gap-2 transition-colors"
                title="Personalized Learning Analytics"
              >
                <BarChart3 className="w-4 h-4" />
                <span>{language === 'am' ? 'ትንታኔ' : language === 'om' ? 'Qaaccessa' : 'Analytics'}</span>
              </button>

              <button
                onClick={() => onTabChange('report-card')}
                className="px-3.5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-emerald-500/20 transition-transform active:scale-95"
              >
                <FileText className="w-4 h-4" />
                <span>{language === 'am' ? 'የውጤት ካርድ' : language === 'om' ? 'Waraqaa Qabxii' : 'Report Card'}</span>
              </button>

              <button
                onClick={onOpenAITutor}
                className="px-3.5 py-2 rounded-xl bg-[#C5A059] hover:bg-[#d8b168] text-black font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-[#C5A059]/20 transition-transform active:scale-95"
              >
                <Sparkles className="w-4 h-4" />
                <span>AI Tutor</span>
              </button>

              <button
                onClick={onOpenFlashcards}
                className="px-3.5 py-2 rounded-xl bg-[#1A1A1E] hover:bg-[#25252A] border border-[#2D2D32] text-slate-200 font-bold text-xs uppercase tracking-wider flex items-center gap-2 transition-colors"
              >
                <Zap className="w-4 h-4 text-[#C5A059]" />
                <span>Flashcards</span>
              </button>

              <button
                onClick={handleLogout}
                className="px-3.5 py-2 rounded-xl bg-[#1A1A1E] hover:bg-rose-950/50 hover:border-rose-800 border border-[#2D2D32] text-rose-300 font-bold text-xs uppercase tracking-wider flex items-center gap-2 transition-colors"
                title="Sign out of account"
              >
                <LogOut className="w-4 h-4" />
                <span>{language === 'am' ? 'ውጣ' : 'Logout'}</span>
              </button>
            </div>

          </div>

          {/* Key Metrics Ribbon */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mt-8 pt-6 border-t border-[#2D2D32]/80">
            
            <div className="p-3 rounded-2xl bg-[#151518]/90 border border-[#25252A]">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <Flame className="w-3.5 h-3.5 text-amber-500" />
                Study Streak
              </span>
              <p className="text-xl font-bold text-white mt-1">
                {currentUser.studyStreakDays || 1} <span className="text-xs text-amber-400 font-normal">Days</span>
              </p>
            </div>

            <div className="p-3 rounded-2xl bg-[#151518]/90 border border-[#25252A]">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <Trophy className="w-3.5 h-3.5 text-[#C5A059]" />
                Target Score
              </span>
              <p className="text-xl font-bold text-[#C5A059] mt-1">
                {currentUser.targetScore || 580}<span className="text-xs text-slate-400 font-normal">/600</span>
              </p>
            </div>

            <div className="p-3 rounded-2xl bg-[#151518]/90 border border-[#25252A]">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-emerald-400" />
                Completed Notes
              </span>
              <p className="text-xl font-bold text-white mt-1">
                {completedNotesCount} <span className="text-xs text-slate-400 font-normal">Units</span>
              </p>
            </div>

            <div className="p-3 rounded-2xl bg-[#151518]/90 border border-[#25252A]">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <Award className="w-3.5 h-3.5 text-blue-400" />
                Quiz Accuracy
              </span>
              <p className="text-xl font-bold text-white mt-1">
                {avgQuizAccuracy}% <span className="text-xs text-slate-400 font-normal">Avg</span>
              </p>
            </div>

            <div className="p-3 rounded-2xl bg-[#151518]/90 border border-[#25252A]">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <Timer className="w-3.5 h-3.5 text-purple-400" />
                Focus Hours
              </span>
              <p className="text-xl font-bold text-white mt-1">
                {totalFocusHours} <span className="text-xs text-slate-400 font-normal">Hrs</span>
              </p>
            </div>

            <div className="p-3 rounded-2xl bg-[#151518]/90 border border-[#25252A]">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <FileCheck className="w-3.5 h-3.5 text-[#C5A059]" />
                Certificates
              </span>
              <p className="text-xl font-bold text-[#C5A059] mt-1">
                {earnedCertificates.length} <span className="text-xs text-slate-400 font-normal">Earned</span>
              </p>
            </div>

          </div>
        </div>

        {/* =========================================================================
            DASHBOARD TAB NAVIGATION HEADER
            ========================================================================= */}
        <div className="flex items-center justify-between border-b border-[#2D2D32] pb-4 overflow-x-auto gap-2">
          <div className="flex items-center gap-2">
            
            <button
              onClick={() => setActiveTab('courses')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all whitespace-nowrap ${
                activeTab === 'courses'
                  ? 'bg-[#C5A059] text-black shadow-lg shadow-[#C5A059]/20'
                  : 'bg-[#151518] text-slate-300 hover:bg-[#1F1F24] hover:text-white border border-[#2D2D32]'
              }`}
            >
              <Layers className="w-4 h-4" />
              <span>{language === 'am' ? 'የትምህርት ክፍለ ጊዜዎቼ' : 'My Courses'}</span>
              <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${activeTab === 'courses' ? 'bg-black/30 text-black' : 'bg-[#25252A] text-[#C5A059]'}`}>
                {enrolledSubjects.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('progress')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all whitespace-nowrap ${
                activeTab === 'progress'
                  ? 'bg-[#C5A059] text-black shadow-lg shadow-[#C5A059]/20'
                  : 'bg-[#151518] text-slate-300 hover:bg-[#1F1F24] hover:text-white border border-[#2D2D32]'
              }`}
            >
              <TrendingUp className="w-4 h-4" />
              <span>{language === 'am' ? 'የእድገት ሪፖርት' : 'Progress & Analytics'}</span>
            </button>

            <button
              onClick={() => setActiveTab('certificates')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all whitespace-nowrap ${
                activeTab === 'certificates'
                  ? 'bg-[#C5A059] text-black shadow-lg shadow-[#C5A059]/20'
                  : 'bg-[#151518] text-slate-300 hover:bg-[#1F1F24] hover:text-white border border-[#2D2D32]'
              }`}
            >
              <Award className="w-4 h-4" />
              <span>{language === 'am' ? 'የክብር ሰርተፊኬቶች' : 'Certificates'}</span>
              <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${activeTab === 'certificates' ? 'bg-black/30 text-black' : 'bg-[#25252A] text-[#C5A059]'}`}>
                {earnedCertificates.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('profile')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all whitespace-nowrap ${
                activeTab === 'profile'
                  ? 'bg-[#C5A059] text-black shadow-lg shadow-[#C5A059]/20'
                  : 'bg-[#151518] text-slate-300 hover:bg-[#1F1F24] hover:text-white border border-[#2D2D32]'
              }`}
            >
              <User className="w-4 h-4" />
              <span>{language === 'am' ? 'መገለጫ' : 'Profile'}</span>
            </button>

            <button
              onClick={() => setActiveTab('settings')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all whitespace-nowrap ${
                activeTab === 'settings'
                  ? 'bg-[#C5A059] text-black shadow-lg shadow-[#C5A059]/20'
                  : 'bg-[#151518] text-slate-300 hover:bg-[#1F1F24] hover:text-white border border-[#2D2D32]'
              }`}
            >
              <Settings className="w-4 h-4" />
              <span>{language === 'am' ? 'ቅንብሮች' : 'Settings'}</span>
            </button>

          </div>

          <div className="hidden lg:flex items-center gap-3 text-xs text-slate-400">
            <span>Enrolled: <strong className="text-white">{currentUser.grade} ({currentUser.stream})</strong></span>
          </div>
        </div>

        {/* =========================================================================
            TAB 1: MY COURSES
            ========================================================================= */}
        {activeTab === 'courses' && (
          <div className="space-y-6">
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-serif font-bold text-white">
                  {currentUser.grade} Enrolled Curriculum Subjects
                </h2>
                <p className="text-xs text-slate-400">
                  Select a course to read complete unit chapter notes or practice with timed 20-question exam simulators.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => onTabChange('subjects')}
                  className="px-3.5 py-2 rounded-xl bg-[#1A1A1E] border border-[#2D2D32] hover:border-[#C5A059] text-xs font-semibold text-[#C5A059] flex items-center gap-1.5 transition-colors"
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>Browse All Curriculum</span>
                </button>
              </div>
            </div>

            {/* Subject Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {enrolledSubjects.map((sub) => {
                const subNotes = notes.filter((n) => n.subjectName.toLowerCase() === sub.name.toLowerCase() && n.grade === grade);
                const subQuizzes = quizzes.filter((q) => q.subjectName.toLowerCase() === sub.name.toLowerCase() && q.grade === grade);
                const completedInSubject = (currentUser.notesCompleted || []).filter((id) =>
                  subNotes.some((n) => n.id === id)
                ).length;
                const subjectProgress = subNotes.length > 0 ? Math.round((completedInSubject / subNotes.length) * 100) : 0;

                return (
                  <div
                    key={sub.id}
                    className="rounded-2xl bg-gradient-to-b from-[#16161A] to-[#121215] border border-[#2D2D32] hover:border-[#C5A059]/60 p-5 shadow-lg transition-all duration-200 hover:-translate-y-1 flex flex-col justify-between space-y-4 group"
                  >
                    <div>
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-xl bg-[#1E1E24] border border-[#2D2D32] flex items-center justify-center font-serif text-xl font-bold text-[#C5A059] group-hover:scale-105 transition-transform">
                            {sub.name.charAt(0)}
                          </div>
                          <div>
                            <span className="text-[10px] font-bold uppercase tracking-wider text-[#C5A059]">
                              {sub.code || sub.stream}
                            </span>
                            <h3 className="text-base font-bold text-white group-hover:text-[#C5A059] transition-colors">
                              {sub.name}
                            </h3>
                          </div>
                        </div>

                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#1E1E24] text-slate-300 font-semibold border border-[#2D2D32]">
                          {sub.unitCount || subNotes.length} Units
                        </span>
                      </div>

                      <p className="text-xs text-slate-400 mt-3 line-clamp-2">
                        {sub.description}
                      </p>

                      {/* Course Progress Bar */}
                      <div className="mt-4 space-y-1.5">
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="text-slate-400">Completion</span>
                          <span className="font-bold text-[#C5A059]">{subjectProgress}%</span>
                        </div>
                        <div className="w-full h-1.5 bg-[#1F1F24] rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-[#C5A059] to-amber-400 rounded-full transition-all duration-500"
                            style={{ width: `${Math.max(subjectProgress, 5)}%` }}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="grid grid-cols-2 gap-2 pt-3 border-t border-[#25252A]">
                      <button
                        onClick={() => onSelectSubjectForNotes(sub.name)}
                        className="py-2 px-3 rounded-xl bg-[#1C1C20] hover:bg-[#C5A059] hover:text-black border border-[#2D2D32] text-xs font-bold text-slate-200 flex items-center justify-center gap-1.5 transition-colors"
                      >
                        <BookOpen className="w-3.5 h-3.5" />
                        <span>Read Notes</span>
                      </button>

                      <button
                        onClick={() => onSelectSubjectForQuiz(sub.name)}
                        className="py-2 px-3 rounded-xl bg-[#1C1C20] hover:bg-emerald-500 hover:text-black border border-[#2D2D32] text-xs font-bold text-slate-200 flex items-center justify-center gap-1.5 transition-colors"
                      >
                        <Award className="w-3.5 h-3.5" />
                        <span>20-Q Exam</span>
                      </button>
                    </div>

                  </div>
                );
              })}
            </div>

          </div>
        )}

        {/* =========================================================================
            TAB 2: PROGRESS & ANALYTICS
            ========================================================================= */}
        {activeTab === 'progress' && (
          <div className="space-y-6">
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              
              {/* Note Chapters Completion Card */}
              <div className="rounded-2xl bg-[#141418] border border-[#2D2D32] p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider">Chapter Mastery</h3>
                  <BookOpen className="w-4 h-4 text-[#C5A059]" />
                </div>

                <div className="text-center py-4">
                  <div className="relative inline-flex items-center justify-center">
                    <div className="w-28 h-28 rounded-full border-4 border-[#25252A] border-t-[#C5A059] flex items-center justify-center">
                      <span className="text-2xl font-bold text-white">{noteCompletionPercent}%</span>
                    </div>
                  </div>
                  <p className="text-xs text-slate-400 mt-3">
                    {completedNotesCount} of {totalNotesAvailable} {currentUser.grade} study chapters reviewed.
                  </p>
                </div>

                <button
                  onClick={() => onTabChange('notes')}
                  className="w-full py-2 rounded-xl bg-[#1F1F24] hover:bg-[#2A2A30] text-xs font-bold text-[#C5A059] transition-colors"
                >
                  Continue Reading Notes →
                </button>
              </div>

              {/* Quiz Examination Stats */}
              <div className="rounded-2xl bg-[#141418] border border-[#2D2D32] p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider">Exam Performance</h3>
                  <Award className="w-4 h-4 text-emerald-400" />
                </div>

                <div className="space-y-3 pt-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-400">Total Exams Completed</span>
                    <strong className="text-white">{totalQuizzesTaken}</strong>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-400">Average Accuracy</span>
                    <strong className="text-emerald-400">{avgQuizAccuracy}%</strong>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-400">Correct Questions Answered</span>
                    <strong className="text-white">{totalCorrectQuestions}</strong>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-400">Distinction Certificates</span>
                    <strong className="text-[#C5A059]">{earnedCertificates.length}</strong>
                  </div>
                </div>

                <button
                  onClick={() => onTabChange('quizzes')}
                  className="w-full py-2 rounded-xl bg-[#1F1F24] hover:bg-[#2A2A30] text-xs font-bold text-emerald-400 transition-colors"
                >
                  Take a 20-Question Exam →
                </button>
              </div>

              {/* Deep Study Focus & Pomodoro */}
              <div className="rounded-2xl bg-[#141418] border border-[#2D2D32] p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider">Deep Work Hours</h3>
                  <Timer className="w-4 h-4 text-purple-400" />
                </div>

                <div className="space-y-3 pt-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-400">Total Focus Time</span>
                    <strong className="text-purple-300">{totalFocusHours} Hours</strong>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-400">Pomodoro Sprints Completed</span>
                    <strong className="text-white">{pomodoroSessions} Sessions</strong>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-400">Daily Study Streak</span>
                    <strong className="text-amber-400">🔥 {currentUser.studyStreakDays || 1} Days Active</strong>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-400">Target Score Margin</span>
                    <strong className="text-[#C5A059]">{currentUser.targetScore || 580}/600</strong>
                  </div>
                </div>

                <button
                  onClick={onOpenFlashcards}
                  className="w-full py-2 rounded-xl bg-[#1F1F24] hover:bg-[#2A2A30] text-xs font-bold text-purple-300 transition-colors"
                >
                  Launch Flashcards Sprint →
                </button>
              </div>

            </div>

            {/* Quiz Attempt History Table */}
            <div className="rounded-2xl bg-[#141418] border border-[#2D2D32] p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                  Recent 20-Question Exam Attempts
                </h3>
                <span className="text-xs text-slate-400">{quizAttempts.length} Records</span>
              </div>

              {quizAttempts.length === 0 ? (
                <div className="py-8 text-center text-slate-500 space-y-2">
                  <HelpCircle className="w-8 h-8 mx-auto text-slate-600" />
                  <p className="text-xs">No exam attempts recorded yet.</p>
                  <button
                    onClick={() => onTabChange('quizzes')}
                    className="px-4 py-1.5 rounded-lg bg-[#C5A059] text-black font-bold text-xs uppercase"
                  >
                    Take First Exam
                  </button>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-[#25252A] text-slate-400">
                        <th className="pb-3 font-semibold">Subject & Exam</th>
                        <th className="pb-3 font-semibold">Grade</th>
                        <th className="pb-3 font-semibold">Score</th>
                        <th className="pb-3 font-semibold">Accuracy</th>
                        <th className="pb-3 font-semibold">Date</th>
                        <th className="pb-3 font-semibold text-right">Certificate</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#1F1F24]">
                      {quizAttempts.map((attempt) => (
                        <tr key={attempt.id} className="hover:bg-[#18181D] transition-colors">
                          <td className="py-3 font-medium text-white">
                            {attempt.subjectName} - {attempt.quizTitle}
                          </td>
                          <td className="py-3 text-slate-400">{attempt.grade}</td>
                          <td className="py-3 font-bold text-white">
                            {attempt.score}/{attempt.totalQuestions || 20}
                          </td>
                          <td className="py-3">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              attempt.percentage >= 80
                                ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                                : attempt.percentage >= 60
                                ? 'bg-amber-950 text-amber-300 border border-amber-800'
                                : 'bg-rose-950 text-rose-300 border border-rose-800'
                            }`}>
                              {attempt.percentage}%
                            </span>
                          </td>
                          <td className="py-3 text-slate-400">{attempt.date}</td>
                          <td className="py-3 text-right">
                            {attempt.percentage >= 70 ? (
                              <button
                                onClick={() =>
                                  onViewCertificate({
                                    id: `cert-${attempt.id}`,
                                    studentName: currentUser.name,
                                    subjectName: `${attempt.subjectName} (${attempt.grade})`,
                                    grade: attempt.grade,
                                    issueDate: attempt.date,
                                    scorePercentage: attempt.percentage,
                                    certificateNumber: `EYOEL-${attempt.subjectName.substring(0, 3).toUpperCase()}-${Math.floor(10000 + Math.random() * 90000)}`,
                                    distinction: attempt.percentage >= 90 ? 'First Class Honors' : 'Excellence Distinction',
                                  })
                                }
                                className="inline-flex items-center gap-1 text-[#C5A059] hover:underline font-semibold"
                              >
                                <Award className="w-3.5 h-3.5" />
                                <span>View Cert</span>
                              </button>
                            ) : (
                              <span className="text-slate-600 text-[10px]">70%+ req.</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

          </div>
        )}

        {/* =========================================================================
            TAB 3: CERTIFICATES & HONORS
            ========================================================================= */}
        {activeTab === 'certificates' && (
          <div className="space-y-6">
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-serif font-bold text-white">
                  Academic Certificates of Distinction
                </h2>
                <p className="text-xs text-slate-400">
                  Verified diplomas awarded for achieving high proficiency (75%+) on Ethiopian curriculum national evaluations.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2.5">
                <button
                  onClick={() => onTabChange('report-card')}
                  className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-md shadow-emerald-500/20"
                >
                  <FileText className="w-4 h-4" />
                  <span>{language === 'am' ? 'የውጤት ካርድ ይመልከቱ' : language === 'om' ? 'Waraqaa Qabxii' : 'View Report Card'}</span>
                </button>

                <button
                  onClick={onOpenCertificateStudio}
                  className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#B8934A] to-[#C5A059] text-black font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-[#C5A059]/20"
                >
                  <Award className="w-4 h-4" />
                  <span>Issue / Customize Certificate</span>
                </button>
              </div>
            </div>

            {earnedCertificates.length === 0 ? (
              <div className="rounded-2xl bg-[#141418] border border-[#2D2D32] p-10 text-center space-y-3">
                <div className="w-16 h-16 rounded-full bg-[#1A1A1E] border border-[#2D2D32] flex items-center justify-center mx-auto text-2xl text-[#C5A059]">
                  📜
                </div>
                <h3 className="text-base font-bold text-white">No Certificates Earned Yet</h3>
                <p className="text-xs text-slate-400 max-w-md mx-auto">
                  Score 75% or higher on any 20-question subject examination to unlock your official verified certificate!
                </p>
                <div className="pt-2">
                  <button
                    onClick={() => onTabChange('quizzes')}
                    className="px-5 py-2.5 rounded-xl bg-[#C5A059] text-black font-bold text-xs uppercase tracking-wider"
                  >
                    Take a Quiz to Qualify
                  </button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {earnedCertificates.map((cert) => (
                  <div
                    key={cert.id}
                    className="rounded-2xl bg-gradient-to-b from-[#18181D] to-[#121215] border border-[#C5A059]/40 p-5 shadow-xl space-y-4 hover:border-[#C5A059] transition-all flex flex-col justify-between group"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between border-b border-[#25252A] pb-3">
                        <div className="flex items-center gap-2">
                          <ShieldCheck className="w-4 h-4 text-[#C5A059]" />
                          <span className="text-[10px] font-mono text-[#C5A059] font-bold">
                            {cert.certificateNumber}
                          </span>
                        </div>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800 font-bold">
                          {cert.scorePercentage}%
                        </span>
                      </div>

                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                          {cert.distinction}
                        </span>
                        <h4 className="text-base font-bold text-white group-hover:text-[#C5A059] transition-colors">
                          {cert.subjectName}
                        </h4>
                        <p className="text-xs text-slate-400 mt-1">
                          Conferred to <strong className="text-white">{cert.studentName}</strong>
                        </p>
                      </div>

                      <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                        <span>Issued: {cert.issueDate}</span>
                        <span>{cert.grade}</span>
                      </div>
                    </div>

                    <button
                      onClick={() => onViewCertificate(cert)}
                      className="w-full py-2.5 rounded-xl bg-[#1C1C20] hover:bg-[#C5A059] hover:text-black border border-[#2D2D32] text-xs font-bold text-slate-200 flex items-center justify-center gap-2 transition-all"
                    >
                      <Award className="w-3.5 h-3.5" />
                      <span>View & Print Diploma</span>
                      <ExternalLink className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}

          </div>
        )}

        {/* =========================================================================
            TAB 4: PROFILE DOSSIER
            ========================================================================= */}
        {activeTab === 'profile' && (
          <div className="max-w-2xl mx-auto rounded-3xl bg-[#141418] border border-[#2D2D32] p-6 sm:p-8 shadow-xl space-y-6">
            
            <div className="border-b border-[#25252A] pb-4">
              <h2 className="text-lg font-serif font-bold text-white">Student Scholar Profile</h2>
              <p className="text-xs text-slate-400">
                Update your academic dossier, national exam target goal, and grade level.
              </p>
            </div>

            {saveSuccess && (
              <div className="p-3 rounded-xl bg-emerald-950 border border-emerald-800 text-emerald-300 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Profile updated successfully!</span>
              </div>
            )}

            <form onSubmit={handleSaveProfile} className="space-y-4">
              
              {/* Avatar Selector */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                  Select Scholar Avatar
                </label>
                <div className="flex flex-wrap gap-2">
                  {avatarOptions.map((emoji) => (
                    <button
                      key={emoji}
                      type="button"
                      onClick={() => setAvatar(emoji)}
                      className={`w-10 h-10 rounded-xl text-xl flex items-center justify-center transition-all ${
                        avatar === emoji
                          ? 'bg-[#C5A059] border-2 border-white scale-110 shadow-lg'
                          : 'bg-[#1C1C20] border border-[#2D2D32] hover:bg-[#25252A]'
                      }`}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>

              {/* Full Name & Username */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                    Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-[#1A1A1E] border border-[#2D2D32] rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-[#C5A059]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                    Username
                  </label>
                  <input
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-[#1A1A1E] border border-[#2D2D32] rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-[#C5A059]"
                  />
                </div>
              </div>

              {/* Email (Read only) */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                  Registered Email (Secured)
                </label>
                <input
                  type="email"
                  disabled
                  value={currentUser.email}
                  className="w-full px-3.5 py-2.5 bg-[#121215] border border-[#25252A] rounded-xl text-xs text-slate-400 cursor-not-allowed"
                />
              </div>

              {/* Grade & Stream */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                    Grade Level
                  </label>
                  <select
                    value={grade}
                    onChange={(e) => setGrade(e.target.value as GradeLevel)}
                    className="w-full px-3.5 py-2.5 bg-[#1A1A1E] border border-[#2D2D32] rounded-xl text-xs text-white focus:outline-none focus:border-[#C5A059]"
                  >
                    <option value="Grade 9">Grade 9</option>
                    <option value="Grade 10">Grade 10</option>
                    <option value="Grade 11">Grade 11</option>
                    <option value="Grade 12">Grade 12</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                    Academic Stream
                  </label>
                  <select
                    value={stream}
                    onChange={(e) => setStream(e.target.value as SubjectStream)}
                    className="w-full px-3.5 py-2.5 bg-[#1A1A1E] border border-[#2D2D32] rounded-xl text-xs text-white focus:outline-none focus:border-[#C5A059]"
                  >
                    <option value="General">General (Grades 9 & 10)</option>
                    <option value="Natural Science">Natural Science</option>
                    <option value="Social Science">Social Science</option>
                  </select>
                </div>
              </div>

              {/* Target National Exam Score */}
              <div className="space-y-1">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                    Target Exam Score Goal
                  </label>
                  <span className="text-xs font-bold text-[#C5A059]">{targetScore} / 600</span>
                </div>
                <input
                  type="range"
                  min="400"
                  max="600"
                  step="5"
                  value={targetScore}
                  onChange={(e) => setTargetScore(Number(e.target.value))}
                  className="w-full accent-[#C5A059] cursor-pointer"
                />
              </div>

              {/* Academic Bio */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                  Bio / Study Aspirations
                </label>
                <textarea
                  rows={3}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#1A1A1E] border border-[#2D2D32] rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-[#C5A059]"
                  placeholder="e.g. Aspiring doctor studying Grade 12 Natural Science."
                />
              </div>

              <button
                type="submit"
                disabled={savingProfile}
                className="w-full py-3 rounded-xl bg-[#C5A059] hover:bg-[#d8b168] text-black font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-[#C5A059]/20 transition-all disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                <span>{savingProfile ? 'Saving...' : 'Save Profile Changes'}</span>
              </button>

            </form>

          </div>
        )}

        {/* =========================================================================
            TAB 5: SETTINGS & SECURITY
            ========================================================================= */}
        {activeTab === 'settings' && (
          <div className="max-w-2xl mx-auto space-y-6">
            
            {/* Password & Security Card */}
            <div className="rounded-3xl bg-[#141418] border border-[#2D2D32] p-6 sm:p-8 space-y-5">
              <div className="flex items-center gap-3 border-b border-[#25252A] pb-4">
                <ShieldCheck className="w-5 h-5 text-[#C5A059]" />
                <div>
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                    Account Security & Authentication
                  </h3>
                  <p className="text-xs text-slate-400">
                    Manage your credentials and password security settings.
                  </p>
                </div>
              </div>

              {resetEmailSent && (
                <div className="p-3 rounded-xl bg-emerald-950 border border-emerald-800 text-emerald-300 text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Password reset link sent to {currentUser.email}! Check your inbox.</span>
                </div>
              )}

              {resetError && (
                <div className="p-3 rounded-xl bg-rose-950 border border-rose-800 text-rose-300 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                  <span>{resetError}</span>
                </div>
              )}

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-[#1A1A1E] border border-[#2D2D32]">
                <div>
                  <h4 className="text-xs font-bold text-white">Reset Account Password</h4>
                  <p className="text-[11px] text-slate-400">
                    We will send a secure Firebase reset email to {currentUser.email}.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleTriggerPasswordReset}
                  disabled={resetLoading}
                  className="px-4 py-2 rounded-xl bg-[#C5A059] hover:bg-[#d8b168] text-black font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 shrink-0 disabled:opacity-50"
                >
                  <KeyRound className="w-3.5 h-3.5" />
                  <span>{resetLoading ? 'Sending...' : 'Send Reset Link'}</span>
                </button>
              </div>

              <div className="flex items-center justify-between p-4 rounded-2xl bg-[#1A1A1E] border border-[#2D2D32]">
                <div>
                  <h4 className="text-xs font-bold text-white">256-Bit TLS & Database Encryption</h4>
                  <p className="text-[11px] text-slate-400">
                    Your student record is secured in Firestore with zero-trust RBAC protection.
                  </p>
                </div>
                <span className="text-xs font-bold text-emerald-400 bg-emerald-950 border border-emerald-800 px-2.5 py-1 rounded-lg">
                  Active
                </span>
              </div>
            </div>

            {/* Preferences & Notifications Card */}
            <div className="rounded-3xl bg-[#141418] border border-[#2D2D32] p-6 sm:p-8 space-y-5">
              <div className="flex items-center gap-3 border-b border-[#25252A] pb-4">
                <Settings className="w-5 h-5 text-[#C5A059]" />
                <div>
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                    Study Preferences
                  </h3>
                  <p className="text-xs text-slate-400">
                    Customize your study experience, language, and notifications.
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                {/* Language Switcher */}
                <div className="flex items-center justify-between p-3.5 rounded-xl bg-[#1A1A1E] border border-[#2D2D32]">
                  <div className="flex items-center gap-2.5">
                    <Globe className="w-4 h-4 text-[#C5A059]" />
                    <div>
                      <span className="text-xs font-bold text-white block">Platform Language</span>
                      <span className="text-[11px] text-slate-400">English, Amharic, or Afaan Oromoo</span>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    {(['en', 'am', 'om'] as Language[]).map((l) => (
                      <button
                        key={l}
                        type="button"
                        onClick={() => onLanguageChange(l)}
                        className={`px-2.5 py-1 rounded-lg text-xs font-bold ${
                          language === l
                            ? 'bg-[#C5A059] text-black'
                            : 'bg-[#25252A] text-slate-300 hover:text-white'
                        }`}
                      >
                        {l.toUpperCase()}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Dark / Light Mode Toggle */}
                <div className="flex items-center justify-between p-3.5 rounded-xl bg-[#1A1A1E] border border-[#2D2D32]">
                  <div className="flex items-center gap-2.5">
                    {darkMode ? <Moon className="w-4 h-4 text-[#C5A059]" /> : <Sun className="w-4 h-4 text-[#C5A059]" />}
                    <div>
                      <span className="text-xs font-bold text-white block">Theme Appearance</span>
                      <span className="text-[11px] text-slate-400">Current: {darkMode ? 'Luxury Dark' : 'Clean Light'}</span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={onToggleDarkMode}
                    className="px-3 py-1 rounded-lg bg-[#25252A] text-xs font-bold text-slate-200 hover:text-white"
                  >
                    Toggle
                  </button>
                </div>

                {/* Study Reminders Toggle */}
                <div className="flex items-center justify-between p-3.5 rounded-xl bg-[#1A1A1E] border border-[#2D2D32]">
                  <div>
                    <span className="text-xs font-bold text-white block">Daily Study Goal Alerts</span>
                    <span className="text-[11px] text-slate-400">Pomodoro focus alerts & streak protection</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={studyReminders}
                    onChange={(e) => setStudyReminders(e.target.checked)}
                    className="w-4 h-4 accent-[#C5A059] rounded cursor-pointer"
                  />
                </div>
              </div>
            </div>

            {/* Logout Section */}
            <div className="rounded-3xl bg-rose-950/20 border border-rose-900/40 p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h4 className="text-sm font-bold text-rose-300">Sign Out of Session</h4>
                <p className="text-xs text-slate-400">
                  Safely log out from this browser session.
                </p>
              </div>
              <button
                type="button"
                onClick={handleLogout}
                className="px-5 py-2.5 rounded-xl bg-rose-900/60 hover:bg-rose-800 text-white font-bold text-xs uppercase tracking-wider flex items-center gap-2 transition-colors shrink-0"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </button>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};
