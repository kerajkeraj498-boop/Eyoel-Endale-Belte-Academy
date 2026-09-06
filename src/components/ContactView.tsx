import React, { useState } from 'react';
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  HelpCircle,
  CheckCircle2,
  ChevronDown,
  MessageSquare,
} from 'lucide-react';
import { GradeLevel, ContactMessage, Language } from '../types';
import { FAQ_ITEMS } from '../data/faqData';
import { SUBJECTS, GRADES } from '../data/gradesAndSubjects';
import { TRANSLATIONS, SUBJECT_TRANSLATIONS } from '../lib/translations';

interface ContactViewProps {
  language: Language;
}

export const ContactView: React.FC<ContactViewProps> = ({ language }) => {
  const t = TRANSLATIONS[language] || TRANSLATIONS.en;

  // Form State
  const [formData, setFormData] = useState<ContactMessage>({
    name: '',
    email: '',
    grade: 'Grade 10',
    subject: 'Mathematics',
    category: 'General Inquiry',
    message: '',
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [submittedRef, setSubmittedRef] = useState<string | null>(null);

  // FAQ Accordion Open State
  const [openFaqId, setOpenFaqId] = useState<string | null>('faq-1');
  const [faqCategory, setFaqCategory] = useState<string>('All');

  // Form Validation & Submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errors: Record<string, string> = {};

    if (!formData.name.trim()) errors.name = language === 'am' ? 'እባክዎ ሙሉ ስምዎን ያስገቡ።' : language === 'om' ? 'Mee maqaa keessan guutuu galchaa.' : 'Please enter your full name.';
    if (!formData.email.trim() || !formData.email.includes('@'))
      errors.email = language === 'am' ? 'እባክዎ ትክክለኛ ኢሜይል ያስገቡ።' : language === 'om' ? 'Mee imeelii sirrii galchaa.' : 'Please enter a valid email address.';
    if (!formData.message.trim() || formData.message.length < 10)
      errors.message = language === 'am' ? 'እባክዎ ቢያንስ 10 ፊደላት ያስገቡ።' : language === 'om' ? 'Mee yoo xiqqaate qubee 10 galchaa.' : 'Please enter at least 10 characters describing your inquiry.';

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setFormErrors({});
    const refCode = 'EYOEL-' + Math.floor(100000 + Math.random() * 900000);
    setSubmittedRef(refCode);

    // Reset Form
    setFormData({
      name: '',
      email: '',
      grade: 'Grade 10',
      subject: 'Mathematics',
      category: 'General Inquiry',
      message: '',
    });
  };

  const filteredFaqs = FAQ_ITEMS.filter(
    (item) => faqCategory === 'All' || item.category === faqCategory
  );

  return (
    <div className="space-y-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 bg-[#0A0A0B]">
      
      {/* Title Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#111112] text-[#C5A059] text-xs font-bold border border-[#2D2D30] uppercase tracking-[0.2em]">
          <Mail className="w-4 h-4 text-[#C5A059]" />
          <span>{t.navContact}</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-serif font-semibold text-white tracking-tight">
          {t.contactHeading}
        </h1>
        <p className="text-sm sm:text-base text-slate-400 leading-relaxed">
          {t.contactSub}
        </p>
      </div>

      {/* Main Grid: Contact Form & Info Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* Contact Form Column */}
        <div className="lg:col-span-7 bg-[#111112] rounded-3xl border border-[#2D2D30] p-6 sm:p-10 shadow-2xl space-y-6">
          <div>
            <h2 className="text-xl font-serif font-bold text-white flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-[#C5A059]" /> {language === 'am' ? 'መልእክት ይላኩልን' : language === 'om' ? 'Ergaa Nuuf Ergaa' : 'Send Us a Message'}
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              {language === 'am' ? 'የትምህርት ክፍላችን በ24 ሰዓት ውስጥ ምላሽ ይሰጥዎታል።' : language === 'om' ? 'Gareen barnootaa keenya sa\'aatii 24 keessatti deebii kenna.' : 'Our academic team responds to student messages within 24 hours.'}
            </p>
          </div>

          {submittedRef && (
            <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs sm:text-sm space-y-1">
              <div className="flex items-center gap-2 font-bold">
                <CheckCircle2 className="w-4 h-4" /> {language === 'am' ? 'መልእክትዎ በተሳካ ሁኔታ ተልኳል!' : language === 'om' ? 'Ergaan keessan milkaa\'inaan ergameera!' : 'Message Sent Successfully!'}
              </div>
              <p className="text-xs text-emerald-400/80">
                {language === 'am' ? 'የመከታተያ ቁጥርዎ:' : language === 'om' ? 'Lakkoofsa Hordoffii:' : 'Tracking Reference:'} <span className="font-mono font-bold text-white">{submittedRef}</span>
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Name & Email */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                  {language === 'am' ? 'ሙሉ ስም *' : language === 'om' ? 'Maqaa Guutuu *' : 'Full Name *'}
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Abebe Bikila"
                  className="w-full px-4 py-2.5 rounded-xl border border-[#2D2D30] bg-[#0A0A0B] text-white text-xs focus:outline-none focus:border-[#C5A059]"
                />
                {formErrors.name && (
                  <span className="text-[11px] font-medium text-rose-400 mt-1 block">
                    {formErrors.name}
                  </span>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                  {language === 'am' ? 'ኢሜይል *' : language === 'om' ? 'Imeelii *' : 'Email Address *'}
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="student@example.com"
                  className="w-full px-4 py-2.5 rounded-xl border border-[#2D2D30] bg-[#0A0A0B] text-white text-xs focus:outline-none focus:border-[#C5A059]"
                />
                {formErrors.email && (
                  <span className="text-[11px] font-medium text-rose-400 mt-1 block">
                    {formErrors.email}
                  </span>
                )}
              </div>
            </div>

            {/* Grade & Subject */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                  {language === 'am' ? 'የክፍል ደረጃ' : language === 'om' ? 'Sadarkaa Kutaa' : 'Grade Level'}
                </label>
                <select
                  value={formData.grade}
                  onChange={(e) => setFormData({ ...formData, grade: e.target.value as GradeLevel })}
                  className="w-full px-4 py-2.5 rounded-xl border border-[#2D2D30] bg-[#0A0A0B] text-white text-xs focus:outline-none focus:border-[#C5A059]"
                >
                  {GRADES.map((g) => (
                    <option key={g.level} value={g.level}>
                      {language === 'am' ? g.level.replace('Grade ', 'ክፍል ') : language === 'om' ? g.level.replace('Grade ', 'Kutaa ') : g.level}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                  {language === 'am' ? 'የትምህርት አይነት' : language === 'om' ? 'Gosa Barnootaa' : 'Subject'}
                </label>
                <select
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-[#2D2D30] bg-[#0A0A0B] text-white text-xs focus:outline-none focus:border-[#C5A059]"
                >
                  {SUBJECTS.map((s) => (
                    <option key={s.id} value={s.name}>
                      {SUBJECT_TRANSLATIONS[s.name]?.[language] || s.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Inquiry Category */}
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                {language === 'am' ? 'የጥያቄው አይነት' : language === 'om' ? 'Gosa Gaaffii' : 'Inquiry Category'}
              </label>
              <select
                value={formData.category}
                onChange={(e) =>
                  setFormData({ ...formData, category: e.target.value as ContactMessage['category'] })
                }
                className="w-full px-4 py-2.5 rounded-xl border border-[#2D2D30] bg-[#0A0A0B] text-white text-xs focus:outline-none focus:border-[#C5A059]"
              >
                <option value="General Inquiry">{language === 'am' ? 'አጠቃላይ ጥያቄ' : language === 'om' ? 'Gaaffii Waliigalaa' : 'General Inquiry'}</option>
                <option value="Notes Feedback">{language === 'am' ? 'የማስታወሻ አስተያየት ወይም እርማት' : language === 'om' ? 'Yaada Qabxii Barnootaa' : 'Notes Suggestion or Correction'}</option>
                <option value="Quiz Question Clarification">{language === 'am' ? 'የፈተና ጥያቄ ማብራሪያ' : language === 'om' ? 'Ibsa Gaaffii Qorumsaa' : 'Quiz Question Clarification'}</option>
                <option value="Technical Support">{language === 'am' ? 'የቴክኒክ ድጋፍ' : language === 'om' ? 'Deeggarsa Teeknikaa' : 'Technical Support'}</option>
              </select>
            </div>

            {/* Detailed Message */}
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                {language === 'am' ? 'መልእክትዎ *' : language === 'om' ? 'Ergaa Keessan *' : 'Your Message *'}
              </label>
              <textarea
                rows={4}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                placeholder={language === 'am' ? 'ጥያቄዎን ወይም አስተያየትዎን እዚህ ይጻፉ...' : language === 'om' ? 'Gaaffii ykn yaada keessan asitti barreessaa...' : 'Describe your question or feedback in detail...'}
                className="w-full px-4 py-3 rounded-xl border border-[#2D2D30] bg-[#0A0A0B] text-white text-xs focus:outline-none focus:border-[#C5A059]"
              />
              {formErrors.message && (
                <span className="text-[11px] font-medium text-rose-400 mt-1 block">
                  {formErrors.message}
                </span>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full py-3.5 px-6 rounded-full bg-[#C5A059] hover:bg-[#d8b168] text-black font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all transform hover:-translate-y-0.5"
            >
              <Send className="w-4 h-4" /> {language === 'am' ? 'መልእክት ላክ' : language === 'om' ? 'Ergaa Ergi' : 'Send Message'}
            </button>
          </form>
        </div>

        {/* Contact Info Side Cards */}
        <div className="lg:col-span-5 space-y-6">
          
          <div className="p-8 rounded-3xl bg-[#111112] text-white space-y-6 border border-[#2D2D30] shadow-xl relative overflow-hidden">
            <h3 className="text-xl font-serif font-bold text-[#C5A059] tracking-tight">EYOEL ENDALE BELETE</h3>
            
            <div className="space-y-4 text-xs sm:text-sm text-slate-300">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-[#C5A059] shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-white block">{language === 'am' ? 'ዋና ቢሮ' : language === 'om' ? 'Waajjira Guddaa' : 'Main Office'}</span>
                  <span>Eyoel Endale Belete Educational Center, Addis Ababa, Ethiopia</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-[#C5A059] shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-white block">{language === 'am' ? 'ኢሜይል' : language === 'om' ? 'Imeelii' : 'Email Support'}</span>
                  <span>kerajkeraj498@gmail.com</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-[#C5A059] shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-white block">{language === 'am' ? 'ስልክ ቁጥር' : language === 'om' ? 'Bilbila' : 'Phone Support'}</span>
                  <span>+251 911 000 000</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-[#C5A059] shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-white block">{language === 'am' ? 'የስራ ሰዓት' : language === 'om' ? 'Sa\'aatii Hojii' : 'Working Hours'}</span>
                  <span>{language === 'am' ? 'ሰኞ - ቅዳሜ፡ 8:30 ጥዋት - 6:00 ማታ' : language === 'om' ? 'Wiixata - Sanbata: 8:30 AM - 6:00 PM' : 'Mon - Sat: 8:30 AM - 6:00 PM'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick FAQ summary */}
          <div className="p-6 rounded-3xl bg-[#111112] border border-[#2D2D30] space-y-4">
            <h4 className="text-sm font-serif font-bold text-white flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-[#C5A059]" /> {language === 'am' ? 'ተደጋግመው የሚጠየቁ ጥያቄዎች' : language === 'om' ? 'Gaaffilee Yeroo Baay\'ee Gaafataman' : 'Frequently Asked Questions'}
            </h4>
            <div className="space-y-3">
              {filteredFaqs.slice(0, 3).map((faq) => (
                <div key={faq.id} className="text-xs border-b border-[#2D2D30] pb-3">
                  <span className="font-bold text-[#C5A059] block mb-1">{faq.question}</span>
                  <p className="text-slate-400 leading-relaxed">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>

    </div>
  );
};
