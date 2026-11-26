'use client';

import React, { useState } from 'react';

interface BarPoint {
  label: string;
  primaryValue: number;
  secondaryValue?: number;
}

interface AdminBarChartProps {
  data: BarPoint[];
  title?: string;
  subtitle?: string;
  height?: number;
  primaryColor?: string;
  secondaryColor?: string;
  primaryLabel?: string;
  secondaryLabel?: string;
  className?: string;
}

export function AdminBarChart({
  data,
  title,
  subtitle,
  height = 220,
  primaryColor = '#F59E0B', // Amber brand
  secondaryColor = '#38BDF8', // Cyan-sky
  primaryLabel = 'Người dùng mới',
  secondaryLabel = 'Chuyến đi mới',
  className = '',
}: AdminBarChartProps) {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  if (!data || data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-48 text-admin-text-muted text-xs">
        Chưa có dữ liệu biểu đồ
      </div>
    );
  }

  const padding = { top: 20, right: 16, bottom: 32, left: 36 };
  const width = 600;
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;

  const maxVal = Math.max(
    ...data.flatMap((d) => [d.primaryValue, d.secondaryValue || 0]),
    1
  );
  const roundedMax = Math.ceil(maxVal * 1.15);

  const slotWidth = chartWidth / data.length;
  const barWidth = Math.min(Math.max(slotWidth * 0.35, 4), 18);

  const yTicks = [0, 0.5, 1].map((pct) => ({
    val: Math.round(roundedMax * pct),
    y: padding.top + chartHeight - pct * chartHeight,
  }));

  return (
    <div className={`w-full flex flex-col gap-3 ${className}`}>
      {(title || subtitle || primaryLabel) && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            {title && (
              <h4 className="text-xs font-semibold text-admin-text-primary">
                {title}
              </h4>
            )}
            {subtitle && (
              <p className="text-[11px] text-admin-text-secondary dark:text-admin-text-muted">
                {subtitle}
              </p>
            )}
          </div>
          <div className="flex items-center gap-4 text-[11px] text-admin-text-secondary dark:text-admin-text-muted">
            <div className="flex items-center gap-1.5">
              <span
                className="w-2.5 h-2.5 "
                style={{ backgroundColor: primaryColor }}
              />
              <span>{primaryLabel}</span>
            </div>
            {secondaryLabel && (
              <div className="flex items-center gap-1.5">
                <span
                  className="w-2.5 h-2.5 "
                  style={{ backgroundColor: secondaryColor }}
                />
                <span>{secondaryLabel}</span>
              </div>
            )}
          </div>
        </div>
      )}

      <div className="relative w-full overflow-hidden">
        <svg
          role="img"
          aria-label={title || primaryLabel}
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-auto overflow-visible"
        >
          {/* Gridlines */}
          {yTicks.map((tick, idx) => (
            <g key={idx}>
              <line
                x1={padding.left}
                y1={tick.y}
                x2={width - padding.right}
                y2={tick.y}
                className="stroke-admin-border"
                strokeDasharray="3 3"
                strokeWidth="1"
              />
              <text
                x={padding.left - 6}
                y={tick.y + 3}
                textAnchor="end"
                className="fill-admin-text-muted text-[10px] tabular-nums"
              >
                {tick.val}
              </text>
            </g>
          ))}

          {/* Bars */}
          {data.map((d, i) => {
            const slotCenter = padding.left + i * slotWidth + slotWidth / 2;
            const hasSecondary = d.secondaryValue !== undefined;

            const primaryHeight = (d.primaryValue / roundedMax) * chartHeight;
            const primaryY = padding.top + chartHeight - primaryHeight;
            const primaryX = hasSecondary
              ? slotCenter - barWidth - 1
              : slotCenter - barWidth / 2;

            const secondaryHeight = hasSecondary
              ? ((d.secondaryValue || 0) / roundedMax) * chartHeight
              : 0;
            const secondaryY = padding.top + chartHeight - secondaryHeight;
            const secondaryX = slotCenter + 1;

            const isHovered = hoveredIdx === i;

            return (
              <g
                key={i}
                className="cursor-pointer"
                onMouseEnter={() => setHoveredIdx(i)}
                onMouseLeave={() => setHoveredIdx(null)}
              >
                {/* Background column highlight on hover */}
                {isHovered && (
                  <rect
                    x={padding.left + i * slotWidth}
                    y={padding.top}
                    width={slotWidth}
                    height={chartHeight}
                    className="fill-admin-bg"
                  />
                )}

                {/* Primary Bar */}
                <rect
                  x={primaryX}
                  y={primaryY}
                  width={barWidth}
                  height={primaryHeight}
                  fill={primaryColor}
                  className="transition-all duration-150"
                  opacity={isHovered ? 1 : 0.85}
                />

                {/* Secondary Bar */}
                {hasSecondary && (
                  <rect
                    x={secondaryX}
                    y={secondaryY}
                    width={barWidth}
                    height={secondaryHeight}
                    fill={secondaryColor}
                    className="transition-all duration-150"
                    opacity={isHovered ? 1 : 0.85}
                  />
                )}

                {/* X axis labels (sparse for readability) */}
                {(i % Math.ceil(data.length / 10) === 0 ||
                  i === data.length - 1) && (
                  <text
                    x={slotCenter}
                    y={height - 10}
                    textAnchor="middle"
                    className="fill-admin-text-muted text-[10px] tabular-nums"
                  >
                    {d.label.includes('-')
                      ? d.label.split('-').slice(1).join('/')
                      : d.label}
                  </text>
                )}
              </g>
            );
          })}
        </svg>

        {/* Hover Tooltip */}
        {hoveredIdx !== null && data[hoveredIdx] && (
          <div
            className="absolute top-2 z-20 pointer-events-none transform -translate-x-1/2 bg-slate-900 text-white dark:bg-admin-surface dark:text-admin-text-primary text-[11px] font-medium py-1 px-2.5 shadow-md"
            style={{
              left: `${
                ((padding.left +
                  hoveredIdx * slotWidth +
                  slotWidth / 2) /
                  width) *
                100
              }%`,
            }}
          >
            <span className="opacity-75 block text-[9px] mb-0.5">
              {data[hoveredIdx].label}
            </span>
            <div className="flex flex-col gap-0.5">
              <div className="flex items-center gap-1.5">
                <span
                  className="w-1.5 h-1.5 rounded-full"
                  style={{ backgroundColor: primaryColor }}
                />
                <span>
                  {primaryLabel}:{' '}
                  <b>{data[hoveredIdx].primaryValue.toLocaleString('vi-VN')}</b>
                </span>
              </div>
              {data[hoveredIdx].secondaryValue !== undefined && (
                <div className="flex items-center gap-1.5">
                  <span
                    className="w-1.5 h-1.5 rounded-full"
                    style={{ backgroundColor: secondaryColor }}
                  />
                  <span>
                    {secondaryLabel}:{' '}
                    <b>
                      {data[hoveredIdx].secondaryValue?.toLocaleString('vi-VN')}
                    </b>
                  </span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
