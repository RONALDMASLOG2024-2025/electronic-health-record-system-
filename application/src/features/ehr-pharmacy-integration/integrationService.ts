// In-memory offline integration service simulating core functions.
// This layer can later be swapped with Supabase/Postgres persistence.
import { IntegrationJob, SyncEvent, MappingRecord, IntegrationKpis, ManualSyncResult, MappingSuggestion } from './types';
import { mockJobs, mockEvents, mockMappings, mockKpis } from './mocks';

// Internal mutable state (offline DB)
let jobs: IntegrationJob[] = [...mockJobs];
let events: SyncEvent[] = [...mockEvents];
let mappings: MappingRecord[] = [...mockMappings];
let kpis: IntegrationKpis = { ...mockKpis };

// Medication snapshots for diff prototype
interface MedicationItem { code: string; dose: string; }
let lastSnapshot: MedicationItem[] = [
  { code: 'RXNORM:111', dose: '10mg' },
  { code: 'RXNORM:222', dose: '5mg' },
];

// Subscribers
const eventListeners = new Set<(e: SyncEvent) => void>();

function emitEvent(e: SyncEvent) {
  for (const l of eventListeners) l(e);
}

// Utility
const nowIso = () => new Date().toISOString();

export function persistSyncJob(type: string): IntegrationJob {
  const job: IntegrationJob = {
    id: crypto.randomUUID(),
    type,
    status: 'running',
    startedAt: nowIso(),
  };
  jobs = [job, ...jobs].slice(0, 50);
  return job;
}

export function completeJob(id: string, ok: boolean, metrics?: Record<string, unknown>) {
  jobs = jobs.map(j => j.id === id ? { ...j, status: ok ? 'success' : 'failed', finishedAt: nowIso(), metrics } : j);
  recalcKpis();
}

export async function triggerManualSync(): Promise<ManualSyncResult> {
  const job = persistSyncJob('MED_LIST_PULL');
  // Simulate async work
  await new Promise(r => setTimeout(r, 400));
  // Fake ingest event
  ingestEvent({ kind: 'MED_LIST_PULL', direction: 'in', payload: { source: 'EHR' } });
  completeJob(job.id, true, { medsProcessed: 125, changes: 2 });
  return { jobId: job.id };
}

export interface IngestPayload<P = unknown> { kind: string; direction: 'in' | 'out'; payload: P; }
export function ingestEvent(p: IngestPayload): SyncEvent {
  const evt: SyncEvent = {
    id: crypto.randomUUID(),
    correlationId: crypto.randomUUID(),
    direction: p.direction,
    kind: p.kind,
    status: 'success',
    createdAt: nowIso(),
    payload: p.payload,
  };
  events = [evt, ...events].slice(0, 200);
  emitEvent(evt);
  recalcKpis();
  return evt;
}

export function ingestFailureEvent(p: IngestPayload & { error: string }): SyncEvent {
  const evt: SyncEvent = {
    id: crypto.randomUUID(),
    correlationId: crypto.randomUUID(),
    direction: p.direction,
    kind: p.kind,
    status: 'error',
    createdAt: nowIso(),
    payload: p.payload,
    error: p.error,
  };
  events = [evt, ...events].slice(0, 200);
  scheduleRetry(evt.id);
  emitEvent(evt);
  recalcKpis();
  return evt;
}

export function streamEvents(onEvent: (e: SyncEvent) => void) {
  eventListeners.add(onEvent);
  return () => eventListeners.delete(onEvent);
}

export function getJobs() { return jobs; }
export function getEvents(limit = 50) { return events.slice(0, limit); }
export function getMappings() { return mappings; }

export function resolveMapping(id: string, targetId: string) {
  mappings = mappings.map(m => m.id === id ? { ...m, targetId, status: 'resolved', updatedAt: nowIso() } : m);
  recalcKpis();
}

export function getMappingSuggestions(sourceCode: string): MappingSuggestion {
  // Dummy scoring
  const base = sourceCode.replace(/[^0-9]/g, '').slice(0,5) || '00000';
  return {
    sourceCode,
    candidates: [
      { targetId: 'DRUG-'+base+'A', confidence: 0.93, label: 'Generic Base A '+base },
      { targetId: 'DRUG-'+base+'B', confidence: 0.81, label: 'Brand Alt '+base },
      { targetId: 'DRUG-'+base+'C', confidence: 0.67, label: 'Legacy Code '+base },
    ],
  };
}

export interface MedicationDiffResult {
  added: MedicationItem[]; removed: MedicationItem[]; changed: { from: MedicationItem; to: MedicationItem }[];
}
export function computeMedicationDiff(newList: MedicationItem[]): MedicationDiffResult {
  const added = newList.filter(n => !lastSnapshot.find(o => o.code === n.code));
  const removed = lastSnapshot.filter(o => !newList.find(n => n.code === o.code));
  const changed: { from: MedicationItem; to: MedicationItem }[] = [];
  for (const n of newList) {
    const prev = lastSnapshot.find(o => o.code === n.code);
    if (prev && prev.dose !== n.dose) changed.push({ from: prev, to: n });
  }
  lastSnapshot = newList;
  return { added, removed, changed };
}

export function generateKpis(): IntegrationKpis {
  return kpis;
}

export const getKpis = generateKpis;

function recalcKpis() {
  const successEvents = events.filter(e => e.status === 'success').length;
  const total = events.length || 1;
  kpis = { ...kpis, successRate: successEvents / total, pendingMappings: mappings.filter(m => m.status === 'pending').length };
}

export function getAuditTrail(correlationId: string): SyncEvent[] {
  return events.filter(e => e.correlationId === correlationId);
}

// Retry scheduling (offline simulation only)
interface RetryEntry { eventId: string; attempts: number; nextAttemptAt: string; }
const retryQueue: RetryEntry[] = [];
export function scheduleRetry(eventId: string) {
  const existing = retryQueue.find(r => r.eventId === eventId);
  if (existing) {
    existing.attempts += 1;
    existing.nextAttemptAt = new Date(Date.now() + Math.min(60000 * existing.attempts, 3600000)).toISOString();
  } else {
    retryQueue.push({ eventId, attempts: 1, nextAttemptAt: new Date(Date.now() + 60000).toISOString() });
  }
  kpis = { ...kpis, retryQueue: retryQueue.length };
}
export function getRetryQueue() { return retryQueue; }
