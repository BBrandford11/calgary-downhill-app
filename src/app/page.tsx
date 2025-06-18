import Link from "next/link";

export default function Home() {
  return (
    <div className="space-y-8">
      <section className="text-center py-12 bg-gray-60  rounded-lg">
        <h1 className="text-4xl font-bold text-gray-9 mb-4">
          Calgary Downhill Racing
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Track and manage longboarding events for the Calgary Longboard Club
        </p>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <section className="bg-zinc-800 p-6 rounded-lg shadow">
          <h2 className="text-2xl font-semibold mb-4">Upcoming Events</h2>
          <div className="space-y-4">
            {/* Placeholder for upcoming events */}
            <div className="p-4 border rounded hover:bg-gray-50 cursor-pointer">
              <h3 className="font-medium">Summer Series Race #1</h3>
              <p className="text-gray-600">June 15, 2024</p>
            </div>
            <div className="p-4 border rounded hover:bg-gray-50 cursor-pointer">
              <h3 className="font-medium">Downtown Challenge</h3>
              <p className="text-gray-600">July 1, 2024</p>
            </div>
          </div>
          <Link
            href="/events"
            className="mt-4 inline-block text-blue-600 hover:text-blue-800"
          >
            View all events →
          </Link>
        </section>

        <section className="bg-zinc-800 p-6 rounded-lg shadow">
          <h2 className="text-2xl font-semibold mb-4">Current Standings</h2>
          <div className="space-y-4">
            {/* Placeholder for leaderboard */}
            <div className="flex justify-between items-center p-4 border rounded">
              <div>
                <span className="font-medium">Josh Wutzke</span>
                <span className="text-gray-600 ml-2">#42</span>
              </div>
              <span className="font-semibold">120 pts</span>
            </div>
            <div className="flex justify-between items-center p-4 border rounded">
              <div>
                <span className="font-medium">Bryce Brandford</span>
                <span className="text-gray-600 ml-2">#17</span>
              </div>
              <span className="font-semibold">105 pts</span>
            </div>
          </div>
          <Link
            href="/leaderboard"
            className="mt-4 inline-block text-blue-600 hover:text-blue-800"
          >
            View full leaderboard →
          </Link>
        </section>
        </div>

      <section className="bg-zinc-800 p-6 rounded-lg shadow">
        <h2 className="text-2xl font-semibold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <Link
            href="/events/new"
            className="p-4 bg-blue-600 text-white rounded-lg text-center hover:bg-blue-700 transition-colors"
          >
            Create New Event
          </Link>
          <Link
            href="/racers/new"
            className="p-4 bg-green-600 text-white rounded-lg text-center hover:bg-green-700 transition-colors"
          >
            Add New Racer
          </Link>
          <Link
            href="/events"
            className="p-4 bg-purple-600 text-white rounded-lg text-center hover:bg-purple-700 transition-colors"
          >
            Manage Events
          </Link>
        </div>
      </section>
    </div>
  );
}
