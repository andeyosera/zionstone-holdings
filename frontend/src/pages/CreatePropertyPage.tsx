import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../stores/auth.store'
import { propertyService } from '../services/property.service'

const STEPS = ['Basic Info', 'Location', 'Details', 'Amenities', 'Review']

const PROPERTY_TYPES = [
  { value: 'APARTMENT',  label: 'Apartment',  icon: '🏢' },
  { value: 'HOUSE',      label: 'House',       icon: '🏠' },
  { value: 'VILLA',      label: 'Villa',       icon: '🏰' },
  { value: 'COTTAGE',    label: 'Cottage',     icon: '🌿' },
  { value: 'STUDIO',     label: 'Studio',      icon: '🛋' },
  { value: 'GUESTHOUSE', label: 'Guesthouse',  icon: '🏨' },
]

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

interface FormData {
  title: string
  description: string
  type: string
  county: string
  town: string
  address: string
  pricePerNight: string
  maxGuests: string
  bedrooms: string
  bathrooms: string
  amenities: string[]
  isPublished: boolean
}

const INITIAL: FormData = {
  title: '', description: '', type: '',
  county: '', town: '', address: '',
  pricePerNight: '', maxGuests: '2',
  bedrooms: '1', bathrooms: '1',
  amenities: [], isPublished: false,
}

