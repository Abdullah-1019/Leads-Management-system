import { connectDb } from '../config/db.js'
import { User } from '../models/User.js'
import { hashPassword } from '../utils/password.js'
import mongoose from 'mongoose'

const DEV_USERS = [
  {
    name: 'Abdullah',
    email: 'abdullah@companycrm.dev',
    password: 'ChangeMe123!',
    role: 'APPLICANT' as const,
  },
  {
    name: 'Sara',
    email: 'sara@companycrm.dev',
    password: 'ChangeMe123!',
    role: 'INTERVIEWER' as const,
  },
  {
    name: 'Umair',
    email: 'umair@companycrm.dev',
    password: 'ChangeMe123!',
    role: 'ADMIN' as const,
  },
]

async function seed() {
  await connectDb()

  for (const dev of DEV_USERS) {
    const passwordHash = await hashPassword(dev.password)

    await User.findOneAndUpdate(
      { email: dev.email },
      { name: dev.name, email: dev.email, passwordHash, role: dev.role, isActive: true },
      { upsert: true, new: true },
    )

    console.log(`Seeded ${dev.role.toLowerCase()}: ${dev.email}`)
  }

  console.log('\n⚠ These are temporary dev passwords — change them before production.')
  console.log('   Password for all dev users: ChangeMe123!\n')

  await mongoose.disconnect()
}

seed().catch((err) => {
  console.error('Seed failed:', err)
  process.exit(1)
})
