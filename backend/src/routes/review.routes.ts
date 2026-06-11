import { Router } from 'express'
import { createReview, getPropertyReviews } from '../controllers/review.controller'
import { protect } from '../middleware/auth.middleware'

const router = Router()

router.get('/:propertyId', getPropertyReviews)
router.post('/', protect as any, createReview as any)

export default router