/**
 * Types - Unified export for all type definitions
 */

// Aircraft types
export type { Consumables, Aircraft } from './aircraft';

// Test case types
export type {
  TestTask,
  TestReport,
  GeneratedScenario,
  SavedTestCase,
} from './testCase';

// Common types
export type { ViewState } from './common';

// 3D Model viewer types
export type {
  AircraftModelType,
  PartDefinition,
  PartCategory,
  PartStatus,
  FaultInfo,
} from './model-viewer';
