import { Request } from 'express'
import { Role } from '@prisma/client'

// This extends Express's Request type so TypeScript
// knows that req.user exists on authenticated routes
export interface AuthenticatedRequest extends Request {
  user: {
    id: string
    email: string
    role: Role
  }
}

// What the JWT payload contains
export interface JwtPayload {
  userId: string
  email: string
  role: Role
}

// Request body shapes
export interface RegisterBody {
  name: string
  email: string
  password: string
  role?: Role
}

export interface LoginBody {
  email: string
  password: string
}