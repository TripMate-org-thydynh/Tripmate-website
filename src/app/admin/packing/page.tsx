'use client';

import { useEffect, useState } from 'react';
import { 
  getPackingAction, 
  createPackingAction, 
  updatePackingAction, 
  deletePackingAction, 
  getTripsAction, 
  getUsersAction 
} from '@/app/actions';
import {
  Plus,
  Trash2,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  Edit2,
  X,
} from 'lucide-react';
import ErrorState from '@/components/ErrorState';

const PACKING_CATEGORIES = [
  'CLOTHES',
  'DOCUMENT',
  'ELECTRONICS',
  'MEDICINE',
  'TOILETRIES',
  'OTHER'
];

export default function AdminPackingPage() {
  const [packingItems, setPackingItems] = useState<any[]>([]);
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
  const [formName, setFormName] = useState('');
  const [formCategory, setFormCategory] = useState('OTHER');
  const [formQuantity, setFormQuantity] = useState('1');
  const [formTripId, setFormTripId] = useState('');
  const [formAddedBy, setFormAddedBy] = useState('');

  const fetchPacking = async () => {
    setLoading(true);
    setError(null);
    const res = await getPackingAction(page, 10);
    if (res.success && res.data) {
      setPackingItems(res.data.items || []);
      setTotal(res.data.total || 0);
      setTotalPages(res.data.totalPages || 1);
    } else {
      setError(res.error || 'Không thể lấy danh sách đồ chuẩn bị');
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
    fetchPacking();
  }, [page]);

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

  const openEditModal = (item: any) => {
    setIsEditing(true);
    setEditingId(item.id);
    setFormName(item.name);
    setFormCategory(item.category);
    setFormQuantity(String(item.quantity));
    setFormTripId(item.tripId);
    setFormAddedBy(item.addedBy);
    setModalOpen(true);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const payload = {
      name: formName,
      category: formCategory,
      quantity: parseInt(formQuantity, 10) || 1,
      tripId: formTripId,
      addedBy: formAddedBy,
    };

    if (isEditing && editingId) {
      const res = await updatePackingAction(editingId, payload);
      if (res.success) {
        setModalOpen(false);
        fetchPacking();
      } else {
        setError(res.error || 'Cập nhật đồ đạc thất bại');
      }
    } else {
      const res = await createPackingAction(payload);
      if (res.success) {
        setModalOpen(false);
        fetchPacking();
      } else {
        setError(res.error || 'Tạo đồ đạc thất bại');
      }
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Bạn có chắc chắn muốn xoá vật dụng hành lý này không?')) return;
    setError(null);
    const res = await deletePackingAction(id);
    if (res.success) {
      fetchPacking();
    } else {
      setError(res.error || 'Xoá đồ đạc thất bại');
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Title Header */}
      <div className="flex justify-between items-center gap-4">
        <div>
          <h1 className="text-2xl font-black uppercase text-black dark:text-white tracking-tight">Hành lý Đồ đạc (Packing)</h1>
          <p className="text-[10px] font-black uppercase text-muted-foreground mt-1">Quản lý các vật dụng cần chuẩn bị cho từng chuyến đi.</p>
        </div>
        <button
          onClick={openCreateModal}
          className="px-4 py-2.5 bg-primary text-white text-xs font-black uppercase rounded-xl border-2 border-black shadow-[2px_2px_0px_0px_#000000] hover:translate-y-[-1px] transition-all flex items-center gap-1.5 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Thêm đồ đạc
        </button>
      </div>

      {error && (
        <div className="p-4 rounded-2xl bg-destructive/10 border-2 border-destructive text-destructive text-xs font-bold flex items-center gap-2.5 shadow-[2px_2px_0px_0px_#000000]">
          <AlertCircle className="w-5 h-5" />
          <span>{error}</span>
        </div>
      )}

      {error && !loading && packingItems.length === 0 && (
        <ErrorState message={error} onRetry={fetchPacking} />
      )}

      {/* Table grid */}
      <div className="bg-white border-[3px] border-black dark:border-white rounded-3xl overflow-hidden shadow-[4px_4px_0px_0px_#000000] dark:shadow-[4px_4px_0px_0px_#ffffff] text-black">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-secondary border-b-[3px] border-black text-black font-black uppercase">
                <th className="p-4 border-r border-black">Tên đồ dùng</th>
                <th className="p-4 border-r border-black">Phân loại</th>
                <th className="p-4 border-r border-black">Số lượng</th>
                <th className="p-4 border-r border-black">Chuyến đi</th>
                <th className="p-4 border-r border-black">Người phụ trách</th>
                <th className="p-4 border-r border-black">Trạng thái xếp</th>
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
              ) : packingItems.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-muted-foreground font-bold uppercase">Chưa có đồ chuẩn bị nào.</td>
                </tr>
              ) : (
                packingItems.map(item => (
                  <tr key={item.id} className="border-b border-black last:border-0 hover:bg-secondary/15 transition">
                    <td className="p-4 border-r border-black font-black uppercase">{item.name}</td>
                    <td className="p-4 border-r border-black">
                      <span className="text-[9px] bg-white border border-black px-2 py-0.5 rounded-full font-black uppercase shadow-[1px_1px_0px_0px_#000000]">
                        {item.category}
                      </span>
                    </td>
                    <td className="p-4 border-r border-black font-black">{item.quantity}</td>
                    <td className="p-4 border-r border-black font-extrabold text-foreground">{item.trip?.name || 'n/a'}</td>
                    <td className="p-4 border-r border-black font-bold text-black/70">{item.addedByUser?.name || 'n/a'}</td>
                    <td className="p-4 border-r border-black">
                      {item.isPacked ? (
                        <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500 text-emerald-600 font-black text-[9px]">Đã xếp</span>
                      ) : (
                        <span className="px-2.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500 text-amber-600 font-black text-[9px]">Chưa xếp</span>
                      )}
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEditModal(item)}
                          className="p-1.5 rounded-xl bg-white border-2 border-black text-black hover:bg-primary hover:text-white flex items-center justify-center transition cursor-pointer shadow-[2px_2px_0px_0px_#000000] hover:translate-y-[-1px]"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="p-1.5 rounded-xl bg-white border-2 border-black text-black hover:bg-destructive hover:text-white flex items-center justify-center transition cursor-pointer shadow-[2px_2px_0px_0px_#000000] hover:translate-y-[-1px]"
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

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="p-4 border-t-[3px] border-black flex justify-between items-center bg-[#FEFADC]">
            <span className="text-[10px] text-black font-black uppercase">Hiển thị {packingItems.length}/{total} đồ dùng</span>
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
              <h3 className="font-black text-xs uppercase">{isEditing ? 'Cập nhật đồ chuẩn bị' : 'Thêm đồ dùng mới'}</h3>
              <button onClick={() => setModalOpen(false)} className="p-1 rounded-lg border border-black bg-white hover:bg-secondary text-black cursor-pointer">
                <X className="w-4.5 h-4.5" />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="p-6 flex flex-col gap-4">
              <div>
                <label className="text-[9px] font-black text-muted-foreground uppercase block mb-1">Tên đồ dùng / hành lý</label>
                <input
                  type="text"
                  value={formName}
                  onChange={e => setFormName(e.target.value)}
                  placeholder="VD: Kem chống nắng"
                  className="w-full neo-input"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[9px] font-black text-muted-foreground uppercase block mb-1">Phân loại</label>
                  <select
                    value={formCategory}
                    onChange={e => setFormCategory(e.target.value)}
                    className="w-full neo-input bg-transparent"
                  >
                    {PACKING_CATEGORIES.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-[9px] font-black text-muted-foreground uppercase block mb-1">Số lượng</label>
                  <input
                    type="number"
                    value={formQuantity}
                    onChange={e => setFormQuantity(e.target.value)}
                    min={1}
                    className="w-full neo-input"
                    required
                  />
                </div>
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
                <label className="text-[9px] font-black text-muted-foreground uppercase block mb-1">Thành viên chuẩn bị</label>
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
                  className="px-5 py-2.5 bg-[#FFD043] border-2 border-black text-black text-xs font-black uppercase rounded-xl hover:bg-[#FFD043]/90 transition shadow-[2px_2px_0px_0px_#000000] cursor-pointer"
                >
                  {isEditing ? 'Lưu thay đổi' : 'Thêm đồ vật'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
