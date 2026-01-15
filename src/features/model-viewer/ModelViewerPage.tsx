/**
 * ModelViewerPage - Main page for 3D aircraft model viewer
 * Responsive design with mobile support and mesh-based detection
 */

import React, { useState, useCallback } from 'react';
import { X, Box, RotateCcw, Info, Grid3X3, Tag } from 'lucide-react';
import { AircraftScene, ModelSelector, PartInfoPanel } from './components';
import { usePartSelection, usePartStatus } from './hooks';
import { MODEL_REGISTRY } from './data';

interface ModelViewerPageProps {
  onClose?: () => void;
}

const ModelViewerPage: React.FC<ModelViewerPageProps> = ({ onClose }) => {
  const [selectedModelId, setSelectedModelId] = useState(MODEL_REGISTRY[0]?.id ?? '');
  const [showMobilePanel, setShowMobilePanel] = useState(false);
  const [showWireframe, setShowWireframe] = useState(false);
  const [showLabels, setShowLabels] = useState(false);
  const { selectedPartId, selectedPart, selectPart, clearSelection } = usePartSelection();
  const { getPartStatus } = usePartStatus();

  const currentModel = MODEL_REGISTRY.find((m) => m.id === selectedModelId) ?? MODEL_REGISTRY[0];

  const handlePartClick = useCallback(
    (partId: string | null, partName: string | null) => {
      selectPart(partId, partName);
      // Auto show mobile panel when a part is selected
      if (partId) {
        setShowMobilePanel(true);
      }
    },
    [selectPart]
  );

  const handleModelChange = (modelId: string) => {
    setSelectedModelId(modelId);
    clearSelection();
    setShowMobilePanel(false);
  };

  const handleClearSelection = () => {
    clearSelection();
    setShowMobilePanel(false);
  };

  if (!currentModel) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-slate-500">没有可用的飞机模型</p>
      </div>
    );
  }

  // Convert selectedPart to PartInfoPanel format
  const panelSelectedPart = selectedPart
    ? {
        id: selectedPart.id,
        name: selectedPart.name,
        meshNames: [],
        category: (selectedPart.category || 'other') as 'engine' | 'wing' | 'fuselage' | 'tail' | 'landing-gear' | 'cockpit' | 'other',
      }
    : null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-2 md:p-8">
      <div className="w-full max-w-7xl h-full max-h-[95vh] md:max-h-[90vh] bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header - Responsive */}
        <div className="flex flex-col md:flex-row md:items-center justify-between px-4 md:px-6 py-3 md:py-4 border-b border-slate-100 shrink-0 gap-3 md:gap-0">
          {/* Title and close */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-1.5 md:p-2 bg-blue-100 rounded-lg">
                <Box className="w-4 h-4 md:w-5 md:h-5 text-blue-600" />
              </div>
              <div>
                <h1 className="text-base md:text-lg font-bold text-slate-800">3D 模型查看器</h1>
                <p className="text-[10px] md:text-xs text-slate-500 hidden sm:block">点击部件查看详细状态信息</p>
              </div>
            </div>

            {/* Mobile close button */}
            {onClose && (
              <button
                onClick={onClose}
                className="md:hidden p-2 hover:bg-slate-100 rounded-lg transition-colors"
                title="关闭"
              >
                <X className="w-5 h-5 text-slate-500" />
              </button>
            )}
          </div>

          {/* Controls */}
          <div className="flex items-center gap-2 md:gap-4">
            <div className="flex-1 md:w-48">
              <ModelSelector
                models={MODEL_REGISTRY}
                selectedModelId={selectedModelId}
                onSelect={handleModelChange}
              />
            </div>

            <button
              onClick={handleClearSelection}
              className="flex items-center gap-1 md:gap-2 px-2 md:px-3 py-2 text-xs md:text-sm text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
              title="重置视图"
            >
              <RotateCcw className="w-4 h-4" />
              <span className="hidden sm:inline">重置</span>
            </button>

            {/* Wireframe toggle */}
            <button
              onClick={() => setShowWireframe(!showWireframe)}
              className={`flex items-center gap-1 md:gap-2 px-2 md:px-3 py-2 text-xs md:text-sm rounded-lg transition-colors ${
                showWireframe
                  ? 'text-blue-600 bg-blue-50 hover:bg-blue-100'
                  : 'text-slate-600 hover:text-slate-800 hover:bg-slate-100'
              }`}
              title="显示网格线框"
            >
              <Grid3X3 className="w-4 h-4" />
              <span className="hidden sm:inline">线框</span>
            </button>

            {/* Labels toggle */}
            <button
              onClick={() => setShowLabels(!showLabels)}
              className={`flex items-center gap-1 md:gap-2 px-2 md:px-3 py-2 text-xs md:text-sm rounded-lg transition-colors ${
                showLabels
                  ? 'text-blue-600 bg-blue-50 hover:bg-blue-100'
                  : 'text-slate-600 hover:text-slate-800 hover:bg-slate-100'
              }`}
              title="显示部件标签"
            >
              <Tag className="w-4 h-4" />
              <span className="hidden sm:inline">标签</span>
            </button>

            {/* Mobile info button */}
            {selectedPart && (
              <button
                onClick={() => setShowMobilePanel(true)}
                className="md:hidden flex items-center gap-1 px-2 py-2 text-xs text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
              >
                <Info className="w-4 h-4" />
                详情
              </button>
            )}

            {/* Desktop close button */}
            {onClose && (
              <button
                onClick={onClose}
                className="hidden md:block p-2 hover:bg-slate-100 rounded-lg transition-colors"
                title="关闭"
              >
                <X className="w-5 h-5 text-slate-500" />
              </button>
            )}
          </div>
        </div>

        {/* Main Content - Responsive */}
        <div className="flex-1 flex flex-col md:flex-row min-h-0">
          {/* 3D Scene */}
          <div className="flex-1 p-2 md:p-4">
            <AircraftScene
              modelPath={currentModel.modelPath}
              selectedPartId={selectedPartId}
              onPartClick={handlePartClick}
              showWireframe={showWireframe}
              showLabels={showLabels}
              getPartStatus={getPartStatus}
            />
          </div>

          {/* Desktop Info Panel */}
          <div className="hidden md:block">
            <PartInfoPanel
              selectedPart={panelSelectedPart}
              partStatus={selectedPartId ? getPartStatus(selectedPartId) : null}
              onClose={handleClearSelection}
            />
          </div>
        </div>

        {/* Mobile Bottom Drawer */}
        {showMobilePanel && (
          <div className="md:hidden fixed inset-0 z-60">
            {/* Backdrop */}
            <div
              className="absolute inset-0 bg-black/50"
              onClick={() => setShowMobilePanel(false)}
            />
            {/* Drawer */}
            <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl max-h-[70vh] overflow-auto animate-in slide-in-from-bottom duration-300">
              <div className="sticky top-0 bg-white px-4 py-3 border-b border-slate-100 flex items-center justify-between">
                <h3 className="font-bold text-slate-800">
                  {selectedPart?.name ?? '部件详情'}
                </h3>
                <button
                  onClick={() => setShowMobilePanel(false)}
                  className="p-1 hover:bg-slate-100 rounded-lg"
                >
                  <X className="w-5 h-5 text-slate-400" />
                </button>
              </div>
              <div className="p-4">
                {selectedPart && selectedPartId ? (
                  <MobilePartInfo
                    partStatus={getPartStatus(selectedPartId)}
                  />
                ) : (
                  <p className="text-center text-slate-500 py-8">
                    点击模型上的部件查看详情
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Footer with legend - Hidden on mobile */}
        <div className="hidden md:block px-6 py-3 bg-slate-50 border-t border-slate-100 shrink-0">
          <div className="flex items-center gap-6 text-xs text-slate-500">
            <span className="font-medium">状态图例:</span>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-500" />
              <span>正常</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-500" />
              <span>警告</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-red-500" />
              <span>故障</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-500" />
              <span>维护中</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Mobile Part Info Component
import { PartStatus } from '@/types';
import { AlertTriangle, AlertCircle, Info as InfoIcon, Wrench } from 'lucide-react';

interface MobilePartInfoProps {
  partStatus: PartStatus | null;
}

const MobilePartInfo: React.FC<MobilePartInfoProps> = ({ partStatus }) => {
  if (!partStatus || partStatus.faults.length === 0) {
    return (
      <div className="text-center py-4">
        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
          <InfoIcon className="w-6 h-6 text-green-500" />
        </div>
        <p className="text-sm text-slate-600">该部件状态正常</p>
      </div>
    );
  }

  const severityConfig = {
    low: { icon: InfoIcon, color: 'text-blue-500', bg: 'bg-blue-50' },
    medium: { icon: AlertTriangle, color: 'text-amber-500', bg: 'bg-amber-50' },
    high: { icon: AlertCircle, color: 'text-orange-500', bg: 'bg-orange-50' },
    critical: { icon: AlertCircle, color: 'text-red-500', bg: 'bg-red-50' },
  };

  return (
    <div className="space-y-3">
      {partStatus.faults.map((fault) => {
        const config = severityConfig[fault.severity];
        const Icon = config.icon;
        return (
          <div key={fault.id} className={`${config.bg} rounded-lg p-3`}>
            <div className="flex items-start gap-2">
              <Icon className={`w-4 h-4 ${config.color} shrink-0 mt-0.5`} />
              <div className="flex-1">
                <p className="font-medium text-slate-800 text-sm">{fault.type}</p>
                <p className="text-xs text-slate-600 mt-1">{fault.description}</p>
                {fault.recommendation && (
                  <div className="flex items-start gap-1.5 mt-2 p-2 bg-white/60 rounded">
                    <Wrench className="w-3 h-3 text-slate-400 shrink-0 mt-0.5" />
                    <p className="text-xs text-slate-500">{fault.recommendation}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ModelViewerPage;
