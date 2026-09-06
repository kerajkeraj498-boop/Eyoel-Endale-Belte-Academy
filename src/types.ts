export type GradeLevel = 'Grade 9' | 'Grade 10' | 'Grade 11' | 'Grade 12';

export type Language = 'en' | 'am' | 'om';

export type SubjectStream = 'General' | 'Natural Science' | 'Social Science';

export type UserRole = 'student' | 'teacher' | 'admin';

export interface Subject {
  id: string;
  name: string;
  code: string;
  icon: string; // Lucide icon identifier
  color: string; // Tailwind color string, e.g. "emerald", "blue", "indigo"
  description: string;
  grades: GradeLevel[];
  stream: SubjectStream;
  unitCount: number;
  noteCount: number;
  quizCount: number;
  topics: string[];
}

export interface NoteChapter {
  id: string;
  subjectId: string;
  subjectName: string;
  grade: GradeLevel;
  chapterNumber: number;
  unitNumber?: number;
  title: string;
  readingTimeMinutes: number;
  summary: string;
  tableOfContents: string[];
  keyTerms: { term: string; definition: string }[];
  formulas?: { name: string; formula: string; explanation: string }[];
  videoUrl?: string;
  resourceUrl?: string;
  resourceName?: string;
  content: {
    sectionTitle: string;
    body: string;
    bulletPoints?: string[];
    calloutBox?: { title: string; text: string; type: 'info' | 'warning' | 'tip' };
  }[];
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
  hint?: string;
}

export interface Quiz {
  id: string;
  subjectId: string;
  subjectName: string;
  grade: GradeLevel;
  title: string;
  chapterId?: string;
  chapterTitle?: string;
  durationMinutes: number;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  questions: QuizQuestion[];
}

export interface QuizAttempt {
  id: string;
  userId?: string;
  studentName?: string;
  studentEmail?: string;
  quizId: string;
  quizTitle: string;
  subjectName: string;
  grade: GradeLevel;
  score: number;
  totalQuestions: number;
  percentage: number;
  date: string;
  timeSpentSeconds: number;
  userAnswers: number[]; // chosen option indexes
}

export interface Bookmark {
  noteId: string;
  noteTitle: string;
  subjectName: string;
  grade: GradeLevel;
  savedAt: string;
}

export interface Flashcard {
  id: string;
  subjectName: string;
  grade: GradeLevel;
  topic: string;
  front: string;
  back: string;
}

export interface ContactMessage {
  name: string;
  email: string;
  grade: GradeLevel;
  subject: string;
  category: 'General Inquiry' | 'Notes Feedback' | 'Quiz Question Clarification' | 'Technical Support';
  message: string;
}

export interface CertificateRecord {
  id: string;
  studentName: string;
  subjectName: string;
  grade: GradeLevel;
  issueDate: string;
  scorePercentage: number;
  certificateNumber: string;
  distinction: 'First Class Honors' | 'Excellence Distinction' | 'Proficiency Pass';
  verified?: boolean;
}

export interface StudentUser {
  id: string;
  studentId?: string; // e.g. EYOEL-STU-2026-0842
  name: string;
  username?: string;
  email: string;
  grade: GradeLevel;
  stream: SubjectStream;
  role?: UserRole;
  avatar: string;
  photoURL?: string;
  phoneNumber?: string;
  targetScore: number;
  studyStreakDays: number;
  joinedDate: string;
  bio: string;
  notesCompleted: string[];
  bookmarks?: string[];
  badges?: string[];
  xp?: number;
  level?: number;
  preferredLanguage?: Language;
  certificates: CertificateRecord[];
  totalScore?: number;
  quizCount?: number;
  totalStudyMinutes?: number;
  pomodoroSessionsCompleted?: number;
}

export interface BadgeRecord {
  id: string;
  name: string;
  icon: string;
  description: string;
  category: 'quiz' | 'streak' | 'course' | 'mastery' | 'special';
  unlocked: boolean;
  earnedAt?: string;
  xpReward: number;
}

