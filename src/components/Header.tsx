import React, { useState } from 'react';
import {
  Sun,
  Moon,
  Search,
  Menu,
  X,
  BookOpen,
  Award,
  Layers,
  Mail,
  Home as HomeIcon,
  Sparkles,
  Bot,
  User,
  Info,
  ShieldCheck,
  Globe,
  ChevronDown,
  FileText,
  Bell,
  LogIn,
  UserPlus,
  Calendar,
  Trophy,
  BarChart3,
  GraduationCap,
  MessageSquare,
} from 'lucide-react';
import { ViewTab, StudentUser, Language } from '../types';
import { TRANSLATIONS } from '../lib/translations';
import { PomodoroTimer } from './PomodoroTimer';

interface HeaderProps {
  currentTab: ViewTab;
  onTabChange: (tab: ViewTab) => void;
  language: Language;
  onLanguageChange: (lang: Language) => void;
  darkMode: boolean;
  onToggleDarkMode: () => void;
  onOpenSearch: () => void;
  onOpenDashboard: () => void;
  onOpenFlashcards: () => void;
  onOpenAITutor: () => void;
  onOpenAuth: () => void;
  currentUser: StudentUser | null;
  bookmarkCount: number;
  completedQuizCount: number;
  onOpenAdmin: () => void;
  onOpenNotifications?: () => void;
  unreadNotificationsCount?: number;
  onLogFocusMinutes?: (minutes: number, subject?: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onTabChange,
  language,
  onLanguageChange,
  darkMode,
  onToggleDarkMode,
  onOpenSearch,
  onOpenDashboard,
  onOpenFlashcards,
  onOpenAITutor,
  onOpenAuth,
  currentUser,
  bookmarkCount,
  completedQuizCount,
  onOpenAdmin,
  onOpenNotifications,
  unreadNotificationsCount = 0,
  onLogFocusMinutes,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const [moreDropdownOpen, setMoreDropdownOpen] = useState(false);

  const t = TRANSLATIONS[language] || TRANSLATIONS.en;

  const primaryNavItems: { id: ViewTab; label: string; icon: React.ReactNode }[] = [
    { id: 'home', label: t.navHome, icon: <HomeIcon className="w-3.5 h-3.5" /> },
    { id: 'subjects', label: t.navCurriculum, icon: <Layers className="w-3.5 h-3.5" /> },
    { id: 'notes', label: t.navNotes, icon: <BookOpen className="w-3.5 h-3.5" /> },
    { id: 'quizzes', label: t.navQuizzes, icon: <Award className="w-3.5 h-3.5" /> },
    { id: 'planner', label: language === 'am' ? 'እቅድ' : language === 'om' ? 'Karoora' : 'Planner', icon: <Calendar className="w-3.5 h-3.5" /> },
    { id: 'leaderboard', label: language === 'am' ? 'ደረጃ' : language === 'om' ? 'Sadarkaa' : 'Ranks', icon: <Trophy className="w-3.5 h-3.5" /> },
  ];

  const secondaryNavItems: { id: ViewTab; label: string; desc: string; icon: React.ReactNode }[] = [
    {
      id: 'analytics',
      label: language === 'am' ? 'ትንታኔ እና ምክረ-ሀሳብ' : language === 'om' ? 'Qaaccessa & Gorsa' : 'Analytics & Diagnostics',
      desc: language === 'am' ? 'የደካማና ጠንካራ ትምህርት መረጃ' : language === 'om' ? 'Qaaccessa barumsaa' : 'Quiz insights & topic recommendations',
      icon: <BarChart3 className="w-4 h-4 text-[#C5A059]" />,
    },
    {
      id: 'teacher',
      label: language === 'am' ? 'የመምህራን ፖርታል' : language === 'om' ? 'Wiirtuu Barsiisotaa' : 'Teacher Portal',
      desc: language === 'am' ? 'የትምህርት፣ ፈተና እና ውጤት መከታተያ' : language === 'om' ? 'Qormaata & Barumsa uumuu' : 'Create lessons, quizzes & student feedback',
      icon: <GraduationCap className="w-4 h-4 text-[#C5A059]" />,
    },
    {
      id: 'messages',
      label: language === 'am' ? 'የመልዕክት ልውውጥ' : language === 'om' ? 'Ergaa & Beeksisoota' : 'Communication Hub',
      desc: language === 'am' ? 'ከመምህራን ጋር መወያያ እና ማስታወቂያዎች' : language === 'om' ? 'Barsiisota waliin haasa\'uu' : 'Direct teacher messaging & notifications',
      icon: <MessageSquare className="w-4 h-4 text-[#C5A059]" />,
    },
    {
      id: 'report-card',
      label: t.navReportCard,
      desc: language === 'am' ? 'ኦፊሴላዊ የውጤት ካርድ' : language === 'om' ? 'Waraqaa qabxii seeraa' : 'Verified academic report cards',
      icon: <FileText className="w-4 h-4 text-[#C5A059]" />,
    },
    {
      id: 'verify-certificate',
      label: language === 'am' ? 'ማረጋገጫ ፖርታል' : language === 'om' ? 'Mirkaneessa' : 'Verification Portal',
      desc: language === 'am' ? 'የምስክር ወረቀትና ውጤት ካርድ ማረጋገጫ' : language === 'om' ? 'Qabxiifi sertifikata mirkaneessuu' : 'Verify authentic credentials via QR code',
      icon: <ShieldCheck className="w-4 h-4 text-[#C5A059]" />,
    },
    {
      id: 'about',
      label: t.navAbout,
      desc: language === 'am' ? 'ስለ አካዳሚው' : language === 'om' ? 'Waa\'ee keenya' : 'Academy history and curriculum standards',
      icon: <Info className="w-4 h-4 text-[#C5A059]" />,
    },
    {
      id: 'contact',
      label: t.navContact,
      desc: language === 'am' ? 'አግኙን' : language === 'om' ? 'Nu qunnamaa' : 'Direct academic guidance & support',
      icon: <Mail className="w-4 h-4 text-[#C5A059]" />,
    },
  ];

  const allNavItems = [...primaryNavItems, ...secondaryNavItems];

  const languages: { code: Language; label: string; flag: string }[] = [
    { code: 'en', label: 'English', flag: '🇬🇧' },
    { code: 'am', label: 'አማርኛ', flag: '🇪🇹' },
    { code: 'om', label: 'Afaan Oromoo', flag: '🌳' },
  ];

  const currentLangObj = languages.find((l) => l.code === language) || languages[0];

  const isSecondaryActive = secondaryNavItems.some((item) => item.id === currentTab);

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-[#0A0A0B]/90 border-b border-[#2D2D30] transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* Logo & Brand: Eyoel Endale Belete */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => onTabChange('home')}
              className="flex items-center gap-3 group text-left focus:outline-none focus:ring-1 focus:ring-[#C5A059] rounded-lg p-1"
            >
              <div className="w-10 h-10 bg-[#C5A059] rounded-lg flex items-center justify-center font-serif text-2xl font-bold text-black italic shadow-lg shadow-[#C5A059]/20 group-hover:scale-105 transition-transform duration-200">
                E
              </div>
              <div>
                <span className="text-base sm:text-xl lg:text-2xl font-serif font-bold tracking-wider text-white group-hover:text-[#C5A059] transition-colors block leading-tight">
                  EYOEL ENDALE BELETE
                </span>
                <span className="block text-[8px] sm:text-[9px] font-medium tracking-[0.2em] text-[#C5A059] uppercase">
                  {t.brandTagline}
                </span>
              </div>
            </button>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-3 xl:gap-5 text-xs font-semibold tracking-wider uppercase">
            {primaryNavItems.map((item) => {
              const active = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onTabChange(item.id)}
                  className={`flex items-center gap-1.5 py-2 transition-all duration-150 relative whitespace-nowrap ${
                    active
                      ? 'text-[#C5A059] font-bold border-b-2 border-[#C5A059]'
                      : 'text-[#E0E0E0]/80 hover:text-[#C5A059]'
                  }`}
                >
                  {item.icon}
                  {item.label}
                </button>
              );
            })}

