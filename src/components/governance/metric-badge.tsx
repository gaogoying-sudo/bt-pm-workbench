'use client';

import { useEffect, useState } from 'react';
import { StatusBadge } from '@/components/ui/status-badge';

export function MetricBadge({ metricCode }: { metricCode: string }) {
  const [version, setVersion] = useState<string | null>(null);
  useEffect(() => {
    fetch(`/api/metrics?code=${encodeURIComponent(metricCode)}`)
      .then((r) => r.json())
      .then((j) => setVersion(j?.data?.activeVersion ?? null))
      .catch(() => setVersion(null));
  }, [metricCode]);

  return <StatusBadge label={`${metricCode}${version ? `@${version}` : ''}`} tone="muted" />;
}

