import React, { useState, useRef, useEffect } from 'react';
import { useLmsStore } from '../store/index';
import type { Topic, Chapter, Subject } from '../store/types';
import { 
  Play, Pause, BookOpen, FileText, Bookmark, 
  CheckCircle, Plus, Trash2, ArrowRight, Star, Clock,
  ChevronLeft, ChevronRight, ZoomIn, ZoomOut, Printer, Download, Search, RotateCw, ExternalLink
} from 'lucide-react';

export const getExtendedSummary = (topicId: string, title: string, content: string): string => {
  const customSummaries: Record<string, string> = {
    'chemistry-9-c1-t1': `In this introductory chemistry lesson, we explore the properties and classifications of matter:
1. Elements: Pure substances containing only one kind of atom (e.g., Gold, Copper, Helium).
2. Compounds: Substances formed by the chemical combination of two or more elements in a fixed ratio.
3. Mixtures: Physical combinations of substances that retain their individual identities and properties.
4. Homogeneous Mixtures: Mixtures with a uniform, single-phase composition throughout (e.g., air, salt solutions).
5. Heterogeneous Mixtures: Mixtures with a non-uniform composition and visible separation phases.
6. Separation: Elements and compounds require chemical change to separate, while mixtures can be physically separated.
7. Objectives: Master the classification of matter, identify compounds vs mixtures, and explain physical differences.`,

    'chemistry-9-c1-t2': `This lesson covers the primary laboratory techniques used to isolate components of physical mixtures:
1. Sublimation: Used to separate a sublimable solid (e.g., iodine, ammonium chloride) from a non-sublimable solid.
2. Filtration: Separates insoluble solid particles from a liquid medium using porous barrier materials.
3. Centrifugation: Uses rapid rotational forces to separate dense suspended solids from liquid suspensions.
4. Chromatography: Separates components of a solution based on differing solubilities and adsorption rates.
5. Distillation: Separates miscible liquids by heating to vaporize and subsequently condensing the vapors.
6. Fractional Distillation: Used when boiling point differences are narrow, employing a fractionating column.
7. Core Skills: Choose correct separation setups based on physical properties and identify mixture compositions.`,

    'chemistry-9-c2-t1': `This topic explores the atomic structure of matter and the rules governing chemical valency:
1. Protons & Neutrons: Reside in the central nucleus, accounting for the mass of the atom.
2. Electrons: Move in defined orbits or energy levels around the nucleus with negative charges.
3. Valency: The combining capacity of an atom, determined by its outermost valence electrons.
4. Stable Configuration: Atoms participate in bonding to achieve a stable octet (8 valence electrons) state.
5. Ionic Bonding: Involves the complete transfer of valence electrons from metals to non-metals.
6. Covalent Bonding: Involves the sharing of electron pairs between two non-metal atoms.
7. Key Outcomes: Draw shell diagrams, calculate valency, and predict chemical formulas of compounds.`,

    'chemistry-9-c2-t2': `This lesson explains the nuclear relationships between different atomic species:
1. Isotopes: Atoms of the same element having the same atomic number but different mass numbers.
2. Examples: Protium, Deuterium, and Tritium are the three common isotopes of Hydrogen.
3. Isobars: Atoms of different elements having different atomic numbers but the same mass number.
4. Examples: Argon-40 and Calcium-40 are isobars as they share the same total mass.
5. Isotones: Atoms of different elements having different atomic numbers but equal numbers of neutrons.
6. Applications: Isotopes are widely used in nuclear reactors, carbon-14 dating, and medical radiation.
7. Key Outcomes: Distinguish between isotopes, isobars, and isotones, and calculate neutrons in each.`,

    'matrices-determinants-12-t1': `This lesson covers the fundamental operations and properties of square matrices:
1. Adjoint Matrix: Defined as the transpose of the cofactor matrix of a given square matrix A.
2. Inverse Matrix: Calculated using the formula A⁻¹ = (1/|A|) * adj(A), requiring a non-zero determinant.
3. Matrix Rank: The maximum number of linearly independent row or column vectors in the matrix.
4. Row Echelon Form: Obtained using elementary row operations to determine the rank of matrices.
5. Non-Singular Matrices: Invertible matrices that have a non-zero determinant (|A| ≠ 0).
6. Singular Matrices: Matrices with zero determinant (|A| = 0), which do not possess an inverse.
7. Applications: Essential for computer graphics, cryptography, and solving multi-variable linear models.`,

    'matrices-determinants-12-t2': `This topic teaches analytical and numerical methods for solving systems of linear equations:
1. Matrix Form: Systems are represented as AX = B, where A is the coefficient matrix.
2. Cramer's Rule: Solves equations using determinants (x = Δx/Δ, y = Δy/Δ) when Δ ≠ 0.
3. Matrix Inversion Method: Direct algebraic solution given by the formula X = A⁻¹B.
4. Gauss Elimination Method: Transforms the augmented matrix [A|B] into upper triangular form.
5. Back Substitution: Used in Gauss elimination to find variable values starting from the last row.
6. System Consistency: Determining if a system has a unique solution, infinite solutions, or no solution.
7. Core Skills: Set up augmented matrices, evaluate determinants, and solve linear systems systematically.`,

    'complex-numbers-12-t1': `This lesson covers the algebraic representation and geometry of complex numbers:
1. Imaginary Unit: Defined as i = √(-1), allowing representation of square roots of negative numbers.
2. Rectangular Form: Expressed as z = x + iy, where x is the real part and y is the imaginary part.
3. Polar Form: Represented as z = r(cos θ + i sin θ), where r is the modulus and θ is the argument.
4. Argand Diagram: Visual representation of complex numbers as coordinates in the complex plane.
5. Modulus: The distance of the complex number from the origin, calculated as r = √(x² + y²).
6. Argument: The angle θ formed with the positive real axis, determined by tan⁻¹(y/x).
7. Objectives: Convert between rectangular and polar forms, and plot numbers on Argand diagrams.`,

    'complex-numbers-12-t2': `This topic explores complex conjugates, modulus properties, and roots of complex numbers:
1. Conjugate: Formed by changing the sign of the imaginary part, represented as z* = x - iy.
2. Properties: Conjugates simplify division and find real numbers when multiplied (z * z* = |z|²).
3. de Moivre's Theorem: States that for any real number n, [r(cos θ + i sin θ)]^n = r^n(cos nθ + i sin nθ).
4. Finding Roots: Applying de Moivre's theorem to find the n-th roots of any complex number.
5. Geometric Meaning: The n-th roots of unity lie on a unit circle, forming a regular n-sided polygon.
6. Applications: Solves higher-degree polynomial equations and simplifies complex trigonometry.
7. Key Outcomes: Apply modulus properties, prove identities, and calculate roots using de Moivre's theorem.`,
  };

  if (customSummaries[topicId]) {
    return customSummaries[topicId];
  }

  const cleanTitle = title.replace(/^\d+(\.\d+)?\s+/, "");
  const coreConcept = cleanTitle.split(":")[0];
  
  return `This lesson covers the critical syllabus area of "${cleanTitle}" in detail:
1. Core Definition: Understanding the primary concepts and formulas governing "${coreConcept}".
2. Practical Applications: Examining real-world examples, worksheets, and syllabus requirements.
3. Theoretical Framework: Studying the underlying models, proofs, and definitions in this chapter.
4. Problem-Solving Approach: Developing methodical step-by-step solutions for Board examinations.
5. Key Equations: Analyzing relationships between parameters and calculating numerical answers.
6. Common Pitfalls: Avoiding calculations errors, incorrect signs, and improper unit conversions.
7. Learning Outcomes: ${content.replace(/\\.$/, "")}.
8. Revision Tips: Practice textbook problems and review high-yield questions before evaluations.`;
};

