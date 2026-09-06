import React, { useState, useEffect } from 'react';
import { GradeLevel, ViewTab, QuizAttempt, StudentUser, CertificateRecord, NoteChapter, Quiz, Subject, Language } from './types';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { Home } from './components/Home';
import { SubjectsView } from './components/SubjectsView';
import { NotesView } from './components/NotesView';
import { QuizView } from './components/QuizView';
import { ContactView } from './components/ContactView';
import { AboutView } from './components/AboutView';
import { GlobalSearchModal } from './components/GlobalSearchModal';
import { ProgressDashboardModal } from './components/ProgressDashboardModal';
import { FlashcardsModal } from './components/FlashcardsModal';
import { AuthModal } from './components/AuthModal';
import { LoginPage } from './components/LoginPage';
import { DashboardView } from './components/DashboardView';
import { AITutorModal } from './components/AITutorModal';
import { CertificateModal } from './components/CertificateModal';
import { AdminModal } from './components/AdminModal';
import { MobileBottomNav } from './components/MobileBottomNav';
import { ReportCardView } from './components/ReportCardView';
import { VerificationView } from './components/VerificationView';
import { NotificationsModal } from './components/NotificationsModal';
import { StudyPlannerView } from './components/StudyPlannerView';
import { LeaderboardView } from './components/LeaderboardView';
import { TeacherPortalView } from './components/TeacherPortalView';
import { CommunicationCenterView } from './components/CommunicationCenterView';
import { AnalyticsDashboardView } from './components/AnalyticsDashboardView';
import { SAMPLE_NOTES } from './data/notesData';
import { SAMPLE_QUIZZES } from './data/quizzesData';
import { SUBJECTS } from './data/gradesAndSubjects';
import {
  subscribeToAuth,
  seedCurriculumIfEmpty,
  fetchFirestoreNotes,
  fetchFirestoreQuizzes,
  fetchFirestoreSubjects,
  fetchUserQuizAttempts,
  saveQuizAttemptToFirestore,
  toggleNoteCompletionInFirestore,
  toggleBookmarkInFirestore,
  updateUserProfile,
  logStudyMinutesToFirestore,
} from './lib/firebase';

