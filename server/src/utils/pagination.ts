export interface PaginationInput {
  page: number
  limit: number
}

export function toSkipLimit({ page, limit }: PaginationInput) {
  return { skip: (page - 1) * limit, limit }
}

export function buildPaginationMeta({ page, limit }: PaginationInput, total: number) {
  return { page, limit, total, totalPages: Math.max(1, Math.ceil(total / limit)) }
}
