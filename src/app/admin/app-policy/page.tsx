import Link from 'next/link';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { AdminCard } from '@/components/admin/AdminCard';
import { getPolicy } from './actions';
import { PolicyForm } from './policy-form';

const channels = [
  ['default', 'Mặc định'],
  ['play', 'Google Play'],
  ['appstore', 'App Store'],
  ['direct', 'APK trực tiếp'],
  ['web', 'Web'],
] as const;

export default async function AppPolicyPage({ searchParams }: { searchParams: Promise<{ channel?: string }> }) {
  const { channel: query } = await searchParams;
  const channel = channels.find(([key]) => key === query)?.[0] ?? 'default';
  const result = await getPolicy(channel);
  return (
    <div className="space-y-5">
      <AdminPageHeader title="Phiên bản & bảo trì" description="Quản lý chính sách cập nhật và trạng thái ứng dụng theo kênh phát hành." />
      <nav aria-label="Kênh phát hành" className="flex flex-wrap gap-2">
        {channels.map(([key, label]) => (
          <Link key={key} href={key === 'default' ? '/admin/app-policy' : '/admin/app-policy?channel=' + key}
            aria-current={key === channel ? 'page' : undefined}
            className="px-3 py-2 text-sm font-medium text-admin-text-secondary transition-colors hover:bg-admin-surface-hover aria-[current=page]:bg-[var(--admin-accent-bg)] aria-[current=page]:text-[var(--admin-accent-ink)] aria-[current=page]:font-semibold">
            {label}
          </Link>
        ))}
      </nav>
      {result.data ? <PolicyForm key={channel} channel={channel} initial={result.data} /> :
        <AdminCard role="alert">{result.error}</AdminCard>}
    </div>
  );
}
