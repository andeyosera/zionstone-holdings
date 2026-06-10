import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { propertyService,  type Property } from '../services/property.service'
import PropertyCard from '../components/property/PropertyCard'

const FEATURES = [
  { icon: '🏗', title: 'Property Development', desc: 'Quality spaces built to last.' },
  { icon: '🪨', title: 'Stone & Concrete Solutions', desc: 'Durable. Elegant. Timeless.' },
  { icon: '🔑', title: 'Airbnb Property Management', desc: 'We manage. You earn.' },
  { icon: '📈', title: 'Investments & Hospitality', desc: 'Smart investments. Great returns.' },
]

const STATS = [
  { number: '48+',  label: 'Properties Listed' },
  { number: '12',   label: 'Towns Covered' },
  { number: '4.8★', label: 'Average Rating' },
  { number: '300+', label: 'Happy Guests' },
]

export default function HomePage() {
  const [properties, setProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState({
    location: '', checkIn: '', checkOut: '', guests: ''
  })
  const navigate = useNavigate()

  useEffect(() => {
    propertyService.getAll({ limit: 6 })
      .then(data => setProperties(data.properties || []))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    const params = new URLSearchParams()
    if (search.location) params.set('county', search.location)
    if (search.guests)   params.set('maxGuests', search.guests)
    navigate(`/properties?${params}`)
  }

  return (
    <div className="min-h-screen bg-white">

      {/* ── HERO ── */}
      <section className="relative bg-gradient-to-br from-brand-navy via-brand-blue to-brand-sky overflow-hidden">

        {/* Background pattern */}
        <div className="absolute inset-0 opacity-10"
          style={{backgroundImage: 'radial-gradient(circle at 20% 50%, white 1px, transparent 1px), radial-gradient(circle at 80% 20%, white 1px, transparent 1px)',
                  backgroundSize: '60px 60px'}}/>

        {/* Diagonal shapes */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -translate-y-32 translate-x-32"/>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full translate-y-16 -translate-x-16"/>

        <div className="relative max-w-7xl mx-auto px-6 py-24 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">

          {/* Left */}
          <div>
            <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm
                            text-white text-xs font-medium tracking-wider uppercase
                            px-4 py-2 rounded-full mb-6 border border-white/20">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"/>
              Airbnb Partner · Kakamega County
            </div>

            <h1 className="font-display text-4xl lg:text-5xl xl:text-6xl font-bold
                           text-white leading-[1.1] mb-6">
              Building Spaces.<br/>
              <span className="text-brand-sky">Creating</span> Experiences.
            </h1>

            <p className="text-white/80 text-lg font-light leading-relaxed mb-8 max-w-lg">
              Hosting Memories. From solid construction to unforgettable stays — we build more than buildings, we build experiences.
            </p>

            <div className="flex flex-wrap gap-3">
              <button onClick={() => navigate('/properties')} className="btn-primary
                bg-white !text-brand-navy hover:!bg-brand-light font-semibold px-8 py-3.5">
                Browse Properties
              </button>
              <button onClick={() => navigate('/register')} className="btn-outline
                !border-white !text-white hover:!bg-white/10 px-8 py-3.5">
                Become a Host
              </button>
            </div>

            {/* Contact strip */}
            <div className="flex items-center gap-6 mt-10 pt-8 border-t border-white/20">
              <div>
                <p className="text-white/50 text-xs">Call us</p>
                <p className="text-white font-medium text-sm">0748 939 050</p>
              </div>
              <div className="w-px h-8 bg-white/20"/>
              <div>
                <p className="text-white/50 text-xs">Email</p>
                <p className="text-white font-medium text-sm">info@zionstoneholdings.com</p>
              </div>
            </div>
          </div>

          {/* Right — brand card */}
          <div className="hidden md:block">
            <div className="relative">
              {/* Main card */}
              <div className="bg-white rounded-2xl p-8 shadow-2xl">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-brand-navy rounded-xl flex items-center justify-center">
                    <span className="text-white font-bold font-display">Z</span>
                  </div>
                  <div>
                    <p className="font-display font-bold text-brand-navy text-sm">ZIONSTONE HOLDINGS</p>
                    <p className="text-zinc-400 text-xs">Your Property. Our Passion.</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-6">
                  {FEATURES.map(f => (
                    <div key={f.title} className="bg-brand-pale rounded-xl p-3">
                      <span className="text-2xl">{f.icon}</span>
                      <p className="text-brand-navy font-semibold text-xs mt-2 leading-snug">{f.title}</p>
                      <p className="text-zinc-400 text-xs mt-0.5">{f.desc}</p>
                    </div>
                  ))}
                </div>

                <div className="bg-brand-navy rounded-xl p-4 text-center">
                  <p className="text-white/70 text-xs mb-1">More Bookings. More Income.</p>
                  <p className="text-white font-display font-bold text-lg">We manage. You earn.</p>
                </div>
              </div>

              {/* Floating badge */}
              <div className="absolute -bottom-4 -left-4 bg-brand-blue text-white
                              rounded-xl px-4 py-3 shadow-lg">
                <p className="text-white/70 text-xs">Available Now</p>
                <p className="font-display font-bold text-lg">
                  {loading ? '...' : `${properties.length}+ Stays`}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── SEARCH BAR ── */}
      <div className="bg-white shadow-md border-b border-zinc-100">
        <div className="max-w-5xl mx-auto px-6 py-4">
          <form onSubmit={handleSearch}
            className="flex items-stretch bg-white border-2 border-brand-light
                       rounded-xl overflow-hidden shadow-sm hover:border-brand-sky
                       transition-colors duration-200">

            <div className="flex-1 px-5 py-3 border-r border-zinc-100">
              <p className="text-[10px] tracking-wider uppercase text-brand-blue font-semibold mb-1">
                Location
              </p>
              <input value={search.location}
                onChange={e => setSearch(s => ({...s, location: e.target.value}))}
                placeholder="Kakamega County"
                className="w-full text-sm text-zinc-800 bg-transparent outline-none placeholder:text-zinc-400"/>
            </div>

            <div className="px-5 py-3 border-r border-zinc-100">
              <p className="text-[10px] tracking-wider uppercase text-brand-blue font-semibold mb-1">
                Check In
              </p>
              <input type="date" value={search.checkIn}
                onChange={e => setSearch(s => ({...s, checkIn: e.target.value}))}
                className="text-sm text-zinc-800 bg-transparent outline-none"/>
            </div>

            <div className="px-5 py-3 border-r border-zinc-100">
              <p className="text-[10px] tracking-wider uppercase text-brand-blue font-semibold mb-1">
                Check Out
              </p>
              <input type="date" value={search.checkOut}
                onChange={e => setSearch(s => ({...s, checkOut: e.target.value}))}
                className="text-sm text-zinc-800 bg-transparent outline-none"/>
            </div>

            <div className="px-5 py-3 border-r border-zinc-100">
              <p className="text-[10px] tracking-wider uppercase text-brand-blue font-semibold mb-1">
                Guests
              </p>
              <input type="number" min="1" value={search.guests}
                onChange={e => setSearch(s => ({...s, guests: e.target.value}))}
                placeholder="2"
                className="w-16 text-sm text-zinc-800 bg-transparent outline-none placeholder:text-zinc-400"/>
            </div>

            <button type="submit"
              className="bg-brand-blue text-white px-8 text-sm font-semibold
                         hover:bg-brand-navy transition-colors">
              Search
            </button>
          </form>
        </div>
      </div>

      {/* ── FEATURES STRIP ── */}
      <section className="bg-brand-pale border-b border-brand-light py-10 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">
          {FEATURES.map(f => (
            <div key={f.title} className="flex items-start gap-4">
              <div className="w-10 h-10 bg-brand-blue rounded-xl flex items-center
                              justify-center text-lg flex-shrink-0 shadow-sm">
                {f.icon}
              </div>
              <div>
                <p className="font-display font-semibold text-brand-navy text-sm leading-snug">
                  {f.title}
                </p>
                <p className="text-zinc-500 text-xs mt-0.5">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── PROPERTIES ── */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="section-tag mb-3">Featured Listings</p>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-brand-navy">
              Available Properties
            </h2>
          </div>
          <button onClick={() => navigate('/properties')}
            className="btn-outline text-sm py-2.5 px-5">
            View All →
          </button>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-72 bg-brand-light rounded-xl animate-pulse"/>
            ))}
          </div>
        ) : properties.length === 0 ? (
          <div className="text-center py-24 bg-brand-pale rounded-2xl border border-brand-light">
            <div className="w-16 h-16 bg-brand-light rounded-2xl flex items-center
                            justify-center mx-auto mb-4 text-3xl">🏠</div>
            <p className="font-display text-xl font-semibold text-brand-navy mb-2">
              No properties yet
            </p>
            <p className="text-zinc-500 text-sm mb-6">Be the first to list on Zionstone</p>
            <button onClick={() => navigate('/register')} className="btn-primary">
              List Your Property
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {properties.map(property => (
              <PropertyCard key={property.id} property={property}/>
            ))}
          </div>
        )}
      </section>

      {/* ── STATS ── */}
      <section className="bg-brand-navy py-16 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
          {STATS.map(stat => (
            <div key={stat.label} className="text-center">
              <p className="font-display text-4xl md:text-5xl font-bold text-white mb-2">
                {stat.number}
              </p>
              <p className="text-brand-sky text-xs tracking-widest uppercase font-medium">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="bg-white py-20 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <p className="section-tag justify-center mb-4">For Property Owners</p>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-brand-navy mb-4">
            Your Property. Our Passion.
          </h2>
          <p className="text-zinc-500 leading-relaxed mb-8 max-w-lg mx-auto">
            From solid construction to unforgettable stays — join Zionstone and start earning from your property today.
          </p>
          <div className="flex justify-center gap-3 flex-wrap">
            <button onClick={() => navigate('/register')} className="btn-navy px-8 py-3.5">
              Start Hosting Today
            </button>
            <button onClick={() => navigate('/properties')} className="btn-outline px-8 py-3.5">
              Browse Properties
            </button>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="bg-brand-navy border-t border-white/10 py-10 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row
                        items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-brand-blue rounded-lg flex items-center justify-center">
              <span className="text-white font-bold font-display text-sm">Z</span>
            </div>
            <div>
              <p className="font-display font-bold text-white text-sm">ZIONSTONE HOLDINGS LTD</p>
              <p className="text-white/40 text-xs">Building Better. Hosting Smarter.</p>
            </div>
          </div>
          <div className="flex items-center gap-6 text-white/50 text-xs">
            <span>📞 0748 939 050 / 0786 965 598</span>
            <span>🌐 zionstoneholdings.com</span>
            <span>📍 Kakamega County, Kenya</span>
          </div>
        </div>
      </footer>

    </div>
  )
}