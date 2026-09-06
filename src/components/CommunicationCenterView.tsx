import React, { useState } from 'react';
import {
  MessageSquare,
  Bell,
  Send,
  User,
  CheckCheck,
  Clock,
  Sparkles,
  Search,
  CheckCircle2,
  Calendar,
  Award,
  AlertCircle,
} from 'lucide-react';
import { DirectMessage, NotificationItem, StudentUser, Language } from '../types';
import { TRANSLATIONS } from '../lib/translations';

interface CommunicationCenterProps {
  currentUser: StudentUser | null;
  language: Language;
}

const SAMPLE_TEACHERS = [
  { id: 'tea-1', name: 'Ato Yohannes Tadesse', subject: 'Mathematics & Physics', avatar: '👨‍🏫', status: 'online' },
  { id: 'tea-2', name: 'W/ro Selam Bekele', subject: 'Biology & Chemistry', avatar: '👩‍🏫', status: 'offline' },
  { id: 'tea-3', name: 'Ato Dawit Alemu', subject: 'History & Social Studies', avatar: '👨‍🏫', status: 'online' },
];

const DEFAULT_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif-1',
    title: 'Grade 12 Physics Mock Exam Released',
    message: 'A new 20-question Mechanics and Electromagnetism examination is now live.',
    type: 'quiz',
    date: '2 hours ago',
    read: false,
    linkTab: 'quizzes',
  },
  {
    id: 'notif-2',
    title: '🔥 3-Day Study Streak Maintained!',
    message: 'Great persistence! You have earned +50 XP bonus for your daily streak.',
    type: 'planner',
    date: 'Yesterday',
    read: true,
  },
  {
    id: 'notif-3',
    title: 'Teacher Feedback from Ato Yohannes',
    message: '"Excellent work on the Genetics problem set. Keep up the high standard!"',
    type: 'message',
    date: '2 days ago',
    read: true,
  },
  {
    id: 'notif-4',
    title: 'System Announcement: Offline Study Notes Active',
    message: 'You can now cache your chapter notes for offline reading during internet interruptions.',
    type: 'announcement',
    date: '3 days ago',
    read: true,
  },
];

const DEFAULT_MESSAGES: DirectMessage[] = [
  {
    id: 'm-1',
    senderId: 'tea-1',
    senderName: 'Ato Yohannes Tadesse',
    recipientId: 'current-student',
    recipientName: 'Student',
    text: 'Good afternoon! How did you find the latest calculus quiz on derivatives?',
    timestamp: '10:30 AM',
    read: true,
  },
  {
    id: 'm-2',
    senderId: 'current-student',
    senderName: 'Student',
    recipientId: 'tea-1',
    recipientName: 'Ato Yohannes Tadesse',
    text: 'It was very helpful! I had a quick question on the chain rule problem in question 7.',
    timestamp: '10:35 AM',
    read: true,
  },
  {
    id: 'm-3',
    senderId: 'tea-1',
    senderName: 'Ato Yohannes Tadesse',
    recipientId: 'current-student',
    recipientName: 'Student',
    text: 'Remember to identify the outer function first, differentiate with respect to the inner function, then multiply by the derivative of the inner function! You can also run it through our AI Tutor for instant step-by-step breakdown.',
    timestamp: '10:40 AM',
    read: true,
  },
];

