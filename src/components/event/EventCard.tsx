import { Event } from '@/types';

interface EventCardProps {
  event: Event;
  onSelect?: (event: Event) => void;
}

export default function EventCard({ event, onSelect }: EventCardProps) {
  const getStatusColor = (status: Event['status']) => {
    switch (status) {
      case 'upcoming':
        return 'bg-blue-100 text-blue-800';
      case 'in-progress':
        return 'bg-yellow-100 text-yellow-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div
      className={`bg-zinc-800 rounded-lg shadow p-6 ${
        onSelect ? 'cursor-pointer hover:bg-gray-50' : ''
      }`}
      onClick={() => onSelect?.(event)}
    >
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-semibold text-gray-900">{event.name}</h3>
          <p className="text-gray-600">{formatDate(event.date)}</p>
        </div>
        <span
          className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
            event.status
          )}`}
        >
          {event.status}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-4 mt-4 text-sm text-gray-600">
        <div>
          <p className="font-medium">Total Rounds</p>
          <p className="text-gray-900">{event.totalRounds}</p>
        </div>
        <div>
          <p className="font-medium">Racers per Heat</p>
          <p className="text-gray-900">{event.racersPerHeat}</p>
        </div>
      </div>

      <div className="mt-6">
        <h4 className="text-sm font-medium text-gray-900 mb-2">Progress</h4>
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-blue-600 transition-all duration-300"
            style={{
              width: `${
                (event.rounds.filter((r) => r.status === 'completed').length /
                  event.totalRounds) *
                100
              }%`,
            }}
          />
        </div>
        <p className="text-sm text-gray-600 mt-1">
          {event.rounds.filter((r) => r.status === 'completed').length} of{' '}
          {event.totalRounds} rounds completed
        </p>
      </div>

      {onSelect && (
        <div className="mt-6 pt-4 border-t">
          <button className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700">
            View Details
          </button>
        </div>
      )}
    </div>
  );
} 