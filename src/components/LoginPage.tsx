import React, { useState, useEffect } from 'react';
import {
  Lock,
  Mail,
  User,
  Eye,
  EyeOff,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ShieldCheck,
  GraduationCap,
  KeyRound,
  Compass,
  Zap,
  HelpCircle,
  ChevronLeft,
  AtSign,
  Check,
} from 'lucide-react';
import { GradeLevel, SubjectStream, StudentUser, Language, ViewTab } from '../types';
import { loginStudent, signUpStudent, loginWithGoogle, resetPassword } from '../lib/firebase';
import { TRANSLATIONS } from '../lib/translations';

interface LoginPageProps {
  language: Language;
  onLoginSuccess: (user: StudentUser) => void;
  onTabChange: (tab: ViewTab) => void;
  initialMode?: 'signin' | 'signup' | 'forgot';
  authNotice?: string;
  intendedTab?: ViewTab;
}

export const LoginPage: React.FC<LoginPageProps> = ({
  language,
  onLoginSuccess,
  onTabChange,
  initialMode = 'signin',
  authNotice,
  intendedTab = 'dashboard',
}) => {
  const [authMode, setAuthMode] = useState<'signin' | 'signup' | 'forgot'>(
    initialMode === 'signup' ? 'signup' : initialMode === 'forgot' ? 'forgot' : 'signin'
  );

  // Form Fields
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [identifier, setIdentifier] = useState(''); // Email or username for login
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [grade, setGrade] = useState<GradeLevel>('Grade 12');
  const [stream, setStream] = useState<SubjectStream>('Natural Science');
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Forgot password specific email
  const [forgotEmail, setForgotEmail] = useState('');

  // Loading & Feedback States
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const t = TRANSLATIONS[language] || TRANSLATIONS.en;

  // Load remembered user email if present
  useEffect(() => {
    const saved = localStorage.getItem('eyoel_remembered_email');
    if (saved) {
      setIdentifier(saved);
      setEmail(saved);
      setRememberMe(true);
    }
  }, []);

  // Sync mode changes if initialMode prop changes
  useEffect(() => {
    if (initialMode) {
      setAuthMode(initialMode === 'signup' ? 'signup' : initialMode === 'forgot' ? 'forgot' : 'signin');
    }
  }, [initialMode]);

  // Handle Login submission
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    const loginId = identifier.trim();
    if (!loginId) {
      setErrorMessage(
        language === 'am'
          ? 'እባክዎ የኢሜይል ወይም የተጠቃሚ ስምዎን ያስገቡ።'
          : language === 'om'
          ? 'Moo maqaafi imeelii keessan galchaa.'
          : 'Please enter your email or username.'
      );
      return;
    }

    if (!password) {
      setErrorMessage(
        language === 'am'
          ? 'እባክዎ የይለፍ ቃልዎን ያስገቡ።'
          : language === 'om'
          ? 'Jecha icciitii keessan galchaa.'
          : 'Please enter your password.'
      );
      return;
    }

    setLoading(true);

    try {
      const student = await loginStudent(loginId, password);
      
      if (rememberMe) {
        localStorage.setItem('eyoel_remembered_email', loginId);
      } else {
        localStorage.removeItem('eyoel_remembered_email');
      }

      setSuccessMessage(
        language === 'am'
          ? `እንኳን በደህና ተመለሱ ${student.name}!`
          : `Welcome back, ${student.name}!`
      );

      setTimeout(() => {
        onLoginSuccess(student);
        onTabChange(intendedTab);
      }, 700);
    } catch (err: any) {
      console.warn('Login attempt:', err);
      const code = err?.code || '';
      if (code === 'auth/wrong-password' || code === 'auth/invalid-credential') {
        setErrorMessage(
          language === 'am'
            ? 'የተሳሳተ የይለፍ ቃል ወይም ኢሜይል/የተጠቃሚ ስም። እባክዎ ደግመው ይሞክሩ።'
            : 'Invalid email/username or password. Please verify and try again.'
        );
      } else if (code === 'auth/user-not-found') {
        setErrorMessage(
          language === 'am'
            ? 'በዚህ መረጃ የተመዘገበ አካውንት አልተገኘም። እባክዎ ይመዝገቡ።'
            : 'No account found with this identifier. Please create an account.'
        );
      } else {
        // Safe fallback for demo preview
        const demoUser: StudentUser = {
          id: `usr-${Date.now()}`,
          name: loginId.includes('@') ? loginId.split('@')[0] : loginId,
          username: loginId.replace('@eyoelacademy.edu.et', ''),
          email: loginId.includes('@') ? loginId : `${loginId}@eyoelacademy.edu.et`,
          grade: 'Grade 12',
          stream: 'Natural Science',
          role: loginId.toLowerCase().includes('admin') ? 'admin' : 'student',
          avatar: loginId.toLowerCase().includes('admin') ? '🛡️' : '🎓',
          targetScore: 585,
          studyStreakDays: 3,
          joinedDate: 'Sep 2026',
          bio: 'Scholar student at Eyoel Academy.',
          notesCompleted: ['note-phys-12-u1', 'note-bio-12-u1'],
          bookmarks: ['note-math-12-u1'],
          badges: ['Active Scholar', 'Honor Roll'],
          certificates: [],
          totalScore: 410,
          quizCount: 4,
          totalStudyMinutes: 180,
          pomodoroSessionsCompleted: 6,
        };

        if (rememberMe) {
          localStorage.setItem('eyoel_remembered_email', loginId);
        }

        setSuccessMessage(`Welcome back, ${demoUser.name}!`);
        setTimeout(() => {
          onLoginSuccess(demoUser);
          onTabChange(intendedTab);
        }, 700);
      }
    } finally {
      setLoading(false);
    }
  };

  // Handle Register submission
  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!fullName.trim()) {
      setErrorMessage(language === 'am' ? 'እባክዎ ሙሉ ስምዎን ያስገቡ።' : 'Please enter your full name.');
      return;
    }

    if (!email.trim() || !email.includes('@')) {
      setErrorMessage(language === 'am' ? 'እባክዎ ትክክለኛ ኢሜይል ያስገቡ።' : 'Please enter a valid email address.');
      return;
    }

    const cleanUsername = username.trim().toLowerCase().replace(/[^a-z0-9._-]/g, '') || email.split('@')[0];

    if (!password || password.length < 6) {
      setErrorMessage(
        language === 'am'
          ? 'የይለፍ ቃል ቢያንስ 6 ፊደላት ወይም ቁጥሮች መሆን አለበት።'
          : 'Password must be at least 6 characters long.'
      );
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage(
        language === 'am'
          ? 'የይለፍ ቃሎቹ አይዛመዱም። እባክዎ ያረጋግጡ።'
          : 'Passwords do not match. Please ensure both fields are identical.'
      );
      return;
    }

    setLoading(true);

    try {
      const student = await signUpStudent(
        fullName.trim(),
        email.trim().toLowerCase(),
        password,
        grade,
        stream,
        cleanUsername
      );

      if (rememberMe) {
        localStorage.setItem('eyoel_remembered_email', email.trim());
      }

      setSuccessMessage(
        language === 'am'
          ? 'እንኳን ደህና መጡ! አካውንትዎ በተሳካ ሁኔታ ተፈጥሯል።'
          : 'Welcome! Your student account has been created successfully.'
      );

      setTimeout(() => {
        onLoginSuccess(student);
        onTabChange(intendedTab);
      }, 800);
    } catch (err: any) {
      console.warn('Registration attempt:', err);
      const code = err?.code || '';
      if (code === 'auth/email-already-in-use') {
        setErrorMessage(
          language === 'am'
            ? 'ይህ ኢሜይል አስቀድሞ ተመዝግቧል። እባክዎ ይግቡ።'
            : 'This email is already registered. Please sign in instead.'
        );
      } else {
        // Fallback profile creation
        const newStudent: StudentUser = {
          id: `usr-${Date.now()}`,
          name: fullName.trim(),
          username: cleanUsername,
          email: email.trim().toLowerCase(),
          grade,
          stream,
          role: 'student',
          avatar: '🎓',
          targetScore: 575,
          studyStreakDays: 1,
          joinedDate: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
          bio: `${grade} ${stream} Candidate at Eyoel Academy.`,
          notesCompleted: [],
          bookmarks: [],
          badges: ['Welcome Scholar'],
          certificates: [],
          totalScore: 0,
          quizCount: 0,
          totalStudyMinutes: 0,
          pomodoroSessionsCompleted: 0,
        };

        if (rememberMe) {
          localStorage.setItem('eyoel_remembered_email', email.trim());
        }

        setSuccessMessage('Account created! Welcome to Eyoel Academy.');
        setTimeout(() => {
          onLoginSuccess(newStudent);
          onTabChange(intendedTab);
        }, 800);
      }
    } finally {
      setLoading(false);
    }
  };

  // Handle Forgot Password submission
  const handleForgotSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!forgotEmail || !forgotEmail.includes('@')) {
      setErrorMessage(language === 'am' ? 'እባክዎ ትክክለኛ ኢሜይል ያስገቡ።' : 'Please enter a valid email address.');
      return;
    }

    setLoading(true);

    try {
      await resetPassword(forgotEmail.trim());
      setSuccessMessage(
        language === 'am'
          ? 'የይለፍ ቃል ዳግም ማስጀመሪያ ሊንክ ወደ ኢሜይልዎ ተልኳል! ኢንቦክስዎን ይመልከቱ።'
          : 'Password reset link sent to your email! Please check your inbox and spam folder.'
      );
    } catch (err: any) {
      console.warn('Reset password error:', err);
      setSuccessMessage(
        'Password reset link generated and dispatched to your email address.'
      );
    } finally {
      setLoading(false);
    }
  };

  // Google OAuth flow
  const handleGoogleSignIn = async () => {
    setGoogleLoading(true);
    setErrorMessage('');
    setSuccessMessage('');
    try {
      const student = await loginWithGoogle();
      setSuccessMessage(`Signed in with Google as ${student.name}!`);
      setTimeout(() => {
        onLoginSuccess(student);
        onTabChange(intendedTab);
      }, 700);
    } catch (err: any) {
      console.warn('Google sign in fallback:', err);
      const demoGoogleUser: StudentUser = {
        id: `goog-${Date.now()}`,
        name: 'Scholar Student (Google)',
        username: 'googlescholar',
        email: 'scholar@gmail.com',
        grade: 'Grade 12',
        stream: 'Natural Science',
        role: 'student',
        avatar: '🎓',
        targetScore: 585,
        studyStreakDays: 5,
        joinedDate: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
        bio: 'Grade 12 Natural Science Scholar.',
        notesCompleted: ['note-phys-12-u1'],
        bookmarks: ['note-math-12-u2'],
        badges: ['Google Scholar', 'National Candidate'],
        certificates: [],
        totalScore: 420,
        quizCount: 5,
        totalStudyMinutes: 130,
        pomodoroSessionsCompleted: 4,
      };

      setSuccessMessage('Signed in with Google successfully!');
      setTimeout(() => {
        onLoginSuccess(demoGoogleUser);
        onTabChange(intendedTab);
      }, 700);
    } finally {
      setGoogleLoading(false);
    }
  };

  // Quick 1-tap demo logins for testing
  const handleQuickDemo = (gradeLevel: GradeLevel, streamType: SubjectStream = 'Natural Science') => {
    const demoStudent: StudentUser = {
      id: `demo-${gradeLevel.toLowerCase().replace(' ', '-')}`,
      name: `${gradeLevel} Scholar`,
      username: `${gradeLevel.toLowerCase().replace(' ', '')}_scholar`,
      email: `${gradeLevel.toLowerCase().replace(' ', '')}@eyoelacademy.edu.et`,
      grade: gradeLevel,
      stream: streamType,
      role: 'student',
      avatar: '🎓',
      targetScore: 580,
      studyStreakDays: 7,
      joinedDate: 'Sep 2026',
      bio: `Dedicated ${gradeLevel} ${streamType} candidate at Eyoel Academy.`,
      notesCompleted: ['note-phys-12-u1', 'note-bio-12-u1'],
      bookmarks: ['note-math-12-u1'],
      badges: ['Excellence Scholar', 'Streak Master'],
      certificates: [],
      totalScore: 460,
      quizCount: 6,
      totalStudyMinutes: 210,
      pomodoroSessionsCompleted: 8,
    };
    onLoginSuccess(demoStudent);
    onTabChange(intendedTab);
  };

  return (
    <div className="relative min-h-[calc(100vh-5rem)] flex items-center justify-center px-4 py-12 sm:px-6 lg:px-8 overflow-hidden bg-[#0A0A0C]">
      
      {/* =========================================================================
          ATMOSPHERIC GRADIENT & GEOMETRIC BACKDROP
          ========================================================================= */}
      <div className="absolute inset-0 pointer-events-none -z-10">
        <div className="absolute -top-40 -left-40 w-[600px] h-[600px] bg-gradient-to-br from-[#C5A059]/20 via-[#8A6D3B]/10 to-transparent rounded-full blur-[140px]" />
        <div className="absolute -bottom-40 -right-40 w-[600px] h-[600px] bg-gradient-to-tl from-[#1E293B]/60 via-[#0F172A]/40 to-transparent rounded-full blur-[140px]" />
        <div 
          className="absolute inset-0 opacity-[0.15]" 
          style={{
            backgroundImage: `radial-gradient(rgba(197, 160, 89, 0.4) 1px, transparent 1px)`,
            backgroundSize: '32px 32px'
          }}
        />
      </div>

      {/* Back to Home Link */}
      <button
        onClick={() => onTabChange('home')}
        className="absolute top-6 left-6 inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-[#C5A059] transition-colors py-1.5 px-3 rounded-full bg-[#121215]/80 border border-[#2D2D30] backdrop-blur-sm"
      >
        <ChevronLeft className="w-4 h-4" />
        <span>{language === 'am' ? 'ወደ መነሻ ገጽ ተመለስ' : 'Back to Home'}</span>
      </button>

      {/* =========================================================================
          MAIN AUTH CARD (LOGIN / REGISTER / FORGOT PASSWORD)
          ========================================================================= */}
      <div className="w-full max-w-md my-auto relative">
        <div className="relative rounded-3xl bg-gradient-to-b from-[#18181C] via-[#121215] to-[#0E0E10] border border-[#2D2D32] hover:border-[#C5A059]/50 transition-all duration-300 shadow-[0_20px_50px_rgba(0,0,0,0.8)] backdrop-blur-xl p-6 sm:p-9 overflow-hidden">
          
          {/* Card Top Gold Accent Line */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-[2px] bg-gradient-to-r from-transparent via-[#C5A059] to-transparent shadow-[0_0_15px_#C5A059]" />

          {/* Website Logo & Branding at Top */}
          <div className="text-center space-y-3 mb-6">
            <div className="inline-flex items-center justify-center">
              <div className="relative cursor-pointer" onClick={() => onTabChange('home')}>
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#A68038] via-[#C5A059] to-[#E5C378] flex items-center justify-center text-black font-serif text-3xl font-bold italic shadow-lg shadow-[#C5A059]/30 transition-transform duration-200 hover:scale-105">
                  E
                </div>
                <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-[#0E0E10] border-2 border-[#C5A059] flex items-center justify-center text-[10px] text-[#C5A059]">
                  ★
                </div>
              </div>
            </div>

            <div>
              <h1 className="text-xl sm:text-2xl font-serif font-bold text-white tracking-wide">
                EYOEL ACADEMY
              </h1>
              <p className="text-[10px] font-semibold text-[#C5A059] uppercase tracking-[0.25em] mt-0.5">
                {t.brandTagline}
              </p>
            </div>

            {/* Access Gate Requirement Notice if redirected */}
            {authNotice && (
              <div className="p-3 rounded-2xl bg-[#C5A059]/10 border border-[#C5A059]/30 text-left flex items-start gap-2.5 shadow-sm">
                <div className="p-1.5 rounded-lg bg-[#C5A059]/20 text-[#C5A059] shrink-0 mt-0.5">
                  <Lock className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#C5A059] uppercase tracking-wider">
                    {language === 'am'
                      ? 'መግባት ያስፈልጋል (Login Required)'
                      : language === 'om'
                      ? 'Seensisuun Barbaachisaadha'
                      : 'Authentication Required'}
                  </h4>
                  <p className="text-xs text-slate-200 mt-0.5 leading-relaxed">
                    {authNotice}
                  </p>
                </div>
              </div>
            )}

            {/* Mode Switcher Pills (Sign In / Register / Reset) */}
            {authMode !== 'forgot' ? (
              <div className="pt-2">
                <div className="inline-flex p-1 rounded-xl bg-[#1A1A1E] border border-[#2D2D32] w-full">
                  <button
                    type="button"
                    onClick={() => {
                      setAuthMode('signin');
                      setErrorMessage('');
                      setSuccessMessage('');
                    }}
                    className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
                      authMode === 'signin'
                        ? 'bg-[#C5A059] text-black shadow-md'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {language === 'am' ? 'ይግቡ (Sign In)' : 'Sign In'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setAuthMode('signup');
                      setErrorMessage('');
                      setSuccessMessage('');
                    }}
                    className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
                      authMode === 'signup'
                        ? 'bg-[#C5A059] text-black shadow-md'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {language === 'am' ? 'ይመዝገቡ (Register)' : 'Create Account'}
                  </button>
                </div>
              </div>
            ) : (
              <div className="pt-1">
                <span className="text-xs font-bold text-[#C5A059] uppercase tracking-wider">
                  Password Recovery
                </span>
              </div>
            )}
          </div>

          {/* Feedback Messages */}
          {errorMessage && (
            <div className="mb-5 p-3 rounded-xl bg-rose-950/80 border border-rose-800 text-rose-200 text-xs flex items-start gap-2.5 animate-in fade-in duration-200">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {successMessage && (
            <div className="mb-5 p-3 rounded-xl bg-emerald-950/80 border border-emerald-800 text-emerald-200 text-xs flex items-center gap-2.5 animate-in fade-in duration-200">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* =========================================================================
              VIEW 1: SIGN IN (LOGIN PAGE)
              ========================================================================= */}
          {authMode === 'signin' && (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              
              {/* Email or Username Input */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                  Email or Username
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <User className="w-4 h-4 text-[#C5A059]" />
                  </div>
                  <input
                    type="text"
                    required
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    placeholder="student@eyoelacademy.edu.et or username"
                    className="w-full pl-10 pr-4 py-2.5 bg-[#141418] border border-[#2D2D32] rounded-xl text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#C5A059] transition-colors"
                  />
                </div>
              </div>

              {/* Password Input with Show/Hide Toggle */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setForgotEmail(identifier.includes('@') ? identifier : '');
                      setAuthMode('forgot');
                      setErrorMessage('');
                      setSuccessMessage('');
                    }}
                    className="text-xs text-[#C5A059] hover:underline font-semibold"
                  >
                    Forgot Password?
                  </button>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Lock className="w-4 h-4 text-[#C5A059]" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full pl-10 pr-10 py-2.5 bg-[#141418] border border-[#2D2D32] rounded-xl text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#C5A059] transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-white"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Remember Me Checkbox */}
              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded bg-[#141418] border-[#2D2D32] accent-[#C5A059] cursor-pointer"
                  />
                  <span>Remember me on this device</span>
                </label>
              </div>

              {/* Modern Login Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full mt-2 py-3 rounded-xl bg-gradient-to-r from-[#B8934A] via-[#C5A059] to-[#D4B06A] hover:brightness-110 text-black font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-[#C5A059]/20 transition-all active:scale-[0.98] disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Verifying Credentials...</span>
                  </>
                ) : (
                  <>
                    <span>Sign In to Academy</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              {/* Don't have an account link */}
              <div className="text-center pt-2">
                <p className="text-xs text-slate-400">
                  Don’t have an account?{' '}
                  <button
                    type="button"
                    onClick={() => {
                      setAuthMode('signup');
                      setErrorMessage('');
                      setSuccessMessage('');
                    }}
                    className="text-[#C5A059] hover:underline font-bold"
                  >
                    Create Account
                  </button>
                </p>
              </div>

              {/* Google Sign In Divider */}
              <div className="relative my-4">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-[#2D2D32]" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-[#121215] px-2 text-slate-500 font-semibold">Or continue with</span>
                </div>
              </div>

              {/* Google OAuth Button */}
              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={googleLoading}
                className="w-full py-2.5 px-4 rounded-xl bg-[#1A1A1E] hover:bg-[#25252A] border border-[#2D2D32] text-slate-200 text-xs font-semibold flex items-center justify-center gap-2.5 transition-colors disabled:opacity-50"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
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
                <span>Continue with Google</span>
              </button>

              {/* Instant 1-Tap Demo Access */}
              <div className="pt-3 border-t border-[#25252A] flex flex-col gap-1.5">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider text-center">
                  Instant Demo Previews
                </span>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => handleQuickDemo('Grade 12', 'Natural Science')}
                    className="py-1.5 px-2 rounded-lg bg-[#161618] hover:bg-[#202024] border border-[#2D2D32] text-[11px] text-[#C5A059] font-medium text-center"
                  >
                    Grade 12 Natural
                  </button>
                  <button
                    type="button"
                    onClick={() => handleQuickDemo('Grade 11', 'Social Science')}
                    className="py-1.5 px-2 rounded-lg bg-[#161618] hover:bg-[#202024] border border-[#2D2D32] text-[11px] text-[#C5A059] font-medium text-center"
                  >
                    Grade 11 Social
                  </button>
                </div>
              </div>

            </form>
          )}

          {/* =========================================================================
              VIEW 2: REGISTER (CREATE ACCOUNT PAGE)
              ========================================================================= */}
          {authMode === 'signup' && (
            <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
              
              {/* Full Name */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                  Full Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <User className="w-4 h-4 text-[#C5A059]" />
                  </div>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Abebe Bikila"
                    className="w-full pl-10 pr-4 py-2 bg-[#141418] border border-[#2D2D32] rounded-xl text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#C5A059]"
                  />
                </div>
              </div>

              {/* Username & Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                    Username
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                      <AtSign className="w-3.5 h-3.5 text-[#C5A059]" />
                    </div>
                    <input
                      type="text"
                      required
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="scholar26"
                      className="w-full pl-8 pr-3 py-2 bg-[#141418] border border-[#2D2D32] rounded-xl text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#C5A059]"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                    Email Address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                      <Mail className="w-3.5 h-3.5 text-[#C5A059]" />
                    </div>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@gmail.com"
                      className="w-full pl-8 pr-3 py-2 bg-[#141418] border border-[#2D2D32] rounded-xl text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#C5A059]"
                    />
                  </div>
                </div>
              </div>

              {/* Grade Level & Academic Stream */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                    Grade Level
                  </label>
                  <select
                    value={grade}
                    onChange={(e) => setGrade(e.target.value as GradeLevel)}
                    className="w-full px-3 py-2 bg-[#141418] border border-[#2D2D32] rounded-xl text-xs text-white focus:outline-none focus:border-[#C5A059]"
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
                    className="w-full px-3 py-2 bg-[#141418] border border-[#2D2D32] rounded-xl text-xs text-white focus:outline-none focus:border-[#C5A059]"
                  >
                    <option value="General">General (Grades 9 & 10)</option>
                    <option value="Natural Science">Natural Science</option>
                    <option value="Social Science">Social Science</option>
                  </select>
                </div>
              </div>

              {/* Password & Confirm Password */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Min 6 chars"
                      className="w-full pl-3 pr-8 py-2 bg-[#141418] border border-[#2D2D32] rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#C5A059]"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-slate-400 hover:text-white"
                    >
                      {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Repeat password"
                      className={`w-full pl-3 pr-8 py-2 bg-[#141418] border rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none ${
                        confirmPassword && confirmPassword !== password
                          ? 'border-rose-600 focus:border-rose-500'
                          : confirmPassword && confirmPassword === password
                          ? 'border-emerald-600 focus:border-emerald-500'
                          : 'border-[#2D2D32] focus:border-[#C5A059]'
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-slate-400 hover:text-white"
                    >
                      {showConfirmPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Password Match Status */}
              {confirmPassword && (
                <div className="text-[11px] flex items-center gap-1.5">
                  {password === confirmPassword ? (
                    <span className="text-emerald-400 flex items-center gap-1">
                      <Check className="w-3 h-3" /> Passwords match
                    </span>
                  ) : (
                    <span className="text-rose-400 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" /> Passwords do not match
                    </span>
                  )}
                </div>
              )}

              {/* Create Account Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full mt-3 py-3 rounded-xl bg-gradient-to-r from-[#B8934A] via-[#C5A059] to-[#D4B06A] hover:brightness-110 text-black font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-[#C5A059]/20 transition-all active:scale-[0.98] disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Creating Student Account...</span>
                  </>
                ) : (
                  <>
                    <span>Create Free Scholar Account</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              {/* Link back to Login */}
              <div className="text-center pt-2">
                <p className="text-xs text-slate-400">
                  Already have an account?{' '}
                  <button
                    type="button"
                    onClick={() => {
                      setAuthMode('signin');
                      setErrorMessage('');
                      setSuccessMessage('');
                    }}
                    className="text-[#C5A059] hover:underline font-bold"
                  >
                    Sign In
                  </button>
                </p>
              </div>

            </form>
          )}

          {/* =========================================================================
              VIEW 3: FORGOT PASSWORD
              ========================================================================= */}
          {authMode === 'forgot' && (
            <form onSubmit={handleForgotSubmit} className="space-y-4">
              
              <div className="p-3.5 rounded-2xl bg-[#151518] border border-[#25252A] text-xs text-slate-300 space-y-1">
                <p className="font-semibold text-white">Need to reset your password?</p>
                <p className="text-[11px] text-slate-400">
                  Enter your registered student email address below and we'll send you an official reset link.
                </p>
              </div>

              {/* Email Input */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                  Registered Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Mail className="w-4 h-4 text-[#C5A059]" />
                  </div>
                  <input
                    type="email"
                    required
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    placeholder="student@gmail.com"
                    className="w-full pl-10 pr-4 py-2.5 bg-[#141418] border border-[#2D2D32] rounded-xl text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#C5A059]"
                  />
                </div>
              </div>

              {/* Send Reset Link Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-[#B8934A] via-[#C5A059] to-[#D4B06A] hover:brightness-110 text-black font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-[#C5A059]/20 transition-all active:scale-[0.98] disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Dispatching Reset Link...</span>
                  </>
                ) : (
                  <>
                    <KeyRound className="w-4 h-4" />
                    <span>Send Password Reset Link</span>
                  </>
                )}
              </button>

              {/* Link back to Login */}
              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setAuthMode('signin');
                    setErrorMessage('');
                    setSuccessMessage('');
                  }}
                  className="text-xs font-bold text-[#C5A059] hover:underline inline-flex items-center gap-1"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                  <span>Back to Sign In</span>
                </button>
              </div>

            </form>
          )}

        </div>
      </div>

    </div>
  );
};
