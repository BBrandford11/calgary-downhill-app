import { Heat, Racer } from '@/types';
import { generateId } from './utils';

interface RacerWithPoints {
  id: string;
  points: number;
}

export function generateFirstRoundHeats(
  racerIds: string[],
  racersPerHeat: number
): Heat[] {
  // Create a shuffled copy of the racer IDs
  const shuffledRacers = [...racerIds].sort(() => Math.random() - 0.5);
  return createHeats(shuffledRacers, racersPerHeat);
}

export function generateNextRoundHeats(
  racerPoints: RacerWithPoints[],
  racersPerHeat: number
): Heat[] {
  // Sort racers by points in descending order
  // For tied points, add a small random factor
  const sortedRacers = [...racerPoints]
    .sort((a, b) => {
      if (a.points === b.points) {
        // Add a tiny random factor for ties (between -0.1 and 0.1)
        return Math.random() * 0.2 - 0.1;
      }
      return b.points - a.points;
    })
    .map(rp => rp.id);

  return createHeats(sortedRacers, racersPerHeat);
}

function createHeats(racerIds: string[], racersPerHeat: number): Heat[] {
  const heats: Heat[] = [];
  const totalHeats = Math.ceil(racerIds.length / racersPerHeat);

  for (let i = 0; i < totalHeats; i++) {
    const start = i * racersPerHeat;
    const end = Math.min(start + racersPerHeat, racerIds.length);
    const heatRacers = racerIds.slice(start, end);

    heats.push({
      id: generateId(),
      racerIds: heatRacers,
      status: 'pending',
      results: [],
    });
  }

  return heats;
}

export function calculateHeatPoints(totalRacers: number): number[] {
  // Create an array of points where:
  // - First place gets points equal to number of racers
  // - Each subsequent place gets one fewer point
  // - Last place always gets 1 point
  return Array.from({ length: totalRacers }, (_, index) => totalRacers - index);
}

export function assignHeatResults(
  heat: Heat,
  finishOrder: string[]
): { heat: Heat; points: { [racerId: string]: number } } {
  const points = calculateHeatPoints(heat.racerIds.length);
  const results = finishOrder.map((racerId, index) => ({
    racerId,
    position: index + 1,
    points: points[index],
  }));

  const updatedHeat: Heat = {
    ...heat,
    status: 'completed',
    results,
  };

  // Create a map of racer IDs to points earned
  const pointsMap = results.reduce((acc, result) => {
    acc[result.racerId] = result.points;
    return acc;
  }, {} as { [racerId: string]: number });

  return { heat: updatedHeat, points: pointsMap };
}

export function isRoundComplete(heats: Heat[]): boolean {
  return heats.every((heat) => heat.status === 'completed');
}

export function calculateRoundPoints(heats: Heat[]): { [racerId: string]: number } {
  const roundPoints: { [racerId: string]: number } = {};

  heats.forEach((heat) => {
    heat.results.forEach((result) => {
      if (!roundPoints[result.racerId]) {
        roundPoints[result.racerId] = 0;
      }
      roundPoints[result.racerId] += result.points;
    });
  });

  return roundPoints;
} 