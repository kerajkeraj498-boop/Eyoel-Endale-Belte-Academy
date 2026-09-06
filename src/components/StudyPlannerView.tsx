import React, { useState, useEffect } from 'react';
import {
  Calendar as CalendarIcon,
  CheckCircle2,
  Circle,
  Clock,
  Plus,
  Trash2,
  Target,
  Bell,
  Sparkles,
  Zap,
  TrendingUp,
  AlertCircle,
  Flame,
  Check,
} from 'lucide-react';
import { StudyTask, WeeklyGoal, Language, GradeLevel, StudentUser } from '../types';
import { TRANSLATIONS } from '../lib/translations';

interface StudyPlannerViewProps {
  language: Language;
  currentUser: StudentUser | null;
  onUpdateProfile?: (updated: Partial<StudentUser>) => void;
  onOpenAITutor?: () => void;
}

const DEFAULT_TASKS: StudyTask[] = [
  {
    id: 'task-1',
    title: 'Review Grade 12 Biology: Genetics & Punnett Squares',
    subjectName: 'Biology',
    grade: 'Grade 12',
    dueDate: 'Today',
    completed: true,
    priority: 'high',
    type: 'daily',
    estimatedMinutes: 30,
    reminderTime: '17:00',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'task-2',
    title: 'Complete 20-Question Physics Mock Exam (Mechanics)',
    subjectName: 'Physics',
    grade: 'Grade 12',
    dueDate: 'Today',
    completed: false,
    priority: 'high',
    type: 'daily',
    estimatedMinutes: 25,
    reminderTime: '19:30',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'task-3',
    title: 'Read Chemistry Chapter 2: Chemical Equilibrium Summary',
    subjectName: 'Chemistry',
    grade: 'Grade 12',
    dueDate: 'Tomorrow',
    completed: false,
    priority: 'medium',
    type: 'daily',
    estimatedMinutes: 20,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'task-4',
    title: 'Practice Mathematics Calculus Derivative Problems',
    subjectName: 'Mathematics',
    grade: 'Grade 12',
    dueDate: 'This Week',
    completed: false,
    priority: 'medium',
    type: 'weekly',
    estimatedMinutes: 45,
    createdAt: new Date().toISOString(),
  },
];

const DEFAULT_WEEKLY_GOALS: WeeklyGoal[] = [
  {
    id: 'goal-1',
    title: 'Target Study Time',
    category: 'study_time',
    current: 185,
    target: 300,
    unit: 'minutes',
    completed: false,
  },
  {
    id: 'goal-2',
    title: 'Complete Practice Quizzes',
    category: 'quizzes_completed',
    current: 2,
    target: 4,
    unit: 'quizzes',
    completed: false,
  },
  {
    id: 'goal-3',
    title: 'Read Academic Unit Notes',
    category: 'notes_read',
    current: 3,
    target: 5,
    unit: 'chapters',
    completed: false,
  },
];

