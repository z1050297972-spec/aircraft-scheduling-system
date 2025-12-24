import React, { useState, useEffect } from 'react';
import { Aircraft, GeneratedScenario } from '../types';
import { generateTestCase } from '../services/geminiService';
import GeneratorInputPanel from './generator/GeneratorInputPanel';
import GeneratorResultPanel from './generator/GeneratorResultPanel';

interface Props {
  aircraftList: Aircraft[];
  onSave?: (scenario: GeneratedScenario) => void;
  initialScenario?: GeneratedScenario | null;
  initialPromptText?: string;
}

const TestCaseGenerator: React.FC<Props> = ({ aircraftList, onSave, initialScenario, initialPromptText }) => {
  const [userInput, setUserInput] = useState('');
  const [selectedAircraftIds, setSelectedAircraftIds] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [scenario, setScenario] = useState<GeneratedScenario | null>(null);
  const [hasSaved, setHasSaved] = useState(false);

  useEffect(() => {
    if (initialScenario) {
      setScenario(initialScenario);
      setHasSaved(true);
      setUserInput(`加载的场景: ${initialScenario.scenarioName}`);
      // Clear selection when loading a finished scenario
      setSelectedAircraftIds([]);
    } else if (initialPromptText) {
      setUserInput(initialPromptText);
      setScenario(null);
      setHasSaved(false);
    }
  }, [initialScenario, initialPromptText]);

  // Loading animation effect
  useEffect(() => {
    let interval: any;
    if (isGenerating) {
      setLoadingStep(0);
      interval = setInterval(() => {
        setLoadingStep(prev => (prev + 1) % 4);
      }, 1500);
    }
    return () => clearInterval(interval);
  }, [isGenerating]);

  const loadingTexts = [
    "正在分析态势感知数据...",
    "正在检索可用保障资源...",
    "正在推演最优调度路径...",
    "正在生成仿真评估报告..."
  ];

  const handleGenerate = async () => {
    if (!userInput.trim()) return;
    setIsGenerating(true);
    setScenario(null);
    setHasSaved(false);
    
    // Construct a more detailed prompt including selected aircraft
    let finalPrompt = userInput;
    if (selectedAircraftIds.length > 0) {
      const selectedCodes = aircraftList
        .filter(a => selectedAircraftIds.includes(a.id))
        .map(a => a.code)
        .join(', ');
      finalPrompt += `\n\n[System Note: User has explicitly selected the following aircraft for this test: ${selectedCodes}. Please ensure the scenario involves these specific units.]`;
    }

    const result = await generateTestCase(finalPrompt, aircraftList);
    setScenario(result);
    setIsGenerating(false);
  };

  const handleSaveClick = () => {
    if (scenario && onSave) {
      onSave(scenario);
      setHasSaved(true);
      setTimeout(() => setHasSaved(false), 2000);
    }
  };

  const toggleAircraftSelection = (id: string) => {
    setSelectedAircraftIds(prev => 
      prev.includes(id) ? prev.filter(mid => mid !== id) : [...prev, id]
    );
  };

  return (
    <div className="flex flex-col h-full space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-full overflow-y-auto lg:overflow-visible">
        
        {/* Input Section - 4 Columns */}
        <div className="lg:col-span-4 flex flex-col space-y-4 animate-in slide-in-from-left-4 duration-500 shrink-0">
          <GeneratorInputPanel 
            aircraftList={aircraftList}
            selectedAircraftIds={selectedAircraftIds}
            toggleAircraftSelection={toggleAircraftSelection}
            userInput={userInput}
            setUserInput={setUserInput}
            isGenerating={isGenerating}
            handleGenerate={handleGenerate}
          />
        </div>

        {/* Results Section - 8 Columns */}
        <div className="lg:col-span-8">
           <GeneratorResultPanel 
             scenario={scenario}
             isGenerating={isGenerating}
             loadingStep={loadingStep}
             loadingTexts={loadingTexts}
             onSave={onSave}
             hasSaved={hasSaved}
             handleSaveClick={handleSaveClick}
           />
        </div>
      </div>
    </div>
  );
};

export default TestCaseGenerator;