export function mapRiskTone(level?: string) {
  if (level === 'high' || level === 'blocked' || level === 'at-risk') return 'danger' as const;
  if (level === 'medium' || level === 'warning' || level === 'pending') return 'warning' as const;
  if (level === 'low' || level === 'ready' || level === 'done' || level === 'active' || level === 'available') {
    return 'success' as const;
  }
  return 'muted' as const;
}

export function mapQualityTone(status?: string, severity?: string) {
  if (status === 'failed') return 'danger' as const;
  if (severity === 'critical' || severity === 'major') return 'warning' as const;
  if (status === 'passed') return 'success' as const;
  if (status === 'in-review' || status === 'pending') return 'muted' as const;
  return 'muted' as const;
}
