import React, { useState } from 'react';
import { BarChart3, Settings, FolderOpen, Plane, Menu } from 'lucide-react';
import { Aircraft, ViewState, GeneratedScenario, SavedTestCase } from './types';
import AircraftDetailModal from './components/AircraftDetailModal';
import TestCaseGenerator from './components/TestCaseGenerator';
import TestCaseLibrary from './components/TestCaseLibrary';
import LoginView from './components/dashboard/LoginView';
import Sidebar from './components/dashboard/Sidebar';
import MobileDrawer from './components/dashboard/MobileDrawer';
import AircraftGrid from './components/dashboard/AircraftGrid';
import { CreateCaseModal, EditCaseModal } from './components/library/CaseModals';
import { optimizeScenarioDescription } from './services/geminiService';

// Import Mock Data
import { MOCK_AIRCRAFT, MOCK_SAVED_CASES } from './data/mockData';

const App: React.FC = () => {
  const [view, setView] = useState<ViewState>('login');
  const [selectedAircraft, setSelectedAircraft] = useState<Aircraft | null>(null);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const [savedCases, setSavedCases] = useState<SavedTestCase[]>(MOCK_SAVED_CASES);
  const [currentScenario, setCurrentScenario] = useState<GeneratedScenario | null>(null);
  const [initialPrompt, setInitialPrompt] = useState<string>('');

  // Lifted Modal State from TestCaseLibrary
  // Create Modal State
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [createName, setCreateName] = useState('');
  const [createTags, setCreateTags] = useState('');
  const [createRequirement, setCreateRequirement] = useState('');
  const [isOptimizing, setIsOptimizing] = useState(false);

  // Edit Modal State
  const [editingCase, setEditingCase] = useState<SavedTestCase | null>(null);
  const [editName, setEditName] = useState('');
  const [editTags, setEditTags] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username && password) {
      setView('dashboard');
    }
  };

  const handleSaveTestCase = (scenario: GeneratedScenario) => {
    const newCase: SavedTestCase = {
      ...scenario,
      id: Date.now().toString(),
      createdAt: new Date().toLocaleString('zh-CN', { hour12: false, year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' }),
      tags: Array.from(new Set(scenario.tasks.map(t => t.aircraftId)))
    };
    setSavedCases(prev => [newCase, ...prev]);
  };

  const handleLoadTestCase = (testCase: SavedTestCase) => {
    setCurrentScenario(testCase);
    setInitialPrompt(`加载的场景: ${testCase.scenarioName}`); // Optional
    setView('generator');
    setIsMobileMenuOpen(false); // Close mobile menu if open
  };

  const handleCreateFromRequirement = (optimizedRequirement: string) => {
    setInitialPrompt(optimizedRequirement);
    setCurrentScenario(null);
    setView('generator');
    setIsMobileMenuOpen(false);
  };

  const handleDeleteTestCase = (id: string) => {
    setSavedCases(prev => prev.filter(c => c.id !== id));
  };

  const handleUpdateTestCase = (updatedCase: SavedTestCase) => {
    setSavedCases(prev => prev.map(c => c.id === updatedCase.id ? updatedCase : c));
  };

  // Modal Handlers
  const handleOptimize = async () => {
    if (!createRequirement.trim()) return;
    setIsOptimizing(true);
    const optimizedText = await optimizeScenarioDescription(createRequirement);
    setCreateRequirement(optimizedText);
    setIsOptimizing(false);
  };

  const handleCreateCase = () => {
    if (!createRequirement.trim()) return;

    let structuredPrompt = '';
    if (createName.trim()) {
      structuredPrompt += `【指定场景名称】：${createName}\n`;
    }
    if (createTags.trim()) {
      structuredPrompt += `【指定包含标签】：${createTags}\n`;
    }
    structuredPrompt += `【详细需求描述】：${createRequirement}`;

    handleCreateFromRequirement(structuredPrompt);

    // Reset and close
    setIsCreateModalOpen(false);
    setCreateName('');
    setCreateTags('');
    setCreateRequirement('');
  };

  const handleOpenEditModal = (testCase: SavedTestCase) => {
    setEditingCase(testCase);
    setEditName(testCase.scenarioName);
    setEditTags(testCase.tags.join(', '));
  };

  const handleSaveEditCase = () => {
    if (!editingCase) return;
    const updated = {
      ...editingCase,
      scenarioName: editName,
      tags: editTags.split(',').map(t => t.trim()).filter(Boolean)
    };
    handleUpdateTestCase(updated);
    setEditingCase(null);
  };

  // Navigation Items
  const navItems = [
    { id: 'dashboard', icon: Settings, label: '态势监控' },
    { id: 'generator', icon: BarChart3, label: '智能生成' },
    { id: 'library', icon: FolderOpen, label: '用例库' },
  ];

  if (view === 'login') {
    return (
      <LoginView
        username={username}
        setUsername={setUsername}
        password={password}
        setPassword={setPassword}
        onLogin={handleLogin}
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 bg-grid-pattern flex overflow-hidden font-sans">
      <div className="fixed inset-0 bg-scanline pointer-events-none z-30 opacity-50"></div>

      {/* Mobile Navigation Drawer */}
      <MobileDrawer
        isOpen={isMobileMenuOpen}
        setIsOpen={setIsMobileMenuOpen}
        view={view}
        setView={(v) => {
          setView(v);
          if (v === 'generator') {
            setCurrentScenario(null);
            setInitialPrompt('');
          }
        }}
        username={username}
        navItems={navItems}
        onLogout={() => setView('login')}
      />

      {/* Desktop Sidebar */}
      <Sidebar
        view={view}
        setView={(v) => {
          setView(v);
          if (v === 'generator') {
            setCurrentScenario(null);
            setInitialPrompt('');
          }
        }}
        username={username}
        navItems={navItems}
        onLogout={() => setView('login')}
      />

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden relative w-full">
        {/* Background Gradients */}
        <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-blue-50/80 to-transparent pointer-events-none z-0"></div>

        {/* Mobile Header */}
        <header className="bg-white/80 backdrop-blur-md border-b border-slate-200 p-4 flex md:hidden justify-between items-center shrink-0 sticky top-0 z-40">
          <div className="flex items-center space-x-2">
            <div className="bg-blue-600 p-1.5 rounded text-white"><Plane className="w-4 h-4" fill="currentColor" /></div>
            <span className="font-bold text-lg text-slate-800">天翼调度</span>
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
                  <h2 className="text-2xl md:text-3xl font-bold text-slate-800 tracking-tight">智能用例生成</h2>

                </div>
                <div className="flex-1 min-h-0">
                  <TestCaseGenerator
                    aircraftList={MOCK_AIRCRAFT}
                    onSave={handleSaveTestCase}
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
                    onDelete={handleDeleteTestCase}
                    onOpenCreateModal={() => setIsCreateModalOpen(true)}
                    onOpenEditModal={handleOpenEditModal}
                  />
                </div>
              </div>
            )}

          </div>
        </div>
      </main>

      {/* Modal Layer */}
      <AircraftDetailModal
        aircraft={selectedAircraft}
        onClose={() => setSelectedAircraft(null)}
      />

      <CreateCaseModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        newName={createName}
        setNewName={setCreateName}
        newTags={createTags}
        setNewTags={setCreateTags}
        newRequirement={createRequirement}
        setNewRequirement={setCreateRequirement}
        isOptimizing={isOptimizing}
        handleOptimize={handleOptimize}
        handleCreate={handleCreateCase}
      />

      <EditCaseModal
        editingCase={editingCase}
        onClose={() => setEditingCase(null)}
        editName={editName}
        setEditName={setEditName}
        editTags={editTags}
        setEditTags={setEditTags}
        handleSaveEdit={handleSaveEditCase}
      />
    </div>
  );
};

export default App;