"use client";
import { IntegrationJob, IntegrationKpis } from '../types';
import { StatusBadge } from './StatusBadge';

export function OverviewTab({ jobs, kpis }: { jobs: IntegrationJob[]; kpis: IntegrationKpis }) {
  return (
    <section className="space-y-8" aria-label="Overview">
      <section aria-label="Key metrics" className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard label="Success Rate" value={(kpis.successRate * 100).toFixed(1) + '%'} />
        <KpiCard label="Avg Latency" value={kpis.avgLatencyMs + ' ms'} />
        <KpiCard label="Pending Mappings" value={kpis.pendingMappings.toString()} highlight={kpis.pendingMappings>0} />
        <KpiCard label="Retry Queue" value={kpis.retryQueue.toString()} highlight={kpis.retryQueue > 0} />
      </section>
      <JobsTable jobs={jobs} />
    </section>
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
