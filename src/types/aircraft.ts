/**
 * Aircraft related types
 */

export interface Consumables {
  fuelLevel: number; // Percentage
  oilLevel: number; // Percentage
  hydraulicFluid: number; // Percentage
}

export interface Aircraft {
  id: string;
  code: string; // e.g., J-20-01
  model: string; // e.g., J-20
  status: 'normal' | 'maintenance' | 'mission';
  maxSpeed: number; // km/h
  maxHeight: number; // meters
  health: number; // 0-100 score
  consumables: Consumables;
  lastMaintenance: string;
}
