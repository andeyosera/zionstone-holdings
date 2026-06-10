import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { propertyService,type Property, type PropertyFilters } from '../services/property.service'
import PropertyCard from '../components/property/PropertyCard'

const PROPERTY_TYPES = ['APARTMENT', 'HOUSE', 'VILLA', 'COTTAGE', 'STUDIO', 'GUESTHOUSE']
const COUNTIES = ['Kakamega', 'Kisumu', 'Nairobi', 'Mombasa', 'Nakuru', 'Eldoret']

export default function PropertiesPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [properties, setProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState(true)
  const [total, setTotal] = useState(0)
  const [totalPages, setTotalPages] = useState(1)

  const [filters, setFilters] = useState<PropertyFilters>({
    county:    searchParams.get('county') || '',
    type:      searchParams.get('type') || '',
    minPrice:  searchParams.get('minPrice') ? Number(searchParams.get('minPrice')) : undefined,
    maxPrice:  searchParams.get('maxPrice') ? Number(searchParams.get('maxPrice')) : undefined,
    maxGuests: searchParams.get('maxGuests') ? Number(searchParams.get('maxGuests')) : undefined,
    page:      1,
    limit:     9,
  })

  useEffect(() => {
    setLoading(true)
    propertyService.getAll(filters)
      .then(data => {
        setProperties(data.properties || [])
        setTotal(data.pagination?.total || 0)
        setTotalPages(data.pagination?.totalPages || 1)
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [filters])

  const updateFilter = (key: keyof PropertyFilters, value: any) => {
    setFilters(f => ({ ...f, [key]: value, page: 1 }))
  }

  const clearFilters = () => {
    setFilters({ page: 1, limit: 9 })
    setSearchParams({})
  }

  const activeFilterCount = [
    filters.county, filters.type, filters.minPrice,
    filters.maxPrice, filters.maxGuests
  ].filter(Boolean).length

  return (
    <div className="min-h-screen bg-gray-50">

      {/* ── PAGE HEADER ── */}
      <div className="bg-[#0A1F5C] py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <p className="text-[#3B82F6] text-xs font-semibold tracking-widest
                        uppercase mb-2">
            Zionstone Holdings
          </p>
          <h1 className="font-display text-3xl md:text-4xl font-bold text-white mb-3">
            Available Properties
          </h1>
          <p className="text-white/60 text-sm">
            {loading ? 'Loading...' : `${total} properties across Kenya`}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex gap-8">

          {/* ── SIDEBAR FILTERS ── */}
          <aside className="hidden lg:block w-72 flex-shrink-0">
            <div className="bg-white rounded-2xl border border-gray-100
                            shadow-sm p-6 sticky top-24">

              <div className="flex items-center justify-between mb-6">
                <h3 className="font-display font-bold text-[#0A1F5C] text-lg">
                  Filters
                </h3>
                {activeFilterCount > 0 && (
                  <button onClick={clearFilters}
                    className="text-xs text-[#1A56DB] hover:underline font-medium">
                    Clear all ({activeFilterCount})
                  </button>
                )}
              </div>

              {/* County */}
              <div className="mb-6">
                <label className="block text-xs font-bold text-gray-500
                                  uppercase tracking-wider mb-3">
                  County
                </label>
                <div className="space-y-2">
                  {COUNTIES.map(county => (
                    <label key={county}
                      className="flex items-center gap-2.5 cursor-pointer group">
                      <input
                        type="radio"
                        name="county"
                        checked={filters.county === county}
                        onChange={() => updateFilter('county', county)}
                        className="accent-[#1A56DB]"
                      />
                      <span className="text-sm text-gray-700 group-hover:text-[#1A56DB]
                                       transition-colors">
                        {county}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Property type */}
              <div className="mb-6 pt-6 border-t border-gray-100">
                <label className="block text-xs font-bold text-gray-500
                                  uppercase tracking-wider mb-3">
                  Property Type
                </label>
                <div className="flex flex-wrap gap-2">
                  {PROPERTY_TYPES.map(type => (
                    <button
                      key={type}
                      onClick={() => updateFilter('type', filters.type === type ? '' : type)}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium
                                  transition-all border ${
                        filters.type === type
                          ? 'bg-[#1A56DB] text-white border-[#1A56DB]'
                          : 'bg-white text-gray-600 border-gray-200 hover:border-[#1A56DB]'
                      }`}
                    >
                      {type.charAt(0) + type.slice(1).toLowerCase()}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price range */}
              <div className="mb-6 pt-6 border-t border-gray-100">
                <label className="block text-xs font-bold text-gray-500
                                  uppercase tracking-wider mb-3">
                  Price per Night (KES)
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <p className="text-[10px] text-gray-400 mb-1">Min</p>
                    <input
                      type="number"
                      placeholder="0"
                      value={filters.minPrice || ''}
                      onChange={e => updateFilter('minPrice',
                        e.target.value ? Number(e.target.value) : undefined)}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg
                                 text-sm focus:outline-none focus:border-[#1A56DB]"
                    />
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-400 mb-1">Max</p>
                    <input
                      type="number"
                      placeholder="Any"
                      value={filters.maxPrice || ''}
                      onChange={e => updateFilter('maxPrice',
                        e.target.value ? Number(e.target.value) : undefined)}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg
                                 text-sm focus:outline-none focus:border-[#1A56DB]"
                    />
                  </div>
                </div>
              </div>

              {/* Guests */}
              <div className="pt-6 border-t border-gray-100">
                <label className="block text-xs font-bold text-gray-500
                                  uppercase tracking-wider mb-3">
                  Minimum Guests
                </label>
                <input
                  type="number"
                  min="1"
                  placeholder="Any"
                  value={filters.maxGuests || ''}
                  onChange={e => updateFilter('maxGuests',
                    e.target.value ? Number(e.target.value) : undefined)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg
                             text-sm focus:outline-none focus:border-[#1A56DB]"
                />
              </div>

            </div>
          </aside>

          {/* ── MAIN CONTENT ── */}
          <div className="flex-1 min-w-0">

            {/* Active filters bar */}
            {activeFilterCount > 0 && (
              <div className="flex flex-wrap gap-2 mb-5">
                {filters.county && (
                  <span className="flex items-center gap-1.5 bg-[#EBF2FF] text-[#1A56DB]
                                   text-xs font-medium px-3 py-1.5 rounded-full">
                    📍 {filters.county}
                    <button onClick={() => updateFilter('county', '')}
                      className="hover:text-[#0A1F5C] ml-0.5">✕</button>
                  </span>
                )}
                {filters.type && (
                  <span className="flex items-center gap-1.5 bg-[#EBF2FF] text-[#1A56DB]
                                   text-xs font-medium px-3 py-1.5 rounded-full">
                    🏠 {filters.type.toLowerCase()}
                    <button onClick={() => updateFilter('type', '')}
                      className="hover:text-[#0A1F5C] ml-0.5">✕</button>
                  </span>
                )}
                {(filters.minPrice || filters.maxPrice) && (
                  <span className="flex items-center gap-1.5 bg-[#EBF2FF] text-[#1A56DB]
                                   text-xs font-medium px-3 py-1.5 rounded-full">
                    💰 KES {filters.minPrice || 0} – {filters.maxPrice || '∞'}
                    <button onClick={() => {
                      updateFilter('minPrice', undefined)
                      updateFilter('maxPrice', undefined)
                    }} className="hover:text-[#0A1F5C] ml-0.5">✕</button>
                  </span>
                )}
              </div>
            )}

            {/* Results count */}
            <div className="flex items-center justify-between mb-6">
              <p className="text-sm text-gray-500">
                {loading ? 'Searching...' : (
                  <span>
                    <span className="font-semibold text-[#0A1F5C]">{total}</span>
                    {' '}propert{total === 1 ? 'y' : 'ies'} found
                  </span>
                )}
              </p>
              <select
                onChange={e => updateFilter('limit', Number(e.target.value))}
                className="text-sm border border-gray-200 rounded-lg px-3 py-1.5
                           focus:outline-none focus:border-[#1A56DB] text-gray-600">
                <option value="9">9 per page</option>
                <option value="18">18 per page</option>
                <option value="36">36 per page</option>
              </select>
            </div>

            {/* Grid */}
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {[...Array(9)].map((_, i) => (
                  <div key={i} className="h-80 bg-gray-200 rounded-2xl animate-pulse"/>
                ))}
              </div>
            ) : properties.length === 0 ? (
              <div className="text-center py-24 bg-white rounded-2xl border border-gray-100">
                <div className="text-5xl mb-4">🔍</div>
                <h3 className="font-display font-bold text-[#0A1F5C] text-xl mb-2">
                  No properties found
                </h3>
                <p className="text-gray-500 text-sm mb-6">
                  Try adjusting your filters
                </p>
                <button onClick={clearFilters}
                  className="bg-[#1A56DB] text-white px-6 py-2.5 rounded-lg
                             text-sm font-medium hover:bg-[#0A1F5C] transition-colors">
                  Clear filters
                </button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {properties.map(p => (
                    <PropertyCard key={p.id} property={p}/>
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-2 mt-10">
                    <button
                      onClick={() => updateFilter('page', (filters.page || 1) - 1)}
                      disabled={(filters.page || 1) <= 1}
                      className="px-4 py-2 rounded-lg border border-gray-200 text-sm
                                 disabled:opacity-40 hover:border-[#1A56DB] transition-colors">
                      ← Prev
                    </button>
                    {[...Array(totalPages)].map((_, i) => (
                      <button key={i}
                        onClick={() => updateFilter('page', i + 1)}
                        className={`w-9 h-9 rounded-lg text-sm font-medium transition-all ${
                          (filters.page || 1) === i + 1
                            ? 'bg-[#1A56DB] text-white'
                            : 'border border-gray-200 text-gray-600 hover:border-[#1A56DB]'
                        }`}>
                        {i + 1}
                      </button>
                    ))}
                    <button
                      onClick={() => updateFilter('page', (filters.page || 1) + 1)}
                      disabled={(filters.page || 1) >= totalPages}
                      className="px-4 py-2 rounded-lg border border-gray-200 text-sm
                                 disabled:opacity-40 hover:border-[#1A56DB] transition-colors">
                      Next →
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}