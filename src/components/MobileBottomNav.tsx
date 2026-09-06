import React from 'react';
import { Home, Layers, BookOpen, Award, Bot, User } from 'lucide-react';
import { ViewTab, StudentUser, Language } from '../types';
import { TRANSLATIONS } from '../lib/translations';

interface MobileBottomNavProps {
  currentTab: ViewTab;
  onTabChange: (tab: ViewTab) => void;
  language: Language;
  onOpenAITutor: () => void;
  onOpenDashboard: () => void;
  currentUser: StudentUser | null;
  bookmarkCount: number;
  completedQuizCount: number;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  currentTab,
  onTabChange,
  language,
  onOpenAITutor,
  onOpenDashboard,
  currentUser,
  bookmarkCount,
  completedQuizCount,
}) => {
  const t = TRANSLATIONS[language] || TRANSLATIONS.en;

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#0A0A0B]/95 backdrop-blur-lg border-t border-[#2D2D30] px-2 py-2 safe-area-pb">
      <div className="flex items-center justify-around max-w-md mx-auto">
        
        {/* Home */}
        <button
          onClick={() => onTabChange('home')}
          className={`flex flex-col items-center gap-1 p-2 rounded-xl text-[10px] font-semibold transition-colors min-w-[56px] min-h-[44px] justify-center ${
            currentTab === 'home'
              ? 'text-[#C5A059]'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Home className="w-4 h-4" />
          <span className="truncate max-w-[60px]">{t.navHome}</span>
        </button>

        {/* Subjects */}
        <button
          onClick={() => onTabChange('subjects')}
          className={`flex flex-col items-center gap-1 p-2 rounded-xl text-[10px] font-semibold transition-colors min-w-[56px] min-h-[44px] justify-center ${
            currentTab === 'subjects'
              ? 'text-[#C5A059]'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span className="truncate max-w-[60px]">{t.navCurriculum}</span>
        </button>

        {/* Notes */}
        <button
          onClick={() => onTabChange('notes')}
          className={`flex flex-col items-center gap-1 p-2 rounded-xl text-[10px] font-semibold transition-colors min-w-[56px] min-h-[44px] justify-center relative ${
            currentTab === 'notes'
              ? 'text-[#C5A059]'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span className="truncate max-w-[60px]">{t.navNotes}</span>
          {bookmarkCount > 0 && (
            <span className="absolute top-1 right-2 w-2 h-2 rounded-full bg-[#C5A059]" />
          )}
        </button>

        {/* Quizzes */}
        <button
          onClick={() => onTabChange('quizzes')}
          className={`flex flex-col items-center gap-1 p-2 rounded-xl text-[10px] font-semibold transition-colors min-w-[56px] min-h-[44px] justify-center relative ${
            currentTab === 'quizzes'
              ? 'text-[#C5A059]'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Award className="w-4 h-4" />
          <span className="truncate max-w-[60px]">{t.navQuizzes}</span>
          {completedQuizCount > 0 && (
            <span className="absolute top-1 right-2 w-2 h-2 rounded-full bg-emerald-400" />
          )}
        </button>

        {/* AI Tutor */}
        <button
          onClick={onOpenAITutor}
          className="flex flex-col items-center gap-1 p-2 rounded-xl text-[10px] font-semibold text-[#C5A059] hover:text-white transition-colors min-w-[56px] min-h-[44px] justify-center"
        >
          <div className="w-5 h-5 rounded-lg bg-[#C5A059] text-black flex items-center justify-center font-bold text-xs">
            <Bot className="w-3.5 h-3.5" />
          </div>
          <span className="truncate max-w-[60px]">{t.navAITutor}</span>
        </button>

        {/* Profile & Dashboard */}
        <button
          onClick={onOpenDashboard}
          className="flex flex-col items-center gap-1 p-2 rounded-xl text-[10px] font-semibold text-slate-400 hover:text-white transition-colors min-w-[56px] min-h-[44px] justify-center"
        >
          {currentUser ? (
            <span className="text-sm leading-none">{currentUser.avatar}</span>
          ) : (
            <User className="w-4 h-4" />
          )}
          <span className="truncate max-w-[60px]">{currentUser ? t.navMyProgress : t.navSignIn}</span>
        </button>

      </div>
    </nav>
  );
};
