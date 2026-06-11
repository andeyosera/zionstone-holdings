import { prisma } from '../database/client'
import { PropertyType } from '@prisma/client'

// ─── TYPES ───────────────────────────────────────────────

interface PropertyFilters {
  county?: string
  town?: string
  type?: PropertyType
  minPrice?: number
  maxPrice?: number
  maxGuests?: number
  page?: number
  limit?: number
}

interface CreatePropertyBody {
  title: string
  description: string
  type: PropertyType
  county: string
  town: string
  address: string
  latitude?: number
  longitude?: number
  pricePerNight: number
  maxGuests: number
  bedrooms: number
  bathrooms: number
  amenities: string[]
}

// ─── GET ALL PROPERTIES (with search + pagination) ───────

export const getAllProperties = async (filters: PropertyFilters) => {
  const {
    county,
    town,
    type,
    minPrice,
    maxPrice,
    maxGuests,
    page = 1,
    limit = 12,
  } = filters

  // Build the WHERE clause dynamically
  // Only add a filter if the value was actually provided
  const where: any = {
    isPublished: true,
    ...(county && { county: { contains: county, mode: 'insensitive' } }),
    ...(town && { town: { contains: town, mode: 'insensitive' } }),
    ...(type && { type }),
    ...(maxGuests && { maxGuests: { gte: Number(maxGuests) } }),
    ...(minPrice || maxPrice) && {
      pricePerNight: {
        ...(minPrice && { gte: Number(minPrice) }),
        ...(maxPrice && { lte: Number(maxPrice) }),
      }
    },
  }

  // Run both queries in parallel for performance
  const [properties, total] = await Promise.all([
    prisma.property.findMany({
      where,
      include: {
        host: {
          select: { id: true, name: true, avatarUrl: true }
        },
        images: {
          where: { isCover: true },
          take: 1,
        },
        reviews: {
          select: { rating: true }
        },
        _count: {
          select: { reviews: true, bookings: true }
        }
      },
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.property.count({ where }),
  ])

  // Calculate average rating for each property
  const propertiesWithRating = properties.map(property => {
    const avgRating = property.reviews.length > 0
      ? property.reviews.reduce((sum, r) => sum + r.rating, 0) / property.reviews.length
      : null

    const { reviews, ...rest } = property
    return { ...rest, avgRating }
  })

  return {
    properties: propertiesWithRating,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      hasNextPage: page < Math.ceil(total / limit),
      hasPrevPage: page > 1,
    }
  }
}

// ─── GET SINGLE PROPERTY ─────────────────────────────────

export const getPropertyById = async (id: string) => {
  const property = await prisma.property.findUnique({
    where: { id },
    include: {
      host: {
        select: {
          id: true,
          name: true,
          avatarUrl: true,
          createdAt: true,
        }
      },
      images: {
        orderBy: { sortOrder: 'asc' }
      },
      reviews: {
        include: {
          guest: {
            select: { id: true, name: true, avatarUrl: true }
          }
        },
        orderBy: { createdAt: 'desc' },
        take: 10,
      },
      _count: {
        select: { reviews: true }
      }
    }
  })

  if (!property) {
    throw new Error('PROPERTY_NOT_FOUND')
  }

  // Calculate average rating
  const avgRating = property.reviews.length > 0
    ? property.reviews.reduce((sum, r) => sum + r.rating, 0) / property.reviews.length
    : null

  return { ...property, avgRating }
}

// ─── CREATE PROPERTY ─────────────────────────────────────

export const createProperty = async (
  hostId: string,
  body: CreatePropertyBody
) => {
  const property = await prisma.property.create({
    data: {
      ...body,
      hostId,
      isPublished: false, // Always start as draft
    },
    include: {
      images: true,
      host: {
        select: { id: true, name: true, avatarUrl: true }
      }
    }
  })

  return property
}

// ─── UPDATE PROPERTY ─────────────────────────────────────

export const updateProperty = async (
  id: string,
  hostId: string,
  body: Partial<CreatePropertyBody & { isPublished: boolean }>
) => {
  // First verify this property belongs to this host
  const existing = await prisma.property.findUnique({ where: { id } })

  if (!existing) throw new Error('PROPERTY_NOT_FOUND')
  if (existing.hostId !== hostId) throw new Error('FORBIDDEN')

  const updated = await prisma.property.update({
    where: { id },
    data: body,
    include: { images: true }
  })

  return updated
}

// ─── DELETE PROPERTY ─────────────────────────────────────

export const deleteProperty = async (id: string, hostId: string) => {
  const existing = await prisma.property.findUnique({ where: { id } })

  if (!existing) throw new Error('PROPERTY_NOT_FOUND')
  if (existing.hostId !== hostId) throw new Error('FORBIDDEN')

  await prisma.property.delete({ where: { id } })
}

// ─── GET HOST'S OWN PROPERTIES ───────────────────────────

export const getMyProperties = async (hostId: string) => {
  return prisma.property.findMany({
    where: { hostId },
    include: {
      images: { where: { isCover: true }, take: 1 },
      _count: { select: { bookings: true, reviews: true } }
    },
    orderBy: { createdAt: 'desc' }
  })
}