'use client';

import React from 'react';
import { AdminFunnelChart } from '@/components/admin/charts/AdminFunnelChart';

export default function NeoFunnelChart(props: React.ComponentProps<typeof AdminFunnelChart>) {
  return <AdminFunnelChart {...props} />;
}
