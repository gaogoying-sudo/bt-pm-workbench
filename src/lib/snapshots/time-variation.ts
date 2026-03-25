function hashDate(input: string): number {
  let hash = 0;
  for (let i = 0; i < input.length; i++) {
    hash = (hash * 31 + input.charCodeAt(i)) >>> 0;
  }
  return hash;
}

export function dateFactor(date: string): number {
  const h = hashDate(date);
  // map to [-0.08, +0.08]
  return ((h % 1601) / 1600) * 0.16 - 0.08;
}

export function clamp01(x: number): number {
  return Math.max(0, Math.min(1, x));
}

