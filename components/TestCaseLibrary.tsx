import React, { useState } from 'react';
import { SavedTestCase } from '../types';
import { FolderOpen } from 'lucide-react';
import LibraryHeader from './library/LibraryHeader';
import CaseCard from './library/CaseCard';

interface Props {
  savedCases: SavedTestCase[];
  onLoad: (testCase: SavedTestCase) => void;
  onDelete: (id: string) => void;
  onOpenCreateModal: () => void;
  onOpenEditModal: (testCase: SavedTestCase) => void;
}

const TestCaseLibrary: React.FC<Props> = ({ 
  savedCases, 
  onLoad, 
  onDelete, 
  onOpenCreateModal, 
  onOpenEditModal 
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredCases = savedCases.filter(c => {
    const term = searchTerm.toLowerCase();
    if (c.scenarioName.toLowerCase().includes(term)) return true;
    if (c.tags.some(t => t.toLowerCase().includes(term))) return true;
    if (c.tasks.some(t => t.type.toLowerCase().includes(term))) return true;
    return false;
  });

  return (
    <div className="flex flex-col h-full space-y-6">
      {/* Header & Search */}
      <LibraryHeader 
        onOpenCreateModal={onOpenCreateModal}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
      />

      {/* Grid List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 overflow-y-auto pb-8 px-1 custom-scrollbar">
        {filteredCases.length === 0 ? (
          <div className="col-span-full flex flex-col items-center justify-center py-24 text-slate-400 border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50/50 animate-in fade-in zoom-in duration-300">
            <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-6">
              <FolderOpen size={40} className="opacity-30" />
            </div>
            <p className="font-medium text-lg">暂无符合条件的测试用例</p>
            <p className="text-sm mt-2 text-slate-400">请尝试调整搜索关键词或生成新用例</p>
          </div>
        ) : (
          filteredCases.map((testCase, idx) => (
            <CaseCard 
              key={testCase.id}
              testCase={testCase}
              idx={idx}
              onOpenEditModal={onOpenEditModal}
              onDelete={onDelete}
              onLoad={onLoad}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default TestCaseLibrary;