export const StudyPlannerView: React.FC<StudyPlannerViewProps> = ({
  language,
  currentUser,
  onUpdateProfile,
  onOpenAITutor,
}) => {
  const t = TRANSLATIONS[language] || TRANSLATIONS.en;

  // Local storage persistence
  const [tasks, setTasks] = useState<StudyTask[]>(() => {
    try {
      const saved = localStorage.getItem('eyoel_study_tasks');
      return saved ? JSON.parse(saved) : DEFAULT_TASKS;
    } catch {
      return DEFAULT_TASKS;
    }
  });

  const [weeklyGoals, setWeeklyGoals] = useState<WeeklyGoal[]>(() => {
    try {
      const saved = localStorage.getItem('eyoel_weekly_goals');
      return saved ? JSON.parse(saved) : DEFAULT_WEEKLY_GOALS;
    } catch {
      return DEFAULT_WEEKLY_GOALS;
    }
  });

  const [activeFilter, setActiveFilter] = useState<'all' | 'pending' | 'completed'>('all');
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newSubject, setNewSubject] = useState('Mathematics');
  const [newPriority, setNewPriority] = useState<'high' | 'medium' | 'low'>('medium');
  const [newTime, setNewTime] = useState<number>(30);
  const [newDueDate, setNewDueDate] = useState('Today');
  const [newReminder, setNewReminder] = useState('18:00');
  const [bannerNotice, setBannerNotice] = useState<string | null>(null);

  useEffect(() => {
    localStorage.setItem('eyoel_study_tasks', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem('eyoel_weekly_goals', JSON.stringify(weeklyGoals));
  }, [weeklyGoals]);

  const completedCount = tasks.filter((t) => t.completed).length;
  const totalCount = tasks.length;
  const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  const handleToggleTask = (taskId: string) => {
    setTasks((prev) =>
      prev.map((task) => {
        if (task.id === taskId) {
          const nextCompleted = !task.completed;
          if (nextCompleted && onUpdateProfile && currentUser) {
            // Reward +35 XP for completing a study task
            const currentXp = currentUser.xp || 0;
            onUpdateProfile({ xp: currentXp + 35 });
            setBannerNotice(
              language === 'am'
                ? '🎉 ስራውን አጠናቀዋል! +35 XP ተሸልመዋል!'
                : language === 'om'
                ? '🎉 Hojiin xumurameera! +35 XP argattaniittu!'
                : '🎉 Task completed! Earned +35 XP points!'
            );
            setTimeout(() => setBannerNotice(null), 3000);
          }
          return { ...task, completed: nextCompleted };
        }
        return task;
      })
    );
  };

  const handleDeleteTask = (taskId: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== taskId));
  };

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newTask: StudyTask = {
      id: `task-${Date.now()}`,
      title: newTitle.trim(),
      subjectName: newSubject,
      grade: currentUser?.grade || 'Grade 12',
      dueDate: newDueDate,
      completed: false,
      priority: newPriority,
      type: 'daily',
      estimatedMinutes: Number(newTime) || 30,
      reminderTime: newReminder,
      createdAt: new Date().toISOString(),
    };

    setTasks((prev) => [newTask, ...prev]);
    setNewTitle('');
    setIsAddingTask(false);
  };

  const filteredTasks = tasks.filter((t) => {
    if (activeFilter === 'pending') return !t.completed;
    if (activeFilter === 'completed') return t.completed;
    return true;
  });

  return (
    <div className="min-h-screen bg-[#0A0A0B] text-slate-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Banner Notice */}
        {bannerNotice && (
          <div className="bg-emerald-950/80 border border-emerald-600/60 text-emerald-200 px-4 py-3 rounded-2xl flex items-center justify-between shadow-lg shadow-emerald-950/40 animate-fade-in">
            <div className="flex items-center gap-2 text-sm font-semibold">
              <Sparkles className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{bannerNotice}</span>
            </div>
            <button onClick={() => setBannerNotice(null)} className="text-emerald-400 text-xs">
              Dismiss
            </button>
          </div>
        )}

        {/* Header & Overview */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#1E1E22] pb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full bg-[#C5A059]/10 border border-[#C5A059]/30 text-[#C5A059] text-xs font-bold uppercase tracking-wider flex items-center gap-1">
                <CalendarIcon className="w-3.5 h-3.5" />
                {language === 'am' ? 'የግል የጥናት እቅድ' : language === 'om' ? 'Karoora Qo\'annoo' : 'Personal Study Planner'}
              </span>
              <span className="text-xs text-slate-400">
                • {currentUser?.grade || 'Grade 12'} {currentUser?.stream || 'Natural Science'}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-white tracking-tight">
              {language === 'am'
                ? 'የትምህርት እቅድ እና ግቦች መከታተያ'
                : language === 'om'
                ? 'Karooraafi Galma Qo\'annoo Hordofaa'
                : 'Study Tasks, Weekly Goals & Reminders'}
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              {language === 'am'
                ? 'የዕለቱን ተግባራት ያቅዱ፣ ሳምንታዊ ግቦችን ያሳኩ፣ ቋሚ የጥናት ልማድ ገንብተው ውጤትዎን ያሳድጉ።'
                : language === 'om'
                ? 'Hojiiwwan guyyaa karoorsaa, galma torbee milkeessaa, qabxii keessan ol-guddisaa.'
                : 'Organize your daily study sessions, track weekly milestones, and build disciplined study habits.'}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsAddingTask(true)}
              className="px-4 py-2.5 rounded-xl bg-[#C5A059] hover:bg-[#d8b168] text-black font-bold text-xs uppercase tracking-wider flex items-center gap-2 transition-all shadow-md shadow-[#C5A059]/20 shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>{language === 'am' ? 'አዲስ ተግባር ጨምር' : language === 'om' ? 'Hojii Haaraa' : 'Add New Task'}</span>
            </button>
          </div>
        </div>

        {/* Progress & Quick Stats Card */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          
          {/* Progress Percent Card */}
          <div className="bg-[#121214] border border-[#222226] rounded-2xl p-5 flex items-center gap-4 shadow-md">
            <div className="relative w-16 h-16 shrink-0 flex items-center justify-center">
              <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 36 36">
                <path
                  className="text-[#222226]"
                  strokeWidth="3.5"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className="text-[#C5A059] transition-all duration-700"
                  strokeDasharray={`${progressPercent}, 100`}
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <span className="absolute font-bold text-sm text-white">{progressPercent}%</span>
            </div>
            <div>
              <span className="text-xs text-slate-400 font-medium block">
                {language === 'am' ? 'የተግባራት ማጠናቀቂያ' : language === 'om' ? 'Raawwii Hojii' : 'Daily Completion'}
              </span>
              <span className="text-lg font-bold text-white">
                {completedCount} / {totalCount} {language === 'am' ? 'ተጠናቋል' : 'Completed'}
              </span>
              <span className="text-[11px] text-[#C5A059] block mt-0.5">
                {completedCount === totalCount && totalCount > 0
                  ? '🌟 All tasks complete! Outstanding focus!'
                  : `${totalCount - completedCount} tasks remaining today`}
              </span>
            </div>
          </div>

          {/* Daily Streak Card */}
          <div className="bg-[#121214] border border-[#222226] rounded-2xl p-5 flex items-center gap-4 shadow-md">
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
              <Flame className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs text-slate-400 font-medium block">
                {language === 'am' ? 'የጥናት ቀናት ቅደም ተከተል' : language === 'om' ? 'Guyyoota Qo\'annoo Walitti-aanaan' : 'Daily Study Streak'}
              </span>
              <span className="text-lg font-bold text-white">
                {currentUser?.studyStreakDays || 3} {language === 'am' ? 'ቀናት' : 'Days Active'}
              </span>
              <span className="text-[11px] text-amber-400/80 block mt-0.5">
                Keep the momentum going today!
              </span>
            </div>
          </div>

          {/* AI Tutor Assistant Hint Card */}
          <div className="bg-gradient-to-br from-[#1A1A22] to-[#121216] border border-[#2D2D36] rounded-2xl p-5 flex items-center justify-between shadow-md">
            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-xs text-[#C5A059] font-bold">
                <Sparkles className="w-3.5 h-3.5" />
                <span>AI Study Tutor Ready</span>
              </div>
              <p className="text-xs text-slate-300">
                Stuck on a task? Ask the AI Tutor for hints or practice questions.
              </p>
            </div>
            {onOpenAITutor && (
              <button
                onClick={onOpenAITutor}
                className="px-3 py-1.5 rounded-lg bg-[#C5A059]/20 hover:bg-[#C5A059]/30 border border-[#C5A059]/40 text-[#C5A059] text-xs font-semibold whitespace-nowrap transition-colors"
              >
                Launch Tutor
              </button>
            )}
          </div>
        </div>

        {/* Main Content Grid: Tasks (Left) + Weekly Goals & Reminders (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Tasks Column (2 Cols) */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between border-b border-[#1E1E22] pb-3">
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-white font-serif">
                  {language === 'am' ? 'የጥናት ተግባራት' : language === 'om' ? 'Hojiiwwan Qo\'annoo' : 'Study Tasks'}
                </h2>
                <span className="px-2 py-0.5 rounded-full bg-[#1E1E24] text-xs text-slate-400 font-bold">
                  {filteredTasks.length}
                </span>
              </div>

              {/* Filter Tabs */}
              <div className="flex items-center gap-1 bg-[#121214] p-1 rounded-xl border border-[#222226] text-xs">
                <button
                  onClick={() => setActiveFilter('all')}
                  className={`px-3 py-1 rounded-lg font-medium transition-colors ${
                    activeFilter === 'all' ? 'bg-[#C5A059] text-black font-bold' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  All ({tasks.length})
                </button>
                <button
                  onClick={() => setActiveFilter('pending')}
                  className={`px-3 py-1 rounded-lg font-medium transition-colors ${
                    activeFilter === 'pending' ? 'bg-[#C5A059] text-black font-bold' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Active ({totalCount - completedCount})
                </button>
                <button
                  onClick={() => setActiveFilter('completed')}
                  className={`px-3 py-1 rounded-lg font-medium transition-colors ${
                    activeFilter === 'completed' ? 'bg-[#C5A059] text-black font-bold' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Done ({completedCount})
                </button>
              </div>
            </div>

            {/* Task Input Form (Modal or Expandable) */}
            {isAddingTask && (
              <form
                onSubmit={handleCreateTask}
                className="bg-[#141418] border border-[#C5A059]/40 rounded-2xl p-4 sm:p-5 space-y-4 shadow-xl animate-fade-in"
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <Plus className="w-4 h-4 text-[#C5A059]" />
                    {language === 'am' ? 'አዲስ የጥናት ተግባር መመዝገቢያ' : 'Create New Study Task'}
                  </h3>
                  <button
                    type="button"
                    onClick={() => setIsAddingTask(false)}
                    className="text-xs text-slate-400 hover:text-white"
                  >
                    Cancel
                  </button>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">
                    Task Title / Objective:
                  </label>
                  <input
                    type="text"
                    required
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="e.g. Master Chemistry Chapter 3: Reaction Kinetics & Equilibrium"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#0E0E10] border border-[#2B2B32] text-sm text-white focus:outline-none focus:border-[#C5A059]"
                  />
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div>
                    <label className="text-slate-400 block mb-1 font-medium">Subject:</label>
                    <select
                      value={newSubject}
                      onChange={(e) => setNewSubject(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-[#0E0E10] border border-[#2B2B32] text-white focus:outline-none focus:border-[#C5A059]"
                    >
                      <option value="Mathematics">Mathematics</option>
                      <option value="Physics">Physics</option>
                      <option value="Biology">Biology</option>
                      <option value="Chemistry">Chemistry</option>
                      <option value="English">English</option>
                      <option value="History">History</option>
                      <option value="Geography">Geography</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-slate-400 block mb-1 font-medium">Priority:</label>
                    <select
                      value={newPriority}
                      onChange={(e) => setNewPriority(e.target.value as any)}
                      className="w-full px-3 py-2 rounded-xl bg-[#0E0E10] border border-[#2B2B32] text-white focus:outline-none focus:border-[#C5A059]"
                    >
                      <option value="high">🔥 Urgent / High</option>
                      <option value="medium">⚡ Medium</option>
                      <option value="low">🌱 Low</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-slate-400 block mb-1 font-medium">Estimated Time:</label>
                    <select
                      value={newTime}
                      onChange={(e) => setNewTime(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl bg-[#0E0E10] border border-[#2B2B32] text-white focus:outline-none focus:border-[#C5A059]"
                    >
                      <option value={15}>15 Minutes</option>
                      <option value={25}>25 Mins (Pomodoro)</option>
                      <option value={45}>45 Minutes</option>
                      <option value={60}>1 Hour</option>
                      <option value={90}>1.5 Hours</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-slate-400 block mb-1 font-medium">Reminder Time:</label>
                    <input
                      type="time"
                      value={newReminder}
                      onChange={(e) => setNewReminder(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-[#0E0E10] border border-[#2B2B32] text-white focus:outline-none focus:border-[#C5A059]"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsAddingTask(false)}
                    className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-[#C5A059] hover:bg-[#d8b168] text-black font-bold text-xs uppercase tracking-wider flex items-center gap-1.5"
                  >
                    <Check className="w-3.5 h-3.5" />
                    Save Task
                  </button>
                </div>
              </form>
            )}

            {/* Task List */}
            <div className="space-y-3">
              {filteredTasks.length === 0 ? (
                <div className="bg-[#121214] border border-[#222226] rounded-2xl p-8 text-center space-y-2">
                  <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto opacity-70" />
                  <p className="text-sm font-semibold text-white">No tasks in this view!</p>
                  <p className="text-xs text-slate-400">
                    {activeFilter === 'completed'
                      ? 'No completed tasks yet. Keep moving forward!'
                      : 'You have cleared all active tasks. Add a new study session above!'}
                  </p>
                </div>
              ) : (
                filteredTasks.map((task) => (
                  <div
                    key={task.id}
                    className={`p-4 rounded-2xl border transition-all flex items-start gap-3 group ${
                      task.completed
                        ? 'bg-[#0E0E10]/80 border-[#1E1E22] opacity-65'
                        : 'bg-[#121214] border-[#222226] hover:border-[#333338] shadow-sm'
                    }`}
                  >
                    {/* Toggle Button */}
                    <button
                      type="button"
                      onClick={() => handleToggleTask(task.id)}
                      className={`mt-0.5 p-1 rounded-lg transition-colors ${
                        task.completed
                          ? 'text-emerald-400 hover:text-emerald-300'
                          : 'text-slate-500 hover:text-[#C5A059]'
                      }`}
                      title={task.completed ? 'Mark uncompleted' : 'Mark completed (+35 XP)'}
                    >
                      {task.completed ? (
                        <CheckCircle2 className="w-5 h-5 fill-emerald-950 text-emerald-400" />
                      ) : (
                        <Circle className="w-5 h-5" />
                      )}
                    </button>

                    {/* Task Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span
                          className={`text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded-md ${
                            task.priority === 'high'
                              ? 'bg-rose-950/60 text-rose-300 border border-rose-800/60'
                              : task.priority === 'medium'
                              ? 'bg-amber-950/60 text-amber-300 border border-amber-800/60'
                              : 'bg-slate-800 text-slate-300 border border-slate-700'
                          }`}
                        >
                          {task.priority === 'high' ? 'High' : task.priority === 'medium' ? 'Medium' : 'Normal'}
                        </span>

                        <span className="px-2 py-0.5 rounded-md bg-[#1E1E22] text-[#C5A059] text-xs font-semibold">
                          {task.subjectName}
                        </span>

                        {task.reminderTime && (
                          <span className="flex items-center gap-1 text-[11px] text-slate-400">
                            <Bell className="w-3 h-3 text-amber-400" />
                            {task.reminderTime}
                          </span>
                        )}
                      </div>

                      <p
                        className={`text-sm font-medium mt-1.5 ${
                          task.completed ? 'line-through text-slate-500' : 'text-slate-100'
                        }`}
                      >
                        {task.title}
                      </p>

                      <div className="flex items-center gap-4 mt-2 text-xs text-slate-400">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          {task.estimatedMinutes} mins
                        </span>
                        <span>• {task.dueDate}</span>
                      </div>
                    </div>

                    {/* Delete Task */}
                    <button
                      type="button"
                      onClick={() => handleDeleteTask(task.id)}
                      className="opacity-0 group-hover:opacity-100 p-2 text-slate-500 hover:text-rose-400 transition-opacity rounded-lg"
                      title="Delete task"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Weekly Goals & Study Reminders Column (1 Col) */}
          <div className="space-y-6">
            
            {/* Weekly Goals Card */}
            <div className="bg-[#121214] border border-[#222226] rounded-2xl p-5 space-y-4 shadow-md">
              <div className="flex items-center justify-between border-b border-[#222226] pb-3">
                <div className="flex items-center gap-2">
                  <Target className="w-4 h-4 text-[#C5A059]" />
                  <h3 className="text-sm font-bold text-white font-serif">
                    {language === 'am' ? 'ሳምንታዊ ግቦች' : language === 'om' ? 'Galma Torbee' : 'Weekly Goals'}
                  </h3>
                </div>
                <span className="text-[11px] text-[#C5A059] font-bold">Week 1 Active</span>
              </div>

              <div className="space-y-4">
                {weeklyGoals.map((goal) => {
                  const percent = Math.min(100, Math.round((goal.current / goal.target) * 100));
                  return (
                    <div key={goal.id} className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-semibold text-slate-200">{goal.title}</span>
                        <span className="text-slate-400">
                          <strong className="text-white">{goal.current}</strong> / {goal.target} {goal.unit}
                        </span>
                      </div>
                      
                      <div className="w-full h-2 bg-[#1E1E22] rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${
                            percent >= 100 ? 'bg-emerald-500' : 'bg-[#C5A059]'
                          }`}
                          style={{ width: `${percent}%` }}
                        />
                      </div>

                      <div className="flex items-center justify-between text-[10px] text-slate-500">
                        <span>{percent}% Completed</span>
                        {percent >= 100 && (
                          <span className="text-emerald-400 font-bold flex items-center gap-0.5">
                            <Check className="w-3 h-3" /> Goal Achieved!
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Study Reminders Settings */}
            <div className="bg-[#121214] border border-[#222226] rounded-2xl p-5 space-y-3 shadow-md">
              <div className="flex items-center gap-2 border-b border-[#222226] pb-3">
                <Bell className="w-4 h-4 text-amber-400" />
                <h3 className="text-sm font-bold text-white font-serif">
                  {language === 'am' ? 'የጥናት ማሳሰቢያዎች' : language === 'om' ? 'Yaadachiisa Qo\'annoo' : 'Study Reminders'}
                </h3>
              </div>

              <div className="space-y-3 text-xs">
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#18181C] border border-[#26262C]">
                  <div>
                    <span className="font-semibold text-white block">Evening Focus Block</span>
                    <span className="text-[11px] text-slate-400">Daily alert at 18:30 EAT</span>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-400 font-bold text-[10px] border border-emerald-800">
                    Active
                  </span>
                </div>

                <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#18181C] border border-[#26262C]">
                  <div>
                    <span className="font-semibold text-white block">Morning Formula Drill</span>
                    <span className="text-[11px] text-slate-400">Daily alert at 06:45 EAT</span>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-400 font-bold text-[10px] border border-emerald-800">
                    Active
                  </span>
                </div>

                <p className="text-[11px] text-slate-400 pt-1 leading-relaxed">
                  💡 <em>Consistency is key: 25 minutes of deliberate practice every day outperforms cramming by over 300%.</em>
                </p>
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
