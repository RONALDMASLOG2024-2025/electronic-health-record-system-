"use client";
import { useEffect, useState } from 'react';

interface Patient { id: string; name: string; dob: string }
interface Prescription { id: string; patientId: string; drug: string; dosage: string; quantity: number; instructions: string; status: string; createdAt: string }

export function DoctorPanel() {
  const [patients,setPatients]=useState<Patient[]>([]);
  const [prescriptions,setPrescriptions]=useState<Prescription[]>([]);
  const [loading,setLoading]=useState(true);
  const [form,setForm]=useState({ patientId:'', drug:'', dosage:'', quantity:30, instructions:'' });
  const [error,setError]=useState('');

  async function load(){
    setLoading(true);
    const res = await fetch('/api/ehr-pharmacy/prescriptions');
    if(!res.ok){ setError('Failed to load'); setLoading(false); return; }
    const j = await res.json();
    setPatients(j.patients); setPrescriptions(j.prescriptions); setLoading(false);
  }
  useEffect(()=>{load();},[]);

  async function submit(e:React.FormEvent){
    e.preventDefault();
    const res = await fetch('/api/ehr-pharmacy/prescriptions',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({...form, quantity:Number(form.quantity)})});
    if(res.ok){ setForm({ patientId:'', drug:'', dosage:'', quantity:30, instructions:''}); load(); } else { setError('Create failed'); }
  }

  if(loading) return <p className="text-xs p-4">Loading doctor workspace…</p>;
  return (
    <div className="space-y-8">
      <section className="space-y-3" aria-label="Patients">
        <h2 className="text-sm font-medium uppercase tracking-wide text-slate-600">Patients</h2>
        <ul className="border rounded-lg divide-y bg-white/70 text-xs">
          {patients.map(p => (
            <li key={p.id} className="p-3 flex items-center gap-3">
              <span className="font-medium text-slate-700">{p.name}</span>
              <span className="text-[10px] text-slate-500">DOB {p.dob}</span>
              <button onClick={()=>setForm(f=>({...f,patientId:p.id}))} className="ml-auto text-[10px] px-2 py-0.5 rounded bg-sky-600 text-white">Select</button>
            </li>
          ))}
        </ul>
      </section>
      <section className="space-y-3" aria-label="Create prescription">
        <h2 className="text-sm font-medium uppercase tracking-wide text-slate-600">New Prescription</h2>
        <form onSubmit={submit} className="space-y-3 border rounded-lg p-4 bg-white/70 text-xs max-w-lg">
          <div className="space-y-1">
            <label className="text-[10px] font-medium">Patient</label>
            <select required value={form.patientId} onChange={e=>setForm(f=>({...f,patientId:e.target.value}))} className="w-full border rounded px-2 py-1">
              <option value="">Select patient</option>
              {patients.map(pt=> <option key={pt.id} value={pt.id}>{pt.name}</option>)}
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
          {error && <p className="text-[10px] text-rose-600">{error}</p>}
        </form>
      </section>
      <section className="space-y-3" aria-label="Recent prescriptions">
        <h2 className="text-sm font-medium uppercase tracking-wide text-slate-600">My Prescriptions</h2>
        <ul className="border rounded-lg divide-y bg-white/70 text-xs">
          {prescriptions.map(pr => (
            <li key={pr.id} className="p-3 space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-medium text-slate-700">{pr.drug}</span>
                <span className={`px-1.5 py-0.5 rounded border text-[10px] ${pr.status==='dispensed'?'bg-emerald-50 text-emerald-700 border-emerald-200':pr.status==='cancelled'?'bg-rose-50 text-rose-700 border-rose-200':'bg-sky-50 text-sky-700 border-sky-200'}`}>{pr.status}</span>
                <span className="ml-auto text-[10px] text-slate-400">{new Date(pr.createdAt).toLocaleDateString()}</span>
              </div>
              <div className="text-[11px] text-slate-600">Qty {pr.quantity} • {pr.dosage} • {pr.instructions}</div>
              <div className="text-[10px] text-slate-500">Patient: {patients.find(p=>p.id===pr.patientId)?.name}</div>
            </li>
          ))}
          {prescriptions.length===0 && <li className="p-3 text-[11px] text-slate-500">No prescriptions yet.</li>}
        </ul>
      </section>
    </div>
  );
}