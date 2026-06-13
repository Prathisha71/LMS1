import React from 'react';
import { useLmsStore } from '../store/index';
import { 
  Sparkles, Play, Award, Calendar, AlertCircle, 
  ArrowRight, Brain, Zap, Clock, ChevronRight, BookOpen 
} from 'lucide-react';

export const StudentDashboard: React.FC = () => {
  const { 
    setView, profile, boards, assignments, setActiveCourseContext 
  } = useLmsStore();

  const activeBoard = boards.find(b => b.id === profile.selectedBoardId) || boards[0];
  const activeClass = activeBoard.classes.find(c => c.id === profile.selectedClassId) || activeBoard.classes[0];
  
  const subjects = activeClass?.subjects || [];
  const classSubjectIds = subjects.map(s => s.id);
  const classAssignments = assignments.filter(a => classSubjectIds.includes(a.subjectId));
  const pendingAssignments = classAssignments.filter(a => a.status === 'Pending');

  // Simple handler to launch a course
  const handleStartLearning = (subId: string) => {
    const subject = subjects.find(s => s.id === subId);
    const firstChapter = subject?.chapters[0];
    const firstTopic = firstChapter?.topics[0];
    
    setActiveCourseContext(
      subId, 
      firstChapter?.id || null, 
      firstTopic?.id || null
    );
    setView('course-view');
  };

  // Mock study metrics data for our visual dashboard charts
  const mockStudyHours = [
    { day: 'Mon', hours: 4.2 },
    { day: 'Tue', hours: 5.5 },
    { day: 'Wed', hours: 3.8 },
    { day: 'Thu', hours: 6.2 },
    { day: 'Fri', hours: 4.8 },
    { day: 'Sat', hours: 8.0 },
    { day: 'Sun', hours: 2.5 }
  ];

  const maxHours = Math.max(...mockStudyHours.map(d => d.hours));

  return (
    <div className="space-y-6 font-sans">
      {/* Welcome & Streak Banner */}
      <div className="relative overflow-hidden glass-card p-6 border-slate-200 dark:border-white/5 bg-gradient-to-r from-slate-50 via-white to-slate-50 dark:from-slate-950/80 dark:via-brand-navy-light/40 dark:to-slate-950/80 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        {/* Glow */}
        <div className="absolute top-0 right-1/4 w-40 h-40 bg-brand-royal/10 blur-[80px] rounded-full" />
        
        <div className="text-left">
          <h2 className="text-xl sm:text-2xl font-extrabold font-display text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            Welcome back, {profile.name}
          </h2>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
            Curriculum synced with <span className="text-slate-800 dark:text-slate-300 font-semibold">{activeBoard.title}</span> • {activeClass?.title || 'Class 12'}
          </p>
        </div>

        <div className="flex items-center gap-4">
          <button 
            onClick={() => setView('webrtc-live')}
            className="premium-btn-primary py-2.5 px-4 text-xs font-semibold"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>Join Live Class</span>
          </button>
        </div>
      </div>

      {/* Grid: 2 Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Side: Course Progress & Active Subjects (2 Cols on large screens) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">Active Core Subjects</h3>
            <button 
              onClick={() => setView('course-view')}
              className="text-xs text-brand-violet hover:underline flex items-center gap-1 font-semibold"
            >
              <span>Explore Lectures</span>
              <ChevronRight className="w-3 h-3" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {subjects.map((sub) => {
              // Calculate completion percentage based on mock topics
              const totalTopics = sub.chapters.reduce((acc, chap) => acc + chap.topics.length, 0);
              const completedTopics = sub.chapters.reduce((acc, chap) => 
                acc + chap.topics.filter(t => t.isCompleted).length, 0
              );
              const percent = totalTopics > 0 ? Math.round((completedTopics / totalTopics) * 100) : 0;

              return (
                <div 
                  key={sub.id} 
                  className="glass-card p-5 border-slate-200 dark:border-white/5 flex flex-col justify-between hover:border-brand-royal/30 transition-all group relative overflow-hidden"
                >
                  {/* Subtle Background Accent */}
                  <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${sub.color || 'from-blue-600 to-indigo-600'} opacity-[0.03] rounded-full blur-2xl group-hover:opacity-10 transition-opacity`} />
                  
                  <div className="text-left">
                    <div className="flex items-center justify-between mb-4">
                      <span className={`px-2.5 py-1 rounded-lg bg-gradient-to-r ${sub.color || 'from-blue-600 to-indigo-600'} text-white text-[10px] font-bold uppercase tracking-wider`}>
                        {sub.title}
                      </span>
                      <span className="text-xs font-bold text-slate-600 dark:text-slate-400">{percent}% Completed</span>
                    </div>

                    <h4 className="text-base font-bold text-slate-900 dark:text-white mb-2 group-hover:text-brand-violet transition-colors">
                      {sub.chapters.length > 0 ? sub.chapters[0].title : 'Introductory Lectures'}
                    </h4>
                    <p className="text-xs text-slate-600 dark:text-slate-400 mb-6 line-clamp-2">
                      Syllabus aligned with current Indian National Boards containing physical worksheets and solutions.
                    </p>
                  </div>

                  <div className="space-y-4">
                    {/* Visual Progress Bar */}
                    <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-900 rounded-full overflow-hidden">
                      <div 
                        className={`h-full bg-gradient-to-r ${sub.color || 'from-blue-600 to-indigo-600'}`} 
                        style={{ width: `${percent}%` }}
                      />
                    </div>

                    <button
                      onClick={() => handleStartLearning(sub.id)}
                      className="w-full py-2.5 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-transparent text-slate-800 dark:text-slate-100 hover:bg-brand-royal dark:hover:bg-brand-royal hover:text-white dark:hover:text-white text-xs font-semibold transition-all flex items-center justify-center gap-1.5"
                    >
                      <span>Continue Study</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Performance Analytics Custom Visual Chart */}
          <div className="glass-card p-6 border-slate-200 dark:border-white/5">
            <div className="flex items-center justify-between mb-6 text-left">
              <div>
                <h4 className="text-base font-bold text-slate-900 dark:text-white">Consistent Study Days</h4>
                <p className="text-xs text-slate-600 dark:text-slate-500">Weekly track of active learning and assessment days.</p>
              </div>
              <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-lg p-1.5 text-[10px] text-slate-600 dark:text-slate-400 font-bold select-none">
                <span>Consistent: 6/7 Days</span>
              </div>
            </div>

            {/* Custom SVG Bar Chart */}
            <div className="space-y-2">
              {/* Bars container with baseline border */}
              <div className="h-40 flex items-end justify-between gap-3 pt-6 border-b border-slate-200 dark:border-white/5 px-2">
                {mockStudyHours.map((data, index) => {
                  const heightPercent = (data.hours / maxHours) * 85; // cap height
                  return (
                    <div 
                      key={index} 
                      className="h-full flex-1 flex flex-col justify-end items-center group cursor-pointer relative"
                    >
                      {/* Tooltip */}
                      <div 
                        style={{ bottom: `calc(${heightPercent}% + 8px)` }}
                        className="absolute left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white text-[9px] font-bold py-1 px-1.5 rounded shadow-lg transition-opacity pointer-events-none whitespace-nowrap z-20"
                      >
                        Active Day ({data.hours}h study)
                      </div>
                      {/* Bar */}
                      <div 
                        style={{ height: `${heightPercent}%`, borderRadius: '8px 8px 0px 0px' }}
                        className="w-full max-w-[24px] bg-gradient-to-t from-brand-royal/60 to-brand-violet/85 group-hover:to-brand-violet transition-all group-hover:shadow-[0_0_15px_rgba(124,58,237,0.2)]"
                      />
                    </div>
                  );
                })}
              </div>
              {/* Labels container below baseline */}
              <div className="flex justify-between gap-3 px-2">
                {mockStudyHours.map((data, index) => (
                  <div key={index} className="flex-1 text-center">
                    <span className="text-[10px] text-slate-500 font-semibold">{data.day}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: AI Assistant, Upcoming Classes & Assignments */}
        <div className="space-y-6">
          
          {/* Upcoming Live Classes Card */}
          <div className="glass-card p-5 border-slate-200 dark:border-white/5 space-y-4">
            <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest text-left">Upcoming Live Classes</h3>
            <p className="text-xs text-slate-600 dark:text-slate-550 text-center py-4">No upcoming live classes scheduled.</p>
          </div>

          {/* Assignments Tracker Card */}
          <div className="glass-card p-5 border-slate-200 dark:border-white/5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">Deadlines</h3>
              {pendingAssignments.length > 0 && (
                <span className="text-[9px] bg-amber-500/10 text-amber-600 border border-amber-500/20 font-bold px-2 py-0.5 rounded-full">
                  {pendingAssignments.length} Pending
                </span>
              )}
            </div>

            {classAssignments.length === 0 ? (
              <p className="text-xs text-slate-600 text-center py-4">No assignments assigned.</p>
            ) : (
              <div className="space-y-2.5">
                {classAssignments.slice(0, 3).map((assign) => (
                  <div 
                    key={assign.id}
                    onClick={() => setView('assignment-view')}
                    className="p-3 rounded-xl bg-slate-50/50 hover:bg-slate-100 border border-slate-200 dark:bg-slate-900/40 dark:hover:bg-slate-900 dark:border-white/5 dark:hover:border-white/10 transition-all text-left cursor-pointer flex justify-between items-center"
                  >
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate max-w-[150px]">{assign.title}</h4>
                      <p className="text-[9px] text-slate-500 dark:text-slate-500 mt-0.5">{assign.subjectTitle} • Due {assign.deadline}</p>
                    </div>
                    <span className={`text-[9px] font-semibold px-2 py-0.5 rounded-full ${
                      assign.status === 'Graded'
                        ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                        : assign.status === 'Submitted'
                        ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20'
                        : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20'
                    }`}>
                      {assign.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
};
