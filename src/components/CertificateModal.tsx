import React, { useState } from 'react';
import {
  X,
  Award,
  Printer,
  CheckCircle,
  ShieldCheck,
  Sparkles,
  Copy,
  Check,
  Edit3,
  BookmarkCheck,
} from 'lucide-react';
import { CertificateRecord, Language, GradeLevel } from '../types';
import { TRANSLATIONS } from '../lib/translations';

interface CertificateModalProps {
  isOpen: boolean;
  onClose: () => void;
  certificate: CertificateRecord | null;
  language?: Language;
  onSaveCertificate?: (cert: CertificateRecord) => void;
}

export const CertificateModal: React.FC<CertificateModalProps> = ({
  isOpen,
  onClose,
  certificate: initialCert,
  language = 'en',
  onSaveCertificate,
}) => {
  const [mode, setMode] = useState<'view' | 'issue'>(initialCert ? 'view' : 'issue');
  const [copied, setCopied] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Form state for generating / customizing certificate
  const [studentName, setStudentName] = useState(initialCert?.studentName || 'Scholar Student');
  const [selectedSubject, setSelectedSubject] = useState(initialCert?.subjectName || 'Mathematics (Grade 12)');
  const [selectedGrade, setSelectedGrade] = useState<GradeLevel>(initialCert?.grade || 'Grade 12');
  const [scorePercentage, setScorePercentage] = useState(initialCert?.scorePercentage || 95);
  const [distinction, setDistinction] = useState<'First Class Honors' | 'Excellence Distinction' | 'Proficiency Pass'>(
    initialCert?.distinction || 'First Class Honors'
  );

  if (!isOpen) return null;

  const t = TRANSLATIONS[language] || TRANSLATIONS.en;

  // Active certificate being displayed
  const currentCert: CertificateRecord = initialCert && mode === 'view'
    ? initialCert
    : {
        id: initialCert?.id || `cert-${Date.now()}`,
        studentName: studentName.trim() || 'Scholar Student',
        subjectName: selectedSubject,
        grade: selectedGrade,
        issueDate: initialCert?.issueDate || new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        scorePercentage: scorePercentage,
        certificateNumber: initialCert?.certificateNumber || `EYOEL-${selectedSubject.substring(0, 4).toUpperCase().replace(/[^A-Z]/g, '') || 'ACAD'}-${Math.floor(10000 + Math.random() * 90000)}`,
        distinction: distinction,
      };

  const handlePrint = () => {
    window.print();
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(
      `Eyoel Endale Belete Certificate of Excellence | Verification ID: ${currentCert.certificateNumber} | Awarded to: ${currentCert.studentName} | Score: ${currentCert.scorePercentage}%`
    );
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleSaveToProfile = () => {
    if (onSaveCertificate) {
      onSaveCertificate(currentCert);
    }
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const subjectsList = [
    'Biology',
    'Physics',
    'History',
    'Mathematics',
    'Chemistry',
    'English Language',
    'Geography',
    'Economics',
    'Civics & Ethical Education',
    'Information Technology (IT)',
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-3 sm:p-4 overflow-y-auto">
      <div className="bg-[#111112] rounded-3xl max-w-3xl w-full border border-[#2D2D30] p-5 sm:p-8 space-y-5 shadow-2xl relative my-6 text-white">
        
        {/* Top Controls Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#2D2D30] no-print">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#C5A059]/20 border border-[#C5A059] flex items-center justify-center text-[#C5A059]">
              <Award className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-serif font-bold text-white">
                {t.certTitle}
              </h3>
              <span className="text-[10px] text-slate-400">
                {language === 'am'
                  ? 'የእዮኤል እንዳለ በለጠ የትምህርት ልህቀት ማረጋገጫ ሰነድ'
                  : language === 'om'
                  ? 'Waraqaa Ragaa Gahumsa Barnootaa Eyoel Endale Belete'
                  : 'Official Academic Distinction Registry by Eyoel Endale Belete'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Toggle Mode Button */}
            <button
              onClick={() => setMode(mode === 'view' ? 'issue' : 'view')}
              className="px-3 py-1.5 rounded-full bg-[#1A1A1C] border border-[#2D2D30] hover:border-[#C5A059] text-slate-300 hover:text-white text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <Edit3 className="w-3.5 h-3.5 text-[#C5A059]" />
              {mode === 'view'
                ? (language === 'am' ? 'ሰርተፊኬት / ፊርማ አዘጋጅ' : language === 'om' ? 'Waraqaa Ragaa Qopheessi' : 'Customize & Signature')
                : (language === 'am' ? 'ሰርተፊኬቱን ተመልከት' : language === 'om' ? 'Waraqaa Ragaa Ilaali' : 'Preview Certificate')}
            </button>

            {/* Print / Save PDF Button */}
            <button
              onClick={handlePrint}
              className="px-3.5 py-1.5 rounded-full bg-[#C5A059] hover:bg-[#d8b168] text-black text-xs font-bold flex items-center gap-1.5 transition-colors shadow-md"
              title="Print Certificate or Save as PDF"
            >
              <Printer className="w-3.5 h-3.5" />
              {t.printCert}
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white bg-[#1A1A1C] border border-[#2D2D30]"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* ISSUANCE / DETAILS CUSTOMIZATION PANEL */}
        {mode === 'issue' && (
          <div className="p-5 rounded-2xl bg-[#161618] border border-[#2D2D30] space-y-4 no-print animate-in fade-in duration-200">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-[#C5A059] flex items-center gap-1.5">
                <Sparkles className="w-4 h-4" />
                {language === 'am' ? 'የሰርተፊኬት ማዘጋጃ እና ማስተካከያ' : language === 'om' ? 'Unka Waraqaa Ragaa Qopheessuu' : 'Certificate Details & Generation'}
              </span>
              <span className="text-[10px] text-slate-400">
                {language === 'am' ? 'የተማሪውን ስም እና የትምህርት ዝርዝር ያስገቡ' : language === 'om' ? 'Maqaa barataafi odeeffannoo barnootaa galchaa' : 'Enter recipient name and academic details'}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {/* Student Name */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-300 mb-1">
                  {t.certStudentName}
                </label>
                <input
                  type="text"
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  placeholder="e.g. Abebe Bikila / Chala Tadesse"
                  className="w-full px-3.5 py-2 rounded-xl bg-[#111112] border border-[#2D2D30] text-white text-xs focus:border-[#C5A059] focus:outline-none"
                />
              </div>

              {/* Subject */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-300 mb-1">
                  {t.certSubject}
                </label>
                <select
                  value={selectedSubject}
                  onChange={(e) => setSelectedSubject(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-[#111112] border border-[#2D2D30] text-white text-xs focus:border-[#C5A059] focus:outline-none"
                >
                  {subjectsList.map((subj) => (
                    <option key={subj} value={subj}>
                      {subj}
                    </option>
                  ))}
                </select>
              </div>

              {/* Grade */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-300 mb-1">
                  {t.certGrade}
                </label>
                <select
                  value={selectedGrade}
                  onChange={(e) => setSelectedGrade(e.target.value as GradeLevel)}
                  className="w-full px-3.5 py-2 rounded-xl bg-[#111112] border border-[#2D2D30] text-white text-xs focus:border-[#C5A059] focus:outline-none"
                >
                  <option value="Grade 9">Grade 9 (9ኛ ክፍል)</option>
                  <option value="Grade 10">Grade 10 (10ኛ ክፍል)</option>
                  <option value="Grade 11">Grade 11 (11ኛ ክፍል)</option>
                  <option value="Grade 12">Grade 12 (12ኛ ክፍል)</option>
                </select>
              </div>

              {/* Honors Distinction */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-300 mb-1">
                  {t.certDistinction}
                </label>
                <select
                  value={distinction}
                  onChange={(e) => {
                    const val = e.target.value as 'First Class Honors' | 'Excellence Distinction' | 'Proficiency Pass';
                    setDistinction(val);
                    if (val === 'First Class Honors') setScorePercentage(95);
                    else if (val === 'Excellence Distinction') setScorePercentage(85);
                    else setScorePercentage(75);
                  }}
                  className="w-full px-3.5 py-2 rounded-xl bg-[#111112] border border-[#2D2D30] text-white text-xs focus:border-[#C5A059] focus:outline-none"
                >
                  <option value="First Class Honors">First Class Honors (90% - 100%)</option>
                  <option value="Excellence Distinction">Excellence Distinction (80% - 89%)</option>
                  <option value="Proficiency Pass">Proficiency Pass (70% - 79%)</option>
                </select>
              </div>
            </div>

            {/* Official Signatories Notice */}
            <div className="p-3 rounded-xl bg-[#111112] border border-[#2D2D30] flex items-center justify-between text-xs text-slate-300">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#C5A059]" />
                <span>
                  {language === 'am'
                    ? 'ሰርተፊኬቱ በዋና ዳይሬክተሩ (Eyoel Endale Belete) እና በአካዳሚክ ዳይሬክተሩ የተፈረመ ኦፊሴላዊ ሰነድ ነው።'
                    : 'Certificate is officially endorsed & signed by the General Director & Academic Dean.'}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setMode('view')}
                className="px-4 py-1.5 rounded-full bg-[#C5A059] text-black font-bold text-xs hover:bg-[#d8b168] transition-colors"
              >
                {language === 'am' ? 'ሰርተፊኬቱን ተመልከት' : 'Preview Certificate'}
              </button>
            </div>
          </div>
        )}

        {/* OFFICIAL CERTIFICATE CARD (PRINT TARGET) */}
        <div className="certificate-print-area relative p-6 sm:p-10 rounded-3xl bg-gradient-to-b from-[#18181A] via-[#141416] to-[#101012] border-4 border-double border-[#C5A059] text-center space-y-5 sm:space-y-7 shadow-2xl overflow-hidden">
          
          {/* Subtle Decorative Background Seal */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-5">
            <span className="font-serif text-[240px] font-black text-[#C5A059]">E</span>
          </div>

          {/* Corner Ornamental Accents */}
          <div className="absolute top-3 left-3 w-6 h-6 border-t-2 border-l-2 border-[#C5A059]/60" />
          <div className="absolute top-3 right-3 w-6 h-6 border-t-2 border-r-2 border-[#C5A059]/60" />
          <div className="absolute bottom-3 left-3 w-6 h-6 border-b-2 border-l-2 border-[#C5A059]/60" />
          <div className="absolute bottom-3 right-3 w-6 h-6 border-b-2 border-r-2 border-[#C5A059]/60" />

          {/* Header Seal & Platform Title */}
          <div className="flex flex-col items-center gap-2 sm:gap-3">
            <div className="w-14 h-14 sm:w-18 sm:h-18 rounded-full bg-[#C5A059] flex items-center justify-center text-black font-serif font-black text-2xl sm:text-3xl shadow-xl shadow-[#C5A059]/30 border-2 border-[#E5C378]">
              E
            </div>
            <div className="space-y-0.5 sm:space-y-1">
              <h2 className="text-xl sm:text-3xl font-serif font-bold tracking-widest text-[#C5A059] uppercase">
                EYOEL ENDALE BELETE
              </h2>
              <p className="text-[9px] sm:text-xs tracking-[0.25em] text-slate-300 uppercase font-semibold">
                {language === 'am'
                  ? 'የሁለተኛ ደረጃ ትምህርት የልህቀት ማረጋገጫ ሰርተፊኬት'
                  : language === 'om'
                  ? 'Galmee Gahumsa Barnoota Sadarkaa 2ffaa Itoophiyaa'
                  : 'Ethiopian Secondary Education Academic Excellence Registry'}
              </p>
            </div>
          </div>

          {/* Recipient Title */}
          <div className="space-y-1.5 max-w-xl mx-auto">
            <span className="text-xs uppercase tracking-widest text-slate-400 block font-serif italic">
              {t.certCertifies}
            </span>
            <div className="border-b-2 border-[#C5A059]/60 pb-1.5 inline-block px-6 max-w-full">
              <h1 className="text-2xl sm:text-3xl font-serif font-extrabold text-white tracking-wide truncate">
                {currentCert.studentName}
              </h1>
            </div>
          </div>

          {/* Certification Body Text */}
          <p className="text-xs sm:text-sm text-slate-200 max-w-xl mx-auto leading-relaxed font-sans px-2">
            {language === 'am'
              ? `በ9-12ኛ ክፍል ስርዓተ-ትምህርት ለ ${currentCert.subjectName} (${currentCert.grade}) ከፍተኛ የብቃት ደረጃን ያሳየ ሲሆን፣ በአጠቃላይ ፈተና ${currentCert.scorePercentage}% ውጤት በማስመዝገብ የክብር ማዕረግ ${currentCert.distinction} ተሰጥቶታል።`
              : language === 'om'
              ? `Sirna barnootaa kutaa 9-12 keessatti barnoota ${currentCert.subjectName} (${currentCert.grade}) irratti gahumsa olaanaa agarsiisuun, qabxii ${currentCert.scorePercentage}% galmeessuun sadarkaa ${currentCert.distinction} argateera.`
              : `has demonstrated distinguished mastery in the Grade 9–12 secondary curriculum for ${currentCert.subjectName} (${currentCert.grade}), achieving an academic evaluation score of ${currentCert.scorePercentage}% with honors designation of ${currentCert.distinction}.`}
          </p>

          {/* SIGNATURES & OFFICIAL SEALS (Triple Grid: Director of Academics | Official Seal | General Director & Founder) */}
          <div className="grid grid-cols-3 items-end pt-5 sm:pt-7 border-t border-[#2D2D30] gap-2">
            
            {/* Academic Affairs Director Signature */}
            <div className="flex flex-col items-center space-y-1 text-center">
              <div className="h-10 flex items-center justify-center">
                <span className="font-serif italic text-sm sm:text-base text-amber-200/90 font-medium tracking-wide">
                  Dr. Tsegaye Alemu
                </span>
              </div>
              <div className="w-24 sm:w-32 border-b border-[#C5A059]/40" />
              <span className="text-[8px] sm:text-[9px] text-slate-400 uppercase tracking-widest block font-medium">
                {language === 'am' ? 'የአካዳሚክ ዳይሬክተር' : language === 'om' ? 'Daarektara Barnootaa' : 'Academic Affairs Director'}
              </span>
            </div>

            {/* Official Academic Seal */}
            <div className="flex flex-col items-center space-y-1">
              <div className="w-11 h-11 sm:w-13 sm:h-13 rounded-full border-2 border-[#C5A059] bg-[#1A1A1C] flex items-center justify-center text-[#C5A059] shadow-md shadow-[#C5A059]/20">
                <ShieldCheck className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <span className="text-[8px] sm:text-[9px] text-slate-300 font-mono">
                {currentCert.issueDate}
              </span>
              <span className="text-[7px] sm:text-[8px] text-[#C5A059] uppercase tracking-widest font-bold">
                OFFICIAL SEAL
              </span>
            </div>

            {/* Founder & General Director Signature */}
            <div className="flex flex-col items-center space-y-1 text-center">
              <div className="h-10 flex items-center justify-center">
                {/* Stylized Signature of Founder & General Director Eyoel Endale Belete */}
                <span className="font-serif italic text-sm sm:text-base text-[#C5A059] font-bold tracking-widest">
                  Eyoel Endale Belete
                </span>
              </div>
              <div className="w-24 sm:w-32 border-b border-[#C5A059]/40" />
              <span className="text-[8px] sm:text-[9px] text-slate-400 uppercase tracking-widest block font-medium">
                {language === 'am' ? 'ዋና ዳይሬክተር እና መስራች' : language === 'om' ? 'Hundeessaafi Daarektara Ol’aanaa' : 'General Director & Founder'}
              </span>
            </div>

          </div>

          {/* Verification Barcode Footer */}
          <div className="flex items-center justify-between text-[8px] sm:text-[9px] text-slate-500 font-mono pt-2 border-t border-[#2D2D30]/60">
            <span>ID: {currentCert.certificateNumber}</span>
            <span className="text-emerald-400 flex items-center gap-1">
              <CheckCircle className="w-2.5 h-2.5" /> SECURE ACCREDITED REGISTRY
            </span>
          </div>
        </div>

        {/* Action Toolbar Bottom Bar (Hide in Print) */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 text-xs no-print">
          
          <div className="flex items-center gap-2 text-slate-400 text-[11px]">
            <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
            <span>
              {language === 'am'
                ? 'ይህ ሰርተፊኬት በእዮኤል እንዳለ በለጠ የትምህርት መዝገብ ውስጥ በደህንነት ተመዝግቧል።'
                : language === 'om'
                ? 'Waraqaan ragaa kun kuusaa Eyoel Endale Belete keessatti mirkanaa\'eera.'
                : 'Accredited certificate verified with digital signature.'}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* Copy Verification link */}
            <button
              onClick={handleCopyCode}
              className="px-3 py-1.5 rounded-full bg-[#1A1A1C] border border-[#2D2D30] hover:border-[#C5A059] text-slate-300 hover:text-white flex items-center gap-1.5 transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-[#C5A059]" />}
              <span>{copied ? (language === 'am' ? 'ተቀድቷል!' : 'Copied!') : (language === 'am' ? 'መለያ ቅዳ' : 'Copy ID')}</span>
            </button>

            {/* Save to Profile */}
            <button
              onClick={handleSaveToProfile}
              className="px-4 py-1.5 rounded-full bg-[#1A1A1C] border border-[#C5A059]/40 hover:border-[#C5A059] text-[#C5A059] hover:bg-[#C5A059]/10 font-bold flex items-center gap-1.5 transition-colors"
            >
              <BookmarkCheck className="w-3.5 h-3.5" />
              <span>{savedSuccess ? (language === 'am' ? 'ተመዝግቧል!' : 'Saved!') : (language === 'am' ? 'በመገለጫዬ አስቀምጥ' : 'Save to Dossier')}</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
