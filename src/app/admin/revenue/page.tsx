'use client';

import { useEffect, useState } from 'react';
import { getRevenueAnalyticsAction } from '@/app/actions';
import {
  DollarSign,
  Wallet,
  CreditCard,
  RefreshCw,
  PieChart,
  Activity,
  Download,
  Clock,
  Users,
  Info,
} from 'lucide-react';
import ErrorState from '@/components/ErrorState';
import { exportToCSV } from '@/lib/exportCsv';

interface PlanBreakdownItem {
  count: number;
  monthlyPrice: number;
  revenue: number;
}

interface RevenueData {
  mrr: number;
  activeSubscriptionsCount: number;
  totalSubscriptionsCount: number;
  activePlusCount: number;
  activeSquadCount: number;
  expiringSoonCount: number;
  cancelingCount: number;
  activeByPlan?: {
    PLUS?: PlanBreakdownItem;
    SQUAD?: PlanBreakdownItem;
  };
  subscriptionProviderBreakdown?: Record<string, number>;
  tripSplitVolume: number;
  tripSplitTransactionsCount: number;
  tripSplitStatusBreakdown?: Record<string, number>;
  tripSplitMethodBreakdown?: Record<string, number>;
  totalVolume: number;
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
      { 'Chỉ số': 'Doanh thu hàng tháng (MRR gói)', 'Giá trị': data.mrr },
      { 'Chỉ số': 'Số gói đang Active', 'Giá trị': data.activeSubscriptionsCount },
      { 'Chỉ số': 'Số gói PLUS Active', 'Giá trị': data.activePlusCount },
      { 'Chỉ số': 'Số gói SQUAD Active', 'Giá trị': data.activeSquadCount },
      { 'Chỉ số': 'Gói sắp hết hạn (7 ngày)', 'Giá trị': data.expiringSoonCount },
      { 'Chỉ số': 'Gói đã yêu cầu huỷ cuối kỳ', 'Giá trị': data.cancelingCount },
      { 'Chỉ số': 'Tổng số gói từng đăng ký', 'Giá trị': data.totalSubscriptionsCount },
      { 'Chỉ số': 'Thể tích chia tiền P2P trong chuyến', 'Giá trị': data.tripSplitVolume || data.totalVolume },
      { 'Chỉ số': 'Số giao dịch chia tiền chuyến', 'Giá trị': data.tripSplitTransactionsCount || data.totalTransactions },
      { 'Chỉ số': 'Số ví người dùng', 'Giá trị': data.walletCount },
    ];
    exportToCSV('tripmate_revenue_analytics', exportRows);
  };

  const plusRevenue = (data?.activePlusCount || 0) * 39000;
  const squadRevenue = (data?.activeSquadCount || 0) * 99000;

  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black uppercase text-black dark:text-white tracking-tight">
            Doanh Thu & Tài Chính
          </h1>
          <p className="text-[10px] font-black uppercase text-muted-foreground mt-1">
            Số liệu doanh thu thực tế từ gói PLUS/SQUAD và dòng tiền chia hoá đơn giữa các thành viên.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleExportCSV}
            disabled={!data}
            className="px-4 py-2.5 bg-white dark:bg-[#252322] border-2 border-black dark:border-white hover:bg-secondary text-black dark:text-white text-xs font-black uppercase rounded-xl shadow-[2px_2px_0px_0px_#000000] dark:shadow-[2px_2px_0px_0px_#ffffff] hover:translate-y-[-1px] transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
          >
            <Download className="w-4 h-4 text-primary" />
            Xuất CSV
          </button>
          <button
            onClick={fetchRevenue}
            disabled={loading}
            className="p-2.5 rounded-xl bg-white dark:bg-[#252322] border-2 border-black dark:border-white hover:bg-secondary text-black dark:text-white shadow-[2px_2px_0px_0px_#000000] dark:shadow-[2px_2px_0px_0px_#ffffff] hover:translate-y-[-1px] active:translate-y-[1px] transition-all cursor-pointer flex items-center justify-center disabled:opacity-50"
            aria-label="Tải lại dữ liệu doanh thu"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {error && !data && !loading ? (
        <ErrorState message={error} onRetry={fetchRevenue} />
      ) : loading && !data ? (
        <div className="h-64 rounded-3xl bg-white dark:bg-[#252322] border-2 border-black dark:border-white animate-pulse p-6 shadow-[2px_2px_0px_0px_#000000] dark:shadow-[2px_2px_0px_0px_#ffffff]"></div>
      ) : (
        <>
          {/* Top Key Metrics Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Real MRR */}
            <div className="p-6 rounded-[28px] border-[3px] border-black bg-[#FFD043] text-black shadow-[4px_4px_0px_0px_#000000] flex items-center justify-between">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider opacity-85">
                  Doanh Thu Tháng (MRR Gói)
                </span>
                <h3 className="text-xl font-black mt-1">{formatVND(data?.mrr ?? 0)}</h3>
                <p className="text-[9px] font-bold text-black/70 mt-0.5">Định kỳ từ gói đang Active</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-white border-2 border-black flex items-center justify-center text-black shadow-[2px_2px_0px_0px_#000000]">
                <Activity className="w-5 h-5" />
              </div>
            </div>

            {/* Active Subscriptions */}
            <div className="p-6 rounded-[28px] border-[3px] border-black bg-[#C5B4FA] text-black shadow-[4px_4px_0px_0px_#000000] flex items-center justify-between">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider opacity-85">
                  Gói Đang Hoạt Động
                </span>
                <h3 className="text-2xl font-black mt-1">{data?.activeSubscriptionsCount ?? 0}</h3>
                <p className="text-[9px] font-bold text-black/70 mt-0.5">
                  {data?.activePlusCount ?? 0} PLUS · {data?.activeSquadCount ?? 0} SQUAD
                </p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-white border-2 border-black flex items-center justify-center text-black shadow-[2px_2px_0px_0px_#000000]">
                <CreditCard className="w-5 h-5" />
              </div>
            </div>

            {/* Expiring Soon / Churn Risk */}
            <div className="p-6 rounded-[28px] border-[3px] border-black bg-[#FF9FCE] text-black shadow-[4px_4px_0px_0px_#000000] flex items-center justify-between">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider opacity-85">
                  Hết Hạn Trong 7 Ngày
                </span>
                <h3 className="text-2xl font-black mt-1">{data?.expiringSoonCount ?? 0}</h3>
                <p className="text-[9px] font-bold text-black/70 mt-0.5">
                  {data?.cancelingCount ?? 0} gói chờ huỷ cuối kỳ
                </p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-white border-2 border-black flex items-center justify-center text-black shadow-[2px_2px_0px_0px_#000000]">
                <Clock className="w-5 h-5" />
              </div>
            </div>

            {/* P2P Trip Split Volume */}
            <div className="p-6 rounded-[28px] border-[3px] border-black bg-[#A2D2FF] text-black shadow-[4px_4px_0px_0px_#000000] flex items-center justify-between">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider opacity-85">
                  Chia Tiền Chuyến (P2P)
                </span>
                <h3 className="text-xl font-black mt-1">
                  {formatVND(data?.tripSplitVolume ?? data?.totalVolume ?? 0)}
                </h3>
                <p className="text-[9px] font-bold text-black/70 mt-0.5">Tiền chia giữa thành viên</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-white border-2 border-black flex items-center justify-center text-black shadow-[2px_2px_0px_0px_#000000]">
                <DollarSign className="w-5 h-5" />
              </div>
            </div>
          </div>

          {/* Section 1: Platform Subscriptions Breakdown */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-black uppercase text-black dark:text-white tracking-wider flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-primary" />
                Doanh Thu Gói Đăng Ký (Platform Subscriptions)
              </h2>
              <span className="text-[9px] bg-primary text-white font-black px-2 py-0.5 rounded-full uppercase">
                Nguồn Doanh Thu
              </span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* PLUS Plan Card */}
              <div className="p-6 rounded-[32px] bg-white border-[3px] border-black dark:bg-[#252322] dark:border-white shadow-[4px_4px_0px_0px_#000000] dark:shadow-[4px_4px_0px_0px_#ffffff] flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-center mb-3">
                    <span className="px-2.5 py-1 rounded-full bg-[#18A058]/15 border border-[#18A058] text-[#18A058] text-[10px] font-black uppercase">
                      Gói Cá Nhân (PLUS)
                    </span>
                    <span className="text-xs font-black text-black dark:text-white">39.000đ / tháng</span>
                  </div>
                  <h3 className="text-2xl font-black text-black dark:text-white">
                    {data?.activePlusCount ?? 0}{' '}
                    <span className="text-xs font-bold text-muted-foreground uppercase">gói đang chạy</span>
                  </h3>
                  <p className="text-xs font-bold text-black dark:text-white/80 mt-2">
                    Doanh thu ước tính: <span className="font-black text-primary">{formatVND(plusRevenue)}</span>/tháng
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-black/10 dark:border-white/10 text-[10px] font-bold text-muted-foreground">
                  Gói cá nhân 1 ghế. Mở rộng số chuyến đi và hạn mức AI.
                </div>
              </div>

              {/* SQUAD Plan Card */}
              <div className="p-6 rounded-[32px] bg-white border-[3px] border-black dark:bg-[#252322] dark:border-white shadow-[4px_4px_0px_0px_#000000] dark:shadow-[4px_4px_0px_0px_#ffffff] flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-center mb-3">
                    <span className="px-2.5 py-1 rounded-full bg-[#FFD043]/40 border border-black text-black text-[10px] font-black uppercase">
                      Gói Nhóm (SQUAD PASS)
                    </span>
                    <span className="text-xs font-black text-black dark:text-white">99.000đ / tháng</span>
                  </div>
                  <h3 className="text-2xl font-black text-black dark:text-white">
                    {data?.activeSquadCount ?? 0}{' '}
                    <span className="text-xs font-bold text-muted-foreground uppercase">gói đang chạy</span>
                  </h3>
                  <p className="text-xs font-bold text-black dark:text-white/80 mt-2">
                    Doanh thu ước tính: <span className="font-black text-primary">{formatVND(squadRevenue)}</span>/tháng
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-black/10 dark:border-white/10 text-[10px] font-bold text-muted-foreground">
                  Bao gồm 5 ghế Squad Pass chia sẻ cho các thành viên trong nhóm.
                </div>
              </div>

              {/* Subscription Payment Providers */}
              <div className="p-6 rounded-[32px] bg-white border-[3px] border-black dark:bg-[#252322] dark:border-white shadow-[4px_4px_0px_0px_#000000] dark:shadow-[4px_4px_0px_0px_#ffffff]">
                <div className="flex items-center gap-3 border-b border-black dark:border-white pb-3 mb-4">
                  <div className="w-8 h-8 rounded-lg bg-secondary border-2 border-black text-black flex items-center justify-center">
                    <PieChart className="w-4 h-4" />
                  </div>
                  <h3 className="text-xs font-black uppercase text-black dark:text-white">Cổng Thanh Toán Gói</h3>
                </div>

                {Object.keys(data?.subscriptionProviderBreakdown || {}).length === 0 ? (
                  <p className="text-xs text-muted-foreground py-6 text-center font-bold uppercase">
                    Chưa có dữ liệu cổng thanh toán gói.
                  </p>
                ) : (
                  <div className="flex flex-col gap-2.5">
                    {Object.entries(data?.subscriptionProviderBreakdown || {}).map(([provider, count]) => (
                      <div
                        key={provider}
                        className="flex justify-between items-center p-2.5 rounded-xl border border-black dark:border-white bg-[#FEFADC] dark:bg-[#1C1A19]"
                      >
                        <span className="text-xs font-black uppercase text-black dark:text-white">{provider}</span>
                        <span className="text-xs font-black bg-[#FFD043] text-black px-2 py-0.5 rounded-full border border-black">
                          {count} gói
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Section 2: Peer-to-Peer Trip Expense Split (Clearly Demarcated) */}
          <div className="flex flex-col gap-4 mt-2">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-black uppercase text-black dark:text-white tracking-wider flex items-center gap-2">
                  <Users className="w-4 h-4 text-[#A2D2FF]" />
                  Giao Dịch Chia Tiền Trong Chuyến (Peer-to-Peer Split)
                </h2>
                <span className="text-[9px] bg-secondary text-black font-black px-2 py-0.5 rounded-full uppercase border border-black">
                  Không phải doanh thu
                </span>
              </div>
            </div>

            {/* Note callout */}
            <div className="p-4 rounded-2xl bg-white dark:bg-[#252322] border-2 border-black dark:border-white flex items-start gap-3 shadow-[2px_2px_0px_0px_#000000] dark:shadow-[2px_2px_0px_0px_#ffffff]">
              <Info className="w-5 h-5 text-primary shrink-0 mt-0.5" />
              <p className="text-xs font-bold text-black/80 dark:text-white/80 leading-relaxed">
                Số liệu dưới đây phản ánh tổng lượng tiền mà các thành viên chuyển cho nhau để thanh toán các hoá đơn ăn uống,
                khách sạn, vé tham quan trong chuyến đi. Đây là dòng tiền trung chuyển nội bộ giữa người dùng (P2P), không phải
                khoản thu của TripMate.
              </p>
            </div>

            {/* Breakdown Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Status Breakdown */}
              <div className="p-6 rounded-[32px] bg-white border-[3px] border-black dark:bg-[#252322] dark:border-white shadow-[4px_4px_0px_0px_#000000] dark:shadow-[4px_4px_0px_0px_#ffffff]">
                <div className="flex items-center gap-3 border-b border-black dark:border-white pb-3 mb-4">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 border-2 border-primary text-primary flex items-center justify-center">
                    <PieChart className="w-4 h-4" />
                  </div>
                  <h3 className="text-xs font-black uppercase text-black dark:text-white">Trạng Thái Chia Tiền Chuyến</h3>
                </div>

                {Object.keys(data?.tripSplitStatusBreakdown || data?.statusBreakdown || {}).length === 0 ? (
                  <p className="text-xs text-muted-foreground py-6 text-center font-bold uppercase">
                    Chưa có dữ liệu trạng thái giao dịch chia tiền.
                  </p>
                ) : (
                  <div className="flex flex-col gap-3">
                    {Object.entries(data?.tripSplitStatusBreakdown || data?.statusBreakdown || {}).map(([status, count]) => (
                      <div
                        key={status}
                        className="flex justify-between items-center p-3 rounded-xl border border-black dark:border-white bg-[#FEFADC] dark:bg-[#1C1A19]"
                      >
                        <span className="text-xs font-black uppercase text-black dark:text-white">{status}</span>
                        <span className="text-xs font-black bg-primary text-white px-2 py-0.5 rounded-full border border-black">
                          {count}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Method Breakdown */}
              <div className="p-6 rounded-[32px] bg-white border-[3px] border-black dark:bg-[#252322] dark:border-white shadow-[4px_4px_0px_0px_#000000] dark:shadow-[4px_4px_0px_0px_#ffffff]">
                <div className="flex items-center gap-3 border-b border-black dark:border-white pb-3 mb-4">
                  <div className="w-8 h-8 rounded-lg bg-secondary border-2 border-black text-black flex items-center justify-center">
                    <Wallet className="w-4 h-4" />
                  </div>
                  <div className="flex justify-between items-center flex-1">
                    <h3 className="text-xs font-black uppercase text-black dark:text-white">Phương Thức Thanh Toán P2P</h3>
                    <span className="text-[10px] font-bold text-muted-foreground">
                      Tổng ví: {data?.walletCount ?? 0}
                    </span>
                  </div>
                </div>

                {Object.keys(data?.tripSplitMethodBreakdown || data?.methodBreakdown || {}).length === 0 ? (
                  <p className="text-xs text-muted-foreground py-6 text-center font-bold uppercase">
                    Chưa có dữ liệu phương thức thanh toán.
                  </p>
                ) : (
                  <div className="flex flex-col gap-3">
                    {Object.entries(data?.tripSplitMethodBreakdown || data?.methodBreakdown || {}).map(([method, count]) => (
                      <div
                        key={method}
                        className="flex justify-between items-center p-3 rounded-xl border border-black dark:border-white bg-[#FEFADC] dark:bg-[#1C1A19]"
                      >
                        <span className="text-xs font-black uppercase text-black dark:text-white">{method}</span>
                        <span className="text-xs font-black bg-secondary text-black px-2 py-0.5 rounded-full border border-black">
                          {count}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
