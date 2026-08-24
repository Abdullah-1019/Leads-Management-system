export function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

export function partialMatch(value: string) {
  return new RegExp(escapeRegExp(value.trim()), 'i')
}

export function exactMatchCaseInsensitive(value: string) {
  return new RegExp(`^${escapeRegExp(value.trim())}$`, 'i')
}
