/**
 * Mock Part Status - Simulated fault data for demonstration
 */

import { PartStatus } from '@/types';

export const MOCK_PART_STATUS: PartStatus[] = [
  {
    partId: 'engine-left',
    status: 'error',
    faults: [
      {
        id: 'f001',
        type: '温度传感器异常',
        severity: 'high',
        description: '左发动机涡轮区域温度传感器读数超出正常范围，当前温度比标准值高出 15%',
        detectedAt: '2025-01-15T08:30:00Z',
        recommendation: '建议立即停机检查，更换温度传感器',
      },
    ],
  },
  {
    partId: 'landing-gear-front',
    status: 'warning',
    faults: [
      {
        id: 'f002',
        type: '液压压力偏低',
        severity: 'medium',
        description: '前起落架液压系统压力低于标准值 15%，可能存在轻微泄漏',
        detectedAt: '2025-01-15T07:45:00Z',
        recommendation: '下次维护时检查液压油量和密封件',
      },
    ],
  },
  {
    partId: 'wing-right',
    status: 'maintenance',
    faults: [
      {
        id: 'f003',
        type: '定期维护',
        severity: 'low',
        description: '右侧机翼襟翼已到达例行检查周期（5000 飞行小时）',
        detectedAt: '2025-01-14T12:00:00Z',
        recommendation: '按计划进行例行检查和润滑',
      },
    ],
  },
  {
    partId: 'tail',
    status: 'warning',
    faults: [
      {
        id: 'f004',
        type: '方向舵响应延迟',
        severity: 'medium',
        description: '尾翼方向舵控制响应时间略高于标准值',
        detectedAt: '2025-01-15T06:20:00Z',
        recommendation: '检查方向舵伺服系统和控制连杆',
      },
    ],
  },
];
