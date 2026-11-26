'use server';

import { fetchWithAuth } from '@/lib/api';

export type Policy = {
  minVersion: string;
  latestVersion: string;
  maintenance: boolean;
  maintenanceMessage: string | null;
  updateUrl: string | null;
};

export type PolicyOverview = {
  saved: Policy | null;
  effective: Policy;
  globalMaintenance: boolean;
  fallbackUpdateUrl: string | null;
  history: { id: string; createdAt: string; reason: string; details: Policy; admin: { name: string | null } }[];
};

async function requestPolicy(endpoint: string, options?: RequestInit) {
  try {
    const response = await fetchWithAuth(endpoint, options);
    const body = await response.json();
    if (!response.ok) {
      const message = body.message;
      return { error: Array.isArray(message) ? message.join(', ') : message || 'Không thể tải chính sách.' };
    }
    return { data: body.data as PolicyOverview };
  } catch {
    return { error: 'Không thể kết nối tới máy chủ.' };
  }
}

export async function getPolicy(channel: string) {
  return requestPolicy('/admin/app-policy?channel=' + encodeURIComponent(channel));
}

export async function publishPolicy(channel: string, policy: Policy, reason: string) {
  return requestPolicy('/admin/app-policy', {
    method: 'PUT',
    body: JSON.stringify({ ...policy, channel, reason }),
  });
}
