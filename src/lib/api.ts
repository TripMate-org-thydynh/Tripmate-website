import { cookies } from 'next/headers';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3000/api/v1';

export async function getAuthToken() {
  const cookieStore = await cookies();
  return cookieStore.get('token')?.value;
}

export async function fetchWithAuth(endpoint: string, options: RequestInit = {}) {
  const token = await getAuthToken();
  const headers = new Headers(options.headers || {});
  
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }
  
  if (!headers.has('Content-Type') && !(options.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
  }

  const response = await fetch(`${BACKEND_URL}${endpoint}`, {
    cache: 'no-store',
    ...options,
    headers,
  });

  return response;
}
