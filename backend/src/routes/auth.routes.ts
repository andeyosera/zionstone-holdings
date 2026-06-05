import { Router } from 'express'
import { register, login, me } from '../controllers/auth.controller'
import { protect } from '../middleware/auth.middleware'

const router = Router()

// Public routes — no token needed
router.post('/register', register)
router.post('/login', login)

// Protected route — must be logged in
router.get('/me', protect as any, me as any)

export default router