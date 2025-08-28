"use client";
/** Group 4: EHR–Pharmacy Integration workspace */
import { useState } from 'react';
import { useIntegrationJobs, useEventStream, usePendingMappings, useSyncTrigger, useKpis, useMedicationDiff, useRetryQueue, useInjectEvent } from '@/features/ehr-pharmacy-integration/hooks';
import { IntegrationJob, SyncEvent, MappingRecord } from '@/features/ehr-pharmacy-integration/types';

const TABS = [
  { id: 'overview', label: 'Overview' },
  { id: 'events', label: 'Events' },
  { id: 'mappings', label: 'Mappings' },
  { id: 'diff', label: 'Medication Diff' },
  { id: 'retry', label: 'Retry Queue' },
];

export default function EHRIntegrationFeature() {
  const [tab, setTab] = useState('overview');
  const { jobs } = useIntegrationJobs();
  const { events } = useEventStream();
  const { mappings, resolve } = usePendingMappings();
  const { trigger, loading } = useSyncTrigger();
  const { kpis } = useKpis();
  const { diff, recompute } = useMedicationDiff();
  const { entries } = useRetryQueue();
  const injectEvent = useInjectEvent();

  return (
    <div className="space-y-8">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight">EHR–Pharmacy Integration</h1>
        <p className="text-slate-600 text-sm max-w-prose">
          Prototype surface for secure bidirectional syncing, visibility, mapping workflows and reconciliation utilities.
        </p>
      </header>

      <nav className="flex flex-wrap gap-2 text-sm" aria-label="Integration sections">
        {TABS.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} className={`px-3 py-1.5 rounded-md border text-xs font-medium transition ${tab === t.id ? 'bg-sky-600 text-white border-sky-700 shadow' : 'bg-white border-slate-200 text-slate-600 hover:border-sky-300 hover:text-sky-700'}`}>{t.label}</button>
        ))}
        <div className="ml-auto flex gap-2">
          <button onClick={() => injectEvent('PRESCRIPTION_NEW','in')} className="px-3 py-1.5 rounded-md text-xs bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100">Inject Event</button>
          <button onClick={trigger} disabled={loading} className="px-3 py-1.5 rounded-md text-xs bg-sky-600 text-white border border-sky-700 disabled:opacity-50">{loading ? 'Syncing…' : 'Manual Sync'}</button>
        </div>
      </nav>

      {tab === 'overview' && (
        <section className="space-y-8" aria-label="Overview">
          <section aria-label="Key metrics" className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <KpiCard label="Success Rate" value={(kpis.successRate * 100).toFixed(1) + '%'} />
            <KpiCard label="Avg Latency" value={kpis.avgLatencyMs + ' ms'} />
            <KpiCard label="Pending Mappings" value={kpis.pendingMappings.toString()} highlight />
            <KpiCard label="Retry Queue" value={kpis.retryQueue.toString()} highlight={kpis.retryQueue > 0} />
          </section>
          <JobsTable jobs={jobs} />
        </section>
      )}

      {tab === 'events' && (
        <EventsPanel events={events} />
      )}

      {tab === 'mappings' && (
        <MappingsPanel mappings={mappings} onResolve={resolve} />
      )}

      {tab === 'diff' && (
        <DiffPanel diff={diff} onRecompute={recompute} />
      )}

      {tab === 'retry' && (
        <RetryPanel entries={entries} />
      )}
    </div>
  );
}

