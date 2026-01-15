/**
 * usePartStatus - Hook for getting part fault status
 */

import { useMemo } from 'react';
import { PartStatus } from '@/types';
import { MOCK_PART_STATUS } from '../data/mockPartStatus';

export interface UsePartStatusReturn {
  getPartStatus: (partId: string) => PartStatus | null;
  allPartStatuses: PartStatus[];
  hasIssues: (partId: string) => boolean;
  getStatusColor: (status: PartStatus['status']) => string;
}

export const usePartStatus = (): UsePartStatusReturn => {
  const allPartStatuses = MOCK_PART_STATUS;

  const statusMap = useMemo(() => {
    const map = new Map<string, PartStatus>();
    allPartStatuses.forEach((status) => {
      map.set(status.partId, status);
    });
    return map;
  }, [allPartStatuses]);

  const getPartStatus = (partId: string): PartStatus | null => {
    return statusMap.get(partId) ?? null;
  };

  const hasIssues = (partId: string): boolean => {
    const status = statusMap.get(partId);
    return status !== undefined && status.status !== 'normal';
  };

  const getStatusColor = (status: PartStatus['status']): string => {
    switch (status) {
      case 'error':
        return '#ef4444'; // red-500
      case 'warning':
        return '#f59e0b'; // amber-500
      case 'maintenance':
        return '#3b82f6'; // blue-500
      case 'normal':
      default:
        return '#22c55e'; // green-500
    }
  };

  return {
    getPartStatus,
    allPartStatuses,
    hasIssues,
    getStatusColor,
  };
};
