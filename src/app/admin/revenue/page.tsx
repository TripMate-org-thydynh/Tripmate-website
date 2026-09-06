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
  Info,
  Search,
  Eye,
  Receipt,
  ShieldCheck,
  User,
} from 'lucide-react';
import ErrorState from '@/components/ErrorState';
import { exportToCSV } from '@/lib/exportCsv';
import { AdminCard, AdminCardHeader, AdminCardTitle, AdminCardDescription } from '@/components/admin/AdminCard';
import { AdminButton } from '@/components/admin/AdminButton';
import { AdminBadge } from '@/components/admin/AdminBadge';
import { AdminTabs } from '@/components/admin/AdminTabs';
import { AdminInput } from '@/components/admin/AdminInput';
import { AdminDrawer } from '@/components/admin/AdminDrawer';
import {
  AdminTable,
  AdminTableHeader,
  AdminTableBody,
  AdminTableRow,
  AdminTableHead,
  AdminTableCell,
  AdminTableEmpty,
} from '@/components/admin/AdminTable';
import { AdminDonutChart } from '@/components/admin/charts/AdminDonutChart';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { AdminStatCard } from '@/components/admin/AdminStatCard';

interface PlanBreakdownItem {
  count: number;
  monthlyPrice: number;
  revenue: number;
}

export interface ChargeTransaction {
  id: string;
  type: 'SUBSCRIPTION';
  plan: 'PLUS' | 'SQUAD';
  amount: number;
  currency: string;
  provider: string;
  status: string;
  externalId: string;
  seats: number;
  createdAt: string;
  currentPeriodStart?: string;
  currentPeriodEnd?: string;
  user?: {
    id: string;
    name: string | null;
    email: string;
    username: string | null;
    avatarUrl?: string | null;
  } | null;
}

export interface P2PTransaction {
  id: string;
  type: 'P2P_SPLIT';
  amount: number;
  currency: string;
  provider: string;
  status: string;
  externalId: string;
  note?: string | null;
  createdAt: string;
  sender?: {
    id: string;
    name: string | null;
    email: string;
    username: string | null;
  } | null;
  receiver?: {
    id: string;
    name: string | null;
    email: string;
    username: string | null;
  } | null;
  expense?: {
    id: string;
    title: string;
  } | null;
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
  recentCharges?: ChargeTransaction[];
  recentP2P?: P2PTransaction[];
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

