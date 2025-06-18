'use client';

import { Racer } from '@/types';
import RacerCard from '@/components/racer/RacerCard';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function RacersPage() {
  const [racers, setRacers] = useState<Racer[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRacers = async () => {
      try {
        const response = await fetch('/api/racers');
        if (!response.ok) {
          throw new Error('Failed to fetch racers');
        }
        const data = await response.json();
        setRacers(data);
      } catch (err) {
        setError('Failed to load racers. Please try again later.');
        console.error('Error fetching racers:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchRacers();
  }, []);

  const filteredRacers = racers.filter(
    (racer) =>
      racer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      racer.nickname?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      racer.number?.toString().includes(searchTerm)
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="text-lg">Loading racers...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Racers</h1>
        <Link
          href="/racers/new"
          className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
        >
          Add New Racer
        </Link>
      </div>

      <div className="mb-6">
        <input
          type="text"
          placeholder="Search racers by name, nickname, or number..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full max-w-lg px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredRacers.map((racer) => (
          <RacerCard key={racer.id} racer={racer} />
        ))}
      </div>

      {filteredRacers.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">
            {searchTerm
              ? 'No racers found matching your search.'
              : 'No racers added yet.'}
          </p>
          <Link
            href="/racers/new"
            className="inline-block mt-4 text-blue-600 hover:text-blue-800"
          >
            Add your first racer →
          </Link>
        </div>
      )}
    </div>
  );
} 