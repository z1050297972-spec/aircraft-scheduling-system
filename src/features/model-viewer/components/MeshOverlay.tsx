/**
 * MeshOverlay - Visual overlay showing mesh structure with wireframes and labels
 * Colors are based on part health status
 */

import React, { useMemo } from 'react';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { findPartByMeshName, PART_MAPPINGS } from '../data/meshMapping';
import { PartStatus } from '@/types';

interface MeshOverlayProps {
  scene: THREE.Object3D;
  showWireframe: boolean;
  showLabels: boolean;
  getPartStatus: (partId: string) => PartStatus | null;
}

// Health status colors
const STATUS_COLORS: Record<string, number> = {
  normal: 0x22c55e,      // Green
  warning: 0xf59e0b,     // Amber
  error: 0xef4444,       // Red
  maintenance: 0x3b82f6, // Blue
  default: 0x64748b,     // Slate (unknown)
};

// Get color based on part health status
const getStatusColor = (status: PartStatus | null): number => {
  if (!status) return STATUS_COLORS.normal ?? 0x22c55e;
  return STATUS_COLORS[status.status] ?? STATUS_COLORS.default ?? 0x64748b;
};

// Get CSS class based on part health status
const getStatusBgClass = (status: PartStatus | null): string => {
  if (!status || status.status === 'normal') return 'bg-green-500';
  switch (status.status) {
    case 'warning': return 'bg-amber-500';
    case 'error': return 'bg-red-500';
    case 'maintenance': return 'bg-blue-500';
    default: return 'bg-slate-500';
  }
};

const MeshOverlay: React.FC<MeshOverlayProps> = ({
  scene,
  showWireframe,
  showLabels,
  getPartStatus,
}) => {
  // Collect mesh data for visualization
  const meshData = useMemo(() => {
    const data: Array<{
      mesh: THREE.Mesh;
      name: string;
      partId: string | null;
      partName: string | null;
      category: string;
      center: THREE.Vector3;
    }> = [];

    scene.traverse((child) => {
      if (child instanceof THREE.Mesh && child.name) {
        const part = findPartByMeshName(child.name);

        // Calculate mesh center
        const box = new THREE.Box3().setFromObject(child);
        const center = box.getCenter(new THREE.Vector3());

        data.push({
          mesh: child,
          name: child.name,
          partId: part?.id ?? null,
          partName: part?.name ?? null,
          category: part?.category ?? 'default',
          center,
        });
      }
    });

    return data;
  }, [scene]);

  // Group meshes by part for label display (avoid too many labels)
  const partLabels = useMemo(() => {
    const labelMap = new Map<string, { name: string; center: THREE.Vector3; category: string }>();

    PART_MAPPINGS.forEach((part) => {
      // Find all meshes for this part
      const partMeshes = meshData.filter((m) => m.partId === part.id);

      if (partMeshes.length > 0) {
        // Calculate average center for the label position
        const avgCenter = new THREE.Vector3();
        partMeshes.forEach((m) => avgCenter.add(m.center));
        avgCenter.divideScalar(partMeshes.length);

        labelMap.set(part.id, {
          name: part.name,
          center: avgCenter,
          category: part.category,
        });
      }
    });

    return Array.from(labelMap.entries());
  }, [meshData]);

  if (!showWireframe && !showLabels) return null;

  return (
    <group>
      {/* Wireframe overlays */}
      {showWireframe && meshData.map((item, index) => {
        const geometry = item.mesh.geometry;
        if (!geometry) return null;

        const edges = new THREE.EdgesGeometry(geometry, 15);

        // Get color based on health status
        const partStatus = item.partId ? getPartStatus(item.partId) : null;
        const color = getStatusColor(partStatus);

        // Get world transform
        const worldPosition = item.mesh.getWorldPosition(new THREE.Vector3());
        const worldQuaternion = item.mesh.getWorldQuaternion(new THREE.Quaternion());
        const worldScale = item.mesh.getWorldScale(new THREE.Vector3());

        // Convert quaternion to euler for React Three Fiber
        const euler = new THREE.Euler().setFromQuaternion(worldQuaternion);

        return (
          <lineSegments
            key={`wire-${index}`}
            geometry={edges}
            position={worldPosition}
            rotation={euler}
            scale={worldScale}
          >
            <lineBasicMaterial
              color={color}
              transparent
              opacity={0.6}
              depthTest={true}
            />
          </lineSegments>
        );
      })}

      {/* Part labels */}
      {showLabels && partLabels.map(([partId, data]) => {
        const partStatus = getPartStatus(partId);
        const bgColor = getStatusBgClass(partStatus);

        return (
          <Html
            key={`label-${partId}`}
            position={[data.center.x, data.center.y + 2, data.center.z]}
            center
            distanceFactor={30}
            occlude={false}
            style={{ pointerEvents: 'none' }}
          >
            <div className={`${bgColor} text-white text-[10px] px-2 py-0.5 rounded-full whitespace-nowrap shadow-lg font-medium`}>
              {data.name}
            </div>
          </Html>
        );
      })}
    </group>
  );
};

export default MeshOverlay;
