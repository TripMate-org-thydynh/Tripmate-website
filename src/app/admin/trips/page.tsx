'use client';

import { useEffect, useState, useCallback } from 'react';
import {
  getTripsAction,
  createTripAction,
  updateTripAction,
  deleteTripAction,
  getUsersAction,
} from '@/app/actions';
import {
  Plus,
  Trash2,
  Edit2,
  Calendar,
  MapPin,
  Download,
  Users as UsersIcon,
  Eye,
  RefreshCw,
} from 'lucide-react';
import ErrorState from '@/components/ErrorState';
import { exportToCSV } from '@/lib/exportCsv';
import ConfirmModal from '@/components/ui/ConfirmModal';
import ToastContainer, { ToastMessage } from '@/components/ui/Toast';
import { AdminButton } from '@/components/admin/AdminButton';
import { AdminInput, AdminSelect } from '@/components/admin/AdminInput';
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
import { AdminRowActions } from '@/components/admin/AdminRowActions';
import { AdminDrawer } from '@/components/admin/AdminDrawer';
import { AdminModal } from '@/components/admin/AdminModal';

interface TripItem {
  id: string;
  name: string;
  inviteCode: string;
  destination: string | null;
  vibe?: string | null;
  startDate: string;
  endDate: string;
  createdBy: string;
  description?: string | null;
  creator?: {
    id: string;
    name: string;
    username: string;
    email: string;
  };
  _count?: {
    members: number;
  };
}

