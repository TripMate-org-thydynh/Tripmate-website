'use client';

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { loginAdmin } from '@/app/actions';
import ThemeToggle from '@/components/ThemeToggle';
import { Lock, User, AlertCircle, ArrowRight, Loader2 } from 'lucide-react';
import Link from 'next/link';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full py-2.5 px-4 bg-[#FFD84D] hover:bg-[#FACC15] text-[#141210] text-xs font-bold rounded-lg shadow-xs border border-amber-400/40 transition-all duration-150 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.99] focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-amber-500/40 dark:bg-[#FFD84D] dark:hover:bg-[#FACC15] dark:text-[#141210]"
    >
      {pending ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin" />
          <span>Đang xác thực tài khoản...</span>
        </>
      ) : (
        <>
          <span>Đăng nhập Quản trị</span>
          <ArrowRight className="w-4 h-4" />
        </>
      )}
    </button>
  );
}

export default function AdminLoginPage() {
  const [state, formAction] = useActionState(loginAdmin, null);

  return (
    <div
      className="min-h-screen bg-[#F8FAFC] dark:bg-[#070B16] flex flex-col justify-center items-center p-4 relative"
      suppressHydrationWarning
    >
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>

      <div className="w-full max-w-sm flex flex-col gap-6">
        {/* Brand Logo Header */}
        <div className="flex flex-col items-center gap-2 text-center">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#FFD84D] flex items-center justify-center text-[#141210] font-black text-sm shadow-xs border border-amber-500/20">
              TM
            </div>
            <span className="font-bold text-lg text-[#0F172A] dark:text-[#F8FAFC] tracking-tight">
              TripMate
            </span>
          </Link>
          <div className="flex items-center gap-1.5 mt-1">
            <span className="text-[11px] font-semibold text-[#475569] dark:text-[#94A3B8] uppercase tracking-wider">
              Admin Portal
            </span>
          </div>
        </div>

        {/* Login Card */}
        <div className="p-6 rounded-xl bg-white dark:bg-[#111827] border border-[#E2E8F0] dark:border-[#1E293B] shadow-xl">
          <div className="mb-5">
            <h2 className="text-base font-semibold text-[#0F172A] dark:text-[#F8FAFC]">
              Đăng nhập Quản trị
            </h2>
            <p className="text-xs text-[#475569] dark:text-[#94A3B8] mt-0.5">
              Nhập tài khoản quản trị viên để truy cập hệ thống
            </p>
          </div>

          {state?.error && (
            <div className="p-3 mb-4 rounded-lg bg-[#EF4444]/10 border border-[#EF4444]/25 text-[#EF4444] text-xs flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{state.error}</span>
            </div>
          )}

          <form action={formAction} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-[#475569] dark:text-[#94A3B8]">
                Tên đăng nhập
              </label>
              <div className="relative flex items-center">
                <User className="absolute left-3 w-4 h-4 text-[#94A3B8] pointer-events-none" />
                <input
                  type="text"
                  name="username"
                  placeholder="admin"
                  autoComplete="username"
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-[#E2E8F0] dark:border-[#1E293B] bg-white dark:bg-[#0D1424] text-[#0F172A] dark:text-[#F8FAFC] placeholder:text-[#94A3B8] dark:placeholder:text-[#64748B] focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-amber-500/30 focus-visible:border-amber-500 transition-colors"
                  required
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-[#475569] dark:text-[#94A3B8]">
                Mật khẩu
              </label>
              <div className="relative flex items-center">
                <Lock className="absolute left-3 w-4 h-4 text-[#94A3B8] pointer-events-none" />
                <input
                  type="password"
                  name="password"
                  placeholder="••••••••"
                  autoComplete="current-password"
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-[#E2E8F0] dark:border-[#1E293B] bg-white dark:bg-[#0D1424] text-[#0F172A] dark:text-[#F8FAFC] placeholder:text-[#94A3B8] dark:placeholder:text-[#64748B] focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-amber-500/30 focus-visible:border-amber-500 transition-colors"
                  required
                />
              </div>
            </div>

            <div className="pt-2">
              <SubmitButton />
            </div>
          </form>
        </div>

        <div className="text-center">
          <Link
            href="/"
            className="text-xs text-[#475569] hover:text-amber-600 dark:text-[#94A3B8] dark:hover:text-amber-400 transition-colors"
          >
            ← Quay lại Trang Chủ
          </Link>
        </div>
      </div>
    </div>
  );
}
