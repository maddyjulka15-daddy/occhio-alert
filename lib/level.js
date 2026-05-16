export function alertLevel(count) {
  if (count === 0) return { label: 'No data', color: '#6b7280', emoji: '⚪' };
  if (count <= 2) return { label: 'Low', color: '#22c55e', emoji: '🟢' };
  if (count <= 5) return { label: 'Medium', color: '#eab308', emoji: '🟡' };
  return { label: 'High', color: '#ef4444', emoji: '🔴' };
}
