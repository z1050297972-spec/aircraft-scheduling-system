import React, { useState, useEffect, useRef } from 'react';
import { Aircraft, GeneratedScenario } from '../../types';
import GeneratorInputPanel from './components/GeneratorInputPanel';
import GeneratorResultPanel from './components/GeneratorResultPanel';

// TODO: 后续接入自研大模型后端 API
// 临时占位函数，模拟生成测试用例
const generateTestCase = async (
  _userInput: string,
  _aircraftList: Aircraft[]
): Promise<GeneratedScenario | null> => {
  // 模拟 API 延迟
  await new Promise((resolve) => setTimeout(resolve, 2000));

  // 返回模拟数据
  return {
    scenarioName: '模拟生成的测试场景',
    tasks: [
      {
        id: 'TC-01',
        aircraftId: '1号位',
        type: '测试用例1',
        description: '这是一个模拟生成的测试用例，后续将接入自研大模型后端。',
        requiredResources: '1号保障组',
        estimatedDuration: 20,
      },
    ],
    predictedOutcome: {
      isComplete: true,
      totalTime: 20,
      score: 90,
      grade: '优秀',
      logs: ['测试用例生成完成', '等待后端接入'],
      resourceUsage: [{ name: '1号保障组', amount: 1 }],
    },
  };
};

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

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

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

  const loadingTexts = [
    '正在分析态势感知数据...',
    '正在检索可用保障资源...',
    '正在推演最优调度路径...',
    '正在生成仿真评估报告...',
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
        .filter((a) => selectedAircraftIds.includes(a.id))
        .map((a) => a.code)
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
    setSelectedAircraftIds((prev) =>
      prev.includes(id) ? prev.filter((mid) => mid !== id) : [...prev, id]
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
