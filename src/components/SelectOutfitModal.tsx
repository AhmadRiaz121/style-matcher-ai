import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ClothingCard } from '@/components/ClothingCard';
import { ClothingItem, Event } from '@/types/wardrobe';
import { ScrollArea } from '@/components/ui/scroll-area';

interface SelectOutfitModalProps {
  isOpen: boolean;
  onClose: () => void;
  event: Event | null;
  clothes: ClothingItem[];
  onSelectOutfit: (eventId: string, clothingId: string | undefined) => void;
}

export function SelectOutfitModal({
  isOpen,
  onClose,
  event,
  clothes,
  onSelectOutfit,
}: SelectOutfitModalProps) {
  const [selectedClothingId, setSelectedClothingId] = useState<string | undefined>(
    event?.outfitId
  );

  const handleSave = () => {
    if (event) {
      onSelectOutfit(event.id, selectedClothingId);
      onClose();
    }
  };

  const handleClear = () => {
    setSelectedClothingId(undefined);
  };

  if (!isOpen || !event) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
      >
        <div 
          className="absolute inset-0 bg-charcoal/60 backdrop-blur-sm"
          onClick={onClose}
        />
        
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="relative bg-card rounded-2xl shadow-elegant w-full max-w-4xl max-h-[85vh] overflow-hidden"
        >
          <div className="flex items-center justify-between p-6 border-b border-border">
            <div>
              <h2 className="font-display text-2xl font-semibold">Select Outfit</h2>
              <p className="text-muted-foreground mt-1">
                Choose an item for "{event.name}"
              </p>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="w-5 h-5" />
            </Button>
          </div>

          <ScrollArea className="h-[50vh] p-6">
            {clothes.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">
                  No items in your wardrobe yet. Add some clothes first!
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {clothes.map((item) => (
                  <ClothingCard
                    key={item.id}
                    item={item}
                    isSelected={selectedClothingId === item.id}
                    onSelect={(item) => setSelectedClothingId(item.id)}
                    showActions={false}
                  />
                ))}
              </div>
            )}
          </ScrollArea>

          <div className="flex items-center justify-between gap-3 p-6 border-t border-border bg-muted/30">
            <Button variant="ghost" onClick={handleClear} disabled={!selectedClothingId}>
              Clear Selection
            </Button>
            <div className="flex gap-3">
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button variant="gold" onClick={handleSave}>
                <Check className="w-4 h-4 mr-2" />
                Save Outfit
              </Button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
