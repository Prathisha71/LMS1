import React, { useState } from 'react';
import { useLmsStore } from '../store/index';
import { 
  Plus, Check, Trash2, Settings, BarChart3, Users, 
  DollarSign, Activity, Database, ShieldAlert, Award, Grid 
} from 'lucide-react';

export const AdminPortal: React.FC = () => {
  const { 
    boards, addBoard, addClass, addSubject, activeView, setView 
  } = useLmsStore();

  // Selected states for structure builder
  const [selectedBoardId, setSelectedBoardId] = useState(boards[0]?.id || '');
  const [selectedClassId, setSelectedClassId] = useState(boards[0]?.classes[0]?.id || '');

  // Add Item States
  const [newBoardTitle, setNewBoardTitle] = useState('');
  const [newClassTitle, setNewClassTitle] = useState('');
  const [newSubjectTitle, setNewSubjectTitle] = useState('');
  const [newSubjectColor, setNewSubjectColor] = useState('from-indigo-600 to-purple-700');

  const activeBoard = boards.find(b => b.id === selectedBoardId) || boards[0];
  const activeClass = activeBoard?.classes.find(c => c.id === selectedClassId) || activeBoard?.classes[0];

  const handleAddBoard = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBoardTitle) return;
    addBoard(newBoardTitle);
    
    useLmsStore.getState().addNotification(
      'Board Added',
      `New academic board registry "${newBoardTitle}" has been added.`,
      'success'
    );
    setNewBoardTitle('');
  };

  const handleAddClass = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBoardId || !newClassTitle) return;
    addClass(selectedBoardId, newClassTitle);

    useLmsStore.getState().addNotification(
      'Class Level Created',
      `Academic level "${newClassTitle}" added to Board standard.`,
      'success'
    );
    setNewClassTitle('');
  };

  const handleAddSubject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBoardId || !selectedClassId || !newSubjectTitle) return;
    addSubject(selectedBoardId, selectedClassId, newSubjectTitle, newSubjectColor);

    useLmsStore.getState().addNotification(
      'Subject Created',
      `Dynamic course "${newSubjectTitle}" is now active in study libraries.`,
      'success'
    );
    setNewSubjectTitle('');
  };

  const colors = [
    { value: 'from-blue-600 to-indigo-700', label: 'Indigo Space' },
    { value: 'from-violet-600 to-fuchsia-700', label: 'Violet Glow' },
    { value: 'from-sky-600 to-blue-700', label: 'Royal Sky' },
    { value: 'from-emerald-600 to-teal-700', label: 'Emerald Deep' },
    { value: 'from-rose-600 to-pink-700', label: 'Rose Gold' }
  ];

  return (
    <div className="space-y-6 font-sans text-left">
      
      {/* Selector view switcher */}
      <div className="flex border-b border-slate-200 dark:border-white/5 gap-4">
        <button
          onClick={() => setView('admin-structure')}
          className={`pb-3 text-xs font-semibold flex items-center gap-1.5 border-b-2 transition-all ${
            activeView === 'admin-structure'
              ? 'border-brand-royal text-brand-royal dark:text-white'
              : 'border-transparent text-slate-550 dark:text-slate-500 hover:text-slate-900 dark:hover:text-slate-300'
          }`}
        >
          <Settings className="w-4 h-4" />
          <span>Academic Tree Builder</span>
        </button>

        <button
          onClick={() => setView('admin-analytics')}
          className={`pb-3 text-xs font-semibold flex items-center gap-1.5 border-b-2 transition-all ${
            activeView === 'admin-analytics'
              ? 'border-brand-royal text-brand-royal dark:text-white'
              : 'border-transparent text-slate-550 dark:text-slate-500 hover:text-slate-900 dark:hover:text-slate-300'
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          <span>Platform Overview Analytics</span>
        </button>
      </div>

      {activeView === 'admin-structure' ? (
        // STRUCTURE BUILDER MODULE
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in-up">
          
          {/* Column 1: Board Creator */}
          <div className="glass-card p-5 border-slate-200 dark:border-white/5 space-y-4">
            <h4 className="text-xs font-bold text-slate-700 dark:text-slate-400 uppercase tracking-widest border-b border-slate-200 dark:border-white/5 pb-2">
              1. Board Standards
            </h4>
            
            <form onSubmit={handleAddBoard} className="space-y-3">
              <div className="space-y-1">
                <label className="text-[9px] font-bold text-slate-650 dark:text-slate-500 uppercase">Board Title</label>
                <input 
                  type="text" 
                  placeholder="e.g. ICSE Board" 
                  value={newBoardTitle} 
                  onChange={(e) => setNewBoardTitle(e.target.value)} 
                  className="premium-input text-xs" 
                  required 
                />
              </div>
              <button type="submit" className="w-full premium-btn-primary py-2 text-xs">
                <Plus className="w-3.5 h-3.5" />
                <span>Registry Board</span>
              </button>
            </form>

            <div className="space-y-2 pt-4 border-t border-slate-200 dark:border-white/5">
              <span className="text-[10px] font-bold text-slate-650 dark:text-slate-500 uppercase">Board List</span>
              <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                {boards.map(b => (
                  <button
                    key={b.id}
                    onClick={() => {
                      setSelectedBoardId(b.id);
                      setSelectedClassId(b.classes[0]?.id || '');
                    }}
                    className={`w-full py-2 px-3 rounded-lg text-left text-xs transition-all border flex items-center justify-between ${
                      selectedBoardId === b.id
                        ? 'border-brand-royal bg-brand-royal/10 text-brand-royal dark:text-white font-semibold'
                        : 'border-transparent text-slate-700 hover:text-slate-900 bg-slate-50 dark:text-slate-400 dark:hover:text-slate-200 dark:bg-slate-900/60'
                    }`}
                  >
                    <span>{b.title}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Column 2: Class Creator */}
          <div className="glass-card p-5 border-slate-200 dark:border-white/5 space-y-4">
            <h4 className="text-xs font-bold text-slate-700 dark:text-slate-400 uppercase tracking-widest border-b border-slate-200 dark:border-white/5 pb-2">
              2. Class Grade levels
            </h4>

            <form onSubmit={handleAddClass} className="space-y-3">
              <div className="space-y-1">
                <label className="text-[9px] font-bold text-slate-655 dark:text-slate-500 uppercase">Active Board context</label>
                <div className="text-xs text-slate-800 bg-slate-100 p-2.5 rounded-lg border border-slate-250 font-semibold dark:text-slate-300 dark:bg-slate-950 dark:border-white/5">
                  {activeBoard?.title || 'None Selected'}
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[9px] font-bold text-slate-650 dark:text-slate-500 uppercase">Class Title</label>
                <input 
                  type="text" 
                  placeholder="e.g. Class 11" 
                  value={newClassTitle} 
                  onChange={(e) => setNewClassTitle(e.target.value)} 
                  className="premium-input text-xs" 
                  required 
                />
              </div>
              <button 
                type="submit" 
                disabled={!selectedBoardId}
                className="w-full premium-btn-primary py-2 text-xs disabled:opacity-50"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Class Grade</span>
              </button>
            </form>

            <div className="space-y-2 pt-4 border-t border-slate-200 dark:border-white/5">
              <span className="text-[10px] font-bold text-slate-650 dark:text-slate-500 uppercase">Class List under Board</span>
              {activeBoard?.classes.length === 0 ? (
                <p className="text-xs text-slate-650 dark:text-slate-500 text-center py-4">No classes registered.</p>
              ) : (
                <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                  {activeBoard?.classes.map(c => (
                    <button
                      key={c.id}
                      onClick={() => setSelectedClassId(c.id)}
                      className={`w-full py-2 px-3 rounded-lg text-left text-xs transition-all border flex items-center justify-between ${
                        selectedClassId === c.id
                          ? 'border-brand-royal bg-brand-royal/10 text-brand-royal dark:text-white font-semibold'
                          : 'border-transparent text-slate-700 hover:text-slate-900 bg-slate-50 dark:text-slate-400 dark:hover:text-slate-200 dark:bg-slate-900/60'
                      }`}
                    >
                      <span>{c.title}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Column 3: Subject Creator */}
          <div className="glass-card p-5 border-slate-200 dark:border-white/5 space-y-4">
            <h4 className="text-xs font-bold text-slate-700 dark:text-slate-400 uppercase tracking-widest border-b border-slate-200 dark:border-white/5 pb-2">
              3. Dynamic Subjects
            </h4>

            <form onSubmit={handleAddSubject} className="space-y-3">
              <div className="space-y-1">
                <label className="text-[9px] font-bold text-slate-650 dark:text-slate-500 uppercase">Academic Link context</label>
                <div className="text-[10px] text-slate-800 bg-slate-100 p-2.5 rounded-lg border border-slate-250 font-mono dark:text-slate-300 dark:bg-slate-950 dark:border-white/5">
                  {activeBoard?.title} &gt; {activeClass?.title || 'None Selected'}
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[9px] font-bold text-slate-655 dark:text-slate-500 uppercase">Subject Title</label>
                <input 
                  type="text" 
                  placeholder="e.g. Biology Elective" 
                  value={newSubjectTitle} 
                  onChange={(e) => setNewSubjectTitle(e.target.value)} 
                  className="premium-input text-xs" 
                  required 
                />
              </div>

              {/* Color choice */}
              <div className="space-y-1">
                <label className="text-[9px] font-bold text-slate-650 dark:text-slate-500 uppercase">Visual Accent</label>
                <select 
                  value={newSubjectColor}
                  onChange={(e) => setNewSubjectColor(e.target.value)}
                  className="premium-input text-xs"
                >
                  {colors.map((c, i) => (
                    <option key={i} value={c.value} className="bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100">{c.label}</option>
                  ))}
                </select>
              </div>

              <button 
                type="submit" 
                disabled={!selectedClassId}
                className="w-full premium-btn-primary py-2 text-xs disabled:opacity-50"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Create Subject Module</span>
              </button>
            </form>

            <div className="space-y-2 pt-4 border-t border-slate-200 dark:border-white/5">
              <span className="text-[10px] font-bold text-slate-650 dark:text-slate-500 uppercase">Subjects Registered</span>
              {!activeClass || activeClass.subjects.length === 0 ? (
                <p className="text-xs text-slate-650 dark:text-slate-500 text-center py-4">No subjects registered in this grade.</p>
              ) : (
                <div className="space-y-1 max-h-48 overflow-y-auto pr-1">
                  {activeClass.subjects.map(sub => (
                    <div 
                      key={sub.id} 
                      className="p-2 bg-slate-50 dark:bg-slate-900 rounded-lg text-xs flex justify-between items-center text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-white/5"
                    >
                      <span>{sub.title}</span>
                      <span className={`w-3.5 h-3.5 rounded bg-gradient-to-tr ${sub.color}`} />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

        </div>
      ) : (
        // CORE PLATFORM ANALYTICS DASHBOARD
        <div className="space-y-6 animate-fade-in-up">
          
          {/* Admin KPI blocks */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: "Active Subscriptions", value: "1,500 Scholars", icon: Users, color: "text-blue-500" },
              { label: "Total Platform Revenue", value: "₹4.50 Crores", icon: DollarSign, color: "text-emerald-500" },
              { label: "Vercel / VM Server Status", value: "99.98% uptime", icon: Activity, color: "text-violet-500" },
              { label: "Database Transactions", value: "145k queries", icon: Database, color: "text-indigo-500" }
            ].map((stat, idx) => {
              const Icon = stat.icon;
              return (
                <div key={idx} className="glass-card p-5 border-slate-200 dark:border-white/5 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-655 dark:text-slate-500 font-bold uppercase tracking-wider block">{stat.label}</span>
                    <span className="text-lg font-extrabold text-slate-900 dark:text-white mt-1 block">{stat.value}</span>
                  </div>
                  <div className={`w-10 h-10 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/5 flex items-center justify-center ${stat.color}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Cohort Growth Rate line graph placeholder */}
            <div className="lg:col-span-2 glass-card p-6 border-slate-200 dark:border-white/5">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h4 className="text-base font-bold text-slate-900 dark:text-white">Monthly Active Registrations</h4>
                  <p className="text-xs text-slate-650 dark:text-slate-500">Platform subscription scaling after Class 10/12 exams launch.</p>
                </div>
                <div className="text-[10px] font-bold text-brand-violet dark:text-brand-violet-light bg-violet-500/10 px-2 py-0.5 rounded border border-brand-violet/20">
                  +12.4% QoQ Growth
                </div>
              </div>

              {/* Graphic custom graph representation via SVG curves */}
              <div className="h-44 w-full flex items-end pt-4 border-b border-slate-200 dark:border-white/5 relative">
                {/* SVG Curve */}
                <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 150">
                  <path 
                    d="M0,150 Q50,120 100,110 T200,60 T300,50 T400,10" 
                    fill="none" 
                    stroke="url(#gradient)" 
                    strokeWidth="3.5" 
                    strokeLinecap="round"
                  />
                  <defs>
                    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#3b82f6" />
                      <stop offset="50%" stopColor="#7c3aed" />
                      <stop offset="100%" stopColor="#ec4899" />
                    </linearGradient>
                  </defs>
                </svg>

                {/* Grid guidelines */}
                <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-[0.03]">
                  <div className="w-full h-[1px] bg-white" />
                  <div className="w-full h-[1px] bg-white" />
                  <div className="w-full h-[1px] bg-white" />
                  <div className="w-full h-[1px] bg-white" />
                </div>

                {/* Bottom months labels */}
                <div className="w-full flex justify-between text-[9px] text-slate-650 dark:text-slate-500 font-bold px-1 mb-[-20px] relative z-10">
                  <span>Jan</span>
                  <span>Feb</span>
                  <span>Mar</span>
                  <span>Apr</span>
                  <span>May</span>
                  <span>Jun</span>
                </div>
              </div>
            </div>

            {/* Geographical Usage Distribution */}
            <div className="glass-card p-5 border-slate-200 dark:border-white/5 space-y-4">
              <h4 className="text-xs font-bold text-slate-700 dark:text-slate-400 uppercase tracking-widest border-b border-slate-200 dark:border-white/5 pb-2">
                Regional Distribution
              </h4>

              <div className="space-y-3">
                {[
                  { city: "Mumbai Metro", share: "34%", students: "510 scholars" },
                  { city: "NCR Delhi", share: "28%", students: "420 scholars" },
                  { city: "Bengaluru Elite", share: "18%", students: "270 scholars" },
                  { city: "Hyderabad High-tech", share: "12%", students: "180 scholars" },
                  { city: "Pune IT", share: "8%", students: "120 scholars" }
                ].map((region, idx) => (
                  <div key={idx} className="space-y-1 text-xs text-left">
                    <div className="flex justify-between items-center text-[11px]">
                      <span className="font-semibold text-slate-700 dark:text-slate-300">{region.city}</span>
                      <span className="font-bold text-slate-900 dark:text-white font-mono">{region.share}</span>
                    </div>
                    {/* Tiny visual bar */}
                    <div className="w-full h-1 bg-slate-100 dark:bg-slate-950 rounded-full overflow-hidden">
                      <div className="h-full bg-brand-violet" style={{ width: region.share }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>
      )}

    </div>
  );
};
