import React, { useState } from 'react';
import {
  Trophy,
  Flame,
  Zap,
  Award,
  Crown,
  Medal,
  Star,
  CheckCircle2,
  Sparkles,
  ArrowUpRight,
  Shield,
  BookOpen,
} from 'lucide-react';
import { StudentUser, QuizAttempt, NoteChapter, Language } from '../types';
import { calculateUserLevel, evaluateBadges, generateLeaderboard } from '../lib/gamification';
import { TRANSLATIONS } from '../lib/translations';

interface LeaderboardViewProps {
  currentUser: StudentUser | null;
  quizAttempts: QuizAttempt[];
  notes: NoteChapter[];
  language: Language;
  onTabChange: (tab: any) => void;
  onOpenCertificateStudio?: () => void;
}

export const LeaderboardView: React.FC<LeaderboardViewProps> = ({
  currentUser,
  quizAttempts,
  notes,
  language,
  onTabChange,
  onOpenCertificateStudio,
}) => {
  const t = TRANSLATIONS[language] || TRANSLATIONS.en;
  const [activeSubTab, setActiveSubTab] = useState<'leaderboard' | 'badges' | 'rewards'>('leaderboard');

  const userXp = currentUser?.xp || (quizAttempts.length * 100) + ((currentUser?.studyStreakDays || 1) * 50) + 150;
  const userStreak = currentUser?.studyStreakDays || 3;
  const levelInfo = calculateUserLevel(userXp);
  const badges = evaluateBadges(currentUser, quizAttempts, notes);
  const unlockedBadgesCount = badges.filter((b) => b.unlocked).length;
  const leaderboard = generateLeaderboard(currentUser, userXp, userStreak);

  return (
    <div className="min-h-screen bg-[#0A0A0B] text-slate-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#1E1E22] pb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full bg-[#C5A059]/10 border border-[#C5A059]/30 text-[#C5A059] text-xs font-bold uppercase tracking-wider flex items-center gap-1">
                <Trophy className="w-3.5 h-3.5" />
                {language === 'am' ? 'የደረጃ ሰንጠረዥ እና ሽልማቶች' : language === 'om' ? 'Sadarkaa fi Badhaasa' : 'Gamification & Hall of Fame'}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-white tracking-tight">
              {language === 'am' ? 'የተማሪዎች የደረጃ ሰንጠረዥ እና ባጆች' : 'Student Leaderboard & Achievement Badges'}
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              {language === 'am'
                ? 'በፈተናዎች እና በንባብ የXP ነጥቦችን ያግኙ፣ ደረጃዎን ያሳድጉ፣ ከሀገር አቀፍ ተማሪዎች ጋር ይወዳደሩ።'
                : 'Earn XP by acing timed exams, reading curriculum notes, keeping study streaks, and claiming awards.'}
            </p>
          </div>

          {/* Sub-tab Navigation Switcher */}
          <div className="flex items-center gap-1 bg-[#121214] p-1.5 rounded-2xl border border-[#222226] text-xs">
            <button
              onClick={() => setActiveSubTab('leaderboard')}
              className={`px-4 py-2 rounded-xl font-bold transition-colors flex items-center gap-1.5 ${
                activeSubTab === 'leaderboard' ? 'bg-[#C5A059] text-black shadow-md' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Trophy className="w-4 h-4" />
              <span>Leaderboard</span>
            </button>
            <button
              onClick={() => setActiveSubTab('badges')}
              className={`px-4 py-2 rounded-xl font-bold transition-colors flex items-center gap-1.5 ${
                activeSubTab === 'badges' ? 'bg-[#C5A059] text-black shadow-md' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Award className="w-4 h-4" />
              <span>Badges ({unlockedBadgesCount}/{badges.length})</span>
            </button>
            <button
              onClick={() => setActiveSubTab('rewards')}
              className={`px-4 py-2 rounded-xl font-bold transition-colors flex items-center gap-1.5 ${
                activeSubTab === 'rewards' ? 'bg-[#C5A059] text-black shadow-md' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Crown className="w-4 h-4" />
              <span>Course Rewards</span>
            </button>
          </div>
        </div>

        {/* User Level & XP Hero Strip */}
        <div className="bg-gradient-to-r from-[#17171C] via-[#1A1A22] to-[#141418] border border-[#2D2D38] rounded-3xl p-6 shadow-xl relative overflow-hidden">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            
            <div className="flex items-center gap-4 text-center sm:text-left">
              <div className="w-16 h-16 rounded-2xl bg-[#C5A059] text-black font-bold flex items-center justify-center text-2xl shadow-lg shadow-[#C5A059]/30 shrink-0">
                {currentUser?.avatar || '🎓'}
              </div>
              <div>
                <div className="flex items-center gap-2 justify-center sm:justify-start">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#C5A059] bg-[#C5A059]/10 px-2 py-0.5 rounded-md border border-[#C5A059]/30">
                    Level {levelInfo.level}: {levelInfo.title}
                  </span>
                  <span className="text-xs text-slate-400">
                    {currentUser?.grade || 'Grade 12'} {currentUser?.stream || 'Natural Science'}
                  </span>
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-white mt-1">
                  {currentUser?.name || 'Guest Scholar'}
                </h2>
                <div className="flex items-center gap-4 mt-2 text-xs text-slate-300">
                  <span className="flex items-center gap-1 font-semibold text-amber-400">
                    <Zap className="w-4 h-4" />
                    <strong>{userXp}</strong> XP Points
                  </span>
                  <span className="flex items-center gap-1 font-semibold text-orange-400">
                    <Flame className="w-4 h-4" />
                    <strong>{userStreak}</strong> Day Streak
                  </span>
                  <span className="flex items-center gap-1 font-semibold text-emerald-400">
                    <Award className="w-4 h-4" />
                    <strong>{unlockedBadgesCount}</strong> Badges Earned
                  </span>
                </div>
              </div>
            </div>

            {/* Level Progress Bar */}
            <div className="w-full sm:w-64 space-y-2">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-slate-400">Progress to Level {levelInfo.level + 1}</span>
                <span className="text-[#C5A059]">{levelInfo.currentLevelXp} / {levelInfo.nextLevelXp} XP</span>
              </div>
              <div className="w-full h-3 bg-[#0A0A0D] rounded-full overflow-hidden border border-[#222228]">
                <div
                  className="h-full bg-gradient-to-r from-[#C5A059] to-[#ecd392] rounded-full transition-all duration-700 shadow-sm"
                  style={{ width: `${levelInfo.progressPercent}%` }}
                />
              </div>
              <span className="text-[10px] text-slate-500 block text-right">
                {levelInfo.nextLevelXp - levelInfo.currentLevelXp} XP needed for next level upgrade
              </span>
            </div>

          </div>
        </div>

        {/* Tab 1: Leaderboard Table */}
        {activeSubTab === 'leaderboard' && (
          <div className="bg-[#121214] border border-[#222226] rounded-3xl overflow-hidden shadow-xl space-y-4">
            <div className="p-5 border-b border-[#222226] flex items-center justify-between">
              <div>
                <h3 className="font-serif font-bold text-lg text-white">National Secondary Student Rankings</h3>
                <p className="text-xs text-slate-400">Real-time academic standing across Ethiopian secondary scholars</p>
              </div>
              <span className="text-xs text-[#C5A059] font-bold bg-[#C5A059]/10 px-3 py-1 rounded-full border border-[#C5A059]/30">
                Weekly Season 2026
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead className="bg-[#18181C] text-slate-400 uppercase text-[10px] tracking-wider border-b border-[#222226]">
                  <tr>
                    <th className="py-3 px-4 text-center">Rank</th>
                    <th className="py-3 px-4">Student</th>
                    <th className="py-3 px-4">Grade & Stream</th>
                    <th className="py-3 px-4 text-center">Streak</th>
                    <th className="py-3 px-4 text-center">Badges</th>
                    <th className="py-3 px-4 text-right">XP Points</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1E1E24]">
                  {leaderboard.map((entry) => {
                    const isTop1 = entry.rank === 1;
                    const isTop2 = entry.rank === 2;
                    const isTop3 = entry.rank === 3;

                    return (
                      <tr
                        key={entry.id}
                        className={`transition-colors ${
                          entry.isCurrentUser
                            ? 'bg-[#C5A059]/10 font-semibold border-l-4 border-l-[#C5A059]'
                            : 'hover:bg-[#16161A]'
                        }`}
                      >
                        <td className="py-4 px-4 text-center font-bold">
                          {isTop1 ? (
                            <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-amber-400 text-black shadow-md font-bold">
                              🥇
                            </span>
                          ) : isTop2 ? (
                            <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-slate-300 text-black shadow-md font-bold">
                              🥈
                            </span>
                          ) : isTop3 ? (
                            <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-amber-700 text-white shadow-md font-bold">
                              🥉
                            </span>
                          ) : (
                            <span className="text-slate-400">#{entry.rank}</span>
                          )}
                        </td>

                        <td className="py-4 px-4">
                          <div className="flex items-center gap-3">
                            <span className="text-xl shrink-0">{entry.avatar}</span>
                            <div>
                              <span className="font-bold text-white block">
                                {entry.name} {entry.isCurrentUser && '(You)'}
                              </span>
                              <span className="text-[10px] text-slate-400">
                                {entry.studentId} • Lvl {entry.level}
                              </span>
                            </div>
                          </div>
                        </td>

                        <td className="py-4 px-4 text-slate-300">
                          <div>
                            <span className="font-medium text-white">{entry.grade}</span>
                            <span className="block text-[11px] text-slate-400">{entry.stream}</span>
                          </div>
                        </td>

                        <td className="py-4 px-4 text-center">
                          <span className="inline-flex items-center gap-1 font-bold text-amber-400">
                            <Flame className="w-3.5 h-3.5" />
                            {entry.streak}d
                          </span>
                        </td>

                        <td className="py-4 px-4 text-center">
                          <span className="inline-flex items-center gap-1 text-slate-300">
                            <Award className="w-3.5 h-3.5 text-[#C5A059]" />
                            {entry.badgesCount}
                          </span>
                        </td>

                        <td className="py-4 px-4 text-right">
                          <span className="font-bold text-[#C5A059] text-base">
                            {entry.xp.toLocaleString()} <span className="text-xs font-normal text-slate-400">XP</span>
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 2: Achievement Badges Grid */}
        {activeSubTab === 'badges' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-serif font-bold text-lg text-white">Academic Achievement Badges</h3>
                <p className="text-xs text-slate-400">Unlock commemorative badges by excelling across the curriculum</p>
              </div>
              <span className="text-xs text-emerald-400 font-bold bg-emerald-950/80 px-3 py-1 rounded-full border border-emerald-800">
                {unlockedBadgesCount} of {badges.length} Unlocked
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {badges.map((badge) => (
                <div
                  key={badge.id}
                  className={`p-5 rounded-3xl border transition-all space-y-3 relative overflow-hidden ${
                    badge.unlocked
                      ? 'bg-[#141418] border-[#C5A059]/40 shadow-lg shadow-[#C5A059]/10'
                      : 'bg-[#101012] border-[#222226] opacity-50 grayscale'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-3xl p-2.5 rounded-2xl bg-[#1E1E24] border border-[#2B2B32] inline-block">
                      {badge.icon}
                    </span>
                    {badge.unlocked ? (
                      <span className="px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 font-bold text-[10px] border border-emerald-800 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> Unlocked
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 font-medium text-[10px]">
                        Locked
                      </span>
                    )}
                  </div>

                  <div>
                    <h4 className="font-bold text-white text-sm">{badge.name}</h4>
                    <p className="text-xs text-slate-400 mt-1 leading-relaxed">{badge.description}</p>
                  </div>

                  <div className="pt-2 border-t border-[#1E1E24] flex items-center justify-between text-[11px]">
                    <span className="text-[#C5A059] font-bold">+{badge.xpReward} XP Reward</span>
                    {badge.earnedAt && <span className="text-slate-500">{badge.earnedAt}</span>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 3: Course Completion Rewards */}
        {activeSubTab === 'rewards' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-serif font-bold text-lg text-white">Course Completion Rewards</h3>
                <p className="text-xs text-slate-400">Complete subject units and exams to claim digital diplomas and credentials</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Natural Science Completion Certificate */}
              <div className="bg-gradient-to-br from-[#16161B] to-[#111114] border border-[#C5A059]/30 rounded-3xl p-6 space-y-4 shadow-xl">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Award className="w-6 h-6 text-[#C5A059]" />
                    <span className="font-bold text-sm text-white">Natural Science Certificate of Mastery</span>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full bg-[#C5A059]/10 text-[#C5A059] text-xs font-bold border border-[#C5A059]/30">
                    Grade 11 & 12
                  </span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Earned by completing all unit notes in Biology, Chemistry, Physics, and Advanced Mathematics, scoring 80%+ on unit exams.
                </p>
                <div className="pt-2 flex items-center justify-between">
                  <span className="text-xs text-slate-400 font-medium">Reward: Official Digital Credential + 1,000 XP</span>
                  <button
                    onClick={() => {
                      if (onOpenCertificateStudio) onOpenCertificateStudio();
                      else onTabChange('report-card');
                    }}
                    className="px-4 py-2 rounded-xl bg-[#C5A059] hover:bg-[#d8b168] text-black font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 transition-colors"
                  >
                    <span>View Certificate</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Social Science Completion Certificate */}
              <div className="bg-gradient-to-br from-[#16161B] to-[#111114] border border-[#2D2D38] rounded-3xl p-6 space-y-4 shadow-xl">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Shield className="w-6 h-6 text-[#C5A059]" />
                    <span className="font-bold text-sm text-white">Social Science & Humanities Laureate</span>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full bg-[#C5A059]/10 text-[#C5A059] text-xs font-bold border border-[#C5A059]/30">
                    Grade 11 & 12
                  </span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Earned by mastering History (Battle of Adwa, Aksumite Empire), Geography, Economics, and English language chapters.
                </p>
                <div className="pt-2 flex items-center justify-between">
                  <span className="text-xs text-slate-400 font-medium">Reward: Official Digital Credential + 1,000 XP</span>
                  <button
                    onClick={() => {
                      if (onOpenCertificateStudio) onOpenCertificateStudio();
                      else onTabChange('report-card');
                    }}
                    className="px-4 py-2 rounded-xl bg-[#202026] hover:bg-[#2A2A32] text-white font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 transition-colors border border-[#33333C]"
                  >
                    <span>View Certificate</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

            </div>
          </div>
        )}

      </div>
    </div>
  );
};
