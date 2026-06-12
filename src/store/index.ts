import { create } from 'zustand';
import type { LMSStore, User, Board, Class, Subject, Topic, AuthState } from './types';

export const useLmsStore = create<LMSStore>((set) => ({
  // ========================================
  // AUTH STATE
  // ========================================
  auth: {
    isAuthenticated: false,
    user: null,
    token: localStorage.getItem('auth_token') || null,
    loading: false,
    error: null,
  },

  setAuth: (authUpdate: Partial<AuthState>) =>
    set((state) => ({
      auth: { ...state.auth, ...authUpdate },
    })),

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

  // ========================================
  // NAVIGATION
  // ========================================
  activeView: 'landing',
  setView: (view: string) => set({ activeView: view }),

  // ========================================
  // THEME
  // ========================================
  isDarkMode: localStorage.getItem('darkMode') === 'true' || false,
  toggleDarkMode: () =>
    set((state) => {
      const newDarkMode = !state.isDarkMode;
      localStorage.setItem('darkMode', String(newDarkMode));
      return { isDarkMode: newDarkMode };
    }),

  // ========================================
  // ACADEMIC SELECTION
  // ========================================
  selectedBoard: null,
  selectedClass: null,
  selectedSubject: null,

  setSelectedBoard: (board: Board) => set({ selectedBoard: board }),
  setSelectedClass: (classLevel: Class) => set({ selectedClass: classLevel }),
  setSelectedSubject: (subject: Subject) => set({ selectedSubject: subject }),

  // ========================================
  // CONTENT STATE
  // ========================================
  currentTopic: null,
  setCurrentTopic: (topic: Topic) => set({ currentTopic: topic }),

  // ========================================
  // NOTIFICATIONS & UI
  // ========================================
  notificationCount: 0,
  unreadMessages: 0,

  increaseNotificationCount: () =>
    set((state) => ({
      notificationCount: state.notificationCount + 1,
    })),

  decreaseNotificationCount: () =>
    set((state) => ({
      notificationCount: Math.max(0, state.notificationCount - 1),
    })),
}));

// ========================================
// PERSIST & EXPORTS
// ========================================
export type { LMSStore } from './types';
