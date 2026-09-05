'use client';

import { useEffect, useState } from 'react';
import { getRevenueAnalyticsAction } from '@/app/actions';
import { DollarSign, Wallet, CreditCard, RefreshCw, PieChart, Activity, Download } from 'lucide-react';
import ErrorState from '@/components/ErrorState';
import { exportToCSV } from '@/lib/exportCsv';

interface RevenueData {
  totalVolume: number;
  mrr: number;
  totalTransactions: number;
  walletCount: number;
  statusBreakdown: Record<string, number>;
  methodBreakdown: Record<string, number>;
}

export default function AdminRevenuePage() {
  const [data, setData] = useState<RevenueData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRevenue = async () => {
    setLoading(true);
    setError(null);
    const res = await getRevenueAnalyticsAction();
    if (res.success && res.data) {
      setData(res.data);
    } else {
      setError(res.error || 'Không thể lấy dữ liệu doanh thu');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchRevenue();
  }, []);

  const formatVND = (val: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val);
  };

  const handleExportCSV = () => {
    if (!data) return;
    const exportRows = [
      { Metric: 'Total Volume', Value: data.totalVolume },
      { Metric: 'MRR', Value: data.mrr },
      { Metric: 'Total Transactions', Value: data.totalTransactions },
      { Metric: 'Wallet Count', Value: data.walletCount },
    ];
    exportToCSV('tripmate_revenue', exportRows);
  };

  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <div className="flex justify-between items-center gap-4">
        <div>
          <h1 className="text-2xl font-black uppercase text-black dark:text-white tracking-tight">
            Doanh Thu & Quản Lý Ví
          </h1>
          <p className="text-[10px] font-black uppercase text-muted-foreground mt-1">
            Tổng hợp luồng tiền giao dịch, MRR ước tính và liên kết ví Momo/ZaloPay/Thẻ.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleExportCSV}
            disabled={!data}
            className="px-4 py-2.5 bg-white border-2 border-black hover:bg-secondary text-black text-xs font-black uppercase rounded-xl shadow-[2px_2px_0px_0px_#000000] hover:translate-y-[-1px] transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
          >
            <Download className="w-4 h-4 text-primary" />
            Xuất CSV
          </button>
          <button
            onClick={fetchRevenue}
            disabled={loading}
            className="p-2.5 rounded-xl bg-white border-2 border-black hover:bg-secondary text-black shadow-[2px_2px_0px_0px_#000000] hover:translate-y-[-1px] active:translate-y-[1px] transition-all cursor-pointer flex items-center justify-center disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {error && !data && !loading ? (
        <ErrorState message={error} onRetry={fetchRevenue} />
      ) : loading && !data ? (
        <div className="h-64 rounded-3xl bg-white border-2 border-black animate-pulse p-6 shadow-[2px_2px_0px_0px_#000000]"></div>
      ) : (
        <>
          {/* Top Metrics Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 rounded-[28px] border-[3px] border-black bg-[#C5B4FA] text-black shadow-[4px_4px_0px_0px_#000000] flex items-center justify-between">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider opacity-85">
                  Tổng Volume Giao Dịch
                </span>
                <h3 className="text-xl font-black mt-1">{formatVND(data?.totalVolume ?? 0)}</h3>
              </div>
              <div className="w-10 h-10 rounded-xl bg-white border-2 border-black flex items-center justify-center text-black shadow-[2px_2px_0px_0px_#000000]">
                <DollarSign className="w-5 h-5" />
              </div>
            </div>

            <div className="p-6 rounded-[28px] border-[3px] border-black bg-[#FFD043] text-black shadow-[4px_4px_0px_0px_#000000] flex items-center justify-between">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider opacity-85">
                  Doanh Thu Hàng Tháng (MRR)
                </span>
                <h3 className="text-xl font-black mt-1">{formatVND(data?.mrr ?? 0)}</h3>
              </div>
              <div className="w-10 h-10 rounded-xl bg-white border-2 border-black flex items-center justify-center text-black shadow-[2px_2px_0px_0px_#000000]">
                <Activity className="w-5 h-5" />
              </div>
            </div>

            <div className="p-6 rounded-[28px] border-[3px] border-black bg-[#18A058] text-white shadow-[4px_4px_0px_0px_#000000] flex items-center justify-between">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider opacity-85">
                  Tổng Số Giao Dịch
                </span>
                <h3 className="text-2xl font-black mt-1">{data?.totalTransactions ?? 0}</h3>
              </div>
              <div className="w-10 h-10 rounded-xl bg-white border-2 border-black flex items-center justify-center text-black shadow-[2px_2px_0px_0px_#000000]">
                <CreditCard className="w-5 h-5" />
              </div>
            </div>

            <div className="p-6 rounded-[28px] border-[3px] border-black bg-[#A2D2FF] text-black shadow-[4px_4px_0px_0px_#000000] flex items-center justify-between">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider opacity-85">
                  Số Ví Người Dùng
                </span>
                <h3 className="text-2xl font-black mt-1">{data?.walletCount ?? 0}</h3>
              </div>
              <div className="w-10 h-10 rounded-xl bg-white border-2 border-black flex items-center justify-center text-black shadow-[2px_2px_0px_0px_#000000]">
                <Wallet className="w-5 h-5" />
              </div>
            </div>
          </div>

          {/* Breakdown Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Status Breakdown */}
            <div className="p-6 rounded-[32px] bg-white border-[3px] border-black dark:bg-[#252322] dark:border-white shadow-[4px_4px_0px_0px_#000000] dark:shadow-[4px_4px_0px_0px_#ffffff]">
              <div className="flex items-center gap-3 border-b border-black dark:border-white pb-3 mb-4">
                <div className="w-8 h-8 rounded-lg bg-primary/10 border-2 border-primary text-primary flex items-center justify-center">
                  <PieChart className="w-4 h-4" />
                </div>
                <h2 className="text-xs font-black uppercase">Phân Loại Trạng Thái Giao Dịch</h2>
              </div>

              {Object.keys(data?.statusBreakdown || {}).length === 0 ? (
                <p className="text-xs text-muted-foreground py-6 text-center font-bold uppercase">
                  Chưa có dữ liệu trạng thái giao dịch.
                </p>
              ) : (
                <div className="flex flex-col gap-3">
                  {Object.entries(data?.statusBreakdown || {}).map(([status, count]) => (
                    <div key={status} className="flex justify-between items-center p-3 rounded-xl border border-black bg-[#FEFADC] dark:bg-[#1C1A19]">
                      <span className="text-xs font-black uppercase">{status}</span>
                      <span className="text-xs font-black bg-primary text-white px-2 py-0.5 rounded-full border border-black">{count}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Method Breakdown */}
            <div className="p-6 rounded-[32px] bg-white border-[3px] border-black dark:bg-[#252322] dark:border-white shadow-[4px_4px_0px_0px_#000000] dark:shadow-[4px_4px_0px_0px_#ffffff]">
              <div className="flex items-center gap-3 border-b border-black dark:border-white pb-3 mb-4">
                <div className="w-8 h-8 rounded-lg bg-secondary border-2 border-black text-black flex items-center justify-center">
                  <CreditCard className="w-4 h-4" />
                </div>
                <h2 className="text-xs font-black uppercase">Phương Thức Thanh Toán Sử Dụng</h2>
              </div>

              {Object.keys(data?.methodBreakdown || {}).length === 0 ? (
                <p className="text-xs text-muted-foreground py-6 text-center font-bold uppercase">
                  Chưa có dữ liệu phương thức thanh toán.
                </p>
              ) : (
                <div className="flex flex-col gap-3">
                  {Object.entries(data?.methodBreakdown || {}).map(([method, count]) => (
                    <div key={method} className="flex justify-between items-center p-3 rounded-xl border border-black bg-[#FEFADC] dark:bg-[#1C1A19]">
                      <span className="text-xs font-black uppercase">{method}</span>
                      <span className="text-xs font-black bg-secondary text-black px-2 py-0.5 rounded-full border border-black">{count}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
