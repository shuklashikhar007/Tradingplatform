// utils/format.ts
export function formatNumber(n: number) {
  if (!isFinite(n)) return '-';
  if (Math.abs(n) >= 1e6) return (n / 1e6).toFixed(2) + 'M';
  if (Math.abs(n) >= 1e3) return (n / 1e3).toFixed(2) + 'k';
  return n.toLocaleString(undefined, { maximumFractionDigits: 8 });
}
