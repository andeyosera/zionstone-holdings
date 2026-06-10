import { useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuthStore } from '../stores/auth.store'
import { propertyService, Property } from '../services/property.service'
import { getPropertyPhoto } from '../utils/photos'
import api from '../services/api'

interface Booking {
  id: string
  checkIn: string
  checkOut: string
  totalPrice: number
  guestCount: number
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED' | 'REJECTED'
  property: {
    id: string
    title: string
    town: string
    type: string
    images: { url: string; isCover: boolean }[]
  }
  review?: { id: string; rating: number }
}

const STATUS_STYLES: Record<string, string> = {
  PENDING:   'bg-yellow-50 text-yellow-700 border-yellow-200',
  CONFIRMED: 'bg-green-50 text-green-700 border-green-200',
  CANCELLED: 'bg-red-50 text-red-700 border-red-200',
  COMPLETED: 'bg-blue-50 text-blue-700 border-blue-200',
  REJECTED:  'bg-gray-50 text-gray-600 border-gray-200',
}

export default function DashboardPage() {
  const { user } = useAuthStore()
  const navigate = useNavigate()
  const [bookings, setBookings] = useState<Booking[]>([])
  const [myProperties, setMyProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState(true)
  const isHost = user?.role === 'HOST' || user?.role === 'ADMIN'

  useEffect(() => {
    if (!user) { navigate('/login'); return }

    const loadData = async () => {
      try {
        if (isHost) {
          const [bookingsRes, propsRes] = await Promise.all([
            api.get('/bookings/host'),
            propertyService.getMyProperties(),
          ])
          setBookings(bookingsRes.data.data || [])
          setMyProperties(propsRes)
        } else {
          const bookingsRes = await api.get('/bookings/my')
          setBookings(bookingsRes.data.data || [])
        }
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [user, isHost, navigate])

  if (!user) return null

  const stats = {
    total:     bookings.length,
    confirmed: bookings.filter(b => b.status === 'CONFIRMED').length,
    completed: bookings.filter(b => b.status === 'COMPLETED').length,
    revenue:   bookings
      .filter(b => ['CONFIRMED', 'COMPLETED'].includes(b.status))
      .reduce((sum, b) => sum + Number(b.totalPrice), 0),
  }

  return (
    <div className="min-h-screen bg-gray-50">

      {/* ── HEADER ── */}
      <div className="bg-[#0A1F5C] px-6 py-10">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <p className="text-[#3B82F6] text-xs font-semibold tracking-widest uppercase mb-1">
              {isHost ? 'Host Dashboard' : 'My Dashboard'}
            </p>
            <h1 className="font-display text-3xl font-bold text-white">
              Welcome back, {user.name.split(' ')[0]} 👋
            </h1>
            <p className="text-white/50 text-sm mt-1">
              {user.email} · {user.role}
            </p>
          </div>
          {isHost && (
            <button
              onClick={() => navigate('/properties/new')}
              className="bg-[#1A56DB] text-white px-6 py-3 rounded-xl
                         font-semibold text-sm hover:bg-white hover:text-[#0A1F5C]
                         transition-all shadow-md">
              + List New Property
            </button>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">

        {/* ── STATS CARDS ── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total Bookings',  value: stats.total,     icon: '📅', color: 'bg-blue-50 text-blue-700' },
            { label: 'Confirmed',       value: stats.confirmed, icon: '✅', color: 'bg-green-50 text-green-700' },
            { label: 'Completed Stays', value: stats.completed, icon: '🏁', color: 'bg-purple-50 text-purple-700' },
            {
              label: isHost ? 'Total Revenue' : 'Total Spent',
              value: `KES ${stats.revenue.toLocaleString()}`,
              icon: '💰',
              color: 'bg-amber-50 text-amber-700'
            },
          ].map(stat => (
            <div key={stat.label}
              className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
              <div className={`inline-flex items-center justify-center w-10 h-10
                               rounded-xl text-lg mb-3 ${stat.color}`}>
                {stat.icon}
              </div>
              <p className="font-display font-bold text-[#0A1F5C] text-xl">
                {stat.value}
              </p>
              <p className="text-gray-400 text-xs mt-0.5">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* ── HOST: MY PROPERTIES ── */}
        {isHost && (
          <div className="mb-10">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-display font-bold text-[#0A1F5C] text-xl">
                My Properties
              </h2>
              <Link to="/properties"
                className="text-[#1A56DB] text-sm font-medium hover:underline">
                View all →
              </Link>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="h-48 bg-gray-100 rounded-2xl animate-pulse"/>
                ))}
              </div>
            ) : myProperties.length === 0 ? (
              <div className="bg-white rounded-2xl border border-dashed border-gray-200
                              p-10 text-center">
                <p className="text-4xl mb-3">🏠</p>
                <p className="font-display font-bold text-[#0A1F5C] mb-2">
                  No properties listed yet
                </p>
                <p className="text-gray-400 text-sm mb-5">
                  Start earning by listing your first property
                </p>
                <button
                  onClick={() => navigate('/properties/new')}
                  className="bg-[#1A56DB] text-white px-6 py-2.5 rounded-xl
                             text-sm font-semibold hover:bg-[#0A1F5C] transition-colors">
                  List a Property
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {myProperties.map(p => {
                  const photo = p.images?.find(i => i.isCover)?.url
                    || getPropertyPhoto(p.type, p.id)
                  return (
                    <div key={p.id}
                      className="bg-white rounded-2xl border border-gray-100
                                 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                      <div className="relative h-36 overflow-hidden">
                        <img src={photo} alt={p.title}
                          className="w-full h-full object-cover"/>
                        <span className={`absolute top-2 right-2 text-[10px] font-bold
                                          uppercase px-2 py-1 rounded-full border ${
                          p.isPublished
                            ? 'bg-green-50 text-green-700 border-green-200'
                            : 'bg-gray-50 text-gray-500 border-gray-200'
                        }`}>
                          {p.isPublished ? 'Published' : 'Draft'}
                        </span>
                      </div>
                      <div className="p-4">
                        <p className="font-display font-semibold text-[#0A1F5C]
                                      text-sm line-clamp-1 mb-1">{p.title}</p>
                        <p className="text-xs text-gray-400 mb-2">
                          📍 {p.town} · KES {Number(p.pricePerNight).toLocaleString()}/night
                        </p>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-400">
                            {p._count?.bookings || 0} booking{p._count?.bookings !== 1 ? 's' : ''}
                          </span>
                          <button
                            onClick={() => navigate(`/properties/${p.id}`)}
                            className="text-xs text-[#1A56DB] font-medium hover:underline">
                            View →
                          </button>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )}

        {/* ── BOOKINGS ── */}
        <div>
          <h2 className="font-display font-bold text-[#0A1F5C] text-xl mb-5">
            {isHost ? 'Incoming Bookings' : 'My Bookings'}
          </h2>

          {loading ? (
            <div className="space-y-3">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-24 bg-gray-100 rounded-2xl animate-pulse"/>
              ))}
            </div>
          ) : bookings.length === 0 ? (
            <div className="bg-white rounded-2xl border border-gray-100 p-10 text-center">
              <p className="text-4xl mb-3">📅</p>
              <p className="font-display font-bold text-[#0A1F5C] mb-2">
                No bookings yet
              </p>
              <p className="text-gray-400 text-sm mb-5">
                {isHost ? 'Bookings will appear here when guests book your properties'
                        : 'Start exploring properties and make your first booking'}
              </p>
              {!isHost && (
                <button onClick={() => navigate('/properties')}
                  className="bg-[#1A56DB] text-white px-6 py-2.5 rounded-xl
                             text-sm font-semibold hover:bg-[#0A1F5C] transition-colors">
                  Browse Properties
                </button>
              )}
            </div>
          ) : (
            <div className="space-y-3">
              {bookings.map(booking => {
                const photo = booking.property.images?.find(i => i.isCover)?.url
                  || getPropertyPhoto(booking.property.type, booking.property.id)
                const nights = Math.ceil(
                  (new Date(booking.checkOut).getTime() - new Date(booking.checkIn).getTime())
                  / (1000 * 60 * 60 * 24)
                )
                return (
                  <div key={booking.id}
                    className="bg-white rounded-2xl border border-gray-100
                               shadow-sm p-4 flex items-center gap-4
                               hover:shadow-md transition-shadow">
                    <img src={photo} alt={booking.property.title}
                      className="w-20 h-16 object-cover rounded-xl flex-shrink-0"
                      onError={e => {
                        (e.target as HTMLImageElement).src =
                          'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=200&q=80'
                      }}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-display font-semibold text-[#0A1F5C]
                                    text-sm line-clamp-1">
                        {booking.property.title}
                      </p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        📍 {booking.property.town} · {nights} night{nights !== 1 ? 's' : ''} ·{' '}
                        {booking.guestCount} guest{booking.guestCount !== 1 ? 's' : ''}
                      </p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        📅 {new Date(booking.checkIn).toLocaleDateString('en-KE')} →{' '}
                        {new Date(booking.checkOut).toLocaleDateString('en-KE')}
                      </p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="font-bold text-[#0A1F5C] font-display">
                        KES {Number(booking.totalPrice).toLocaleString()}
                      </p>
                      <span className={`inline-block text-[10px] font-bold uppercase
                                        px-2.5 py-1 rounded-full border mt-1.5
                                        ${STATUS_STYLES[booking.status]}`}>
                        {booking.status}
                      </span>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}