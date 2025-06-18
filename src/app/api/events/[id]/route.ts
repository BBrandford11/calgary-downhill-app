import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import { Event } from '@/types';

export async function GET(
  request: Request,
  context: { params: { id: string } }
) {
  const { id } = await context.params;
  try {
    const eventsPath = path.join(process.cwd(), 'data', 'events.json');
    const eventsData = await fs.readFile(eventsPath, 'utf8');
    const events: Event[] = JSON.parse(eventsData);
    
    const event = events.find(e => e.id === id);
    if (!event) {
      return NextResponse.json(
        { error: 'Event not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(event);
  } catch (error) {
    console.error('Error fetching event:', error);
    return NextResponse.json(
      { error: 'Failed to fetch event' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: Request,
  context: { params: { id: string } }
) {
  const { id } = await context.params;
  try {
    const event = await request.json();

    // Validate event ID
    if (event.id !== id) {
      return NextResponse.json(
        { error: 'Event ID mismatch' },
        { status: 400 }
      );
    }

    // Read all events
    const eventsPath = path.join(process.cwd(), 'data', 'events.json');
    const eventsData = await fs.readFile(eventsPath, 'utf8');
    const events: Event[] = JSON.parse(eventsData);

    // Update the event
    const updatedEvents = events.map(e => 
      e.id === id ? { ...e, ...event } : e
    );

    // Save updated events
    await fs.writeFile(eventsPath, JSON.stringify(updatedEvents, null, 2));

    return NextResponse.json(event);
  } catch (error) {
    console.error('Error updating event:', error);
    return NextResponse.json(
      { error: 'Failed to update event' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  context: { params: { id: string } }
) {
  const { id } = await context.params;
  try {
    const eventsPath = path.join(process.cwd(), 'data', 'events.json');
    const eventsData = await fs.readFile(eventsPath, 'utf8');
    const events: Event[] = JSON.parse(eventsData);
    
    const updatedEvents = events.filter(e => e.id !== id);
    
    await fs.writeFile(eventsPath, JSON.stringify(updatedEvents, null, 2));
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting event:', error);
    return NextResponse.json(
      { error: 'Failed to delete event' },
      { status: 500 }
    );
  }
} 