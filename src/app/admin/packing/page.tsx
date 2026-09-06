'use client';

import { useEffect, useState, useCallback } from 'react';
import {
  getPackingAction,
  createPackingAction,
  updatePackingAction,
  deletePackingAction,
  getTripsAction,
  getUsersAction,
} from '@/app/actions';
import {
  Plus,
  Trash2,
  Edit2,
  Download,
  RefreshCw,
  Eye,
  Package,
  Compass,
  CheckCircle2,
  Clock,
  Shirt,
} from 'lucide-react';
import ErrorState from '@/components/ErrorState';
import { exportToCSV } from '@/lib/exportCsv';
import ConfirmModal from '@/components/ui/ConfirmModal';
import ToastContainer, { ToastMessage } from '@/components/ui/Toast';
import { AdminButton } from '@/components/admin/AdminButton';
import { AdminInput, AdminSelect } from '@/components/admin/AdminInput';
import { AdminBadge, AdminBadgeVariant } from '@/components/admin/AdminBadge';
import { AdminCheckbox } from '@/components/admin/AdminCheckbox';
import {
  AdminTable,
  AdminTableHeader,
  AdminTableBody,
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
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { AdminStatCard } from '@/components/admin/AdminStatCard';
import { AdminFilterBar } from '@/components/admin/AdminFilterBar';

const PACKING_CATEGORIES = [
  'CLOTHES',
  'DOCUMENT',
  'ELECTRONICS',
  'MEDICINE',
  'TOILETRIES',
  'OTHER',
];

const CATEGORY_CONFIG: Record<string, { label: string; variant: AdminBadgeVariant }> = {
  CLOTHES: { label: 'Trang phục', variant: 'brand' },
  DOCUMENT: { label: 'Giấy tờ tuỳ thân', variant: 'warning' },
  ELECTRONICS: { label: 'Đồ điện tử', variant: 'info' },
  MEDICINE: { label: 'Y tế & Thuốc', variant: 'danger' },
  TOILETRIES: { label: 'Vệ sinh cá nhân', variant: 'neutral' },
  OTHER: { label: 'Đồ dùng khác', variant: 'neutral' },
};

interface PackingItem {
  id: string;
  tripId: string;
  addedBy: string;
  name: string;
  category: string;
  quantity: number;
  isPacked: boolean;
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

interface TripOption {
  id: string;
  name: string;
}

interface UserOption {
  id: string;
  name: string | null;
  email: string;
}

export default function AdminPackingPage() {
  const [packingItems, setPackingItems] = useState<PackingItem[]>([]);
  const [trips, setTrips] = useState<TripOption[]>([]);
  const [users, setUsers] = useState<UserOption[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState('');
  const [catFilter, setCatFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Quick view drawer state
  const [viewingItem, setViewingItem] = useState<PackingItem | null>(null);

  // Toast state
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const addToast = (type: 'success' | 'error' | 'info', message: string) => {
    setToasts((prev) => [...prev, { id: `${Date.now()}-${Math.random()}`, type, message }]);
  };

  // Confirm delete state
  const [confirmDelete, setConfirmDelete] = useState<{
    isOpen: boolean;
    id: string;
    name: string;
  }>({
    isOpen: false,
    id: '',
    name: '',
  });

  // Form states
  const [modalOpen, setModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [formName, setFormName] = useState('');
  const [formCategory, setFormCategory] = useState('OTHER');
  const [formQuantity, setFormQuantity] = useState('1');
  const [formTripId, setFormTripId] = useState('');
  const [formAddedBy, setFormAddedBy] = useState('');

  const fetchPacking = useCallback(async () => {
    setLoading(true);
    setError(null);
    const res = await getPackingAction(page, limit);
    if (res.success && res.data) {
      const payload = res.data.data || res.data;
      let items: PackingItem[] = payload.items || (Array.isArray(payload) ? payload : []);
      if (catFilter) {
        items = items.filter((p) => p.category === catFilter);
      }
      if (search) {
        const query = search.toLowerCase();
        items = items.filter((p) => p.name?.toLowerCase().includes(query) || p.trip?.name?.toLowerCase().includes(query));
      }
      setPackingItems(items);
      setTotal(payload.total ?? items.length ?? 0);
      setTotalPages(payload.totalPages || Math.ceil((payload.total ?? items.length ?? 1) / limit));
    } else {
      setError(res.error || 'Không thể lấy danh sách đồ chuẩn bị');
    }
    setLoading(false);
  }, [page, limit, catFilter, search]);

  const fetchOptions = async () => {
    const [resTrips, resUsers] = await Promise.all([
      getTripsAction(undefined, 1, 100),
      getUsersAction(undefined, undefined, 1, 100),
    ]);
    if (resTrips.success && resTrips.data) {
      const p = resTrips.data.data || resTrips.data;
      const items: TripOption[] = p.items || (Array.isArray(p) ? p : []);
      setTrips(items);
      if (items.length > 0) setFormTripId(items[0].id);
    }
    if (resUsers.success && resUsers.data) {
      const p = resUsers.data.data || resUsers.data;
      const items: UserOption[] = p.items || (Array.isArray(p) ? p : []);
      setUsers(items);
      if (items.length > 0) setFormAddedBy(items[0].id);
    }
  };

  useEffect(() => {
    fetchPacking();
  }, [fetchPacking]);

  useEffect(() => {
    fetchOptions();
  }, []);

  const openCreateModal = () => {
    setIsEditing(false);
    setEditingId(null);
    setFormName('');
    setFormCategory('OTHER');
    setFormQuantity('1');
    if (trips.length > 0) setFormTripId(trips[0].id);
    if (users.length > 0) setFormAddedBy(users[0].id);
    setModalOpen(true);
  };

  const openEditModal = (p: PackingItem) => {
    setIsEditing(true);
    setEditingId(p.id);
    setFormName(p.name);
    setFormCategory(p.category);
    setFormQuantity(String(p.quantity || 1));
    setFormTripId(p.tripId);
    setFormAddedBy(p.addedBy);
    setModalOpen(true);
  };

  const handleTogglePacked = async (item: PackingItem) => {
    const nextPacked = !item.isPacked;
    const res = await updatePackingAction(item.id, { isPacked: nextPacked });
    if (res.success) {
      setPackingItems((prev) =>
        prev.map((p) => (p.id === item.id ? { ...p, isPacked: nextPacked } : p))
      );
      if (viewingItem?.id === item.id) {
        setViewingItem({ ...viewingItem, isPacked: nextPacked });
      }
      addToast('success', nextPacked ? 'Đã chuẩn bị đồ đạc' : 'Đã huỷ đánh dấu chuẩn bị');
    } else {
      addToast('error', res.error || 'Cập nhật trạng thái thất bại');
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    const payload = {
      tripId: formTripId,
      addedBy: formAddedBy,
      name: formName,
      category: formCategory,
      quantity: Number(formQuantity) || 1,
    };

    if (isEditing && editingId) {
      const res = await updatePackingAction(editingId, payload);
      if (res.success) {
        setModalOpen(false);
        addToast('success', 'Đã cập nhật đồ dùng thành công');
        fetchPacking();
      } else {
        addToast('error', res.error || 'Cập nhật đồ chuẩn bị thất bại');
      }
    } else {
      const res = await createPackingAction(payload);
      if (res.success) {
        setModalOpen(false);
        addToast('success', 'Đã thêm đồ dùng mới thành công');
        fetchPacking();
      } else {
        addToast('error', res.error || 'Tạo đồ chuẩn bị thất bại');
      }
    }
    setSubmitting(false);
  };

  const executeDelete = async () => {
    const id = confirmDelete.id;
    setConfirmDelete({ isOpen: false, id: '', name: '' });
    const res = await deletePackingAction(id);
    if (res.success) {
      addToast('success', 'Đã xoá món đồ thành công');
      if (viewingItem?.id === id) setViewingItem(null);
      fetchPacking();
    } else {
      addToast('error', res.error || 'Xoá đồ chuẩn bị thất bại');
    }
  };

  // Stats
  const packedCount = packingItems.filter((i) => i.isPacked).length;
  const pendingCount = packingItems.filter((i) => !i.isPacked).length;
  const packedPercent = packingItems.length ? Math.round((packedCount / packingItems.length) * 100) : 0;

  return (
    <div className="flex flex-col gap-6">
      <ToastContainer
        toasts={toasts}
        onDismiss={(id) => setToasts((prev) => prev.filter((t) => t.id !== id))}
      />

      <ConfirmModal
        isOpen={confirmDelete.isOpen}
        title="Xoá Đồ Chuẩn Bị"
        message={`Bạn có chắc chắn muốn xoá món đồ "${confirmDelete.name}"? Dữ liệu đồ đạc hành lý này sẽ bị loại bỏ vĩnh viễn.`}
        isDestructive={true}
        onConfirm={executeDelete}
        onCancel={() => setConfirmDelete({ isOpen: false, id: '', name: '' })}
      />

      {/* Header */}
      <AdminPageHeader
        title="Đồ Đạc Chuẩn Bị"
        description="Theo dõi checklist hành lý, đồ dùng và vật dụng cần thiết cho từng hành trình."
        badgeText={`${total} món đồ`}
        badgeVariant="neutral"
        actions={
          <>
            <AdminButton
              variant="outline"
              size="sm"
              onClick={fetchPacking}
              loading={loading}
              icon={<RefreshCw className="w-3.5 h-3.5" />}
            >
              Tải lại
            </AdminButton>
            <AdminButton
              variant="secondary"
              size="sm"
              onClick={() => exportToCSV('tripmate_packing', packingItems)}
              disabled={!packingItems.length}
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
              Thêm Món Đồ
            </AdminButton>
          </>
        }
      />

      {/* Top Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <AdminStatCard
          title="Tổng Món Đồ Cần Mang"
          value={total.toLocaleString('vi-VN')}
          description="Vật phẩm trên mọi chuyến đi"
          icon={<Package className="w-4 h-4" />}
          variant="brand"
        />

        <AdminStatCard
          title="Tiến Độ Đã Chuẩn Bị"
          value={packedCount}
          description="Đã được đóng gói vào hành lý"
          icon={<CheckCircle2 className="w-4 h-4" />}
          badgeText={`${packedPercent}% hoàn tất`}
          variant="success"
        />

        <AdminStatCard
          title="Đang Chờ Xếp Đồ"
          value={pendingCount}
          description="Chưa hoàn tất chuẩn bị"
          icon={<Clock className="w-4 h-4" />}
          badgeText="Chưa xong"
          variant="warning"
        />
      </div>

      {/* Search & Filter Bar */}
      <AdminFilterBar
        search={search}
        onSearchChange={setSearch}
        searchPlaceholder="Tìm theo tên đồ dùng, chuyến đi..."
        customFilters={
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 dark:text-slate-400 whitespace-nowrap">Danh mục:</span>
            <AdminSelect
              value={catFilter}
              onChange={(e) => {
                setCatFilter(e.target.value);
                setPage(1);
              }}
              className="w-44"
            >
              <option value="">Tất cả danh mục</option>
              {PACKING_CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {CATEGORY_CONFIG[c]?.label || c}
                </option>
              ))}
            </AdminSelect>
          </div>
        }
      />

      {error && !loading && packingItems.length === 0 ? (
        <ErrorState message={error} onRetry={fetchPacking} />
      ) : (
        /* Data Table */
        <AdminTable>
          <AdminTableHeader>
            <AdminTableRow>
              <AdminTableHead width="48px">Chuẩn bị</AdminTableHead>
              <AdminTableHead>Tên món đồ</AdminTableHead>
              <AdminTableHead>Danh mục</AdminTableHead>
              <AdminTableHead align="center">Số lượng</AdminTableHead>
              <AdminTableHead>Người phụ trách</AdminTableHead>
              <AdminTableHead>Chuyến đi</AdminTableHead>
              <AdminTableHead align="right">Thao tác</AdminTableHead>
            </AdminTableRow>
          </AdminTableHeader>

          {loading ? (
            <AdminTableSkeleton columns={7} rows={6} />
          ) : packingItems.length === 0 ? (
            <AdminTableEmpty colSpan={7} message="Không có đồ chuẩn bị nào phù hợp với điều kiện tìm kiếm" />
          ) : (
            <AdminTableBody>
              {packingItems.map((item) => {
                const catInfo = CATEGORY_CONFIG[item.category] || CATEGORY_CONFIG.OTHER;
                return (
                  <AdminTableRow key={item.id}>
                    {/* Toggle Packed Status with AdminCheckbox */}
                    <AdminTableCell>
                      <div className="flex items-center justify-center">
                        <AdminCheckbox
                          checked={item.isPacked}
                          onChange={() => handleTogglePacked(item)}
                          aria-label={item.isPacked ? 'Đã chuẩn bị' : 'Chưa chuẩn bị'}
                        />
                      </div>
                    </AdminTableCell>

                    {/* Name */}
                    <AdminTableCell>
                      <div
                        className="flex flex-col gap-0.5 cursor-pointer group"
                        onClick={() => setViewingItem(item)}
                      >
                        <span
                          className={`font-semibold text-xs transition-colors ${
                            item.isPacked
                              ? 'line-through text-slate-400 dark:text-slate-500'
                              : 'text-slate-900 dark:text-slate-100 group-hover:text-amber-600 dark:group-hover:text-amber-400'
                          }`}
                        >
                          {item.name}
                        </span>
                      </div>
                    </AdminTableCell>

                    {/* Category */}
                    <AdminTableCell>
                      <AdminBadge variant={catInfo.variant} size="xs">
                        {catInfo.label}
                      </AdminBadge>
                    </AdminTableCell>

                    {/* Quantity */}
                    <AdminTableCell align="center">
                      <span className="font-semibold text-slate-800 dark:text-slate-200 text-xs">
                        x{item.quantity}
                      </span>
                    </AdminTableCell>

                    {/* Added By */}
                    <AdminTableCell>
                      <span className="text-slate-600 dark:text-slate-400 text-xs">
                        {item.user?.name || item.user?.email || 'Thành viên'}
                      </span>
                    </AdminTableCell>

                    {/* Trip */}
                    <AdminTableCell>
                      <div className="flex items-center gap-1.5 text-xs text-amber-700 dark:text-amber-300 font-medium truncate max-w-xs">
                        <Compass className="w-3.5 h-3.5 shrink-0 text-amber-600 dark:text-amber-400" />
                        <span className="truncate">{item.trip?.name || 'N/A'}</span>
                      </div>
                    </AdminTableCell>

                    {/* Row Actions */}
                    <AdminTableCell align="right">
                      <AdminRowActions
                        quickAction={{
                          label: 'Xem chi tiết',
                          icon: <Eye className="w-3.5 h-3.5" />,
                          onClick: () => setViewingItem(item),
                        }}
                        actions={[
                          {
                            label: 'Xem chi tiết',
                            icon: <Eye className="w-3.5 h-3.5 text-slate-400" />,
                            onClick: () => setViewingItem(item),
                          },
                          {
                            label: item.isPacked ? 'Đánh dấu chưa xếp' : 'Đánh dấu đã chuẩn bị',
                            icon: <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />,
                            onClick: () => handleTogglePacked(item),
                          },
                          {
                            label: 'Chỉnh sửa',
                            icon: <Edit2 className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />,
                            onClick: () => openEditModal(item),
                          },
                          {
                            label: 'Xoá món đồ',
                            icon: <Trash2 className="w-3.5 h-3.5 text-[#EF4444]" />,
                            onClick: () =>
                              setConfirmDelete({
                                isOpen: true,
                                id: item.id,
                                name: item.name,
                              }),
                            variant: 'danger',
                          },
                        ]}
                      />
                    </AdminTableCell>
                  </AdminTableRow>
                );
              })}
            </AdminTableBody>
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
        itemLabel="món đồ"
      />

      {/* QUICK VIEW DRAWER */}
      <AdminDrawer
        isOpen={!!viewingItem}
        onClose={() => setViewingItem(null)}
        title={viewingItem?.name || 'Chi tiết Đồ dùng'}
        description="Thông tin chuẩn bị hành lý cho chuyến đi"
        size="lg"
        footer={
          viewingItem && (
            <div className="flex items-center justify-end gap-2 w-full">
              <AdminButton variant="outline" size="sm" onClick={() => setViewingItem(null)}>
                Đóng
              </AdminButton>
              <AdminButton
                variant="secondary"
                size="sm"
                onClick={() => {
                  const it = viewingItem;
                  setViewingItem(null);
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
                  const it = viewingItem;
                  setConfirmDelete({
                    isOpen: true,
                    id: it.id,
                    name: it.name,
                  });
                }}
                icon={<Trash2 className="w-3.5 h-3.5" />}
              >
                Xoá món đồ
              </AdminButton>
            </div>
          )
        }
      >
        {viewingItem && (
          <div className="flex flex-col gap-5">
            <div className="grid grid-cols-2 gap-3.5">
              <div className="p-3.5 rounded-lg bg-slate-50 dark:bg-[#0D1424] border border-slate-200 dark:border-[#1E293B]">
                <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                  Danh mục
                </span>
                <AdminBadge variant={CATEGORY_CONFIG[viewingItem.category]?.variant || 'neutral'} size="xs">
                  {CATEGORY_CONFIG[viewingItem.category]?.label || viewingItem.category}
                </AdminBadge>
              </div>

              <div className="p-3.5 rounded-lg bg-slate-50 dark:bg-[#0D1424] border border-slate-200 dark:border-[#1E293B]">
                <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                  Trạng thái
                </span>
                <AdminBadge variant={viewingItem.isPacked ? 'success' : 'neutral'} dot size="xs">
                  {viewingItem.isPacked ? 'Đã chuẩn bị' : 'Chưa mang'}
                </AdminBadge>
              </div>

              <div className="p-3.5 rounded-lg bg-slate-50 dark:bg-[#0D1424] border border-slate-200 dark:border-[#1E293B]">
                <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                  Số lượng
                </span>
                <span className="text-xs font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                  <Package className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                  {viewingItem.quantity} cái / chiếc
                </span>
              </div>

              <div className="p-3.5 rounded-lg bg-slate-50 dark:bg-[#0D1424] border border-slate-200 dark:border-[#1E293B]">
                <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                  Chuyến đi
                </span>
                <span className="text-xs font-semibold text-amber-600 dark:text-amber-400 flex items-center gap-1.5 truncate">
                  <Compass className="w-3.5 h-3.5 shrink-0" />
                  {viewingItem.trip?.name || 'N/A'}
                </span>
              </div>
            </div>

            <div className="p-3.5 rounded-lg border border-slate-200 dark:border-[#1E293B] bg-slate-50 dark:bg-[#0D1424]">
              <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                Người chịu trách nhiệm / Thêm món
              </span>
              <p className="text-xs font-semibold text-slate-900 dark:text-slate-100">
                {viewingItem.user?.name || 'Thành viên'}
              </p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">{viewingItem.user?.email || 'N/A'}</p>
            </div>
          </div>
        )}
      </AdminDrawer>

      {/* CREATE / EDIT MODAL */}
      <AdminModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={isEditing ? 'Chỉnh sửa Đồ Chuẩn Bị' : 'Thêm Món Đồ Mới'}
        description="Phân loại và gán trách nhiệm mang đồ cho thành viên chuyến đi"
      >
        <form onSubmit={handleFormSubmit} className="flex flex-col gap-4">
          <AdminInput
            label="Tên món đồ / hành lý"
            value={formName}
            onChange={(e) => setFormName(e.target.value)}
            placeholder="VD: Kem chống nắng Anessa, Sạc dự phòng..."
            required
            leftIcon={<Shirt className="w-3.5 h-3.5" />}
          />

          <div className="grid grid-cols-2 gap-4">
            <AdminSelect
              label="Danh mục"
              value={formCategory}
              onChange={(e) => setFormCategory(e.target.value)}
              required
            >
              {PACKING_CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {CATEGORY_CONFIG[c]?.label || c}
                </option>
              ))}
            </AdminSelect>

            <AdminInput
              label="Số lượng"
              type="number"
              min={1}
              value={formQuantity}
              onChange={(e) => setFormQuantity(e.target.value)}
              required
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
              label="Người mang / Phụ trách"
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

          <div className="flex justify-end gap-2.5 pt-4 mt-2 border-t border-slate-100 dark:border-[#1E293B]">
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
              {isEditing ? 'Lưu thay đổi' : 'Thêm món đồ'}
            </AdminButton>
          </div>
        </form>
      </AdminModal>
    </div>
  );
}
