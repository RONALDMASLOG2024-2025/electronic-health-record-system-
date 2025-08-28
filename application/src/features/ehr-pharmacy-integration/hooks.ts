"use client";
import { useEffect, useState, useCallback } from 'react';
import { IntegrationJob, SyncEvent, MappingRecord, ManualSyncResult, IntegrationKpis } from './types';
import {
  getJobs,
  getEvents,
  getMappings,
  triggerManualSync as serviceManualSync,
  streamEvents,
  resolveMapping as serviceResolveMapping,
  computeMedicationDiff,
  getAuditTrail,
  scheduleRetry,
  getRetryQueue,
  getKpis,
  ingestEvent,
  ingestFailureEvent,
  getMappingSuggestions,
} from './integrationService';

// Polling interval constants (ms) - adjust later
const JOBS_INTERVAL = 10000;
const EVENTS_INTERVAL = 5000;
const MAPPINGS_INTERVAL = 15000;

export function useIntegrationJobs() {
  const [jobs, setJobs] = useState<IntegrationJob[]>(getJobs());
  useEffect(() => {
  const id = setInterval(() => setJobs([...getJobs()]), JOBS_INTERVAL);
    return () => clearInterval(id);
  }, []);
  return { jobs };
}

export function useEventStream() {
  const [events, setEvents] = useState<SyncEvent[]>(getEvents());
  useEffect(() => {
    const unsub = streamEvents(e => setEvents(evts => [e, ...evts].slice(0, 100)));
    const id = setInterval(() => setEvents([...getEvents()]), EVENTS_INTERVAL);
    return () => { clearInterval(id); unsub(); };
  }, []);
  return { events };
}

export function usePendingMappings() {
  const [mappings, setMappings] = useState<MappingRecord[]>(getMappings());
  useEffect(() => {
    const id = setInterval(() => setMappings([...getMappings()]), MAPPINGS_INTERVAL);
    return () => clearInterval(id);
  }, []);
  const resolve = (id: string, targetId: string) => {
    serviceResolveMapping(id, targetId);
    setMappings([...getMappings()]);
  };
  return { mappings, resolve };
}

export function useMappingSuggestions(sourceCode?: string) {
  const [suggestions, setSuggestions] = useState(() => sourceCode ? getMappingSuggestions(sourceCode) : null);
  useEffect(() => {
    if (!sourceCode) return;
    setSuggestions(getMappingSuggestions(sourceCode));
  }, [sourceCode]);
  return { suggestions };
}

export function useKpis() {
  const [kpis, setKpis] = useState<IntegrationKpis>(getKpis());
  useEffect(() => {
    const id = setInterval(() => setKpis(getKpis()), 8000);
    return () => clearInterval(id);
  }, []);
  return { kpis };
}

export function useSyncTrigger() {
  const [loading, setLoading] = useState(false);
  const trigger = useCallback(async (): Promise<ManualSyncResult> => {
    setLoading(true);
    try {
      return await serviceManualSync();
    } finally {
      setLoading(false);
    }
  }, []);
  return { trigger, loading };
}

// Medication diff demo hook
export function useMedicationDiff() {
  const [diff, setDiff] = useState(() => computeMedicationDiff([]));
  const recompute = (list: { code: string; dose: string }[]) => setDiff(computeMedicationDiff(list));
  return { diff, recompute };
}

// Audit trail for a correlation ID
export function useAuditTrail(correlationId?: string) {
  const [trail, setTrail] = useState<SyncEvent[]>([]);
  useEffect(() => {
    if (!correlationId) return;
    setTrail(getAuditTrail(correlationId));
  }, [correlationId]);
  return { trail };
}

// Retry queue view
export function useRetryQueue() {
  const [entries, setEntries] = useState(getRetryQueue());
  useEffect(() => {
    const id = setInterval(() => setEntries([...getRetryQueue()]), 6000);
    return () => clearInterval(id);
  }, []);
  return { entries, scheduleRetry };
}

// Manual event injection (testing)
export function useInjectEvent() {
  return (kind: string, direction: 'in' | 'out') => ingestEvent({ kind, direction, payload: {} });
}

export function useInjectFailureEvent() {
  return (kind: string, direction: 'in' | 'out', error: string) => ingestFailureEvent({ kind, direction, payload: {}, error });
}
