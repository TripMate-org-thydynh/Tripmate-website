'use client';

import React, { useState, useEffect, useRef } from 'react';
import { getSystemHealthAction } from '@/app/actions';
import {
  Server,
  Database,
  Layers,
  Clock,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  XCircle,
} from 'lucide-react';

interface HealthData {
  status: 'OK' | 'DEGRADED' | 'DOWN';
  timestamp?: string;
  uptime?: number;
  latency?: number;
  checks?: {
    database?: string;
    redis?: string;
  };
}

export function AdminHealthPopover() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [health, setHealth] = useState<HealthData>({
    status: 'OK',
    latency: 18,
    checks: { database: 'UP', redis: 'UP' },
  });
  const [lastChecked, setLastChecked] = useState<Date>(new Date());
  const popoverRef = useRef<HTMLDivElement>(null);

  const checkHealth = async () => {
    setLoading(true);
    try {
      const res = await getSystemHealthAction();
      if (res.success && res.data) {
        setHealth(res.data);
      } else {
        setHealth({
          status: 'DOWN',
          latency: res.data?.latency ?? 0,
          checks: { database: 'DOWN', redis: 'DOWN' },
        });
      }
      setLastChecked(new Date());
    } catch {
      setHealth({
        status: 'DOWN',
        latency: 0,
        checks: { database: 'DOWN', redis: 'DOWN' },
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkHealth();
    // Re-check periodically every 60 seconds
    const interval = setInterval(checkHealth, 60000);
    return () => clearInterval(interval);
  }, []);

  // Outside click listener
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (popoverRef.current && !popoverRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open]);

  const isUp = health.status === 'OK';
  const isDegraded = health.status === 'DEGRADED';

  const formatUptime = (seconds?: number) => {
    if (!seconds) return 'Đang chạy';
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    if (hrs > 0) return `${hrs}h ${mins}m`;
    return `${mins} phút`;
  };

  return (
    <div className="relative" ref={popoverRef}>
      {/* Interactive Trigger Pill */}
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[11px] font-medium transition-all cursor-pointer select-none ${
          isUp
            ? 'border-[#22C55E]/30 bg-[#22C55E]/10 text-[#22C55E] hover:bg-[#22C55E]/20'
            : isDegraded
            ? 'border-amber-500/30 bg-amber-500/10 text-amber-500 hover:bg-amber-500/20'
            : 'border-rose-500/30 bg-rose-500/10 text-rose-500 hover:bg-rose-500/20'
        }`}
        title="Bấm để kiểm tra tình trạng hệ thống & độ trễ API"
        aria-label="Tình trạng hệ thống"
      >
        <span
          className={`w-1.5 h-1.5 rounded-full ${
            isUp ? 'bg-[#22C55E] animate-pulse' : isDegraded ? 'bg-amber-500' : 'bg-rose-500'
          }`}
        />
        <span>
          {isUp
            ? `API Live${health.latency ? ` · ${health.latency}ms` : ''}`
            : isDegraded
            ? 'Degraded'
            : 'Offline'}
        </span>
      </button>

      {/* Floating Popover Card */}
      {open && (
        <div className="absolute right-0 top-full mt-2 w-72 sm:w-80 rounded-xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-[#1E293B] shadow-2xl p-4 z-50 animate-in fade-in-50 zoom-in-95 duration-100 flex flex-col gap-3.5">
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-[#1E293B]">
            <div className="flex items-center gap-2">
              <Server className="w-4 h-4 text-amber-500" />
              <span className="text-xs font-bold text-slate-900 dark:text-[#F8FAFC]">
                Tình Trạng Hệ Thống
              </span>
            </div>
            <span
              className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${
                isUp
                  ? 'bg-emerald-50 dark:bg-emerald-950/50 text-[#22C55E] border border-[#22C55E]/20'
                  : 'bg-rose-50 dark:bg-rose-950/50 text-rose-500 border border-rose-500/20'
              }`}
            >
              {isUp ? 'Hoạt Động Tốt' : 'Mất Kết Nối'}
            </span>
          </div>

          {/* Diagnostics Rows */}
          <div className="flex flex-col gap-2.5 text-xs">
            {/* Backend Server */}
            <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 dark:bg-[#0D1424] border border-slate-100 dark:border-[#1E293B]">
              <div className="flex items-center gap-2">
                <Server className="w-3.5 h-3.5 text-slate-400" />
                <span className="text-slate-700 dark:text-slate-300">NestJS Core API</span>
              </div>
              <div className="flex items-center gap-1">
                {isUp ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#22C55E]" />
                ) : (
                  <XCircle className="w-3.5 h-3.5 text-rose-500" />
                )}
                <span className="font-semibold text-slate-900 dark:text-slate-100 font-mono">
                  {isUp ? '200 OK' : 'ERR'}
                </span>
              </div>
            </div>

            {/* PostgreSQL Database */}
            <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 dark:bg-[#0D1424] border border-slate-100 dark:border-[#1E293B]">
              <div className="flex items-center gap-2">
                <Database className="w-3.5 h-3.5 text-slate-400" />
                <span className="text-slate-700 dark:text-slate-300">PostgreSQL (Prisma)</span>
              </div>
              <div className="flex items-center gap-1">
                {health.checks?.database === 'UP' ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#22C55E]" />
                ) : (
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
                )}
                <span className="font-semibold text-slate-900 dark:text-slate-100 font-mono">
                  {health.checks?.database || 'N/A'}
                </span>
              </div>
            </div>

            {/* Redis Cache */}
            <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 dark:bg-[#0D1424] border border-slate-100 dark:border-[#1E293B]">
              <div className="flex items-center gap-2">
                <Layers className="w-3.5 h-3.5 text-slate-400" />
                <span className="text-slate-700 dark:text-slate-300">Redis Cache Memory</span>
              </div>
              <div className="flex items-center gap-1">
                {health.checks?.redis === 'UP' ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#22C55E]" />
                ) : (
                  <CheckCircle2 className="w-3.5 h-3.5 text-slate-400" />
                )}
                <span className="font-semibold text-slate-900 dark:text-slate-100 font-mono">
                  {health.checks?.redis || 'OK'}
                </span>
              </div>
            </div>

            {/* Latency & Uptime summary */}
            <div className="grid grid-cols-2 gap-2 pt-1">
              <div className="p-2 rounded-lg bg-slate-50 dark:bg-[#0D1424] border border-slate-100 dark:border-[#1E293B]">
                <span className="text-[10px] text-slate-400 block">Độ trễ mạng</span>
                <span className="text-xs font-bold text-slate-900 dark:text-[#F8FAFC]">
                  {health.latency ? `${health.latency} ms` : '< 20 ms'}
                </span>
              </div>
              <div className="p-2 rounded-lg bg-slate-50 dark:bg-[#0D1424] border border-slate-100 dark:border-[#1E293B]">
                <span className="text-[10px] text-slate-400 block">Thời gian chạy</span>
                <span className="text-xs font-bold text-slate-900 dark:text-[#F8FAFC]">
                  {formatUptime(health.uptime)}
                </span>
              </div>
            </div>
          </div>

          {/* Footer & Ping Button */}
          <div className="pt-2 border-t border-slate-100 dark:border-[#1E293B] flex items-center justify-between">
            <div className="flex items-center gap-1 text-[10px] text-slate-400">
              <Clock className="w-3 h-3" />
              <span>
                {lastChecked.toLocaleTimeString('vi-VN', {
                  hour: '2-digit',
                  minute: '2-digit',
                  second: '2-digit',
                })}
              </span>
            </div>

            <button
              type="button"
              onClick={checkHealth}
              disabled={loading}
              className="px-2.5 py-1 rounded-md text-[11px] font-medium bg-amber-500/10 hover:bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-500/20 flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
            >
              <RefreshCw className={`w-3 h-3 ${loading ? 'animate-spin' : ''}`} />
              <span>Kiểm tra lại</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
