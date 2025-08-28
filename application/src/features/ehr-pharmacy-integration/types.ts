// Types & schemas for EHR–Pharmacy Integration (initial draft)
import { z } from 'zod';

export const IntegrationJobStatus = z.enum(['pending','running','success','failed']);
export type IntegrationJobStatus = z.infer<typeof IntegrationJobStatus>;

export const IntegrationJobSchema = z.object({
  id: z.string(),
  type: z.string(),
  status: IntegrationJobStatus,
  startedAt: z.string().datetime().optional(),
  finishedAt: z.string().datetime().optional(),
  metrics: z.record(z.any()).optional(),
});
export type IntegrationJob = z.infer<typeof IntegrationJobSchema>;

export const SyncEventDirection = z.enum(['in','out']);
export type SyncEventDirection = z.infer<typeof SyncEventDirection>;

export const SyncEventSchema = z.object({
  id: z.string(),
  correlationId: z.string(),
  direction: SyncEventDirection,
  kind: z.string(),
  status: z.enum(['received','processing','success','error']),
  createdAt: z.string().datetime(),
  payload: z.any(),
  error: z.string().optional(),
});
export type SyncEvent = z.infer<typeof SyncEventSchema>;

export const MappingStatus = z.enum(['pending','resolved','deprecated']);
export type MappingStatus = z.infer<typeof MappingStatus>;

export const MappingRecordSchema = z.object({
  id: z.string(),
  sourceCode: z.string(),
  system: z.string(),
  targetId: z.string().optional(),
  status: MappingStatus,
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime().optional(),
});
export type MappingRecord = z.infer<typeof MappingRecordSchema>;

export const ManualSyncResultSchema = z.object({ jobId: z.string() });
export type ManualSyncResult = z.infer<typeof ManualSyncResultSchema>;

// Domain aggregations (lightweight)
export interface IntegrationKpis {
  successRate: number; // 0-1
  avgLatencyMs: number;
  pendingMappings: number;
  retryQueue: number;
}
