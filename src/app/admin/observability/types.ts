export type RouteFilter = { method: string; route: string };
export type RouteSort = 'requests' | 'errors' | 'latency';

export type DashboardSnapshot = {
  asOf: string;
  overview: {
    rangeMinutes: number;
    totalRequests: number;
    rps: number;
    errorRatePercent: number;
    p95Ms: number;
    p99Ms: number;
    maxLatencyMs: number;
  };
  timeseries: {
    ts: string;
    requests: number;
    errors5xx: number;
    errorRatePercent: number;
    p95Ms: number;
    p99Ms: number;
  }[];
  routes: (RouteFilter & {
    requests: number;
    errors5xx: number;
    errorRatePercent: number;
    p95Ms: number;
    maxLatencyMs: number;
  })[];
  failures: (RouteFilter & {
    id: string;
    occurredAt: string;
    statusCode: number;
    durationMs: number;
  })[];
  slo: {
    id: string;
    name: string;
    objective: number;
    currentSliPercent: number | null;
    windowDays: number;
    isMeetingObjective: boolean;
    errorBudgetRemainingPercent: number;
    burnRate: number;
  }[];
};
