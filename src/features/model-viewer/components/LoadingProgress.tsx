/**
 * LoadingProgress - 3D model loading progress indicator
 */

import React from 'react';
import { Html, useProgress } from '@react-three/drei';

const LoadingProgress: React.FC = () => {
  const { progress } = useProgress();

  return (
    <Html center>
      <div className="flex flex-col items-center justify-center">
        <div className="w-48 h-2 bg-slate-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-blue-500 transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="mt-2 text-sm text-slate-600 font-medium">
          加载中... {progress.toFixed(0)}%
        </p>
      </div>
    </Html>
  );
};

export default LoadingProgress;
