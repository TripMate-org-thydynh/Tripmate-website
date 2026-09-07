'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import {
  getObservabilityOverviewAction,
  getObservabilityTimeseriesAction,
  getObservabilityRoutesAction,
} from '@/app/actions';
import {
  Activity,
  Zap,
  AlertTriangle,
  Clock,
  Timer,
  RefreshCw,
  Info,
  Layers,
  ArrowUpDown,
} from 'lucide-react';
import ErrorState from '@/components/ErrorState';
import {
  AdminCard,
  AdminCardTitle,
  AdminCardDescription,
} from '@/components/admin/AdminCard';
import { AdminButton } from '@/components/admin/AdminButton';
import { AdminBadge } from '@/components/admin/AdminBadge';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { AdminStatCard } from '@/components/admin/AdminStatCard';
import { AdminSwitch } from '@/components/admin/AdminSwitch';
import { AdminTooltip } from '@/components/admin/AdminTooltip';
import { AdminLineChart } from '@/components/admin/charts/AdminLineChart';
import {
  AdminTable,
  AdminTableHeader,
  AdminTableHead,
  AdminTableBody,
  AdminTableRow,
  AdminTableCell,
  AdminTableSkeleton,
  AdminTableEmpty,
} from '@/components/admin/AdminTable';

export interface ObservabilityOverview {
  rangeMinutes: number;
  totalRequests: number;
  rps: number;
  errorRatePercent: number;
  clientErrorRatePercent: number;
  p50Ms: number;
  p95Ms: number;
  p99Ms: number;
  avgLatencyMs: number;
  maxLatencyMs: number;
}

export interface ObservabilityTimeseriesPoint {
  ts: string;
  requests: number;
  errors5xx: number;
  errors4xx: number;
  errorRatePercent: number;
  p95Ms: number;
  avgLatencyMs: number;
}

export interface ObservabilityRouteMetric {
  route: string;
  method: string;
  requests: number;
  errors5xx: number;
  errors4xx: number;
  errorRatePercent: number;
  p95Ms: number;
  avgLatencyMs: number;
  maxLatencyMs: number;
}

interface TimeRangeOption {
  id: string;
  label: string;
  rangeMinutes: number;
  stepMinutes: number;
}

const TIME_RANGES: TimeRangeOption[] = [
  { id: '15m', label: '15 phút', rangeMinutes: 15, stepMinutes: 1 },
  { id: '1h', label: '1 giờ', rangeMinutes: 60, stepMinutes: 1 },
  { id: '6h', label: '6 giờ', rangeMinutes: 360, stepMinutes: 5 },
  { id: '24h', label: '24 giờ', rangeMinutes: 1440, stepMinutes: 15 },
  { id: '7d', label: '7 ngày', rangeMinutes: 10080, stepMinutes: 60 },
];

function formatTs(ts: string, rangeMinutes: number): string {
  try {
    const d = new Date(ts);
    if (isNaN(d.getTime())) return ts;
    const hh = String(d.getHours()).padStart(2, '0');
    const mm = String(d.getMinutes()).padStart(2, '0');

    if (rangeMinutes <= 360) {
      return `${hh}:${mm}`;
    }
    if (rangeMinutes <= 1440) {
      return `${hh}:${mm}`;
    }
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    return `${day}/${month} ${hh}:${mm}`;
  } catch {
    return ts;
  }
}

