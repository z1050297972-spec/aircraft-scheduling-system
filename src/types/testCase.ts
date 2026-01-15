/**
 * Test case related types
 */

export interface TestTask {
  id: string;
  aircraftId: string;
  type: string; // e.g., "Refueling", "Inspection"
  description: string;
  requiredResources: string; // e.g., "Fuel Truck A"
  estimatedDuration: number; // minutes
}

export interface TestReport {
  isComplete: boolean;
  totalTime: number; // minutes
  score: number; // 0-100
  grade: '优秀' | '良好' | '合格' | '不合格';
  logs: string[];
  resourceUsage: { name: string; amount: number }[];
}

export interface GeneratedScenario {
  scenarioName: string;
  tasks: TestTask[];
  predictedOutcome: TestReport;
  scenarioType?: 'preset-refuel';
}

export interface SavedTestCase extends GeneratedScenario {
  id: string;
  createdAt: string;
  tags: string[];
}
