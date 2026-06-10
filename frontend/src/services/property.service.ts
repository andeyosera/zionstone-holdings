import api from './api'

export interface Property {
  id: string
  title: string
  description: string
  type: string
  county: string
  town: string
  address: string
  pricePerNight: number
  maxGuests: number
  bedrooms: number
  bathrooms: number
  amenities: string[]
  isPublished: boolean
  avgRating: number | null
  host: { id: string; name: string; avatarUrl: string | null }
  images: { id: string; url: string; isCover: boolean }[]
  reviews: Review[]
  _count: { reviews: number }
}

export interface Review {
  id: string
  rating: number
  comment: string
  createdAt: string
  guest: { id: string; name: string; avatarUrl: string | null }
}

export interface PropertyFilters {
  county?: string
  town?: string
  type?: string
  minPrice?: number
  maxPrice?: number
  maxGuests?: number
  page?: number
  limit?: number
}

export const propertyService = {
  getAll: async (filters: PropertyFilters = {}) => {
    const params = new URLSearchParams()
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== '') params.append(key, String(value))
    })
    const { data } = await api.get(`/properties?${params}`)
    return data.data
  },

  getById: async (id: string) => {
    const { data } = await api.get(`/properties/${id}`)
    return data.data as Property
  },

  getMyProperties: async () => {
    const { data } = await api.get('/properties/host/my-properties')
    return data.data as Property[]
  },

  create: async (body: Partial<Property>) => {
    const { data } = await api.post('/properties', body)
    return data.data as Property
  },

  update: async (id: string, body: Partial<Property>) => {
    const { data } = await api.patch(`/properties/${id}`, body)
    return data.data as Property
  },
}