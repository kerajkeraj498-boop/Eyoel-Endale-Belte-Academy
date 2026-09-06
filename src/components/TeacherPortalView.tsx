import React, { useState } from 'react';
import {
  GraduationCap,
  Users,
  BookOpen,
  FileQuestion,
  MessageSquare,
  TrendingUp,
  Plus,
  Trash2,
  Edit,
  CheckCircle2,
  Clock,
  Star,
  Sparkles,
  Send,
  Eye,
  AlertCircle,
} from 'lucide-react';
import {
  StudentUser,
  QuizAttempt,
  NoteChapter,
  Quiz,
  Subject,
  TeacherFeedback,
  GradeLevel,
  Language,
} from '../types';
import { TRANSLATIONS } from '../lib/translations';

interface TeacherPortalViewProps {
  currentUser: StudentUser | null;
  quizAttempts: QuizAttempt[];
  notes: NoteChapter[];
  quizzes: Quiz[];
  subjects: Subject[];
  language: Language;
  onSaveNote: (note: NoteChapter) => void;
  onSaveQuiz: (quiz: Quiz) => void;
  onTabChange: (tab: any) => void;
}

const SAMPLE_STUDENTS = [
  {
    id: 'stu-1',
    name: 'Selamawit Haile',
    rollNo: 'EYOEL-STU-8821',
    grade: 'Grade 12' as GradeLevel,
    stream: 'Natural Science',
    averageScore: 94,
    quizzesCount: 12,
    studyHours: 48,
    status: 'Excellent',
  },
  {
    id: 'stu-2',
    name: 'Abenezer Yohannes',
    rollNo: 'EYOEL-STU-7412',
    grade: 'Grade 12' as GradeLevel,
    stream: 'Natural Science',
    averageScore: 88,
    quizzesCount: 10,
    studyHours: 42,
    status: 'Very Good',
  },
  {
    id: 'stu-3',
    name: 'Hawwi Tolessa',
    rollNo: 'EYOEL-STU-6304',
    grade: 'Grade 11' as GradeLevel,
    stream: 'Natural Science',
    averageScore: 82,
    quizzesCount: 8,
    studyHours: 35,
    status: 'Good',
  },
  {
    id: 'stu-4',
    name: 'Biruk Tadesse',
    rollNo: 'EYOEL-STU-5192',
    grade: 'Grade 12' as GradeLevel,
    stream: 'Social Science',
    averageScore: 76,
    quizzesCount: 7,
    studyHours: 29,
    status: 'Needs Attention in Math',
  },
];

