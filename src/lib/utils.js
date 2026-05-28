export function relativeTime(epoch) {
  const diff = Math.floor(Date.now() / 1000) - epoch
  if (diff <    3600) return 'Active recently'
  if (diff <   86400) return `Active ${Math.floor(diff / 3600)}h ago`
  if (diff <  604800) return `Active ${Math.floor(diff / 86400)}d ago`
  if (diff < 2592000) return `Active ${Math.floor(diff / 604800)}w ago`
  return `Active ${Math.floor(diff / 2592000)}mo ago`
}

export function parseJSON(val) {
  try { return JSON.parse(val || '[]') } catch { return [] }
}
