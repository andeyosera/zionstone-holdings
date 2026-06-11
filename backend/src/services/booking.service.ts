import { prisma } from '../database/client'
import { BookingStatus } from '@prisma/client'

interface CreateBookingBody {
  propertyId: string
  checkIn: string
  checkOut: string
  guestCount: number
  specialRequests?: string
}

// ─── CREATE BOOKING ───────────────────────────────────

export const createBooking = async (
  guestId: string,
  body: CreateBookingBody
) => {
  const { propertyId, checkIn, checkOut, guestCount, specialRequests } = body

  const checkInDate = new Date(checkIn)
  const checkOutDate = new Date(checkOut)

  // Validate dates
  if (checkInDate >= checkOutDate) {
    throw new Error('CHECK_OUT_BEFORE_CHECK_IN')
  }

  if (checkInDate < new Date()) {
    throw new Error('CHECK_IN_IN_PAST')
  }

  // Get property to calculate price
  const property = await prisma.property.findUnique({
    where: { id: propertyId }
  })

  if (!property) throw new Error('PROPERTY_NOT_FOUND')
  if (!property.isPublished) throw new Error('PROPERTY_NOT_AVAILABLE')
  if (guestCount > property.maxGuests) throw new Error('TOO_MANY_GUESTS')

  // Check for conflicting bookings on these dates
  const conflict = await prisma.booking.findFirst({
    where: {
      propertyId,
      status: { in: [BookingStatus.PENDING, BookingStatus.CONFIRMED] },
      OR: [
        {
          checkIn: { lte: checkOutDate },
          checkOut: { gte: checkInDate },
        }
      ]
    }
  })

  if (conflict) throw new Error('DATES_NOT_AVAILABLE')

  // Calculate total price
  const nights = Math.ceil(
    (checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24)
  )
  const totalPrice = Number(property.pricePerNight) * nights

  // Create the booking
  const booking = await prisma.booking.create({
    data: {
      guestId,
      propertyId,
      checkIn: checkInDate,
      checkOut: checkOutDate,
      totalPrice,
      guestCount,
      specialRequests,
      status: BookingStatus.PENDING,
    },
    include: {
      property: {
        include: {
          images: { where: { isCover: true }, take: 1 }
        }
      }
    }
  })

  return { ...booking, nights }
}

// ─── GET MY BOOKINGS (as guest) ───────────────────────

export const getMyBookings = async (guestId: string) => {
  return prisma.booking.findMany({
    where: { guestId },
    include: {
      property: {
        include: {
          images: { where: { isCover: true }, take: 1 },
          host: { select: { id: true, name: true } }
        }
      },
      review: { select: { id: true, rating: true } }
    },
    orderBy: { createdAt: 'desc' }
  })
}

// ─── GET BOOKINGS FOR HOST'S PROPERTIES ──────────────

export const getHostBookings = async (hostId: string) => {
  return prisma.booking.findMany({
    where: {
      property: { hostId }
    },
    include: {
      property: {
        select: { id: true, title: true }
      },
      guest: {
        select: { id: true, name: true, email: true, phone: true }
      }
    },
    orderBy: { createdAt: 'desc' }
  })
}

// ─── CANCEL BOOKING ───────────────────────────────────

export const cancelBooking = async (bookingId: string, userId: string) => {
  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
    include: { property: true }
  })

  if (!booking) throw new Error('BOOKING_NOT_FOUND')

  // Only the guest or the host can cancel
  const isGuest = booking.guestId === userId
  const isHost = booking.property.hostId === userId

  if (!isGuest && !isHost) throw new Error('FORBIDDEN')

  if (booking.status === BookingStatus.CANCELLED) {
    throw new Error('ALREADY_CANCELLED')
  }

  if (booking.status === BookingStatus.COMPLETED) {
    throw new Error('BOOKING_COMPLETED')
  }

  return prisma.booking.update({
    where: { id: bookingId },
    data: { status: BookingStatus.CANCELLED }
  })
}

// ─── CONFIRM BOOKING (host action) ────────────────────

export const confirmBooking = async (bookingId: string, hostId: string) => {
  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
    include: { property: true }
  })

  if (!booking) throw new Error('BOOKING_NOT_FOUND')
  if (booking.property.hostId !== hostId) throw new Error('FORBIDDEN')
  if (booking.status !== BookingStatus.PENDING) throw new Error('NOT_PENDING')

  return prisma.booking.update({
    where: { id: bookingId },
    data: { status: BookingStatus.CONFIRMED }
  })
}