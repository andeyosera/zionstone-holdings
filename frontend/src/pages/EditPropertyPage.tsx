import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useAuthStore } from '../stores/auth.store'
import { propertyService } from '../services/property.service'

const ALL_AMENITIES = [
  'WiFi', 'Parking', 'Kitchen', 'Hot shower', 'Security',
  'Garden', 'Fireplace', 'BBQ', 'Pool', 'Gym', 'TV', 'AC',
  'Washing machine', 'Balcony', 'Pet friendly',
]

const AMENITY_ICONS: Record<string, string> = {
  'WiFi': '📶', 'Parking': '🚗', 'Kitchen': '🍳', 'Hot shower': '🚿',
  'Security': '🔒', 'Garden': '🌿', 'Fireplace': '🔥', 'BBQ': '🍖',
  'Pool': '🏊', 'Gym': '💪', 'TV': '📺', 'AC': '❄️',
  'Washing machine': '🫧', 'Balcony': '🏙', 'Pet friendly': '🐾',
}

export default function EditPropertyPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { user } = useAuthStore()

  const [form, setForm] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    if (!id) return
    propertyService.getById(id)
      .then(p => {
        // Verify this host owns this property
        if (p.host?.id !== user?.id && user?.role !== 'ADMIN') {
          navigate('/dashboard')
          return
        }
        setForm({
          title:         p.title,
          description:   p.description,
          type:          p.type,
          county:        p.county,
          town:          p.town,
          address:       p.address,
          pricePerNight: String(p.pricePerNight),
          maxGuests:     String(p.maxGuests),
          bedrooms:      String(p.bedrooms),
          bathrooms:     String(p.bathrooms),
          amenities:     p.amenities || [],
          isPublished:   p.isPublished,
        })
      })
      .catch(() => navigate('/dashboard'))
      .finally(() => setLoading(false))
  }, [id, user, navigate])

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-10 h-10 border-4 border-[#1A56DB] border-t-transparent
                      rounded-full animate-spin"/>
    </div>
  )

  if (!form) return null

  const update = (key: string, value: any) =>
    setForm((f: any) => ({ ...f, [key]: value }))

  const toggleAmenity = (amenity: string) => {
    setForm((f: any) => ({
      ...f,
      amenities: f.amenities.includes(amenity)
        ? f.amenities.filter((a: string) => a !== amenity)
        : [...f.amenities, amenity],
    }))
  }

  const handleSave = async () => {
    setSaving(true)
    setError('')
    try {
      await propertyService.update(id!, {
        ...form,
        pricePerNight: Number(form.pricePerNight),
        maxGuests:     Number(form.maxGuests),
        bedrooms:      Number(form.bedrooms),
        bathrooms:     Number(form.bathrooms),
      })
      setSuccess(true)
      setTimeout(() => navigate('/dashboard'), 1500)
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to save changes')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">

      <div className="bg-[#0A1F5C] px-6 py-8">
        <div className="max-w-3xl mx-auto">
          <button onClick={() => navigate('/dashboard')}
            className="text-white/60 hover:text-white text-sm mb-4
                       flex items-center gap-2 transition-colors">
            ← Back to Dashboard
          </button>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-display text-3xl font-bold text-white">
                Edit Property
              </h1>
              <p className="text-white/60 mt-1 text-sm line-clamp-1">
                {form.title}
              </p>
            </div>
            {/* Published toggle */}
            <button
              onClick={() => update('isPublished', !form.isPublished)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl
                          text-sm font-semibold transition-all border-2 ${
                form.isPublished
                  ? 'bg-green-500 border-green-400 text-white'
                  : 'bg-white/10 border-white/20 text-white hover:bg-white/20'
              }`}>
              <span className={`w-2 h-2 rounded-full ${
                form.isPublished ? 'bg-white' : 'bg-white/50'
              }`}/>
              {form.isPublished ? 'Published' : 'Draft'}
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-10 space-y-6">

        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700
                          rounded-xl px-5 py-4 flex items-center gap-3">
            <span className="text-2xl">✅</span>
            <div>
              <p className="font-semibold">Changes saved!</p>
              <p className="text-sm opacity-80">Redirecting to dashboard...</p>
            </div>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700
                          rounded-xl px-5 py-4 text-sm">
            {error}
          </div>
        )}

        {/* Basic info */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h3 className="font-display font-bold text-[#0A1F5C] text-lg mb-5">
            Basic Information
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1.5">Title</label>
              <input value={form.title} onChange={e => update('title', e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm
                           focus:outline-none focus:border-[#1A56DB] focus:ring-2
                           focus:ring-[#1A56DB]/20 transition-all"/>
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1.5">Description</label>
              <textarea rows={4} value={form.description}
                onChange={e => update('description', e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm
                           focus:outline-none focus:border-[#1A56DB] focus:ring-2
                           focus:ring-[#1A56DB]/20 transition-all resize-none"/>
            </div>
          </div>
        </div>

        {/* Location */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h3 className="font-display font-bold text-[#0A1F5C] text-lg mb-5">Location</h3>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1.5">County</label>
              <input value={form.county} onChange={e => update('county', e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm
                           focus:outline-none focus:border-[#1A56DB] transition-all"/>
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1.5">Town</label>
              <input value={form.town} onChange={e => update('town', e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm
                           focus:outline-none focus:border-[#1A56DB] transition-all"/>
            </div>
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1.5">Address</label>
            <input value={form.address} onChange={e => update('address', e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm
                         focus:outline-none focus:border-[#1A56DB] transition-all"/>
          </div>
        </div>

        {/* Pricing & details */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h3 className="font-display font-bold text-[#0A1F5C] text-lg mb-5">
            Pricing & Details
          </h3>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1.5">
                Price per Night (KES)
              </label>
              <input type="number" value={form.pricePerNight}
                onChange={e => update('pricePerNight', e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm
                           focus:outline-none focus:border-[#1A56DB] transition-all"/>
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1.5">
                Max Guests
              </label>
              <input type="number" min="1" value={form.maxGuests}
                onChange={e => update('maxGuests', e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm
                           focus:outline-none focus:border-[#1A56DB] transition-all"/>
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1.5">Bedrooms</label>
              <input type="number" min="1" value={form.bedrooms}
                onChange={e => update('bedrooms', e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm
                           focus:outline-none focus:border-[#1A56DB] transition-all"/>
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1.5">Bathrooms</label>
              <input type="number" min="1" value={form.bathrooms}
                onChange={e => update('bathrooms', e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm
                           focus:outline-none focus:border-[#1A56DB] transition-all"/>
            </div>
          </div>
        </div>

        {/* Amenities */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h3 className="font-display font-bold text-[#0A1F5C] text-lg mb-5">
            Amenities
            <span className="ml-2 text-sm font-normal text-gray-400">
              ({form.amenities.length} selected)
            </span>
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {ALL_AMENITIES.map(amenity => (
              <button key={amenity} type="button"
                onClick={() => toggleAmenity(amenity)}
                className={`flex items-center gap-2.5 p-3 rounded-xl border-2
                            text-left transition-all ${
                  form.amenities.includes(amenity)
                    ? 'border-[#1A56DB] bg-[#EBF2FF]'
                    : 'border-gray-200 hover:border-gray-300'
                }`}>
                <span className="text-lg">{AMENITY_ICONS[amenity] || '✓'}</span>
                <span className={`text-xs font-medium ${
                  form.amenities.includes(amenity) ? 'text-[#1A56DB]' : 'text-gray-600'
                }`}>
                  {amenity}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Save button */}
        <button onClick={handleSave} disabled={saving}
          className="w-full bg-[#1A56DB] text-white py-4 rounded-xl font-bold
                     text-base hover:bg-[#0A1F5C] transition-colors shadow-md
                     disabled:opacity-60 flex items-center justify-center gap-2">
          {saving ? (
            <>
              <span className="w-5 h-5 border-2 border-white border-t-transparent
                               rounded-full animate-spin"/>
              Saving changes...
            </>
          ) : (
            '💾 Save Changes'
          )}
        </button>

      </div>
    </div>
  )
}