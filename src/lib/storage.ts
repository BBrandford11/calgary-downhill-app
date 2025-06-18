import fs from 'fs';
import path from 'path';
import { Racer, Event } from '@/types';

const DATA_DIR = path.join(process.cwd(), 'data');
const RACERS_FILE = path.join(DATA_DIR, 'racers.json');
const EVENTS_FILE = path.join(DATA_DIR, 'events.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Initialize files if they don't exist
for (const file of [RACERS_FILE, EVENTS_FILE]) {
  if (!fs.existsSync(file)) {
    fs.writeFileSync(file, '[]', 'utf-8');
  }
}

// Racer operations
export const getRacers = (): Racer[] => {
  const data = fs.readFileSync(RACERS_FILE, 'utf-8');
  return JSON.parse(data);
};

export const saveRacer = async (racer: Racer): Promise<Racer> => {
  const racers = getRacers();
  racers.push(racer);
  fs.writeFileSync(RACERS_FILE, JSON.stringify(racers, null, 2));
  return racer;
};

export const updateRacer = async (racer: Racer): Promise<Racer> => {
  const racers = getRacers();
  const index = racers.findIndex((r) => r.id === racer.id);
  if (index === -1) throw new Error('Racer not found');
  racers[index] = racer;
  fs.writeFileSync(RACERS_FILE, JSON.stringify(racers, null, 2));
  return racer;
};

// Event operations
export const getEvents = (): Event[] => {
  const data = fs.readFileSync(EVENTS_FILE, 'utf-8');
  return JSON.parse(data);
};

export const saveEvent = async (event: Event): Promise<Event> => {
  const events = getEvents();
  events.push(event);
  fs.writeFileSync(EVENTS_FILE, JSON.stringify(events, null, 2));
  return event;
};

export const updateEvent = async (event: Event): Promise<Event> => {
  const events = getEvents();
  const index = events.findIndex((e) => e.id === event.id);
  if (index === -1) throw new Error('Event not found');
  events[index] = event;
  fs.writeFileSync(EVENTS_FILE, JSON.stringify(events, null, 2));
  return event;
}; 