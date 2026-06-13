import React, { useState, useEffect } from 'react';
import { useLmsStore } from '../store/index';
import { 
  User, GraduationCap, ChevronRight, ChevronLeft, 
  Mail, Lock, BookOpen, Check, Wallet, HelpCircle, MapPin, Calendar, ArrowLeft
} from 'lucide-react';
import { saveRegisteredStudent } from '../utils/localStorage';
import { PlanetLogo } from './PlanetLogo';

export const SignupPage: React.FC = () => {
  const { setView, boards } = useLmsStore();
  const [step, setStep] = useState(1);
  const [role, setRole] = useState<'student' | 'teacher'>('student');
  
  // Credentials & Personal details
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [age, setAge] = useState('');
  const [location, setLocation] = useState('');
  
  // Academic States
  const [boardId, setBoardId] = useState('tnsb');
  const [classId, setClassId] = useState('class-12');
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>(['maths-12']);
  const [optedSubjectId, setOptedSubjectId] = useState('maths-12');

  // Reset optedSubjectId when Board/Class/Subjects list changes
  useEffect(() => {
    const activeBoard = boards.find(b => b.id === boardId) || boards[0];
    const activeClass = activeBoard.classes.find(c => c.id === classId) || activeBoard.classes[0];
    const subjects = activeClass?.subjects || [];

    if (subjects.length > 0) {
      if (!subjects.some(s => s.id === optedSubjectId)) {
        setOptedSubjectId(subjects[0].id);
      }
    } else {
      setOptedSubjectId('');
    }
  }, [boardId, classId, boards, optedSubjectId]);

  // Payment State
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'upi'>('card');
  const [cardNumber, setCardNumber] = useState('');

  const activeBoard = boards.find(b => b.id === boardId) || boards[0];
  const activeClass = activeBoard.classes.find(c => c.id === classId) || activeBoard.classes[0];
  const subjects = activeClass?.subjects || [];

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();

    if (role === 'student') {
      const newProfile = {
        id: `student-${Date.now()}`,
        name: name || 'Scholar Student',
        username: username,
        password: password,
        email: `${username || 'student'}@eduverse.in`,
        role: 'student' as const,
        selectedBoardId: boardId,
        selectedClassId: classId,
        age: age,
        location: location,
        optedSubjectId: optedSubjectId,
        xp: 100,
        level: 1,
        coins: 10,
        streak: 1,
        achievements: [
          { 
            id: 'ach-1', 
            title: 'Fresh Scholar', 
            description: 'Created an EduVerse account', 
            icon: '🌱', 
            unlockedAt: new Date().toLocaleDateString('en-IN') 
          }
        ],
        certificates: []
      };

      // Register/save student to localStorage list
      saveRegisteredStudent(newProfile);

      // Set active profile in store
      useLmsStore.setState({ profile: newProfile });

      // Add greeting notification
      const { addNotification } = useLmsStore.getState();
      addNotification(
        'Welcome to EduVerse!',
        `Academic profile successfully registered with ${activeBoard.title} - ${activeClass?.title || 'Class 12'}. Opening your opted course!`,
        'success'
      );

      // Redirect directly to the course learning view for the opted subject
      const optedSubject = subjects.find(s => s.id === optedSubjectId) || subjects[0];
      if (optedSubject) {
        const firstChapter = optedSubject.chapters[0];
        const firstTopic = firstChapter?.topics[0];
        useLmsStore.getState().setActiveCourseContext(
          optedSubject.id,
          firstChapter?.id || null,
          firstTopic?.id || null
        );
        setView('course-view');
      } else {
        setView('student-dash');
      }

    } else {
      // Mock login for teacher
      useLmsStore.setState((state) => ({
        profile: {
          ...state.profile,
          role: 'teacher',
          name: name || 'Dr. Ramesh Sen',
          email: email
        }
      }));
      setView('teacher-dash');
    }
  };

  return (
    <div className="relative min-h-screen bg-slate-50 text-slate-800 flex items-center justify-center p-4 font-sans overflow-hidden">
      {/* Background Blobs */}
      <div className="absolute rounded-full blur-[120px] opacity-[0.06] pointer-events-none w-[450px] h-[450px] bg-brand-royal -top-20 -right-20" />
      <div className="absolute rounded-full blur-[120px] opacity-[0.06] pointer-events-none w-[400px] h-[400px] bg-brand-violet -bottom-20 -left-20" />

      {/* Floating brand header */}
      <div className="absolute top-6 left-6 flex items-center gap-3 z-10 select-none">
        <div 
          onClick={() => setView('landing')}
          className="flex items-center gap-2 cursor-pointer group"
        >
          <PlanetLogo className="w-8 h-8 group-hover:scale-105 transition-transform" />
          <span className="font-extrabold font-display text-sm tracking-tight text-slate-900 group-hover:text-brand-violet transition-colors">
            EduVerse
          </span>
        </div>
        <div className="h-4 w-px bg-slate-300" />
        <button 
          onClick={() => setView('landing')}
          className="text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors flex items-center gap-1"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Home</span>
        </button>
      </div>

      {/* Form Wizard Card */}
      <div className="w-full max-w-lg bg-white border border-slate-300 shadow-2xl p-8 rounded-2xl relative z-10 animate-fade-in-up">
        {/* Step Indicators */}
        <div className="flex items-center justify-center gap-2 mb-8 select-none">
          {[1, 2, 3].map((num) => (
            <React.Fragment key={num}>
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                step >= num 
                  ? 'bg-gradient-to-r from-brand-royal to-brand-violet text-white shadow-md' 
                  : 'bg-slate-100 border border-slate-300 text-slate-600'
              }`}>
                {num}
              </div>
              {num < 3 && (
                <div className={`w-8 h-[2px] rounded ${
                  step > num ? 'bg-gradient-to-r from-brand-royal to-brand-violet' : 'bg-slate-300'
                }`} />
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Wizard step 1: Role & Credentials */}
        {step === 1 && (
          <div className="space-y-6 text-left">
            <div className="text-center">
              <h2 className="text-xl font-bold font-display text-slate-900">Create Academic Identity</h2>
              <p className="text-xs text-slate-500 mt-2">Set up credentials to access custom board standard resources.</p>
            </div>

            <div className="space-y-4 text-left">
              {/* Account Role Selector */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Select Profile Context</label>
                <div className="grid grid-cols-2 gap-3">
                  <div 
                    onClick={() => { setRole('student'); setName(''); }}
                    className={`p-4 rounded-xl border-2 cursor-pointer transition-all flex flex-col items-center gap-2 text-center ${
                      role === 'student'
                        ? 'border-brand-violet bg-brand-violet/5 shadow-md'
                        : 'border-slate-200 hover:border-slate-300 bg-slate-50'
                    }`}
                  >
                    <User className={`w-6 h-6 ${role === 'student' ? 'text-brand-violet' : 'text-slate-400'}`} />
                    <span className="text-xs font-bold text-slate-800">Student Scholar</span>
                    <p className="text-[10px] text-slate-600 mt-1 leading-relaxed">Acquire personalized study feeds and interactive MCQ sheets.</p>
                  </div>

                  <div 
                    onClick={() => { setRole('teacher'); setName(''); }}
                    className={`p-4 rounded-xl border-2 cursor-pointer transition-all flex flex-col items-center gap-2 text-center ${
                      role === 'teacher'
                        ? 'border-brand-violet bg-brand-violet/5 shadow-md'
                        : 'border-slate-200 hover:border-slate-300 bg-slate-50'
                    }`}
                  >
                    <GraduationCap className={`w-6 h-6 ${role === 'teacher' ? 'text-brand-violet' : 'text-slate-400'}`} />
                    <span className="text-xs font-bold text-slate-800">Educator / Teacher</span>
                    <p className="text-[10px] text-slate-600 mt-1 leading-relaxed">Upload dynamic curriculum material, video sessions, and MCQ grids.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Credential Inputs */}
            {role === 'student' ? (
              <div className="space-y-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-705 uppercase tracking-wide">Full Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Prathamesh Sharma"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="premium-input text-xs"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-705 uppercase tracking-wide flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-slate-500" />
                      <span>Age</span>
                    </label>
                    <input
                      type="number"
                      placeholder="e.g. 17"
                      value={age}
                      onChange={(e) => setAge(e.target.value)}
                      className="premium-input text-xs"
                      required
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-705 uppercase tracking-wide flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-500" />
                      <span>Location</span>
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Mumbai"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className="premium-input text-xs"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-705 uppercase tracking-wide">Create Username</label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 w-4 h-4 text-slate-500" />
                    <input
                      type="text"
                      placeholder="Choose a login username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="premium-input pl-9 text-xs"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-700 uppercase tracking-wide">Create Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 w-4 h-4 text-slate-500" />
                    <input
                      type="password"
                      placeholder="Choose a strong password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="premium-input pl-9 text-xs"
                      required
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-705 uppercase tracking-wide">Full Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Dr. Ramesh Sen"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="premium-input text-xs"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-705 uppercase tracking-wide">Academic Email</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 w-4 h-4 text-slate-500" />
                    <input
                      type="email"
                      placeholder="teacher@eduverse.in"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="premium-input pl-9 text-xs"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-705 uppercase tracking-wide">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 w-4 h-4 text-slate-500" />
                    <input
                      type="password"
                      placeholder="Create a strong password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="premium-input pl-9 text-xs"
                      required
                    />
                  </div>
                </div>
              </div>
            )}

            <button
              type="button"
              onClick={() => setStep(2)}
              disabled={role === 'student' ? (!name || !username || !password || !age || !location) : (!name || !email || !password)}
              className="w-full premium-btn-primary py-3 text-xs disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span>Continue setup</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Wizard step 2: Academic Setup */}
        {step === 2 && (
          <div className="space-y-6 text-left">
            <div className="text-center">
              <h2 className="text-xl font-bold font-display text-slate-900">Select Academic Stream</h2>
              <p className="text-xs text-slate-600 mt-1.5">Tailor the system structure to match your exact classes and syllabus.</p>
            </div>

            <div className="space-y-4">
              {/* Board Selection */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-705 uppercase tracking-wide">Academic Board</label>
                <select
                  value={boardId}
                  onChange={(e) => setBoardId(e.target.value)}
                  className="premium-input text-xs"
                >
                  {boards.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.title}
                    </option>
                  ))}
                </select>
              </div>

              {/* Class Level Selection */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-705 uppercase tracking-wide">Class Level</label>
                <select
                  value={classId}
                  onChange={(e) => setClassId(e.target.value)}
                  className="premium-input text-xs"
                >
                  {activeBoard.classes.map((cls) => (
                    <option key={cls.id} value={cls.id}>
                      {cls.title}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="w-1/3 py-3 rounded-xl bg-slate-50 border border-slate-300 hover:bg-slate-100 text-slate-700 font-semibold transition-all text-xs flex items-center justify-center gap-1.5"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
              <button
                type="button"
                onClick={() => setStep(3)}
                className="w-2/3 premium-btn-primary py-3 text-xs"
              >
                <span>Billing Authorization</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Wizard step 3: Premium Billing Authorization */}
        {step === 3 && (
          <div className="space-y-6 text-left">
            <div className="text-center">
              <h2 className="text-xl font-bold font-display text-slate-900">Elite Billing Membership</h2>
              <p className="text-xs text-slate-600 mt-1.5">You are authorizing the EduVerse Premium subscription plan.</p>
            </div>

            {/* Price Badge Card */}
            <div className="p-5 rounded-2xl bg-gradient-to-r from-brand-royal/5 to-brand-violet/5 border border-slate-300 flex items-center justify-between">
              <div>
                <h4 className="text-sm font-bold text-slate-900">EduVerse Elite Membership</h4>
                <p className="text-[10px] text-slate-600 mt-1">Physical workbook shipping + 24/7 AI tutor access.</p>
              </div>
              <div className="text-right">
                <span className="text-xl font-extrabold text-slate-900 font-sans">₹30,000</span>
                <span className="text-[10px] text-slate-600 block">/ Month recurring</span>
              </div>
            </div>

            {/* Payment Mode */}
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 border border-slate-200 rounded-xl">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('card')}
                  className={`py-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                    paymentMethod === 'card' ? 'bg-white text-slate-900 border border-slate-305 shadow-sm' : 'text-slate-600'
                  }`}
                >
                  <Wallet className="w-3.5 h-3.5" />
                  <span>Credit Card</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod('upi')}
                  className={`py-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                    paymentMethod === 'upi' ? 'bg-white text-slate-900 border border-slate-305 shadow-sm' : 'text-slate-600'
                  }`}
                >
                  <span>UPI Payment</span>
                </button>
              </div>

              {paymentMethod === 'card' ? (
                <div className="space-y-3 text-left">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-705 uppercase tracking-wide">Card Number</label>
                    <input
                      type="text"
                      placeholder="4111 2222 3333 4444"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      className="premium-input text-xs"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-705 uppercase tracking-wide">Expiry Date</label>
                      <input type="text" placeholder="MM/YY" className="premium-input text-xs" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-700 uppercase tracking-wide">CVV Code</label>
                      <input type="text" placeholder="•••" className="premium-input text-xs" />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-center text-xs space-y-2">
                  <p className="text-slate-700">Scan this QR inside GPay / PhonePe / Paytm to set up Auto-Debit mandate.</p>
                  <div className="w-24 h-24 bg-white mx-auto rounded-lg flex items-center justify-center p-1 border border-slate-200 shadow-sm">
                    {/* Dummy QR representation */}
                    <div className="w-full h-full bg-slate-100 border-2 border-slate-300 border-dashed" />
                  </div>
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">UPI ID: eduverse@axisbank</span>
                </div>
              )}
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="w-1/3 py-3 rounded-xl bg-slate-50 border border-slate-300 hover:bg-slate-100 text-slate-700 font-semibold transition-all text-xs flex items-center justify-center gap-1.5"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
              <button
                type="button"
                onClick={handleSignup}
                className="w-2/3 premium-btn-primary py-3 text-xs"
              >
                <span>Authorize & Register</span>
                <Check className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        <div className="text-center mt-6 pt-6 border-t border-slate-100 text-xs text-slate-600 text-center">
          Already registered?{' '}
          <button 
            onClick={() => setView('login')}
            className="text-brand-violet font-semibold hover:underline"
          >
            Sign In
          </button>
        </div>
      </div>
    </div>
  );
};
