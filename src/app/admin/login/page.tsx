'use client';

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { loginAdmin } from '@/app/actions';
import ThemeToggle from '@/components/ThemeToggle';
import { Lock, User, AlertCircle, ArrowRight } from 'lucide-react';
import Link from 'next/link';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full py-3.5 bg-primary text-white font-black uppercase rounded-2xl border-[3px] border-black shadow-[4px_4px_0px_0px_#000000] hover:bg-primary/95 transition-all flex items-center justify-center gap-2 hover:translate-y-[-1px] active:translate-y-[1px] disabled:opacity-50 cursor-pointer"
    >
      {pending ? (
        <>
          <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          Đang xác thực...
        </>
      ) : (
        <>
          Đăng nhập Admin
          <ArrowRight className="w-4 h-4" />
        </>
      )}
    </button>
  );
}

export default function AdminLoginPage() {
  // Server action handles redirect() itself — state only contains errors
  const [state, formAction] = useActionState(loginAdmin, null);

  return (
    <div className="min-h-screen bg-[#FEFADC] dark:bg-[#1C1A19] flex flex-col justify-center items-center p-6 relative overflow-hidden">
      <div className="absolute top-6 right-6">
        <ThemeToggle />
      </div>

      <div className="w-full max-w-md flex flex-col gap-6">
        {/* Logo */}
        <div className="flex flex-col items-center gap-3 text-center">
          <Link href="/">
            <span className="font-black text-3xl tracking-tight text-black dark:text-white lowercase">
              trip<span className="text-primary">.</span>mate
            </span>
          </Link>
          <div className="flex items-center gap-2">
            <div className="h-px w-12 bg-black dark:bg-white opacity-30" />
            <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Admin Control Center</span>
            <div className="h-px w-12 bg-black dark:bg-white opacity-30" />
          </div>
        </div>

        {/* Card */}
        <div className="p-8 rounded-3xl bg-white dark:bg-[#252322] border-[3px] border-black dark:border-white shadow-[6px_6px_0px_0px_#000000] dark:shadow-[6px_6px_0px_0px_#ffffff]">
          <h2 className="text-lg font-black uppercase text-black dark:text-white mb-6 text-center">Đăng nhập Quản trị</h2>

          {state?.error && (
            <div className="p-4 mb-5 rounded-2xl bg-red-50 border-2 border-red-500 text-red-600 text-xs font-bold flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{state.error}</span>
            </div>
          )}

          <form action={formAction} className="flex flex-col gap-5">
            <div>
              <label className="text-[9px] font-black text-muted-foreground uppercase tracking-wider block mb-1.5 pl-1">
                Username
              </label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-black dark:text-white pointer-events-none" />
                <input
                  type="text"
                  name="username"
                  placeholder="Tên tài khoản admin"
                  autoComplete="username"
                  className="w-full pl-11 pr-4 py-3.5 text-xs rounded-2xl border-[3px] border-black dark:border-white bg-white dark:bg-[#1C1A19] text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-primary font-bold"
                  required
                />
              </div>
            </div>

            <div>
              <label className="text-[9px] font-black text-muted-foreground uppercase tracking-wider block mb-1.5 pl-1">
                Mật khẩu
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-black dark:text-white pointer-events-none" />
                <input
                  type="password"
                  name="password"
                  placeholder="Mật khẩu bảo mật"
                  autoComplete="current-password"
                  className="w-full pl-11 pr-4 py-3.5 text-xs rounded-2xl border-[3px] border-black dark:border-white bg-white dark:bg-[#1C1A19] text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-primary font-bold"
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
          <Link href="/" className="text-xs font-black uppercase text-muted-foreground hover:text-primary transition-colors">
            ← Quay lại Trang Chủ
          </Link>
        </div>
      </div>
    </div>
  );
}
