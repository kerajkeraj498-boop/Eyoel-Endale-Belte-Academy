import React from 'react';
import { Mail, Phone, MapPin, Heart, BookOpen, Award, CheckCircle, ShieldCheck } from 'lucide-react';
import { ViewTab, Language } from '../types';
import { TRANSLATIONS } from '../lib/translations';

interface FooterProps {
  language: Language;
  onTabChange: (tab: ViewTab) => void;
  onGradeSelect: (grade: string) => void;
  onOpenAdmin: () => void;
}

export const Footer: React.FC<FooterProps> = ({ language, onTabChange, onGradeSelect, onOpenAdmin }) => {
  const t = TRANSLATIONS[language] || TRANSLATIONS.en;

  return (
    <footer className="bg-[#0A0A0B] text-slate-300 pt-16 pb-12 border-t border-[#2D2D30]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-[#2D2D30]">
          
          {/* Brand & About */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#C5A059] rounded-lg flex items-center justify-center font-serif text-2xl font-bold text-black italic shadow-lg shadow-[#C5A059]/20">
                E
              </div>
              <span className="text-xl font-serif font-bold text-white tracking-wide">
                EYOEL ENDALE BELETE
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed max-w-sm">
              {t.footerDesc}
            </p>
            <div className="flex flex-wrap items-center gap-3 pt-2 text-xs text-slate-400">
              <span className="flex items-center gap-1.5 text-emerald-400">
                <CheckCircle className="w-4 h-4" /> {t.heroBadge}
              </span>
              <span className="flex items-center gap-1.5 text-[#C5A059]">
                <ShieldCheck className="w-4 h-4" /> {t.featureExamsTitle}
              </span>
            </div>
          </div>

          {/* Quick Grade Jumps */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-widest text-[#C5A059]">
              {language === 'am' ? 'የትምህርት ደረጃዎች' : language === 'om' ? 'Kutaalee Barnootaa' : 'Curriculum Levels'}
            </h4>
            <ul className="space-y-2 text-xs">
              {['Grade 9', 'Grade 10', 'Grade 11', 'Grade 12'].map((grade) => (
                <li key={grade}>
                  <button
                    onClick={() => {
                      onGradeSelect(grade);
                      onTabChange('notes');
                    }}
                    className="hover:text-[#C5A059] transition-colors flex items-center gap-2 text-slate-400"
                  >
                    <BookOpen className="w-3.5 h-3.5 text-[#C5A059]" />
                    {language === 'am' ? grade.replace('Grade ', 'ክፍል ') : language === 'om' ? grade.replace('Grade ', 'Kutaa ') : grade} {t.navNotes}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Core Modules */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-widest text-[#C5A059]">
              {t.quickLinks}
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <button onClick={() => onTabChange('subjects')} className="hover:text-[#C5A059] transition-colors">
                  {t.navCurriculum}
                </button>
              </li>
              <li>
                <button onClick={() => onTabChange('notes')} className="hover:text-[#C5A059] transition-colors">
                  {t.navNotes}
                </button>
              </li>
              <li>
                <button onClick={() => onTabChange('quizzes')} className="hover:text-[#C5A059] transition-colors">
                  {t.navQuizzes}
                </button>
              </li>
              <li>
                <button onClick={() => onTabChange('about')} className="hover:text-[#C5A059] transition-colors">
                  {t.navAbout}
                </button>
              </li>
              <li>
                <button onClick={() => onTabChange('contact')} className="hover:text-[#C5A059] transition-colors">
                  {t.navContact}
                </button>
              </li>
              <li>
                <button onClick={onOpenAdmin} className="hover:text-[#C5A059] text-[#C5A059] font-semibold transition-colors flex items-center gap-1.5 mt-1">
                  <ShieldCheck className="w-3.5 h-3.5" /> {t.navAdmin} Portal
                </button>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-widest text-[#C5A059]">
              {t.support}
            </h4>
            <div className="space-y-2.5 text-xs text-slate-400">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#C5A059] mt-0.5 shrink-0" />
                <span>Eyoel Endale Belete Educational Center, Addis Ababa, Ethiopia</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[#C5A059] shrink-0" />
                <span>kerajkeraj498@gmail.com</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#C5A059] shrink-0" />
                <span>+251 911 000 000</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} Eyoel Endale Belete. {t.footerRights}</p>
          <div className="flex items-center gap-4">
            <button onClick={onOpenAdmin} className="text-slate-400 hover:text-[#C5A059] transition">
              {t.navAdmin}
            </button>
            <span>•</span>
            <span className="flex items-center gap-1">
              {language === 'am' ? 'በልህቀት የተሰራ' : language === 'om' ? 'Qulqullinaan Kan Hojjetame' : 'Built with excellence'} <Heart className="w-3.5 h-3.5 text-[#C5A059] fill-[#C5A059] inline" />
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
