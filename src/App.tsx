/**
 * App.tsx - Application root component
 * Uses AppContext for global state management
 */

import React from 'react';
import { AppProvider, useAppContext } from './shared/contexts/AppContext';
import { useCaseModal } from './features/library/hooks/useCaseModal';
import MainLayout from './layouts/MainLayout';
import LoginView from './features/dashboard/LoginView';

/**
 * App Content - Main application content with context access
 */
const AppContent: React.FC = () => {
  const {
    view,
    setView,
    username,
    setUsername,
    login,
    logout,
    savedCases,
    saveTestCase,
    deleteTestCase,
    updateTestCase,
    currentScenario,
    setCurrentScenario,
    initialPrompt,
    setInitialPrompt,
    isMobileMenuOpen,
    setIsMobileMenuOpen,
  } = useAppContext();

  const caseModal = useCaseModal();

  // Handle login
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    login(username, '');
  };

  // Handle navigation to generator with prompt
  const handleCreateFromRequirement = (prompt: string) => {
    setInitialPrompt(prompt);
    setCurrentScenario(null);
    setView('generator');
    setIsMobileMenuOpen(false);
  };

  // Show login view if not authenticated
  if (view === 'login') {
    return (
      <LoginView
        username={username}
        setUsername={setUsername}
        password=""
        setPassword={() => {}}
        onLogin={handleLogin}
      />
    );
  }

  // Show main layout for authenticated users
  return (
    <MainLayout
      view={view}
      setView={setView}
      username={username}
      logout={logout}
      isMobileMenuOpen={isMobileMenuOpen}
      setIsMobileMenuOpen={setIsMobileMenuOpen}
      currentScenario={currentScenario}
      setCurrentScenario={setCurrentScenario}
      initialPrompt={initialPrompt}
      setInitialPrompt={setInitialPrompt}
      savedCases={savedCases}
      saveTestCase={saveTestCase}
      deleteTestCase={deleteTestCase}
      updateTestCase={updateTestCase}
      caseModal={caseModal}
      onCreateFromRequirement={handleCreateFromRequirement}
    />
  );
};

/**
 * App - Root component with provider
 */
const App: React.FC = () => {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
};

export default App;
