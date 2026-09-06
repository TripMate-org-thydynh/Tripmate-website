'use client';

import { useEffect, useState, useCallback } from 'react';
import {
  getSubscriptionsAction,
  getSubscriptionDetailAction,
  extendSubscriptionAction,
  revokeSubscriptionAction,
} from '@/app/actions';
import {
  RefreshCw,
  Download,
  Users,
  Eye,
  PlusCircle,
  XCircle,
  AlertTriangle,
  History,
} from 'lucide-react';
import ErrorState from '@/components/ErrorState';
import { exportToCSV } from '@/lib/exportCsv';
import ToastContainer, { ToastMessage } from '@/components/ui/Toast';
import { AdminButton } from '@/components/admin/AdminButton';
import { AdminSelect, AdminTextarea } from '@/components/admin/AdminInput';
import { AdminBadge } from '@/components/admin/AdminBadge';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { AdminFilterBar } from '@/components/admin/AdminFilterBar';
import {
  AdminTable,
  AdminTableHeader,
  AdminTableRow,
  AdminTableHead,
  AdminTableCell,
  AdminTableSkeleton,
  AdminTableEmpty,
} from '@/components/admin/AdminTable';
import { AdminPagination } from '@/components/admin/AdminPagination';
import { AdminTabs } from '@/components/admin/AdminTabs';
import { AdminRowActions } from '@/components/admin/AdminRowActions';
import { AdminDrawer } from '@/components/admin/AdminDrawer';
import { AdminModal } from '@/components/admin/AdminModal';

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
  const [limit, setLimit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState('');
  const [planFilter, setPlanFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Modals & Drawer states
  const [detailModalItem, setDetailModalItem] = useState<SubscriptionDetail | null>(null);
  const [extendModalItem, setExtendModalItem] = useState<SubscriptionItem | null>(null);
  const [extendMonths, setExtendMonths] = useState(1);
  const [extendReason, setExtendReason] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  const [revokeModalItem, setRevokeModalItem] = useState<SubscriptionItem | null>(null);
  const [revokeReason, setRevokeReason] = useState('');

  // Toast state
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    setToasts((prev) => [...prev, { id: `${Date.now()}-${prev.length}`, message, type }]);
  };

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
      limit,
    });

    if (res.success && res.data) {
      const payload = res.data.data || res.data;
      const nowMs = Date.now();
      const itemsWithRemaining = (payload.items || []).map((sub: SubscriptionItem) => {
        const endMs = new Date(sub.currentPeriodEnd).getTime();
        const diff = Math.ceil((endMs - nowMs) / (1000 * 60 * 60 * 24));
        let remainingText = `Còn ${diff} ngày`;
        if (diff < 0) remainingText = 'Đã hết hạn';
        else if (diff === 0) remainingText = 'Hết hạn hôm nay';
        return { ...sub, remainingText };
      });
      setSubscriptions(itemsWithRemaining);
      setTotal(payload.total ?? itemsWithRemaining.length ?? 0);
      setTotalPages(payload.totalPages || 1);
    } else {
      setError(res.error || 'Không thể tải danh sách gói đăng ký');
    }
    setLoading(false);
  }, [page, limit, planFilter, statusFilter, search]);

  useEffect(() => {
    fetchSubscriptions();
  }, [fetchSubscriptions]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchSubscriptions();
  };

  // Open Detail Drawer
  const handleOpenDetail = async (sub: SubscriptionItem) => {
    const res = await getSubscriptionDetailAction(sub.id);
    if (res.success && res.data) {
      setDetailModalItem(res.data);
    } else {
      showToast(res.error || 'Không thể tải chi tiết gói', 'error');
    }
  };

  // Handle Extend
  const handleConfirmExtend = async () => {
    if (!extendModalItem) return;
    if (!extendReason.trim()) {
      showToast('Vui lòng nhập lý do gia hạn', 'error');
      return;
    }

    setActionLoading(true);
    const res = await extendSubscriptionAction(extendModalItem.id, extendMonths, extendReason);
    setActionLoading(false);

    if (res.success) {
      showToast('Gia hạn gói thành công!', 'success');
      setExtendModalItem(null);
      setExtendReason('');
      if (detailModalItem?.id === extendModalItem.id) {
        handleOpenDetail(extendModalItem);
      }
      fetchSubscriptions();
    } else {
      showToast(res.error || 'Gia hạn gói thất bại', 'error');
    }
  };

  // Handle Revoke
  const handleConfirmRevoke = async () => {
    if (!revokeModalItem) return;
    if (!revokeReason.trim()) {
      showToast('Vui lòng nhập lý do thu hồi', 'error');
      return;
    }

    setActionLoading(true);
    const res = await revokeSubscriptionAction(revokeModalItem.id, revokeReason);
    setActionLoading(false);

    if (res.success) {
      showToast('Thu hồi gói thành công!', 'success');
      setRevokeModalItem(null);
      setRevokeReason('');
      if (detailModalItem?.id === revokeModalItem.id) {
        setDetailModalItem(null);
      }
      fetchSubscriptions();
    } else {
      showToast(res.error || 'Thu hồi gói thất bại', 'error');
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
      'Kỳ bắt đầu': formatDate(s.currentPeriodStart),
      'Kỳ kết thúc': formatDate(s.currentPeriodEnd),
      'Cổng thanh toán': s.provider,
      'Mã ngoài': s.externalId || '',
      'Số ghế': `${s.usedSeatsCount}/${s.seats}`,
    }));
    exportToCSV('tripmate_subscriptions', exportRows);
  };

  return (
    <div className="flex flex-col gap-6">
      <ToastContainer
        toasts={toasts}
        onDismiss={(id) => setToasts((prev) => prev.filter((t) => t.id !== id))}
      />

      {/* Header */}
      <AdminPageHeader
        title="Quản trị Gói Đăng Ký"
        description={`Quản lý gói hội viên PLUS & SQUAD Pass, kiểm soát ghế nhóm và can thiệp vận hành (${total} gói).`}
      >
        <AdminButton
          variant="outline"
          size="sm"
          onClick={fetchSubscriptions}
          loading={loading}
          icon={<RefreshCw className="w-3.5 h-3.5" />}
        >
          Tải lại
        </AdminButton>
        <AdminButton
          variant="secondary"
          size="sm"
          onClick={handleExportCSV}
          disabled={!subscriptions.length}
          icon={<Download className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />}
        >
          Xuất CSV
        </AdminButton>
      </AdminPageHeader>

      {/* Status Filter Tabs */}
      <AdminTabs
        activeTab={statusFilter || 'ALL'}
        onChange={(tab) => {
          setStatusFilter(tab === 'ALL' ? '' : tab);
          setPage(1);
        }}
        tabs={[
          { id: 'ALL', label: 'Tất cả gói' },
          { id: 'ACTIVE', label: 'Đang hoạt động' },
          { id: 'EXPIRING_SOON', label: 'Sắp hết hạn (7 ngày)' },
          { id: 'CANCELED', label: 'Chờ huỷ / Đã huỷ' },
          { id: 'EXPIRED', label: 'Đã hết hạn' },
        ]}
      />

      {/* Search & Filter Bar */}
      <AdminFilterBar
        search={search}
        onSearchChange={(val) => setSearch(val)}
        onSearchSubmit={handleSearchSubmit}
        searchPlaceholder="Tìm theo email, tên thành viên..."
      >
        <div className="flex items-center gap-2">
          <span className="text-xs text-[#475569] dark:text-[#94A3B8] whitespace-nowrap">Loại gói:</span>
          <AdminSelect
            value={planFilter}
            onChange={(e) => {
              setPlanFilter(e.target.value);
              setPage(1);
            }}
            className="w-36"
          >
            <option value="">Tất cả gói</option>
            <option value="PLUS">PLUS (Cá nhân)</option>
            <option value="SQUAD">SQUAD (Nhóm 5 ghế)</option>
          </AdminSelect>
        </div>
      </AdminFilterBar>

      {error && !loading && subscriptions.length === 0 ? (
        <ErrorState message={error} onRetry={fetchSubscriptions} />
      ) : (
        /* Data Table */
        <AdminTable>
          <AdminTableHeader>
            <tr>
              <AdminTableHead>Thành viên</AdminTableHead>
              <AdminTableHead>Gói & Ghế</AdminTableHead>
              <AdminTableHead>Trạng thái</AdminTableHead>
              <AdminTableHead>Cổng TT</AdminTableHead>
              <AdminTableHead>Kỳ hạn & Còn lại</AdminTableHead>
              <AdminTableHead align="right">Thao tác</AdminTableHead>
            </tr>
          </AdminTableHeader>

          {loading ? (
            <AdminTableSkeleton columns={6} rows={6} />
          ) : subscriptions.length === 0 ? (
            <AdminTableEmpty colSpan={6} message="Không tìm thấy gói đăng ký nào phù hợp" />
          ) : (
            <tbody>
              {subscriptions.map((sub) => {
                const isSquad = sub.plan === 'SQUAD';
                return (
                  <AdminTableRow key={sub.id}>
                    {/* Member info */}
                    <AdminTableCell>
                      <div
                        className="flex items-center gap-3 cursor-pointer group"
                        onClick={() => handleOpenDetail(sub)}
                      >
                        <div className="w-8 h-8 rounded-full bg-amber-500/15 text-amber-700 dark:text-amber-300 font-semibold text-xs flex items-center justify-center shrink-0 border border-amber-500/30">
                          {sub.user?.name ? sub.user.name.substring(0, 2).toUpperCase() : 'US'}
                        </div>
                        <div className="min-w-0">
                          <h4 className="font-semibold text-[#0F172A] dark:text-[#F8FAFC] group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors truncate">
                            {sub.user?.name || 'Thành viên'}
                          </h4>
                          <p className="text-[11px] text-[#475569] dark:text-[#94A3B8] truncate">
                            {sub.user?.email}
                          </p>
                        </div>
                      </div>
                    </AdminTableCell>

                    {/* Plan & Seats */}
                    <AdminTableCell>
                      <div className="flex items-center gap-1.5">
                        {isSquad ? (
                          <AdminBadge variant="primary">
                            SQUAD PASS ({sub.usedSeatsCount}/{sub.seats})
                          </AdminBadge>
                        ) : (
                          <AdminBadge variant="success">PLUS</AdminBadge>
                        )}
                      </div>
                    </AdminTableCell>

                    {/* Status */}
                    <AdminTableCell>
                      {sub.isEffectiveActive ? (
                        sub.isExpiringSoon ? (
                          <AdminBadge variant="warning" dot pulse>
                            Sắp hết hạn
                          </AdminBadge>
                        ) : sub.cancelAtPeriodEnd ? (
                          <AdminBadge variant="warning" dot>
                            Huỷ cuối kỳ
                          </AdminBadge>
                        ) : (
                          <AdminBadge variant="success" dot>
                            Đang hoạt động
                          </AdminBadge>
                        )
                      ) : sub.status === 'CANCELED' ? (
                        <AdminBadge variant="danger">Đã huỷ</AdminBadge>
                      ) : (
                        <AdminBadge variant="neutral">Hết hạn</AdminBadge>
                      )}
                    </AdminTableCell>

                    {/* Provider */}
                    <AdminTableCell>
                      <span className="font-mono text-xs text-slate-600 dark:text-slate-400 uppercase">
                        {sub.provider}
                      </span>
                    </AdminTableCell>

                    {/* Period & Remaining */}
                    <AdminTableCell>
                      <div className="flex flex-col text-[11px]">
                        <span className="text-slate-700 dark:text-slate-300 font-medium">
                          {formatDate(sub.currentPeriodStart)} - {formatDate(sub.currentPeriodEnd)}
                        </span>
                        <span
                          className={`mt-0.5 font-medium ${
                            sub.isExpiringSoon
                              ? 'text-amber-600 dark:text-amber-400'
                              : 'text-slate-400 dark:text-slate-500'
                          }`}
                        >
                          {sub.remainingText}
                        </span>
                      </div>
                    </AdminTableCell>

                    {/* Actions Menu */}
                    <AdminTableCell align="right">
                      <AdminRowActions
                        quickAction={{
                          label: 'Xem chi tiết',
                          icon: <Eye className="w-3.5 h-3.5" />,
                          onClick: () => handleOpenDetail(sub),
                        }}
                        actions={[
                          {
                            label: 'Xem chi tiết',
                            icon: <Eye className="w-3.5 h-3.5 text-slate-400" />,
                            onClick: () => handleOpenDetail(sub),
                          },
                          {
                            label: 'Gia hạn gói',
                            icon: <PlusCircle className="w-3.5 h-3.5 text-emerald-500" />,
                            onClick: () => {
                              setExtendModalItem(sub);
                              setExtendMonths(1);
                              setExtendReason('');
                            },
                          },
                          {
                            label: 'Thu hồi gói',
                            icon: <XCircle className="w-3.5 h-3.5 text-rose-500" />,
                            onClick: () => {
                              setRevokeModalItem(sub);
                              setRevokeReason('');
                            },
                            variant: 'danger',
                            disabled: !sub.isEffectiveActive,
                          },
                        ]}
                      />
                    </AdminTableCell>
                  </AdminTableRow>
                );
              })}
            </tbody>
          )}
        </AdminTable>
      )}

      {/* Pagination */}
      <AdminPagination
        page={page}
        totalPages={totalPages}
        totalItems={total}
        limit={limit}
        onPageChange={setPage}
        onLimitChange={(l) => {
          setLimit(l);
          setPage(1);
        }}
        itemLabel="gói đăng ký"
      />

      {/* SUBSCRIPTION DETAIL DRAWER */}
      <AdminDrawer
        isOpen={!!detailModalItem}
        onClose={() => setDetailModalItem(null)}
        title={
          detailModalItem
            ? `Chi tiết Gói ${detailModalItem.plan} · ${detailModalItem.user?.name || 'Thành viên'}`
            : 'Chi tiết Gói'
        }
        description={detailModalItem ? `Mã gói: ${detailModalItem.id}` : undefined}
        size="lg"
        footer={
          detailModalItem && (
            <>
              <AdminButton
                variant="outline"
                size="sm"
                onClick={() => setDetailModalItem(null)}
              >
                Đóng
              </AdminButton>
              <AdminButton
                variant="secondary"
                size="sm"
                onClick={() => {
                  setExtendModalItem(detailModalItem);
                  setExtendMonths(1);
                  setExtendReason('');
                }}
                icon={<PlusCircle className="w-3.5 h-3.5 text-emerald-500" />}
              >
                Gia hạn
              </AdminButton>
              {detailModalItem.isEffectiveActive && (
                <AdminButton
                  variant="danger"
                  size="sm"
                  onClick={() => {
                    setRevokeModalItem(detailModalItem);
                    setRevokeReason('');
                  }}
                  icon={<XCircle className="w-3.5 h-3.5" />}
                >
                  Thu hồi gói
                </AdminButton>
              )}
            </>
          )
        }
      >
        {detailModalItem && (
          <div className="flex flex-col gap-6">
            {/* Metadata Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5">
              <div className="p-3 rounded-lg bg-slate-50 dark:bg-[#0D1424] border border-[#E2E8F0] dark:border-[#1E293B]">
                <span className="text-[10px] font-medium text-[#94A3B8] dark:text-[#64748B] uppercase block mb-1">
                  Loại gói
                </span>
                <AdminBadge variant={detailModalItem.plan === 'SQUAD' ? 'primary' : 'success'}>
                  {detailModalItem.plan} PASS
                </AdminBadge>
              </div>

              <div className="p-3 rounded-lg bg-slate-50 dark:bg-[#0D1424] border border-[#E2E8F0] dark:border-[#1E293B]">
                <span className="text-[10px] font-medium text-[#94A3B8] dark:text-[#64748B] uppercase block mb-1">
                  Trạng thái
                </span>
                <AdminBadge variant={detailModalItem.isEffectiveActive ? 'success' : 'neutral'} dot>
                  {detailModalItem.isEffectiveActive ? 'Hoạt động' : detailModalItem.status}
                </AdminBadge>
              </div>

              <div className="p-3 rounded-lg bg-slate-50 dark:bg-[#0D1424] border border-[#E2E8F0] dark:border-[#1E293B]">
                <span className="text-[10px] font-medium text-[#94A3B8] dark:text-[#64748B] uppercase block mb-1">
                  Ghế Squad
                </span>
                <span className="text-xs font-semibold text-[#0F172A] dark:text-[#F8FAFC]">
                  {detailModalItem.usedSeatsCount} / {detailModalItem.seats} ghế
                </span>
              </div>

              <div className="p-3 rounded-lg bg-slate-50 dark:bg-[#0D1424] border border-[#E2E8F0] dark:border-[#1E293B]">
                <span className="text-[10px] font-medium text-[#94A3B8] dark:text-[#64748B] uppercase block mb-1">
                  Kỳ bắt đầu
                </span>
                <span className="text-xs text-[#475569] dark:text-[#94A3B8]">
                  {formatDate(detailModalItem.currentPeriodStart)}
                </span>
              </div>

              <div className="p-3 rounded-lg bg-slate-50 dark:bg-[#0D1424] border border-[#E2E8F0] dark:border-[#1E293B]">
                <span className="text-[10px] font-medium text-[#94A3B8] dark:text-[#64748B] uppercase block mb-1">
                  Kỳ kết thúc
                </span>
                <span className="text-xs font-semibold text-[#0F172A] dark:text-[#F8FAFC]">
                  {formatDate(detailModalItem.currentPeriodEnd)}
                </span>
              </div>

              <div className="p-3 rounded-lg bg-slate-50 dark:bg-[#0D1424] border border-[#E2E8F0] dark:border-[#1E293B]">
                <span className="text-[10px] font-medium text-[#94A3B8] dark:text-[#64748B] uppercase block mb-1">
                  Cổng thanh toán
                </span>
                <span className="font-mono text-xs text-[#0F172A] dark:text-[#F8FAFC] uppercase">
                  {detailModalItem.provider}
                </span>
              </div>
            </div>

            {/* Squad Seats List (If SQUAD plan) */}
            {detailModalItem.plan === 'SQUAD' && (
              <div>
                <h4 className="text-xs font-semibold text-[#0F172A] dark:text-[#F8FAFC] mb-2 flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                  Danh sách Ghế Squad ({detailModalItem.squadSeats?.length || 0})
                </h4>

                {!detailModalItem.squadSeats || detailModalItem.squadSeats.length === 0 ? (
                  <p className="text-xs text-[#94A3B8] py-3 text-center bg-slate-50 dark:bg-[#0D1424] rounded-lg">
                    Chưa có thành viên nào nhận ghế trong nhóm.
                  </p>
                ) : (
                  <div className="divide-y divide-[#E2E8F0] dark:divide-[#1E293B] border border-[#E2E8F0] dark:border-[#1E293B] rounded-lg overflow-hidden">
                    {detailModalItem.squadSeats.map((seat) => (
                      <div
                        key={seat.id}
                        className="p-3 flex items-center justify-between text-xs bg-white dark:bg-[#111827]"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className="w-6 h-6 rounded-full bg-slate-100 dark:bg-[#0D1424] text-[#0F172A] dark:text-[#F8FAFC] font-bold text-[10px] flex items-center justify-center shrink-0">
                            {seat.user?.name ? seat.user.name.charAt(0) : 'U'}
                          </div>
                          <div className="min-w-0">
                            <span className="font-medium text-[#0F172A] dark:text-[#F8FAFC] block truncate">
                              {seat.user?.name || 'Thành viên'}
                            </span>
                            <span className="text-[10px] text-[#475569] dark:text-[#94A3B8] truncate block">
                              {seat.user?.email || 'n/a'}
                            </span>
                          </div>
                        </div>

                        <div className="text-right shrink-0">
                          {seat.revokedAt ? (
                            <AdminBadge variant="danger" size="xs">
                              Đã thu hồi
                            </AdminBadge>
                          ) : (
                            <AdminBadge variant="success" size="xs">
                              Đang dùng
                            </AdminBadge>
                          )}
                          <span className="text-[10px] text-[#94A3B8] dark:text-[#64748B] block mt-0.5">
                            Cấp: {formatDate(seat.grantedAt)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Audit Logs Timeline */}
            <div>
              <h4 className="text-xs font-semibold text-[#0F172A] dark:text-[#F8FAFC] mb-2 flex items-center gap-1.5">
                <History className="w-3.5 h-3.5 text-[#94A3B8]" />
                Lịch sử can thiệp Quản trị ({detailModalItem.auditLogs?.length || 0})
              </h4>

              {!detailModalItem.auditLogs || detailModalItem.auditLogs.length === 0 ? (
                <p className="text-xs text-[#94A3B8] py-3 text-center bg-slate-50 dark:bg-[#0D1424] rounded-lg">
                  Chưa có lịch sử thao tác nào từ Admin.
                </p>
              ) : (
                <div className="flex flex-col gap-2">
                  {detailModalItem.auditLogs.map((log) => (
                    <div
                      key={log.id}
                      className="p-3 rounded-lg border border-[#E2E8F0] dark:border-[#1E293B] bg-slate-50/50 dark:bg-[#0D1424]/60 text-xs"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <AdminBadge variant="neutral" size="xs">
                          {log.action}
                        </AdminBadge>
                        <span className="text-[10px] text-[#94A3B8] dark:text-[#64748B]">
                          {new Date(log.createdAt).toLocaleString('vi-VN')}
                        </span>
                      </div>
                      <p className="text-[#0F172A] dark:text-[#F8FAFC] mt-1">
                        Lý do: <b>{log.reason}</b>
                      </p>
                      {log.admin && (
                        <span className="text-[10px] text-[#475569] dark:text-[#94A3B8] block mt-0.5">
                          Admin thực hiện: {log.admin.name} ({log.admin.email})
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </AdminDrawer>

      {/* EXTEND SUBSCRIPTION MODAL */}
      <AdminModal
        isOpen={!!extendModalItem}
        onClose={() => setExtendModalItem(null)}
        title="Gia Hạn Gói Hội Viên"
        description={`Gia hạn thêm thời gian sử dụng cho ${extendModalItem?.user?.name || 'người dùng'}`}
      >
        <div className="flex flex-col gap-4">
          <AdminSelect
            label="Số tháng gia hạn"
            value={extendMonths}
            onChange={(e) => setExtendMonths(Number(e.target.value))}
            required
          >
            <option value={1}>+1 Tháng (30 ngày)</option>
            <option value={3}>+3 Tháng (90 ngày)</option>
            <option value={6}>+6 Tháng (180 ngày)</option>
            <option value={12}>+12 Tháng (365 ngày - 1 năm)</option>
          </AdminSelect>

          <AdminTextarea
            label="Lý do gia hạn (Bắt buộc)"
            value={extendReason}
            onChange={(e) => setExtendReason(e.target.value)}
            placeholder="VD: Đền bù sự cố mạng ngày 20/07, CSKH tặng ưu đãi khách VIP..."
            rows={3}
            required
          />

          <div className="flex justify-end gap-2.5 pt-4 border-t border-[#E2E8F0] dark:border-[#1E293B]">
            <AdminButton
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setExtendModalItem(null)}
            >
              Huỷ
            </AdminButton>
            <AdminButton
              type="button"
              variant="primary"
              size="sm"
              loading={actionLoading}
              onClick={handleConfirmExtend}
            >
              Xác nhận gia hạn
            </AdminButton>
          </div>
        </div>
      </AdminModal>

      {/* REVOKE SUBSCRIPTION MODAL */}
      <AdminModal
        isOpen={!!revokeModalItem}
        onClose={() => setRevokeModalItem(null)}
        title="Xác Nhận Thu Hồi Gói"
        description={`Thu hồi quyền lợi của ${revokeModalItem?.user?.name || 'người dùng'}. Hành động này sẽ có hiệu lực ngay lập tức.`}
      >
        <div className="flex flex-col gap-4">
          <div className="p-3 rounded-lg bg-[#EF4444]/10 border border-[#EF4444]/25 text-xs text-[#EF4444] flex items-start gap-2.5">
            <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>
              Người dùng và tất cả thành viên trong nhóm sẽ mất quyền lợi gói ngay lập tức.
            </span>
          </div>

          <AdminTextarea
            label="Lý do thu hồi gói (Bắt buộc)"
            value={revokeReason}
            onChange={(e) => setRevokeReason(e.target.value)}
            placeholder="VD: Vi phạm điều khoản sử dụng, hoàn tiền qua cổng ngân hàng..."
            rows={3}
            required
          />

          <div className="flex justify-end gap-2.5 pt-4 border-t border-[#E2E8F0] dark:border-[#1E293B]">
            <AdminButton
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setRevokeModalItem(null)}
            >
              Huỷ bỏ
            </AdminButton>
            <AdminButton
              type="button"
              variant="danger"
              size="sm"
              loading={actionLoading}
              onClick={handleConfirmRevoke}
            >
              Thu hồi ngay
            </AdminButton>
          </div>
        </div>
      </AdminModal>
    </div>
  );
}
