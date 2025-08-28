# EHR–Pharmacy Integration Module

Status: In-Memory Prototype (Offline)  
Last Updated: 2025-08-28

## Purpose
Provide a structured, observable, and secure pathway for bidirectional medication data flow between an EHR system and pharmacy dispensing domain: prescriptions in, dispenses & adherence signals out.

## Current Prototype Scope
- In-memory job tracking (manual sync trigger)
- Event ingestion + streaming (simulated)
- Pending mapping resolution workflow (mock entries)
- Medication list diff engine (snapshot vs new list)
- Retry queue simulation with exponential scheduling placeholder
- KPI aggregation (success rate, pending mappings, retry size, latency placeholder)
- Dashboard UI with tabbed navigation: Overview, Events, Mappings, Medication Diff, Retry Queue

## File Map
```
src/features/ehr-pharmacy-integration/
  types.ts                # Zod schemas & domain types
  mocks.ts                # Seed data for initial state
  integrationService.ts   # In-memory service & stateful logic (acts like repository / gateway)
  hooks.ts                # React hooks wrapping service operations
  README.md               # This document
```
Route UI: `src/app/(features)/ehr-pharmacy-integration/page.tsx`

## Domain Concepts
| Concept | Description |
|---------|-------------|
| Integration Job | High-level sync operation (e.g., MED_LIST_PULL). |
| Sync Event | Atomic inbound/outbound event with correlation ID. |
| Mapping Record | Pending or resolved association for external code → internal ID. |
| Medication Diff | Changed state (added / removed / dose-changed) between snapshots. |
| Retry Entry | Scheduled retry metadata for transient failures. |
| KPI | Aggregated operational metric for quick health reading. |

## Key Functions (integrationService)
| Function | Role |
|----------|------|
| `triggerManualSync` | Simulate a medication list pull job + event creation. |
| `ingestEvent` | Insert a new sync event, update KPIs, broadcast to listeners. |
| `streamEvents` | Subscribe to live event feed (simple pub/sub). |
| `resolveMapping` | Mark mapping resolved and update KPIs. |
| `computeMedicationDiff` | Compare new list to snapshot and return structured diff. |
| `scheduleRetry` | Enqueue or update retry entry with exponential delay. |
| `getAuditTrail` | Filter events by correlation ID (future UI). |
| `getJobs / getEvents / getMappings / getRetryQueue / getKpis` | Read operations. |

## React Hooks
| Hook | Purpose |
|------|---------|
| `useIntegrationJobs` | Poll jobs list. |
| `useEventStream` | Maintain events list via subscription + refresh. |
| `usePendingMappings` | Poll mappings & provide resolve action. |
| `useKpis` | Poll KPI aggregation. |
| `useSyncTrigger` | Manual sync trigger UI binding. |
| `useMedicationDiff` | Manage diff state & recomputation. |
| `useRetryQueue` | Poll retry entries. |
| `useInjectEvent` | Developer utility to inject synthetic event. |

## UI Structure (page.tsx)
Tabs:
1. Overview – KPIs + Jobs table
2. Events – Recent events stream
3. Mappings – Pending mapping resolution actions
4. Medication Diff – Scenario buttons & diff output
5. Retry Queue – Simulated queue table

## Future Enhancements
| Area | Planned Work |
|------|--------------|
| Persistence | Replace in-memory with Supabase tables & RLS policies. |
| AuthZ | Restrict sensitive panels (mappings, retry) by role. |
| Diff | Persist historical snapshots, optimize large set diffing. |
| Mapping | Suggestion engine (string similarity, code system heuristics). |
| Observability | Real latency metrics + distributed tracing IDs. |
| Retry | True state machine & dead-letter table. |
| Security | Webhook signature verification, PHI redaction filters. |
| Audit | Append-only log with hash chaining for tamper evidence. |
| UI | Audit trail modal, advanced filtering, CSV export. |
| Tests | Unit tests for service logic & hooks. |

## Data Model (Target Supabase Outline)
```
integration_jobs(id, type, status, started_at, finished_at, metrics_json)
integration_events(id, correlation_id, direction, kind, status, created_at, payload_json, error_text)
code_mappings(id, source_code, system, target_id, status, created_at, updated_at)
retry_queue(event_id, attempts, next_attempt_at)
med_snapshot(id, captured_at, patient_id, hash)
med_snapshot_item(snapshot_id, code, dose, frequency, route)
```

## Transition Plan (Memory → Database)
1. Define SQL schema + migration files.
2. Implement repository layer (CRUD) mirroring current service shape.
3. Add feature flag to switch between memory & database providers.
4. Gradually route hooks to repository via provider context.
5. Remove mocks once parity achieved & tests green.

## Usage Notes
- All states reset on page reload (no persistence yet).
- Use the Inject Event button (Events tab) to simulate inbound traffic.
- Mapping resolution currently auto-generates a fake target ID.
- Medication diff scenarios mutate an internal snapshot; sequence matters.

## Developer Tasks (Next Steps)
- [ ] Add audit trail UI (modal per event correlation ID).
- [ ] Implement scheduleRetry trigger UI on event failure (simulate failure state first).
- [ ] Add toast notifications (success / resolve mapping / sync started).
- [ ] Introduce context provider to swap integration backend.
- [ ] Write Vitest tests for `computeMedicationDiff` & `scheduleRetry` path.

## License & Compliance
Ensure all PHI handling additions are reviewed before moving to a persisted backend. Avoid logging raw SIG or patient identifiers.

---
End of module README.
