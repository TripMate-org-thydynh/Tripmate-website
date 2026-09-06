'use client';

import { useEffect, useState, useCallback } from 'react';
import {
  getJournalsAction,
  createJournalAction,
  updateJournalAction,
  deleteJournalAction,
  getTripsAction,
  getUsersAction,
} from '@/app/actions';
import {
  Plus,
  Trash2,
  RefreshCw,
  Edit2,
  Calendar,
  Download,
  Eye,
  Compass,
  BookOpen,
  Smile,
  Heart,
  User,
} from 'lucide-react';
import ErrorState from '@/components/ErrorState';
import { exportToCSV } from '@/lib/exportCsv';
import ConfirmModal from '@/components/ui/ConfirmModal';
import ToastContainer, { ToastMessage } from '@/components/ui/Toast';
import { AdminButton } from '@/components/admin/AdminButton';
import { AdminInput, AdminSelect, AdminTextarea } from '@/components/admin/AdminInput';
import { AdminBadge, AdminBadgeVariant } from '@/components/admin/AdminBadge';
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

const MOODS = ['CHILL', 'HAPPY', 'EXCITED', 'TIRED', 'ADVENTUROUS', 'ANGRY'];

const MOOD_CONFIG: Record<string, { label: string; variant: AdminBadgeVariant; emoji: string }> = {
  CHILL: { label: 'Chill & Thư thái', variant: 'info', emoji: '☕' },
  HAPPY: { label: 'Vui vẻ & Hạnh phúc', variant: 'success', emoji: '😄' },
  EXCITED: { label: 'Hào hứng & Phấn khích', variant: 'warning', emoji: '🎉' },
  TIRED: { label: 'Mệt mỏi nghỉ ngơi', variant: 'neutral', emoji: '😴' },
  ADVENTUROUS: { label: 'Phiêu lưu khám phá', variant: 'brand', emoji: '🏔️' },
  ANGRY: { label: 'Khó chịu & Bực mình', variant: 'danger', emoji: '😡' },
};

