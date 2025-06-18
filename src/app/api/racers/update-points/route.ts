import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import { Racer } from '@/types';

export async function POST(request: Request) {
  try {
    const updates = await request.json();
    const racersPath = path.join(process.cwd(), 'data', 'racers.json');
    
    // Read existing racers
    const racersData = await fs.readFile(racersPath, 'utf8');
    const racers: Racer[] = JSON.parse(racersData);
    
    // Update season points for each racer
    const updatedRacers = racers.map(racer => {
      if (updates[racer.id]) {
        return {
          ...racer,
          seasonPoints: (racer.seasonPoints || 0) + updates[racer.id]
        };
      }
      return racer;
    });
    
    // Save updated racers
    await fs.writeFile(racersPath, JSON.stringify(updatedRacers, null, 2));
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating racer points:', error);
    return NextResponse.json(
      { error: 'Failed to update racer points' },
      { status: 500 }
    );
  }
} 