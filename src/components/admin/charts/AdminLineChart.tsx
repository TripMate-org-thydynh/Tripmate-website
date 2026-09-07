'use client';

import React, { useState } from 'react';

interface DataPoint {
  label: string;
  value: number;
  secondaryValue?: number;
}

interface AdminLineChartProps {
  data: DataPoint[];
  title?: string;
  subtitle?: string;
  height?: number;
  valuePrefix?: string;
  valueSuffix?: string;
  primaryColor?: string;
  secondaryColor?: string;
  primaryLabel?: string;
  secondaryLabel?: string;
  className?: string;
}

export function AdminLineChart({
  data,
  title,
  subtitle,
  height = 220,
  valuePrefix = '',
  valueSuffix = '',
  primaryColor = '#F59E0B', // Amber brand
  secondaryColor = '#38BDF8', // Cyan-sky
  primaryLabel = 'Số liệu',
  secondaryLabel,
  className = '',
}: AdminLineChartProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const reactId = React.useId();
  const gradientId = `primaryGradient_${reactId.replace(/[^a-zA-Z0-9_-]/g, '_')}`;

  if (!data || data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-48 text-slate-400 dark:text-slate-500 text-xs">
        Chưa có dữ liệu biểu đồ
      </div>
    );
  }

  const padding = { top: 20, right: 16, bottom: 32, left: 40 };
  const width = 600;
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;

  const allValues = data.flatMap((d) => [
    d.value,
    d.secondaryValue !== undefined ? d.secondaryValue : 0,
  ]);
  const maxValue = Math.max(...allValues, 1);
  const roundedMax = Math.ceil(maxValue * 1.15);

  const getX = (index: number) => {
    if (data.length === 1) return padding.left + chartWidth / 2;
    return padding.left + (index / (data.length - 1)) * chartWidth;
  };

  const getY = (val: number) => {
    return padding.top + chartHeight - (val / roundedMax) * chartHeight;
  };

  const primaryPath = data
    .map((d, i) => `${i === 0 ? 'M' : 'L'} ${getX(i)} ${getY(d.value)}`)
    .join(' ');

  const primaryArea = `${primaryPath} L ${getX(data.length - 1)} ${
    padding.top + chartHeight
  } L ${getX(0)} ${padding.top + chartHeight} Z`;

  let secondaryPath = '';
  if (secondaryLabel) {
    secondaryPath = data
      .map(
        (d, i) =>
          `${i === 0 ? 'M' : 'L'} ${getX(i)} ${getY(d.secondaryValue || 0)}`
      )
      .join(' ');
  }

  const yTicks = [0, 0.25, 0.5, 0.75, 1].map((pct) => ({
    val: Math.round(roundedMax * pct),
    y: padding.top + chartHeight - pct * chartHeight,
  }));

  return (
    <div className={`w-full flex flex-col gap-3 ${className}`}>
      {(title || subtitle || secondaryLabel) && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            {title && (
              <h4 className="text-xs font-semibold text-[#0F172A] dark:text-[#F8FAFC]">
                {title}
              </h4>
            )}
            {subtitle && (
              <p className="text-[11px] text-[#475569] dark:text-[#94A3B8]">
                {subtitle}
              </p>
            )}
          </div>

          <div className="flex items-center gap-4 text-[11px] text-[#475569] dark:text-[#94A3B8]">
            <div className="flex items-center gap-1.5">
              <span
                className="w-2.5 h-2.5 rounded-sm"
                style={{ backgroundColor: primaryColor }}
              />
              <span>{primaryLabel}</span>
            </div>
            {secondaryLabel && (
              <div className="flex items-center gap-1.5">
                <span
                  className="w-2.5 h-2.5 rounded-sm"
                  style={{ backgroundColor: secondaryColor }}
                />
                <span>{secondaryLabel}</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Responsive SVG Container */}
      <div className="relative w-full overflow-hidden">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-auto overflow-visible"
        >
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={primaryColor} stopOpacity="0.15" />
              <stop offset="100%" stopColor={primaryColor} stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Grid lines */}
          {yTicks.map((tick, idx) => (
            <g key={idx}>
              <line
                x1={padding.left}
                y1={tick.y}
                x2={width - padding.right}
                y2={tick.y}
                className="stroke-slate-200 dark:stroke-[#1E293B]"
                strokeDasharray="3 3"
                strokeWidth="1"
              />
              <text
                x={padding.left - 8}
                y={tick.y + 3}
                textAnchor="end"
                className="text-[10px] fill-[#94A3B8] dark:fill-[#64748B]"
              >
                {tick.val}
              </text>
            </g>
          ))}

          {/* Area fill */}
          <path d={primaryArea} fill={`url(#${gradientId})`} />

          {/* Secondary Line */}
          {secondaryPath && (
            <path
              d={secondaryPath}
              fill="none"
              stroke={secondaryColor}
              strokeWidth="2"
              strokeDasharray="4 2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          )}

          {/* Primary Line */}
          <path
            d={primaryPath}
            fill="none"
            stroke={primaryColor}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Data Points & Tooltip Triggers */}
          {data.map((d, i) => {
            const cx = getX(i);
            const cy = getY(d.value);
            const isHovered = hoveredIndex === i;

            return (
              <g
                key={i}
                className="cursor-pointer"
                onMouseEnter={() => setHoveredIndex(i)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                {/* Vertical hover guide */}
                {isHovered && (
                  <line
                    x1={cx}
                    y1={padding.top}
                    x2={cx}
                    y2={padding.top + chartHeight}
                    stroke={primaryColor}
                    strokeWidth="1"
                    strokeDasharray="2 2"
                    opacity="0.5"
                  />
                )}

                {/* Visible Point */}
                <circle
                  cx={cx}
                  cy={cy}
                  r={isHovered ? 4.5 : 2.5}
                  fill="#ffffff"
                  stroke={primaryColor}
                  strokeWidth="2"
                  className="transition-all duration-150"
                />

                {/* X Axis Label */}
                {(i === 0 ||
                  i === Math.floor(data.length / 2) ||
                  i === data.length - 1 ||
                  data.length <= 8) && (
                  <text
                    x={cx}
                    y={height - 10}
                    textAnchor="middle"
                    className="text-[10px] fill-slate-400 dark:fill-slate-500"
                  >
                    {d.label}
                  </text>
                )}

                {/* Invisible Wider Trigger Area */}
                <rect
                  x={cx - 12}
                  y={padding.top}
                  width={24}
                  height={chartHeight}
                  fill="transparent"
                />
              </g>
            );
          })}
        </svg>

        {/* Hover Floating Tooltip */}
        {hoveredIndex !== null && data[hoveredIndex] && (
          <div
            className="absolute top-2 z-20 pointer-events-none transform -translate-x-1/2 bg-slate-900 text-white dark:bg-white dark:text-slate-900 text-[11px] font-medium py-1 px-2.5 rounded-md shadow-md"
            style={{
              left: `${(getX(hoveredIndex) / width) * 100}%`,
            }}
          >
            <span className="opacity-75 block text-[9px] mb-0.5">
              {data[hoveredIndex].label}
            </span>
            <div className="flex items-center gap-2">
              <span className="font-bold">
                {valuePrefix}
                {data[hoveredIndex].value.toLocaleString('vi-VN')}
                {valueSuffix}
              </span>
              {data[hoveredIndex].secondaryValue !== undefined && (
                <span className="opacity-80">
                  / {data[hoveredIndex].secondaryValue?.toLocaleString('vi-VN')}
                </span>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
