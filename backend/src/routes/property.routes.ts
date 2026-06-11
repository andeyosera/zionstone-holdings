import { Router } from 'express'
import {
  getAllProperties,
  getPropertyById,
  createProperty,
  updateProperty,
  deleteProperty,
  getMyProperties,
} from '../controllers/property.controller'
import { protect, restrictTo } from '../middleware/auth.middleware'

const router = Router()

// ── Public routes ──────────────────────────────────────
router.get('/', getAllProperties)
router.get('/:id', getPropertyById)

// ── Protected routes (must be logged in) ───────────────
router.get('/host/my-properties', protect as any, getMyProperties as any)

// ── Host only routes ───────────────────────────────────
router.post('/', protect as any, restrictTo('HOST', 'ADMIN') as any, createProperty as any)
router.patch('/:id', protect as any, restrictTo('HOST', 'ADMIN') as any, updateProperty as any)
router.delete('/:id', protect as any, restrictTo('HOST', 'ADMIN') as any, deleteProperty as any)

export default router