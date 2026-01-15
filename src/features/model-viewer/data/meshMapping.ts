/**
 * Mesh Mapping - Map mesh names to part categories
 * This enables precise click detection based on actual mesh names
 */

export interface PartMapping {
  id: string;
  name: string;
  category: string;
  meshPatterns: string[]; // Patterns to match mesh names (supports prefix matching)
}

// Part definitions with mesh name patterns
export const PART_MAPPINGS: PartMapping[] = [
  {
    id: 'cockpit',
    name: '驾驶舱',
    category: 'cockpit',
    meshPatterns: ['cockpit', 'nosecone', 'RHwiper', 'LHwiper'],
  },
  {
    id: 'fuselage',
    name: '机身',
    category: 'fuselage',
    meshPatterns: ['fuselage', 'lav', 'cargodoor'],
  },
  {
    id: 'wing-left',
    name: '左机翼',
    category: 'wing',
    meshPatterns: ['wing_left', 'winglet_left', 'LEinbL'],
  },
  {
    id: 'wing-right',
    name: '右机翼',
    category: 'wing',
    meshPatterns: ['wing_right', 'winglet_right', 'LEinbR'],
  },
  {
    id: 'flap-left',
    name: '左襟翼',
    category: 'wing',
    meshPatterns: ['flap_left'],
  },
  {
    id: 'flap-right',
    name: '右襟翼',
    category: 'wing',
    meshPatterns: ['flap_right'],
  },
  {
    id: 'aileron-left',
    name: '左副翼',
    category: 'wing',
    meshPatterns: ['aileron_left'],
  },
  {
    id: 'aileron-right',
    name: '右副翼',
    category: 'wing',
    meshPatterns: ['aileron_right'],
  },
  {
    id: 'speedbrake-left',
    name: '左扰流板',
    category: 'wing',
    meshPatterns: ['speedbrake_left'],
  },
  {
    id: 'speedbrake-right',
    name: '右扰流板',
    category: 'wing',
    meshPatterns: ['speedbrake_right'],
  },
  {
    id: 'engine-1',
    name: '1号发动机',
    category: 'engine',
    meshPatterns: ['eng1_', 'Blades003', 'Cone003', 'engine_body_0003', 'engine_body_1003', 'engine_chrome003', 'engine_nozzle003', 'engine_reverser003'],
  },
  {
    id: 'engine-2',
    name: '2号发动机',
    category: 'engine',
    meshPatterns: ['eng2_', 'Blades002', 'Cone002', 'engine_body_0002', 'engine_body_1002', 'engine_chrome002', 'engine_nozzle002', 'engine_reverser002'],
  },
  {
    id: 'engine-3',
    name: '3号发动机',
    category: 'engine',
    meshPatterns: ['eng3_', 'Blades001', 'Cone001', 'engine_body_0001', 'engine_body_1001', 'engine_chrome001', 'engine_nozzle001', 'engine_reverser001'],
  },
  {
    id: 'engine-4',
    name: '4号发动机',
    category: 'engine',
    meshPatterns: ['eng4_', 'Blades', 'Cone', 'engine_body_0', 'engine_body_1', 'engine_chrome', 'engine_nozzle', 'engine_reverser'],
  },
  {
    id: 'tail-vertical',
    name: '垂直尾翼',
    category: 'tail',
    meshPatterns: ['vstab', 'rudder'],
  },
  {
    id: 'tail-horizontal',
    name: '水平尾翼',
    category: 'tail',
    meshPatterns: ['hstab', 'elevator'],
  },
  {
    id: 'landing-gear-nose',
    name: '前起落架',
    category: 'landing-gear',
    meshPatterns: ['nlg_'],
  },
  {
    id: 'landing-gear-main',
    name: '主起落架',
    category: 'landing-gear',
    meshPatterns: ['wlg_'],
  },
];

/**
 * Find which part a mesh belongs to based on its name
 */
export const findPartByMeshName = (meshName: string): PartMapping | null => {
  if (!meshName) return null;

  const lowerName = meshName.toLowerCase();

  for (const part of PART_MAPPINGS) {
    for (const pattern of part.meshPatterns) {
      // Check if mesh name starts with or contains the pattern
      if (lowerName.startsWith(pattern.toLowerCase()) ||
          lowerName.includes(pattern.toLowerCase())) {
        return part;
      }
    }
  }

  return null;
};

/**
 * Get all mesh names that belong to a specific part
 */
export const getMeshNamesForPart = (partId: string, allMeshNames: string[]): string[] => {
  const part = PART_MAPPINGS.find(p => p.id === partId);
  if (!part) return [];

  return allMeshNames.filter(meshName => {
    const lowerName = meshName.toLowerCase();
    return part.meshPatterns.some(pattern =>
      lowerName.startsWith(pattern.toLowerCase()) ||
      lowerName.includes(pattern.toLowerCase())
    );
  });
};
