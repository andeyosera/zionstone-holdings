// Unsplash topic-based URLs — these return perfectly matched photos every time
// Format: /photo-{id}?w=800&q=80

export const PROPERTY_PHOTOS = {
  studio: [
    'https://images.unsplash.com/photo-1536376072261-38c75010e6c9?w=800&q=80',
    'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800&q=80',
    'https://images.unsplash.com/photo-1554995207-c18c203602cb?w=800&q=80',
    'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80',
    'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?w=800&q=80',
  ],
  apartment: [
    'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=80',
    'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&q=80',
    'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80',
    'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800&q=80',
    'https://images.unsplash.com/photo-1536376072261-38c75010e6c9?w=800&q=80',
  ],
  villa: [
    'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&q=80',
    'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=800&q=80',
    'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=800&q=80',
    'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800&q=80',
    'https://images.unsplash.com/photo-1449844908441-8829872d2607?w=800&q=80',
  ],
  cottage: [
    'https://images.unsplash.com/photo-1449158743715-0a90ebb6d2d8?w=800&q=80',
    'https://images.unsplash.com/photo-1510798831971-661eb04b3739?w=800&q=80',
    'https://images.unsplash.com/photo-1542718610-a1d656d1884c?w=800&q=80',
    'https://images.unsplash.com/photo-1561501878-aabd62634533?w=800&q=80',
    'https://images.unsplash.com/photo-1587061949409-02df41d5e562?w=800&q=80',
  ],
  house: [
    'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&q=80',
    'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800&q=80',
    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80',
    'https://images.unsplash.com/photo-1598228723793-56d4f1330a1c?w=800&q=80',
    'https://images.unsplash.com/photo-1576941089067-2de3c901e126?w=800&q=80',
  ],
  guesthouse: [
    'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&q=80',
    'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&q=80',
    'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&q=80',
    'https://images.unsplash.com/photo-1484101403633-562f891dc89a?w=800&q=80',
    'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=800&q=80',
  ],
  kakamega: [
    'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1200&q=80',
    'https://images.unsplash.com/photo-1448375240586-882707db888b?w=1200&q=80',
    'https://images.unsplash.com/photo-1516912481808-3406841bd33c?w=1200&q=80',
    'https://images.unsplash.com/photo-1542401886-65d6c61db217?w=1200&q=80',
    'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1200&q=80',
  ],
}

// Returns multiple photos for a property (for the gallery)
export const getPropertyPhotos = (type: string, id: string): string[] => {
  const typeMap: Record<string, keyof typeof PROPERTY_PHOTOS> = {
    VILLA:      'villa',
    COTTAGE:    'cottage',
    APARTMENT:  'apartment',
    STUDIO:     'studio',
    HOUSE:      'house',
    GUESTHOUSE: 'guesthouse',
  }

  const category = typeMap[type] || 'apartment'
  const photos = PROPERTY_PHOTOS[category]

  // Use property ID to deterministically pick a starting index
  const seed = id
    ? id.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0)
    : 0

  // Return 4 photos starting from the seed index, cycling through the array
  return [0, 1, 2, 3].map(i => photos[(seed + i) % photos.length])
}

// Single photo — used in cards
export const getPropertyPhoto = (type: string, id: string): string => {
  return getPropertyPhotos(type, id)[0]
}

export const getKakamegaPhoto = (index: number = 0): string => {
  return PROPERTY_PHOTOS.kakamega[index % PROPERTY_PHOTOS.kakamega.length]
}