export const TeacherPortalView: React.FC<TeacherPortalViewProps> = ({
  currentUser,
  quizAttempts,
  notes,
  quizzes,
  subjects,
  language,
  onSaveNote,
  onSaveQuiz,
  onTabChange,
}) => {
  const t = TRANSLATIONS[language] || TRANSLATIONS.en;
  const [activeTab, setActiveTab] = useState<'classes' | 'create-lesson' | 'create-quiz' | 'student-results' | 'feedback'>('classes');

  // Teacher feedback state
  const [feedbacks, setFeedbacks] = useState<TeacherFeedback[]>(() => {
    try {
      const saved = localStorage.getItem('eyoel_teacher_feedbacks');
      return saved ? JSON.parse(saved) : [
        {
          id: 'fb-1',
          teacherId: currentUser?.id || 'teacher-1',
          teacherName: currentUser?.name || 'Ato Yohannes Tadesse (Senior Teacher)',
          studentId: 'stu-1',
          studentName: 'Selamawit Haile',
          subjectName: 'Biology',
          grade: 'Grade 12',
          comment: 'Outstanding mastery in Genetics and Punnett Squares! Recommended to take national exam mock tests.',
          date: 'Sep 02, 2026',
          rating: 5,
          actionItem: 'Proceed to Grade 12 National Biology Mock Exam',
        },
        {
          id: 'fb-2',
          teacherId: currentUser?.id || 'teacher-1',
          teacherName: currentUser?.name || 'Ato Yohannes Tadesse (Senior Teacher)',
          studentId: 'stu-4',
          studentName: 'Biruk Tadesse',
          subjectName: 'Mathematics',
          grade: 'Grade 12',
          comment: 'Good effort in Algebra, but needs focused review on Calculus derivative rules and coordinate geometry.',
          date: 'Sep 04, 2026',
          rating: 3,
          actionItem: 'Review Chapter 3 Calculus derivatives notes and consult AI tutor for step-by-step examples.',
        },
      ];
    } catch {
      return [];
    }
  });

  // New feedback form
  const [selectedStudentForFeedback, setSelectedStudentForFeedback] = useState(SAMPLE_STUDENTS[0].name);
  const [feedbackSubject, setFeedbackSubject] = useState('Mathematics');
  const [feedbackComment, setFeedbackComment] = useState('');
  const [feedbackActionItem, setFeedbackActionItem] = useState('');
  const [feedbackRating, setFeedbackRating] = useState(5);
  const [feedbackSuccessMsg, setFeedbackSuccessMsg] = useState<string | null>(null);

  // Lesson Creator State
  const [lessonTitle, setLessonTitle] = useState('');
  const [lessonSubject, setLessonSubject] = useState('Mathematics');
  const [lessonGrade, setLessonGrade] = useState<GradeLevel>('Grade 12');
  const [lessonChapter, setLessonChapter] = useState(1);
  const [lessonSummary, setLessonSummary] = useState('');
  const [lessonKeyTerms, setLessonKeyTerms] = useState('Derivative: Instantaneous rate of change\nLimit: The value a function approaches');
  const [lessonFormulas, setLessonFormulas] = useState('d/dx [x^n] = n*x^(n-1)\nd/dx [sin x] = cos x');
  const [lessonBody, setLessonBody] = useState('Detailed step-by-step lecture notes and explanations...');
  const [lessonSuccessMsg, setLessonSuccessMsg] = useState<string | null>(null);

  // Quiz Creator State
  const [quizTitle, setQuizTitle] = useState('');
  const [quizSubject, setQuizSubject] = useState('Physics');
  const [quizGrade, setQuizGrade] = useState<GradeLevel>('Grade 12');
  const [quizDuration, setQuizDuration] = useState(25);
  const [quizQPrompt, setQuizQPrompt] = useState('');
  const [quizOptA, setQuizOptA] = useState('');
  const [quizOptB, setQuizOptB] = useState('');
  const [quizOptC, setQuizOptC] = useState('');
  const [quizOptD, setQuizOptD] = useState('');
  const [quizCorrectIdx, setQuizCorrectIdx] = useState(0);
  const [quizExplanation, setQuizExplanation] = useState('');
  const [quizHint, setQuizHint] = useState('');
  const [quizSuccessMsg, setQuizSuccessMsg] = useState<string | null>(null);

  const handleSendFeedback = (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedbackComment.trim()) return;

    const newFb: TeacherFeedback = {
      id: `fb-${Date.now()}`,
      teacherId: currentUser?.id || 'teacher-1',
      teacherName: currentUser?.name || 'Ato Yohannes Tadesse (Senior Teacher)',
      studentId: `stu-${Date.now()}`,
      studentName: selectedStudentForFeedback,
      subjectName: feedbackSubject,
      grade: 'Grade 12',
      comment: feedbackComment.trim(),
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      rating: feedbackRating,
      actionItem: feedbackActionItem.trim() || undefined,
    };

    const updated = [newFb, ...feedbacks];
    setFeedbacks(updated);
    localStorage.setItem('eyoel_teacher_feedbacks', JSON.stringify(updated));
    setFeedbackComment('');
    setFeedbackActionItem('');
    setFeedbackSuccessMsg('Feedback successfully sent to student!');
    setTimeout(() => setFeedbackSuccessMsg(null), 3000);
  };

  const handleSaveNewLesson = (e: React.FormEvent) => {
    e.preventDefault();
    if (!lessonTitle.trim()) return;

    const newNote: NoteChapter = {
      id: `custom-note-${Date.now()}`,
      subjectId: lessonSubject.toLowerCase(),
      subjectName: lessonSubject,
      grade: lessonGrade,
      chapterNumber: Number(lessonChapter),
      title: lessonTitle.trim(),
      readingTimeMinutes: 25,
      summary: lessonSummary.trim() || 'Comprehensive lecture notes prepared by Eyoel Academy faculty.',
      tableOfContents: ['Introduction', 'Core Principles', 'Worked Examples', 'Summary'],
      keyTerms: lessonKeyTerms.split('\n').filter(Boolean).map((line) => {
        const [term, def] = line.split(':');
        return { term: term?.trim() || 'Term', definition: def?.trim() || '' };
      }),
      formulas: lessonFormulas.split('\n').filter(Boolean).map((line) => {
        const [name, formula] = line.split(':');
        return { name: name?.trim() || 'Formula', formula: formula?.trim() || line, description: '' };
      }),
      content: [
        {
          sectionTitle: 'Lesson Content & Lecture Notes',
          body: lessonBody.trim(),
        },
      ],
    };

    onSaveNote(newNote);
    setLessonSuccessMsg(`Lesson "${newNote.title}" successfully published to student curriculum!`);
    setLessonTitle('');
    setLessonSummary('');
    setTimeout(() => setLessonSuccessMsg(null), 3000);
  };

  const handleSaveNewQuiz = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quizTitle.trim() || !quizQPrompt.trim()) return;

    const newQuiz: Quiz = {
      id: `custom-quiz-${Date.now()}`,
      subjectId: quizSubject.toLowerCase(),
      subjectName: quizSubject,
      grade: quizGrade,
      title: quizTitle.trim(),
      durationMinutes: Number(quizDuration),
      difficulty: 'Medium',
      questions: [
        {
          id: `q-${Date.now()}-1`,
          question: quizQPrompt.trim(),
          options: [
            quizOptA.trim() || 'Option A',
            quizOptB.trim() || 'Option B',
            quizOptC.trim() || 'Option C',
            quizOptD.trim() || 'Option D',
          ],
          correctAnswerIndex: Number(quizCorrectIdx),
          explanation: quizExplanation.trim() || 'Step-by-step scientific justification.',
          hint: quizHint.trim() || 'Consider core unit formulas and laws.',
        },
      ],
    };

    onSaveQuiz(newQuiz);
    setQuizSuccessMsg(`Exam "${newQuiz.title}" successfully added to question bank!`);
    setQuizTitle('');
    setQuizQPrompt('');
    setQuizOptA('');
    setQuizOptB('');
    setQuizOptC('');
    setQuizOptD('');
    setQuizExplanation('');
    setQuizHint('');
    setTimeout(() => setQuizSuccessMsg(null), 3000);
  };

  return (
    <div className="min-h-screen bg-[#0A0A0B] text-slate-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#1E1E22] pb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-950/80 border border-emerald-700/60 text-emerald-300 text-xs font-bold uppercase tracking-wider flex items-center gap-1">
                <GraduationCap className="w-3.5 h-3.5" />
                Teacher & Faculty Portal
              </span>
              <span className="text-xs text-slate-400">
                • {currentUser?.name || 'Ato Yohannes Tadesse'} (Senior Instructor)
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-white tracking-tight">
              Teacher Dashboard & Curriculum Builder
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Create and publish lessons, build 20-question national exams, review student quiz submissions, and write personalized academic feedback.
            </p>
          </div>

          {/* Navigation Bar */}
          <div className="flex flex-wrap items-center gap-1 bg-[#121214] p-1.5 rounded-2xl border border-[#222226] text-xs">
            <button
              onClick={() => setActiveTab('classes')}
              className={`px-3 py-2 rounded-xl font-semibold transition-colors flex items-center gap-1.5 ${
                activeTab === 'classes' ? 'bg-[#C5A059] text-black font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>Classes</span>
            </button>
            <button
              onClick={() => setActiveTab('create-lesson')}
              className={`px-3 py-2 rounded-xl font-semibold transition-colors flex items-center gap-1.5 ${
                activeTab === 'create-lesson' ? 'bg-[#C5A059] text-black font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Create Lesson</span>
            </button>
            <button
              onClick={() => setActiveTab('create-quiz')}
              className={`px-3 py-2 rounded-xl font-semibold transition-colors flex items-center gap-1.5 ${
                activeTab === 'create-quiz' ? 'bg-[#C5A059] text-black font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              <FileQuestion className="w-3.5 h-3.5" />
              <span>Create Quiz</span>
            </button>
            <button
              onClick={() => setActiveTab('student-results')}
              className={`px-3 py-2 rounded-xl font-semibold transition-colors flex items-center gap-1.5 ${
                activeTab === 'student-results' ? 'bg-[#C5A059] text-black font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Results ({quizAttempts.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('feedback')}
              className={`px-3 py-2 rounded-xl font-semibold transition-colors flex items-center gap-1.5 ${
                activeTab === 'feedback' ? 'bg-[#C5A059] text-black font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Feedback ({feedbacks.length})</span>
            </button>
          </div>
        </div>

        {/* Tab 1: Assigned Classes & Students */}
        {activeTab === 'classes' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-[#121214] border border-[#222226] rounded-2xl p-5 space-y-1">
                <span className="text-xs text-slate-400 font-medium">Assigned Grades</span>
                <span className="text-xl font-bold text-white block">Grade 11 & Grade 12</span>
                <span className="text-[11px] text-[#C5A059]">Natural Science Stream</span>
              </div>
              <div className="bg-[#121214] border border-[#222226] rounded-2xl p-5 space-y-1">
                <span className="text-xs text-slate-400 font-medium">Total Enrolled Scholars</span>
                <span className="text-xl font-bold text-white block">124 Students</span>
                <span className="text-[11px] text-emerald-400">92% Active this week</span>
              </div>
              <div className="bg-[#121214] border border-[#222226] rounded-2xl p-5 space-y-1">
                <span className="text-xs text-slate-400 font-medium">Class Exam Average</span>
                <span className="text-xl font-bold text-white block">85.4%</span>
                <span className="text-[11px] text-slate-400">+4.2% higher than state average</span>
              </div>
            </div>

            {/* Students Table */}
            <div className="bg-[#121214] border border-[#222226] rounded-3xl overflow-hidden shadow-xl">
              <div className="p-5 border-b border-[#222226] flex items-center justify-between">
                <div>
                  <h3 className="font-serif font-bold text-lg text-white">Assigned Student Roster</h3>
                  <p className="text-xs text-slate-400">Review individual student performance, study hours, and academic standing</p>
                </div>
                <button
                  onClick={() => setActiveTab('feedback')}
                  className="px-3 py-1.5 rounded-xl bg-[#C5A059] text-black font-bold text-xs uppercase tracking-wider flex items-center gap-1"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>Give Feedback</span>
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs sm:text-sm">
                  <thead className="bg-[#18181C] text-slate-400 uppercase text-[10px] tracking-wider border-b border-[#222226]">
                    <tr>
                      <th className="py-3 px-4">Student</th>
                      <th className="py-3 px-4">Roll Number</th>
                      <th className="py-3 px-4">Grade & Stream</th>
                      <th className="py-3 px-4 text-center">Quizzes</th>
                      <th className="py-3 px-4 text-center">Study Time</th>
                      <th className="py-3 px-4 text-center">Avg Score</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#1E1E24]">
                    {SAMPLE_STUDENTS.map((stu) => (
                      <tr key={stu.id} className="hover:bg-[#16161A] transition-colors">
                        <td className="py-4 px-4 font-bold text-white">{stu.name}</td>
                        <td className="py-4 px-4 text-slate-400 font-mono text-xs">{stu.rollNo}</td>
                        <td className="py-4 px-4 text-slate-300">{stu.grade} • {stu.stream}</td>
                        <td className="py-4 px-4 text-center font-semibold text-slate-200">{stu.quizzesCount}</td>
                        <td className="py-4 px-4 text-center text-slate-300">{stu.studyHours}h</td>
                        <td className="py-4 px-4 text-center">
                          <span
                            className={`px-2.5 py-1 rounded-full font-bold text-xs ${
                              stu.averageScore >= 85
                                ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                                : stu.averageScore >= 75
                                ? 'bg-amber-950 text-amber-300 border border-amber-800'
                                : 'bg-rose-950 text-rose-300 border border-rose-800'
                            }`}
                          >
                            {stu.averageScore}%
                          </span>
                        </td>
                        <td className="py-4 px-4 text-right">
                          <button
                            onClick={() => {
                              setSelectedStudentForFeedback(stu.name);
                              setActiveTab('feedback');
                            }}
                            className="text-xs text-[#C5A059] hover:underline font-semibold"
                          >
                            Write Feedback →
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Create Lesson */}
        {activeTab === 'create-lesson' && (
          <div className="bg-[#121214] border border-[#222226] rounded-3xl p-6 shadow-xl space-y-6">
            <div className="border-b border-[#222226] pb-4">
              <h3 className="font-serif font-bold text-lg text-white">Create & Publish Curriculum Study Lesson</h3>
              <p className="text-xs text-slate-400">
                Author structured study notes with chapter summaries, scientific formulas, definitions, and lecture body.
              </p>
            </div>

            {lessonSuccessMsg && (
              <div className="bg-emerald-950/80 border border-emerald-600 text-emerald-200 px-4 py-3 rounded-xl text-xs font-semibold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>{lessonSuccessMsg}</span>
              </div>
            )}

            <form onSubmit={handleSaveNewLesson} className="space-y-4 text-xs sm:text-sm">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Subject:</label>
                  <select
                    value={lessonSubject}
                    onChange={(e) => setLessonSubject(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-[#0E0E10] border border-[#2B2B32] text-white focus:outline-none focus:border-[#C5A059]"
                  >
                    <option value="Mathematics">Mathematics</option>
                    <option value="Physics">Physics</option>
                    <option value="Biology">Biology</option>
                    <option value="Chemistry">Chemistry</option>
                    <option value="English">English Language</option>
                    <option value="History">History</option>
                    <option value="Geography">Geography</option>
                  </select>
                </div>

                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Target Grade:</label>
                  <select
                    value={lessonGrade}
                    onChange={(e) => setLessonGrade(e.target.value as GradeLevel)}
                    className="w-full px-3 py-2.5 rounded-xl bg-[#0E0E10] border border-[#2B2B32] text-white focus:outline-none focus:border-[#C5A059]"
                  >
                    <option value="Grade 9">Grade 9</option>
                    <option value="Grade 10">Grade 10</option>
                    <option value="Grade 11">Grade 11</option>
                    <option value="Grade 12">Grade 12</option>
                  </select>
                </div>

                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Chapter Number:</label>
                  <input
                    type="number"
                    min={1}
                    max={20}
                    value={lessonChapter}
                    onChange={(e) => setLessonChapter(Number(e.target.value))}
                    className="w-full px-3 py-2.5 rounded-xl bg-[#0E0E10] border border-[#2B2B32] text-white focus:outline-none focus:border-[#C5A059]"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-300 font-semibold block mb-1">Chapter Title:</label>
                <input
                  type="text"
                  required
                  value={lessonTitle}
                  onChange={(e) => setLessonTitle(e.target.value)}
                  placeholder="e.g. Unit 4: Electromagnetism & Electromagnetic Induction"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#0E0E10] border border-[#2B2B32] text-white focus:outline-none focus:border-[#C5A059]"
                />
              </div>

              <div>
                <label className="text-slate-300 font-semibold block mb-1">Chapter Summary:</label>
                <textarea
                  rows={3}
                  value={lessonSummary}
                  onChange={(e) => setLessonSummary(e.target.value)}
                  placeholder="Brief synopsis summarizing core curriculum concepts for students..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#0E0E10] border border-[#2B2B32] text-white focus:outline-none focus:border-[#C5A059]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">
                    Key Terms & Definitions (One per line: Term: Definition):
                  </label>
                  <textarea
                    rows={4}
                    value={lessonKeyTerms}
                    onChange={(e) => setLessonKeyTerms(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#0E0E10] border border-[#2B2B32] text-white font-mono text-xs focus:outline-none focus:border-[#C5A059]"
                  />
                </div>

                <div>
                  <label className="text-slate-300 font-semibold block mb-1">
                    Scientific Formulas (One per line: Name: Formula):
                  </label>
                  <textarea
                    rows={4}
                    value={lessonFormulas}
                    onChange={(e) => setLessonFormulas(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#0E0E10] border border-[#2B2B32] text-white font-mono text-xs focus:outline-none focus:border-[#C5A059]"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-300 font-semibold block mb-1">Detailed Lecture Body / Sections:</label>
                <textarea
                  rows={6}
                  value={lessonBody}
                  onChange={(e) => setLessonBody(e.target.value)}
                  placeholder="In-depth pedagogical explanations, theorems, and proofs..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#0E0E10] border border-[#2B2B32] text-white focus:outline-none focus:border-[#C5A059]"
                />
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  className="px-6 py-3 rounded-xl bg-[#C5A059] hover:bg-[#d8b168] text-black font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-[#C5A059]/20"
                >
                  <BookOpen className="w-4 h-4" />
                  <span>Publish Lesson to Curriculum</span>
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Tab 3: Create Quiz */}
        {activeTab === 'create-quiz' && (
          <div className="bg-[#121214] border border-[#222226] rounded-3xl p-6 shadow-xl space-y-6">
            <div className="border-b border-[#222226] pb-4">
              <h3 className="font-serif font-bold text-lg text-white">Interactive Exam & Quiz Builder</h3>
              <p className="text-xs text-slate-400">
                Author multiple-choice questions with 4 options, designated correct answer, step-by-step explanation, and Socratic hints.
              </p>
            </div>

            {quizSuccessMsg && (
              <div className="bg-emerald-950/80 border border-emerald-600 text-emerald-200 px-4 py-3 rounded-xl text-xs font-semibold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>{quizSuccessMsg}</span>
              </div>
            )}

            <form onSubmit={handleSaveNewQuiz} className="space-y-4 text-xs sm:text-sm">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Exam Title:</label>
                  <input
                    type="text"
                    required
                    value={quizTitle}
                    onChange={(e) => setQuizTitle(e.target.value)}
                    placeholder="e.g. Grade 12 National Exam Simulator: Mechanics"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#0E0E10] border border-[#2B2B32] text-white focus:outline-none focus:border-[#C5A059]"
                  />
                </div>

                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Subject:</label>
                  <select
                    value={quizSubject}
                    onChange={(e) => setQuizSubject(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-[#0E0E10] border border-[#2B2B32] text-white focus:outline-none focus:border-[#C5A059]"
                  >
                    <option value="Physics">Physics</option>
                    <option value="Mathematics">Mathematics</option>
                    <option value="Biology">Biology</option>
                    <option value="Chemistry">Chemistry</option>
                    <option value="English">English</option>
                    <option value="History">History</option>
                  </select>
                </div>

                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Duration (Minutes):</label>
                  <input
                    type="number"
                    min={5}
                    max={120}
                    value={quizDuration}
                    onChange={(e) => setQuizDuration(Number(e.target.value))}
                    className="w-full px-3 py-2.5 rounded-xl bg-[#0E0E10] border border-[#2B2B32] text-white focus:outline-none focus:border-[#C5A059]"
                  />
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-[#16161A] border border-[#28282E] space-y-3">
                <span className="text-xs font-bold text-[#C5A059] uppercase tracking-wider block">Question 1:</span>
                
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Question Prompt:</label>
                  <textarea
                    rows={2}
                    required
                    value={quizQPrompt}
                    onChange={(e) => setQuizQPrompt(e.target.value)}
                    placeholder="e.g. Which law states that the induced electromotive force in a conductor is proportional to the rate of change of magnetic flux?"
                    className="w-full px-3 py-2 rounded-xl bg-[#0E0E10] border border-[#2B2B32] text-white focus:outline-none focus:border-[#C5A059]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-slate-400 block mb-1">Option A:</label>
                    <input
                      type="text"
                      required
                      value={quizOptA}
                      onChange={(e) => setQuizOptA(e.target.value)}
                      placeholder="Faraday's Law of Induction"
                      className="w-full px-3 py-2 rounded-xl bg-[#0E0E10] border border-[#2B2B32] text-white focus:outline-none focus:border-[#C5A059]"
                    />
                  </div>
                  <div>
                    <label className="text-slate-400 block mb-1">Option B:</label>
                    <input
                      type="text"
                      required
                      value={quizOptB}
                      onChange={(e) => setQuizOptB(e.target.value)}
                      placeholder="Coulomb's Law"
                      className="w-full px-3 py-2 rounded-xl bg-[#0E0E10] border border-[#2B2B32] text-white focus:outline-none focus:border-[#C5A059]"
                    />
                  </div>
                  <div>
                    <label className="text-slate-400 block mb-1">Option C:</label>
                    <input
                      type="text"
                      required
                      value={quizOptC}
                      onChange={(e) => setQuizOptC(e.target.value)}
                      placeholder="Newton's Law of Universal Gravitation"
                      className="w-full px-3 py-2 rounded-xl bg-[#0E0E10] border border-[#2B2B32] text-white focus:outline-none focus:border-[#C5A059]"
                    />
                  </div>
                  <div>
                    <label className="text-slate-400 block mb-1">Option D:</label>
                    <input
                      type="text"
                      required
                      value={quizOptD}
                      onChange={(e) => setQuizOptD(e.target.value)}
                      placeholder="Ohm's Law"
                      className="w-full px-3 py-2 rounded-xl bg-[#0E0E10] border border-[#2B2B32] text-white focus:outline-none focus:border-[#C5A059]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="text-slate-300 font-semibold block mb-1">Correct Answer:</label>
                    <select
                      value={quizCorrectIdx}
                      onChange={(e) => setQuizCorrectIdx(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl bg-[#0E0E10] border border-[#2B2B32] text-white focus:outline-none focus:border-[#C5A059]"
                    >
                      <option value={0}>Option A (Correct)</option>
                      <option value={1}>Option B (Correct)</option>
                      <option value={2}>Option C (Correct)</option>
                      <option value={3}>Option D (Correct)</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-slate-300 font-semibold block mb-1">Socratic Hint:</label>
                    <input
                      type="text"
                      value={quizHint}
                      onChange={(e) => setQuizHint(e.target.value)}
                      placeholder="Hint: Named after Michael..."
                      className="w-full px-3 py-2 rounded-xl bg-[#0E0E10] border border-[#2B2B32] text-white focus:outline-none focus:border-[#C5A059]"
                    />
                  </div>

                  <div>
                    <label className="text-slate-300 font-semibold block mb-1">Solution Explanation:</label>
                    <input
                      type="text"
                      value={quizExplanation}
                      onChange={(e) => setQuizExplanation(e.target.value)}
                      placeholder="Explanation: EMF = -dΦ/dt..."
                      className="w-full px-3 py-2 rounded-xl bg-[#0E0E10] border border-[#2B2B32] text-white focus:outline-none focus:border-[#C5A059]"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  className="px-6 py-3 rounded-xl bg-[#C5A059] hover:bg-[#d8b168] text-black font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-[#C5A059]/20"
                >
                  <FileQuestion className="w-4 h-4" />
                  <span>Save & Publish Examination</span>
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Tab 4: Student Results */}
        {activeTab === 'student-results' && (
          <div className="bg-[#121214] border border-[#222226] rounded-3xl overflow-hidden shadow-xl space-y-4">
            <div className="p-5 border-b border-[#222226] flex items-center justify-between">
              <div>
                <h3 className="font-serif font-bold text-lg text-white">Student Quiz Submissions & Score History</h3>
                <p className="text-xs text-slate-400">Live submission records with timestamps, scores, and duration</p>
              </div>
              <span className="text-xs text-[#C5A059] font-bold">
                {quizAttempts.length} Submissions Logged
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead className="bg-[#18181C] text-slate-400 uppercase text-[10px] tracking-wider border-b border-[#222226]">
                  <tr>
                    <th className="py-3 px-4">Student</th>
                    <th className="py-3 px-4">Exam Title</th>
                    <th className="py-3 px-4">Subject</th>
                    <th className="py-3 px-4 text-center">Score</th>
                    <th className="py-3 px-4 text-center">Percentage</th>
                    <th className="py-3 px-4 text-right">Date Completed</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1E1E24]">
                  {quizAttempts.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-slate-400">
                        No submissions yet. Encourage students to take the 20-question practice exams!
                      </td>
                    </tr>
                  ) : (
                    quizAttempts.map((att) => (
                      <tr key={att.id} className="hover:bg-[#16161A] transition-colors">
                        <td className="py-4 px-4 font-bold text-white">{att.studentName || 'Student Scholar'}</td>
                        <td className="py-4 px-4 text-slate-200">{att.quizTitle}</td>
                        <td className="py-4 px-4 text-[#C5A059] font-semibold">{att.subjectName}</td>
                        <td className="py-4 px-4 text-center font-mono">{att.score} / {att.totalQuestions}</td>
                        <td className="py-4 px-4 text-center">
                          <span
                            className={`px-2.5 py-0.5 rounded-full font-bold text-xs ${
                              att.percentage >= 85
                                ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                                : att.percentage >= 70
                                ? 'bg-amber-950 text-amber-300 border border-amber-800'
                                : 'bg-rose-950 text-rose-300 border border-rose-800'
                            }`}
                          >
                            {att.percentage}%
                          </span>
                        </td>
                        <td className="py-4 px-4 text-right text-slate-400 text-xs">{att.date}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 5: Feedback & Comments */}
        {activeTab === 'feedback' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Feedback Form (1 Col) */}
            <div className="bg-[#121214] border border-[#222226] rounded-3xl p-5 space-y-4 shadow-xl">
              <div className="border-b border-[#222226] pb-3">
                <h3 className="font-serif font-bold text-base text-white">Write Academic Feedback</h3>
                <p className="text-xs text-slate-400">Send personalized feedback directly to student</p>
              </div>

              {feedbackSuccessMsg && (
                <div className="bg-emerald-950/80 border border-emerald-600 text-emerald-200 px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{feedbackSuccessMsg}</span>
                </div>
              )}

              <form onSubmit={handleSendFeedback} className="space-y-3 text-xs">
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Select Student:</label>
                  <select
                    value={selectedStudentForFeedback}
                    onChange={(e) => setSelectedStudentForFeedback(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#0E0E10] border border-[#2B2B32] text-white focus:outline-none focus:border-[#C5A059]"
                  >
                    {SAMPLE_STUDENTS.map((s) => (
                      <option key={s.id} value={s.name}>
                        {s.name} ({s.rollNo})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Subject:</label>
                  <select
                    value={feedbackSubject}
                    onChange={(e) => setFeedbackSubject(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#0E0E10] border border-[#2B2B32] text-white focus:outline-none focus:border-[#C5A059]"
                  >
                    <option value="Mathematics">Mathematics</option>
                    <option value="Physics">Physics</option>
                    <option value="Biology">Biology</option>
                    <option value="Chemistry">Chemistry</option>
                    <option value="English">English</option>
                    <option value="History">History</option>
                  </select>
                </div>

                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Rating / Performance:</label>
                  <select
                    value={feedbackRating}
                    onChange={(e) => setFeedbackRating(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-[#0E0E10] border border-[#2B2B32] text-white focus:outline-none focus:border-[#C5A059]"
                  >
                    <option value={5}>⭐⭐⭐⭐⭐ 5 Stars (Exceptional)</option>
                    <option value={4}>⭐⭐⭐⭐ 4 Stars (Very Good)</option>
                    <option value={3}>⭐⭐⭐ 3 Stars (Satisfactory)</option>
                    <option value={2}>⭐⭐ 2 Stars (Needs Improvement)</option>
                  </select>
                </div>

                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Teacher Feedback Comment:</label>
                  <textarea
                    rows={4}
                    required
                    value={feedbackComment}
                    onChange={(e) => setFeedbackComment(e.target.value)}
                    placeholder="Describe specific strengths and areas needing review..."
                    className="w-full px-3 py-2 rounded-xl bg-[#0E0E10] border border-[#2B2B32] text-white focus:outline-none focus:border-[#C5A059]"
                  />
                </div>

                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Action Item / Recommendation:</label>
                  <input
                    type="text"
                    value={feedbackActionItem}
                    onChange={(e) => setFeedbackActionItem(e.target.value)}
                    placeholder="e.g. Complete Chapter 4 Practice Exam"
                    className="w-full px-3 py-2 rounded-xl bg-[#0E0E10] border border-[#2B2B32] text-white focus:outline-none focus:border-[#C5A059]"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-[#C5A059] hover:bg-[#d8b168] text-black font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-md shadow-[#C5A059]/20"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send Feedback to Student</span>
                </button>
              </form>
            </div>

            {/* Feedback History Log (2 Cols) */}
            <div className="lg:col-span-2 space-y-4">
              <div className="flex items-center justify-between border-b border-[#1E1E22] pb-3">
                <h3 className="font-serif font-bold text-base text-white">Sent Academic Feedbacks</h3>
                <span className="text-xs text-slate-400">{feedbacks.length} records</span>
              </div>

              <div className="space-y-3">
                {feedbacks.map((fb) => (
                  <div
                    key={fb.id}
                    className="bg-[#121214] border border-[#222226] rounded-2xl p-5 space-y-3 shadow-md"
                  >
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white text-sm">{fb.studentName}</span>
                        <span className="px-2 py-0.5 rounded-md bg-[#1E1E24] text-[#C5A059] text-xs font-semibold">
                          {fb.subjectName}
                        </span>
                        <span className="text-xs text-slate-400">({fb.grade})</span>
                      </div>
                      <span className="text-xs text-slate-500">{fb.date}</span>
                    </div>

                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed italic">
                      "{fb.comment}"
                    </p>

                    {fb.actionItem && (
                      <div className="p-2.5 rounded-xl bg-[#18181D] border border-[#26262E] text-xs text-[#C5A059] flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 shrink-0 text-[#C5A059]" />
                        <span>Action Item: {fb.actionItem}</span>
                      </div>
                    )}

                    <div className="text-[11px] text-slate-500 flex items-center justify-between pt-1 border-t border-[#1E1E24]">
                      <span>Instructor: {fb.teacherName}</span>
                      <span>Rating: {'★'.repeat(fb.rating || 5)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};