function KpiCard({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className={`rounded-lg border p-4 bg-white/70 ${highlight ? 'ring-1 ring-sky-200' : ''}`}>
      <p className="text-[11px] uppercase tracking-wide text-slate-500 font-medium">{label}</p>
      <p className="text-lg font-semibold text-slate-800 mt-1">{value}</p>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    pending: 'bg-slate-50 text-slate-600 border-slate-200',
    running: 'bg-sky-50 text-sky-700 border-sky-200',
    success: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    failed: 'bg-rose-50 text-rose-700 border-rose-200',
  };
  return <span className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium border ${map[status] || 'bg-slate-50 text-slate-600 border-slate-200'}`}>{status}</span>;
}

function JobsTable({ jobs }: { jobs: IntegrationJob[] }) {
  return (
    <section className="space-y-3" aria-label="Integration jobs">
      <h2 className="text-sm font-medium text-slate-700 uppercase tracking-wide">Jobs</h2>
      <div className="border rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-slate-600 text-xs uppercase tracking-wide">
            <tr>
              <th className="text-left px-3 py-2 font-medium">Type</th>
              <th className="text-left px-3 py-2 font-medium">Status</th>
              <th className="text-left px-3 py-2 font-medium">Started</th>
              <th className="text-left px-3 py-2 font-medium">Finished</th>
            </tr>
          </thead>
          <tbody>
            {jobs.map(j => (
              <tr key={j.id} className="border-t last:border-b bg-white/70">
                <td className="px-3 py-1.5 font-mono text-[11px]">{j.type}</td>
                <td className="px-3 py-1.5"><StatusBadge status={j.status} /></td>
                <td className="px-3 py-1.5 text-xs text-slate-500">{j.startedAt && new Date(j.startedAt).toLocaleTimeString()}</td>
                <td className="px-3 py-1.5 text-xs text-slate-500">{j.finishedAt && new Date(j.finishedAt).toLocaleTimeString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function EventsPanel({ events }: { events: SyncEvent[] }) {
  return (
    <section className="space-y-3" aria-label="Event stream">
      <h2 className="text-sm font-medium text-slate-700 uppercase tracking-wide">Recent Events</h2>
      <ul className="border rounded-lg divide-y max-h-[520px] overflow-auto bg-white/70">
        {events.map(e => (
          <li key={e.id} className="px-3 py-2 text-xs flex items-center gap-2">
            <EventDirectionBadge dir={e.direction} />
            <code className="font-mono text-[11px] text-slate-600">{e.kind}</code>
            <span className="text-slate-400 ml-auto">{new Date(e.createdAt).toLocaleTimeString()}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}

function MappingsPanel({ mappings, onResolve }: { mappings: MappingRecord[]; onResolve: (id: string, targetId: string) => void }) {
  return (
    <section className="space-y-3" aria-label="Pending mappings">
      <h2 className="text-sm font-medium text-slate-700 uppercase tracking-wide">Pending Mappings</h2>
      {mappings.length === 0 ? (
        <div className="text-xs text-slate-500 border rounded-md p-4">No unresolved mapping records.</div>
      ) : (
        <div className="border rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-slate-600 text-xs uppercase tracking-wide">
              <tr>
                <th className="text-left px-3 py-2 font-medium">Source Code</th>
                <th className="text-left px-3 py-2 font-medium">System</th>
                <th className="text-left px-3 py-2 font-medium">Status</th>
                <th className="text-left px-3 py-2 font-medium">Action</th>
              </tr>
            </thead>
            <tbody>
              {mappings.map(m => (
                <tr key={m.id} className="border-t last:border-b bg-white/70">
                  <td className="px-3 py-1.5 font-mono text-[11px]">{m.sourceCode}</td>
                  <td className="px-3 py-1.5 text-xs">{m.system}</td>
                  <td className="px-3 py-1.5"><span className="inline-flex items-center text-[10px] px-2 py-0.5 rounded bg-amber-50 text-amber-700 border border-amber-200">{m.status}</span></td>
                  <td className="px-3 py-1.5 text-xs">
                    <button onClick={() => onResolve(m.id, 'DRUG-'+m.sourceCode)} className="px-2 py-0.5 rounded bg-emerald-600 text-white text-[10px] hover:bg-emerald-700">Resolve</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

interface MedicationItem { code: string; dose: string }
interface DiffShape { added: MedicationItem[]; removed: MedicationItem[]; changed: { from: MedicationItem; to: MedicationItem }[] }
function DiffPanel({ diff, onRecompute }: { diff: DiffShape; onRecompute: (list: MedicationItem[]) => void }) {
  return (
    <section className="space-y-4" aria-label="Medication diff">
      <h2 className="text-sm font-medium text-slate-700 uppercase tracking-wide">Medication Diff</h2>
      <div className="text-xs text-slate-600 space-y-2">
        <p>Simulate a new medication list to view added / removed / changed entries.</p>
        <div className="flex flex-wrap gap-2">
          <button onClick={() => onRecompute([{ code: 'RXNORM:111', dose: '10mg' }, { code: 'RXNORM:333', dose: '20mg' }])} className="px-3 py-1.5 rounded-md text-[11px] bg-white border border-slate-200 hover:border-sky-300">Scenario A</button>
          <button onClick={() => onRecompute([{ code: 'RXNORM:111', dose: '12mg' }, { code: 'RXNORM:222', dose: '5mg' }])} className="px-3 py-1.5 rounded-md text-[11px] bg-white border border-slate-200 hover:border-sky-300">Scenario B</button>
          <button onClick={() => onRecompute([{ code: 'RXNORM:999', dose: '50mg' }])} className="px-3 py-1.5 rounded-md text-[11px] bg-white border border-slate-200 hover:border-sky-300">Scenario C</button>
        </div>
      </div>
      <div className="grid md:grid-cols-3 gap-4 text-xs">
  <DiffColumn title="Added" items={diff.added.map(i => i.code+ ' '+i.dose)} color="emerald" />
  <DiffColumn title="Removed" items={diff.removed.map(i => i.code+ ' '+i.dose)} color="rose" />
  <DiffColumn title="Changed" items={diff.changed.map(c => c.from.code+ ' '+c.from.dose+' → '+c.to.dose)} color="amber" />
      </div>
    </section>
  );
}

function DiffColumn({ title, items, color }: { title: string; items: string[]; color: string }) {
  return (
    <div className={`rounded-lg border bg-white/70 p-4 border-${color}-200`}> 
      <p className={`text-[11px] uppercase tracking-wide font-medium text-${color}-700 mb-2`}>{title}</p>
      {items.length === 0 ? <p className="text-[11px] text-slate-400">None</p> : (
        <ul className="space-y-1">
          {items.map(i => <li key={i} className="px-2 py-1 rounded bg-slate-50 border border-slate-200 text-[11px]">{i}</li>)}
        </ul>
      )}
    </div>
  );
}

interface RetryEntry { eventId: string; attempts: number; nextAttemptAt: string }
function RetryPanel({ entries }: { entries: RetryEntry[] }) {
  return (
    <section className="space-y-3" aria-label="Retry queue">
      <h2 className="text-sm font-medium text-slate-700 uppercase tracking-wide">Retry Queue</h2>
      {entries.length === 0 ? <div className="text-xs text-slate-500 border rounded-md p-4">No queued retries.</div> : (
        <div className="border rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-slate-600 text-xs uppercase tracking-wide">
              <tr>
                <th className="text-left px-3 py-2 font-medium">Event ID</th>
                <th className="text-left px-3 py-2 font-medium">Attempts</th>
                <th className="text-left px-3 py-2 font-medium">Next Attempt</th>
              </tr>
            </thead>
            <tbody>
              {entries.map(r => (
                <tr key={r.eventId} className="border-t last:border-b bg-white/70">
                  <td className="px-3 py-1.5 font-mono text-[11px]">{r.eventId.slice(0,8)}…</td>
                  <td className="px-3 py-1.5 text-xs">{r.attempts}</td>
                  <td className="px-3 py-1.5 text-xs text-slate-500">{new Date(r.nextAttemptAt).toLocaleTimeString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

function EventDirectionBadge({ dir }: { dir: 'in' | 'out' }) {
  const styles = dir === 'in'
    ? 'bg-sky-50 text-sky-600 border-sky-200'
    : 'bg-cyan-50 text-cyan-600 border-cyan-200';
  return (
    <span className={`inline-flex items-center px-1.5 py-0.5 rounded border text-[10px] font-medium ${styles}`}>{dir}</span>
  );
}
