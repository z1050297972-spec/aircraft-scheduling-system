/**
 * Part Regions - Define 3D bounding boxes for aircraft parts
 * These regions are used for hit detection regardless of model mesh structure
 */

import { AircraftModelType } from '@/types';

// Bounding box definition for a part region
export interface PartRegion {
  id: string;
  name: string;
  category: string;
  // Bounding box in model's local coordinates
  bounds: {
    min: [number, number, number]; // [x, y, z]
    max: [number, number, number];
  };
  // Center point for highlight overlay
  center: [number, number, number];
  // Size for highlight overlay
  size: [number, number, number];
}

// Check if a point is inside a bounding box
export const isPointInBounds = (
  point: { x: number; y: number; z: number },
  bounds: { min: [number, number, number]; max: [number, number, number] }
): boolean => {
  return (
    point.x >= bounds.min[0] &&
    point.x <= bounds.max[0] &&
    point.y >= bounds.min[1] &&
    point.y <= bounds.max[1] &&
    point.z >= bounds.min[2] &&
    point.z <= bounds.max[2]
  );
};

// Find which part a point belongs to
export const findPartByPoint = (
  point: { x: number; y: number; z: number },
  regions: PartRegion[]
): PartRegion | null => {
  return regions.find((region) => isPointInBounds(point, region.bounds)) ?? null;
};

// Default regions for a generic airliner (approximate coordinates)
// Calibrated for Boeing 747 model: size [65.42, 18.35, 70.94], center [0.13, 5.18, -5.60]
// X: wingspan (-32 to 32), Y: height (-4 to 14), Z: length (tail -41 to nose 30)
export const GENERIC_AIRLINER_REGIONS: PartRegion[] = [
  {
    id: 'cockpit',
    name: '驾驶舱',
    category: 'cockpit',
    bounds: { min: [-4, 4, 22], max: [4, 14, 30] },
    center: [0, 9, 26],
    size: [8, 10, 8],
  },
  {
    id: 'fuselage-front',
    name: '前机身',
    category: 'fuselage',
    bounds: { min: [-5, 0, 8], max: [5, 12, 22] },
    center: [0, 6, 15],
    size: [10, 12, 14],
  },
  {
    id: 'fuselage-center',
    name: '中机身',
    category: 'fuselage',
    bounds: { min: [-5, 0, -15], max: [5, 12, 8] },
    center: [0, 6, -3.5],
    size: [10, 12, 23],
  },
  {
    id: 'fuselage-rear',
    name: '后机身',
    category: 'fuselage',
    bounds: { min: [-4, 0, -32], max: [4, 10, -15] },
    center: [0, 5, -23.5],
    size: [8, 10, 17],
  },
  {
    id: 'wing-left',
    name: '左机翼',
    category: 'wing',
    bounds: { min: [-33, -1, -12], max: [-5, 6, 8] },
    center: [-19, 2.5, -2],
    size: [28, 7, 20],
  },
  {
    id: 'wing-right',
    name: '右机翼',
    category: 'wing',
    bounds: { min: [5, -1, -12], max: [33, 6, 8] },
    center: [19, 2.5, -2],
    size: [28, 7, 20],
  },
  {
    id: 'engine-left',
    name: '左发动机',
    category: 'engine',
    bounds: { min: [-28, -4, -5], max: [-12, 3, 8] },
    center: [-20, -0.5, 1.5],
    size: [16, 7, 13],
  },
  {
    id: 'engine-right',
    name: '右发动机',
    category: 'engine',
    bounds: { min: [12, -4, -5], max: [28, 3, 8] },
    center: [20, -0.5, 1.5],
    size: [16, 7, 13],
  },
  {
    id: 'tail-vertical',
    name: '垂直尾翼',
    category: 'tail',
    bounds: { min: [-3, 8, -41], max: [3, 15, -30] },
    center: [0, 11.5, -35.5],
    size: [6, 7, 11],
  },
  {
    id: 'tail-horizontal-left',
    name: '左水平尾翼',
    category: 'tail',
    bounds: { min: [-18, 5, -41], max: [-3, 9, -32] },
    center: [-10.5, 7, -36.5],
    size: [15, 4, 9],
  },
  {
    id: 'tail-horizontal-right',
    name: '右水平尾翼',
    category: 'tail',
    bounds: { min: [3, 5, -41], max: [18, 9, -32] },
    center: [10.5, 7, -36.5],
    size: [15, 4, 9],
  },
  {
    id: 'landing-gear-front',
    name: '前起落架',
    category: 'landing-gear',
    bounds: { min: [-3, -4, 18], max: [3, 1, 25] },
    center: [0, -1.5, 21.5],
    size: [6, 5, 7],
  },
  {
    id: 'landing-gear-left',
    name: '左主起落架',
    category: 'landing-gear',
    bounds: { min: [-12, -4, -8], max: [-4, 1, 2] },
    center: [-8, -1.5, -3],
    size: [8, 5, 10],
  },
  {
    id: 'landing-gear-right',
    name: '右主起落架',
    category: 'landing-gear',
    bounds: { min: [4, -4, -8], max: [12, 1, 2] },
    center: [8, -1.5, -3],
    size: [8, 5, 10],
  },
];

// Model configurations with their part regions
export const MODEL_REGIONS: Record<string, PartRegion[]> = {
  'boeing-737': GENERIC_AIRLINER_REGIONS,
  'airbus-a320': GENERIC_AIRLINER_REGIONS,
  'generic-airliner': GENERIC_AIRLINER_REGIONS,
};

// Convert part regions to PartDefinition format for compatibility
export const regionsToPartDefinitions = (regions: PartRegion[]): AircraftModelType['parts'] => {
  return regions.map((region) => ({
    id: region.id,
    name: region.name,
    meshNames: [region.id], // Not used in region-based detection
    category: region.category as AircraftModelType['parts'][number]['category'],
  }));
};
