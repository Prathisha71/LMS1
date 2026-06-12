import { useState } from 'react';
import { useLmsStore } from './store/index';
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

import { useEffect } from 'react';

function App() {
  const { activeView, isDarkMode, setView } = useLmsStore();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

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
      default:
        return <StudentDashboard />;
    }
  };

  const isPublicPage = activeView === 'landing' || activeView === 'login' || activeView === 'signup';

  return (
    <div className={`${isDarkMode ? 'dark' : 'light'} min-h-screen bg-white dark:bg-brand-navy-dark transition-colors duration-300`}>
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

      {/* Globally mounted interactive Demo console helper */}
      <DemoConsole />
    </div>
  );
}

export default App;
