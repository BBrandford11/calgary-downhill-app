import { Heat, Racer } from '@/types';
import { validateHeatResults } from '@/lib/utils';

interface HeatCardProps {
  heat: Heat;
  racers: Racer[];
  onUpdatePositions?: (heat: Heat) => void;
  onComplete?: (heat: Heat) => void;
}

export default function HeatCard({
  heat,
  racers,
  onUpdatePositions,
  onComplete,
}: HeatCardProps) {
  const isEditable = heat.status === 'in-progress';
  const racerMap = new Map(racers.map(r => [r.id, r]));

  const handlePositionChange = (racerId: string, position: number) => {
    if (!isEditable) return;

    const updatedHeat: Heat = {
      ...heat,
      racers: heat.racers.map(r =>
        r.racerId === racerId ? { ...r, position } : r
      ),
    };

    onUpdatePositions?.(updatedHeat);
  };

  const handleComplete = () => {
    if (validateHeatResults(heat)) {
      onComplete?.(heat);
    }
  };

  return (
    <div className="bg-zinc-800 rounded-lg shadow p-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Heat {heat.heatNumber}</h3>
        <span
          className={`px-2 py-1 rounded text-sm ${
            heat.status === 'completed'
              ? 'bg-green-100 text-green-800'
              : heat.status === 'in-progress'
              ? 'bg-yellow-100 text-yellow-800'
              : 'bg-gray-100 text-gray-800'
          }`}
        >
          {heat.status}
        </span>
      </div>

      <div className="space-y-3">
        {heat.racers.map((heatRacer) => {
          const racer = racerMap.get(heatRacer.racerId);
          if (!racer) return null;

          return (
            <div
              key={heatRacer.racerId}
              className="flex items-center justify-between p-2 bg-gray-50 rounded"
            >
              <div className="flex items-center space-x-3">
                <div className="h-8 w-8 bg-gray-200 rounded-full flex items-center justify-center">
                  <span className="text-sm text-gray-600 font-medium">
                    {racer.number || '#'}
                  </span>
                </div>
                <span className="font-medium">{racer.name}</span>
              </div>

              {isEditable ? (
                <select
                  value={heatRacer.position || ''}
                  onChange={(e) =>
                    handlePositionChange(
                      heatRacer.racerId,
                      parseInt(e.target.value)
                    )
                  }
                  className="ml-4 border rounded p-1"
                >
                  <option value="">Position</option>
                  {Array.from(
                    { length: heat.racers.length },
                    (_, i) => i + 1
                  ).map((pos) => (
                    <option key={pos} value={pos}>
                      {pos}
                    </option>
                  ))}
                </select>
              ) : (
                <span className="ml-4 font-semibold">
                  {heatRacer.position
                    ? `${heatRacer.position}${
                        heatRacer.points ? ` (${heatRacer.points}pts)` : ''
                      }`
                    : '-'}
                </span>
              )}
            </div>
          );
        })}
      </div>

      {isEditable && (
        <button
          onClick={handleComplete}
          disabled={!validateHeatResults(heat)}
          className="mt-4 w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          Complete Heat
        </button>
      )}
    </div>
  );
} 