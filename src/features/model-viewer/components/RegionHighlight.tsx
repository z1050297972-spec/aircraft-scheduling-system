/**
 * RegionHighlight - Visual overlay for selected part regions
 */

import React, { useMemo } from 'react';
import * as THREE from 'three';
import { PartRegion } from '../data/partRegions';
import { PartStatus } from '@/types';

interface RegionHighlightProps {
  regions: PartRegion[];
  selectedPartId: string | null;
  getPartStatus: (partId: string) => PartStatus | null;
}

const RegionHighlight: React.FC<RegionHighlightProps> = ({
  regions,
  selectedPartId,
  getPartStatus,
}) => {
  // Create materials for different states
  const materials = useMemo(() => ({
    selected: new THREE.MeshBasicMaterial({
      color: 0x3b82f6,
      transparent: true,
      opacity: 0.3,
      side: THREE.DoubleSide,
    }),
    error: new THREE.MeshBasicMaterial({
      color: 0xef4444,
      transparent: true,
      opacity: 0.25,
      side: THREE.DoubleSide,
    }),
    warning: new THREE.MeshBasicMaterial({
      color: 0xf59e0b,
      transparent: true,
      opacity: 0.2,
      side: THREE.DoubleSide,
    }),
    maintenance: new THREE.MeshBasicMaterial({
      color: 0x3b82f6,
      transparent: true,
      opacity: 0.15,
      side: THREE.DoubleSide,
    }),
  }), []);

  return (
    <group>
      {regions.map((region) => {
        const isSelected = selectedPartId === region.id;
        const status = getPartStatus(region.id);
        const hasIssue = status && status.status !== 'normal';

        // Only show highlight if selected or has issue
        if (!isSelected && !hasIssue) return null;

        // Get appropriate material
        let material = materials.selected;
        if (!isSelected && status) {
          switch (status.status) {
            case 'error':
              material = materials.error;
              break;
            case 'warning':
              material = materials.warning;
              break;
            case 'maintenance':
              material = materials.maintenance;
              break;
          }
        }

        return (
          <mesh
            key={region.id}
            position={region.center}
            material={material}
          >
            <boxGeometry args={region.size} />
          </mesh>
        );
      })}
    </group>
  );
};

export default RegionHighlight;
