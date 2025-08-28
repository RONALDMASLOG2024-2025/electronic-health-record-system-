"use client";
import { useEffect, useState } from 'react';

interface Prescription { id: string; patientId: string; doctorId: string; drug: string; dosage: string; quantity: number; instructions: string; status: string; createdAt: string; updatedAt: string }
interface Patient { id: string; name: string; dob: string }

export default function IntegrationDashboard() {
  const [prescriptions,setPrescriptions]=useState<Prescription[]>([]);
  const [patients,setPatients]=useState<Patient[]>([]);
  const [loading,setLoading]=useState(true);
  const [error,setError]=useState('');
  const [form,setForm]=useState({ patientId:'', drug:'', dosage:'', quantity:30, instructions:'' });
  const [tab,setTab]=useState<'prescriptions'|'create'>('prescriptions');

  async function load(){
    setLoading(true);
    const res = await fetch('/api/ehr-pharmacy/prescriptions');
    if(!res.ok){ setError('Unauthorized'); setLoading(false); return; }
    const j = await res.json();
    setPrescriptions(j.prescriptions); setPatients(j.patients); setLoading(false);
    // Heuristic: if creation succeeds later we'll know doctor; else show both with gating
  }
  useEffect(()=>{load();},[]);

  async function createPrescription(e:React.FormEvent){
    e.preventDefault();
    const res = await fetch('/api/ehr-pharmacy/prescriptions',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({...form, quantity:Number(form.quantity)})});
  if(res.ok){ await load(); setForm({ patientId:'', drug:'', dosage:'', quantity:30, instructions:''}); setTab('prescriptions'); }
  }

  async function updateStatus(id:string,status:'dispensed'|'cancelled'){
    const res = await fetch(`/api/ehr-pharmacy/prescriptions/${id}`,{method:'PATCH',headers:{'Content-Type':'application/json'},body:JSON.stringify({status})});
  if(res.ok){ load(); }
  }

  if(loading) return <p className="p-8 text-sm">Loading…</p>;
  if(error) return <p className="p-8 text-sm text-rose-600">{error}</p>;

  return (
    <main className="space-y-8">
      <header className="flex flex-wrap items-center gap-4">
        <div>
          <h1 className="text-xl font-semibold">Integration Workspace</h1>
          <p className="text-xs text-slate-500">Connected prescription workflow between Doctor & Pharmacy.</p>
        </div>
        <nav className="ml-auto flex gap-2 text-xs" aria-label="Dashboard sections">
          <button onClick={()=>setTab('prescriptions')} className={`px-3 py-1.5 rounded-md border ${tab==='prescriptions'?'bg-sky-600 text-white border-sky-700':'bg-white text-slate-600 border-slate-200'}`}>Prescriptions</button>
          <button onClick={()=>setTab('create')} className={`px-3 py-1.5 rounded-md border ${tab==='create'?'bg-sky-600 text-white border-sky-700':'bg-white text-slate-600 border-slate-200'}`}>Create</button>
        </nav>
      </header>

      {tab==='prescriptions' && (
        <section className="space-y-3" aria-label="Prescriptions list">
          <h2 className="text-sm font-medium uppercase tracking-wide text-slate-600">Active Prescriptions</h2>
          <ul className="border rounded-lg divide-y bg-white/70">
            {prescriptions.map(p => (
              <li key={p.id} className="p-3 text-xs space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-slate-700">{p.drug}</span>
                  <span className={`px-1.5 py-0.5 rounded border text-[10px] ${p.status==='dispensed'?'bg-emerald-50 text-emerald-700 border-emerald-200':p.status==='cancelled'?'bg-rose-50 text-rose-700 border-rose-200':'bg-sky-50 text-sky-700 border-sky-200'}`}>{p.status}</span>
                  <span className="ml-auto text-[10px] text-slate-400">{new Date(p.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="text-[11px] text-slate-600">Qty {p.quantity} • {p.dosage} • {p.instructions}</div>
                <div className="text-[10px] text-slate-500">Patient: {patients.find(pt=>pt.id===p.patientId)?.name}</div>
                <div className="flex gap-2 pt-1">
                  <button onClick={()=>updateStatus(p.id,'dispensed')} className="text-[10px] px-2 py-0.5 rounded bg-emerald-600 text-white">Mark Dispensed</button>
                  <button onClick={()=>updateStatus(p.id,'cancelled')} className="text-[10px] px-2 py-0.5 rounded bg-rose-600 text-white">Cancel</button>
                </div>
              </li>
            ))}
            {prescriptions.length===0 && <li className="p-4 text-[11px] text-slate-500">No prescriptions yet.</li>}
          </ul>
        </section>
      )}

      {tab==='create' && (
        <section aria-label="Create prescription" className="space-y-3">
          <h2 className="text-sm font-medium uppercase tracking-wide text-slate-600">New Prescription</h2>
          <form onSubmit={createPrescription} className="space-y-3 border rounded-lg p-4 bg-white/70 text-xs max-w-lg">
            <div className="space-y-1">
              <label className="text-[10px] font-medium">Patient</label>
              <select required value={form.patientId} onChange={e=>setForm(f=>({...f,patientId:e.target.value}))} className="w-full border rounded px-2 py-1">
                <option value="">Select patient</option>
                {patients.map(pt=><option key={pt.id} value={pt.id}>{pt.name}</option>)}
              </select>
            </div>
            <div className="flex gap-2">
              <input required placeholder="Drug" value={form.drug} onChange={e=>setForm(f=>({...f,drug:e.target.value}))} className="flex-1 border rounded px-2 py-1" />
              <input required placeholder="Dosage" value={form.dosage} onChange={e=>setForm(f=>({...f,dosage:e.target.value}))} className="w-32 border rounded px-2 py-1" />
            </div>
            <div className="flex gap-2">
              <input required type="number" min={1} placeholder="Qty" value={form.quantity} onChange={e=>setForm(f=>({...f,quantity:Number(e.target.value)}))} className="w-24 border rounded px-2 py-1" />
              <input required placeholder="Instructions" value={form.instructions} onChange={e=>setForm(f=>({...f,instructions:e.target.value}))} className="flex-1 border rounded px-2 py-1" />
            </div>
            <button className="w-full bg-sky-600 text-white rounded py-1.5 text-xs">Create Prescription</button>
          </form>
        </section>
      )}
    </main>
  );
}
