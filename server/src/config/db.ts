import mongoose from 'mongoose'
import { env } from './env.js'

export async function connectDb() {
  mongoose.set('strictQuery', true)

  await mongoose.connect(env.MONGODB_URI)
  console.log('MongoDB connected')

  mongoose.connection.on('error', (err) => {
    console.error('MongoDB connection error:', err)
  })
  mongoose.connection.on('disconnected', () => {
    console.warn('MongoDB disconnected')
  })
}
