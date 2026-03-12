export function mapRiskTone(level?: string) {
  if (level === 'high' || level === 'blocked' || level === 'at-risk') return 'danger' as const;
  if (level === 'medium' || level === 'warning' || level === 'pending') return 'warning' as const;
  if (level === 'low' || level === 'ready' || level === 'done' || level === 'active' || level === 'available') {
    return 'success' as const;
  }
  return 'muted' as const;
}
