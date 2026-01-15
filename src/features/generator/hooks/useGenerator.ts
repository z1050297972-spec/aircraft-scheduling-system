/**
 * useGenerator - Hook for test case generation logic
 */

import { useState, useEffect, useRef, useCallback } from 'react';
import { Aircraft, GeneratedScenario } from '@/types';
import { generateTestCase } from '../services/generatorApi';

export interface UseGeneratorReturn {
  userInput: string;
  setUserInput: (input: string) => void;
  selectedAircraftIds: string[];
  toggleAircraftSelection: (id: string) => void;
  isGenerating: boolean;
  loadingStep: number;
  loadingTexts: string[];
  scenario: GeneratedScenario | null;
  hasSaved: boolean;
  handleGenerate: () => Promise<void>;
  handleSaveClick: () => void;
  setScenario: (scenario: GeneratedScenario | null) => void;
  setHasSaved: (saved: boolean) => void;
}

export const useGenerator = (
  aircraftList: Aircraft[],
  onSave?: (scenario: GeneratedScenario) => void,
  initialScenario?: GeneratedScenario | null,
  initialPromptText?: string
): UseGeneratorReturn => {
  const [userInput, setUserInput] = useState('');
  const [selectedAircraftIds, setSelectedAircraftIds] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [scenario, setScenario] = useState<GeneratedScenario | null>(null);
  const [hasSaved, setHasSaved] = useState(false);

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const loadingTexts = [
    '正在分析态势感知数据...',
    '正在检索可用保障资源...',
    '正在推演最优调度路径...',
    '正在生成仿真评估报告...',
  ];

  // Handle initial scenario/prompt
  useEffect(() => {
    if (initialScenario) {
      setScenario(initialScenario);
      setHasSaved(true);
      setUserInput(`加载的场景: ${initialScenario.scenarioName}`);
      setSelectedAircraftIds([]);
    } else if (initialPromptText) {
      setUserInput(initialPromptText);
      setScenario(null);
      setHasSaved(false);
    }
  }, [initialScenario, initialPromptText]);

  // Loading animation effect
  useEffect(() => {
    if (isGenerating) {
      setLoadingStep(0);
      intervalRef.current = setInterval(() => {
        setLoadingStep((prev) => (prev + 1) % 4);
      }, 1500);
    }
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isGenerating]);

  const toggleAircraftSelection = useCallback((id: string) => {
    setSelectedAircraftIds((prev) =>
      prev.includes(id) ? prev.filter((mid) => mid !== id) : [...prev, id]
    );
  }, []);

  const handleGenerate = useCallback(async () => {
    if (!userInput.trim()) return;
    setIsGenerating(true);
    setScenario(null);
    setHasSaved(false);

    let finalPrompt = userInput;
    if (selectedAircraftIds.length > 0) {
      const selectedCodes = aircraftList
        .filter((a) => selectedAircraftIds.includes(a.id))
        .map((a) => a.code)
        .join(', ');
      finalPrompt += `\n\n[System Note: User has explicitly selected the following aircraft for this test: ${selectedCodes}. Please ensure the scenario involves these specific units.]`;
    }

    const result = await generateTestCase(finalPrompt, aircraftList);
    setScenario(result);
    setIsGenerating(false);
  }, [userInput, selectedAircraftIds, aircraftList]);

  const handleSaveClick = useCallback(() => {
    if (scenario && onSave) {
      onSave(scenario);
      setHasSaved(true);
      setTimeout(() => setHasSaved(false), 2000);
    }
  }, [scenario, onSave]);

  return {
    userInput,
    setUserInput,
    selectedAircraftIds,
    toggleAircraftSelection,
    isGenerating,
    loadingStep,
    loadingTexts,
    scenario,
    hasSaved,
    handleGenerate,
    handleSaveClick,
    setScenario,
    setHasSaved,
  };
};
