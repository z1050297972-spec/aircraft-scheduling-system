/**
 * usePartSelection - Hook for managing selected part state
 * Works with region-based detection
 */

import { useState, useCallback } from 'react';
import { PartRegion } from '../data/partRegions';

export interface SelectedPart {
  id: string;
  name: string;
  category: string;
}

export interface UsePartSelectionReturn {
  selectedPartId: string | null;
  selectedPart: SelectedPart | null;
  selectPart: (partId: string | null, partName: string | null) => void;
  selectPartFromRegion: (region: PartRegion | null) => void;
  clearSelection: () => void;
  isPartSelected: (partId: string) => boolean;
}

export const usePartSelection = (): UsePartSelectionReturn => {
  const [selectedPartId, setSelectedPartId] = useState<string | null>(null);
  const [selectedPart, setSelectedPart] = useState<SelectedPart | null>(null);

  const selectPart = useCallback((partId: string | null, partName: string | null) => {
    setSelectedPartId(partId);
    if (partId && partName) {
      setSelectedPart({
        id: partId,
        name: partName,
        category: '', // Will be filled if using selectPartFromRegion
      });
    } else {
      setSelectedPart(null);
    }
  }, []);

  const selectPartFromRegion = useCallback((region: PartRegion | null) => {
    if (region) {
      setSelectedPartId(region.id);
      setSelectedPart({
        id: region.id,
        name: region.name,
        category: region.category,
      });
    } else {
      setSelectedPartId(null);
      setSelectedPart(null);
    }
  }, []);

  const clearSelection = useCallback(() => {
    setSelectedPartId(null);
    setSelectedPart(null);
  }, []);

  const isPartSelected = useCallback(
    (partId: string) => selectedPartId === partId,
    [selectedPartId]
  );

  return {
    selectedPartId,
    selectedPart,
    selectPart,
    selectPartFromRegion,
    clearSelection,
    isPartSelected,
  };
};
