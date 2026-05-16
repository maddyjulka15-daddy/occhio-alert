export function alertLevel(count) {
  if (count === 0) return { label: 'Nessun dato', color: '#6b7280', emoji: '⚪' };
  if (count <= 2) return { label: 'Debole', color: '#22c55e', emoji: '🟢' };
  if (count <= 5) return { label: 'Medio', color: '#eab308', emoji: '🟡' };
  return { label: 'Alto', color: '#ef4444', emoji: '🔴' };
}
