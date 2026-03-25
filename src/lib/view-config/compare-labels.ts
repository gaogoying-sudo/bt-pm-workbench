export const compareModeLabels = {
  current: '当前 / Current',
  baseline: '基线 / Baseline',
  compare: '对比 / Compare',
  delta: '差异 / Delta'
};

export function formatDeltaLabel(input: { baselineDate?: string | null; compareDate?: string | null }) {
  const parts = [
    input.baselineDate ? `vs baseline ${input.baselineDate}` : null,
    input.compareDate ? `vs compare ${input.compareDate}` : null
  ].filter(Boolean);
  return parts.length === 0 ? 'no comparison' : parts.join(' · ');
}

