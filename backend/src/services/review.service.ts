import { prisma } from '../database/client'
import { BookingStatus } from '@prisma/client'

export const createReview = async (
  guestId: string,
  body: { bookingId: string; rating: number; comment: string }
) => {
  const { bookingId, rating, comment } = body

  if (rating < 1 || rating > 5) throw new Error('INVALID_RATING')

  // Verify the booking exists, belongs to this guest, and is completed
  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
    include: { review: true }
  })

  if (!booking) throw new Error('BOOKING_NOT_FOUND')
  if (booking.guestId !== guestId) throw new Error('FORBIDDEN')
  if (booking.status !== BookingStatus.COMPLETED) throw new Error('BOOKING_NOT_COMPLETED')
  if (booking.review) throw new Error('REVIEW_EXISTS')

  return prisma.review.create({
    data: {
      bookingId,
      guestId,
      propertyId: booking.propertyId,
      rating,
      comment,
    },
    include: {
      guest: { select: { id: true, name: true, avatarUrl: true } }
    }
  })
}

export const getPropertyReviews = async (propertyId: string) => {
  const reviews = await prisma.review.findMany({
    where: { propertyId },
    include: {
      guest: { select: { id: true, name: true, avatarUrl: true } }
    },
    orderBy: { createdAt: 'desc' }
  })

  const avgRating = reviews.length > 0
    ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
    : null

  return { reviews, avgRating, total: reviews.length }
}