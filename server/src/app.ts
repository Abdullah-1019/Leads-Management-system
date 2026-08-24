import cors from 'cors'
import express from 'express'
import helmet from 'helmet'
import { corsOptions } from './config/cors.js'
import { errorHandler } from './middleware/errorHandler.js'
import { notFound } from './middleware/notFound.js'
import { sanitizeInput } from './middleware/sanitize.js'
import { apiRouter } from './routes/index.js'

export function createApp() {
  const app = express()

  app.use(helmet())
  app.use(cors(corsOptions))
  app.use(express.json())
  app.use(sanitizeInput)

  app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok', service: 'company-crm-api' })
  })

  app.use('/api', apiRouter)

  app.use(notFound)
  app.use(errorHandler)

  return app
}
