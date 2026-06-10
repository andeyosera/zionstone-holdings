import { Link } from 'react-router-dom'
import type { Property } from '../../services/property.service'
import { getPropertyPhoto } from '../../utils/photos'

interface Props {
  property: Property
  size?: 'normal' | 'large'
}

const TYPE_LABELS: Record<string, string> = {
  APARTMENT: 'Apartment', HOUSE: 'House', VILLA: 'Villa',
  COTTAGE: 'Cottage', STUDIO: 'Studio', GUESTHOUSE: 'Guesthouse',
}

export default function PropertyCard({ property, size = 'normal' }: Props) {
  // Use real cover image if uploaded, otherwise use our curated photo
  const coverImage = property.images?.find(img => img.isCover)?.url
    || property.images?.[0]?.url
    || getPropertyPhoto(property.type, property.id)

  return (
    <Link
      to={`/properties/${property.id}`}
      className="group block bg-white rounded-2xl overflow-hidden
                 border border-gray-100 shadow-sm hover:shadow-xl
                 hover:-translate-y-1 transition-all duration-300"
    >
      {/* Image */}
      <div className={`relative overflow-hidden ${size === 'large' ? 'h-72' : 'h-56'}`}>
        <img
          src={coverImage}
          alt={property.title}
          className="w-full h-full object-cover transition-transform
                     duration-700 group-hover:scale-105"
          onError={(e) => {
            // Fallback if image fails to load
            (e.target as HTMLImageElement).src =
              `https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=80`
          }}
        />

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"/>

        {/* Type badge */}
        <span className="absolute top-3 left-3 bg-white/95 backdrop-blur-sm
                         text-[#0A1F5C] text-[10px] font-bold tracking-wider
                         uppercase px-3 py-1 rounded-full shadow-sm">
          {TYPE_LABELS[property.type] || property.type}
        </span>

        {/* Rating */}
        {property.avgRating && (
          <span className="absolute top-3 right-3 bg-[#0A1F5C]/90 backdrop-blur-sm
                           text-white text-xs font-semibold px-2.5 py-1
                           rounded-full flex items-center gap-1">
            ★ {Number(property.avgRating).toFixed(1)}
          </span>
        )}
      </div>

      {/* Content */}
      <div className="p-5">
        <p className="text-[#1A56DB] text-xs font-semibold tracking-wide mb-1.5 flex items-center gap-1">
          <span>📍</span> {property.town}, {property.county}
        </p>

        <h3 className="font-display font-bold text-[#0A1F5C] text-base leading-snug
                       mb-3 line-clamp-2 group-hover:text-[#1A56DB] transition-colors">
          {property.title}
        </h3>

        {/* Amenities preview */}
        {property.amenities?.length > 0 && (
          <div className="flex gap-1.5 flex-wrap mb-3">
            {property.amenities.slice(0, 3).map(a => (
              <span key={a}
                className="text-[10px] bg-[#F5F8FF] text-[#1A56DB]
                           px-2 py-0.5 rounded-full font-medium">
                {a}
              </span>
            ))}
            {property.amenities.length > 3 && (
              <span className="text-[10px] text-gray-400">
                +{property.amenities.length - 3} more
              </span>
            )}
          </div>
        )}

        <div className="flex items-end justify-between pt-3 border-t border-gray-100">
          <div>
            <span className="text-2xl font-bold font-display text-[#0A1F5C]">
              KES {Number(property.pricePerNight).toLocaleString()}
            </span>
            <span className="text-gray-400 text-xs ml-1">/ night</span>
          </div>
          <div className="text-right">
            <div className="flex items-center gap-3 text-xs text-gray-400">
              <span>🛏 {property.bedrooms}</span>
              <span>🚿 {property.bathrooms}</span>
              <span>👥 {property.maxGuests}</span>
            </div>
            {property._count?.reviews > 0 && (
              <p className="text-[10px] text-gray-400 mt-0.5 text-right">
                {property._count.reviews} review{property._count.reviews !== 1 ? 's' : ''}
              </p>
            )}
          </div>
        </div>
      </div>
    </Link>
  )
}