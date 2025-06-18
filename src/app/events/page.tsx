import { promises as fs } from 'fs';
import path from 'path';
import Link from 'next/link';

interface Event {
  id: string;
  name: string;
  date: string;
  totalRounds: number;
  racersPerHeat: number;
  status: string;
  racers: string[];
}

async function getEvents(): Promise<Event[]> {
  const filePath = path.join(process.cwd(), 'data', 'events.json');
  const data = await fs.readFile(filePath, 'utf8');
  return JSON.parse(data);
}

export default async function EventsPage() {
  const events = await getEvents();
  
  // Sort events by date, with upcoming events first
  const sortedEvents = [...events].sort((a, b) => {
    // First sort by status (upcoming first)
    if (a.status === 'upcoming' && b.status !== 'upcoming') return -1;
    if (a.status !== 'upcoming' && b.status === 'upcoming') return 1;
    // Then sort by date
    return new Date(a.date).getTime() - new Date(b.date).getTime();
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Events</h1>
        <Link
          href="/events/new"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Create New Event
        </Link>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {sortedEvents.map((event) => (
          <Link
            key={event.id}
            href={`/events/${event.id}`}
            className="block bg-white shadow-lg rounded-lg overflow-hidden hover:shadow-xl transition-shadow"
          >
            <div className="p-6 space-y-4">
              <div className="flex justify-between items-start">
                <h2 className="text-xl font-semibold text-gray-900">{event.name}</h2>
                <span className={`px-2 py-1 text-sm rounded-full ${
                  event.status === 'upcoming'
                    ? 'bg-blue-100 text-blue-800'
                    : event.status === 'in-progress'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
                </span>
              </div>
              
              <div className="space-y-2 text-gray-600">
                <p className="flex items-center">
                  <CalendarIcon className="w-5 h-5 mr-2" />
                  {new Date(event.date).toLocaleDateString()}
                </p>
                <p className="flex items-center">
                  <UsersIcon className="w-5 h-5 mr-2" />
                  {event.racers.length} Racers
                </p>
                <p className="flex items-center">
                  <FlagIcon className="w-5 h-5 mr-2" />
                  {event.totalRounds} Rounds
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

function CalendarIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
      />
    </svg>
  );
}

function UsersIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
      />
    </svg>
  );
}

function FlagIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9"
      />
    </svg>
  );
} 