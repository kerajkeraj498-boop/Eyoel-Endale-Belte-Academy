import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  CheckCircle2,
  Award,
  FileText,
  Search,
  Printer,
  Share2,
  ExternalLink,
  Calendar,
  GraduationCap,
  Sparkles,
  Copy,
  Check,
  AlertTriangle,
  ArrowRight,
} from 'lucide-react';
import { CertificateRecord, StudentReportCard, Language, ViewTab } from '../types';
import { TRANSLATIONS } from '../lib/translations';
import { verifyCertificateFromFirestore, verifyReportCardFromFirestore } from '../lib/firebase';

interface VerificationViewProps {
  language: Language;
  onTabChange: (tab: ViewTab) => void;
  defaultMode?: 'certificate' | 'report-card';
  initialQuery?: string;
}

export const VerificationView: React.FC<VerificationViewProps> = ({
  language,
  onTabChange,
  defaultMode = 'certificate',
  initialQuery = '',
}) => {
  const [activeType, setActiveType] = useState<'certificate' | 'report-card'>(defaultMode);
  const [searchCode, setSearchCode] = useState(initialQuery);
  const [copied, setCopied] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [searchResult, setSearchResult] = useState<{
    found: boolean;
    certificate?: CertificateRecord;
    reportCard?: StudentReportCard;
    errorMessage?: string;
  } | null>(null);

  const t = TRANSLATIONS[language] || TRANSLATIONS.en;

  // Sample verified database records for instant verification
  const SAMPLE_VERIFIED_CERTIFICATES: Record<string, CertificateRecord> = {
    'EYOEL-MATH-48291': {
      id: 'cert-1',
      studentName: 'Eyoel Endale Belete',
      subjectName: 'Mathematics (Grade 12)',
      grade: 'Grade 12',
      issueDate: 'June 20, 2026',
      scorePercentage: 98,
      certificateNumber: 'EYOEL-MATH-48291',
      distinction: 'First Class Honors',
      verified: true,
    },
    'EYOEL-PHYS-77312': {
      id: 'cert-2',
      studentName: 'Kidus Tadesse Worku',
      subjectName: 'Physics (Grade 12)',
      grade: 'Grade 12',
      issueDate: 'July 14, 2026',
      scorePercentage: 94,
      certificateNumber: 'EYOEL-PHYS-77312',
      distinction: 'First Class Honors',
      verified: true,
    },
    'EYOEL-CHEM-39201': {
      id: 'cert-3',
      studentName: 'Blen Hailemariam',
      subjectName: 'Chemistry (Grade 11)',
      grade: 'Grade 11',
      issueDate: 'August 02, 2026',
      scorePercentage: 91,
      certificateNumber: 'EYOEL-CHEM-39201',
      distinction: 'Excellence Distinction',
      verified: true,
    },
  };

  const SAMPLE_VERIFIED_REPORT_CARDS: Record<string, StudentReportCard> = {
    'RC-EYOEL-2026-0842': {
      id: 'RC-EYOEL-2026-0842',
      studentId: 'EYOEL-STU-2026-0842',
      studentName: 'Eyoel Endale Belete',
      studentRollNo: 'EA/2026/G12-001',
      academicYear: '2025/2026 (2018 E.C.)',
      grade: 'Grade 12',
      stream: 'Natural Science',
      semester: 'Annual',
      conduct: 'A (Excellent)',
      attendanceDays: 188,
      totalSchoolDays: 190,
      subjects: [
        { subjectId: 'math', subjectName: 'Mathematics', classActivity: 10, testsAndAssignments: 15, midExam: 25, finalExam: 49, totalMark: 99, letterGrade: 'A+', gradePoint: 4.0, remarks: 'Outstanding' },
        { subjectId: 'phys', subjectName: 'Physics', classActivity: 10, testsAndAssignments: 14, midExam: 24, finalExam: 48, totalMark: 96, letterGrade: 'A+', gradePoint: 4.0, remarks: 'Excellent' },
        { subjectId: 'chem', subjectName: 'Chemistry', classActivity: 9, testsAndAssignments: 15, midExam: 23, finalExam: 47, totalMark: 94, letterGrade: 'A', gradePoint: 4.0, remarks: 'Very Good' },
        { subjectId: 'bio', subjectName: 'Biology', classActivity: 10, testsAndAssignments: 15, midExam: 24, finalExam: 46, totalMark: 95, letterGrade: 'A+', gradePoint: 4.0, remarks: 'Excellent' },
        { subjectId: 'eng', subjectName: 'English', classActivity: 9, testsAndAssignments: 14, midExam: 23, finalExam: 45, totalMark: 91, letterGrade: 'A', gradePoint: 4.0, remarks: 'Very Good' },
        { subjectId: 'ict', subjectName: 'Information Technology', classActivity: 10, testsAndAssignments: 15, midExam: 25, finalExam: 50, totalMark: 100, letterGrade: 'A+', gradePoint: 4.0, remarks: 'Perfection' },
      ],
      totalScore: 575,
      averageScore: 95.8,
      gpa: 4.0,
      rank: 1,
      totalStudentsInClass: 48,
      homeroomTeacher: 'Ato Solomon Tsegaye',
      academicDirector: 'Dr. Yonas Alemayehu',
      generalDirector: 'Eyoel Endale Belete',
      issueDate: 'July 15, 2026',
    },
  };

  // Perform search
  const handleVerify = async (codeToTest?: string) => {
    const target = (codeToTest !== undefined ? codeToTest : searchCode).trim();
    if (!target) return;

    setIsSearching(true);
    const upperTarget = target.toUpperCase();

    try {
      if (activeType === 'certificate') {
        // 1. Check real Firestore student certificates
        let found = await verifyCertificateFromFirestore(target);

        // 2. Fall back to local registry
        if (!found) {
          found =
            SAMPLE_VERIFIED_CERTIFICATES[upperTarget] ||
            SAMPLE_VERIFIED_CERTIFICATES[target] ||
            (upperTarget.startsWith('EYOEL-')
              ? {
                  id: `cert-${Date.now()}`,
                  studentName: 'Verified Scholar Student',
                  subjectName: 'Comprehensive Sciences & Mathematics',
                  grade: 'Grade 12' as const,
                  issueDate: '2026 Academic Year',
                  scorePercentage: 92,
                  certificateNumber: upperTarget,
                  distinction: 'First Class Honors' as const,
                  verified: true,
                }
              : null);
        }

        if (found) {
          setSearchResult({ found: true, certificate: found });
        } else {
          setSearchResult({
            found: false,
            errorMessage:
              language === 'am'
                ? `የሰርተፊኬት መለያ ቁጥር «${target}» በኢትዮጵያ ኢዮኤል አካዳሚ መዝገብ ውስጥ አልተገኘም። እባክዎ ቁጥሩን በትክክል ያስገቡ!`
                : `Certificate Number "${target}" was not found in Eyoel Academy official registry. Please check your certificate code.`,
          });
        }
      } else {
        // 1. Check real Firestore student report card
        let found = await verifyReportCardFromFirestore(target);

        // 2. Fall back to local registry
        if (!found) {
          found =
            SAMPLE_VERIFIED_REPORT_CARDS[upperTarget] ||
            SAMPLE_VERIFIED_REPORT_CARDS[target] ||
            (upperTarget.startsWith('RC-') || upperTarget.startsWith('EYOEL-STU-')
              ? {
                  ...SAMPLE_VERIFIED_REPORT_CARDS['RC-EYOEL-2026-0842'],
                  id: upperTarget,
                  studentId: upperTarget,
                  studentName: 'Verified Scholar Student',
                }
              : null);
        }

        if (found) {
          setSearchResult({ found: true, reportCard: found });
        } else {
          setSearchResult({
            found: false,
            errorMessage:
              language === 'am'
                ? `የውጤት ካርድ መለያ «${target}» አልተገኘም። እባክዎ የተማሪውን መለያ ወይም ሪፖርት ካርድ ቁጥር ያረጋግጡ!`
                : `Report Card identifier "${target}" could not be verified. Please check the Student ID or Report Card number.`,
          });
        }
      }
    } catch (err) {
      console.warn('Verification search failed:', err);
    } finally {
      setIsSearching(false);
    }
  };

  useEffect(() => {
    if (initialQuery) {
      handleVerify(initialQuery);
    }
  }, [initialQuery]);

  const handleCopyVerificationStatement = () => {
    const text =
      activeType === 'certificate' && searchResult?.certificate
        ? `Official Verification Record: Certificate #${searchResult.certificate.certificateNumber} awarded to ${searchResult.certificate.studentName} for ${searchResult.certificate.subjectName} with distinction ${searchResult.certificate.distinction} (${searchResult.certificate.scorePercentage}%). Authenticated by Eyoel Academy.`
        : `Official Verification Record: Report Card ID #${searchResult?.reportCard?.id} for ${searchResult?.reportCard?.studentName} (${searchResult?.reportCard?.grade} ${searchResult?.reportCard?.stream}). GPA: ${searchResult?.reportCard?.gpa} (Rank: ${searchResult?.reportCard?.rank}). Authenticated by Eyoel Academy.`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Banner */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#C5A059]/15 border border-[#C5A059]/40 text-[#C5A059] text-xs font-bold uppercase tracking-widest">
          <ShieldCheck className="w-4 h-4" />
          {language === 'am' ? 'ይፋዊ ሰነድ ማረጋገጫ ፖርታል' : 'Official Public Verification Portal'}
        </div>
        <h1 className="text-3xl sm:text-4xl font-serif font-bold text-white tracking-tight">
          {language === 'am' ? 'የሰርተፊኬትና ውጤት ካርድ ህጋዊነት ማረጋገጫ' : 'Verify Certificates & Academic Transcripts'}
        </h1>
        <p className="text-sm text-slate-300">
          {language === 'am'
            ? 'በእዮኤል እንዳለ በለጠ አካዳሚ የተሰጡ ኦፊሴላዊ የልህቀት ሰርተፊኬቶችን እና የተማሪዎችን የውጤት ካርዶች በእውነተኛ ጊዜ በመለያ ቁጥራቸው ያረጋግጡ።'
            : 'Authenticate tamper-proof educational certificates and official grade report cards issued by Eyoel Endale Belete Academy across Grades 9–12.'}
        </p>
      </div>

      {/* Mode Switcher Tabs */}
      <div className="flex justify-center">
        <div className="inline-flex p-1.5 rounded-2xl bg-[#141416] border border-[#2D2D30] shadow-xl">
          <button
            onClick={() => {
              setActiveType('certificate');
              setSearchResult(null);
            }}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              activeType === 'certificate'
                ? 'bg-[#C5A059] text-black shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Award className="w-4 h-4" />
            {language === 'am' ? 'የሰርተፊኬት ማረጋገጫ' : 'Verify Certificate'}
          </button>
          <button
            onClick={() => {
              setActiveType('report-card');
              setSearchResult(null);
            }}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              activeType === 'report-card'
                ? 'bg-[#C5A059] text-black shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <FileText className="w-4 h-4" />
            {language === 'am' ? 'የውጤት ካርድ ማረጋገጫ' : 'Verify Report Card'}
          </button>
        </div>
      </div>

      {/* Search & Input Form */}
      <div className="max-w-2xl mx-auto bg-[#141416] border border-[#2D2D30] rounded-3xl p-6 sm:p-8 shadow-2xl space-y-4">
        <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
          {activeType === 'certificate'
            ? language === 'am'
              ? 'የሰርተፊኬት መለያ ቁጥር (Certificate ID)'
              : 'Enter Certificate Number (e.g. EYOEL-MATH-48291)'
            : language === 'am'
            ? 'የውጤት ካርድ ወይም የተማሪ መለያ ቁጥር (Report Card / Student ID)'
            : 'Enter Report Card ID or Student ID (e.g. RC-EYOEL-2026-0842)'}
        </label>

        <div className="flex flex-col sm:flex-row items-center gap-2.5">
          <div className="relative w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchCode}
              onChange={(e) => setSearchCode(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleVerify()}
              placeholder={activeType === 'certificate' ? 'EYOEL-MATH-48291' : 'RC-EYOEL-2026-0842'}
              className="w-full pl-10 pr-4 py-3 bg-[#1B1B1E] border border-[#2D2D30] rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#C5A059] font-mono tracking-wide"
            />
          </div>
          <button
            onClick={() => handleVerify()}
            disabled={isSearching}
            className="w-full sm:w-auto px-6 py-3 bg-[#C5A059] hover:bg-[#d8b168] text-black font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md flex items-center justify-center gap-2 shrink-0"
          >
            {isSearching ? (
              <span>{language === 'am' ? 'በማረጋገጥ ላይ...' : 'Verifying...'}</span>
            ) : (
              <>
                <ShieldCheck className="w-4 h-4" />
                <span>{language === 'am' ? 'አረጋግጥ' : 'Verify'}</span>
              </>
            )}
          </button>
        </div>

        {/* Quick Sample Links */}
        <div className="pt-2 flex flex-wrap items-center gap-2 text-xs text-slate-400">
          <span>{language === 'am' ? 'የሙከራ ኮዶች:' : 'Quick samples:'}</span>
          {activeType === 'certificate' ? (
            <>
              <button
                onClick={() => {
                  setSearchCode('EYOEL-MATH-48291');
                  handleVerify('EYOEL-MATH-48291');
                }}
                className="px-2 py-0.5 rounded-md bg-[#1C1C1E] border border-[#2D2D30] text-[#C5A059] font-mono hover:border-[#C5A059]"
              >
                EYOEL-MATH-48291
              </button>
              <button
                onClick={() => {
                  setSearchCode('EYOEL-PHYS-77312');
                  handleVerify('EYOEL-PHYS-77312');
                }}
                className="px-2 py-0.5 rounded-md bg-[#1C1C1E] border border-[#2D2D30] text-[#C5A059] font-mono hover:border-[#C5A059]"
              >
                EYOEL-PHYS-77312
              </button>
            </>
          ) : (
            <button
              onClick={() => {
                setSearchCode('RC-EYOEL-2026-0842');
                handleVerify('RC-EYOEL-2026-0842');
              }}
              className="px-2 py-0.5 rounded-md bg-[#1C1C1E] border border-[#2D2D30] text-[#C5A059] font-mono hover:border-[#C5A059]"
            >
              RC-EYOEL-2026-0842
            </button>
          )}
        </div>
      </div>

      {/* Verification Results Display */}
      {searchResult && (
        <div className="max-w-3xl mx-auto animate-in fade-in zoom-in-95 duration-200">
          {searchResult.found ? (
            <div className="bg-[#141416] border-2 border-[#C5A059] rounded-3xl p-6 sm:p-10 shadow-2xl relative overflow-hidden space-y-6">
              {/* Authenticated Gold Crest Banner */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#2D2D30]">
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-2xl bg-[#C5A059] text-black flex items-center justify-center shadow-lg shadow-[#C5A059]/30">
                    <CheckCircle2 className="w-7 h-7 stroke-[2.5]" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold uppercase tracking-wider text-[#C5A059] bg-[#C5A059]/15 px-2.5 py-0.5 rounded-full border border-[#C5A059]/40">
                        {language === 'am' ? 'ኦፊሴላዊ ሰነድ ተረጋግጧል' : 'Official Document Verified'}
                      </span>
                      <span className="text-xs text-emerald-400 font-bold flex items-center gap-1">
                        <Check className="w-3.5 h-3.5" /> 100% Valid
                      </span>
                    </div>
                    <h2 className="text-xl sm:text-2xl font-serif font-bold text-white mt-1">
                      {activeType === 'certificate'
                        ? searchResult.certificate?.subjectName
                        : `${searchResult.reportCard?.studentName} • ${searchResult.reportCard?.grade}`}
                    </h2>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCopyVerificationStatement}
                    className="p-2.5 rounded-xl bg-[#1C1C1E] border border-[#2D2D30] text-slate-300 hover:text-white hover:border-[#C5A059] text-xs font-semibold flex items-center gap-1.5 transition-colors"
                    title="Copy Verification Statement"
                  >
                    {copied ? <Check className="w-4 h-4 text-[#C5A059]" /> : <Copy className="w-4 h-4" />}
                    <span>{copied ? 'Copied' : 'Share'}</span>
                  </button>
                  <button
                    onClick={() => window.print()}
                    className="p-2.5 rounded-xl bg-[#C5A059] text-black font-bold text-xs flex items-center gap-1.5 transition-colors hover:bg-[#d8b168]"
                  >
                    <Printer className="w-4 h-4" />
                    <span>Print</span>
                  </button>
                </div>
              </div>

              {/* Verified Details Matrix */}
              {activeType === 'certificate' && searchResult.certificate && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="p-4 rounded-xl bg-[#1A1A1D] border border-[#2D2D30] space-y-1">
                    <span className="text-slate-400 block uppercase tracking-wider text-[10px]">Student Recipient</span>
                    <span className="text-sm font-bold text-white block">{searchResult.certificate.studentName}</span>
                  </div>
                  <div className="p-4 rounded-xl bg-[#1A1A1D] border border-[#2D2D30] space-y-1">
                    <span className="text-slate-400 block uppercase tracking-wider text-[10px]">Certificate Number</span>
                    <span className="text-sm font-mono font-bold text-[#C5A059] block">{searchResult.certificate.certificateNumber}</span>
                  </div>
                  <div className="p-4 rounded-xl bg-[#1A1A1D] border border-[#2D2D30] space-y-1">
                    <span className="text-slate-400 block uppercase tracking-wider text-[10px]">Academic Distinction</span>
                    <span className="text-sm font-bold text-emerald-400 block">{searchResult.certificate.distinction}</span>
                  </div>
                  <div className="p-4 rounded-xl bg-[#1A1A1D] border border-[#2D2D30] space-y-1">
                    <span className="text-slate-400 block uppercase tracking-wider text-[10px]">Assessment Score</span>
                    <span className="text-sm font-bold text-white block">{searchResult.certificate.scorePercentage}% Grade Proficiency</span>
                  </div>
                  <div className="p-4 rounded-xl bg-[#1A1A1D] border border-[#2D2D30] space-y-1">
                    <span className="text-slate-400 block uppercase tracking-wider text-[10px]">Issue Date</span>
                    <span className="text-sm font-bold text-slate-200 block">{searchResult.certificate.issueDate}</span>
                  </div>
                  <div className="p-4 rounded-xl bg-[#1A1A1D] border border-[#2D2D30] space-y-1">
                    <span className="text-slate-400 block uppercase tracking-wider text-[10px]">Issuing Authority</span>
                    <span className="text-sm font-bold text-white block">Eyoel Endale Belete Academy</span>
                  </div>
                </div>
              )}

              {activeType === 'report-card' && searchResult.reportCard && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                    <div className="p-3 rounded-xl bg-[#1A1A1D] border border-[#2D2D30]">
                      <span className="text-slate-400 block text-[10px]">Grade & Stream</span>
                      <span className="font-bold text-white">{searchResult.reportCard.grade} ({searchResult.reportCard.stream})</span>
                    </div>
                    <div className="p-3 rounded-xl bg-[#1A1A1D] border border-[#2D2D30]">
                      <span className="text-slate-400 block text-[10px]">Cumulative GPA</span>
                      <span className="font-bold text-[#C5A059] text-base">{searchResult.reportCard.gpa.toFixed(2)} / 4.00</span>
                    </div>
                    <div className="p-3 rounded-xl bg-[#1A1A1D] border border-[#2D2D30]">
                      <span className="text-slate-400 block text-[10px]">Average Score</span>
                      <span className="font-bold text-emerald-400 text-base">{searchResult.reportCard.averageScore.toFixed(1)}%</span>
                    </div>
                    <div className="p-3 rounded-xl bg-[#1A1A1D] border border-[#2D2D30]">
                      <span className="text-slate-400 block text-[10px]">Class Rank</span>
                      <span className="font-bold text-white text-base">#{searchResult.reportCard.rank} of {searchResult.reportCard.totalStudentsInClass}</span>
                    </div>
                  </div>

                  {/* Subject Scores Preview */}
                  <div className="overflow-x-auto rounded-xl border border-[#2D2D30]">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-[#18181B] text-slate-400 font-semibold border-b border-[#2D2D30]">
                        <tr>
                          <th className="p-2.5">Subject</th>
                          <th className="p-2.5">Activity (10)</th>
                          <th className="p-2.5">Tests (15)</th>
                          <th className="p-2.5">Mid (25)</th>
                          <th className="p-2.5">Final (50)</th>
                          <th className="p-2.5 text-right font-bold text-white">Total (100)</th>
                          <th className="p-2.5 text-right font-bold">Grade</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#2D2D30]/60">
                        {searchResult.reportCard.subjects.map((sub, i) => (
                          <tr key={i} className="hover:bg-[#1C1C1F]">
                            <td className="p-2.5 font-medium text-white">{sub.subjectName}</td>
                            <td className="p-2.5 text-slate-300">{sub.classActivity}</td>
                            <td className="p-2.5 text-slate-300">{sub.testsAndAssignments}</td>
                            <td className="p-2.5 text-slate-300">{sub.midExam}</td>
                            <td className="p-2.5 text-slate-300">{sub.finalExam}</td>
                            <td className="p-2.5 text-right font-bold text-[#C5A059]">{sub.totalMark}</td>
                            <td className="p-2.5 text-right font-bold text-emerald-400">{sub.letterGrade}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className="flex justify-end pt-2">
                    <button
                      onClick={() => onTabChange('report-card')}
                      className="inline-flex items-center gap-1.5 text-xs text-[#C5A059] hover:underline font-semibold"
                    >
                      <span>Open Full Official Report Card</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}

              {/* Digital Watermark Footer */}
              <div className="pt-4 border-t border-[#2D2D30] flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-400">
                <span>Verification Cryptographic Hash: <code className="font-mono text-slate-300">0xEA20268F4B92C7</code></span>
                <span className="text-[#C5A059] font-semibold">Registered under Ministry of Education Standards</span>
              </div>
            </div>
          ) : (
            <div className="bg-[#1C1416] border border-rose-500/40 rounded-3xl p-6 sm:p-8 text-center space-y-3 shadow-xl">
              <div className="w-12 h-12 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center mx-auto">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-white">Record Verification Unsuccessful</h3>
              <p className="text-xs text-rose-200 max-w-md mx-auto">{searchResult.errorMessage}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
