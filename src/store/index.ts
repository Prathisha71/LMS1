import { create } from 'zustand';
import type {
  LMSStore,
  Board,
  ClassLevel,
  Subject,
  Topic,
  AuthState,
  Profile,
  Notification,
  Assignment,
  Quiz,
  QuizResult,
  Bookmark,
} from './types';

const makeId = (prefix: string) => `${prefix}-${Math.random().toString(36).slice(2, 8)}-${Date.now()}`;

const defaultProfile: Profile = {
  id: 'student-001',
  name: 'Prathamesh Sharma',
  username: 'prathamesh',
  password: '1234',
  email: 'prathamesh@eduverse.in',
  role: 'student',
  selectedBoardId: 'tnsb',
  selectedClassId: 'class-12',
  optedSubjectId: 'maths-12',
  age: '17',
  location: 'Chennai',
  xp: 2100,
  level: 7,
  coins: 84,
  streak: 9,
  achievements: [
    {
      id: 'ach-1',
      title: 'Fresh Scholar',
      description: 'Created an EduVerse account',
      icon: '🌱',
      unlockedAt: new Date().toLocaleDateString('en-IN'),
    },
  ],
  certificates: [],
};

const defaultBoards: Board[] = [
  {
    id: 'tnsb',
    title: 'Tamil Nadu State Board',
    classes: [
      {
        id: 'class-12',
        title: 'Class 12',
        subjects: [
          {
            id: 'maths-12',
            title: 'Mathematics',
            color: 'from-indigo-600 to-violet-700',
            imageUrl: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=800&q=80',
            chapters: [
              {
                id: 'matrices-determinants-12',
                title: 'Matrices & Determinants',
                imageUrl: 'https://images.unsplash.com/photo-1517142089942-ba376ce32a2e?auto=format&fit=crop&w=800&q=80',
                topics: [
                  {
                    id: 'matrices-determinants-12-t1',
                    title: 'Matrices: Definitions & Operations',
                    content: 'Understanding matrix addition, subtraction, multiplication, and inverse operations with example problems.',
                    duration: '18 mins',
                    pdfUrl: 'https://example.com/matrices.pdf',
                    isCompleted: false,
                  },
                  {
                    id: 'matrices-determinants-12-t2',
                    title: 'Determinants & Inverse Matrices',
                    content: 'Compute determinants for square matrices and use adjoint formulas to solve linear systems.',
                    duration: '22 mins',
                    pdfUrl: 'https://example.com/determinants.pdf',
                    isCompleted: false,
                  },
                ],
              },
              {
                id: 'complex-numbers-12',
                title: 'Complex Numbers',
                imageUrl: 'https://images.unsplash.com/photo-1523475496153-3d6ccf402b45?auto=format&fit=crop&w=800&q=80',
                topics: [
                  {
                    id: 'complex-numbers-12-t1',
                    title: 'Complex Number Basics',
                    content: 'Learn the algebraic and geometric interpretation of complex numbers in polar and rectangular form.',
                    duration: '16 mins',
                    isCompleted: false,
                  },
                  {
                    id: 'complex-numbers-12-t2',
                    title: 'de Moivre’s Theorem and Roots',
                    content: 'Apply de Moivre’s theorem and find nth roots of complex numbers using the Argand plane.',
                    duration: '20 mins',
                    isCompleted: false,
                  },
                ],
              },
            ],
          },
          {
            id: 'chemistry-12',
            title: 'Chemistry',
            color: 'from-fuchsia-600 to-pink-700',
            imageUrl: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=800&q=80',
            chapters: [
              {
                id: 'metallurgy-12',
                title: 'Metallurgy',
                imageUrl: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=800&q=80',
                topics: [
                  {
                    id: 'chemistry-12-c1-t1',
                    title: 'Metals, Alloys and Corrosion',
                    content: 'Study the extraction, properties and corrosion behaviour of metals and alloys.',
                    duration: '24 mins',
                    isCompleted: false,
                  },
                  {
                    id: 'chemistry-12-c1-t2',
                    title: 'Processes in Metallurgy',
                    content: 'Understand roasting, reduction, refining, and electrorefining of metallic ores.',
                    duration: '22 mins',
                    isCompleted: false,
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        id: 'class-9',
        title: 'Class 9',
        subjects: [
          {
            id: 'chemistry-9',
            title: 'Chemistry',
            color: 'from-cyan-600 to-sky-700',
            imageUrl: 'https://images.unsplash.com/photo-1529257414776-1968f4c125f8?auto=format&fit=crop&w=800&q=80',
            chapters: [
              {
                id: 'chemistry-9-c1',
                title: 'Matter Classification',
                imageUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80',
                topics: [
                  {
                    id: 'chemistry-9-c1-t1',
                    title: 'Elements, Compounds and Mixtures',
                    content: 'Identify and classify matter using examples from everyday chemistry experiments.',
                    duration: '18 mins',
                    isCompleted: false,
                  },
                  {
                    id: 'chemistry-9-c1-t2',
                    title: 'Separation Techniques',
                    content: 'Learn filtration, distillation, chromatography and their practical applications.',
                    duration: '20 mins',
                    isCompleted: false,
                  },
                ],
              },
              {
                id: 'chemistry-9-c2',
                title: 'Atoms and Molecules',
                imageUrl: 'https://images.unsplash.com/photo-1483721310020-03333e577078?auto=format&fit=crop&w=800&q=80',
                topics: [
                  {
                    id: 'chemistry-9-c2-t1',
                    title: 'Atomic Structure',
                    content: 'Discover protons, neutrons, electrons and their role in atomic models.',
                    duration: '22 mins',
                    isCompleted: false,
                  },
                  {
                    id: 'chemistry-9-c2-t2',
                    title: 'Isotopes, Isobars and Valency',
                    content: 'Classify isotopes, isobars and calculate atomic valency for common elements.',
                    duration: '20 mins',
                    isCompleted: false,
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
];

const defaultAssignments: Assignment[] = [
  {
    id: 'assign-1',
    title: 'Matrix Inverse Practice',
    description: 'Solve the matrix inverse problems and explain the application of adjoint method.',
    subjectId: 'maths-12',
    subjectTitle: 'Mathematics',
    deadline: '11 July 2026',
    points: 50,
    status: 'Pending',
  },
  {
    id: 'assign-2',
    title: 'Metallurgy Reaction Chart',
    description: 'Prepare a chart of important metallurgy reactions and their industrial uses.',
    subjectId: 'chemistry-12',
    subjectTitle: 'Chemistry',
    deadline: '14 July 2026',
    points: 40,
    status: 'Submitted',
    submissionFile: 'metallurgy_chart.pdf',
  },
];

const defaultQuizzes: Quiz[] = [
  {
    id: 'quiz-1',
    title: 'Matrices & Determinants',
    subjectId: 'maths-12',
    chapterId: 'matrices-determinants-12',
    durationMinutes: 15,
    questions: [
      {
        id: 'q1',
        question: 'What is the determinant of the matrix [[2,1],[3,4]]?',
        options: ['5', '2', '5', '11'],
        correctAnswerIndex: 0,
        explanation: 'det = 2*4 - 3*1 = 5.',
      },
      {
        id: 'q2',
        question: 'If A is invertible, what is true about det(A)?',
        options: ['0', '1', 'Non-zero', 'Negative'],
        correctAnswerIndex: 2,
        explanation: 'Invertible matrices must have a non-zero determinant.',
      },
      {
        id: 'q3',
        question: 'Which operation yields the identity matrix?',
        options: ['A + A', 'A * A^-1', 'A - I', 'A / A'],
        correctAnswerIndex: 1,
        explanation: 'Multiplying A by its inverse gives the identity matrix.',
      },
    ],
  },
  {
    id: 'quiz-2',
    title: 'Metallurgy Fundamentals',
    subjectId: 'chemistry-12',
    chapterId: 'metallurgy-12',
    durationMinutes: 12,
    questions: [
      {
        id: 'q4',
        question: 'Which process removes oxygen from ores?',
        options: ['Oxidation', 'Roasting', 'Reduction', 'Electrolysis'],
        correctAnswerIndex: 2,
        explanation: 'Reduction removes oxygen from the ore to obtain the metal.',
      },
      {
        id: 'q5',
        question: 'Which metal is refined by electrolysis?',
        options: ['Iron', 'Aluminium', 'Copper', 'Gold'],
        correctAnswerIndex: 1,
        explanation: 'Aluminium is refined by electrolysis in the Hall-Héroult process.',
      },
    ],
  },
];

const defaultNotifications: Notification[] = [
  {
    id: makeId('notif'),
    title: 'Welcome!',
    message: 'Your EduVerse workspace is ready. Explore lessons, quizzes and assignments.',
    type: 'info',
    read: false,
    time: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
  },
];

export const useLmsStore = create<LMSStore>((set) => ({
  auth: {
    isAuthenticated: false,
    user: null,
    token: localStorage.getItem('auth_token') || null,
    loading: false,
    error: null,
  },

  setAuth: (authUpdate: Partial<AuthState>) =>
    set((state) => ({ auth: { ...state.auth, ...authUpdate } })),

  logout: () => {
    localStorage.removeItem('auth_token');
    set({
      auth: {
        isAuthenticated: false,
        user: null,
        token: null,
        loading: false,
        error: null,
      },
    });
  },

  activeView: 'landing',
  setView: (view: string) => set({ activeView: view }),

  isDarkMode: localStorage.getItem('darkMode') === 'true',
  toggleDarkMode: () =>
    set((state) => {
      const newDarkMode = !state.isDarkMode;
      localStorage.setItem('darkMode', String(newDarkMode));
      return { isDarkMode: newDarkMode };
    }),
  setTheme: (value: boolean) => {
    localStorage.setItem('darkMode', String(value));
    set({ isDarkMode: value });
  },

  selectedBoard: null,
  selectedClass: null,
  selectedSubject: null,
  setSelectedBoard: (board: Board) => set({ selectedBoard: board }),
  setSelectedClass: (classLevel: ClassLevel) => set({ selectedClass: classLevel }),
  setSelectedSubject: (subject: Subject) => set({ selectedSubject: subject }),

  currentTopic: null,
  setCurrentTopic: (topic: Topic) => set({ currentTopic: topic }),

  profile: defaultProfile,
  boards: defaultBoards,
  assignments: defaultAssignments,
  quizzes: defaultQuizzes,
  activeQuizId: null,
  quizResults: [],
  notifications: defaultNotifications,
  bookmarks: [],
  activeSubjectId: defaultProfile.optedSubjectId,
  activeChapterId: defaultBoards[0].classes[0].subjects[0].chapters[0].id,
  activeTopicId: defaultBoards[0].classes[0].subjects[0].chapters[0].topics[0].id,

  submitAssignment: (assignmentId, submissionFile) =>
    set((state) => ({
      assignments: state.assignments.map((assignment) =>
        assignment.id === assignmentId
          ? { ...assignment, submissionFile, status: 'Submitted' }
          : assignment
      ),
    })),

  gradeAssignment: (assignmentId, grade, feedback) =>
    set((state) => ({
      assignments: state.assignments.map((assignment) =>
        assignment.id === assignmentId
          ? { ...assignment, status: 'Graded', grade, feedback }
          : assignment
      ),
    })),

  setActiveQuiz: (quizId) => set({ activeQuizId: quizId }),

  submitQuizResult: (result) =>
    set((state) => ({ quizResults: [...state.quizResults, result] })),

  addNotification: (title, message, type) =>
    set((state) => ({
      notifications: [
        {
          id: makeId('notif'),
          title,
          message,
          type,
          read: false,
          time: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
        },
        ...state.notifications,
      ],
    })),

  readAllNotifications: () =>
    set((state) => ({
      notifications: state.notifications.map((notification) => ({ ...notification, read: true })),
    })),

  addBookmark: (bookmark, timestamp) =>
    set((state) => ({
      bookmarks: [
        {
          id: makeId('bookmark'),
          timestamp,
          ...bookmark,
        },
        ...state.bookmarks,
      ],
    })),

  deleteBookmark: (bookmarkId) =>
    set((state) => ({
      bookmarks: state.bookmarks.filter((bookmark) => bookmark.id !== bookmarkId),
    })),

  setActiveCourseContext: (subjectId, chapterId, topicId) =>
    set((state) => ({
      activeSubjectId: subjectId || state.activeSubjectId,
      activeChapterId: chapterId || state.activeChapterId,
      activeTopicId: topicId || state.activeTopicId,
    })),

  completeTopic: (boardId, classId, subjectId, chapterId, topicId) =>
    set((state) => ({
      boards: state.boards.map((board) =>
        board.id !== boardId
          ? board
          : {
              ...board,
              classes: board.classes.map((classLevel) =>
                classLevel.id !== classId
                  ? classLevel
                  : {
                      ...classLevel,
                      subjects: classLevel.subjects.map((subject) =>
                        subject.id !== subjectId
                          ? subject
                          : {
                              ...subject,
                              chapters: subject.chapters.map((chapter) =>
                                chapter.id !== chapterId
                                  ? chapter
                                  : {
                                      ...chapter,
                                      topics: chapter.topics.map((topic) =>
                                        topic.id !== topicId
                                          ? topic
                                          : { ...topic, isCompleted: true }
                                      ),
                                    }
                              ),
                            }
                      ),
                    }
              ),
            }
      ),
      profile: {
        ...state.profile,
        xp: state.profile.xp + 50,
        coins: state.profile.coins + 10,
        streak: state.profile.streak + 1,
      },
    })),

  addBoard: (title) =>
    set((state) => ({
      boards: [
        ...state.boards,
        {
          id: makeId('board'),
          title,
          classes: [],
        },
      ],
    })),

  addClass: (boardId, classTitle) =>
    set((state) => ({
      boards: state.boards.map((board) =>
        board.id !== boardId
          ? board
          : {
              ...board,
              classes: [
                ...board.classes,
                {
                  id: makeId('class'),
                  title: classTitle,
                  subjects: [],
                },
              ],
            }
      ),
    })),

  addSubject: (boardId, classId, subjectTitle, subjectColor) =>
    set((state) => ({
      boards: state.boards.map((board) =>
        board.id !== boardId
          ? board
          : {
              ...board,
              classes: board.classes.map((classLevel) =>
                classLevel.id !== classId
                  ? classLevel
                  : {
                      ...classLevel,
                      subjects: [
                        ...classLevel.subjects,
                        {
                          id: makeId('subject'),
                          title: subjectTitle,
                          color: subjectColor,
                          imageUrl: undefined,
                          chapters: [],
                        },
                      ],
                    }
              ),
            }
      ),
    })),
}));

export type { LMSStore } from './types';
