import { formatBilingualLabel } from '@/lib/view-config/bilingual-label-builders';

export function BilingualFieldLabel({
  label,
  className = ''
}: {
  label: { zh: string; en: string } | string;
  className?: string;
}) {
  return <span className={className}>{formatBilingualLabel(label)}</span>;
}