interface JournalItem {
  id: string;
  tripId: string;
  authorId: string;
  title?: string | null;
  body: string;
  mood: string;
  entryDate: string;
  createdAt: string;
  trip?: {
    id: string;
    name: string;
  };
  author?: {
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

export default function AdminJournalPage() {
  const [journals, setJournals] = useState<JournalItem[]>([]);
  const [trips, setTrips] = useState<TripOption[]>([]);
  const [users, setUsers] = useState<UserOption[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState('');
  const [moodFilter, setMoodFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  // Reading drawer state
  const [readingEntry, setReadingEntry] = useState<JournalItem | null>(null);

  // Form states
  const [modalOpen, setModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [formTitle, setFormTitle] = useState('');
  const [formBody, setFormBody] = useState('');
  const [formMood, setFormMood] = useState('CHILL');
  const [formEntryDate, setFormEntryDate] = useState('');
  const [formTripId, setFormTripId] = useState('');
  const [formAuthorId, setFormAuthorId] = useState('');

  const fetchJournals = useCallback(async () => {
    setLoading(true);
    setError(null);
    const res = await getJournalsAction(page, limit);
    if (res.success && res.data) {
      const payload = res.data.data || res.data;
      let items: JournalItem[] = payload.items || (Array.isArray(payload) ? payload : []);
      if (moodFilter) {
        items = items.filter((j) => j.mood === moodFilter);
      }
      if (search) {
        const query = search.toLowerCase();
        items = items.filter(
          (j) =>
            j.title?.toLowerCase().includes(query) ||
            j.body?.toLowerCase().includes(query) ||
            j.author?.name?.toLowerCase().includes(query) ||
            j.trip?.name?.toLowerCase().includes(query)
        );
      }
      setJournals(items);
      setTotal(payload.total ?? items.length ?? 0);
      setTotalPages(payload.totalPages || Math.ceil((payload.total ?? items.length ?? 1) / limit));
    } else {
      setError(res.error || 'Không thể lấy danh sách nhật ký hành trình');
    }
    setLoading(false);
  }, [page, limit, moodFilter, search]);

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
      if (items.length > 0) setFormAuthorId(items[0].id);
    }
  };

  useEffect(() => {
    fetchJournals();
  }, [fetchJournals]);

  useEffect(() => {
    fetchOptions();
  }, []);

  const openCreateModal = () => {
    setIsEditing(false);
    setEditingId(null);
    setFormTitle('');
    setFormBody('');
    setFormMood('CHILL');
    setFormEntryDate(new Date().toISOString().split('T')[0]);
    if (trips.length > 0) setFormTripId(trips[0].id);
    if (users.length > 0) setFormAuthorId(users[0].id);
    setModalOpen(true);
  };

  const openEditModal = (j: JournalItem) => {
    setIsEditing(true);
    setEditingId(j.id);
    setFormTitle(j.title || '');
    setFormBody(j.body || '');
    setFormMood(j.mood || 'CHILL');
    setFormEntryDate(new Date(j.entryDate).toISOString().split('T')[0]);
    setFormTripId(j.tripId);
    setFormAuthorId(j.authorId);
    setModalOpen(true);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    const payload = {
      tripId: formTripId,
      authorId: formAuthorId,
      title: formTitle || undefined,
      body: formBody,
      mood: formMood,
      entryDate: formEntryDate,
    };

    if (isEditing && editingId) {
      const res = await updateJournalAction(editingId, payload);
      if (res.success) {
        setModalOpen(false);
        addToast('success', 'Đã cập nhật bài nhật ký thành công');
        fetchJournals();
      } else {
        addToast('error', res.error || 'Cập nhật bài viết thất bại');
      }
    } else {
      const res = await createJournalAction(payload);
      if (res.success) {
        setModalOpen(false);
        addToast('success', 'Đã tạo bài nhật ký mới thành công');
        fetchJournals();
      } else {
        addToast('error', res.error || 'Tạo bài viết thất bại');
      }
    }
    setSubmitting(false);
  };

  const executeDelete = async () => {
    const id = confirmDelete.id;
    setConfirmDelete({ isOpen: false, id: '', title: '' });
    const res = await deleteJournalAction(id);
    if (res.success) {
      addToast('success', 'Đã xoá bài nhật ký thành công');
      if (readingEntry?.id === id) setReadingEntry(null);
      fetchJournals();
    } else {
      addToast('error', res.error || 'Xoá bài viết thất bại');
    }
  };

  // Stats calculation
  const happyChillCount = journals.filter((j) => j.mood === 'HAPPY' || j.mood === 'CHILL').length;
  const adventurousCount = journals.filter((j) => j.mood === 'ADVENTUROUS' || j.mood === 'EXCITED').length;

  return (
    <div className="flex flex-col gap-6">
      <ToastContainer
        toasts={toasts}
        onDismiss={(id) => setToasts((prev) => prev.filter((t) => t.id !== id))}
      />

      <ConfirmModal
        isOpen={confirmDelete.isOpen}
        title="Xoá Bài Nhật Ký"
        message={`Bạn có chắc chắn muốn xoá bài viết "${confirmDelete.title}"? Hành động này sẽ loại bỏ nội dung vĩnh viễn khỏi chuyến đi.`}
        isDestructive={true}
        onConfirm={executeDelete}
        onCancel={() => setConfirmDelete({ isOpen: false, id: '', title: '' })}
      />

      {/* Header */}
      <AdminPageHeader
        title="Nhật Ký Hành Trình"
        description="Quản trị các bài viết kỷ niệm, ghi chép tâm trạng và câu chuyện trải nghiệm du lịch của thành viên."
        badgeText={`${total} bài viết`}
        badgeVariant="neutral"
        actions={
          <>
            <AdminButton
              variant="outline"
              size="sm"
              onClick={fetchJournals}
              loading={loading}
              icon={<RefreshCw className="w-3.5 h-3.5" />}
            >
              Tải lại
            </AdminButton>
            <AdminButton
              variant="secondary"
              size="sm"
              onClick={() => exportToCSV('tripmate_journals', journals)}
              disabled={!journals.length}
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
              Viết Nhật Ký
            </AdminButton>
          </>
        }
      />

      {/* Top Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <AdminStatCard
          title="Tổng Số Bài Nhật Ký"
          value={total.toLocaleString('vi-VN')}
          description="Ghi nhận trên toàn hệ thống"
          icon={<BookOpen className="w-4 h-4" />}
          variant="brand"
        />

        <AdminStatCard
          title="Tâm Trạng Tích Cực"
          value={happyChillCount}
          description="Trải nghiệm vui vẻ và thư thái"
          icon={<Smile className="w-4 h-4" />}
          badgeText={journals.length ? `${Math.round((happyChillCount / journals.length) * 100)}%` : '0%'}
          variant="success"
        />

        <AdminStatCard
          title="Khám Phá & Phấn Khích"
          value={adventurousCount}
          description="Hành trình mạo hiểm và phiêu lưu"
          icon={<Heart className="w-4 h-4" />}
          badgeText="Adventurous"
          variant="warning"
        />
      </div>

      {/* Search & Filter Bar */}
      <AdminFilterBar
        search={search}
        onSearchChange={setSearch}
        searchPlaceholder="Tìm theo tiêu đề, tác giả, chuyến đi..."
        customFilters={
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 dark:text-slate-400 whitespace-nowrap">Tâm trạng:</span>
            <AdminSelect
              value={moodFilter}
              onChange={(e) => {
                setMoodFilter(e.target.value);
                setPage(1);
              }}
              className="w-44"
            >
              <option value="">Tất cả tâm trạng</option>
              {MOODS.map((m) => (
                <option key={m} value={m}>
                  {MOOD_CONFIG[m]?.emoji} {MOOD_CONFIG[m]?.label || m}
                </option>
              ))}
            </AdminSelect>
          </div>
        }
      />

      {error && !loading && journals.length === 0 ? (
        <ErrorState message={error} onRetry={fetchJournals} />
      ) : (
        /* Data Table */
        <AdminTable>
          <AdminTableHeader>
            <AdminTableRow>
              <AdminTableHead>Tiêu đề & Nội dung tóm tắt</AdminTableHead>
              <AdminTableHead>Tâm trạng</AdminTableHead>
              <AdminTableHead>Ngày ghi</AdminTableHead>
              <AdminTableHead>Tác giả</AdminTableHead>
              <AdminTableHead>Chuyến đi</AdminTableHead>
              <AdminTableHead align="right">Thao tác</AdminTableHead>
            </AdminTableRow>
          </AdminTableHeader>

          {loading ? (
            <AdminTableSkeleton columns={6} rows={6} />
          ) : journals.length === 0 ? (
            <AdminTableEmpty colSpan={6} message="Không có bài nhật ký nào phù hợp với điều kiện lọc" />
          ) : (
            <AdminTableBody>
              {journals.map((j) => {
                const moodInfo = MOOD_CONFIG[j.mood] || MOOD_CONFIG.CHILL;
                return (
                  <AdminTableRow key={j.id}>
                    {/* Title & Body preview */}
                    <AdminTableCell>
                      <div
                        className="flex flex-col gap-0.5 cursor-pointer group max-w-sm"
                        onClick={() => setReadingEntry(j)}
                      >
                        <h4 className="font-semibold text-slate-900 dark:text-slate-100 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors truncate text-xs">
                          {j.title || 'Nhật ký không đề'}
                        </h4>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                          {j.body}
                        </p>
                      </div>
                    </AdminTableCell>

                    {/* Mood */}
                    <AdminTableCell>
                      <AdminBadge variant={moodInfo.variant} size="xs">
                        <span className="mr-1">{moodInfo.emoji}</span>
                        {moodInfo.label}
                      </AdminBadge>
                    </AdminTableCell>

                    {/* Entry Date */}
                    <AdminTableCell>
                      <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 text-xs whitespace-nowrap">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        <span>{new Date(j.entryDate).toLocaleDateString('vi-VN')}</span>
                      </div>
                    </AdminTableCell>

                    {/* Author */}
                    <AdminTableCell>
                      <div className="flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5 text-slate-400" />
                        <span className="text-xs font-medium text-slate-800 dark:text-slate-200">
                          {j.author?.name || j.author?.email || 'Thành viên'}
                        </span>
                      </div>
                    </AdminTableCell>

                    {/* Trip */}
                    <AdminTableCell>
                      <div className="flex items-center gap-1.5 text-xs text-amber-700 dark:text-amber-300 font-medium truncate max-w-xs">
                        <Compass className="w-3.5 h-3.5 shrink-0 text-amber-600 dark:text-amber-400" />
                        <span className="truncate">{j.trip?.name || 'N/A'}</span>
                      </div>
                    </AdminTableCell>

                    {/* Row Actions */}
                    <AdminTableCell align="right">
                      <AdminRowActions
                        quickAction={{
                          label: 'Đọc nhật ký',
                          icon: <Eye className="w-3.5 h-3.5" />,
                          onClick: () => setReadingEntry(j),
                        }}
                        actions={[
                          {
                            label: 'Đọc chi tiết',
                            icon: <Eye className="w-3.5 h-3.5 text-slate-400" />,
                            onClick: () => setReadingEntry(j),
                          },
                          {
                            label: 'Chỉnh sửa',
                            icon: <Edit2 className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />,
                            onClick: () => openEditModal(j),
                          },
                          {
                            label: 'Xoá nhật ký',
                            icon: <Trash2 className="w-3.5 h-3.5 text-[#EF4444]" />,
                            onClick: () =>
                              setConfirmDelete({
                                isOpen: true,
                                id: j.id,
                                title: j.title || 'Nhật ký',
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
        itemLabel="bài viết"
      />

      {/* READING DRAWER */}
      <AdminDrawer
        isOpen={!!readingEntry}
        onClose={() => setReadingEntry(null)}
        title={readingEntry?.title || 'Nhật ký không đề'}
        description={
          readingEntry
            ? `Ngày ghi: ${new Date(readingEntry.entryDate).toLocaleDateString('vi-VN')} · Tác giả: ${readingEntry.author?.name || readingEntry.author?.email || 'Thành viên'}`
            : undefined
        }
        size="lg"
        footer={
          readingEntry && (
            <div className="flex items-center justify-end gap-2 w-full">
              <AdminButton variant="outline" size="sm" onClick={() => setReadingEntry(null)}>
                Đóng
              </AdminButton>
              <AdminButton
                variant="secondary"
                size="sm"
                onClick={() => {
                  const entry = readingEntry;
                  setReadingEntry(null);
                  openEditModal(entry);
                }}
                icon={<Edit2 className="w-3.5 h-3.5" />}
              >
                Chỉnh sửa
              </AdminButton>
              <AdminButton
                variant="danger"
                size="sm"
                onClick={() => {
                  const entry = readingEntry;
                  setConfirmDelete({
                    isOpen: true,
                    id: entry.id,
                    title: entry.title || 'Nhật ký',
                  });
                }}
                icon={<Trash2 className="w-3.5 h-3.5" />}
              >
                Xoá bài viết
              </AdminButton>
            </div>
          )
        }
      >
        {readingEntry && (
          <div className="flex flex-col gap-5">
            <div className="flex items-center justify-between p-3.5 rounded-lg bg-slate-50 dark:bg-[#0D1424] border border-slate-200 dark:border-[#1E293B]">
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500 dark:text-slate-400">Tâm trạng ghi chép:</span>
                <AdminBadge variant={MOOD_CONFIG[readingEntry.mood]?.variant || 'neutral'} size="xs">
                  <span className="mr-1">{MOOD_CONFIG[readingEntry.mood]?.emoji}</span>
                  {MOOD_CONFIG[readingEntry.mood]?.label || readingEntry.mood}
                </AdminBadge>
              </div>
              <span className="text-xs font-semibold text-amber-600 dark:text-amber-400 flex items-center gap-1.5">
                <Compass className="w-3.5 h-3.5" />
                {readingEntry.trip?.name || 'Chuyến đi'}
              </span>
            </div>

            <div>
              <span className="text-xs font-semibold text-slate-900 dark:text-slate-100 block mb-2">
                Nội dung câu chuyện
              </span>
              <div className="p-4 rounded-xl border border-slate-200 dark:border-[#1E293B] bg-slate-50/50 dark:bg-[#070B16] text-xs leading-relaxed text-slate-800 dark:text-slate-200 whitespace-pre-wrap font-sans">
                {readingEntry.body}
              </div>
            </div>
          </div>
        )}
      </AdminDrawer>

      {/* CREATE / EDIT MODAL */}
      <AdminModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={isEditing ? 'Chỉnh sửa Bài Nhật Ký' : 'Tạo Bài Nhật Ký Mới'}
        description="Ghi lại kỷ niệm hoặc câu chuyện trải nghiệm trong chuyến đi"
      >
        <form onSubmit={handleFormSubmit} className="flex flex-col gap-4">
          <AdminInput
            label="Tiêu đề bài viết"
            value={formTitle}
            onChange={(e) => setFormTitle(e.target.value)}
            placeholder="VD: Buổi tối ngắm trăng bên đồi thông..."
          />

          <div className="grid grid-cols-2 gap-4">
            <AdminSelect
              label="Tâm trạng (Mood)"
              value={formMood}
              onChange={(e) => setFormMood(e.target.value)}
              required
            >
              {MOODS.map((m) => (
                <option key={m} value={m}>
                  {MOOD_CONFIG[m]?.emoji} {MOOD_CONFIG[m]?.label || m}
                </option>
              ))}
            </AdminSelect>

            <AdminInput
              label="Ngày ghi chép"
              type="date"
              value={formEntryDate}
              onChange={(e) => setFormEntryDate(e.target.value)}
              required
            >
              {null}
            </AdminInput>
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
              label="Tác giả bài viết"
              value={formAuthorId}
              onChange={(e) => setFormAuthorId(e.target.value)}
              required
            >
              {users.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.name || u.email}
                </option>
              ))}
            </AdminSelect>
          </div>

          <AdminTextarea
            label="Nội dung nhật ký"
            value={formBody}
            onChange={(e) => setFormBody(e.target.value)}
            placeholder="Viết cảm xúc, hành trình hoặc câu chuyện của nhóm..."
            rows={5}
            required
          />

          <div className="flex justify-end gap-2.5 pt-4 border-t border-slate-100 dark:border-[#1E293B]">
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
              {isEditing ? 'Lưu thay đổi' : 'Lưu bài viết'}
            </AdminButton>
          </div>
        </form>
      </AdminModal>
    </div>
  );
}
