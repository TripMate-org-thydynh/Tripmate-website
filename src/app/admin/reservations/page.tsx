'use client';

import { useEffect, useState } from 'react';
import { 
  getReservationsAction, 
  createReservationAction, 
  updateReservationAction, 
  deleteReservationAction, 
  getTripsAction, 
  getUsersAction 
} from '@/app/actions';
import {
  CalendarDays,
  Plus,
  Trash2,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  Edit2,
  X,
  Plane,
  Hotel,
  Coffee,
  Ticket,
  HelpCircle,
} from 'lucide-react';
import ErrorState from '@/components/ErrorState';

const RESERVATION_TYPES = [
  'FLIGHT',
  'TRAIN',
  'BUS',
  'HOTEL',
  'RESTAURANT',
  'CAR',
  'EVENT',
  'ATTRACTION',
  'OTHER'
];

export default function AdminReservationsPage() {
  const [reservations, setReservations] = useState<any[]>([]);
  const [trips, setTrips] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Form states
  const [modalOpen, setModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formTitle, setFormTitle] = useState('');
  const [formType, setFormType] = useState('OTHER');
  const [formLocation, setFormLocation] = useState('');
  const [formConfNum, setFormConfNum] = useState('');
  const [formPrice, setFormPrice] = useState('');
  const [formTripId, setFormTripId] = useState('');
  const [formAddedBy, setFormAddedBy] = useState('');

  const fetchReservations = async () => {
    setLoading(true);
    setError(null);
    const res = await getReservationsAction(page, 10);
    if (res.success && res.data) {
      setReservations(res.data.items || []);
      setTotal(res.data.total || 0);
      setTotalPages(res.data.totalPages || 1);
    } else {
      setError(res.error || 'Không thể lấy danh sách đặt chỗ');
    }
    setLoading(false);
  };

  const fetchOptions = async () => {
    const [resTrips, resUsers] = await Promise.all([
      getTripsAction(undefined, 1, 100),
      getUsersAction(undefined, undefined, 1, 100)
    ]);
    if (resTrips.success && resTrips.data?.items) {
      setTrips(resTrips.data.items);
      if (resTrips.data.items.length > 0) setFormTripId(resTrips.data.items[0].id);
    }
    if (resUsers.success && resUsers.data?.items) {
      setUsers(resUsers.data.items);
      if (resUsers.data.items.length > 0) setFormAddedBy(resUsers.data.items[0].id);
    }
  };

  useEffect(() => {
    fetchReservations();
  }, [page]);

  useEffect(() => {
    fetchOptions();
  }, []);

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

  const openEditModal = (res: any) => {
    setIsEditing(true);
    setEditingId(res.id);
    setFormTitle(res.title);
    setFormType(res.type);
    setFormLocation(res.location || '');
    setFormConfNum(res.confirmationNumber || '');
    setFormPrice(res.price ? String(res.price) : '');
    setFormTripId(res.tripId);
    setFormAddedBy(res.addedBy);
    setModalOpen(true);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const payload = {
      title: formTitle,
      type: formType,
      location: formLocation || undefined,
      confirmationNumber: formConfNum || undefined,
      price: formPrice ? parseFloat(formPrice) : undefined,
      tripId: formTripId,
      addedBy: formAddedBy,
    };

    if (isEditing && editingId) {
      const res = await updateReservationAction(editingId, payload);
      if (res.success) {
        setModalOpen(false);
        fetchReservations();
      } else {
        setError(res.error || 'Cập nhật đặt chỗ thất bại');
      }
    } else {
      const res = await createReservationAction(payload);
      if (res.success) {
        setModalOpen(false);
        fetchReservations();
      } else {
        setError(res.error || 'Tạo đặt chỗ thất bại');
      }
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Bạn có chắc chắn muốn xoá đặt chỗ này không?')) return;
    setError(null);
    const res = await deleteReservationAction(id);
    if (res.success) {
      fetchReservations();
    } else {
      setError(res.error || 'Xoá đặt chỗ thất bại');
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'FLIGHT': return Plane;
      case 'HOTEL': return Hotel;
      case 'RESTAURANT': return Coffee;
      case 'EVENT':
      case 'ATTRACTION': return Ticket;
      default: return HelpCircle;
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Title Header */}
      <div className="flex justify-between items-center gap-4">
        <div>
          <h1 className="text-2xl font-black uppercase text-black dark:text-white tracking-tight">Phiếu Đặt chỗ (Reservations)</h1>
          <p className="text-[10px] font-black uppercase text-muted-foreground mt-1">Danh sách thông tin đặt chỗ được đồng bộ hoặc tạo thủ công.</p>
        </div>
        <button
          onClick={openCreateModal}
          className="px-4 py-2.5 bg-primary text-white text-xs font-black uppercase rounded-xl border-2 border-black shadow-[2px_2px_0px_0px_#000000] hover:translate-y-[-1px] transition-all flex items-center gap-1.5 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Thêm đặt chỗ
        </button>
      </div>

      {error && (
        <div className="p-4 rounded-2xl bg-destructive/10 border-2 border-destructive text-destructive text-xs font-bold flex items-center gap-2.5 shadow-[2px_2px_0px_0px_#000000]">
          <AlertCircle className="w-5 h-5" />
          <span>{error}</span>
        </div>
      )}

      {error && !loading && reservations.length === 0 && (
        <ErrorState message={error} onRetry={fetchReservations} />
      )}

      {/* Table grid */}
      <div className="bg-white border-[3px] border-black dark:border-white rounded-3xl overflow-hidden shadow-[4px_4px_0px_0px_#000000] dark:shadow-[4px_4px_0px_0px_#ffffff] text-black">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-secondary border-b-[3px] border-black text-black font-black uppercase">
                <th className="p-4 border-r border-black">Tiêu đề / Phân loại</th>
                <th className="p-4 border-r border-black">Chuyến đi</th>
                <th className="p-4 border-r border-black">Địa điểm</th>
                <th className="p-4 border-r border-black">Mã xác nhận</th>
                <th className="p-4 border-r border-black">Chi phí</th>
                <th className="p-4 border-r border-black">Thành viên tạo</th>
                <th className="p-4 text-right">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                [1, 2, 3].map(i => (
                  <tr key={i} className="border-b border-black animate-pulse">
                    <td colSpan={7} className="p-6 h-12"></td>
                  </tr>
                ))
              ) : reservations.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-muted-foreground font-bold uppercase">Chưa có thông tin đặt chỗ nào.</td>
                </tr>
              ) : (
                reservations.map(res => {
                  const Icon = getTypeIcon(res.type);
                  return (
                    <tr key={res.id} className="border-b border-black last:border-0 hover:bg-secondary/15 transition">
                      <td className="p-4 border-r border-black">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-secondary/30 border border-black text-black flex items-center justify-center">
                            <Icon className="w-4 h-4 text-primary" />
                          </div>
                          <div>
                            <h4 className="font-bold text-foreground">{res.title}</h4>
                            <span className="text-[9px] bg-white border border-black px-1.5 py-0.5 rounded-full font-bold uppercase text-primary shadow-[1px_1px_0px_0px_#000000]">{res.type}</span>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 border-r border-black font-extrabold text-foreground">{res.trip?.name || 'n/a'}</td>
                      <td className="p-4 border-r border-black text-black/70 font-semibold">{res.location || '-'}</td>
                      <td className="p-4 border-r border-black font-mono font-bold text-black/60">{res.confirmationNumber || '-'}</td>
                      <td className="p-4 border-r border-black font-black text-foreground">
                        {res.price ? `${Number(res.price).toLocaleString('vi-VN')} đ` : '-'}
                      </td>
                      <td className="p-4 border-r border-black font-bold text-black/70">{res.addedByUser?.name || 'n/a'}</td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => openEditModal(res)}
                            className="p-1.5 rounded-xl bg-white border-2 border-black text-black hover:bg-primary hover:text-white flex items-center justify-center transition cursor-pointer shadow-[2px_2px_0px_0px_#000000] hover:translate-y-[-1px]"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(res.id)}
                            className="p-1.5 rounded-xl bg-white border-2 border-black text-black hover:bg-destructive hover:text-white flex items-center justify-center transition cursor-pointer shadow-[2px_2px_0px_0px_#000000] hover:translate-y-[-1px]"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="p-4 border-t-[3px] border-black flex justify-between items-center bg-[#FEFADC]">
            <span className="text-[10px] text-black font-black uppercase">Hiển thị {reservations.length}/{total} đặt chỗ</span>
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
              <h3 className="font-black text-xs uppercase">{isEditing ? 'Cập nhật đặt chỗ' : 'Thêm phiếu đặt chỗ mới'}</h3>
              <button onClick={() => setModalOpen(false)} className="p-1 rounded-lg border border-black bg-white hover:bg-secondary text-black cursor-pointer">
                <X className="w-4.5 h-4.5" />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="p-6 flex flex-col gap-4 max-h-[70vh] overflow-y-auto">
              <div>
                <label className="text-[9px] font-black text-muted-foreground uppercase block mb-1">Tiêu đề đặt chỗ</label>
                <input
                  type="text"
                  value={formTitle}
                  onChange={e => setFormTitle(e.target.value)}
                  placeholder="VD: Vé Máy Bay VJ321 đi Đà Lạt"
                  className="w-full neo-input"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[9px] font-black text-muted-foreground uppercase block mb-1">Phân loại</label>
                  <select
                    value={formType}
                    onChange={e => setFormType(e.target.value)}
                    className="w-full neo-input bg-transparent"
                  >
                    {RESERVATION_TYPES.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-[9px] font-black text-muted-foreground uppercase block mb-1">Chi phí (đ)</label>
                  <input
                    type="number"
                    value={formPrice}
                    onChange={e => setFormPrice(e.target.value)}
                    placeholder="VD: 1200000"
                    className="w-full neo-input"
                  />
                </div>
              </div>

              <div>
                <label className="text-[9px] font-black text-muted-foreground uppercase block mb-1">Địa điểm</label>
                <input
                  type="text"
                  value={formLocation}
                  onChange={e => setFormLocation(e.target.value)}
                  placeholder="VD: Sân bay Tân Sơn Nhất"
                  className="w-full neo-input"
                />
              </div>

              <div>
                <label className="text-[9px] font-black text-muted-foreground uppercase block mb-1">Mã xác nhận (Confirmation #)</label>
                <input
                  type="text"
                  value={formConfNum}
                  onChange={e => setFormConfNum(e.target.value)}
                  placeholder="VD: PNR65432"
                  className="w-full neo-input"
                />
              </div>

              <div>
                <label className="text-[9px] font-black text-muted-foreground uppercase block mb-1">Chọn Chuyến đi</label>
                <select
                  value={formTripId}
                  onChange={e => setFormTripId(e.target.value)}
                  className="w-full neo-input bg-transparent"
                  required
                >
                  {trips.map(t => (
                    <option key={t.id} value={t.id}>{t.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[9px] font-black text-muted-foreground uppercase block mb-1">Thành viên thêm</label>
                <select
                  value={formAddedBy}
                  onChange={e => setFormAddedBy(e.target.value)}
                  className="w-full neo-input bg-transparent"
                  required
                >
                  {users.map(u => (
                    <option key={u.id} value={u.id}>{u.name}</option>
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
                  className="px-5 py-2.5 bg-[#FF9FCE] border-2 border-black text-black text-xs font-black uppercase rounded-xl hover:bg-[#FF9FCE]/90 transition shadow-[2px_2px_0px_0px_#000000] cursor-pointer"
                >
                  {isEditing ? 'Lưu thay đổi' : 'Tạo đặt chỗ'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
