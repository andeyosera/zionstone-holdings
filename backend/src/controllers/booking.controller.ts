import { Response } from 'express'
import { AuthenticatedRequest } from '../types/auth.types'
import * as BookingService from '../services/booking.service'

export const createBooking = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { propertyId, checkIn, checkOut, guestCount, specialRequests } = req.body

    if (!propertyId || !checkIn || !checkOut || !guestCount) {
      res.status(400).json({ message: 'propertyId, checkIn, checkOut and guestCount are required' })
      return
    }

    const booking = await BookingService.createBooking(req.user.id, {
      propertyId, checkIn, checkOut,
      guestCount: Number(guestCount),
      specialRequests,
    })

    res.status(201).json({ message: 'Booking created successfully', data: booking })
  } catch (error: unknown) {
    if (error instanceof Error) {
      const clientErrors: Record<string, { status: number; message: string }> = {
        PROPERTY_NOT_FOUND:     { status: 404, message: 'Property not found' },
        PROPERTY_NOT_AVAILABLE: { status: 400, message: 'Property is not available' },
        DATES_NOT_AVAILABLE:    { status: 409, message: 'These dates are already booked' },
        TOO_MANY_GUESTS:        { status: 400, message: 'Too many guests for this property' },
        CHECK_OUT_BEFORE_CHECK_IN: { status: 400, message: 'Check-out must be after check-in' },
        CHECK_IN_IN_PAST:       { status: 400, message: 'Check-in date cannot be in the past' },
      }
      const mapped = clientErrors[error.message]
      if (mapped) {
        res.status(mapped.status).json({ message: mapped.message })
        return
      }
    }
    console.error('Create booking error:', error)
    res.status(500).json({ message: 'Internal server error' })
  }
}

export const getMyBookings = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const bookings = await BookingService.getMyBookings(req.user.id)
    res.status(200).json({ data: bookings })
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' })
  }
}

export const getHostBookings = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const bookings = await BookingService.getHostBookings(req.user.id)
    res.status(200).json({ data: bookings })
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' })
  }
}

export const cancelBooking = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const bookingId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id
    await BookingService.cancelBooking(bookingId, req.user.id)
    res.status(200).json({ message: 'Booking cancelled successfully' })
  } catch (error: unknown) {
    if (error instanceof Error) {
      const clientErrors: Record<string, { status: number; message: string }> = {
        BOOKING_NOT_FOUND: { status: 404, message: 'Booking not found' },
        FORBIDDEN:         { status: 403, message: 'Not authorized' },
        ALREADY_CANCELLED: { status: 400, message: 'Booking is already cancelled' },
        BOOKING_COMPLETED: { status: 400, message: 'Cannot cancel a completed booking' },
      }
      const mapped = clientErrors[error.message]
      if (mapped) {
        res.status(mapped.status).json({ message: mapped.message })
        return
      }
    }
    res.status(500).json({ message: 'Internal server error' })
  }
}

export const confirmBooking = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const bookingId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id
    const booking = await BookingService.confirmBooking(bookingId, req.user.id)
    res.status(200).json({ message: 'Booking confirmed', data: booking })
  } catch (error: unknown) {
    if (error instanceof Error && error.message === 'FORBIDDEN') {
      res.status(403).json({ message: 'Not authorized' })
      return
    }
    res.status(500).json({ message: 'Internal server error' })
  }
}