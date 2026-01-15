/**
 * 3D Model Viewer Types
 */

/** 飞机机型 */
export interface AircraftModelType {
  id: string;
  name: string;
  modelPath: string;
  thumbnailPath?: string;
  parts: PartDefinition[];
}

/** 部件定义 */
export interface PartDefinition {
  id: string;
  name: string;
  meshNames: string[];
  category: PartCategory;
}

/** 部件类别 */
export type PartCategory =
  | 'engine'
  | 'wing'
  | 'fuselage'
  | 'tail'
  | 'landing-gear'
  | 'cockpit'
  | 'other';

/** 部件状态 */
export interface PartStatus {
  partId: string;
  status: 'normal' | 'warning' | 'error' | 'maintenance';
  faults: FaultInfo[];
}

/** 故障信息 */
export interface FaultInfo {
  id: string;
  type: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  detectedAt: string;
  recommendation?: string;
}
