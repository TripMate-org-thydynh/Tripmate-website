'use client';

import React from 'react';
import { AdminDonutChart } from '@/components/admin/charts/AdminDonutChart';

export default function NeoDonutChart(props: React.ComponentProps<typeof AdminDonutChart>) {
  return <AdminDonutChart {...props} />;
}
