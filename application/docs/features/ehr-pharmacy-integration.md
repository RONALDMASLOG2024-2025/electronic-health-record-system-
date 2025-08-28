# EHR–Pharmacy Integration Feature Blueprint

Status: Draft (Foundational Planning)
Owner: Group 4
Last Updated: 2025-08-28

## 1. Problem Summary
Clinical & dispensing systems operate in silos causing:
- Delayed medication list updates (risk of duplicate / contraindicated therapy).
- Missing dispense / fill data in EHR -> poor adherence insight.
- Manual reconciliation effort and error-prone transcription.
- Lack of auditability for sync failures and mapping issues.

## 2. Primary Objectives
1. Reliable bidirectional synchronization between EHR medication list and pharmacy dispense records.
2. Deterministic mapping for medication codes (RxNorm, NDC), prescribers, patients, facilities.
3. Near real-time event propagation (new prescription, cancel, substitution, dispense, reversal).
4. Transparent observability: sync jobs, retry pipeline, transformation + delivery logs.
5. Secure handling of PHI and minimal surface for leakage.

## 3. Core Use Cases
| # | Title | Actor | Trigger | Outcome |
|---|-------|-------|---------|---------|
| 1 | Pull updated medication list | Pharmacy Service | Scheduled (cron / webhook) | Local cache updated; diffs emitted. |
| 2 | Push dispense event | Pharmacy | Dispense recorded | EHR receives structured event & acknowledges. |
| 3 | Prescription cancellation propagate | Provider (EHR) | Cancel order | Pharmacy mark script inactive + stop fills. |
| 4 | Resolve unmapped code | Integration Analyst | Mapping failure | Code added to mapping table; reprocess queued events. |
| 5 | Retry failed transform | System | Error flagged | Event reprocessed with exponential backoff. |
| 6 | Audit trail view | Compliance | User opens log | Filtered, immutable timeline displayed. |

## 4. Functional Scope (Phase Breakdown)
### Phase 1 (MVP)
- Manual trigger sync (pull EHR meds list)
- Simple mapping tables (RxNorm->LocalDrug, Prescriber->LocalProvider)
- Log ingestion + display (success/failure rows)
- Basic diff engine (added / discontinued / dosage change)

### Phase 2
- Automatic scheduled sync + delta tokens
- Outbound events push (dispense, reversal)
- Retry queue with exponential backoff
- Mapping UI with validation rules

### Phase 3
- Real-time webhook subscription (FHIR Subscription / HL7 v2 feed)
- Conflict resolution strategies (last-write vs rule-based)
- Metrics dashboard (latency, failure rate, code coverage)
- Alerting (Slack/email) for repeated failures

### Phase 4
- Advanced semantic normalization (dose form, route normalization)
- Bulk reconciliation workflow assistant
- Deidentification pipeline for analytics export
- Role-based scoped log views

## 5. Non-Functional Requirements
| Category | Requirement |
|----------|-------------|
| Security | PHI encrypted in transit & at rest; principle of least privilege. |
| Reliability | 99.5% successful event delivery (rolling 30d). |
| Observability | 100% events traceable with correlation ID. |
| Performance | Medication list sync < 5s for 5k active meds. |
| Compliance | Audit log immutability & tamper evidence. |
| Scalability | Horizontal scale of worker queue (idempotent processing). |

## 6. Data Model (Initial Draft)
Tables (conceptual):
- `integration_jobs` (id, type, status, started_at, finished_at, metrics_json)
- `medication_mappings` (id, source_code, system, target_drug_id, created_at, updated_at, status)
- `prescriber_mappings` (id, external_id, target_provider_id, status)
- `sync_events` (id, direction: 'in'|'out', kind, payload_json, status, retries, next_attempt_at, correlation_id, created_at)
- `event_failures` (id, sync_event_id, error_code, message, stack, created_at)
- `medication_snapshot` (id, patient_id, source_hash, captured_at)
- `medication_snapshot_items` (snapshot_id, med_code, dose, frequency, route, status_hash)

## 7. Event Types (Planned)
| Event | Direction | Payload Core Fields |
|-------|-----------|---------------------|
| PRESCRIPTION_NEW | IN | patient, prescriber, drugCode, sig, quantity, refills, writtenDate |
| PRESCRIPTION_CHANGE | IN | prescriptionId, changes[], reason |
| PRESCRIPTION_CANCEL | IN | prescriptionId, reason, timestamp |
| DISPENSE | OUT | prescriptionId, ndc, lot?, quantity, date, pharmacistId |
| DISPENSE_REVERSAL | OUT | previousDispenseId, reason |
| MED_LIST_PULL | IN | patientId, sourceMedications[] |
| ADHERENCE_SIGNAL | OUT | patientId, metricType, value, period |

