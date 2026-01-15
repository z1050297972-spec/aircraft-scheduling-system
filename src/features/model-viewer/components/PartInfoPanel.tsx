/**
 * PartInfoPanel - Right side panel showing selected part details and faults
 */

import React from 'react';
import { X, AlertTriangle, AlertCircle, Info, Wrench } from 'lucide-react';
import { PartDefinition, PartStatus, FaultInfo } from '@/types';

interface PartInfoPanelProps {
  selectedPart: PartDefinition | null;
  partStatus: PartStatus | null;
  onClose: () => void;
}

const severityConfig = {
  low: { icon: Info, color: 'text-blue-500', bg: 'bg-blue-50', label: '轻微' },
  medium: { icon: AlertTriangle, color: 'text-amber-500', bg: 'bg-amber-50', label: '中等' },
  high: { icon: AlertCircle, color: 'text-orange-500', bg: 'bg-orange-50', label: '严重' },
  critical: { icon: AlertCircle, color: 'text-red-500', bg: 'bg-red-50', label: '紧急' },
};

const statusConfig = {
  normal: { color: 'bg-green-500', label: '正常' },
  warning: { color: 'bg-amber-500', label: '警告' },
  error: { color: 'bg-red-500', label: '故障' },
  maintenance: { color: 'bg-blue-500', label: '维护中' },
};

const FaultCard: React.FC<{ fault: FaultInfo }> = ({ fault }) => {
  const config = severityConfig[fault.severity];
  const Icon = config.icon;

  return (
    <div className={`${config.bg} rounded-lg p-4 border border-slate-100`}>
      <div className="flex items-start gap-3">
        <Icon className={`w-5 h-5 ${config.color} shrink-0 mt-0.5`} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-medium text-slate-800">{fault.type}</span>
            <span className={`text-xs px-2 py-0.5 rounded-full ${config.bg} ${config.color} font-medium`}>
              {config.label}
            </span>
          </div>
          <p className="text-sm text-slate-600 mb-2">{fault.description}</p>
          {fault.recommendation && (
            <div className="flex items-start gap-2 mt-3 p-2 bg-white/60 rounded-md">
              <Wrench className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
              <p className="text-xs text-slate-500">{fault.recommendation}</p>
            </div>
          )}
          <p className="text-xs text-slate-400 mt-2">
            发现时间: {new Date(fault.detectedAt).toLocaleString('zh-CN')}
          </p>
        </div>
      </div>
    </div>
  );
};

const PartInfoPanel: React.FC<PartInfoPanelProps> = ({
  selectedPart,
  partStatus,
  onClose,
}) => {
  if (!selectedPart) {
    return (
      <div className="w-80 bg-white/95 backdrop-blur-sm border-l border-slate-200 p-6 flex flex-col items-center justify-center text-center">
        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
          <Info className="w-8 h-8 text-slate-400" />
        </div>
        <h3 className="text-lg font-medium text-slate-700 mb-2">选择一个部件</h3>
        <p className="text-sm text-slate-500">
          点击 3D 模型上的部件查看详细信息和故障状态
        </p>
      </div>
    );
  }

  const status = partStatus?.status ?? 'normal';
  const statusStyle = statusConfig[status];

  return (
    <div className="w-80 bg-white/95 backdrop-blur-sm border-l border-slate-200 flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-slate-100 shrink-0">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-lg font-bold text-slate-800">{selectedPart.name}</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-slate-400" />
          </button>
        </div>
        <div className="flex items-center gap-2">
          <span className={`w-2 h-2 rounded-full ${statusStyle.color}`} />
          <span className="text-sm text-slate-600">{statusStyle.label}</span>
          <span className="text-xs text-slate-400">• {selectedPart.category}</span>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-4 space-y-3">
        {partStatus && partStatus.faults.length > 0 ? (
          <>
            <h3 className="text-sm font-medium text-slate-700 mb-2">
              检测到 {partStatus.faults.length} 个问题
            </h3>
            {partStatus.faults.map((fault) => (
              <FaultCard key={fault.id} fault={fault} />
            ))}
          </>
        ) : (
          <div className="text-center py-8">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Info className="w-6 h-6 text-green-500" />
            </div>
            <p className="text-sm text-slate-600">该部件状态正常</p>
            <p className="text-xs text-slate-400 mt-1">未检测到任何故障或警告</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PartInfoPanel;
