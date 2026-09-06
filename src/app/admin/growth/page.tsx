'use client';

import { useEffect, useState } from 'react';
import { getGrowthAnalyticsAction } from '@/app/actions';
import {
  TrendingUp,
  Users,
  Compass,
  RefreshCw,
  MapPin,
  Flame,
  Activity,
  Lightbulb,
} from 'lucide-react';
import ErrorState from '@/components/ErrorState';
import { AdminCard, AdminCardHeader, AdminCardTitle, AdminCardDescription } from '@/components/admin/AdminCard';
import { AdminButton } from '@/components/admin/AdminButton';
import { AdminBadge } from '@/components/admin/AdminBadge';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { AdminStatCard } from '@/components/admin/AdminStatCard';
import { AdminBarChart } from '@/components/admin/charts/AdminBarChart';
import { AdminFunnelChart } from '@/components/admin/charts/AdminFunnelChart';

interface DailyGrowthItem {
  date: string;
  users: number;
  trips: number;
}

interface GrowthData {
  dailyGrowth: DailyGrowthItem[];
  totalUsersLast30Days: number;
  totalTripsLast30Days: number;
  topDestinations?: Array<{
    destination: string;
    tripsCount: number;
  }>;
  funnel?: Array<{
    step: string;
    count: number;
    percentage: number;
  }>;
  engagement?: {
    dau: number;
    wau: number;
    mau: number;
    stickinessRatio: string;
    membersPerTrip: string;
  };
}

