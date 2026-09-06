'use client';

import { useEffect, useState, useCallback } from 'react';
import {
  getReservationsAction,
  createReservationAction,
  updateReservationAction,
  deleteReservationAction,
  getTripsAction,
  getUsersAction,
} from '@/app/actions';
import {
  Plus,
  Trash2,
  Edit2,
  Plane,
  Hotel,
  Coffee,
  Ticket,
  Car,
  Train,
  HelpCircle,
  Download,
  MapPin,
  RefreshCw,
  Eye,
  CreditCard,
  Hash,
  Compass,
} from 'lucide-react';
import ErrorState from '@/components/ErrorState';
import { exportToCSV } from '@/lib/exportCsv';
import ConfirmModal from '@/components/ui/ConfirmModal';
import ToastContainer, { ToastMessage } from '@/components/ui/Toast';
import { AdminButton } from '@/components/admin/AdminButton';
import { AdminInput, AdminSelect } from '@/components/admin/AdminInput';
import { AdminBadge, AdminBadgeVariant } from '@/components/admin/AdminBadge';
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

const RESERVATION_TYPES = [
  'FLIGHT',
  'TRAIN',
  'BUS',
  'HOTEL',
  'RESTAURANT',
  'CAR',
  'EVENT',
  'ATTRACTION',
  'OTHER',
];

const TYPE_CONFIG: Record<
  string,
  { label: string; icon: any; variant: AdminBadgeVariant }
> = {
  FLIGHT: { label: 'Máy bay', icon: Plane, variant: 'primary' },
  TRAIN: { label: 'Tàu hoả', icon: Train, variant: 'warning' },
  BUS: { label: 'Xe khách', icon: Car, variant: 'info' },
  HOTEL: { label: 'Khách sạn', icon: Hotel, variant: 'neutral' },
  RESTAURANT: { label: 'Nhà hàng', icon: Coffee, variant: 'success' },
  CAR: { label: 'Thuê xe', icon: Car, variant: 'warning' },
  EVENT: { label: 'Sự kiện', icon: Ticket, variant: 'info' },
  ATTRACTION: { label: 'Tham quan', icon: Ticket, variant: 'primary' },
  OTHER: { label: 'Khác', icon: HelpCircle, variant: 'neutral' },
};

interface ReservationItem {
  id: string;
  tripId: string;
  addedBy: string;
  title: string;
  type: string;
  location?: string | null;
  confirmationNumber?: string | null;
  price?: number | null;
  createdAt: string;
  trip?: {
    id: string;
    name: string;
  };
  user?: {
    id: string;
    name: string;
    email: string;
  };
}

