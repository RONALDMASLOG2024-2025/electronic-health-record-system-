"use client";
export function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    pending: 'bg-slate-50 text-slate-600 border-slate-200',
    running: 'bg-sky-50 text-sky-700 border-sky-200',
    success: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    failed: 'bg-rose-50 text-rose-700 border-rose-200',
  };
  return <span className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium border ${map[status] || map.pending}`}>{status}</span>;
}
