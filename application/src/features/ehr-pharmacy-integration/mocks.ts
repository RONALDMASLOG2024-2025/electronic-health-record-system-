// Mock data + helpers for early UI development (no backend yet)
import { IntegrationJob, SyncEvent, MappingRecord, IntegrationKpis } from './types';

export const mockJobs: IntegrationJob[] = [
  { id: crypto.randomUUID(), type: 'MED_LIST_PULL', status: 'success', startedAt: new Date(Date.now()-60000).toISOString(), finishedAt: new Date(Date.now()-30000).toISOString(), metrics: { medsProcessed: 120, changes: 5 } },
  { id: crypto.randomUUID(), type: 'DISPENSE_PUSH', status: 'failed', startedAt: new Date(Date.now()-180000).toISOString(), finishedAt: new Date(Date.now()-175000).toISOString(), metrics: { events: 42 } },
];

export const mockEvents: SyncEvent[] = Array.from({ length: 12 }).map((_, i) => ({
  id: crypto.randomUUID(),
  correlationId: crypto.randomUUID(),
  direction: i % 2 === 0 ? 'in' : 'out',
  kind: i % 3 === 0 ? 'PRESCRIPTION_NEW' : 'DISPENSE',
  status: 'success',
  createdAt: new Date(Date.now() - i * 15000).toISOString(),
  payload: { example: true },
}));

export const mockMappings: MappingRecord[] = [
  { id: crypto.randomUUID(), sourceCode: '12345', system: 'RxNorm', status: 'pending', createdAt: new Date().toISOString() },
  { id: crypto.randomUUID(), sourceCode: '67890', system: 'NDC', status: 'pending', createdAt: new Date().toISOString() },
];

export const mockKpis: IntegrationKpis = {
  successRate: 0.982,
  avgLatencyMs: 420,
  pendingMappings: mockMappings.length,
  retryQueue: 3,
};
