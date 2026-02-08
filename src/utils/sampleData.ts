import { ClothingItem, Profile } from '@/types/wardrobe';

// Sample South Asian clothing items with placeholder images
export const sampleClothingItems: Omit<ClothingItem, 'id'>[] = [
  {
    name: 'Emerald Green Shalwar Kameez',
    category: 'suits',
    imageUrl: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&q=80',
    color: 'Emerald Green',
    lastWorn: null,
    wearCount: 0,
    cooldownDays: 5,
    addedAt: new Date().toISOString(),
  },
  {
    name: 'Maroon Velvet Kameez',
    category: 'tops',
    imageUrl: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=800&q=80',
    color: 'Maroon',
    lastWorn: null,
    wearCount: 0,
    cooldownDays: 4,
    addedAt: new Date().toISOString(),
  },
  {
    name: 'Royal Blue Embroidered Kameez',
    category: 'tops',
    imageUrl: 'https://images.unsplash.com/photo-1585487000160-6ebcfceb0d03?w=800&q=80',
    color: 'Royal Blue',
    lastWorn: null,
    wearCount: 0,
    cooldownDays: 5,
    addedAt: new Date().toISOString(),
  },
  {
    name: 'Beige Cotton Shalwar',
    category: 'bottoms',
    imageUrl: 'https://images.unsplash.com/photo-1594633313593-bab3825d0caf?w=800&q=80',
    color: 'Beige',
    lastWorn: null,
    wearCount: 0,
    cooldownDays: 3,
    addedAt: new Date().toISOString(),
  },
  {
    name: 'White Churidar',
    category: 'bottoms',
    imageUrl: 'https://images.unsplash.com/photo-1565084888279-aca607ecce0c?w=800&q=80',
    color: 'White',
    lastWorn: null,
    wearCount: 0,
    cooldownDays: 3,
    addedAt: new Date().toISOString(),
  },
  {
    name: 'Pink Silk Dupatta',
    category: 'accessories',
    imageUrl: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=800&q=80',
    color: 'Pink',
    lastWorn: null,
    wearCount: 0,
    cooldownDays: 2,
    addedAt: new Date().toISOString(),
  },
  {
    name: 'Gold Embroidered Dupatta',
    category: 'accessories',
    imageUrl: 'https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?w=800&q=80',
    color: 'Gold',
    lastWorn: null,
    wearCount: 0,
    cooldownDays: 3,
    addedAt: new Date().toISOString(),
  },
  {
    name: 'Peach Anarkali Dress',
    category: 'dresses',
    imageUrl: 'https://images.unsplash.com/photo-1583391733981-e8c2e6b0f6e3?w=800&q=80',
    color: 'Peach',
    lastWorn: null,
    wearCount: 0,
    cooldownDays: 7,
    addedAt: new Date().toISOString(),
  },
  {
    name: 'Red Bridal Lehenga',
    category: 'dresses',
    imageUrl: 'https://images.unsplash.com/photo-1610030469667-7e1c88283e6e?w=800&q=80',
    color: 'Red',
    lastWorn: null,
    wearCount: 0,
    cooldownDays: 10,
    addedAt: new Date().toISOString(),
  },
  {
    name: 'Black Embroidered Shawl',
    category: 'outerwear',
    imageUrl: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800&q=80',
    color: 'Black',
    lastWorn: null,
    wearCount: 0,
    cooldownDays: 5,
    addedAt: new Date().toISOString(),
  },
  {
    name: 'Cream Pashmina Shawl',
    category: 'outerwear',
    imageUrl: 'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=800&q=80',
    color: 'Cream',
    lastWorn: null,
    wearCount: 0,
    cooldownDays: 4,
    addedAt: new Date().toISOString(),
  },
  {
    name: 'Silver Khussas',
    category: 'shoes',
    imageUrl: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=800&q=80',
    color: 'Silver',
    lastWorn: null,
    wearCount: 0,
    cooldownDays: 3,
    addedAt: new Date().toISOString(),
  },
];

// Sample profile with South Asian woman image
export const sampleProfile: Profile = {
  profileImage: 'https://images.unsplash.com/photo-1616683693504-3b9c563564c0?w=800&q=80',
  name: 'Aisha',
};

// Generate unique IDs for sample items
export function getSampleClothingWithIds(): ClothingItem[] {
  return sampleClothingItems.map((item, index) => ({
    ...item,
    id: `sample-${Date.now()}-${index}`,
  }));
}
