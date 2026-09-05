'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { fetchWithAuth } from '@/lib/api';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3000/api/v1';

// --- AUTH ACTIONS ---
export async function loginAdmin(prevState: any, formData: FormData) {
  const username = formData.get('username') as string;
  const password = formData.get('password') as string;

  if (!username || !password) {
    return { success: false, error: 'Vui lòng điền đầy đủ username và mật khẩu' };
  }

  try {
    const response = await fetch(`${BACKEND_URL}/auth/login-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });

    const resData = await response.json();

    if (!response.ok) {
      return { success: false, error: resData.message || 'Đăng nhập thất bại' };
    }

    const { user, token } = resData.data || resData; // Handle nested or flat data formats

    if (!user || user.role !== 'ADMIN') {
      return { success: false, error: 'Tài khoản không có quyền Admin' };
    }

    if (user.isLocked) {
      return { success: false, error: 'Tài khoản của bạn đã bị khoá' };
    }

    // Set cookie with lax sameSite so it works on redirect navigations
    const cookieStore = await cookies();
    cookieStore.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    });

    // Server-side redirect — most reliable way in Next.js App Router
    redirect('/admin');
  } catch (err: any) {
    if ((err as any).digest?.startsWith('NEXT_REDIRECT')) throw err;
    return { success: false, error: err.message || 'Lỗi kết nối máy chủ' };
  }
}

export async function logoutAdmin() {
  const cookieStore = await cookies();
  cookieStore.delete('token');
  return { success: true };
}

export async function checkAuthAdmin() {
  try {
    const response = await fetchWithAuth('/auth/me');
    if (!response.ok) return { authenticated: false };
    const resData = await response.json();
    // Backend wraps all responses via TransformInterceptor: { data: ... }
    const user = resData?.data ?? resData;
    return { authenticated: user?.role === 'ADMIN' && !user?.isLocked, user };
  } catch {
    return { authenticated: false };
  }
}

// --- STATS & ANALYTICS ---
export async function getStatsAction() {
  try {
    const res = await fetchWithAuth('/admin/stats');
    if (!res.ok) throw new Error('Failed to fetch stats');
    const json = await res.json();
    return { success: true, data: json.data ?? json };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function getGrowthAnalyticsAction() {
  try {
    const res = await fetchWithAuth('/admin/analytics/growth');
    if (!res.ok) throw new Error('Failed to fetch growth analytics');
    const json = await res.json();
    return { success: true, data: json.data ?? json };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function getRevenueAnalyticsAction() {
  try {
    const res = await fetchWithAuth('/admin/analytics/revenue');
    if (!res.ok) throw new Error('Failed to fetch revenue analytics');
    const json = await res.json();
    return { success: true, data: json.data ?? json };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function getAiAnalyticsAction() {
  try {
    const res = await fetchWithAuth('/admin/analytics/ai');
    if (!res.ok) throw new Error('Failed to fetch AI analytics');
    const json = await res.json();
    return { success: true, data: json.data ?? json };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

// --- USER ACTIONS ---
export async function getUsersAction(search?: string, role?: string, page = 1, limit = 10) {
  try {
    let query = `?page=${page}&limit=${limit}`;
    if (search) query += `&search=${encodeURIComponent(search)}`;
    if (role) query += `&role=${role}`;

    const res = await fetchWithAuth(`/admin/users${query}`);
    if (!res.ok) throw new Error('Failed to fetch users');
    return { success: true, data: await res.json() };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function getUserDetailAction(id: string) {
  try {
    const res = await fetchWithAuth(`/admin/users/${id}`);
    if (!res.ok) throw new Error('Failed to fetch user details');
    return { success: true, data: await res.json() };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function updateUserAction(id: string, data: { role?: string; isLocked?: boolean }) {
  try {
    const res = await fetchWithAuth(`/admin/users/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to update user');
    return { success: true, data: await res.json() };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function deleteUserAction(id: string) {
  try {
    const res = await fetchWithAuth(`/admin/users/${id}`, {
      method: 'DELETE',
    });
    if (!res.ok) throw new Error('Failed to delete user');
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

// --- TRIP ACTIONS ---
export async function getTripsAction(search?: string, page = 1, limit = 10) {
  try {
    let query = `?page=${page}&limit=${limit}`;
    if (search) query += `&search=${encodeURIComponent(search)}`;

    const res = await fetchWithAuth(`/admin/trips${query}`);
    if (!res.ok) throw new Error('Failed to fetch trips');
    return { success: true, data: await res.json() };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function createTripAction(data: { name: string; destination?: string; startDate: string; endDate: string; createdBy: string }) {
  try {
    const res = await fetchWithAuth('/admin/trips', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to create trip');
    return { success: true, data: await res.json() };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function updateTripAction(id: string, data: any) {
  try {
    const res = await fetchWithAuth(`/admin/trips/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to update trip');
    return { success: true, data: await res.json() };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function deleteTripAction(id: string) {
  try {
    const res = await fetchWithAuth(`/admin/trips/${id}`, {
      method: 'DELETE',
    });
    if (!res.ok) throw new Error('Failed to delete trip');
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

// --- RESERVATION ACTIONS ---
export async function getReservationsAction(page = 1, limit = 10) {
  try {
    const res = await fetchWithAuth(`/admin/reservations?page=${page}&limit=${limit}`);
    if (!res.ok) throw new Error('Failed to fetch reservations');
    return { success: true, data: await res.json() };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function createReservationAction(data: any) {
  try {
    const res = await fetchWithAuth('/admin/reservations', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to create reservation');
    return { success: true, data: await res.json() };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function updateReservationAction(id: string, data: any) {
  try {
    const res = await fetchWithAuth(`/admin/reservations/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to update reservation');
    return { success: true, data: await res.json() };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function deleteReservationAction(id: string) {
  try {
    const res = await fetchWithAuth(`/admin/reservations/${id}`, {
      method: 'DELETE',
    });
    if (!res.ok) throw new Error('Failed to delete reservation');
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

// --- JOURNAL ACTIONS ---
export async function getJournalsAction(page = 1, limit = 10) {
  try {
    const res = await fetchWithAuth(`/admin/journals?page=${page}&limit=${limit}`);
    if (!res.ok) throw new Error('Failed to fetch journals');
    return { success: true, data: await res.json() };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function createJournalAction(data: any) {
  try {
    const res = await fetchWithAuth('/admin/journals', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to create journal');
    return { success: true, data: await res.json() };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function updateJournalAction(id: string, data: any) {
  try {
    const res = await fetchWithAuth(`/admin/journals/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to update journal');
    return { success: true, data: await res.json() };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function deleteJournalAction(id: string) {
  try {
    const res = await fetchWithAuth(`/admin/journals/${id}`, {
      method: 'DELETE',
    });
    if (!res.ok) throw new Error('Failed to delete journal');
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

// --- PACKING ACTIONS ---
export async function getPackingAction(page = 1, limit = 10) {
  try {
    const res = await fetchWithAuth(`/admin/packing-items?page=${page}&limit=${limit}`);
    if (!res.ok) throw new Error('Failed to fetch packing items');
    return { success: true, data: await res.json() };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function createPackingAction(data: any) {
  try {
    const res = await fetchWithAuth('/admin/packing-items', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to create packing item');
    return { success: true, data: await res.json() };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function updatePackingAction(id: string, data: any) {
  try {
    const res = await fetchWithAuth(`/admin/packing-items/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to update packing item');
    return { success: true, data: await res.json() };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function deletePackingAction(id: string) {
  try {
    const res = await fetchWithAuth(`/admin/packing-items/${id}`, {
      method: 'DELETE',
    });
    if (!res.ok) throw new Error('Failed to delete packing item');
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

// --- CONFIG ACTIONS ---
export async function getConfigsAction() {
  try {
    const res = await fetchWithAuth('/admin/configs');
    if (!res.ok) throw new Error('Failed to fetch configs');
    return { success: true, data: await res.json() };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function updateConfigAction(key: string, value: string, description?: string) {
  try {
    const res = await fetchWithAuth(`/admin/configs/${key}`, {
      method: 'PUT',
      body: JSON.stringify({ value, description }),
    });
    if (!res.ok) throw new Error('Failed to update config');
    return { success: true, data: await res.json() };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

// --- SUBSCRIPTION ACTIONS ---
export async function getSubscriptionsAction(params: {
  search?: string;
  plan?: string;
  status?: string;
  expiringSoon?: boolean;
  page?: number;
  limit?: number;
} = {}) {
  try {
    const page = params.page || 1;
    const limit = params.limit || 10;
    let query = `?page=${page}&limit=${limit}`;
    if (params.search) query += `&search=${encodeURIComponent(params.search)}`;
    if (params.plan) query += `&plan=${params.plan}`;
    if (params.status) query += `&status=${params.status}`;
    if (params.expiringSoon) query += `&expiringSoon=true`;

    const res = await fetchWithAuth(`/admin/subscriptions${query}`);
    if (!res.ok) throw new Error('Failed to fetch subscriptions');
    const json = await res.json();
    return { success: true, data: json.data ?? json };
  } catch (err: any) {
    return { success: false, error: err.message || 'Lỗi khi tải danh sách gói đăng ký' };
  }
}

export async function getSubscriptionDetailAction(id: string) {
  try {
    const res = await fetchWithAuth(`/admin/subscriptions/${id}`);
    if (!res.ok) throw new Error('Failed to fetch subscription detail');
    const json = await res.json();
    return { success: true, data: json.data ?? json };
  } catch (err: any) {
    return { success: false, error: err.message || 'Lỗi khi tải chi tiết gói đăng ký' };
  }
}

export async function extendSubscriptionAction(id: string, months: number, reason: string) {
  try {
    if (!reason || reason.trim() === '') {
      return { success: false, error: 'Vui lòng nhập lý do gia hạn' };
    }
    const res = await fetchWithAuth(`/admin/subscriptions/${id}/extend`, {
      method: 'POST',
      body: JSON.stringify({ months: Number(months), reason: reason.trim() }),
    });
    if (!res.ok) {
      const errJson = await res.json().catch(() => null);
      throw new Error(errJson?.message || 'Gia hạn gói thất bại');
    }
    const json = await res.json();
    return { success: true, data: json.data ?? json };
  } catch (err: any) {
    return { success: false, error: err.message || 'Lỗi khi gia hạn gói' };
  }
}

export async function revokeSubscriptionAction(id: string, reason: string) {
  try {
    if (!reason || reason.trim() === '') {
      return { success: false, error: 'Vui lòng nhập lý do thu hồi gói' };
    }
    const res = await fetchWithAuth(`/admin/subscriptions/${id}/revoke`, {
      method: 'POST',
      body: JSON.stringify({ reason: reason.trim() }),
    });
    if (!res.ok) {
      const errJson = await res.json().catch(() => null);
      throw new Error(errJson?.message || 'Thu hồi gói thất bại');
    }
    const json = await res.json();
    return { success: true, data: json.data ?? json };
  } catch (err: any) {
    return { success: false, error: err.message || 'Lỗi khi thu hồi gói' };
  }
}