export default function AdminTripsPage() {
  const [trips, setTrips] = useState<TripItem[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Toast state
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const addToast = (type: 'success' | 'error' | 'info', message: string) => {
    setToasts((prev) => [...prev, { id: `${Date.now()}-${Math.random()}`, type, message }]);
  };

  // Confirm Delete Modal state
  const [confirmDeleteState, setConfirmDeleteState] = useState<{
    isOpen: boolean;
    tripId: string;
    tripName: string;
  }>({
    isOpen: false,
    tripId: '',
    tripName: '',
  });

  // Trip Detail View Drawer state
  const [viewTrip, setViewTrip] = useState<TripItem | null>(null);

  // Create / Edit Modal states
  const [modalOpen, setModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [formName, setFormName] = useState('');
  const [formDestination, setFormDestination] = useState('');
  const [formStartDate, setFormStartDate] = useState('');
  const [formEndDate, setFormEndDate] = useState('');
  const [formCreatorId, setFormCreatorId] = useState('');

  const fetchTrips = useCallback(async () => {
    setLoading(true);
    setError(null);
    const res = await getTripsAction(search, page, limit);
    if (res.success && res.data) {
      const payload = res.data?.data ?? res.data ?? {};
      const items: TripItem[] = Array.isArray(payload?.items)
        ? payload.items
        : Array.isArray(payload)
        ? payload
        : [];
      setTrips(items);
      setTotal(payload?.total ?? items.length ?? 0);
      setTotalPages(payload?.totalPages || 1);
    } else {
      setError(res.error || 'Không thể lấy danh sách chuyến đi');
      setTrips([]);
      setTotal(0);
    }
    setLoading(false);
  }, [search, page, limit]);

  const fetchUsersList = async () => {
    try {
      const res = await getUsersAction(undefined, undefined, 1, 100);
      if (res.success && res.data) {
        const payload = res.data?.data ?? res.data ?? {};
        const items = Array.isArray(payload?.items)
          ? payload.items
          : Array.isArray(payload)
          ? payload
          : [];
        setUsers(items);
        if (items.length > 0) {
          setFormCreatorId(items[0].id);
        }
      } else {
        setUsers([]);
      }
    } catch {
      setUsers([]);
    }
  };

  useEffect(() => {
    fetchTrips();
  }, [fetchTrips]);

  useEffect(() => {
    fetchUsersList();
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchTrips();
  };

  const openCreateModal = () => {
    setIsEditing(false);
    setEditingId(null);
    setFormName('');
    setFormDestination('');
    setFormStartDate('');
    setFormEndDate('');
    if (users.length > 0) setFormCreatorId(users[0].id);
    setModalOpen(true);
  };

  const openEditModal = (trip: TripItem) => {
    setIsEditing(true);
    setEditingId(trip.id);
    setFormName(trip.name);
    setFormDestination(trip.destination || '');
    setFormStartDate(new Date(trip.startDate).toISOString().split('T')[0]);
    setFormEndDate(new Date(trip.endDate).toISOString().split('T')[0]);
    setFormCreatorId(trip.createdBy);
    setModalOpen(true);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    const payload = {
      name: formName,
      destination: formDestination || undefined,
      startDate: formStartDate,
      endDate: formEndDate,
      createdBy: formCreatorId,
    };

    if (isEditing && editingId) {
      const res = await updateTripAction(editingId, payload);
      if (res.success) {
        setModalOpen(false);
        addToast('success', 'Đã cập nhật chuyến đi thành công');
        fetchTrips();
      } else {
        addToast('error', res.error || 'Cập nhật chuyến đi thất bại');
      }
    } else {
      const res = await createTripAction(payload);
      if (res.success) {
        setModalOpen(false);
        addToast('success', 'Đã tạo chuyến đi mới thành công');
        fetchTrips();
      } else {
        addToast('error', res.error || 'Tạo chuyến đi thất bại');
      }
    }
    setSubmitting(false);
  };

  const executeDeleteTrip = async () => {
    const id = confirmDeleteState.tripId;
    setConfirmDeleteState({ isOpen: false, tripId: '', tripName: '' });
    const res = await deleteTripAction(id);
    if (res.success) {
      addToast('success', 'Đã xoá chuyến đi thành công');
      if (viewTrip?.id === id) setViewTrip(null);
      fetchTrips();
    } else {
      addToast('error', res.error || 'Xoá chuyến đi thất bại');
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <ToastContainer
        toasts={toasts}
        onDismiss={(id) => setToasts((prev) => prev.filter((t) => t.id !== id))}
      />

      <ConfirmModal
        isOpen={confirmDeleteState.isOpen}
        title="Xoá Chuyến Đi"
        message={`Bạn có chắc chắn muốn xoá chuyến đi "${confirmDeleteState.tripName}"? Mọi dữ liệu chi tiêu và khoảnh khắc liên quan sẽ bị xoá mềm.`}
        isDestructive={true}
        onConfirm={executeDeleteTrip}
        onCancel={() => setConfirmDeleteState({ isOpen: false, tripId: '', tripName: '' })}
      />

      {/* Page Header */}
      <AdminPageHeader
        title="Quản lý Chuyến đi"
        description={`Danh sách hành trình du lịch của các nhóm bạn trẻ (${total} chuyến đi).`}
      >
        <AdminButton
          variant="outline"
          size="sm"
          onClick={fetchTrips}
          loading={loading}
          icon={<RefreshCw className="w-3.5 h-3.5" />}
        >
          Tải lại
        </AdminButton>
        <AdminButton
          variant="secondary"
          size="sm"
          onClick={() => exportToCSV('tripmate_trips', trips)}
          disabled={!trips.length}
          icon={<Download className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />}
        >
          Xuất CSV
        </AdminButton>
        <AdminButton
          variant="primary"
          size="sm"
          onClick={openCreateModal}
          icon={<Plus className="w-3.5 h-3.5" />}
        >
          Tạo Chuyến Đi
        </AdminButton>
      </AdminPageHeader>

      {/* Search & Filter Bar */}
      <AdminFilterBar
        search={search}
        onSearchChange={(val) => setSearch(val)}
        onSearchSubmit={handleSearchSubmit}
        searchPlaceholder="Tìm theo tên chuyến, điểm đến..."
      />

      {error && !loading && trips.length === 0 ? (
        <ErrorState message={error} onRetry={fetchTrips} />
      ) : (
        /* Data Table */
        <AdminTable>
          <AdminTableHeader>
            <tr>
              <AdminTableHead>Chuyến đi</AdminTableHead>
              <AdminTableHead>Điểm đến</AdminTableHead>
              <AdminTableHead>Thời gian</AdminTableHead>
              <AdminTableHead>Người tạo</AdminTableHead>
              <AdminTableHead align="center">Thành viên</AdminTableHead>
              <AdminTableHead align="right">Thao tác</AdminTableHead>
            </tr>
          </AdminTableHeader>

          {loading ? (
            <AdminTableSkeleton columns={6} rows={6} />
          ) : trips.length === 0 ? (
            <AdminTableEmpty colSpan={6} message="Không tìm thấy chuyến đi nào phù hợp" />
          ) : (
            <tbody>
              {trips.map((trip) => (
                <AdminTableRow key={trip.id}>
                  {/* Trip Name & Invite Code */}
                  <AdminTableCell>
                    <div
                      className="flex flex-col gap-0.5 cursor-pointer group"
                      onClick={() => setViewTrip(trip)}
                    >
                      <h4 className="font-semibold text-[#0F172A] dark:text-[#F8FAFC] group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                        {trip.name}
                      </h4>
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono text-[10px] text-[#475569] dark:text-[#94A3B8] bg-slate-100 dark:bg-[#1E293B] px-1.5 py-0.2 rounded-sm border border-[#E2E8F0] dark:border-[#1E293B]">
                          MÃ: {trip.inviteCode}
                        </span>
                      </div>
                    </div>
                  </AdminTableCell>

                  {/* Destination */}
                  <AdminTableCell>
                    <div className="flex items-center gap-1.5 text-[#475569] dark:text-[#94A3B8]">
                      <MapPin className="w-3.5 h-3.5 text-[#94A3B8] shrink-0" />
                      <span>{trip.destination || 'Chưa xác định'}</span>
                    </div>
                  </AdminTableCell>

                  {/* Date Range */}
                  <AdminTableCell>
                    <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 text-[11px]">
                      <Calendar className="w-3.5 h-3.5 shrink-0 text-slate-400" />
                      <span>
                        {new Date(trip.startDate).toLocaleDateString('vi-VN')} -{' '}
                        {new Date(trip.endDate).toLocaleDateString('vi-VN')}
                      </span>
                    </div>
                  </AdminTableCell>

                  {/* Creator */}
                  <AdminTableCell>
                    <span className="font-medium text-slate-800 dark:text-slate-200">
                      {trip.creator?.name || 'n/a'}
                    </span>
                  </AdminTableCell>

                  {/* Members count badge */}
                  <AdminTableCell align="center">
                    <AdminBadge variant="neutral" icon={<UsersIcon className="w-3 h-3" />}>
                      {trip._count?.members ?? 0}
                    </AdminBadge>
                  </AdminTableCell>

                  {/* Row Actions */}
                  <AdminTableCell align="right">
                    <AdminRowActions
                      quickAction={{
                        label: 'Xem chi tiết',
                        icon: <Eye className="w-3.5 h-3.5" />,
                        onClick: () => setViewTrip(trip),
                      }}
                      actions={[
                        {
                          label: 'Xem chi tiết',
                          icon: <Eye className="w-3.5 h-3.5 text-slate-400" />,
                          onClick: () => setViewTrip(trip),
                        },
                        {
                          label: 'Sửa chuyến đi',
                          icon: <Edit2 className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />,
                          onClick: () => openEditModal(trip),
                        },
                        {
                          label: 'Xoá chuyến đi',
                          icon: <Trash2 className="w-3.5 h-3.5 text-rose-500" />,
                          onClick: () =>
                            setConfirmDeleteState({
                              isOpen: true,
                              tripId: trip.id,
                              tripName: trip.name,
                            }),
                          variant: 'danger',
                        },
                      ]}
                    />
                  </AdminTableCell>
                </AdminTableRow>
              ))}
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
        itemLabel="chuyến đi"
      />

      {/* TRIP DETAIL QUICK-VIEW DRAWER */}
      <AdminDrawer
        isOpen={!!viewTrip}
        onClose={() => setViewTrip(null)}
        title={viewTrip?.name || 'Chi tiết Chuyến đi'}
        description={`Mã mời: ${viewTrip?.inviteCode || ''}`}
        footer={
          viewTrip && (
            <>
              <AdminButton
                variant="outline"
                size="sm"
                onClick={() => setViewTrip(null)}
              >
                Đóng
              </AdminButton>
              <AdminButton
                variant="secondary"
                size="sm"
                onClick={() => {
                  const t = viewTrip;
                  setViewTrip(null);
                  openEditModal(t);
                }}
                icon={<Edit2 className="w-3.5 h-3.5" />}
              >
                Chỉnh sửa
              </AdminButton>
              <AdminButton
                variant="danger"
                size="sm"
                onClick={() => {
                  const t = viewTrip;
                  setConfirmDeleteState({
                    isOpen: true,
                    tripId: t.id,
                    tripName: t.name,
                  });
                }}
                icon={<Trash2 className="w-3.5 h-3.5" />}
              >
                Xoá
              </AdminButton>
            </>
          )
        }
      >
        {viewTrip && (
          <div className="flex flex-col gap-6">
            {/* Metadata Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 rounded-lg bg-slate-50 dark:bg-[#0D1424] border border-[#E2E8F0] dark:border-[#1E293B]">
                <span className="text-[10px] font-medium text-[#94A3B8] dark:text-[#64748B] uppercase block mb-1">
                  Điểm đến
                </span>
                <span className="text-xs font-semibold text-[#0F172A] dark:text-[#F8FAFC]">
                  {viewTrip.destination || 'Chưa cập nhật'}
                </span>
              </div>
              <div className="p-3 rounded-lg bg-slate-50 dark:bg-[#0D1424] border border-[#E2E8F0] dark:border-[#1E293B]">
                <span className="text-[10px] font-medium text-[#94A3B8] dark:text-[#64748B] uppercase block mb-1">
                  Vibe Chuyến đi
                </span>
                <span className="text-xs font-semibold text-[#0F172A] dark:text-[#F8FAFC] uppercase">
                  {viewTrip.vibe || 'CHILL'}
                </span>
              </div>
              <div className="p-3 rounded-lg bg-slate-50 dark:bg-[#0D1424] border border-[#E2E8F0] dark:border-[#1E293B]">
                <span className="text-[10px] font-medium text-[#94A3B8] dark:text-[#64748B] uppercase block mb-1">
                  Thời gian
                </span>
                <span className="text-xs text-[#0F172A] dark:text-[#F8FAFC]">
                  {new Date(viewTrip.startDate).toLocaleDateString('vi-VN')} -{' '}
                  {new Date(viewTrip.endDate).toLocaleDateString('vi-VN')}
                </span>
              </div>
              <div className="p-3 rounded-lg bg-slate-50 dark:bg-[#0D1424] border border-[#E2E8F0] dark:border-[#1E293B]">
                <span className="text-[10px] font-medium text-[#94A3B8] dark:text-[#64748B] uppercase block mb-1">
                  Thành viên
                </span>
                <span className="text-xs font-semibold text-amber-600 dark:text-amber-400">
                  {viewTrip._count?.members ?? 0} người tham gia
                </span>
              </div>
            </div>

            {/* Creator Card */}
            <div className="p-3.5 rounded-lg border border-[#E2E8F0] dark:border-[#1E293B] bg-white dark:bg-[#0D1424] flex items-center justify-between">
              <div>
                <span className="text-[10px] font-medium text-[#94A3B8] dark:text-[#64748B] uppercase block">
                  Người khởi tạo (Creator)
                </span>
                <p className="text-xs font-semibold text-[#0F172A] dark:text-[#F8FAFC] mt-0.5">
                  {viewTrip.creator?.name || 'Thành viên'}
                </p>
                <p className="text-[11px] text-[#475569] dark:text-[#94A3B8]">
                  {viewTrip.creator?.email || 'n/a'}
                </p>
              </div>
              <span className="font-mono text-xs text-[#94A3B8] dark:text-[#64748B]">
                @{viewTrip.creator?.username || 'n/a'}
              </span>
            </div>

            {/* Description */}
            {viewTrip.description && (
              <div>
                <span className="text-xs font-medium text-[#0F172A] dark:text-[#F8FAFC] block mb-1.5">
                  Mô tả hành trình
                </span>
                <p className="text-xs text-[#475569] dark:text-[#94A3B8] bg-slate-50 dark:bg-[#0D1424] p-3 rounded-lg border border-[#E2E8F0] dark:border-[#1E293B] leading-relaxed">
                  {viewTrip.description}
                </p>
              </div>
            )}
          </div>
        )}
      </AdminDrawer>

      {/* CREATE / EDIT TRIP MODAL */}
      <AdminModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={isEditing ? 'Cập nhật Chuyến đi' : 'Tạo Chuyến đi Mới'}
        description="Điền thông tin hành trình và phân công người khởi tạo"
      >
        <form onSubmit={handleFormSubmit} className="flex flex-col gap-4">
          <AdminInput
            label="Tên chuyến đi"
            value={formName}
            onChange={(e) => setFormName(e.target.value)}
            placeholder="VD: Phượt Đà Lạt Săn Mây"
            required
          />

          <AdminInput
            label="Điểm đến"
            value={formDestination}
            onChange={(e) => setFormDestination(e.target.value)}
            placeholder="VD: Đà Lạt, Lâm Đồng"
          />

          <div className="grid grid-cols-2 gap-4">
            <AdminInput
              label="Ngày đi"
              type="date"
              value={formStartDate}
              onChange={(e) => setFormStartDate(e.target.value)}
              required
            />
            <AdminInput
              label="Ngày về"
              type="date"
              value={formEndDate}
              onChange={(e) => setFormEndDate(e.target.value)}
              required
            />
          </div>

          <AdminSelect
            label="Người phụ trách (Creator)"
            value={formCreatorId}
            onChange={(e) => setFormCreatorId(e.target.value)}
            required
          >
            {users.map((u) => (
              <option key={u.id} value={u.id}>
                {u.name || u.email} (@{u.username || 'n/a'})
              </option>
            ))}
          </AdminSelect>

          <div className="flex justify-end gap-2.5 pt-4 mt-2 border-t border-[#E2E8F0] dark:border-[#1E293B]">
            <AdminButton
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setModalOpen(false)}
            >
              Huỷ
            </AdminButton>
            <AdminButton
              type="submit"
              variant="primary"
              size="sm"
              loading={submitting}
            >
              {isEditing ? 'Lưu thay đổi' : 'Tạo chuyến đi'}
            </AdminButton>
          </div>
        </form>
      </AdminModal>
    </div>
  );
}
