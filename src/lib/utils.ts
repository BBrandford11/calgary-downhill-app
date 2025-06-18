import { Heat, HeatRacer, Racer, Round } from '@/types';

/**
 * Generates a random heat assignment for the first round
 */
export function generateInitialHeats(racers: Racer[], racersPerHeat: number): Heat[] {
  // Shuffle racers randomly
  const shuffledRacers = [...racers].sort(() => Math.random() - 0.5);
  const heats: Heat[] = [];

  // Create heats with shuffled racers
  for (let i = 0; i < shuffledRacers.length; i += racersPerHeat) {
    const heatRacers = shuffledRacers.slice(i, i + racersPerHeat).map(racer => ({
      racerId: racer.id,
    }));

    heats.push({
      id: `heat-${Math.random().toString(36).substr(2, 9)}`,
      roundId: '', // Will be set when adding to round
      heatNumber: Math.floor(i / racersPerHeat) + 1,
      racers: heatRacers,
      status: 'pending',
    });
  }

  return heats;
}

/**
 * Generates heats for subsequent rounds based on points
 */
export function generateNextRoundHeats(
  previousRound: Round,
  racers: Racer[],
  racersPerHeat: number
): Heat[] {
  // Sort racers by current points
  const sortedRacers = [...racers].sort((a, b) => b.totalPoints - a.totalPoints);
  const heats: Heat[] = [];

  // Group racers with similar points together
  for (let i = 0; i < sortedRacers.length; i += racersPerHeat) {
    const heatRacers = sortedRacers.slice(i, i + racersPerHeat).map(racer => ({
      racerId: racer.id,
    }));

    heats.push({
      id: `heat-${Math.random().toString(36).substr(2, 9)}`,
      roundId: '', // Will be set when adding to round
      heatNumber: Math.floor(i / racersPerHeat) + 1,
      racers: heatRacers,
      status: 'pending',
    });
  }

  return heats;
}

/**
 * Calculates points for a completed heat
 */
export function calculateHeatPoints(heat: Heat): HeatRacer[] {
  const totalRacers = heat.racers.length;
  
  return heat.racers.map(racer => ({
    ...racer,
    points: racer.position ? (totalRacers - racer.position + 1) : 0,
  }));
}

/**
 * Updates racer points after a heat
 */
export function updateRacerPoints(racers: Racer[], heat: Heat): Racer[] {
  const updatedRacers = [...racers];
  const heatResults = calculateHeatPoints(heat);

  heatResults.forEach(result => {
    const racerIndex = updatedRacers.findIndex(r => r.id === result.racerId);
    if (racerIndex !== -1 && result.points) {
      updatedRacers[racerIndex] = {
        ...updatedRacers[racerIndex],
        totalPoints: updatedRacers[racerIndex].totalPoints + result.points,
        seasonPoints: updatedRacers[racerIndex].seasonPoints + result.points,
      };
    }
  });

  return updatedRacers;
}

/**
 * Checks if a round is complete
 */
export function isRoundComplete(round: Round): boolean {
  return round.heats.every(heat => heat.status === 'completed');
}

/**
 * Validates heat results
 */
export function validateHeatResults(heat: Heat): boolean {
  const positions = heat.racers
    .map(r => r.position)
    .filter((pos): pos is number => pos !== undefined);

  // Check if all racers have positions
  if (positions.length !== heat.racers.length) return false;

  // Check if positions are unique and within valid range
  const uniquePositions = new Set(positions);
  return (
    uniquePositions.size === positions.length &&
    positions.every(pos => pos > 0 && pos <= heat.racers.length)
  );
}

/**
 * Generates a unique ID
 */
export function generateId(): string {
  return Math.random().toString(36).substr(2, 9);
} 