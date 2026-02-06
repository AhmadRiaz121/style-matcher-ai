export type ClothingCategory = 
  | 'tops' 
  | 'bottoms' 
  | 'suits' 
  | 'dresses' 
  | 'outerwear' 
  | 'shoes' 
  | 'accessories';

export interface ClothingItem {
  id: string;
  name: string;
  category: ClothingCategory;
  imageUrl: string;
  color?: string;
  lastWorn?: Date;
  wearCount: number;
  cooldownDays: number; // Days before recommending again
  createdAt: Date;
}

export interface WearHistory {
  id: string;
  clothingId: string;
  wornDate: Date;
  eventType?: string;
}

export interface Event {
  id: string;
  name: string;
  date: Date;
  type: 'casual' | 'formal' | 'business' | 'party' | 'outdoor' | 'other';
  outfitId?: string;
  outfitIds?: string[];
}

export interface UserProfile {
  profileImage?: string;
  name?: string;
}

export interface TryOnResult {
  id: string;
  originalImage: string;
  clothingItems: string[];
  resultImage: string;
  createdAt: Date;
}
