import api from './api'

export interface Booking {
  id: string
  checkIn: string
  checkOut: string
  totalPrice: number
  guestCount: number
  nights: number
  status: string
  property: {
    id: string
    title: string
    town: string
    type: string
    images: { url: string; isCover: boolean }[]
  }
}

export const bookingService = {
  create: async (body: {
    propertyId: string
    checkIn: string
    checkOut: string
    guestCount: number
    specialRequests?: string
  }) => {
    const { data } = await api.post('/bookings', body)
    return data.data as Booking
  },

  getMyBookings: async () => {
    const { data } = await api.get('/bookings/my')
    return data.data as Booking[]
  },

  cancel: async (id: string) => {
    const { data } = await api.patch(`/bookings/${id}/cancel`)
    return data
  },
}