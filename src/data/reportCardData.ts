import { StudentReportCard, SubjectReportScore, GradeLevel, SubjectStream } from '../types';

export const calculateLetterGrade = (totalMark: number): { letter: 'A+' | 'A' | 'B+' | 'B' | 'C+' | 'C' | 'D' | 'F'; gpa: number; remark: string } => {
  if (totalMark >= 90) return { letter: 'A+', gpa: 4.0, remark: 'Excellent' };
  if (totalMark >= 85) return { letter: 'A', gpa: 4.0, remark: 'Very Good' };
  if (totalMark >= 80) return { letter: 'B+', gpa: 3.5, remark: 'Good' };
  if (totalMark >= 75) return { letter: 'B', gpa: 3.0, remark: 'Above Average' };
  if (totalMark >= 65) return { letter: 'C+', gpa: 2.5, remark: 'Satisfactory' };
  if (totalMark >= 50) return { letter: 'C', gpa: 2.0, remark: 'Passing' };
  if (totalMark >= 40) return { letter: 'D', gpa: 1.0, remark: 'Conditional' };
  return { letter: 'F', gpa: 0.0, remark: 'Failed' };
};

export const generateDefaultSubjectScores = (
  grade: GradeLevel,
  stream: SubjectStream,
  seedScore: number = 88
): SubjectReportScore[] => {
  const commonSubjects = [
    { id: 'math', name: 'Mathematics' },
    { id: 'english', name: 'English Language' },
    { id: 'it', name: 'Information Technology' },
    { id: 'civics', name: 'Civics & Ethics' },
  ];

  let streamSpecific: { id: string; name: string }[] = [];

  if (grade === 'Grade 9' || grade === 'Grade 10') {
    streamSpecific = [
      { id: 'physics', name: 'Physics' },
      { id: 'chemistry', name: 'Chemistry' },
      { id: 'biology', name: 'Biology' },
      { id: 'history', name: 'History' },
      { id: 'geography', name: 'Geography' },
      { id: 'economics', name: 'Economics' },
    ];
  } else if (stream === 'Natural Science') {
    streamSpecific = [
      { id: 'physics', name: 'Physics' },
      { id: 'chemistry', name: 'Chemistry' },
      { id: 'biology', name: 'Biology' },
      { id: 'technical-drawing', name: 'Technical Drawing & CAD' },
    ];
  } else {
    streamSpecific = [
      { id: 'history', name: 'History' },
      { id: 'geography', name: 'Geography' },
      { id: 'economics', name: 'Economics' },
      { id: 'general-business', name: 'General Business' },
    ];
  }

  const allSubjects = [...commonSubjects, ...streamSpecific];

  return allSubjects.map((sub, idx) => {
    // Generate realistic balanced score near seedScore
    const variation = ((idx * 7) % 13) - 6;
    const finalTotal = Math.min(100, Math.max(55, Math.round(seedScore + variation)));
    
    // Deconstruct into 10% class activity, 15% quiz/assignment, 25% mid-exam, 50% final exam
    const classActivity = Math.min(10, Math.max(7, Math.round(finalTotal * 0.1)));
    const testsAndAssignments = Math.min(15, Math.max(10, Math.round(finalTotal * 0.15)));
    const midExam = Math.min(25, Math.max(16, Math.round(finalTotal * 0.25)));
    const finalExam = Math.min(50, Math.max(25, finalTotal - (classActivity + testsAndAssignments + midExam)));
    const calculatedTotal = classActivity + testsAndAssignments + midExam + finalExam;

    const { letter, gpa, remark } = calculateLetterGrade(calculatedTotal);

    return {
      subjectId: sub.id,
      subjectName: sub.name,
      classActivity,
      testsAndAssignments,
      midExam,
      finalExam,
      totalMark: calculatedTotal,
      letterGrade: letter,
      gradePoint: gpa,
      remarks: remark,
    };
  });
};

export const calculateReportCardStats = (subjects: SubjectReportScore[]) => {
  if (!subjects.length) {
    return { totalScore: 0, averageScore: 0, gpa: 0 };
  }

  const totalScore = subjects.reduce((sum, s) => sum + s.totalMark, 0);
  const averageScore = Math.round((totalScore / subjects.length) * 10) / 10;
  const totalGpa = subjects.reduce((sum, s) => sum + s.gradePoint, 0);
  const gpa = Math.round((totalGpa / subjects.length) * 100) / 100;

  return { totalScore, averageScore, gpa };
};

export const createInitialReportCard = (
  studentName: string = 'Eyoel Endale',
  grade: GradeLevel = 'Grade 12',
  stream: SubjectStream = 'Natural Science',
  semester: 'Semester 1' | 'Semester 2' | 'Annual' = 'Annual'
): StudentReportCard => {
  const subjects = generateDefaultSubjectScores(grade, stream, 89);
  const { totalScore, averageScore, gpa } = calculateReportCardStats(subjects);

  return {
    id: `rep-${Date.now()}`,
    studentName,
    studentRollNo: `EA-${grade.replace('Grade ', 'G')}-${Math.floor(1000 + Math.random() * 9000)}`,
    academicYear: '2025/2026 Academic Year (2018 E.C.)',
    grade,
    stream,
    semester,
    conduct: 'A (Excellent)',
    attendanceDays: 178,
    totalSchoolDays: 180,
    subjects,
    totalScore,
    averageScore,
    gpa,
    rank: 1,
    totalStudentsInClass: 42,
    homeroomTeacher: 'Ato Sisay Hailu (M.Sc. Education)',
    academicDirector: 'Dr. Tsegaye Alemu',
    generalDirector: 'Eyoel Endale Belete',
    issueDate: new Date().toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }),
  };
};
