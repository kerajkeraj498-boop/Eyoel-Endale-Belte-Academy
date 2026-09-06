import React, { useState } from 'react';
import {
  Bell,
  X,
  CheckCheck,
  BookOpen,
  Award,
  FileText,
  Sparkles,
  AlertCircle,
  Clock,
  Trash2,
  ExternalLink,
} from 'lucide-react';
import { InAppNotification, Language, ViewTab } from '../types';

interface NotificationsModalProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: InAppNotification[];
  onMarkAsRead: (id: string) => void;
  onMarkAllAsRead: () => void;
  onClearAll: () => void;
  onTabChange: (tab: ViewTab) => void;
  language: Language;
}

export const NotificationsModal: React.FC<NotificationsModalProps> = ({
  isOpen,
  onClose,
  notifications,
  onMarkAsRead,
  onMarkAllAsRead,
  onClearAll,
  onTabChange,
  language,
}) => {
  const [filter, setFilter] = useState<'all' | 'unread' | 'lessons' | 'quizzes' | 'announcements'>('all');

  if (!isOpen) return null;

  const filteredList = notifications.filter((item) => {
    if (filter === 'unread') return !item.read;
    if (filter === 'lessons') return item.type === 'lesson';
    if (filter === 'quizzes') return item.type === 'quiz' || item.type === 'exam';
    if (filter === 'announcements') return item.type === 'announcement';
    return true;
  });

  const unreadCount = notifications.filter((n) => !n.read).length;

  const getIcon = (type: InAppNotification['type']) => {
    switch (type) {
      case 'lesson':
        return <BookOpen className="w-4 h-4 text-sky-400" />;
      case 'quiz':
      case 'exam':
        return <Award className="w-4 h-4 text-[#C5A059]" />;
      case 'certificate':
        return <Sparkles className="w-4 h-4 text-emerald-400" />;
      case 'report-card':
        return <FileText className="w-4 h-4 text-amber-400" />;
      case 'announcement':
      default:
        return <Bell className="w-4 h-4 text-purple-400" />;
    }
  };

  const handleNotificationClick = (item: InAppNotification) => {
    onMarkAsRead(item.id);
    if (item.linkTab) {
      onTabChange(item.linkTab);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-3 sm:p-4">
      <div className="bg-[#141416] border border-[#2D2D30] rounded-3xl w-full max-w-xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh] animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-[#2D2D30] flex items-center justify-between bg-[#111112]">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#C5A059]/15 border border-[#C5A059]/40 flex items-center justify-center text-[#C5A059]">
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white">
                  {language === 'am' ? 'ማሳወቂያዎች' : language === 'om' ? 'Beeksisa' : 'Notifications'}
                </h3>
                {unreadCount > 0 && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#C5A059] text-black">
                    {unreadCount} {language === 'am' ? 'አዲስ' : 'New'}
                  </span>
                )}
              </div>
              <p className="text-[11px] text-slate-400">
                {language === 'am' ? 'የትምህርት፣ የፈተና እና የአካዳሚ የቅርብ ዜናዎች' : 'Academic updates, quiz results & school announcements'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            {unreadCount > 0 && (
              <button
                onClick={onMarkAllAsRead}
                className="px-2.5 py-1.5 rounded-lg hover:bg-[#1C1C1F] text-slate-300 hover:text-white text-xs font-medium flex items-center gap-1 transition-colors"
                title="Mark all as read"
              >
                <CheckCheck className="w-3.5 h-3.5 text-[#C5A059]" />
                <span className="hidden sm:inline">Mark read</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-[#1C1C1F] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1 px-4 py-2 bg-[#18181A] border-b border-[#2D2D30] overflow-x-auto text-xs">
          {(['all', 'unread', 'lessons', 'quizzes', 'announcements'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-3 py-1 rounded-full whitespace-nowrap capitalize font-medium transition-colors ${
                filter === tab
                  ? 'bg-[#C5A059] text-black font-bold'
                  : 'text-slate-400 hover:text-white hover:bg-[#202023]'
              }`}
            >
              {tab === 'all' ? 'All' : tab}
            </button>
          ))}
        </div>

        {/* List of Notifications */}
        <div className="overflow-y-auto divide-y divide-[#2D2D30]/60 p-2 sm:p-3 space-y-1 flex-1">
          {filteredList.length === 0 ? (
            <div className="py-12 text-center text-slate-400 space-y-2">
              <Bell className="w-8 h-8 mx-auto text-slate-600" />
              <p className="text-xs">No notifications in this category</p>
            </div>
          ) : (
            filteredList.map((item) => (
              <div
                key={item.id}
                onClick={() => handleNotificationClick(item)}
                className={`p-3 sm:p-3.5 rounded-2xl flex items-start gap-3 cursor-pointer transition-colors ${
                  item.read ? 'bg-[#141416] hover:bg-[#1A1A1D]' : 'bg-[#1C1A14] border border-[#C5A059]/30 hover:bg-[#232018]'
                }`}
              >
                <div className="p-2 rounded-xl bg-[#1F1F22] border border-[#2D2D30] shrink-0 mt-0.5">
                  {getIcon(item.type)}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <h4 className={`text-xs sm:text-sm font-bold truncate ${item.read ? 'text-slate-200' : 'text-white'}`}>
                      {item.title}
                    </h4>
                    <span className="text-[10px] text-slate-500 whitespace-nowrap flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {item.date}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    {item.message}
                  </p>
                  {item.linkTab && (
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-[#C5A059] mt-2">
                      <span>View details</span>
                      <ExternalLink className="w-2.5 h-2.5" />
                    </span>
                  )}
                </div>

                {!item.read && (
                  <span className="w-2 h-2 rounded-full bg-[#C5A059] shrink-0 mt-2" />
                )}
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {notifications.length > 0 && (
          <div className="p-3 bg-[#111112] border-t border-[#2D2D30] flex items-center justify-between text-xs text-slate-400">
            <span>{notifications.length} total notifications</span>
            <button
              onClick={onClearAll}
              className="text-rose-400 hover:text-rose-300 flex items-center gap-1 transition-colors"
            >
              <Trash2 className="w-3 h-3" />
              <span>Clear history</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
