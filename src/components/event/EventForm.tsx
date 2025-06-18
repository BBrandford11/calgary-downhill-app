'use client';

import { generateId } from '@/lib/utils';
import { Event } from '@/types';
import { useRouter } from 'next/navigation';
import { FormEvent, useState } from 'react';

export default function EventForm() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    date: '',
    totalRounds: 3,
    racersPerHeat: 4,
  });

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const newEvent: Event = {
      id: generateId(),
      ...formData,
      status: 'upcoming',
      rounds: [],
      racers: [], // Initialize with empty racers array
    };

    try {
      const response = await fetch('/api/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newEvent),
      });

      if (!response.ok) {
        throw new Error('Failed to create event');
      }

      const savedEvent = await response.json();
      router.push(`/events/${savedEvent.id}`);
    } catch (error) {
      console.error('Error creating event:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
          Event Name
        </label>
        <input
          type="text"
          id="name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          placeholder="Summer Series Race #1"
        />
      </div>

      <div>
        <label htmlFor="date" className="block text-sm font-medium text-gray-700">
          Event Date
        </label>
        <input
          type="date"
          id="date"
          value={formData.date}
          onChange={(e) => setFormData({ ...formData, date: e.target.value })}
          required
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
      </div>

      <div>
        <label htmlFor="totalRounds" className="block text-sm font-medium text-gray-700">
          Number of Rounds
        </label>
        <input
          type="number"
          id="totalRounds"
          value={formData.totalRounds}
          onChange={(e) =>
            setFormData({ ...formData, totalRounds: parseInt(e.target.value) })
          }
          min="1"
          max="10"
          required
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
        <p className="mt-1 text-sm text-gray-500">
          How many rounds will be run in this event (typically 3-5)
        </p>
      </div>

      <div>
        <label htmlFor="racersPerHeat" className="block text-sm font-medium text-gray-700">
          Racers per Heat
        </label>
        <input
          type="number"
          id="racersPerHeat"
          value={formData.racersPerHeat}
          onChange={(e) =>
            setFormData({ ...formData, racersPerHeat: parseInt(e.target.value) })
          }
          min="2"
          max="6"
          required
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
        <p className="mt-1 text-sm text-gray-500">
          Number of racers in each heat (typically 4-6)
        </p>
      </div>

      <div className="pt-4">
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Create Event
        </button>
      </div>
    </form>
  );
} 