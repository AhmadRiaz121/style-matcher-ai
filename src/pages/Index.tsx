import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus } from 'lucide-react';
import { Header } from '@/components/Header';
import { Navigation } from '@/components/Navigation';
import { ClothingCard } from '@/components/ClothingCard';
import { CategoryFilter } from '@/components/CategoryFilter';
import { AddClothingModal } from '@/components/AddClothingModal';
import { AddEventModal } from '@/components/AddEventModal';
import { EditEventModal } from '@/components/EditEventModal';
import { SelectOutfitModal } from '@/components/SelectOutfitModal';
import { EventCard } from '@/components/EventCard';
import { TryOnPanel } from '@/components/TryOnPanel';
import { SettingsPanel } from '@/components/SettingsPanel';
import { ShoppingAssistant } from '@/components/ShoppingAssistant';
import { ApiKeyModal } from '@/components/ApiKeyModal';
import { Button } from '@/components/ui/button';
import { useWardrobe } from '@/hooks/useWardrobe';
import { ClothingCategory, Event, ClothingItem } from '@/types/wardrobe';

type TabId = 'wardrobe' | 'tryon' | 'shop' | 'events' | 'settings';

const Index = () => {
  const [activeTab, setActiveTab] = useState<TabId>('wardrobe');
  const [selectedCategory, setSelectedCategory] = useState<ClothingCategory | 'all'>('all');
  const [showAddClothing, setShowAddClothing] = useState(false);
  const [showAddEvent, setShowAddEvent] = useState(false);
  const [showApiKeyModal, setShowApiKeyModal] = useState(false);
  const [showSelectOutfit, setShowSelectOutfit] = useState(false);
  const [showEditEvent, setShowEditEvent] = useState(false);
  const [selectedEventForOutfit, setSelectedEventForOutfit] = useState<Event | null>(null);
  const [selectedEventForEdit, setSelectedEventForEdit] = useState<Event | null>(null);

  const {
    clothes,
    upcomingEvents,
    addClothing,
    removeClothing,
    markAsWorn,
    addEvent,
    removeEvent,
    updateEvent,
  } = useWardrobe();

  const handleSelectOutfit = (event: Event) => {
    setSelectedEventForOutfit(event);
    setShowSelectOutfit(true);
  };

  const handleSaveOutfit = (eventId: string, clothingId: string | undefined) => {
    updateEvent(eventId, { outfitId: clothingId });
  };

  const handleEditEvent = (event: Event) => {
    setSelectedEventForEdit(event);
    setShowEditEvent(true);
  };

  const handleSaveEventEdit = (id: string, updates: Partial<Event>) => {
    updateEvent(id, updates);
  };

  const getClothingById = (id: string | undefined) => {
    if (!id) return undefined;
    return clothes.find(c => c.id === id);
  };

  const filteredClothes = selectedCategory === 'all'
    ? clothes
    : clothes.filter(item => item.category === selectedCategory);

  return (
    <div className="min-h-screen bg-background pb-24 md:pb-8">
      <Header />
      <Navigation activeTab={activeTab} onTabChange={setActiveTab} />

      <main className="container mx-auto px-4 py-8">
        <AnimatePresence mode="wait">
          {activeTab === 'wardrobe' && (
            <motion.div
              key="wardrobe"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="font-display text-3xl font-semibold">My Wardrobe</h2>
                  <p className="text-muted-foreground">
                    {clothes.length} items in your collection
                  </p>
                </div>
                <Button variant="gold" onClick={() => setShowAddClothing(true)}>
                  <Plus className="w-5 h-5" />
                  Add Item
                </Button>
              </div>

              <CategoryFilter
                selected={selectedCategory}
                onChange={setSelectedCategory}
              />

              {filteredClothes.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-16"
                >
                  <div className="w-20 h-20 rounded-full bg-muted mx-auto mb-4 flex items-center justify-center">
                    <Plus className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <h3 className="font-display text-xl font-medium mb-2">No items yet</h3>
                  <p className="text-muted-foreground mb-4">
                    Start building your digital wardrobe
                  </p>
                  <Button variant="gold" onClick={() => setShowAddClothing(true)}>
                    Add Your First Item
                  </Button>
                </motion.div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {filteredClothes.map((item) => (
                    <ClothingCard
                      key={item.id}
                      item={item}
                      onDelete={removeClothing}
                      onMarkWorn={markAsWorn}
                    />
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {activeTab === 'tryon' && (
            <motion.div
              key="tryon"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <TryOnPanel onOpenApiSettings={() => setShowApiKeyModal(true)} />
            </motion.div>
          )}

          {activeTab === 'shop' && (
            <motion.div
              key="shop"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <ShoppingAssistant onOpenApiSettings={() => setShowApiKeyModal(true)} />
            </motion.div>
          )}

          {activeTab === 'events' && (
            <motion.div
              key="events"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="font-display text-3xl font-semibold">Upcoming Events</h2>
                  <p className="text-muted-foreground">
                    Plan your outfits ahead of time
                  </p>
                </div>
                <Button variant="gold" onClick={() => setShowAddEvent(true)}>
                  <Plus className="w-5 h-5" />
                  Add Event
                </Button>
              </div>

              {upcomingEvents.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-16"
                >
                  <div className="w-20 h-20 rounded-full bg-muted mx-auto mb-4 flex items-center justify-center">
                    <Plus className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <h3 className="font-display text-xl font-medium mb-2">No events planned</h3>
                  <p className="text-muted-foreground mb-4">
                    Add an event to start planning your outfits
                  </p>
                  <Button variant="gold" onClick={() => setShowAddEvent(true)}>
                    Add Your First Event
                  </Button>
                </motion.div>
              ) : (
                <div className="space-y-4">
                  {upcomingEvents.map((event) => (
                    <EventCard
                      key={event.id}
                      event={event}
                      onDelete={removeEvent}
                      onSelectOutfit={handleSelectOutfit}
                      onEdit={handleEditEvent}
                      selectedOutfits={
                        [
                          ...(event.outfitIds || []),
                          ...(event.outfitId ? [event.outfitId] : [])
                        ]
                          .map(id => clothes.find(c => c.id === id))
                          .filter((c): c is ClothingItem => !!c)
                      }
                    />
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {activeTab === 'settings' && (
            <motion.div
              key="settings"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <SettingsPanel onOpenApiSettings={() => setShowApiKeyModal(true)} />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Modals */}
      <AddClothingModal
        isOpen={showAddClothing}
        onClose={() => setShowAddClothing(false)}
        onAdd={addClothing}
      />

      <AddEventModal
        isOpen={showAddEvent}
        onClose={() => setShowAddEvent(false)}
        onAdd={addEvent}
      />

      <ApiKeyModal
        isOpen={showApiKeyModal}
        onClose={() => setShowApiKeyModal(false)}
      />

      <SelectOutfitModal
        isOpen={showSelectOutfit}
        onClose={() => {
          setShowSelectOutfit(false);
          setSelectedEventForOutfit(null);
        }}
        event={selectedEventForOutfit}
        clothes={clothes}
        onSelectOutfit={handleSaveOutfit}
      />

      <EditEventModal
        isOpen={showEditEvent}
        onClose={() => {
          setShowEditEvent(false);
          setSelectedEventForEdit(null);
        }}
        event={selectedEventForEdit}
        onSave={handleSaveEventEdit}
      />
    </div>
  );
};

export default Index;