export const CommunicationCenterView: React.FC<CommunicationCenterProps> = ({
  currentUser,
  language,
}) => {
  const t = TRANSLATIONS[language] || TRANSLATIONS.en;
  const [activeTab, setActiveTab] = useState<'messages' | 'notifications'>('messages');

  // Messaging State
  const [selectedTeacher, setSelectedTeacher] = useState(SAMPLE_TEACHERS[0]);
  const [messages, setMessages] = useState<DirectMessage[]>(() => {
    try {
      const saved = localStorage.getItem('eyoel_direct_messages');
      return saved ? JSON.parse(saved) : DEFAULT_MESSAGES;
    } catch {
      return DEFAULT_MESSAGES;
    }
  });
  const [newMsgText, setNewMsgText] = useState('');

  // Notification State
  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    try {
      const saved = localStorage.getItem('eyoel_notifications');
      return saved ? JSON.parse(saved) : DEFAULT_NOTIFICATIONS;
    } catch {
      return DEFAULT_NOTIFICATIONS;
    }
  });

  const unreadNotifsCount = notifications.filter((n) => !n.read).length;

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMsgText.trim()) return;

    const studentMsg: DirectMessage = {
      id: `msg-${Date.now()}`,
      senderId: currentUser?.id || 'current-student',
      senderName: currentUser?.name || 'Student Scholar',
      recipientId: selectedTeacher.id,
      recipientName: selectedTeacher.name,
      text: newMsgText.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      read: true,
    };

    const updated = [...messages, studentMsg];
    setMessages(updated);
    localStorage.setItem('eyoel_direct_messages', JSON.stringify(updated));
    setNewMsgText('');

    // Auto teacher reply simulation for responsive feel
    setTimeout(() => {
      const teacherReply: DirectMessage = {
        id: `msg-${Date.now() + 1}`,
        senderId: selectedTeacher.id,
        senderName: selectedTeacher.name,
        recipientId: currentUser?.id || 'current-student',
        recipientName: currentUser?.name || 'Student Scholar',
        text: `Thank you for your message. I have reviewed your query regarding ${selectedTeacher.subject}. Review the lesson summary in the study notes tab and try the practice exam!`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        read: true,
      };
      setMessages((prev) => {
        const next = [...prev, teacherReply];
        localStorage.setItem('eyoel_direct_messages', JSON.stringify(next));
        return next;
      });
    }, 1500);
  };

  const handleMarkAllNotificationsRead = () => {
    const updated = notifications.map((n) => ({ ...n, read: true }));
    setNotifications(updated);
    localStorage.setItem('eyoel_notifications', JSON.stringify(updated));
  };

  return (
    <div className="min-h-screen bg-[#0A0A0B] text-slate-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#1E1E22] pb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full bg-[#C5A059]/10 border border-[#C5A059]/30 text-[#C5A059] text-xs font-bold uppercase tracking-wider flex items-center gap-1">
                <MessageSquare className="w-3.5 h-3.5" />
                Communication & Announcements
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-white tracking-tight">
              Teacher Inquiries & Notification Center
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Communicate with your subject instructors and stay updated on announcements, exam deadlines, and study streaks.
            </p>
          </div>

          {/* Switcher */}
          <div className="flex items-center gap-1 bg-[#121214] p-1.5 rounded-2xl border border-[#222226] text-xs">
            <button
              onClick={() => setActiveTab('messages')}
              className={`px-4 py-2 rounded-xl font-bold transition-colors flex items-center gap-1.5 ${
                activeTab === 'messages' ? 'bg-[#C5A059] text-black shadow-md' : 'text-slate-400 hover:text-white'
              }`}
            >
              <MessageSquare className="w-4 h-4" />
              <span>Teacher Messages</span>
            </button>
            <button
              onClick={() => setActiveTab('notifications')}
              className={`px-4 py-2 rounded-xl font-bold transition-colors flex items-center gap-1.5 ${
                activeTab === 'notifications' ? 'bg-[#C5A059] text-black shadow-md' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Bell className="w-4 h-4" />
              <span>Notifications {unreadNotifsCount > 0 && `(${unreadNotifsCount})`}</span>
            </button>
          </div>
        </div>

        {/* Tab 1: Messaging Interface */}
        {activeTab === 'messages' && (
          <div className="bg-[#121214] border border-[#222226] rounded-3xl overflow-hidden shadow-xl grid grid-cols-1 md:grid-cols-3 h-[680px]">
            
            {/* Left Sidebar: Teachers List */}
            <div className="border-r border-[#222226] bg-[#0E0E10] flex flex-col h-full">
              <div className="p-4 border-b border-[#222226]">
                <h3 className="font-serif font-bold text-sm text-white">Academy Instructors</h3>
                <span className="text-xs text-slate-400">Direct academic mentorship</span>
              </div>

              <div className="flex-1 overflow-y-auto divide-y divide-[#1A1A1E]">
                {SAMPLE_TEACHERS.map((teacher) => {
                  const isSelected = selectedTeacher.id === teacher.id;
                  return (
                    <button
                      key={teacher.id}
                      onClick={() => setSelectedTeacher(teacher)}
                      className={`w-full p-4 text-left flex items-center gap-3 transition-colors ${
                        isSelected ? 'bg-[#1E1E24] border-l-4 border-l-[#C5A059]' : 'hover:bg-[#141418]'
                      }`}
                    >
                      <div className="relative">
                        <span className="text-2xl p-2 rounded-xl bg-[#1A1A20] inline-block">
                          {teacher.avatar}
                        </span>
                        {teacher.status === 'online' && (
                          <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-500 border-2 border-[#0E0E10]" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <span className="font-bold text-sm text-white block truncate">
                          {teacher.name}
                        </span>
                        <span className="text-xs text-[#C5A059] truncate block">
                          {teacher.subject}
                        </span>
                        <span className="text-[10px] text-slate-500 block">
                          {teacher.status === 'online' ? '● Online' : '○ Offline'}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Right Main: Active Chat Window */}
            <div className="md:col-span-2 flex flex-col h-full bg-[#121214]">
              {/* Chat Header */}
              <div className="p-4 border-b border-[#222226] bg-[#16161A] flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{selectedTeacher.avatar}</span>
                  <div>
                    <h4 className="font-bold text-sm text-white">{selectedTeacher.name}</h4>
                    <span className="text-xs text-slate-400">{selectedTeacher.subject}</span>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-emerald-950 text-emerald-300 text-[10px] font-bold border border-emerald-800">
                  Direct Channel
                </span>
              </div>

              {/* Chat Messages */}
              <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4">
                {messages.map((msg) => {
                  const isUser = msg.senderId !== selectedTeacher.id;
                  return (
                    <div
                      key={msg.id}
                      className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[80%] rounded-2xl p-3.5 text-xs sm:text-sm space-y-1 ${
                          isUser
                            ? 'bg-[#C5A059] text-black font-medium shadow-md shadow-[#C5A059]/10'
                            : 'bg-[#1C1C22] border border-[#282830] text-slate-200'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-4 text-[10px] opacity-75">
                          <span className="font-bold">{msg.senderName}</span>
                          <span>{msg.timestamp}</span>
                        </div>
                        <p className="leading-relaxed">{msg.text}</p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Chat Input Bar */}
              <form
                onSubmit={handleSendMessage}
                className="p-3 sm:p-4 border-t border-[#222226] bg-[#0E0E10] flex items-center gap-2"
              >
                <input
                  type="text"
                  value={newMsgText}
                  onChange={(e) => setNewMsgText(e.target.value)}
                  placeholder={`Ask ${selectedTeacher.name} a question about your lessons...`}
                  className="flex-1 px-4 py-3 rounded-xl bg-[#18181D] border border-[#2B2B34] text-xs sm:text-sm text-white focus:outline-none focus:border-[#C5A059]"
                />
                <button
                  type="submit"
                  className="px-5 py-3 rounded-xl bg-[#C5A059] hover:bg-[#d8b168] text-black font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 transition-colors shadow-md shadow-[#C5A059]/20 shrink-0"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send</span>
                </button>
              </form>
            </div>

          </div>
        )}

        {/* Tab 2: Notification Center */}
        {activeTab === 'notifications' && (
          <div className="bg-[#121214] border border-[#222226] rounded-3xl overflow-hidden shadow-xl p-6 space-y-6">
            <div className="flex items-center justify-between border-b border-[#222226] pb-4">
              <div>
                <h3 className="font-serif font-bold text-lg text-white">Academic Notifications & Activity Feed</h3>
                <p className="text-xs text-slate-400">Timely updates regarding curriculum, exam deadlines, and study streaks</p>
              </div>
              {unreadNotifsCount > 0 && (
                <button
                  onClick={handleMarkAllNotificationsRead}
                  className="text-xs text-[#C5A059] hover:underline font-semibold"
                >
                  Mark all as read
                </button>
              )}
            </div>

            <div className="space-y-3">
              {notifications.map((notif) => (
                <div
                  key={notif.id}
                  className={`p-4 rounded-2xl border transition-all flex items-start gap-4 ${
                    notif.read
                      ? 'bg-[#0E0E10] border-[#1E1E22] opacity-80'
                      : 'bg-[#18181D] border-[#C5A059]/40 shadow-md'
                  }`}
                >
                  <div className="w-10 h-10 rounded-xl bg-[#1E1E24] border border-[#2A2A32] flex items-center justify-center shrink-0">
                    {notif.type === 'quiz' ? (
                      <CheckCircle2 className="w-5 h-5 text-[#C5A059]" />
                    ) : notif.type === 'planner' ? (
                      <Award className="w-5 h-5 text-amber-400" />
                    ) : (
                      <Bell className="w-5 h-5 text-emerald-400" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-sm text-white">{notif.title}</h4>
                      <span className="text-[11px] text-slate-500">{notif.date}</span>
                    </div>
                    <p className="text-xs text-slate-300 mt-1 leading-relaxed">{notif.message}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