export const CourseLearningPage: React.FC = () => {
  const { 
    boards, profile, activeSubjectId, activeChapterId, activeTopicId, 
    completeTopic, bookmarks, addBookmark, deleteBookmark, setActiveCourseContext 
  } = useLmsStore();

  const [activeTab, setActiveTab] = useState<'content' | 'pdf' | 'bookmarks'>('content');
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [videoDuration] = useState(1200); // 20 mins mock duration in seconds
  const [bookmarkText, setBookmarkText] = useState('');
  
  // PDF Viewer states
  const [pdfPage, setPdfPage] = useState(1);
  const [pdfZoom, setPdfZoom] = useState(100);
  const [pdfRotation, setPdfRotation] = useState(0);
  const [pdfSearch, setPdfSearch] = useState('');

  const activeBoard = boards.find(b => b.id === profile.selectedBoardId) || boards[0];
  const activeClass = activeBoard.classes.find(c => c.id === profile.selectedClassId) || activeBoard.classes[0];
  
  const activeSubject = activeClass?.subjects.find(s => s.id === activeSubjectId) || activeClass?.subjects[0];
  const activeChapter = activeSubject?.chapters.find(c => c.id === activeChapterId) || activeSubject?.chapters[0];
  const activeTopic = activeChapter?.topics.find(t => t.id === activeTopicId) || activeChapter?.topics[0];

  const timerRef = useRef<number | null>(null);

  // Playback Simulation
  useEffect(() => {
    if (isPlaying) {
      timerRef.current = window.setInterval(() => {
        setCurrentTime((prev) => {
          if (prev >= videoDuration) {
            setIsPlaying(false);
            if (timerRef.current) clearInterval(timerRef.current);
            
            // Auto-complete topic when video ends
            if (activeSubject && activeChapter && activeTopic && !activeTopic.isCompleted) {
              completeTopic(
                activeBoard.id,
                activeClass.id,
                activeSubject.id,
                activeChapter.id,
                activeTopic.id
              );
              useLmsStore.getState().addNotification(
                'Topic Completed',
                `You have successfully completed "${activeTopic.title}"!`,
                'success'
              );
            }
            return videoDuration;
          }
          return prev + 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, videoDuration, activeBoard.id, activeClass.id, activeSubject, activeChapter, activeTopic, completeTopic]);

  // Formatter for time display
  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainingSecs = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${remainingSecs.toString().padStart(2, '0')}`;
  };

  const handleMarkAsCompleted = () => {
    if (activeSubject && activeChapter && activeTopic) {
      completeTopic(
        activeBoard.id,
        activeClass.id,
        activeSubject.id,
        activeChapter.id,
        activeTopic.id
      );
      // Trigger notification
      useLmsStore.getState().addNotification(
        'Topic Completed!',
        `You have successfully mastered "${activeTopic.title}" and gained 200 XP!`,
        'success'
      );
    }
  };

  const handleAddBookmarkSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookmarkText || !activeTopic || !activeChapter || !activeSubject) return;

    addBookmark({
      topicId: activeTopic.id,
      topicTitle: activeTopic.title,
      chapterTitle: activeChapter.title,
      subjectTitle: activeSubject.title,
      note: bookmarkText
    }, formatTime(currentTime));

    setBookmarkText('');
  };

  const jumpToBookmarkTime = (timestamp: string) => {
    const [mins, secs] = timestamp.split(':').map(Number);
    setCurrentTime(mins * 60 + secs);
    setIsPlaying(true);
  };

  if (!activeSubject) {
    return (
      <div className="p-8 text-center glass-card border-white/5 font-sans">
        <h3 className="text-lg font-bold text-white mb-2">No Courses Enrolled</h3>
        <p className="text-xs text-slate-400">Please choose boards/subjects in your profile wizard.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 font-sans">
      
      {/* Left Column: Player & Tabs */}
      <div className="lg:col-span-2 space-y-6">
        
        {/* Custom Mock Video Player */}
        <div className="relative aspect-[16/9] w-full rounded-2xl bg-black border border-white/10 shadow-2xl overflow-hidden group video-glow-container">
          {/* Simulated Video Stream */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div 
              className="absolute inset-0 bg-cover bg-center opacity-30 filter blur-[1px]" 
              style={{ 
                backgroundImage: `url('${activeChapter?.imageUrl || activeSubject?.imageUrl || "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&q=80&w=800"}')` 
              }} 
            />
            
            {/* Pulsing visual to mimic action video */}
            <div className="w-20 h-20 rounded-full border-2 border-brand-royal/30 flex items-center justify-center relative z-10 animate-pulse-slow">
              <span className="w-16 h-16 rounded-full bg-brand-royal/20 flex items-center justify-center text-brand-royal-300 font-bold text-xs">
                {isPlaying ? 'ACTIVE' : 'READY'}
              </span>
            </div>

            {/* Context Watermark */}
            <div className="absolute top-4 left-4 text-[9px] text-white/20 select-none font-mono tracking-widest z-10">
              EDUVERSE SECURE STREAM // IP: 192.168.1.1
            </div>
          </div>

          {/* Custom Player Controls HUD */}
          <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black via-black/80 to-transparent flex flex-col gap-2 z-20">
            {/* Progress Bar (Click to Seek) */}
            <div 
              onClick={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const clickX = e.clientX - rect.left;
                const width = rect.width;
                const newPercent = clickX / width;
                setCurrentTime(Math.floor(newPercent * videoDuration));
              }}
              className="w-full h-1.5 bg-white/20 rounded-full cursor-pointer relative overflow-hidden"
            >
              <div 
                className="h-full bg-gradient-to-r from-brand-royal to-brand-violet"
                style={{ width: `${(currentTime / videoDuration) * 100}%` }}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="p-1.5 rounded-lg hover:bg-white/10 text-white transition-colors"
                >
                  {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current" />}
                </button>

                <span className="text-xs font-semibold text-slate-300 font-mono">
                  {formatTime(currentTime)} / {formatTime(videoDuration)}
                </span>
              </div>

              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider bg-slate-950 px-2 py-0.5 rounded border border-white/5">
                {activeTopic?.title || 'Chapter Topic'}
              </span>
            </div>
          </div>
        </div>

        {/* Video Description & Header Info */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 dark:border-white/5 pb-6 text-left">
          <div>
            <span className="text-xs text-brand-violet dark:text-brand-violet-light font-bold tracking-wider uppercase">
              {activeSubject.title} • {activeChapter?.title || 'Chapter'}
            </span>
            <h2 className="text-xl font-extrabold text-slate-900 dark:text-white mt-1">
              {activeTopic?.title || 'Introductory Topic'}
            </h2>
          </div>
        </div>

        {/* Lower Workspace Tabs (Content explanation, Bookmarks, PDFs) */}
        <div className="space-y-4">
          <div className="flex border-b border-slate-200 dark:border-white/5 gap-4">
            {[
              { id: 'content', label: 'Chapter Summary', icon: BookOpen },
              { id: 'pdf', label: 'Notes & Worksheets', icon: FileText },
              { id: 'bookmarks', label: 'Bookmarks', icon: Bookmark },
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`pb-3 text-xs font-semibold flex items-center gap-1.5 border-b-2 transition-all ${
                    activeTab === tab.id
                      ? 'border-brand-royal text-brand-royal dark:text-white font-bold'
                      : 'border-transparent text-slate-550 hover:text-slate-900 dark:hover:text-slate-300'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          <div className="p-1">
            {/* Tab: Summary */}
            {activeTab === 'content' && (
              <div className="space-y-4 text-sm sm:text-base text-slate-705 dark:text-slate-300 leading-relaxed text-left font-normal">
                <p className="whitespace-pre-wrap">
                  {activeTopic ? getExtendedSummary(activeTopic.id, activeTopic.title, activeTopic.content || '') : 'Subject curriculum summary information not provided yet. Click complete topic to earn bonus coins.'}
                </p>
              </div>
            )}

            {/* Tab: PDF notes */}
            {activeTab === 'pdf' && (
              <div className="space-y-4 font-sans text-left">
                <p className="text-xs text-slate-600 dark:text-slate-400">Attached reference guide, printable hand-outs, and sample numericals.</p>
                
                {/* Modern Interactive PDF Viewer */}
                <div className="rounded-2xl border border-white/10 bg-slate-900 overflow-hidden shadow-2xl flex flex-col">
                  {/* PDF Toolbar */}
                  <div className="bg-slate-950 px-4 py-2.5 border-b border-white/10 flex flex-wrap items-center justify-between gap-3 text-slate-300 text-xs">
                    <div className="flex items-center gap-2 min-w-0">
                      <FileText className="w-4 h-4 text-red-500 flex-shrink-0" />
                      <span className="font-semibold truncate text-[11px] text-slate-200">
                        {activeTopic?.id || 'topic'}_reference_handout.pdf
                      </span>
                      <span className="text-[10px] text-slate-500 flex-shrink-0">(1.2 MB)</span>
                    </div>

                    {/* Center: Page Controls */}
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => setPdfPage(prev => Math.max(1, prev - 1))}
                        disabled={pdfPage === 1}
                        className="p-1 rounded hover:bg-white/5 disabled:opacity-40 disabled:hover:bg-transparent"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </button>
                      <span className="text-[11px] font-mono px-1">
                        Page {pdfPage} of 2
                      </span>
                      <button
                        onClick={() => setPdfPage(prev => Math.min(2, prev + 1))}
                        disabled={pdfPage === 2}
                        className="p-1 rounded hover:bg-white/5 disabled:opacity-40 disabled:hover:bg-transparent"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Right: Zoom & Utilities */}
                    <div className="flex items-center gap-2">
                      {/* Zoom */}
                      <div className="flex items-center gap-0.5 border border-white/5 rounded bg-white/5 overflow-hidden">
                        <button
                          onClick={() => setPdfZoom(prev => Math.max(50, prev - 25))}
                          className="p-1 hover:bg-white/10"
                          title="Zoom Out"
                        >
                          <ZoomOut className="w-3.5 h-3.5" />
                        </button>
                        <span className="text-[10px] font-mono px-1.5 font-bold min-w-[36px] text-center">
                          {pdfZoom}%
                        </span>
                        <button
                          onClick={() => setPdfZoom(prev => Math.min(150, prev + 25))}
                          className="p-1 hover:bg-white/10"
                          title="Zoom In"
                        >
                          <ZoomIn className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Rotate */}
                      <button
                        onClick={() => setPdfRotation(prev => (prev + 90) % 360)}
                        className="p-1.5 rounded hover:bg-white/5"
                        title="Rotate Clockwise"
                      >
                        <RotateCw className="w-3.5 h-3.5" />
                      </button>

                      {/* Search */}
                      <div className="relative hidden sm:block">
                        <input
                          type="text"
                          placeholder="Find in document..."
                          value={pdfSearch}
                          onChange={(e) => setPdfSearch(e.target.value)}
                          className="bg-white/5 border border-white/10 rounded px-2 py-0.5 text-[10px] text-white placeholder-slate-550 focus:outline-none focus:border-brand-royal w-28 pl-6"
                        />
                        <Search className="w-3 h-3 text-slate-500 absolute left-2 top-1.5" />
                      </div>

                      {/* Print */}
                      <button
                        onClick={() => {
                          window.print();
                        }}
                        className="p-1.5 rounded hover:bg-white/5"
                        title="Print Document"
                      >
                        <Printer className="w-3.5 h-3.5" />
                      </button>

                      {/* Download */}
                      <a
                        href={activeTopic?.pdfUrl || '#'}
                        download={`${activeTopic?.id}_reference_handout.pdf`}
                        className="p-1.5 rounded hover:bg-white/5 text-slate-300"
                        title="Download PDF File"
                      >
                        <Download className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </div>

                  {/* PDF Page Canvas */}
                  <div className="bg-slate-800 p-6 flex justify-center overflow-x-auto min-h-[500px]">
                    <div 
                      className="w-full max-w-[760px] bg-white text-slate-900 p-8 sm:p-12 shadow-2xl relative select-text font-serif border border-slate-200 transition-all duration-300 origin-top text-left"
                      style={{
                        transform: `scale(${pdfZoom / 100}) rotate(${pdfRotation}deg)`,
                        marginBottom: pdfZoom > 100 ? `${(pdfZoom - 100) * 4}px` : '0px'
                      }}
                    >
                      {/* Page 1 Contents */}
                      {pdfPage === 1 && (
                        <div className="space-y-6">
                          {/* Elegant Formal Header */}
                          <div className="border-b-4 border-double border-slate-800 pb-3 flex justify-between items-end">
                            <div className="flex items-center gap-3">
                              {/* Simulated University Seal Logo */}
                              <div className="w-10 h-10 rounded-full border border-slate-800 flex items-center justify-center font-sans font-bold text-xs bg-slate-100 flex-shrink-0 text-slate-850">
                                EDU
                              </div>
                              <div>
                                <h2 className="text-xs font-sans font-extrabold tracking-widest text-slate-900 leading-tight uppercase">
                                  BOARD OF SECONDARY EDUCATION
                                </h2>
                                <p className="text-[9px] font-sans font-semibold tracking-wider text-slate-500 uppercase">
                                  CURRICULUM DEV COUNCIL // CLASS XII PREPARATION
                                </p>
                              </div>
                            </div>
                            <div className="text-right font-sans text-[9px] text-slate-500">
                              <p><strong>DOC-ID:</strong> LMS-ED-1042</p>
                              <p><strong>LEVEL:</strong> ADVANCED STUDY</p>
                            </div>
                          </div>

                          {/* Document Meta Info */}
                          <div className="bg-slate-50 border border-slate-100 p-3 flex justify-between font-sans text-[10px] text-slate-600 rounded">
                            <div>
                              <strong>Subject:</strong> {activeSubject.title}
                            </div>
                            <div>
                              <strong>Board:</strong> {activeBoard.title}
                            </div>
                            <div>
                              <strong>Chapter:</strong> {activeChapter.title.replace('Chapter ', '')}
                            </div>
                          </div>

                          {/* Main Document Content */}
                          <div className="space-y-4">
                            <h1 className="text-sm font-sans font-black tracking-tight text-slate-900 text-center uppercase border-b border-slate-200 pb-2">
                              Official Reference Study Sheet
                            </h1>

                            {activeTopic?.id === 'matrices-determinants-12-t1' ? (
                              // Detailed Notes for matrices-determinants-12-t1
                              <div className="space-y-4 text-xs leading-relaxed text-slate-850 font-serif">
                                <p className="text-xs italic text-slate-600 mb-2">
                                  This document summarizes core matrices concepts for the level 12 curriculum, formatted for print references and offline learning.
                                </p>

                                <section className="space-y-2">
                                  <h3 className="text-xs font-sans font-bold text-slate-900 border-b border-slate-150 pb-1">
                                    1. Adjoint of a Square Matrix (adj A)
                                  </h3>
                                  <p>
                                    Let A = [a_ij] be a square matrix of order n. The matrix of cofactors is denoted by [A_ij]. The adjoint of matrix A is defined as the transpose of the cofactor matrix.
                                  </p>
                                  <div className="p-3 bg-slate-50 border border-slate-200 rounded font-mono text-center text-slate-700 text-[11px] my-2">
                                    {"adj(A) = [A_ij]^T = [A_ji]"}
                                  </div>
                                  <p className="font-semibold text-slate-900">Key Theorem:</p>
                                  <p>
                                    For any square matrix A of order n, it satisfies:
                                  </p>
                                  <div className="p-2 bg-slate-50 border border-slate-100 rounded text-center font-mono text-slate-700 text-[11px]">
                                    {"A * adj(A) = adj(A) * A = |A| * I_n"}
                                  </div>
                                  <p>Where I_n represents the identity matrix of order n.</p>
                                </section>

                                <section className="space-y-2 pt-2">
                                  <h3 className="text-xs font-sans font-bold text-slate-900 border-b border-slate-150 pb-1">
                                    2. Inverse of a Matrix (A⁻¹)
                                  </h3>
                                  <p>
                                    A square matrix A is invertible if and only if it is non-singular, meaning its determinant |A| ≠ 0. The inverse matrix satisfies:
                                  </p>
                                  <div className="p-3 bg-slate-50 border border-slate-200 rounded font-mono text-center text-slate-700 text-[11px] my-2">
                                    {"A * A⁻¹ = A⁻¹ * A = I_n"}
                                  </div>
                                  <p className="font-semibold text-slate-900">Computation Formula:</p>
                                  <div className="p-3 bg-slate-50 border border-slate-200 rounded font-mono text-center text-slate-700 text-[11px] my-2">
                                    {"A⁻¹ = (1 / |A|) * adj(A)"}
                                  </div>
                                  <p className="font-semibold text-slate-900">Crucial Algebraic Properties:</p>
                                  <ul className="list-disc pl-4 space-y-1 text-slate-750">
                                    <li><strong>Reversal Law:</strong> (AB)⁻¹ = B⁻¹ * A⁻¹</li>
                                    <li><strong>Transpose Property:</strong> (Aᵀ)⁻¹ = (A⁻¹)ᵀ</li>
                                    <li><strong>Determinant Property:</strong> |A⁻¹| = 1 / |A|</li>
                                  </ul>
                                </section>
                              </div>
                            ) : (
                              // Generic fallback for other topics
                              <div className="space-y-4 text-xs leading-relaxed text-slate-850 font-serif">
                                <p className="text-xs italic text-slate-600 mb-2">
                                  Official hand-out, reference materials, and summaries compiled for high-fidelity preparation.
                                </p>
                                <section className="space-y-2">
                                  <h3 className="text-xs font-sans font-bold text-slate-900 border-b border-slate-150 pb-1 uppercase">
                                    I. Curriculum Concept Analysis
                                  </h3>
                                  <p>
                                    {activeTopic?.content || 'Syllabus and chapter outlines are generated by the Board. Please refer to textbook reference guides for supplementary chapters.'}
                                  </p>
                                </section>
                                <section className="space-y-2 pt-4">
                                  <h3 className="text-xs font-sans font-bold text-slate-900 border-b border-slate-150 pb-1 uppercase">
                                    II. Core Objectives
                                  </h3>
                                  <ul className="list-disc pl-4 space-y-2 text-slate-700">
                                    <li>Develop a foundational understanding of {activeTopic?.title || 'this topic'} and its context in the curriculum.</li>
                                    <li>Examine numerical relationships, applications, and theorems supporting final boards evaluation.</li>
                                    <li>Formulate structured problem-solving tactics through step-by-step mathematical or chemical deduction.</li>
                                  </ul>
                                </section>
                              </div>
                            )}
                          </div>

                          {/* Page Footer */}
                          <div className="border-t border-slate-200 pt-3 flex justify-between items-center text-[9px] font-sans text-slate-400 mt-8">
                            <span>BOARD SEC STUDY GUIDE • REVISION HANDOUT</span>
                            <span>PAGE 1 OF 2</span>
                          </div>
                        </div>
                      )}

                      {/* Page 2 Contents */}
                      {pdfPage === 2 && (
                        <div className="space-y-6">
                          {/* Page 2 Header */}
                          <div className="border-b border-slate-200 pb-2 flex justify-between items-end">
                            <span className="font-sans font-bold text-[9px] text-slate-500 uppercase tracking-widest">
                              BOARD SEC STUDY GUIDE • WORKED EXAMPLES
                            </span>
                            <span className="font-sans text-[9px] text-slate-400">DOC-ID: LMS-ED-1042</span>
                          </div>

                          {/* Page 2 Main Content */}
                          <div className="space-y-4">
                            <h1 className="text-sm font-sans font-black tracking-tight text-slate-900 text-center uppercase border-b border-slate-200 pb-2">
                              Calculations & Numerical Exercises
                            </h1>

                            {activeTopic?.id === 'matrices-determinants-12-t1' ? (
                              // Detailed Page 2 for matrices-determinants-12-t1
                              <div className="space-y-4 text-xs leading-relaxed text-slate-850 font-serif">
                                <section className="space-y-2">
                                  <h3 className="text-xs font-sans font-bold text-slate-900 border-b border-slate-150 pb-1">
                                    3. Rank of a Matrix (ρ(A))
                                  </h3>
                                  <p>
                                    The rank of a matrix A is the order of the largest non-zero minor of A. Alternatively, it is the number of non-zero rows in the Row Echelon Form of the matrix.
                                  </p>
                                  <p className="font-semibold text-slate-900">Rank Rules & Properties:</p>
                                  <ul className="list-disc pl-4 space-y-1 text-slate-750">
                                    <li>If A is of order m x n, then ρ(A) ≤ min(m, n).</li>
                                    <li>The rank of an identity matrix I_n is n.</li>
                                    <li>The rank of a zero matrix is defined as 0.</li>
                                  </ul>
                                </section>

                                <section className="space-y-3 pt-2">
                                  <h3 className="text-xs font-sans font-bold text-slate-900 border-b border-slate-150 pb-1">
                                    Worked Numerical Example
                                  </h3>
                                  <div className="p-3 bg-slate-50 border border-slate-200 rounded font-serif text-[11px] text-slate-800 space-y-2 leading-relaxed">
                                    <p className="font-semibold font-sans text-slate-900">Example 1.1.1:</p>
                                    <p>
                                      Find the adjoint and inverse of the 2x2 matrix:
                                      <br />
                                      <strong>A = [ 2  1 ]</strong>
                                      <br />
                                      <strong>    [ 3  4 ]</strong>
                                    </p>
                                    <p className="font-sans font-bold text-[9px] uppercase tracking-wider text-slate-500 mt-2">Solution Procedure:</p>
                                    <ol className="list-decimal pl-4 space-y-1 font-serif text-slate-700">
                                      <li>
                                        <strong>Compute Determinant:</strong>
                                        <br />
                                        {"|A| = (2)(4) - (1)(3) = 8 - 3 = 5."} Since |A| ≠ 0, the inverse exists.
                                      </li>
                                      <li>
                                        <strong>Form Cofactor Matrix C:</strong>
                                        <br />
                                        {"C₁₁ = 4, C₁₂ = -3, C₂₁ = -1, C₂₂ = 2."}
                                        <br />
                                        {"C = [  4  -3 ]"}
                                        <br />
                                        {"    [ -1   2 ]"}
                                      </li>
                                      <li>
                                        <strong>Calculate Adjoint (transpose of C):</strong>
                                        <br />
                                        {"adj(A) = Cᵀ = [ 4  -1 ]"}
                                        <br />
                                        {"            [ -3  2 ]"}
                                      </li>
                                      <li>
                                        <strong>Determine Inverse A⁻¹:</strong>
                                        <br />
                                        {"A⁻¹ = (1/5) * [  4  -1 ] = [  0.8  -0.2 ]"}
                                        <br />
                                        {"             [ -3   2 ]   [ -0.6   0.4 ]"}
                                      </li>
                                    </ol>
                                  </div>
                                </section>

                                <section className="space-y-2 pt-2">
                                  <h3 className="text-xs font-sans font-bold text-slate-900 border-b border-slate-150 pb-1">
                                    Self-Evaluation Exercises
                                  </h3>
                                  <ul className="list-decimal pl-4 space-y-1.5 text-slate-750">
                                    <li>Find the rank of the matrix A = [[1, -1, 2], [2, 0, 6], [3, -1, 8]] by reducing it to Row Echelon Form.</li>
                                    <li>Prove that if matrix A is orthogonal (meaning Aᵀ = A⁻¹), then |A| = ±1.</li>
                                  </ul>
                                </section>
                              </div>
                            ) : (
                              // Generic fallback page 2
                              <div className="space-y-4 text-xs leading-relaxed text-slate-850 font-serif">
                                <section className="space-y-2">
                                  <h3 className="text-xs font-sans font-bold text-slate-900 border-b border-slate-150 pb-1">
                                    III. Sample Numerical and Problem Modeling
                                  </h3>
                                  <p>
                                    Review the lecture slides and solve the following equations to solidify your grasp on the subject matter:
                                  </p>
                                  <div className="p-3 bg-slate-50 border border-slate-200 rounded font-mono text-[10px] text-slate-700">
                                    {`Practice Set for: ${activeTopic?.title || 'Current Topic'}
1. Analyze the primary properties from the lecture video.
2. Formulate a hypothesis or solve the basic linear equations.
3. Show calculations and verify with the syllabus answers.`}
                                  </div>
                                </section>
                                <section className="space-y-2 pt-4">
                                  <h3 className="text-xs font-sans font-bold text-slate-950 border-b border-slate-150 pb-1">
                                    IV. Self Assessment Questions
                                  </h3>
                                  <ol className="list-decimal pl-4 space-y-1.5 text-slate-705">
                                    <li>Explain the core concept or mechanism described in this lesson in your own words.</li>
                                    <li>Identify three major real-world use-cases or laboratory applications for these concepts.</li>
                                  </ol>
                                </section>
                              </div>
                            )}
                          </div>

                          {/* Official Stamps / Signature Block */}
                          <div className="pt-6 flex justify-between items-center border-t border-slate-200 mt-12">
                            <div className="text-left font-sans text-[8px] text-slate-400">
                              <p>APPROVED BOARD SYLLABUS: EDITION 2026</p>
                              <p>DISTRIBUTION RESTRICTED TO ENROLLED STUDENT MEMBERS ONLY</p>
                            </div>

                            {/* Blue/Red official seal badge */}
                            <div className="border-2 border-blue-600 rounded px-2 py-1 rotate-[-3deg] text-[8px] font-sans font-bold text-blue-600 bg-blue-50/50 flex items-center gap-1 select-none">
                              <span>✓ APPROVED STUDY GUIDE</span>
                            </div>
                          </div>

                          {/* Page Footer */}
                          <div className="border-t border-slate-200 pt-3 flex justify-between items-center text-[9px] font-sans text-slate-400 mt-4">
                            <span>BOARD SEC STUDY GUIDE • WORKED EXAMPLES</span>
                            <span>PAGE 2 OF 2</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Tab: Bookmarks */}
            {activeTab === 'bookmarks' && (
              <div className="space-y-4">
                <form onSubmit={handleAddBookmarkSubmit} className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Enter short bookmark note..."
                    value={bookmarkText}
                    onChange={(e) => setBookmarkText(e.target.value)}
                    className="premium-input text-xs"
                    required
                  />
                  <button
                    type="submit"
                    className="premium-btn-primary px-4 py-2 text-xs flex items-center gap-1 flex-shrink-0"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Save {formatTime(currentTime)}</span>
                  </button>
                </form>

                <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                  {bookmarks.filter(b => b.topicId === activeTopic?.id).length === 0 ? (
                    <div className="py-8 text-center text-xs text-slate-500">
                      No bookmarks saved in this lecture.
                    </div>
                  ) : (
                    bookmarks
                      .filter(b => b.topicId === activeTopic?.id)
                      .map((bm) => (
                        <div 
                          key={bm.id} 
                          className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950/40 border border-slate-200 dark:border-white/5 flex items-center justify-between hover:border-slate-300 dark:hover:border-white/10 transition-colors"
                        >
                          <div className="text-left">
                            <span className="inline-block px-1.5 py-0.5 rounded bg-brand-royal/10 text-brand-royal text-[9px] font-mono font-bold">
                              {bm.timestamp}
                            </span>
                            <p className="text-xs font-medium text-slate-700 dark:text-slate-300 mt-1">{bm.note}</p>
                          </div>

                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => jumpToBookmarkTime(bm.timestamp)}
                              className="px-2.5 py-1 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 hover:border-brand-royal/30 text-[10px] font-semibold text-slate-700 dark:text-slate-300"
                            >
                              Jump
                            </button>
                            <button
                              onClick={() => deleteBookmark(bm.id)}
                              className="p-1 text-slate-500 hover:text-red-400"
                              title="Delete bookmark"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

      </div>

      {/* Right Column: Dynamic Course Navigation Sidebar */}
      <div className="space-y-6">
        
        {/* Subject Selection Tabs */}
        <div className="glass-card p-5 border-slate-200 dark:border-white/5 space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-150 dark:border-white/5 pb-3">
            <BookOpen className="w-4 h-4 text-brand-violet dark:text-brand-violet-light" />
            <h3 className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-widest">Select Subject</h3>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {(activeClass?.subjects || []).map((sub) => {
              const isActive = activeSubject?.id === sub.id;
              return (
                <button
                  key={sub.id}
                  onClick={() => {
                    const firstChapter = sub.chapters[0];
                    const firstTopic = firstChapter?.topics[0];
                    setActiveCourseContext(
                      sub.id,
                      firstChapter?.id || null,
                      firstTopic?.id || null
                    );
                  }}
                  className={`py-2 px-3 rounded-none border text-center transition-all duration-300 font-bold text-xs flex items-center justify-center gap-2 ${
                    isActive
                      ? 'border-brand-royal bg-brand-royal/10 text-brand-royal dark:text-blue-300 shadow-md'
                      : 'border-slate-200 dark:border-white/5 bg-slate-50 dark:bg-slate-900/40 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-900'
                  }`}
                >
                  <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${
                    sub.id.includes('chemistry') 
                      ? 'from-violet-600 to-fuchsia-700' 
                      : 'from-sky-600 to-blue-700'
                  }`} />
                  <span>{sub.title}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Curriculums Navigation Card */}
        <div className="glass-card p-5 border-slate-200 dark:border-white/5 space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-150 dark:border-white/5 pb-3">
            <BookOpen className="w-4 h-4 text-brand-royal" />
            <h3 className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-widest">Course Curriculum</h3>
          </div>

          <div className="space-y-4 overflow-y-auto max-h-[500px] pr-1">
            {activeSubject.chapters.length === 0 ? (
              <p className="text-xs text-slate-500 text-center py-4">No content exists. Create chapters inside teacher dashboard.</p>
            ) : (
              activeSubject.chapters.map((chapter) => (
                <div key={chapter.id} className="space-y-2">
                  <h4 className="text-xs font-bold text-slate-800 dark:text-slate-300 text-left px-1.5">{chapter.title}</h4>
                  <div className="space-y-1">
                    {chapter.topics.map((topic) => {
                      const isActive = activeTopic?.id === topic.id;
                      return (
                        <button
                          key={topic.id}
                          onClick={() => setActiveCourseContext(activeSubject.id, chapter.id, topic.id)}
                          className={`w-full py-2.5 px-3 rounded-none text-left text-xs transition-all border flex items-center justify-between gap-2 ${
                            isActive
                              ? 'border-brand-royal bg-brand-royal/10 text-brand-royal dark:text-blue-300 font-semibold'
                              : 'border-transparent text-slate-655 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/5'
                          }`}
                        >
                          <div className="flex items-center gap-2 truncate">
                            {topic.isCompleted ? (
                              <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                            ) : (
                              <div className="w-4 h-4 rounded-full border border-slate-400 dark:border-slate-655 flex-shrink-0" />
                            )}
                            <span className="truncate">{topic.title}</span>
                          </div>
                          <span className="text-[10px] text-slate-550 dark:text-slate-500 font-mono font-medium flex-shrink-0">{topic.duration}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>



      </div>

    </div>
  );
};
