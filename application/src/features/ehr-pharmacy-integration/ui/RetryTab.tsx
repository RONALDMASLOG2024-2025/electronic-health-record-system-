"use client";
interface RetryEntry { eventId: string; attempts: number; nextAttemptAt: string }
export function RetryTab({ entries }: { entries: RetryEntry[] }) {
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
