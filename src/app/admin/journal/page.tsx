'use client';

import { useEffect, useState } from 'react';
import { 
  getJournalsAction, 
  createJournalAction, 
  updateJournalAction, 
  deleteJournalAction, 
  getTripsAction, 
  getUsersAction 
} from '@/app/actions';
import {
  BookOpen,
  Plus,
  Trash2,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  Edit2,
  X,
  Calendar,
  Smile,
} from 'lucide-react';
import ErrorState from '@/components/ErrorState';

const MOODS = ['CHILL', 'HAPPY', 'EXCITED', 'TIRED', 'ADVENTUROUS', 'ANGRY'];

export default function AdminJournalPage() {
  const [journals, setJournals] = useState<any[]>([]);
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
  const [formBody, setFormBody] = useState('');
  const [formMood, setFormMood] = useState('CHILL');
  const [formEntryDate, setFormEntryDate] = useState('');
  const [formTripId, setFormTripId] = useState('');
  const [formAuthorId, setFormAuthorId] = useState('');

  const fetchJournals = async () => {
    setLoading(true);
    setError(null);
    const res = await getJournalsAction(page, 10);
    if (res.success && res.data) {
      setJournals(res.data.items || []);
      setTotal(res.data.total || 0);
      setTotalPages(res.data.totalPages || 1);
    } else {
      setError(res.error || 'Không thể lấy danh sách nhật ký');
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
      if (resUsers.data.items.length > 0) setFormAuthorId(resUsers.data.items[0].id);
    }
  };

  useEffect(() => {
    fetchJournals();
  }, [page]);

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

  const openEditModal = (journal: any) => {
    setIsEditing(true);
    setEditingId(journal.id);
    setFormTitle(journal.title || '');
    setFormBody(journal.body);
    setFormMood(journal.mood);
    setFormEntryDate(new Date(journal.entryDate).toISOString().split('T')[0]);
    setFormTripId(journal.tripId);
    setFormAuthorId(journal.authorId);
    setModalOpen(true);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const payload = {
      title: formTitle || undefined,
      body: formBody,
      mood: formMood,
      entryDate: formEntryDate,
      tripId: formTripId,
      authorId: formAuthorId,
    };

    if (isEditing && editingId) {
      const res = await updateJournalAction(editingId, payload);
      if (res.success) {
        setModalOpen(false);
        fetchJournals();
      } else {
        setError(res.error || 'Cập nhật nhật ký thất bại');
      }
    } else {
      const res = await createJournalAction(payload);
      if (res.success) {
        setModalOpen(false);
        fetchJournals();
      } else {
        setError(res.error || 'Tạo nhật ký thất bại');
      }
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Bạn có chắc chắn muốn xoá nhật ký này không?')) return;
    setError(null);
    const res = await deleteJournalAction(id);
    if (res.success) {
      fetchJournals();
    } else {
      setError(res.error || 'Xoá nhật ký thất bại');
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Title Header */}
      <div className="flex justify-between items-center gap-4">
        <div>
          <h1 className="text-2xl font-black uppercase text-black dark:text-white tracking-tight">Nhật ký chuyến đi (Journal)</h1>
          <p className="text-[10px] font-black uppercase text-muted-foreground mt-1">Danh sách nhật ký ghi lại cảm xúc và câu chuyện của các nhóm bạn trẻ.</p>
        </div>
        <button
          onClick={openCreateModal}
          className="px-4 py-2.5 bg-primary text-white text-xs font-black uppercase rounded-xl border-2 border-black shadow-[2px_2px_0px_0px_#000000] hover:translate-y-[-1px] transition-all flex items-center gap-1.5 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Viết nhật ký
        </button>
      </div>

      {error && (
        <div className="p-4 rounded-2xl bg-destructive/10 border-2 border-destructive text-destructive text-xs font-bold flex items-center gap-2.5 shadow-[2px_2px_0px_0px_#000000]">
          <AlertCircle className="w-5 h-5" />
          <span>{error}</span>
        </div>
      )}

      {error && !loading && journals.length === 0 && (
        <ErrorState message={error} onRetry={fetchJournals} />
      )}

      {/* Table grid */}
      <div className="bg-white border-[3px] border-black dark:border-white rounded-3xl overflow-hidden shadow-[4px_4px_0px_0px_#000000] dark:shadow-[4px_4px_0px_0px_#ffffff] text-black">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-secondary border-b-[3px] border-black text-black font-black uppercase">
                <th className="p-4 border-r border-black">Tiêu đề</th>
                <th className="p-4 border-r border-black">Nội dung ghi chép</th>
                <th className="p-4 border-r border-black">Cảm xúc (Mood)</th>
                <th className="p-4 border-r border-black">Chuyến đi</th>
                <th className="p-4 border-r border-black">Tác giả</th>
                <th className="p-4 border-r border-black">Ngày ghi</th>
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
              ) : journals.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-muted-foreground font-bold uppercase">Chưa có bài nhật ký nào được ghi lại.</td>
                </tr>
              ) : (
                journals.map(journal => (
                  <tr key={journal.id} className="border-b border-black last:border-0 hover:bg-secondary/15 transition">
                    <td className="p-4 border-r border-black font-black uppercase">{journal.title || 'Không tiêu đề'}</td>
                    <td className="p-4 border-r border-black font-semibold text-black/70 max-w-xs truncate">{journal.body}</td>
                    <td className="p-4 border-r border-black">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#FFD043] border border-black text-[9px] font-black uppercase text-black shadow-[1px_1px_0px_0px_#000000]">
                        <Smile className="w-3.5 h-3.5 text-primary" />
                        {journal.mood}
                      </span>
                    </td>
                    <td className="p-4 border-r border-black font-extrabold text-foreground">{journal.trip?.name || 'n/a'}</td>
                    <td className="p-4 border-r border-black font-bold text-black/70">{journal.author?.name || 'n/a'}</td>
                    <td className="p-4 border-r border-black font-bold text-black/70">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-primary" />
                        <span>{new Date(journal.entryDate).toLocaleDateString('vi-VN')}</span>
                      </div>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEditModal(journal)}
                          className="p-1.5 rounded-xl bg-white border-2 border-black text-black hover:bg-primary hover:text-white flex items-center justify-center transition cursor-pointer shadow-[2px_2px_0px_0px_#000000] hover:translate-y-[-1px]"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(journal.id)}
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
            <span className="text-[10px] text-black font-black uppercase">Hiển thị {journals.length}/{total} nhật ký</span>
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
              <h3 className="font-black text-xs uppercase">{isEditing ? 'Cập nhật nhật ký' : 'Viết nhật ký mới'}</h3>
              <button onClick={() => setModalOpen(false)} className="p-1 rounded-lg border border-black bg-white hover:bg-secondary text-black cursor-pointer">
                <X className="w-4.5 h-4.5" />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="p-6 flex flex-col gap-4 max-h-[70vh] overflow-y-auto">
              <div>
                <label className="text-[9px] font-black text-muted-foreground uppercase block mb-1">Tiêu đề</label>
                <input
                  type="text"
                  value={formTitle}
                  onChange={e => setFormTitle(e.target.value)}
                  placeholder="VD: Buổi sáng tuyệt đẹp ở Trại Mát"
                  className="w-full neo-input"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[9px] font-black text-muted-foreground uppercase block mb-1">Cảm xúc (Mood)</label>
                  <select
                    value={formMood}
                    onChange={e => setFormMood(e.target.value)}
                    className="w-full neo-input bg-transparent"
                  >
                    {MOODS.map(mood => (
                      <option key={mood} value={mood}>{mood}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-[9px] font-black text-muted-foreground uppercase block mb-1">Ngày ghi nhận</label>
                  <input
                    type="date"
                    value={formEntryDate}
                    onChange={e => setFormEntryDate(e.target.value)}
                    className="w-full neo-input"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-[9px] font-black text-muted-foreground uppercase block mb-1">Nội dung nhật ký</label>
                <textarea
                  value={formBody}
                  onChange={e => setFormBody(e.target.value)}
                  placeholder="Kể câu chuyện, kỉ niệm chuyến đi tại đây..."
                  rows={4}
                  className="w-full neo-input"
                  required
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
                <label className="text-[9px] font-black text-muted-foreground uppercase block mb-1">Tác giả</label>
                <select
                  value={formAuthorId}
                  onChange={e => setFormAuthorId(e.target.value)}
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
                  {isEditing ? 'Lưu thay đổi' : 'Tạo nhật ký'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
