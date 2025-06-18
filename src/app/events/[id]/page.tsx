import EventDetails from '@/components/event/EventDetails';
import { getEvents } from '@/lib/storage';
import { notFound } from 'next/navigation';

export default async function EventPage({ params }: { params: { id: string } }) {
  const events = getEvents();
  const event = events.find((e) => e.id === params.id);

  if (!event) {
    notFound();
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <EventDetails event={event} />
    </div>
  );
} 