import { Router } from 'express'
import { activityRouter } from './activity.routes.js'
import { applicationsRouter } from './applications.routes.js'
import { authRouter } from './auth.routes.js'
import { dashboardRouter } from './dashboard.routes.js'
import { feedbackRouter } from './feedback.routes.js'
import { interviewsRouter } from './interviews.routes.js'
import { usersRouter } from './users.routes.js'

export const apiRouter = Router()

apiRouter.use('/auth', authRouter)
apiRouter.use('/applications', applicationsRouter)
apiRouter.use('/interviews', interviewsRouter)
apiRouter.use('/feedback', feedbackRouter)
apiRouter.use('/users', usersRouter)
apiRouter.use('/activity', activityRouter)
apiRouter.use('/dashboard', dashboardRouter)
