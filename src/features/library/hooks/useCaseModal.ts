/**
 * useCaseModal - Hook for managing create/edit modal state
 */

import { useState, useCallback } from 'react';
import { SavedTestCase } from '@/types';
import { optimizeScenarioDescription } from '@/features/generator/services/generatorApi';

export interface UseCaseModalReturn {
  // Create Modal State
  isCreateModalOpen: boolean;
  setIsCreateModalOpen: (isOpen: boolean) => void;
  createName: string;
  setCreateName: (name: string) => void;
  createTags: string;
  setCreateTags: (tags: string) => void;
  createRequirement: string;
  setCreateRequirement: (requirement: string) => void;
  isOptimizing: boolean;

  // Edit Modal State
  editingCase: SavedTestCase | null;
  editName: string;
  setEditName: (name: string) => void;
  editTags: string;
  setEditTags: (tags: string) => void;

  // Actions
  handleOptimize: () => Promise<void>;
  handleCreateCase: (onCreateFromRequirement: (prompt: string) => void) => void;
  handleOpenEditModal: (testCase: SavedTestCase) => void;
  handleSaveEditCase: (onUpdateTestCase: (updatedCase: SavedTestCase) => void) => void;
  handleCloseEditModal: () => void;
  resetCreateModal: () => void;
}

export const useCaseModal = (): UseCaseModalReturn => {
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

  // Actions
  const handleOptimize = useCallback(async () => {
    if (!createRequirement.trim()) return;
    setIsOptimizing(true);
    const optimizedText = await optimizeScenarioDescription(createRequirement);
    setCreateRequirement(optimizedText);
    setIsOptimizing(false);
  }, [createRequirement]);

  const resetCreateModal = useCallback(() => {
    setIsCreateModalOpen(false);
    setCreateName('');
    setCreateTags('');
    setCreateRequirement('');
  }, []);

  const handleCreateCase = useCallback(
    (onCreateFromRequirement: (prompt: string) => void) => {
      if (!createRequirement.trim()) return;

      let structuredPrompt = '';
      if (createName.trim()) {
        structuredPrompt += `【指定场景名称】：${createName}\n`;
      }
      if (createTags.trim()) {
        structuredPrompt += `【指定包含标签】：${createTags}\n`;
      }
      structuredPrompt += `【详细需求描述】：${createRequirement}`;

      onCreateFromRequirement(structuredPrompt);
      resetCreateModal();
    },
    [createName, createTags, createRequirement, resetCreateModal]
  );

  const handleOpenEditModal = useCallback((testCase: SavedTestCase) => {
    setEditingCase(testCase);
    setEditName(testCase.scenarioName);
    setEditTags(testCase.tags.join(', '));
  }, []);

  const handleSaveEditCase = useCallback(
    (onUpdateTestCase: (updatedCase: SavedTestCase) => void) => {
      if (!editingCase) return;
      const updated: SavedTestCase = {
        ...editingCase,
        scenarioName: editName,
        tags: editTags
          .split(',')
          .map((t) => t.trim())
          .filter(Boolean),
      };
      onUpdateTestCase(updated);
      setEditingCase(null);
    },
    [editingCase, editName, editTags]
  );

  const handleCloseEditModal = useCallback(() => {
    setEditingCase(null);
  }, []);

  return {
    // Create Modal State
    isCreateModalOpen,
    setIsCreateModalOpen,
    createName,
    setCreateName,
    createTags,
    setCreateTags,
    createRequirement,
    setCreateRequirement,
    isOptimizing,

    // Edit Modal State
    editingCase,
    editName,
    setEditName,
    editTags,
    setEditTags,

    // Actions
    handleOptimize,
    handleCreateCase,
    handleOpenEditModal,
    handleSaveEditCase,
    handleCloseEditModal,
    resetCreateModal,
  };
};
