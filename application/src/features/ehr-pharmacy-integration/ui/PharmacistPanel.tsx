"use client";
import { useEffect, useState } from 'react';

interface Prescription { id: string; patientId: string; drug: string; dosage: string; quantity: number; instructions: string; status: string; createdAt: string }
interface Patient { id: string; name: string; dob: string }

export function PharmacistPanel() {
  const [prescriptions,setPrescriptions]=useState<Prescription[]>([]);
  const [patients,setPatients]=useState<Patient[]>([]);
  const [loading,setLoading]=useState(true);
  const [filter,setFilter]=useState<'all'|'new'|'dispensed'>('all');
  const [error,setError]=useState('');

  async function load(){
    setLoading(true);
    const res = await fetch('/api/ehr-pharmacy/prescriptions');
    if(!res.ok){ setError('Failed to load'); setLoading(false); return; }
    const j = await res.json();
    setPrescriptions(j.prescriptions); setPatients(j.patients); setLoading(false);
  }
  useEffect(()=>{load();},[]);

  async function mark(id:string,status:'dispensed'|'cancelled'){
    const res = await fetch(`/api/ehr-pharmacy/prescriptions/${id}`,{method:'PATCH',headers:{'Content-Type':'application/json'},body:JSON.stringify({status})});
    if(res.ok){ load(); } else { setError('Update failed'); }
  }

  const shown = prescriptions.filter(p => filter==='all'? true : p.status===filter);

  if(loading) return <p className="text-xs p-4">Loading pharmacy workspace…</p>;
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 text-xs">
        <label className="text-[10px] font-medium">Filter</label>
  <select value={filter} onChange={e=>setFilter(e.target.value as 'all'|'new'|'dispensed')} className="border rounded px-2 py-1">
          <option value="all">All</option>
          <option value="new">New</option>
          <option value="dispensed">Dispensed</option>
        </select>
        {error && <span className="text-rose-600 ml-auto">{error}</span>}
      </div>
      <ul className="border rounded-lg divide-y bg-white/70 text-xs" aria-label="Prescriptions to process">
        {shown.map(p => (
          <li key={p.id} className="p-3 space-y-1">
            <div className="flex items-center gap-2">
              <span className="font-medium text-slate-700">{p.drug}</span>
              <span className={`px-1.5 py-0.5 rounded border text-[10px] ${p.status==='dispensed'?'bg-emerald-50 text-emerald-700 border-emerald-200':p.status==='cancelled'?'bg-rose-50 text-rose-700 border-rose-200':'bg-sky-50 text-sky-700 border-sky-200'}`}>{p.status}</span>
              <span className="ml-auto text-[10px] text-slate-400">{new Date(p.createdAt).toLocaleDateString()}</span>
            </div>
            <div className="text-[11px] text-slate-600">Qty {p.quantity} • {p.dosage} • {p.instructions}</div>
            <div className="text-[10px] text-slate-500">Patient: {patients.find(pt=>pt.id===p.patientId)?.name}</div>
            {p.status==='new' && (
              <div className="flex gap-2 pt-1">
                <button onClick={()=>mark(p.id,'dispensed')} className="text-[10px] px-2 py-0.5 rounded bg-emerald-600 text-white">Dispense</button>
                <button onClick={()=>mark(p.id,'cancelled')} className="text-[10px] px-2 py-0.5 rounded bg-rose-600 text-white">Cancel</button>
              </div>
            )}
          </li>
        ))}
        {shown.length===0 && <li className="p-3 text-[11px] text-slate-500">Nothing to display.</li>}
      </ul>
    </div>
  );
}