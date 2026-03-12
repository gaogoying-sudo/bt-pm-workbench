export interface BilingualLabel {
  zh: string;
  en: string;
}

export function makeBilingualLabel(zh: string, en: string): BilingualLabel {
  return { zh, en };
}

export function formatBilingualLabel(label: BilingualLabel | string) {
  if (typeof label === 'string') return label;
  return `${label.zh} / ${label.en}`;
}
