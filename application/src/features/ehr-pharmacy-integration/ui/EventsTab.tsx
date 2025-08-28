"use client";
import { SyncEvent } from '../types';
import { EventDirectionBadge } from './EventDirectionBadge';

export function EventsTab({ events }: { events: SyncEvent[] }) {
  return (
    <section className="space-y-3" aria-label="Event stream">
      <h2 className="text-sm font-medium text-slate-700 uppercase tracking-wide">Recent Events</h2>
      <ul className="border rounded-lg divide-y max-h-[520px] overflow-auto bg-white/70">
        {events.map(e => (
          <li key={e.id} className="px-3 py-2 text-xs flex items-center gap-2">
            <EventDirectionBadge dir={e.direction} />
            <code className="font-mono text-[11px] text-slate-600">{e.kind}</code>
            {e.status === 'error' && <span className="text-rose-600">ERR</span>}
            <span className="text-slate-400 ml-auto">{new Date(e.createdAt).toLocaleTimeString()}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
