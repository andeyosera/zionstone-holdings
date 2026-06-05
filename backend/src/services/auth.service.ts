import bcrypt from 'bcryptjs'
import { prisma } from '../database/client'
import { signToken } from '../utils/jwt'
import { RegisterBody, LoginBody } from '../types/auth.types'
import { Role } from '@prisma/client'

export const registerUser = async (body: RegisterBody) => {
  const { name, email, password, role } = body

  // 1. Check if email already exists
  const existingUser = await prisma.user.findUnique({
    where: { email: email.toLowerCase() }
  })

  if (existingUser) {
    throw new Error('EMAIL_TAKEN')
  }

  // 2. Hash the password — never store plain text
  // 12 is the salt rounds — higher = more secure but slower
  // 12 is the production standard (10 is minimum, 14 is maximum practical)
  const passwordHash = await bcrypt.hash(password, 12)

  // 3. Create the user
  const user = await prisma.user.create({
    data: {
      name,
      email: email.toLowerCase(),
      passwordHash,
      role: role || Role.GUEST,
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
      // Never select passwordHash — never send it to the client
    }
  })

  // 4. Generate JWT token
  const token = signToken({
    userId: user.id,
    email: user.email,
    role: user.role,
  })

  return { user, token }
}

export const loginUser = async (body: LoginBody) => {
  const { email, password } = body

  // 1. Find user by email — include passwordHash this time for comparison
  const user = await prisma.user.findUnique({
    where: { email: email.toLowerCase() }
  })

  // 2. User not found OR password wrong — same error message for security
  // Never tell attackers whether the email exists or not
  if (!user) {
    throw new Error('INVALID_CREDENTIALS')
  }

  const isPasswordValid = await bcrypt.compare(password, user.passwordHash)

  if (!isPasswordValid) {
    throw new Error('INVALID_CREDENTIALS')
  }

  // 3. Generate token
  const token = signToken({
    userId: user.id,
    email: user.email,
    role: user.role,
  })

  // 4. Return user without passwordHash
  const { passwordHash: _, ...userWithoutPassword } = user

  return { user: userWithoutPassword, token }
}

export const getMe = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      avatarUrl: true,
      role: true,
      isVerified: true,
      createdAt: true,
    }
  })

  if (!user) {
    throw new Error('USER_NOT_FOUND')
  }

  return user
}