## 8. Mapping Strategy
1. Attempt direct RxNorm code match.
2. Fallback to NDC lookup (maintain canonical mapping table).
3. If unresolved → create pending mapping record + flag event for retry once resolved.
4. Provide UI to approve mapping suggestions (Levenshtein / token match candidate list future).

## 9. Sync Flow (Inbound Example)
1. Receive event (HTTP webhook or queued message).
2. Validate schema (zod/fhir parser).
3. Normalize codes & units.
4. Upsert domain entities (prescription / patient as needed).
5. Emit diff vs previous state (for adherence / alert engines).
6. Persist success log (correlation_id) OR failure log + schedule retry.

## 10. Error Handling & Retry
- Mark transient vs permanent errors.
- Transient (network, rate limit): exponential backoff (1m, 5m, 15m, 1h, 6h, dead-letter).
- Permanent (validation, unknown code): move to manual action queue.
- All retries idempotent (use correlation_id + natural keys).

## 11. Observability
Metrics (future Prom instrumentation):
- ingest_events_total{status}
- mapping_resolution_latency_ms
- retry_queue_depth
- sync_job_duration_ms
- unmapped_codes_active

Structured Logs: JSON with fields: timestamp, level, correlation_id, event_kind, direction, status, latency_ms.

## 12. Security & Compliance Notes
- Segregate integration tables from user-facing query surfaces.
- Minimize PHI in logs (use surrogate IDs; never log full SIG or patient name).
- Sign outbound webhooks (HMAC) + verify inbound signatures.
- Maintain hash chain for audit integrity (append-only) in future phase.

## 13. UI Surface (Planned Components)
| Component | Purpose |
|-----------|---------|
| SyncStatusHeader | Shows last job run, next schedule, latency badge. |
| IntegrationJobTable | Paginated job history with status filters. |
| EventStreamPanel | Live tail of inbound/outbound events. |
| MappingAlerts | Unresolved code summary + quick actions. |
| RetryQueueCard | Count + drill-down link. |
| MetricsMini | Small KPI cards (success %, avg latency). |
| CodeMappingModal | Resolve pending mapping entries. |

## 14. Initial Hook Stubs (to implement)
- `useIntegrationJobs()` – list + polling.
- `useEventStream()` – SSE or websocket simulation fallback to interval fetch.
- `usePendingMappings()` – unresolved mapping entries.
- `useSyncTrigger()` – fire manual sync mutation.

## 15. Risks / Open Questions
- Will upstream use FHIR R4, HL7 v2, or proprietary payloads? (Affects parser layer.)
- Required latency target for dispense propagation? (< 30s?)
- Concurrency / ordering guarantees—do we need vector clock or simple timestamp ordering?
- Patient identity reconciliation—will we receive MRN vs global UUID? Need deterministic match strategy.

## 16. Phased Implementation Checklist
- [ ] Create domain folder `src/features/ehr-pharmacy-integration`.
- [ ] Define shared types (events, mapping records) with zod.
- [ ] Implement in-memory mock service layer.
- [ ] Build UI placeholder components with mock data.
- [ ] Add manual sync trigger (button) + toast result.
- [ ] Add event log table (virtualized list) – mock feed.
- [ ] Add mapping alerts panel (empty state).
- [ ] Wire feature page to hooks.
- [ ] Introduce Supabase tables & migrations.
- [ ] Replace mocks with real queries / RLS policies.
- [ ] Add retry queue state machine logic.
- [ ] Add metrics instrumentation + dashboard cards.
- [ ] Harden security (webhook signatures, audit immutability).
-
+---
+
+## 17. Developer Notes
+During early development, keep all side-effect layers behind interfaces to allow switching persistence (mock -> Supabase) without rewriting UI.
+
+Interface Example (future):
+```ts
+export interface IntegrationGateway {
+  fetchJobs(params: { limit: number; cursor?: string }): Promise<Job[]>;
+  triggerManualSync(): Promise<{ jobId: string }>;
+  streamEvents(onEvent: (e: SyncEvent) => void): () => void; // returns unsubscribe
+  resolveMapping(id: string, targetId: string): Promise<void>;
+}
+```
+
+Keep functions pure where possible; isolate time / random / network in a thin adapter layer.
+
+---
+
+## 18. Glossary
+- Medication List Reconciliation: Process of aligning patient’s active medications across systems.
+- Mapping: Association from external identifier/code to internal canonical entity.
+- Correlation ID: Unique ID spanning ingestion → processing → delivery for traceability.
+- Dead-letter: Queue or table storing permanently failed events for manual intervention.
+
+---
+
+## 19. Next Steps (Immediate)
+1. Add domain scaffold under `src/features/ehr-pharmacy-integration`.
+2. Implement type definitions for core event shapes.
+3. Build mock hooks returning static arrays.
+4. Replace placeholder text in feature page with composed UI panels.
+
+---
+
+> This blueprint will evolve; update version & date when materially changing scope.
