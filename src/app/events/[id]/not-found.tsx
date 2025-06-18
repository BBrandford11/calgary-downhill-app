import Link from 'next/link';

export default function EventNotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px]">
      <h2 className="text-2xl font-bold mb-4">Event Not Found</h2>
      <p className="text-gray-600 mb-6">The event you're looking for doesn't exist.</p>
      <Link
        href="/events"
        className="text-blue-600 hover:text-blue-800 underline"
      >
        View All Events
      </Link>
    </div>
  );
} 