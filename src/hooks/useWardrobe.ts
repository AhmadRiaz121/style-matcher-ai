import { useCallback, useMemo } from 'react';
import { useLocalStorage } from './useLocalStorage';
import { ClothingItem, ClothingCategory, WearHistory, Event, UserProfile } from '@/types/wardrobe';

export function useWardrobe() {
  const [clothes, setClothes] = useLocalStorage<ClothingItem[]>('wardrobe-clothes', []);
  const [wearHistory, setWearHistory] = useLocalStorage<WearHistory[]>('wardrobe-history', []);
  const [events, setEvents] = useLocalStorage<Event[]>('wardrobe-events', []);
  const [profile, setProfile] = useLocalStorage<UserProfile>('wardrobe-profile', {});

  const addClothing = useCallback((item: Omit<ClothingItem, 'id' | 'wearCount' | 'createdAt'>) => {
    const newItem: ClothingItem = {
      ...item,
      id: crypto.randomUUID(),
      wearCount: 0,
      createdAt: new Date(),
    };
    setClothes(prev => [...prev, newItem]);
    return newItem;
  }, [setClothes]);

  const removeClothing = useCallback((id: string) => {
    setClothes(prev => prev.filter(item => item.id !== id));
  }, [setClothes]);

  const updateClothing = useCallback((id: string, updates: Partial<ClothingItem>) => {
    setClothes(prev => prev.map(item => 
      item.id === id ? { ...item, ...updates } : item
    ));
  }, [setClothes]);

  const markAsWorn = useCallback((clothingId: string, eventType?: string) => {
    const now = new Date();
    
    // Update clothing item
    setClothes(prev => prev.map(item => 
      item.id === clothingId 
        ? { ...item, lastWorn: now, wearCount: item.wearCount + 1 }
        : item
    ));

    // Add to history
    const historyEntry: WearHistory = {
      id: crypto.randomUUID(),
      clothingId,
      wornDate: now,
      eventType,
    };
    setWearHistory(prev => [...prev, historyEntry]);
  }, [setClothes, setWearHistory]);

  const getClothingByCategory = useCallback((category: ClothingCategory) => {
    return clothes.filter(item => item.category === category);
  }, [clothes]);

  const getRecommendedOutfits = useMemo(() => {
    const now = new Date();
    return clothes.filter(item => {
      if (!item.lastWorn) return true;
      const lastWornDate = new Date(item.lastWorn);
      const daysSinceWorn = Math.floor((now.getTime() - lastWornDate.getTime()) / (1000 * 60 * 60 * 24));
      return daysSinceWorn >= item.cooldownDays;
    });
  }, [clothes]);

  const addEvent = useCallback((event: Omit<Event, 'id'>) => {
    const newEvent: Event = {
      ...event,
      id: crypto.randomUUID(),
    };
    setEvents(prev => [...prev, newEvent]);
    return newEvent;
  }, [setEvents]);

  const removeEvent = useCallback((id: string) => {
    setEvents(prev => prev.filter(e => e.id !== id));
  }, [setEvents]);

  const updateEvent = useCallback((id: string, updates: Partial<Event>) => {
    setEvents(prev => prev.map(e => 
      e.id === id ? { ...e, ...updates } : e
    ));
  }, [setEvents]);

  const upcomingEvents = useMemo(() => {
    const now = new Date();
    return events
      .filter(e => new Date(e.date) >= now)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [events]);

  return {
    clothes,
    wearHistory,
    events,
    profile,
    setProfile,
    addClothing,
    removeClothing,
    updateClothing,
    markAsWorn,
    getClothingByCategory,
    getRecommendedOutfits,
    addEvent,
    removeEvent,
    updateEvent,
    upcomingEvents,
  };
}
