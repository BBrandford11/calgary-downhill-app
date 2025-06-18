import { Racer } from '@/types';

interface RacerCardProps {
  racer: Racer;
  showStats?: boolean;
  onSelect?: (racer: Racer) => void;
}

export default function RacerCard({ racer, showStats = true, onSelect }: RacerCardProps) {
  return (
    <div 
      className={`bg-zinc-800 rounded-lg shadow p-4 ${onSelect ? 'cursor-pointer hover:bg-gray-50' : ''}`}
      onClick={() => onSelect?.(racer)}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="h-10 w-10 bg-gray-200 rounded-full flex items-center justify-center">
            <span className="text-gray-600 font-medium">
              {racer.number || '#'}
            </span>
          </div>
          <div>
            <h3 className="font-medium">{racer.name}</h3>
            {racer.nickname && (
              <p className="text-sm text-gray-500">{racer.nickname}</p>
            )}
          </div>
        </div>
        {racer.ageGroup && (
          <span className="text-sm text-gray-500">{racer.ageGroup}</span>
        )}
      </div>

      {showStats && (
        <div className="mt-4 grid grid-cols-2 gap-4 border-t pt-4">
          <div>
            <p className="text-sm text-gray-500">Season Points</p>
            <p className="text-lg font-semibold">{racer.seasonPoints}</p>
          </div>
        </div>
      )}
    </div>
  );
} 