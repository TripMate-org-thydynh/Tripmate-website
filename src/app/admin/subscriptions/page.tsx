'use client';

import { useEffect, useState, useCallback } from 'react';
import {
  getSubscriptionsAction,
  getSubscriptionDetailAction,
  extendSubscriptionAction,
  revokeSubscriptionAction,
} from '@/app/actions';
import {
  CreditCard,
  Search,
  RefreshCw,
  Download,
  AlertCircle,
  Clock,
  Users,
  Eye,
  PlusCircle,
  XCircle,
  X,
  ChevronLeft,
  ChevronRight,
  ShieldAlert,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';
import ErrorState from '@/components/ErrorState';
import EmptyState from '@/components/EmptyState';
import { exportToCSV } from '@/lib/exportCsv';

function formatDate(dateStr?: string | null) {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}

interface SubscriptionItem {
  id: string;
  userId: string;
  plan: 'PLUS' | 'SQUAD' | string;
  status: 'ACTIVE' | 'EXPIRED' | 'CANCELED' | 'PAST_DUE' | string;
  isEffectiveActive: boolean;
  isExpiringSoon: boolean;
  remainingText?: string;
  currentPeriodStart: string;
  currentPeriodEnd: string;
  cancelAtPeriodEnd: boolean;
  canceledAt: string | null;
  provider: string;
  externalId: string | null;
  seats: number;
  usedSeatsCount: number;
  createdAt: string;
  updatedAt: string;
  user?: {
    id: string;
    name: string;
    email: string;
    avatarUrl: string | null;
    username: string | null;
  };
}

interface SquadSeatDetail {
  id: string;
  userId: string;
  grantedAt: string;
  revokedAt: string | null;
  user?: {
    id: string;
    name: string;
    email: string;
    avatarUrl: string | null;
    username: string | null;
  };
}

interface AuditLogItem {
  id: string;
  action: string;
  reason: string;
  createdAt: string;
  details?: any;
  admin?: {
    id: string;
    name: string;
    email: string;
  };
}

interface SubscriptionDetail extends SubscriptionItem {
  squadSeats: SquadSeatDetail[];
  auditLogs: AuditLogItem[];
}

export default function AdminSubscriptionsPage() {
  const [subscriptions, setSubscriptions] = useState<SubscriptionItem[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState('');
  const [planFilter, setPlanFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Modals state
  const [detailModalItem, setDetailModalItem] = useState<SubscriptionDetail | null>(null);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [extendModalItem, setExtendModalItem] = useState<SubscriptionItem | null>(null);
  const [extendMonths, setExtendMonths] = useState(1);
  const [extendReason, setExtendReason] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  const [revokeModalItem, setRevokeModalItem] = useState<SubscriptionItem | null>(null);
  const [revokeReason, setRevokeReason] = useState('');

  const fetchSubscriptions = useCallback(async () => {
    setLoading(true);
    setError(null);

    const expiringSoon = statusFilter === 'EXPIRING_SOON';
    const effectiveStatus = statusFilter === 'EXPIRING_SOON' ? '' : statusFilter;

    const res = await getSubscriptionsAction({
      search: search || undefined,
      plan: planFilter || undefined,
      status: effectiveStatus || undefined,
      expiringSoon,
      page,
      limit: 10,
    });

    if (res.success && res.data) {
      const nowMs = Date.now();
      const itemsWithRemaining = (res.data.items || []).map((sub: SubscriptionItem) => {
        const endMs = new Date(sub.currentPeriodEnd).getTime();
        const diff = Math.ceil((endMs - nowMs) / (1000 * 60 * 60 * 24));
        let remainingText = `Còn ${diff} ngày`;
        if (diff < 0) remainingText = 'Đã hết hạn';
        else if (diff === 0) remainingText = 'Hết hạn hôm nay';
        return { ...sub, remainingText };
      });
      setSubscriptions(itemsWithRemaining);
      setTotal(res.data.total || 0);
      setTotalPages(res.data.totalPages || 1);
    } else {
      setError(res.error || 'Không thể tải danh sách gói đăng ký');
    }
    setLoading(false);
  }, [page, planFilter, statusFilter, search]);

  useEffect(() => {
    fetchSubscriptions();
  }, [fetchSubscriptions]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchSubscriptions();
  };

  // Open Detail modal
  const handleOpenDetail = async (sub: SubscriptionItem) => {
    setLoadingDetail(true);
    const res = await getSubscriptionDetailAction(sub.id);
    if (res.success && res.data) {
      setDetailModalItem(res.data);
    } else {
      alert(res.error || 'Không thể tải chi tiết gói');
    }
    setLoadingDetail(false);
  };

  // Handle Extend
  const handleConfirmExtend = async () => {
    if (!extendModalItem) return;
    if (!extendReason.trim()) {
      alert('Vui lòng nhập lý do gia hạn');
      return;
    }

    setActionLoading(true);
    const res = await extendSubscriptionAction(extendModalItem.id, extendMonths, extendReason);
    setActionLoading(false);

    if (res.success) {
      setExtendModalItem(null);
      setExtendReason('');
      fetchSubscriptions();
    } else {
      alert(res.error || 'Gia hạn gói thất bại');
    }
  };

  // Handle Revoke
  const handleConfirmRevoke = async () => {
    if (!revokeModalItem) return;
    if (!revokeReason.trim()) {
      alert('Vui lòng nhập lý do thu hồi');
      return;
    }

    setActionLoading(true);
    const res = await revokeSubscriptionAction(revokeModalItem.id, revokeReason);
    setActionLoading(false);

    if (res.success) {
      setRevokeModalItem(null);
      setRevokeReason('');
      fetchSubscriptions();
    } else {
      alert(res.error || 'Thu hồi gói thất bại');
    }
  };

  // Export CSV
  const handleExportCSV = () => {
    if (!subscriptions.length) return;
    const exportRows = subscriptions.map((s) => ({
      ID: s.id,
      'Thành viên': s.user?.name || 'N/A',
      Email: s.user?.email || 'N/A',
      Gói: s.plan,
      'Trạng thái': s.isEffectiveActive ? 'ACTIVE' : s.status,
      'Sắp hết hạn': s.isExpiringSoon ? 'Có' : 'Không',
      'Kỳ bắt đầu': new Date(s.currentPeriodStart).toLocaleDateString('vi-VN'),
      'Kỳ kết thúc': new Date(s.currentPeriodEnd).toLocaleDateString('vi-VN'),
      'Cổng thanh toán': s.provider,
      'Mã ngoài': s.externalId || '',
      'Số ghế': `${s.usedSeatsCount}/${s.seats}`,
    }));
    exportToCSV('tripmate_subscriptions', exportRows);
  };

  // Quick stats from current list
  const activeCount = subscriptions.filter((s) => s.isEffectiveActive).length;
  const plusCount = subscriptions.filter((s) => s.plan === 'PLUS' && s.isEffectiveActive).length;
  const squadCount = subscriptions.filter((s) => s.plan === 'SQUAD' && s.isEffectiveActive).length;
  const expiringSoonCount = subscriptions.filter((s) => s.isExpiringSoon).length;

  return (
    <div className="flex flex-col gap-6">
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black uppercase text-black dark:text-white tracking-tight">
            Quản Lý Gói Đăng Ký (Subscriptions)
          </h1>
          <p className="text-[10px] font-black uppercase text-muted-foreground mt-1">
            Tra cứu tài khoản trả phí, kiểm tra ghế Squad Pass, hỗ trợ gia hạn và thu hồi gói.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleExportCSV}
            disabled={!subscriptions.length}
            className="px-4 py-2.5 bg-white dark:bg-[#252322] border-2 border-black dark:border-white hover:bg-secondary text-black dark:text-white text-xs font-black uppercase rounded-xl shadow-[2px_2px_0px_0px_#000000] dark:shadow-[2px_2px_0px_0px_#ffffff] hover:translate-y-[-1px] transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
          >
            <Download className="w-4 h-4 text-primary" />
            Xuất CSV
          </button>
          <button
            onClick={fetchSubscriptions}
            disabled={loading}
            className="p-2.5 rounded-xl bg-white dark:bg-[#252322] border-2 border-black dark:border-white hover:bg-secondary text-black dark:text-white shadow-[2px_2px_0px_0px_#000000] dark:shadow-[2px_2px_0px_0px_#ffffff] hover:translate-y-[-1px] active:translate-y-[1px] transition-all cursor-pointer flex items-center justify-center disabled:opacity-50"
            aria-label="Tải lại danh sách"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="p-5 rounded-2xl border-[3px] border-black bg-[#FFD043] text-black shadow-[3px_3px_0px_0px_#000000] flex items-center justify-between">
          <div>
            <span className="text-[10px] font-black uppercase tracking-wider opacity-85">Gói Active Trong Trang</span>
            <h3 className="text-2xl font-black mt-0.5">{activeCount}</h3>
            <p className="text-[9px] font-bold text-black/70">Tổng số gói: {total}</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-white border-2 border-black flex items-center justify-center shadow-[2px_2px_0px_0px_#000000]">
            <CheckCircle2 className="w-5 h-5 text-black" />
          </div>
        </div>

        <div className="p-5 rounded-2xl border-[3px] border-black bg-[#18A058] text-white shadow-[3px_3px_0px_0px_#000000] flex items-center justify-between">
          <div>
            <span className="text-[10px] font-black uppercase tracking-wider opacity-90">Gói PLUS (Cá nhân)</span>
            <h3 className="text-2xl font-black mt-0.5">{plusCount}</h3>
            <p className="text-[9px] font-bold text-white/80">39.000đ / tháng</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-white border-2 border-black flex items-center justify-center text-black shadow-[2px_2px_0px_0px_#000000]">
            <CreditCard className="w-5 h-5 text-black" />
          </div>
        </div>

        <div className="p-5 rounded-2xl border-[3px] border-black bg-[#C5B4FA] text-black shadow-[3px_3px_0px_0px_#000000] flex items-center justify-between">
          <div>
            <span className="text-[10px] font-black uppercase tracking-wider opacity-85">Gói SQUAD (5 ghế)</span>
            <h3 className="text-2xl font-black mt-0.5">{squadCount}</h3>
            <p className="text-[9px] font-bold text-black/70">99.000đ / tháng</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-white border-2 border-black flex items-center justify-center shadow-[2px_2px_0px_0px_#000000]">
            <Users className="w-5 h-5 text-black" />
          </div>
        </div>

        <div className="p-5 rounded-2xl border-[3px] border-black bg-[#FF9FCE] text-black shadow-[3px_3px_0px_0px_#000000] flex items-center justify-between">
          <div>
            <span className="text-[10px] font-black uppercase tracking-wider opacity-85">Hết Hạn ≤ 7 Ngày</span>
            <h3 className="text-2xl font-black mt-0.5">{expiringSoonCount}</h3>
            <p className="text-[9px] font-bold text-black/70">Cần theo dõi gia hạn</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-white border-2 border-black flex items-center justify-center shadow-[2px_2px_0px_0px_#000000]">
            <Clock className="w-5 h-5 text-black" />
          </div>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-2xl bg-destructive/10 border-2 border-destructive text-destructive text-xs font-bold flex items-center gap-2.5 shadow-[2px_2px_0px_0px_#000000]">
          <AlertCircle className="w-5 h-5" />
          <span>{error}</span>
        </div>
      )}

      {error && !loading && subscriptions.length === 0 && (
        <ErrorState message={error} onRetry={fetchSubscriptions} />
      )}

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white dark:bg-[#252322] border-[3px] border-black dark:border-white p-4 rounded-2xl shadow-[4px_4px_0px_0px_#000000] dark:shadow-[4px_4px_0px_0px_#ffffff]">
        <form onSubmit={handleSearchSubmit} className="relative w-full md:w-80">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Tìm theo email, tên, username..."
            className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl border-2 border-black dark:border-white bg-[#FEFADC] dark:bg-[#1C1A19] focus:outline-none focus:border-primary font-bold text-black dark:text-white"
          />
          <button
            type="submit"
            className="absolute inset-y-0 left-0 pl-3 flex items-center cursor-pointer"
            aria-label="Tìm kiếm gói"
          >
            <Search className="w-4 h-4 text-black dark:text-white" />
          </button>
        </form>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-end">
          <div className="flex items-center gap-2">
            <span className="text-xs font-black uppercase text-black dark:text-white whitespace-nowrap">Gói:</span>
            <select
              value={planFilter}
              onChange={(e) => {
                setPlanFilter(e.target.value);
                setPage(1);
              }}
              className="px-3 py-2 text-xs border-2 border-black dark:border-white rounded-xl bg-white dark:bg-[#1C1A19] text-black dark:text-white font-bold"
            >
              <option value="">Tất cả</option>
              <option value="PLUS">PLUS (Cá nhân)</option>
              <option value="SQUAD">SQUAD (Nhóm)</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-black uppercase text-black dark:text-white whitespace-nowrap">
              Trạng thái:
            </span>
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setPage(1);
              }}
              className="px-3 py-2 text-xs border-2 border-black dark:border-white rounded-xl bg-white dark:bg-[#1C1A19] text-black dark:text-white font-bold"
            >
              <option value="">Tất cả</option>
              <option value="ACTIVE">Đang hoạt động</option>
              <option value="EXPIRING_SOON">Sắp hết hạn (≤ 7 ngày)</option>
              <option value="CANCELING">Chờ huỷ cuối kỳ</option>
              <option value="EXPIRED">Đã hết hạn / Huỷ</option>
            </select>
          </div>
        </div>
      </div>

      {/* Subscriptions Table */}
      <div className="bg-white border-[3px] border-black dark:bg-[#252322] dark:border-white rounded-3xl overflow-hidden shadow-[4px_4px_0px_0px_#000000] dark:shadow-[4px_4px_0px_0px_#ffffff]">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-secondary border-b-[3px] border-black dark:border-white text-black font-black uppercase">
                <th className="p-4 border-r border-black dark:border-white">Thành viên</th>
                <th className="p-4 border-r border-black dark:border-white">Gói</th>
                <th className="p-4 border-r border-black dark:border-white">Trạng thái</th>
                <th className="p-4 border-r border-black dark:border-white">Hiệu lực</th>
                <th className="p-4 border-r border-black dark:border-white">Cổng</th>
                <th className="p-4 border-r border-black dark:border-white">Ghế Squad</th>
                <th className="p-4 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                [1, 2, 3, 4, 5].map((i) => (
                  <tr key={i} className="border-b border-black/10 dark:border-white/10 animate-pulse">
                    <td className="p-4">
                      <div className="h-4 w-32 bg-muted rounded mb-1"></div>
                      <div className="h-3 w-20 bg-muted rounded"></div>
                    </td>
                    <td className="p-4">
                      <div className="h-5 w-16 bg-muted rounded-full"></div>
                    </td>
                    <td className="p-4">
                      <div className="h-5 w-20 bg-muted rounded-full"></div>
                    </td>
                    <td className="p-4">
                      <div className="h-4 w-24 bg-muted rounded"></div>
                    </td>
                    <td className="p-4">
                      <div className="h-4 w-16 bg-muted rounded"></div>
                    </td>
                    <td className="p-4">
                      <div className="h-4 w-12 bg-muted rounded"></div>
                    </td>
                    <td className="p-4 text-right">
                      <div className="h-7 w-24 bg-muted rounded-xl inline-block"></div>
                    </td>
                  </tr>
                ))
              ) : subscriptions.length === 0 ? (
                <EmptyState
                  asTableRow
                  colSpan={7}
                  message="Không tìm thấy gói đăng ký nào. Hãy thử thay đổi từ khoá tìm kiếm hoặc bộ lọc trạng thái."
                />
              ) : (
                subscriptions.map((sub) => (
                  <tr
                    key={sub.id}
                    className="border-b border-black/10 dark:border-white/10 hover:bg-[#FEFADC]/50 dark:hover:bg-[#1C1A19]/50 transition-colors"
                  >
                    {/* User */}
                    <td className="p-4 border-r border-black/10 dark:border-white/10">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full border border-black dark:border-white bg-[#FFD043] flex items-center justify-center font-black text-xs text-black shrink-0 overflow-hidden">
                          {sub.user?.avatarUrl ? (
                            /* eslint-disable-next-line @next/next/no-img-element */
                            <img
                              src={sub.user.avatarUrl}
                              alt={sub.user.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            sub.user?.name?.charAt(0).toUpperCase() || 'U'
                          )}
                        </div>
                        <div>
                          <p className="font-black text-black dark:text-white leading-tight">
                            {sub.user?.name || 'Không rõ'}
                          </p>
                          <p className="text-[10px] font-bold text-muted-foreground">
                            {sub.user?.email || sub.userId}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Plan */}
                    <td className="p-4 border-r border-black/10 dark:border-white/10">
                      {sub.plan === 'SQUAD' ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#C5B4FA] border border-black text-black text-[10px] font-black uppercase">
                          <Users className="w-3 h-3" />
                          SQUAD
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#18A058] border border-black text-white text-[10px] font-black uppercase">
                          <CreditCard className="w-3 h-3" />
                          PLUS
                        </span>
                      )}
                    </td>

                    {/* Status */}
                    <td className="p-4 border-r border-black/10 dark:border-white/10">
                      {sub.isEffectiveActive ? (
                        sub.cancelAtPeriodEnd ? (
                          <span className="inline-block px-2 py-0.5 rounded-full bg-[#FFD043] border border-black text-black text-[10px] font-black uppercase">
                            Chờ huỷ cuối kỳ
                          </span>
                        ) : sub.isExpiringSoon ? (
                          <span className="inline-block px-2 py-0.5 rounded-full bg-[#FF9FCE] border border-black text-black text-[10px] font-black uppercase">
                            Sắp hết hạn
                          </span>
                        ) : (
                          <span className="inline-block px-2 py-0.5 rounded-full bg-[#18A058]/20 border border-[#18A058] text-[#18A058] dark:text-[#52c41a] text-[10px] font-black uppercase">
                            Hoạt động
                          </span>
                        )
                      ) : (
                        <span className="inline-block px-2 py-0.5 rounded-full bg-destructive/15 border border-destructive text-destructive text-[10px] font-black uppercase">
                          Hết hạn / Huỷ
                        </span>
                      )}
                    </td>

                    {/* Effective Dates */}
                    <td className="p-4 border-r border-black/10 dark:border-white/10">
                      <div className="flex flex-col">
                        <span className="font-bold text-black dark:text-white">
                          {formatDate(sub.currentPeriodEnd)}
                        </span>
                        <span className="text-[10px] font-bold text-muted-foreground">
                          {sub.remainingText}
                        </span>
                      </div>
                    </td>

                    {/* Provider */}
                    <td className="p-4 border-r border-black/10 dark:border-white/10">
                      <span className="text-xs font-black uppercase text-black dark:text-white">
                        {sub.provider}
                      </span>
                    </td>

                    {/* Seats */}
                    <td className="p-4 border-r border-black/10 dark:border-white/10">
                      <span className="inline-flex items-center gap-1 font-black text-black dark:text-white">
                        <Users className="w-3.5 h-3.5 text-primary" />
                        {sub.usedSeatsCount} / {sub.seats}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleOpenDetail(sub)}
                          disabled={loadingDetail}
                          className="p-2 rounded-xl bg-white dark:bg-[#1C1A19] border-2 border-black dark:border-white hover:bg-secondary text-black dark:text-white shadow-[2px_2px_0px_0px_#000000] dark:shadow-[2px_2px_0px_0px_#ffffff] hover:translate-y-[-1px] transition-all cursor-pointer"
                          title="Xem chi tiết & danh sách ghế Squad"
                          aria-label="Xem chi tiết"
                        >
                          <Eye className="w-3.5 h-3.5 text-black dark:text-white" />
                        </button>

                        <button
                          onClick={() => {
                            setExtendModalItem(sub);
                            setExtendMonths(1);
                            setExtendReason('');
                          }}
                          className="p-2 rounded-xl bg-[#18A058] border-2 border-black text-white shadow-[2px_2px_0px_0px_#000000] hover:translate-y-[-1px] transition-all cursor-pointer"
                          title="Gia hạn thủ công"
                          aria-label="Gia hạn gói"
                        >
                          <PlusCircle className="w-3.5 h-3.5" />
                        </button>

                        {sub.isEffectiveActive && (
                          <button
                            onClick={() => {
                              setRevokeModalItem(sub);
                              setRevokeReason('');
                            }}
                            className="p-2 rounded-xl bg-red-500 border-2 border-black text-white shadow-[2px_2px_0px_0px_#000000] hover:translate-y-[-1px] transition-all cursor-pointer"
                            title="Thu hồi gói (Hoàn tiền / Gian lận)"
                            aria-label="Thu hồi gói"
                          >
                            <XCircle className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-between items-center p-4 border-t-2 border-black dark:border-white bg-[#FEFADC] dark:bg-[#1C1A19]">
            <span className="text-xs font-black uppercase text-black dark:text-white">
              Trang {page} / {totalPages} (Tổng {total} gói)
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1 || loading}
                className="p-2 rounded-xl border-2 border-black dark:border-white bg-white dark:bg-[#252322] hover:bg-secondary text-black dark:text-white shadow-[2px_2px_0px_0px_#000000] dark:shadow-[2px_2px_0px_0px_#ffffff] disabled:opacity-40 cursor-pointer"
                aria-label="Trang trước"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages || loading}
                className="p-2 rounded-xl border-2 border-black dark:border-white bg-white dark:bg-[#252322] hover:bg-secondary text-black dark:text-white shadow-[2px_2px_0px_0px_#000000] dark:shadow-[2px_2px_0px_0px_#ffffff] disabled:opacity-40 cursor-pointer"
                aria-label="Trang sau"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* --- MODAL 1: CHI TIẾT GÓI & GHẾ SQUAD --- */}
      {detailModalItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="w-full max-w-2xl bg-white dark:bg-[#252322] border-[3px] border-black dark:border-white rounded-3xl p-6 shadow-[6px_6px_0px_0px_#000000] dark:shadow-[6px_6px_0px_0px_#ffffff] max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex justify-between items-center border-b-2 border-black dark:border-white pb-4 mb-5">
              <div>
                <span className="text-[10px] font-black uppercase text-primary tracking-wider">
                  Chi Tiết Gói Đăng Ký
                </span>
                <h3 className="text-lg font-black uppercase text-black dark:text-white">
                  {detailModalItem.user?.name} · {detailModalItem.plan}
                </h3>
              </div>
              <button
                onClick={() => setDetailModalItem(null)}
                className="p-1.5 rounded-xl border-2 border-black dark:border-white bg-white dark:bg-[#1C1A19] hover:bg-secondary text-black dark:text-white cursor-pointer"
                aria-label="Đóng chi tiết"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* General Info Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
              <div className="p-3 rounded-xl border-2 border-black dark:border-white bg-[#FEFADC] dark:bg-[#1C1A19]">
                <span className="text-[9px] font-black uppercase text-muted-foreground">ID Gói</span>
                <p className="text-xs font-mono font-bold truncate text-black dark:text-white">{detailModalItem.id}</p>
              </div>

              <div className="p-3 rounded-xl border-2 border-black dark:border-white bg-[#FEFADC] dark:bg-[#1C1A19]">
                <span className="text-[9px] font-black uppercase text-muted-foreground">Trạng Thái</span>
                <p className="text-xs font-black text-black dark:text-white">
                  {detailModalItem.isEffectiveActive ? 'ACTIVE (Có hiệu lực)' : 'Hết hạn / Huỷ'}
                </p>
              </div>

              <div className="p-3 rounded-xl border-2 border-black dark:border-white bg-[#FEFADC] dark:bg-[#1C1A19]">
                <span className="text-[9px] font-black uppercase text-muted-foreground">Hạn Dùng</span>
                <p className="text-xs font-black text-black dark:text-white">
                  {formatDate(detailModalItem.currentPeriodEnd)}
                </p>
              </div>

              <div className="p-3 rounded-xl border-2 border-black dark:border-white bg-[#FEFADC] dark:bg-[#1C1A19]">
                <span className="text-[9px] font-black uppercase text-muted-foreground">Cổng Thanh Toán</span>
                <p className="text-xs font-black text-black dark:text-white">{detailModalItem.provider}</p>
              </div>

              <div className="p-3 rounded-xl border-2 border-black dark:border-white bg-[#FEFADC] dark:bg-[#1C1A19]">
                <span className="text-[9px] font-black uppercase text-muted-foreground">Mã Giao Dịch Ngoài</span>
                <p className="text-xs font-mono font-bold truncate text-black dark:text-white">
                  {detailModalItem.externalId || 'Không có'}
                </p>
              </div>

              <div className="p-3 rounded-xl border-2 border-black dark:border-white bg-[#FEFADC] dark:bg-[#1C1A19]">
                <span className="text-[9px] font-black uppercase text-muted-foreground">Số Ghế Squad</span>
                <p className="text-xs font-black text-black dark:text-white">
                  {detailModalItem.usedSeatsCount} / {detailModalItem.seats}
                </p>
              </div>
            </div>

            {/* Squad Seats Section */}
            <div className="mb-6">
              <h4 className="text-xs font-black uppercase text-black dark:text-white mb-3 flex items-center gap-2">
                <Users className="w-4 h-4 text-primary" />
                Danh Sách Ghế Squad Pass ({detailModalItem.squadSeats?.length || 0})
              </h4>

              {detailModalItem.squadSeats?.length === 0 ? (
                <p className="text-xs text-muted-foreground font-bold p-4 rounded-xl border border-black/20 dark:border-white/20 bg-muted/20 text-center">
                  Gói này chưa cấp ghế Squad nào cho thành viên khác.
                </p>
              ) : (
                <div className="flex flex-col gap-2">
                  {detailModalItem.squadSeats?.map((seat) => (
                    <div
                      key={seat.id}
                      className="p-3 rounded-xl border-2 border-black dark:border-white bg-white dark:bg-[#1C1A19] flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-7 h-7 rounded-full bg-[#FFD043] border border-black flex items-center justify-center font-black text-xs text-black">
                          {seat.user?.name?.charAt(0).toUpperCase() || 'S'}
                        </div>
                        <div>
                          <p className="font-black text-xs text-black dark:text-white">{seat.user?.name || 'Thành viên'}</p>
                          <p className="text-[10px] text-muted-foreground font-bold">{seat.user?.email || seat.userId}</p>
                        </div>
                      </div>

                      <div className="text-right">
                        {seat.revokedAt ? (
                          <span className="text-[10px] font-black text-destructive uppercase">
                            Đã thu hồi ({formatDate(seat.revokedAt)})
                          </span>
                        ) : (
                          <span className="text-[10px] font-black text-[#18A058] uppercase">
                            Đang dùng (cấp {formatDate(seat.grantedAt)})
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Admin Audit Logs Section */}
            <div>
              <h4 className="text-xs font-black uppercase text-black dark:text-white mb-3 flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-[#FFD043]" />
                Nhật Ký Thao Tác Của Admin ({detailModalItem.auditLogs?.length || 0})
              </h4>

              {detailModalItem.auditLogs?.length === 0 ? (
                <p className="text-xs text-muted-foreground font-bold p-4 rounded-xl border border-black/20 dark:border-white/20 bg-muted/20 text-center">
                  Chưa có can thiệp thủ công nào từ quản trị viên đối với gói này.
                </p>
              ) : (
                <div className="flex flex-col gap-2.5">
                  {detailModalItem.auditLogs?.map((log) => (
                    <div
                      key={log.id}
                      className="p-3 rounded-xl border-2 border-black dark:border-white bg-[#FEFADC] dark:bg-[#1C1A19] text-xs"
                    >
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-black uppercase text-primary">{log.action}</span>
                        <span className="text-[10px] font-bold text-muted-foreground">{formatDate(log.createdAt)}</span>
                      </div>
                      <p className="font-bold text-black dark:text-white">
                        Lý do: <span className="font-normal italic">{log.reason}</span>
                      </p>
                      <p className="text-[10px] text-muted-foreground font-bold mt-1">
                        Admin: {log.admin?.name || log.admin?.email || 'Admin'}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* --- MODAL 2: GIA HẠN THỦ CÔNG --- */}
      {extendModalItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white dark:bg-[#252322] border-[3px] border-black dark:border-white rounded-3xl p-6 shadow-[6px_6px_0px_0px_#000000] dark:shadow-[6px_6px_0px_0px_#ffffff]">
            <div className="flex justify-between items-center border-b-2 border-black dark:border-white pb-3 mb-4">
              <h3 className="text-base font-black uppercase text-black dark:text-white flex items-center gap-2">
                <PlusCircle className="w-5 h-5 text-[#18A058]" />
                Gia Hạn Gói Thủ Công
              </h3>
              <button
                onClick={() => setExtendModalItem(null)}
                className="p-1.5 rounded-xl border border-black dark:border-white hover:bg-secondary cursor-pointer"
                aria-label="Đóng modal"
              >
                <X className="w-4 h-4 text-black dark:text-white" />
              </button>
            </div>

            <p className="text-xs font-bold text-muted-foreground mb-4">
              Người nhận: <span className="text-black dark:text-white font-black">{extendModalItem.user?.name}</span> (
              {extendModalItem.user?.email}) · Gói: <span className="font-black">{extendModalItem.plan}</span>
            </p>

            <div className="flex flex-col gap-4">
              <div>
                <label className="text-xs font-black uppercase text-black dark:text-white block mb-1.5">
                  Số Tháng Gia Hạn:
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {[1, 3, 6, 12].map((m) => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => setExtendMonths(m)}
                      className={`py-2 rounded-xl border-2 border-black dark:border-white text-xs font-black transition-all cursor-pointer ${
                        extendMonths === m
                          ? 'bg-[#FFD043] text-black shadow-[2px_2px_0px_0px_#000000]'
                          : 'bg-white dark:bg-[#1C1A19] text-black dark:text-white'
                      }`}
                    >
                      +{m} tháng
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-black uppercase text-black dark:text-white block mb-1.5">
                  Lý Do Gia Hạn <span className="text-destructive">* (Bắt buộc)</span>:
                </label>
                <textarea
                  value={extendReason}
                  onChange={(e) => setExtendReason(e.target.value)}
                  placeholder="Ví dụ: Đền bù sự cố cổng thanh toán webhook trễ, hỗ trợ khách hàng VIP..."
                  rows={3}
                  className="w-full p-3 text-xs rounded-xl border-2 border-black dark:border-white bg-[#FEFADC] dark:bg-[#1C1A19] text-black dark:text-white font-bold focus:outline-none focus:border-primary"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setExtendModalItem(null)}
                  disabled={actionLoading}
                  className="px-4 py-2.5 rounded-xl border-2 border-black dark:border-white bg-white dark:bg-[#1C1A19] text-black dark:text-white text-xs font-black uppercase cursor-pointer"
                >
                  Huỷ
                </button>
                <button
                  type="button"
                  onClick={handleConfirmExtend}
                  disabled={actionLoading || !extendReason.trim()}
                  className="px-5 py-2.5 rounded-xl border-2 border-black bg-[#18A058] text-white text-xs font-black uppercase shadow-[2px_2px_0px_0px_#000000] disabled:opacity-50 cursor-pointer"
                >
                  {actionLoading ? 'Đang xử lý...' : 'Xác nhận gia hạn'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- MODAL 3: THU HỒI GÓI --- */}
      {revokeModalItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white dark:bg-[#252322] border-[3px] border-black dark:border-white rounded-3xl p-6 shadow-[6px_6px_0px_0px_#000000] dark:shadow-[6px_6px_0px_0px_#ffffff]">
            <div className="flex justify-between items-center border-b-2 border-black dark:border-white pb-3 mb-4">
              <h3 className="text-base font-black uppercase text-destructive flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-destructive" />
                Thu Hồi Quyền Sử Dụng Gói
              </h3>
              <button
                onClick={() => setRevokeModalItem(null)}
                className="p-1.5 rounded-xl border border-black dark:border-white hover:bg-secondary cursor-pointer"
                aria-label="Đóng modal"
              >
                <X className="w-4 h-4 text-black dark:text-white" />
              </button>
            </div>

            <div className="p-3.5 rounded-xl bg-destructive/10 border-2 border-destructive text-destructive text-xs font-bold mb-4">
              ⚠️ Cảnh báo: Hành động này sẽ lập tức huỷ quyền của tài khoản{' '}
              <span className="font-black">{revokeModalItem.user?.name}</span> và thu hồi toàn bộ ghế Squad Pass đã cấp
              cho các thành viên trong nhóm.
            </div>

            <div className="flex flex-col gap-4">
              <div>
                <label className="text-xs font-black uppercase text-black dark:text-white block mb-1.5">
                  Lý Do Thu Hồi <span className="text-destructive">* (Bắt buộc)</span>:
                </label>
                <textarea
                  value={revokeReason}
                  onChange={(e) => setRevokeReason(e.target.value)}
                  placeholder="Ví dụ: Người dùng yêu cầu hoàn tiền Momo, phát hiện gian lận thẻ..."
                  rows={3}
                  className="w-full p-3 text-xs rounded-xl border-2 border-black dark:border-white bg-[#FEFADC] dark:bg-[#1C1A19] text-black dark:text-white font-bold focus:outline-none focus:border-destructive"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setRevokeModalItem(null)}
                  disabled={actionLoading}
                  className="px-4 py-2.5 rounded-xl border-2 border-black dark:border-white bg-white dark:bg-[#1C1A19] text-black dark:text-white text-xs font-black uppercase cursor-pointer"
                >
                  Đóng
                </button>
                <button
                  type="button"
                  onClick={handleConfirmRevoke}
                  disabled={actionLoading || !revokeReason.trim()}
                  className="px-5 py-2.5 rounded-xl border-2 border-black bg-red-600 text-white text-xs font-black uppercase shadow-[2px_2px_0px_0px_#000000] disabled:opacity-50 cursor-pointer"
                >
                  {actionLoading ? 'Đang xử lý...' : 'Xác nhận thu hồi'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
