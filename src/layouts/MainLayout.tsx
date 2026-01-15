/**
 * MainLayout - Main application layout with sidebar, header, and content area
 */

import React, { useState } from 'react';
import { BarChart3, Settings, FolderOpen, Plane, Menu, Box } from 'lucide-react';
import { ViewState, GeneratedScenario, SavedTestCase, Aircraft } from '@/types';
import { MOCK_AIRCRAFT } from '@/data/mockData';
import { UseCaseModalReturn } from '@/features/library/hooks/useCaseModal';

// Components
import AircraftDetailModal from '@/components/AircraftDetailModal';
import Sidebar from '@/features/dashboard/Sidebar';
import MobileDrawer from '@/features/dashboard/MobileDrawer';
import AircraftGrid from '@/features/dashboard/AircraftGrid';
import TestCaseGenerator from '@/features/generator/TestCaseGenerator';
import TestCaseLibrary from '@/features/library/TestCaseLibrary';
import { CreateCaseModal, EditCaseModal } from '@/features/library/components/CaseModals';
import { ModelViewerPage } from '@/features/model-viewer';

interface MainLayoutProps {
  view: ViewState;
  setView: (view: ViewState) => void;
  username: string;
  logout: () => void;
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: (isOpen: boolean) => void;
  currentScenario: GeneratedScenario | null;
  setCurrentScenario: (scenario: GeneratedScenario | null) => void;
  initialPrompt: string;
  setInitialPrompt: (prompt: string) => void;
  savedCases: SavedTestCase[];
  saveTestCase: (scenario: GeneratedScenario) => void;
  deleteTestCase: (id: string) => void;
  updateTestCase: (updatedCase: SavedTestCase) => void;
  caseModal: UseCaseModalReturn;
  onCreateFromRequirement: (prompt: string) => void;
}

const MainLayout: React.FC<MainLayoutProps> = ({
  view,
  setView,
  username,
  logout,
  isMobileMenuOpen,
  setIsMobileMenuOpen,
  currentScenario,
  setCurrentScenario,
  initialPrompt,
  setInitialPrompt,
  savedCases,
  saveTestCase,
  deleteTestCase,
  updateTestCase,
  caseModal,
  onCreateFromRequirement,
}) => {
  const [selectedAircraft, setSelectedAircraft] = useState<Aircraft | null>(null);

  // Navigation items
  const navItems = [
    { id: 'dashboard', icon: Settings, label: '态势监控' },
    { id: 'generator', icon: BarChart3, label: '智能生成' },
    { id: 'library', icon: FolderOpen, label: '用例库' },
    { id: 'model-viewer', icon: Box, label: '3D 模型' },
  ];

  // Handle view change with reset
  const handleViewChange = (v: ViewState) => {
    setView(v);
    if (v === 'generator') {
      setCurrentScenario(null);
      setInitialPrompt('');
    }
  };

  // Handle load test case
  const handleLoadTestCase = (testCase: SavedTestCase) => {
    setCurrentScenario(testCase);
    setInitialPrompt(`加载的场景: ${testCase.scenarioName}`);
    setView('generator');
    setIsMobileMenuOpen(false);
  };

  // Handle create case from modal
  const handleCreateCase = () => {
    caseModal.handleCreateCase(onCreateFromRequirement);
  };

  // Handle save edit case
  const handleSaveEditCase = () => {
    caseModal.handleSaveEditCase(updateTestCase);
  };

  return (
    <div className="min-h-screen bg-slate-50 bg-grid-pattern flex overflow-hidden font-sans">
      <div className="fixed inset-0 bg-scanline pointer-events-none z-30 opacity-50"></div>

      {/* Mobile Navigation Drawer */}
      <MobileDrawer
        isOpen={isMobileMenuOpen}
        setIsOpen={setIsMobileMenuOpen}
        view={view}
        setView={handleViewChange}
        username={username}
        navItems={navItems}
        onLogout={logout}
      />

      {/* Desktop Sidebar */}
      <Sidebar
        view={view}
        setView={handleViewChange}
        username={username}
        navItems={navItems}
        onLogout={logout}
      />

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden relative w-full">
        {/* Background Gradients */}
        <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-blue-50/80 to-transparent pointer-events-none z-0"></div>

        {/* Mobile Header */}
        <header className="bg-white/80 backdrop-blur-md border-b border-slate-200 p-4 flex md:hidden justify-between items-center shrink-0 sticky top-0 z-40">
          <div className="flex items-center space-x-2">
            <div className="bg-blue-600 p-1.5 rounded text-white">
              <Plane className="w-4 h-4" fill="currentColor" />
            </div>
            <span className="font-bold text-lg text-slate-800">测试用例生成系统</span>
          </div>
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className="text-slate-500 hover:text-blue-600 p-1"
          >
            <Menu size={24} />
          </button>
        </header>

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-auto p-4 md:p-8 z-10 scroll-smooth custom-scrollbar">
          <div className="max-w-[1600px] mx-auto h-full">
            {view === 'dashboard' && (
              <AircraftGrid
                aircraftList={MOCK_AIRCRAFT}
                onSelectAircraft={setSelectedAircraft}
              />
            )}

            {view === 'generator' && (
              <div className="h-full animate-in fade-in slide-in-from-bottom-4 duration-500 flex flex-col">
                <div className="mb-6 md:mb-8 shrink-0">
                  <h2 className="text-2xl md:text-3xl font-bold text-slate-800 tracking-tight">
                    智能生产力
                  </h2>
                </div>
                <div className="flex-1 min-h-0">
                  <TestCaseGenerator
                    aircraftList={MOCK_AIRCRAFT}
                    onSave={saveTestCase}
                    initialScenario={currentScenario}
                    initialPromptText={initialPrompt}
                  />
                </div>
              </div>
            )}

            {view === 'library' && (
              <div className="h-full animate-in fade-in slide-in-from-bottom-4 duration-500 flex flex-col">
                <div className="flex-1 min-h-0">
                  <TestCaseLibrary
                    savedCases={savedCases}
                    onLoad={handleLoadTestCase}
                    onDelete={deleteTestCase}
                    onOpenCreateModal={() => caseModal.setIsCreateModalOpen(true)}
                    onOpenEditModal={caseModal.handleOpenEditModal}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* 3D Model Viewer - Full screen overlay */}
      {view === 'model-viewer' && (
        <ModelViewerPage onClose={() => setView('dashboard')} />
      )}

      {/* Modal Layer */}
      <AircraftDetailModal
        aircraft={selectedAircraft}
        onClose={() => setSelectedAircraft(null)}
      />

      <CreateCaseModal
        isOpen={caseModal.isCreateModalOpen}
        onClose={() => caseModal.setIsCreateModalOpen(false)}
        newName={caseModal.createName}
        setNewName={caseModal.setCreateName}
        newTags={caseModal.createTags}
        setNewTags={caseModal.setCreateTags}
        newRequirement={caseModal.createRequirement}
        setNewRequirement={caseModal.setCreateRequirement}
        isOptimizing={caseModal.isOptimizing}
        handleOptimize={caseModal.handleOptimize}
        handleCreate={handleCreateCase}
      />

      <EditCaseModal
        editingCase={caseModal.editingCase}
        onClose={caseModal.handleCloseEditModal}
        editName={caseModal.editName}
        setEditName={caseModal.setEditName}
        editTags={caseModal.editTags}
        setEditTags={caseModal.setEditTags}
        handleSaveEdit={handleSaveEditCase}
      />
    </div>
  );
};

export default MainLayout;