export default function AdminReservationsPage() {
  const [reservations, setReservations] = useState<ReservationItem[]>([]);
  const [trips, setTrips] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Quick view drawer state
  const [viewItem, setViewItem] = useState<ReservationItem | null>(null);

  // Toast state
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const addToast = (type: 'success' | 'error' | 'info', message: string) => {
    setToasts((prev) => [...prev, { id: `${Date.now()}-${Math.random()}`, type, message }]);
  };

  // Confirm delete state
  const [confirmDelete, setConfirmDelete] = useState<{
    isOpen: boolean;
    id: string;
    title: string;
  }>({
    isOpen: false,
    id: '',
    title: '',
  });

  // Form states
  const [modalOpen, setModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [formTitle, setFormTitle] = useState('');
  const [formType, setFormType] = useState('OTHER');
  const [formLocation, setFormLocation] = useState('');
  const [formConfNum, setFormConfNum] = useState('');
  const [formPrice, setFormPrice] = useState('');
  const [formTripId, setFormTripId] = useState('');
  const [formAddedBy, setFormAddedBy] = useState('');

  const fetchReservations = useCallback(async () => {
    setLoading(true);
    setError(null);
    const res = await getReservationsAction(page, limit);
    if (res.success && res.data) {
      const payload = res.data.data || res.data;
      let items: ReservationItem[] = payload.items || (Array.isArray(payload) ? payload : []);
      if (typeFilter) {
        items = items.filter((r) => r.type === typeFilter);
      }
      if (search) {
        const query = search.toLowerCase();
        items = items.filter(
          (r) =>
            r.title?.toLowerCase().includes(query) ||
            r.confirmationNumber?.toLowerCase().includes(query) ||
            r.location?.toLowerCase().includes(query)
        );
      }
      setReservations(items);
      setTotal(payload.total ?? items.length ?? 0);
      setTotalPages(payload.totalPages || 1);
    } else {
      setError(res.error || 'Không thể lấy danh sách đặt chỗ');
    }
    setLoading(false);
  }, [page, limit, typeFilter, search]);

  const fetchOptions = async () => {
    const [resTrips, resUsers] = await Promise.all([
      getTripsAction(undefined, 1, 100),
      getUsersAction(undefined, undefined, 1, 100),
    ]);
    if (resTrips.success && resTrips.data) {
      const p = resTrips.data.data || resTrips.data;
      const items = p.items || (Array.isArray(p) ? p : []);
      setTrips(items);
      if (items.length > 0) setFormTripId(items[0].id);
    }
    if (resUsers.success && resUsers.data) {
      const p = resUsers.data.data || resUsers.data;
      const items = p.items || (Array.isArray(p) ? p : []);
      setUsers(items);
      if (items.length > 0) setFormAddedBy(items[0].id);
    }
  };

  useEffect(() => {
    fetchReservations();
  }, [fetchReservations]);

  useEffect(() => {
    fetchOptions();
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchReservations();
  };

  const openCreateModal = () => {
    setIsEditing(false);
    setEditingId(null);
    setFormTitle('');
    setFormType('OTHER');
    setFormLocation('');
    setFormConfNum('');
    setFormPrice('');
    if (trips.length > 0) setFormTripId(trips[0].id);
    if (users.length > 0) setFormAddedBy(users[0].id);
    setModalOpen(true);
  };

  const openEditModal = (r: ReservationItem) => {
    setIsEditing(true);
    setEditingId(r.id);
    setFormTitle(r.title);
    setFormType(r.type);
    setFormLocation(r.location || '');
    setFormConfNum(r.confirmationNumber || '');
    setFormPrice(r.price ? String(r.price) : '');
    setFormTripId(r.tripId);
    setFormAddedBy(r.addedBy);
    setModalOpen(true);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    const payload = {
      tripId: formTripId,
      addedBy: formAddedBy,
      title: formTitle,
      type: formType,
      location: formLocation || undefined,
      confirmationNumber: formConfNum || undefined,
      price: formPrice ? Number(formPrice) : undefined,
    };

    if (isEditing && editingId) {
      const res = await updateReservationAction(editingId, payload);
      if (res.success) {
        setModalOpen(false);
        addToast('success', 'Đã cập nhật phiếu đặt chỗ thành công');
        fetchReservations();
      } else {
        addToast('error', res.error || 'Cập nhật đặt chỗ thất bại');
      }
    } else {
      const res = await createReservationAction(payload);
      if (res.success) {
        setModalOpen(false);
        addToast('success', 'Đã tạo phiếu đặt chỗ mới thành công');
        fetchReservations();
      } else {
        addToast('error', res.error || 'Tạo đặt chỗ thất bại');
      }
    }
    setSubmitting(false);
  };

  const executeDelete = async () => {
    const id = confirmDelete.id;
    setConfirmDelete({ isOpen: false, id: '', title: '' });
    const res = await deleteReservationAction(id);
    if (res.success) {
      addToast('success', 'Đã xoá phiếu đặt chỗ thành công');
      if (viewItem?.id === id) setViewItem(null);
      fetchReservations();
    } else {
      addToast('error', res.error || 'Xoá đặt chỗ thất bại');
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <ToastContainer
        toasts={toasts}
        onDismiss={(id) => setToasts((prev) => prev.filter((t) => t.id !== id))}
      />

      <ConfirmModal
        isOpen={confirmDelete.isOpen}
        title="Xoá Phiếu Đặt Chỗ"
        message={`Bạn có chắc chắn muốn xoá phiếu đặt chỗ "${confirmDelete.title}"?`}
        isDestructive={true}
        onConfirm={executeDelete}
        onCancel={() => setConfirmDelete({ isOpen: false, id: '', title: '' })}
      />

      {/* Header */}
      <AdminPageHeader
        title="Quản lý Đặt chỗ"
        description="Vé máy bay, khách sạn, nhà hàng và phiếu đặt chỗ được trích xuất tự động qua AI."
      >
        <AdminButton
          variant="outline"
          size="sm"
          onClick={fetchReservations}
          loading={loading}
          icon={<RefreshCw className="w-3.5 h-3.5" />}
        >
          Tải lại
        </AdminButton>
        <AdminButton
          variant="secondary"
          size="sm"
          onClick={() => exportToCSV('tripmate_reservations', reservations)}
          disabled={!reservations.length}
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
          Thêm Đặt Chỗ
        </AdminButton>
      </AdminPageHeader>

      {/* Filter and Search Bar */}
      <AdminFilterBar
        search={search}
        onSearchChange={(val) => setSearch(val)}
        onSearchSubmit={handleSearchSubmit}
        searchPlaceholder="Tìm theo tiêu đề, mã vé, địa điểm..."
      >
        <div className="flex items-center gap-2">
          <span className="text-xs text-[#475569] dark:text-[#94A3B8] whitespace-nowrap">Loại dịch vụ:</span>
          <AdminSelect
            value={typeFilter}
            onChange={(e) => {
              setTypeFilter(e.target.value);
              setPage(1);
            }}
            className="w-36"
          >
            <option value="">Tất cả loại</option>
            {RESERVATION_TYPES.map((t) => (
              <option key={t} value={t}>
                {TYPE_CONFIG[t]?.label || t}
              </option>
            ))}
          </AdminSelect>
        </div>
      </AdminFilterBar>

      {error && !loading && reservations.length === 0 ? (
        <ErrorState message={error} onRetry={fetchReservations} />
      ) : (
        /* Data Table */
        <AdminTable>
          <AdminTableHeader>
            <tr>
              <AdminTableHead>Dịch vụ / Tiêu đề</AdminTableHead>
              <AdminTableHead>Loại</AdminTableHead>
              <AdminTableHead>Địa điểm</AdminTableHead>
              <AdminTableHead>Chi phí</AdminTableHead>
              <AdminTableHead>Chuyến đi</AdminTableHead>
              <AdminTableHead align="right">Thao tác</AdminTableHead>
            </tr>
          </AdminTableHeader>

          {loading ? (
            <AdminTableSkeleton columns={6} rows={6} />
          ) : reservations.length === 0 ? (
            <AdminTableEmpty colSpan={6} message="Không có phiếu đặt chỗ nào phù hợp" />
          ) : (
            <tbody>
              {reservations.map((item) => {
                const conf = TYPE_CONFIG[item.type] || TYPE_CONFIG.OTHER;
                const Icon = conf.icon;

                return (
                  <AdminTableRow key={item.id}>
                    {/* Title & Confirmation Number */}
                    <AdminTableCell>
                      <div
                        className="flex flex-col gap-0.5 cursor-pointer group"
                        onClick={() => setViewItem(item)}
                      >
                        <h4 className="font-semibold text-[#0F172A] dark:text-[#F8FAFC] group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                          {item.title}
                        </h4>
                        {item.confirmationNumber ? (
                          <span className="font-mono text-[10px] text-[#475569] dark:text-[#94A3B8] flex items-center gap-1">
                            <Hash className="w-2.5 h-2.5" />
                            {item.confirmationNumber}
                          </span>
                        ) : (
                          <span className="text-[10px] text-[#94A3B8] dark:text-[#64748B]">Không có mã xác nhận</span>
                        )}
                      </div>
                    </AdminTableCell>

                    {/* Type Badge */}
                    <AdminTableCell>
                      <AdminBadge
                        variant={conf.variant}
                        icon={<Icon className="w-3 h-3" />}
                      >
                        {conf.label}
                      </AdminBadge>
                    </AdminTableCell>

                    {/* Location */}
                    <AdminTableCell>
                      <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400 text-xs">
                        <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="truncate max-w-xs">{item.location || 'Chưa có'}</span>
                      </div>
                    </AdminTableCell>

                    {/* Price */}
                    <AdminTableCell>
                      <span className="font-semibold text-slate-900 dark:text-slate-100 text-xs">
                        {item.price
                          ? `${item.price.toLocaleString('vi-VN')} đ`
                          : 'Miễn phí / Chưa rõ'}
                      </span>
                    </AdminTableCell>

                    {/* Trip Name */}
                    <AdminTableCell>
                      <span className="text-slate-600 dark:text-slate-400 text-xs font-medium">
                        {item.trip?.name || 'n/a'}
                      </span>
                    </AdminTableCell>

                    {/* Row Actions */}
                    <AdminTableCell align="right">
                      <AdminRowActions
                        quickAction={{
                          label: 'Xem chi tiết',
                          icon: <Eye className="w-3.5 h-3.5" />,
                          onClick: () => setViewItem(item),
                        }}
                        actions={[
                          {
                            label: 'Xem chi tiết',
                            icon: <Eye className="w-3.5 h-3.5 text-slate-400" />,
                            onClick: () => setViewItem(item),
                          },
                          {
                            label: 'Chỉnh sửa phiếu',
                            icon: <Edit2 className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />,
                            onClick: () => openEditModal(item),
                          },
                          {
                            label: 'Xoá đặt chỗ',
                            icon: <Trash2 className="w-3.5 h-3.5 text-rose-500" />,
                            onClick: () =>
                              setConfirmDelete({
                                isOpen: true,
                                id: item.id,
                                title: item.title,
                              }),
                            variant: 'danger',
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
        itemLabel="phiếu đặt chỗ"
      />

      {/* QUICK VIEW DRAWER */}
      <AdminDrawer
        isOpen={!!viewItem}
        onClose={() => setViewItem(null)}
        title={viewItem?.title || 'Chi tiết Đặt chỗ'}
        description={viewItem?.confirmationNumber ? `Mã xác nhận: ${viewItem.confirmationNumber}` : undefined}
        footer={
          viewItem && (
            <>
              <AdminButton variant="outline" size="sm" onClick={() => setViewItem(null)}>
                Đóng
              </AdminButton>
              <AdminButton
                variant="secondary"
                size="sm"
                onClick={() => {
                  const it = viewItem;
                  setViewItem(null);
                  openEditModal(it);
                }}
                icon={<Edit2 className="w-3.5 h-3.5" />}
              >
                Chỉnh sửa
              </AdminButton>
              <AdminButton
                variant="danger"
                size="sm"
                onClick={() => {
                  const it = viewItem;
                  setConfirmDelete({
                    isOpen: true,
                    id: it.id,
                    title: it.title,
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
        {viewItem && (
          <div className="flex flex-col gap-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 rounded-lg bg-slate-50 dark:bg-[#0D1424] border border-[#E2E8F0] dark:border-[#1E293B]">
                <span className="text-[10px] font-medium text-[#94A3B8] dark:text-[#64748B] uppercase block mb-1">
                  Loại dịch vụ
                </span>
                <AdminBadge variant={TYPE_CONFIG[viewItem.type]?.variant || 'neutral'}>
                  {TYPE_CONFIG[viewItem.type]?.label || viewItem.type}
                </AdminBadge>
              </div>

              <div className="p-3 rounded-lg bg-slate-50 dark:bg-[#0D1424] border border-[#E2E8F0] dark:border-[#1E293B]">
                <span className="text-[10px] font-medium text-[#94A3B8] dark:text-[#64748B] uppercase block mb-1">
                  Chi phí
                </span>
                <span className="text-xs font-bold text-[#0F172A] dark:text-[#F8FAFC] flex items-center gap-1">
                  <CreditCard className="w-3.5 h-3.5 text-[#94A3B8]" />
                  {viewItem.price ? `${viewItem.price.toLocaleString('vi-VN')} đ` : 'Miễn phí'}
                </span>
              </div>

              <div className="p-3 rounded-lg bg-slate-50 dark:bg-[#0D1424] border border-[#E2E8F0] dark:border-[#1E293B]">
                <span className="text-[10px] font-medium text-[#94A3B8] dark:text-[#64748B] uppercase block mb-1">
                  Địa điểm
                </span>
                <span className="text-xs text-[#475569] dark:text-[#94A3B8] flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-[#94A3B8] shrink-0" />
                  {viewItem.location || 'Chưa cập nhật'}
                </span>
              </div>

              <div className="p-3 rounded-lg bg-slate-50 dark:bg-[#0D1424] border border-[#E2E8F0] dark:border-[#1E293B]">
                <span className="text-[10px] font-medium text-[#94A3B8] dark:text-[#64748B] uppercase block mb-1">
                  Chuyến đi
                </span>
                <span className="text-xs font-semibold text-amber-600 dark:text-amber-400 flex items-center gap-1">
                  <Compass className="w-3.5 h-3.5 shrink-0" />
                  {viewItem.trip?.name || 'n/a'}
                </span>
              </div>
            </div>

            <div className="p-3.5 rounded-lg border border-[#E2E8F0] dark:border-[#1E293B] bg-white dark:bg-[#0D1424]">
              <span className="text-[10px] font-medium text-[#94A3B8] dark:text-[#64748B] uppercase block mb-1">
                Người tạo phiếu
              </span>
              <p className="text-xs font-semibold text-[#0F172A] dark:text-[#F8FAFC]">
                {viewItem.user?.name || 'Thành viên'}
              </p>
              <p className="text-[11px] text-[#475569] dark:text-[#94A3B8]">{viewItem.user?.email || 'n/a'}</p>
            </div>
          </div>
        )}
      </AdminDrawer>

      {/* CREATE / EDIT MODAL */}
      <AdminModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={isEditing ? 'Cập nhật Phiếu Đặt Chỗ' : 'Tạo Phiếu Đặt Chỗ Mới'}
        description="Nhập thông tin xác nhận vé hoặc nơi lưu trú"
      >
        <form onSubmit={handleFormSubmit} className="flex flex-col gap-4">
          <AdminInput
            label="Tiêu đề phiếu đặt chỗ"
            value={formTitle}
            onChange={(e) => setFormTitle(e.target.value)}
            placeholder="VD: Vé máy bay Vietnam Airlines SG-HN"
            required
          />

          <div className="grid grid-cols-2 gap-4">
            <AdminSelect
              label="Loại dịch vụ"
              value={formType}
              onChange={(e) => setFormType(e.target.value)}
              required
            >
              {RESERVATION_TYPES.map((t) => (
                <option key={t} value={t}>
                  {TYPE_CONFIG[t]?.label || t}
                </option>
              ))}
            </AdminSelect>

            <AdminInput
              label="Mã đặt chỗ / Vé"
              value={formConfNum}
              onChange={(e) => setFormConfNum(e.target.value)}
              placeholder="VD: VN12345"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <AdminInput
              label="Địa điểm / Nhà ga / Khách sạn"
              value={formLocation}
              onChange={(e) => setFormLocation(e.target.value)}
              placeholder="VD: Sân bay Nội Bài"
            />

            <AdminInput
              label="Chi phí (VND)"
              type="number"
              value={formPrice}
              onChange={(e) => setFormPrice(e.target.value)}
              placeholder="VD: 1500000"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <AdminSelect
              label="Chuyến đi liên quan"
              value={formTripId}
              onChange={(e) => setFormTripId(e.target.value)}
              required
            >
              {trips.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
              ))}
            </AdminSelect>

            <AdminSelect
              label="Người thêm (User)"
              value={formAddedBy}
              onChange={(e) => setFormAddedBy(e.target.value)}
              required
            >
              {users.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.name || u.email}
                </option>
              ))}
            </AdminSelect>
          </div>

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
              {isEditing ? 'Lưu thay đổi' : 'Tạo đặt chỗ'}
            </AdminButton>
          </div>
        </form>
      </AdminModal>
    </div>
  );
}
