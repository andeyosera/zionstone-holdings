import { Response, NextFunction } from 'express'
import { AuthenticatedRequest } from '../types/auth.types'
import { verifyToken } from '../utils/jwt'

export const protect = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void => {
  try {
    // 1. Get token from Authorization header
    const authHeader = req.headers.authorization

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({ message: 'Not authorized. No token provided.' })
      return
    }

    // 2. Extract the token (remove "Bearer " prefix)
    const token = authHeader.split(' ')[1]

    // 3. Verify and decode it
    const decoded = verifyToken(token)

    // 4. Attach user info to request — now available in all controllers
    req.user = {
      id: decoded.userId,
      email: decoded.email,
      role: decoded.role,
    }

    // 5. Pass control to the next middleware or controller
    next()
  } catch {
    res.status(401).json({ message: 'Not authorized. Invalid token.' })
  }
}

// Role-based authorization — use after protect middleware
export const restrictTo = (...roles: string[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    if (!roles.includes(req.user.role)) {
      res.status(403).json({
        message: `Access denied. Required role: ${roles.join(' or ')}`
      })
      return
    }
    next()
  }
}