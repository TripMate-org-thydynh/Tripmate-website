'use client';

import { useEffect, useState } from 'react';
import { getGrowthAnalyticsAction } from '@/app/actions';
import { TrendingUp, Users, Compass, RefreshCw, Calendar } from 'lucide-react';
import ErrorState from '@/components/ErrorState';
import EmptyState from '@/components/EmptyState';

interface DailyGrowthItem {
  date: string;
  users: number;
  trips: number;
}

interface GrowthData {
  dailyGrowth: DailyGrowthItem[];
  totalUsersLast30Days: number;
  totalTripsLast30Days: number;
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
      setData(res.data);
    } else {
      setError(res.error || 'Không thể lấy dữ liệu tăng trưởng');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchGrowth();
  }, []);

  const maxVal = data?.dailyGrowth
    ? Math.max(...data.dailyGrowth.map((d) => Math.max(d.users, d.trips)), 5)
    : 10;

  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <div className="flex justify-between items-center gap-4">
        <div>
          <h1 className="text-2xl font-black uppercase text-black dark:text-white tracking-tight">
            Tăng Trưởng Người Dùng & Chuyến Đi
          </h1>
          <p className="text-[10px] font-black uppercase text-muted-foreground mt-1">
            Phân tích số lượng đăng ký mới và chuyến đi khởi tạo trong 30 ngày qua.
          </p>
        </div>
        <button
          onClick={fetchGrowth}
          disabled={loading}
          className="p-2.5 rounded-xl bg-white border-2 border-black hover:bg-secondary text-black shadow-[2px_2px_0px_0px_#000000] hover:translate-y-[-1px] active:translate-y-[1px] transition-all cursor-pointer flex items-center justify-center disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {error && !data && !loading ? (
        <ErrorState message={error} onRetry={fetchGrowth} />
      ) : loading && !data ? (
        <div className="h-64 rounded-3xl bg-white border-2 border-black animate-pulse p-6 shadow-[2px_2px_0px_0px_#000000]"></div>
      ) : (
        <>
          {/* KPI Highlight Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="p-6 rounded-[28px] border-[3px] border-black bg-[#FF9FCE] text-black shadow-[4px_4px_0px_0px_#000000] flex items-center justify-between">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider opacity-85">
                  User mới (30 ngày)
                </span>
                <h3 className="text-3xl font-black mt-1">+{data?.totalUsersLast30Days ?? 0}</h3>
              </div>
              <div className="w-12 h-12 rounded-xl bg-white border-2 border-black flex items-center justify-center text-black shadow-[2px_2px_0px_0px_#000000]">
                <Users className="w-6 h-6" />
              </div>
            </div>

            <div className="p-6 rounded-[28px] border-[3px] border-black bg-[#FFD043] text-black shadow-[4px_4px_0px_0px_#000000] flex items-center justify-between">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider opacity-85">
                  Chuyến đi mới (30 ngày)
                </span>
                <h3 className="text-3xl font-black mt-1">+{data?.totalTripsLast30Days ?? 0}</h3>
              </div>
              <div className="w-12 h-12 rounded-xl bg-white border-2 border-black flex items-center justify-center text-black shadow-[2px_2px_0px_0px_#000000]">
                <Compass className="w-6 h-6" />
              </div>
            </div>

            <div className="p-6 rounded-[28px] border-[3px] border-black bg-[#C5B4FA] text-black shadow-[4px_4px_0px_0px_#000000] flex items-center justify-between">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider opacity-85">
                  Tỷ lệ chuyến / User
                </span>
                <h3 className="text-3xl font-black mt-1">
                  {data?.totalUsersLast30Days && data.totalUsersLast30Days > 0
                    ? (data.totalTripsLast30Days / data.totalUsersLast30Days).toFixed(2)
                    : '0.0'}
                </h3>
              </div>
              <div className="w-12 h-12 rounded-xl bg-white border-2 border-black flex items-center justify-center text-black shadow-[2px_2px_0px_0px_#000000]">
                <TrendingUp className="w-6 h-6" />
              </div>
            </div>
          </div>

          {/* Real Bar Chart */}
          <div className="p-6 rounded-[32px] bg-white border-[3px] border-black dark:bg-[#252322] dark:border-white shadow-[4px_4px_0px_0px_#000000] dark:shadow-[4px_4px_0px_0px_#ffffff]">
            <div className="flex items-center justify-between border-b border-black dark:border-white pb-4 mb-6">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-primary/10 border-2 border-primary text-primary flex items-center justify-center shadow-[1px_1px_0px_0px_#000000]">
                  <Calendar className="w-5 h-5" />
                </div>
                <h2 className="text-sm font-black uppercase">Biểu Đồ Tăng Trưởng 30 Ngày Gần Nhất</h2>
              </div>
              <div className="flex items-center gap-4 text-xs font-bold">
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded bg-primary border border-black"></div>
                  <span>User mới</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded bg-secondary border border-black"></div>
                  <span>Chuyến đi mới</span>
                </div>
              </div>
            </div>

            <div className="h-64 flex items-end gap-1.5 pt-8 overflow-x-auto">
              {(!data?.dailyGrowth || data.dailyGrowth.length === 0) ? (
                <div className="w-full flex items-center justify-center">
                  <EmptyState message="Chưa có dữ liệu tăng trưởng trong 30 ngày qua" />
                </div>
              ) : data?.dailyGrowth.map((item) => {
                const userHeightPercentage = Math.round((item.users / maxVal) * 100);
                const tripHeightPercentage = Math.round((item.trips / maxVal) * 100);

                return (
                  <div key={item.date} className="flex-1 min-w-[24px] flex flex-col items-center gap-1 group relative">
                    {/* Tooltip */}
                    <div className="absolute -top-10 opacity-0 group-hover:opacity-100 transition-opacity bg-black text-white text-[9px] font-black p-1.5 rounded-lg border border-white whitespace-nowrap z-10 pointer-events-none">
                      {item.date}: +{item.users} Users, +{item.trips} Trips
                    </div>

                    <div className="w-full flex items-end justify-center gap-0.5 h-48">
                      <div
                        style={{ height: `${Math.max(userHeightPercentage, 4)}%` }}
                        className="w-1/2 bg-primary border border-black rounded-t-sm transition-all"
                      ></div>
                      <div
                        style={{ height: `${Math.max(tripHeightPercentage, 4)}%` }}
                        className="w-1/2 bg-secondary border border-black rounded-t-sm transition-all"
                      ></div>
                    </div>

                    <span className="text-[8px] font-black text-muted-foreground rotate-[-45deg] origin-top-left mt-2">
                      {item.date.substring(5)}
                    </span>
                  </div>
                );
              })}
            </div>

          </div>
        </>
      )}
    </div>
  );
}
