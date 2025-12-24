import { Aircraft, SavedTestCase } from '../types';

export const MOCK_AIRCRAFT: Aircraft[] = [
  {
    id: '1',
    code: 'J-20-01',
    model: 'J-20',
    status: 'normal',
    maxSpeed: 2100,
    maxHeight: 20000,
    health: 98,
    consumables: { fuelLevel: 45, oilLevel: 80, hydraulicFluid: 95 },
    lastMaintenance: '2023-10-15'
  },
  {
    id: '2',
    code: 'J-20-02',
    model: 'J-20',
    status: 'mission',
    maxSpeed: 2100,
    maxHeight: 20000,
    health: 92,
    consumables: { fuelLevel: 12, oilLevel: 60, hydraulicFluid: 88 },
    lastMaintenance: '2023-10-10'
  },
  {
    id: '3',
    code: 'Y-20-05',
    model: 'Y-20',
    status: 'maintenance',
    maxSpeed: 800,
    maxHeight: 13000,
    health: 65,
    consumables: { fuelLevel: 0, oilLevel: 40, hydraulicFluid: 50 },
    lastMaintenance: '2023-10-25'
  },
  {
    id: '4',
    code: 'J-16-08',
    model: 'J-16',
    status: 'normal',
    maxSpeed: 2400,
    maxHeight: 18000,
    health: 100,
    consumables: { fuelLevel: 90, oilLevel: 98, hydraulicFluid: 99 },
    lastMaintenance: '2023-10-26'
  },
  {
    id: '5',
    code: 'J-10C-12',
    model: 'J-10C',
    status: 'normal',
    maxSpeed: 2200,
    maxHeight: 18000,
    health: 88,
    consumables: { fuelLevel: 30, oilLevel: 75, hydraulicFluid: 90 },
    lastMaintenance: '2023-09-30'
  }
];

export const MOCK_SAVED_CASES: SavedTestCase[] = [
  {
    id: '101',
    scenarioName: '多机编队紧急加油',
    createdAt: '2023-10-27 14:30',
    tags: ['J-20', '加油', '紧急'],
    tasks: [
      { id: 't1', aircraftId: 'J-20-01', type: '加油', description: '补充燃油至90%', requiredResources: '加油车A', estimatedDuration: 20 },
      { id: 't2', aircraftId: 'J-20-02', type: '检查', description: '飞行前例行检查', requiredResources: '机务组1', estimatedDuration: 15 }
    ],
    predictedOutcome: {
      isComplete: true,
      totalTime: 35,
      score: 95,
      grade: '优秀',
      logs: ['J-20-01到位', '加油开始', '检查完毕', '任务结束'],
      resourceUsage: [{ name: '燃油', amount: 5000 }]
    }
  },
  {
    id: '102',
    scenarioName: 'J-10C发动机故障模拟',
    createdAt: '2023-10-26 09:15',
    tags: ['J-10C', '维修', '故障'],
    tasks: [
      { id: 't3', aircraftId: 'J-10C-12', type: '维修', description: '更换液压泵', requiredResources: '维修组B', estimatedDuration: 120 }
    ],
    predictedOutcome: {
      isComplete: true,
      totalTime: 120,
      score: 88,
      grade: '良好',
      logs: ['故障定位', '备件申请', '更换完成'],
      resourceUsage: [{ name: '备件', amount: 1 }]
    }
  }
];