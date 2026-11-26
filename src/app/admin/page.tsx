'use client';

import { useEffect, useState } from 'react';
import { Activity, CalendarDays, Camera, Compass, RefreshCw, Users, Wallet } from 'lucide-react';
import { getStatsAction } from '@/app/actions';
import ErrorState from '@/components/ErrorState';
import { AdminButton } from '@/components/admin/AdminButton';
import { AdminBadge } from '@/components/admin/AdminBadge';
import { AdminCard } from '@/components/admin/AdminCard';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { AdminStatCard } from '@/components/admin/AdminStatCard';
import { AdminDonutChart } from '@/components/admin/charts/AdminDonutChart';
import { AdminLineChart } from '@/components/admin/charts/AdminLineChart';

interface Stats {
  totalUsers: number;
  totalTrips: number;
  totalExpenses: number;
  totalMoments: number;
  totalReservations: number;
  activeUsers: number;
  northStar?: { activeSquads7Days: number; definition: string };
  expenseCategories?: { category: string; totalAmount: number }[];
  activityTrend?: { date: string; count: number }[];
  recentActivities: {
    id: string;
    type: string;
    description: string;
    createdAt: string;
    user?: { name: string | null };
    trip?: { name: string | null };
  }[];
}

const metrics = [
  { field: 'totalUsers', label: 'Thành viên', Icon: Users },
  { field: 'totalTrips', label: 'Chuyến đi', Icon: Compass },
  { field: 'activeUsers', label: 'Thành viên hoạt động', Icon: Activity },
  { field: 'totalExpenses', label: 'Khoản chi', Icon: Wallet },
  { field: 'totalMoments', label: 'Khoảnh khắc', Icon: Camera },
  { field: 'totalReservations', label: 'Đặt chỗ', Icon: CalendarDays },
] as const;

const categories: Record<string, { label: string; color: string }> = {
  FOOD: { label: 'Ăn uống', color: '#b4543a' },
  TRANSPORT: { label: 'Di chuyển', color: '#416d64' },
  ACCOMMODATION: { label: 'Chỗ ở', color: '#a67b35' },
  ENTERTAINMENT: { label: 'Giải trí', color: '#735c73' },
  ACTIVITIES: { label: 'Tham quan', color: '#738353' },
  SHOPPING: { label: 'Mua sắm', color: '#576e88' },
  OTHER: { label: 'Khác', color: '#777066' },
};

const numbers = new Intl.NumberFormat('vi-VN');
const time = new Intl.DateTimeFormat('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh', dateStyle: 'short', timeStyle: 'short' });

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function fetchStats() {
    setLoading(true);
    setError(null);
    try {
      const result = await getStatsAction();
      if (result.success && result.data) setStats(result.data);
      else setError(result.error || 'Không tải được số liệu tổng quan.');
    } catch {
      setError('Không thể kết nối tới hệ thống.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { void fetchStats(); }, []);

  const period = stats?.activityTrend?.map(({ date, count }) => ({
    label: date.includes('-') ? date.split('-').slice(1).join('/') : date,
    value: count,
  })) ?? [];

  const expenses = (stats?.expenseCategories ?? []).map(({ category, totalAmount }) => ({
    label: categories[category]?.label ?? category,
    color: categories[category]?.color ?? categories.OTHER.color,
    value: totalAmount,
  }));

  return (
    <div className="space-y-6">
      <AdminPageHeader title="Tổng quan" description="Hoạt động của thành viên, chuyến đi và chi phí trên TripMate.">
        <AdminButton variant="outline" onClick={fetchStats} loading={loading} icon={<RefreshCw size={16} aria-hidden="true" />}>Làm mới</AdminButton>
      </AdminPageHeader>

      {error && !stats ? <ErrorState message={error} onRetry={fetchStats} /> : null}
      {loading && !stats ? (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3" aria-label="Đang tải số liệu" aria-busy="true">
          {metrics.map(({ field }) => <AdminCard key={field} className="h-26 animate-pulse motion-reduce:animate-none">{null}</AdminCard>)}
        </div>
      ) : null}

      {stats && <>
        {error && <p role="status" className="text-sm text-[var(--admin-accent-ink)]">{error} Đang hiển thị dữ liệu của lần tải trước.</p>}
        {stats.northStar && (
          <section className="grid items-center gap-4 rounded-xl border border-[var(--admin-border)] bg-[var(--admin-surface-hover)] px-4 py-4 sm:grid-cols-[minmax(0,1fr)_auto] sm:px-6" aria-labelledby="active-groups">
            <div className="min-w-0">
              <h2 id="active-groups" className="text-base font-semibold">Nhóm hoạt động trong 7 ngày</h2>
              <p className="mt-1 max-w-prose text-sm text-[var(--admin-text-secondary)]">{stats.northStar.definition}</p>
            </div>
            <p className="text-[clamp(1.9rem,5vw,2.7rem)] font-semibold leading-tight tabular-nums text-[var(--admin-accent-ink)]">
              {numbers.format(stats.northStar.activeSquads7Days)}
            </p>
          </section>
        )}

        <section className="grid gap-3 [grid-template-columns:repeat(auto-fit,minmax(min(100%,152px),1fr))]" aria-label="Chỉ số vận hành">
          {metrics.map(({ field, label, Icon }) => (
            <AdminStatCard key={field} title={label} value={stats[field]} icon={Icon} />
          ))}
        </section>

        <div className="grid gap-4 xl:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
          <AdminCard>
            <h2 className="text-base font-semibold">Hoạt động trong 30 ngày</h2>
            <div className="mt-4">
              <AdminLineChart data={period} primaryColor="var(--admin-primary)" primaryLabel="Tương tác" valueSuffix=" lượt" />
            </div>
          </AdminCard>
          <AdminCard>
            <h2 className="text-base font-semibold">Chi tiêu theo danh mục</h2>
            <div className="mt-4">
              <AdminDonutChart data={expenses} totalLabel="Tổng chi tiêu" valueSuffix=" ₫" size={158} />
            </div>
          </AdminCard>
        </div>

        <AdminCard>
          <h2 className="text-base font-semibold">Hoạt động gần đây</h2>
          {stats.recentActivities.length === 0 ? (
            <p className="mt-3 text-sm text-[var(--admin-text-secondary)]">Chưa có hoạt động nào.</p>
          ) : (
            <ul className="mt-2 divide-y divide-[var(--admin-border)]">
              {stats.recentActivities.map((entry) => (
                <li key={entry.id} className="grid gap-2 py-3 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-start">
                  <div className="min-w-0">
                    <p className="text-sm leading-relaxed">
                      <strong>{entry.user?.name ?? 'Thành viên'}</strong> {entry.description}
                      {entry.trip?.name && <> · <span className="text-[var(--admin-accent-ink)]">{entry.trip.name}</span></>}
                    </p>
                    <time dateTime={entry.createdAt} className="mt-1 block text-xs text-[var(--admin-text-secondary)]">{time.format(new Date(entry.createdAt))}</time>
                  </div>
                  <AdminBadge className="max-w-full justify-self-start break-all" variant="neutral" size="xs">{entry.type}</AdminBadge>
                </li>
              ))}
            </ul>
          )}
        </AdminCard>
      </>}
    </div>
  );
}
