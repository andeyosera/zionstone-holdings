import { PrismaClient, Role, PropertyType, BookingStatus } from '@prisma/client'
import bcrypt from 'bcryptjs'
import * as dotenv from 'dotenv'
import path from 'node:path'

dotenv.config({ path: path.join(__dirname, '..', '.env') })

console.log('🚀 Seed file starting...')
console.log('📡 Connecting to:', process.env.DATABASE_URL)

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding Zionstone database...')

  // Clean in correct order
  await prisma.availability.deleteMany()
  await prisma.review.deleteMany()
  await prisma.booking.deleteMany()
  await prisma.propertyImage.deleteMany()
  await prisma.property.deleteMany()
  await prisma.user.deleteMany()

  console.log('🧹 Cleared existing data...')

  const passwordHash = await bcrypt.hash('password123', 12)

  // ── USERS ──────────────────────────────────────────
  const host1 = await prisma.user.create({
    data: {
      name: 'James Wanjala',
      email: 'james@zionstone.co.ke',
      passwordHash,
      phone: '+254712345678',
      role: Role.HOST,
      isVerified: true,
    },
  })

  const host2 = await prisma.user.create({
    data: {
      name: 'Grace Akinyi',
      email: 'grace@zionstone.co.ke',
      passwordHash,
      phone: '+254723456789',
      role: Role.HOST,
      isVerified: true,
    },
  })

  const guest1 = await prisma.user.create({
    data: {
      name: 'Achieng Otieno',
      email: 'achieng@gmail.com',
      passwordHash,
      phone: '+254798765432',
      role: Role.GUEST,
      isVerified: true,
    },
  })

  const guest2 = await prisma.user.create({
    data: {
      name: 'Brian Kamau',
      email: 'brian@gmail.com',
      passwordHash,
      phone: '+254711223344',
      role: Role.GUEST,
      isVerified: true,
    },
  })

  console.log('👤 Created 4 users...')

  // ── PROPERTIES ─────────────────────────────────────

  const p1 = await prisma.property.create({
    data: {
      hostId: host1.id,
      title: 'Cozy Studio in Kakamega Town',
      description: 'A compact, well-furnished studio apartment right in the heart of Kakamega Town. Walking distance to shops, matatu stage and restaurants. Perfect for business travellers and solo guests.',
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
      amenities: ['WiFi', 'Hot shower', 'Kitchen', 'Security', 'Parking'],
      isPublished: true,
    },
  })

  const p2 = await prisma.property.create({
    data: {
      hostId: host1.id,
      title: 'Forest View Cottage near Kakamega Reserve',
      description: 'Wake up to birdsong and the rustle of ancient trees in this charming cottage just 2km from the Kakamega Forest Reserve. Ideal for nature lovers, birders and families seeking a peaceful escape.',
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
      amenities: ['WiFi', 'Garden', 'Fireplace', 'Parking', 'BBQ', 'Hot shower'],
      isPublished: true,
    },
  })

  const p3 = await prisma.property.create({
    data: {
      hostId: host2.id,
      title: 'Spacious Family House in Mumias',
      description: 'A well-maintained 3-bedroom family home in quiet residential Mumias. Large compound with a lush garden, secure parking and a fully equipped kitchen. Great for families and groups.',
      type: PropertyType.HOUSE,
      county: 'Kakamega',
      town: 'Mumias',
      address: 'Mumias Sugar Belt Road',
      latitude: 0.3367,
      longitude: 34.4867,
      pricePerNight: 5500,
      maxGuests: 6,
      bedrooms: 3,
      bathrooms: 2,
      amenities: ['WiFi', 'Parking', 'Garden', 'Kitchen', 'Security', 'TV', 'Washing machine'],
      isPublished: true,
    },
  })

  const p4 = await prisma.property.create({
    data: {
      hostId: host2.id,
      title: 'Modern Apartment in Kisumu CBD',
      description: 'Sleek modern apartment on the 4th floor with stunning views of Lake Victoria. Minutes from Kisumu city centre, Mega Plaza and the lakeside restaurants. High-speed WiFi and all amenities.',
      type: PropertyType.APARTMENT,
      county: 'Kisumu',
      town: 'Kisumu City',
      address: 'Oginga Odinga Street, Kisumu CBD',
      latitude: -0.0917,
      longitude: 34.7679,
      pricePerNight: 6500,
      maxGuests: 3,
      bedrooms: 2,
      bathrooms: 1,
      amenities: ['WiFi', 'AC', 'Hot shower', 'Kitchen', 'Security', 'Parking', 'TV'],
      isPublished: true,
    },
  })

  const p5 = await prisma.property.create({
    data: {
      hostId: host1.id,
      title: 'Luxury Villa with Garden in Kakamega',
      description: 'An exquisite 4-bedroom villa set in a beautifully landscaped 1-acre garden in the upmarket Milimani area of Kakamega. Features a spacious veranda, BBQ area and premium finishes throughout.',
      type: PropertyType.VILLA,
      county: 'Kakamega',
      town: 'Kakamega Town',
      address: 'Milimani Estate, Kakamega',
      latitude: 0.2891,
      longitude: 34.7612,
      pricePerNight: 12000,
      maxGuests: 8,
      bedrooms: 4,
      bathrooms: 3,
      amenities: ['WiFi', 'Garden', 'BBQ', 'Parking', 'Security', 'Kitchen', 'TV', 'Washing machine', 'Balcony'],
      isPublished: true,
    },
  })

  const p6 = await prisma.property.create({
    data: {
      hostId: host2.id,
      title: 'Charming Guesthouse in Eldoret',
      description: 'A warm and welcoming guesthouse in the heart of Eldoret. Clean comfortable rooms, friendly service and a hearty breakfast included. Close to Moi University and the town centre.',
      type: PropertyType.GUESTHOUSE,
      county: 'Uasin Gishu',
      town: 'Eldoret',
      address: 'Uganda Road, Eldoret',
      latitude: 0.5143,
      longitude: 35.2698,
      pricePerNight: 3200,
      maxGuests: 2,
      bedrooms: 1,
      bathrooms: 1,
      amenities: ['WiFi', 'Hot shower', 'Security', 'Parking', 'TV'],
      isPublished: true,
    },
  })

  const p7 = await prisma.property.create({
    data: {
      hostId: host1.id,
      title: 'Lakeside Studio near Lake Victoria',
      description: 'A beautiful self-contained studio just 500 metres from the shores of Lake Victoria in Kisumu. Enjoy spectacular sunrise views over the lake from your private balcony.',
      type: PropertyType.STUDIO,
      county: 'Kisumu',
      town: 'Dunga',
      address: 'Dunga Beach Road, Kisumu',
      latitude: -0.1245,
      longitude: 34.7523,
      pricePerNight: 3800,
      maxGuests: 2,
      bedrooms: 1,
      bathrooms: 1,
      amenities: ['WiFi', 'Balcony', 'Hot shower', 'Kitchen', 'Parking'],
      isPublished: true,
    },
  })

  const p8 = await prisma.property.create({
    data: {
      hostId: host2.id,
      title: 'Peaceful Cottage in Kapsabet',
      description: 'Escape the city in this serene cottage nestled in the rolling hills of Nandi County. Surrounded by tea plantations and fresh highland air — perfect for rest and rejuvenation.',
      type: PropertyType.COTTAGE,
      county: 'Nandi',
      town: 'Kapsabet',
      address: 'Nandi Hills Road, Kapsabet',
      latitude: 0.2043,
      longitude: 35.1018,
      pricePerNight: 3500,
      maxGuests: 4,
      bedrooms: 2,
      bathrooms: 1,
      amenities: ['Garden', 'Parking', 'Hot shower', 'Kitchen', 'Fireplace'],
      isPublished: true,
    },
  })

  console.log('🏠 Created 8 properties...')

  // ── BOOKINGS & REVIEWS ─────────────────────────────

  const booking1 = await prisma.booking.create({
    data: {
      guestId: guest1.id,
      propertyId: p1.id,
      checkIn: new Date('2025-06-01'),
      checkOut: new Date('2025-06-05'),
      totalPrice: 10000,
      guestCount: 1,
      status: BookingStatus.COMPLETED,
    },
  })

  const booking2 = await prisma.booking.create({
    data: {
      guestId: guest2.id,
      propertyId: p2.id,
      checkIn: new Date('2025-07-10'),
      checkOut: new Date('2025-07-14'),
      totalPrice: 18000,
      guestCount: 3,
      status: BookingStatus.COMPLETED,
    },
  })

  const booking3 = await prisma.booking.create({
    data: {
      guestId: guest1.id,
      propertyId: p5.id,
      checkIn: new Date('2025-08-20'),
      checkOut: new Date('2025-08-23'),
      totalPrice: 36000,
      guestCount: 5,
      status: BookingStatus.CONFIRMED,
    },
  })

  const booking4 = await prisma.booking.create({
    data: {
      guestId: guest2.id,
      propertyId: p4.id,
      checkIn: new Date('2026-07-01'),
      checkOut: new Date('2026-07-04'),
      totalPrice: 19500,
      guestCount: 2,
      status: BookingStatus.PENDING,
    },
  })

  await prisma.review.create({
    data: {
      bookingId: booking1.id,
      guestId: guest1.id,
      propertyId: p1.id,
      rating: 5,
      comment: 'Wonderful studio! Super clean, great WiFi and the location is perfect. James was very responsive and helpful. Will definitely come back!',
    },
  })

  await prisma.review.create({
    data: {
      bookingId: booking2.id,
      guestId: guest2.id,
      propertyId: p2.id,
      rating: 5,
      comment: 'Absolutely magical experience. Woke up to birds singing in the forest every morning. The cottage is cozy and well equipped. Highly recommended for nature lovers!',
    },
  })

  console.log('📅 Created 4 bookings and 2 reviews...')
  console.log('')
  console.log('✅ Seed complete!')
  console.log('   👤 Hosts:  james@zionstone.co.ke · grace@zionstone.co.ke')
  console.log('   👤 Guests: achieng@gmail.com · brian@gmail.com')
  console.log('   🏠 Properties: 8')
  console.log('   📅 Bookings: 4')
  console.log('   ⭐ Reviews: 2')
  console.log('   🔑 Password for all: password123')
}

main()
  .catch(e => {
    console.error('❌ Seed failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })