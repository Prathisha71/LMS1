import React, { useState } from 'react';
import { useLmsStore } from '../store/index';
import type { Assignment } from '../store/types';
import { 
  Users, Star, BookOpen, DollarSign, FileText, Check, 
  ArrowRight, Upload, PenTool, Sparkles, ChevronRight 
} from 'lucide-react';

export const TeacherDashboard: React.FC = () => {
  const { assignments, gradeAssignment, setView } = useLmsStore();
  const [gradingAssignId, setGradingAssignId] = useState<string | null>(null);
  
  // Grading form states
  const [score, setScore] = useState('45');
  const [feedback, setFeedback] = useState('Great analytical work. Make sure to detail the boundary conditions in your next electrochemistry graph.');

  const submittedAssignments = assignments.filter(a => a.status === 'Submitted');

  const handleGradeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!gradingAssignId) return;

    gradeAssignment(
      gradingAssignId,
      `A (${score}/100)`,
      feedback
    );

    // Add notification to student
    useLmsStore.getState().addNotification(
      'Assignment Graded',
      `Your submission has been graded: A (${score}/100). Check feedback details.`,
      'success'
    );

    setGradingAssignId(null);
  };

  const kpis = [
    { label: "Active Cohort Students", value: "450 Scholars", icon: Users, color: "text-blue-400" },
    { label: "Course Satisfaction Rating", value: "4.92 / 5.0", icon: Star, color: "text-yellow-400" },
    { label: "Hours Published Content", value: "78 Hours", icon: BookOpen, color: "text-violet-400" },
    { label: "Simulated Monthly Revenue", value: "₹1.35 Cr", icon: DollarSign, color: "text-emerald-400" }
  ];

  return (
    <div className="space-y-6 font-sans text-left">
      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi, idx) => {
          const Icon = kpi.icon;
          return (
            <div key={idx} className="glass-card p-5 border-slate-200 dark:border-white/5 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-slate-650 dark:text-slate-400 font-bold uppercase tracking-wider block">{kpi.label}</span>
                <span className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white mt-1 block">{kpi.value}</span>
              </div>
              <div className={`w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-white/5 flex items-center justify-center ${kpi.color}`}>
                <Icon className="w-5 h-5" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Grid: 2 Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left: Engagement Analytics and Action Hub */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Quick Creator shortcuts */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="glass-card p-6 border-slate-200 dark:border-white/5 bg-gradient-to-r from-brand-royal/10 to-transparent flex flex-col justify-between min-h-[150px]">
              <div>
                <Upload className="w-6 h-6 text-brand-royal" />
                <h4 className="text-base font-bold text-slate-900 dark:text-white mt-3">Upload Lecture Material</h4>
                <p className="text-xs text-slate-700 dark:text-slate-400 mt-1">Publish new HD MP4 classes, PDFs, and textbook chapters for scholars.</p>
              </div>
              <button 
                onClick={() => setView('content-upload')}
                className="mt-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-350 dark:border-white/5 text-slate-800 dark:text-white hover:bg-slate-200 dark:hover:bg-slate-950 hover:border-brand-royal/30 text-xs font-semibold flex items-center justify-center gap-1 transition-all active:scale-95"
              >
                <span>Open upload center</span>
                <ChevronRight className="w-4 h-4 text-brand-royal" />
              </button>
            </div>

            <div className="glass-card p-6 border-slate-200 dark:border-white/5 bg-gradient-to-r from-brand-violet/10 to-transparent flex flex-col justify-between min-h-[150px]">
              <div>
                <PenTool className="w-6 h-6 text-brand-violet-light" />
                <h4 className="text-base font-bold text-slate-900 dark:text-white mt-3">Dynamic Test Constructor</h4>
                <p className="text-xs text-slate-700 dark:text-slate-400 mt-1">Configure timed MCQ tests with custom explanations and AI triggers.</p>
              </div>
              <button 
                onClick={() => setView('quiz-builder')}
                className="mt-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-350 dark:border-white/5 text-slate-800 dark:text-white hover:bg-slate-200 dark:hover:bg-slate-950 hover:border-brand-violet/30 text-xs font-semibold flex items-center justify-center gap-1 transition-all active:scale-95"
              >
                <span>Construct exam sheet</span>
                <ChevronRight className="w-4 h-4 text-brand-violet-light" />
              </button>
            </div>
          </div>

          {/* Simulated Cohort Analytics Chart */}
          <div className="glass-card p-6 border-slate-200 dark:border-white/5 space-y-4">
            <div>
              <h4 className="text-base font-bold text-slate-900 dark:text-white">Engagement Heatmap</h4>
              <p className="text-xs text-slate-650 dark:text-slate-500">Hourly student lecture completion rate across chemistry and mathematics.</p>
            </div>

            {/* Custom Grid representation for Heatmap */}
            <div className="grid grid-cols-7 gap-2 pt-4 border-b border-slate-200 dark:border-white/5 pb-4">
              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
                <div key={day} className="text-center">
                  <span className="text-[10px] text-slate-500 font-bold block mb-2">{day}</span>
                  <div className="space-y-1.5 flex flex-col items-center">
                    <div className="w-6 h-6 rounded bg-brand-royal/80" title="90% active" />
                    <div className="w-6 h-6 rounded bg-brand-royal/60" />
                    <div className="w-6 h-6 rounded bg-brand-royal/40" />
                    <div className="w-6 h-6 rounded bg-brand-royal/90 animate-pulse" />
                    <div className="w-6 h-6 rounded bg-brand-violet/30" />
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right Column: Homework Submissions Review Tray */}
        <div className="space-y-6">
          
          {/* Homework Action Panel */}
          <div className="glass-card p-5 border-slate-200 dark:border-white/5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-white/5 pb-3">
              <div className="flex items-center gap-2">
                <FileText className="w-4.5 h-4.5 text-brand-royal" />
                <h3 className="text-xs font-bold text-slate-700 dark:text-slate-400 uppercase tracking-widest">Grading Queue</h3>
              </div>
              {submittedAssignments.length > 0 && (
                <span className="text-[9px] bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 font-bold px-2 py-0.5 rounded-full">
                  {submittedAssignments.length} Papers
                </span>
              )}
            </div>

            {submittedAssignments.length === 0 ? (
              <p className="text-xs text-slate-650 dark:text-slate-500 text-center py-8">No homework sheets awaiting review.</p>
            ) : (
              <div className="space-y-2.5">
                {submittedAssignments.map((a) => (
                  <div 
                    key={a.id}
                    className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/5 text-xs text-left space-y-3"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-bold text-slate-900 dark:text-white truncate max-w-[140px]">{a.title}</h4>
                        <span className="text-[9px] text-slate-650 dark:text-slate-500">{a.subjectTitle} • Submitted by Prathamesh</span>
                      </div>
                      <span className="text-[9px] text-brand-royal dark:text-brand-royal-300 font-mono font-bold bg-slate-100 dark:bg-slate-950 px-1.5 py-0.5 rounded border border-slate-250 dark:border-white/5">
                        .pdf file
                      </span>
                    </div>

                    {gradingAssignId === a.id ? (
                      <form onSubmit={handleGradeSubmit} className="space-y-3 border-t border-slate-200 dark:border-white/5 pt-3 animate-fade-in-up">
                        <div className="space-y-1">
                          <label className="text-[9px] font-bold text-slate-650 dark:text-slate-500 uppercase">Input Score / Grade</label>
                          <input 
                            type="text" 
                            value={score} 
                            onChange={(e) => setScore(e.target.value)} 
                            className="premium-input text-[11px] py-1.5" 
                            required 
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[9px] font-bold text-slate-650 dark:text-slate-500 uppercase">Tutor Comments</label>
                          <textarea 
                            value={feedback} 
                            onChange={(e) => setFeedback(e.target.value)} 
                            className="premium-input text-[11px] py-1.5 h-16 resize-none" 
                            required 
                          />
                        </div>
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => setGradingAssignId(null)}
                            className="w-1/3 py-2 rounded bg-slate-100 dark:bg-slate-950 border border-slate-250 dark:border-white/5 text-[10px] text-slate-700 dark:text-slate-400 font-bold"
                          >
                            Cancel
                          </button>
                          <button
                            type="submit"
                            className="w-2/3 premium-btn-primary py-2 text-[10px]"
                          >
                            Submit Grade
                          </button>
                        </div>
                      </form>
                    ) : (
                      <button
                        onClick={() => {
                          setGradingAssignId(a.id);
                          setScore('92');
                          setFeedback('Superb conceptual breakdown of cells.');
                        }}
                        className="w-full py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-950 dark:hover:bg-slate-900 border border-slate-250 dark:border-white/5 hover:border-brand-royal/30 text-slate-800 dark:text-white rounded-lg text-[10px] font-bold transition-all flex items-center justify-center gap-1"
                      >
                        <span>Evaluate Paper</span>
                        <ArrowRight className="w-3.5 h-3.5 text-brand-royal" />
                      </button>
                    )}
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
