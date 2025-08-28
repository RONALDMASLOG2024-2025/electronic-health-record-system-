"use client";
import { MappingRecord } from '../types';
import { useState } from 'react';
import { useMappingSuggestions } from '../hooks';

export function MappingsTab({ mappings, onResolve }: { mappings: MappingRecord[]; onResolve: (id: string, targetId: string) => void }) {
  const [active, setActive] = useState<string | null>(null);
  const activeRecord = mappings.find(m => m.id === active);
  const { suggestions } = useMappingSuggestions(activeRecord?.sourceCode);
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
                <tr key={m.id} className={`border-t last:border-b bg-white/70 ${active===m.id?'ring-1 ring-sky-200':''}`}> 
                  <td className="px-3 py-1.5 font-mono text-[11px]">{m.sourceCode}</td>
                  <td className="px-3 py-1.5 text-xs">{m.system}</td>
                  <td className="px-3 py-1.5"><span className="inline-flex items-center text-[10px] px-2 py-0.5 rounded bg-amber-50 text-amber-700 border border-amber-200">{m.status}</span></td>
                  <td className="px-3 py-1.5 text-xs flex gap-1">
                    <button onClick={() => onResolve(m.id, 'DRUG-'+m.sourceCode)} className="px-2 py-0.5 rounded bg-emerald-600 text-white text-[10px] hover:bg-emerald-700">Resolve</button>
                    <button onClick={() => setActive(a=>a===m.id?null:m.id)} className="px-2 py-0.5 rounded bg-white border border-slate-200 text-[10px] hover:border-sky-300">Suggest</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {activeRecord && suggestions && (
        <div className="border rounded-md p-4 bg-white/70 text-xs space-y-2">
          <div className="flex items-center justify-between">
            <p className="font-medium text-slate-700">Suggestions for {activeRecord.sourceCode}</p>
            <button onClick={()=>setActive(null)} className="text-[10px] text-slate-500 hover:text-slate-700">Close</button>
          </div>
          <ul className="space-y-1">
            {suggestions.candidates.map(c => (
              <li key={c.targetId} className="flex items-center gap-2">
                <span className="font-mono text-[10px] bg-slate-50 border border-slate-200 px-2 py-0.5 rounded">{c.targetId}</span>
                <span className="text-[10px] text-slate-600 flex-1">{c.label}</span>
                <span className="text-[10px] text-slate-500">{(c.confidence*100).toFixed(0)}%</span>
                <button onClick={()=>{onResolve(activeRecord.id, c.targetId); setActive(null);}} className="px-2 py-0.5 rounded bg-sky-600 text-white text-[10px]">Apply</button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}