export default function App() {
  // Navigation State
  const [currentTab, setCurrentTab] = useState<ViewTab>('home');
  const [selectedGrade, setSelectedGrade] = useState<GradeLevel | 'All'>('All');
  const [selectedSubjectFilter, setSelectedSubjectFilter] = useState<string>('All');

  // Multi-Language State (English, Amharic, Afaan Oromoo)
  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem('eyoel_language') as Language;
    if (saved === 'en' || saved === 'am' || saved === 'om') {
      return saved;
    }
    return 'en';
  });

  useEffect(() => {
    localStorage.setItem('eyoel_language', language);
  }, [language]);

  // Dynamic Curriculum State (Synchronized with Firestore)
  const [subjects, setSubjects] = useState<Subject[]>(SUBJECTS);
  const [notes, setNotes] = useState<NoteChapter[]>(SAMPLE_NOTES);
  const [quizzes, setQuizzes] = useState<Quiz[]>(SAMPLE_QUIZZES);

  // Theme State
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem('eyoel_dark_mode');
    if (saved !== null) {
      try {
        return JSON.parse(saved);
      } catch {
        return true;
      }
    }
    return true; // Default to luxury dark
  });

  // Student User Profile State
  const [currentUser, setCurrentUser] = useState<StudentUser | null>(null);

  // Bookmarks State
  const [bookmarks, setBookmarks] = useState<string[]>(['note-phys-11-u1', 'note-math-12-u2']);

  // Quiz Attempts History
  const [quizAttempts, setQuizAttempts] = useState<QuizAttempt[]>([]);

  // Modals
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isDashboardOpen, setIsDashboardOpen] = useState(false);
  const [isFlashcardsOpen, setIsFlashcardsOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isAITutorOpen, setIsAITutorOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [viewingCertificate, setViewingCertificate] = useState<CertificateRecord | null>(null);

  // In-App Notifications State
  const [notifications, setNotifications] = useState<any[]>(() => {
    const saved = localStorage.getItem('eyoel_notifications');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // fallback
      }
    }
    return [
      {
        id: 'notif-1',
        title: 'Grade 12 National Exam Simulations Live',
        message: 'Comprehensive 20-question practice test banks available across Mathematics, Physics, Biology, and Chemistry.',
        date: 'Just now',
        type: 'exam',
        read: false,
        linkTab: 'quizzes',
      },
      {
        id: 'notif-2',
        title: 'New Subject Added: Health & Physical Education (HPE)',
        message: 'Curriculum modules for Grades 9-12 are now uploaded with full workout science, nutrition, and unit assessments.',
        date: '3 hours ago',
        type: 'lesson',
        read: false,
        linkTab: 'subjects',
      },
      {
        id: 'notif-3',
        title: 'Afaan Oromoo & Amharic Language Tracks Ready',
        message: 'Explore regional language study notes, vocabulary builders, and Ethiopian literary passages.',
        date: '1 day ago',
        type: 'lesson',
        read: true,
        linkTab: 'notes',
      },
      {
        id: 'notif-4',
        title: 'Official Academic Verification Portal Deployed',
        message: 'Third parties and institutions can verify your accredited certificates and report cards instantly.',
        date: '2 days ago',
        type: 'certificate',
        read: true,
        linkTab: 'verify-certificate',
      },
    ];
  });

  useEffect(() => {
    localStorage.setItem('eyoel_notifications', JSON.stringify(notifications));
  }, [notifications]);

  const handleMarkNotificationAsRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  const handleMarkAllNotificationsAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const handleClearAllNotifications = () => {
    setNotifications([]);
  };

  const unreadNotificationsCount = notifications.filter((n) => !n.read).length;

  // Apply Dark Mode Class to HTML document root
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      document.body.style.backgroundColor = '#0A0A0B';
      document.body.style.color = '#F3F4F6';
    } else {
      document.documentElement.classList.remove('dark');
      document.body.style.backgroundColor = '#F9FAFB';
      document.body.style.color = '#111827';
    }
    localStorage.setItem('eyoel_dark_mode', JSON.stringify(darkMode));
  }, [darkMode]);

  // Initialize Firestore Curriculum and Auth Subscription
  useEffect(() => {
    let unsubscribeAuth: (() => void) | null = null;

    const initializeApp = async () => {
      try {
        // Seed Firestore if first-time deployment
        await seedCurriculumIfEmpty(SUBJECTS, SAMPLE_NOTES, SAMPLE_QUIZZES);

        // Fetch curriculum records from Firestore
        const [fsSubjects, fsNotes, fsQuizzes] = await Promise.all([
          fetchFirestoreSubjects(),
          fetchFirestoreNotes(),
          fetchFirestoreQuizzes(),
        ]);

        if (fsSubjects.length > 0) setSubjects(fsSubjects);
        if (fsNotes.length > 0) setNotes(fsNotes);
        if (fsQuizzes.length > 0) setQuizzes(fsQuizzes);
      } catch (err) {
        console.warn('Could not fetch from Firestore, utilizing in-memory curriculum cache:', err);
      }

      // Listen for Firebase Auth user
      unsubscribeAuth = subscribeToAuth(async (student) => {
        setCurrentUser(student);
        if (student) {
          if (student.bookmarks && Array.isArray(student.bookmarks)) {
            setBookmarks(student.bookmarks);
          }
          // Fetch student's specific quiz attempts
          try {
            const userAttempts = await fetchUserQuizAttempts(student.id);
            setQuizAttempts(userAttempts);
          } catch (e) {
            console.warn('Error fetching quiz history:', e);
          }
        }
      });
    };

    initializeApp();

    return () => {
      if (unsubscribeAuth) unsubscribeAuth();
    };
  }, []);

  // Keyboard shortcut Cmd+K / Ctrl+K for search modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Theme Toggle Handler
  const handleToggleDarkMode = () => setDarkMode((prev) => !prev);

  // Bookmark Toggle Handler (Synchronized with Firestore)
  const handleToggleBookmark = async (noteId: string) => {
    const isBookmarked = bookmarks.includes(noteId);
    const updated = isBookmarked ? bookmarks.filter((id) => id !== noteId) : [...bookmarks, noteId];
    setBookmarks(updated);

    if (currentUser) {
      try {
        await toggleBookmarkInFirestore(currentUser.id, noteId, isBookmarked);
        setCurrentUser((prev) => prev ? { ...prev, bookmarks: updated } : null);
      } catch (e) {
        console.warn('Failed to sync bookmark to Firestore:', e);
      }
    }
  };

  // Lesson Completion Toggle Handler (Synchronized with Firestore)
  const handleToggleNoteCompletion = async (noteId: string) => {
    const currentCompleted = currentUser?.notesCompleted || [];
    const isCompleted = currentCompleted.includes(noteId);
    const updatedCompleted = isCompleted
      ? currentCompleted.filter((id) => id !== noteId)
      : [...currentCompleted, noteId];

    if (currentUser) {
      setCurrentUser({ ...currentUser, notesCompleted: updatedCompleted });
      try {
        await toggleNoteCompletionInFirestore(currentUser.id, noteId, isCompleted);
      } catch (e) {
        console.warn('Failed to sync note completion to Firestore:', e);
      }
    } else {
      // Demo state for guest user
      setCurrentUser((prev) => {
        if (!prev) {
          return {
            id: 'guest-student',
            name: 'Scholar Student',
            email: 'scholar@eyoelacademy.com',
            grade: 'Grade 12',
            stream: 'Natural Science',
            role: 'student',
            avatar: '🎓',
            targetScore: 580,
            studyStreakDays: 1,
            joinedDate: 'Aug 2024',
            bio: 'Grade 12 candidate.',
            notesCompleted: updatedCompleted,
            bookmarks: bookmarks,
            badges: ['Welcome Scholar', 'Reading Champion'],
            certificates: [],
            totalScore: 0,
            quizCount: 0,
          };
        }
        return { ...prev, notesCompleted: updatedCompleted };
      });
    }
  };

  // Save Quiz Attempt & Award Certificates
  const handleSaveQuizAttempt = async (attempt: QuizAttempt) => {
    const fullAttempt: QuizAttempt = {
      ...attempt,
      userId: currentUser?.id || 'guest-student',
      studentEmail: currentUser?.email || 'scholar@eyoelacademy.com',
    };

    setQuizAttempts((prev) => [fullAttempt, ...prev]);

    // If scored >= 70%, grant academic certificate to the student profile
    let newCert: CertificateRecord | null = null;
    if (fullAttempt.percentage >= 70) {
      newCert = {
        id: `cert-${fullAttempt.id}`,
        studentName: currentUser?.name || 'Scholar Student',
        subjectName: `${fullAttempt.subjectName} (${fullAttempt.grade})`,
        grade: fullAttempt.grade,
        issueDate: fullAttempt.date,
        scorePercentage: fullAttempt.percentage,
        certificateNumber: `EYOEL-${fullAttempt.subjectName.substring(0, 3).toUpperCase()}-${Math.floor(10000 + Math.random() * 90000)}`,
        distinction:
          fullAttempt.percentage >= 90
            ? 'First Class Honors'
            : fullAttempt.percentage >= 80
            ? 'Excellence Distinction'
            : 'Proficiency Pass',
      };
    }

    if (currentUser) {
      const existingCerts = currentUser.certificates || [];
      const updatedCerts = newCert
        ? [newCert, ...existingCerts.filter((c) => c.subjectName !== newCert?.subjectName)]
        : existingCerts;

      const updatedUser: StudentUser = {
        ...currentUser,
        totalScore: (currentUser.totalScore || 0) + fullAttempt.score,
        quizCount: (currentUser.quizCount || 0) + 1,
        certificates: updatedCerts,
      };

      setCurrentUser(updatedUser);

      try {
        await saveQuizAttemptToFirestore(fullAttempt, currentUser);
        await updateUserProfile(currentUser.id, {
          totalScore: updatedUser.totalScore,
          quizCount: updatedUser.quizCount,
          certificates: updatedCerts,
        });
      } catch (err) {
        console.warn('Could not persist quiz attempt to Firestore:', err);
      }
    }
  };

  // Student Profile Update
  const handleUpdateProfile = async (updated: Partial<StudentUser>) => {
    if (currentUser) {
      const merged = { ...currentUser, ...updated };
      setCurrentUser(merged);
      try {
        await updateUserProfile(currentUser.id, updated);
      } catch (err) {
        console.warn('Error saving profile to Firestore:', err);
      }
    } else {
      const newUser: StudentUser = {
        id: `student-${Date.now()}`,
        name: updated.name || 'Scholar Student',
        email: 'scholar@eyoelacademy.com',
        grade: updated.grade || 'Grade 12',
        stream: updated.stream || 'Natural Science',
        role: 'student',
        avatar: '🎓',
        targetScore: updated.targetScore || 580,
        studyStreakDays: 1,
        joinedDate: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
        bio: updated.bio || 'Eyoel Endale Belete Student',
        notesCompleted: [],
        bookmarks: [],
        badges: ['Welcome Scholar'],
        certificates: [],
        totalScore: 0,
        quizCount: 0,
      };
      setCurrentUser(newUser);
    }
  };

  // Direct certificate claim & save
  const handleSaveCertificate = async (cert: CertificateRecord) => {
    if (currentUser) {
      const existingCerts = currentUser.certificates || [];
      const updatedCerts = [cert, ...existingCerts.filter((c) => c.id !== cert.id && c.certificateNumber !== cert.certificateNumber)];
      const updatedUser: StudentUser = {
        ...currentUser,
        certificates: updatedCerts,
      };
      setCurrentUser(updatedUser);
      try {
        await updateUserProfile(currentUser.id, { certificates: updatedCerts });
      } catch (err) {
        console.warn('Error saving certificate to profile:', err);
      }
    }
  };

  const handleOpenCertificateStudio = (cert?: CertificateRecord) => {
    if (cert) {
      setViewingCertificate(cert);
    } else if (currentUser?.certificates && currentUser.certificates.length > 0) {
      setViewingCertificate(currentUser.certificates[0]);
    } else {
      setViewingCertificate({
        id: `cert-${Date.now()}`,
        studentName: currentUser?.name || 'Scholar Student',
        subjectName: selectedSubjectFilter !== 'All' ? selectedSubjectFilter : 'Mathematics (Grade 12)',
        grade: selectedGrade !== 'All' ? selectedGrade : 'Grade 12',
        issueDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        scorePercentage: 95,
        certificateNumber: `EYOEL-HONOR-${Math.floor(10000 + Math.random() * 90000)}`,
        distinction: 'First Class Honors',
      });
    }
  };

  // Pomodoro Focus Session logging
  const handleLogFocusMinutes = async (sessionMinutes: number, subject?: string) => {
    if (currentUser) {
      const updated = await logStudyMinutesToFirestore(currentUser.id, sessionMinutes, currentUser);
      setCurrentUser(updated);
    } else {
      // Guest local storage session tracking
      const guestKey = 'eyoel_guest_focus_minutes';
      const prevMin = parseInt(localStorage.getItem(guestKey) || '0', 10);
      const newTotal = prevMin + sessionMinutes;
      localStorage.setItem(guestKey, newTotal.toString());
    }
  };

  // Admin Curriculum Mutations (Synchronized with State)
  const handleSaveNote = (savedNote: NoteChapter) => {
    setNotes((prev) => {
      const idx = prev.findIndex((n) => n.id === savedNote.id);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = savedNote;
        return next;
      }
      return [savedNote, ...prev];
    });
  };

  const handleDeleteNote = (noteId: string) => {
    setNotes((prev) => prev.filter((n) => n.id !== noteId));
  };

  const handleSaveQuiz = (savedQuiz: Quiz) => {
    setQuizzes((prev) => {
      const idx = prev.findIndex((q) => q.id === savedQuiz.id);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = savedQuiz;
        return next;
      }
      return [savedQuiz, ...prev];
    });
  };

  const handleDeleteQuiz = (quizId: string) => {
    setQuizzes((prev) => prev.filter((q) => q.id !== quizId));
  };

  const handleSaveSubject = (savedSubject: Subject) => {
    setSubjects((prev) => {
      const idx = prev.findIndex((s) => s.id === savedSubject.id);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = savedSubject;
        return next;
      }
      return [...prev, savedSubject];
    });
  };

  const handleDeleteSubject = (subjectId: string) => {
    setSubjects((prev) => prev.filter((s) => s.id !== subjectId));
  };

  const handleSelectSubjectForNotes = (subjectName: string) => {
    setSelectedSubjectFilter(subjectName);
    setCurrentTab('notes');
  };

  const handleSelectSubjectForQuiz = (subjectName: string) => {
    setSelectedSubjectFilter(subjectName);
    setCurrentTab('quizzes');
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#0A0A0B] text-slate-100 font-sans selection:bg-[#C5A059] selection:text-black transition-colors duration-200 pb-16 md:pb-0">
      
      {/* Top Header Navigation */}
      <Header
        currentTab={currentTab}
        onTabChange={setCurrentTab}
        language={language}
        onLanguageChange={setLanguage}
        darkMode={darkMode}
        onToggleDarkMode={handleToggleDarkMode}
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenDashboard={() => setIsDashboardOpen(true)}
        onOpenFlashcards={() => setIsFlashcardsOpen(true)}
        onOpenAITutor={() => setIsAITutorOpen(true)}
        onOpenAuth={() => setIsAuthOpen(true)}
        currentUser={currentUser}
        bookmarkCount={bookmarks.length}
        completedQuizCount={quizAttempts.length}
        onOpenAdmin={() => setIsAdminOpen(true)}
        onOpenNotifications={() => setIsNotificationsOpen(true)}
        unreadNotificationsCount={unreadNotificationsCount}
        onLogFocusMinutes={handleLogFocusMinutes}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {currentTab === 'home' && (
          <Home
            language={language}
            onTabChange={setCurrentTab}
            onGradeSelect={(grade) => {
              setSelectedGrade(grade);
              setCurrentTab('notes');
            }}
            onOpenFlashcards={() => setIsFlashcardsOpen(true)}
            onOpenCertificate={() => handleOpenCertificateStudio()}
            currentUser={currentUser}
            onOpenAuth={() => setIsAuthOpen(true)}
            onOpenDashboard={() => setCurrentTab('dashboard')}
            onOpenAITutor={() => setIsAITutorOpen(true)}
            onLoginUser={(user) => setCurrentUser(user)}
          />
        )}

        {currentTab === 'subjects' && (
          currentUser ? (
            <SubjectsView
              language={language}
              selectedGrade={selectedGrade}
              onGradeChange={setSelectedGrade}
              onTabChange={setCurrentTab}
              onSelectSubjectForNotes={handleSelectSubjectForNotes}
              onSelectSubjectForQuiz={handleSelectSubjectForQuiz}
            />
          ) : (
            <LoginPage
              language={language}
              initialMode="signin"
              intendedTab="subjects"
              authNotice={
                language === 'am'
                  ? 'የትምህርት አይነቶችንና የክፍል መመሪያዎችን ለመመልከት እባክዎ መጀመሪያ ይግቡ (Sign In) ወይም አካውንት ይክፈቱ (Create Account)።'
                  : language === 'om'
                  ? 'Barnootaafi qajeelfama kutaa ilaaluuf dura seenaa (Sign In) yookiin galmaa\'aa (Create Account).'
                  : 'Please Sign In or Create an Account to access curriculum subjects, textbooks, and unit outlines.'
              }
              onLoginSuccess={(user) => {
                setCurrentUser(user);
              }}
              onTabChange={setCurrentTab}
            />
          )
        )}

        {currentTab === 'notes' && (
          currentUser ? (
            <NotesView
              language={language}
              selectedGrade={selectedGrade}
              onGradeChange={setSelectedGrade}
              selectedSubjectFilter={selectedSubjectFilter}
              onSubjectFilterChange={setSelectedSubjectFilter}
              bookmarks={bookmarks}
              onToggleBookmark={handleToggleBookmark}
              onTabChange={setCurrentTab}
              onSelectSubjectForQuiz={handleSelectSubjectForQuiz}
              notes={notes}
              completedNotes={currentUser?.notesCompleted || []}
              onToggleNoteCompletion={handleToggleNoteCompletion}
            />
          ) : (
            <LoginPage
              language={language}
              initialMode="signin"
              intendedTab="notes"
              authNotice={
                language === 'am'
                  ? 'የትምህርት ማጠቃለያ ማስታወሻዎችን (Study Notes) ለማንበብ እባክዎ መጀመሪያ ይግቡ (Sign In) ወይም ይመዝገቡ።'
                  : language === 'om'
                  ? 'Yaadannoo qo\'annoo (Study Notes) dubbisuuf dura seenaa yookiin galmaa\'aa.'
                  : 'Please Sign In or Create an Account to read unit notes, chapter summaries, and PDF materials.'
              }
              onLoginSuccess={(user) => {
                setCurrentUser(user);
              }}
              onTabChange={setCurrentTab}
            />
          )
        )}

        {currentTab === 'quizzes' && (
          currentUser ? (
            <QuizView
              language={language}
              selectedGrade={selectedGrade}
              onGradeChange={setSelectedGrade}
              selectedSubjectFilter={selectedSubjectFilter}
              onSubjectFilterChange={setSelectedSubjectFilter}
              onSaveQuizAttempt={handleSaveQuizAttempt}
              onTabChange={setCurrentTab}
              quizzes={quizzes}
              currentUser={currentUser}
              onViewCertificate={(cert) => setViewingCertificate(cert)}
            />
          ) : (
            <LoginPage
              language={language}
              initialMode="signin"
              intendedTab="quizzes"
              authNotice={
                language === 'am'
                  ? 'የብሔራዊ ፈተና ጥያቄዎችንና የ20 ጥያቄዎች ፈተናዎችን ለመውሰድ እባክዎ መጀመሪያ ይግቡ ወይም ይመዝገቡ።'
                  : language === 'om'
                  ? 'Gaaffilee qorumsa biyyaalessaafi qorumsa gaaffilee 20 fudhachuuf dura seenaa yookiin galmaa\'aa.'
                  : 'Please Sign In or Create an Account to take timed quizzes, national exam simulators, and earn certificates.'
              }
              onLoginSuccess={(user) => {
                setCurrentUser(user);
              }}
              onTabChange={setCurrentTab}
            />
          )
        )}

        {currentTab === 'report-card' && (
          <ReportCardView
            language={language}
            currentUser={currentUser}
            quizAttempts={quizAttempts}
            onTabChange={setCurrentTab}
            onOpenCertificateModal={() => handleOpenCertificateStudio()}
          />
        )}

        {currentTab === 'planner' && (
          <StudyPlannerView
            language={language}
            currentUser={currentUser}
            onUpdateProfile={handleUpdateProfile}
            onOpenAITutor={() => setIsAITutorOpen(true)}
          />
        )}

        {currentTab === 'leaderboard' && (
          <LeaderboardView
            currentUser={currentUser}
            quizAttempts={quizAttempts}
            notes={notes}
            language={language}
            onTabChange={setCurrentTab}
            onOpenCertificateStudio={() => handleOpenCertificateStudio()}
          />
        )}

        {currentTab === 'analytics' && (
          <AnalyticsDashboardView
            currentUser={currentUser}
            quizAttempts={quizAttempts}
            notes={notes}
            quizzes={quizzes}
            language={language}
            onSelectSubjectNote={(subName) => {
              setSelectedSubjectFilter(subName);
              setCurrentTab('notes');
            }}
            onSelectQuiz={() => {
              setCurrentTab('quizzes');
            }}
            onOpenAITutor={() => setIsAITutorOpen(true)}
          />
        )}

        {currentTab === 'teacher' && (
          <TeacherPortalView
            currentUser={currentUser}
            quizAttempts={quizAttempts}
            notes={notes}
            quizzes={quizzes}
            subjects={subjects}
            language={language}
            onSaveNote={handleSaveNote}
            onSaveQuiz={handleSaveQuiz}
            onTabChange={setCurrentTab}
          />
        )}

        {currentTab === 'messages' && (
          <CommunicationCenterView
            currentUser={currentUser}
            language={language}
          />
        )}

        {currentTab === 'offline' && (
          <NotesView
            language={language}
            selectedGrade={selectedGrade}
            onGradeChange={setSelectedGrade}
            selectedSubjectFilter={selectedSubjectFilter}
            onSubjectFilterChange={setSelectedSubjectFilter}
            bookmarks={bookmarks}
            onToggleBookmark={handleToggleBookmark}
            onTabChange={setCurrentTab}
            onSelectSubjectForQuiz={handleSelectSubjectForQuiz}
            notes={notes}
            completedNotes={currentUser?.notesCompleted || []}
            onToggleNoteCompletion={handleToggleNoteCompletion}
          />
        )}

        {currentTab === 'about' && (
          <AboutView language={language} onTabChange={setCurrentTab} />
        )}

        {currentTab === 'contact' && <ContactView language={language} />}

        {currentTab === 'verify-certificate' && (
          <VerificationView
            language={language}
            onTabChange={setCurrentTab}
            defaultMode="certificate"
          />
        )}

        {currentTab === 'verify-report-card' && (
          <VerificationView
            language={language}
            onTabChange={setCurrentTab}
            defaultMode="report-card"
          />
        )}

        {currentTab === 'login' && (
          <LoginPage
            language={language}
            initialMode="signin"
            onLoginSuccess={(user) => {
              setCurrentUser(user);
            }}
            onTabChange={setCurrentTab}
          />
        )}

        {currentTab === 'register' && (
          <LoginPage
            language={language}
            initialMode="signup"
            onLoginSuccess={(user) => {
              setCurrentUser(user);
            }}
            onTabChange={setCurrentTab}
          />
        )}

        {currentTab === 'forgot-password' && (
          <LoginPage
            language={language}
            initialMode="forgot"
            onLoginSuccess={(user) => {
              setCurrentUser(user);
            }}
            onTabChange={setCurrentTab}
          />
        )}

        {currentTab === 'dashboard' && (
          currentUser ? (
            <DashboardView
              currentUser={currentUser}
              language={language}
              onLanguageChange={setLanguage}
              darkMode={darkMode}
              onToggleDarkMode={handleToggleDarkMode}
              onTabChange={setCurrentTab}
              subjects={subjects}
              notes={notes}
              quizzes={quizzes}
              quizAttempts={quizAttempts}
              bookmarks={bookmarks}
              onUpdateProfile={handleUpdateProfile}
              onSelectSubjectForNotes={handleSelectSubjectForNotes}
              onSelectSubjectForQuiz={handleSelectSubjectForQuiz}
              onViewCertificate={(cert) => setViewingCertificate(cert)}
              onOpenCertificateStudio={() => handleOpenCertificateStudio()}
              onOpenAITutor={() => setIsAITutorOpen(true)}
              onOpenFlashcards={() => setIsFlashcardsOpen(true)}
            />
          ) : (
            <LoginPage
              language={language}
              initialMode="signin"
              onLoginSuccess={(user) => {
                setCurrentUser(user);
              }}
              onTabChange={setCurrentTab}
            />
          )
        )}
      </main>

      {/* Footer */}
      <Footer
        language={language}
        onTabChange={setCurrentTab}
        onGradeSelect={(grade) => {
          setSelectedGrade(grade as GradeLevel);
          setCurrentTab('notes');
        }}
        onOpenAdmin={() => setIsAdminOpen(true)}
      />

      {/* Mobile Bottom Navigation Bar */}
      <MobileBottomNav
        currentTab={currentTab}
        onTabChange={setCurrentTab}
        language={language}
        onOpenAITutor={() => setIsAITutorOpen(true)}
        onOpenDashboard={() => setIsDashboardOpen(true)}
        currentUser={currentUser}
        bookmarkCount={bookmarks.length}
        completedQuizCount={quizAttempts.length}
      />

      {/* Global Modals */}
      <GlobalSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onTabChange={setCurrentTab}
        onSelectSubjectForNotes={handleSelectSubjectForNotes}
        onSelectSubjectForQuiz={handleSelectSubjectForQuiz}
      />

      <ProgressDashboardModal
        isOpen={isDashboardOpen}
        onClose={() => setIsDashboardOpen(false)}
        bookmarks={bookmarks}
        quizAttempts={quizAttempts}
        currentUser={currentUser}
        notes={notes}
        language={language}
        onUpdateProfile={handleUpdateProfile}
        onOpenAuth={() => setIsAuthOpen(true)}
        onRemoveBookmark={handleToggleBookmark}
        onClearQuizHistory={() => setQuizAttempts([])}
        onTabChange={setCurrentTab}
        onSelectSubjectForNotes={handleSelectSubjectForNotes}
        onViewCertificate={(cert) => setViewingCertificate(cert)}
      />

      <FlashcardsModal
        isOpen={isFlashcardsOpen}
        onClose={() => setIsFlashcardsOpen(false)}
      />

      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        currentUser={currentUser}
        onLogin={(user) => setCurrentUser(user)}
        onLogout={() => setCurrentUser(null)}
      />

      <AITutorModal
        isOpen={isAITutorOpen}
        onClose={() => setIsAITutorOpen(false)}
        selectedGrade={selectedGrade}
        selectedSubject={selectedSubjectFilter !== 'All' ? selectedSubjectFilter : 'Mathematics'}
        language={language}
      />

      <CertificateModal
        isOpen={!!viewingCertificate}
        onClose={() => setViewingCertificate(null)}
        certificate={viewingCertificate}
        language={language}
        onSaveCertificate={handleSaveCertificate}
      />

      {/* Admin & Curriculum Management Modal (Firestore Powered) */}
      <AdminModal
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        currentUser={currentUser}
        notes={notes}
        quizzes={quizzes}
        subjects={subjects}
        quizAttempts={quizAttempts}
        onSaveNote={handleSaveNote}
        onDeleteNote={handleDeleteNote}
        onSaveQuiz={handleSaveQuiz}
        onDeleteQuiz={handleDeleteQuiz}
        onSaveSubject={handleSaveSubject}
        onDeleteSubject={handleDeleteSubject}
      />

      {/* Academic In-App Notifications Modal */}
      <NotificationsModal
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
        notifications={notifications}
        onMarkAsRead={handleMarkNotificationAsRead}
        onMarkAllAsRead={handleMarkAllNotificationsAsRead}
        onClearAll={handleClearAllNotifications}
        onTabChange={setCurrentTab}
        language={language}
      />

    </div>
  );
}
