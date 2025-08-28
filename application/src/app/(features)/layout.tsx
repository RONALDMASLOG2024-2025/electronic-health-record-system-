"use client";
/**
 * Shared layout shell for all feature workspace routes.
 * Each group owns content ONLY inside its page / components in its feature folder.
 */
import type { ReactNode } from "react";
import Link from "next/link";
import { FEATURES } from "@/config/features";
import { usePathname } from "next/navigation";

export default function FeaturesLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <header className="w-full border-b bg-white/80 backdrop-blur px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2 font-semibold tracking-tight text-sky-700">
          <span>⚕️</span>
          <Link href="/" className="hover:underline">EHR Pharmacy</Link>
          <span className="text-slate-400 text-xs">/ feature workspace</span>
        </div>
        <nav className="hidden md:flex gap-4 text-sm">
          {FEATURES.map(f => (
            <Link key={f.slug} href={f.route} className={`text-slate-600 hover:text-sky-700 transition-colors ${pathname === f.route ? 'font-semibold text-sky-700' : ''}`}>
              {f.title.split(" ")[0]}
            </Link>
          ))}
        </nav>
      </header>
      <main className="flex-1 w-full max-w-7xl mx-auto px-6 py-8">{children}</main>
      <footer className="py-6 text-center text-xs text-slate-400">&copy; {new Date().getFullYear()} EHR Pharmacy Cloud</footer>
    </div>
  );
}
