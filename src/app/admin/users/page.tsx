'use client';

import { useEffect, useState } from 'react';
import { getUsersAction, updateUserAction, deleteUserAction } from '@/app/actions';
import {
  Search,
  UserX,
  UserCheck,
  ShieldAlert,
  Trash2,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  Clock,
  Download,
} from 'lucide-react';
import ErrorState from '@/components/ErrorState';
import EmptyState from '@/components/EmptyState';
import { exportToCSV } from '@/lib/exportCsv';

export default function AdminUsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    const res = await getUsersAction(search, roleFilter || undefined, page, 10);
    if (res.success && res.data) {
      setUsers(res.data.items || []);
      setTotal(res.data.total || 0);
      setTotalPages(res.data.totalPages || 1);
    } else {
      setError(res.error || 'Không thể lấy danh sách người dùng');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchUsers();
  }, [page, roleFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchUsers();
  };

  const handleToggleLock = async (id: string, currentlyLocked: boolean) => {
    setError(null);
    const res = await updateUserAction(id, { isLocked: !currentlyLocked });
    if (res.success) {
      setUsers(users.map(u => u.id === id ? { ...u, isLocked: !currentlyLocked } : u));
    } else {
      setError(res.error || 'Cập nhật trạng thái khoá thất bại');
    }
  };

  const handleChangeRole = async (id: string, newRole: string) => {
    setError(null);
    const res = await updateUserAction(id, { role: newRole });
    if (res.success) {
      setUsers(users.map(u => u.id === id ? { ...u, role: newRole } : u));
    } else {
      setError(res.error || 'Cập nhật phân quyền thất bại');
    }
  };

  const handleDeleteUser = async (id: string) => {
    if (!confirm('Bạn có chắc chắn muốn xoá mềm người dùng này không?')) return;
    setError(null);
    const res = await deleteUserAction(id);
    if (res.success) {
      setUsers(users.map(u => u.id === id ? { ...u, deletedAt: new Date().toISOString() } : u));
    } else {
      setError(res.error || 'Xoá người dùng thất bại');
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black uppercase text-black dark:text-white tracking-tight">Quản lý Thành viên</h1>
          <p className="text-[10px] font-black uppercase text-muted-foreground mt-1">Danh sách tất cả tài khoản người dùng đăng ký trên hệ thống.</p>
        </div>
        <button
          onClick={() => exportToCSV('tripmate_users', users)}
          disabled={!users.length}
          className="px-4 py-2 text-xs font-black uppercase rounded-xl bg-white border-2 border-black hover:bg-secondary text-black shadow-[2px_2px_0px_0px_#000000] hover:translate-y-[-1px] transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
        >
          <Download className="w-4 h-4 text-primary" />
          Xuất CSV
        </button>
      </div>

      {error && (
        <div className="p-4 rounded-2xl bg-destructive/10 border-2 border-destructive text-destructive text-xs font-bold flex items-center gap-2.5 shadow-[2px_2px_0px_0px_#000000]">
          <AlertCircle className="w-5 h-5" />
          <span>{error}</span>
        </div>
      )}

      {error && !loading && users.length === 0 && (
        <ErrorState message={error} onRetry={fetchUsers} />
      )}

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white dark:bg-[#252322] border-[3px] border-black dark:border-white p-4 rounded-2xl shadow-[4px_4px_0px_0px_#000000]">
        <form onSubmit={handleSearchSubmit} className="relative w-full md:w-80">
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Tìm theo email, tên, username..."
            className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl border-2 border-black bg-background focus:outline-none focus:border-primary font-bold text-black"
          />
          <button type="submit" className="absolute inset-y-0 left-0 pl-3 flex items-center text-muted-foreground cursor-pointer" aria-label="Tìm kiếm người dùng">
            <Search className="w-4 h-4 text-black" />
          </button>
        </form>

        <div className="flex items-center gap-2 w-full md:w-auto justify-end">
          <span className="text-xs font-black uppercase text-black dark:text-white whitespace-nowrap">Lọc Vai trò:</span>
          <select
            value={roleFilter}
            onChange={e => { setRoleFilter(e.target.value); setPage(1); }}
            className="px-3 py-2 text-xs border-2 border-black rounded-xl bg-background text-black font-bold"
          >
            <option value="">Tất cả</option>
            <option value="USER">USER</option>
            <option value="ADMIN">ADMIN</option>
          </select>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white border-[3px] border-black dark:border-white rounded-3xl overflow-hidden shadow-[4px_4px_0px_0px_#000000] dark:shadow-[4px_4px_0px_0px_#ffffff] text-black">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-secondary border-b-[3px] border-black text-black font-black uppercase">
                <th className="p-4 border-r border-black">Thành viên</th>
                <th className="p-4 border-r border-black">Username</th>
                <th className="p-4 border-r border-black">Quyền hạn</th>
                <th className="p-4 border-r border-black">Trạng thái</th>
                <th className="p-4 border-r border-black">Ngày tham gia</th>
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
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-muted-foreground font-bold">Không tìm thấy người dùng nào.</td>
                </tr>
              ) : (
                users.map(u => {
                  const isDeleted = !!u.deletedAt;
                  return (
                    <tr key={u.id} className={`border-b border-black last:border-0 hover:bg-secondary/15 transition ${isDeleted ? 'opacity-60 bg-secondary/5' : ''}`}>
                      <td className="p-4 border-r border-black font-bold">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-[#C5B4FA] border-2 border-black flex items-center justify-center font-black text-xs uppercase shrink-0">
                            {u.name ? u.name.substring(0, 2) : 'US'}
                          </div>
                          <div>
                            <h4 className="font-black uppercase">{u.name}</h4>
                            <p className="text-[10px] text-black/60 font-semibold">{u.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 border-r border-black font-mono font-bold text-black/70">@{u.username || 'n/a'}</td>
                      <td className="p-4 border-r border-black">
                        <select
                          value={u.role}
                          disabled={isDeleted}
                          onChange={e => handleChangeRole(u.id, e.target.value)}
                          className="px-2.5 py-1 text-xs border-2 border-black rounded-xl bg-background text-black font-black uppercase"
                        >
                          <option value="USER">USER</option>
                          <option value="ADMIN">ADMIN</option>
                        </select>
                      </td>
                      <td className="p-4 border-r border-black">
                        {isDeleted ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-secondary border border-black text-[10px] font-black uppercase text-black">
                            <Clock className="w-3 h-3" />
                            Đã xoá mềm
                          </span>
                        ) : u.isLocked ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-destructive/20 border-2 border-destructive text-[10px] font-black uppercase text-destructive">
                            <ShieldAlert className="w-3 h-3" />
                            Bị khoá
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/10 border-2 border-emerald-500 text-[10px] font-black uppercase text-emerald-600">
                            <UserCheck className="w-3 h-3" />
                            Hoạt động
                          </span>
                        )}
                      </td>
                      <td className="p-4 border-r border-black font-semibold text-black/70">{new Date(u.createdAt).toLocaleDateString('vi-VN')}</td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleToggleLock(u.id, u.isLocked)}
                            disabled={isDeleted}
                            className={`p-1.5 rounded-xl border-2 border-black flex items-center justify-center transition cursor-pointer disabled:opacity-30 shadow-[2px_2px_0px_0px_#000000] hover:translate-y-[-1px] ${
                              u.isLocked
                                ? 'bg-emerald-500 text-white'
                                : 'bg-destructive text-white'
                            }`}
                            title={u.isLocked ? 'Mở khoá' : 'Khoá tài khoản'}
                            aria-label={u.isLocked ? 'Mở khoá tài khoản' : 'Khoá tài khoản'}
                          >
                            {u.isLocked ? <UserCheck className="w-4 h-4" /> : <UserX className="w-4 h-4" />}
                          </button>
                          <button
                            onClick={() => handleDeleteUser(u.id)}
                            disabled={isDeleted}
                            className="p-1.5 rounded-xl bg-white border-2 border-black text-black hover:bg-destructive hover:text-white flex items-center justify-center transition cursor-pointer disabled:opacity-30 shadow-[2px_2px_0px_0px_#000000] hover:translate-y-[-1px]"
                            title="Xoá mềm tài khoản"
                            aria-label="Xoá mềm tài khoản"
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

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="p-4 border-t-[3px] border-black flex justify-between items-center bg-[#FEFADC]">
            <span className="text-[10px] text-black font-black uppercase">Hiển thị {users.length}/{total} thành viên</span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="p-2 rounded-xl bg-white border-2 border-black hover:bg-secondary text-black shadow-[2px_2px_0px_0px_#000000] hover:translate-y-[-1px] disabled:opacity-40 cursor-pointer"
                aria-label="Trang trước"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="text-xs font-black uppercase px-2">Trang {page} / {totalPages}</span>
              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="p-2 rounded-xl bg-white border-2 border-black hover:bg-secondary text-black shadow-[2px_2px_0px_0px_#000000] hover:translate-y-[-1px] disabled:opacity-40 cursor-pointer"
                aria-label="Trang sau"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
