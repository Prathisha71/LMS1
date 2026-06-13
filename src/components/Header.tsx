import React, { useState } from 'react';
import { useLmsStore } from '../store/index';
import { 
  Bell, Sun, Moon, BookOpen, 
  Menu, X, Sparkles, LogOut, ChevronDown 
} from 'lucide-react';

interface HeaderProps {
  onToggleSidebar?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onToggleSidebar }) => {
  const { 
    activeView, setView, profile, notifications, readAllNotifications, isDarkMode, setTheme 
  } = useLmsStore();
  const [showNotifMenu, setShowNotifMenu] = useState(false);

  const unreadCount = notifications.filter(n => !n.read).length;

  const viewTitles: Record<string, string> = {
    'student-dash': 'Student Hub',
    'course-view': 'Deep Learning Space',
    'quiz-view': 'Quiz Assessment',
    'assignment-view': 'Assignments Center',
    'profile-view': 'Academic Profile',
    'teacher-dash': 'Educator Dashboard',
    'content-upload': 'Content Upload Studio',
    'quiz-builder': 'Assessment Constructor',
    'admin-structure': 'SaaS Registry & Structure',
    'admin-analytics': 'Platform Core Analytics',
    'webrtc-live': 'WebRTC Elite Classroom',
    'ai-tutor': 'AI Personal Tutor',
    'drm-security': 'DRM Security Console',
    'parent-portal': 'Parent Monitor Shield'
  };

  const handleNotifClick = () => {
    setShowNotifMenu(!showNotifMenu);
    if (!showNotifMenu) {
      readAllNotifications();
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full glass-card border-none rounded-none border-b border-white/5 dark:border-white/5 py-4 px-6 flex items-center justify-between font-sans">
      {/* Mobile Sidebar Trigger & Breadcrumb */}
      <div className="flex items-center gap-3">
        {onToggleSidebar && (
          <button 
            onClick={onToggleSidebar}
            className="md:hidden p-2 rounded-lg bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}
        <div>
          <h1 className="text-xl font-bold font-display tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
            {viewTitles[activeView] || 'EduVerse'}
            {activeView === 'student-dash' && (
              <span className="text-[10px] bg-brand-royal/10 text-brand-royal border border-brand-royal/20 dark:bg-brand-royal/20 dark:text-blue-300 font-semibold px-2 py-0.5 rounded-full flex items-center gap-1">
                <Sparkles className="w-2.5 h-2.5" /> Premium Elite
              </span>
            )}
          </h1>
        </div>
      </div>

      {/* Top Navigation Options / Badges */}
      <div className="flex items-center gap-4">


        {/* Notifications Popover */}
        <div className="relative">
          <button 
            onClick={handleNotifClick}
            className="relative p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-950/50 dark:hover:bg-slate-950 border border-slate-200 dark:border-white/5 text-slate-500 dark:text-slate-400 dark:hover:text-slate-100 transition-all"
          >
            <Bell className="w-4.5 h-4.5" />
            {unreadCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-red-500 text-white text-[9px] font-bold flex items-center justify-center animate-pulse">
                {unreadCount}
              </span>
            )}
          </button>

          {showNotifMenu && (
            <div className="absolute right-0 mt-3 w-80 glass-card p-3 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl z-50 animate-fade-in-up">
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-200 dark:border-slate-800">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wide">Notifications</span>
                {unreadCount > 0 && (
                  <span className="text-[10px] bg-red-500/10 text-red-400 px-2 py-0.5 rounded-full font-medium">
                    {unreadCount} new
                  </span>
                )}
              </div>
              <div className="max-h-60 overflow-y-auto space-y-2">
                {notifications.length === 0 ? (
                  <div className="py-6 text-center text-xs text-slate-500 dark:text-slate-500">
                    No recent notifications
                  </div>
                ) : (
                  notifications.map((notif) => (
                    <div 
                      key={notif.id} 
                      className={`p-2.5 rounded-xl text-left text-xs border transition-all ${
                        notif.read 
                          ? 'bg-transparent border-transparent text-slate-600 dark:text-slate-400' 
                          : 'bg-brand-royal/5 border-brand-royal/10 dark:bg-brand-royal/10 dark:border-brand-royal/20 text-slate-900 dark:text-slate-100'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className={`font-semibold ${
                          notif.type === 'alert' ? 'text-amber-500' : notif.type === 'success' ? 'text-emerald-500' : 'text-blue-500'
                        }`}>{notif.title}</span>
                        <span className="text-[9px] text-slate-400 dark:text-slate-500">{notif.time}</span>
                      </div>
                      <p className="text-[11px] leading-relaxed opacity-90">{notif.message}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* User Card Dropdown (Quick exit to Landing) */}
        <div className="flex items-center gap-2 pl-2 border-l border-slate-200 dark:border-white/10">
          <div className="hidden sm:block text-right">
            <p className="text-xs font-bold text-slate-900 dark:text-slate-100 leading-tight">{profile.name}</p>
            <p className="text-[10px] text-slate-500 dark:text-slate-500 capitalize">{profile.role}</p>
          </div>
          <button 
            onClick={() => setView('landing')} 
            className="flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-royal to-brand-violet text-white font-bold text-xs shadow-md shadow-brand-royal/10 hover:shadow-brand-royal/25 transition-all hover:scale-105"
            title="Log Out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
