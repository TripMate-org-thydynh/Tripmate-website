'use client';

import { useEffect, useState } from 'react';
import { getTripsAction, createTripAction, updateTripAction, deleteTripAction, getUsersAction } from '@/app/actions';
import {
  Compass,
  Search,
  Plus,
  Trash2,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  Edit2,
  Calendar,
  MapPin,
  X,
  Download,
} from 'lucide-react';
import ErrorState from '@/components/ErrorState';
import EmptyState from '@/components/EmptyState';
import { exportToCSV } from '@/lib/exportCsv';

export default function AdminTripsPage() {
  const [trips, setTrips] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Form states
  const [modalOpen, setModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formName, setFormName] = useState('');
  const [formDestination, setFormDestination] = useState('');
  const [formStartDate, setFormStartDate] = useState('');
  const [formEndDate, setFormEndDate] = useState('');
  const [formCreatorId, setFormCreatorId] = useState('');

  const fetchTrips = async () => {
    setLoading(true);
    setError(null);
    const res = await getTripsAction(search, page, 10);
    if (res.success && res.data) {
      setTrips(res.data.items || []);
      setTotal(res.data.total || 0);
      setTotalPages(res.data.totalPages || 1);
    } else {
      setError(res.error || 'Không thể lấy danh sách chuyến đi');
    }
    setLoading(false);
  };

  const fetchUsersList = async () => {
    const res = await getUsersAction(undefined, undefined, 1, 100);
    if (res.success && res.data) {
      setUsers(res.data.items || []);
      if (res.data.items.length > 0) {
        setFormCreatorId(res.data.items[0].id);
      }
    }
  };

  useEffect(() => {
    fetchTrips();
  }, [page]);

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

  const openEditModal = (trip: any) => {
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
    setError(null);

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
        fetchTrips();
      } else {
        setError(res.error || 'Cập nhật chuyến đi thất bại');
      }
    } else {
      const res = await createTripAction(payload);
      if (res.success) {
        setModalOpen(false);
        fetchTrips();
      } else {
        setError(res.error || 'Tạo chuyến đi thất bại');
      }
    }
  };

  const handleDeleteTrip = async (id: string) => {
    if (!confirm('Bạn có chắc chắn muốn xoá chuyến đi này không?')) return;
    setError(null);
    const res = await deleteTripAction(id);
    if (res.success) {
      fetchTrips();
    } else {
      setError(res.error || 'Xoá chuyến đi thất bại');
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Title Header */}
      <div className="flex justify-between items-center gap-4">
        <div>
          <h1 className="text-2xl font-black uppercase text-black dark:text-white tracking-tight">Quản lý Chuyến đi</h1>
          <p className="text-[10px] font-black uppercase text-muted-foreground mt-1">Danh sách hành trình du lịch của các nhóm bạn trẻ.</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => exportToCSV('tripmate_trips', trips)}
            disabled={!trips.length}
            className="px-4 py-2.5 bg-white border-2 border-black hover:bg-secondary text-black text-xs font-black uppercase rounded-xl shadow-[2px_2px_0px_0px_#000000] hover:translate-y-[-1px] transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
          >
            <Download className="w-4 h-4 text-primary" />
            Xuất CSV
          </button>
          <button
            onClick={openCreateModal}
            className="px-4 py-2.5 bg-primary text-white text-xs font-black uppercase rounded-xl border-2 border-black shadow-[2px_2px_0px_0px_#000000] hover:translate-y-[-1px] transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Tạo chuyến đi
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-2xl bg-destructive/10 border-2 border-destructive text-destructive text-xs font-bold flex items-center gap-2.5 shadow-[2px_2px_0px_0px_#000000]">
          <AlertCircle className="w-5 h-5" />
          <span>{error}</span>
        </div>
      )}

      {error && !loading && trips.length === 0 && (
        <ErrorState message={error} onRetry={fetchTrips} />
      )}

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white dark:bg-[#252322] border-[3px] border-black dark:border-white p-4 rounded-2xl shadow-[4px_4px_0px_0px_#000000]">
        <form onSubmit={handleSearchSubmit} className="relative w-full md:w-80">
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Tìm theo tên chuyến đi, điểm đến..."
            className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl border-2 border-black bg-background focus:outline-none focus:border-primary font-bold text-black"
          />
          <button type="submit" className="absolute inset-y-0 left-0 pl-3 flex items-center text-muted-foreground cursor-pointer">
            <Search className="w-4 h-4 text-black" />
          </button>
        </form>

        <span className="text-xs font-black uppercase text-black dark:text-white">Tổng số: {total} chuyến đi</span>
      </div>

      {/* Trips Table */}
      <div className="bg-white border-[3px] border-black dark:border-white rounded-3xl overflow-hidden shadow-[4px_4px_0px_0px_#000000] dark:shadow-[4px_4px_0px_0px_#ffffff] text-black">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-secondary border-b-[3px] border-black text-black font-black uppercase">
                <th className="p-4 border-r border-black">Chuyến đi</th>
                <th className="p-4 border-r border-black">Điểm đến</th>
                <th className="p-4 border-r border-black">Thời gian</th>
                <th className="p-4 border-r border-black">Người lập</th>
                <th className="p-4 border-r border-black">Số TV</th>
                <th className="p-4 text-right">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                [1, 2, 3].map(i => (
                  <tr key={i} className="border-b border-black animate-pulse">
                    <td colSpan={6} className="p-6 h-12"></td>
                  </tr>
                ))
              ) : trips.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-muted-foreground font-bold uppercase">Không tìm thấy chuyến đi nào.</td>
                </tr>
              ) : (
                trips.map(trip => (
                  <tr key={trip.id} className="border-b border-black last:border-0 hover:bg-secondary/15 transition">
                    <td className="p-4 border-r border-black">
                      <div>
                        <h4 className="font-black uppercase">{trip.name}</h4>
                        <span className="text-[9px] bg-white border border-black px-1.5 py-0.5 rounded-full font-bold text-primary shadow-[1px_1px_0px_0px_#000000]">MÃ MỜI: {trip.inviteCode}</span>
                      </div>
                    </td>
                    <td className="p-4 border-r border-black">
                      <div className="flex items-center gap-1 font-bold">
                        <MapPin className="w-3.5 h-3.5 text-primary shrink-0" />
                        <span>{trip.destination || 'Chưa có'}</span>
                      </div>
                    </td>
                    <td className="p-4 border-r border-black">
                      <div className="flex items-center gap-1.5 font-bold text-black/70">
                        <Calendar className="w-3.5 h-3.5 shrink-0 text-primary" />
                        <span>{new Date(trip.startDate).toLocaleDateString('vi-VN')} - {new Date(trip.endDate).toLocaleDateString('vi-VN')}</span>
                      </div>
                    </td>
                    <td className="p-4 border-r border-black">
                      <span className="font-extrabold">{trip.creator?.name || 'n/a'}</span>
                    </td>
                    <td className="p-4 border-r border-black text-center font-black">
                      {trip._count?.members ?? 0}
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEditModal(trip)}
                          className="p-1.5 rounded-xl bg-white border-2 border-black text-black hover:bg-primary hover:text-white flex items-center justify-center transition cursor-pointer shadow-[2px_2px_0px_0px_#000000] hover:translate-y-[-1px]"
                          title="Sửa chuyến đi"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteTrip(trip.id)}
                          className="p-1.5 rounded-xl bg-white border-2 border-black text-black hover:bg-destructive hover:text-white flex items-center justify-center transition cursor-pointer shadow-[2px_2px_0px_0px_#000000] hover:translate-y-[-1px]"
                          title="Xoá chuyến đi"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="p-4 border-t-[3px] border-black flex justify-between items-center bg-[#FEFADC]">
            <span className="text-[10px] text-black font-black uppercase">Hiển thị {trips.length}/{total} chuyến đi</span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="p-2 rounded-xl bg-white border-2 border-black hover:bg-secondary text-black shadow-[2px_2px_0px_0px_#000000] hover:translate-y-[-1px] disabled:opacity-40 cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="text-xs font-black uppercase px-2">Trang {page} / {totalPages}</span>
              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="p-2 rounded-xl bg-white border-2 border-black hover:bg-secondary text-black shadow-[2px_2px_0px_0px_#000000] hover:translate-y-[-1px] disabled:opacity-40 cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* CREATE/EDIT DIALOG MODAL */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-6 text-black">
          <div className="bg-white border-[3px] border-black w-full max-w-md rounded-[32px] overflow-hidden shadow-[6px_6px_0px_0px_#000000] relative animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6 border-b-[3px] border-black bg-secondary flex items-center justify-between">
              <h3 className="font-black text-xs uppercase">{isEditing ? 'Cập nhật chuyến đi' : 'Tạo chuyến đi mới'}</h3>
              <button onClick={() => setModalOpen(false)} className="p-1 rounded-lg border border-black bg-white hover:bg-secondary text-black cursor-pointer">
                <X className="w-4.5 h-4.5" />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="p-6 flex flex-col gap-4">
              <div>
                <label className="text-[9px] font-black text-muted-foreground uppercase block mb-1">Tên chuyến đi</label>
                <input
                  type="text"
                  value={formName}
                  onChange={e => setFormName(e.target.value)}
                  placeholder="VD: Phượt Đà Lạt Săn Mây"
                  className="w-full neo-input"
                  required
                />
              </div>

              <div>
                <label className="text-[9px] font-black text-muted-foreground uppercase block mb-1">Điểm đến</label>
                <input
                  type="text"
                  value={formDestination}
                  onChange={e => setFormDestination(e.target.value)}
                  placeholder="VD: Đà Lạt, Lâm Đồng"
                  className="w-full neo-input"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[9px] font-black text-muted-foreground uppercase block mb-1">Ngày đi</label>
                  <input
                    type="date"
                    value={formStartDate}
                    onChange={e => setFormStartDate(e.target.value)}
                    className="w-full neo-input"
                    required
                  />
                </div>
                <div>
                  <label className="text-[9px] font-black text-muted-foreground uppercase block mb-1">Ngày về</label>
                  <input
                    type="date"
                    value={formEndDate}
                    onChange={e => setFormEndDate(e.target.value)}
                    className="w-full neo-input"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-[9px] font-black text-muted-foreground uppercase block mb-1">Người phụ trách (Creator)</label>
                <select
                  value={formCreatorId}
                  onChange={e => setFormCreatorId(e.target.value)}
                  className="w-full neo-input bg-transparent"
                  required
                >
                  {users.map(u => (
                    <option key={u.id} value={u.id}>{u.name} (@{u.username || 'n/a'})</option>
                  ))}
                </select>
              </div>

              <div className="flex gap-3 justify-end pt-4 border-t-[3px] border-black mt-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2.5 bg-white border-2 border-black text-black text-xs font-black uppercase rounded-xl hover:bg-secondary transition cursor-pointer shadow-[2px_2px_0px_0px_#000000]"
                >
                  Huỷ
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-[#FFD043] border-2 border-black text-black text-xs font-black uppercase rounded-xl hover:bg-[#FFD043]/90 transition shadow-[2px_2px_0px_0px_#000000] cursor-pointer"
                >
                  {isEditing ? 'Lưu thay đổi' : 'Tạo mới'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
