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

const compactNumber = new Intl.NumberFormat('vi-VN', { notation: 'compact', maximumFractionDigits: 1 });

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
      <div className="flex flex-col items-center justify-center h-48 text-admin-text-muted text-xs">
        Chưa có dữ liệu danh mục
      </div>
    );
  }

  return (
    <div className={`admin-donut flex w-full min-w-0 flex-col gap-4 ${className}`}>
      {(title || subtitle) && (
        <div>
          {title && (
            <h4 className="text-xs font-semibold text-admin-text-primary">
              {title}
            </h4>
          )}
          {subtitle && (
            <p className="text-[11px] text-admin-text-secondary dark:text-admin-text-muted mt-0.5">
              {subtitle}
            </p>
          )}
        </div>
      )}

      <div className="admin-donut-layout grid min-w-0 items-center justify-items-center gap-4">
        {/* SVG Donut Circle */}
        <div className="relative aspect-square max-w-full" style={{ width: size }}>
          <svg
            width={size}
            height={size}
            viewBox={`0 0 ${size} ${size}`}
            className="h-full w-full -rotate-90 overflow-visible"
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
          <div className="pointer-events-none absolute inset-[19%] flex min-w-0 flex-col items-center justify-center text-center">
            <span className="line-clamp-2 max-w-full break-words text-[10px] text-admin-text-secondary">
              {hoveredIdx !== null ? data[hoveredIdx].label : totalLabel}
            </span>
            <span className="text-xs font-semibold text-admin-text-primary">
              {valuePrefix}
              {hoveredIdx !== null
                ? compactNumber.format(data[hoveredIdx].value)
                : compactNumber.format(total)}
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
        <div className="flex w-full min-w-0 max-w-sm flex-col gap-1.5 text-xs">
          {processedSegments.map((item, idx) => {
            const percent = (item.percent * 100).toFixed(1);
            const isHovered = hoveredIdx === idx;

            return (
              <div
                key={idx}
                onMouseEnter={() => setHoveredIdx(idx)}
                onMouseLeave={() => setHoveredIdx(null)}
                className={`flex min-w-0 flex-wrap items-center justify-between gap-x-2 gap-y-1 p-1.5 transition-colors cursor-pointer ${
                  isHovered
                    ? 'bg-admin-surface-hover'
                    : 'hover:bg-admin-bg dark:hover:bg-admin-surface-hover/50'
                }`}
              >
                <div className="flex items-center gap-2 min-w-0">
                  <span
                    className="w-2.5 h-2.5 shrink-0"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="min-w-0 break-words text-[11px] font-medium text-admin-text-primary">
                    {item.label}
                  </span>
                </div>
                <div className="flex min-w-0 flex-wrap items-center gap-x-2 text-[11px] tabular-nums text-admin-text-secondary">
                  <span className="min-w-0 break-all">
                    {valuePrefix}
                    {item.value.toLocaleString('vi-VN')}
                    {valueSuffix}
                  </span>
                  <span className="w-9 text-right font-semibold text-admin-text-primary dark:text-admin-text-secondary">
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
