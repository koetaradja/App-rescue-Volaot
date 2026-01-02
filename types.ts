
export interface Catch {
  id: string;
  name: string;
  weight: number;
  date: string;
  imageUrl: string;
  location: [number, number];
}

export interface Boat {
  id: string;
  name: string;
  location: [number, number];
  lastCatchImage?: string;
}

export interface FishSpot {
  id: string;
  location: [number, number];
  estimateCount: number;
  type: string;
}

export interface UAV {
  id: string;
  name: string;
  location: [number, number];
  status: 'Patrolling' | 'Searching' | 'Returning';
  battery: number;
  altitude: number;
  speed: number;
  lastAerialPhoto?: string;
  detections: FishSpot[];
}

export enum MapStyle {
  NORMAL = 'Normal',
  HYBRID = 'Hybrid',
  NIGHT = 'Night',
  BATHYMETRY = 'Bathymetry'
}
