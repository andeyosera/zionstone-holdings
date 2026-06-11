import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { propertyService,type Property } from '../services/property.service'
import { bookingService } from '../services/booking.service'
import { useAuthStore } from '../stores/auth.store'
import { getPropertyPhotos } from '../utils/photos'

const AMENITY_ICONS: Record<string, string> = {
  'WiFi': '📶', 'Parking': '🚗', 'Kitchen': '🍳', 'Hot shower': '🚿',
  'Security': '🔒', 'Garden': '🌿', 'Fireplace': '🔥', 'BBQ': '🍖',
  'Pool': '🏊', 'Gym': '💪', 'TV': '📺', 'AC': '❄️',
  'Washing machine': '🫧', 'Balcony': '🏙', 'Pet friendly': '🐾',
}

export default function PropertyDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { user } = useAuthStore()

  const [property, setProperty] = useState<Property | null>(null)
  const [loading, setLoading] = useState(true)
  const [activePhoto, setActivePhoto] = useState(0)
  const [photos, setPhotos] = useState<string[]>([])

  // Booking form state
  const [checkIn, setCheckIn]   = useState('')
  const [checkOut, setCheckOut] = useState('')
  const [guests, setGuests]     = useState(1)
  const [requests, setRequests] = useState('')
  const [booking, setBooking]   = useState(false)
  const [bookingError, setBookingError]     = useState('')
  const [bookingSuccess, setBookingSuccess] = useState(false)

  useEffect(() => {
    if (!id) return
    propertyService.getById(id)
      .then(data => {
        setProperty(data)
        // Use uploaded images if available, otherwise use curated photos
        const uploadedUrls = data.images?.map((img: any) => img.url) || []
        const curatedPhotos = getPropertyPhotos(data.type, data.id)
        setPhotos(uploadedUrls.length >= 2 ? uploadedUrls : curatedPhotos)
      })
      .catch(() => navigate('/properties'))
      .finally(() => setLoading(false))
  }, [id, navigate])

  // Calculate nights and total price live
  const nights = checkIn && checkOut
    ? Math.ceil((new Date(checkOut).getTime() - new Date(checkIn).getTime())
        / (1000 * 60 * 60 * 24))
    : 0

  const totalPrice = nights > 0 && property
    ? nights * Number(property.pricePerNight)
    : 0

  // Min date for check-in is today
  const today = new Date().toISOString().split('T')[0]
  // Min date for check-out is day after check-in
  const minCheckOut = checkIn
    ? new Date(new Date(checkIn).getTime() + 86400000).toISOString().split('T')[0]
    : today

  const handleBook = async () => {
    if (!user) { navigate('/login'); return }
    if (!checkIn || !checkOut) {
      setBookingError('Please select check-in and check-out dates')
      return
    }
    if (nights <= 0) {
      setBookingError('Check-out must be after check-in')
      return
    }

    setBooking(true)
    setBookingError('')

    try {
      await bookingService.create({
        propertyId: id!,
        checkIn,
        checkOut,
        guestCount: guests,
        specialRequests: requests,
      })
      setBookingSuccess(true)
    } catch (err: any) {
      setBookingError(err.response?.data?.message || 'Booking failed. Please try again.')
    } finally {
      setBooking(false)
    }
  }

  if (loading) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-[#1A56DB] border-t-transparent
                        rounded-full animate-spin mx-auto mb-4"/>
        <p className="text-gray-500 text-sm">Loading property...</p>
      </div>
    </div>
  )

  if (!property) return null

  return (
    <div className="min-h-screen bg-white">

      {/* ── PHOTO GALLERY ── */}
      <div className="bg-[#0A1F5C]">
        <div className="max-w-7xl mx-auto px-6 py-4">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-xs text-white/50 mb-4">
            <button onClick={() => navigate('/')}
              className="hover:text-white transition-colors">Home</button>
            <span>›</span>
            <button onClick={() => navigate('/properties')}
              className="hover:text-white transition-colors">Properties</button>
            <span>›</span>
            <span className="text-white/80 line-clamp-1">{property.title}</span>
          </div>
        </div>

        {/* Main photo */}
        <div className="max-w-7xl mx-auto px-6 pb-0">
          <div className="grid grid-cols-4 grid-rows-2 gap-2 h-[480px] rounded-t-2xl overflow-hidden">
            {/* Large main photo */}
            <div className="col-span-2 row-span-2 relative overflow-hidden cursor-pointer"
              onClick={() => setActivePhoto(0)}>
              <img src={photos[0]} alt={property.title}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"/>
            </div>
            {/* Smaller photos */}
            {photos.slice(1, 5).map((photo, i) => (
              <div key={i}
                className="relative overflow-hidden cursor-pointer"
                onClick={() => setActivePhoto(i + 1)}>
                <img src={photo} alt={`${property.title} ${i + 2}`}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"/>
                {/* Show count overlay on last photo */}
                {i === 3 && photos.length > 5 && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <span className="text-white font-bold text-lg">+{photos.length - 5}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── MAIN CONTENT ── */}
      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

          {/* ── LEFT: Property details ── */}
          <div className="lg:col-span-2">

            {/* Title section */}
            <div className="mb-8 pb-8 border-b border-gray-100">
              <div className="flex items-start justify-between gap-4 mb-3">
                <div>
                  <span className="inline-block bg-[#EBF2FF] text-[#1A56DB] text-xs
                                   font-bold uppercase tracking-wider px-3 py-1
                                   rounded-full mb-3">
                    {property.type.charAt(0) + property.type.slice(1).toLowerCase()}
                  </span>
                  <h1 className="font-display text-3xl md:text-4xl font-bold
                                 text-[#0A1F5C] leading-tight">
                    {property.title}
                  </h1>
                </div>
                {property.avgRating && (
                  <div className="flex-shrink-0 bg-[#0A1F5C] text-white
                                  rounded-2xl px-4 py-3 text-center">
                    <p className="text-2xl font-bold font-display">
                      {Number(property.avgRating).toFixed(1)}
                    </p>
                    <div className="flex text-yellow-400 text-sm justify-center">
                      {[...Array(5)].map((_, i) => (
                        <span key={i}>
                          {i < Math.round(property.avgRating!) ? '★' : '☆'}
                        </span>
                      ))}
                    </div>
                    <p className="text-white/60 text-[10px] mt-0.5">
                      {property._count?.reviews} review{property._count?.reviews !== 1 ? 's' : ''}
                    </p>
                  </div>
                )}
              </div>

              <p className="text-[#1A56DB] font-medium flex items-center gap-1.5 mb-4">
                <span>📍</span>
                {property.address}, {property.town}, {property.county}
              </p>

              {/* Quick stats */}
              <div className="flex flex-wrap gap-4">
                {[
                  { icon: '🛏', label: `${property.bedrooms} Bedroom${property.bedrooms !== 1 ? 's' : ''}` },
                  { icon: '🚿', label: `${property.bathrooms} Bathroom${property.bathrooms !== 1 ? 's' : ''}` },
                  { icon: '👥', label: `Up to ${property.maxGuests} guests` },
                ].map(item => (
                  <div key={item.label}
                    className="flex items-center gap-2 bg-[#F5F8FF] px-4 py-2
                               rounded-xl text-sm font-medium text-[#0A1F5C]">
                    <span>{item.icon}</span>
                    {item.label}
                  </div>
                ))}
              </div>
            </div>

            {/* Host info */}
            {property.host && (
              <div className="mb-8 pb-8 border-b border-gray-100">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-[#0A1F5C] flex items-center
                                  justify-center text-white font-bold font-display text-lg
                                  flex-shrink-0">
                    {property.host.name?.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 uppercase tracking-wider mb-0.5">
                      Hosted by
                    </p>
                    <p className="font-display font-bold text-[#0A1F5C] text-lg">
                      {property.host.name}
                    </p>
                    <p className="text-xs text-gray-400">
                      Zionstone Verified Host
                    </p>
                  </div>
                  <div className="ml-auto">
                    <div className="bg-green-50 text-green-700 border border-green-200
                                    text-xs font-bold px-3 py-1.5 rounded-full flex
                                    items-center gap-1.5">
                      <span className="w-2 h-2 bg-green-500 rounded-full"/>
                      Verified
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Description */}
            <div className="mb-8 pb-8 border-b border-gray-100">
              <h2 className="font-display font-bold text-[#0A1F5C] text-xl mb-4">
                About this property
              </h2>
              <p className="text-gray-600 leading-relaxed text-base">
                {property.description}
              </p>
            </div>

            {/* Amenities */}
            {property.amenities?.length > 0 && (
              <div className="mb-8 pb-8 border-b border-gray-100">
                <h2 className="font-display font-bold text-[#0A1F5C] text-xl mb-5">
                  What this place offers
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {property.amenities.map(amenity => (
                    <div key={amenity}
                      className="flex items-center gap-3 p-3 rounded-xl border
                                 border-gray-100 bg-gray-50">
                      <span className="text-xl">
                        {AMENITY_ICONS[amenity] || '✓'}
                      </span>
                      <span className="text-sm font-medium text-gray-700">
                        {amenity}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Reviews */}
            {property.reviews?.length > 0 && (
              <div>
                <h2 className="font-display font-bold text-[#0A1F5C] text-xl mb-6">
                  Guest Reviews
                  {property.avgRating && (
                    <span className="ml-3 text-base font-normal text-gray-400">
                      ★ {Number(property.avgRating).toFixed(1)} ·{' '}
                      {property._count?.reviews} review{property._count?.reviews !== 1 ? 's' : ''}
                    </span>
                  )}
                </h2>
                <div className="space-y-5">
                  {property.reviews.map((review: any) => (
                    <div key={review.id}
                      className="bg-[#F5F8FF] rounded-2xl p-5 border border-[#EBF2FF]">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-[#0A1F5C] flex items-center
                                          justify-center text-white font-bold text-sm">
                            {review.guest?.name?.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-semibold text-[#0A1F5C] text-sm">
                              {review.guest?.name}
                            </p>
                            <p className="text-gray-400 text-xs">
                              {new Date(review.createdAt).toLocaleDateString('en-KE', {
                                month: 'long', year: 'numeric'
                              })}
                            </p>
                          </div>
                        </div>
                        <div className="flex text-yellow-400 text-sm">
                          {[...Array(5)].map((_, i) => (
                            <span key={i}>{i < review.rating ? '★' : '☆'}</span>
                          ))}
                        </div>
                      </div>
                      <p className="text-gray-600 text-sm leading-relaxed">
                        {review.comment}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* ── RIGHT: Booking widget ── */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">

              {/* Price header */}
              <div className="bg-white rounded-2xl border-2 border-[#EBF2FF]
                              shadow-lg overflow-hidden">
                <div className="bg-[#0A1F5C] p-5">
                  <div className="flex items-end gap-2">
                    <span className="text-3xl font-bold font-display text-white">
                      KES {Number(property.pricePerNight).toLocaleString()}
                    </span>
                    <span className="text-white/60 text-sm mb-1">/ night</span>
                  </div>
                  {property.avgRating && (
                    <p className="text-white/60 text-xs mt-1">
                      ★ {Number(property.avgRating).toFixed(1)} ·{' '}
                      {property._count?.reviews} reviews
                    </p>
                  )}
                </div>

                {bookingSuccess ? (
                  /* ── SUCCESS STATE ── */
                  <div className="p-6 text-center">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center
                                    justify-center mx-auto mb-4 text-3xl">
                      🎉
                    </div>
                    <h3 className="font-display font-bold text-[#0A1F5C] text-xl mb-2">
                      Booking Requested!
                    </h3>
                    <p className="text-gray-500 text-sm mb-5 leading-relaxed">
                      Your booking request has been sent to the host.
                      You'll be notified once confirmed.
                    </p>
                    <button
                      onClick={() => navigate('/dashboard')}
                      className="w-full bg-[#1A56DB] text-white py-3 rounded-xl
                                 font-semibold text-sm hover:bg-[#0A1F5C] transition-colors">
                      View in Dashboard →
                    </button>
                  </div>
                ) : (
                  /* ── BOOKING FORM ── */
                  <div className="p-5">

                    {/* Date pickers */}
                    <div className="grid grid-cols-2 gap-2 mb-3">
                      <div className="border border-gray-200 rounded-xl p-3
                                      focus-within:border-[#1A56DB] transition-colors">
                        <p className="text-[10px] font-bold uppercase tracking-wider
                                      text-[#1A56DB] mb-1">Check In</p>
                        <input
                          type="date"
                          min={today}
                          value={checkIn}
                          onChange={e => {
                            setCheckIn(e.target.value)
                            if (checkOut && e.target.value >= checkOut) setCheckOut('')
                          }}
                          className="w-full text-sm text-[#0A1F5C] font-medium
                                     bg-transparent outline-none"
                        />
                      </div>
                      <div className="border border-gray-200 rounded-xl p-3
                                      focus-within:border-[#1A56DB] transition-colors">
                        <p className="text-[10px] font-bold uppercase tracking-wider
                                      text-[#1A56DB] mb-1">Check Out</p>
                        <input
                          type="date"
                          min={minCheckOut}
                          value={checkOut}
                          onChange={e => setCheckOut(e.target.value)}
                          className="w-full text-sm text-[#0A1F5C] font-medium
                                     bg-transparent outline-none"
                        />
                      </div>
                    </div>

                    {/* Guests */}
                    <div className="border border-gray-200 rounded-xl p-3 mb-3
                                    focus-within:border-[#1A56DB] transition-colors">
                      <p className="text-[10px] font-bold uppercase tracking-wider
                                    text-[#1A56DB] mb-1">Guests</p>
                      <div className="flex items-center justify-between">
                        <button
                          onClick={() => setGuests(g => Math.max(1, g - 1))}
                          className="w-7 h-7 rounded-full border border-gray-200
                                     flex items-center justify-center text-gray-600
                                     hover:border-[#1A56DB] hover:text-[#1A56DB]
                                     transition-colors font-bold">
                          −
                        </button>
                        <span className="font-semibold text-[#0A1F5C]">
                          {guests} guest{guests !== 1 ? 's' : ''}
                        </span>
                        <button
                          onClick={() => setGuests(g => Math.min(property.maxGuests, g + 1))}
                          className="w-7 h-7 rounded-full border border-gray-200
                                     flex items-center justify-center text-gray-600
                                     hover:border-[#1A56DB] hover:text-[#1A56DB]
                                     transition-colors font-bold">
                          +
                        </button>
                      </div>
                      <p className="text-[10px] text-gray-400 mt-1">
                        Max {property.maxGuests} guests
                      </p>
                    </div>

                    {/* Special requests */}
                    <div className="mb-4">
                      <textarea
                        value={requests}
                        onChange={e => setRequests(e.target.value)}
                        placeholder="Special requests (optional)..."
                        rows={2}
                        className="w-full px-3 py-2.5 border border-gray-200 rounded-xl
                                   text-sm text-gray-700 placeholder:text-gray-400
                                   focus:outline-none focus:border-[#1A56DB]
                                   resize-none transition-colors"
                      />
                    </div>

                    {/* Price breakdown */}
                    {nights > 0 && (
                      <div className="bg-[#F5F8FF] rounded-xl p-4 mb-4 space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">
                            KES {Number(property.pricePerNight).toLocaleString()} × {nights} night{nights !== 1 ? 's' : ''}
                          </span>
                          <span className="font-medium text-[#0A1F5C]">
                            KES {(Number(property.pricePerNight) * nights).toLocaleString()}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Service fee</span>
                          <span className="font-medium text-[#0A1F5C]">KES 0</span>
                        </div>
                        <div className="border-t border-[#EBF2FF] pt-2 flex justify-between">
                          <span className="font-bold text-[#0A1F5C]">Total</span>
                          <span className="font-bold text-[#0A1F5C] text-lg font-display">
                            KES {totalPrice.toLocaleString()}
                          </span>
                        </div>
                      </div>
                    )}

                    {/* Error */}
                    {bookingError && (
                      <div className="bg-red-50 border border-red-200 text-red-700
                                      rounded-xl px-4 py-3 mb-4 text-sm">
                        {bookingError}
                      </div>
                    )}

                    {/* Book button */}
                    <button
                      onClick={handleBook}
                      disabled={booking}
                      className="w-full bg-[#1A56DB] text-white py-4 rounded-xl
                                 font-bold text-base hover:bg-[#0A1F5C] transition-colors
                                 disabled:opacity-60 disabled:cursor-not-allowed shadow-md
                                 hover:shadow-lg"
                    >
                      {booking ? (
                        <span className="flex items-center justify-center gap-2">
                          <span className="w-4 h-4 border-2 border-white border-t-transparent
                                           rounded-full animate-spin"/>
                          Processing...
                        </span>
                      ) : user ? (
                        nights > 0
                          ? `Reserve for KES ${totalPrice.toLocaleString()}`
                          : 'Select dates to book'
                      ) : (
                        'Sign in to Book'
                      )}
                    </button>

                    {user && (
                      <p className="text-center text-xs text-gray-400 mt-3">
                        You won't be charged yet · Free cancellation
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* Contact host */}
              <div className="mt-4 bg-[#F5F8FF] rounded-2xl p-4 border border-[#EBF2FF]
                              text-center">
                <p className="text-xs text-gray-500 mb-2">Questions about this property?</p>
                <a href="tel:0748939050"
                  className="text-[#1A56DB] font-semibold text-sm hover:underline
                             flex items-center justify-center gap-1.5">
                  📞 0748 939 050
                </a>
                <p className="text-[10px] text-gray-400 mt-1">
                  Zionstone Holdings Ltd
                </p>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  )
}