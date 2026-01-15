/**
 * AircraftModel - 3D aircraft model with mesh-based click detection
 * Uses actual mesh names for precise part detection and highlighting
 */

import React, { useRef, useEffect, useMemo } from 'react';
import { useGLTF } from '@react-three/drei';
import { ThreeEvent } from '@react-three/fiber';
import * as THREE from 'three';
import { findPartByMeshName, getMeshNamesForPart } from '../data/meshMapping';
import MeshOverlay from './MeshOverlay';
import { PartStatus } from '@/types';

interface AircraftModelProps {
  modelPath: string;
  selectedPartId: string | null;
  onPartClick: (partId: string | null, partName: string | null) => void;
  showWireframe?: boolean;
  showLabels?: boolean;
  getPartStatus: (partId: string) => PartStatus | null;
}

const AircraftModel: React.FC<AircraftModelProps> = ({
  modelPath,
  selectedPartId,
  onPartClick,
  showWireframe = false,
  showLabels = false,
  getPartStatus,
}) => {
  const groupRef = useRef<THREE.Group>(null);
  const { scene } = useGLTF(modelPath);

  // Collect all mesh names for reference
  const allMeshNames = useMemo(() => {
    const names: string[] = [];
    scene?.traverse((child) => {
      if (child instanceof THREE.Mesh && child.name) {
        names.push(child.name);
      }
    });
    return names;
  }, [scene]);

  // Debug: Log model info on load
  useEffect(() => {
    if (!scene) return;

    const box = new THREE.Box3().setFromObject(scene);
    const size = box.getSize(new THREE.Vector3());

    console.log('=== 模型信息 ===');
    console.log('模型路径:', modelPath);
    console.log('Mesh 数量:', allMeshNames.length);
    console.log('尺寸 (x, y, z): [' + size.toArray().map(v => v.toFixed(2)).join(', ') + ']');
    console.log('================');
  }, [scene, modelPath, allMeshNames]);

  // Apply visual effects based on selection state
  useEffect(() => {
    if (!scene) return;

    // Get mesh names for the selected part
    const selectedMeshNames = selectedPartId
      ? getMeshNamesForPart(selectedPartId, allMeshNames)
      : [];

    scene.traverse((child) => {
      if (child instanceof THREE.Mesh && child.material) {
        // Clone material to avoid sharing issues
        if (!child.userData.originalMaterial) {
          child.userData.originalMaterial = child.material.clone();
          child.material = child.material.clone();
        }

        const material = child.material as THREE.MeshStandardMaterial;
        material.transparent = true;

        if (selectedPartId === null) {
          // No selection - show model normally
          material.opacity = 1;
          material.emissive = new THREE.Color(0x000000);
          material.emissiveIntensity = 0;
        } else {
          // Check if this mesh belongs to the selected part
          const isSelected = selectedMeshNames.some(name =>
            child.name.toLowerCase().includes(name.toLowerCase()) ||
            name.toLowerCase().includes(child.name.toLowerCase()) ||
            child.name === name
          );

          if (isSelected) {
            // Highlight selected part
            material.opacity = 1;
            material.emissive = new THREE.Color(0x3b82f6); // Blue highlight
            material.emissiveIntensity = 0.3;
          } else {
            // Dim non-selected parts
            material.opacity = 0.3;
            material.emissive = new THREE.Color(0x000000);
            material.emissiveIntensity = 0;
          }
        }
      }
    });
  }, [scene, selectedPartId, allMeshNames]);

  // Handle click on model - use mesh name detection
  const handleClick = (event: ThreeEvent<MouseEvent>) => {
    event.stopPropagation();

    // Get the clicked mesh
    const clickedMesh = event.object as THREE.Mesh;
    const meshName = clickedMesh.name;

    console.log('--- 点击 Mesh ---');
    console.log('Mesh 名称:', meshName);

    // Find which part this mesh belongs to
    const part = findPartByMeshName(meshName);

    if (part) {
      console.log('匹配部件:', part.name, `(${part.id})`);
      onPartClick(part.id, part.name);
    } else {
      console.log('未匹配到部件定义');
      onPartClick(null, null);
    }
  };

  return (
    <group ref={groupRef}>
      <primitive
        object={scene}
        onClick={handleClick}
        scale={1}
      />
      {/* Mesh structure overlay */}
      {scene && (showWireframe || showLabels) && (
        <MeshOverlay
          scene={scene}
          showWireframe={showWireframe}
          showLabels={showLabels}
          getPartStatus={getPartStatus}
        />
      )}
    </group>
  );
};

export default AircraftModel;

// Preload helper
export const preloadModel = (modelPath: string) => {
  useGLTF.preload(modelPath);
};
