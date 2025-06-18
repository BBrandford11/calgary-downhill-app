import { NextResponse } from 'next/server';
import { getRacers, saveRacer } from '@/lib/storage';

export async function GET() {
  try {
    const racers = getRacers();
    return NextResponse.json(racers);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch racers' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const racer = await request.json();
    const savedRacer = await saveRacer(racer);
    return NextResponse.json(savedRacer);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create racer' },
      { status: 500 }
    );
  }
} 