export interface LeaderboardEntry {
  id: string;
  rank: number;
  name: string;
  studentId?: string;
  avatar: string;
  grade: GradeLevel;
  stream: SubjectStream;
  xp: number;
  level: number;
  streak: number;
  badgesCount: number;
  isCurrentUser?: boolean;
}

export interface StudyTask {
  id: string;
  userId?: string;
  title: string;
  subjectName: string;
  grade?: GradeLevel;
  dueDate: string;
  completed: boolean;
  priority: 'high' | 'medium' | 'low';
  type: 'daily' | 'weekly';
  estimatedMinutes: number;
  reminderTime?: string;
  createdAt: string;
}

export interface WeeklyGoal {
  id: string;
  title: string;
  category: 'study_time' | 'quizzes_completed' | 'notes_read' | 'score_average';
  current: number;
  target: number;
  unit: string;
  completed: boolean;
}

export interface TeacherFeedback {
  id: string;
  teacherId: string;
  teacherName: string;
  studentId: string;
  studentName: string;
  subjectName: string;
  grade: GradeLevel;
  comment: string;
  date: string;
  rating?: number; // 1-5 stars or points
  actionItem?: string;
}

export interface DirectMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderRole?: UserRole;
  senderAvatar?: string;
  recipientId: string;
  recipientName: string;
  recipientRole?: UserRole;
  subject?: string;
  text: string;
  timestamp: string;
  read: boolean;
}

export interface LearningRecommendation {
  id: string;
  type: 'lesson' | 'quiz' | 'review';
  title: string;
  subjectName: string;
  grade: GradeLevel;
  reason: string;
  priority: 'high' | 'medium';
  targetId: string; // noteId or quizId or subjectId
  actionLabel: string;
  estimatedMinutes: number;
}

export interface InAppNotification {
  id: string;
  userId?: string;
  title: string;
  message: string;
  type: 'lesson' | 'quiz' | 'exam' | 'certificate' | 'report-card' | 'announcement' | 'message' | 'planner';
  date: string;
  read: boolean;
  linkTab?: ViewTab;
}

export type NotificationItem = InAppNotification;

export interface Announcement {
  id: string;
  title: string;
  content: string;
  author: string;
  authorRole?: UserRole;
  date: string;
  category: 'academic' | 'exam' | 'event' | 'system';
  targetGrades?: GradeLevel[];
  urgent?: boolean;
}

export interface SubjectReportScore {
  subjectId: string;
  subjectName: string;
  classActivity: number; // Max 10
  testsAndAssignments: number; // Max 15
  midExam: number; // Max 25
  finalExam: number; // Max 50
  totalMark: number; // Max 100
  letterGrade: 'A+' | 'A' | 'B+' | 'B' | 'C+' | 'C' | 'D' | 'F';
  gradePoint: number; // 4.0, 3.75, 3.5, 3.0, 2.75, 2.0, 1.0, 0.0
  remarks: string;
}

export interface StudentReportCard {
  id: string;
  studentId?: string;
  studentName: string;
  studentRollNo: string;
  academicYear: string;
  grade: GradeLevel;
  stream: SubjectStream;
  semester: 'Semester 1' | 'Semester 2' | 'Annual';
  conduct: 'A (Excellent)' | 'B (Very Good)' | 'C (Good)';
  attendanceDays: number;
  totalSchoolDays: number;
  subjects: SubjectReportScore[];
  totalScore: number;
  averageScore: number;
  gpa: number;
  rank: number;
  totalStudentsInClass: number;
  homeroomTeacher: string;
  academicDirector: string;
  generalDirector: string;
  issueDate: string;
}

export type ViewTab =
  | 'home'
  | 'subjects'
  | 'notes'
  | 'quizzes'
  | 'planner'
  | 'teacher'
  | 'messages'
  | 'leaderboard'
  | 'analytics'
  | 'offline'
  | 'report-card'
  | 'about'
  | 'contact'
  | 'login'
  | 'register'
  | 'forgot-password'
  | 'dashboard'
  | 'verify-certificate'
  | 'verify-report-card';


