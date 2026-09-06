'use client';

import { useEffect, useState } from 'react';
import { getStatsAction } from '@/app/actions';
import {
  Users,
  Compass,
  DollarSign,
  Camera,
  CalendarDays,
  Activity,
  RefreshCw,
  Sparkles,
  Flame,
} from 'lucide-react';
import ErrorState from '@/components/ErrorState';
import { AdminCard, AdminCardHeader, AdminCardTitle, AdminCardDescription } from '@/components/admin/AdminCard';
import { AdminButton } from '@/components/admin/AdminButton';
import { AdminBadge } from '@/components/admin/AdminBadge';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { AdminStatCard } from '@/components/admin/AdminStatCard';
import { AdminLineChart } from '@/components/admin/charts/AdminLineChart';
import { AdminDonutChart } from '@/components/admin/charts/AdminDonutChart';

interface StatsData {
  totalUsers: number;
  totalTrips: number;
  totalExpenses: number;
  totalMoments: number;
  totalReservations: number;
  activeUsers: number;
  northStar?: {
    activeSquads7Days: number;
    definition: string;
  };
  expenseCategories?: Array<{
    category: string;
    totalAmount: number;
    count: number;
  }>;
  activityTrend?: Array<{
    date: string;
    count: number;
  }>;
  recentActivities: Array<{
    id: string;
    type: string;
    description: string;
    createdAt: string;
    user: { id: string; name: string; avatarUrl: string | null };
    trip: { id: string; name: string };
  }>;
}

const CATEGORY_COLORS: Record<string, string> = {
  FOOD: '#F59E0B', // Amber
  TRANSPORT: '#38BDF8', // Cyan-sky
  ACCOMMODATION: '#EAB308', // Amber Brand
  ENTERTAINMENT: '#EC4899', // Pink
  ACTIVITIES: '#22C55E', // Emerald
  SHOPPING: '#F97316', // Orange
  OTHER: '#64748B', // Slate
};

