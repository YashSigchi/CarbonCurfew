// export interface SearchParams {
//   origin: string;
//   destination: string;
//   departureTime?: string;
//   priority: 'fastest' | 'cheapest' | 'eco' | 'balanced';
// }

// export interface RouteStep {
//   mode: 'walk' | 'bus' | 'metro' | 'train' | 'express';
//   duration: number;
//   description: string;
//   line?: string;
//   color?: string;
// }

// export interface Route {
//   id: string;
//   duration: number;
//   cost: number;
//   co2Emissions: number;
//   transfers: number;
//   modes: string[];
//   steps: RouteStep[];
//   score?: number;
// }

// export interface Place {
//   display_name: string;
//   lat: number;
//   lon: number;
//   place_id: string;
// }

// export interface CarbonData {
//   weekly: number;
//   monthly: number;
//   saved: number;
// }








// types.ts - Updated with proper coordinate support

export interface Place {
  display_name: string;
  lat: number;
  lon: number;
  place_id: string;
}

export interface SearchParams {
  origin: string;
  destination: string;
  originCoords?: [number, number]; // [longitude, latitude]
  destinationCoords?: [number, number]; // [longitude, latitude]
  priority: 'fastest' | 'cheapest' | 'eco' | 'balanced';
  departureTime?: string;
}

export interface RouteStep {
  mode: string;
  duration: number;
  description: string;
  distance?: number;
}

export interface Route {
  id: string;
  duration: number; // in minutes
  cost: number; // in currency units
  co2Emissions: number; // in kg
  transfers: number;
  modes: string[];
  steps: RouteStep[];
  geometry?: any; // For map visualization
}

export interface TransitStop {
  id: string;
  name: string;
  lat: number;
  lon: number;
  routes: string[];
}

export interface APIError {
  message: string;
  code?: string;
  details?: any;
}