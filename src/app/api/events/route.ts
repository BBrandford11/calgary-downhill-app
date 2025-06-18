import { NextResponse } from 'next/server';
import { getEvents, saveEvent } from '@/lib/storage';

export async function GET() {
  try {
    const events = getEvents();
    return NextResponse.json(events);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch events' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const event = await request.json();
    const savedEvent = await saveEvent(event);
    return NextResponse.json(savedEvent);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create event' },
      { status: 500 }
    );
  }
} 