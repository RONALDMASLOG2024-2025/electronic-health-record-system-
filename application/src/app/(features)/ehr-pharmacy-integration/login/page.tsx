"use client";
import { useEffect, useState } from 'react';
import Link from 'next/link';

type RoleTab = 'doctor' | 'pharmacist' | 'custom';

export default function IntegrationLogin() {
  const [roleTab,setRoleTab] = useState<RoleTab>('doctor');
  const [email,setEmail]=useState('doc@gmail.com');
  const [password,setPassword]=useState('doctor123');
  const [showPassword,setShowPassword]=useState(false);
  const [loading,setLoading]=useState(false);
  const [error,setError]=useState('');
  const [checking,setChecking]=useState(true);

  // If already authenticated, redirect straight to dashboard
  useEffect(()=>{(async()=>{
    try { const r = await fetch('/api/ehr-pharmacy/auth/me',{cache:'no-store'}); const j= await r.json(); if(j.user){ window.location.replace('/ehr-pharmacy-integration/dashboard'); return; } } catch {} finally { setChecking(false); }
  })();},[]);

  // Sync preset credentials when switching tabs
  useEffect(()=>{
  if(roleTab==='doctor'){ setEmail('doc@gmail.com'); setPassword('doctor123'); }
  else if(roleTab==='pharmacist'){ setEmail('pharm@gmail.com'); setPassword('pharm123'); }
  },[roleTab]);

  async function submit(e: React.FormEvent){
    e.preventDefault(); if(loading) return; setLoading(true); setError('');
    try {
      const res = await fetch('/api/ehr-pharmacy/auth/login',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({email,password})});
      if(res.ok){ window.location.href='/ehr-pharmacy-integration/dashboard'; return; }
      let msg='Login failed';
      try { const j= await res.json(); msg=j.error||msg; } catch {}
      setError(msg);
  } catch {
      setError('Network error');
    } finally { setLoading(false); }
  }

  return (
    <div className="min-h-screen relative flex items-center justify-center bg-gradient-to-br from-slate-900 via-sky-900 to-slate-800 px-4 py-10">
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-40">
        <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-sky-600 blur-3xl mix-blend-screen animate-pulse" />
        <div className="absolute bottom-0 right-0 w-[28rem] h-[28rem] rounded-full bg-cyan-400/40 blur-3xl mix-blend-screen animate-pulse [animation-delay:800ms]" />
      </div>
      <main className="relative w-full max-w-md">
        <div className="backdrop-blur-xl bg-white/10 border border-white/15 shadow-2xl rounded-2xl overflow-hidden">
          <header className="px-6 pt-6 pb-4">
            <h1 className="text-lg font-semibold text-white tracking-wide">EHR ↔ Pharmacy Portal</h1>
            <p className="text-[11px] text-slate-300 mt-1">Secure prescription workflow access.</p>
          </header>
          <nav className="flex text-[11px] font-medium border-b border-white/10">
            {['doctor','pharmacist','custom'].map(tab => (
              <button key={tab} onClick={()=>setRoleTab(tab as RoleTab)} className={`flex-1 py-2.5 capitalize transition relative ${roleTab===tab?'text-white':'text-slate-300 hover:text-white'}`}> 
                {tab==='custom'?'Custom':tab}
                {roleTab===tab && <span className="absolute inset-x-3 bottom-0 h-0.5 bg-gradient-to-r from-sky-400 to-cyan-300 rounded-full" />}
              </button>
            ))}
          </nav>
          <form onSubmit={submit} className="px-6 py-6 space-y-5">
            <div className="space-y-1.5">
              <label className="text-[11px] uppercase tracking-wide font-semibold text-slate-200">Email</label>
              <input value={email} onChange={e=>{ setEmail(e.target.value); if(roleTab!=='custom') setRoleTab('custom'); }} className="w-full rounded-md bg-slate-900/60 border border-white/10 focus:border-sky-400 focus:ring-2 focus:ring-sky-500/30 px-3 py-2 text-sm text-white placeholder:text-slate-500 outline-none transition" type="email" autoComplete="username" required />
            </div>
            <div className="space-y-1.5">
              <label className="text-[11px] uppercase tracking-wide font-semibold text-slate-200">Password</label>
              <div className="relative group">
                <input value={password} onChange={e=>{ setPassword(e.target.value); if(roleTab!=='custom') setRoleTab('custom'); }} className="w-full rounded-md bg-slate-900/60 border border-white/10 focus:border-sky-400 focus:ring-2 focus:ring-sky-500/30 px-3 py-2 pr-10 text-sm text-white placeholder:text-slate-500 outline-none transition" type={showPassword?'text':'password'} autoComplete="current-password" required />
                <button type="button" onClick={()=>setShowPassword(s=>!s)} className="absolute top-1/2 -translate-y-1/2 right-2 text-[10px] px-2 py-1 rounded bg-slate-700/40 text-slate-300 hover:text-white hover:bg-slate-600/60 transition">{showPassword?'Hide':'Show'}</button>
              </div>
            </div>
            {error && <div className="text-[11px] text-rose-400 bg-rose-950/40 border border-rose-800/40 px-3 py-2 rounded-md">{error}</div>}
            <button disabled={loading||checking} className="w-full relative overflow-hidden rounded-md bg-gradient-to-r from-sky-600 to-cyan-500 text-white text-sm font-medium py-2.5 shadow-lg shadow-sky-900/40 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-cyan-400/50">
              <span className="relative z-10">{checking?'Checking session…':loading?'Authenticating…':'Access Portal'}</span>
              <span className="absolute inset-0 opacity-0 group-hover:opacity-100 transition bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.2),transparent_60%)]" />
            </button>
            <div className="text-[10px] text-slate-400 leading-relaxed space-y-1">
              <p>Demo Accounts:</p>
              <p><span className="font-medium text-sky-300">Doctor</span>: doc@gmail.com / doctor123</p>
              <p><span className="font-medium text-cyan-300">Pharmacist</span>: pharm@gmail.com / pharm123</p>
              <p className="pt-1"><span className="text-amber-300">Dev Tip</span>: Use the quick role page for instant sessions.</p>
            </div>
            <div className="pt-2 flex justify-between items-center text-[10px]">
              <a href="/ehr-pharmacy-integration/simple-login" className="text-sky-300 hover:text-white transition underline underline-offset-2">Quick Role Login</a>
              <Link href="/" className="text-slate-400 hover:text-white transition">Back Home</Link>
            </div>
          </form>
        </div>
        <p className="mt-4 text-center text-[10px] text-slate-400">Environment: <code>{process.env.NODE_ENV}</code></p>
      </main>
    </div>
  );
}
