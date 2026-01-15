/**
 * AircraftScene - 3D scene container with Canvas, lights, and controls
 * Uses mesh-based detection for precise part selection
 */

import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, PerspectiveCamera } from '@react-three/drei';
import AircraftModel from './AircraftModel';
import LoadingProgress from './LoadingProgress';
import { PartStatus } from '@/types';

interface AircraftSceneProps {
  modelPath: string;
  selectedPartId: string | null;
  onPartClick: (partId: string | null, partName: string | null) => void;
  showWireframe?: boolean;
  showLabels?: boolean;
  getPartStatus: (partId: string) => PartStatus | null;
}

const AircraftScene: React.FC<AircraftSceneProps> = ({
  modelPath,
  selectedPartId,
  onPartClick,
  showWireframe = false,
  showLabels = false,
  getPartStatus,
}) => {
  return (
    <div className="w-full h-full bg-gradient-to-br from-slate-100 to-slate-200 rounded-xl overflow-hidden">
      <Canvas
        shadows
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true }}
        onPointerMissed={() => onPartClick(null, null)}
      >
        <PerspectiveCamera makeDefault position={[15, 8, 15]} fov={45} />

        {/* Lighting */}
        <ambientLight intensity={0.5} />
        <directionalLight
          position={[10, 10, 5]}
          intensity={1}
          castShadow
          shadow-mapSize={[2048, 2048]}
        />
        <directionalLight position={[-10, 5, -5]} intensity={0.3} />

        {/* Environment for reflections */}
        <Environment preset="city" />

        {/* Model */}
        <Suspense fallback={<LoadingProgress />}>
          <AircraftModel
            modelPath={modelPath}
            selectedPartId={selectedPartId}
            onPartClick={onPartClick}
            showWireframe={showWireframe}
            showLabels={showLabels}
            getPartStatus={getPartStatus}
          />
        </Suspense>

        {/* Controls */}
        <OrbitControls
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          minDistance={5}
          maxDistance={50}
          maxPolarAngle={Math.PI / 2}
          touches={{
            ONE: 1, // ROTATE
            TWO: 2, // DOLLY_PAN
          }}
        />

        {/* Ground plane for shadow */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -3, 0]} receiveShadow>
          <planeGeometry args={[100, 100]} />
          <shadowMaterial transparent opacity={0.2} />
        </mesh>
      </Canvas>
    </div>
  );
};

export default AircraftScene;