function getMethodBadge(method: string) {
  const m = (method || '').toUpperCase();
  switch (m) {
    case 'GET':
      return (
        <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold tracking-wide bg-sky-50 text-sky-700 border border-sky-200 dark:bg-sky-950/40 dark:text-[#38BDF8] dark:border-sky-800/60">
          GET
        </span>
      );
    case 'POST':
      return (
        <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold tracking-wide bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/40 dark:text-[#22C55E] dark:border-emerald-800/60">
          POST
        </span>
      );
    case 'PUT':
      return (
        <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold tracking-wide bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-950/40 dark:text-[#F59E0B] dark:border-amber-800/60">
          PUT
        </span>
      );
    case 'PATCH':
      return (
        <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold tracking-wide bg-purple-50 text-purple-700 border border-purple-200 dark:bg-purple-950/40 dark:text-purple-300 dark:border-purple-800/60">
          PATCH
        </span>
      );
    case 'DELETE':
      return (
        <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold tracking-wide bg-rose-50 text-rose-700 border border-rose-200 dark:bg-rose-950/40 dark:text-[#EF4444] dark:border-rose-800/60">
          DELETE
        </span>
      );
    default:
      return (
        <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold tracking-wide bg-slate-100 text-slate-700 border border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700">
          {m}
        </span>
      );
  }
}

export default function ObservabilityDashboardPage() {
  const [selectedRange, setSelectedRange] = useState<TimeRangeOption>(TIME_RANGES[1]); // Mặc định 1 giờ
  const [sortBy, setSortBy] = useState<'requests' | 'errors' | 'latency'>('requests');
  const [autoRefresh, setAutoRefresh] = useState(true);

  const [overview, setOverview] = useState<ObservabilityOverview | null>(null);
  const [timeseries, setTimeseries] = useState<ObservabilityTimeseriesPoint[]>([]);
  const [routes, setRoutes] = useState<ObservabilityRouteMetric[]>([]);

  const [loading, setLoading] = useState(true);
  const [routesLoading, setRoutesLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastRefreshedAt, setLastRefreshedAt] = useState<Date | null>(null);

  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const fetchData = useCallback(
    async (isBackground = false) => {
      if (!isBackground) {
        setLoading(true);
        setError(null);
      }

      try {
        const [overviewRes, timeseriesRes, routesRes] = await Promise.all([
          getObservabilityOverviewAction(selectedRange.rangeMinutes),
          getObservabilityTimeseriesAction(
            selectedRange.rangeMinutes,
            selectedRange.stepMinutes
          ),
          getObservabilityRoutesAction(selectedRange.rangeMinutes, 20, sortBy),
        ]);

        if (overviewRes.success && overviewRes.data) {
          setOverview(overviewRes.data);
        } else if (!isBackground) {
          setError(overviewRes.error || 'Không thể tải số liệu tổng quan');
        }

        if (timeseriesRes.success && timeseriesRes.data) {
          setTimeseries(timeseriesRes.data);
        }

        if (routesRes.success && routesRes.data) {
          setRoutes(routesRes.data);
        }

        setLastRefreshedAt(new Date());
      } catch (err: any) {
        if (!isBackground) {
          setError(err.message || 'Lỗi kết nối khi tải dữ liệu giám sát');
        }
      } finally {
        if (!isBackground) {
          setLoading(false);
        }
      }
    },
    [selectedRange, sortBy]
  );

  // Chỉ tải lại routes khi đổi sortBy mà không cần fetch lại toàn bộ
  const handleSortChange = async (newSort: 'requests' | 'errors' | 'latency') => {
    setSortBy(newSort);
    setRoutesLoading(true);
    const res = await getObservabilityRoutesAction(
      selectedRange.rangeMinutes,
      20,
      newSort
    );
    if (res.success && res.data) {
      setRoutes(res.data);
    }
    setRoutesLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Quản lý chu kỳ làm mới tự động 30 giây
  useEffect(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    if (autoRefresh) {
      intervalRef.current = setInterval(() => {
        fetchData(true);
      }, 30000);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [autoRefresh, fetchData]);

  // Chuẩn bị dữ liệu cho biểu đồ lưu lượng
  const trafficChartData = timeseries.map((pt) => ({
    label: formatTs(pt.ts, selectedRange.rangeMinutes),
    value: pt.requests,
    secondaryValue: pt.errors5xx,
  }));

  // Chuẩn bị dữ liệu cho biểu đồ độ trễ
  const latencyChartData = timeseries.map((pt) => ({
    label: formatTs(pt.ts, selectedRange.rangeMinutes),
    value: pt.p95Ms,
    secondaryValue: pt.avgLatencyMs,
  }));

  // Xác định biến thể màu sắc theo tỉ lệ lỗi 5xx
  const errorRate = overview?.errorRatePercent ?? 0;
  const errorRateVariant: 'danger' | 'warning' | 'success' =
    errorRate > 5 ? 'danger' : errorRate > 1 ? 'warning' : 'success';
  const errorRateColor =
    errorRate > 5
      ? 'text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800/50'
      : errorRate > 1
      ? 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800/50'
      : 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800/50';

  return (
    <div className="flex flex-col gap-6">
      {/* Header trang */}
      <AdminPageHeader
        title="Metrics & Hiệu Năng Hệ Thống"
        description="Giám sát độ ổn định, lưu lượng truy cập (RPS), tỉ lệ lỗi máy chủ (5xx) và độ trễ phản hồi của hệ thống theo thời gian thực."
        badge={
          <AdminBadge variant="brand" size="xs" dot pulse>
            Trực tiếp
          </AdminBadge>
        }
      >
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 pr-2 border-r border-slate-200 dark:border-[#1E293B]">
            <AdminSwitch
              checked={autoRefresh}
              onChange={setAutoRefresh}
              label="Tự động làm mới"
              size="sm"
            />
          </div>

          <AdminButton
            variant="outline"
            size="sm"
            onClick={() => fetchData(false)}
            loading={loading}
            icon={<RefreshCw className="w-3.5 h-3.5" />}
          >
            Làm mới
          </AdminButton>
        </div>
      </AdminPageHeader>

      {/* Thanh điều khiển: Bộ chọn khoảng thời gian */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-3 rounded-xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-[#1E293B] shadow-xs">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-xs font-semibold text-slate-500 dark:text-[#94A3B8] mr-1 flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            Khoảng thời gian:
          </span>
          {TIME_RANGES.map((range) => {
            const isActive = selectedRange.id === range.id;
            return (
              <button
                key={range.id}
                type="button"
                onClick={() => setSelectedRange(range)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-150 cursor-pointer select-none ${
                  isActive
                    ? 'bg-[#FFD84D] text-[#141210] font-semibold shadow-xs border border-amber-400/60 dark:bg-[#FFD84D] dark:text-[#141210]'
                    : 'bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200 dark:bg-[#172238] dark:hover:bg-[#1E293B] dark:text-[#94A3B8] dark:border-[#1E293B]'
                }`}
              >
                {range.label}
              </button>
            );
          })}
        </div>

        {lastRefreshedAt && (
          <span className="text-[11px] text-slate-400 dark:text-[#64748B] self-end sm:self-auto">
            Cập nhật lúc: {lastRefreshedAt.toLocaleTimeString('vi-VN')}
          </span>
        )}
      </div>

      {error && !overview && !loading ? (
        <ErrorState message={error} onRetry={() => fetchData(false)} />
      ) : loading && !overview ? (
        <div className="flex flex-col gap-6">
          {/* Skeleton stat cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className="h-28 rounded-xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-[#1E293B] animate-pulse p-4 shadow-xs"
              />
            ))}
          </div>
          {/* Skeleton charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="h-72 rounded-xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-[#1E293B] animate-pulse" />
            <div className="h-72 rounded-xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-[#1E293B] animate-pulse" />
          </div>
        </div>
      ) : (
        <>
          {/* Hàng thẻ số liệu thống kê */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            <AdminStatCard
              title="Tổng Request"
              value={overview?.totalRequests ?? 0}
              helper={`Trong ${selectedRange.label} qua`}
              icon={Activity}
              color="text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 border-amber-200/60 dark:border-amber-800/50"
            />
            <AdminStatCard
              title="Lưu Lượng (RPS)"
              value={overview?.rps ?? 0}
              helper="Requests / giây"
              icon={Zap}
              color="text-sky-600 dark:text-sky-400 bg-sky-50 dark:bg-sky-950/40 border-sky-200 dark:border-sky-800/50"
            />
            <AdminStatCard
              title="Tỉ Lệ Lỗi 5xx"
              value={`${overview?.errorRatePercent ?? 0}%`}
              helper={
                errorRate > 5
                  ? 'Vượt ngưỡng cảnh báo (>5%)'
                  : errorRate > 1
                  ? 'Cần theo dõi sát (>1%)'
                  : 'Hệ thống vận hành tốt (<1%)'
              }
              icon={AlertTriangle}
              color={errorRateColor}
              variant={errorRateVariant}
            />
            <AdminStatCard
              title="Độ Trễ p95"
              value={`${overview?.p95Ms ?? 0} ms`}
              helper={`p50: ${overview?.p50Ms ?? 0}ms | TB: ${overview?.avgLatencyMs ?? 0}ms`}
              icon={Clock}
              color="text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/40 border-purple-200 dark:border-purple-800/50"
            />
            <AdminStatCard
              title="Độ Trễ p99"
              value={`${overview?.p99Ms ?? 0} ms`}
              helper={`Cao nhất: ${overview?.maxLatencyMs ?? 0}ms`}
              icon={Timer}
              color="text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800/50"
            />
          </div>

          {/* Hàng 2 biểu đồ chuỗi thời gian */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Biểu đồ 1: Lưu lượng & Lỗi 5xx */}
            <AdminCard>
              <AdminLineChart
                data={trafficChartData}
                title="Lưu Lượng Truy Cập & Lỗi Hệ Thống"
                subtitle={`Phân bổ số lượng request và lỗi 5xx trong ${selectedRange.label}`}
                primaryLabel="Requests"
                primaryColor="#0284C7"
                secondaryLabel="Lỗi 5xx"
                secondaryColor="#EF4444"
                height={240}
              />
            </AdminCard>

            {/* Biểu đồ 2: Độ trễ phản hồi */}
            <AdminCard>
              <AdminLineChart
                data={latencyChartData}
                title="Độ Trễ Phản Hồi (Latency)"
                subtitle="Độ trễ phân vị p95 và độ trễ trung bình tính bằng mili-giây"
                primaryLabel="p95 Latency"
                primaryColor="#F59E0B"
                secondaryLabel="Latency TB"
                secondaryColor="#10B981"
                valueSuffix="ms"
                height={240}
              />
            </AdminCard>
          </div>

          {/* Bảng hiệu năng từng tuyến đường (Route Breakdown) */}
          <AdminCard noPadding className="overflow-hidden">
            <div className="p-5 border-b border-slate-100 dark:border-[#1E293B] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <AdminCardTitle>
                  <Layers className="w-4 h-4 text-amber-500" />
                  Hiệu Năng Tuyến Đường (Route Performance)
                </AdminCardTitle>
                <AdminCardDescription>
                  Thống kê chi tiết số lượt gọi, lỗi và độ trễ của 20 tuyến đường hàng đầu
                </AdminCardDescription>
              </div>

              {/* Bộ lọc sắp xếp */}
              <div className="flex items-center gap-1.5 self-start sm:self-auto bg-slate-100 dark:bg-[#172238] p-1 rounded-lg border border-slate-200/80 dark:border-[#1E293B]">
                <span className="text-[11px] font-medium text-slate-500 dark:text-[#94A3B8] px-2 flex items-center gap-1">
                  <ArrowUpDown className="w-3 h-3" />
                  Sắp xếp:
                </span>
                <button
                  type="button"
                  onClick={() => handleSortChange('requests')}
                  className={`px-2.5 py-1 rounded-md text-xs font-medium transition-all duration-150 cursor-pointer ${
                    sortBy === 'requests'
                      ? 'bg-white dark:bg-[#111827] text-slate-900 dark:text-[#F8FAFC] shadow-xs'
                      : 'text-slate-500 hover:text-slate-900 dark:text-[#94A3B8] dark:hover:text-[#F8FAFC]'
                  }`}
                >
                  Lưu lượng
                </button>
                <button
                  type="button"
                  onClick={() => handleSortChange('errors')}
                  className={`px-2.5 py-1 rounded-md text-xs font-medium transition-all duration-150 cursor-pointer ${
                    sortBy === 'errors'
                      ? 'bg-white dark:bg-[#111827] text-slate-900 dark:text-[#F8FAFC] shadow-xs'
                      : 'text-slate-500 hover:text-slate-900 dark:text-[#94A3B8] dark:hover:text-[#F8FAFC]'
                  }`}
                >
                  Lỗi 5xx
                </button>
                <button
                  type="button"
                  onClick={() => handleSortChange('latency')}
                  className={`px-2.5 py-1 rounded-md text-xs font-medium transition-all duration-150 cursor-pointer ${
                    sortBy === 'latency'
                      ? 'bg-white dark:bg-[#111827] text-slate-900 dark:text-[#F8FAFC] shadow-xs'
                      : 'text-slate-500 hover:text-slate-900 dark:text-[#94A3B8] dark:hover:text-[#F8FAFC]'
                  }`}
                >
                  Độ trễ p95
                </button>
              </div>
            </div>

            <AdminTable>
              <AdminTableHeader>
                <AdminTableRow>
                  <AdminTableHead width="30%">Tuyến đường (Route)</AdminTableHead>
                  <AdminTableHead width="10%">Phương thức</AdminTableHead>
                  <AdminTableHead align="right" width="10%">Requests</AdminTableHead>
                  <AdminTableHead align="right" width="10%">Lỗi 5xx</AdminTableHead>
                  <AdminTableHead align="right" width="12%">Tỉ lệ lỗi</AdminTableHead>
                  <AdminTableHead align="right" width="10%">p95 (ms)</AdminTableHead>
                  <AdminTableHead align="right" width="10%">Trung bình</AdminTableHead>
                  <AdminTableHead align="right" width="8%">Max</AdminTableHead>
                </AdminTableRow>
              </AdminTableHeader>

              {routesLoading ? (
                <AdminTableSkeleton columns={8} rows={6} />
              ) : routes.length === 0 ? (
                <AdminTableEmpty
                  colSpan={8}
                  message="Chưa có dữ liệu đo trong khoảng này"
                />
              ) : (
                <AdminTableBody>
                  {routes.map((r, idx) => {
                    const isUnknown = r.route === 'unknown';
                    const routeErrorRate = r.errorRatePercent;
                    const isHighError = routeErrorRate > 5;
                    const isMediumError = routeErrorRate > 1;

                    return (
                      <AdminTableRow key={`${r.route}-${r.method}-${idx}`}>
                        {/* Cột Route kèm giải thích unknown */}
                        <AdminTableCell>
                          <div className="flex items-center gap-2">
                            {isUnknown ? (
                              <div className="flex items-center gap-2">
                                <span className="font-mono text-xs text-slate-500 dark:text-slate-400">
                                  unknown
                                </span>
                                <AdminTooltip
                                  position="top"
                                  content="Gom các request không khớp route nào (HTTP 404 hoặc bị chặn trước khi vào controller)"
                                >
                                  <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium bg-slate-100 text-slate-600 dark:bg-[#172238] dark:text-[#94A3B8] border border-slate-200 dark:border-[#1E293B] cursor-help">
                                    <Info className="w-3 h-3 text-amber-500" />
                                    404 / Middleware
                                  </span>
                                </AdminTooltip>
                              </div>
                            ) : (
                              <span className="font-mono text-xs text-slate-800 dark:text-[#F8FAFC] break-all">
                                {r.route}
                              </span>
                            )}
                          </div>
                        </AdminTableCell>

                        {/* Cột Method */}
                        <AdminTableCell>
                          {getMethodBadge(r.method)}
                        </AdminTableCell>

                        {/* Requests */}
                        <AdminTableCell align="right" mono>
                          <span className="font-semibold text-slate-900 dark:text-[#F8FAFC]">
                            {r.requests.toLocaleString('vi-VN')}
                          </span>
                        </AdminTableCell>

                        {/* Errors 5xx */}
                        <AdminTableCell align="right" mono>
                          <span
                            className={
                              r.errors5xx > 0
                                ? 'font-semibold text-rose-600 dark:text-rose-400'
                                : 'text-slate-400 dark:text-slate-600'
                            }
                          >
                            {r.errors5xx.toLocaleString('vi-VN')}
                          </span>
                        </AdminTableCell>

                        {/* Error Rate */}
                        <AdminTableCell align="right">
                          <span
                            className={`inline-flex items-center px-1.5 py-0.5 rounded text-xs font-mono font-medium ${
                              isHighError
                                ? 'bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-[#EF4444]'
                                : isMediumError
                                ? 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-[#F59E0B]'
                                : 'text-slate-600 dark:text-slate-400'
                            }`}
                          >
                            {r.errorRatePercent}%
                          </span>
                        </AdminTableCell>

                        {/* p95 */}
                        <AdminTableCell align="right" mono>
                          <span
                            className={
                              r.p95Ms > 1000
                                ? 'font-semibold text-amber-600 dark:text-amber-400'
                                : 'text-slate-700 dark:text-[#F8FAFC]'
                            }
                          >
                            {r.p95Ms.toLocaleString('vi-VN')} ms
                          </span>
                        </AdminTableCell>

                        {/* Avg Latency */}
                        <AdminTableCell align="right" mono>
                          <span className="text-slate-600 dark:text-[#94A3B8]">
                            {r.avgLatencyMs.toLocaleString('vi-VN')} ms
                          </span>
                        </AdminTableCell>

                        {/* Max Latency */}
                        <AdminTableCell align="right" mono>
                          <span className="text-slate-500 dark:text-[#64748B]">
                            {r.maxLatencyMs.toLocaleString('vi-VN')} ms
                          </span>
                        </AdminTableCell>
                      </AdminTableRow>
                    );
                  })}
                </AdminTableBody>
              )}
            </AdminTable>
          </AdminCard>
        </>
      )}
    </div>
  );
}
