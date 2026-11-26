'use client';

import { useState, type FormEvent } from 'react';
import { AdminButton } from '@/components/admin/AdminButton';
import { AdminCard } from '@/components/admin/AdminCard';
import { AdminInput } from '@/components/admin/AdminInput';
import { publishPolicy, type Policy, type PolicyOverview } from './actions';

function compareVersions(left: string, right: string) {
  const [major, minor, patch] = left.split('.').map(Number);
  const [otherMajor, otherMinor, otherPatch] = right.split('.').map(Number);
  return major - otherMajor || minor - otherMinor || patch - otherPatch;
}

const versionPattern = '(0|[1-9][0-9]{0,5})[.](0|[1-9][0-9]{0,5})[.](0|[1-9][0-9]{0,5})';

function hasDownloadUrl(value: string | null, channel: string) {
  if (!value) return false;
  let url: URL;
  try {
    url = new URL(value);
  } catch {
    return false;
  }
  if (url.protocol !== 'https:' || url.username || url.password || url.hash) return false;
  if (channel === 'play') {
    return url.hostname === 'play.google.com' && url.pathname === '/store/apps/details' &&
      url.searchParams.get('id') === 'com.tripmate.app';
  }
  if (channel === 'appstore') {
    return url.hostname === 'apps.apple.com' && /\/app\/(?:[^/]+\/)?id[0-9]+\/?$/.test(url.pathname);
  }
  return true;
}

export function PolicyForm({ initial, channel }: { initial: PolicyOverview; channel: string }) {
  const [overview, setOverview] = useState(initial);
  const [draft, setDraft] = useState<Policy>(initial.saved ?? {
    ...initial.effective,
    maintenance: channel === 'default' && initial.effective.maintenance,
    maintenanceMessage: channel === 'default' ? initial.effective.maintenanceMessage : null,
  });
  const [reason, setReason] = useState('');
  const [testVersion, setTestVersion] = useState('1.0.0');
  const [status, setStatus] = useState<{ text: string; success: boolean }>();
  const [saving, setSaving] = useState(false);
  const validVersion = new RegExp('^' + versionPattern + '$');
  const globalMaintenance = channel !== 'default' && overview.globalMaintenance;
  let preview = 'Nhập phiên bản theo dạng 1.2.3';
  if (draft.maintenance || globalMaintenance) preview = 'Bảo trì';
  else if (validVersion.test(testVersion) && validVersion.test(draft.minVersion) && validVersion.test(draft.latestVersion)) {
    if (compareVersions(draft.minVersion, draft.latestVersion) > 0) preview = 'Phiên bản tối thiểu vượt phiên bản mới nhất';
    else if (compareVersions(testVersion, draft.minVersion) < 0) {
      if (channel === 'default') preview = 'Bắt buộc cập nhật nếu kênh có link tải';
      else if (hasDownloadUrl(draft.updateUrl?.trim() || overview.fallbackUpdateUrl, channel)) preview = 'Bắt buộc cập nhật';
      else preview = 'Có bản cập nhật, có thể bỏ qua';
    }
    else if (compareVersions(testVersion, draft.latestVersion) < 0) preview = 'Có bản cập nhật, có thể bỏ qua';
    else preview = 'Có thể vào ứng dụng';
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setStatus(undefined);
    try {
      const result = await publishPolicy(channel, { ...draft, updateUrl: channel === 'default' ? null : draft.updateUrl }, reason);
      if (result.data) {
        setOverview(result.data);
        setDraft(result.data.saved ?? result.data.effective);
        setReason('');
        setStatus({ text: 'Đã cập nhật chính sách.', success: true });
      } else {
        setStatus({ text: result.error, success: false });
      }
    } catch {
      setStatus({ text: 'Không thể lưu chính sách. Vui lòng thử lại.', success: false });
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="grid gap-5 xl:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
      <AdminCard>
        <form onSubmit={submit} className="space-y-4">
          <h2 className="text-base font-semibold">Chính sách phát hành</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <AdminInput id="policy-min" label="Phiên bản tối thiểu" pattern={versionPattern} required value={draft.minVersion}
              onChange={(e) => setDraft({ ...draft, minVersion: e.target.value })} />
            <AdminInput id="policy-latest" label="Phiên bản mới nhất" pattern={versionPattern} required value={draft.latestVersion}
              onChange={(e) => setDraft({ ...draft, latestVersion: e.target.value })} />
          </div>
          {channel !== 'default' && <AdminInput id="policy-url" label="Link cập nhật" type="url" maxLength={500}
            placeholder="https://" value={draft.updateUrl ?? ''} onChange={(e) => setDraft({ ...draft, updateUrl: e.target.value })} />}
          <label className="flex items-center gap-2 text-sm font-medium">
            <input type="checkbox" checked={draft.maintenance} onChange={(e) => setDraft({ ...draft, maintenance: e.target.checked })} />
            Bật bảo trì {channel === 'default' ? 'cho mọi kênh' : 'cho kênh này'}
          </label>
          <AdminInput id="policy-message" label="Thông báo bảo trì" maxLength={300} value={draft.maintenanceMessage ?? ''}
            onChange={(e) => setDraft({ ...draft, maintenanceMessage: e.target.value })} />
          <AdminInput id="policy-reason" label="Lý do thay đổi" value={reason} required maxLength={300} onChange={(e) => setReason(e.target.value)} />
          <AdminButton type="submit" loading={saving} disabled={!reason.trim()}>Áp dụng chính sách</AdminButton>
          {status && <p role={status.success ? 'status' : 'alert'} className="text-sm">{status.text}</p>}
        </form>
      </AdminCard>
      <div className="min-w-0 space-y-5">
        <AdminCard className="space-y-3">
          <h2 className="text-base font-semibold">Xem trước trên app</h2>
          <AdminInput id="policy-preview-version" label="Phiên bản đang chạy" value={testVersion} onChange={(e) => setTestVersion(e.target.value)} />
          <p className="break-words text-sm font-medium" aria-live="polite">{preview}</p>
          {globalMaintenance && <p className="text-sm text-slate-600 dark:text-slate-300">Tất cả kênh đang bảo trì theo chính sách mặc định.</p>}
        </AdminCard>
        <AdminCard className="space-y-3">
          <h2 className="text-base font-semibold">Lịch sử thay đổi</h2>
          {overview.history.length === 0 ? <p className="text-sm text-slate-500">Chưa có thay đổi.</p> :
            <ol className="divide-y divide-slate-200 dark:divide-slate-700">
              {overview.history.map((entry) => (
                <li key={entry.id} className="space-y-1 py-3 text-sm">
                  <p className="break-words font-medium">{entry.reason}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {entry.admin.name ?? 'Quản trị viên'} · <time dateTime={entry.createdAt}>
                      {new Date(entry.createdAt).toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' })}
                    </time>
                  </p>
                  <p className="text-xs">Tối thiểu {entry.details.minVersion} · Mới nhất {entry.details.latestVersion} · {entry.details.maintenance ? 'Có bảo trì' : 'Tắt bảo trì'}</p>
                </li>
              ))}
            </ol>}
        </AdminCard>
      </div>
    </div>
  );
}
