// Curated real Airbnb-style property photos
// Mix of Unsplash and Pexels — all free, no attribution required for display

export const PROPERTY_PHOTOS = {
  // ── Living rooms / common areas ──
  living: [
    'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&q=80',
    'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&q=80',
    'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=800&q=80',
    'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?w=800',
    'https://images.pexels.com/photos/276724/pexels-photo-276724.jpeg?w=800',
  ],

  // ── Bedrooms ──
  bedroom: [
    'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&q=80',
    'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=800&q=80',
    'https://images.unsplash.com/photo-1505693314120-0d443867891c?w=800&q=80',
    'https://images.pexels.com/photos/164595/pexels-photo-164595.jpeg?w=800',
    'https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg?w=800',
  ],

  // ── Exterior / house views ──
  exterior: [
    'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&q=80',
    'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800&q=80',
    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80',
    'https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?w=800',
    'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?w=800',
  ],

  // ── Apartments / studios ──
  apartment: [
    'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=80',
    'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&q=80',
    'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80',
    'https://images.pexels.com/photos/1918291/pexels-photo-1918291.jpeg?w=800',
    'https://images.pexels.com/photos/2631746/pexels-photo-2631746.jpeg?w=800',
  ],

  // ── Villas / luxury ──
  villa: [
    'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&q=80',
    'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=800&q=80',
    'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&q=80',
    'https://images.pexels.com/photos/53610/large-home-residential-house-architecture-53610.jpeg?w=800',
    'https://images.pexels.com/photos/1732414/pexels-photo-1732414.jpeg?w=800',
  ],

  // ── Cottages / nature ──
  cottage: [
    'https://images.unsplash.com/photo-1449158743715-0a90ebb6d2d8?w=800&q=80',
    'https://images.unsplash.com/photo-1510798831971-661eb04b3739?w=800&q=80',
    'https://images.unsplash.com/photo-1542718610-a1d656d1884c?w=800&q=80',
    'https://images.pexels.com/photos/803975/pexels-photo-803975.jpeg?w=800',
    'https://images.pexels.com/photos/2351649/pexels-photo-2351649.jpeg?w=800',
  ],

  // ── Kakamega / forest / nature ──
  kakamega: [
    'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1200&q=80',
    'https://images.unsplash.com/photo-1448375240586-882707db888b?w=1200&q=80',
    'https://images.unsplash.com/photo-1516912481808-3406841bd33c?w=1200&q=80',
    'https://images.pexels.com/photos/167698/pexels-photo-167698.jpeg?w=1200',
    'https://images.pexels.com/photos/1125850/pexels-photo-1125850.jpeg?w=1200',
  ],
}

// Get a photo for a property based on its type and ID
// Using the ID ensures the same property always gets the same photo
export const getPropertyPhoto = (
  type: string,
  id: string,
  index: number = 0
): string => {
  const typeMap: Record<string, keyof typeof PROPERTY_PHOTOS> = {
    VILLA:      'villa',
    COTTAGE:    'cottage',
    APARTMENT:  'apartment',
    STUDIO:     'apartment',
    HOUSE:      'exterior',
    GUESTHOUSE: 'living',
  }

  const category = typeMap[type] || 'living'
  const photos = PROPERTY_PHOTOS[category]

  // Use charCode of first char of ID for deterministic but varied selection
  const seed = id ? id.charCodeAt(0) + id.charCodeAt(id.length - 1) : 0
  return photos[(seed + index) % photos.length]
}

export const getKakamegaPhoto = (index: number = 0): string => {
  return PROPERTY_PHOTOS.kakamega[index % PROPERTY_PHOTOS.kakamega.length]
}