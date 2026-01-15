/**
 * ModelSelector - Dropdown for selecting aircraft model
 */

import React from 'react';
import { ChevronDown } from 'lucide-react';
import { AircraftModelType } from '@/types';

interface ModelSelectorProps {
  models: AircraftModelType[];
  selectedModelId: string;
  onSelect: (modelId: string) => void;
}

const ModelSelector: React.FC<ModelSelectorProps> = ({
  models,
  selectedModelId,
  onSelect,
}) => {
  const selectedModel = models.find((m) => m.id === selectedModelId);

  return (
    <div className="relative">
      <label className="block text-xs font-medium text-slate-500 mb-1">
        选择机型
      </label>
      <div className="relative">
        <select
          value={selectedModelId}
          onChange={(e) => onSelect(e.target.value)}
          className="w-full appearance-none bg-white border border-slate-200 rounded-lg px-4 py-2.5 pr-10 text-sm font-medium text-slate-700 shadow-sm hover:border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all cursor-pointer"
        >
          {models.map((model) => (
            <option key={model.id} value={model.id}>
              {model.name}
            </option>
          ))}
        </select>
        <ChevronDown
          className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none"
        />
      </div>
      {selectedModel && (
        <p className="mt-1 text-xs text-slate-400">
          共 {selectedModel.parts.length} 个可检测部件
        </p>
      )}
    </div>
  );
};

export default ModelSelector;
