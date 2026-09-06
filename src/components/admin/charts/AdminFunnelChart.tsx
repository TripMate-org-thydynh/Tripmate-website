'use client';

import React from 'react';
import { ArrowDown } from 'lucide-react';

interface FunnelStep {
  step: string;
  count: number;
  percentage?: number;
}

interface AdminFunnelChartProps {
  data: FunnelStep[];
  title?: string;
  subtitle?: string;
  className?: string;
}

export function AdminFunnelChart({
  data,
  title,
  subtitle,
  className = '',
}: AdminFunnelChartProps) {
  if (!data || data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-48 text-slate-400 dark:text-slate-500 text-xs">
        Chưa có dữ liệu phễu chuyển đổi
      </div>
    );
  }

  const baseCount = data[0]?.count || 1;

  return (
    <div className={`w-full flex flex-col gap-4 ${className}`}>
      {(title || subtitle) && (
        <div>
          {title && (
            <h4 className="text-xs font-semibold text-slate-900 dark:text-slate-100">
              {title}
            </h4>
          )}
          {subtitle && (
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
              {subtitle}
            </p>
          )}
        </div>
      )}

      <div className="flex flex-col gap-3">
        {data.map((item, idx) => {
          const prevCount = idx === 0 ? baseCount : data[idx - 1].count;
          const conversionFromBase = ((item.count / baseCount) * 100).toFixed(1);
          const stepConversion =
            idx === 0 ? '100%' : `${((item.count / (prevCount || 1)) * 100).toFixed(1)}%`;
          const barWidthPercent = Math.max((item.count / baseCount) * 100, 4);

          return (
            <div key={idx} className="flex flex-col gap-1.5">
              {/* Step info row */}
              <div className="flex items-center justify-between text-xs">
                <span className="font-medium text-[#475569] dark:text-[#94A3B8]">
                  {item.step}
                </span>
                <div className="flex items-center gap-3">
                  <span className="font-semibold text-[#0F172A] dark:text-[#F8FAFC]">
                    {item.count.toLocaleString('vi-VN')}
                  </span>
                  <span className="text-[11px] text-amber-600 dark:text-amber-400 font-medium w-12 text-right">
                    {conversionFromBase}%
                  </span>
                </div>
              </div>

              {/* Bar track */}
              <div className="w-full h-3 rounded-full bg-slate-100 dark:bg-[#1E293B] overflow-hidden relative">
                <div
                  className="h-full rounded-full bg-amber-500 dark:bg-amber-400 transition-all duration-300"
                  style={{ width: `${barWidthPercent}%` }}
                />
              </div>

              {/* Conversion indicator to next step */}
              {idx < data.length - 1 && (
                <div className="flex items-center gap-1.5 text-[10px] text-[#94A3B8] dark:text-[#64748B] pl-1 py-0.5">
                  <ArrowDown className="w-2.5 h-2.5" />
                  <span>Chuyển tiếp bước sau: <b>{stepConversion}</b></span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
