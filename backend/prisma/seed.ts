import { PrismaClient, Role, PropertyType, BookingStatus } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import bcrypt from 'bcryptjs'
import * as dotenv from 'dotenv'
import path from 'node:path'

// Explicitly load .env
dotenv.config({ path: path.join(__dirname, '..', '.env') })

console.log('🚀 Seed file is starting...')
console.log('📡 Connecting to:', process.env.DATABASE_URL)

// Prisma 7 requires the adapter pattern
const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
})

const prisma = new PrismaClient({ adapter })

async function main() {
  console.log('🌱 Seeding Zionstone database...')

  // Clean existing data (order matters — delete children before parents)
  await prisma.availability.deleteMany()
  await prisma.review.deleteMany()
  await prisma.booking.deleteMany()
  await prisma.propertyImage.deleteMany()
  await prisma.property.deleteMany()
  await prisma.user.deleteMany()

  console.log('🧹 Cleared existing data...')

  // Create users
  const passwordHash = await bcrypt.hash('password123', 12)

  const host = await prisma.user.create({
    data: {
      name: 'James Wanjala',
      email: 'james@zionstone.co.ke',
      passwordHash,
      phone: '+254712345678',
      role: Role.HOST,
      isVerified: true,
    },
  })

  const guest = await prisma.user.create({
    data: {
      name: 'Achieng Otieno',
      email: 'achieng@gmail.com',
      passwordHash,
      phone: '+254798765432',
      role: Role.GUEST,
      isVerified: true,
    },
  })

  console.log('👤 Created users...')

  // Create properties
  const property1 = await prisma.property.create({
    data: {
      hostId: host.id,
      title: 'Cozy Studio in Kakamega Town',
      description: 'A modern studio apartment in the heart of Kakamega Town. Close to shops, restaurants and the famous Kakamega Forest.',
      type: PropertyType.STUDIO,
      county: 'Kakamega',
      town: 'Kakamega Town',
      address: 'Off Mumias Road, Kakamega Town',
      latitude: 0.2827,
      longitude: 34.7519,
      pricePerNight: 2500,
      maxGuests: 2,
      bedrooms: 1,
      bathrooms: 1,
      amenities: ['WiFi', 'Parking', 'Hot shower', 'Kitchen', 'Security'],
      isPublished: true,
      images: {
        create: [
          { url: 'https://picsum.photos/800/600?random=1', isCover: true, sortOrder: 1 },
          { url: 'https://picsum.photos/800/600?random=2', sortOrder: 2 },
        ],
      },
    },
  })

  await prisma.property.create({
    data: {
      hostId: host.id,
      title: 'Forest View Cottage near Kakamega Forest',
      description: 'Wake up to the sounds of nature in this charming cottage just 2km from the Kakamega Forest Reserve.',
      type: PropertyType.COTTAGE,
      county: 'Kakamega',
      town: 'Shinyalu',
      address: 'Shinyalu Road, near Forest Reserve',
      latitude: 0.3012,
      longitude: 34.8521,
      pricePerNight: 4500,
      maxGuests: 4,
      bedrooms: 2,
      bathrooms: 1,
      amenities: ['WiFi', 'Garden', 'Fireplace', 'Parking', 'BBQ'],
      isPublished: true,
      images: {
        create: [
          { url: 'https://picsum.photos/800/600?random=3', isCover: true, sortOrder: 1 },
        ],
      },
    },
  })

  console.log('🏠 Created properties...')

  // Create a booking
  const booking = await prisma.booking.create({
    data: {
      guestId: guest.id,
      propertyId: property1.id,
      checkIn: new Date('2025-08-01'),
      checkOut: new Date('2025-08-05'),
      totalPrice: 10000,
      guestCount: 2,
      status: BookingStatus.COMPLETED,
    },
  })

  // Create a review
  await prisma.review.create({
    data: {
      bookingId: booking.id,
      guestId: guest.id,
      propertyId: property1.id,
      rating: 5,
      comment: 'Wonderful place! Very clean, great location and the host was super responsive.',
    },
  })

  console.log('📅 Created bookings and reviews...')
  console.log('')
  console.log('✅ Seed complete!')
  console.log('   👤 Host:', host.email)
  console.log('   👤 Guest:', guest.email)
  console.log('   🏠 Properties: 2')
  console.log('   📅 Bookings: 1')
  console.log('   ⭐ Reviews: 1')
  console.log('')
  console.log('   Password for all users: password123')
}

main()
  .catch((e) => {
    console.error('❌ Seed failed with error:')
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })