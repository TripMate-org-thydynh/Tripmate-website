import { redirect } from 'next/navigation';
import { fetchWithAuth, getAuthToken } from '@/lib/api';
import { AdminShell } from './admin-shell';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  if (!(await getAuthToken())) redirect('/admin/login');

  const user = await fetchWithAuth('/auth/me')
    .then(async (response) => response.ok ? (await response.json()).data : null)
    .catch(() => null);
  if (user?.role !== 'ADMIN' || user.isLocked) redirect('/admin/login');

  return <AdminShell adminName={user.name?.trim() || 'Quản trị viên'}>{children}</AdminShell>;
}
