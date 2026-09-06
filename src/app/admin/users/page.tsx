'use client';

import { useEffect, useState, useCallback } from 'react';
import { getUsersAction, updateUserAction, deleteUserAction } from '@/app/actions';
import {
  UserX,
  UserCheck,
  Trash2,
  Download,
  Filter,
  Eye,
  Shield,
  Clock,
  RefreshCw,
} from 'lucide-react';
import ErrorState from '@/components/ErrorState';
import { exportToCSV } from '@/lib/exportCsv';
import ConfirmModal from '@/components/ui/ConfirmModal';
import ToastContainer, { ToastMessage } from '@/components/ui/Toast';
import { AdminButton } from '@/components/admin/AdminButton';
import { AdminSelect } from '@/components/admin/AdminInput';
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
import { AdminCheckbox } from '@/components/admin/AdminCheckbox';

interface UserItem {
  id: string;
  name: string | null;
  username: string | null;
  email: string;
  role: 'USER' | 'ADMIN' | string;
  isLocked: boolean;
  deletedAt: string | null;
  createdAt: string;
  avatarUrl?: string | null;
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserItem[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [statusTab, setStatusTab] = useState<'ALL' | 'ACTIVE' | 'LOCKED' | 'ADMIN'>('ALL');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Bulk selection state
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Drawer Quick View state
  const [viewingUser, setViewingUser] = useState<UserItem | null>(null);

  // Toast state
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const addToast = (type: 'success' | 'error' | 'info', message: string) => {
    setToasts((prev) => [...prev, { id: `${Date.now()}-${Math.random()}`, type, message }]);
  };

  // Confirm Modal state
  const [confirmState, setConfirmState] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    isDestructive: boolean;
    onConfirm: () => void;
  }>({
    isOpen: false,
    title: '',
    message: '',
    isDestructive: false,
    onConfirm: () => {},
  });

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError(null);
    const targetRole = statusTab === 'ADMIN' ? 'ADMIN' : roleFilter || undefined;
    const res = await getUsersAction(search, targetRole, page, limit);
    if (res.success && res.data) {
      const payload = res.data.data || res.data;
      let items: UserItem[] = payload.items || (Array.isArray(payload) ? payload : []);
      if (statusTab === 'ACTIVE') {
        items = items.filter((u) => !u.isLocked && !u.deletedAt);
      } else if (statusTab === 'LOCKED') {
        items = items.filter((u) => u.isLocked || u.deletedAt);
      }
      setUsers(items);
      setTotal(payload.total ?? items.length ?? 0);
      setTotalPages(payload.totalPages || 1);
      setSelectedIds([]);
    } else {
      setError(res.error || 'Không thể lấy danh sách người dùng');
    }
    setLoading(false);
  }, [statusTab, roleFilter, search, page, limit]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchUsers();
  };

  // Selection handlers
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(users.map((u) => u.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleToggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Lock / Unlock single user
  const promptToggleLock = (user: UserItem) => {
    const isLocking = !user.isLocked;
    setConfirmState({
      isOpen: true,
      title: isLocking ? 'Khoá tài khoản người dùng' : 'Mở khoá tài khoản',
      message: isLocking
        ? `Bạn có chắc chắn muốn khoá tài khoản của "${user.name || user.username}"? Người dùng sẽ bị đăng xuất và không thể tiếp tục sử dụng app.`
        : `Bạn có muốn mở lại quyền truy cập cho tài khoản "${user.name || user.username}"?`,
      isDestructive: isLocking,
      onConfirm: async () => {
        setConfirmState((prev) => ({ ...prev, isOpen: false }));
        const res = await updateUserAction(user.id, { isLocked: isLocking });
        if (res.success) {
          setUsers((prev) =>
            prev.map((u) => (u.id === user.id ? { ...u, isLocked: isLocking } : u))
          );
          if (viewingUser?.id === user.id) {
            setViewingUser({ ...viewingUser, isLocked: isLocking });
          }
          addToast('success', isLocking ? 'Đã khoá tài khoản thành công' : 'Đã mở khoá tài khoản');
        } else {
          addToast('error', res.error || 'Thao tác thất bại');
        }
      },
    });
  };

  // Change Role
  const handleChangeRole = async (id: string, newRole: string) => {
    const res = await updateUserAction(id, { role: newRole });
    if (res.success) {
      setUsers((prev) =>
        prev.map((u) => (u.id === id ? { ...u, role: newRole } : u))
      );
      if (viewingUser?.id === id) {
        setViewingUser({ ...viewingUser, role: newRole });
      }
      addToast('success', `Đã cập nhật vai trò thành ${newRole}`);
    } else {
      addToast('error', res.error || 'Cập nhật phân quyền thất bại');
    }
  };

  // Delete User (Soft Delete)
  const promptDeleteUser = (user: UserItem) => {
    setConfirmState({
      isOpen: true,
      title: 'Xác nhận Xoá mềm Người dùng',
      message: `Hành động này sẽ ẩn tài khoản "${user.name || user.username}" khỏi hệ thống. Bạn có chắc chắn muốn thực hiện?`,
      isDestructive: true,
      onConfirm: async () => {
        setConfirmState((prev) => ({ ...prev, isOpen: false }));
        const res = await deleteUserAction(user.id);
        if (res.success) {
          setUsers((prev) =>
            prev.map((u) =>
              u.id === user.id ? { ...u, deletedAt: new Date().toISOString() } : u
            )
          );
          if (viewingUser?.id === user.id) {
            setViewingUser({ ...viewingUser, deletedAt: new Date().toISOString() });
          }
          addToast('success', 'Đã xoá mềm tài khoản người dùng');
        } else {
          addToast('error', res.error || 'Xoá người dùng thất bại');
        }
      },
    });
  };

  // Bulk Lock Action
  const handleBulkLock = async (lockStatus: boolean) => {
    setConfirmState({
      isOpen: true,
      title: lockStatus ? 'Khoá hàng loạt người dùng' : 'Mở khoá hàng loạt',
      message: `Bạn có chắc muốn ${lockStatus ? 'khoá' : 'mở khoá'} ${selectedIds.length} tài khoản đã chọn?`,
      isDestructive: lockStatus,
      onConfirm: async () => {
        setConfirmState((prev) => ({ ...prev, isOpen: false }));
        let successCount = 0;
        for (const id of selectedIds) {
          const res = await updateUserAction(id, { isLocked: lockStatus });
          if (res.success) successCount++;
        }
        addToast('success', `Đã xử lý thành công ${successCount}/${selectedIds.length} người dùng.`);
        fetchUsers();
      },
    });
  };

  const isAllSelected = users.length > 0 && selectedIds.length === users.length;

  return (
    <div className="flex flex-col gap-6">
      <ToastContainer
        toasts={toasts}
        onDismiss={(id) => setToasts((prev) => prev.filter((t) => t.id !== id))}
      />

      <ConfirmModal
        isOpen={confirmState.isOpen}
        title={confirmState.title}
        message={confirmState.message}
        isDestructive={confirmState.isDestructive}
        onConfirm={confirmState.onConfirm}
        onCancel={() => setConfirmState((prev) => ({ ...prev, isOpen: false }))}
      />

      {/* Page Header */}
      <AdminPageHeader
        title="Quản lý Thành viên"
        description={`Danh sách tất cả tài khoản người dùng đăng ký trên hệ thống TripMate (${total} thành viên).`}
      >
        <AdminButton
          variant="outline"
          size="sm"
          onClick={fetchUsers}
          loading={loading}
          icon={<RefreshCw className="w-3.5 h-3.5" />}
        >
          Tải lại
        </AdminButton>
        <AdminButton
          variant="secondary"
          size="sm"
          onClick={() => exportToCSV('tripmate_users', users)}
          disabled={!users.length}
          icon={<Download className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />}
        >
          Xuất CSV
        </AdminButton>
      </AdminPageHeader>

      {/* Filter Tabs */}
      <AdminTabs
        activeTab={statusTab}
        onChange={(tab) => {
          setStatusTab(tab);
          setPage(1);
        }}
        tabs={[
          { id: 'ALL', label: 'Tất cả thành viên', count: total },
          { id: 'ACTIVE', label: 'Đang hoạt động' },
          { id: 'LOCKED', label: 'Bị khoá / Xoá' },
          { id: 'ADMIN', label: 'Quản trị viên' },
        ]}
      />

      {/* Filter & Search Bar */}
      <AdminFilterBar
        search={search}
        onSearchChange={(val) => setSearch(val)}
        onSearchSubmit={handleSearchSubmit}
        searchPlaceholder="Tìm theo email, tên, username..."
      >
        <div className="flex items-center gap-2">
          <Filter className="w-3.5 h-3.5 text-[#94A3B8]" />
          <span className="text-xs text-[#475569] dark:text-[#94A3B8] whitespace-nowrap">Vai trò:</span>
          <AdminSelect
            value={roleFilter}
            onChange={(e) => {
              setRoleFilter(e.target.value);
              setPage(1);
            }}
            className="w-28"
          >
            <option value="">Tất cả</option>
            <option value="USER">USER</option>
            <option value="ADMIN">ADMIN</option>
          </AdminSelect>
        </div>
      </AdminFilterBar>

      {/* Floating Bulk Action Bar */}
      {selectedIds.length > 0 && (
        <div className="bg-amber-500/10 dark:bg-amber-500/20 border border-amber-500/30 rounded-lg p-2.5 px-4 flex items-center justify-between text-xs animate-in fade-in slide-in-from-top-2 duration-150">
          <span className="font-medium text-[#0F172A] dark:text-[#F8FAFC]">
            Đã chọn <b className="text-amber-600 dark:text-amber-400">{selectedIds.length}</b> người dùng
          </span>
          <div className="flex items-center gap-2">
            <AdminButton
              variant="outline"
              size="xs"
              onClick={() => handleBulkLock(true)}
              icon={<UserX className="w-3 h-3 text-[#EF4444]" />}
            >
              Khoá hàng loạt
            </AdminButton>
            <AdminButton
              variant="outline"
              size="xs"
              onClick={() => handleBulkLock(false)}
              icon={<UserCheck className="w-3 h-3 text-[#22C55E]" />}
            >
              Mở khoá
            </AdminButton>
            <button
              onClick={() => setSelectedIds([])}
              className="text-[#94A3B8] hover:text-[#0F172A] dark:hover:text-[#F8FAFC] underline text-xs ml-2 cursor-pointer"
            >
              Bỏ chọn
            </button>
          </div>
        </div>
      )}

      {error && !loading && users.length === 0 ? (
        <ErrorState message={error} onRetry={fetchUsers} />
      ) : (
        /* Data Table */
        <AdminTable>
          <AdminTableHeader>
            <tr>
              <AdminTableHead width="40px">
                <AdminCheckbox
                  checked={isAllSelected}
                  indeterminate={selectedIds.length > 0 && !isAllSelected}
                  onChange={(e) => handleSelectAll(e.target.checked)}
                  aria-label="Chọn tất cả người dùng"
                />
              </AdminTableHead>
              <AdminTableHead>Thành viên</AdminTableHead>
              <AdminTableHead>Username</AdminTableHead>
              <AdminTableHead>Vai trò</AdminTableHead>
              <AdminTableHead>Trạng thái</AdminTableHead>
              <AdminTableHead>Ngày tham gia</AdminTableHead>
              <AdminTableHead align="right">Thao tác</AdminTableHead>
            </tr>
          </AdminTableHeader>

          {loading ? (
            <AdminTableSkeleton columns={7} rows={6} />
          ) : users.length === 0 ? (
            <AdminTableEmpty colSpan={7} message="Không tìm thấy người dùng nào phù hợp" />
          ) : (
            <tbody>
              {users.map((u) => {
                const isDeleted = !!u.deletedAt;
                const isSelected = selectedIds.includes(u.id);

                return (
                  <AdminTableRow
                    key={u.id}
                    selected={isSelected}
                    className={isDeleted ? 'opacity-60' : ''}
                  >
                    {/* Checkbox */}
                    <AdminTableCell>
                      <AdminCheckbox
                        checked={isSelected}
                        onChange={() => handleToggleSelect(u.id)}
                        aria-label={`Chọn ${u.name || u.email}`}
                      />
                    </AdminTableCell>

                    {/* Member Info */}
                    <AdminTableCell>
                      <div
                        className="flex items-center gap-3 cursor-pointer group"
                        onClick={() => setViewingUser(u)}
                      >
                        <div className="w-8 h-8 rounded-full bg-amber-500/15 text-amber-700 dark:text-amber-300 font-semibold text-xs flex items-center justify-center shrink-0 border border-amber-500/30">
                          {u.name ? u.name.substring(0, 2).toUpperCase() : 'US'}
                        </div>
                        <div className="min-w-0">
                          <h4 className="font-semibold text-[#0F172A] dark:text-[#F8FAFC] group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors truncate">
                            {u.name || 'Chưa đặt tên'}
                          </h4>
                          <p className="text-[11px] text-[#475569] dark:text-[#94A3B8] truncate">
                            {u.email}
                          </p>
                        </div>
                      </div>
                    </AdminTableCell>

                    {/* Username */}
                    <AdminTableCell>
                      <span className="font-mono text-slate-600 dark:text-slate-400 text-[11px]">
                        @{u.username || 'n/a'}
                      </span>
                    </AdminTableCell>

                    {/* Role */}
                    <AdminTableCell>
                      {u.role === 'ADMIN' ? (
                        <AdminBadge variant="primary" dot>
                          ADMIN
                        </AdminBadge>
                      ) : (
                        <AdminBadge variant="neutral">USER</AdminBadge>
                      )}
                    </AdminTableCell>

                    {/* Status */}
                    <AdminTableCell>
                      {isDeleted ? (
                        <AdminBadge variant="danger" icon={<Clock className="w-3 h-3" />}>
                          Đã xoá mềm
                        </AdminBadge>
                      ) : u.isLocked ? (
                        <AdminBadge variant="danger" dot>
                          Bị khoá
                        </AdminBadge>
                      ) : (
                        <AdminBadge variant="success" dot pulse>
                          Hoạt động
                        </AdminBadge>
                      )}
                    </AdminTableCell>

                    {/* Join Date */}
                    <AdminTableCell>
                      <span className="text-slate-500 dark:text-slate-400 text-[11px]">
                        {new Date(u.createdAt).toLocaleDateString('vi-VN')}
                      </span>
                    </AdminTableCell>

                    {/* Row Actions Menu */}
                    <AdminTableCell align="right">
                      <AdminRowActions
                        quickAction={{
                          label: 'Xem chi tiết',
                          icon: <Eye className="w-3.5 h-3.5" />,
                          onClick: () => setViewingUser(u),
                        }}
                        actions={[
                          {
                            label: 'Xem chi tiết',
                            icon: <Eye className="w-3.5 h-3.5 text-slate-400" />,
                            onClick: () => setViewingUser(u),
                          },
                          {
                            label: u.isLocked ? 'Mở khoá tài khoản' : 'Khoá tài khoản',
                            icon: u.isLocked ? (
                              <UserCheck className="w-3.5 h-3.5 text-emerald-500" />
                            ) : (
                              <UserX className="w-3.5 h-3.5 text-amber-500" />
                            ),
                            onClick: () => promptToggleLock(u),
                            disabled: isDeleted,
                          },
                          {
                            label:
                              u.role === 'ADMIN'
                                ? 'Hạ quyền xuống USER'
                                : 'Nâng quyền lên ADMIN',
                            icon: <Shield className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />,
                            onClick: () =>
                              handleChangeRole(u.id, u.role === 'ADMIN' ? 'USER' : 'ADMIN'),
                            disabled: isDeleted,
                          },
                          {
                            label: 'Xoá mềm tài khoản',
                            icon: <Trash2 className="w-3.5 h-3.5 text-rose-500" />,
                            onClick: () => promptDeleteUser(u),
                            variant: 'danger',
                            disabled: isDeleted,
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
        itemLabel="thành viên"
      />

      {/* USER DETAIL QUICK-VIEW DRAWER */}
      <AdminDrawer
        isOpen={!!viewingUser}
        onClose={() => setViewingUser(null)}
        title="Hồ sơ Người dùng"
        description="Thông tin chi tiết tài khoản và lịch sử hoạt động"
        footer={
          viewingUser && (
            <>
              <AdminButton
                variant="outline"
                size="sm"
                onClick={() => setViewingUser(null)}
              >
                Đóng
              </AdminButton>
              <AdminButton
                variant={viewingUser.isLocked ? 'primary' : 'danger'}
                size="sm"
                onClick={() => {
                  promptToggleLock(viewingUser);
                }}
              >
                {viewingUser.isLocked ? 'Mở khoá tài khoản' : 'Khoá tài khoản'}
              </AdminButton>
            </>
          )
        }
      >
        {viewingUser && (
          <div className="flex flex-col gap-6">
            {/* User Profile Header */}
            <div className="flex items-center gap-4 pb-4 border-b border-[#E2E8F0] dark:border-[#1E293B]">
              <div className="w-14 h-14 rounded-full bg-amber-500/15 text-amber-700 dark:text-amber-300 font-bold text-lg flex items-center justify-center border border-amber-500/30 shrink-0">
                {viewingUser.name
                  ? viewingUser.name.substring(0, 2).toUpperCase()
                  : 'US'}
              </div>
              <div className="min-w-0">
                <h3 className="text-base font-bold text-[#0F172A] dark:text-[#F8FAFC] truncate">
                  {viewingUser.name || 'Chưa đặt tên'}
                </h3>
                <p className="text-xs text-[#475569] dark:text-[#94A3B8] truncate">{viewingUser.email}</p>
                <div className="flex items-center gap-2 mt-2">
                  <AdminBadge variant={viewingUser.role === 'ADMIN' ? 'primary' : 'neutral'}>
                    {viewingUser.role}
                  </AdminBadge>
                  {viewingUser.isLocked ? (
                    <AdminBadge variant="danger" dot>
                      Đang bị khoá
                    </AdminBadge>
                  ) : (
                    <AdminBadge variant="success" dot>
                      Bình thường
                    </AdminBadge>
                  )}
                </div>
              </div>
            </div>

            {/* User Metadata Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 rounded-lg bg-slate-50 dark:bg-[#0D1424] border border-[#E2E8F0] dark:border-[#1E293B]">
                <span className="text-[10px] font-medium text-[#94A3B8] dark:text-[#64748B] uppercase block mb-1">
                  User ID
                </span>
                <span className="font-mono text-xs text-[#0F172A] dark:text-[#F8FAFC] break-all select-all">
                  {viewingUser.id}
                </span>
              </div>
              <div className="p-3 rounded-lg bg-slate-50 dark:bg-[#0D1424] border border-[#E2E8F0] dark:border-[#1E293B]">
                <span className="text-[10px] font-medium text-[#94A3B8] dark:text-[#64748B] uppercase block mb-1">
                  Tên đăng nhập
                </span>
                <span className="font-mono text-xs text-[#0F172A] dark:text-[#F8FAFC]">
                  @{viewingUser.username || 'n/a'}
                </span>
              </div>
              <div className="p-3 rounded-lg bg-slate-50 dark:bg-[#0D1424] border border-[#E2E8F0] dark:border-[#1E293B]">
                <span className="text-[10px] font-medium text-[#94A3B8] dark:text-[#64748B] uppercase block mb-1">
                  Ngày đăng ký
                </span>
                <span className="text-xs text-[#0F172A] dark:text-[#F8FAFC]">
                  {new Date(viewingUser.createdAt).toLocaleString('vi-VN')}
                </span>
              </div>
              <div className="p-3 rounded-lg bg-slate-50 dark:bg-[#0D1424] border border-[#E2E8F0] dark:border-[#1E293B]">
                <span className="text-[10px] font-medium text-[#94A3B8] dark:text-[#64748B] uppercase block mb-1">
                  Trạng thái xoá
                </span>
                <span className="text-xs text-[#0F172A] dark:text-[#F8FAFC]">
                  {viewingUser.deletedAt ? 'Đã xoá mềm' : 'Còn hiệu lực'}
                </span>
              </div>
            </div>

            {/* Quick Actions in Drawer */}
            <div className="flex flex-col gap-2 pt-4 border-t border-[#E2E8F0] dark:border-[#1E293B]">
              <h4 className="text-xs font-semibold text-[#0F172A] dark:text-[#F8FAFC] mb-1">
                Thao tác quản trị
              </h4>
              <div className="flex items-center justify-between p-3 rounded-lg border border-[#E2E8F0] dark:border-[#1E293B] bg-white dark:bg-[#0D1424]">
                <div>
                  <p className="text-xs font-medium text-[#0F172A] dark:text-[#F8FAFC]">
                    Phân quyền vai trò
                  </p>
                  <p className="text-[11px] text-[#475569] dark:text-[#94A3B8]">
                    Hiện tại:{' '}
                    <b className="text-amber-600 dark:text-amber-400">{viewingUser.role}</b>
                  </p>
                </div>
                <AdminButton
                  variant="outline"
                  size="xs"
                  onClick={() =>
                    handleChangeRole(
                      viewingUser.id,
                      viewingUser.role === 'ADMIN' ? 'USER' : 'ADMIN'
                    )
                  }
                >
                  {viewingUser.role === 'ADMIN' ? 'Hạ xuống USER' : 'Nâng lên ADMIN'}
                </AdminButton>
              </div>
            </div>
          </div>
        )}
      </AdminDrawer>
    </div>
  );
}
