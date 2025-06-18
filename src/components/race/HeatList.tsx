import { Heat, Racer } from '@/types';
import { useState } from 'react';
import { assignHeatResults } from '@/lib/bracketGeneration';

interface HeatListProps {
  heats: Heat[];
  racers: { [key: string]: Racer };
  onHeatComplete: (heatId: string, results: Partial<Heat>) => void;
}

function RacerDisplay({ racer }: { racer: Racer }) {
  return (
    <div>
      <span className="font-medium">{racer.name}</span>
      {racer.number && (
        <span className="text-sm text-gray-500 ml-2">#{racer.number}</span>
      )}
      {racer.nickname && (
        <span className="text-sm text-gray-500 ml-2">"{racer.nickname}"</span>
      )}
    </div>
  );
}

export default function HeatList({ heats, racers, onHeatComplete }: HeatListProps) {
  const [editingHeatId, setEditingHeatId] = useState<string | null>(null);
  const [finishOrder, setFinishOrder] = useState<string[]>([]);

  const handleHeatClick = (heat: Heat) => {
    if (heat.status === 'completed') return;
    setEditingHeatId(heat.id);
    setFinishOrder([...heat.racerIds]);
  };

  const handleSaveResults = (heat: Heat) => {
    if (finishOrder.length !== heat.racerIds.length) {
      alert('Please set the position for all racers');
      return;
    }

    const { heat: updatedHeat } = assignHeatResults(heat, finishOrder);
    onHeatComplete(heat.id, updatedHeat);
    setEditingHeatId(null);
    setFinishOrder([]);
  };

  const moveRacer = (racerId: string, direction: 'up' | 'down') => {
    const currentIndex = finishOrder.indexOf(racerId);
    if (direction === 'up' && currentIndex > 0) {
      const newOrder = [...finishOrder];
      [newOrder[currentIndex], newOrder[currentIndex - 1]] = [
        newOrder[currentIndex - 1],
        newOrder[currentIndex],
      ];
      setFinishOrder(newOrder);
    } else if (direction === 'down' && currentIndex < finishOrder.length - 1) {
      const newOrder = [...finishOrder];
      [newOrder[currentIndex], newOrder[currentIndex + 1]] = [
        newOrder[currentIndex + 1],
        newOrder[currentIndex],
      ];
      setFinishOrder(newOrder);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {heats.map((heat, index) => (
        <div
          key={heat.id}
          className={`bg-zinc-800 rounded-lg shadow p-6 ${
            heat.status === 'completed'
              ? 'border-green-500'
              : editingHeatId === heat.id
              ? 'border-blue-500'
              : 'border-gray-200'
          } border-2`}
        >
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Heat {index + 1}</h3>
            <span
              className={`px-2 py-1 rounded-full text-sm ${
                heat.status === 'completed'
                  ? 'bg-green-100 text-green-800'
                  : 'bg-yellow-100 text-yellow-800'
              }`}
            >
              {heat.status}
            </span>
          </div>

          {editingHeatId === heat.id ? (
            <div className="space-y-4">
              <p className="text-sm text-gray-600 mb-2">
                Set finishing positions using the arrows
              </p>
              {finishOrder.map((racerId, index) => (
                <div
                  key={racerId}
                  className="flex items-center justify-between bg-gray-50 p-3 rounded-md"
                >
                  <div className="flex items-center">
                    <span className="font-bold text-lg mr-3">{index + 1}.</span>
                    <RacerDisplay racer={racers[racerId]} />
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => moveRacer(racerId, 'up')}
                      disabled={index === 0}
                      className="p-1 hover:bg-gray-200 rounded disabled:opacity-50"
                    >
                      ↑
                    </button>
                    <button
                      onClick={() => moveRacer(racerId, 'down')}
                      disabled={index === finishOrder.length - 1}
                      className="p-1 hover:bg-gray-200 rounded disabled:opacity-50"
                    >
                      ↓
                    </button>
                  </div>
                </div>
              ))}
              <div className="flex justify-end space-x-2 mt-4">
                <button
                  onClick={() => setEditingHeatId(null)}
                  className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleSaveResults(heat)}
                  className="px-3 py-1 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Save Results
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              {heat.status === 'completed' ? (
                heat.results.map((result) => (
                  <div
                    key={result.racerId}
                    className="flex justify-between items-center p-2 bg-gray-50 rounded"
                  >
                    <div className="flex items-center">
                      <span className="font-bold text-lg mr-3">{result.position}.</span>
                      <RacerDisplay racer={racers[result.racerId]} />
                    </div>
                    <span className="text-sm font-medium text-gray-600">
                      {result.points} pts
                    </span>
                  </div>
                ))
              ) : (
                <>
                  {heat.racerIds.map((racerId) => (
                    <div
                      key={racerId}
                      className="p-2 bg-gray-50 rounded"
                    >
                      <RacerDisplay racer={racers[racerId]} />
                    </div>
                  ))}
                  <button
                    onClick={() => handleHeatClick(heat)}
                    className="w-full mt-4 px-4 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    Set Results
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
} 