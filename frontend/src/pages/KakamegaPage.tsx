import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { propertyService, type Property } from '../services/property.service'
import PropertyCard from '../components/property/PropertyCard'
import { getKakamegaPhoto } from '../utils/photos'

const ATTRACTIONS = [
  { icon: '🌿', name: 'Kakamega Forest',     desc: 'The only tropical rainforest in Kenya — home to 350+ bird species and rare primates.' },
  { icon: '🦋', name: 'Butterfly Garden',    desc: 'Over 400 butterfly species in the Kakamega Forest Reserve area.' },
  { icon: '🏺', name: 'Crying Stone',        desc: 'A 40-metre natural rock formation — one of Kenya\'s most unique landmarks.' },
  { icon: '🎭', name: 'Luhya Cultural Sites', desc: 'Rich traditions, music and food of the Luhya people of Western Kenya.' },
  { icon: '🌊', name: 'Yala River',           desc: 'Scenic river great for nature walks and bird watching.' },
  { icon: '⛪', name: 'Friends Church',       desc: 'Historic church dating to the early 1900s — a cornerstone of the region.' },
]

const WHY_STAY = [
  { icon: '🌡', title: 'Great Weather',     desc: 'Mild temperatures year-round thanks to the forest ecosystem.' },
  { icon: '🚗', title: 'Easy Access',       desc: '360km from Nairobi via the Nakuru–Eldoret highway.' },
  { icon: '🍽', title: 'Local Cuisine',     desc: 'Fresh ugali, matoke, and tilapia from Lake Victoria nearby.' },
  { icon: '🏨', title: 'Quality Stays',     desc: 'Handpicked properties managed by Zionstone Holdings.' },
]

export default function KakamegaPage() {
  const [properties, setProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    propertyService.getAll({ county: 'Kakamega', limit: 6 })
      .then(data => setProperties(data.properties || []))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="min-h-screen bg-white">

      {/* ── HERO ── */}
      <section className="relative h-[70vh] overflow-hidden">
        <img
          src={getKakamegaPhoto(0)}
          alt="Kakamega Forest"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/60"/>

        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
          <span className="inline-block bg-white/15 backdrop-blur-sm border border-white/30
                           text-white text-xs font-semibold tracking-widest uppercase
                           px-4 py-2 rounded-full mb-6">
            🌿 Western Kenya
          </span>
          <h1 className="font-display text-5xl md:text-7xl font-bold text-white
                         leading-tight mb-4 drop-shadow-lg">
            Kakamega County
          </h1>
          <p className="text-white/80 text-lg md:text-xl max-w-xl leading-relaxed mb-8">
            Home to Kenya's only tropical rainforest — where nature, culture and hospitality meet.
          </p>
          <div className="flex gap-3 flex-wrap justify-center">
            <button
              onClick={() => navigate('/properties?county=Kakamega')}
              className="bg-[#1A56DB] text-white px-8 py-3.5 rounded-xl font-semibold
                         hover:bg-[#0A1F5C] transition-colors shadow-lg">
              View Kakamega Properties
            </button>
            <button
              onClick={() => {
                document.getElementById('attractions')?.scrollIntoView({behavior: 'smooth'})
              }}
              className="bg-white/20 backdrop-blur-sm text-white px-8 py-3.5 rounded-xl
                         font-semibold hover:bg-white/30 transition-colors border border-white/30">
              Explore the Area
            </button>
          </div>
        </div>

        {/* Quick stats */}
        <div className="absolute bottom-0 left-0 right-0">
          <div className="max-w-4xl mx-auto px-6 pb-8">
            <div className="grid grid-cols-3 gap-4">
              {[
                { n: '360km', l: 'From Nairobi' },
                { n: '238km²', l: 'Forest Reserve' },
                { n: '350+', l: 'Bird Species' },
              ].map(s => (
                <div key={s.l}
                  className="bg-white/15 backdrop-blur-md border border-white/20
                             rounded-xl p-4 text-center">
                  <p className="text-white font-bold font-display text-2xl">{s.n}</p>
                  <p className="text-white/70 text-xs mt-0.5">{s.l}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── WHY VISIT ── */}
      <section className="bg-[#F5F8FF] py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-[#1A56DB] text-xs font-bold tracking-widest uppercase mb-3">
              Why Kakamega
            </p>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-[#0A1F5C]">
              Why Stay in Kakamega?
            </h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {WHY_STAY.map(item => (
              <div key={item.title}
                className="bg-white rounded-2xl p-6 text-center shadow-sm
                           border border-gray-100 hover:shadow-md transition-shadow">
                <div className="text-4xl mb-3">{item.icon}</div>
                <h3 className="font-display font-bold text-[#0A1F5C] mb-2">{item.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PROPERTIES ── */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="text-[#1A56DB] text-xs font-bold tracking-widest uppercase mb-3">
              Available Now
            </p>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-[#0A1F5C]">
              Stay in Kakamega
            </h2>
          </div>
          <button
            onClick={() => navigate('/properties?county=Kakamega')}
            className="border-2 border-[#1A56DB] text-[#1A56DB] px-5 py-2.5
                       rounded-xl text-sm font-semibold hover:bg-[#EBF2FF] transition-colors">
            View All →
          </button>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-80 bg-gray-100 rounded-2xl animate-pulse"/>
            ))}
          </div>
        ) : properties.length === 0 ? (
          <div className="text-center py-16 bg-[#F5F8FF] rounded-2xl">
            <p className="text-4xl mb-3">🏠</p>
            <p className="font-display font-bold text-[#0A1F5C] text-xl mb-2">
              No properties yet in Kakamega
            </p>
            <p className="text-gray-500 text-sm">Be the first to list here!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {properties.map(p => <PropertyCard key={p.id} property={p}/>)}
          </div>
        )}
      </section>

      {/* ── ATTRACTIONS ── */}
      <section id="attractions" className="bg-[#0A1F5C] py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-[#3B82F6] text-xs font-bold tracking-widest uppercase mb-3">
              Things To Do
            </p>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-white">
              Explore Kakamega
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {ATTRACTIONS.map(a => (
              <div key={a.name}
                className="bg-white/10 backdrop-blur-sm border border-white/10
                           rounded-2xl p-6 hover:bg-white/15 transition-colors">
                <span className="text-3xl">{a.icon}</span>
                <h3 className="font-display font-bold text-white mt-3 mb-2">{a.name}</h3>
                <p className="text-white/60 text-sm leading-relaxed">{a.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="bg-white py-16 px-6 text-center">
        <h2 className="font-display text-3xl font-bold text-[#0A1F5C] mb-4">
          Ready to explore Kakamega?
        </h2>
        <p className="text-gray-500 mb-8 max-w-md mx-auto">
          Book a stay with Zionstone Holdings and experience the best of Western Kenya.
        </p>
        <button
          onClick={() => navigate('/properties?county=Kakamega')}
          className="bg-[#1A56DB] text-white px-10 py-4 rounded-xl font-bold
                     text-base hover:bg-[#0A1F5C] transition-colors shadow-md">
          Find Your Stay in Kakamega
        </button>
      </section>

    </div>
  )
}