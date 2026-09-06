import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  X,
  BookOpen,
  HelpCircle,
  Users,
  Plus,
  Edit2,
  Trash2,
  Save,
  CheckCircle2,
  AlertCircle,
  FileText,
  Clock,
  Layers,
  Sparkles,
  BarChart2,
  Download,
  Upload,
  Lock,
  Search,
  Award,
  RefreshCw,
} from 'lucide-react';
import {
  GradeLevel,
  NoteChapter,
  Quiz,
  QuizQuestion,
  QuizAttempt,
  StudentUser,
  Subject,
  SubjectStream,
} from '../types';
import {
  saveFirestoreNote,
  deleteFirestoreNote,
  saveFirestoreQuiz,
  deleteFirestoreQuiz,
  saveFirestoreSubject,
  deleteFirestoreSubject,
  fetchAllStudentsAdmin,
  fetchAllQuizAttemptsAdmin,
  isUserAdmin,
  ADMIN_EMAIL,
} from '../lib/firebase';
import { SUBJECTS } from '../data/gradesAndSubjects';

interface AdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: StudentUser | null;
  notes: NoteChapter[];
  quizzes: Quiz[];
  subjects: Subject[];
  quizAttempts: QuizAttempt[];
  onSaveNote: (note: NoteChapter) => void;
  onDeleteNote: (noteId: string) => void;
  onSaveQuiz: (quiz: Quiz) => void;
  onDeleteQuiz: (quizId: string) => void;
  onSaveSubject?: (subject: Subject) => void;
  onDeleteSubject?: (subjectId: string) => void;
}

type AdminTab = 'subjects' | 'notes' | 'quizzes' | 'students' | 'analytics' | 'backup';

