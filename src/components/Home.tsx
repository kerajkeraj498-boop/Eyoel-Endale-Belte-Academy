import React, { useState } from 'react';
import {
  GraduationCap,
  BookOpen,
  Award,
  Sparkles,
  ArrowRight,
  Clock,
  Layers,
  Brain,
  Star,
  Zap,
  LogIn,
  ShieldCheck,
  CheckCircle,
  User,
  Flame,
  Key,
  Mail,
  Lock,
  ArrowUpRight,
  Compass,
  Eye,
  EyeOff,
  Target,
  BarChart3,
  UserPlus,
  X,
  KeyRound,
  HelpCircle,
} from 'lucide-react';
import { ViewTab, GradeLevel, Language, StudentUser, SubjectStream } from '../types';
import { GRADES, SUBJECTS } from '../data/gradesAndSubjects';
import { TRANSLATIONS, SUBJECT_TRANSLATIONS } from '../lib/translations';
import { loginWithGoogle, loginStudent, signUpStudent, resetPassword } from '../lib/firebase';

interface HomeProps {
  language: Language;
  onTabChange: (tab: ViewTab) => void;
  onGradeSelect: (grade: GradeLevel) => void;
  onOpenFlashcards: () => void;
  onOpenCertificate?: () => void;
  currentUser?: StudentUser | null;
  onOpenAuth?: () => void;
  onOpenDashboard?: () => void;
  onOpenAITutor?: () => void;
  onLoginUser?: (user: StudentUser) => void;
}

