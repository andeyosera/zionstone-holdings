import { Router } from 'express'
import {
  createBooking,
  getMyBookings,
  getHostBookings,
  cancelBooking,
  confirmBooking,
} from '../controllers/booking.controller'
import { protect, restrictTo } from '../middleware/auth.middleware'

const router = Router()

// All booking routes require authentication
router.use(protect as any)

router.post('/', createBooking as any)
router.get('/my', getMyBookings as any)
router.get('/host', restrictTo('HOST', 'ADMIN') as any, getHostBookings as any)
router.patch('/:id/cancel', cancelBooking as any)
router.patch('/:id/confirm', restrictTo('HOST', 'ADMIN') as any, confirmBooking as any)

export default router