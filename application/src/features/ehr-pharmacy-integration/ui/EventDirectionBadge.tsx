"use client";
export function EventDirectionBadge({ dir }: { dir: 'in' | 'out' }) {
  const styles = dir === 'in'
    ? 'bg-sky-50 text-sky-600 border-sky-200'
    : 'bg-cyan-50 text-cyan-600 border-cyan-200';
  return (
    <span className={`inline-flex items-center px-1.5 py-0.5 rounded border text-[10px] font-medium ${styles}`}>{dir}</span>
  );
}
