'use client';

import React from 'react';
import { AdminBarChart } from '@/components/admin/charts/AdminBarChart';

export default function NeoBarChart(props: React.ComponentProps<typeof AdminBarChart>) {
  return <AdminBarChart {...props} />;
}
