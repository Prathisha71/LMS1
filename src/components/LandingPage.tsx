import React from 'react';
import { useLmsStore } from '../store/index';
import { 
  ArrowRight, ShieldCheck, Video, Sparkles, Trophy, 
  Users, Activity, Heart, Star, Layout, CheckCircle 
} from 'lucide-react';
import { PlanetLogo } from './PlanetLogo';

export const LandingPage: React.FC = () => {
  const { setView } = useLmsStore();

  const features = [
    {
      icon: Sparkles,
      title: "Contextual AI Tutor",
      desc: "Instant 24/7 explanations in mathematics and chemistry tailored to your textbook version, board standard, and learning speed."
    },
    {
      icon: Video,
      title: "UHD WebRTC Classrooms",
      desc: "Ultra-low latency streaming with active participant grids, digital whiteboards, and real-time screen shares."
    },
    {
      icon: Trophy,
      title: "Competency Leaderboards",
      desc: "Rankings based on chapter completion rate, quiz accuracy, and consistency streaks rather than plain grades."
    }
  ];

  const testimonials = [
    {
      quote: "EduVerse completely revolutionized my daughter's Class 12 prep. The physical kit, combined with the real-time AI tutor, justified every rupee of the premium subscription. She cleared JEE with a top rank.",
      author: "Aditi Rao",
      role: "Parent of Shreya Rao (Class 12 TNSB)",
      rating: 5,
      avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=100"
    },
    {
      quote: "The interface is gorgeous. Unlike local coaching portal apps which are cluttered and cartoonish, EduVerse looks like Apple and Stripe. The WebRTC streams are high definition and lag-free.",
      author: "Kabir Mehta",
      role: "Class 12 Student (TNSB board)",
      rating: 5,
      avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=100"
    }
  ];

  return (
    <div className="relative min-h-screen bg-white text-slate-800 overflow-x-hidden font-sans selection:bg-brand-royal/20 selection:text-slate-900">
      <div className="absolute rounded-full blur-[120px] opacity-[0.08] pointer-events-none w-[500px] h-[500px] bg-brand-royal top-[-100px] left-[-100px]" />
      <div className="absolute rounded-full blur-[120px] opacity-[0.08] pointer-events-none w-[600px] h-[600px] bg-brand-violet bottom-0 right-[-100px]" />
      <div className="absolute rounded-full blur-[120px] opacity-[0.05] pointer-events-none w-[400px] h-[400px] bg-cyan-500 top-[40%] right-[10%]" />

      {/* Modern Luxury Navbar */}
      <nav className="relative z-10 max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
        <div 
          onClick={() => setView('landing')}
          className="flex items-center gap-2 group cursor-pointer"
        >
          <PlanetLogo className="w-9 h-9 group-hover:scale-105 transition-transform" />
          <span className="font-extrabold font-display text-xl tracking-tight text-slate-900 group-hover:text-brand-violet transition-colors">
            EduVerse
          </span>
        </div>

        <div className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-600">
          <a href="#features" className="hover:text-slate-900 transition-colors">Curriculum</a>
          <a href="#pricing" className="hover:text-slate-900 transition-colors">Membership</a>
          <a href="#testimonials" className="hover:text-slate-900 transition-colors">Testimonials</a>
        </div>

        <div className="flex items-center gap-4">
          <button 
            onClick={() => setView('login')}
            className="text-xs font-semibold text-slate-500 hover:text-slate-900 px-4 py-2 hover:bg-slate-100 rounded-xl transition-all"
          >
            Sign In
          </button>
          <button 
            onClick={() => setView('signup')}
            className="px-4 py-2 text-xs rounded-xl bg-gradient-to-r from-brand-royal to-brand-violet hover:from-brand-royal-600 hover:to-brand-violet-dark text-white font-semibold shadow-lg shadow-brand-royal/15 transition-all hover:scale-102 active:scale-98"
          >
            Enroll Now
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 max-w-5xl mx-auto px-6 pt-16 pb-20 text-center">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-50 border border-slate-200 text-xs font-semibold text-brand-violet mb-8 hover:bg-slate-100 transition-all cursor-pointer">
          <Sparkles className="w-4 h-4 text-brand-violet animate-pulse" />
          <span>India's First High-Fidelity K12 LMS Portal</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-extrabold font-display text-slate-900 tracking-tight leading-[1.15] mb-6">
          The Ultimate Academic Platform for <br className="hidden sm:inline" />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-brand-royal via-violet-600 to-brand-violet">Class 9–12 Scholars</span>
        </h1>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
          <button 
            onClick={() => setView('login')}
            className="w-full sm:w-auto premium-btn-primary flex items-center justify-center gap-2 group"
          >
            <span>Enter Student Workspace</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
          <button 
            onClick={() => setView('login')}
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-slate-50 border border-slate-200 hover:bg-slate-100 text-slate-700 font-semibold transition-all duration-200 flex items-center justify-center gap-2"
          >
            Sign In as Educator
          </button>
        </div>


      </section>

      {/* Feature Highlights Grid */}
      <section id="features" className="relative z-10 max-w-6xl mx-auto px-6 py-24 border-t border-slate-100">
        <div className="text-center max-w-2xl mx-auto mb-20">
          <span className="text-xs font-bold text-brand-royal uppercase tracking-widest block mb-2">Elite Ecosystem</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold font-display text-slate-900 tracking-tight">
            Designed for Academic Supremacy
          </h2>
        </div>

        {/* Alternating Feature Rows with Mockups */}
        <div className="space-y-32">
          {features.map((feat, index) => {
            const Icon = feat.icon;
            const isEven = index % 2 === 0;
            const images = [
              "/feat_ai_tutor.png",
              "/feat_webrtc.png",
              "/feat_leaderboard.png"
            ];
            return (
              <div 
                key={index} 
                className={`flex flex-col ${isEven ? 'md:flex-row' : 'md:flex-row-reverse'} items-center gap-12 text-left`}
              >
                {/* Text Description Block */}
                <div className="flex-1 space-y-4">
                  <div className="w-12 h-12 rounded-xl bg-brand-royal/5 flex items-center justify-center text-brand-royal border border-brand-royal/10 overflow-hidden">
                    {feat.title === "Contextual AI Tutor" ? (
                      <img 
                        src="/feat_ai_tutor_icon.png" 
                        alt="AI Tutor" 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Icon className="w-6 h-6" />
                    )}
                  </div>
                  <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight">{feat.title}</h3>
                  <p className="text-sm sm:text-base text-slate-600 leading-relaxed">{feat.desc}</p>
                </div>
                {/* Image Mockup Block */}
                <div className="flex-1 w-full">
                  <div className="rounded-2xl border border-slate-200/80 bg-slate-50/50 p-2 shadow-xl hover:shadow-2xl transition-all duration-300">
                    <div className="rounded-xl border border-slate-200 bg-white overflow-hidden shadow-sm">
                      <img 
                        src={images[index]} 
                        alt={`${feat.title} Mockup`} 
                        className="w-full h-auto object-cover select-none"
                      />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>


      {/* Testimonials */}
      <section id="testimonials" className="relative z-10 max-w-6xl mx-auto px-6 py-20 border-t border-slate-100">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-bold text-brand-royal uppercase tracking-widest block mb-2">Testimonials</span>
          <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Approved by Elite Parents and Educators</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {testimonials.map((test, index) => (
            <div key={index} className="bg-white border border-slate-200 p-6 flex flex-col justify-between rounded-2xl shadow-sm hover:shadow-md transition-all">
              <p className="text-sm text-slate-600 italic leading-relaxed mb-6">"{test.quote}"</p>
              <div className="flex items-center gap-3">
                <img src={test.avatar} alt={test.author} className="w-10 h-10 rounded-full border border-slate-200 object-cover" />
                <div className="text-left">
                  <h4 className="text-xs sm:text-sm font-bold text-slate-900">{test.author}</h4>
                  <p className="text-[10px] text-slate-500">{test.role}</p>
                </div>
                <div className="ml-auto flex gap-0.5">
                  {[...Array(test.rating)].map((_, i) => (
                    <Star key={i} className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-slate-100 bg-slate-50 py-8 px-6 font-sans">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <PlanetLogo className="w-7 h-7" />
            <span className="font-extrabold font-display text-sm tracking-tight text-slate-900">
              EduVerse
            </span>
          </div>
          <p className="text-[10px] sm:text-xs text-slate-600">
            © 2026 EduVerse Technologies Pvt. Ltd. All rights reserved. Designed for elite scholars.
          </p>
          <div className="flex items-center gap-6 text-[10px] sm:text-xs text-slate-600">
            <a href="#" className="hover:text-slate-900 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-slate-900 transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-slate-900 transition-colors">Contact Support</a>
          </div>
        </div>
      </footer>
    </div>
  );
};
