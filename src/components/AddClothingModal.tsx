import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ImageUpload } from './ImageUpload';
import { ClothingCategory } from '@/types/wardrobe';

interface AddClothingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (item: {
    name: string;
    category: ClothingCategory;
    imageUrl: string;
    color?: string;
    cooldownDays: number;
  }) => void;
}

const categories: { value: ClothingCategory; label: string }[] = [
  { value: 'tops', label: 'Tops' },
  { value: 'bottoms', label: 'Bottoms' },
  { value: 'suits', label: 'Suits' },
  { value: 'dresses', label: 'Dresses' },
  { value: 'outerwear', label: 'Outerwear' },
  { value: 'shoes', label: 'Shoes' },
  { value: 'accessories', label: 'Accessories' },
];

export function AddClothingModal({ isOpen, onClose, onAdd }: AddClothingModalProps) {
  const [name, setName] = useState('');
  const [category, setCategory] = useState<ClothingCategory>('tops');
  const [imageUrl, setImageUrl] = useState('');
  const [color, setColor] = useState('');
  const [cooldownDays, setCooldownDays] = useState('5');

  const handleSubmit = () => {
    if (!name.trim() || !imageUrl) return;

    onAdd({
      name: name.trim(),
      category,
      imageUrl,
      color: color.trim() || undefined,
      cooldownDays: parseInt(cooldownDays) || 5,
    });

    // Reset form
    setName('');
    setCategory('tops');
    setImageUrl('');
    setColor('');
    setCooldownDays('5');
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-charcoal/60 backdrop-blur-sm z-50"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-lg max-h-[90vh] overflow-y-auto"
          >
            <div className="bg-card rounded-2xl shadow-elevated p-6 border border-border">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-display text-2xl font-semibold">Add to Wardrobe</h2>
                <button
                  onClick={onClose}
                  className="p-2 rounded-full hover:bg-muted transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <ImageUpload
                    onImageSelect={setImageUrl}
                    currentImage={imageUrl}
                    onRemove={() => setImageUrl('')}
                    label="Upload Photo"
                  />
                </div>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g., Blue Oxford Shirt"
                      className="mt-1.5"
                    />
                  </div>

                  <div>
                    <Label htmlFor="category">Category</Label>
                    <Select value={category} onValueChange={(v) => setCategory(v as ClothingCategory)}>
                      <SelectTrigger className="mt-1.5">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((cat) => (
                          <SelectItem key={cat.value} value={cat.value}>
                            {cat.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="color">Color (optional)</Label>
                    <Input
                      id="color"
                      value={color}
                      onChange={(e) => setColor(e.target.value)}
                      placeholder="e.g., Navy Blue"
                      className="mt-1.5"
                    />
                  </div>

                  <div>
                    <Label htmlFor="cooldown">Wear again after (days)</Label>
                    <Input
                      id="cooldown"
                      type="number"
                      min="1"
                      max="30"
                      value={cooldownDays}
                      onChange={(e) => setCooldownDays(e.target.value)}
                      className="mt-1.5"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Recommended after this many days
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <Button variant="outline" onClick={onClose} className="flex-1">
                  Cancel
                </Button>
                <Button
                  variant="gold"
                  onClick={handleSubmit}
                  disabled={!name.trim() || !imageUrl}
                  className="flex-1"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Add Item
                </Button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