const CATEGORY_LABELS: Record<string, string> = {
  FOOD: 'Ăn uống',
  TRANSPORT: 'Di chuyển',
  ACCOMMODATION: 'Khách sạn / Chỗ ở',
  ENTERTAINMENT: 'Giải trí & Bar',
  ACTIVITIES: 'Vé tham quan / Tour',
  SHOPPING: 'Mua sắm & Quà',
  OTHER: 'Chi tiêu khác',
};

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<StatsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = async () => {
    setLoading(true);
    setError(null);
    const res = await getStatsAction();
    if (res.success && res.data) {
      setStats(res.data.data || res.data);
    } else {
      setError(res.error || 'Không thể lấy dữ liệu thống kê');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const cardItems = stats
    ? [
        {
          title: 'Tổng thành viên',
          value: stats.totalUsers,
          icon: Users,
          color: 'text-amber-600 dark:text-amber-400 bg-amber-500/10',
          helper: 'Tài khoản đăng ký',
        },
        {
          title: 'Chuyến đi đã tạo',
          value: stats.totalTrips,
          icon: Compass,
          color: 'text-[#38BDF8] bg-[#38BDF8]/10',
          helper: 'Hành trình nhóm',
        },
        {
          title: 'Thành viên hoạt động',
          value: stats.activeUsers,
          icon: Sparkles,
          color: 'text-[#22C55E] bg-[#22C55E]/10',
          helper: 'Tương tác gần đây',
        },
        {
          title: 'Khoản chi tiêu',
          value: stats.totalExpenses,
          icon: DollarSign,
          color: 'text-[#F59E0B] bg-[#F59E0B]/10',
          helper: 'Giao dịch chia tiền',
        },
        {
          title: 'Khoảnh khắc Moments',
          value: stats.totalMoments,
          icon: Camera,
          color: 'text-pink-600 dark:text-pink-400 bg-pink-500/10',
          helper: 'Ảnh & kỷ niệm',
        },
        {
          title: 'Phiếu đặt chỗ (AI)',
          value: stats.totalReservations,
          icon: CalendarDays,
          color: 'text-amber-600 dark:text-amber-400 bg-amber-500/10',
          helper: 'Vé máy bay & khách sạn',
        },
      ]
    : [];

  const donutData =
    stats?.expenseCategories?.map((c) => ({
      label: CATEGORY_LABELS[c.category] || c.category,
      value: c.totalAmount,
      color: CATEGORY_COLORS[c.category] || '#64748B',
    })) || [];

  const lineChartData =
    stats?.activityTrend?.map((t) => ({
      label: t.date.includes('-')
        ? t.date.split('-').slice(1).join('/')
        : t.date,
      value: t.count,
    })) || [];

  return (
    <div className="flex flex-col gap-6">
      {/* Page Header */}
      <AdminPageHeader
        title="Tổng quan Hệ thống"
        description="Chỉ số vận hành cốt lõi và hành vi người dùng cập nhật theo thời gian thực."
      >
        <AdminButton
          variant="outline"
          size="sm"
          onClick={fetchStats}
          loading={loading}
          icon={<RefreshCw className="w-3.5 h-3.5" />}
        >
          Làm mới
        </AdminButton>
      </AdminPageHeader>

      {error && !stats && !loading ? (
        <ErrorState message={error} onRetry={fetchStats} />
      ) : loading && !stats ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="h-24 rounded-xl bg-white dark:bg-[#111827] border border-[#E2E8F0] dark:border-[#1E293B] animate-pulse p-4 shadow-xs"
            />
          ))}
        </div>
      ) : (
        <>
          {/* North Star Metric Card */}
          <AdminCard className="bg-[#0D1424] text-white border-[#1E293B] shadow-sm relative overflow-hidden">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
              <div className="flex items-start gap-4">
                <div className="w-11 h-11 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
                  <Flame className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="px-2 py-0.5 rounded-full bg-amber-500/20 border border-amber-500/30 text-amber-300 text-[10px] font-semibold uppercase tracking-wider">
                      North Star Metric
                    </span>
                    <span className="text-[11px] text-[#94A3B8]">
                      Chỉ số quan trọng nhất
                    </span>
                  </div>
                  <h2 className="text-lg md:text-xl font-bold tracking-tight text-white">
                    Active Squads: {stats?.northStar?.activeSquads7Days ?? 0} Nhóm Hoạt Động
                  </h2>
                  <p className="text-xs text-[#94A3B8] mt-1 max-w-xl leading-relaxed">
                    {stats?.northStar?.definition ||
                      'Số nhóm có ≥3 thành viên cùng tương tác trong 7 ngày gần nhất.'}
                  </p>
                </div>
              </div>

              <div className="px-4 py-3 rounded-lg bg-white/5 backdrop-blur-xs border border-white/10 shrink-0 text-center w-full md:w-auto">
                <span className="text-[10px] uppercase font-semibold text-[#94A3B8] block">
                  Mục tiêu Q3/2026
                </span>
                <span className="text-lg font-bold text-amber-300 block">
                  20+ Squads
                </span>
                <div className="w-full md:w-32 bg-white/10 h-1.5 rounded-full mt-2 overflow-hidden">
                  <div
                    className="bg-amber-400 h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${Math.min(
                        100,
                        ((stats?.northStar?.activeSquads7Days ?? 0) / 20) * 100
                      )}%`,
                    }}
                  />
                </div>
              </div>
            </div>
          </AdminCard>

          {/* KPI Metrics Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3.5">
            {cardItems.map((item, idx) => (
              <AdminStatCard
                key={idx}
                title={item.title}
                value={item.value}
                helper={item.helper}
                icon={item.icon}
                color={item.color}
              />
            ))}
          </div>

          {/* Interactive Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* 30-Day Activity Trend Chart (2 Cols) */}
            <AdminCard className="lg:col-span-2">
              <AdminLineChart
                data={lineChartData}
                title="Xu hướng Hoạt động Hệ thống"
                subtitle="Lượt tương tác và thao tác trong 30 ngày qua"
                primaryColor="#F59E0B"
                primaryLabel="Tương tác"
                valueSuffix=" lượt"
                height={220}
              />
            </AdminCard>

            {/* Expense Categories Donut (1 Col) */}
            <AdminCard>
              <AdminDonutChart
                data={donutData}
                title="Cơ cấu Chi tiêu Du lịch"
                subtitle="Tỷ trọng chi tiêu theo từng hạng mục"
                totalLabel="Tổng chi tiêu"
                valueSuffix=" đ"
              />
            </AdminCard>
          </div>

          {/* Recent Activity Stream */}
          <AdminCard>
            <AdminCardHeader>
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                  <Activity className="w-4 h-4" />
                </div>
                <div>
                  <AdminCardTitle>Nhật ký Hoạt động Mới nhất</AdminCardTitle>
                  <AdminCardDescription>
                    Ghi nhận tự động các hành động của thành viên trong chuyến đi
                  </AdminCardDescription>
                </div>
              </div>
              <AdminBadge variant="neutral">
                {stats?.recentActivities.length ?? 0} sự kiện
              </AdminBadge>
            </AdminCardHeader>

            {stats?.recentActivities.length === 0 ? (
              <p className="text-xs text-[#94A3B8] text-center py-8">
                Chưa có hoạt động nào được ghi nhận.
              </p>
            ) : (
              <div className="divide-y divide-[#E2E8F0] dark:divide-[#1E293B]">
                {stats?.recentActivities.map((act) => (
                  <div
                    key={act.id}
                    className="py-3 flex items-start justify-between gap-4 first:pt-0 last:pb-0"
                  >
                    <div className="flex items-start gap-3 min-w-0">
                      <div className="w-7 h-7 rounded-full bg-slate-100 dark:bg-[#1E293B] text-[#0F172A] dark:text-[#F8FAFC] font-semibold text-xs flex items-center justify-center shrink-0 mt-0.5">
                        {act.user?.name ? act.user.name.charAt(0).toUpperCase() : 'U'}
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs text-[#475569] dark:text-[#94A3B8] leading-normal">
                          <span className="font-semibold text-[#0F172A] dark:text-[#F8FAFC] mr-1">
                            {act.user?.name || 'Thành viên'}
                          </span>
                          {act.description} trong chuyến đi{' '}
                          <span className="font-medium text-amber-700 dark:text-amber-300">
                            {act.trip?.name || 'Chuyến đi'}
                          </span>
                        </p>
                        <span className="text-[11px] text-[#94A3B8] dark:text-[#64748B] mt-0.5 block">
                          {new Date(act.createdAt).toLocaleString('vi-VN')}
                        </span>
                      </div>
                    </div>
                    <AdminBadge variant="neutral" size="xs">
                      {act.type || 'Activity'}
                    </AdminBadge>
                  </div>
                ))}
              </div>
            )}
          </AdminCard>
        </>
      )}
    </div>
  );
}
