import { Response } from 'express'
import { AuthenticatedRequest } from '../types/auth.types'
import * as ReviewService from '../services/review.service'

export const createReview = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { bookingId, rating, comment } = req.body
    if (!bookingId || !rating || !comment) {
      res.status(400).json({ message: 'bookingId, rating and comment are required' })
      return
    }
    const review = await ReviewService.createReview(req.user.id, { bookingId, rating: Number(rating), comment })
    res.status(201).json({ message: 'Review submitted', data: review })
  } catch (error: unknown) {
    if (error instanceof Error) {
      const map: Record<string, { status: number; message: string }> = {
        BOOKING_NOT_FOUND:    { status: 404, message: 'Booking not found' },
        FORBIDDEN:            { status: 403, message: 'Not authorized' },
        BOOKING_NOT_COMPLETED:{ status: 400, message: 'You can only review completed stays' },
        REVIEW_EXISTS:        { status: 409, message: 'You already reviewed this stay' },
        INVALID_RATING:       { status: 400, message: 'Rating must be between 1 and 5' },
      }
      const mapped = map[error.message]
      if (mapped) { res.status(mapped.status).json({ message: mapped.message }); return }
    }
    res.status(500).json({ message: 'Internal server error' })
  }
}

export const getPropertyReviews = async (req: any, res: Response): Promise<void> => {
  try {
    const result = await ReviewService.getPropertyReviews(req.params.propertyId)
    res.status(200).json({ data: result })
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' })
  }
}