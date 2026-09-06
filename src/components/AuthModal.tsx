import React, { useState, useEffect } from 'react';
import {
  X,
  User,
  Lock,
  Mail,
  GraduationCap,
  Sparkles,
  CheckCircle,
  ArrowRight,
  Loader2,
  AlertCircle,
  Eye,
  EyeOff,
  KeyRound,
  ShieldCheck,
} from 'lucide-react';
import { GradeLevel, SubjectStream, StudentUser } from '../types';
import { signUpStudent, loginStudent, loginWithGoogle, logoutStudent, resetPassword, ADMIN_EMAIL } from '../lib/firebase';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: StudentUser | null;
  onLogin: (user: StudentUser) => void;
  onLogout: () => void;
}

const AVATAR_OPTIONS = [
  '🎓', '🧠', '🔬', '📐', '📚', '🚀', '🌟', '💻'
];

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onLogin,
  onLogout,
}) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [grade, setGrade] = useState<GradeLevel>('Grade 12');
  const [stream, setStream] = useState<SubjectStream>('Natural Science');
  const [avatar, setAvatar] = useState('🎓');
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Forgot password modal state
  const [showForgot, setShowForgot] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotSuccess, setForgotSuccess] = useState(false);
  const [forgotError, setForgotError] = useState('');

  useEffect(() => {
    const saved = localStorage.getItem('eyoel_remembered_email');
    if (saved) {
      setEmail(saved);
      setRememberMe(true);
    }
  }, []);

  if (!isOpen) return null;

  const handleGoogleAuth = async () => {
    setErrorMessage('');
    setSuccessMessage('');
    setGoogleLoading(true);
    try {
      const student = await loginWithGoogle();
      onLogin(student);
      setSuccessMessage(`Welcome ${student.name}! Signed in with Google.`);
      setTimeout(() => {
        setGoogleLoading(false);
        onClose();
      }, 700);
    } catch (err: any) {
      setGoogleLoading(false);
      console.error('Google Sign In error:', err);
      const code = err?.code || '';
      if (code === 'auth/popup-closed-by-user') {
        setErrorMessage('Google sign-in popup was closed before completion. Please try again.');
      } else if (code === 'auth/cancelled-popup-request') {
        setErrorMessage('Only one popup request is allowed at a time.');
      } else {
        setErrorMessage(err?.message || 'Failed to sign in with Google.');
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');
    setLoading(true);

    if (!email || !password) {
      setErrorMessage('Please provide both email and password.');
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setErrorMessage('Password must be at least 6 characters long.');
      setLoading(false);
      return;
    }

    if (isSignUp && !name.trim()) {
      setErrorMessage('Please enter your full student name.');
      setLoading(false);
      return;
    }

    try {
      if (isSignUp) {
        const student = await signUpStudent(name.trim(), email.trim(), password, grade, stream);
        onLogin(student);
        setSuccessMessage('Student account created successfully! Progress and certificates are now saved.');
      } else {
        const student = await loginStudent(email.trim(), password);
        onLogin(student);
        setSuccessMessage('Signed in successfully! Welcome back.');
      }

      setTimeout(() => {
        setLoading(false);
        onClose();
      }, 800);
    } catch (err: any) {
      setLoading(false);
      console.error('Firebase Auth error:', err);
      const code = err?.code || '';
      if (code === 'auth/email-already-in-use') {
        setErrorMessage('This email is already registered. Please sign in instead.');
      } else if (code === 'auth/wrong-password' || code === 'auth/invalid-credential') {
        setErrorMessage('Invalid email or password. Please double-check and try again.');
      } else if (code === 'auth/invalid-email') {
        setErrorMessage('Please enter a valid email address.');
      } else if (code === 'auth/weak-password') {
        setErrorMessage('Password is too weak. Please use at least 6 characters.');
      } else {
        setErrorMessage(err?.message || 'Authentication error. Please try again.');
      }
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail || !forgotEmail.includes('@')) {
      setForgotError('Please enter a valid email address.');
      return;
    }
    setForgotLoading(true);
    setForgotError('');
    try {
      await resetPassword(forgotEmail.trim());
      setForgotSuccess(true);
    } catch (err: any) {
      setForgotError(err?.message || 'Failed to send reset link. Please check the email address.');
    } finally {
      setForgotLoading(false);
    }
  };

  const handleDemoLogin = async (selectedGrade: GradeLevel = 'Grade 12', selectedStream: SubjectStream = 'Natural Science') => {
    setLoading(true);
    setErrorMessage('');
    try {
      // Fast demo profile
      const demoUser: StudentUser = {
        id: 'demo-student-eyoel-101',
        name: 'Eyoel T. Bekele',
        email: 'eyoel.student@academy.edu.et',
        grade: selectedGrade,
        stream: selectedStream,
        role: 'student',
        avatar: '🎓',
        targetScore: 580,
        studyStreakDays: 7,
        joinedDate: 'Sep 2024',
        bio: 'Grade 12 Natural Science candidate preparing for national higher education entrance examination.',
        notesCompleted: ['note-phys-11-u1', 'note-math-12-u2', 'note-chem-10-u3', 'note-it-11-u1'],
        bookmarks: ['note-phys-11-u1', 'note-math-12-u2'],
        badges: ['Welcome Scholar', 'First Exam Completed', 'Excellence Distinction', 'Reading Champion', 'Honor Roll Scholar'],
        certificates: [
          {
            id: 'cert-phys-11-001',
            studentName: 'Eyoel T. Bekele',
            subjectName: 'Physics (Grade 11)',
            grade: 'Grade 11',
            issueDate: new Date().toLocaleDateString(),
            scorePercentage: 100,
            certificateNumber: 'EYOEL-PHYS-98421',
            distinction: 'First Class Honors',
          },
          {
            id: 'cert-math-12-002',
            studentName: 'Eyoel T. Bekele',
            subjectName: 'Mathematics (Grade 12)',
            grade: 'Grade 12',
            issueDate: new Date().toLocaleDateString(),
            scorePercentage: 95,
            certificateNumber: 'EYOEL-MATH-44120',
            distinction: 'First Class Honors',
          },
        ],
        totalScore: 40,
        quizCount: 2,
      };

      onLogin(demoUser);
      setSuccessMessage('Logged in as Demo Natural Science Scholar!');
      setTimeout(() => {
        setLoading(false);
        onClose();
      }, 500);
    } catch (e: any) {
      setLoading(false);
      setErrorMessage('Could not load demo account.');
    }
  };

  const handleAdminDemoLogin = async () => {
    setLoading(true);
    setErrorMessage('');
    try {
      const adminUser: StudentUser = {
        id: 'admin-lead-eyoel-001',
        name: 'Academy Administrator',
        email: ADMIN_EMAIL,
        grade: 'Grade 12',
        stream: 'Natural Science',
        role: 'admin',
        avatar: '🛡️',
        targetScore: 600,
        studyStreakDays: 30,
        joinedDate: 'Jan 2024',
        bio: 'Lead Curriculum Director & Administrator for Eyoel Academy Grade 9–12.',
        notesCompleted: ['note-phys-11-u1', 'note-math-12-u2', 'note-chem-10-u3'],
        bookmarks: [],
        badges: ['Welcome Scholar', 'Staff Lead', 'Honor Roll Scholar'],
        certificates: [],
        totalScore: 100,
        quizCount: 5,
      };
      onLogin(adminUser);
      setSuccessMessage('Logged in as Administrator with Full Portal Privileges!');
      setTimeout(() => {
        setLoading(false);
        onClose();
      }, 500);
    } catch (e: any) {
      setLoading(false);
      setErrorMessage('Could not load admin account.');
    }
  };

  const handleSignOut = async () => {
    try {
      await logoutStudent();
    } catch (e) {
      console.warn('Firebase signout error:', e);
    }
    onLogout();
    setSuccessMessage('Logged out successfully.');
    setTimeout(() => {
      onClose();
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-[#111112] rounded-3xl max-w-md w-full border border-[#2D2D30] p-6 sm:p-8 space-y-6 shadow-2xl relative my-8 text-white">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#2D2D30]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#C5A059] flex items-center justify-center text-black font-serif font-bold text-xl">
              E
            </div>
            <div>
              <h2 className="text-xl font-serif font-bold text-white">
                {currentUser ? 'Student Account' : (isSignUp ? 'Create Student Account' : 'Student Portal Sign In')}
              </h2>
              <span className="text-xs text-slate-400">
                Grade 9–12 Academic Excellence Platform
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {currentUser ? (
          /* Logged In View */
          <div className="space-y-5">
            <div className="p-4 rounded-2xl bg-[#1A1A1C] border border-[#2D2D30] flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-[#C5A059]/20 border border-[#C5A059] flex items-center justify-center text-3xl">
                {currentUser.avatar || '🎓'}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-base font-bold text-white block truncate">{currentUser.name}</span>
                  {currentUser.role === 'admin' && (
                    <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-amber-500/20 text-[#C5A059] border border-[#C5A059]/40 uppercase">
                      ADMIN
                    </span>
                  )}
                </div>
                <span className="text-xs text-slate-400 block truncate">{currentUser.email}</span>
                <div className="flex items-center gap-2 mt-1">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#C5A059] text-black uppercase">
                    {currentUser.grade}
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-[#2D2D30] text-slate-300">
                    {currentUser.stream}
                  </span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2.5 text-xs text-center">
              <div className="p-3 rounded-xl bg-[#161618] border border-[#2D2D30]">
                <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Target</span>
                <span className="text-base font-bold text-[#C5A059]">{currentUser.targetScore || 580}/600</span>
              </div>
              <div className="p-3 rounded-xl bg-[#161618] border border-[#2D2D30]">
                <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Lessons</span>
                <span className="text-base font-bold text-white">{(currentUser.notesCompleted || []).length}</span>
              </div>
              <div className="p-3 rounded-xl bg-[#161618] border border-[#2D2D30]">
                <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Streak</span>
                <span className="text-base font-bold text-emerald-400">🔥 {currentUser.studyStreakDays || 1}d</span>
              </div>
            </div>

            <div className="pt-2 flex gap-3">
              <button
                onClick={handleSignOut}
                className="w-full py-3 rounded-full border border-rose-500/40 hover:bg-rose-500/10 text-rose-400 font-bold text-xs uppercase tracking-wider transition-colors"
              >
                Sign Out
              </button>
            </div>
          </div>
        ) : (
          /* Sign In / Sign Up Form */
          <div className="space-y-4">
            {errorMessage && (
              <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-800 text-rose-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                {errorMessage}
              </div>
            )}
            {successMessage && (
              <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-800 text-emerald-300 text-xs flex items-center gap-2">
                <CheckCircle className="w-4 h-4 shrink-0" />
                {successMessage}
              </div>
            )}

            {/* Google One-Click Sign In Button */}
            <button
              type="button"
              onClick={handleGoogleAuth}
              disabled={googleLoading || loading}
              className="w-full py-3 px-4 rounded-2xl bg-white hover:bg-slate-100 text-slate-900 font-semibold text-xs sm:text-sm flex items-center justify-center gap-3 transition-all shadow-md hover:shadow-lg disabled:opacity-60 relative group"
            >
              {googleLoading ? (
                <Loader2 className="w-4 h-4 animate-spin text-slate-800" />
              ) : (
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
              )}
              <span>Continue with Google (ወደ ጉግል ይቀጥሉ)</span>
            </button>

            {/* Divider */}
            <div className="flex items-center gap-3 my-3">
              <div className="flex-1 h-px bg-[#2D2D30]" />
              <span className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold">
                Or with Student Email
              </span>
              <div className="flex-1 h-px bg-[#2D2D30]" />
            </div>

            <form onSubmit={handleSubmit} className="space-y-3.5">
              {isSignUp && (
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                    Full Student Name
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Eyoel T. Bekele"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#1A1A1C] border border-[#2D2D30] text-white text-xs focus:outline-none focus:border-[#C5A059]"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="student@eyoelacademy.com"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#1A1A1C] border border-[#2D2D30] text-white text-xs focus:outline-none focus:border-[#C5A059]"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                    Password
                  </label>
                  {!isSignUp && (
                    <button
                      type="button"
                      onClick={() => setShowForgot(true)}
                      className="text-[11px] font-semibold text-[#C5A059] hover:underline"
                    >
                      Forgot password?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-[#1A1A1C] border border-[#2D2D30] text-white text-xs focus:outline-none focus:border-[#C5A059]"
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

              {/* Remember Me Checkbox */}
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-3.5 h-3.5 rounded border-[#2D2D30] bg-[#1A1A1C] text-[#C5A059] accent-[#C5A059]"
                  />
                  <span className="text-xs text-slate-400">Remember me</span>
                </label>
              </div>

              {isSignUp && (
                <>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                        Grade Level
                      </label>
                      <select
                        value={grade}
                        onChange={(e) => setGrade(e.target.value as GradeLevel)}
                        className="w-full px-3 py-2.5 rounded-xl bg-[#1A1A1C] border border-[#2D2D30] text-white text-xs focus:outline-none focus:border-[#C5A059]"
                      >
                        <option value="Grade 9">Grade 9</option>
                        <option value="Grade 10">Grade 10</option>
                        <option value="Grade 11">Grade 11</option>
                        <option value="Grade 12">Grade 12</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                        Stream
                      </label>
                      <select
                        value={stream}
                        onChange={(e) => setStream(e.target.value as SubjectStream)}
                        className="w-full px-3 py-2.5 rounded-xl bg-[#1A1A1C] border border-[#2D2D30] text-white text-xs focus:outline-none focus:border-[#C5A059]"
                      >
                        <option value="Natural Science">Natural Science</option>
                        <option value="Social Science">Social Science</option>
                        <option value="General">General Secondary</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                      Select Avatar
                    </label>
                    <div className="flex gap-2 justify-between">
                      {AVATAR_OPTIONS.map((av) => (
                        <button
                          key={av}
                          type="button"
                          onClick={() => setAvatar(av)}
                          className={`w-9 h-9 rounded-xl flex items-center justify-center text-lg transition-all ${
                            avatar === av
                              ? 'bg-[#C5A059] text-black ring-2 ring-[#C5A059]'
                              : 'bg-[#1A1A1C] border border-[#2D2D30] hover:border-slate-500'
                          }`}
                        >
                          {av}
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              )}

              <button
                type="submit"
                disabled={loading || googleLoading}
                className="w-full py-3 rounded-full bg-[#C5A059] hover:bg-[#d8b168] text-black font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-[#C5A059]/10 transition-colors disabled:opacity-50"
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    {isSignUp ? 'Create Student Account' : 'Sign In to Portal'}
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              {/* Toggle Sign In / Sign Up */}
              <div className="text-center pt-1">
                <button
                  type="button"
                  onClick={() => {
                    setIsSignUp(!isSignUp);
                    setErrorMessage('');
                  }}
                  className="text-xs text-[#C5A059] hover:underline font-medium"
                >
                  {isSignUp
                    ? 'Already registered? Sign in here'
                    : "New student? Create your account"}
                </button>
              </div>
            </form>

            {/* Quick Demo Access */}
            <div className="pt-4 border-t border-[#2D2D30] space-y-2">
              <span className="block text-[10px] text-slate-400 uppercase tracking-wider text-center mb-1">
                Instant One-Click Demo Access:
              </span>
              <button
                type="button"
                onClick={() => handleDemoLogin('Grade 12', 'Natural Science')}
                className="w-full py-2.5 px-3 rounded-xl bg-[#161618] border border-[#2D2D30] hover:border-[#C5A059] text-slate-200 text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#C5A059]" />
                Explore as Student (Grade 12 Scholar)
              </button>
              <button
                type="button"
                onClick={handleAdminDemoLogin}
                className="w-full py-2 px-3 rounded-xl bg-[#161618] border border-[#2D2D30] hover:border-amber-500 text-amber-300 text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
              >
                🛡️ Explore as Admin (Curriculum Director)
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Forgot Password Modal */}
      {showForgot && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-2xl bg-[#141418] border border-[#2D2D32] p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#2D2D32] pb-3">
              <div className="flex items-center gap-2">
                <KeyRound className="w-4 h-4 text-[#C5A059]" />
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">Reset Password</h3>
              </div>
              <button
                onClick={() => {
                  setShowForgot(false);
                  setForgotSuccess(false);
                  setForgotError('');
                }}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            {forgotSuccess ? (
              <div className="space-y-4 text-center py-2">
                <div className="w-10 h-10 rounded-full bg-emerald-950 border border-emerald-600 text-emerald-400 flex items-center justify-center mx-auto">
                  ✓
                </div>
                <p className="text-xs text-slate-300">
                  Password reset link sent to {forgotEmail}. Please check your inbox.
                </p>
                <button
                  type="button"
                  onClick={() => setShowForgot(false)}
                  className="w-full py-2 rounded-xl bg-[#C5A059] text-black font-bold text-xs uppercase"
                >
                  Close
                </button>
              </div>
            ) : (
              <form onSubmit={handleForgotPassword} className="space-y-3">
                <p className="text-xs text-slate-400">
                  Enter your registered email address to receive password reset instructions.
                </p>
                {forgotError && (
                  <div className="p-2 rounded bg-rose-950 border border-rose-800 text-rose-300 text-xs">
                    {forgotError}
                  </div>
                )}
                <div>
                  <input
                    type="email"
                    required
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    placeholder="student@example.com"
                    className="w-full px-3 py-2 bg-[#1A1A1E] border border-[#2D2D32] rounded-xl text-xs text-white focus:outline-none focus:border-[#C5A059]"
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setShowForgot(false)}
                    className="flex-1 py-2 rounded-xl bg-[#1A1A1E] text-slate-300 font-bold text-xs"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={forgotLoading}
                    className="flex-1 py-2 rounded-xl bg-[#C5A059] text-black font-bold text-xs disabled:opacity-50"
                  >
                    {forgotLoading ? 'Sending...' : 'Send Link'}
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