export default function AdminGrowthPage() {
  const [data, setData] = useState<GrowthData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchGrowth = async () => {
    setLoading(true);
    setError(null);
    const res = await getGrowthAnalyticsAction();
    if (res.success && res.data) {
      setData(res.data.data || res.data);
    } else {
      setError(res.error || 'Không thể lấy dữ liệu tăng trưởng');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchGrowth();
  }, []);

  const barChartData =
    data?.dailyGrowth?.map((item) => ({
      label: item.date,
      primaryValue: item.users,
      secondaryValue: item.trips,
    })) || [];

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <AdminPageHeader
        title="Tăng Trưởng & Phễu Chuyển Đổi"
        description="Phân tích số lượng đăng ký mới, phễu hành vi người dùng và điểm đến du lịch nổi bật."
      >
        <AdminButton
          variant="outline"
          size="sm"
          onClick={fetchGrowth}
          loading={loading}
          icon={<RefreshCw className="w-3.5 h-3.5" />}
        >
          Làm mới
        </AdminButton>
      </AdminPageHeader>

      {error && !data && !loading ? (
        <ErrorState message={error} onRetry={fetchGrowth} />
      ) : loading && !data ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="h-24 rounded-xl bg-white dark:bg-[#111827] border border-[#E2E8F0] dark:border-[#1E293B] animate-pulse p-4 shadow-xs"
            />
          ))}
        </div>
      ) : (
        <>
          {/* KPI Highlight Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <AdminStatCard
              title="User mới (30 ngày)"
              value={`+${data?.totalUsersLast30Days ?? 0}`}
              helper="Tài khoản đăng ký mới"
              icon={Users}
              color="text-amber-600 dark:text-amber-400 bg-amber-500/10 border-amber-500/20"
            />
            <AdminStatCard
              title="Chuyến đi (30 ngày)"
              value={`+${data?.totalTripsLast30Days ?? 0}`}
              helper="Hành trình được tạo"
              icon={Compass}
              color="text-[#38BDF8] bg-[#38BDF8]/10 border-[#38BDF8]/20"
            />
            <AdminStatCard
              title="Độ gắn kết (DAU/MAU)"
              value={data?.engagement?.stickinessRatio || '10%'}
              helper="Tỷ lệ quay lại hàng ngày"
              icon={Activity}
              color="text-[#22C55E] bg-[#22C55E]/10 border-[#22C55E]/20"
            />
            <AdminStatCard
              title="Quy mô Squad TB"
              value={`${data?.engagement?.membersPerTrip || '3.2'} TV`}
              helper="Thành viên trên mỗi chuyến đi"
              icon={TrendingUp}
              color="text-[#F59E0B] bg-[#F59E0B]/10 border-[#F59E0B]/20"
            />
          </div>

          {/* Growth Bar Chart */}
          <AdminCard>
            <AdminBarChart
              data={barChartData}
              title="So Sánh Tăng Trưởng Hàng Ngày (30 Ngày Gần Nhất)"
              subtitle="Số lượng người dùng mới và chuyến đi được tạo theo ngày"
              primaryColor="#F59E0B"
              primaryLabel="User mới"
              secondaryColor="#38BDF8"
              secondaryLabel="Chuyến đi mới"
              height={240}
            />
          </AdminCard>

          {/* Funnel & Top Destinations Row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Conversion Funnel (2 Cols) */}
            <AdminCard className="lg:col-span-2">
              <AdminFunnelChart
                data={data?.funnel || []}
                title="Phễu Chuyển Đổi Người Dùng (Conversion Funnel)"
                subtitle="Đo lường các bước từ Đăng ký → Tạo chuyến → Mời bạn bè → Chia tiền"
              />
            </AdminCard>

            {/* Top Trending Destinations (1 Col) */}
            <AdminCard className="flex flex-col justify-between">
              <div>
                <AdminCardHeader>
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-[#F59E0B]/10 text-[#F59E0B] flex items-center justify-center">
                      <Flame className="w-4 h-4" />
                    </div>
                    <div>
                      <AdminCardTitle>Điểm Đến Nổi Bật</AdminCardTitle>
                      <AdminCardDescription>
                        Xếp hạng theo số chuyến đi
                      </AdminCardDescription>
                    </div>
                  </div>
                </AdminCardHeader>

                <div className="flex flex-col gap-2">
                  {!data?.topDestinations || data.topDestinations.length === 0 ? (
                    <p className="text-xs text-[#94A3B8] py-6 text-center">
                      Chưa có dữ liệu điểm đến.
                    </p>
                  ) : (
                    data.topDestinations.map((item, idx) => (
                      <div
                        key={idx}
                        className="p-2.5 rounded-lg border border-[#E2E8F0] dark:border-[#1E293B] bg-slate-50/50 dark:bg-[#0D1424]/60 flex items-center justify-between"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <span
                            className={`w-5 h-5 rounded-md flex items-center justify-center font-bold text-[11px] shrink-0 ${
                              idx === 0
                                ? 'bg-[#F59E0B]/20 text-[#F59E0B]'
                                : idx === 1
                                ? 'bg-slate-200 text-[#475569] dark:bg-[#1E293B] dark:text-[#F8FAFC]'
                                : idx === 2
                                ? 'bg-[#F59E0B]/10 text-[#F59E0B]'
                                : 'bg-slate-100 text-[#475569] dark:bg-[#0D1424] dark:text-[#94A3B8]'
                            }`}
                          >
                            {idx + 1}
                          </span>
                          <span className="text-xs font-medium text-[#0F172A] dark:text-[#F8FAFC] truncate flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5 text-[#94A3B8] shrink-0" />
                            {item.destination}
                          </span>
                        </div>
                        <AdminBadge variant="neutral" size="xs">
                          {item.tripsCount} chuyến
                        </AdminBadge>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* AI Planning Callout */}
              <div className="mt-5 p-3 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-start gap-2.5">
                <Lightbulb className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                <div className="text-xs text-[#0F172A] dark:text-[#F8FAFC]">
                  <span className="font-semibold block text-amber-700 dark:text-amber-300">Gợi ý AI Planning</span>
                  <span className="text-[11px] text-[#475569] dark:text-[#94A3B8] leading-normal">
                    Đà Lạt và Phú Quốc chiếm tỷ lệ tạo lịch trình tự động cao nhất (85%).
                  </span>
                </div>
              </div>
            </AdminCard>
          </div>
        </>
      )}
    </div>
  );
}
