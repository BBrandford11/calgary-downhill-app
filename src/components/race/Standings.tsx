import { Racer } from '@/types';

interface StandingsProps {
  racerPoints: { [racerId: string]: number };
  racers: { [key: string]: Racer };
}

function getPodiumEmoji(position: number): string {
  switch (position) {
    case 1:
      return '🥇';
    case 2:
      return '🥈';
    case 3:
      return '🥉';
    default:
      return '';
  }
}

export default function Standings({ racerPoints, racers }: StandingsProps) {
  // Sort racers by points in descending order
  const sortedRacers = Object.entries(racerPoints)
    .sort(([, pointsA], [, pointsB]) => pointsB - pointsA)
    .map(([racerId, points], index) => ({
      racer: racers[racerId],
      points,
      position: index + 1,
    }));

  return (
    <div className="bg-zinc-800 rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold mb-6">Final Standings 🏆</h2>
      <div className="space-y-4">
        {sortedRacers.map(({ racer, points, position }) => (
          <div
            key={racer.id}
            className={`flex items-center justify-between p-4 rounded-lg ${
              position <= 3 ? 'bg-yellow-50' : 'bg-gray-50'
            }`}
          >
            <div className="flex items-center space-x-4">
              <span className="text-2xl font-bold w-8">
                {position <= 3 ? getPodiumEmoji(position) : position}
              </span>
              <div>
                <div className="font-semibold text-lg">{racer.name}</div>
                <div className="text-sm text-gray-600">
                  {racer.number && <span>#{racer.number} </span>}
                  {racer.nickname && <span>"{racer.nickname}" </span>}
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="font-bold text-lg">{points}</div>
              <div className="text-sm text-gray-600">points</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 