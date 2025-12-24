export interface Consumables {
  fuelLevel: number; // Percentage
  oilLevel: number; // Percentage
  hydraulicFluid: number; // Percentage
}

export interface Aircraft {
  id: string;
  code: string; // e.g., J-20-01
  model: string; // e.g., J-20
  status: 'normal' | 'maintenance' | 'mission';
  maxSpeed: number; // km/h
  maxHeight: number; // meters
  health: number; // 0-100 score
  consumables: Consumables;
  lastMaintenance: string;
}

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
}

export interface SavedTestCase extends GeneratedScenario {
  id: string;
  createdAt: string;
  tags: string[];
}

export type ViewState = 'login' | 'dashboard' | 'generator' | 'library';