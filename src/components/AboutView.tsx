import React from 'react';
import {
  Award,
  BookOpen,
  Target,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import { ViewTab, Language } from '../types';
import { TRANSLATIONS } from '../lib/translations';

interface AboutViewProps {
  language: Language;
  onTabChange: (tab: ViewTab) => void;
}

export const AboutView: React.FC<AboutViewProps> = ({ language, onTabChange }) => {
  const t = TRANSLATIONS[language] || TRANSLATIONS.en;

  const leadership = [
    {
      name: 'Eyoel Endale Belete',
      role: language === 'am' ? 'መስራች እና የትምህርት ፕሮግራሞች ኃላፊ' : language === 'om' ? 'Hundeeffamaafi Hogganaa Sagantaa Barnootaa' : 'Founder & Head of Academic Programs',
      qualification: 'B.Sc. & M.Sc. Electrical Engineering, Educational Technologist',
      bio: language === 'am'
        ? 'በአዲሱ ስርዓተ-ትምህርት ላይ ተመስርቶ ከ15,000 በላይ ተማሪዎችን ለብሔራዊ ፈተና ልህቀት ያበቃ የትምህርት ቴክኖሎጂ ባለሙያ።'
        : language === 'om'
        ? 'Sirna barnootaa ammayyeeffame irratti hundaa\'uun barattoota 15,000 ol qorumsa biyyaalessaatiif kan qopheesse.'
        : 'Pioneered modernized STEM and secondary matriculation curricula helping over 15,000 students attain top national ranks.',
      avatar: '👨‍🏫',
    },
    {
      name: 'Dr. Almaz Kebede',
      role: language === 'am' ? 'የተፈጥሮ ሳይንስና ምርምር ዳይሬክተር' : language === 'om' ? 'Daarektara Saayinsii Uumamaafi Qorannoo' : 'Director of Natural Sciences & Research',
      qualification: 'Ph.D. in Cellular Biology, Addis Ababa University',
      bio: language === 'am'
        ? 'የባዮሎጂ፣ ኬሚስትሪና ፊዚክስ ጥናታዊ ምዕራፎችን እና የፈተና ጥያቄዎችን አዘጋጅ።'
        : language === 'om'
        ? 'Gabaasawwan baayoloojii, keemistriifi fiiziksii qopheessituu.'
        : 'Oversees biology, chemistry, and physics interactive unit modules and problem sets.',
      avatar: '👩‍🔬',
    },
    {
      name: 'Ato Yohannes Haile',
      role: language === 'am' ? 'የሂሳብ ትምህርት ዘርፍ ኃላፊ' : language === 'om' ? 'Hogganaa Damee Barnoota Herregaa' : 'Head of Mathematics & Calculus Division',
      qualification: 'M.Sc. Applied Mathematics, 18+ Years High School Exam Prep',
      bio: language === 'am'
        ? 'ለ18 ዓመታት የ11ኛ እና 12ኛ ክፍል የሂሳብና ካልኩለስ ማብራሪያዎችን ሲያዘጋጅ የቆየ አንጋፋ መምህር።'
        : language === 'om'
        ? 'Waggaa 18 oliif ibsa herregaa kutaa 11fi 12 qopheessaa kan ture.'
        : 'Author of celebrated secondary calculus and vector motion step-by-step master guides.',
      avatar: '📐',
    },
  ];

  const milestones = [
    { number: '15,000+', label: language === 'am' ? 'የ9-12ኛ ክፍል ተማሪዎች' : language === 'om' ? 'Barattoota Kutaa 9-12' : 'Grade 9–12 Scholars Empowered' },
    { number: '98.4%', label: language === 'am' ? 'የብሔራዊ ፈተና ማለፍ ምጣኔ' : language === 'om' ? 'Qabxii Qorumsa Biyyaalessaa' : 'National Exam Pass Rate' },
    { number: '100%', label: language === 'am' ? 'ሙሉ የስርዓተ-ትምህርት ሽፋን' : language === 'om' ? 'Uwwisa Sirna Barnootaa' : 'Comprehensive Subject Coverage' },
    { number: '500+', label: language === 'am' ? 'የተሰጡ የክብር ሰርተፊኬቶች' : language === 'om' ? 'Waraqaa Ragaa Kenname' : 'Verified Honor Certificates Issued' },
  ];

  return (
    <div className="min-h-screen py-10 sm:py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-16">
      
      {/* Hero Section */}
      <section className="text-center space-y-6 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#161618] border border-[#2D2D30] text-[#C5A059] text-xs font-semibold uppercase tracking-widest">
          <Sparkles className="w-3.5 h-3.5" />
          {t.aboutHeading}
        </div>

        <h1 className="text-3xl sm:text-5xl font-serif font-extrabold text-white tracking-tight leading-tight">
          {language === 'am'
            ? 'የኢትዮጵያና የዓለም አቀፍ የሁለተኛ ደረጃ ተማሪዎችን በልህቀት ማብቃት'
            : language === 'om'
            ? 'Barattoota Sadarkaa 2ffaa Itoophiyaafi Addunyaa Gahumsa Barnootaan Cimsuu'
            : 'Empowering Ethiopian & Global High School Scholars with Academic Rigor'}
        </h1>

        <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
          {language === 'am'
            ? 'የእዮኤል እንዳለ በለጠ የትምህርት ፖርታል ለ9ኛ-12ኛ ክፍል ተማሪዎች የተሟላ የተፈጥሮና ማህበራዊ ሳይንስ የጥናት ማስታወሻዎችን፣ የ20 ጥያቄዎች የፈተና ባንኮችንና የአርቴፊሻል ኢንተለጀንስ አስጠኚን በአንድነት ያቀርባል።'
            : language === 'om'
            ? 'Sirni barnootaa Eyoel Endale Belete barattoota kutaa 9-12tiif gabaasa barnoota saayinsii uumamaafi hawaasaa, kuusaa qorumsaa gaaffilee 20 fi barsiisaa AI dhiyeessa.'
            : 'Eyoel Endale Belete platform was founded with a singular mission: to provide Grade 9–12 students with world-class, accessible, and structured secondary education across both Natural Science and Social Science streams.'}
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <button
            onClick={() => onTabChange('subjects')}
            className="px-6 py-3 rounded-full bg-[#C5A059] hover:bg-[#d8b168] text-black font-bold text-xs uppercase tracking-wider flex items-center gap-2 transition-colors shadow-lg shadow-[#C5A059]/20"
          >
            {t.btnExploreCurriculum} <ArrowRight className="w-4 h-4" />
          </button>
          <button
            onClick={() => onTabChange('contact')}
            className="px-6 py-3 rounded-full bg-[#161618] hover:bg-[#202024] border border-[#2D2D30] hover:border-[#C5A059] text-slate-200 font-bold text-xs uppercase tracking-wider transition-colors"
          >
            {t.navContact}
          </button>
        </div>
      </section>

      {/* Stats Counter */}
      <section className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {milestones.map((m, idx) => (
          <div
            key={idx}
            className="p-6 rounded-2xl bg-[#111112] border border-[#2D2D30] text-center space-y-1"
          >
            <span className="block text-2xl sm:text-4xl font-serif font-bold text-[#C5A059]">
              {m.number}
            </span>
            <span className="text-[11px] sm:text-xs text-slate-400 font-medium uppercase tracking-wider block">
              {m.label}
            </span>
          </div>
        ))}
      </section>

      {/* Pedagogical Pillars */}
      <section className="space-y-8">
        <div className="text-center space-y-2">
          <span className="text-xs font-bold uppercase tracking-widest text-[#C5A059]">
            {language === 'am' ? 'የትምህርት መርሆች' : language === 'om' ? 'Utubaalee Barnootaa' : 'Educational Blueprint'}
          </span>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white">
            {language === 'am' ? 'ሦስቱ የልህቀት መሰረቶች' : language === 'om' ? 'Utubaalee Gahumsa Barnootaa Sadanuu' : 'Our Three Pillars of Academic Mastery'}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 sm:p-8 rounded-3xl bg-[#111112] border border-[#2D2D30] space-y-4 hover:border-[#C5A059] transition-colors">
            <div className="w-12 h-12 rounded-2xl bg-[#1A1A1C] border border-[#2D2D30] flex items-center justify-center text-[#C5A059]">
              <BookOpen className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-serif font-bold text-white">
              {language === 'am' ? '1. የምዕራፍ ማጠቃለያዎችና ቀመሮች' : language === 'om' ? '1. Gabaasa Boqonnaafi Foormulaawwan' : '1. Modular Unit Summaries & Formula Sheets'}
            </h3>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              {language === 'am'
                ? 'እያንዳንዱ ምዕራፍ በቁልፍ ቃላት፣ የሂሳብና ሳይንስ ቀመሮች እና በብሔራዊ ፈተና ተደጋግመው በሚመጡ ጥያቄዎች ተደራጅቷል።'
                : language === 'om'
                ? 'Boqonnaan hundi jechoota ijoo, foormulaawwan fi gaaffilee qorumsa biyyaalessaa deddeebi\'aniin qindaa\'eera.'
                : 'Every chapter is condensed into high-impact key terms, LaTeX formulas, and visual callout boxes highlighting recurring national examination questions.'}
            </p>
          </div>

          <div className="p-6 sm:p-8 rounded-3xl bg-[#111112] border border-[#2D2D30] space-y-4 hover:border-[#C5A059] transition-colors">
            <div className="w-12 h-12 rounded-2xl bg-[#1A1A1C] border border-[#2D2D30] flex items-center justify-center text-[#C5A059]">
              <Target className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-serif font-bold text-white">
              {language === 'am' ? '2. የ20 ጥያቄዎች ፈተና ከሙሉ ማብራሪያ ጋር' : language === 'om' ? '2. Qorumsa Gaaffilee 20 Ibsa Guutuu Waliin' : '2. Timed Quizzes with Step-by-Step Rationale'}
            </h3>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              {language === 'am'
                ? 'እውነተኛ የፈተና ድባብን በመፍጠር ለእያንዳንዱ ትክክለኛና የተሳሳተ መልስ ፈጣን ማብራሪያ ይሰጣል።'
                : language === 'om'
                ? 'Haala qorumsa qabatamaa uumuun deebii sirriifi dogoggoraatiif ibsa battalaa kenna.'
                : 'Active recall testing simulates real exam conditions with instant explanations for every correct and incorrect answer option.'}
            </p>
          </div>

          <div className="p-6 sm:p-8 rounded-3xl bg-[#111112] border border-[#2D2D30] space-y-4 hover:border-[#C5A059] transition-colors">
            <div className="w-12 h-12 rounded-2xl bg-[#1A1A1C] border border-[#2D2D30] flex items-center justify-center text-[#C5A059]">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-serif font-bold text-white">
              {language === 'am' ? '3. 24/7 የኤአይ አስጠኚ' : language === 'om' ? '3. Barsiisaa AI 24/7' : '3. AI-Powered 24/7 Study Tutor'}
            </h3>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              {language === 'am'
                ? 'ተማሪዎች በየትኛውም ሰዓት የሂሳብና ሳይንስ ጥያቄዎቻቸውን የሚመልስ እና ማብራሪያ የሚሰጥ የኤአይ አስጠኚ ያገኛሉ።'
                : language === 'om'
                ? 'Barattoonni yeroo kamiyyuu gaaffilee herregaafi saayinsii kan deebisu barsiisaa AI argatu.'
                : 'Students have constant access to intelligent AI tutoring that provides immediate math solutions, concept analogies, and essay critiques.'}
            </p>
          </div>
        </div>
      </section>

      {/* Academic Leadership */}
      <section className="space-y-8">
        <div className="text-center space-y-2">
          <span className="text-xs font-bold uppercase tracking-widest text-[#C5A059]">
            {language === 'am' ? 'አመራርና መምህራን' : language === 'om' ? 'Hoggansaafi Barsiisota' : 'Faculty & Leadership'}
          </span>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white">
            {language === 'am' ? 'በልምድ በዳበሩ የትምህርት ባለሙያዎች የተመራ' : language === 'om' ? 'Ogeessota Barnootaa Muuxannoo Qabaniin Kan Durfamu' : 'Led by Experienced Educators & Subject Specialists'}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {leadership.map((leader, idx) => (
            <div
              key={idx}
              className="p-6 rounded-3xl bg-[#111112] border border-[#2D2D30] space-y-4 text-center"
            >
              <div className="w-20 h-20 mx-auto rounded-full bg-[#1A1A1C] border-2 border-[#C5A059] flex items-center justify-center text-4xl shadow-lg shadow-[#C5A059]/10">
                {leader.avatar}
              </div>
              <div>
                <h4 className="text-base font-bold text-white">{leader.name}</h4>
                <span className="text-xs text-[#C5A059] font-medium block">{leader.role}</span>
                <span className="text-[10px] text-slate-400 block mt-0.5">{leader.qualification}</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                {leader.bio}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Verified Certification Notice */}
      <section className="p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-[#18181A] via-[#111112] to-[#18181A] border border-[#C5A059]/40 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 max-w-xl">
          <div className="flex items-center gap-2 text-[#C5A059]">
            <Award className="w-5 h-5" />
            <span className="text-xs font-bold uppercase tracking-widest">{t.certTitle}</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-serif font-bold text-white">
            {language === 'am' ? 'እውቅና ያለው የትምህርት ልህቀት ሰርተፊኬት ያግኙ' : language === 'om' ? 'Waraqaa Ragaa Gahumsa Barnootaa Fudhadhaa' : 'Earn Accredited Subject Certificates of Excellence'}
          </h3>
          <p className="text-xs sm:text-sm text-slate-300">
            {language === 'am'
              ? 'በፈተናዎች ላይ 70% ወይም ከዚያ በላይ በማምጣት የእዮኤል እንዳለ በለጠ ይፋዊ ሰርተፊኬት ያግኙ።'
              : language === 'om'
              ? 'Qorumsa irratti 70% ykn isaa ol galmeessuun waraqaa ragaa Eyoel Endale Belete fudhadhaa.'
              : 'Score 70% or higher on our comprehensive curriculum assessments to unlock official, verifiable Eyoel Endale Belete Certificates of Mastery.'}
          </p>
        </div>

        <button
          onClick={() => onTabChange('quizzes')}
          className="px-6 py-3.5 rounded-full bg-[#C5A059] hover:bg-[#d8b168] text-black font-bold text-xs uppercase tracking-wider whitespace-nowrap shadow-lg shadow-[#C5A059]/20 transition-colors"
        >
          {t.btnTakeQuiz}
        </button>
      </section>

    </div>
  );
};
