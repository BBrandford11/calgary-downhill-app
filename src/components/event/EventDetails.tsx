'use client';

import { Event, Racer } from '@/types';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface EventDetailsProps {
  event: Event;
}

export default function EventDetails({ event }: EventDetailsProps) {
  const router = useRouter();
  const [availableRacers, setAvailableRacers] = useState<Racer[]>([]);
  const [selectedRacers, setSelectedRacers] = useState<string[]>(event.racers || []);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRacers = async () => {
      try {
        const response = await fetch('/api/racers');
        if (!response.ok) {
          throw new Error('Failed to fetch racers');
        }
        const data = await response.json();
        setAvailableRacers(data);
      } catch (err) {
        setError('Failed to load racers. Please try again later.');
        console.error('Error fetching racers:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchRacers();
  }, []);

  const toggleRacer = async (racerId: string) => {
    const newSelectedRacers = selectedRacers.includes(racerId)
      ? selectedRacers.filter((id) => id !== racerId)
      : [...selectedRacers, racerId];
    
    setSelectedRacers(newSelectedRacers);

    try {
      const response = await fetch(`/api/events/${event.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...event,
          racers: newSelectedRacers,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update event');
      }
    } catch (error) {
      console.error('Error updating event:', error);
    }
  };

  const startRace = () => {
    if (selectedRacers.length < event.racersPerHeat) {
      alert(`Please select at least ${event.racersPerHeat} racers to start the race.`);
      return;
    }
    router.push(`/events/${event.id}/race`);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-zinc-800 rounded-lg shadow p-6">
        <h2 className="text-2xl font-bold mb-4">{event.name}</h2>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="font-medium">Date:</span>{' '}
            {new Date(event.date).toLocaleDateString()}
          </div>
          <div>
            <span className="font-medium">Status:</span>{' '}
            <span className={`px-2 py-1 rounded-full ${
              event.status === 'upcoming'
                ? 'bg-blue-100 text-blue-800'
                : event.status === 'in-progress'
                ? 'bg-green-100 text-green-800'
                : 'bg-gray-100 text-gray-800'
            }`}>
              {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
            </span>
          </div>
          <div>
            <span className="font-medium">Total Rounds:</span> {event.totalRounds}
          </div>
          <div>
            <span className="font-medium">Racers per Heat:</span> {event.racersPerHeat}
          </div>
        </div>
      </div>

      {event.status === 'completed' ? (
        <div className="bg-zinc-800 rounded-lg shadow p-6">
          <h3 className="text-xl font-bold mb-4">Race Results</h3>
          {event.rounds.map((round, roundIndex) => (
            <div key={roundIndex} className="mb-8 last:mb-0">
              <h4 className="text-lg font-semibold mb-4">Round {round.roundNumber}</h4>
              <div className="space-y-4">
                {round.heats.map((heat, heatIndex) => (
                  <div key={heat.id} className="bg-zinc-700 rounded-lg p-4">
                    <h5 className="font-medium mb-2">Heat {heatIndex + 1}</h5>
                    <div className="space-y-2">
                      {heat.results?.sort((a, b) => a.position - b.position).map((result) => {
                        const racer = availableRacers.find(r => r.id === result.racerId);
                        return (
                          <div key={result.racerId} className="flex justify-between items-center">
                            <div className="flex items-center">
                              <span className="w-8 text-center font-bold">
                                {result.position}
                              </span>
                              <span>{racer?.name || 'Unknown Racer'}</span>
                              {racer?.number && (
                                <span className="ml-2 text-sm text-gray-400">
                                  #{racer.number}
                                </span>
                              )}
                            </div>
                            <span className="font-medium">{result.points} pts</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : event.status === 'in-progress' ? (
        <div className="bg-zinc-800 rounded-lg shadow p-6">
          <h3 className="text-xl font-bold mb-4">Current Race Progress</h3>
          <div className="space-y-4">
            {event.rounds.map((round, roundIndex) => (
              <div key={roundIndex} className="border-b border-gray-700 pb-4 last:border-0">
                <h4 className="text-lg font-semibold mb-2">
                  Round {round.roundNumber} - {round.status}
                </h4>
                <div className="grid gap-4">
                  {round.heats.map((heat, heatIndex) => (
                    <div key={heat.id} className="bg-zinc-700 rounded p-4">
                      <div className="flex justify-between items-center mb-2">
                        <h5 className="font-medium">Heat {heatIndex + 1}</h5>
                        <span className={`text-sm ${
                          heat.status === 'completed' ? 'text-green-400' : 'text-yellow-400'
                        }`}>
                          {heat.status}
                        </span>
                      </div>
                      {heat.status === 'completed' && heat.results && (
                        <div className="space-y-1">
                          {heat.results.sort((a, b) => a.position - b.position).map((result) => {
                            const racer = availableRacers.find(r => r.id === result.racerId);
                            return (
                              <div key={result.racerId} className="flex justify-between">
                                <span>{racer?.name || 'Unknown Racer'}</span>
                                <span>{result.points} pts</span>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <Link
            href={`/events/${event.id}/race`}
            className="mt-6 block text-center bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            Continue Race
          </Link>
        </div>
      ) : (
        <div className="bg-zinc-800 rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold">Select Racers</h3>
            <button
              onClick={startRace}
              className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
            >
              Start Race with {selectedRacers.length} Racers
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {availableRacers.map((racer) => (
              <div
                key={racer.id}
                onClick={() => toggleRacer(racer.id)}
                className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                  selectedRacers.includes(racer.id)
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-blue-300'
                }`}
              >
                <div className="font-medium">{racer.name}</div>
                {racer.nickname && (
                  <div className="text-sm text-gray-500">"{racer.nickname}"</div>
                )}
                {racer.number && (
                  <div className="text-sm text-gray-500">#{racer.number}</div>
                )}
              </div>
            ))}
          </div>
          
          <div className="mt-4 text-sm text-gray-500">
            {selectedRacers.length < event.racersPerHeat ? (
              <p className="text-amber-600">
                Please select at least {event.racersPerHeat} racers to start the race.
              </p>
            ) : (
              <p>
                Selected: {selectedRacers.length} racers
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
} 