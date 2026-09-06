'use client';

import React, { useState, useMemo } from 'react';

interface DonutSegment {
  label: string;
  value: number;
  color: string;
}

interface AdminDonutChartProps {
  data: DonutSegment[];
  title?: string;
  subtitle?: string;
  totalLabel?: string;
  valuePrefix?: string;
  valueSuffix?: string;
  size?: number;
  className?: string;
}

const DEFAULT_PALETTE = [
  '#F59E0B', // Brand Amber
  '#38BDF8', // Sky / Cyan
  '#22C55E', // Green
  '#F97316', // Orange
  '#EC4899', // Pink
  '#14B8A6', // Teal
  '#64748B', // Muted Slate
];

export function AdminDonutChart({
  data,
  title,
  subtitle,
  totalLabel = 'Tổng cộng',
  valuePrefix = '',
  valueSuffix = '',
  size = 180,
  className = '',
}: AdminDonutChartProps) {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  const total = useMemo(
    () => data.reduce((sum, item) => sum + item.value, 0),
    [data]
  );

  const radius = size / 2;
  const strokeWidth = 24;
  const innerRadius = radius - strokeWidth;
  const circumference = 2 * Math.PI * innerRadius;

  const processedSegments = useMemo(() => {
    if (total === 0) return [];
    let acc = 0;
    return data.map((item, idx) => {
      const percent = item.value / total;
      const offset = acc;
      acc += percent;
      const color = item.color || DEFAULT_PALETTE[idx % DEFAULT_PALETTE.length];
      return {
        ...item,
        percent,
        offset,
        color,
      };
    });
  }, [data, total]);

  if (!data || data.length === 0 || total === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-48 text-slate-400 dark:text-slate-500 text-xs">
        Chưa có dữ liệu danh mục
      </div>
    );
  }

  return (
    <div className={`w-full flex flex-col gap-4 ${className}`}>
      {(title || subtitle) && (
        <div>
          {title && (
            <h4 className="text-xs font-semibold text-[#0F172A] dark:text-[#F8FAFC]">
              {title}
            </h4>
          )}
          {subtitle && (
            <p className="text-[11px] text-[#475569] dark:text-[#94A3B8] mt-0.5">
              {subtitle}
            </p>
          )}
        </div>
      )}

      <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
        {/* SVG Donut Circle */}
        <div className="relative shrink-0" style={{ width: size, height: size }}>
          <svg
            width={size}
            height={size}
            viewBox={`0 0 ${size} ${size}`}
            className="transform -rotate-90 overflow-visible"
          >
            {processedSegments.map((item, idx) => {
              const strokeDasharray = `${item.percent * circumference} ${circumference}`;
              const strokeDashoffset = -item.offset * circumference;
              const isHovered = hoveredIdx === idx;

              return (
                <circle
                  key={idx}
                  cx={radius}
                  cy={radius}
                  r={innerRadius}
                  fill="transparent"
                  stroke={item.color}
                  strokeWidth={isHovered ? strokeWidth + 4 : strokeWidth}
                  strokeDasharray={strokeDasharray}
                  strokeDashoffset={strokeDashoffset}
                  className="transition-all duration-200 cursor-pointer"
                  onMouseEnter={() => setHoveredIdx(idx)}
                  onMouseLeave={() => setHoveredIdx(null)}
                />
              );
            })}
          </svg>

          {/* Center Info Text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-2 pointer-events-none">
            <span className="text-[10px] text-[#94A3B8] dark:text-[#64748B] uppercase tracking-wider line-clamp-1">
              {hoveredIdx !== null ? data[hoveredIdx].label : totalLabel}
            </span>
            <span className="text-xs font-bold text-[#0F172A] dark:text-[#F8FAFC]">
              {valuePrefix}
              {hoveredIdx !== null
                ? data[hoveredIdx].value.toLocaleString('vi-VN')
                : total.toLocaleString('vi-VN')}
              {valueSuffix}
            </span>
            {hoveredIdx !== null && (
              <span className="text-[10px] text-amber-600 dark:text-amber-400 font-semibold">
                {((data[hoveredIdx].value / total) * 100).toFixed(1)}%
              </span>
            )}
          </div>
        </div>

        {/* Legend List */}
        <div className="flex flex-col gap-2 w-full max-w-xs text-xs">
          {processedSegments.map((item, idx) => {
            const percent = (item.percent * 100).toFixed(1);
            const isHovered = hoveredIdx === idx;

            return (
              <div
                key={idx}
                onMouseEnter={() => setHoveredIdx(idx)}
                onMouseLeave={() => setHoveredIdx(null)}
                className={`flex items-center justify-between p-1.5 rounded-md transition-colors cursor-pointer ${
                  isHovered
                    ? 'bg-slate-100 dark:bg-[#172238]'
                    : 'hover:bg-slate-50 dark:hover:bg-[#172238]/50'
                }`}
              >
                <div className="flex items-center gap-2 min-w-0">
                  <span
                    className="w-2.5 h-2.5 rounded-sm shrink-0"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-slate-700 dark:text-slate-300 truncate text-[11px] font-medium">
                    {item.label}
                  </span>
                </div>
                <div className="flex items-center gap-2 shrink-0 text-slate-500 dark:text-slate-400 text-[11px]">
                  <span>
                    {valuePrefix}
                    {item.value.toLocaleString('vi-VN')}
                    {valueSuffix}
                  </span>
                  <span className="w-9 text-right font-semibold text-slate-800 dark:text-slate-200">
                    {percent}%
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
