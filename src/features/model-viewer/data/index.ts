/**
 * Model Viewer Data - Unified exports
 */

export { MODEL_REGISTRY } from './modelRegistry';
export { MOCK_PART_STATUS } from './mockPartStatus';
export {
  PART_MAPPINGS,
  findPartByMeshName,
  getMeshNamesForPart,
} from './meshMapping';
export type { PartMapping } from './meshMapping';
// Legacy exports (for backwards compatibility)
export {
  GENERIC_AIRLINER_REGIONS,
  MODEL_REGIONS,
  isPointInBounds,
  findPartByPoint,
  regionsToPartDefinitions,
} from './partRegions';
export type { PartRegion } from './partRegions';
