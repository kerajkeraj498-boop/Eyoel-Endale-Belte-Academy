import { QuizAttempt, NoteChapter, Quiz, GradeLevel, LearningRecommendation } from '../types';

export interface SubjectDiagnostic {
  subjectName: string;
  attemptsCount: number;
  averageScore: number;
  highestScore: number;
  status: 'strong' | 'moderate' | 'weak' | 'untested';
  statusLabel: string;
  weakTopics: string[];
}

export function analyzeStudentPerformance(
  quizAttempts: QuizAttempt[],
  notes: NoteChapter[],
  quizzes: Quiz[],
  studentGrade: GradeLevel
): {
  subjectDiagnostics: SubjectDiagnostic[];
  strongSubjects: SubjectDiagnostic[];
  weakSubjects: SubjectDiagnostic[];
  recommendations: LearningRecommendation[];
  overallAverage: number;
  totalQuizzesTaken: number;
} {
  // Map scores per subject
  const subjectScores: Record<string, number[]> = {};
  const allKnownSubjects = ['Mathematics', 'Physics', 'Biology', 'Chemistry', 'English', 'History', 'Geography', 'Economics'];

  allKnownSubjects.forEach((s) => {
    subjectScores[s] = [];
  });

  quizAttempts.forEach((attempt) => {
    const sName = attempt.subjectName || 'General';
    if (!subjectScores[sName]) subjectScores[sName] = [];
    subjectScores[sName].push(attempt.percentage);
  });

  const diagnostics: SubjectDiagnostic[] = [];

  for (const [subjectName, scores] of Object.entries(subjectScores)) {
    if (scores.length === 0) {
      diagnostics.push({
        subjectName,
        attemptsCount: 0,
        averageScore: 0,
        highestScore: 0,
        status: 'untested',
        statusLabel: 'Not Attempted Yet',
        weakTopics: ['Curriculum diagnostic pending first practice quiz'],
      });
      continue;
    }

    const avg = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
    const max = Math.max(...scores);

    let status: 'strong' | 'moderate' | 'weak' = 'moderate';
    let statusLabel = 'Satisfactory Mastery (70–79%)';
    const weakTopics: string[] = [];

    if (avg >= 80) {
      status = 'strong';
      statusLabel = 'Strong Subject (80–100%)';
    } else if (avg < 70) {
      status = 'weak';
      statusLabel = 'Needs Priority Focus (< 70%)';
      if (subjectName === 'Mathematics') weakTopics.push('Calculus & Derivatives', 'Coordinate Geometry');
      else if (subjectName === 'Physics') weakTopics.push('Electromagnetism & Induction', 'Vector Mechanics');
      else if (subjectName === 'Chemistry') weakTopics.push('Chemical Equilibrium', 'Reaction Kinetics');
      else if (subjectName === 'Biology') weakTopics.push('Genetics & Punnett Squares', 'Cellular Respiration');
      else weakTopics.push('Core Unit Terminology', 'Exam Review');
    }

    diagnostics.push({
      subjectName,
      attemptsCount: scores.length,
      averageScore: avg,
      highestScore: max,
      status,
      statusLabel,
      weakTopics,
    });
  }

  const strongSubjects = diagnostics.filter((d) => d.status === 'strong');
  const weakSubjects = diagnostics.filter((d) => d.status === 'weak' || d.status === 'untested');

  // Build targeted recommendations
  const recommendations: LearningRecommendation[] = [];

  // 1. Weak subject lessons
  weakSubjects.slice(0, 2).forEach((ws, idx) => {
    const matchingNote = notes.find(
      (n) => n.subjectName.toLowerCase() === ws.subjectName.toLowerCase()
    ) || notes[0];

    if (matchingNote) {
      recommendations.push({
        id: `rec-note-${idx}`,
        type: 'lesson',
        title: `Study Chapter: ${matchingNote.title}`,
        subjectName: ws.subjectName,
        grade: studentGrade,
        reason: ws.attemptsCount === 0
          ? 'Build your foundational knowledge in this untested subject'
          : `Improve score from current average of ${ws.averageScore}%`,
        priority: 'high',
        targetId: matchingNote.id,
        actionLabel: 'Read Study Notes',
        estimatedMinutes: matchingNote.readingTimeMinutes || 25,
      });
    }
  });

  // 2. Targeted quiz recommendation
  const quizCandidate = quizzes.find((q) => {
    return weakSubjects.some((w) => w.subjectName.toLowerCase() === q.subjectName.toLowerCase());
  }) || quizzes[0];

  if (quizCandidate) {
    recommendations.push({
      id: 'rec-quiz-target',
      type: 'quiz',
      title: `Practice Exam: ${quizCandidate.title}`,
      subjectName: quizCandidate.subjectName,
      grade: studentGrade,
      reason: 'Take this 20-question simulator to test retention and earn XP points',
      priority: 'high',
      targetId: quizCandidate.id,
      actionLabel: 'Take Practice Quiz',
      estimatedMinutes: quizCandidate.durationMinutes || 20,
    });
  }

  // 3. Review recommendation
  const reviewSubject = weakSubjects[0] ? weakSubjects[0].subjectName : 'General';
  recommendations.push({
    id: 'rec-review-ai',
    type: 'review',
    title: `Socratic Review: ${reviewSubject} Key Formulas`,
    subjectName: reviewSubject,
    grade: studentGrade,
    reason: 'Consult Eyoel Academy AI Study Tutor for step-by-step Socratic hints and simple analogies',
    priority: 'medium',
    targetId: reviewSubject,
    actionLabel: 'Ask AI Tutor',
    estimatedMinutes: 15,
  });

  const totalQuizzesTaken = quizAttempts.length;
  const overallAverage = totalQuizzesTaken > 0
    ? Math.round(quizAttempts.reduce((acc, q) => acc + q.percentage, 0) / totalQuizzesTaken)
    : 0;

  return {
    subjectDiagnostics: diagnostics,
    strongSubjects,
    weakSubjects,
    recommendations,
    overallAverage,
    totalQuizzesTaken,
  };
}
