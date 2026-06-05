import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import { config } from './config/env'
import authRoutes from './routes/auth.routes'

const app = express()

app.use(helmet())
app.use(cors({
  origin: config.frontendUrl,
  credentials: true,
}))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

if (config.nodeEnv === 'development') {
  app.use(morgan('dev'))
}

// Health check
app.get('/health', (_req, res) => {
  res.json({
    status: 'ok',
    environment: config.nodeEnv,
    timestamp: new Date().toISOString()
  })
})

// API Routes
app.use('/api/auth', authRoutes)

// 404 handler
app.use((_req, res) => {
  res.status(404).json({ message: 'Route not found' })
})

export default app