  // Ledger state
  const [ledgerTab, setLedgerTab] = useState<'subs' | 'p2p' | 'all'>('subs');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTxn, setSelectedTxn] = useState<ChargeTransaction | P2PTransaction | null>(null);

  const fetchRevenue = async () => {
    setLoading(true);
    setError(null);
    const res = await getRevenueAnalyticsAction();
    if (res.success && res.data) {
      setData(res.data.data || res.data);
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

  const handleExportLedgerCSV = () => {
    const charges = data?.recentCharges || [];
    const p2p = data?.recentP2P || [];

    const rows: Record<string, any>[] = [];

    if (ledgerTab === 'subs' || ledgerTab === 'all') {
      charges.forEach((c) => {
        rows.push({
          'Loại Giao Dịch': 'Gói Hội Viên',
          'Mã Giao Dịch': c.id,
          'External Ref': c.externalId,
          'Khách Hàng': c.user?.name || 'Thành viên',
          'Email': c.user?.email || 'N/A',
          'Gói': c.plan === 'PLUS' ? 'PLUS Pass' : 'SQUAD Pass',
          'Số Tiền (VNĐ)': c.amount,
          'Cổng Thanh Toán': c.provider,
          'Trạng Thái': c.status,
          'Thời Gian': new Date(c.createdAt).toLocaleString('vi-VN'),
        });
      });
    }

    if (ledgerTab === 'p2p' || ledgerTab === 'all') {
      p2p.forEach((t) => {
        rows.push({
          'Loại Giao Dịch': 'Chia Tiền Chuyến',
          'Mã Giao Dịch': t.id,
          'External Ref': t.externalId,
          'Người Gửi (Trả)': t.sender?.name || t.sender?.email || 'N/A',
          'Người Nhận': t.receiver?.name || t.receiver?.email || 'N/A',
          'Khoản Chi / Ghi Chú': t.expense?.title || t.note || 'Chia sẻ chi tiêu',
          'Số Tiền (VNĐ)': t.amount,
          'Cổng Thanh Toán': t.provider,
          'Trạng Thái': t.status,
          'Thời Gian': new Date(t.createdAt).toLocaleString('vi-VN'),
        });
      });
    }

    exportToCSV(`tripmate_billing_ledger_${ledgerTab}`, rows);
  };

  const plusRevenue = (data?.activePlusCount || 0) * 39000;
  const squadRevenue = (data?.activeSquadCount || 0) * 99000;

  const providerColors: Record<string, string> = {
    MOMO: '#EC4899', // Pink
    ZALOPAY: '#06B6D4', // Cyan
    VNPAY: '#EF4444', // Red
    APPLE_PAY: '#F97316', // Orange
    STRIPE: '#0284C7', // Sky
    BANK_TRANSFER: '#22C55E', // Green
    CASH: '#F59E0B', // Amber
    OTHER: '#64748B', // Slate
  };

  const subProviderChartData = Object.entries(data?.subscriptionProviderBreakdown || {}).map(
    ([provider, count]) => ({
      label: provider === 'OTHER' ? 'Khác' : provider,
      value: count,
      color: providerColors[provider] || '#F59E0B',
    })
  );

  const p2pMethodChartData = Object.entries(data?.tripSplitMethodBreakdown || data?.methodBreakdown || {}).map(
    ([method, count]) => ({
      label: method === 'CASH' ? 'Tiền mặt' : method,
      value: count,
      color: providerColors[method] || '#38BDF8',
    })
  );

  // Filter ledger rows based on search and tab
  const filteredCharges = (data?.recentCharges || []).filter((c) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase().trim();
    return (
      c.id.toLowerCase().includes(q) ||
      (c.externalId && c.externalId.toLowerCase().includes(q)) ||
      c.plan.toLowerCase().includes(q) ||
      c.provider.toLowerCase().includes(q) ||
      (c.user?.name && c.user.name.toLowerCase().includes(q)) ||
      (c.user?.email && c.user.email.toLowerCase().includes(q))
    );
  });

  const filteredP2P = (data?.recentP2P || []).filter((p) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase().trim();
    return (
      p.id.toLowerCase().includes(q) ||
      (p.externalId && p.externalId.toLowerCase().includes(q)) ||
      p.provider.toLowerCase().includes(q) ||
      (p.sender?.name && p.sender.name.toLowerCase().includes(q)) ||
      (p.sender?.email && p.sender.email.toLowerCase().includes(q)) ||
      (p.expense?.title && p.expense.title.toLowerCase().includes(q))
    );
  });

  const ledgerTabs = [
    {
      id: 'subs',
      label: 'Gói Hội Viên Nền Tảng (Charges)',
      count: filteredCharges.length,
      icon: <CreditCard className="w-3.5 h-3.5" />,
    },
    {
      id: 'p2p',
      label: 'Thanh Toán Chia Tiền Chuyến (P2P)',
      count: filteredP2P.length,
      icon: <Wallet className="w-3.5 h-3.5" />,
    },
    {
      id: 'all',
      label: 'Tất Cả Giao Dịch',
      count: filteredCharges.length + filteredP2P.length,
      icon: <Receipt className="w-3.5 h-3.5" />,
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <AdminPageHeader
        title="Doanh Thu & Dòng Tiền (Revenue & Audit)"
        description="Báo cáo doanh thu định kỳ từ gói hội viên, đối soát từng khoản charge tiền người dùng và dòng tiền chia sẻ P2P."
        badgeText="MRR Live"
        badgeVariant="success"
        actions={
          <>
            <AdminButton
              variant="outline"
              size="sm"
              onClick={fetchRevenue}
              loading={loading}
              icon={<RefreshCw className="w-3.5 h-3.5" />}
            >
              Làm mới
            </AdminButton>
            <AdminButton
              variant="secondary"
              size="sm"
              onClick={handleExportCSV}
              disabled={!data}
              icon={<Download className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />}
            >
              Xuất Báo Cáo CSV
            </AdminButton>
          </>
        }
      />

      {error && !data && !loading ? (
        <ErrorState message={error} onRetry={fetchRevenue} />
      ) : loading && !data ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="h-24 rounded-xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-[#1E293B] animate-pulse p-4 shadow-xs"
            />
          ))}
        </div>
      ) : (
        <>
          {/* SECTION 1: PLATFORM SUBSCRIPTION REVENUE (MRR) */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-500" />
              <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider">
                Doanh Thu Nền Tảng (TripMate Subscription Revenue)
              </h2>
            </div>

            {/* Top Metric Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <AdminStatCard
                title="Doanh Thu Hàng Tháng (MRR)"
                value={formatVND(data?.mrr ?? 0)}
                description="Gói PLUS (39k) & SQUAD (99k) đang hoạt động"
                icon={<DollarSign className="w-4 h-4" />}
                variant="success"
              />

              <AdminStatCard
                title="Gói Đang Active"
                value={(data?.activeSubscriptionsCount ?? 0).toLocaleString('vi-VN')}
                description={`Tổng gói từng đăng ký: ${data?.totalSubscriptionsCount ?? 0}`}
                icon={<CreditCard className="w-4 h-4" />}
                variant="brand"
              />

              <AdminStatCard
                title="Sắp Hết Hạn (7 ngày tới)"
                value={(data?.expiringSoonCount ?? 0).toLocaleString('vi-VN')}
                description="Gói cần gửi email nhắc thanh toán"
                icon={<Clock className="w-4 h-4" />}
                badgeText={(data?.expiringSoonCount ?? 0) > 0 ? "Cần gia hạn" : undefined}
                variant="warning"
              />

              <AdminStatCard
                title="Đã Yêu Cầu Huỷ Cuối Kỳ"
                value={(data?.cancelingCount ?? 0).toLocaleString('vi-VN')}
                description="Người dùng huỷ tự động gia hạn"
                icon={<Activity className="w-4 h-4" />}
                badgeText={(data?.cancelingCount ?? 0) > 0 ? "Churn Risk" : undefined}
                variant="danger"
              />
            </div>

            {/* Plan Performance & Gateway Donut */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Plan Comparison Cards */}
              <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* PLUS PASS */}
                <AdminCard className="p-4 flex flex-col justify-between border-l-4 border-l-amber-500">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <AdminBadge variant="brand" size="sm">PLUS PASS</AdminBadge>
                      <span className="text-xs font-semibold text-slate-500">39.000 đ/tháng</span>
                    </div>
                    <div className="mt-3">
                      <span className="text-[11px] text-slate-400 block">Số người đăng ký Active</span>
                      <span className="text-xl font-bold text-slate-900 dark:text-slate-100">
                        {(data?.activePlusCount ?? 0).toLocaleString('vi-VN')} thành viên
                      </span>
                    </div>
                  </div>
                  <div className="pt-3 mt-3 border-t border-slate-100 dark:border-[#1E293B] flex items-center justify-between">
                    <span className="text-xs text-slate-500">Doanh số PLUS</span>
                    <span className="text-xs font-bold text-amber-600 dark:text-amber-400">
                      {formatVND(plusRevenue)}
                    </span>
                  </div>
                </AdminCard>

                {/* SQUAD PASS */}
                <AdminCard className="p-4 flex flex-col justify-between border-l-4 border-l-[#22C55E]">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <AdminBadge variant="success" size="sm">SQUAD PASS</AdminBadge>
                      <span className="text-xs font-semibold text-slate-500">99.000 đ/tháng</span>
                    </div>
                    <div className="mt-3">
                      <span className="text-[11px] text-slate-400 block">Số nhóm đăng ký Active</span>
                      <span className="text-xl font-bold text-slate-900 dark:text-slate-100">
                        {(data?.activeSquadCount ?? 0).toLocaleString('vi-VN')} nhóm
                      </span>
                    </div>
                  </div>
                  <div className="pt-3 mt-3 border-t border-slate-100 dark:border-[#1E293B] flex items-center justify-between">
                    <span className="text-xs text-slate-500">Doanh số SQUAD</span>
                    <span className="text-xs font-bold text-[#22C55E]">
                      {formatVND(squadRevenue)}
                    </span>
                  </div>
                </AdminCard>
              </div>

              {/* Gateway Donut */}
              <AdminCard className="lg:col-span-5">
                <AdminCardHeader>
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center border border-amber-500/20">
                      <PieChart className="w-4 h-4" />
                    </div>
                    <div>
                      <AdminCardTitle>Cổng Thanh Toán Gói Hội Viên</AdminCardTitle>
                      <AdminCardDescription>Tỷ lệ đăng ký qua MoMo, ZaloPay, Apple Pay...</AdminCardDescription>
                    </div>
                  </div>
                </AdminCardHeader>

                {subProviderChartData.length === 0 ? (
                  <p className="text-xs text-slate-400 py-6 text-center">
                    Chưa có dữ liệu thanh toán cổng.
                  </p>
                ) : (
                  <AdminDonutChart
                    data={subProviderChartData}
                    totalLabel="Tổng Gói"
                    valueSuffix=" gói"
                    size={140}
                  />
                )}
              </AdminCard>
            </div>
          </div>

          {/* SECTION 2: AUDIT & CHARGE TRANSACTION LEDGER (THE REQUESTED FEATURE) */}
          <AdminCard className="overflow-hidden">
            <AdminCardHeader>
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-[#22C55E]/10 text-[#22C55E] flex items-center justify-center border border-[#22C55E]/20">
                    <Receipt className="w-4 h-4" />
                  </div>
                  <div>
                    <AdminCardTitle>Sổ Cái Đối Soát Thu Tiền & Giao Dịch (Billing Audit Ledger)</AdminCardTitle>
                    <AdminCardDescription>
                      Theo dõi chi tiết từng khách hàng được charge tiền, số tiền thực thu, mã đối soát và kênh thanh toán.
                    </AdminCardDescription>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
                  <div className="w-full sm:w-72">
                    <AdminInput
                      placeholder="Tìm kiếm mã GD, tên khách, email..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      leftIcon={<Search className="w-3.5 h-3.5 text-slate-400" />}
                    />
                  </div>
                  <AdminButton
                    variant="outline"
                    size="sm"
                    onClick={handleExportLedgerCSV}
                    icon={<Download className="w-3.5 h-3.5" />}
                  >
                    Xuất Sổ Cái
                  </AdminButton>
                </div>
              </div>
            </AdminCardHeader>

            {/* Tabs for Ledger */}
            <div className="px-5 pb-3">
              <AdminTabs
                tabs={ledgerTabs}
                activeTab={ledgerTab}
                onChange={(t) => setLedgerTab(t as any)}
              />
            </div>

            {/* Platform Subscriptions Charges Table */}
            {ledgerTab === 'subs' && (
              <AdminTable>
                <AdminTableHeader>
                  <AdminTableRow>
                    <AdminTableHead>Mã Giao Dịch / External Ref</AdminTableHead>
                    <AdminTableHead>Khách Hàng (User)</AdminTableHead>
                    <AdminTableHead>Gói Dịch Vụ</AdminTableHead>
                    <AdminTableHead>Số Tiền Charge</AdminTableHead>
                    <AdminTableHead>Cổng Thanh Toán</AdminTableHead>
                    <AdminTableHead>Trạng Thái</AdminTableHead>
                    <AdminTableHead>Ngày Thu Tiền</AdminTableHead>
                    <AdminTableHead className="text-right">Biên Lai</AdminTableHead>
                  </AdminTableRow>
                </AdminTableHeader>

                {filteredCharges.length === 0 ? (
                  <AdminTableEmpty colSpan={8} message="Không có bản ghi charge tiền gói hội viên nào phù hợp" />
                ) : (
                  <AdminTableBody>
                    {filteredCharges.map((charge) => (
                      <AdminTableRow key={charge.id}>
                        {/* Transaction ID */}
                        <AdminTableCell className="font-mono text-xs">
                          <div className="flex flex-col">
                            <span className="font-semibold text-slate-900 dark:text-slate-100">
                              {charge.externalId && charge.externalId !== 'N/A'
                                ? charge.externalId
                                : charge.id.slice(0, 12)}
                            </span>
                            <span className="text-[10px] text-slate-400">
                              UUID: {charge.id.slice(0, 8)}...
                            </span>
                          </div>
                        </AdminTableCell>

                        {/* Customer / User info */}
                        <AdminTableCell>
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-full bg-amber-500/10 text-amber-700 dark:text-amber-300 flex items-center justify-center font-bold text-xs shrink-0 border border-amber-500/20">
                              {charge.user?.name ? charge.user.name[0].toUpperCase() : 'U'}
                            </div>
                            <div className="flex flex-col min-w-0">
                              <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate">
                                {charge.user?.name || charge.user?.username || 'Thành viên'}
                              </span>
                              <span className="text-[11px] text-slate-400 truncate max-w-[150px]">
                                {charge.user?.email || 'N/A'}
                              </span>
                            </div>
                          </div>
                        </AdminTableCell>

                        {/* Plan */}
                        <AdminTableCell>
                          <AdminBadge variant={charge.plan === 'SQUAD' ? 'success' : 'brand'} size="xs">
                            {charge.plan === 'SQUAD' ? 'SQUAD Pass (Nhóm)' : 'PLUS Pass (Cá nhân)'}
                          </AdminBadge>
                        </AdminTableCell>

                        {/* Amount */}
                        <AdminTableCell>
                          <span className="text-xs font-bold text-emerald-600 dark:text-[#22C55E] whitespace-nowrap">
                            +{formatVND(charge.amount)}
                          </span>
                        </AdminTableCell>

                        {/* Provider */}
                        <AdminTableCell>
                          <AdminBadge variant="neutral" size="xs">
                            {charge.provider}
                          </AdminBadge>
                        </AdminTableCell>

                        {/* Status */}
                        <AdminTableCell>
                          <AdminBadge
                            variant={
                              charge.status === 'ACTIVE'
                                ? 'success'
                                : charge.status === 'EXPIRED'
                                ? 'neutral'
                                : 'danger'
                            }
                            size="xs"
                          >
                            {charge.status}
                          </AdminBadge>
                        </AdminTableCell>

                        {/* Date */}
                        <AdminTableCell className="text-xs text-slate-500 whitespace-nowrap font-mono">
                          {new Date(charge.createdAt).toLocaleString('vi-VN', {
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </AdminTableCell>

                        {/* Action */}
                        <AdminTableCell className="text-right">
                          <AdminButton
                            variant="ghost"
                            size="xs"
                            onClick={() => setSelectedTxn(charge)}
                            icon={<Eye className="w-3.5 h-3.5" />}
                          >
                            Đối soát
                          </AdminButton>
                        </AdminTableCell>
                      </AdminTableRow>
                    ))}
                  </AdminTableBody>
                )}
              </AdminTable>
            )}

            {/* P2P Trip Settlements Table */}
            {ledgerTab === 'p2p' && (
              <AdminTable>
                <AdminTableHeader>
                  <AdminTableRow>
                    <AdminTableHead>Mã Giao Dịch P2P</AdminTableHead>
                    <AdminTableHead>Người Chuyển Tiền</AdminTableHead>
                    <AdminTableHead>Người Nhận</AdminTableHead>
                    <AdminTableHead>Khoản Chi / Ghi Chú</AdminTableHead>
                    <AdminTableHead>Số Tiền</AdminTableHead>
                    <AdminTableHead>Kênh Thanh Toán</AdminTableHead>
                    <AdminTableHead>Trạng Thái</AdminTableHead>
                    <AdminTableHead>Thời Gian</AdminTableHead>
                    <AdminTableHead className="text-right">Biên Lai</AdminTableHead>
                  </AdminTableRow>
                </AdminTableHeader>

                {filteredP2P.length === 0 ? (
                  <AdminTableEmpty colSpan={9} message="Không có giao dịch chia tiền chuyến nào phù hợp" />
                ) : (
                  <AdminTableBody>
                    {filteredP2P.map((p2p) => (
                      <AdminTableRow key={p2p.id}>
                        <AdminTableCell className="font-mono text-xs">
                          <span className="font-semibold text-slate-800 dark:text-slate-200">
                            {p2p.externalId && p2p.externalId !== 'N/A' ? p2p.externalId : p2p.id.slice(0, 8)}
                          </span>
                        </AdminTableCell>

                        <AdminTableCell>
                          <div className="flex flex-col">
                            <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                              {p2p.sender?.name || p2p.sender?.email || 'Thành viên'}
                            </span>
                          </div>
                        </AdminTableCell>

                        <AdminTableCell>
                          <div className="flex flex-col">
                            <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                              {p2p.receiver?.name || p2p.receiver?.email || 'Chủ chi'}
                            </span>
                          </div>
                        </AdminTableCell>

                        <AdminTableCell className="max-w-[180px]">
                          <span className="text-xs text-slate-600 dark:text-slate-300 truncate block">
                            {p2p.expense?.title || p2p.note || 'Thanh toán hoá đơn chuyến'}
                          </span>
                        </AdminTableCell>

                        <AdminTableCell>
                          <span className="text-xs font-bold text-[#0F172A] dark:text-[#F8FAFC] whitespace-nowrap">
                            {formatVND(p2p.amount)}
                          </span>
                        </AdminTableCell>

                        <AdminTableCell>
                          <AdminBadge variant="neutral" size="xs">
                            {p2p.provider}
                          </AdminBadge>
                        </AdminTableCell>

                        <AdminTableCell>
                          <AdminBadge
                            variant={
                              p2p.status === 'SUCCESS'
                                ? 'success'
                                : p2p.status === 'PENDING'
                                ? 'warning'
                                : 'danger'
                            }
                            size="xs"
                          >
                            {p2p.status}
                          </AdminBadge>
                        </AdminTableCell>

                        <AdminTableCell className="text-xs text-slate-500 whitespace-nowrap font-mono">
                          {new Date(p2p.createdAt).toLocaleString('vi-VN', {
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </AdminTableCell>

                        <AdminTableCell className="text-right">
                          <AdminButton
                            variant="ghost"
                            size="xs"
                            onClick={() => setSelectedTxn(p2p)}
                            icon={<Eye className="w-3.5 h-3.5" />}
                          >
                            Chi tiết
                          </AdminButton>
                        </AdminTableCell>
                      </AdminTableRow>
                    ))}
                  </AdminTableBody>
                )}
              </AdminTable>
            )}

            {/* Combined View Table */}
            {ledgerTab === 'all' && (
              <AdminTable>
                <AdminTableHeader>
                  <AdminTableRow>
                    <AdminTableHead>Mã GD / External Ref</AdminTableHead>
                    <AdminTableHead>Phân Loại</AdminTableHead>
                    <AdminTableHead>Người Nộp Tiền (User)</AdminTableHead>
                    <AdminTableHead>Mục Đích Thu</AdminTableHead>
                    <AdminTableHead>Số Tiền</AdminTableHead>
                    <AdminTableHead>Kênh Thanh Toán</AdminTableHead>
                    <AdminTableHead>Trạng Thái</AdminTableHead>
                    <AdminTableHead>Thời Gian</AdminTableHead>
                    <AdminTableHead className="text-right">Thao Tác</AdminTableHead>
                  </AdminTableRow>
                </AdminTableHeader>

                {filteredCharges.length === 0 && filteredP2P.length === 0 ? (
                  <AdminTableEmpty colSpan={9} message="Không có bản ghi giao dịch nào" />
                ) : (
                  <AdminTableBody>
                    {filteredCharges.map((charge) => (
                      <AdminTableRow key={charge.id}>
                        <AdminTableCell className="font-mono text-xs font-semibold text-slate-800 dark:text-slate-200">
                          {charge.externalId && charge.externalId !== 'N/A' ? charge.externalId : charge.id.slice(0, 10)}
                        </AdminTableCell>
                        <AdminTableCell>
                          <AdminBadge variant="brand" size="xs">Gói Nền Tảng</AdminBadge>
                        </AdminTableCell>
                        <AdminTableCell>
                          <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                            {charge.user?.name || charge.user?.email || 'Thành viên'}
                          </span>
                        </AdminTableCell>
                        <AdminTableCell className="text-xs">
                          {charge.plan === 'SQUAD' ? 'Gói SQUAD Pass (12 tháng)' : 'Gói PLUS Pass'}
                        </AdminTableCell>
                        <AdminTableCell>
                          <span className="text-xs font-bold text-emerald-600 dark:text-[#22C55E]">
                            +{formatVND(charge.amount)}
                          </span>
                        </AdminTableCell>
                        <AdminTableCell>
                          <AdminBadge variant="neutral" size="xs">{charge.provider}</AdminBadge>
                        </AdminTableCell>
                        <AdminTableCell>
                          <AdminBadge variant="success" size="xs">{charge.status}</AdminBadge>
                        </AdminTableCell>
                        <AdminTableCell className="text-xs text-slate-500 font-mono whitespace-nowrap">
                          {new Date(charge.createdAt).toLocaleDateString('vi-VN')}
                        </AdminTableCell>
                        <AdminTableCell className="text-right">
                          <AdminButton
                            variant="ghost"
                            size="xs"
                            onClick={() => setSelectedTxn(charge)}
                            icon={<Eye className="w-3.5 h-3.5" />}
                          >
                            Xem
                          </AdminButton>
                        </AdminTableCell>
                      </AdminTableRow>
                    ))}

                    {filteredP2P.map((p2p) => (
                      <AdminTableRow key={p2p.id}>
                        <AdminTableCell className="font-mono text-xs font-semibold text-slate-800 dark:text-slate-200">
                          {p2p.externalId && p2p.externalId !== 'N/A' ? p2p.externalId : p2p.id.slice(0, 10)}
                        </AdminTableCell>
                        <AdminTableCell>
                          <AdminBadge variant="info" size="xs">P2P Chuyến</AdminBadge>
                        </AdminTableCell>
                        <AdminTableCell>
                          <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                            {p2p.sender?.name || p2p.sender?.email || 'Thành viên'}
                          </span>
                        </AdminTableCell>
                        <AdminTableCell className="text-xs truncate max-w-[160px]">
                          {p2p.expense?.title || p2p.note || 'Chia sẻ chi phí'}
                        </AdminTableCell>
                        <AdminTableCell>
                          <span className="text-xs font-bold text-slate-900 dark:text-slate-100">
                            {formatVND(p2p.amount)}
                          </span>
                        </AdminTableCell>
                        <AdminTableCell>
                          <AdminBadge variant="neutral" size="xs">{p2p.provider}</AdminBadge>
                        </AdminTableCell>
                        <AdminTableCell>
                          <AdminBadge variant={p2p.status === 'SUCCESS' ? 'success' : 'warning'} size="xs">
                            {p2p.status}
                          </AdminBadge>
                        </AdminTableCell>
                        <AdminTableCell className="text-xs text-slate-500 font-mono whitespace-nowrap">
                          {new Date(p2p.createdAt).toLocaleDateString('vi-VN')}
                        </AdminTableCell>
                        <AdminTableCell className="text-right">
                          <AdminButton
                            variant="ghost"
                            size="xs"
                            onClick={() => setSelectedTxn(p2p)}
                            icon={<Eye className="w-3.5 h-3.5" />}
                          >
                            Xem
                          </AdminButton>
                        </AdminTableCell>
                      </AdminTableRow>
                    ))}
                  </AdminTableBody>
                )}
              </AdminTable>
            )}
          </AdminCard>

          {/* SECTION 3: P2P TRIP EXPENSE BREAKDOWN (EXPLAINED CLEARLY) */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#38BDF8]" />
                <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider">
                  Dòng Tiền Chia Sẻ Nội Bộ (Peer-to-Peer Expense Split)
                </h2>
              </div>
              <span className="text-xs text-slate-400">
                Tổng thể tích chuyển tiền: {formatVND(data?.tripSplitVolume || data?.totalVolume || 0)}
              </span>
            </div>

            {/* Note callout */}
            <div className="p-3.5 rounded-lg bg-slate-50 dark:bg-[#0D1424] border border-[#E2E8F0] dark:border-[#1E293B] flex items-start gap-3">
              <Info className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
              <p className="text-xs text-[#475569] dark:text-[#94A3B8] leading-relaxed">
                Số liệu dưới đây phản ánh tổng lượng tiền mà các thành viên chuyển cho nhau để thanh toán các hoá đơn ăn uống,
                khách sạn, vé tham quan trong chuyến đi. Đây là dòng tiền trung chuyển nội bộ giữa người dùng (P2P), không phải
                khoản thu của TripMate.
              </p>
            </div>

            {/* Breakdown Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Status Breakdown */}
              <AdminCard>
                <AdminCardHeader>
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-[#22C55E]/10 text-[#22C55E] flex items-center justify-center">
                      <PieChart className="w-4 h-4" />
                    </div>
                    <div>
                      <AdminCardTitle>Trạng Thái Chia Tiền Chuyến</AdminCardTitle>
                      <AdminCardDescription>Phân bố trạng thái các giao dịch P2P</AdminCardDescription>
                    </div>
                  </div>
                </AdminCardHeader>

                {Object.keys(data?.tripSplitStatusBreakdown || data?.statusBreakdown || {}).length === 0 ? (
                  <p className="text-xs text-[#94A3B8] py-6 text-center">
                    Chưa có dữ liệu trạng thái giao dịch chia tiền.
                  </p>
                ) : (
                  <div className="flex flex-col gap-2">
                    {Object.entries(data?.tripSplitStatusBreakdown || data?.statusBreakdown || {}).map(([status, count]) => (
                      <div
                        key={status}
                        className="flex justify-between items-center p-2.5 rounded-lg border border-[#E2E8F0] dark:border-[#1E293B] bg-slate-50/50 dark:bg-[#0D1424]/60"
                      >
                        <span className="text-xs font-medium text-[#0F172A] dark:text-[#F8FAFC]">
                          {status}
                        </span>
                        <AdminBadge variant="neutral" size="xs">
                          {count} giao dịch
                        </AdminBadge>
                      </div>
                    ))}
                  </div>
                )}
              </AdminCard>

              {/* Method Breakdown */}
              <AdminCard>
                <AdminCardHeader>
                  <div className="flex items-center justify-between w-full">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-[#38BDF8]/10 text-[#38BDF8] flex items-center justify-center">
                        <Wallet className="w-4 h-4" />
                      </div>
                      <div>
                        <AdminCardTitle>Phương Thức Thanh Toán P2P</AdminCardTitle>
                        <AdminCardDescription>Kênh chuyển tiền giữa các thành viên</AdminCardDescription>
                      </div>
                    </div>
                    <span className="text-[11px] text-[#94A3B8]">
                      Tổng ví: {data?.walletCount ?? 0}
                    </span>
                  </div>
                </AdminCardHeader>

                {Object.keys(data?.tripSplitMethodBreakdown || data?.methodBreakdown || {}).length === 0 ? (
                  <p className="text-xs text-[#94A3B8] py-6 text-center">
                    Chưa có dữ liệu phương thức thanh toán.
                  </p>
                ) : (
                  <AdminDonutChart
                    data={p2pMethodChartData}
                    totalLabel="Tổng GD"
                    valueSuffix=" lượt"
                    size={150}
                  />
                )}
              </AdminCard>
            </div>
          </div>
        </>
      )}

      {/* QUICK VIEW RECEIPT DRAWER */}
      <AdminDrawer
        isOpen={!!selectedTxn}
        onClose={() => setSelectedTxn(null)}
        title="Biên Lai & Chi Tiết Đối Soát Giao Dịch"
        description={selectedTxn ? `Mã đối soát: ${selectedTxn.id}` : undefined}
        size="lg"
        footer={
          selectedTxn && (
            <div className="flex items-center justify-between w-full">
              <span className="text-[11px] text-slate-400">
                Giao dịch được ghi nhận trên cơ sở dữ liệu TripMate
              </span>
              <AdminButton variant="outline" size="sm" onClick={() => setSelectedTxn(null)}>
                Đóng
              </AdminButton>
            </div>
          )
        }
      >
        {selectedTxn && (
          <div className="flex flex-col gap-5 text-xs">
            {/* Amount Banner */}
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#0D1424] border border-slate-200 dark:border-[#1E293B] flex items-center justify-between">
              <div>
                <span className="text-[11px] text-slate-400 block font-medium">Số tiền giao dịch thực thu</span>
                <span className="text-2xl font-bold text-emerald-600 dark:text-[#22C55E]">
                  {formatVND(selectedTxn.amount)}
                </span>
              </div>
              <AdminBadge
                variant={
                  selectedTxn.status === 'ACTIVE' || selectedTxn.status === 'SUCCESS'
                    ? 'success'
                    : 'warning'
                }
                size="sm"
              >
                {selectedTxn.status}
              </AdminBadge>
            </div>

            {/* Transaction specs grid */}
            <div className="grid grid-cols-2 gap-3.5 p-4 rounded-xl border border-slate-200 dark:border-[#1E293B] bg-white dark:bg-[#111827]">
              <div>
                <span className="text-[10px] uppercase font-semibold text-slate-400 block">
                  Kênh / Cổng thanh toán
                </span>
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200 mt-0.5 block">
                  {selectedTxn.provider}
                </span>
              </div>

              <div>
                <span className="text-[10px] uppercase font-semibold text-slate-400 block">
                  Mã tham chiếu ngoại vi (External Ref)
                </span>
                <span className="text-xs font-mono font-bold text-slate-800 dark:text-slate-200 mt-0.5 block truncate">
                  {selectedTxn.externalId || 'N/A'}
                </span>
              </div>

              <div>
                <span className="text-[10px] uppercase font-semibold text-slate-400 block">
                  Thời gian ghi nhận
                </span>
                <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 mt-0.5 block">
                  {new Date(selectedTxn.createdAt).toLocaleString('vi-VN')}
                </span>
              </div>

              <div>
                <span className="text-[10px] uppercase font-semibold text-slate-400 block">
                  Phân loại nghiệp vụ
                </span>
                <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 mt-0.5 block">
                  {selectedTxn.type === 'SUBSCRIPTION' ? 'Gói Hội Viên Nền Tảng' : 'Chia Tiền Chuyến Đi (P2P)'}
                </span>
              </div>
            </div>

            {/* Customer Details */}
            {selectedTxn.type === 'SUBSCRIPTION' && (
              <div className="p-4 rounded-xl border border-slate-200 dark:border-[#1E293B] bg-slate-50/50 dark:bg-[#0D1424]/60 flex flex-col gap-2">
                <span className="text-xs font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                  <span>Thông tin khách hàng được tính tiền</span>
                </span>
                <div className="grid grid-cols-2 gap-2 mt-1">
                  <div>
                    <span className="text-[10px] text-slate-400 block">Họ và tên</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">
                      {(selectedTxn as ChargeTransaction).user?.name || 'Thành viên'}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">Email tài khoản</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200 truncate block">
                      {(selectedTxn as ChargeTransaction).user?.email || 'N/A'}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">Gói kích hoạt</span>
                    <span className="font-semibold text-amber-600 dark:text-amber-400">
                      {(selectedTxn as ChargeTransaction).plan} Pass
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">Hạn kỳ hiện tại</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">
                      {(selectedTxn as ChargeTransaction).currentPeriodEnd
                        ? new Date((selectedTxn as ChargeTransaction).currentPeriodEnd!).toLocaleDateString('vi-VN')
                        : 'Vô thời hạn'}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {selectedTxn.type === 'P2P_SPLIT' && (
              <div className="p-4 rounded-xl border border-slate-200 dark:border-[#1E293B] bg-slate-50/50 dark:bg-[#0D1424]/60 flex flex-col gap-2">
                <span className="text-xs font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                  <Wallet className="w-3.5 h-3.5 text-[#38BDF8]" />
                  <span>Thông tin đối tác chuyển tiền</span>
                </span>
                <div className="grid grid-cols-2 gap-2 mt-1">
                  <div>
                    <span className="text-[10px] text-slate-400 block">Người chuyển (Sender)</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">
                      {(selectedTxn as P2PTransaction).sender?.name || (selectedTxn as P2PTransaction).sender?.email || 'Thành viên'}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">Người nhận (Receiver)</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">
                      {(selectedTxn as P2PTransaction).receiver?.name || (selectedTxn as P2PTransaction).receiver?.email || 'Chủ chi'}
                    </span>
                  </div>
                  <div className="col-span-2">
                    <span className="text-[10px] text-slate-400 block">Khoản chi tiêu liên quan</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">
                      {(selectedTxn as P2PTransaction).expense?.title || (selectedTxn as P2PTransaction).note || 'Chia đều chi phí'}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Audit Notice */}
            <div className="p-3.5 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-start gap-2.5">
              <ShieldCheck className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
              <div className="text-[11px] text-slate-600 dark:text-slate-300 leading-normal">
                Bản ghi đối soát này được liên kết trực tiếp với lịch sử giao dịch gốc của cổng thanh toán MoMo / ZaloPay. Bạn có thể sử dụng mã đối soát để tra cứu trên Merchant Portal bên thứ 3.
              </div>
            </div>
          </div>
        )}
      </AdminDrawer>
    </div>
  );
}
