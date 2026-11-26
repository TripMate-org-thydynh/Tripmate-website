'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Activity, AlertTriangle, Gauge, RefreshCw, Timer, X } from 'lucide-react';
import { AdminButton } from '@/components/admin/AdminButton';
import { AdminBadge } from '@/components/admin/AdminBadge';
import { AdminCard } from '@/components/admin/AdminCard';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { AdminStatCard } from '@/components/admin/AdminStatCard';
import { AdminLineChart } from '@/components/admin/charts/AdminLineChart';
import { getDashboard } from './actions';
import type { DashboardSnapshot, RouteFilter, RouteSort } from './types';

const ranges = [
  { label: '15 phút', minutes: 15, step: 1 },
  { label: '1 giờ', minutes: 60, step: 1 },
  { label: '6 giờ', minutes: 360, step: 5 },
  { label: '24 giờ', minutes: 1440, step: 15 },
  { label: '7 ngày', minutes: 10080, step: 60 },
];
const number = new Intl.NumberFormat('vi-VN', { maximumFractionDigits: 2 });
const clock = new Intl.DateTimeFormat('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh', hour: '2-digit', minute: '2-digit', second: '2-digit' });
const chartTime = new Intl.DateTimeFormat('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh', hour: '2-digit', minute: '2-digit' });
const chartDate = new Intl.DateTimeFormat('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh', day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' });
const failureTime = new Intl.DateTimeFormat('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh', dateStyle: 'short', timeStyle: 'medium' });
const head = 'whitespace-nowrap px-4 py-3 text-left text-xs font-semibold';
const cell = 'whitespace-nowrap px-4 py-3 text-sm';
type LoadState = { key: string; pending: boolean; data?: DashboardSnapshot; dataKey?: string; error?: string };

