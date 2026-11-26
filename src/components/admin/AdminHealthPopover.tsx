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
  const [loading, setLoading] = useState(true);
  const [health, setHealth] = useState<HealthData>();
  const [lastChecked, setLastChecked] = useState<Date>();
  const popoverRef = useRef<HTMLDivElement>(null);

  const checkHealth = async () => {
    setLoading(true);
    try {
      const res = await getSystemHealthAction();
      if (res.success && res.data) {
        const status = String(res.data.status).toUpperCase();
        const database = res.data.checks?.database ?? res.data.database;
        setHealth({
          ...res.data,
          status: status === 'OK' || status === 'DEGRADED' ? status : 'DOWN',
          checks: { ...res.data.checks, database: database?.toUpperCase() },
        });
      } else {
        setHealth({
          status: 'DOWN',
          latency: res.data?.latency ?? 0,
          checks: { database: 'DOWN', redis: 'DOWN' },
        });
      }
    } catch {
      setHealth({
        status: 'DOWN',
        latency: 0,
        checks: { database: 'DOWN', redis: 'DOWN' },
      });
    } finally {
      setLastChecked(new Date());
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

  const status = health?.status;
  const isUp = status === 'OK';
  const isDegraded = status === 'DEGRADED';
  const statusLabel = !status ? 'Đang kiểm tra' : isUp ? 'API hoạt động' : isDegraded ? 'API suy giảm' : 'API mất kết nối';
  const statusColor = !status ? 'text-admin-text-muted' : isUp ? 'text-emerald-800 dark:text-emerald-300'
    : isDegraded ? 'text-amber-800 dark:text-amber-300' : 'text-rose-800 dark:text-rose-300';

  const formatUptime = (seconds?: number) => {
    if (!seconds) return 'Đang chạy';
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    if (hrs > 0) return `${hrs}h ${mins}m`;
    return `${mins} phút`;
  };

  return (
    <div className="relative" ref={popoverRef}>
      {/* System status */}
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className={`admin-toolbar-control text-[11px] font-semibold tabular-nums ${statusColor}`}
        title="Bấm để kiểm tra tình trạng hệ thống & độ trễ API"
        aria-label="Tình trạng hệ thống"
        aria-expanded={open}
      >
        <span
          className="size-1.5 shrink-0 rounded-full bg-current"
        />
        <span>{statusLabel}</span>
      </button>

      {/* Floating Popover Card */}
      {open && (
        <div className="absolute right-0 top-full mt-2 w-72 sm:w-80 bg-admin-surface border-admin-border shadow-xl p-4 z-50 animate-in fade-in-50 zoom-in-95 duration-100 flex flex-col gap-3.5">
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-admin-border">
            <div className="flex items-center gap-2">
              <Server className="w-4 h-4 text-amber-500" />
              <span className="text-xs font-bold text-admin-text-primary">
                Tình trạng hệ thống
              </span>
            </div>
            <span className={`text-[11px] font-semibold ${statusColor}`}>{statusLabel}</span>
          </div>

          {/* Diagnostics Rows */}
          <div className="flex flex-col gap-2.5 text-xs">
            {/* Backend Server */}
            <div className="flex items-center justify-between p-2 bg-admin-bg border-admin-border">
              <div className="flex items-center gap-2">
                <Server className="w-3.5 h-3.5 text-admin-text-muted" />
                <span className="text-admin-text-secondary">NestJS Core API</span>
              </div>
              <div className="flex items-center gap-1">
                {isUp ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#22C55E]" />
                ) : (
                  <XCircle className="w-3.5 h-3.5 text-rose-500" />
                )}
                <span className="font-semibold text-admin-text-primary font-mono">
                  {isUp ? '200 OK' : 'ERR'}
                </span>
              </div>
            </div>

            {/* PostgreSQL Database */}
            <div className="flex items-center justify-between p-2 bg-admin-bg border-admin-border">
              <div className="flex items-center gap-2">
                <Database className="w-3.5 h-3.5 text-admin-text-muted" />
                <span className="text-admin-text-secondary">PostgreSQL (Prisma)</span>
              </div>
              <div className="flex items-center gap-1">
                {health?.checks?.database === 'UP' ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#22C55E]" />
                ) : (
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
                )}
                <span className="font-semibold text-admin-text-primary font-mono">
                  {health?.checks?.database || 'Chưa rõ'}
                </span>
              </div>
            </div>

            {/* Redis Cache */}
            <div className="flex items-center justify-between p-2 bg-admin-bg border-admin-border">
              <div className="flex items-center gap-2">
                <Layers className="w-3.5 h-3.5 text-admin-text-muted" />
                <span className="text-admin-text-secondary">Redis Cache Memory</span>
              </div>
              <div className="flex items-center gap-1">
                {health?.checks?.redis === 'UP' ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#22C55E]" />
                ) : (
                  <CheckCircle2 className="w-3.5 h-3.5 text-admin-text-muted" />
                )}
                <span className="font-semibold text-admin-text-primary font-mono">
                  {health?.checks?.redis || 'Chưa rõ'}
                </span>
              </div>
            </div>

            {/* Latency & Uptime summary */}
            <div className="grid grid-cols-2 gap-2 pt-1">
              <div className="p-2 bg-admin-bg border-admin-border">
                <span className="text-[10px] text-admin-text-muted block">Độ trễ mạng</span>
                <span className="text-xs font-bold text-admin-text-primary">
                  {health?.latency != null ? `${health.latency} ms` : '—'}
                </span>
              </div>
              <div className="p-2 bg-admin-bg border-admin-border">
                <span className="text-[10px] text-admin-text-muted block">Thời gian chạy</span>
                <span className="text-xs font-bold text-admin-text-primary">
                  {health?.uptime != null ? formatUptime(health.uptime) : '—'}
                </span>
              </div>
            </div>
          </div>

          {/* Footer & Ping Button */}
          <div className="pt-2 border-t border-admin-border flex items-center justify-between">
            <div className="flex items-center gap-1 text-[10px] text-admin-text-muted">
              <Clock className="w-3 h-3" />
              <span>
                {lastChecked?.toLocaleTimeString('vi-VN', {
                  hour: '2-digit',
                  minute: '2-digit',
                  second: '2-digit',
                }) ?? 'Đang kiểm tra'}
              </span>
            </div>

            <button
              type="button"
              onClick={checkHealth}
              disabled={loading}
              className="admin-toolbar-control bg-admin-bg text-[11px] font-semibold disabled:opacity-50"
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
