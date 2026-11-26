'use server';

import { fetchWithAuth } from '@/lib/api';
import type { DashboardSnapshot, RouteFilter, RouteSort } from './types';

export async function getDashboard(
  rangeMinutes: number,
  stepMinutes: number,
  sortBy: RouteSort,
  endpoint: RouteFilter | null,
): Promise<{ data: DashboardSnapshot } | { error: string }> {
  const query = new URLSearchParams({
    rangeMinutes: String(rangeMinutes),
    stepMinutes: String(stepMinutes),
    sortBy,
  });
  if (endpoint) {
    query.set('route', endpoint.route);
    query.set('method', endpoint.method);
  }
  try {
    const response = await fetchWithAuth('/admin/observability/dashboard?' + query.toString());
    if (response.status === 404) return { error: 'Phiên bản API đang chạy chưa hỗ trợ trang giám sát.' };
    if (!response.ok) return { error: 'Không thể tải dữ liệu giám sát.' };
    const body = await response.json();
    return { data: body.data as DashboardSnapshot };
  } catch {
    return { error: 'Không thể kết nối tới hệ thống giám sát.' };
  }
}
