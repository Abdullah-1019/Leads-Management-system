import { Schema, model } from 'mongoose'

export const USER_ROLES = ['APPLICANT', 'INTERVIEWER', 'ADMIN'] as const
export type UserRole = (typeof USER_ROLES)[number]

export interface IUser {
  name: string
  email: string
  passwordHash: string
  role: UserRole
  avatar?: string
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: USER_ROLES, required: true },
    avatar: { type: String },
    isActive: { type: Boolean, default: true },
  },
  {
    timestamps: true,
    toJSON: {
      transform: (_doc, ret) => {
        delete (ret as { passwordHash?: string }).passwordHash
        return ret
      },
    },
  },
)

userSchema.index({ role: 1 })

export const User = model<IUser>('User', userSchema)
