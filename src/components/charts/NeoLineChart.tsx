'use client';

import React from 'react';
import { AdminLineChart } from '@/components/admin/charts/AdminLineChart';

export default function NeoLineChart(props: React.ComponentProps<typeof AdminLineChart>) {
  return <AdminLineChart {...props} />;
}
