/**
 * Generator API - AI model integration for test case generation
 *
 * TODO: 后续接入自研大模型后端 API
 * 当前为模拟实现
 */

import { Aircraft, GeneratedScenario } from '@/types';

/**
 * Generate test case scenario using AI
 * TODO: Replace with actual backend API call
 */
export const generateTestCase = async (
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

/**
 * Optimize scenario description using AI
 * TODO: Replace with actual backend API call
 */
export const optimizeScenarioDescription = async (input: string): Promise<string> => {
  // 模拟 API 延迟
  await new Promise((resolve) => setTimeout(resolve, 1000));
  // 简单返回优化后的文本
  return `[已优化] ${input}`;
};
