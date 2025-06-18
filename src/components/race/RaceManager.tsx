'use client';

import { Event, Heat, Racer } from '@/types';
import { useEffect, useState } from 'react';
import { generateFirstRoundHeats, generateNextRoundHeats, isRoundComplete, calculateRoundPoints } from '@/lib/bracketGeneration';
import HeatList from '@/components/race/HeatList';
import RoundNavigation from '@/components/race/RoundNavigation';
import Standings from '@/components/race/Standings';
import { useRouter } from 'next/navigation';

interface RaceManagerProps {
  eventId: string;
  initialEvent: Event;
}

export default function RaceManager({ eventId, initialEvent }: RaceManagerProps) {
  const router = useRouter();
  const [event, setEvent] = useState<Event>(initialEvent);
  const [racers, setRacers] = useState<{ [key: string]: Racer }>({});
  const [currentRound, setCurrentRound] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [savingSeasonPoints, setSavingSeasonPoints] = useState(false);
  const [initialized, setInitialized] = useState(false);

  // Fetch racers
  useEffect(() => {
    const fetchRacers = async () => {
      try {
        // Fetch all racers
        const racersResponse = await fetch('/api/racers');
        if (!racersResponse.ok) {
          throw new Error('Failed to fetch racers');
        }
        const racersData: Racer[] = await racersResponse.json();
        
        // Create a map of racer IDs to racer objects
        const racersMap = racersData.reduce((acc, racer) => {
          acc[racer.id] = racer;
          return acc;
        }, {} as { [key: string]: Racer });
        
        setRacers(racersMap);
      } catch (err) {
        setError('Failed to load racers. Please try again later.');
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchRacers();
  }, []);

  // Initialize race if needed
  useEffect(() => {
    const initializeRace = async () => {
      if (!initialized && event.rounds.length === 0) {
        const firstRoundHeats = generateFirstRoundHeats(
          event.racers,
          event.racersPerHeat
        );
        
        const updatedEvent = {
          ...event,
          rounds: [{
            roundNumber: 1,
            heats: firstRoundHeats,
            status: 'in-progress'
          }]
        };
        
        try {
          const response = await fetch(`/api/events/${eventId}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedEvent),
          });

          if (!response.ok) {
            throw new Error('Failed to initialize race');
          }

          setEvent(updatedEvent);
          setInitialized(true);
        } catch (error) {
          console.error('Error initializing race:', error);
          setError('Failed to initialize race. Please try again.');
        }
      } else if (!initialized && event.rounds.length > 0) {
        setInitialized(true);
      }
    };

    if (!initialized) {
      initializeRace();
    }
  }, [event, eventId, initialized]);

  const calculateTotalPoints = () => {
    const totalPoints: { [racerId: string]: number } = {};
    event.rounds.forEach(round => {
      const roundPoints = calculateRoundPoints(round.heats);
      Object.entries(roundPoints).forEach(([racerId, points]) => {
        totalPoints[racerId] = (totalPoints[racerId] || 0) + points;
      });
    });
    return totalPoints;
  };

  const isEventComplete = () => {
    return (
      event.rounds.length === event.totalRounds &&
      event.rounds.every(round => 
        round.heats.every(heat => heat.status === 'completed')
      )
    );
  };

  const saveSeasonPoints = async () => {
    if (savingSeasonPoints) return;

    try {
      setSavingSeasonPoints(true);
      const totalPoints = calculateTotalPoints();

      // Update season points
      const response = await fetch('/api/racers/update-points', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(totalPoints),
      });

      if (!response.ok) {
        throw new Error('Failed to update season points');
      }

      // Update event status to completed
      const updatedEvent = {
        ...event,
        status: 'completed'
      };

      await fetch(`/api/events/${eventId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedEvent),
      });

      // Refresh the page data
      router.refresh();
      
      alert('Season points have been updated successfully!');
    } catch (error) {
      console.error('Error saving season points:', error);
      alert('Failed to save season points. Please try again.');
    } finally {
      setSavingSeasonPoints(false);
    }
  };

  const startNextRound = async () => {
    const currentRoundData = event.rounds[currentRound - 1];
    if (!currentRoundData || !isRoundComplete(currentRoundData.heats)) {
      alert('Complete all heats in the current round before starting the next round.');
      return;
    }

    // Calculate points from all previous rounds
    const totalPoints = calculateTotalPoints();

    // Create racer points array for next round generation
    const racerPoints = Object.entries(totalPoints).map(([id, points]) => ({
      id,
      points,
    }));

    // Generate next round heats
    const nextRoundHeats = generateNextRoundHeats(
      racerPoints,
      event.racersPerHeat
    );

    const updatedEvent = {
      ...event,
      rounds: [
        ...event.rounds,
        {
          roundNumber: currentRound + 1,
          heats: nextRoundHeats,
          status: 'in-progress'
        }
      ]
    };

    try {
      const response = await fetch(`/api/events/${eventId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedEvent),
      });

      if (!response.ok) {
        throw new Error('Failed to start next round');
      }

      setEvent(updatedEvent);
      setCurrentRound(currentRound + 1);
    } catch (error) {
      console.error('Error starting next round:', error);
      alert('Failed to start next round. Please try again.');
    }
  };

  if (loading || !initialized) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="text-lg">Loading race...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  const currentRoundData = event.rounds[currentRound - 1];
  const eventComplete = isEventComplete();

  // Safety check for current round data
  if (!currentRoundData && !eventComplete) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="text-red-500">Invalid round state. Please try refreshing the page.</div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">{event.name}</h1>
        <p className="text-gray-600">
          {eventComplete ? (
            <span className="text-green-600 font-semibold">Event Complete</span>
          ) : (
            `Round ${currentRound} of ${event.totalRounds}`
          )}
        </p>
      </div>

      {eventComplete ? (
        <div className="space-y-8">
          <Standings
            racerPoints={calculateTotalPoints()}
            racers={racers}
          />
          <div className="flex justify-center">
            <button
              onClick={saveSeasonPoints}
              disabled={savingSeasonPoints}
              className={`px-6 py-3 text-lg font-semibold text-white rounded-lg ${
                savingSeasonPoints
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-green-600 hover:bg-green-700'
              }`}
            >
              {savingSeasonPoints ? 'Saving...' : 'Save Season Points'}
            </button>
          </div>
        </div>
      ) : (
        <>
          <RoundNavigation
            currentRound={currentRound}
            totalRounds={event.rounds.length}
            onRoundChange={setCurrentRound}
            canStartNextRound={
              currentRound === event.rounds.length && // Is last round
              currentRound < event.totalRounds && // Not reached total rounds
              isRoundComplete(currentRoundData.heats) // Current round is complete
            }
            onStartNextRound={startNextRound}
          />

          <HeatList
            heats={currentRoundData.heats}
            racers={racers}
            onHeatComplete={async (heatId, results) => {
              // Update the heat results in the event
              const updatedEvent = {
                ...event,
                rounds: event.rounds.map(round => ({
                  ...round,
                  heats: round.heats.map(heat =>
                    heat.id === heatId
                      ? { ...heat, ...results }
                      : heat
                  )
                }))
              };

              try {
                const response = await fetch(`/api/events/${eventId}`, {
                  method: 'PATCH',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify(updatedEvent),
                });

                if (!response.ok) {
                  throw new Error('Failed to update heat results');
                }

                setEvent(updatedEvent);
              } catch (error) {
                console.error('Error updating heat results:', error);
                alert('Failed to save heat results. Please try again.');
              }
            }}
          />
        </>
      )}
    </div>
  );
} 