export const AdminModal: React.FC<AdminModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  notes,
  quizzes,
  subjects,
  quizAttempts,
  onSaveNote,
  onDeleteNote,
  onSaveQuiz,
  onDeleteQuiz,
  onSaveSubject,
  onDeleteSubject,
}) => {
  const [activeTab, setActiveTab] = useState<AdminTab>('notes');
  const [authorized, setAuthorized] = useState(false);
  const [passcode, setPasscode] = useState('');
  const [authError, setAuthError] = useState('');
  const [statusMessage, setStatusMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  // Firestore students & quiz logs
  const [firestoreStudents, setFirestoreStudents] = useState<StudentUser[]>([]);
  const [firestoreQuizLogs, setFirestoreQuizLogs] = useState<QuizAttempt[]>([]);
  const [loadingStudents, setLoadingStudents] = useState(false);

  // Search & Filter
  const [searchFilter, setSearchFilter] = useState('');
  const [selectedGradeFilter, setSelectedGradeFilter] = useState<GradeLevel | 'All'>('All');

  // Note Editing State
  const [editingNote, setEditingNote] = useState<NoteChapter | null>(null);
  const [isCreatingNote, setIsCreatingNote] = useState(false);

  // Quiz Editing State
  const [editingQuiz, setEditingQuiz] = useState<Quiz | null>(null);
  const [isCreatingQuiz, setIsCreatingQuiz] = useState(false);
  const [editingQuestionIndex, setEditingQuestionIndex] = useState<number | null>(0);

  // Subject Editing State
  const [editingSubject, setEditingSubject] = useState<Subject | null>(null);
  const [isCreatingSubject, setIsCreatingSubject] = useState(false);

  // JSON Import / Export
  const [importText, setImportText] = useState('');

  // Check auth on open or user change
  useEffect(() => {
    if (isUserAdmin(currentUser?.email, currentUser?.role)) {
      setAuthorized(true);
    }
  }, [currentUser]);

  // Load students & analytics when tab switches
  useEffect(() => {
    if (authorized && (activeTab === 'students' || activeTab === 'analytics')) {
      loadAdminData();
    }
  }, [authorized, activeTab]);

  const loadAdminData = async () => {
    setLoadingStudents(true);
    try {
      const [students, logs] = await Promise.all([
        fetchAllStudentsAdmin(),
        fetchAllQuizAttemptsAdmin(),
      ]);
      setFirestoreStudents(students);
      setFirestoreQuizLogs(logs.length > 0 ? logs : quizAttempts);
    } catch (e) {
      console.warn('Error loading admin records from Firestore:', e);
      setFirestoreQuizLogs(quizAttempts);
    } finally {
      setLoadingStudents(false);
    }
  };

  if (!isOpen) return null;

  const showNotification = (text: string, type: 'success' | 'error' = 'success') => {
    setStatusMessage({ text, type });
    setTimeout(() => setStatusMessage(null), 3500);
  };

  const handleAuthorize = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      passcode.trim() === 'admin123' ||
      passcode.trim() === 'eyoel2026' ||
      passcode.trim() === 'admin' ||
      (currentUser && currentUser.email === ADMIN_EMAIL)
    ) {
      setAuthorized(true);
      setAuthError('');
      showNotification('Administrator identity confirmed. Full curriculum CRUD unlocked.');
    } else {
      setAuthError('Incorrect passcode or email is not authorized for administrative access.');
    }
  };

  // --- CRUD: SUBJECTS ---
  const handleStartNewSubject = () => {
    const newSubject: Subject = {
      id: `subj-${Date.now()}`,
      name: 'Economics',
      code: 'ECON',
      grades: ['Grade 11', 'Grade 12'],
      stream: 'Social Science',
      description: 'Comprehensive study of microeconomics, macroeconomics, fiscal policies, and national accounts.',
      unitCount: 6,
      noteCount: 6,
      quizCount: 6,
      topics: ['Microeconomics', 'Macroeconomics', 'Market Structures', 'Economic Systems'],
      icon: 'TrendingUp',
      color: 'amber',
    };
    setEditingSubject(newSubject);
    setIsCreatingSubject(true);
  };

  const handleSaveSubjectItem = async (subjectToSave: Subject) => {
    try {
      await saveFirestoreSubject(subjectToSave);
      if (onSaveSubject) onSaveSubject(subjectToSave);
      showNotification(`Subject "${subjectToSave.name}" synchronized to Firestore.`);
      setEditingSubject(null);
      setIsCreatingSubject(false);
    } catch (err: any) {
      showNotification(`Failed to save subject: ${err.message}`, 'error');
    }
  };

  const handleDeleteSubjectItem = async (subjectId: string, name: string) => {
    if (!window.confirm(`Are you sure you want to delete subject "${name}"?`)) return;
    try {
      await deleteFirestoreSubject(subjectId);
      if (onDeleteSubject) onDeleteSubject(subjectId);
      showNotification(`Subject "${name}" deleted from Firestore.`);
    } catch (err: any) {
      showNotification(`Failed to delete subject: ${err.message}`, 'error');
    }
  };

  // --- CRUD: NOTES ---
  const handleStartNewNote = () => {
    const parentSubj = subjects[0] || SUBJECTS[0];
    const newNote: NoteChapter = {
      id: `note-${Date.now()}`,
      subjectId: parentSubj.id,
      subjectName: parentSubj.name,
      grade: 'Grade 11',
      chapterNumber: 1,
      title: 'New Chapter: Fundamental Concepts',
      readingTimeMinutes: 15,
      summary: 'Executive summary of key principles, theoretical foundations, and testable concepts.',
      tableOfContents: ['1.1 Introduction', '1.2 Core Principles', '1.3 Practical Applications'],
      content: [
        {
          sectionTitle: '1.1 Introduction & Overview',
          body: 'Detailed explanations of core concepts with comprehensive derivations and textbook context.',
          bulletPoints: [
            'Foundational postulate and theoretical framework.',
            'Standard SI units and dimensional analysis.',
            'Experimental observations and mathematical equations.',
          ],
          calloutBox: {
            title: 'Exam High-Yield Tip',
            text: 'Frequently tested on the National Matriculation Examination. Memorize definition and units.',
            type: 'tip',
          },
        },
      ],
      formulas: [
        {
          name: 'Primary Relationship',
          formula: 'F = m * a',
          explanation: 'Newtonian force equation relating mass and acceleration.',
        },
      ],
      keyTerms: [
        {
          term: 'Vector Quantity',
          definition: 'A physical quantity with both magnitude and directional orientation in space.',
        },
      ],
    };
    setEditingNote(newNote);
    setIsCreatingNote(true);
  };

  const handleSaveNoteChapter = async (noteToSave: NoteChapter) => {
    try {
      await saveFirestoreNote(noteToSave);
      onSaveNote(noteToSave);
      showNotification(`Note chapter "${noteToSave.title}" saved to Firestore.`);
      setEditingNote(null);
      setIsCreatingNote(false);
    } catch (err: any) {
      showNotification(`Error saving note to Firestore: ${err.message}`, 'error');
    }
  };

  const handleDeleteNoteChapter = async (noteId: string, title: string) => {
    if (!window.confirm(`Are you sure you want to permanently delete "${title}"?`)) return;
    try {
      await deleteFirestoreNote(noteId);
      onDeleteNote(noteId);
      showNotification(`Note "${title}" deleted from Firestore.`);
    } catch (err: any) {
      showNotification(`Error deleting note: ${err.message}`, 'error');
    }
  };

  // --- CRUD: QUIZZES ---
  const handleStartNewQuiz = () => {
    const parentSubj = subjects[0] || SUBJECTS[0];
    const sampleQuestions: QuizQuestion[] = Array.from({ length: 20 }, (_, idx) => ({
      id: `q-${Date.now()}-${idx + 1}`,
      question: `Question ${idx + 1}: State the fundamental law governing this physical process.`,
      options: [
        'Option A: First principle description',
        'Option B: Second principle description',
        'Option C: Third principle description',
        'Option D: Fourth principle description',
      ],
      correctAnswerIndex: 0,
      explanation: 'Detailed step-by-step mathematical or conceptual explanation showing why Option A is correct.',
      hint: 'Recall the SI units and dimensional definitions.',
    }));

    const newQuiz: Quiz = {
      id: `quiz-${Date.now()}`,
      subjectId: parentSubj.id,
      subjectName: parentSubj.name,
      grade: 'Grade 12',
      title: `${parentSubj.name}: Comprehensive 20-Question Exam`,
      durationMinutes: 25,
      difficulty: 'Medium',
      questions: sampleQuestions,
    };
    setEditingQuiz(newQuiz);
    setIsCreatingQuiz(true);
    setEditingQuestionIndex(0);
  };

  const handleSaveQuizExam = async (quizToSave: Quiz) => {
    try {
      await saveFirestoreQuiz(quizToSave);
      onSaveQuiz(quizToSave);
      showNotification(`Quiz "${quizToSave.title}" (${quizToSave.questions.length} Questions) saved to Firestore.`);
      setEditingQuiz(null);
      setIsCreatingQuiz(false);
    } catch (err: any) {
      showNotification(`Error saving quiz: ${err.message}`, 'error');
    }
  };

  const handleDeleteQuizExam = async (quizId: string, title: string) => {
    if (!window.confirm(`Are you sure you want to delete quiz "${title}"?`)) return;
    try {
      await deleteFirestoreQuiz(quizId);
      onDeleteQuiz(quizId);
      showNotification(`Quiz "${title}" deleted from Firestore.`);
    } catch (err: any) {
      showNotification(`Error deleting quiz: ${err.message}`, 'error');
    }
  };

  // --- BACKUP & RESTORE JSON ---
  const handleExportJSON = () => {
    const payload = {
      exportedAt: new Date().toISOString(),
      subjects,
      notes,
      quizzes,
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `eyoel-academy-curriculum-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showNotification('Curriculum exported as JSON.');
  };

  const handleImportJSON = async () => {
    try {
      const data = JSON.parse(importText);
      let noteCount = 0;
      let quizCount = 0;
      if (Array.isArray(data.notes)) {
        for (const n of data.notes) {
          await saveFirestoreNote(n);
          onSaveNote(n);
          noteCount++;
        }
      }
      if (Array.isArray(data.quizzes)) {
        for (const q of data.quizzes) {
          await saveFirestoreQuiz(q);
          onSaveQuiz(q);
          quizCount++;
        }
      }
      setImportText('');
      showNotification(`Successfully restored ${noteCount} Notes and ${quizCount} Quizzes to Firestore!`);
    } catch (err: any) {
      showNotification(`Invalid JSON: ${err.message}`, 'error');
    }
  };

  // Filter notes/quizzes for admin search
  const filteredNotes = notes.filter((n) => {
    const matchGrade = selectedGradeFilter === 'All' || n.grade === selectedGradeFilter;
    const matchSearch =
      n.title.toLowerCase().includes(searchFilter.toLowerCase()) ||
      n.subjectName.toLowerCase().includes(searchFilter.toLowerCase());
    return matchGrade && matchSearch;
  });

  const filteredQuizzes = quizzes.filter((q) => {
    const matchGrade = selectedGradeFilter === 'All' || q.grade === selectedGradeFilter;
    const matchSearch =
      q.title.toLowerCase().includes(searchFilter.toLowerCase()) ||
      q.subjectName.toLowerCase().includes(searchFilter.toLowerCase());
    return matchGrade && matchSearch;
  });

  // Calculate analytics
  const attemptsToUse = firestoreQuizLogs.length > 0 ? firestoreQuizLogs : quizAttempts;
  const totalQuizAttempts = attemptsToUse.length;
  const avgScore =
    totalQuizAttempts > 0
      ? Math.round(attemptsToUse.reduce((acc, q) => acc + q.percentage, 0) / totalQuizAttempts)
      : 0;
  const passRate =
    totalQuizAttempts > 0
      ? Math.round(
          (attemptsToUse.filter((q) => q.percentage >= 70).length / totalQuizAttempts) * 100
        )
      : 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-2 sm:p-4 overflow-y-auto">
      <div className="bg-[#111112] rounded-3xl max-w-6xl w-full border border-[#2D2D30] shadow-2xl relative my-6 max-h-[92vh] overflow-hidden flex flex-col text-white">
        
        {/* Top Header */}
        <div className="p-5 border-b border-[#2D2D30] flex items-center justify-between bg-[#0E0E10]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-[#C5A059] text-[#C5A059] flex items-center justify-center">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-serif font-bold text-white">
                  Eyoel Academy Curriculum & Admin Control Panel
                </h2>
                <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-[#C5A059] text-[10px] font-bold uppercase border border-[#C5A059]/40">
                  FIRESTORE POWERED
                </span>
              </div>
              <span className="text-xs text-slate-400">
                Grade 9–12 Subjects, Notes, 20-Question Exam Banks & Student Progress Tracking
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-[#1A1A1C]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Notification Toast */}
        {statusMessage && (
          <div
            className={`px-5 py-2.5 text-xs font-semibold flex items-center gap-2 ${
              statusMessage.type === 'success'
                ? 'bg-emerald-950/90 text-emerald-300 border-b border-emerald-800'
                : 'bg-rose-950/90 text-rose-300 border-b border-rose-800'
            }`}
          >
            {statusMessage.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 shrink-0" />
            )}
            {statusMessage.text}
          </div>
        )}

        {!authorized ? (
          /* Passcode / Admin Auth Gate */
          <div className="p-8 sm:p-12 flex flex-col items-center justify-center max-w-md mx-auto space-y-6 text-center">
            <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-[#C5A059] text-[#C5A059] flex items-center justify-center">
              <Lock className="w-8 h-8" />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-serif font-bold text-white">Administrator Access Required</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Enter your administrative passcode or sign in with <span className="text-[#C5A059] font-mono">{ADMIN_EMAIL}</span> to manage subjects, notes, exams, and view student progress.
              </p>
            </div>

            <form onSubmit={handleAuthorize} className="w-full space-y-3">
              {authError && (
                <div className="p-3 rounded-xl bg-rose-950/50 border border-rose-800 text-rose-300 text-xs">
                  {authError}
                </div>
              )}
              <input
                type="password"
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                placeholder="Enter passcode (e.g. admin123 or eyoel2026)"
                className="w-full px-4 py-3 rounded-xl bg-[#1A1A1C] border border-[#2D2D30] text-white text-xs font-mono focus:outline-none focus:border-[#C5A059]"
              />
              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-[#C5A059] text-black font-bold text-xs uppercase tracking-wider hover:bg-[#b08e4c] transition"
              >
                Unlock Administrator Console
              </button>
            </form>

            <button
              type="button"
              onClick={() => {
                setAuthorized(true);
                showNotification('Authorized as Administrator in Evaluation Mode.');
              }}
              className="text-[11px] text-slate-500 hover:text-[#C5A059] underline"
            >
              Quick Test Bypass (Evaluation)
            </button>
          </div>
        ) : (
          /* Authorized Admin Interface */
          <>
            {/* Nav Tabs */}
            <div className="px-5 py-2.5 bg-[#161618] border-b border-[#2D2D30] flex items-center justify-between gap-3 overflow-x-auto text-xs font-semibold uppercase tracking-wider">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setActiveTab('subjects');
                    setEditingSubject(null);
                  }}
                  className={`px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap flex items-center gap-1.5 ${
                    activeTab === 'subjects'
                      ? 'bg-[#C5A059] text-black font-bold'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Layers className="w-3.5 h-3.5" /> Subjects ({subjects.length})
                </button>

                <button
                  onClick={() => {
                    setActiveTab('notes');
                    setEditingNote(null);
                  }}
                  className={`px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap flex items-center gap-1.5 ${
                    activeTab === 'notes'
                      ? 'bg-[#C5A059] text-black font-bold'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <BookOpen className="w-3.5 h-3.5" /> Study Notes ({notes.length})
                </button>

                <button
                  onClick={() => {
                    setActiveTab('quizzes');
                    setEditingQuiz(null);
                  }}
                  className={`px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap flex items-center gap-1.5 ${
                    activeTab === 'quizzes'
                      ? 'bg-[#C5A059] text-black font-bold'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <HelpCircle className="w-3.5 h-3.5" /> 20-Q Exam Banks ({quizzes.length})
                </button>

                <button
                  onClick={() => setActiveTab('students')}
                  className={`px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap flex items-center gap-1.5 ${
                    activeTab === 'students'
                      ? 'bg-[#C5A059] text-black font-bold'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Users className="w-3.5 h-3.5" /> Students ({firestoreStudents.length})
                </button>

                <button
                  onClick={() => setActiveTab('analytics')}
                  className={`px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap flex items-center gap-1.5 ${
                    activeTab === 'analytics'
                      ? 'bg-[#C5A059] text-black font-bold'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <BarChart2 className="w-3.5 h-3.5" /> Exam Scores & Logs
                </button>

                <button
                  onClick={() => setActiveTab('backup')}
                  className={`px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap flex items-center gap-1.5 ${
                    activeTab === 'backup'
                      ? 'bg-[#C5A059] text-black font-bold'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Download className="w-3.5 h-3.5" /> JSON Backup & Sync
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={loadAdminData}
                  className="p-1.5 rounded-lg bg-[#1A1A1C] text-slate-400 hover:text-[#C5A059] transition"
                  title="Reload Firestore Data"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Subheader Filters (for Notes & Quizzes & Subjects) */}
            {(activeTab === 'notes' || activeTab === 'quizzes' || activeTab === 'subjects') && (
              <div className="px-6 py-3 bg-[#111112] border-b border-[#242428] flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3 flex-1 max-w-md">
                  <div className="relative flex-1">
                    <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={searchFilter}
                      onChange={(e) => setSearchFilter(e.target.value)}
                      placeholder="Filter title or subject..."
                      className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-[#1A1A1C] border border-[#2D2D30] text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#C5A059]"
                    />
                  </div>

                  <select
                    value={selectedGradeFilter}
                    onChange={(e) => setSelectedGradeFilter(e.target.value as GradeLevel | 'All')}
                    className="px-3 py-1.5 rounded-lg bg-[#1A1A1C] border border-[#2D2D30] text-xs text-white focus:outline-none focus:border-[#C5A059]"
                  >
                    <option value="All">All Grades</option>
                    <option value="Grade 9">Grade 9</option>
                    <option value="Grade 10">Grade 10</option>
                    <option value="Grade 11">Grade 11</option>
                    <option value="Grade 12">Grade 12</option>
                  </select>
                </div>

                <div className="flex items-center gap-2">
                  {activeTab === 'subjects' && (
                    <button
                      onClick={handleStartNewSubject}
                      className="px-3.5 py-1.5 rounded-lg bg-[#C5A059] text-black font-bold text-xs flex items-center gap-1 hover:bg-[#b08e4c] transition shadow-md shadow-[#C5A059]/10"
                    >
                      <Plus className="w-3.5 h-3.5" /> Add Subject
                    </button>
                  )}
                  {activeTab === 'notes' && (
                    <button
                      onClick={handleStartNewNote}
                      className="px-3.5 py-1.5 rounded-lg bg-[#C5A059] text-black font-bold text-xs flex items-center gap-1 hover:bg-[#b08e4c] transition shadow-md shadow-[#C5A059]/10"
                    >
                      <Plus className="w-3.5 h-3.5" /> Add Study Note
                    </button>
                  )}
                  {activeTab === 'quizzes' && (
                    <button
                      onClick={handleStartNewQuiz}
                      className="px-3.5 py-1.5 rounded-lg bg-[#C5A059] text-black font-bold text-xs flex items-center gap-1 hover:bg-[#b08e4c] transition shadow-md shadow-[#C5A059]/10"
                    >
                      <Plus className="w-3.5 h-3.5" /> Add 20-Q Exam Bank
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Main Content Area */}
            <div className="flex-1 p-6 overflow-y-auto bg-[#0E0E10]">
              
              {/* 1. SUBJECTS MANAGEMENT */}
              {activeTab === 'subjects' && (
                <div className="space-y-6">
                  {editingSubject ? (
                    <div className="p-6 rounded-2xl border border-[#C5A059]/40 bg-[#141416] space-y-4">
                      <div className="flex items-center justify-between pb-3 border-b border-[#2D2D30]">
                        <h3 className="text-sm font-bold text-[#C5A059] uppercase tracking-wider">
                          {isCreatingSubject ? 'Create New Subject' : 'Edit Subject Metadata'}
                        </h3>
                        <button
                          onClick={() => setEditingSubject(null)}
                          className="text-xs text-slate-400 hover:text-white"
                        >
                          Cancel
                        </button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div>
                          <label className="block text-[11px] font-semibold text-slate-400 mb-1">Subject Name</label>
                          <input
                            type="text"
                            value={editingSubject.name}
                            onChange={(e) => setEditingSubject({ ...editingSubject, name: e.target.value })}
                            className="w-full px-3 py-2 rounded-lg bg-[#1A1A1C] border border-[#2D2D30] text-xs text-white"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-semibold text-slate-400 mb-1">Subject Code</label>
                          <input
                            type="text"
                            value={editingSubject.code}
                            onChange={(e) => setEditingSubject({ ...editingSubject, code: e.target.value })}
                            className="w-full px-3 py-2 rounded-lg bg-[#1A1A1C] border border-[#2D2D30] text-xs text-white uppercase"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-semibold text-slate-400 mb-1">Stream</label>
                          <select
                            value={editingSubject.stream}
                            onChange={(e) => setEditingSubject({ ...editingSubject, stream: e.target.value as SubjectStream })}
                            className="w-full px-3 py-2 rounded-lg bg-[#1A1A1C] border border-[#2D2D30] text-xs text-white"
                          >
                            <option value="Natural Science">Natural Science</option>
                            <option value="Social Science">Social Science</option>
                            <option value="General">General Secondary</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold text-slate-400 mb-1">Curriculum Description</label>
                        <textarea
                          rows={2}
                          value={editingSubject.description}
                          onChange={(e) => setEditingSubject({ ...editingSubject, description: e.target.value })}
                          className="w-full px-3 py-2 rounded-lg bg-[#1A1A1C] border border-[#2D2D30] text-xs text-white"
                        />
                      </div>

                      <div className="flex justify-end gap-2 pt-2">
                        <button
                          onClick={() => setEditingSubject(null)}
                          className="px-4 py-2 rounded-xl border border-[#2D2D30] text-xs text-slate-300"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => handleSaveSubjectItem(editingSubject)}
                          className="px-5 py-2 rounded-xl bg-[#C5A059] text-black font-bold text-xs flex items-center gap-1.5"
                        >
                          <Save className="w-3.5 h-3.5" /> Save Subject to Firestore
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {subjects.map((subj) => (
                        <div
                          key={subj.id}
                          className="p-5 rounded-2xl bg-[#161618] border border-[#2D2D30] hover:border-[#C5A059]/50 transition-colors space-y-3"
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-mono font-bold text-[#C5A059] bg-[#C5A059]/10 px-2 py-0.5 rounded border border-[#C5A059]/30">
                              {subj.code}
                            </span>
                            <span className="text-[10px] uppercase font-bold text-slate-400">
                              {subj.stream}
                            </span>
                          </div>
                          <div>
                            <h4 className="text-base font-bold text-white">{subj.name}</h4>
                            <p className="text-xs text-slate-400 mt-1 line-clamp-2">{subj.description}</p>
                          </div>
                          <div className="flex items-center gap-1.5 flex-wrap pt-2">
                            {subj.grades.map((g) => (
                              <span key={g} className="px-2 py-0.5 rounded bg-[#1F1F23] text-[10px] font-medium text-slate-300">
                                {g}
                              </span>
                            ))}
                          </div>
                          <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#242428]">
                            <button
                              onClick={() => {
                                setEditingSubject(subj);
                                setIsCreatingSubject(false);
                              }}
                              className="px-3 py-1 rounded-lg bg-[#1F1F23] hover:bg-[#2A2A30] text-xs text-slate-200 flex items-center gap-1"
                            >
                              <Edit2 className="w-3 h-3 text-[#C5A059]" /> Edit
                            </button>
                            <button
                              onClick={() => handleDeleteSubjectItem(subj.id, subj.name)}
                              className="px-3 py-1 rounded-lg bg-[#1F1F23] hover:bg-rose-950/40 text-xs text-rose-300 flex items-center gap-1"
                            >
                              <Trash2 className="w-3 h-3" /> Delete
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* 2. STUDY NOTES MANAGEMENT */}
              {activeTab === 'notes' && (
                <div className="space-y-6">
                  {editingNote ? (
                    <div className="p-6 rounded-2xl border border-[#C5A059]/40 bg-[#141416] space-y-4">
                      <div className="flex items-center justify-between pb-3 border-b border-[#2D2D30]">
                        <h3 className="text-sm font-bold text-[#C5A059] uppercase tracking-wider">
                          {isCreatingNote ? 'Compose New Study Note' : `Edit Note: ${editingNote.title}`}
                        </h3>
                        <button
                          onClick={() => setEditingNote(null)}
                          className="text-xs text-slate-400 hover:text-white"
                        >
                          Cancel
                        </button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                        <div>
                          <label className="block text-[11px] font-semibold text-slate-400 mb-1">Grade</label>
                          <select
                            value={editingNote.grade}
                            onChange={(e) => setEditingNote({ ...editingNote, grade: e.target.value as GradeLevel })}
                            className="w-full px-3 py-2 rounded-lg bg-[#1A1A1C] border border-[#2D2D30] text-xs text-white"
                          >
                            <option value="Grade 9">Grade 9</option>
                            <option value="Grade 10">Grade 10</option>
                            <option value="Grade 11">Grade 11</option>
                            <option value="Grade 12">Grade 12</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-[11px] font-semibold text-slate-400 mb-1">Subject</label>
                          <select
                            value={editingNote.subjectName}
                            onChange={(e) => {
                              const found = subjects.find(s => s.name === e.target.value);
                              setEditingNote({
                                ...editingNote,
                                subjectName: e.target.value,
                                subjectId: found ? found.id : editingNote.subjectId,
                              });
                            }}
                            className="w-full px-3 py-2 rounded-lg bg-[#1A1A1C] border border-[#2D2D30] text-xs text-white"
                          >
                            {subjects.map((s) => (
                              <option key={s.id} value={s.name}>{s.name}</option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="block text-[11px] font-semibold text-slate-400 mb-1">Chapter #</label>
                          <input
                            type="number"
                            value={editingNote.chapterNumber}
                            onChange={(e) => setEditingNote({ ...editingNote, chapterNumber: Number(e.target.value) })}
                            className="w-full px-3 py-2 rounded-lg bg-[#1A1A1C] border border-[#2D2D30] text-xs text-white"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-semibold text-slate-400 mb-1">Read Time (Mins)</label>
                          <input
                            type="number"
                            value={editingNote.readingTimeMinutes}
                            onChange={(e) => setEditingNote({ ...editingNote, readingTimeMinutes: Number(e.target.value) })}
                            className="w-full px-3 py-2 rounded-lg bg-[#1A1A1C] border border-[#2D2D30] text-xs text-white"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold text-slate-400 mb-1">Chapter Title</label>
                        <input
                          type="text"
                          value={editingNote.title}
                          onChange={(e) => setEditingNote({ ...editingNote, title: e.target.value })}
                          className="w-full px-3 py-2 rounded-lg bg-[#1A1A1C] border border-[#2D2D30] text-xs text-white font-semibold"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold text-slate-400 mb-1">Chapter Executive Summary</label>
                        <textarea
                          rows={2}
                          value={editingNote.summary}
                          onChange={(e) => setEditingNote({ ...editingNote, summary: e.target.value })}
                          className="w-full px-3 py-2 rounded-lg bg-[#1A1A1C] border border-[#2D2D30] text-xs text-white"
                        />
                      </div>

                      {/* Content Sections */}
                      <div className="space-y-3 pt-2">
                        <span className="text-xs font-bold text-[#C5A059] uppercase tracking-wider block">
                          Lesson Sections & Content ({editingNote.content.length})
                        </span>
                        {editingNote.content.map((sec, idx) => (
                          <div key={idx} className="p-4 rounded-xl bg-[#18181B] border border-[#2D2D30] space-y-3">
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-bold text-white">Section {idx + 1}</span>
                              {editingNote.content.length > 1 && (
                                <button
                                  type="button"
                                  onClick={() => {
                                    const updated = editingNote.content.filter((_, i) => i !== idx);
                                    setEditingNote({ ...editingNote, content: updated });
                                  }}
                                  className="text-[11px] text-rose-400 hover:underline"
                                >
                                  Remove Section
                                </button>
                              )}
                            </div>
                            <input
                              type="text"
                              value={sec.sectionTitle}
                              onChange={(e) => {
                                const updated = [...editingNote.content];
                                updated[idx].sectionTitle = e.target.value;
                                setEditingNote({ ...editingNote, content: updated });
                              }}
                              placeholder="Section Title (e.g., 1.1 Core Principles)"
                              className="w-full px-3 py-1.5 rounded-lg bg-[#111112] border border-[#2D2D30] text-xs text-white font-semibold"
                            />
                            <textarea
                              rows={3}
                              value={sec.body}
                              onChange={(e) => {
                                const updated = [...editingNote.content];
                                updated[idx].body = e.target.value;
                                setEditingNote({ ...editingNote, content: updated });
                              }}
                              placeholder="Section body text..."
                              className="w-full px-3 py-2 rounded-lg bg-[#111112] border border-[#2D2D30] text-xs text-white"
                            />
                          </div>
                        ))}
                        <button
                          type="button"
                          onClick={() => {
                            const newSec = {
                              sectionTitle: `Section ${editingNote.content.length + 1}`,
                              body: 'New lesson section explanation.',
                              bulletPoints: ['Essential key takeaway.'],
                            };
                            setEditingNote({ ...editingNote, content: [...editingNote.content, newSec] });
                          }}
                          className="px-3 py-1.5 rounded-lg bg-[#1F1F23] hover:bg-[#2A2A30] text-xs text-[#C5A059] font-bold flex items-center gap-1"
                        >
                          <Plus className="w-3 h-3" /> Add Lesson Section
                        </button>
                      </div>

                      <div className="flex justify-end gap-2 pt-4 border-t border-[#2D2D30]">
                        <button
                          onClick={() => setEditingNote(null)}
                          className="px-4 py-2 rounded-xl border border-[#2D2D30] text-xs text-slate-300"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => handleSaveNoteChapter(editingNote)}
                          className="px-5 py-2 rounded-xl bg-[#C5A059] text-black font-bold text-xs flex items-center gap-1.5"
                        >
                          <Save className="w-3.5 h-3.5" /> Save Note to Firestore
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {filteredNotes.map((note) => (
                        <div
                          key={note.id}
                          className="p-5 rounded-2xl bg-[#161618] border border-[#2D2D30] hover:border-[#C5A059]/40 transition-colors space-y-3"
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#C5A059]/15 text-[#C5A059] border border-[#C5A059]/30 uppercase">
                              {note.grade} • {note.subjectName}
                            </span>
                            <span className="text-xs text-slate-400 flex items-center gap-1">
                              <Clock className="w-3 h-3" /> {note.readingTimeMinutes}m
                            </span>
                          </div>
                          <div>
                            <h4 className="text-sm font-bold text-white line-clamp-1">{note.title}</h4>
                            <p className="text-xs text-slate-400 mt-1 line-clamp-2">{note.summary}</p>
                          </div>
                          <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#242428]">
                            <button
                              onClick={() => {
                                setEditingNote(note);
                                setIsCreatingNote(false);
                              }}
                              className="px-3 py-1 rounded-lg bg-[#1F1F23] hover:bg-[#2A2A30] text-xs text-slate-200 flex items-center gap-1"
                            >
                              <Edit2 className="w-3 h-3 text-[#C5A059]" /> Edit
                            </button>
                            <button
                              onClick={() => handleDeleteNoteChapter(note.id, note.title)}
                              className="px-3 py-1 rounded-lg bg-[#1F1F23] hover:bg-rose-950/40 text-xs text-rose-300 flex items-center gap-1"
                            >
                              <Trash2 className="w-3 h-3" /> Delete
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* 3. 20-QUESTION QUIZZES MANAGEMENT */}
              {activeTab === 'quizzes' && (
                <div className="space-y-6">
                  {editingQuiz ? (
                    <div className="p-6 rounded-2xl border border-[#C5A059]/40 bg-[#141416] space-y-5">
                      <div className="flex items-center justify-between pb-3 border-b border-[#2D2D30]">
                        <h3 className="text-sm font-bold text-[#C5A059] uppercase tracking-wider">
                          {isCreatingQuiz ? 'Create 20-Question Exam Bank' : `Edit Exam: ${editingQuiz.title}`}
                        </h3>
                        <button
                          onClick={() => setEditingQuiz(null)}
                          className="text-xs text-slate-400 hover:text-white"
                        >
                          Cancel
                        </button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                        <div>
                          <label className="block text-[11px] font-semibold text-slate-400 mb-1">Grade</label>
                          <select
                            value={editingQuiz.grade}
                            onChange={(e) => setEditingQuiz({ ...editingQuiz, grade: e.target.value as GradeLevel })}
                            className="w-full px-3 py-2 rounded-lg bg-[#1A1A1C] border border-[#2D2D30] text-xs text-white"
                          >
                            <option value="Grade 9">Grade 9</option>
                            <option value="Grade 10">Grade 10</option>
                            <option value="Grade 11">Grade 11</option>
                            <option value="Grade 12">Grade 12</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-[11px] font-semibold text-slate-400 mb-1">Subject</label>
                          <select
                            value={editingQuiz.subjectName}
                            onChange={(e) => {
                              const found = subjects.find(s => s.name === e.target.value);
                              setEditingQuiz({
                                ...editingQuiz,
                                subjectName: e.target.value,
                                subjectId: found ? found.id : editingQuiz.subjectId,
                              });
                            }}
                            className="w-full px-3 py-2 rounded-lg bg-[#1A1A1C] border border-[#2D2D30] text-xs text-white"
                          >
                            {subjects.map((s) => (
                              <option key={s.id} value={s.name}>{s.name}</option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="block text-[11px] font-semibold text-slate-400 mb-1">Duration (Mins)</label>
                          <input
                            type="number"
                            value={editingQuiz.durationMinutes}
                            onChange={(e) => setEditingQuiz({ ...editingQuiz, durationMinutes: Number(e.target.value) })}
                            className="w-full px-3 py-2 rounded-lg bg-[#1A1A1C] border border-[#2D2D30] text-xs text-white"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-semibold text-slate-400 mb-1">Difficulty</label>
                          <select
                            value={editingQuiz.difficulty}
                            onChange={(e) => setEditingQuiz({ ...editingQuiz, difficulty: e.target.value as any })}
                            className="w-full px-3 py-2 rounded-lg bg-[#1A1A1C] border border-[#2D2D30] text-xs text-white"
                          >
                            <option value="Easy">Easy</option>
                            <option value="Medium">Medium</option>
                            <option value="Hard">Hard</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold text-slate-400 mb-1">Exam Title</label>
                        <input
                          type="text"
                          value={editingQuiz.title}
                          onChange={(e) => setEditingQuiz({ ...editingQuiz, title: e.target.value })}
                          className="w-full px-3 py-2 rounded-lg bg-[#1A1A1C] border border-[#2D2D30] text-xs text-white font-semibold"
                        />
                      </div>

                      {/* Question Selector Bar */}
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-bold text-white uppercase tracking-wider">
                            Questions ({editingQuiz.questions.length} total)
                          </span>
                          <button
                            type="button"
                            onClick={() => {
                              const newQ: QuizQuestion = {
                                id: `q-${Date.now()}-${editingQuiz.questions.length + 1}`,
                                question: `Question ${editingQuiz.questions.length + 1} prompt content...`,
                                options: ['Option A text', 'Option B text', 'Option C text', 'Option D text'],
                                correctAnswerIndex: 0,
                                explanation: 'Solution explanation for the correct choice.',
                                hint: 'Clue for solving.',
                              };
                              const updated = [...editingQuiz.questions, newQ];
                              setEditingQuiz({ ...editingQuiz, questions: updated });
                              setEditingQuestionIndex(updated.length - 1);
                            }}
                            className="px-3 py-1 rounded-lg bg-[#C5A059]/20 text-[#C5A059] border border-[#C5A059]/30 text-xs font-bold hover:bg-[#C5A059]/30 transition flex items-center gap-1"
                          >
                            <Plus className="w-3 h-3" /> Add Question
                          </button>
                        </div>

                        <div className="flex flex-wrap gap-1.5 p-3 rounded-xl bg-[#111112] border border-[#2D2D30]">
                          {editingQuiz.questions.map((_, idx) => (
                            <button
                              key={idx}
                              type="button"
                              onClick={() => setEditingQuestionIndex(idx)}
                              className={`w-8 h-8 rounded-lg text-xs font-mono font-bold transition ${
                                editingQuestionIndex === idx
                                  ? 'bg-[#C5A059] text-black ring-2 ring-[#C5A059]/50'
                                  : 'bg-[#18181B] text-slate-300 hover:bg-[#252528]'
                              }`}
                            >
                              {idx + 1}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Active Question Editor */}
                      {editingQuestionIndex !== null && editingQuiz.questions[editingQuestionIndex] && (
                        <div className="p-5 rounded-xl border border-[#2D2D30] bg-[#111112] space-y-4">
                          <div className="flex items-center justify-between pb-2 border-b border-[#242428]">
                            <span className="text-xs font-bold text-[#C5A059] uppercase tracking-wider">
                              Editing Question {editingQuestionIndex + 1} of {editingQuiz.questions.length}
                            </span>
                            {editingQuiz.questions.length > 1 && (
                              <button
                                type="button"
                                onClick={() => {
                                  const updated = editingQuiz.questions.filter((_, i) => i !== editingQuestionIndex);
                                  setEditingQuiz({ ...editingQuiz, questions: updated });
                                  setEditingQuestionIndex(Math.max(0, editingQuestionIndex - 1));
                                }}
                                className="text-xs text-rose-400 hover:underline flex items-center gap-1"
                              >
                                <Trash2 className="w-3 h-3" /> Delete Question
                              </button>
                            )}
                          </div>

                          <div>
                            <label className="block text-xs font-semibold text-slate-300 mb-1">
                              Question Text / Prompt
                            </label>
                            <textarea
                              rows={2}
                              value={editingQuiz.questions[editingQuestionIndex].question}
                              onChange={(e) => {
                                const updated = [...editingQuiz.questions];
                                updated[editingQuestionIndex].question = e.target.value;
                                setEditingQuiz({ ...editingQuiz, questions: updated });
                              }}
                              className="w-full px-3 py-2 rounded-lg bg-[#18181B] border border-[#2D2D30] text-xs text-white"
                            />
                          </div>

                          {/* 4 Choices */}
                          <div className="space-y-2">
                            <label className="block text-xs font-semibold text-slate-300">
                              4 Answer Choices (Select radio button for the correct option)
                            </label>
                            {editingQuiz.questions[editingQuestionIndex].options.map((opt, oIdx) => (
                              <div key={oIdx} className="flex items-center gap-3">
                                <input
                                  type="radio"
                                  name={`correctAnswer-${editingQuestionIndex}`}
                                  checked={editingQuiz.questions[editingQuestionIndex].correctAnswerIndex === oIdx}
                                  onChange={() => {
                                    const updated = [...editingQuiz.questions];
                                    updated[editingQuestionIndex].correctAnswerIndex = oIdx;
                                    setEditingQuiz({ ...editingQuiz, questions: updated });
                                  }}
                                  className="accent-[#C5A059] w-4 h-4 cursor-pointer"
                                />
                                <span className="w-6 text-xs font-mono font-bold text-slate-400">
                                  {String.fromCharCode(65 + oIdx)}.
                                </span>
                                <input
                                  type="text"
                                  value={opt}
                                  onChange={(e) => {
                                    const updated = [...editingQuiz.questions];
                                    updated[editingQuestionIndex].options[oIdx] = e.target.value;
                                    setEditingQuiz({ ...editingQuiz, questions: updated });
                                  }}
                                  className={`flex-1 px-3 py-1.5 rounded-lg border text-xs text-white ${
                                    editingQuiz.questions[editingQuestionIndex].correctAnswerIndex === oIdx
                                      ? 'border-emerald-500/60 bg-emerald-950/20'
                                      : 'border-[#2D2D30] bg-[#18181B]'
                                  }`}
                                />
                              </div>
                            ))}
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div>
                              <label className="block text-xs font-semibold text-slate-300 mb-1">
                                Step-by-Step Explanation
                              </label>
                              <textarea
                                rows={2}
                                value={editingQuiz.questions[editingQuestionIndex].explanation}
                                onChange={(e) => {
                                  const updated = [...editingQuiz.questions];
                                  updated[editingQuestionIndex].explanation = e.target.value;
                                  setEditingQuiz({ ...editingQuiz, questions: updated });
                                }}
                                className="w-full px-3 py-2 rounded-lg bg-[#18181B] border border-[#2D2D30] text-xs text-white"
                              />
                            </div>

                            <div>
                              <label className="block text-xs font-semibold text-slate-300 mb-1">
                                Study Hint (Optional)
                              </label>
                              <textarea
                                rows={2}
                                value={editingQuiz.questions[editingQuestionIndex].hint || ''}
                                onChange={(e) => {
                                  const updated = [...editingQuiz.questions];
                                  updated[editingQuestionIndex].hint = e.target.value;
                                  setEditingQuiz({ ...editingQuiz, questions: updated });
                                }}
                                className="w-full px-3 py-2 rounded-lg bg-[#18181B] border border-[#2D2D30] text-xs text-white"
                              />
                            </div>
                          </div>
                        </div>
                      )}

                      <div className="flex justify-end gap-2 pt-4 border-t border-[#2D2D30]">
                        <button
                          onClick={() => setEditingQuiz(null)}
                          className="px-4 py-2 rounded-xl border border-[#2D2D30] text-xs text-slate-300"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => handleSaveQuizExam(editingQuiz)}
                          className="px-5 py-2 rounded-xl bg-[#C5A059] text-black font-bold text-xs flex items-center gap-1.5"
                        >
                          <Save className="w-3.5 h-3.5" /> Save All {editingQuiz.questions.length} Questions to Firestore
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {filteredQuizzes.map((quiz) => (
                        <div
                          key={quiz.id}
                          className="p-5 rounded-2xl bg-[#161618] border border-[#2D2D30] hover:border-[#C5A059]/40 transition-colors space-y-3"
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#C5A059]/15 text-[#C5A059] border border-[#C5A059]/30 uppercase">
                              {quiz.grade} • {quiz.subjectName}
                            </span>
                            <span className="text-xs text-slate-400 flex items-center gap-1 font-mono">
                              <HelpCircle className="w-3.5 h-3.5 text-[#C5A059]" /> {quiz.questions.length} Qs
                            </span>
                          </div>
                          <div>
                            <h4 className="text-sm font-bold text-white line-clamp-1">{quiz.title}</h4>
                            <span className="text-xs text-slate-400 block mt-1">
                              Duration: {quiz.durationMinutes} mins • {quiz.difficulty}
                            </span>
                          </div>
                          <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#242428]">
                            <button
                              onClick={() => {
                                setEditingQuiz(quiz);
                                setIsCreatingQuiz(false);
                                setEditingQuestionIndex(0);
                              }}
                              className="px-3 py-1 rounded-lg bg-[#1F1F23] hover:bg-[#2A2A30] text-xs text-slate-200 flex items-center gap-1"
                            >
                              <Edit2 className="w-3 h-3 text-[#C5A059]" /> Edit
                            </button>
                            <button
                              onClick={() => handleDeleteQuizExam(quiz.id, quiz.title)}
                              className="px-3 py-1 rounded-lg bg-[#1F1F23] hover:bg-rose-950/40 text-xs text-rose-300 flex items-center gap-1"
                            >
                              <Trash2 className="w-3 h-3" /> Delete
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* 4. STUDENT MANAGEMENT */}
              {activeTab === 'students' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-white">Registered Student Profiles</h4>
                      <p className="text-xs text-slate-400">
                        View student grades, streams, completed lesson counts, certificates, and target scores.
                      </p>
                    </div>
                    <button
                      onClick={loadAdminData}
                      disabled={loadingStudents}
                      className="px-3 py-1.5 rounded-lg bg-[#1A1A1C] border border-[#2D2D30] text-xs text-slate-300 hover:text-white flex items-center gap-1.5"
                    >
                      <RefreshCw className={`w-3 h-3 ${loadingStudents ? 'animate-spin' : ''}`} /> Refresh
                    </button>
                  </div>

                  <div className="border border-[#2D2D30] rounded-xl overflow-hidden bg-[#141416]">
                    <table className="w-full text-left text-xs text-slate-300">
                      <thead className="bg-[#18181B] border-b border-[#2D2D30] text-slate-400 font-semibold uppercase text-[10px]">
                        <tr>
                          <th className="p-3">Student Name</th>
                          <th className="p-3">Email Address</th>
                          <th className="p-3">Grade & Stream</th>
                          <th className="p-3 text-center">Lessons</th>
                          <th className="p-3 text-center">Certificates</th>
                          <th className="p-3 text-center">Target Score</th>
                          <th className="p-3 text-right">Role</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#242428]">
                        {(firestoreStudents.length > 0 ? firestoreStudents : (currentUser ? [currentUser] : [])).map((st) => (
                          <tr key={st.id} className="hover:bg-[#18181B] transition">
                            <td className="p-3 font-semibold text-white flex items-center gap-2">
                              <span className="text-base">{st.avatar || '🎓'}</span>
                              {st.name}
                            </td>
                            <td className="p-3 font-mono text-slate-400">{st.email}</td>
                            <td className="p-3">
                              <span className="px-2 py-0.5 rounded bg-[#1F1F23] text-[#C5A059] font-bold text-[10px]">
                                {st.grade}
                              </span>{' '}
                              <span className="text-slate-400 text-[11px]">{st.stream}</span>
                            </td>
                            <td className="p-3 text-center font-mono">
                              {(st.notesCompleted || []).length}
                            </td>
                            <td className="p-3 text-center font-mono text-emerald-400 font-bold">
                              {(st.certificates || []).length}
                            </td>
                            <td className="p-3 text-center font-mono font-bold text-[#C5A059]">
                              {st.targetScore || 560}/600
                            </td>
                            <td className="p-3 text-right">
                              <span
                                className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                                  st.role === 'admin'
                                    ? 'bg-amber-500/20 text-[#C5A059] border border-[#C5A059]/40'
                                    : 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                                }`}
                              >
                                {st.role || 'student'}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* 5. EXAM SCORES & ANALYTICS */}
              {activeTab === 'analytics' && (
                <div className="space-y-6">
                  {/* Metric Cards */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div className="p-4 rounded-xl border border-[#2D2D30] bg-[#161618]">
                      <div className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Total Exam Attempts</div>
                      <div className="text-2xl font-bold font-mono text-white mt-1">{totalQuizAttempts}</div>
                      <div className="text-[11px] text-slate-500 mt-1">Recorded assessments</div>
                    </div>

                    <div className="p-4 rounded-xl border border-[#2D2D30] bg-[#161618]">
                      <div className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Average Accuracy</div>
                      <div className="text-2xl font-bold font-mono text-[#C5A059] mt-1">{avgScore}%</div>
                      <div className="text-[11px] text-slate-500 mt-1">Across all grades</div>
                    </div>

                    <div className="p-4 rounded-xl border border-[#2D2D30] bg-[#161618]">
                      <div className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Passing Rate</div>
                      <div className="text-2xl font-bold font-mono text-emerald-400 mt-1">{passRate}%</div>
                      <div className="text-[11px] text-slate-500 mt-1">≥ 70% threshold</div>
                    </div>

                    <div className="p-4 rounded-xl border border-[#2D2D30] bg-[#161618]">
                      <div className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Registered Students</div>
                      <div className="text-2xl font-bold font-mono text-white mt-1">{firestoreStudents.length || 1}</div>
                      <div className="text-[11px] text-slate-500 mt-1">Active learners</div>
                    </div>
                  </div>

                  {/* Submission Logs Table */}
                  <div className="border border-[#2D2D30] rounded-xl overflow-hidden bg-[#141416]">
                    <div className="p-4 bg-[#18181B] border-b border-[#2D2D30] flex items-center justify-between">
                      <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                        Student Exam Submission History
                      </h4>
                      <span className="text-xs text-slate-400">{attemptsToUse.length} Records</span>
                    </div>

                    <table className="w-full text-left text-xs text-slate-300">
                      <thead className="bg-[#161618] border-b border-[#2D2D30] text-slate-400 font-semibold uppercase text-[10px]">
                        <tr>
                          <th className="p-3">Date</th>
                          <th className="p-3">Exam Title</th>
                          <th className="p-3">Subject & Grade</th>
                          <th className="p-3 text-center">Score</th>
                          <th className="p-3 text-right">Result</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#242428]">
                        {attemptsToUse.map((att) => (
                          <tr key={att.id} className="hover:bg-[#18181B] transition">
                            <td className="p-3 font-mono text-slate-400">{att.date}</td>
                            <td className="p-3 font-semibold text-white">{att.quizTitle}</td>
                            <td className="p-3 text-[#C5A059]">
                              {att.subjectName} ({att.grade})
                            </td>
                            <td className="p-3 text-center font-mono font-bold">
                              {att.score}/{att.totalQuestions} ({att.percentage}%)
                            </td>
                            <td className="p-3 text-right">
                              {att.percentage >= 70 ? (
                                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                                  CERTIFIED
                                </span>
                              ) : (
                                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/15 text-amber-400 border border-amber-500/30">
                                  REVIEW REQ.
                                </span>
                              )}
                            </td>
                          </tr>
                        ))}
                        {attemptsToUse.length === 0 && (
                          <tr>
                            <td colSpan={5} className="p-8 text-center text-slate-500">
                              No student exam attempts recorded yet.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* 6. JSON BACKUP & IMPORT */}
              {activeTab === 'backup' && (
                <div className="space-y-6 max-w-2xl mx-auto">
                  <div className="p-5 rounded-2xl border border-[#2D2D30] bg-[#161618] space-y-3">
                    <h4 className="text-sm font-bold text-white flex items-center gap-2">
                      <Download className="w-4 h-4 text-[#C5A059]" /> Export Full Curriculum JSON
                    </h4>
                    <p className="text-xs text-slate-400">
                      Download a JSON file containing all subjects, note chapters, formulas, and 20-question exam banks.
                    </p>
                    <button
                      onClick={handleExportJSON}
                      className="px-4 py-2.5 rounded-xl bg-[#C5A059] text-black font-bold text-xs hover:bg-[#b08e4c] transition flex items-center gap-2"
                    >
                      <Download className="w-3.5 h-3.5" /> Download Curriculum JSON ({notes.length} Notes, {quizzes.length} Exams)
                    </button>
                  </div>

                  <div className="p-5 rounded-2xl border border-[#2D2D30] bg-[#161618] space-y-3">
                    <h4 className="text-sm font-bold text-white flex items-center gap-2">
                      <Upload className="w-4 h-4 text-[#C5A059]" /> Import Curriculum JSON
                    </h4>
                    <p className="text-xs text-slate-400">
                      Paste exported curriculum JSON data to batch update or load new questions directly to Firestore.
                    </p>
                    <textarea
                      rows={4}
                      value={importText}
                      onChange={(e) => setImportText(e.target.value)}
                      placeholder='Paste JSON here: { "notes": [...], "quizzes": [...] }'
                      className="w-full px-3 py-2 rounded-xl border border-[#2D2D30] bg-[#111112] text-xs font-mono text-white focus:outline-none focus:border-[#C5A059]"
                    />
                    <button
                      onClick={handleImportJSON}
                      disabled={!importText.trim()}
                      className="px-4 py-2 rounded-xl border border-[#2D2D30] bg-[#18181B] text-slate-300 text-xs hover:bg-[#202024] disabled:opacity-50 transition flex items-center gap-2"
                    >
                      <Upload className="w-3.5 h-3.5" /> Load Curriculum to Firestore
                    </button>
                  </div>
                </div>
              )}

            </div>
          </>
        )}

      </div>
    </div>
  );
};
