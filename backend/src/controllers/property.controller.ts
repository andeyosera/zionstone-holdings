import { Request, Response } from 'express'
import { AuthenticatedRequest } from '../types/auth.types'
import * as PropertyService from '../services/property.service'
import { PropertyType } from '@prisma/client'

export const getAllProperties = async (req: Request, res: Response): Promise<void> => {
  try {
    const result = await PropertyService.getAllProperties({
      county: req.query.county as string,
      town: req.query.town as string,
      type: req.query.type as PropertyType,
      minPrice: req.query.minPrice ? Number(req.query.minPrice) : undefined,
      maxPrice: req.query.maxPrice ? Number(req.query.maxPrice) : undefined,
      maxGuests: req.query.maxGuests ? Number(req.query.maxGuests) : undefined,
      page: req.query.page ? Number(req.query.page) : 1,
      limit: req.query.limit ? Number(req.query.limit) : 12,
    })

    res.status(200).json({ data: result })
  } catch (error) {
    console.error('Get properties error:', error)
    res.status(500).json({ message: 'Internal server error' })
  }
}

export const getPropertyById = async (req: Request, res: Response): Promise<void> => {
  try {
    const property = await PropertyService.getPropertyById(req.params.id)
    res.status(200).json({ data: property })
  } catch (error: unknown) {
    if (error instanceof Error && error.message === 'PROPERTY_NOT_FOUND') {
      res.status(404).json({ message: 'Property not found' })
      return
    }
    res.status(500).json({ message: 'Internal server error' })
  }
}

export const createProperty = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const {
      title, description, type, county, town,
      address, latitude, longitude, pricePerNight,
      maxGuests, bedrooms, bathrooms, amenities
    } = req.body

    // Validate required fields
    if (!title || !description || !type || !county || !town || !address || !pricePerNight) {
      res.status(400).json({ message: 'Missing required fields' })
      return
    }

    const property = await PropertyService.createProperty(req.user.id, {
      title, description, type, county, town,
      address, latitude, longitude, pricePerNight,
      maxGuests: Number(maxGuests),
      bedrooms: Number(bedrooms),
      bathrooms: Number(bathrooms),
      amenities: amenities || [],
    })

    res.status(201).json({
      message: 'Property created successfully',
      data: property
    })
  } catch (error) {
    console.error('Create property error:', error)
    res.status(500).json({ message: 'Internal server error' })
  }
}

export const updateProperty = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const updated = await PropertyService.updateProperty(
      req.params.id,
      req.user.id,
      req.body
    )
    res.status(200).json({ message: 'Property updated', data: updated })
  } catch (error: unknown) {
    if (error instanceof Error && error.message === 'PROPERTY_NOT_FOUND') {
      res.status(404).json({ message: 'Property not found' })
      return
    }
    if (error instanceof Error && error.message === 'FORBIDDEN') {
      res.status(403).json({ message: 'You do not own this property' })
      return
    }
    res.status(500).json({ message: 'Internal server error' })
  }
}

export const deleteProperty = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    await PropertyService.deleteProperty(req.params.id, req.user.id)
    res.status(200).json({ message: 'Property deleted successfully' })
  } catch (error: unknown) {
    if (error instanceof Error && error.message === 'PROPERTY_NOT_FOUND') {
      res.status(404).json({ message: 'Property not found' })
      return
    }
    if (error instanceof Error && error.message === 'FORBIDDEN') {
      res.status(403).json({ message: 'You do not own this property' })
      return
    }
    res.status(500).json({ message: 'Internal server error' })
  }
}

export const getMyProperties = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const properties = await PropertyService.getMyProperties(req.user.id)
    res.status(200).json({ data: properties })
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' })
  }
}