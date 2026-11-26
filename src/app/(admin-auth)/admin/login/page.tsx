'use client';

import Link from 'next/link';
import { ArrowLeft, ArrowRight, CircleAlert, Lock, User } from 'lucide-react';
import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { loginAdmin } from '@/app/actions';
import ThemeToggle from '@/components/ThemeToggle';
import { TripMateMark } from '@/components/TripMateMark';
import { AdminButton } from '@/components/admin/AdminButton';
import { AdminInput } from '@/components/admin/AdminInput';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <AdminButton type="submit" size="lg" loading={pending} className="w-full"
      iconRight={<ArrowRight className="size-4" aria-hidden="true" />}>
      {pending ? 'Đang xác thực…' : 'Đăng nhập'}
    </AdminButton>
  );
}

export default function AdminLoginPage() {
  const [state, formAction] = useActionState(loginAdmin, null);

  return (
    <main className="tripmate-admin flex min-h-dvh flex-col bg-admin-bg text-admin-text-primary">
      <header className="flex items-center justify-between gap-4 px-5 py-4 sm:px-9 sm:py-5">
        <Link href="/" className="flex items-center gap-2.5 text-sm font-bold tracking-tight hover:text-admin-primary">
          <TripMateMark size={32} />
          TripMate
        </Link>
        <ThemeToggle variant="admin" />
      </header>

      <div className="mx-auto flex w-full max-w-[30rem] flex-1 flex-col justify-center px-5 pb-12 pt-6">
        <section className="bg-admin-surface p-6 sm:p-10" aria-labelledby="login-title">
          <h1 id="login-title" className="text-[clamp(1.65rem,5vw,2.125rem)] font-bold leading-tight tracking-[-0.04em]">
            Đăng nhập quản trị
          </h1>
          <p className="mb-7 mt-2 text-sm leading-relaxed text-admin-text-secondary">
            Sử dụng tài khoản quản trị viên TripMate.
          </p>

          {state?.error && (
            <div role="alert" className="mb-5 flex items-start gap-2.5 bg-rose-50 p-3 text-sm text-rose-800 dark:bg-rose-950/50 dark:text-rose-200">
              <CircleAlert className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
              <p>{state.error}</p>
            </div>
          )}

          <form action={formAction} className="space-y-4">
            <AdminInput id="admin-login-username" label="Tên đăng nhập" name="username" autoComplete="username"
              required leftIcon={<User className="size-4" aria-hidden="true" />} />
            <AdminInput id="admin-login-password" label="Mật khẩu" name="password" type="password" autoComplete="current-password"
              required leftIcon={<Lock className="size-4" aria-hidden="true" />} />
            <div className="pt-2"><SubmitButton /></div>
          </form>
        </section>
        <Link href="/" className="mt-5 flex w-fit items-center gap-2 text-sm font-medium text-admin-text-secondary hover:underline">
          <ArrowLeft className="size-4" aria-hidden="true" /> Về trang chủ
        </Link>
      </div>
    </main>
  );
}
