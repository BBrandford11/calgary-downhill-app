// Racer Types
export interface Racer {
  id: string;
  name: string;
  number?: string;
  nickname?: string;
  ageGroup?: string;
  totalPoints?: number;
  seasonPoints: number;
}

// Event Types
export interface Event {
  id: string;
  name: string;
  date: string;
  totalRounds: number;
  racersPerHeat: number;
  racers: string[];
  rounds: Round[];
}

export interface Round {
  roundNumber: number;
  heats: Heat[];
  status: 'pending' | 'in-progress' | 'completed';
}

// Heat Types
export interface Heat {
  id: string;
  racerIds: string[];
  status: 'pending' | 'completed';
  results?: HeatResult[];
}

export interface HeatResult {
  racerId: string;
  position: number;
  points: number;
}

// Result Types
export interface RacerResult {
  racerId: string;
  eventId: string;
  roundNumber: number;
  heatNumber: number;
  position: number;
  points: number;
}

// Leaderboard Types
export interface LeaderboardEntry {
  racer: Racer;
  seasonPoints: number;
}

// Season Types
export interface Season {
  id: string;
  year: number;
  events: Event[];
  leaderboard: LeaderboardEntry[];
} 