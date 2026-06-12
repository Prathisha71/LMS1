// ========================================
// DATABASE-ALIGNED TYPES
// ========================================

export type UserRole = 'ADMIN' | 'TEACHER' | 'STUDENT';

export type QuestionType = 'MCQ' | 'MSQ' | 'TF' | 'COMPREHENSION';

export type SubmissionStatus = 'SUBMITTED' | 'GRADED' | 'REJECTED';

export type SubscriptionStatus = 'ACTIVE' | 'EXPIRED' | 'CANCELLED' | 'PENDING';

// User & Auth
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
}

// Academic Hierarchy
export interface Board {
  id: string;
  name: string;
  code: string;
}

export interface Class {
  id: string;
  name: string;
  boardId: string;
  sortOrder: number;
}

export interface Subject {
  id: string;
  name: string;
  code: string;
  classId: string;
  sortOrder: number;
}

export interface Unit {
  id: string;
  name: string;
  subjectId: string;
  sortOrder: number;
}

export interface Chapter {
  id: string;
  name: string;
  unitId: string;
  sortOrder: number;
}

export interface Topic {
  id: string;
  name: string;
  chapterId: string;
  sortOrder: number;
  requireWatchPercent?: number;
  requireQuizPass?: boolean;
  requireAssignSubmit?: boolean;
  requireNotesViewed?: boolean;
}

// Course Content
export interface CourseVideo {
  id: string;
  title: string;
  videoUrl: string;
  duration: number;
  topicId: string;
  sortOrder: number;
}

export interface CourseNote {
  id: string;
  title: string;
  fileUrl: string;
  topicId: string;
  sortOrder: number;
}

export interface CourseResource {
  id: string;
  title: string;
  fileUrl: string;
  fileType: string;
  topicId: string;
  sortOrder: number;
}

// Quiz & Assessment
export interface QuizQuestion {
  id: string;
  quizId: string;
  questionText: string;
  questionType: QuestionType;
  marks: number;
  sortOrder: number;
  options?: QuizOption[];
}

export interface QuizOption {
  id: string;
  questionId: string;
  optionText: string;
  isCorrect: boolean;
  sortOrder: number;
}

export interface Quiz {
  id: string;
  title: string;
  topicId: string;
  passingScore: number;
  maxAttempts: number;
  timeLimitMinutes: number;
  questions?: QuizQuestion[];
}

export interface QuizAttempt {
  id: string;
  studentId: string;
  quizId: string;
  attemptNumber: number;
  score: number;
  passed: boolean;
  startedAt: Date;
  completedAt?: Date;
}

export interface QuizResult {
  id: string;
  attemptId: string;
  studentId: string;
  quizId: string;
  score: number;
  percentage: number;
  passed: boolean;
  feedback?: string;
}

// Assignments
export interface Assignment {
  id: string;
  title: string;
  description: string;
  topicId: string;
  maxMarks: number;
  passingMarks: number;
  deadline?: Date;
}

export interface AssignmentSubmission {
  id: string;
  assignmentId: string;
  studentId: string;
  submissionUrl: string;
  status: SubmissionStatus;
  submittedAt: Date;
}

export interface AssignmentFeedback {
  id: string;
  submissionId: string;
  teacherId: string;
  marksObtained: number;
  passed: boolean;
  comment?: string;
}

// Student Progress
export interface StudentTopicProgress {
  id: string;
  studentId: string;
  topicId: string;
  isCompleted: boolean;
  watchPercent: number;
  quizCompleted: boolean;
  assignmentCompleted: boolean;
  notesViewed: boolean;
}

export interface StudentAnalytics {
  id: string;
  studentId: string;
  totalStudyTimeMinutes: number;
  averageQuizScore: number;
  overallCompletionRate: number;
  xp: number;
}

// Store State
export interface LMSStore {
  // Auth
  auth: AuthState;
  setAuth: (auth: Partial<AuthState>) => void;
  logout: () => void;

  // Navigation
  activeView: string;
  setView: (view: string) => void;

  // Theme
  isDarkMode: boolean;
  toggleDarkMode: () => void;

  // Academic Selection
  selectedBoard: Board | null;
  selectedClass: Class | null;
  selectedSubject: Subject | null;
  setSelectedBoard: (board: Board) => void;
  setSelectedClass: (classLevel: Class) => void;
  setSelectedSubject: (subject: Subject) => void;

  // Content
  currentTopic: Topic | null;
  setCurrentTopic: (topic: Topic) => void;

  // UI State
  notificationCount: number;
  unreadMessages: number;
  increaseNotificationCount: () => void;
  decreaseNotificationCount: () => void;
}
