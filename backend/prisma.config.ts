import path from 'node:path'
import { defineConfig } from '@prisma/config'
import * as dotenv from 'dotenv'

// Explicitly load .env file — guaranteed to work on all platforms
dotenv.config({ path: path.join(__dirname, '.env') })

export default defineConfig({
  earlyAccess: true,
  schema: path.join('prisma', 'schema.prisma'),
  migrate: {
    async adapter() {
      const { PrismaPg } = await import('@prisma/adapter-pg')
      const connectionString = process.env.DATABASE_URL!

      if (!connectionString) {
        throw new Error('DATABASE_URL is not set in your .env file')
      }

      return new PrismaPg({ connectionString })
    },
  },
})