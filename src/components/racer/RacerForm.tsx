'use client';

import { generateId } from '@/lib/utils';
import { Racer } from '@/types';
import { useRouter } from 'next/navigation';
import { FormEvent, useState } from 'react';

export default function RacerForm() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    nickname: '',
    number: '',
    ageGroup: '',
  });

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const newRacer: Racer = {
      id: generateId(),
      name: formData.name,
      nickname: formData.nickname || undefined,
      number: formData.number ? parseInt(formData.number) : undefined,
      ageGroup: formData.ageGroup || undefined,
      totalPoints: 0,
      seasonPoints: 0,
    };

    try {
      const response = await fetch('/api/racers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newRacer),
      });

      if (!response.ok) {
        throw new Error('Failed to create racer');
      }

      router.push('/racers');
    } catch (error) {
      console.error('Error creating racer:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
          Full Name
        </label>
        <input
          type="text"
          id="name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          placeholder="John Smith"
        />
      </div>

      <div>
        <label htmlFor="nickname" className="block text-sm font-medium text-gray-700">
          Nickname (Optional)
        </label>
        <input
          type="text"
          id="nickname"
          value={formData.nickname}
          onChange={(e) => setFormData({ ...formData, nickname: e.target.value })}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          placeholder="Speedy"
        />
      </div>

      <div>
        <label htmlFor="number" className="block text-sm font-medium text-gray-700">
          Race Number (Optional)
        </label>
        <input
          type="number"
          id="number"
          value={formData.number}
          onChange={(e) => setFormData({ ...formData, number: e.target.value })}
          min="1"
          max="999"
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          placeholder="42"
        />
        <p className="mt-1 text-sm text-gray-500">
          A unique number between 1 and 999
        </p>
      </div>

      <div>
        <label htmlFor="ageGroup" className="block text-sm font-medium text-gray-700">
          Age Group (Optional)
        </label>
        <select
          id="ageGroup"
          value={formData.ageGroup}
          onChange={(e) => setFormData({ ...formData, ageGroup: e.target.value })}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        >
          <option value="">Select age group</option>
          <option value="U18">Under 18</option>
          <option value="18-25">18-25</option>
          <option value="26-35">26-35</option>
          <option value="36+">36 and over</option>
        </select>
      </div>

      <div className="pt-4">
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Create Racer
        </button>
      </div>
    </form>
  );
} 