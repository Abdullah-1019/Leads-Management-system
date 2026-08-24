import { ActivityLog, type ActivityEntityType } from '../models/ActivityLog.js'

interface LogActivityInput {
  userId: string
  action: string
  entityType: ActivityEntityType
  entityId: string
  description: string
  metadata?: Record<string, unknown>
}

export async function logActivity(input: LogActivityInput) {
  await ActivityLog.create(input)
}
