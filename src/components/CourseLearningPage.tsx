import { HelpCircle, Trophy, AlertCircle } from 'lucide-react';
import { generateQuiz } from '../utils/quizGenerator';
import React, { useState, useRef, useEffect } from 'react';
import { useLmsStore } from '../store/index';
import type { Topic, Chapter, Subject } from '../store/types';

const getSubjectColor = (title: string) => {
  const t = title.toLowerCase();
  if (t.includes('math')) return 'from-blue-500 to-blue-700';
  if (t.includes('science') && !t.includes('social')) return 'from-purple-500 to-purple-700';
  if (t.includes('social')) return 'from-orange-500 to-orange-700';
  if (t.includes('english')) return 'from-rose-500 to-rose-700';
  if (t.includes('tamil')) return 'from-emerald-500 to-emerald-700';
  return 'from-slate-500 to-slate-700';
};
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

  const [activeTab, setActiveTab] = useState<'content' | 'pdf' | 'bookmarks' | 'quiz'>('content');
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

const [quizStage, setQuizStage] = useState<'landing'|'countdown'|'active'|'result'>('landing');
  const [countdownSeconds, setCountdownSeconds] = useState(3);
  const [currentQuizQuestions, setCurrentQuizQuestions] = useState<any[]>([]);
  const [activeQuizQuestionIndex, setActiveQuizQuestionIndex] = useState(0);
  const [userQuizAnswers, setUserQuizAnswers] = useState<Record<string, number>>({});
  const [quizTimerSeconds, setQuizTimerSeconds] = useState(600);
  const [quizResultScore, setQuizResultScore] = useState(0);

  const handleQuizSubmit = () => {
    let score = 0;
    currentQuizQuestions.forEach(q => {
      if (userQuizAnswers[q.id] === q.correctAnswerIndex) score++;
    });
    setQuizResultScore(score);
    setQuizStage('result');
  };

  useEffect(() => {
    if (activeTopic) {
      
      const questions = (activeTopic as any).quiz || generateQuiz(activeSubject?.title || 'Subject', activeChapter?.title || 'Chapter', activeTopic?.title || 'Topic');

      setCurrentQuizQuestions(questions);
      setQuizStage('landing');
      setUserQuizAnswers({});
      setActiveQuizQuestionIndex(0);
      setQuizResultScore(0);
      setQuizTimerSeconds(600);
    }
  }, [activeTopic]);

  useEffect(() => {
    let timer: any;
    if (quizStage === 'countdown' && countdownSeconds > 0) {
      timer = setTimeout(() => setCountdownSeconds(prev => prev - 1), 1000);
    } else if (quizStage === 'countdown' && countdownSeconds === 0) {
      setQuizStage('active');
    }
    return () => clearTimeout(timer);
  }, [quizStage, countdownSeconds]);

  useEffect(() => {
    let timer: any;
    if (quizStage === 'active' && quizTimerSeconds > 0) {
      timer = setInterval(() => setQuizTimerSeconds(prev => prev - 1), 1000);
    } else if (quizStage === 'active' && quizTimerSeconds === 0) {
      handleQuizSubmit();
    }
    return () => clearInterval(timer);
  }, [quizStage, quizTimerSeconds]);

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

  // ── Dynamic PDF page renderer ──────────────────────────────
  const getPdfPageContent = (page: number, topicId: string, topicTitle: string, subjectTitle: string, chapterTitle: string) => {
    const hdr = (
      <div className="border-b-4 border-double border-slate-800 pb-3 flex justify-between items-end mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full border border-slate-800 flex items-center justify-center font-sans font-bold text-xs bg-slate-100 text-slate-850">EDU</div>
          <div>
            <h2 className="text-xs font-sans font-extrabold tracking-widest text-slate-900 uppercase">Tamil Nadu State Board</h2>
            <p className="text-[9px] font-sans font-semibold tracking-wider text-slate-500 uppercase">{subjectTitle} — {chapterTitle}</p>
          </div>
        </div>
        <div className="text-right font-sans text-[9px] text-slate-500">
          <p><strong>TOPIC:</strong> {topicTitle}</p>
          <p><strong>PAGE:</strong> {page} of 8</p>
        </div>
      </div>
    );
    const ftr = (pg: number) => (
      <div className="border-t border-slate-200 pt-3 flex justify-between items-center text-[9px] font-sans text-slate-400 mt-4">
        <span>Tamil Nadu Board Study Notes</span>
        <span>Page {pg} of 8</span>
      </div>
    );
    if (page === 1) return (
      <div className="space-y-4">
        {hdr}
        <h1 className="text-sm font-sans font-black tracking-tight text-slate-900 text-center uppercase border-b border-slate-200 pb-2">Introduction &amp; Overview</h1>
        <div className="space-y-3 text-xs leading-relaxed text-slate-800">
          <p className="font-semibold">About this Topic</p>
          <p>This study guide covers <strong>{topicTitle}</strong> from the Samacheer Kalvi curriculum for {subjectTitle}. Use these 8 pages to master all concepts, worked examples, and exam strategies.</p>
          <p className="font-semibold">Learning Objectives</p>
          <ul className="list-disc pl-4 space-y-1">
            <li>Understand the fundamental principles and definitions of {topicTitle}.</li>
            <li>Apply theoretical knowledge to solve exam-level problems.</li>
            <li>Connect concepts to real-world applications and adjacent topics.</li>
            <li>Prepare confidently for board-level 1-mark, 2-mark, and 5-mark questions.</li>
          </ul>
          <p className="font-semibold">Syllabus Coverage</p>
          <p>Subject: <strong>{subjectTitle}</strong> | Chapter: <strong>{chapterTitle}</strong> | Board: Tamil Nadu State Board</p>
          <div className="bg-blue-50 border border-blue-200 rounded p-3 space-y-1 text-[10px]">
            <p className="font-bold text-blue-800">How to Use These Notes</p>
            <p>Read pages 1–8 in order. Mark key terms. Attempt practice questions on pages 6–7. Take the quiz in the "Topic Quiz" tab to self-assess.</p>
          </div>
        </div>
        {ftr(1)}
      </div>
    );
    if (page === 2) return (
      <div className="space-y-4">
        {hdr}
        <h1 className="text-sm font-sans font-black tracking-tight text-slate-900 text-center uppercase border-b border-slate-200 pb-2">Core Concepts &amp; Definitions</h1>
        <div className="space-y-3 text-xs leading-relaxed text-slate-800">
          <p className="font-semibold">Key Terminology</p>
          <table className="w-full border-collapse text-[10px]">
            <thead><tr className="bg-slate-100"><th className="border border-slate-300 px-2 py-1 text-left">Term</th><th className="border border-slate-300 px-2 py-1 text-left">Definition / Explanation</th></tr></thead>
            <tbody>
              <tr><td className="border border-slate-300 px-2 py-1 font-semibold">{topicTitle}</td><td className="border border-slate-300 px-2 py-1">A core area of study within {subjectTitle} — {chapterTitle} unit.</td></tr>
              <tr><td className="border border-slate-300 px-2 py-1 font-semibold">Concept</td><td className="border border-slate-300 px-2 py-1">An abstract idea or general notion derived from specific instances in this topic.</td></tr>
              <tr><td className="border border-slate-300 px-2 py-1 font-semibold">Application</td><td className="border border-slate-300 px-2 py-1">Practical use of theoretical knowledge to solve problems at board exam level.</td></tr>
              <tr><td className="border border-slate-300 px-2 py-1 font-semibold">Analysis</td><td className="border border-slate-300 px-2 py-1">Breaking down complex ideas into components for deeper understanding (HOTS).</td></tr>
            </tbody>
          </table>
          <p className="font-semibold">Core Principles</p>
          <ol className="list-decimal pl-4 space-y-1">
            <li>Every concept in {topicTitle} builds upon prior knowledge — ensure foundations are solid.</li>
            <li>Use logical, step-by-step approaches when solving problems.</li>
            <li>Always connect definitions to real-world examples for deeper insight.</li>
          </ol>
        </div>
        {ftr(2)}
      </div>
    );
    if (page === 3) return (
      <div className="space-y-4">
        {hdr}
        <h1 className="text-sm font-sans font-black tracking-tight text-slate-900 text-center uppercase border-b border-slate-200 pb-2">Detailed Explanation</h1>
        <div className="space-y-3 text-xs leading-relaxed text-slate-800">
          <p className="font-semibold">In-Depth Study of {topicTitle}</p>
          <p>This section breaks down the major sub-topics under <strong>{topicTitle}</strong>. Note key formulas, rules, and exceptions as you read.</p>
          <div className="bg-slate-50 border border-slate-200 rounded p-3 space-y-2">
            <p className="font-bold text-slate-800">Sub-Topic 1: Foundational Understanding</p>
            <p>Begin by reviewing the key definitions from Page 2. The foundation of {topicTitle} rests on clearly understanding the "why" behind each rule or concept.</p>
          </div>
          <div className="bg-slate-50 border border-slate-200 rounded p-3 space-y-2">
            <p className="font-bold text-slate-800">Sub-Topic 2: Procedural Knowledge</p>
            <p>Procedural understanding means knowing <em>how</em> to apply concepts. This includes step-by-step methods and systematic approaches used in {subjectTitle} examinations.</p>
          </div>
          <div className="bg-slate-50 border border-slate-200 rounded p-3 space-y-2">
            <p className="font-bold text-slate-800">Sub-Topic 3: Conceptual Connections</p>
            <p>This topic connects to broader themes within {chapterTitle}. Understanding these links helps answer application-type and HOTS questions effectively.</p>
          </div>
        </div>
        {ftr(3)}
      </div>
    );
    if (page === 4) return (
      <div className="space-y-4">
        {hdr}
        <h1 className="text-sm font-sans font-black tracking-tight text-slate-900 text-center uppercase border-b border-slate-200 pb-2">Worked Examples</h1>
        <div className="space-y-4 text-xs leading-relaxed text-slate-800">
          <div className="border border-slate-200 rounded p-3 space-y-2">
            <p className="font-bold text-slate-700">Example 1 — Easy Level</p>
            <p className="text-slate-600">Q: Define {topicTitle} and state its significance in {subjectTitle}.</p>
            <p className="font-semibold text-emerald-700 mt-1">Model Answer:</p>
            <p>{topicTitle} is a key concept under {chapterTitle} in {subjectTitle}. It can be understood through its defining characteristics, its applications, and its relationship to adjacent topics. A complete answer should include: (a) a definition, (b) an explanation, and (c) a real-world example.</p>
          </div>
          <div className="border border-slate-200 rounded p-3 space-y-2">
            <p className="font-bold text-slate-700">Example 2 — Medium Level</p>
            <p className="text-slate-600">Q: Describe the significance of {topicTitle} with reference to the broader curriculum.</p>
            <p className="font-semibold text-emerald-700 mt-1">Model Answer:</p>
            <p>The significance of {topicTitle} lies in its role within {subjectTitle}. This topic bridges theoretical knowledge and practical application. Students who master this topic can handle 2-mark and 5-mark examination questions with greater accuracy and confidence.</p>
          </div>
          <div className="border border-slate-200 rounded p-3 space-y-2">
            <p className="font-bold text-slate-700">Example 3 — Medium Level</p>
            <p className="text-slate-600">Q: Give two real-world applications of concepts from {topicTitle}.</p>
            <p className="font-semibold text-emerald-700 mt-1">Model Answer:</p>
            <p>1. Daily Life: Concepts from {topicTitle} appear in everyday situations relevant to {chapterTitle}. 2. Career/Industry: Knowledge of {subjectTitle} including {topicTitle} opens pathways to higher education and professional fields.</p>
          </div>
        </div>
        {ftr(4)}
      </div>
    );
    if (page === 5) return (
      <div className="space-y-4">
        {hdr}
        <h1 className="text-sm font-sans font-black tracking-tight text-slate-900 text-center uppercase border-b border-slate-200 pb-2">Important Points &amp; Memory Aids</h1>
        <div className="space-y-3 text-xs leading-relaxed text-slate-800">
          <p className="font-semibold">Quick Reference — Must Remember</p>
          <div className="space-y-2">
            {['Understand the core definition before attempting problems.','Learn standard notation and terminology used in the textbook.','Practice at least 3–5 examples for each sub-topic.','Pay attention to common mistakes and how to avoid them.','Review TNSB previous year questions related to this topic.'].map((pt, i) => (
              <div key={i} className="flex items-start gap-2">
                <span className="font-black text-blue-700 mt-0.5 flex-shrink-0">✓</span>
                <p>{pt}</p>
              </div>
            ))}
          </div>
          <p className="font-semibold">Common Mistakes to Avoid</p>
          <div className="bg-red-50 border border-red-200 rounded p-3 space-y-1">
            <p>❌ Skipping steps when solving problems</p>
            <p>❌ Confusing similar-looking terms or formulas</p>
            <p>❌ Not reading the question carefully before answering</p>
            <p>❌ Leaving questions unattempted in board exams</p>
          </div>
          <p className="font-semibold">Memory Tips</p>
          <p>Create acronyms or visual associations for key points in {topicTitle}. Draw mind maps connecting sub-topics. Revise at least 2–3 times before the examination.</p>
        </div>
        {ftr(5)}
      </div>
    );
    if (page === 6) return (
      <div className="space-y-4">
        {hdr}
        <h1 className="text-sm font-sans font-black tracking-tight text-slate-900 text-center uppercase border-b border-slate-200 pb-2">Practice Questions</h1>
        <div className="space-y-3 text-xs leading-relaxed text-slate-800">
          <p className="font-semibold">1-Mark Questions (Knowledge Level)</p>
          <ol className="list-decimal pl-4 space-y-1">
            <li>Define {topicTitle} in one sentence.</li>
            <li>List two key features of {topicTitle}.</li>
            <li>State any one application of concepts from {chapterTitle}.</li>
            <li>What is the significance of this topic in {subjectTitle}?</li>
          </ol>
          <p className="font-semibold">2-Mark Questions (Understanding Level)</p>
          <ol className="list-decimal pl-4 space-y-1">
            <li>Explain the concept of {topicTitle} with an example.</li>
            <li>Distinguish between two key ideas within this topic.</li>
            <li>Why is {topicTitle} important in everyday life? Give one reason.</li>
          </ol>
          <p className="font-semibold">5-Mark Questions (Application / Analysis)</p>
          <ol className="list-decimal pl-4 space-y-1">
            <li>Describe in detail the principles behind {topicTitle}. Include a diagram or worked example where applicable.</li>
            <li>Compare and contrast two approaches or theories related to {topicTitle}.</li>
            <li>How does {topicTitle} connect to the broader theme of {chapterTitle}? Explain with examples.</li>
          </ol>
        </div>
        {ftr(6)}
      </div>
    );
    if (page === 7) return (
      <div className="space-y-4">
        {hdr}
        <h1 className="text-sm font-sans font-black tracking-tight text-slate-900 text-center uppercase border-b border-slate-200 pb-2">Real-World Applications</h1>
        <div className="space-y-3 text-xs leading-relaxed text-slate-800">
          <p className="font-semibold">Connecting Theory to Reality</p>
          <p>Understanding how {topicTitle} applies in the real world deepens comprehension and enriches examination answers.</p>
          <div className="grid grid-cols-2 gap-3">
            {([
              ['Daily Life', 'Concepts from this topic appear in everyday situations — from technology to social interactions.'],
              ['Industry / Career', 'Knowledge of ' + subjectTitle + ' opens pathways to careers in education, research, and professional fields.'],
              ['Environment', 'Several principles in ' + chapterTitle + ' have direct connections to environmental science and sustainability.'],
              ['National Development', "Tamil Nadu's development across sectors is linked to the application of subjects like " + subjectTitle + '.'],
            ] as [string,string][]).map(([area, desc], i) => (
              <div key={i} className="bg-slate-50 border border-slate-200 rounded p-2 space-y-1">
                <p className="font-bold text-slate-800 text-[10px]">{area}</p>
                <p className="text-[10px] text-slate-600">{desc}</p>
              </div>
            ))}
          </div>
          <p className="font-semibold">Cross-Curricular Links</p>
          <p>This topic connects to multiple subjects. A strong understanding of {topicTitle} improves performance across {subjectTitle} and related disciplines.</p>
        </div>
        {ftr(7)}
      </div>
    );
    return (
      <div className="space-y-4">
        {hdr}
        <h1 className="text-sm font-sans font-black tracking-tight text-slate-900 text-center uppercase border-b border-slate-200 pb-2">Revision Summary &amp; Exam Tips</h1>
        <div className="space-y-3 text-xs leading-relaxed text-slate-800">
          <p className="font-semibold">Summary of Key Points</p>
          <div className="bg-blue-50 border border-blue-200 rounded p-3 space-y-1">
            <p>📌 {topicTitle} is a crucial part of the {chapterTitle} unit in {subjectTitle}.</p>
            <p>📌 Master definitions, formulas, and worked examples from Pages 2–4.</p>
            <p>📌 Practice all question types: 1-mark, 2-mark, and 5-mark.</p>
            <p>📌 Revise common mistakes from Page 5 before the exam.</p>
            <p>📌 Take the "Topic Quiz" tab to self-assess your preparation.</p>
          </div>
          <p className="font-semibold">Board Exam Strategy</p>
          <ol className="list-decimal pl-4 space-y-1">
            <li>Read every question fully before writing your answer.</li>
            <li>For 5-mark questions: intro + detailed body + clear conclusion.</li>
            <li>Show all working steps in Mathematics and Science problems.</li>
            <li>Use diagrams and maps wherever relevant (Geography, History).</li>
            <li>Manage your time: allocate per question based on marks.</li>
            <li>Review your answers in the last 10 minutes if time allows.</li>
          </ol>
          <div className="bg-emerald-50 border border-emerald-200 rounded p-3 mt-2 text-center">
            <p className="font-black text-emerald-800">You have completed all 8 pages! 🎉</p>
            <p className="text-emerald-700 mt-1">Now go to the <strong>Topic Quiz</strong> tab to test your understanding of {topicTitle}.</p>
          </div>
        </div>
        {ftr(8)}
      </div>
    );
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
              { id: 'quiz', label: 'Topic Quiz', icon: HelpCircle },
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
                        disabled={pdfPage === 8}
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
                      {/* Dynamic PDF Content - 8 pages */}
                      {getPdfPageContent(pdfPage, activeTopic?.id || '', activeTopic?.title || 'Topic', activeSubject.title, activeChapter?.title || 'Chapter')}
                    </div>
                  </div>
                </div>
              </div>
            )}
            {/* Tab: Quiz Center */}
            {activeTab === 'quiz' && (
              <div className="space-y-4">
                {/* Landing */}
                {quizStage === 'landing' && (
                  <div className="flex flex-col items-center text-center space-y-6 py-8 px-4">
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-brand-royal to-brand-violet flex items-center justify-center shadow-2xl">
                      <HelpCircle className="w-10 h-10 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">Topic Assessment</h3>
                      <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{activeTopic?.title || 'Current Topic'}</p>
                    </div>
                    <div className="grid grid-cols-3 gap-4 w-full max-w-sm">
                      {[['10','Questions','text-brand-royal dark:text-blue-300'],['10','Minutes','text-emerald-600 dark:text-emerald-300'],['MCQ','Format','text-amber-600 dark:text-amber-300']].map(([val,lbl,cls],i) => (
                        <div key={i} className="bg-slate-50 dark:bg-slate-900/50 rounded-xl p-3 border border-slate-200 dark:border-white/5 text-center">
                          <p className={"text-xl font-black " + cls}>{val}</p>
                          <p className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider mt-0.5">{lbl}</p>
                        </div>
                      ))}
                    </div>
                    <div className="bg-slate-50 dark:bg-slate-900/40 rounded-xl p-4 border border-slate-200 dark:border-white/5 text-left w-full max-w-sm space-y-2">
                      <p className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Instructions</p>
                      <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-1.5">
                        <li>• 10 questions (4 Easy, 4 Medium, 2 Hard)</li>
                        <li>• Timer: 10 minutes — auto-submits on timeout</li>
                        <li>• Select one option per question</li>
                        <li>• Results with explanations shown after</li>
                      </ul>
                    </div>
                    <button onClick={() => { setQuizStage('countdown'); setCountdownSeconds(3); }}
                      className="premium-btn-primary px-8 py-3 text-sm font-bold flex items-center gap-2 rounded-xl">
                      <Play className="w-4 h-4 fill-current" /> Start Quiz
                    </button>
                  </div>
                )}
                {/* Countdown */}
                {quizStage === 'countdown' && (
                  <div className="flex flex-col items-center justify-center py-16 space-y-4">
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest">Get Ready!</p>
                    <div className="w-28 h-28 rounded-full border-4 border-brand-royal/30 flex items-center justify-center bg-brand-royal/5">
                      <span className="text-6xl font-black text-brand-royal dark:text-blue-300">{countdownSeconds > 0 ? countdownSeconds : 'GO!'}</span>
                    </div>
                    <p className="text-sm text-slate-500 dark:text-slate-400">{countdownSeconds > 0 ? 'Starting in ' + countdownSeconds + '...' : 'Starting now!'}</p>
                  </div>
                )}
                {/* Active Quiz */}
                {quizStage === 'active' && currentQuizQuestions.length > 0 && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-white/5 rounded-xl p-3">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Q {activeQuizQuestionIndex + 1} / {currentQuizQuestions.length}</span>
                        <span className={'text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ' + (currentQuizQuestions[activeQuizQuestionIndex]?.difficulty === 'Easy' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300' : currentQuizQuestions[activeQuizQuestionIndex]?.difficulty === 'Medium' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300' : 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300')}>
                          {currentQuizQuestions[activeQuizQuestionIndex]?.difficulty}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-rose-600 dark:text-rose-400">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{Math.floor(quizTimerSeconds / 60).toString().padStart(2,'0')}:{(quizTimerSeconds % 60).toString().padStart(2,'0')}</span>
                      </div>
                    </div>
                    <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-brand-royal to-brand-violet transition-all duration-500" style={{ width: ((activeQuizQuestionIndex / currentQuizQuestions.length) * 100) + '%' }} />
                    </div>
                    <div className="bg-white dark:bg-slate-950/50 border border-slate-200 dark:border-white/8 rounded-xl p-4 space-y-3 text-left">
                      <p className="text-sm font-semibold text-slate-900 dark:text-white leading-relaxed">{currentQuizQuestions[activeQuizQuestionIndex]?.question}</p>
                      <div className="space-y-2 pt-1">
                        {currentQuizQuestions[activeQuizQuestionIndex]?.options.map((opt: string, idx: number) => {
                          const q = currentQuizQuestions[activeQuizQuestionIndex];
                          const isSel = userQuizAnswers[q.id] === idx;
                          return (
                            <button key={idx} onClick={() => setUserQuizAnswers(prev => ({ ...prev, [q.id]: idx }))}
                              className={'w-full text-left px-3 py-2.5 rounded-lg border text-xs font-medium transition-all duration-200 ' + (isSel ? 'border-brand-royal bg-brand-royal/10 text-brand-royal dark:text-blue-300 font-bold' : 'border-slate-200 dark:border-white/5 text-slate-700 dark:text-slate-300 hover:border-brand-royal/30 hover:bg-slate-50 dark:hover:bg-white/5')}>
                              <span className="font-bold mr-2">{String.fromCharCode(65 + idx)}.</span>{opt}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                    <div className="flex items-center justify-between gap-2">
                      <button onClick={() => setActiveQuizQuestionIndex(prev => Math.max(0, prev - 1))} disabled={activeQuizQuestionIndex === 0}
                        className="px-3 py-2 text-xs font-semibold border border-slate-200 dark:border-white/5 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-50 disabled:opacity-40 flex items-center gap-1">
                        <ChevronLeft className="w-3.5 h-3.5" /> Prev
                      </button>
                      {activeQuizQuestionIndex < currentQuizQuestions.length - 1 ? (
                        <button onClick={() => setActiveQuizQuestionIndex(prev => Math.min(currentQuizQuestions.length - 1, prev + 1))}
                          className="px-3 py-2 text-xs font-semibold border border-brand-royal/30 bg-brand-royal/10 rounded-lg text-brand-royal dark:text-blue-300 hover:bg-brand-royal/20 flex items-center gap-1">
                          Next <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      ) : (
                        <button onClick={handleQuizSubmit} className="premium-btn-primary px-4 py-2 text-xs font-bold flex items-center gap-1 rounded-lg">
                          <CheckCircle className="w-3.5 h-3.5" /> Submit
                        </button>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-1.5 pt-1 justify-center">
                      {currentQuizQuestions.map((q, idx) => (
                        <button key={q.id} onClick={() => setActiveQuizQuestionIndex(idx)}
                          className={'w-7 h-7 rounded-full text-[10px] font-bold border transition-all ' + (idx === activeQuizQuestionIndex ? 'bg-brand-royal text-white border-brand-royal scale-110 shadow-md' : userQuizAnswers[q.id] !== undefined ? 'bg-emerald-500/20 text-emerald-700 border-emerald-500/30' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 border-slate-200 dark:border-white/5')}>
                          {idx + 1}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                {/* Result */}
                {quizStage === 'result' && (
                  <div className="space-y-4">
                    <div className="flex flex-col items-center text-center py-6 space-y-4">
                      <div className={'w-20 h-20 rounded-full flex items-center justify-center shadow-2xl ' + (quizResultScore >= 8 ? 'bg-gradient-to-br from-emerald-500 to-teal-600' : quizResultScore >= 6 ? 'bg-gradient-to-br from-amber-500 to-orange-600' : 'bg-gradient-to-br from-rose-500 to-red-600')}>
                        {quizResultScore >= 6 ? <Trophy className="w-10 h-10 text-white" /> : <AlertCircle className="w-10 h-10 text-white" />}
                      </div>
                      <div>
                        <h3 className="text-2xl font-black text-slate-900 dark:text-white">{quizResultScore} / 10</h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{quizResultScore >= 8 ? '🎉 Excellent!' : quizResultScore >= 6 ? '✅ Good job!' : '📚 Needs revision.'}</p>
                      </div>
                      <div className="grid grid-cols-3 gap-3 w-full max-w-xs">
                        <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-xl p-2.5 border border-emerald-200 dark:border-emerald-500/20 text-center">
                          <p className="text-base font-black text-emerald-700 dark:text-emerald-300">{quizResultScore}</p>
                          <p className="text-[10px] text-slate-500 font-semibold">Correct</p>
                        </div>
                        <div className="bg-rose-50 dark:bg-rose-900/20 rounded-xl p-2.5 border border-rose-200 dark:border-rose-500/20 text-center">
                          <p className="text-base font-black text-rose-700 dark:text-rose-300">{10 - quizResultScore}</p>
                          <p className="text-[10px] text-slate-500 font-semibold">Wrong</p>
                        </div>
                        <div className="bg-slate-50 dark:bg-slate-900/50 rounded-xl p-2.5 border border-slate-200 dark:border-white/5 text-center">
                          <p className="text-base font-black text-slate-800 dark:text-slate-200">{Math.round((quizResultScore / 10) * 100)}%</p>
                          <p className="text-[10px] text-slate-500 font-semibold">Score</p>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
                      {currentQuizQuestions.map((q, idx) => {
                        const ua = userQuizAnswers[q.id];
                        const ok = ua === q.correctAnswerIndex;
                        return (
                          <div key={q.id} className={'rounded-xl p-3.5 border text-left space-y-2 ' + (ok ? 'bg-emerald-50 dark:bg-emerald-900/10 border-emerald-200 dark:border-emerald-500/20' : 'bg-rose-50 dark:bg-rose-900/10 border-rose-200 dark:border-rose-500/20')}>
                            <div className="flex items-start gap-2">
                              {ok ? <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" /> : <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />}
                              <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">{idx + 1}. {q.question}</p>
                            </div>
                            {!ok && (
                              <div className="pl-6 space-y-1 text-[11px]">
                                <p className="text-rose-600 dark:text-rose-400">Your answer: {ua !== undefined ? q.options[ua] : 'Not answered'}</p>
                                <p className="text-emerald-700 dark:text-emerald-400 font-semibold">Correct: {q.options[q.correctAnswerIndex]}</p>
                                <p className="text-slate-600 dark:text-slate-400 italic">{q.explanation}</p>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                    <button onClick={() => { setQuizStage('landing'); setUserQuizAnswers({}); setActiveQuizQuestionIndex(0); setQuizResultScore(0); }}
                      className="w-full premium-btn-primary py-2.5 text-xs font-bold flex items-center justify-center gap-2 rounded-xl">
                      <ArrowRight className="w-4 h-4" /> Try Again
                    </button>
                  </div>
                )}
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
                    <span>Save Note</span>
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
                  <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${getSubjectColor(sub.title)}`} />
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
