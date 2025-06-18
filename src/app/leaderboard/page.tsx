import { promises as fs } from 'fs';
import path from 'path';
import { Racer } from '@/types';

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

export default async function LeaderboardPage() {
  // Read racers data
  const racersPath = path.join(process.cwd(), 'data', 'racers.json');
  const racersData = await fs.readFile(racersPath, 'utf8');
  const racers: Racer[] = JSON.parse(racersData);

  // Sort racers by season points
  const sortedRacers = [...racers].sort((a, b) => 
    (b.seasonPoints || 0) - (a.seasonPoints || 0)
  );

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8 text-center">Season Leaderboard 🏆</h1>
      
      <div className="bg-zinc-800 rounded-lg shadow-lg p-6">
        <div className="space-y-4">
          {sortedRacers.map((racer, index) => (
            <div
              key={racer.id}
              className={`flex items-center justify-between p-4 rounded-lg ${
                index < 3 ? 'bg-yellow-50' : 'bg-gray-50'
              }`}
            >
              <div className="flex items-center space-x-4">
                <span className="text-2xl font-bold w-8">
                  {index < 3 ? getPodiumEmoji(index + 1) : index + 1}
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
                <div className="font-bold text-lg">{racer.seasonPoints || 0}</div>
                <div className="text-sm text-gray-600">season points</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 