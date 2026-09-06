import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  Award,
  Clock,
  CheckCircle2,
  XCircle,
  HelpCircle,
  RotateCcw,
  BookOpen,
  ArrowRight,
  Flag,
  Sparkles,
  BarChart2,
  FileText,
  GraduationCap,
} from 'lucide-react';
import { GradeLevel, Quiz, QuizAttempt, ViewTab, Language, CertificateRecord, StudentUser } from '../types';
import { SAMPLE_QUIZZES } from '../data/quizzesData';
import { SUBJECTS, GRADES } from '../data/gradesAndSubjects';
import { TRANSLATIONS, SUBJECT_TRANSLATIONS } from '../lib/translations';

interface QuizViewProps {
  language: Language;
  selectedGrade: GradeLevel | 'All';
  onGradeChange: (grade: GradeLevel | 'All') => void;
  selectedSubjectFilter: string;
  onSubjectFilterChange: (subject: string) => void;
  onSaveQuizAttempt: (attempt: QuizAttempt) => void;
  onTabChange: (tab: ViewTab) => void;
  quizzes?: Quiz[];
  currentUser?: StudentUser | null;
  onViewCertificate?: (cert: CertificateRecord) => void;
}

export const QuizView: React.FC<QuizViewProps> = ({
  language,
  selectedGrade,
  onGradeChange,
  selectedSubjectFilter,
  onSubjectFilterChange,
  onSaveQuizAttempt,
  onTabChange,
  quizzes,
  currentUser,
  onViewCertificate,
}) => {
  const [quizMode, setQuizMode] = useState<'practice' | 'timed'>('practice');
  const [activeQuiz, setActiveQuiz] = useState<Quiz | null>(null);

  // Active Test State
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [flaggedQuestions, setFlaggedQuestions] = useState<boolean[]>([]);
  const [showHint, setShowHint] = useState(false);
  const [timeLeftSeconds, setTimeLeftSeconds] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);
  const [timeSpentSeconds, setTimeSpentSeconds] = useState(0);

  const t = TRANSLATIONS[language] || TRANSLATIONS.en;
  const quizzesList = quizzes || SAMPLE_QUIZZES;

  // Filter available quizzes
  const filteredQuizzes = quizzesList.filter((q) => {
    const matchesGrade = selectedGrade === 'All' || q.grade === selectedGrade;
    const matchesSubject = selectedSubjectFilter === 'All' || q.subjectName.toLowerCase() === selectedSubjectFilter.toLowerCase();
    return matchesGrade && matchesSubject;
  });

  // Start a Quiz
  const handleStartQuiz = (quiz: Quiz) => {
    setActiveQuiz(quiz);
    setCurrentQuestionIndex(0);
    setSelectedAnswers(new Array(quiz.questions.length).fill(-1));
    setFlaggedQuestions(new Array(quiz.questions.length).fill(false));
    setShowHint(false);
    setQuizFinished(false);
    setTimeSpentSeconds(0);
    setTimeLeftSeconds(quiz.durationMinutes * 60);
  };

  // Timer Countdown Effect
  useEffect(() => {
    if (!activeQuiz || quizFinished) return;

    const timer = setInterval(() => {
      setTimeSpentSeconds((prev) => prev + 1);

      if (quizMode === 'timed') {
        setTimeLeftSeconds((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            handleFinishQuiz();
            return 0;
          }
          return prev - 1;
        });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [activeQuiz, quizFinished, quizMode]);

  // Handle Answer Selection
  const handleSelectOption = (optionIndex: number) => {
    if (quizFinished) return;
    const updated = [...selectedAnswers];
    updated[currentQuestionIndex] = optionIndex;
    setSelectedAnswers(updated);
  };

  // Toggle Flag
  const handleToggleFlag = () => {
    const updated = [...flaggedQuestions];
    updated[currentQuestionIndex] = !updated[currentQuestionIndex];
    setFlaggedQuestions(updated);
  };

  // Submit/Finish Quiz
  const handleFinishQuiz = () => {
    if (!activeQuiz) return;
    setQuizFinished(true);

    // Calculate score
    let correctCount = 0;
    activeQuiz.questions.forEach((q, idx) => {
      if (selectedAnswers[idx] === q.correctAnswerIndex) {
        correctCount++;
      }
    });

    const percentage = Math.round((correctCount / activeQuiz.questions.length) * 100);

    // Save attempt record
    const attempt: QuizAttempt = {
      id: 'attempt-' + Date.now(),
      quizId: activeQuiz.id,
      quizTitle: activeQuiz.title,
      subjectName: activeQuiz.subjectName,
      grade: activeQuiz.grade,
      score: correctCount,
      totalQuestions: activeQuiz.questions.length,
      percentage,
      date: new Date().toLocaleDateString(),
      timeSpentSeconds,
      userAnswers: selectedAnswers,
    };

    onSaveQuizAttempt(attempt);

    // Confetti celebration on high score!
    if (percentage >= 70) {
      try {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
        });
      } catch (err) {
        // Fallback
      }
    }
  };

  // Format seconds to mm:ss
  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 bg-[#0A0A0B]">
      
      {/* If taking a quiz */}
      {activeQuiz ? (
        <div className="max-w-4xl mx-auto bg-[#111112] rounded-3xl border border-[#2D2D30] p-6 sm:p-10 shadow-2xl space-y-6">
          
          {/* Quiz Top Status Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#2D2D30]">
            <div>
              <span className="text-xs font-bold px-2.5 py-1 rounded bg-[#1A1A1C] text-[#C5A059] border border-[#2D2D30] uppercase">
                {language === 'am' ? activeQuiz.grade.replace('Grade ', 'ክፍል ') : language === 'om' ? activeQuiz.grade.replace('Grade ', 'Kutaa ') : activeQuiz.grade} • {SUBJECT_TRANSLATIONS[activeQuiz.subjectName]?.[language] || activeQuiz.subjectName}
              </span>
              <h2 className="text-xl sm:text-2xl font-serif font-bold text-white mt-2">
                {activeQuiz.title}
              </h2>
            </div>

            <div className="flex items-center gap-3">
              {quizMode === 'timed' && !quizFinished && (
                <div
                  className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full border text-xs font-bold ${
                    timeLeftSeconds < 120
                      ? 'bg-rose-950/80 text-rose-300 border-rose-800 animate-pulse'
                      : 'bg-[#1A1A1C] text-[#C5A059] border-[#C5A059]/40'
                  }`}
                >
                  <Clock className="w-4 h-4 text-[#C5A059]" />
                  <span>{t.timeRemaining}: {formatTime(timeLeftSeconds)}</span>
                </div>
              )}

              <button
                onClick={() => setActiveQuiz(null)}
                className="px-4 py-1.5 rounded-full bg-[#1A1A1C] border border-[#2D2D30] text-slate-300 hover:text-white text-xs font-bold uppercase tracking-wider"
              >
                {language === 'am' ? 'ውጣ' : language === 'om' ? 'Bahi' : 'Exit Quiz'}
              </button>
            </div>
          </div>

          {/* ACTIVE QUIZ SCREEN */}
          {!quizFinished ? (
            <div className="space-y-6">
              
              {/* Question Navigation & Progress Bar */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-slate-400">
                  <span>
                    {language === 'am'
                      ? `ጥያቄ ${currentQuestionIndex + 1} ከ ${activeQuiz.questions.length}`
                      : language === 'om'
                      ? `Gaaffii ${currentQuestionIndex + 1} keessaa ${activeQuiz.questions.length}`
                      : `Question ${currentQuestionIndex + 1} of ${activeQuiz.questions.length}`}
                  </span>
                  <span className="text-[#C5A059] uppercase tracking-wider">
                    {t.quizMode}: {quizMode === 'practice' ? t.practiceMode : t.timedMode}
                  </span>
                </div>

                {/* Progress bar */}
                <div className="w-full bg-[#1A1A1C] h-2 rounded-full overflow-hidden border border-[#2D2D30]">
                  <div
                    className="bg-[#C5A059] h-full transition-all duration-300"
                    style={{
                      width: `${((currentQuestionIndex + 1) / activeQuiz.questions.length) * 100}%`,
                    }}
                  />
                </div>

                {/* Question selector dots */}
                <div className="flex flex-wrap gap-1.5 pt-2">
                  {activeQuiz.questions.map((_, idx) => {
                    const answered = selectedAnswers[idx] !== -1;
                    const isFlagged = flaggedQuestions[idx];
                    const isCurrent = idx === currentQuestionIndex;

                    return (
                      <button
                        key={idx}
                        onClick={() => {
                          setCurrentQuestionIndex(idx);
                          setShowHint(false);
                        }}
                        className={`w-7 h-7 text-xs font-bold rounded-lg transition-all flex items-center justify-center relative ${
                          isCurrent
                            ? 'bg-[#C5A059] text-black font-bold'
                            : answered
                            ? 'bg-[#1A1A1C] text-[#C5A059] border border-[#C5A059]/40'
                            : 'bg-[#161618] text-slate-400 border border-[#2D2D30]'
                        }`}
                      >
                        {idx + 1}
                        {isFlagged && (
                          <span className="absolute -top-1 -right-1 w-2 h-2 bg-amber-500 rounded-full" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Current Question Body */}
              <div className="p-6 sm:p-8 rounded-2xl bg-[#161618] border border-[#2D2D30] space-y-6">
                <div className="flex items-start justify-between gap-4">
                  <h3 className="text-base sm:text-lg font-serif font-bold text-white leading-relaxed">
                    {activeQuiz.questions[currentQuestionIndex]?.question}
                  </h3>

                  <button
                    onClick={handleToggleFlag}
                    className={`p-2 rounded-lg border transition-colors ${
                      flaggedQuestions[currentQuestionIndex]
                        ? 'bg-amber-500/20 text-amber-400 border-amber-500/40'
                        : 'bg-[#1A1A1C] border-[#2D2D30] text-slate-500 hover:text-white'
                    }`}
                    title="Flag for review"
                  >
                    <Flag className="w-4 h-4" />
                  </button>
                </div>

                {/* Options List */}
                <div className="space-y-3">
                  {activeQuiz.questions[currentQuestionIndex]?.options.map((opt, optIdx) => {
                    const isSelected = selectedAnswers[currentQuestionIndex] === optIdx;
                    return (
                      <button
                        key={optIdx}
                        onClick={() => handleSelectOption(optIdx)}
                        className={`w-full p-4 rounded-xl text-left text-xs sm:text-sm font-medium border transition-all flex items-center justify-between group ${
                          isSelected
                            ? 'bg-[#C5A059]/10 border-[#C5A059] text-white shadow-lg shadow-[#C5A059]/10'
                            : 'bg-[#111112] border-[#2D2D30] text-slate-300 hover:border-[#C5A059]/40 hover:text-white'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span
                            className={`w-6 h-6 rounded-lg text-xs font-bold flex items-center justify-center ${
                              isSelected
                                ? 'bg-[#C5A059] text-black font-bold'
                                : 'bg-[#1A1A1C] text-slate-400 group-hover:text-white'
                            }`}
                          >
                            {String.fromCharCode(65 + optIdx)}
                          </span>
                          <span>{opt}</span>
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Practice Mode Instant Explanation */}
                {quizMode === 'practice' && selectedAnswers[currentQuestionIndex] !== -1 && (
                  <div className="p-4 rounded-xl bg-[#111112] border border-[#2D2D30] space-y-2 mt-4">
                    <div className="flex items-center gap-2">
                      {selectedAnswers[currentQuestionIndex] ===
                      activeQuiz.questions[currentQuestionIndex].correctAnswerIndex ? (
                        <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                          <CheckCircle2 className="w-4 h-4" /> {language === 'am' ? 'ትክክል ነው!' : language === 'om' ? 'Sirriidha!' : 'Correct!'}
                        </span>
                      ) : (
                        <span className="text-xs font-bold text-rose-400 flex items-center gap-1">
                          <XCircle className="w-4 h-4" /> {language === 'am' ? 'ስህተት ነው' : language === 'om' ? 'Dogoggora' : 'Incorrect'}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      <span className="font-bold text-[#C5A059]">{language === 'am' ? 'ማብራሪያ: ' : language === 'om' ? 'Ibsa: ' : 'Explanation: '}</span>
                      {activeQuiz.questions[currentQuestionIndex].explanation}
                    </p>
                  </div>
                )}
              </div>

              {/* Navigation Controls */}
              <div className="flex items-center justify-between pt-4">
                <button
                  disabled={currentQuestionIndex === 0}
                  onClick={() => {
                    setCurrentQuestionIndex((prev) => prev - 1);
                    setShowHint(false);
                  }}
                  className="px-5 py-2.5 rounded-full bg-[#1A1A1C] border border-[#2D2D30] text-slate-300 hover:text-white text-xs font-bold uppercase tracking-wider disabled:opacity-40 disabled:pointer-events-none"
                >
                  {t.previous}
                </button>

                {currentQuestionIndex < activeQuiz.questions.length - 1 ? (
                  <button
                    onClick={() => {
                      setCurrentQuestionIndex((prev) => prev + 1);
                      setShowHint(false);
                    }}
                    className="px-6 py-2.5 rounded-full bg-[#C5A059] hover:bg-[#d8b168] text-black font-bold text-xs uppercase tracking-wider transition-colors flex items-center gap-1.5 shadow-md"
                  >
                    {t.next} <ArrowRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    onClick={handleFinishQuiz}
                    className="px-8 py-2.5 rounded-full bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs uppercase tracking-wider transition-colors flex items-center gap-1.5 shadow-lg shadow-emerald-500/20"
                  >
                    {t.submitQuiz}
                  </button>
                )}
              </div>

            </div>
          ) : (
            /* RESULTS SCREEN */
            <div className="space-y-8">
              
              {/* Score Banner */}
              <div className="p-8 rounded-3xl bg-gradient-to-br from-[#1A1A1C] to-[#111112] border border-[#2D2D30] text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-[#C5A059]/10 border border-[#C5A059] text-[#C5A059] flex items-center justify-center mx-auto text-2xl font-bold font-serif">
                  <Award className="w-8 h-8" />
                </div>

                <div>
                  <h3 className="text-2xl font-serif font-bold text-white">
                    {t.quizCompleted}
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    {activeQuiz.title} ({activeQuiz.grade} • {activeQuiz.subjectName})
                  </p>
                </div>

                {/* Score percentage */}
                <div className="flex items-center justify-center gap-6 pt-2">
                  <div>
                    <span className="block text-4xl font-serif font-bold text-[#C5A059]">
                      {Math.round(
                        (selectedAnswers.filter(
                          (ans, idx) => ans === activeQuiz.questions[idx].correctAnswerIndex
                        ).length /
                          activeQuiz.questions.length) *
                          100
                      )}
                      %
                    </span>
                    <span className="text-[10px] uppercase tracking-wider text-slate-400">
                      {t.yourScore}
                    </span>
                  </div>

                  <div className="w-px h-10 bg-[#2D2D30]" />

                  <div>
                    <span className="block text-4xl font-serif font-bold text-white">
                      {
                        selectedAnswers.filter(
                          (ans, idx) => ans === activeQuiz.questions[idx].correctAnswerIndex
                        ).length
                      }
                      /{activeQuiz.questions.length}
                    </span>
                    <span className="text-[10px] uppercase tracking-wider text-slate-400">
                      {language === 'am' ? 'ትክክለኛ ጥያቄዎች' : language === 'om' ? 'Gaaffilee Sirrii' : 'Correct Answers'}
                    </span>
                  </div>

                  <div className="w-px h-10 bg-[#2D2D30]" />

                  <div>
                    <span className="block text-4xl font-serif font-bold text-slate-300">
                      {formatTime(timeSpentSeconds)}
                    </span>
                    <span className="text-[10px] uppercase tracking-wider text-slate-400">
                      {language === 'am' ? 'የፈጀው ጊዜ' : language === 'om' ? 'Yeroo Fudhatame' : 'Time Taken'}
                    </span>
                  </div>
                </div>

                {/* EARNED CERTIFICATE PROMPT (>= 70% OR CUSTOM) */}
                {Math.round((selectedAnswers.filter((ans, idx) => ans === activeQuiz.questions[idx].correctAnswerIndex).length / activeQuiz.questions.length) * 100) >= 70 ? (
                  <div className="mt-4 p-5 rounded-2xl bg-[#C5A059]/10 border-2 border-[#C5A059] flex flex-col sm:flex-row items-center justify-between gap-4 text-left">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-[#C5A059] text-black flex items-center justify-center font-bold text-xl shrink-0 shadow-lg shadow-[#C5A059]/30">
                        🏆
                      </div>
                      <div>
                        <h4 className="text-sm sm:text-base font-serif font-bold text-white">
                          {language === 'am' ? 'እንኳን ደስ አለዎት! የክብር ሰርተፊኬት አግኝተዋል' : language === 'om' ? 'Baga Gammaddan! Waraqaa Ragaa Kabajaa Argattaniittu' : 'Congratulations! You Earned a Certificate'}
                        </h4>
                        <p className="text-xs text-slate-300 mt-0.5">
                          {language === 'am'
                            ? `በ${SUBJECT_TRANSLATIONS[activeQuiz.subjectName]?.[language] || activeQuiz.subjectName} ፈተና ከፍተኛ ውጤት በማስመዝገብዎ የእዮኤል እንዳለ በለጠ የልህቀት ሰርተፊኬት ተበርክቶልዎታል።`
                            : language === 'om'
                            ? `Qabxii olaanaa waan galmeessitaniif waraqaan ragaa kabajaa Eyoel Endale Belete isiniif kennameera.`
                            : `You achieved excellence in ${activeQuiz.subjectName} and earned the official Eyoel Endale Belete Certificate of Achievement.`}
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        const pct = Math.round((selectedAnswers.filter((ans, idx) => ans === activeQuiz.questions[idx].correctAnswerIndex).length / activeQuiz.questions.length) * 100);
                        if (onViewCertificate) {
                          onViewCertificate({
                            id: `cert-${Date.now()}`,
                            studentName: currentUser?.name || 'Scholar Student',
                            subjectName: `${activeQuiz.subjectName} (${activeQuiz.grade})`,
                            grade: activeQuiz.grade,
                            issueDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
                            scorePercentage: pct,
                            certificateNumber: `EYOEL-${activeQuiz.subjectName.substring(0, 4).toUpperCase().replace(/[^A-Z]/g, '') || 'ACAD'}-${Math.floor(10000 + Math.random() * 90000)}`,
                            distinction: pct >= 90 ? 'First Class Honors' : pct >= 80 ? 'Excellence Distinction' : 'Proficiency Pass',
                          });
                        }
                      }}
                      className="w-full sm:w-auto px-6 py-2.5 rounded-full bg-[#C5A059] hover:bg-[#d8b168] text-black font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-[#C5A059]/30 shrink-0 transition-transform active:scale-95"
                    >
                      <Award className="w-4 h-4" />
                      <span>{language === 'am' ? 'ሰርተፊኬት ይመልከቱ እና ያውርዱ' : language === 'om' ? 'Waraqaa Ragaa Ilaali / Maxxansi' : 'View & Print Certificate'}</span>
                    </button>
                  </div>
                ) : (
                  <div className="mt-2 p-4 rounded-xl bg-[#161618] border border-[#2D2D30] text-xs text-slate-300 flex flex-col sm:flex-row items-center justify-between gap-3">
                    <span>
                      {language === 'am'
                        ? 'ሰርተፊኬት ለማግኘት 70% እና ከዚያ በላይ ውጤት ማስመዝገብ ያስፈልጋል። ፈተናውን እንደገና ይሞክሩ ወይም ሰርተፊኬት ያዘጋጁ።'
                        : language === 'om'
                        ? 'Waraqaa ragaa argachuuf 70% fi isaa ol galmeessuun barbaachisaadha.'
                        : 'Achieve 70% or higher to earn an accredited honor certificate. Retake the exam or customize your certificate.'}
                    </span>
                    <button
                      onClick={() => {
                        if (onViewCertificate) {
                          onViewCertificate({
                            id: `cert-${Date.now()}`,
                            studentName: currentUser?.name || 'Scholar Student',
                            subjectName: `${activeQuiz.subjectName} (${activeQuiz.grade})`,
                            grade: activeQuiz.grade,
                            issueDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
                            scorePercentage: 75,
                            certificateNumber: `EYOEL-${activeQuiz.subjectName.substring(0, 4).toUpperCase().replace(/[^A-Z]/g, '') || 'ACAD'}-${Math.floor(10000 + Math.random() * 90000)}`,
                            distinction: 'Proficiency Pass',
                          });
                        }
                      }}
                      className="px-4 py-1.5 rounded-full bg-[#1A1A1C] border border-[#C5A059]/40 hover:border-[#C5A059] text-[#C5A059] font-semibold text-xs whitespace-nowrap"
                    >
                      {language === 'am' ? 'ሰርተፊኬት አዘጋጅ' : language === 'om' ? 'Waraqaa Ragaa Qopheessi' : 'Certificate Studio'}
                    </button>
                  </div>
                )}

                {/* Action buttons */}
                <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
                  <button
                    onClick={() => onTabChange('report-card')}
                    className="w-full sm:w-auto px-6 py-2.5 rounded-full bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-lg shadow-emerald-500/20 transition-transform active:scale-95"
                  >
                    <FileText className="w-4 h-4" />
                    <span>{language === 'am' ? 'የተማሪ ውጤት ካርድ ይመልከቱ' : language === 'om' ? 'Waraqaa Qabxii Ilaali' : 'View Official Report Card'}</span>
                  </button>

                  <button
                    onClick={() => handleStartQuiz(activeQuiz)}
                    className="w-full sm:w-auto px-6 py-2.5 rounded-full bg-[#C5A059] text-black font-bold text-xs uppercase tracking-wider hover:bg-[#d8b168] flex items-center justify-center gap-1.5 transition-transform active:scale-95"
                  >
                    <RotateCcw className="w-4 h-4" /> {t.retakeQuiz}
                  </button>

                  <button
                    onClick={() => setActiveQuiz(null)}
                    className="w-full sm:w-auto px-6 py-2.5 rounded-full bg-[#1A1A1C] border border-[#2D2D30] text-white font-bold text-xs uppercase tracking-wider hover:border-[#C5A059] transition-colors"
                  >
                    {language === 'am' ? 'ወደ ፈተናዎች ዝርዝር ተመለስ' : language === 'om' ? 'Gara Tarree Qorumsaatti Deebi\'i' : 'Back to Quizzes'}
                  </button>
                </div>
              </div>

              {/* Detailed Breakdown */}
              <div className="space-y-4">
                <h3 className="text-lg font-serif font-bold text-white">
                  {t.viewDetailedReview}
                </h3>

                <div className="space-y-4">
                  {activeQuiz.questions.map((q, idx) => {
                    const userAns = selectedAnswers[idx];
                    const isCorrect = userAns === q.correctAnswerIndex;

                    return (
                      <div
                        key={idx}
                        className={`p-6 rounded-2xl border space-y-3 ${
                          isCorrect
                            ? 'bg-[#161618] border-[#C5A059]/40'
                            : 'bg-[#161618] border-rose-900/60'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <span className="font-bold text-sm text-white">
                            Q{idx + 1}. {q.question}
                          </span>
                          {isCorrect ? (
                            <span className="px-2.5 py-1 rounded bg-[#C5A059]/20 border border-[#C5A059] text-[#C5A059] text-xs font-bold uppercase tracking-wider flex items-center gap-1 shrink-0">
                              <CheckCircle2 className="w-3.5 h-3.5" /> {language === 'am' ? 'ትክክል' : language === 'om' ? 'Sirrii' : 'Correct'}
                            </span>
                          ) : (
                            <span className="px-2.5 py-1 rounded bg-rose-950 border border-rose-800 text-rose-300 text-xs font-bold uppercase tracking-wider flex items-center gap-1 shrink-0">
                              <XCircle className="w-3.5 h-3.5" /> {language === 'am' ? 'ስህተት' : language === 'om' ? 'Dogoggora' : 'Incorrect'}
                            </span>
                          )}
                        </div>

                        <div className="text-xs space-y-1 text-slate-300">
                          <p>
                            <span className="font-semibold text-slate-400">{language === 'am' ? 'የእርስዎ መልስ:' : language === 'om' ? 'Deebii Keessan:' : 'Your Answer:'}</span>{' '}
                            {userAns !== -1 ? q.options[userAns] : (language === 'am' ? 'የተዘለለ' : language === 'om' ? 'Kan Darbame' : 'Skipped')}
                          </p>
                          {!isCorrect && (
                            <p className="text-[#C5A059] font-semibold">
                              {language === 'am' ? 'ትክክለኛ መልስ:' : language === 'om' ? 'Deebii Sirrii:' : 'Correct Answer:'} {q.options[q.correctAnswerIndex]}
                            </p>
                          )}
                        </div>

                        <p className="text-xs p-3 rounded-xl bg-[#0A0A0B] text-slate-300 border border-[#2D2D30] leading-relaxed">
                          <span className="font-bold text-[#C5A059] uppercase tracking-wider">{language === 'am' ? 'ማብራሪያ: ' : language === 'om' ? 'Ibsa: ' : 'Explanation: '}</span>
                          {q.explanation}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>
          )}

        </div>
      ) : (
        /* QUIZ SELECTION DASHBOARD */
        <div className="space-y-8">
          
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[#2D2D30]">
            <div>
              <div className="flex items-center gap-2 text-[#C5A059] font-bold text-xs uppercase tracking-[0.2em] mb-1">
                <Award className="w-4 h-4" /> {t.navQuizzes}
              </div>
              <h1 className="text-2xl sm:text-4xl font-serif font-semibold text-white tracking-tight">
                {t.quizzesHeading}
              </h1>
              <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
                {t.quizzesSub}
              </p>
            </div>

            {/* Action Bar */}
            <div className="flex flex-wrap items-center gap-2.5 self-start">
              {/* Official Academic Report Card Button */}
              <button
                onClick={() => onTabChange('report-card')}
                className="px-4 py-2 rounded-full bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 transition-all shadow-md shadow-emerald-500/20"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>{language === 'am' ? 'የተማሪ ውጤት ካርድ (Report Card)' : language === 'om' ? 'Waraqaa Qabxii' : 'Report Card'}</span>
              </button>

              {/* Claim / Create Certificate Quick Action */}
              <button
                onClick={() => {
                  if (onViewCertificate) {
                    onViewCertificate({
                      id: `cert-${Date.now()}`,
                      studentName: currentUser?.name || 'Scholar Student',
                      subjectName: selectedSubjectFilter !== 'All' ? selectedSubjectFilter : 'Mathematics',
                      grade: selectedGrade !== 'All' ? selectedGrade : 'Grade 12',
                      issueDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
                      scorePercentage: 92,
                      certificateNumber: `EYOEL-HONOR-${Math.floor(10000 + Math.random() * 90000)}`,
                      distinction: 'First Class Honors',
                    });
                  }
                }}
                className="px-4 py-2 rounded-full bg-[#161618] border border-[#C5A059] text-[#C5A059] hover:bg-[#C5A059] hover:text-black font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 transition-all shadow-sm"
              >
                <Award className="w-3.5 h-3.5" />
                <span>{language === 'am' ? 'ሰርተፊኬት ይውሰዱ' : language === 'om' ? 'Waraqaa Ragaa' : 'Claim Certificate'}</span>
              </button>

              {/* Mode selector */}
              <div className="flex items-center bg-[#111112] p-1 rounded-full border border-[#2D2D30]">
                <button
                  onClick={() => setQuizMode('practice')}
                  className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all ${
                    quizMode === 'practice'
                      ? 'bg-[#C5A059] text-black font-bold'
                      : 'text-slate-400'
                  }`}
                >
                  {t.practiceMode}
                </button>
                <button
                  onClick={() => setQuizMode('timed')}
                  className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all ${
                    quizMode === 'timed'
                      ? 'bg-[#C5A059] text-black font-bold'
                      : 'text-slate-400'
                  }`}
                >
                  {t.timedMode}
                </button>
              </div>
            </div>
          </div>

          {/* Grade & Subject Selectors */}
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
            
            {/* Grade Tabs */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
              <button
                onClick={() => onGradeChange('All')}
                className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all ${
                  selectedGrade === 'All'
                    ? 'bg-[#C5A059] text-black font-bold'
                    : 'bg-[#111112] text-[#E0E0E0] border border-[#2D2D30] hover:border-[#C5A059]'
                }`}
              >
                {t.allGrades}
              </button>
              {GRADES.map((g) => (
                <button
                  key={g.level}
                  onClick={() => onGradeChange(g.level)}
                  className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all ${
                    selectedGrade === g.level
                      ? 'bg-[#C5A059] text-black font-bold'
                      : 'bg-[#111112] text-[#E0E0E0] border border-[#2D2D30] hover:border-[#C5A059]'
                  }`}
                >
                  {language === 'am' ? g.level.replace('Grade ', 'ክፍል ') : language === 'om' ? g.level.replace('Grade ', 'Kutaa ') : g.level}
                </button>
              ))}
            </div>

            {/* Subject Dropdown */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-400 whitespace-nowrap uppercase tracking-wider">
                {t.filterBySubject}:
              </span>
              <select
                value={selectedSubjectFilter}
                onChange={(e) => onSubjectFilterChange(e.target.value)}
                className="px-4 py-2 rounded-full border border-[#2D2D30] bg-[#111112] text-white text-xs font-bold focus:outline-none focus:border-[#C5A059]"
              >
                <option value="All">{language === 'am' ? 'ሁሉም ትምህርቶች' : language === 'om' ? 'Barnoota Hunda' : 'All Subjects'}</option>
                {SUBJECTS.map((s) => (
                  <option key={s.id} value={s.name}>
                    {SUBJECT_TRANSLATIONS[s.name]?.[language] || s.name}
                  </option>
                ))}
              </select>
            </div>

          </div>

          {/* All-Subject Final Examination Spotlight Banner */}
          <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-r from-[#18181B] via-[#141416] to-[#18181B] border-2 border-[#C5A059]/40 shadow-xl flex flex-col lg:flex-row items-start lg:items-center justify-between gap-5">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-[#C5A059]/20 border border-[#C5A059]/50 flex items-center justify-center text-[#C5A059] shrink-0 shadow-inner">
                <GraduationCap className="w-6 h-6" />
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#C5A059] text-black">
                    {language === 'am' ? 'የሁሉም ትምህርቶች የመጨረሻ ፈተናዎች' : language === 'om' ? 'Qorumsa Xumuraa Barnoota Hunda' : 'All-Subject Final Examination Suite'}
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                    50% Report Card Weight
                  </span>
                </div>
                <h3 className="text-base sm:text-lg font-serif font-bold text-white">
                  {language === 'am'
                    ? 'የብሔራዊና የሁለተኛ ደረጃ ትምህርት የ20 ጥያቄዎች አጠቃላይ ፈተናዎች'
                    : 'Secondary & National Matriculation 20-Question Exam Packages'}
                </h3>
                <p className="text-xs text-slate-300 mt-1 max-w-2xl">
                  {language === 'am'
                    ? 'ለሂሳብ፣ ፊዚክስ፣ ኬሚስትሪ፣ ባዮሎጂ፣ እንግሊዝኛ፣ አይቲ፣ ታሪክ፣ ጂኦግራፊ፣ ስነ-ዜጋና ኢኮኖሚክስ የተዘጋጁ ሙሉ ፈተናዎችን በመውሰድ የውጤት ካርድዎንና ሰርተፊኬትዎን ያሟሉ።'
                    : 'Complete full comprehensive final exams for Math, Physics, Chemistry, Biology, English, IT, History, Geography, Civics, and Economics.'}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2.5 shrink-0 w-full lg:w-auto">
              <button
                onClick={() => onTabChange('report-card')}
                className="px-4 py-2 rounded-xl bg-emerald-500/20 border border-emerald-500/50 hover:bg-emerald-500 hover:text-black text-emerald-300 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>{language === 'am' ? 'የውጤት ካርድ ይመልከቱ' : 'View Report Card'}</span>
              </button>
            </div>
          </div>

          {/* Quizzes List */}
          {filteredQuizzes.length === 0 ? (
            <div className="text-center py-16 bg-[#111112] rounded-2xl border border-[#2D2D30] p-8 space-y-3">
              <Award className="w-12 h-12 text-[#C5A059] mx-auto" />
              <h3 className="text-lg font-serif font-bold text-white">
                {language === 'am' ? 'ምንም ፈተና አልተገኘም' : language === 'om' ? 'Qorumsi Hin Argamne' : 'No Quizzes Available'}
              </h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                {language === 'am' ? 'ለዚህ የትምህርት አይነት እና ክፍል የተዘጋጀ ፈተና የለም።' : language === 'om' ? 'Kanaan walqabatee qorumsi hin jiru.' : 'No quiz currently matches this subject and grade combination.'}
              </p>
              <button
                onClick={() => {
                  onGradeChange('All');
                  onSubjectFilterChange('All');
                }}
                className="px-6 py-2.5 rounded-full bg-[#C5A059] text-black font-bold text-xs uppercase tracking-wider hover:bg-[#d8b168]"
              >
                {language === 'am' ? 'ማጣሪያውን አጽዳ' : language === 'om' ? 'Calaltuu Haquu' : 'Reset Filter Choices'}
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredQuizzes.map((quiz) => (
                <div
                  key={quiz.id}
                  className="bg-[#111112] rounded-2xl border border-[#2D2D30] p-6 hover:border-[#C5A059] transition-all duration-300 flex flex-col justify-between group"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="px-2.5 py-1 text-[10px] font-bold uppercase rounded bg-[#1A1A1C] text-[#C5A059] border border-[#2D2D30]">
                        {language === 'am' ? quiz.grade.replace('Grade ', 'ክፍል ') : language === 'om' ? quiz.grade.replace('Grade ', 'Kutaa ') : quiz.grade}
                      </span>
                      <span className="text-xs font-bold px-2 py-0.5 rounded bg-[#1A1A1C] text-slate-300 border border-[#2D2D30]">
                        {quiz.difficulty}
                      </span>
                    </div>

                    <span className="text-[10px] font-bold text-[#C5A059] uppercase tracking-widest block mb-1">
                      {SUBJECT_TRANSLATIONS[quiz.subjectName]?.[language] || quiz.subjectName}
                    </span>

                    <h3 className="text-base sm:text-lg font-serif font-bold text-white group-hover:text-[#C5A059] transition-colors">
                      {quiz.title}
                    </h3>

                    <div className="mt-4 flex items-center gap-4 text-xs font-medium text-slate-400">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-[#C5A059]" /> {quiz.durationMinutes} {language === 'am' ? 'ደቂቃዎች' : language === 'om' ? 'Daqiiqaa' : 'Minutes'}
                      </span>
                      <span>•</span>
                      <span>{quiz.questions.length} {language === 'am' ? 'ጥያቄዎች' : language === 'om' ? 'Gaaffilee' : 'Questions'}</span>
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-[#2D2D30]">
                    <button
                      onClick={() => handleStartQuiz(quiz)}
                      className="w-full py-2.5 px-4 rounded-xl bg-[#C5A059] hover:bg-[#d8b168] text-black font-bold text-xs uppercase tracking-wider transition-colors flex items-center justify-center gap-2"
                    >
                      {t.startQuiz} <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

        </div>
      )}

    </div>
  );
};
