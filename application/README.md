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

## 📚 Resources
- [Next.js Documentation](https://nextjs.org/docs)
- [shadcn/ui Docs](https://ui.shadcn.com/docs)
- [Supabase Docs](https://supabase.com/docs)

---
