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
} from 'lucide-react';
import ErrorState from '@/components/ErrorState';

interface StatsData {
  totalUsers: number;
  totalTrips: number;
  totalExpenses: number;
  totalMoments: number;
  totalReservations: number;
  activeUsers: number;
  recentActivities: Array<{
    id: string;
    type: string;
    description: string;
    createdAt: string;
    user: { id: string; name: string; avatarUrl: string | null };
    trip: { id: string; name: string };
  }>;
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<StatsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = async () => {
    setLoading(true);
    setError(null);
    const res = await getStatsAction();
    if (res.success && res.data) {
      setStats(res.data);
    } else {
      setError(res.error || 'Không thể lấy dữ liệu thống kê');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const cardItems = stats ? [
    { title: 'Tổng số thành viên', value: stats.totalUsers, icon: Users, color: 'bg-[#FF9FCE] text-black' },
    { title: 'Chuyến đi hoạt động', value: stats.totalTrips, icon: Compass, color: 'bg-primary text-white' },
    { title: 'Thành viên online', value: stats.activeUsers, icon: Sparkles, color: 'bg-[#FFD043] text-black' },
    { title: 'Tổng số hoá đơn', value: stats.totalExpenses, icon: DollarSign, color: 'bg-[#C5B4FA] text-black' },
    { title: 'Khoảnh khắc moments', value: stats.totalMoments, icon: Camera, color: 'bg-[#18A058] text-white' },
    { title: 'Phiếu đặt chỗ (AI)', value: stats.totalReservations, icon: CalendarDays, color: 'bg-[#A2D2FF] text-black' },
  ] : [];

  return (
    <div className="flex flex-col gap-8">
      {/* Title Header */}
      <div className="flex justify-between items-center gap-4">
        <div>
          <h1 className="text-2xl font-black uppercase text-black dark:text-white tracking-tight">Tổng quan Hệ thống</h1>
          <p className="text-[10px] font-black uppercase text-muted-foreground mt-1">Dữ liệu thời gian thực đồng bộ từ mobile app.</p>
        </div>
        <button
          onClick={fetchStats}
          disabled={loading}
          className="p-2.5 rounded-xl bg-white border-2 border-black hover:bg-secondary text-black shadow-[2px_2px_0px_0px_#000000] hover:translate-y-[-1px] active:translate-y-[1px] transition-all cursor-pointer flex items-center justify-center disabled:opacity-50"
          aria-label="Tải lại dữ liệu thống kê"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {error && !stats && !loading ? (
        <ErrorState message={error} onRetry={fetchStats} />
      ) : loading && !stats ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="h-28 rounded-3xl bg-white border-2 border-black animate-pulse p-6 shadow-[2px_2px_0px_0px_#000000]"></div>
          ))}
        </div>
      ) : (
        <>
          {/* Metrics Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {cardItems.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div key={idx} className={`p-6 rounded-[28px] border-[3px] border-black shadow-[4px_4px_0px_0px_#000000] flex items-center justify-between ${item.color}`}>
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] font-black uppercase tracking-wider opacity-85">{item.title}</span>
                    <span className="text-3xl font-black">{item.value}</span>
                  </div>
                  <div className="w-11 h-11 rounded-xl bg-white border-2 border-black flex items-center justify-center text-black shadow-[2px_2px_0px_0px_#000000] shrink-0">
                    <Icon className="w-5 h-5 shrink-0" />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Activity Stream */}
          <div className="p-6 rounded-[32px] bg-white border-[3px] border-black dark:bg-[#252322] dark:border-white shadow-[4px_4px_0px_0px_#000000] dark:shadow-[4px_4px_0px_0px_#ffffff] text-black dark:text-white">
            <div className="flex items-center gap-3 mb-6 border-b border-black dark:border-white pb-3">
              <div className="w-9 h-9 rounded-xl bg-primary/10 border-2 border-primary text-primary flex items-center justify-center shadow-[1px_1px_0px_0px_#000000]">
                <Activity className="w-5 h-5" />
              </div>
              <h2 className="text-sm font-black uppercase">Nhật ký Hoạt động</h2>
            </div>

            {stats?.recentActivities.length === 0 ? (
              <p className="text-xs text-muted-foreground text-center py-6 font-bold uppercase">Chưa có hoạt động nào.</p>
            ) : (
              <div className="flex flex-col gap-4 relative border-l-2 border-black dark:border-white pl-6 ml-4">
                {stats?.recentActivities.map((act) => (
                  <div key={act.id} className="relative">
                    {/* Circle marker */}
                    <div className="absolute -left-[31px] top-1.5 w-3.5 h-3.5 rounded-full border-2 border-black bg-white dark:border-white dark:bg-[#1C1A19] flex items-center justify-center">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
                    </div>
                    
                    <div className="flex flex-col gap-1">
                      <p className="text-xs font-bold leading-normal">
                        <b className="font-black text-primary uppercase mr-1">{act.user?.name || 'Thành viên'}</b> 
                        {act.description} trong chuyến đi <b className="font-black text-black dark:text-white">{act.trip?.name || 'Chuyến đi'}</b>
                      </p>
                      <span className="text-[10px] text-muted-foreground font-semibold">
                        {new Date(act.createdAt).toLocaleString('vi-VN')}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
