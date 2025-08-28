"use client";
interface MedicationItem { code: string; dose: string }
interface DiffShape { added: MedicationItem[]; removed: MedicationItem[]; changed: { from: MedicationItem; to: MedicationItem }[] }
export function DiffTab({ diff, onRecompute }: { diff: DiffShape; onRecompute: (list: MedicationItem[]) => void }) {
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
