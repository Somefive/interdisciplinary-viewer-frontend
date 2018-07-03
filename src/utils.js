export function capitalize(str) {
  return str.replace(/(^|\s)\S/g, l => l.toUpperCase())
}

export function generateRankLabel(pack) {
  if (!pack) return 'NaN'
  if (pack.length === 3)
    return `${Number(pack[0]).toFixed(4)} #${pack[1] + 1}/#${pack[2] + 1}`
  if (pack.length === 4)
    return `${Number(pack[0]).toFixed(4)} #${pack[1] + 1} / ${Number(pack[2]).toFixed(4)} #${pack[3] + 1}`
  else
    return `${Number(pack[0]).toFixed(4)} #${pack[1] + 1}`
}