import { promises as fs } from 'fs';
import path from 'path';
import { Event } from '@/types';
import RaceManager from '@/components/race/RaceManager';

export default async function RacePage({ params }: { params: { id: string } }) {
  // Read events data
  const eventsPath = path.join(process.cwd(), 'data', 'events.json');
  const eventsData = await fs.readFile(eventsPath, 'utf8');
  const events: Event[] = JSON.parse(eventsData);
  
  // Find the specific event
  const event = events.find(e => e.id === params.id);
  
  if (!event) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="text-red-500">Event not found</div>
      </div>
    );
  }

  return <RaceManager eventId={params.id} initialEvent={event} />;
} 