import path from 'node:path'
import { defineConfig } from '@prisma/config'
import * as dotenv from 'dotenv'

// Only load .env file in development
if (process.env.NODE_ENV !== 'production') {
  dotenv.config({ path: path.join(__dirname, '.env') })
}

export default defineConfig({
  earlyAccess: true,
  schema: path.join('prisma', 'schema.prisma'),
  migrate: {
    async adapter() {
      const { PrismaPg } = await import('@prisma/adapter-pg')
      const connectionString = process.env.DATABASE_URL!

      if (!connectionString) {
        throw new Error('DATABASE_URL is not set')
      }

      return new PrismaPg({
        connectionString,
        ssl: process.env.NODE_ENV === 'production'
          ? { rejectUnauthorized: false }
          : false,
      })
    },
  },
})