export default function ObservabilityDashboardPage() {
  const [range, setRange] = useState(ranges[1]);
  const [sort, setSort] = useState<RouteSort>('requests');
  const [endpoint, setEndpoint] = useState<RouteFilter | null>(null);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [refresh, setRefresh] = useState(0);
  const [state, setState] = useState<LoadState>({ key: '', pending: true });
  const key = JSON.stringify([range.minutes, sort, endpoint?.method, endpoint?.route]);

  useEffect(() => {
    let active = true;
    let running = false;

    async function load() {
      if (running) return;
      running = true;
      setState((previous) => ({ ...previous, key, pending: true, error: undefined }));
      const result = await getDashboard(range.minutes, range.step, sort, endpoint)
        .catch(() => ({ error: 'Không thể kết nối tới hệ thống giám sát.' }));
      running = false;
      if (!active) return;
      setState((previous) => 'data' in result
        ? { key, pending: false, data: result.data, dataKey: key }
        : { ...previous, key, pending: false, error: result.error });
    }

    void load();
    const interval = autoRefresh ? window.setInterval(() => {
      if (!document.hidden) void load();
    }, 30_000) : undefined;
    return () => {
      active = false;
      if (interval !== undefined) window.clearInterval(interval);
    };
  }, [key, endpoint, range, sort, autoRefresh, refresh]);

  const current = state.key === key ? state : undefined;
  const snapshot = state.data;
  const pending = current?.pending ?? true;
  const stale = snapshot && state.dataKey !== key;
  const total = snapshot?.overview.totalRequests ?? 0;
  const points = total > 0 ? (snapshot?.timeseries ?? []).map((point) => ({
    ...point,
    label: ((snapshot?.overview.rangeMinutes ?? range.minutes) >= 1440 ? chartDate : chartTime).format(new Date(point.ts)),
  })) : [];
  const displayLatency = (ms: number) => total ? number.format(ms) + ' ms' : '—';

  return (
    <section aria-labelledby="observability-title" className="space-y-5">
      <div id="observability-title">
        <AdminPageHeader title="Giám sát hệ thống" description="Theo dõi lưu lượng, lỗi API và độ trễ của TripMate."
          actions={<>
            <Link href="/admin/observability/slo" className="admin-toolbar-control bg-admin-surface px-3 text-sm font-semibold">Mục tiêu SLO</Link>
            <AdminButton type="button" variant="outline" icon={<RefreshCw className="size-4" />} disabled={pending} onClick={() => setRefresh((value) => value + 1)}>Làm mới</AdminButton>
          </>}
        />
      </div>

      <AdminCard className="flex flex-wrap items-center justify-between gap-4">
        <div role="group" aria-label="Khoảng thời gian" className="flex flex-wrap gap-0.5 bg-admin-bg p-1">
          {ranges.map((option) => <button key={option.minutes} type="button" aria-pressed={range === option} onClick={() => setRange(option)}
            className="min-h-8 cursor-pointer px-3 py-1.5 text-xs font-semibold text-admin-text-secondary transition-colors hover:bg-admin-surface-hover aria-pressed:bg-[var(--admin-accent-bg)] aria-pressed:text-[var(--admin-accent-ink)]">{option.label}</button>)}
        </div>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
          <label className="flex cursor-pointer items-center gap-2"><input type="checkbox" className="size-4 accent-admin-primary" checked={autoRefresh} onChange={(event) => setAutoRefresh(event.target.checked)} />Tự làm mới</label>
          <span className="text-admin-text-secondary" role="status">
            {pending ? 'Đang cập nhật…' : snapshot ? 'Cập nhật ' + clock.format(new Date(snapshot.asOf)) + ' (GMT+7)' : 'Chưa cập nhật'}
          </span>
        </div>
      </AdminCard>

      {endpoint && <div className="flex flex-wrap items-center gap-3 bg-[var(--admin-accent-bg)] px-4 py-3 text-sm">
        <strong>Đang xem</strong><code className="break-all">{endpoint.method} {endpoint.route}</code>
        <AdminButton type="button" variant="ghost" icon={<X className="size-3.5" />} onClick={() => setEndpoint(null)}>Bỏ lọc endpoint</AdminButton>
      </div>}

      {current?.error && <AdminCard role="alert" className="flex flex-wrap items-center gap-3 text-sm text-rose-700 dark:text-rose-300">
        <AlertTriangle className="size-4" aria-hidden="true" />
        <p className="flex-1">{current.error} {snapshot && 'Dữ liệu bên dưới là từ lần cập nhật trước.'}</p>
        <AdminButton type="button" variant="secondary" onClick={() => setRefresh((value) => value + 1)}>Thử lại</AdminButton>
      </AdminCard>}
      {pending && stale && <p className="text-sm text-admin-text-secondary">Đang tải bộ lọc mới. Số liệu bên dưới vẫn là kết quả trước.</p>}
      {!snapshot && pending && <AdminCard><p className="text-sm text-admin-text-secondary">Đang tải dữ liệu giám sát…</p></AdminCard>}

      {snapshot && <>
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <AdminStatCard title="Lượt gọi API" value={number.format(total)} description={number.format(snapshot.overview.rps) + ' lượt/giây trung bình'} icon={<Activity className="size-4" />} />
          <AdminStatCard title="Tỷ lệ lỗi 5xx" value={total ? number.format(snapshot.overview.errorRatePercent) + '%' : '—'} icon={<AlertTriangle className="size-4" />} />
          <AdminStatCard title="Độ trễ p95" value={displayLatency(snapshot.overview.p95Ms)} icon={<Timer className="size-4" />} />
          <AdminStatCard title="Độ trễ p99" value={displayLatency(snapshot.overview.p99Ms)} description={total ? 'Tối đa ' + displayLatency(snapshot.overview.maxLatencyMs) : undefined} icon={<Gauge className="size-4" />} />
        </div>

        {total === 0 ? <AdminCard><p className="text-sm">Không có lưu lượng API trong khoảng thời gian đã chọn.</p></AdminCard> :
          <div className="grid gap-4 xl:grid-cols-2">
            <AdminCard className="min-w-0">
              <AdminLineChart title="Lưu lượng API" data={points.map(({ label, requests, errors5xx }) => ({ label, value: requests, secondaryValue: errors5xx }))}
                primaryLabel="Lượt gọi" secondaryLabel="Lỗi 5xx" secondaryColor="#E11D48" />
            </AdminCard>
            <AdminCard className="min-w-0">
              <AdminLineChart title="Độ trễ theo thời gian" data={points.map(({ label, p95Ms, p99Ms }) => ({ label, value: p95Ms, secondaryValue: p99Ms }))}
                primaryLabel="p95" secondaryLabel="p99" valueSuffix=" ms" />
            </AdminCard>
          </div>}

        <AdminCard className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div><h2 className="text-base font-bold">Mục tiêu chất lượng (SLO)</h2><p className="text-sm text-admin-text-secondary">Đánh giá theo cửa sổ cấu hình của từng mục tiêu.</p></div>
            <Link href="/admin/observability/slo" className="text-sm font-semibold underline underline-offset-4">Quản lý SLO</Link>
          </div>
          {snapshot.slo.length === 0 ? <p className="text-sm text-admin-text-secondary">Chưa cấu hình mục tiêu SLO.</p> :
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {snapshot.slo.slice(0, 3).map((slo) => <div key={slo.id} className="space-y-2 bg-admin-bg p-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h3 className="text-sm font-semibold">{slo.name}</h3>
                  <AdminBadge variant={slo.currentSliPercent === null ? 'neutral' : slo.isMeetingObjective ? 'success' : 'danger'}>
                    {slo.currentSliPercent === null ? 'Chưa có dữ liệu' : slo.isMeetingObjective ? 'Đạt' : 'Dưới mục tiêu'}
                  </AdminBadge>
                </div>
                <p className="text-sm">{slo.currentSliPercent === null ? '—' : number.format(slo.currentSliPercent) + '%'} / {number.format(slo.objective)}% · {slo.windowDays} ngày</p>
                {slo.currentSliPercent !== null && <p className="text-xs text-admin-text-secondary">Ngân sách lỗi còn {number.format(slo.errorBudgetRemainingPercent)}% · Burn rate {number.format(slo.burnRate)}×</p>}
              </div>)}
            </div>}
        </AdminCard>

        <AdminCard noPadding>
          <div className="flex flex-wrap items-center justify-between gap-3 p-5">
            <div><h2 className="text-base font-bold">Hiệu năng endpoint</h2><p className="text-sm text-admin-text-secondary">Chọn một endpoint để xem lưu lượng và lỗi riêng.</p></div>
            <label className="flex items-center gap-2 text-sm">Sắp xếp
              <select value={sort} onChange={(event) => setSort(event.target.value as RouteSort)} className="admin-field px-2 py-1.5">
                <option value="requests">Lượt gọi</option><option value="errors">Lỗi 5xx</option><option value="latency">Độ trễ p95</option>
              </select>
            </label>
          </div>
          {snapshot.routes.length === 0 ? <p className="px-5 pb-5 text-sm text-admin-text-secondary">Chưa ghi nhận endpoint nào.</p> :
            <div className="overflow-x-auto" tabIndex={0} role="region" aria-label="Bảng hiệu năng endpoint">
              <table className="w-full border-collapse">
                <thead className="bg-admin-surface-hover"><tr>
                  {['Endpoint', 'Lượt gọi', 'Lỗi 5xx', 'Tỷ lệ lỗi', 'p95', 'Tối đa'].map((label) => <th key={label} scope="col" className={head}>{label}</th>)}
                </tr></thead>
                <tbody className="divide-y divide-admin-border">{snapshot.routes.map((route) => <tr key={route.method + ' ' + route.route}>
                  <td className={cell}><button type="button" aria-pressed={endpoint?.route === route.route && endpoint.method === route.method}
                    onClick={() => setEndpoint({ method: route.method, route: route.route })}
                    className="inline-flex items-center gap-2 p-1 font-mono text-xs hover:underline aria-pressed:bg-[var(--admin-accent-bg)]">
                    <AdminBadge variant="neutral">{route.method}</AdminBadge>{route.route}
                  </button></td>
                  <td className={cell}>{number.format(route.requests)}</td>
                  <td className={cell}>{number.format(route.errors5xx)}</td>
                  <td className={cell}>{number.format(route.errorRatePercent)}%</td>
                  <td className={cell}>{number.format(route.p95Ms)} ms</td>
                  <td className={cell}>{number.format(route.maxLatencyMs)} ms</td>
                </tr>)}</tbody>
              </table>
            </div>}
        </AdminCard>

        <AdminCard noPadding>
          <div className="p-5"><h2 className="text-base font-bold">Lỗi 5xx gần đây</h2>
            <p className="text-sm text-admin-text-secondary">Tối đa 50 mẫu trong khoảng đã chọn, lưu tối đa 7 ngày.</p>
          </div>
          {snapshot.failures.length === 0 ? <p className="px-5 pb-5 text-sm text-admin-text-secondary">Không có mẫu lỗi trong khoảng này.</p> :
            <div className="overflow-x-auto" tabIndex={0} role="region" aria-label="Bảng lỗi 5xx gần đây">
              <table className="w-full border-collapse">
                <thead className="bg-admin-surface-hover"><tr>
                  {['Thời gian', 'Endpoint', 'Status', 'Độ trễ', 'Request ID'].map((label) => <th key={label} scope="col" className={head}>{label}</th>)}
                </tr></thead>
                <tbody className="divide-y divide-admin-border">{snapshot.failures.map((failure) => <tr key={failure.id}>
                  <td className={cell}><time dateTime={failure.occurredAt}>{failureTime.format(new Date(failure.occurredAt))}</time></td>
                  <td className={cell}><code className="text-xs">{failure.method} {failure.route}</code></td>
                  <td className={cell}><AdminBadge variant="danger">{failure.statusCode}</AdminBadge></td>
                  <td className={cell}>{number.format(failure.durationMs)} ms</td>
                  <td className={cell}><code className="text-xs select-all">{failure.id}</code></td>
                </tr>)}</tbody>
              </table>
            </div>}
        </AdminCard>
      </>}
    </section>
  );
}
