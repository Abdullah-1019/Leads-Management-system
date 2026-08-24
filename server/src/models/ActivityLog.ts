import { Schema, model, Types } from 'mongoose'

export const ACTIVITY_ENTITY_TYPES = ['Application', 'Interview', 'Feedback', 'User'] as const
export type ActivityEntityType = (typeof ACTIVITY_ENTITY_TYPES)[number]

export interface IActivityLog {
  userId: Types.ObjectId
  action: string
  entityType: ActivityEntityType
  entityId: Types.ObjectId
  description: string
  metadata?: Record<string, unknown>
  createdAt: Date
}

const activityLogSchema = new Schema<IActivityLog>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    action: { type: String, required: true },
    entityType: { type: String, enum: ACTIVITY_ENTITY_TYPES, required: true },
    entityId: { type: Schema.Types.ObjectId, required: true },
    description: { type: String, required: true },
    metadata: { type: Schema.Types.Mixed },
  },
  { timestamps: { createdAt: true, updatedAt: false } },
)

activityLogSchema.index({ userId: 1, createdAt: -1 })
activityLogSchema.index({ createdAt: -1 })
activityLogSchema.index({ entityType: 1, entityId: 1, createdAt: -1 })

export const ActivityLog = model<IActivityLog>('ActivityLog', activityLogSchema)
