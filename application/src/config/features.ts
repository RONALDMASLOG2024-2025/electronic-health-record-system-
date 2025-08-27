/**
 * Central marketing & feature registry.
 * Only maintainers should edit this file to avoid merge conflicts.
 * Each feature entry powers the landing page cards & navigation.
 */
export interface FeatureMeta {
  slug: string;              // folder-friendly identifier
  title: string;             // Display name
  summary: string;           // Short marketing blurb
  icon: string;              // Public path to SVG / PNG asset
  route: string;             // Route under (features) group
  owner: string;             // Owning team / group
}

export const FEATURES: FeatureMeta[] = [
  {
    slug: "prescription-errors",
    title: "Prescription Error Detection",
    summary: "Automated checks to reduce adverse medication events.",
    icon: "/icons/prescription.svg",
    route: "/(features)/prescription-errors",
    owner: "Group 1",
  },
  {
    slug: "inventory-management",
    title: "Inventory Management",
    summary: "Real-time stock, expirations & replenishment insights.",
    icon: "/icons/inventory.svg",
    route: "/(features)/inventory-management",
    owner: "Group 2",
  },
  {
    slug: "medication-non-adherence",
    title: "Medication Non-Adherence Tracking",
    summary: "Monitor missed doses & trigger timely interventions.",
    icon: "/icons/adherence.svg",
    route: "/(features)/medication-non-adherence",
    owner: "Group 3",
  },
  {
    slug: "ehr-pharmacy-integration",
    title: "EHR–Pharmacy Integration (Cloud)",
    summary: "Secure bidirectional data exchange between systems.",
    icon: "/icons/integration.svg",
    route: "/(features)/ehr-pharmacy-integration",
    owner: "Group 4",
  },
  {
    slug: "remote-consultation",
    title: "Remote Patient Consultation",
    summary: "Virtual counseling & clarification for patients.",
    icon: "/icons/consultation.svg",
    route: "/(features)/remote-consultation",
    owner: "Group 5",
  },
];

/** Convenience map for quick lookup by slug */
export const FEATURE_MAP: Record<string, FeatureMeta> = Object.fromEntries(
  FEATURES.map((f) => [f.slug, f])
);
