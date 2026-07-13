const kipFormatter = new Intl.NumberFormat("en-US", {
  maximumFractionDigits: 0,
})

export function formatKipAmount(value: number) {
  return kipFormatter.format(Number.isFinite(value) ? Math.round(value) : 0)
}

export function formatKip(value: number) {
  return `${formatKipAmount(value)} ກີບ`
}

// Kept for existing POS components while they migrate to the clearer name.
export const formatVnd = formatKip