export default function CreatePropertyPage() {
  const { user } = useAuthStore()
  const navigate = useNavigate()
  const [step, setStep] = useState(0)
  const [form, setForm] = useState<FormData>(INITIAL)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Redirect non-hosts
  if (!user || (user.role !== 'HOST' && user.role !== 'ADMIN')) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-6">
        <div className="text-center max-w-md">
          <div className="text-6xl mb-4">🔒</div>
          <h2 className="font-display font-bold text-[#0A1F5C] text-2xl mb-3">
            Hosts Only
          </h2>
          <p className="text-gray-500 mb-6">
            You need a host account to list properties.
            Register as a host to get started.
          </p>
          <button onClick={() => navigate('/register')}
            className="bg-[#1A56DB] text-white px-6 py-3 rounded-xl
                       font-semibold hover:bg-[#0A1F5C] transition-colors">
            Register as Host
          </button>
        </div>
      </div>
    )
  }

  const update = (key: keyof FormData, value: any) =>
    setForm(f => ({ ...f, [key]: value }))

  const toggleAmenity = (amenity: string) => {
    setForm(f => ({
      ...f,
      amenities: f.amenities.includes(amenity)
        ? f.amenities.filter(a => a !== amenity)
        : [...f.amenities, amenity],
    }))
  }

  const canProceed = () => {
    switch (step) {
      case 0: return form.title.length >= 10 && form.description.length >= 30 && form.type
      case 1: return form.county && form.town && form.address
      case 2: return form.pricePerNight && Number(form.pricePerNight) > 0
      case 3: return true
      case 4: return true
      default: return false
    }
  }

  const handleSubmit = async (publish: boolean) => {
    setLoading(true)
    setError('')
    try {
      await propertyService.create({
        ...form,
        pricePerNight: Number(form.pricePerNight),
        maxGuests: Number(form.maxGuests),
        bedrooms: Number(form.bedrooms),
        bathrooms: Number(form.bathrooms),
        isPublished: publish,
      } as any)
      navigate('/dashboard')
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create property')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Header */}
      <div className="bg-[#0A1F5C] px-6 py-8">
        <div className="max-w-3xl mx-auto">
          <button onClick={() => navigate('/dashboard')}
            className="text-white/60 hover:text-white text-sm mb-4
                       flex items-center gap-2 transition-colors">
            ← Back to Dashboard
          </button>
          <h1 className="font-display text-3xl font-bold text-white">
            List Your Property
          </h1>
          <p className="text-white/60 mt-1 text-sm">
            Fill in the details below to list on Zionstone
          </p>
        </div>
      </div>

      {/* Progress steps */}
      <div className="bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-3xl mx-auto px-6 py-4">
          <div className="flex items-center gap-2">
            {STEPS.map((s, i) => (
              <div key={s} className="flex items-center gap-2 flex-1">
                <div className={`flex items-center gap-2 ${i <= step ? 'cursor-pointer' : ''}`}
                  onClick={() => i < step && setStep(i)}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center
                                   text-xs font-bold transition-all flex-shrink-0 ${
                    i < step  ? 'bg-green-500 text-white' :
                    i === step ? 'bg-[#1A56DB] text-white' :
                                 'bg-gray-100 text-gray-400'
                  }`}>
                    {i < step ? '✓' : i + 1}
                  </div>
                  <span className={`text-xs font-medium hidden sm:block ${
                    i === step ? 'text-[#1A56DB]' :
                    i < step   ? 'text-green-600' : 'text-gray-400'
                  }`}>
                    {s}
                  </span>
                </div>
                {i < STEPS.length - 1 && (
                  <div className={`flex-1 h-0.5 mx-2 rounded ${
                    i < step ? 'bg-green-400' : 'bg-gray-200'
                  }`}/>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Form body */}
      <div className="max-w-3xl mx-auto px-6 py-10">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">

          {/* ── STEP 0: Basic Info ── */}
          {step === 0 && (
            <div>
              <h2 className="font-display font-bold text-[#0A1F5C] text-2xl mb-1">
                Basic Information
              </h2>
              <p className="text-gray-400 text-sm mb-8">
                Tell guests what makes your property special
              </p>

              {/* Property type */}
              <div className="mb-6">
                <label className="block text-sm font-bold text-gray-700 mb-3">
                  Property Type *
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {PROPERTY_TYPES.map(t => (
                    <button key={t.value} type="button"
                      onClick={() => update('type', t.value)}
                      className={`p-4 rounded-xl border-2 text-center transition-all ${
                        form.type === t.value
                          ? 'border-[#1A56DB] bg-[#EBF2FF]'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}>
                      <span className="text-2xl block mb-1">{t.icon}</span>
                      <span className={`text-xs font-semibold ${
                        form.type === t.value ? 'text-[#1A56DB]' : 'text-gray-600'
                      }`}>{t.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Title */}
              <div className="mb-5">
                <label className="block text-sm font-bold text-gray-700 mb-1.5">
                  Property Title *
                  <span className="font-normal text-gray-400 ml-2">
                    ({form.title.length}/100)
                  </span>
                </label>
                <input
                  type="text"
                  maxLength={100}
                  value={form.title}
                  onChange={e => update('title', e.target.value)}
                  placeholder="e.g. Cozy Forest Cottage near Kakamega Reserve"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm
                             focus:outline-none focus:border-[#1A56DB] focus:ring-2
                             focus:ring-[#1A56DB]/20 transition-all"
                />
                {form.title.length > 0 && form.title.length < 10 && (
                  <p className="text-red-500 text-xs mt-1">
                    Title must be at least 10 characters
                  </p>
                )}
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1.5">
                  Description *
                  <span className="font-normal text-gray-400 ml-2">
                    ({form.description.length}/1000)
                  </span>
                </label>
                <textarea
                  rows={5}
                  maxLength={1000}
                  value={form.description}
                  onChange={e => update('description', e.target.value)}
                  placeholder="Describe what makes your property special — the views, the vibe, what's nearby, who it's perfect for..."
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm
                             focus:outline-none focus:border-[#1A56DB] focus:ring-2
                             focus:ring-[#1A56DB]/20 transition-all resize-none"
                />
                {form.description.length > 0 && form.description.length < 30 && (
                  <p className="text-red-500 text-xs mt-1">
                    Description must be at least 30 characters
                  </p>
                )}
              </div>
            </div>
          )}

          {/* ── STEP 1: Location ── */}
          {step === 1 && (
            <div>
              <h2 className="font-display font-bold text-[#0A1F5C] text-2xl mb-1">
                Location
              </h2>
              <p className="text-gray-400 text-sm mb-8">
                Where is your property located?
              </p>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1.5">
                    County *
                  </label>
                  <input
                    type="text"
                    value={form.county}
                    onChange={e => update('county', e.target.value)}
                    placeholder="e.g. Kakamega"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl
                               text-sm focus:outline-none focus:border-[#1A56DB]
                               focus:ring-2 focus:ring-[#1A56DB]/20 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1.5">
                    Town *
                  </label>
                  <input
                    type="text"
                    value={form.town}
                    onChange={e => update('town', e.target.value)}
                    placeholder="e.g. Kakamega Town"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl
                               text-sm focus:outline-none focus:border-[#1A56DB]
                               focus:ring-2 focus:ring-[#1A56DB]/20 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1.5">
                  Street Address *
                </label>
                <input
                  type="text"
                  value={form.address}
                  onChange={e => update('address', e.target.value)}
                  placeholder="e.g. Off Mumias Road, near Total Petrol Station"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl
                             text-sm focus:outline-none focus:border-[#1A56DB]
                             focus:ring-2 focus:ring-[#1A56DB]/20 transition-all"
                />
                <p className="text-gray-400 text-xs mt-1.5">
                  This will only be shared with confirmed guests
                </p>
              </div>

              {/* Info box */}
              <div className="mt-6 bg-[#F5F8FF] border border-[#EBF2FF]
                              rounded-xl p-4 flex gap-3">
                <span className="text-xl">📍</span>
                <div>
                  <p className="text-[#0A1F5C] font-semibold text-sm">
                    Location tip
                  </p>
                  <p className="text-gray-500 text-xs mt-0.5 leading-relaxed">
                    Be as specific as possible. Guests use the address to plan
                    their travel. You can also add nearby landmarks.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* ── STEP 2: Details & Pricing ── */}
          {step === 2 && (
            <div>
              <h2 className="font-display font-bold text-[#0A1F5C] text-2xl mb-1">
                Details & Pricing
              </h2>
              <p className="text-gray-400 text-sm mb-8">
                Set your capacity and nightly rate
              </p>

              {/* Price */}
              <div className="mb-6">
                <label className="block text-sm font-bold text-gray-700 mb-1.5">
                  Price per Night (KES) *
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2
                                   text-gray-400 font-medium text-sm">KES</span>
                  <input
                    type="number"
                    min="500"
                    value={form.pricePerNight}
                    onChange={e => update('pricePerNight', e.target.value)}
                    placeholder="e.g. 3500"
                    className="w-full pl-14 pr-4 py-3 border border-gray-200 rounded-xl
                               text-sm focus:outline-none focus:border-[#1A56DB]
                               focus:ring-2 focus:ring-[#1A56DB]/20 transition-all"
                  />
                </div>
                {form.pricePerNight && (
                  <p className="text-[#1A56DB] text-xs mt-1.5 font-medium">
                    ≈ KES {(Number(form.pricePerNight) * 30).toLocaleString()} / month
                    if fully booked
                  </p>
                )}
              </div>

              {/* Counters */}
              <div className="grid grid-cols-3 gap-4">
                {[
                  { key: 'maxGuests', label: 'Max Guests', min: 1, max: 20 },
                  { key: 'bedrooms',  label: 'Bedrooms',   min: 1, max: 10 },
                  { key: 'bathrooms', label: 'Bathrooms',  min: 1, max: 10 },
                ].map(field => (
                  <div key={field.key}
                    className="border border-gray-200 rounded-xl p-4 text-center">
                    <p className="text-xs font-bold text-gray-500 uppercase
                                  tracking-wide mb-3">
                      {field.label}
                    </p>
                    <div className="flex items-center justify-between">
                      <button type="button"
                        onClick={() => update(field.key as keyof FormData,
                          String(Math.max(field.min,
                            Number(form[field.key as keyof FormData]) - 1)))}
                        className="w-8 h-8 rounded-full border border-gray-200
                                   flex items-center justify-center font-bold
                                   text-gray-600 hover:border-[#1A56DB]
                                   hover:text-[#1A56DB] transition-colors">
                        −
                      </button>
                      <span className="font-display font-bold text-[#0A1F5C] text-xl">
                        {form[field.key as keyof FormData]}
                      </span>
                      <button type="button"
                        onClick={() => update(field.key as keyof FormData,
                          String(Math.min(field.max,
                            Number(form[field.key as keyof FormData]) + 1)))}
                        className="w-8 h-8 rounded-full border border-gray-200
                                   flex items-center justify-center font-bold
                                   text-gray-600 hover:border-[#1A56DB]
                                   hover:text-[#1A56DB] transition-colors">
                        +
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── STEP 3: Amenities ── */}
          {step === 3 && (
            <div>
              <h2 className="font-display font-bold text-[#0A1F5C] text-2xl mb-1">
                Amenities
              </h2>
              <p className="text-gray-400 text-sm mb-8">
                Select everything your property offers
                <span className="ml-2 bg-[#EBF2FF] text-[#1A56DB] text-xs
                                  font-bold px-2 py-0.5 rounded-full">
                  {form.amenities.length} selected
                </span>
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {ALL_AMENITIES.map(amenity => (
                  <button key={amenity} type="button"
                    onClick={() => toggleAmenity(amenity)}
                    className={`flex items-center gap-3 p-3.5 rounded-xl border-2
                                text-left transition-all ${
                      form.amenities.includes(amenity)
                        ? 'border-[#1A56DB] bg-[#EBF2FF]'
                        : 'border-gray-200 hover:border-gray-300 bg-white'
                    }`}>
                    <span className="text-xl">
                      {AMENITY_ICONS[amenity] || '✓'}
                    </span>
                    <span className={`text-sm font-medium ${
                      form.amenities.includes(amenity)
                        ? 'text-[#1A56DB]'
                        : 'text-gray-700'
                    }`}>
                      {amenity}
                    </span>
                    {form.amenities.includes(amenity) && (
                      <span className="ml-auto text-[#1A56DB] font-bold text-sm">✓</span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* ── STEP 4: Review & Submit ── */}
          {step === 4 && (
            <div>
              <h2 className="font-display font-bold text-[#0A1F5C] text-2xl mb-1">
                Review & Publish
              </h2>
              <p className="text-gray-400 text-sm mb-8">
                Everything look good? You can edit anytime after publishing.
              </p>

              {/* Summary card */}
              <div className="bg-[#F5F8FF] rounded-2xl border border-[#EBF2FF] p-6 mb-6">
                <div className="flex items-start gap-4 mb-5">
                  <div className="w-12 h-12 bg-[#0A1F5C] rounded-xl flex items-center
                                  justify-center text-2xl flex-shrink-0">
                    {PROPERTY_TYPES.find(t => t.value === form.type)?.icon || '🏠'}
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-[#0A1F5C] text-lg leading-snug">
                      {form.title}
                    </h3>
                    <p className="text-[#1A56DB] text-sm mt-0.5">
                      📍 {form.address}, {form.town}, {form.county}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-5">
                  {[
                    { label: 'Type',        value: form.type },
                    { label: 'Price',       value: `KES ${Number(form.pricePerNight).toLocaleString()}/night` },
                    { label: 'Bedrooms',    value: form.bedrooms },
                    { label: 'Bathrooms',   value: form.bathrooms },
                    { label: 'Max Guests',  value: form.maxGuests },
                    { label: 'Amenities',   value: `${form.amenities.length} selected` },
                  ].map(item => (
                    <div key={item.label}
                      className="bg-white rounded-xl p-3 border border-[#EBF2FF]">
                      <p className="text-[10px] text-gray-400 uppercase tracking-wider">
                        {item.label}
                      </p>
                      <p className="font-semibold text-[#0A1F5C] text-sm mt-0.5">
                        {item.value}
                      </p>
                    </div>
                  ))}
                </div>

                {form.amenities.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {form.amenities.map(a => (
                      <span key={a}
                        className="bg-white text-[#1A56DB] text-xs font-medium
                                   px-2.5 py-1 rounded-full border border-[#EBF2FF]">
                        {AMENITY_ICONS[a]} {a}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700
                                rounded-xl px-4 py-3 mb-5 text-sm">
                  {error}
                </div>
              )}

              {/* Publish options */}
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => handleSubmit(false)}
                  disabled={loading}
                  className="border-2 border-[#1A56DB] text-[#1A56DB] py-4 rounded-xl
                             font-semibold hover:bg-[#EBF2FF] transition-colors
                             disabled:opacity-60">
                  Save as Draft
                </button>
                <button
                  onClick={() => handleSubmit(true)}
                  disabled={loading}
                  className="bg-[#1A56DB] text-white py-4 rounded-xl font-semibold
                             hover:bg-[#0A1F5C] transition-colors shadow-md
                             disabled:opacity-60 flex items-center justify-center gap-2">
                  {loading ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white
                                       border-t-transparent rounded-full animate-spin"/>
                      Publishing...
                    </>
                  ) : (
                    '🚀 Publish Now'
                  )}
                </button>
              </div>
            </div>
          )}

          {/* Navigation buttons */}
          {step < 4 && (
            <div className="flex justify-between mt-8 pt-6 border-t border-gray-100">
              <button
                onClick={() => setStep(s => Math.max(0, s - 1))}
                disabled={step === 0}
                className="px-6 py-2.5 border border-gray-200 rounded-xl text-sm
                           font-medium text-gray-600 hover:border-gray-300
                           disabled:opacity-40 transition-colors">
                ← Back
              </button>
              <button
                onClick={() => setStep(s => s + 1)}
                disabled={!canProceed()}
                className="px-8 py-2.5 bg-[#1A56DB] text-white rounded-xl text-sm
                           font-semibold hover:bg-[#0A1F5C] transition-colors
                           disabled:opacity-40 disabled:cursor-not-allowed shadow-sm">
                Continue →
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  )
}