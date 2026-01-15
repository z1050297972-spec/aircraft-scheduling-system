/**
 * App Context - Global application state management
 */

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { ViewState, GeneratedScenario, SavedTestCase } from '@/types';
import { MOCK_SAVED_CASES } from '@/data/mockData';
import { formatDateCN } from '../utils/formatters';

// Context value type
export interface AppContextValue {
  // View State
  view: ViewState;
  setView: (view: ViewState) => void;

  // Auth State
  username: string;
  setUsername: (name: string) => void;
  isAuthenticated: boolean;
  login: (username: string, password: string) => boolean;
  logout: () => void;

  // Test Cases State
  savedCases: SavedTestCase[];
  saveTestCase: (scenario: GeneratedScenario) => void;
  deleteTestCase: (id: string) => void;
  updateTestCase: (updatedCase: SavedTestCase) => void;

  // Navigation State
  currentScenario: GeneratedScenario | null;
  setCurrentScenario: (scenario: GeneratedScenario | null) => void;
  initialPrompt: string;
  setInitialPrompt: (prompt: string) => void;

  // Mobile Menu State
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: (isOpen: boolean) => void;
}

const AppContext = createContext<AppContextValue | undefined>(undefined);

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  // View State
  const [view, setView] = useState<ViewState>('login');

  // Auth State
  const [username, setUsername] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Test Cases State
  const [savedCases, setSavedCases] = useState<SavedTestCase[]>(MOCK_SAVED_CASES);

  // Navigation State
  const [currentScenario, setCurrentScenario] = useState<GeneratedScenario | null>(null);
  const [initialPrompt, setInitialPrompt] = useState('');

  // Mobile Menu State
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Auth Actions
  const login = useCallback((user: string, pass: string): boolean => {
    if (user && pass) {
      setUsername(user);
      setIsAuthenticated(true);
      setView('dashboard');
      return true;
    }
    return false;
  }, []);

  const logout = useCallback(() => {
    setUsername('');
    setIsAuthenticated(false);
    setView('login');
  }, []);

  // Test Cases Actions
  const saveTestCase = useCallback((scenario: GeneratedScenario) => {
    const newCase: SavedTestCase = {
      ...scenario,
      id: Date.now().toString(),
      createdAt: formatDateCN(new Date()),
      tags: Array.from(new Set(scenario.tasks.map((t) => t.aircraftId))),
    };
    setSavedCases((prev) => [newCase, ...prev]);
  }, []);

  const deleteTestCase = useCallback((id: string) => {
    setSavedCases((prev) => prev.filter((c) => c.id !== id));
  }, []);

  const updateTestCase = useCallback((updatedCase: SavedTestCase) => {
    setSavedCases((prev) =>
      prev.map((c) => (c.id === updatedCase.id ? updatedCase : c))
    );
  }, []);

  const value: AppContextValue = {
    // View
    view,
    setView,
    // Auth
    username,
    setUsername,
    isAuthenticated,
    login,
    logout,
    // Test Cases
    savedCases,
    saveTestCase,
    deleteTestCase,
    updateTestCase,
    // Navigation
    currentScenario,
    setCurrentScenario,
    initialPrompt,
    setInitialPrompt,
    // Mobile Menu
    isMobileMenuOpen,
    setIsMobileMenuOpen,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = (): AppContextValue => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within AppProvider');
  }
  return context;
};