            {/* More / Learning Hub Dropdown */}
            <div className="relative">
              <button
                onClick={() => setMoreDropdownOpen((prev) => !prev)}
                className={`flex items-center gap-1 py-2 px-2.5 rounded-lg border transition-all ${
                  isSecondaryActive
                    ? 'border-[#C5A059] text-[#C5A059] font-bold bg-[#C5A059]/10'
                    : 'border-[#2D2D30] text-slate-300 hover:text-white hover:border-slate-500 bg-[#121214]'
                }`}
              >
                <span>{language === 'am' ? 'ተጨማሪ' : language === 'om' ? 'Dabalata' : 'More'}</span>
                <ChevronDown className="w-3.5 h-3.5" />
              </button>

              {moreDropdownOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setMoreDropdownOpen(false)} />
                  <div className="absolute right-0 mt-2 w-72 rounded-2xl bg-[#141416] border border-[#2D2D30] shadow-2xl py-2 z-50 animate-in fade-in zoom-in-95 duration-150 divide-y divide-[#2D2D30]/60">
                    <div className="px-4 py-2 text-[10px] font-bold uppercase tracking-widest text-[#C5A059]">
                      {language === 'am' ? 'ተጨማሪ አገልግሎቶች' : language === 'om' ? 'Tajaajiloota Dabalataa' : 'Academy Hub & Tools'}
                    </div>
                    <div className="py-1">
                      {secondaryNavItems.map((item) => {
                        const active = currentTab === item.id;
                        return (
                          <button
                            key={item.id}
                            onClick={() => {
                              onTabChange(item.id);
                              setMoreDropdownOpen(false);
                            }}
                            className={`w-full flex items-start gap-3 px-4 py-2.5 text-left transition-colors ${
                              active ? 'bg-[#C5A059]/15 text-[#C5A059]' : 'hover:bg-[#1C1C1E] text-slate-200'
                            }`}
                          >
                            <div className="mt-0.5 p-1 rounded-lg bg-[#1D1D20]">{item.icon}</div>
                            <div>
                              <div className="text-xs font-bold leading-none">{item.label}</div>
                              <div className="text-[10px] text-slate-400 mt-1 font-normal normal-case line-clamp-1">{item.desc}</div>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </>
              )}
            </div>
          </nav>

          {/* Action Tools, Language Switcher & Theme */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            
            {/* Language Selector Dropdown */}
            <div className="relative">
              <button
                onClick={() => setLangDropdownOpen((prev) => !prev)}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full border border-[#2D2D30] bg-[#111112] text-[#E0E0E0] hover:border-[#C5A059] text-xs font-medium transition-colors"
                title="Change language / ቋንቋ ይቀይሩ / Afaan jijjiiri"
              >
                <Globe className="w-3.5 h-3.5 text-[#C5A059]" />
                <span className="text-xs">{currentLangObj.flag}</span>
                <span className="hidden xl:inline text-xs font-semibold">{currentLangObj.label}</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {langDropdownOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setLangDropdownOpen(false)}
                  />
                  <div className="absolute right-0 mt-2 w-48 rounded-xl bg-[#141416] border border-[#2D2D30] shadow-2xl py-1.5 z-50 animate-in fade-in zoom-in-95 duration-150">
                    <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest text-[#C5A059] border-b border-[#2D2D30]/60">
                      {t.langSelector}
                    </div>
                    {languages.map((l) => (
                      <button
                        key={l.code}
                        onClick={() => {
                          onLanguageChange(l.code);
                          setLangDropdownOpen(false);
                        }}
                        className={`w-full flex items-center justify-between px-3 py-2 text-xs transition-colors text-left ${
                          language === l.code
                            ? 'bg-[#C5A059]/15 text-[#C5A059] font-bold'
                            : 'text-slate-200 hover:bg-[#1C1C1E] hover:text-white'
                        }`}
                      >
                        <span className="flex items-center gap-2">
                          <span>{l.flag}</span>
                          <span>{l.label}</span>
                        </span>
                        {language === l.code && <span className="text-xs text-[#C5A059]">✓</span>}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Pomodoro Study Timer */}
            <PomodoroTimer
              language={language}
              currentUser={currentUser}
              onLogFocusMinutes={onLogFocusMinutes || (() => {})}
            />

            {/* AI Tutor Button */}
            <button
              onClick={onOpenAITutor}
              title={t.aiTutorTitle}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-black bg-[#C5A059] hover:bg-[#d8b168] rounded-full transition-all shadow-md shadow-[#C5A059]/20 uppercase tracking-wider"
            >
              <Bot className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{t.navAITutor}</span>
            </button>

            {/* Quick Flashcards Button */}
            <button
              onClick={onOpenFlashcards}
              title={t.flashcardsTitle}
              className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#C5A059] bg-[#161618] border border-[#C5A059]/40 rounded-full hover:bg-[#C5A059] hover:text-black transition-all"
            >
              <Sparkles className="w-3.5 h-3.5" />
              {t.navFlashcards}
            </button>

            {/* Quick Search */}
            <button
              onClick={onOpenSearch}
              className="p-2 sm:px-3 sm:py-2 rounded-full border border-[#2D2D30] bg-[#111112] text-[#E0E0E0] hover:border-[#C5A059] hover:text-[#C5A059] text-xs font-medium flex items-center gap-2 transition-colors"
              title="Search notes, subjects, and quizzes"
            >
              <Search className="w-3.5 h-3.5 text-[#C5A059]" />
              <span className="hidden sm:inline text-xs text-slate-400">{t.navSearch}</span>
              <kbd className="hidden lg:inline px-1.5 py-0.5 text-[9px] font-mono bg-[#1A1A1C] rounded border border-[#2D2D30] text-[#C5A059]">
                ⌘K
              </kbd>
            </button>

            {/* In-App Notifications Bell */}
            {onOpenNotifications && (
              <button
                onClick={onOpenNotifications}
                className="relative p-2 rounded-full border border-[#2D2D30] bg-[#111112] text-[#E0E0E0] hover:border-[#C5A059] hover:text-[#C5A059] text-xs font-medium transition-colors"
                title="Notifications"
                aria-label="View notifications"
              >
                <Bell className="w-3.5 h-3.5" />
                {unreadNotificationsCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#C5A059] text-black text-[9px] font-bold rounded-full flex items-center justify-center animate-pulse">
                    {unreadNotificationsCount > 9 ? '9+' : unreadNotificationsCount}
                  </span>
                )}
              </button>
            )}

            {/* Student Dashboard / Account Badge or Login + Sign Up */}
            {currentUser ? (
              <button
                onClick={onOpenDashboard}
                className="flex items-center gap-2 p-1.5 sm:px-3 sm:py-1.5 rounded-full border border-[#C5A059]/40 bg-[#161618] hover:border-[#C5A059] transition-colors"
                title="Student Dashboard"
              >
                <span className="text-base">{currentUser.avatar}</span>
                <span className="hidden sm:inline text-xs font-bold text-white truncate max-w-[90px]">
                  {currentUser.name.split(' ')[0]}
                </span>
                <span className="hidden md:inline text-[10px] px-1.5 py-0.2 rounded bg-[#C5A059] text-black font-bold uppercase">
                  {currentUser.grade.replace('Grade ', 'G')}
                </span>
              </button>
            ) : (
              <div className="flex items-center gap-1.5">
                {/* Clean Login Button */}
                <button
                  onClick={() => onTabChange('login')}
                  className="px-3 py-1.5 rounded-full border border-[#2D2D30] bg-[#111112] hover:border-[#C5A059] text-slate-200 hover:text-white text-xs font-semibold flex items-center gap-1.5 transition-colors uppercase tracking-wider"
                  title="Log in to your account"
                >
                  <LogIn className="w-3.5 h-3.5 text-[#C5A059]" />
                  <span>{t.navLogin || 'Login'}</span>
                </button>

                {/* Sign Up Button */}
                <button
                  onClick={() => onTabChange('register')}
                  className="hidden sm:flex px-3.5 py-1.5 rounded-full bg-[#C5A059] hover:bg-[#d8b168] text-black text-xs font-bold items-center gap-1.5 transition-all shadow-md shadow-[#C5A059]/20 uppercase tracking-wider"
                  title="Create a student account"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>{t.navSignUp || 'Sign Up'}</span>
                </button>
              </div>
            )}

            {/* Communication & Messages Shortcut */}
            <button
              onClick={() => onTabChange('messages')}
              className={`p-2 rounded-full border transition-colors relative ${
                currentTab === 'messages'
                  ? 'border-[#C5A059] bg-[#C5A059]/20 text-[#C5A059]'
                  : 'border-[#2D2D30] bg-[#111112] text-slate-300 hover:border-[#C5A059] hover:text-white'
              }`}
              title="Communication & Messages / መልዕክቶች"
              aria-label="Open Communication Hub"
            >
              <MessageSquare className="w-4 h-4 text-[#C5A059]" />
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[#C5A059]" />
            </button>

            {/* Admin Area Button */}
            <button
              onClick={onOpenAdmin}
              className="p-2 rounded-full border border-[#2D2D30] bg-[#111112] text-[#C5A059] hover:bg-[#C5A059]/10 hover:border-[#C5A059] transition-colors"
              title="Educator & Admin Portal"
              aria-label="Open Admin Portal"
            >
              <ShieldCheck className="w-4 h-4" />
            </button>

            {/* Dark Mode Toggle */}
            <button
              onClick={onToggleDarkMode}
              className="p-2 rounded-full border border-[#2D2D30] bg-[#111112] text-[#E0E0E0] hover:border-[#C5A059] transition-colors"
              title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              aria-label="Toggle theme mode"
            >
              {darkMode ? <Sun className="w-4 h-4 text-[#C5A059]" /> : <Moon className="w-4 h-4 text-slate-400" />}
            </button>

            {/* Mobile Menu Toggle Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-white hover:bg-[#111112] transition-colors"
              aria-label="Open Mobile Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6 text-[#C5A059]" /> : <Menu className="w-6 h-6 text-white" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#0A0A0B] border-b border-[#2D2D30] px-4 pt-3 pb-6 space-y-3 transition-all">
          
          {/* Mobile Language Selector */}
          <div className="p-2 bg-[#121214] border border-[#2D2D30] rounded-xl flex items-center justify-between">
            <span className="text-xs font-semibold text-[#C5A059] flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5" />
              {t.langSelector}:
            </span>
            <div className="flex gap-1">
              {languages.map((l) => (
                <button
                  key={l.code}
                  onClick={() => onLanguageChange(l.code)}
                  className={`px-2.5 py-1 text-xs rounded-lg font-bold transition-colors ${
                    language === l.code
                      ? 'bg-[#C5A059] text-black'
                      : 'bg-[#1C1C1E] text-slate-300 hover:text-white'
                  }`}
                >
                  {l.flag} {l.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-1.5 max-h-[60vh] overflow-y-auto pr-1">
            {allNavItems.map((item) => {
              const active = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onTabChange(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold uppercase tracking-wider transition-colors ${
                    active
                      ? 'bg-[#C5A059] text-black font-bold'
                      : 'text-[#E0E0E0] hover:bg-[#111112] hover:text-[#C5A059]'
                  }`}
                >
                  {item.icon}
                  {item.label}
                </button>
              );
            })}
          </div>

          <div className="pt-3 border-t border-[#2D2D30] flex flex-col gap-2">
            {!currentUser ? (
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => {
                    onTabChange('login');
                    setMobileMenuOpen(false);
                  }}
                  className="flex items-center justify-center gap-2 py-3 rounded-xl border border-[#2D2D30] bg-[#161618] text-white font-bold text-xs uppercase tracking-wider"
                >
                  <LogIn className="w-4 h-4 text-[#C5A059]" />
                  <span>{t.navLogin || 'Login'}</span>
                </button>
                <button
                  onClick={() => {
                    onTabChange('register');
                    setMobileMenuOpen(false);
                  }}
                  className="flex items-center justify-center gap-2 py-3 rounded-xl bg-[#C5A059] text-black font-bold text-xs uppercase tracking-wider shadow-md shadow-[#C5A059]/20"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>{t.navSignUp || 'Sign Up'}</span>
                </button>
              </div>
            ) : null}

            <button
              onClick={() => {
                onOpenAITutor();
                setMobileMenuOpen(false);
              }}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-[#C5A059] text-black font-bold text-xs uppercase tracking-wider shadow-lg shadow-[#C5A059]/20"
            >
              <Bot className="w-4 h-4" />
              {t.navAITutor}
            </button>

            <div className="flex gap-2">
              <button
                onClick={() => {
                  onOpenFlashcards();
                  setMobileMenuOpen(false);
                }}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-[#161618] text-[#C5A059] font-bold text-xs border border-[#C5A059]/40"
              >
                <Sparkles className="w-4 h-4 text-[#C5A059]" />
                {t.navFlashcards}
              </button>
              <button
                onClick={() => {
                  onOpenDashboard();
                  setMobileMenuOpen(false);
                }}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-[#1A1A1C] border border-[#2D2D30] text-white font-bold text-xs"
              >
                <Award className="w-4 h-4 text-[#C5A059]" />
                {t.navMyProgress}
              </button>
              <button
                onClick={() => {
                  onOpenAdmin();
                  setMobileMenuOpen(false);
                }}
                className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-[#161618] border border-[#C5A059]/30 text-[#C5A059] font-bold text-xs"
                title="Curriculum Admin"
              >
                <ShieldCheck className="w-4 h-4 text-[#C5A059]" />
                {t.navAdmin}
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
