"use client";
/** Group 2: Inventory Management workspace */
export default function InventoryManagementFeature() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold tracking-tight">Inventory Management</h1>
      <p className="text-slate-600 text-sm max-w-prose">
        Manage stock levels, expirations, reorder thresholds, and supplier integrations here.
      </p>
      <div className="rounded-lg border border-dashed p-6 text-slate-500 text-sm">
        TODO: Stock table, low inventory alerts, batch import.
      </div>
    </div>
  );
}
