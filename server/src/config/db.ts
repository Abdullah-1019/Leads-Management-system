import dns from 'dns'
import mongoose from 'mongoose'
import { env } from './env.js'

export async function connectDb() {
  mongoose.set('strictQuery', true)

  if (env.NODE_ENV === 'development') {
    // Some local machines/networks leave Node's own DNS resolver misconfigured (pointed at an
    // unreachable/refusing server) even though the OS resolver works fine everywhere else,
    // which breaks the mongodb+srv:// lookup specifically. Public resolvers sidestep it.
    dns.setServers(['1.1.1.1', '8.8.8.8'])
  }

  await mongoose.connect(env.MONGODB_URI)
  console.log('MongoDB connected')

  mongoose.connection.on('error', (err) => {
    console.error('MongoDB connection error:', err)
  })
  mongoose.connection.on('disconnected', () => {
    console.warn('MongoDB disconnected')
  })
}
