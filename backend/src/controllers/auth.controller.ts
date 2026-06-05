import { Request, Response } from 'express'
import { registerUser, loginUser, getMe } from '../services/auth.service'
import { AuthenticatedRequest } from '../types/auth.types'

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, password, role } = req.body

    // Basic validation
    if (!name || !email || !password) {
      res.status(400).json({ message: 'Name, email and password are required' })
      return
    }

    if (password.length < 8) {
      res.status(400).json({ message: 'Password must be at least 8 characters' })
      return
    }

    const result = await registerUser({ name, email, password, role })

    res.status(201).json({
      message: 'Account created successfully',
      data: result
    })
  } catch (error: unknown) {
    if (error instanceof Error && error.message === 'EMAIL_TAKEN') {
      res.status(409).json({ message: 'An account with this email already exists' })
      return
    }
    console.error('Register error:', error)
    res.status(500).json({ message: 'Internal server error' })
  }
}

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      res.status(400).json({ message: 'Email and password are required' })
      return
    }

    const result = await loginUser({ email, password })

    res.status(200).json({
      message: 'Login successful',
      data: result
    })
  } catch (error: unknown) {
    if (error instanceof Error && error.message === 'INVALID_CREDENTIALS') {
      res.status(401).json({ message: 'Invalid email or password' })
      return
    }
    console.error('Login error:', error)
    res.status(500).json({ message: 'Internal server error' })
  }
}

export const me = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const user = await getMe(req.user.id)
    res.status(200).json({ data: user })
  } catch (error: unknown) {
    if (error instanceof Error && error.message === 'USER_NOT_FOUND') {
      res.status(404).json({ message: 'User not found' })
      return
    }
    res.status(500).json({ message: 'Internal server error' })
  }
}