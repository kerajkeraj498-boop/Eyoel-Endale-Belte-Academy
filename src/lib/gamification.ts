import { BadgeRecord, LeaderboardEntry, StudentUser, QuizAttempt, NoteChapter } from '../types';

export const ALL_BADGES: BadgeRecord[] = [
  {
    id: 'first-quiz',
    name: 'First Quiz',
    icon: '🎯',
    description: 'Completed your very first 20-question practice examination.',
    category: 'quiz',
    unlocked: false,
    xpReward: 100,
  },
  {
    id: '10-quizzes',
    name: '10 Quizzes',
    icon: '🔥',
    description: 'Completed 10 comprehensive unit examinations.',
    category: 'quiz',
    unlocked: false,
    xpReward: 350,
  },
  {
    id: '7-day-streak',
    name: '7 Day Streak',
    icon: '⚡',
    description: 'Maintained a consistent daily study habit for 7 consecutive days.',
    category: 'streak',
    unlocked: false,
    xpReward: 400,
  },
  {
    id: 'top-student',
    name: 'Top Student',
    icon: '👑',
    description: 'Achieved a score of 95% or higher on an Ethiopian national exam test.',
    category: 'mastery',
    unlocked: false,
    xpReward: 500,
  },
  {
    id: 'course-master',
    name: 'Course Master',
    icon: '🏆',
    description: 'Mastered all curriculum chapters and passed quizzes across a subject.',
    category: 'course',
    unlocked: false,
    xpReward: 600,
  },
  {
    id: 'pomodoro-pro',
    name: 'Focus Master',
    icon: '⏱️',
    description: 'Completed 5 dedicated Pomodoro deep-work study blocks.',
    category: 'special',
    unlocked: false,
    xpReward: 250,
  },
  {
    id: 'planner-champion',
    name: 'Study Planner Ace',
    icon: '📅',
    description: 'Completed all daily tasks and weekly academic goals.',
    category: 'special',
    unlocked: false,
    xpReward: 300,
  },
  {
    id: 'offline-scholar',
    name: 'Offline Explorer',
    icon: '💾',
    description: 'Downloaded lessons for offline study without internet.',
    category: 'special',
    unlocked: false,
    xpReward: 200,
  },
];

export function calculateUserLevel(xp: number): {
  level: number;
  title: string;
  currentLevelXp: number;
  nextLevelXp: number;
  progressPercent: number;
} {
  // 0 - 200: Lvl 1 Novice
  // 200 - 500: Lvl 2 Apprentice
  // 500 - 900: Lvl 3 Junior Scholar
  // 900 - 1500: Lvl 4 Scholar
  // 1500 - 2400: Lvl 5 Senior Scholar
  // 2400 - 3600: Lvl 6 Academician
  // 3600 - 5200: Lvl 7 High Honors
  // 5200 - 7500: Lvl 8 Master Scholar
  // 7500+: Lvl 9 Grandmaster
  const thresholds = [
    { level: 1, xp: 0, title: 'Novice Scholar' },
    { level: 2, xp: 200, title: 'Apprentice Learner' },
    { level: 3, xp: 500, title: 'Junior Scholar' },
    { level: 4, xp: 900, title: 'Scholar' },
    { level: 5, xp: 1500, title: 'Senior Scholar' },
    { level: 6, xp: 2400, title: 'Academician' },
    { level: 7, xp: 3600, title: 'High Honors' },
    { level: 8, xp: 5200, title: 'Master Scholar' },
    { level: 9, xp: 7500, title: 'Grandmaster' },
  ];

  let currentLevel = 1;
  let currentTitle = 'Novice Scholar';
  let minXp = 0;
  let maxXp = 200;

  for (let i = 0; i < thresholds.length; i++) {
    if (xp >= thresholds[i].xp) {
      currentLevel = thresholds[i].level;
      currentTitle = thresholds[i].title;
      minXp = thresholds[i].xp;
      maxXp = thresholds[i + 1] ? thresholds[i + 1].xp : minXp + 2500;
    } else {
      break;
    }
  }

  const progressPercent = Math.min(100, Math.max(0, Math.round(((xp - minXp) / (maxXp - minXp)) * 100)));

  return {
    level: currentLevel,
    title: currentTitle,
    currentLevelXp: xp - minXp,
    nextLevelXp: maxXp - minXp,
    progressPercent,
  };
}

