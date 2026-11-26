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
  primaryColor = 'var(--admin-primary)',
  secondaryColor = 'var(--admin-info)',
  primaryLabel = 'Số liệu',
  secondaryLabel,
  className = '',
}: AdminLineChartProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const reactId = React.useId();
  const gradientId = `primaryGradient_${reactId.replace(/[^a-zA-Z0-9_-]/g, '_')}`;

  if (!data || data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-48 text-admin-text-muted text-xs">
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
  const stepEstimate = maxValue / 4;
  const magnitude = Math.pow(10, Math.floor(Math.log10(stepEstimate)));
  const interval = Math.max(1, (stepEstimate / magnitude <= 2 ? 2 : stepEstimate / magnitude <= 5 ? 5 : 10) * magnitude);
  const tickCount = Math.ceil(maxValue / interval);
  const roundedMax = tickCount * interval;

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

  const axisNumber = new Intl.NumberFormat('vi-VN', { notation: 'compact', maximumFractionDigits: 1 });
  const yTicks = Array.from({ length: tickCount + 1 }, (_, index) => index * interval);

  return (
    <div className={`w-full flex flex-col gap-3 ${className}`}>
      {(title || subtitle || secondaryLabel) && (
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

      {/* Responsive SVG Container */}
      <div className="relative w-full overflow-hidden">
        <svg
          role="img"
          aria-label={title || primaryLabel}
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
          {yTicks.map((tick) => (
            <g key={tick}>
              <line
                x1={padding.left}
                y1={getY(tick)}
                x2={width - padding.right}
                y2={getY(tick)}
                className="stroke-admin-border"
                strokeDasharray="3 3"
                strokeWidth="1"
              />
              <text
                x={padding.left - 8}
                y={getY(tick) + 3}
                textAnchor="end"
                className="fill-admin-text-muted text-[10px] tabular-nums"
              >
                {axisNumber.format(tick)}
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
                  fill="var(--admin-surface)"
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
                    className="fill-admin-text-muted text-[10px] tabular-nums"
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
            className="pointer-events-none absolute top-2 z-20 max-w-[min(12rem,100%)] bg-admin-sidebar px-2.5 py-1 text-[11px] font-medium text-admin-text-primary shadow-md"
            style={{
              left: `clamp(0px, calc(${(getX(hoveredIndex) / width) * 100}% - 5rem), max(0px, 100% - 12rem))`,
            }}
          >
            <span className="opacity-75 block text-[9px] mb-0.5">
              {data[hoveredIndex].label}
            </span>
            <div className="flex flex-wrap items-center gap-x-2 break-words">
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
