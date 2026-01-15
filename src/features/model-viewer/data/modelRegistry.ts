/**
 * Model Registry - Aircraft model definitions and part mappings
 */

import { AircraftModelType } from '@/types';

export const MODEL_REGISTRY: AircraftModelType[] = [
  {
    id: 'boeing-737',
    name: 'Boeing 737-800',
    modelPath: '/models/boeing-737/scene.glb',
    parts: [
      { id: 'engine-left', name: '左发动机', meshNames: ['engine_left', 'Engine_L'], category: 'engine' },
      { id: 'engine-right', name: '右发动机', meshNames: ['engine_right', 'Engine_R'], category: 'engine' },
      { id: 'wing-left', name: '左机翼', meshNames: ['wing_left', 'Wing_L'], category: 'wing' },
      { id: 'wing-right', name: '右机翼', meshNames: ['wing_right', 'Wing_R'], category: 'wing' },
      { id: 'fuselage', name: '机身', meshNames: ['fuselage', 'Fuselage', 'body'], category: 'fuselage' },
      { id: 'tail', name: '尾翼', meshNames: ['tail', 'Tail', 'vertical_stabilizer'], category: 'tail' },
      { id: 'landing-gear-front', name: '前起落架', meshNames: ['landing_gear_front', 'Gear_Front'], category: 'landing-gear' },
      { id: 'landing-gear-left', name: '左主起落架', meshNames: ['landing_gear_left', 'Gear_L'], category: 'landing-gear' },
      { id: 'landing-gear-right', name: '右主起落架', meshNames: ['landing_gear_right', 'Gear_R'], category: 'landing-gear' },
      { id: 'cockpit', name: '驾驶舱', meshNames: ['cockpit', 'Cockpit'], category: 'cockpit' },
    ],
  },
  {
    id: 'airbus-a320',
    name: 'Airbus A320',
    modelPath: '/models/airbus-a320/scene.glb',
    parts: [
      { id: 'engine-left', name: '左发动机', meshNames: ['engine_left', 'Engine_L'], category: 'engine' },
      { id: 'engine-right', name: '右发动机', meshNames: ['engine_right', 'Engine_R'], category: 'engine' },
      { id: 'wing-left', name: '左机翼', meshNames: ['wing_left', 'Wing_L'], category: 'wing' },
      { id: 'wing-right', name: '右机翼', meshNames: ['wing_right', 'Wing_R'], category: 'wing' },
      { id: 'fuselage', name: '机身', meshNames: ['fuselage', 'Fuselage'], category: 'fuselage' },
      { id: 'tail', name: '尾翼', meshNames: ['tail', 'Tail'], category: 'tail' },
      { id: 'landing-gear-front', name: '前起落架', meshNames: ['landing_gear_front'], category: 'landing-gear' },
      { id: 'landing-gear-left', name: '左主起落架', meshNames: ['landing_gear_left'], category: 'landing-gear' },
      { id: 'landing-gear-right', name: '右主起落架', meshNames: ['landing_gear_right'], category: 'landing-gear' },
      { id: 'cockpit', name: '驾驶舱', meshNames: ['cockpit'], category: 'cockpit' },
    ],
  },
  {
    id: 'generic-airliner',
    name: '通用民航客机',
    modelPath: '/models/generic-airliner/scene.glb',
    parts: [
      { id: 'engine-left', name: '左发动机', meshNames: ['engine_left'], category: 'engine' },
      { id: 'engine-right', name: '右发动机', meshNames: ['engine_right'], category: 'engine' },
      { id: 'wing-left', name: '左机翼', meshNames: ['wing_left'], category: 'wing' },
      { id: 'wing-right', name: '右机翼', meshNames: ['wing_right'], category: 'wing' },
      { id: 'fuselage', name: '机身', meshNames: ['fuselage'], category: 'fuselage' },
      { id: 'tail', name: '尾翼', meshNames: ['tail'], category: 'tail' },
      { id: 'landing-gear-front', name: '前起落架', meshNames: ['landing_gear_front'], category: 'landing-gear' },
      { id: 'cockpit', name: '驾驶舱', meshNames: ['cockpit'], category: 'cockpit' },
    ],
  },
];
