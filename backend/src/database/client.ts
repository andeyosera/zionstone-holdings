import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'

// In production (Railway), DATABASE_URL is set as environment variable
// In development, dotenv loads it from .env file
const connectionString = process.env.DATABASE_URL!

if (!connectionString) {
  throw new Error('DATABASE_URL environment variable is not set')
}

const adapter = new PrismaPg({ connectionString })

export const prisma = new PrismaClient({
  adapter,
  log: process.env.NODE_ENV === 'development'
    ? ['error', 'warn']
    : ['error'],
})