export function evaluateBadges(
  currentUser: StudentUser | null,
  quizAttempts: QuizAttempt[],
  notes: NoteChapter[]
): BadgeRecord[] {
  const earnedNames = new Set(currentUser?.badges || []);

  const totalQuizzes = quizAttempts.length;
  const hasHighScore = quizAttempts.some((q) => q.percentage >= 95);
  const streak = currentUser?.studyStreakDays || 1;
  const pomodoroCount = currentUser?.pomodoroSessionsCompleted || 0;
  const notesRead = currentUser?.notesCompleted?.length || 0;

  return ALL_BADGES.map((badge) => {
    let unlocked = earnedNames.has(badge.name) || earnedNames.has(badge.id);

    if (!unlocked) {
      if (badge.id === 'first-quiz' && totalQuizzes >= 1) unlocked = true;
      if (badge.id === '10-quizzes' && totalQuizzes >= 10) unlocked = true;
      if (badge.id === '7-day-streak' && streak >= 7) unlocked = true;
      if (badge.id === 'top-student' && hasHighScore) unlocked = true;
      if (badge.id === 'course-master' && notesRead >= 6 && totalQuizzes >= 3) unlocked = true;
      if (badge.id === 'pomodoro-pro' && pomodoroCount >= 5) unlocked = true;
      if (badge.id === 'planner-champion' && notesRead >= 4) unlocked = true;
      if (badge.id === 'offline-scholar' && localStorage.getItem('eyoel_offline_manifest')) unlocked = true;
    }

    return {
      ...badge,
      unlocked,
      earnedAt: unlocked ? (currentUser?.joinedDate || 'Recent') : undefined,
    };
  });
}

export function generateLeaderboard(
  currentUser: StudentUser | null,
  userXp: number,
  userStreak: number
): LeaderboardEntry[] {
  const baseStudents: LeaderboardEntry[] = [
    {
      id: 'lb-1',
      rank: 1,
      name: 'Selamawit Haile',
      studentId: 'EYOEL-STU-8821',
      avatar: '👩🏽‍🎓',
      grade: 'Grade 12',
      stream: 'Natural Science',
      xp: 4850,
      level: 7,
      streak: 19,
      badgesCount: 7,
    },
    {
      id: 'lb-2',
      rank: 2,
      name: 'Abenezer Yohannes',
      studentId: 'EYOEL-STU-7412',
      avatar: '👨🏽‍🎓',
      grade: 'Grade 12',
      stream: 'Natural Science',
      xp: 4320,
      level: 6,
      streak: 14,
      badgesCount: 6,
    },
    {
      id: 'lb-3',
      rank: 3,
      name: 'Hawwi Tolessa',
      studentId: 'EYOEL-STU-6304',
      avatar: '👩🏾‍🎓',
      grade: 'Grade 11',
      stream: 'Natural Science',
      xp: 3780,
      level: 6,
      streak: 12,
      badgesCount: 5,
    },
    {
      id: 'lb-4',
      rank: 4,
      name: 'Biruk Tadesse',
      studentId: 'EYOEL-STU-5192',
      avatar: '👨🏾‍🎓',
      grade: 'Grade 12',
      stream: 'Social Science',
      xp: 3210,
      level: 5,
      streak: 9,
      badgesCount: 5,
    },
    {
      id: 'lb-5',
      rank: 5,
      name: 'Lensa Gemechu',
      studentId: 'EYOEL-STU-4830',
      avatar: '👩🏽‍🎓',
      grade: 'Grade 11',
      stream: 'Social Science',
      xp: 2850,
      level: 5,
      streak: 8,
      badgesCount: 4,
    },
    {
      id: 'lb-6',
      rank: 6,
      name: 'Kalkidan Bekele',
      studentId: 'EYOEL-STU-3721',
      avatar: '👩🏾‍🎓',
      grade: 'Grade 10',
      stream: 'General',
      xp: 2190,
      level: 4,
      streak: 6,
      badgesCount: 3,
    },
    {
      id: 'lb-7',
      rank: 7,
      name: 'Dawit Getachew',
      studentId: 'EYOEL-STU-2910',
      avatar: '👨🏽‍🎓',
      grade: 'Grade 9',
      stream: 'General',
      xp: 1840,
      level: 4,
      streak: 5,
      badgesCount: 3,
    },
  ];

  if (!currentUser) {
    return baseStudents;
  }

  // Insert current user into rankings
  const currentEntry: LeaderboardEntry = {
    id: currentUser.id,
    rank: 0,
    name: currentUser.name,
    studentId: currentUser.studentId || `EYOEL-STU-${currentUser.id.slice(0, 4).toUpperCase()}`,
    avatar: currentUser.avatar || '🎓',
    grade: currentUser.grade || 'Grade 12',
    stream: currentUser.stream || 'Natural Science',
    xp: userXp,
    level: calculateUserLevel(userXp).level,
    streak: userStreak,
    badgesCount: currentUser.badges?.length || 1,
    isCurrentUser: true,
  };

  const combined = [...baseStudents, currentEntry].sort((a, b) => b.xp - a.xp);

  return combined.map((entry, index) => ({
    ...entry,
    rank: index + 1,
  }));
}
