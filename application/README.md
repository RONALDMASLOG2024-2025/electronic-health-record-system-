# Electronic Health Record System

A modular Next.js (TypeScript) project using shadcn/ui for UI and Supabase for backend (auth, database, API). Each major feature is developed in its own folder for easy group collaboration and forking.

---

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).



## 🚀 Project Setup

1. **Clone the repository:**
	```bash
	git clone <repo-url>
	cd electronic-health-record-system-/application
	```
2. **Install dependencies:**
	```bash
	npm install
	# or
	yarn install
	```
3. **Run the development server:**
	```bash
	npm run dev
	# or
	yarn dev
	```

4. **Open in browser:**
	Visit [http://localhost:3000](http://localhost:3000)

---

## 🌐 Landing Page Setup & Customization

The landing page is implemented in `src/app/page.tsx` using Next.js, TypeScript, shadcn/ui, and Framer Motion for subtle animations.

**To customize content:**
- **Text & Headlines:** Edit the text in `src/app/page.tsx` for hero, features, about/value, CTA, and footer sections.
- **Feature List:** Update the `features` array in `src/app/page.tsx` for feature names and descriptions.
- **Images/Logo:** Replace or update images in `/public` and update the `Image` components in `page.tsx`.
- **Links:** Update URLs in the footer and CTA buttons as needed.
- **Colors & Styles:** Adjust Tailwind CSS classes in `page.tsx` or global styles in `globals.css`.

All content is written to be professional, concise, and user-oriented. Team members can easily update text, images, and links directly in `page.tsx` for future changes.

---

## 🧭 Feature Workspace Scaffold

We use the Next.js App Router with a route group `(features)` to isolate each group’s page and reduce merge conflicts.

Structure:

```
src/
	app/
		(features)/
			layout.tsx                 # Shared shell (nav + footer) for feature workspaces
			prescription-errors/       # Group 1 route page
			inventory-management/      # Group 2 route page
			medication-non-adherence/  # Group 3 route page
			ehr-pharmacy-integration/  # Group 4 route page
			remote-consultation/       # Group 5 route page
	config/
		features.ts                  # Central registry powering landing page cards
```

Guidelines:
1. Only maintainers edit `src/config/features.ts`.
2. Each group edits ONLY its route folder under `(features)` plus its domain logic under an eventual `src/features/<slug>` directory (to be added as implementation grows).
3. Landing page (`src/app/page.tsx`) stays marketing-focused and pulls from the registry—no business logic.
4. Keep complex logic (data fetching, Supabase queries) out of the route component; put it in `src/features` (future addition) and import hooks.

Adding a New Feature (Manual):
1. Add entry to `src/config/features.ts`.
2. Create `src/app/(features)/<new-feature>/page.tsx`.
3. (Optional) Create `src/features/<new-feature>/` for hooks, components, types.

---

---



## 📁 Folder Structure

```
application/
	features/
		prescription-errors/           # Group 1: Prescription Errors
		inventory-management/          # Group 2: Inventory Management
		medication-non-adherence/      # Group 3: Medication Non-Adherence
		ehr-pharmacy-integration/      # Group 4: EHR ↔ Pharmacy Integration (your group)
		remote-consultation/           # Group 5: Remote Patient Medication Consultation
	src/
		app/                          # Next.js app directory
		lib/                          # Shared utilities
	public/                         # Static assets
	...other config files
```

Each feature folder is dedicated to a group’s task. All code, components, and pages for a feature should be placed inside its respective folder.

---

## 🧑‍💻 Contribution Guide

1. **Fork the repository** on GitHub.
2. **Clone your fork** locally:
	```bash
	git clone <your-fork-url>
	```
3. **Create a new branch** for your feature work:
	```bash
	git checkout -b <feature-name>/<your-group>
	# Example: git checkout -b ehr-pharmacy-integration/group-4
	```
4. **Work inside your assigned feature folder** under `/features`.
5. **Commit and push** your changes:
	```bash
	git add .
	git commit -m "Implement <feature-name>"
	git push origin <your-branch>
	```
6. **Open a Pull Request** to merge your work into the main repository.

---

## 🛠️ Tech Stack
- [Next.js](https://nextjs.org/) (TypeScript)
- [shadcn/ui](https://ui.shadcn.com/) (UI components)
- [Supabase](https://supabase.com/) (Auth, Database, API)

---
<div align="center">

# MedSync Cloud – Electronic Health Record & Medication Management Platform

Modern, modular EHR + medication coordination foundation built with Next.js (App Router + TypeScript), Tailwind CSS, lightweight shadcn-style components, Framer Motion, and a planned Supabase backend. Designed for multi‑team parallel development with minimal merge friction and a clear separation between marketing, routing, and domain logic.

</div>

---

## � Core Principles
1. Modular feature isolation (route group + future domain layer per feature).
2. Central registry (`src/config/features.ts`) as single source of truth for marketing + navigation.
3. Pure, presentational landing page – no business/data coupling.
4. Progressive enhancement: visuals (particles, motion) degrade gracefully (prefers-reduced-motion respected).
5. Accessibility first: semantic regions, focus management, contrast-conscious palette.
6. Maintainable styling: utility-first (Tailwind) + small, readable custom components.

---

## 🚀 Quick Start
```bash
git clone <repo-url>
cd electronic-health-record-system-/application
npm install
npm run dev
# Visit http://localhost:3000
```

Optional (after Supabase integration phase begins):
```bash
cp .env.example .env.local
# Fill SUPABASE_URL and SUPABASE_ANON_KEY
```

---

## 🧱 Architecture Overview

```
src/
	app/
		page.tsx                # Marketing landing page (hero, features, value, CTA, footer)
		(features)/             # Route group for team workspaces
			layout.tsx            # Shared navigation shell for all feature routes
			prescription-errors/  # Feature pages (placeholder content)
			inventory-management/
			medication-non-adherence/
			ehr-pharmacy-integration/
			remote-consultation/
	components/
		ui/                     # Reusable UI primitives (Button, Card, ...)
		visual/                 # Decorative/animation components (Particles, HeroOrb*)
	config/
		features.ts             # Central feature registry powering cards + nav
	lib/
		utils.ts                # Helper utilities (e.g., className merge)
public/                     # Static assets (icons, svg brand marks, etc.)
```
(*HeroOrb currently unused but retained for future experimentation.)

High-Level Flow:
Landing page reads from registry -> renders marketing cards -> CTA drives to auth/demo placeholder routes -> Teams build real functionality inside `(features)` and future `src/features/<slug>` domain modules.

---

## 🧭 Feature Development Model

Each feature will eventually have TWO layers:
1. Route Layer: `src/app/(features)/<slug>/page.tsx` (UI composition only)
2. Domain Layer: `src/features/<slug>/` (hooks, data adapters, business rules, local components)

Example (future):
```
src/features/prescription-errors/
	hooks/useHighRiskRules.ts
	components/RuleBadge.tsx
	types.ts
	index.ts
```

Route then imports: `import { useHighRiskRules } from '@/features/prescription-errors';`

Benefits:
- Keeps `app/` lean and framework-focused.
- Simplifies eventual test targeting.
- Allows tree-shaking for unused feature code.

---

## 🎛 Feature Registry (`features.ts`)
Central definition for: slug, title, description, icon path, ownership label. Used by landing page + nav. Avoids scattering metadata across multiple files.

Adding a feature (manual flow for now):
1. Edit `src/config/features.ts` – add new object entry (keep keys consistent).
2. Create folder: `src/app/(features)/<slug>/page.tsx` with placeholder.
3. (Optional) Create `public/icons/<slug>.svg` and reference it in the registry.
4. (Later) Create domain layer under `src/features/<slug>`.

Planned: A small script (`npm run scaffold:feature <slug>`) to automate steps. (Not yet implemented.)

---

## 🎨 UI & Styling Guidelines
| Layer | Purpose | Notes |
|-------|---------|-------|
| Tailwind utilities | Rapid layout & spacing | Prefer composable classes over deep custom CSS. |
| `components/ui/*` | Primitive building blocks | Keep stateless & accessible. |
| `components/visual/*` | Non-critical decoration | Must gracefully no-op if reduced motion. |
| Global styles (`globals.css`) | Reset + root tokens | Avoid feature-specific styles here. |

Color Strategy: Sky/Cyan spectrum for brand accents, neutral slate for body copy. Maintain AA contrast for text over backgrounds.

Buttons: Use semantic variant mapping (`default`, `outline`, `ghost`). Add new variants sparingly.

---

## ♿ Accessibility Checklist (Current Baseline)
- Skip link present.
- Landmarks: header (implicit), main, footer structure.
- ARIA labels on composite decorative canvases (Particles marked decorative / hidden from AT).
- Motion reduced when `prefers-reduced-motion` is active.
- Focus rings retained (do not remove outlines without replacement).
Future To‑Dos: color contrast audit script, keyboard trap tests, dynamic content live region if streaming data added.

---

## ⚡ Performance Practices
- Lightweight custom particle system (no heavy animation libs for background effects).
- No blocking third-party scripts yet.
- Animations limited to transform/opacity.
- Registry-driven feature list avoids duplicate JSON config fetches.
Planned: dynamic import for heavier feature modules, analytics sampling, Lighthouse CI.

---

## 🔐 Environment & Supabase (Planned Phase)
Create `.env.local`:
```
SUPABASE_URL=https://<project>.supabase.co
SUPABASE_ANON_KEY=public-anon-key
SUPABASE_SERVICE_ROLE_KEY=service-role-key # (Server only – NEVER commit)
```
Helper client (future): `src/lib/supabaseClient.ts` exporting a browser + server instance.

Security Notes:
- Never expose service role key to the client.
- Centralize auth logic in `src/features/auth/` (planned) before expanding protected routes.

---

## 🧑‍💻 Contribution Workflow
1. Sync & branch:
```bash
git checkout main
git pull origin main
git checkout -b <feature-slug>/<short-task>
```
2. Work ONLY inside your feature route + (later) domain folder.
3. Keep commits cohesive; use imperative style: `Add inventory low-stock hook`.
4. Run lint/typecheck before pushing (add scripts later if missing).
5. Open PR early (draft) for feedback.

Definition of Done (interim):
- Compiles (no TypeScript errors).
- No console errors in browser.
- Accessible names for interactive elements.
- Updated docs if public API or registry changed.

---

## 🧪 Testing (Roadmap)
Planned stack: Vitest + Testing Library + Playwright (light smoke flows). Initial priority tests:
- Feature registry shape validation.
- Critical hooks (once Supabase integrated).
- Accessibility smoke (axe run) for landing and one feature page.

---

## 📝 CTA Section Design (Current) 
The call‑to‑action uses a gradient frame + metrics + value bullets: see `page.tsx` under `<section aria-labelledby="cta-heading">`. Keep it content‑only; avoid embedding business logic.

To adjust metrics:
1. Edit the small stat cards markup.
2. Ensure disclaimers remain if using non-production numbers.

---

## 🐛 Troubleshooting
| Symptom | Likely Cause | Fix |
|---------|--------------|-----|
| Can’t import a UI component | Wrong path alias | Use `@/components/ui/Button` pattern (check tsconfig paths if added later). |
| Animations disabled | User reduced-motion preference | Works as intended. |
| New feature not showing on landing | Missing entry in `features.ts` | Add registry item with correct `slug`. |
| Icon 404 | File missing in `public/icons` | Add SVG & reference correct path. |

---

## 🧭 Roadmap (High-Level)
- [ ] Supabase client + auth session handling.
- [ ] Domain layer scaffolding (`src/features/*`).
- [ ] Feature scaffold CLI script.
- [ ] Dark mode + theme tokens.
- [ ] Vitest + basic test suites.
- [ ] Analytics & audit (Lighthouse CI / axe).
- [ ] Role-based access control (RBAC) integration.
- [ ] Documentation site extraction (if README outgrows scope).

---

## ❓ FAQ
Q: Why keep unused `HeroOrb` component?  
A: Retained for quick future reinstatement of hero visuals without rework.

Q: Can we add Redux/Zustand now?  
A: Defer until a real cross-feature state need emerges (avoid premature global state).

Q: How do we add backend calls today?  
A: Stub hooks in domain layer returning mock data; replace with Supabase queries once backend ready.

---

## 📚 Reference Links
- Next.js App Router: https://nextjs.org/docs/app
- shadcn/ui Patterns: https://ui.shadcn.com
- Supabase: https://supabase.com/docs
- Tailwind CSS: https://tailwindcss.com/docs

---

## 🙌 Credits
Initial architecture & landing experience crafted for multi-team parallelization. Evolve deliberately; keep PRs focused.

---

## ✅ At a Glance (Cheat Sheet)
| Task | Where |
|------|-------|
| Add feature card | `src/config/features.ts` |
| New feature route | `src/app/(features)/<slug>/page.tsx` |
| Domain logic (planned) | `src/features/<slug>/` |
| Update CTA copy | `src/app/page.tsx` (CTA section) |
| Add icon | `public/icons/` + registry reference |
| Global utility | `src/lib/` |

---

Happy building! 🧪
