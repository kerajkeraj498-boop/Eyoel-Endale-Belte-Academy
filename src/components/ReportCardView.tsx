import React, { useState } from 'react';
import {
  FileText,
  Printer,
  Download,
  Award,
  CheckCircle2,
  TrendingUp,
  ShieldCheck,
  Edit3,
  RefreshCw,
  Sparkles,
  Calendar,
  User,
  GraduationCap,
  Percent,
  Check,
  BookOpen,
  Info,
  ChevronDown,
} from 'lucide-react';
import {
  StudentReportCard,
  SubjectReportScore,
  GradeLevel,
  SubjectStream,
  Language,
  ViewTab,
  StudentUser,
  QuizAttempt,
} from '../types';
import {
  calculateLetterGrade,
  calculateReportCardStats,
  createInitialReportCard,
  generateDefaultSubjectScores,
} from '../data/reportCardData';
import { TRANSLATIONS } from '../lib/translations';

interface ReportCardViewProps {
  language: Language;
  currentUser?: StudentUser | null;
  quizAttempts?: QuizAttempt[];
  onTabChange: (tab: ViewTab) => void;
  onOpenCertificateModal?: () => void;
}

export const ReportCardView: React.FC<ReportCardViewProps> = ({
  language,
  currentUser,
  quizAttempts = [],
  onTabChange,
  onOpenCertificateModal,
}) => {
  const [selectedGrade, setSelectedGrade] = useState<GradeLevel>(currentUser?.grade || 'Grade 12');
  const [selectedStream, setSelectedStream] = useState<SubjectStream>(currentUser?.stream || 'Natural Science');
  const [selectedSemester, setSelectedSemester] = useState<'Semester 1' | 'Semester 2' | 'Annual'>('Annual');
  const [isEditing, setIsEditing] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Initialize report card based on student state
  const [reportCard, setReportCard] = useState<StudentReportCard>(() =>
    createInitialReportCard(
      currentUser?.name || 'Scholar Student',
      currentUser?.grade || 'Grade 12',
      currentUser?.stream || 'Natural Science',
      'Annual'
    )
  );

  const t = TRANSLATIONS[language] || TRANSLATIONS.en;

  // Handle Score Input Change
  const handleScoreChange = (
    index: number,
    field: 'classActivity' | 'testsAndAssignments' | 'midExam' | 'finalExam',
    value: number
  ) => {
    const updatedSubjects = [...reportCard.subjects];
    const target = { ...updatedSubjects[index] };

    // Max limits: Activity (10), Tests (15), Mid (25), Final (50)
    let max = 10;
    if (field === 'testsAndAssignments') max = 15;
    if (field === 'midExam') max = 25;
    if (field === 'finalExam') max = 50;

    const clampedVal = Math.max(0, Math.min(max, isNaN(value) ? 0 : value));
    target[field] = clampedVal;

    // Recalculate total mark
    target.totalMark = target.classActivity + target.testsAndAssignments + target.midExam + target.finalExam;
    const { letter, gpa, remark } = calculateLetterGrade(target.totalMark);
    target.letterGrade = letter;
    target.gradePoint = gpa;
    target.remarks = remark;

    updatedSubjects[index] = target;

    const stats = calculateReportCardStats(updatedSubjects);
    setReportCard((prev) => ({
      ...prev,
      subjects: updatedSubjects,
      totalScore: stats.totalScore,
      averageScore: stats.averageScore,
      gpa: stats.gpa,
    }));
  };

  // Sync with user's quiz attempts
  const handleSyncFromQuizzes = () => {
    if (!quizAttempts.length) {
      setToastMessage(
        language === 'am'
          ? 'እስካሁን የተጠናቀቁ የፈተና ውጤቶች የሉም። እባክዎ መጀመሪያ ፈተና ይውሰዱ!'
          : 'No quiz attempts found to sync. Take a quiz or final exam first!'
      );
      setTimeout(() => setToastMessage(null), 4000);
      return;
    }

    const updatedSubjects = reportCard.subjects.map((sub) => {
      // Find matching attempts for this subject
      const matching = quizAttempts.filter(
        (qa) => qa.subjectName.toLowerCase() === sub.subjectName.toLowerCase()
      );

      if (matching.length > 0) {
        const latestAttempt = matching[matching.length - 1];
        const finalScoreOutOf50 = Math.round((latestAttempt.percentage / 100) * 50);
        const newTotal = sub.classActivity + sub.testsAndAssignments + sub.midExam + finalScoreOutOf50;
        const { letter, gpa, remark } = calculateLetterGrade(newTotal);

        return {
          ...sub,
          finalExam: finalScoreOutOf50,
          totalMark: newTotal,
          letterGrade: letter,
          gradePoint: gpa,
          remarks: remark,
        };
      }
      return sub;
    });

    const stats = calculateReportCardStats(updatedSubjects);
    setReportCard((prev) => ({
      ...prev,
      subjects: updatedSubjects,
      totalScore: stats.totalScore,
      averageScore: stats.averageScore,
      gpa: stats.gpa,
    }));
    setIsEditing(false);
    setToastMessage(
      language === 'am'
        ? 'የፈተና ውጤቶችዎ በተሳካ ሁኔታ ከሪፖርት ካርዱ ጋር ተመሳስለዋል!'
        : 'Exam marks synchronized successfully to the report card!'
    );
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Regenerate based on Grade / Stream change
  const handleGradeStreamChange = (newGrade: GradeLevel, newStream: SubjectStream) => {
    setSelectedGrade(newGrade);
    setSelectedStream(newStream);
    const newSubjects = generateDefaultSubjectScores(newGrade, newStream, 88);
    const stats = calculateReportCardStats(newSubjects);
    setReportCard((prev) => ({
      ...prev,
      grade: newGrade,
      stream: newStream,
      subjects: newSubjects,
      totalScore: stats.totalScore,
      averageScore: stats.averageScore,
      gpa: stats.gpa,
      studentRollNo: `EA-${newGrade.replace('Grade ', 'G')}-${Math.floor(1000 + Math.random() * 9000)}`,
    }));
  };

  // Print function
  const handlePrint = () => {
    window.print();
  };

  // Copy Verification Link
  const handleCopyLink = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  return (
    <div className="min-h-screen bg-[#0E0E10] text-[#E0E0E0] py-8 px-4 sm:px-6 lg:px-8">
      {/* Top Controls Bar (Hidden during printing) */}
      <div className="max-w-5xl mx-auto mb-6 space-y-4 no-print">
        {toastMessage && (
          <div className="p-3.5 rounded-xl bg-[#1A1A1E] border-2 border-[#C5A059] text-[#C5A059] flex items-center justify-between text-xs font-semibold shadow-xl animate-fade-in">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#C5A059]" />
              <span>{toastMessage}</span>
            </div>
            <button
              onClick={() => setToastMessage(null)}
              className="text-slate-400 hover:text-white text-xs px-2 py-0.5"
            >
              ✕
            </button>
          </div>
        )}

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 sm:p-5 rounded-2xl bg-[#141416] border border-[#2D2D30] shadow-xl">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-[#C5A059]/15 border border-[#C5A059]/30 flex items-center justify-center text-[#C5A059] shadow-inner">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-serif font-bold text-white tracking-wide flex items-center gap-2">
                <span>{language === 'am' ? 'የተማሪ ኦፊሴላዊ የውጤት ካርድ' : language === 'om' ? 'Waraqaa Qabxii Barataa' : 'Official Academic Report Card'}</span>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-sans font-bold uppercase tracking-wider bg-[#C5A059]/20 text-[#C5A059] border border-[#C5A059]/40">
                  {selectedSemester}
                </span>
              </h1>
              <p className="text-xs text-slate-400 mt-0.5">
                {language === 'am'
                  ? 'የኢትዮጵያ ሁለተኛ ደረጃ የትምህርት ካሪኩለም ውጤት መዝገብና ትራንስክሪፕት'
                  : 'Ethiopian Secondary Education Official Cumulative Transcript & Assessment Record'}
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => setIsEditing(!isEditing)}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors border ${
                isEditing
                  ? 'bg-[#C5A059] text-black border-[#C5A059]'
                  : 'bg-[#1C1C1F] text-slate-200 border-[#2D2D30] hover:border-[#C5A059]'
              }`}
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>{isEditing ? (language === 'am' ? 'ማስተካከል አብቃ' : 'Done Editing') : (language === 'am' ? 'ውጤት ቀይር' : 'Customize Scores')}</span>
            </button>

            <button
              onClick={handleSyncFromQuizzes}
              className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-[#1C1C1F] text-slate-200 border border-[#2D2D30] hover:border-[#C5A059] flex items-center gap-1.5 transition-colors"
              title="Sync with recent Final Exam and Quiz scores"
            >
              <RefreshCw className="w-3.5 h-3.5 text-[#C5A059]" />
              <span>{language === 'am' ? 'ከፈተና ውጤት አመሳስል' : 'Sync Exam Marks'}</span>
            </button>

            <button
              onClick={handlePrint}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-[#C5A059] hover:bg-[#d8b168] text-black flex items-center gap-1.5 transition-colors shadow-lg shadow-[#C5A059]/15"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>{language === 'am' ? 'አትም / PDF አውርድ' : 'Print / Download PDF'}</span>
            </button>
          </div>
        </div>

        {/* Filter / Grade Switcher Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-xl bg-[#141416] border border-[#2D2D30] text-xs">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-semibold text-slate-400">{language === 'am' ? 'ክፍል ምረጥ:' : 'Select Grade:'}</span>
            {(['Grade 9', 'Grade 10', 'Grade 11', 'Grade 12'] as GradeLevel[]).map((g) => (
              <button
                key={g}
                onClick={() => handleGradeStreamChange(g, selectedStream)}
                className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                  selectedGrade === g
                    ? 'bg-[#C5A059] text-black font-bold shadow'
                    : 'bg-[#1C1C1F] text-slate-300 hover:text-white border border-[#2D2D30]'
                }`}
              >
                {g}
              </button>
            ))}
          </div>

          {(selectedGrade === 'Grade 11' || selectedGrade === 'Grade 12') && (
            <div className="flex items-center gap-2">
              <span className="font-semibold text-slate-400">{language === 'am' ? 'ዘርፍ:' : 'Stream:'}</span>
              {(['Natural Science', 'Social Science'] as SubjectStream[]).map((s) => (
                <button
                  key={s}
                  onClick={() => handleGradeStreamChange(selectedGrade, s)}
                  className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                    selectedStream === s
                      ? 'bg-[#C5A059] text-black font-bold shadow'
                      : 'bg-[#1C1C1F] text-slate-300 hover:text-white border border-[#2D2D30]'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          )}

          <div className="flex items-center gap-1.5 ml-auto">
            {(['Semester 1', 'Semester 2', 'Annual'] as const).map((sem) => (
              <button
                key={sem}
                onClick={() => setSelectedSemester(sem)}
                className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-colors ${
                  selectedSemester === sem
                    ? 'bg-[#C5A059]/20 text-[#C5A059] border border-[#C5A059]/50'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {sem}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* PRINTABLE OFFICIAL REPORT CARD DOCUMENT */}
      <div className="max-w-5xl mx-auto bg-[#141416] text-[#E0E0E0] border-2 border-[#C5A059]/60 rounded-3xl p-6 sm:p-10 shadow-2xl relative overflow-hidden print:border-black print:text-black print:bg-white print:p-4 print:shadow-none print:m-0">
        
        {/* Subtle Watermark Crest Background */}
        <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none select-none">
          <GraduationCap className="w-[500px] h-[500px] text-[#C5A059]" />
        </div>

        {/* Outer Gold Border Accents */}
        <div className="absolute top-3 left-3 w-8 h-8 border-t-2 border-l-2 border-[#C5A059]" />
        <div className="absolute top-3 right-3 w-8 h-8 border-t-2 border-r-2 border-[#C5A059]" />
        <div className="absolute bottom-3 left-3 w-8 h-8 border-b-2 border-l-2 border-[#C5A059]" />
        <div className="absolute bottom-3 right-3 w-8 h-8 border-b-2 border-r-2 border-[#C5A059]" />

        {/* Header: Academy Name, Seal & Ministry Standard */}
        <div className="border-b-2 border-[#C5A059]/40 pb-6 mb-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-[#C5A059] text-black font-serif font-bold text-3xl flex items-center justify-center italic shadow-lg shadow-[#C5A059]/30 shrink-0 print:border print:border-black">
                E
              </div>
              <div>
                <span className="text-[10px] tracking-[0.25em] text-[#C5A059] font-bold uppercase block print:text-black">
                  FEDERAL DEMOCRATIC REPUBLIC OF ETHIOPIA • MINISTRY OF EDUCATION CURRICULUM
                </span>
                <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white print:text-black tracking-wider">
                  EYOEL ENDALE BELETE ACADEMY
                </h2>
                <p className="text-xs text-slate-300 print:text-slate-700 font-medium">
                  {language === 'am'
                    ? 'የሁለተኛ ደረጃ ትምህርት የላቀ የትምህርት ውጤት ማስረጃ ሰነድ'
                    : 'Secondary Comprehensive Academic Transcript & Performance Report'}
                </p>
              </div>
            </div>

            {/* Official Report Card Badge */}
            <div className="p-3 rounded-xl bg-[#1C1C1F] border border-[#C5A059]/40 text-center shrink-0 min-w-[140px] print:bg-slate-100">
              <span className="text-[9px] uppercase tracking-widest text-[#C5A059] font-bold block print:text-black">
                REPORT CARD
              </span>
              <span className="text-base font-serif font-bold text-white print:text-black">
                {selectedSemester}
              </span>
              <span className="text-[10px] text-slate-400 block font-mono">
                {reportCard.academicYear}
              </span>
            </div>
          </div>
        </div>

        {/* Student Information Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 p-4 rounded-2xl bg-[#18181B] border border-[#2D2D30] mb-6 text-xs print:bg-slate-50 print:border-slate-300">
          <div>
            <span className="text-[10px] text-slate-400 uppercase tracking-wider block">
              {language === 'am' ? 'የተማሪው ሙሉ ስም' : 'Student Full Name'}
            </span>
            <span className="text-sm font-bold text-white print:text-black">
              {currentUser?.name || reportCard.studentName}
            </span>
          </div>

          <div>
            <span className="text-[10px] text-slate-400 uppercase tracking-wider block">
              {language === 'am' ? 'የተማሪ መለያ ቁጥር' : 'Student Roll / ID No.'}
            </span>
            <span className="text-sm font-mono font-bold text-[#C5A059] print:text-black">
              {reportCard.studentRollNo}
            </span>
          </div>

          <div>
            <span className="text-[10px] text-slate-400 uppercase tracking-wider block">
              {language === 'am' ? 'ክፍል እና ዘርፍ' : 'Grade & Stream'}
            </span>
            <span className="text-sm font-bold text-white print:text-black">
              {selectedGrade} ({selectedGrade === 'Grade 11' || selectedGrade === 'Grade 12' ? selectedStream : 'General'})
            </span>
          </div>

          <div>
            <span className="text-[10px] text-slate-400 uppercase tracking-wider block">
              {language === 'am' ? 'የስነ-ምግባር ውጤት' : 'Student Conduct'}
            </span>
            <span className="text-sm font-bold text-emerald-400 print:text-black flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 inline" />
              {reportCard.conduct}
            </span>
          </div>
        </div>

        {/* Assessment Structure Legend */}
        <div className="flex flex-wrap items-center justify-between gap-2 px-1 mb-3 text-[11px] text-slate-400">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-blue-500" />
              <strong>Activity & Attendance:</strong> 10%
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-amber-500" />
              <strong>Tests & Quizzes:</strong> 15%
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-purple-500" />
              <strong>Mid-Semester Exam:</strong> 25%
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-[#C5A059]" />
              <strong>Final Exam:</strong> 50%
            </span>
          </div>
          <span className="font-mono text-[#C5A059]">Total Max: 100%</span>
        </div>

        {/* Academic Marks Breakdown Table */}
        <div className="overflow-x-auto rounded-2xl border border-[#2D2D30] mb-6 print:border-slate-400">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#1C1C1F] text-[#C5A059] uppercase tracking-wider text-[10px] font-bold border-b border-[#2D2D30] print:bg-slate-200 print:text-black">
                <th className="py-3 px-3.5">#</th>
                <th className="py-3 px-3.5">{language === 'am' ? 'የትምህርት ዓይነት' : 'Subject Name'}</th>
                <th className="py-3 px-2 text-center">Activity (10%)</th>
                <th className="py-3 px-2 text-center">Quizzes (15%)</th>
                <th className="py-3 px-2 text-center">Mid Exam (25%)</th>
                <th className="py-3 px-2 text-center">Final Exam (50%)</th>
                <th className="py-3 px-3 text-center bg-[#C5A059]/10 text-white font-bold print:bg-slate-300 print:text-black">Total (100)</th>
                <th className="py-3 px-2 text-center">Grade</th>
                <th className="py-3 px-2 text-center">GPA</th>
                <th className="py-3 px-3.5">{language === 'am' ? 'አስተያየት' : 'Remarks'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2D2D30] print:divide-slate-300">
              {reportCard.subjects.map((sub, idx) => (
                <tr
                  key={sub.subjectId}
                  className="hover:bg-[#18181B] transition-colors print:hover:bg-transparent"
                >
                  <td className="py-3 px-3.5 font-mono text-slate-400 text-[11px]">{idx + 1}</td>
                  <td className="py-3 px-3.5 font-semibold text-white print:text-black">{sub.subjectName}</td>
                  
                  {/* Class Activity */}
                  <td className="py-3 px-2 text-center font-mono">
                    {isEditing ? (
                      <input
                        type="number"
                        min={0}
                        max={10}
                        value={sub.classActivity}
                        onChange={(e) => handleScoreChange(idx, 'classActivity', parseFloat(e.target.value))}
                        className="w-12 text-center bg-black/60 border border-[#C5A059]/40 rounded p-0.5 text-xs text-white"
                      />
                    ) : (
                      sub.classActivity
                    )}
                  </td>

                  {/* Quizzes & Assignments */}
                  <td className="py-3 px-2 text-center font-mono">
                    {isEditing ? (
                      <input
                        type="number"
                        min={0}
                        max={15}
                        value={sub.testsAndAssignments}
                        onChange={(e) => handleScoreChange(idx, 'testsAndAssignments', parseFloat(e.target.value))}
                        className="w-12 text-center bg-black/60 border border-[#C5A059]/40 rounded p-0.5 text-xs text-white"
                      />
                    ) : (
                      sub.testsAndAssignments
                    )}
                  </td>

                  {/* Mid-Exam */}
                  <td className="py-3 px-2 text-center font-mono">
                    {isEditing ? (
                      <input
                        type="number"
                        min={0}
                        max={25}
                        value={sub.midExam}
                        onChange={(e) => handleScoreChange(idx, 'midExam', parseFloat(e.target.value))}
                        className="w-12 text-center bg-black/60 border border-[#C5A059]/40 rounded p-0.5 text-xs text-white"
                      />
                    ) : (
                      sub.midExam
                    )}
                  </td>

                  {/* Final Exam */}
                  <td className="py-3 px-2 text-center font-mono">
                    {isEditing ? (
                      <input
                        type="number"
                        min={0}
                        max={50}
                        value={sub.finalExam}
                        onChange={(e) => handleScoreChange(idx, 'finalExam', parseFloat(e.target.value))}
                        className="w-12 text-center bg-black/60 border border-[#C5A059]/40 rounded p-0.5 text-xs text-white"
                      />
                    ) : (
                      sub.finalExam
                    )}
                  </td>

                  {/* Total Mark */}
                  <td className="py-3 px-3 text-center font-mono font-bold text-base bg-[#C5A059]/10 text-[#C5A059] print:bg-slate-200 print:text-black">
                    {sub.totalMark}
                  </td>

                  {/* Letter Grade */}
                  <td className="py-3 px-2 text-center">
                    <span
                      className={`px-2 py-0.5 rounded font-bold text-xs ${
                        sub.letterGrade.startsWith('A')
                          ? 'bg-emerald-500/20 text-emerald-300 print:text-black'
                          : sub.letterGrade.startsWith('B')
                          ? 'bg-blue-500/20 text-blue-300 print:text-black'
                          : sub.letterGrade.startsWith('C')
                          ? 'bg-amber-500/20 text-amber-300 print:text-black'
                          : 'bg-rose-500/20 text-rose-300 print:text-black'
                      }`}
                    >
                      {sub.letterGrade}
                    </span>
                  </td>

                  {/* GPA Point */}
                  <td className="py-3 px-2 text-center font-mono text-slate-300 print:text-black">
                    {sub.gradePoint.toFixed(1)}
                  </td>

                  {/* Remarks */}
                  <td className="py-3 px-3.5 text-slate-300 print:text-slate-700 text-[11px] italic">
                    {sub.remarks}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Academic Performance Summary Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 mb-8">
          <div className="p-4 rounded-2xl bg-[#18181B] border border-[#2D2D30] print:bg-slate-50 print:border-slate-300">
            <span className="text-[10px] text-slate-400 uppercase tracking-wider block">
              {language === 'am' ? 'አጠቃላይ ድምር ውጤት' : 'Grand Total Score'}
            </span>
            <span className="text-xl sm:text-2xl font-serif font-bold text-white print:text-black">
              {reportCard.totalScore} <span className="text-xs text-slate-400 font-sans">/ {reportCard.subjects.length * 100}</span>
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-[#18181B] border border-[#2D2D30] print:bg-slate-50 print:border-slate-300">
            <span className="text-[10px] text-slate-400 uppercase tracking-wider block">
              {language === 'am' ? 'አማካይ ውጤት' : 'Average Score'}
            </span>
            <span className="text-xl sm:text-2xl font-serif font-bold text-[#C5A059] print:text-black">
              {reportCard.averageScore}%
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-[#18181B] border border-[#2D2D30] print:bg-slate-50 print:border-slate-300">
            <span className="text-[10px] text-slate-400 uppercase tracking-wider block">
              {language === 'am' ? 'የውጤት ነጥብ (GPA)' : 'Cumulative GPA'}
            </span>
            <span className="text-xl sm:text-2xl font-serif font-bold text-emerald-400 print:text-black">
              {reportCard.gpa.toFixed(2)} <span className="text-xs text-slate-400 font-sans">/ 4.00</span>
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-[#18181B] border border-[#2D2D30] print:bg-slate-50 print:border-slate-300">
            <span className="text-[10px] text-slate-400 uppercase tracking-wider block">
              {language === 'am' ? 'ደረጃ በክፍል ውስጥ' : 'Class Rank'}
            </span>
            <span className="text-xl sm:text-2xl font-serif font-bold text-amber-300 print:text-black">
              {reportCard.rank}st <span className="text-xs text-slate-400 font-sans">/ {reportCard.totalStudentsInClass}</span>
            </span>
          </div>
        </div>

        {/* Promotion Status Banner */}
        <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-between mb-8 print:border-slate-400 print:bg-slate-100">
          <div className="flex items-center gap-2.5">
            <ShieldCheck className="w-5 h-5 text-emerald-400 print:text-black shrink-0" />
            <div>
              <span className="text-xs font-bold text-emerald-300 print:text-black block">
                {language === 'am' ? 'የውጤት ውሳኔ፡ ያለፈ/ች (PROMOTED WITH DISTINCTION)' : 'ACADEMIC STATUS: PROMOTED WITH HIGH DISTINCTION'}
              </span>
              <span className="text-[11px] text-slate-300 print:text-slate-700">
                {language === 'am'
                  ? 'ተማሪው/ዋ የተቀመጠውን የብቃት መመዘኛ በማሟላት ወደ ቀጣዩ የትምህርት እርከን አልፏል/ፋለች።'
                  : 'Student has fulfilled all secondary academic requirements with honors.'}
              </span>
            </div>
          </div>
          <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 print:text-black">
            PASS (A)
          </span>
        </div>

        {/* OFFICIAL SIGNATURES & STAMP GRID */}
        <div className="grid grid-cols-3 items-end pt-8 border-t-2 border-[#C5A059]/40 gap-4 text-center">
          
          {/* Academic Affairs Director Signature */}
          <div className="flex flex-col items-center space-y-1">
            <div className="h-10 flex items-center justify-center">
              <span className="font-serif italic text-sm sm:text-base text-amber-200/90 font-medium tracking-wide print:text-black">
                Dr. Tsegaye Alemu
              </span>
            </div>
            <div className="w-32 sm:w-44 border-b border-[#C5A059]/60 print:border-black" />
            <span className="text-[9px] sm:text-[10px] text-slate-400 uppercase tracking-widest block font-medium print:text-black">
              {language === 'am' ? 'የአካዳሚክ ዳይሬክተር' : 'Academic Affairs Director'}
            </span>
          </div>

          {/* Official Academy Gold Seal */}
          <div className="flex flex-col items-center justify-center">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full border-2 border-dashed border-[#C5A059] flex flex-col items-center justify-center bg-[#C5A059]/5 p-1 print:border-black">
              <Award className="w-5 h-5 sm:w-6 sm:h-6 text-[#C5A059] print:text-black mb-0.5" />
              <span className="text-[7px] sm:text-[8px] font-bold uppercase tracking-widest text-[#C5A059] print:text-black leading-none">
                OFFICIAL SEAL
              </span>
              <span className="text-[6px] text-slate-400 font-mono">
                EYOEL ACADEMY
              </span>
            </div>
            <span className="text-[8px] text-slate-400 mt-1 font-mono">
              Reg. Date: {reportCard.issueDate}
            </span>
          </div>

          {/* Founder & General Director Signature */}
          <div className="flex flex-col items-center space-y-1">
            <div className="h-10 flex items-center justify-center">
              <span className="font-serif italic text-sm sm:text-base text-[#C5A059] font-bold tracking-widest print:text-black">
                Eyoel Endale Belete
              </span>
            </div>
            <div className="w-32 sm:w-44 border-b border-[#C5A059]/60 print:border-black" />
            <span className="text-[9px] sm:text-[10px] text-slate-400 uppercase tracking-widest block font-medium print:text-black">
              {language === 'am' ? 'ዋና ዳይሬክተር እና መስራች' : 'General Director & Founder'}
            </span>
          </div>

        </div>

        {/* Verification Footnote */}
        <div className="mt-8 pt-4 border-t border-[#2D2D30] flex flex-col sm:flex-row items-center justify-between text-[10px] text-slate-400 gap-2 print:border-slate-300 print:text-slate-600">
          <span>
            Doc ID: <span className="font-mono text-[#C5A059]">{reportCard.id}</span> • Verified via Eyoel Endale Belete Academy Registry
          </span>
          <button
            onClick={handleCopyLink}
            className="hover:text-white flex items-center gap-1 transition-colors no-print"
          >
            {copiedLink ? (
              <>
                <Check className="w-3 h-3 text-emerald-400" />
                <span className="text-emerald-400">Link Copied!</span>
              </>
            ) : (
              <span>Share Official Transcript</span>
            )}
          </button>
        </div>

      </div>

      {/* Bottom Quick Navigation */}
      <div className="max-w-5xl mx-auto mt-8 flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-[#141416] border border-[#2D2D30] no-print">
        <div className="flex items-center gap-2 text-xs text-slate-300">
          <Sparkles className="w-4 h-4 text-[#C5A059]" />
          <span>
            {language === 'am'
              ? 'ተጨማሪ ፈተናዎችን በመውሰድ የውጤት ካርድዎን ማሻሻል ይፈልጋሉ?'
              : 'Want to boost your subject marks? Take our comprehensive final exams.'}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => onTabChange('quizzes')}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-[#C5A059] text-black hover:bg-[#d8b168] transition-colors flex items-center gap-1.5"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>{language === 'am' ? 'የመጨረሻ ፈተናዎችን ውሰድ' : 'Take Final Exams'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