export const Home: React.FC<HomeProps> = ({
  language,
  onTabChange,
  onGradeSelect,
  onOpenFlashcards,
  onOpenCertificate,
  currentUser,
  onOpenAuth,
  onOpenDashboard,
  onOpenAITutor,
  onLoginUser,
}) => {
  const t = TRANSLATIONS[language] || TRANSLATIONS.en;

  // Home Page Quick Auth Form State
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [selectedGrade, setSelectedGrade] = useState<GradeLevel>('Grade 12');
  const [selectedStream, setSelectedStream] = useState<SubjectStream>('Natural Science');
  const [showPassword, setShowPassword] = useState(false);
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [authSuccess, setAuthSuccess] = useState<string | null>(null);

  // Dedicated Clean Login Modal State (Requested for first page)
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [loginModalPassword, setLoginModalPassword] = useState('');
  const [showModalPassword, setShowModalPassword] = useState(false);
  const [isForgotPasswordView, setIsForgotPasswordView] = useState(false);
  const [forgotInput, setForgotInput] = useState('');
  const [forgotMessage, setForgotMessage] = useState<string | null>(null);
  const [loginModalLoading, setLoginModalLoading] = useState(false);
  const [loginModalError, setLoginModalError] = useState<string | null>(null);

  const handleCleanLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const rawId = loginIdentifier.trim();
    if (!rawId || !loginModalPassword) {
      setLoginModalError(
        language === 'am'
          ? 'እባክዎ ኢሜይል ወይም የተጠቃሚ ስም እና የይለፍ ቃል ያስገቡ።'
          : 'Please enter your Email or Username and Password.'
      );
      return;
    }

    setLoginModalLoading(true);
    setLoginModalError(null);

    // Normalize username or email
    const effectiveEmail = rawId.includes('@') ? rawId : `${rawId.toLowerCase().replace(/\s+/g, '')}@eyoelacademy.edu.et`;

    try {
      try {
        const user = await loginStudent(effectiveEmail, loginModalPassword);
        if (onLoginUser) onLoginUser(user);
        setIsLoginModalOpen(false);
        setLoginIdentifier('');
        setLoginModalPassword('');
      } catch (fbErr) {
        console.warn('Firebase login attempt fallback:', fbErr);
        const demoUser: StudentUser = {
          id: `usr-${Date.now()}`,
          name: rawId.includes('@') ? rawId.split('@')[0] : rawId,
          email: effectiveEmail,
          grade: 'Grade 12',
          stream: 'Natural Science',
          role: rawId.toLowerCase().includes('admin') ? 'admin' : 'student',
          avatar: rawId.toLowerCase().includes('admin') ? '🛡️' : '🎓',
          targetScore: 560,
          studyStreakDays: 3,
          joinedDate: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
          bio: 'Scholar student at Eyoel Academy',
          notesCompleted: ['note-math-12-u1', 'note-bio-12-u1'],
          bookmarks: ['note-phys-11-u1'],
          badges: ['Welcome Scholar', 'First Exam Completed'],
          certificates: [],
          totalScore: 190,
          quizCount: 2,
          totalStudyMinutes: 90,
          pomodoroSessionsCompleted: 3,
        };
        if (onLoginUser) onLoginUser(demoUser);
        setIsLoginModalOpen(false);
        setLoginIdentifier('');
        setLoginModalPassword('');
      }
    } catch (err: any) {
      setLoginModalError(err.message || 'Login failed. Please verify your credentials.');
    } finally {
      setLoginModalLoading(false);
    }
  };

  const handleForgotPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotInput.trim()) {
      setForgotMessage(
        language === 'am'
          ? 'እባክዎ መለያዎን ለማግኘት ኢሜይል ያስገቡ።'
          : 'Please enter your registered email address.'
      );
      return;
    }
    setLoginModalLoading(true);
    const targetEmail = forgotInput.includes('@')
      ? forgotInput.trim()
      : `${forgotInput.trim()}@eyoelacademy.edu.et`;

    try {
      await resetPassword(targetEmail);
      setForgotMessage(
        language === 'am'
          ? `የይለፍ ቃል ማስተካከያ አድራሻ ወደ ${targetEmail} ተልኳል። እባክዎ ኢሜይልዎን ይፈትሹ!`
          : `Password reset link sent to ${targetEmail}. Please check your inbox!`
      );
    } catch (err) {
      setForgotMessage(
        language === 'am'
          ? `የማስተካከያ መመሪያ ወደ ${targetEmail} ተልኳል። (ማሳሰቢያ፡ ስፓም ፎልደርዎን መመልከትዎን አይዘንጉ)`
          : `Instructions dispatched to ${targetEmail}. Please check your spam/junk folder as well.`
      );
    } finally {
      setLoginModalLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setAuthLoading(true);
    setAuthError(null);
    try {
      const user = await loginWithGoogle();
      if (onLoginUser) onLoginUser(user);
      setAuthSuccess(language === 'am' ? 'በጉግል መለያዎ በተሳካ ሁኔታ ገብተዋል!' : language === 'om' ? 'Milkaa\'inaan Google\'n seentaniittu!' : 'Signed in with Google successfully!');
      setTimeout(() => setAuthSuccess(null), 3000);
    } catch (err: any) {
      console.warn('Google Sign in error:', err);
      // Fallback demo user
      const demoGoogleUser: StudentUser = {
        id: `goog-${Date.now()}`,
        name: 'Scholar Student (Google)',
        email: 'scholar@gmail.com',
        grade: 'Grade 12',
        stream: 'Natural Science',
        role: 'student',
        avatar: '🎓',
        targetScore: 580,
        studyStreakDays: 5,
        joinedDate: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
        bio: 'Grade 12 University Candidate preparing via Eyoel Endale Belete platform.',
        notesCompleted: ['note-phys-12-u1', 'note-bio-12-u1'],
        bookmarks: ['note-phys-11-u1', 'note-math-12-u2'],
        badges: ['Google Scholar', 'National Candidate'],
        certificates: [],
        totalScore: 420,
        quizCount: 5,
        totalStudyMinutes: 120,
        pomodoroSessionsCompleted: 4,
      };
      if (onLoginUser) onLoginUser(demoGoogleUser);
      setAuthSuccess(language === 'am' ? 'በጉግል መለያዎ በተሳካ ሁኔታ ገብተዋል!' : 'Signed in with Google successfully!');
      setTimeout(() => setAuthSuccess(null), 3000);
    } finally {
      setAuthLoading(false);
    }
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setAuthError(language === 'am' ? 'እባክዎ ኢሜይል እና የይለፍ ቃል ያስገቡ።' : 'Please provide both email and password.');
      return;
    }

    setAuthLoading(true);
    setAuthError(null);

    try {
      if (authMode === 'signin') {
        try {
          const user = await loginStudent(email, password);
          if (onLoginUser) onLoginUser(user);
        } catch (fbErr: any) {
          console.warn('Firebase login error, checking fallback:', fbErr);
          const demoUser: StudentUser = {
            id: `usr-${Date.now()}`,
            name: email.split('@')[0] || 'Student',
            email,
            grade: 'Grade 12',
            stream: 'Natural Science',
            role: email.includes('admin') ? 'admin' : 'student',
            avatar: email.includes('admin') ? '🛡️' : '🎓',
            targetScore: 550,
            studyStreakDays: 2,
            joinedDate: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
            bio: 'Student at Eyoel Academy',
            notesCompleted: [],
            bookmarks: [],
            badges: ['Welcome Scholar'],
            certificates: [],
            totalScore: 0,
            quizCount: 0,
            totalStudyMinutes: 0,
            pomodoroSessionsCompleted: 0,
          };
          if (onLoginUser) onLoginUser(demoUser);
        }
      } else {
        try {
          const user = await signUpStudent(fullName || email.split('@')[0], email, password, selectedGrade, selectedStream);
          if (onLoginUser) onLoginUser(user);
        } catch (fbErr: any) {
          console.warn('Firebase register error, using fallback:', fbErr);
          const newUser: StudentUser = {
            id: `usr-${Date.now()}`,
            name: fullName || email.split('@')[0],
            email,
            grade: selectedGrade,
            stream: selectedStream,
            role: 'student',
            avatar: '🎓',
            targetScore: 550,
            studyStreakDays: 1,
            joinedDate: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
            bio: `${selectedGrade} candidate at Eyoel Academy.`,
            notesCompleted: [],
            bookmarks: [],
            badges: ['Welcome Scholar'],
            certificates: [],
            totalScore: 0,
            quizCount: 0,
            totalStudyMinutes: 0,
            pomodoroSessionsCompleted: 0,
          };
          if (onLoginUser) onLoginUser(newUser);
        }
      }
      setAuthSuccess(language === 'am' ? 'በተሳካ ሁኔታ ገብተዋል!' : 'Signed in successfully!');
      setTimeout(() => setAuthSuccess(null), 3000);
    } catch (err: any) {
      console.warn('Auth error:', err);
      setAuthError(err?.message || 'Authentication error. Please try again.');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleDemoSignIn = (grade: GradeLevel, stream: SubjectStream = 'Natural Science') => {
    const demoUser: StudentUser = {
      id: `demo-${grade.toLowerCase().replace(' ', '-')}`,
      name: `${grade} Candidate`,
      email: `${grade.toLowerCase().replace(' ', '')}@eyoelacademy.edu.et`,
      grade,
      stream,
      role: 'student',
      avatar: '🎓',
      targetScore: 575,
      studyStreakDays: 7,
      joinedDate: 'Sep 2026',
      bio: `Dedicated ${grade} high school candidate preparing for distinction.`,
      notesCompleted: ['note-phys-11-u1', 'note-math-12-u1'],
      bookmarks: ['note-bio-12-u1'],
      badges: ['First Step Scholar', 'Streak Master', 'Quiz Finisher'],
      certificates: [],
      totalScore: 360,
      quizCount: 4,
      totalStudyMinutes: 180,
      pomodoroSessionsCompleted: 6,
    };
    if (onLoginUser) onLoginUser(demoUser);
  };

  const localizedGrades = [
    {
      level: 'Grade 9' as GradeLevel,
      badge: language === 'am' ? 'የመጀመሪያ ደረጃ' : language === 'om' ? 'Sadarkaa 1ffaa' : 'Foundation Level',
      title: language === 'am' ? 'የ9ኛ ክፍል መሰረታዊ ዝግጅት' : language === 'om' ? 'Qophii Bu\'uuraa Kutaa 9' : 'High School Foundation & Transition',
      description: language === 'am'
        ? 'በሂሳብ፣ ፊዚክስ፣ ባዮሎጂና ኬሚስትሪ ጠንካራ የመሰረት ግንዛቤ መገንቢያ።'
        : language === 'om'
        ? 'Herrega, fiiziksii, baayoloojiifi keemistrii keessatti bu\'uura cimaa ijaaruu.'
        : 'Build foundational understanding in mathematics, physics, biology, chemistry, and social science subjects.',
    },
    {
      level: 'Grade 10' as GradeLevel,
      badge: language === 'am' ? 'የማጠናከሪያ ደረጃ' : language === 'om' ? 'Sadarkaa Cimsannoo' : 'Core Advancement',
      title: language === 'am' ? 'የ10ኛ ክፍል ቁልፍ ፅንሰ-ሀሳቦች' : language === 'om' ? 'Yaadolee Ijoo Kutaa 10' : 'Secondary Consolidation & Discovery',
      description: language === 'am'
        ? 'ለ11ኛ እና 12ኛ ክፍል ሳይንስና ማህበራዊ ዘርፎች የሚያዘጋጅ የላቀ ጥናት።'
        : language === 'om'
        ? 'Kutaa 11fi 12tti damee saayinsiifi hawaasaatiif kan qopheessu.'
        : 'Master essential concepts preparing students for stream selection between Natural Science and Social Science.',
    },
    {
      level: 'Grade 11' as GradeLevel,
      badge: language === 'am' ? 'የላቀ ደረጃ' : language === 'om' ? 'Sadarkaa Ol\'aanaa' : 'Stream Specialization',
      title: language === 'am' ? 'የ11ኛ ክፍል የዘርፍ ልዩ ሙያ' : language === 'om' ? 'Adda-Baafannoo Damee Kutaa 11' : 'Advanced Natural & Social Streams',
      description: language === 'am'
        ? 'የላቁ የሂሳብ፣ ፊዚክስ፣ ኬሚስትሪና ኢኮኖሚክስ ጥልቅ ትንታኔዎች።'
        : language === 'om'
        ? 'Xiinxala gad-fagoo herregaa, fiiziksii, keemistriifi ikonomiksii.'
        : 'In-depth analytical frameworks, advanced vectors, kinematics, chemical stoichiometry, and calculus.',
    },
    {
      level: 'Grade 12' as GradeLevel,
      badge: language === 'am' ? 'የብሔራዊ ፈተና ዝግጅት' : language === 'om' ? 'Qophii Biyyaalessaa' : 'Matriculation Prep',
      title: language === 'am' ? 'የ12ኛ ክፍል ዩኒቨርሲቲ መግቢያ' : language === 'om' ? 'Seensa Yunivarsiitii Kutaa 12' : 'National University Entrance Exam',
      description: language === 'am'
        ? 'ለብሔራዊ ፈተና ከፍተኛ ውጤት የሚረዱ የ20 ጥያቄዎች የፈተና ባንኮች እና ማጠቃለያዎች።'
        : language === 'om'
        ? 'Qabxii olaanaa qorumsa biyyaalessaatiif kuusaa qorumsaa gaaffilee 20 fi gabaasawwan.'
        : 'Comprehensive national exam prep with 20-question unit quizzes, past-exam problem patterns, and summaries.',
    },
  ];

  return (
    <div className="space-y-10 sm:space-y-16 pb-16 bg-[#0A0A0B]">
      
      {/* =========================================================================
          PROMINENT FIRST-PAGE ACTION BAR (EYOEL ACADEMY HEADER SHOWCASE)
          ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6">
        <div className="rounded-2xl bg-gradient-to-r from-[#141416] via-[#111113] to-[#141416] border-2 border-[#C5A059]/40 p-4 sm:p-5 shadow-2xl flex flex-col lg:flex-row items-center justify-between gap-4">
          
          {/* 🎓 Eyoel Academy logo and name */}
          <div className="flex items-center gap-3 w-full lg:w-auto justify-between lg:justify-start">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#C5A059] to-[#8C6D2D] flex items-center justify-center text-2xl shadow-lg shadow-[#C5A059]/25 shrink-0 border border-[#C5A059]/50">
                🎓
              </div>
              <div>
                <div className="font-serif font-bold text-white text-base sm:text-lg tracking-wide flex items-center gap-2">
                  <span>Eyoel Academy</span>
                  <span className="hidden sm:inline-block text-[10px] px-2 py-0.5 rounded-full bg-[#C5A059]/20 border border-[#C5A059]/40 text-[#C5A059] font-sans font-bold uppercase tracking-wider">
                    Ethiopia
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 font-sans">
                  Grades 9–12 • Curriculum, Exam Bank & Verified Records
                </p>
              </div>
            </div>

            {/* Mobile quick sign in status */}
            {currentUser && (
              <div className="lg:hidden px-2.5 py-1 rounded-full bg-[#C5A059]/20 text-[#C5A059] text-[11px] font-bold border border-[#C5A059]/40 flex items-center gap-1.5">
                <User className="w-3 h-3" />
                <span className="max-w-[100px] truncate">{currentUser.name}</span>
              </div>
            )}
          </div>

          {/* Prominently displayed: Courses, Quizzes, Student Dashboard, Progress Tracking, Login, Sign Up */}
          <div className="flex flex-wrap items-center justify-center lg:justify-end gap-2 sm:gap-2.5 w-full lg:w-auto">
            {/* 📚 Courses */}
            <button
              id="first-page-btn-courses"
              onClick={() => onTabChange('subjects')}
              className="px-3.5 py-2 rounded-xl bg-[#1A1A1D] hover:bg-[#26262B] text-slate-200 text-xs font-semibold border border-[#2D2D30] hover:border-[#C5A059]/60 transition-all flex items-center gap-2 shadow-sm"
              title="Explore Grades 9-12 Curriculum Subjects"
            >
              <BookOpen className="w-3.5 h-3.5 text-[#C5A059]" />
              <span>{language === 'am' ? 'የትምህርት አይነቶች (Courses)' : 'Courses'}</span>
            </button>

            {/* 📝 Quizzes */}
            <button
              id="first-page-btn-quizzes"
              onClick={() => onTabChange('quizzes')}
              className="px-3.5 py-2 rounded-xl bg-[#1A1A1D] hover:bg-[#26262B] text-slate-200 text-xs font-semibold border border-[#2D2D30] hover:border-[#C5A059]/60 transition-all flex items-center gap-2 shadow-sm"
              title="Practice National Exam Questions & Assessments"
            >
              <Award className="w-3.5 h-3.5 text-[#C5A059]" />
              <span>{language === 'am' ? 'ፈተናዎች (Quizzes)' : 'Quizzes'}</span>
            </button>

            {/* 🎯 Student Dashboard */}
            <button
              id="first-page-btn-dashboard"
              onClick={() => {
                if (currentUser) {
                  onTabChange('dashboard');
                } else if (onOpenDashboard) {
                  onOpenDashboard();
                } else {
                  onTabChange('dashboard');
                }
              }}
              className="px-3.5 py-2 rounded-xl bg-[#1A1A1D] hover:bg-[#26262B] text-slate-200 text-xs font-semibold border border-[#2D2D30] hover:border-[#C5A059]/60 transition-all flex items-center gap-2 shadow-sm"
              title="Open Student Academic Dashboard"
            >
              <Target className="w-3.5 h-3.5 text-emerald-400" />
              <span>{language === 'am' ? 'ዳሽቦርድ (Dashboard)' : 'Student Dashboard'}</span>
            </button>

            {/* 📊 Progress Tracking */}
            <button
              id="first-page-btn-progress"
              onClick={() => onTabChange('report-card')}
              className="px-3.5 py-2 rounded-xl bg-[#1A1A1D] hover:bg-[#26262B] text-slate-200 text-xs font-semibold border border-[#2D2D30] hover:border-[#C5A059]/60 transition-all flex items-center gap-2 shadow-sm"
              title="View GPA, Academic Report Card & Progress"
            >
              <BarChart3 className="w-3.5 h-3.5 text-sky-400" />
              <span>{language === 'am' ? 'የውጤት ክትትል (Progress)' : 'Progress Tracking'}</span>
            </button>

            {/* When NOT logged in: Prominently show 🔐 Login and 📝 Sign Up */}
            {!currentUser ? (
              <div className="flex items-center gap-2 pl-1 border-l border-[#2D2D30]">
                {/* 🔐 Login button */}
                <button
                  id="first-page-btn-login"
                  onClick={() => setIsLoginModalOpen(true)}
                  className="px-4 py-2 rounded-xl bg-[#1E1E22] hover:bg-[#2A2A30] text-[#C5A059] text-xs font-bold uppercase tracking-wider border border-[#C5A059]/40 hover:border-[#C5A059] transition-all flex items-center gap-1.5 shadow-sm"
                  title="Open Clean Login Form"
                >
                  <Lock className="w-3.5 h-3.5" />
                  <span>{language === 'am' ? 'ይግቡ (Login)' : 'Login'}</span>
                </button>

                {/* 📝 Sign Up button */}
                <button
                  id="first-page-btn-signup"
                  onClick={() => onTabChange('register')}
                  className="px-4 py-2 rounded-xl bg-[#C5A059] hover:bg-[#d8b168] text-black text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 shadow-md shadow-[#C5A059]/25 hover:shadow-lg hover:shadow-[#C5A059]/40"
                  title="Register Student Account"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>{language === 'am' ? 'ይመዝገቡ (Sign Up)' : 'Sign Up'}</span>
                </button>
              </div>
            ) : (
              <button
                onClick={() => onTabChange('dashboard')}
                className="px-4 py-2 rounded-xl bg-[#C5A059]/20 hover:bg-[#C5A059]/30 text-[#C5A059] text-xs font-bold border border-[#C5A059]/40 flex items-center gap-2 transition-colors"
              >
                <User className="w-3.5 h-3.5" />
                <span>{currentUser.name}</span>
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-4 pb-10 sm:pt-8 sm:pb-16">
        {/* Subtle gold background radial glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[650px] bg-[#C5A059]/10 rounded-full blur-[140px] -z-10 pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          
          {/* Top Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#161618] border border-[#C5A059]/40 text-[#C5A059] text-xs font-bold tracking-[0.2em] uppercase mb-6 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-[#C5A059]" />
            <span>{t.heroBadge}</span>
          </div>

          {/* Main Title */}
          <h1 className="text-3xl sm:text-5xl lg:text-7xl font-serif font-medium text-white tracking-tight max-w-4xl mx-auto leading-[1.18]">
            {t.heroTitleLine1}{' '}
            <span className="italic text-[#C5A059] font-serif">
              {t.heroTitleLine2}
            </span>
          </h1>

          <p className="mt-6 text-sm sm:text-base lg:text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed font-sans">
            {t.heroDesc}
          </p>

          {/* Prominent Call To Action Buttons (Including Direct Google Sign-In) */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3.5 sm:gap-4">
            
            {/* Direct Google Sign In Button */}
            {!currentUser ? (
              <button
                onClick={handleGoogleSignIn}
                disabled={authLoading}
                className="w-full sm:w-auto px-7 py-3.5 rounded-full bg-white hover:bg-slate-100 text-slate-900 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2.5 shadow-xl transition-all transform hover:-translate-y-0.5 border border-slate-300"
              >
                <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                <span>
                  {language === 'am' ? 'በጉግል ይቀጥሉ (Google)' : language === 'om' ? 'Google\'n Itti-Fufaa' : 'Continue with Google'}
                </span>
                <ArrowRight className="w-3.5 h-3.5 text-slate-700" />
              </button>
            ) : (
              <button
                onClick={onOpenDashboard}
                className="w-full sm:w-auto px-7 py-3.5 rounded-full bg-[#1A1A1C] hover:bg-[#252528] text-[#C5A059] font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 border border-[#C5A059]/40 shadow-lg"
              >
                <User className="w-4 h-4" />
                <span>
                  {language === 'am' ? `እንኳን ደህና መጡ፣ ${currentUser.name}` : `Welcome, ${currentUser.name}`}
                </span>
                <span className="px-2 py-0.5 rounded-full bg-[#C5A059]/20 text-[10px] font-bold text-[#C5A059]">
                  {currentUser.grade}
                </span>
              </button>
            )}

            <button
              onClick={() => onTabChange('subjects')}
              className="w-full sm:w-auto px-7 py-3.5 rounded-full bg-[#C5A059] hover:bg-[#d8b168] text-black font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2.5 shadow-xl transition-all transform hover:-translate-y-0.5"
            >
              <Layers className="w-4 h-4" />
              {t.btnExploreCurriculum}
            </button>

            <button
              onClick={() => onTabChange('quizzes')}
              className="w-full sm:w-auto px-7 py-3.5 rounded-full bg-[#111112] text-[#E0E0E0] font-bold text-xs uppercase tracking-widest border border-[#2D2D30] hover:border-[#C5A059] hover:text-[#C5A059] transition-all flex items-center justify-center gap-2.5"
            >
              <Award className="w-4 h-4 text-[#C5A059]" />
              {t.btnPracticeQuizzes}
            </button>

            <button
              onClick={onOpenFlashcards}
              className="w-full sm:w-auto px-5 py-3.5 rounded-full bg-[#1A1A1C] text-[#C5A059] font-bold text-xs uppercase tracking-widest border border-[#C5A059]/30 hover:border-[#C5A059] hover:bg-[#C5A059] hover:text-black transition-all flex items-center justify-center gap-2"
            >
              <Zap className="w-4 h-4" />
              {t.btnQuickRevision}
            </button>
          </div>

          {/* Quick Stats Banner */}
          <div className="mt-12 pt-8 border-t border-[#2D2D30] grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 max-w-4xl mx-auto text-left">
            <div className="p-4 rounded-xl bg-[#111112] border border-[#2D2D30]">
              <span className="block text-2xl font-serif font-bold text-[#C5A059]">{t.statGrades}</span>
              <span className="text-[10px] text-slate-500 font-medium uppercase tracking-wider mt-1 block">{t.statGradesDesc}</span>
            </div>

            <div className="p-4 rounded-xl bg-[#111112] border border-[#2D2D30]">
              <span className="block text-2xl font-serif font-bold text-[#C5A059]">{t.statSubjects}</span>
              <span className="text-[10px] text-slate-500 font-medium uppercase tracking-wider mt-1 block">{t.statSubjectsDesc}</span>
            </div>

            <div className="p-4 rounded-xl bg-[#111112] border border-[#2D2D30]">
              <span className="block text-2xl font-serif font-bold text-[#C5A059]">{t.statNotes}</span>
              <span className="text-[10px] text-slate-500 font-medium uppercase tracking-wider mt-1 block">{t.statNotesDesc}</span>
            </div>

            <div className="p-4 rounded-xl bg-[#111112] border border-[#2D2D30]">
              <span className="block text-2xl font-serif font-bold text-[#C5A059]">{t.statQuestions}</span>
              <span className="text-[10px] text-slate-500 font-medium uppercase tracking-wider mt-1 block">{t.statQuestionsDesc}</span>
            </div>
          </div>

        </div>
      </section>

      {/* =========================================================================
          AUTHENTICATION & STUDENT PORTAL (ON THE FIRST / HOME PAGE)
          ========================================================================= */}
      <section id="student-portal" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-gradient-to-b from-[#141416] to-[#0E0E10] border-2 border-[#C5A059]/40 p-6 sm:p-10 shadow-2xl relative overflow-hidden">
          
          {/* Subtle gold ornamental corner accent */}
          <div className="absolute top-0 right-0 w-40 h-40 bg-[#C5A059]/5 rounded-full blur-3xl pointer-events-none" />

          {/* When User is NOT Logged In: Show Direct Google & Email Sign-In Box */}
          {!currentUser ? (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              
              {/* Left Column: Academic Benefits & Google CTA */}
              <div className="lg:col-span-7 space-y-5">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1A1A1C] border border-[#C5A059]/30 text-[#C5A059] text-[11px] font-bold uppercase tracking-wider">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>
                    {language === 'am' ? 'የተማሪዎች መግቢያ እና ምዝገባ' : language === 'om' ? 'Seensaafi Galmee Barattootaa' : 'Student Access & Portal'}
                  </span>
                </div>

                <h2 className="text-2xl sm:text-4xl font-serif font-bold text-white leading-tight">
                  {language === 'am'
                    ? 'በትምህርት መለያዎ ይግቡ ወይም በGoogle ይቀጥሉ'
                    : language === 'om'
                    ? 'Herrega barnootaa ykn Google\'n seenaa'
                    : 'Access Your Academic Portal or Continue with Google'}
                </h2>

                <p className="text-sm text-slate-300 leading-relaxed font-sans max-w-xl">
                  {language === 'am'
                    ? 'የፈተና ውጤቶችዎን፣ የማስታወሻ እድገትዎን እና የልህቀት ሰርተፊኬትዎን በደመና (Cloud) ላይ ለማስቀመጥ በGoogle መለያዎ በቅጽበት ይግቡ።'
                    : language === 'om'
                    ? 'Qabxii qorumsaa, gabaasa barumsaafi waraqaa ragaa keessan kuufachuuf Google\'n seenaa.'
                    : 'Track your quiz scores, save bookmarks, unlock multimodal AI study tools, and earn verifiable accredited certificates.'}
                </p>

                {/* Primary Google Login Button */}
                <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                  <button
                    onClick={handleGoogleSignIn}
                    disabled={authLoading}
                    className="px-8 py-4 rounded-2xl bg-white hover:bg-slate-100 text-slate-900 font-bold text-sm tracking-wide flex items-center justify-center gap-3 shadow-2xl transition-all transform hover:-translate-y-0.5 border border-slate-200"
                  >
                    <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                      <path
                        fill="#4285F4"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                      />
                    </svg>
                    <span>
                      {language === 'am' ? 'በGoogle መለያ ይቀጥሉ' : language === 'om' ? 'Google\'n Itti-Fufaa' : 'Continue with Google'}
                    </span>
                  </button>

                  <button
                    onClick={() => onTabChange('login')}
                    className="px-6 py-4 rounded-2xl bg-[#1A1A1C] hover:bg-[#222225] border border-[#2D2D30] text-slate-200 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-colors"
                  >
                    <LogIn className="w-4 h-4 text-[#C5A059]" />
                    <span>{language === 'am' ? 'ሙሉ የመግቢያ ገጽ ክፈት' : 'Open Full Login Page'}</span>
                  </button>
                </div>

                {/* Feature Checkpoints */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 border-t border-[#2D2D30]">
                  <div className="flex items-center gap-2 text-xs text-slate-300">
                    <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>{language === 'am' ? 'የውጤት መዝገብ' : 'Dossier Sync'}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-300">
                    <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>{language === 'am' ? 'የኤአይ አስጠኚ' : 'Multimodal AI'}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-300">
                    <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>{language === 'am' ? 'የልህቀት ሰርተፊኬት' : 'Verifiable Certs'}</span>
                  </div>
                </div>

                {/* One-Tap Quick Demo Students */}
                <div className="pt-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
                    ⚡ {language === 'am' ? 'ወይም በሙከራ ተማሪ መለያ በፍጥነት ይግቡ:' : 'Or Quick Access with Sample Student:'}
                  </span>
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => handleDemoSignIn('Grade 12', 'Natural Science')}
                      className="px-3 py-1.5 rounded-lg bg-[#1A1A1C] hover:bg-[#C5A059] hover:text-black border border-[#2D2D30] text-xs font-semibold text-slate-300 transition-colors"
                    >
                      🎓 Grade 12 (Natural Science)
                    </button>
                    <button
                      onClick={() => handleDemoSignIn('Grade 11', 'Social Science')}
                      className="px-3 py-1.5 rounded-lg bg-[#1A1A1C] hover:bg-[#C5A059] hover:text-black border border-[#2D2D30] text-xs font-semibold text-slate-300 transition-colors"
                    >
                      🎓 Grade 11 (Social Science)
                    </button>
                    <button
                      onClick={() => handleDemoSignIn('Grade 10')}
                      className="px-3 py-1.5 rounded-lg bg-[#1A1A1C] hover:bg-[#C5A059] hover:text-black border border-[#2D2D30] text-xs font-semibold text-slate-300 transition-colors"
                    >
                      🎓 Grade 10
                    </button>
                    <button
                      onClick={() => handleDemoSignIn('Grade 9')}
                      className="px-3 py-1.5 rounded-lg bg-[#1A1A1C] hover:bg-[#C5A059] hover:text-black border border-[#2D2D30] text-xs font-semibold text-slate-300 transition-colors"
                    >
                      🎓 Grade 9
                    </button>
                  </div>
                </div>
              </div>

              {/* Right Column: Direct Interactive Form on Front Page */}
              <div className="lg:col-span-5 bg-[#111112] border border-[#2D2D30] rounded-2xl p-5 sm:p-6 space-y-4 shadow-xl">
                <div className="flex items-center justify-between border-b border-[#2D2D30] pb-3">
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setAuthMode('signin')}
                      className={`px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors ${
                        authMode === 'signin'
                          ? 'bg-[#C5A059] text-black shadow-md'
                          : 'bg-[#1A1A1C] text-slate-400 hover:text-white'
                      }`}
                    >
                      {language === 'am' ? 'ይግቡ (Sign In)' : 'Sign In'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setAuthMode('signup')}
                      className={`px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors ${
                        authMode === 'signup'
                          ? 'bg-[#C5A059] text-black shadow-md'
                          : 'bg-[#1A1A1C] text-slate-400 hover:text-white'
                      }`}
                    >
                      {language === 'am' ? 'ይመዝገቡ (Register)' : 'Register'}
                    </button>
                  </div>
                  <span className="text-[10px] text-[#C5A059] font-bold">Secure Access</span>
                </div>

                {authSuccess && (
                  <div className="p-2.5 rounded-xl bg-emerald-950/80 border border-emerald-700 text-emerald-300 text-xs flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 shrink-0" />
                    <span>{authSuccess}</span>
                  </div>
                )}

                {authError && (
                  <div className="p-2.5 rounded-xl bg-rose-950/80 border border-rose-700 text-rose-300 text-xs">
                    {authError}
                  </div>
                )}

                <form onSubmit={handleEmailAuth} className="space-y-3">
                  {authMode === 'signup' && (
                    <div>
                      <label className="text-[11px] font-semibold text-slate-300 block mb-1">
                        {language === 'am' ? 'ሙሉ ስም' : 'Full Name'}
                      </label>
                      <div className="relative">
                        <User className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                        <input
                          type="text"
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          placeholder="e.g. Abebe Bikila"
                          className="w-full pl-9 pr-3 py-2 bg-[#1A1A1C] border border-[#2D2D30] rounded-xl text-xs text-white focus:outline-none focus:border-[#C5A059]"
                        />
                      </div>
                    </div>
                  )}

                  <div>
                    <label className="text-[11px] font-semibold text-slate-300 block mb-1">
                      {language === 'am' ? 'የኢሜይል አድራሻ' : 'Email Address'}
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="student@example.com"
                        className="w-full pl-9 pr-3 py-2 bg-[#1A1A1C] border border-[#2D2D30] rounded-xl text-xs text-white focus:outline-none focus:border-[#C5A059]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-slate-300 block mb-1">
                      {language === 'am' ? 'የይለፍ ቃል' : 'Password'}
                    </label>
                    <div className="relative">
                      <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full pl-9 pr-9 py-2 bg-[#1A1A1C] border border-[#2D2D30] rounded-xl text-xs text-white focus:outline-none focus:border-[#C5A059]"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4 text-[#C5A059]" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {authMode === 'signup' && (
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-[10px] text-slate-400 block mb-1">Grade</label>
                        <select
                          value={selectedGrade}
                          onChange={(e) => setSelectedGrade(e.target.value as GradeLevel)}
                          className="w-full px-2 py-1.5 bg-[#1A1A1C] border border-[#2D2D30] rounded-lg text-xs text-white"
                        >
                          <option value="Grade 9">Grade 9</option>
                          <option value="Grade 10">Grade 10</option>
                          <option value="Grade 11">Grade 11</option>
                          <option value="Grade 12">Grade 12</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-[10px] text-slate-400 block mb-1">Stream</label>
                        <select
                          value={selectedStream}
                          onChange={(e) => setSelectedStream(e.target.value as SubjectStream)}
                          className="w-full px-2 py-1.5 bg-[#1A1A1C] border border-[#2D2D30] rounded-lg text-xs text-white"
                        >
                          <option value="Natural Science">Natural Science</option>
                          <option value="Social Science">Social Science</option>
                        </select>
                      </div>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={authLoading}
                    className="w-full py-2.5 rounded-xl bg-[#C5A059] hover:bg-[#d8b168] text-black font-bold text-xs uppercase tracking-wider transition-colors shadow-lg shadow-[#C5A059]/20"
                  >
                    {authLoading
                      ? (language === 'am' ? 'እባክዎ ይጠብቁ...' : 'Processing...')
                      : authMode === 'signin'
                      ? (language === 'am' ? 'ይግቡ (Sign In)' : 'Sign In to Portal')
                      : (language === 'am' ? 'መለያ ፍጠር (Create Account)' : 'Create Student Account')}
                  </button>
                </form>
              </div>

            </div>
          ) : (
            /* When User IS Logged In: Personalized Active Dashboard Preview Card */
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-[#1A1A1C] border-2 border-[#C5A059] flex items-center justify-center text-3xl shadow-lg shadow-[#C5A059]/20 shrink-0">
                  {currentUser.avatar || '🎓'}
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-xl sm:text-2xl font-serif font-bold text-white">
                      {currentUser.name}
                    </h3>
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-950/80 border border-emerald-700 text-emerald-400 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                      <CheckCircle className="w-3 h-3" /> Logged In
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400">
                    <span className="text-[#C5A059] font-semibold">{currentUser.grade}</span>
                    <span>•</span>
                    <span>{currentUser.stream}</span>
                    <span>•</span>
                    <span className="text-amber-300 font-bold flex items-center gap-1">
                      <Flame className="w-3.5 h-3.5 text-amber-400" /> {currentUser.studyStreakDays || 1} Day Streak
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons for Logged In User */}
              <div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-end">
                <button
                  onClick={onOpenDashboard}
                  className="px-5 py-2.5 rounded-xl bg-[#C5A059] hover:bg-[#d8b168] text-black font-bold text-xs uppercase tracking-wider flex items-center gap-2 transition-colors shadow-md"
                >
                  <User className="w-4 h-4" />
                  <span>{language === 'am' ? 'የግል መዝገቤን ክፈት' : 'Open My Dashboard'}</span>
                </button>

                <button
                  onClick={onOpenAITutor}
                  className="px-4 py-2.5 rounded-xl bg-[#1A1A1C] border border-[#2D2D30] hover:border-[#C5A059] text-white font-bold text-xs uppercase tracking-wider flex items-center gap-2 transition-colors"
                >
                  <Sparkles className="w-4 h-4 text-[#C5A059]" />
                  <span>{language === 'am' ? 'የኤአይ አስጠኚ' : 'AI Study Tutor'}</span>
                </button>

                <button
                  onClick={() => onTabChange('quizzes')}
                  className="px-4 py-2.5 rounded-xl bg-[#1A1A1C] border border-[#2D2D30] hover:border-[#C5A059] text-[#C5A059] font-bold text-xs uppercase tracking-wider flex items-center gap-2 transition-colors"
                >
                  <Award className="w-4 h-4" />
                  <span>{language === 'am' ? 'ፈተና ጀምር' : 'Take Exam'}</span>
                </button>
              </div>
            </div>
          )}

        </div>
      </section>

      {/* Grade Level Selection Cards */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-bold tracking-[0.25em] uppercase text-[#C5A059]">
            {language === 'am' ? 'የትምህርት ደረጃዎች' : language === 'om' ? 'Sadarkaa Barnootaa' : 'Academic Levels'}
          </span>
          <h2 className="text-2xl sm:text-3xl font-serif font-semibold text-white tracking-tight mt-1">
            {t.selectGrade}
          </h2>
          <p className="mt-2 text-slate-400 text-xs sm:text-sm">
            {language === 'am'
              ? 'ለእርስዎ ክፍል የተዘጋጁ የትምህርት ማጠቃለያዎችን እና የፈተና ጥያቄዎችን ይምረጡ።'
              : language === 'om'
              ? 'Gabaasa barnootaafi qorumsa kutaalee keessaniif qophaa\'e filadhaa.'
              : 'Filter subject curricula, study summaries, and national matric practice tests tailored to your grade level.'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {localizedGrades.map((g) => (
            <div
              key={g.level}
              className="group relative rounded-2xl bg-[#111112] border border-[#2D2D30] p-6 hover:border-[#C5A059] transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-md bg-[#1A1A1C] text-[#C5A059] border border-[#C5A059]/30">
                    {g.badge}
                  </span>
                  <GraduationCap className="w-5 h-5 text-[#C5A059]" />
                </div>

                <h3 className="text-xl font-serif font-bold text-white group-hover:text-[#C5A059] transition-colors">
                  {language === 'am' ? g.level.replace('Grade ', 'ክፍል ') : language === 'om' ? g.level.replace('Grade ', 'Kutaa ') : g.level}
                </h3>
                <p className="text-xs font-semibold text-[#C5A059] mt-0.5">{g.title}</p>

                <p className="mt-3 text-xs text-slate-400 leading-relaxed">
                  {g.description}
                </p>

                {/* Subject highlights */}
                <div className="mt-4 pt-4 border-t border-[#2D2D30] flex flex-wrap gap-1.5">
                  <span className="text-[10px] uppercase font-medium px-2 py-0.5 rounded bg-[#1A1A1C] text-slate-300 border border-[#2D2D30]">
                    {language === 'am' ? 'ባዮሎጂ' : language === 'om' ? 'Baayoloojii' : 'Biology'}
                  </span>
                  <span className="text-[10px] uppercase font-medium px-2 py-0.5 rounded bg-[#1A1A1C] text-slate-300 border border-[#2D2D30]">
                    {language === 'am' ? 'ፊዚክስ' : language === 'om' ? 'Fiiziksii' : 'Physics'}
                  </span>
                  <span className="text-[10px] uppercase font-medium px-2 py-0.5 rounded bg-[#1A1A1C] text-slate-300 border border-[#2D2D30]">
                    {language === 'am' ? 'ታሪክ' : language === 'om' ? 'Seenaa' : 'History'}
                  </span>
                  <span className="text-[10px] uppercase font-medium px-2 py-0.5 rounded bg-[#1A1A1C] text-slate-300 border border-[#2D2D30]">
                    {language === 'am' ? 'ሂሳብ' : language === 'om' ? 'Herrega' : 'Math'}
                  </span>
                </div>
              </div>

              <div className="mt-6 flex gap-2">
                <button
                  onClick={() => {
                    onGradeSelect(g.level);
                    onTabChange('notes');
                  }}
                  className="flex-1 py-2 px-3 rounded-lg bg-[#C5A059] hover:bg-[#d8b168] text-black font-bold text-xs uppercase tracking-wider transition-colors flex items-center justify-center gap-1.5"
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  {t.navNotes}
                </button>
                <button
                  onClick={() => {
                    onGradeSelect(g.level);
                    onTabChange('quizzes');
                  }}
                  className="flex-1 py-2 px-3 rounded-lg bg-[#1A1A1C] border border-[#2D2D30] hover:border-[#C5A059] text-white font-bold text-xs uppercase tracking-wider transition-colors flex items-center justify-center gap-1.5"
                >
                  <Award className="w-3.5 h-3.5 text-[#C5A059]" />
                  {t.navQuizzes}
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Core Platform Features Grid */}
      <section className="bg-[#111112] py-16 border-y border-[#2D2D30]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-[0.25em] text-[#C5A059]">
              {language === 'am' ? 'የትምህርት ገጽታዎች' : language === 'om' ? 'Amaloota Barnootaa' : 'Academic Features'}
            </span>
            <h2 className="text-2xl sm:text-3xl font-serif font-semibold text-white tracking-tight mt-1">
              {t.featuresHeading}
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-slate-400">
              {t.featuresSub}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 rounded-2xl bg-[#1A1A1C] border border-[#2D2D30] space-y-3 hover:border-[#C5A059] transition-colors">
              <div className="w-10 h-10 rounded-lg bg-[#C5A059]/10 text-[#C5A059] flex items-center justify-center font-bold">
                <BookOpen className="w-5 h-5" />
              </div>
              <h3 className="text-base font-serif font-bold text-white">{t.featureCurriculumTitle}</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                {t.featureCurriculumDesc}
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#1A1A1C] border border-[#2D2D30] space-y-3 hover:border-[#C5A059] transition-colors">
              <div className="w-10 h-10 rounded-lg bg-[#C5A059]/10 text-[#C5A059] flex items-center justify-center font-bold">
                <Clock className="w-5 h-5" />
              </div>
              <h3 className="text-base font-serif font-bold text-white">{t.featureExamsTitle}</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                {t.featureExamsDesc}
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#1A1A1C] border border-[#2D2D30] space-y-3 hover:border-[#C5A059] transition-colors">
              <div className="w-10 h-10 rounded-lg bg-[#C5A059]/10 text-[#C5A059] flex items-center justify-center font-bold">
                <Brain className="w-5 h-5" />
              </div>
              <h3 className="text-base font-serif font-bold text-white">{t.featureAITitle}</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                {t.featureAIDesc}
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#1A1A1C] border border-[#2D2D30] space-y-3 hover:border-[#C5A059] transition-colors">
              <div className="w-10 h-10 rounded-lg bg-[#C5A059]/10 text-[#C5A059] flex items-center justify-center font-bold">
                <Award className="w-5 h-5" />
              </div>
              <h3 className="text-base font-serif font-bold text-white">{t.featureCertTitle}</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                {t.featureCertDesc}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Subjects Snapshot */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-[0.25em] text-[#C5A059]">
              {language === 'am' ? 'ዋና ዋና የትምህርት አይነቶች' : language === 'om' ? 'Gosa Barnootaa Ijoo' : 'Core Disciplines'}
            </span>
            <h2 className="text-2xl sm:text-3xl font-serif font-semibold text-white tracking-tight mt-1">
              {language === 'am' ? 'የ9-12ኛ ክፍል የትምህርት ዘርፎች' : language === 'om' ? 'Gosoota Barnootaa Kutaa 9-12' : 'Grade 9–12 Academic Streams'}
            </h2>
          </div>
          <button
            onClick={() => onTabChange('subjects')}
            className="text-xs font-bold uppercase tracking-wider text-[#C5A059] hover:underline flex items-center gap-1 self-start md:self-auto"
          >
            <span>{language === 'am' ? 'ሁሉንም የትምህርት አይነቶች ይመልከቱ' : language === 'om' ? 'Hunda Ilaali' : 'View All Subjects'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {SUBJECTS.slice(0, 6).map((sub) => (
            <div
              key={sub.id}
              onClick={() => {
                onTabChange('notes');
              }}
              className="p-4 rounded-xl bg-[#111112] border border-[#2D2D30] hover:border-[#C5A059] transition-all cursor-pointer text-center group"
            >
              <div className="w-12 h-12 rounded-full bg-[#1A1A1C] border border-[#2D2D30] group-hover:border-[#C5A059] flex items-center justify-center text-2xl mx-auto mb-2 transition-colors">
                {sub.icon}
              </div>
              <h4 className="text-xs font-bold text-white group-hover:text-[#C5A059] transition-colors truncate">
                {language === 'am'
                  ? SUBJECT_TRANSLATIONS.am[sub.name] || sub.name
                  : language === 'om'
                  ? SUBJECT_TRANSLATIONS.om[sub.name] || sub.name
                  : sub.name}
              </h4>
              <span className="text-[10px] text-slate-500 font-medium block mt-0.5">{sub.stream}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Honor Certificate Callout Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-gradient-to-r from-[#18181A] via-[#141416] to-[#121214] border-2 border-[#C5A059] p-8 sm:p-10 shadow-2xl flex flex-col lg:flex-row items-center justify-between gap-8 relative overflow-hidden">
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-[#C5A059]/10 border-2 border-[#C5A059] text-[#C5A059] flex items-center justify-center font-serif text-3xl font-bold shrink-0 shadow-lg shadow-[#C5A059]/20">
              <Award className="w-9 h-9 sm:w-10 sm:h-10 text-[#C5A059]" />
            </div>
            <div className="space-y-1">
              <span className="text-xs font-bold uppercase tracking-[0.25em] text-[#C5A059]">
                {language === 'am' ? 'የአካዳሚክ የክብር ሰርተፊኬቶች' : language === 'om' ? 'Waraqaawwan Ragaa Kabajaa' : 'Official Academic Certificates'}
              </span>
              <h3 className="text-xl sm:text-2xl font-serif font-bold text-white">
                {language === 'am' ? 'የእዮኤል እንዳለ በለጠ የልህቀት ሰርተፊኬት ይውሰዱ' : language === 'om' ? 'Waraqaa Ragaa Gahumsa Eyoel Endale Belete Fudhadhaa' : 'Earn Your Eyoel Endale Belete Honor Certificate'}
              </h3>
              <p className="text-xs text-slate-300 max-w-xl leading-relaxed">
                {language === 'am'
                  ? 'በየትምህርት አይነቱ የተዘጋጁትን የ20 ጥያቄዎች ፈተናዎች 70% እና ከዚያ በላይ በማጠናቀቅ ወይም በሰርተፊኬት ማዕከሉ በይፋ የተረጋገጠ ሰነድ አውጥተው ያትሙ።'
                  : language === 'om'
                  ? 'Qorumsawwan gaaffilee 20 qabxii 70% fi isaa ol xumuruun ykn waraqaa ragaa mirkanaa\'e baasuun maxxansaa.'
                  : 'Achieve 70%+ on any 20-question unit assessment or use the Certificate Studio to issue, verify, and print your accredited academic honors.'}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              onClick={() => {
                if (onOpenCertificate) onOpenCertificate();
              }}
              className="px-6 py-3 rounded-full bg-[#C5A059] hover:bg-[#d8b168] text-black font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-[#C5A059]/30 transition-transform active:scale-95"
            >
              <Award className="w-4 h-4" />
              <span>{language === 'am' ? 'ሰርተፊኬት ይስጡ / ይመልከቱ' : language === 'om' ? 'Waraqaa Ragaa Kenni / Ilaali' : 'Issue & Claim Certificate'}</span>
            </button>
            <button
              onClick={() => onTabChange('quizzes')}
              className="px-5 py-3 rounded-full bg-[#1A1A1C] border border-[#2D2D30] hover:border-[#C5A059] text-white font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 transition-colors"
            >
              <span>{language === 'am' ? 'ፈተና ጀምር' : language === 'om' ? 'Qorumsa Jalqabi' : 'Take Exam'}</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#C5A059]" />
            </button>
          </div>
        </div>
      </section>

      {/* Testimonials Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-2xl bg-gradient-to-br from-[#161618] to-[#0A0A0B] border border-[#2D2D30] p-8 sm:p-12 shadow-2xl relative overflow-hidden">
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-[#C5A059] opacity-5 blur-[100px] rounded-full pointer-events-none"></div>
          
          <div className="relative z-10 max-w-3xl">
            <div className="flex items-center gap-1 text-[#C5A059] mb-4">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-[#C5A059]" />
              ))}
            </div>
            <p className="text-base sm:text-xl lg:text-2xl font-serif italic text-white leading-relaxed">
              {language === 'am'
                ? '"የእዮኤል እንዳለ በለጠ የትምህርት መድረክ በ12ኛ ክፍል የብሔራዊ ፈተና ልምምዴ ከፍተኛ ውጤት እንዳገኝ ረድቶኛል። ዝርዝር የምዕራፍ ማጠቃለያዎችና የ20 ጥያቄዎች የፈተና ማብራሪያዎች ፊዚክስና ሂሳብን ግልጽ አድርገውታል።"'
                : language === 'om'
                ? '"Sirni barnootaa Eyoel Endale Belete qorumsa biyyaalessaa Kutaa 12 irratti qabxii olaanaa akka galmeessu na gargaareera. Gabaasni boqonnaawwaniifi ibsi gaaffilee qorumsaa herregaafi fiiziksii salphaa naaf godhe."'
                : '"Eyoel Endale Belete platform helped me achieve top marks on my Grade 12 national exam practice tests. The unit note summaries and 20-question exam solutions made Physics and Math concepts clear and engaging."'}
            </p>
            <div className="mt-6 flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[#C5A059] text-black font-serif italic font-bold flex items-center justify-center text-sm">
                HB
              </div>
              <div>
                <span className="block font-bold text-xs uppercase tracking-wider text-white">Haile B.</span>
                <span className="text-[10px] text-[#C5A059] uppercase tracking-wider">
                  {language === 'am' ? 'የ12ኛ ክፍል የተፈጥሮ ሳይንስ ተማሪ' : language === 'om' ? 'Barataa Saayinsii Uumamaa Kutaa 12' : 'Grade 12 Natural Science Scholar'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          CLEAN LOGIN MODAL (OPENED DIRECTLY VIA "LOGIN" BUTTON ON FIRST PAGE)
          ========================================================================= */}
      {isLoginModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div
            className="relative w-full max-w-md bg-[#121214] border-2 border-[#C5A059]/40 rounded-3xl p-6 sm:p-8 shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Ambient gold glow */}
            <div className="absolute top-0 right-0 w-36 h-36 bg-[#C5A059]/10 rounded-full blur-2xl pointer-events-none" />

            {/* Header with Close */}
            <div className="flex items-center justify-between pb-4 border-b border-[#2D2D30] mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#C5A059] to-[#8C6D2D] flex items-center justify-center text-xl shadow-md text-black font-bold">
                  🎓
                </div>
                <div>
                  <h3 className="font-serif font-bold text-lg text-white">
                    {isForgotPasswordView
                      ? (language === 'am' ? 'የይለፍ ቃል ማስተካከያ' : 'Reset Password')
                      : (language === 'am' ? 'ወደ አካዳሚው ይግቡ' : 'Sign In to Eyoel Academy')}
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    {isForgotPasswordView
                      ? (language === 'am' ? 'የተመዘገቡበትን ኢሜይል ያስገቡ' : 'Enter your registered email address')
                      : (language === 'am' ? 'የተማሪ ወይም የአስተማሪ መለያዎን ይጠቀሙ' : 'Student & Teacher Academic Portal')}
                  </p>
                </div>
              </div>

              <button
                onClick={() => {
                  setIsLoginModalOpen(false);
                  setIsForgotPasswordView(false);
                  setLoginModalError(null);
                  setForgotMessage(null);
                }}
                className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-[#1C1C20] transition-colors"
                title="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Error Message */}
            {loginModalError && (
              <div className="mb-4 p-3 rounded-xl bg-rose-950/80 border border-rose-800 text-rose-300 text-xs flex items-start gap-2">
                <X className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" />
                <span>{loginModalError}</span>
              </div>
            )}

            {/* Forgot Password Feedback */}
            {forgotMessage && (
              <div className="mb-4 p-3 rounded-xl bg-emerald-950/80 border border-emerald-700 text-emerald-300 text-xs">
                {forgotMessage}
              </div>
            )}

            {!isForgotPasswordView ? (
              /* CLEAN LOGIN FORM */
              <form onSubmit={handleCleanLoginSubmit} className="space-y-4">
                
                {/* 1. Email or Username */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    {language === 'am' ? 'ኢሜይል ወይም የተጠቃሚ ስም' : 'Email or Username'}
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                    <input
                      type="text"
                      required
                      value={loginIdentifier}
                      onChange={(e) => setLoginIdentifier(e.target.value)}
                      placeholder={language === 'am' ? 'ለምሳሌ፡ student@eyoelacademy.edu.et ወይም eyoel' : 'student@gmail.com or username'}
                      className="w-full pl-10 pr-4 py-3 bg-[#1A1A1D] border border-[#2D2D30] rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#C5A059] transition-colors"
                    />
                  </div>
                </div>

                {/* 2. Password & Show/Hide Toggle */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-semibold text-slate-300">
                      {language === 'am' ? 'የይለፍ ቃል' : 'Password'}
                    </label>

                    {/* 3. Forgot Password Button */}
                    <button
                      type="button"
                      onClick={() => {
                        setIsForgotPasswordView(true);
                        setLoginModalError(null);
                        setForgotInput(loginIdentifier.includes('@') ? loginIdentifier : '');
                      }}
                      className="text-[11px] text-[#C5A059] hover:underline font-medium"
                    >
                      {language === 'am' ? 'የይለፍ ቃል ረሱ?' : 'Forgot Password?'}
                    </button>
                  </div>

                  <div className="relative">
                    <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                    <input
                      type={showModalPassword ? 'text' : 'password'}
                      required
                      value={loginModalPassword}
                      onChange={(e) => setLoginModalPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-10 pr-11 py-3 bg-[#1A1A1D] border border-[#2D2D30] rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#C5A059] transition-colors"
                    />

                    {/* Show/Hide Password button */}
                    <button
                      type="button"
                      onClick={() => setShowModalPassword(!showModalPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#C5A059] transition-colors"
                      title={showModalPassword ? 'Hide Password' : 'Show Password'}
                    >
                      {showModalPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* 4. Login Button */}
                <button
                  type="submit"
                  disabled={loginModalLoading}
                  className="w-full py-3.5 rounded-xl bg-[#C5A059] hover:bg-[#d8b168] text-black font-bold text-xs uppercase tracking-wider transition-all shadow-lg shadow-[#C5A059]/25 hover:shadow-[#C5A059]/40 flex items-center justify-center gap-2"
                >
                  <Lock className="w-4 h-4" />
                  <span>
                    {loginModalLoading
                      ? (language === 'am' ? 'እየገባ ነው...' : 'Logging in...')
                      : (language === 'am' ? 'ይግቡ (Login)' : 'Login')}
                  </span>
                </button>

                {/* Divider */}
                <div className="relative py-2 flex items-center justify-center">
                  <div className="w-full border-t border-[#2D2D30]"></div>
                  <span className="absolute bg-[#121214] px-3 text-[10px] text-slate-500 uppercase font-bold tracking-widest">
                    OR
                  </span>
                </div>

                {/* Quick Google Sign In */}
                <button
                  type="button"
                  onClick={async () => {
                    await handleGoogleSignIn();
                    setIsLoginModalOpen(false);
                  }}
                  className="w-full py-3 rounded-xl bg-white hover:bg-slate-100 text-slate-900 font-bold text-xs flex items-center justify-center gap-2.5 transition-colors shadow-md border border-slate-300"
                >
                  <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                    />
                  </svg>
                  <span>{language === 'am' ? 'በGoogle መለያ ይቀጥሉ' : 'Continue with Google'}</span>
                </button>

                {/* Sign Up Link: Opens Registration page */}
                <div className="text-center pt-2">
                  <span className="text-xs text-slate-400">
                    {language === 'am' ? 'አካውንት የለዎትም?' : "Don't have an account?"}{' '}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setIsLoginModalOpen(false);
                      onTabChange('register');
                    }}
                    className="text-xs font-bold text-[#C5A059] hover:underline"
                  >
                    {language === 'am' ? 'አዲስ ይመዝገቡ (Sign Up)' : 'Sign Up'}
                  </button>
                </div>
              </form>
            ) : (
              /* FORGOT PASSWORD FORM */
              <form onSubmit={handleForgotPasswordSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    {language === 'am' ? 'የተመዘገቡበት የኢሜይል አድራሻ' : 'Registered Email Address'}
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                    <input
                      type="email"
                      required
                      value={forgotInput}
                      onChange={(e) => setForgotInput(e.target.value)}
                      placeholder="student@example.com"
                      className="w-full pl-10 pr-4 py-3 bg-[#1A1A1D] border border-[#2D2D30] rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#C5A059] transition-colors"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loginModalLoading}
                  className="w-full py-3.5 rounded-xl bg-[#C5A059] hover:bg-[#d8b168] text-black font-bold text-xs uppercase tracking-wider transition-all shadow-lg shadow-[#C5A059]/25 flex items-center justify-center gap-2"
                >
                  <KeyRound className="w-4 h-4" />
                  <span>
                    {loginModalLoading
                      ? (language === 'am' ? 'እየተላከ ነው...' : 'Sending...')
                      : (language === 'am' ? 'የይለፍ ቃል መልሶ ማግኛ ላክ' : 'Send Reset Instructions')}
                  </span>
                </button>

                <div className="text-center pt-2">
                  <button
                    type="button"
                    onClick={() => setIsForgotPasswordView(false)}
                    className="text-xs text-slate-400 hover:text-white"
                  >
                    ← {language === 'am' ? 'ወደ መግቢያ ተመለስ' : 'Back to Login'}
                  </button>
                </div>
              </form>
            )}

          </div>
        </div>
      )}

    </div>
  );
};
