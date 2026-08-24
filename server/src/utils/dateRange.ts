export function buildDateRangeFilter(startDate?: Date, endDate?: Date) {
  if (!startDate && !endDate) return undefined

  const filter: { $gte?: Date; $lte?: Date } = {}
  if (startDate) filter.$gte = startDate
  if (endDate) filter.$lte = endDate
  return filter
}

export function startOfDay(date: Date) {
  const result = new Date(date)
  result.setHours(0, 0, 0, 0)
  return result
}

export function endOfDay(date: Date) {
  const result = new Date(date)
  result.setHours(23, 59, 59, 999)
  return result
}

export function startOfWeek(date: Date) {
  const result = startOfDay(date)
  const day = result.getDay()
  const diffFromMonday = (day + 6) % 7
  result.setDate(result.getDate() - diffFromMonday)
  return result
}

export function startOfMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), 1)
}
