import { useState, useEffect } from 'react';
import { useLmsStore } from './store/index';
import { academicAPI } from './services/api';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { LandingPage } from './components/LandingPage';
import { LoginPage } from './components/LoginPage';
import { SignupPage } from './components/SignupPage';
import { StudentDashboard } from './components/StudentDashboard';
import { CourseLearningPage } from './components/CourseLearningPage';
import { QuizInterface } from './components/QuizInterface';
import { AssignmentPage } from './components/AssignmentPage';
import { StudentProfile } from './components/StudentProfile';
import { TeacherDashboard } from './components/TeacherDashboard';
import { AdminPortal } from './components/AdminPortal';
import { AITutor } from './components/AITutor';

function App() {
  const { activeView, isDarkMode, setView, profile, boards } = useLmsStore();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Load academic structure from API when available
  useEffect(() => {
    academicAPI
      .getFullStructure()
      .then((boards) => {
        if (boards?.length) {
          useLmsStore.setState({ boards });
        }
      })
      .catch(() => {
        // keep demo boards when API is offline
      });
  }, []);

  // Synchronize mock IDs to database UUIDs whenever boards or profile changes
  useEffect(() => {
    if (boards?.length > 0 && profile) {
      let updated = false;
      const newProfile = { ...profile };

      // 1. Board ID mapping
      const matchedBoard = boards.find(
        (b) =>
          b.id === profile.selectedBoardId ||
          b.code?.toLowerCase() === profile.selectedBoardId?.toLowerCase()
      );
      if (matchedBoard && matchedBoard.id !== profile.selectedBoardId) {
        newProfile.selectedBoardId = matchedBoard.id;
        updated = true;
      }

      // 2. Class ID mapping
      const activeBoard = matchedBoard || boards[0];
      if (activeBoard) {
        const matchedClass = activeBoard.classes.find(
          (c) =>
            c.id === profile.selectedClassId ||
            c.title?.toLowerCase().replace(/\s+/g, '-') ===
              profile.selectedClassId?.toLowerCase().replace(/\s+/g, '-') ||
            (c.title === 'Class 12' && profile.selectedClassId === 'class-12') ||
            (c.title === 'Class 9' && profile.selectedClassId === 'class-9')
        );
        if (matchedClass && matchedClass.id !== profile.selectedClassId) {
          newProfile.selectedClassId = matchedClass.id;
          updated = true;
        }

        // 3. Subject ID mapping
        const activeClass = matchedClass || activeBoard.classes[0];
        if (activeClass) {
          const matchedSubject = activeClass.subjects.find(
            (s) =>
              s.id === profile.optedSubjectId ||
              s.title?.toLowerCase() === profile.optedSubjectId?.toLowerCase() ||
              s.title?.toLowerCase().replace(/\s+/g, '-') ===
                profile.optedSubjectId?.toLowerCase().replace(/\s+/g, '-') ||
              (s.title === 'Mathematics' && profile.optedSubjectId === 'maths-12') ||
              (s.title === 'Chemistry' && profile.optedSubjectId === 'chemistry-12') ||
              (s.title === 'Physics' && profile.optedSubjectId === 'physics-12')
          );
          if (matchedSubject && matchedSubject.id !== profile.optedSubjectId) {
            newProfile.optedSubjectId = matchedSubject.id;
            updated = true;
          }
        }
      }

      if (updated) {
        useLmsStore.setState({
          profile: newProfile,
          activeSubjectId: newProfile.optedSubjectId,
        });
      }
    }
  }, [boards, profile]);

  // Sync URL hash with the store's activeView to support browser back/forward buttons
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace(/^#\/?/, '');
      const currentActiveView = useLmsStore.getState().activeView;
      if (hash && currentActiveView !== hash) {
        setView(hash);
      } else if (!hash && currentActiveView !== 'landing') {
        setView('landing');
      }
    };

    window.addEventListener('hashchange', handleHashChange);

    // Sync on initial load
    const initialHash = window.location.hash.replace(/^#\/?/, '');
    const currentActiveView = useLmsStore.getState().activeView;
    if (initialHash && currentActiveView !== initialHash) {
      setView(initialHash);
    } else if (!initialHash) {
      window.location.hash = '/' + currentActiveView;
    }

    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, [setView]);

  // Sync window.location.hash when store state updates
  useEffect(() => {
    const currentHash = window.location.hash.replace(/^#\/?/, '');
    if (currentHash !== activeView) {
      window.location.hash = '/' + activeView;
    }
  }, [activeView]);


  // Define simple routing function based on state
  const renderActiveScreen = () => {
    switch (activeView) {
      case 'student-dash':
        return <StudentDashboard />;
      case 'course-view':
        return <CourseLearningPage />;
      case 'quiz-view':
        return <QuizInterface />;
      case 'assignment-view':
        return <AssignmentPage />;
      case 'profile-view':
        return <StudentProfile />;
      case 'teacher-dash':
        return <TeacherDashboard />;
      case 'admin-structure':
      case 'admin-analytics':
        return <AdminPortal />;
      case 'ai-tutor':
        return <AITutor />;
      default:
        return <StudentDashboard />;
    }
  };

  const isPublicPage = activeView === 'landing' || activeView === 'login' || activeView === 'signup';

  return (
    <div className={`${isDarkMode ? 'dark' : 'light'} min-h-screen bg-white dark:bg-brand-navy-dark text-slate-800 dark:text-slate-100 transition-colors duration-300`}>
      {isPublicPage ? (
        // Public pages do not require Sidebar/Header shells
        <>
          {activeView === 'landing' && <LandingPage />}
          {activeView === 'login' && <LoginPage />}
          {activeView === 'signup' && <SignupPage />}
        </>
      ) : (
        // Dashboard Shell structure
        <div className="flex min-h-screen">
          <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
          
          <div className="flex-1 flex flex-col min-h-screen max-w-full overflow-x-hidden">
            <Header onToggleSidebar={() => setIsSidebarOpen(true)} />
            
            <main className="flex-1 p-4 sm:p-6 lg:p-8">
              {renderActiveScreen()}
            </main>
          </div>
        </div>
      )}

    </div>
  );
}

export default App;
