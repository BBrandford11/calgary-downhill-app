import { LeaderboardEntry } from '@/types';
import { useState } from 'react';

interface LeaderboardTableProps {
  entries: LeaderboardEntry[];
  title?: string;
  showEventPoints?: boolean;
}

type SortField = 'name' | 'number' | 'eventPoints' | 'seasonPoints';
type SortOrder = 'asc' | 'desc';

export default function LeaderboardTable({
  entries,
  title = 'Leaderboard',
  showEventPoints = true,
}: LeaderboardTableProps) {
  const [sortField, setSortField] = useState<SortField>('seasonPoints');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [searchTerm, setSearchTerm] = useState('');

  const handleSort = (field: SortField) => {
    if (field === sortField) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
  };

  const sortedEntries = [...entries]
    .filter(
      (entry) =>
        entry.racer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        entry.racer.nickname?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (entry.racer.number?.toString() || '').includes(searchTerm)
    )
    .sort((a, b) => {
      const multiplier = sortOrder === 'asc' ? 1 : -1;
      switch (sortField) {
        case 'name':
          return multiplier * a.racer.name.localeCompare(b.racer.name);
        case 'number':
          return (
            multiplier *
            ((a.racer.number || 0) - (b.racer.number || 0))
          );
        case 'eventPoints':
          return multiplier * (a.eventPoints - b.eventPoints);
        case 'seasonPoints':
          return multiplier * (a.seasonPoints - b.seasonPoints);
        default:
          return 0;
      }
    });

  return (
    <div className="bg-zinc-800 rounded-lg shadow">
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-gray-900">{title}</h2>
          <div className="relative">
            <input
              type="text"
              placeholder="Search racers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-64 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left border-b">
                <th
                  className="pb-3 cursor-pointer"
                  onClick={() => handleSort('number')}
                >
                  #
                  {sortField === 'number' && (
                    <span className="ml-1">{sortOrder === 'asc' ? '↑' : '↓'}</span>
                  )}
                </th>
                <th
                  className="pb-3 cursor-pointer"
                  onClick={() => handleSort('name')}
                >
                  Racer
                  {sortField === 'name' && (
                    <span className="ml-1">{sortOrder === 'asc' ? '↑' : '↓'}</span>
                  )}
                </th>
                {showEventPoints && (
                  <th
                    className="pb-3 cursor-pointer text-right"
                    onClick={() => handleSort('eventPoints')}
                  >
                    Event Points
                    {sortField === 'eventPoints' && (
                      <span className="ml-1">
                        {sortOrder === 'asc' ? '↑' : '↓'}
                      </span>
                    )}
                  </th>
                )}
                <th
                  className="pb-3 cursor-pointer text-right"
                  onClick={() => handleSort('seasonPoints')}
                >
                  Season Points
                  {sortField === 'seasonPoints' && (
                    <span className="ml-1">{sortOrder === 'asc' ? '↑' : '↓'}</span>
                  )}
                </th>
              </tr>
            </thead>
            <tbody>
              {sortedEntries.map((entry, index) => (
                <tr
                  key={entry.racer.id}
                  className={`border-b ${
                    index < 3 ? 'bg-yellow-50' : 'hover:bg-gray-50'
                  }`}
                >
                  <td className="py-4">
                    <div className="h-8 w-8 bg-gray-200 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium text-gray-600">
                        {entry.racer.number || '-'}
                      </span>
                    </div>
                  </td>
                  <td className="py-4">
                    <div>
                      <span className="font-medium text-gray-900">
                        {entry.racer.name}
                      </span>
                      {entry.racer.nickname && (
                        <span className="text-sm text-gray-500 ml-2">
                          ({entry.racer.nickname})
                        </span>
                      )}
                    </div>
                  </td>
                  {showEventPoints && (
                    <td className="py-4 text-right">
                      <span className="font-medium">{entry.eventPoints}</span>
                    </td>
                  )}
                  <td className="py-4 text-right">
                    <span className="font-medium">{entry.seasonPoints}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
} 