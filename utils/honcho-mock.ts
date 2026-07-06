/**
 * Honcho API response mocks for offline/waiting state.
 * All responses return "No Production Data Yet" when the
 * Honcho Cloud API is unreachable — matching the UI contract.
 */

type HonchoStatus = {
  service: string;
  healthy: boolean;
  latency_ms: number | null;
};

type HonchoMetrics = {
  search: { latency_ms: number; count: number };
  conclude: { latency_ms: number; count: number };
  memory_used: { tokens: number; entries: number };
  errors: { count: number; last: string | null };
};

export const STATUS_OFFLINE: HonchoStatus[] = [
  { service: 'honcho-api', healthy: false, latency_ms: null },
  { service: 'cloud-status', healthy: false, latency_ms: null },
  { service: 'neuromancer', healthy: false, latency_ms: null },
  { service: 'maintenance-queue', healthy: true, latency_ms: null },
  { service: 'cron-status', healthy: true, latency_ms: null },
];

export const METRICS_EMPTY: HonchoMetrics = {
  search: { latency_ms: 0, count: 0 },
  conclude: { latency_ms: 0, count: 0 },
  memory_used: { tokens: 0, entries: 0 },
  errors: { count: 0, last: null },
};

export function isMockResponse(body: unknown): body is { status: 'offline' } {
  return (
    typeof body === 'object' &&
    body !== null &&
    'status' in body &&
    (body as { status: string }).status === 'offline'
  );
}
