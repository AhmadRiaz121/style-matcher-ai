import { ClothingItem, UserProfile } from '@/types/wardrobe';

// Sample South Asian clothing items with placeholder images
export const sampleClothingItems: Omit<ClothingItem, 'id'>[] = [
  {
    name: 'Emerald Green Shalwar Kameez',
    category: 'suits',
    imageUrl: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&q=80',
    color: 'Emerald Green',
    lastWorn: undefined,
    wearCount: 0,
    cooldownDays: 5,
    createdAt: new Date(),
  },
  {
    name: 'Maroon Velvet Kameez',
    category: 'tops',
    imageUrl: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=800&q=80',
    color: 'Maroon',
    lastWorn: undefined,
    wearCount: 0,
    cooldownDays: 4,
    createdAt: new Date(),
  },
  {
    name: 'Royal Blue Embroidered Kameez',
    category: 'tops',
    imageUrl: 'https://images.unsplash.com/photo-1585487000160-6ebcfceb0d03?w=800&q=80',
    color: 'Royal Blue',
    lastWorn: undefined,
    wearCount: 0,
    cooldownDays: 5,
    createdAt: new Date(),
  },
  {
    name: 'Beige Cotton Shalwar',
    category: 'bottoms',
    imageUrl: 'https://images.unsplash.com/photo-1594633313593-bab3825d0caf?w=800&q=80',
    color: 'Beige',
    lastWorn: undefined,
    wearCount: 0,
    cooldownDays: 3,
    createdAt: new Date(),
  },
  {
    name: 'White Churidar',
    category: 'bottoms',
    imageUrl: 'https://images.unsplash.com/photo-1565084888279-aca607ecce0c?w=800&q=80',
    color: 'White',
    lastWorn: undefined,
    wearCount: 0,
    cooldownDays: 3,
    createdAt: new Date(),
  },
  {
    name: 'Pink Silk Dupatta',
    category: 'accessories',
    imageUrl: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=800&q=80',
    color: 'Pink',
    lastWorn: undefined,
    wearCount: 0,
    cooldownDays: 2,
    createdAt: new Date(),
  },
  {
    name: 'Gold Embroidered Dupatta',
    category: 'accessories',
    imageUrl: 'https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?w=800&q=80',
    color: 'Gold',
    lastWorn: undefined,
    wearCount: 0,
    cooldownDays: 3,
    createdAt: new Date(),
  },
  {
    name: 'Peach Anarkali Dress',
    category: 'dresses',
    imageUrl: 'https://images.unsplash.com/photo-1610030469984-3f5a1c6f4e0a?w=800&q=80',
    color: 'Peach',
    lastWorn: undefined,
    wearCount: 0,
    cooldownDays: 7,
    createdAt: new Date(),
  },
  {
    name: 'Red Bridal Lehenga',
    category: 'dresses',
    imageUrl: 'https://images.unsplash.com/photo-1583391733985-7b23c25a3c41?w=800&q=80',
    color: 'Red',
    lastWorn: undefined,
    wearCount: 0,
    cooldownDays: 10,
    createdAt: new Date(),
  },
  {
    name: 'Black Embroidered Shawl',
    category: 'outerwear',
    imageUrl: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800&q=80',
    color: 'Black',
    lastWorn: undefined,
    wearCount: 0,
    cooldownDays: 5,
    createdAt: new Date(),
  },
  {
    name: 'Cream Pashmina Shawl',
    category: 'outerwear',
    imageUrl: 'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=800&q=80',
    color: 'Cream',
    lastWorn: undefined,
    wearCount: 0,
    cooldownDays: 4,
    createdAt: new Date(),
  },
  {
    name: 'Silver Khussas',
    category: 'shoes',
    imageUrl: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=800&q=80',
    color: 'Silver',
    lastWorn: undefined,
    wearCount: 0,
    cooldownDays: 3,
    createdAt: new Date(),
  },
];

// Sample profile with South Asian woman image
export const sampleProfile: UserProfile = {
  profileImage: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=800&q=80',
  name: 'Aisha',
};

// Generate unique IDs for sample items
export function getSampleClothingWithIds(): ClothingItem[] {
  return sampleClothingItems.map((item, index) => ({
    ...item,
    id: `sample-${Date.now()}-${index}`,
  }));
}
