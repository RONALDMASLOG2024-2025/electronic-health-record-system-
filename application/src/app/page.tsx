
// ...existing code...

"use client";
import { Button } from "../../components/ui/button";
import { Card } from "../../components/ui/card";
import { Particles } from "../../components/visual/Particles";
import Image from "next/image";
import Link from "next/link";
// @ts-expect-error: framer-motion has no type declarations in node_modules
import { motion } from "framer-motion";
import { FEATURES } from "@/config/features";

// Use central registry so feature cards update in one place.
const features = FEATURES;

export default function Home() {
  return (
  <div className="relative min-h-screen flex flex-col font-sans bg-gradient-to-br from-sky-50 via-white to-sky-100 text-slate-900">
      <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-sky-700 text-white px-4 py-2 rounded-md">Skip to content</a>
      <Particles density={80} color="#0ea5e9" opacity={0.5} />
      {/* Hero Section */}
  <header className="relative w-full py-28 px-4 sm:px-10 flex flex-col items-center justify-center text-center bg-white/70 shadow-sm border-b border-sky-100 z-10">
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <div className="flex flex-col items-center mb-10 max-w-5xl mx-auto">
            <Image src="/ehr-logo.svg" alt="MedSync Cloud logo" width={72} height={72} className="mb-4 drop-shadow" />
            <h1 className="text-4xl sm:text-5xl font-extrabold mb-4 tracking-tight leading-tight text-sky-800">
              MedSync Cloud
            </h1>
            <p className="text-xs sm:text-sm uppercase tracking-wider text-sky-600 font-semibold mb-1">Connected Medication Intelligence</p>
            <p className="text-[11px] sm:text-xs tracking-wide text-sky-500 font-medium">Safety • Efficiency • Adherence • Integration</p>
          </div>
          <p className="text-lg sm:text-xl mb-10 text-slate-600 max-w-3xl mx-auto leading-relaxed px-2">
            Reduce medication errors, streamline inventory operations, drive adherence, and synchronize EHR ↔ pharmacy data — all inside one secure workspace.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/signup"><Button size="lg" className="bg-sky-600 hover:bg-sky-700 shadow-md font-semibold">Request Access</Button></Link>
            <Link href="#features"><Button size="lg" variant="outline" className="font-semibold">Explore Features</Button></Link>
            <Link href="/demo"><Button size="lg" variant="ghost" className="font-semibold">View Demo</Button></Link>
          </div>
        </motion.div>
      </header>

      {/* Features Overview */}
  <section id="features" className="py-20 px-4 sm:px-10 bg-transparent relative z-10" aria-labelledby="features-heading">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          id="features-heading"
          className="text-2xl sm:text-3xl font-bold text-center mb-12 text-blue-800 tracking-tight"
        >
          System Features
        </motion.h2>
  <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
          {features.map((feature, idx) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.1 }}
            >
              <Card className="group relative p-7 rounded-xl shadow-sm bg-white/95 backdrop-blur border border-sky-100 flex flex-col items-start text-left hover:shadow-lg hover:border-sky-300 transition-all duration-200 focus-within:ring-2 focus-within:ring-sky-300">
                <div className="flex items-center justify-center w-14 h-14 rounded-lg bg-sky-50 border border-sky-100 mb-4 group-hover:scale-105 transition">
                  <Image src={feature.icon} alt={feature.title + ' icon'} width={34} height={34} />
                </div>
                <h3 className="text-base font-semibold text-sky-800 mb-2 leading-snug">{feature.title}</h3>
                <p className="text-slate-600 text-sm leading-relaxed flex-1">{feature.summary}</p>
                <div className="mt-4 flex items-center gap-2 text-xs text-sky-600 font-medium">
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-sky-400" /> {feature.owner}
                </div>
                <Link href={feature.route} className="mt-5 inline-flex items-center gap-1 text-xs font-medium text-sky-600 hover:text-sky-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 rounded">
                  Open Workspace <span aria-hidden>→</span>
                </Link>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* About / Value Proposition */}
  <section id="value" className="py-20 px-4 sm:px-10 bg-white/85 relative z-10" aria-labelledby="value-heading">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="max-w-3xl mx-auto text-center"
        >
          <h2 id="value-heading" className="text-xl sm:text-2xl font-bold text-blue-800 mb-6">Why Choose MedSync Cloud?</h2>
          <p className="text-gray-700 text-base mb-2">
            Our platform streamlines medication management for doctors, pharmacists, and patients. By integrating cloud-based EHR and pharmacy workflows, we help reduce errors, save time, and improve patient outcomes.
          </p>
          <p className="text-gray-700 text-base">
            Experience secure, scalable, and user-friendly tools designed for modern healthcare needs.
          </p>
        </motion.div>
      </section>

      {/* Call-to-Action Section */}
      <section className="py-24 px-4 sm:px-10 bg-gradient-to-b from-sky-50/60 to-white flex flex-col items-center border-t border-sky-100 relative z-10" aria-labelledby="cta-heading">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.65, ease: 'easeOut' }}
          className="w-full max-w-6xl"
        >
          <div className="relative">
            {/* Gradient ring */}
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-sky-200 via-cyan-100 to-sky-200 opacity-60 blur-sm" aria-hidden />
            <div className="relative rounded-2xl bg-white/80 backdrop-blur-md border border-sky-100 shadow-sm overflow-hidden">
              <div className="px-6 sm:px-12 py-14 grid gap-10 lg:grid-cols-[1fr_420px] items-center">
                <div className="space-y-6 text-center lg:text-left">
                  <h2 id="cta-heading" className="text-3xl sm:text-4xl font-extrabold tracking-tight text-sky-800">
                    Elevate Medication Management Confidence
                  </h2>
                  <p className="text-slate-600 text-base sm:text-lg leading-relaxed max-w-xl mx-auto lg:mx-0">
                    Deploy a unified platform that reduces prescribing risk, keeps inventory healthy, boosts adherence, and closes data gaps between EHR and pharmacy.
                  </p>
                  <ul className="text-slate-600 text-sm sm:text-[15px] grid gap-3 sm:grid-cols-2 lg:grid-cols-1 max-w-xl mx-auto lg:mx-0" aria-label="Key value points">
                    <li className="flex items-start gap-2"><span className="mt-1 inline-block w-2 h-2 rounded-full bg-sky-500" aria-hidden></span><span><strong>Error Intelligence:</strong> Surface high‑risk prescriptions before dispensing.</span></li>
                    <li className="flex items-start gap-2"><span className="mt-1 inline-block w-2 h-2 rounded-full bg-cyan-500" aria-hidden></span><span><strong>Operational Clarity:</strong> Real‑time stock, expiries & reorder signals.</span></li>
                    <li className="flex items-start gap-2"><span className="mt-1 inline-block w-2 h-2 rounded-full bg-sky-400" aria-hidden></span><span><strong>Adherence Signals:</strong> Identify non‑adherence trends early.</span></li>
                    <li className="flex items-start gap-2"><span className="mt-1 inline-block w-2 h-2 rounded-full bg-cyan-400" aria-hidden></span><span><strong>Seamless Integration:</strong> Secure EHR ↔ pharmacy data sync.</span></li>
                  </ul>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-4">
                    <Link href="/signup" className="inline-flex">
                      <Button size="lg" className="bg-sky-600 hover:bg-sky-700 shadow-md font-semibold w-full sm:w-auto">Request Access</Button>
                    </Link>
                    <Link href="/demo" className="inline-flex">
                      <Button size="lg" variant="outline" className="font-semibold w-full sm:w-auto">Schedule Demo</Button>
                    </Link>
                    <Link href="/login" className="inline-flex">
                      <Button size="lg" variant="ghost" className="font-semibold w-full sm:w-auto">Log In</Button>
                    </Link>
                  </div>
                  <p className="text-xs text-slate-500 pt-3 max-w-xl mx-auto lg:mx-0">
                    By requesting access you agree to our <Link href="/terms" className="underline decoration-sky-400/60 hover:decoration-sky-600">Terms</Link> & <Link href="/privacy" className="underline decoration-sky-400/60 hover:decoration-sky-600">Privacy Policy</Link>.
                  </p>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-2 gap-4 sm:gap-6 text-center lg:text-left">
                  <div className="p-4 rounded-lg bg-sky-50/70 border border-sky-100">
                    <p className="text-2xl font-bold text-sky-700">98%+</p>
                    <p className="text-[11px] uppercase tracking-wide text-slate-500 font-medium">Order Accuracy*</p>
                  </div>
                  <div className="p-4 rounded-lg bg-cyan-50/70 border border-cyan-100">
                    <p className="text-2xl font-bold text-cyan-700">35%</p>
                    <p className="text-[11px] uppercase tracking-wide text-slate-500 font-medium">Inventory Waste ↓</p>
                  </div>
                  <div className="p-4 rounded-lg bg-sky-50/70 border border-sky-100">
                    <p className="text-2xl font-bold text-sky-700">+22%</p>
                    <p className="text-[11px] uppercase tracking-wide text-slate-500 font-medium">Adherence Lift</p>
                  </div>
                  <div className="p-4 rounded-lg bg-cyan-50/70 border border-cyan-100">
                    <p className="text-2xl font-bold text-cyan-700"><span className="align-baseline">24/7</span></p>
                    <p className="text-[11px] uppercase tracking-wide text-slate-500 font-medium">Cloud Secure</p>
                  </div>
                  <div className="col-span-2 sm:col-span-3 lg:col-span-2 text-[10px] text-slate-400 pt-1 text-center lg:text-left">
                    *Illustrative performance metrics for prototype stage.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="w-full py-10 px-4 sm:px-10 bg-white/90 border-t border-sky-100 mt-auto relative z-10">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-6 text-sm text-slate-600">
          <div className="flex gap-4 flex-wrap items-center">
            <Link href="/docs" className="hover:underline hover:text-sky-700">Documentation</Link>
            <a href="https://github.com/RONALDMASLOG2024-2025/electronic-health-record-system-" target="_blank" rel="noopener noreferrer" className="hover:underline hover:text-sky-700">GitHub</a>
            <a href="mailto:support@ehrpharmacy.com" className="hover:underline hover:text-sky-700">Support</a>
          </div>
          <span className="text-xs text-slate-400">© {new Date().getFullYear()} MedSync Cloud</span>
        </div>
      </footer>
    </div>
  );
}
