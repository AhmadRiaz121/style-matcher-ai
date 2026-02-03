import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Wand2, Sparkles, AlertCircle, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ImageUpload } from './ImageUpload';
import { ClothingCard } from './ClothingCard';
import { useGeminiApi } from '@/hooks/useGeminiApi';
import { useWardrobe } from '@/hooks/useWardrobe';
import { ClothingItem } from '@/types/wardrobe';

interface TryOnPanelProps {
  onOpenApiSettings: () => void;
}

export function TryOnPanel({ onOpenApiSettings }: TryOnPanelProps) {
  const { hasApiKey, generateTryOn, isLoading, error } = useGeminiApi();
  const { clothes, profile, setProfile } = useWardrobe();
  const [selectedItems, setSelectedItems] = useState<ClothingItem[]>([]);
  const [result, setResult] = useState<string | null>(null);

  const handleSelectItem = (item: ClothingItem) => {
    setSelectedItems(prev => {
      const exists = prev.find(i => i.id === item.id);
      if (exists) {
        return prev.filter(i => i.id !== item.id);
      }
      return [...prev, item];
    });
  };

  const handleTryOn = async () => {
    if (!profile.profileImage || selectedItems.length === 0) return;

    const response = await generateTryOn(
      profile.profileImage,
      selectedItems.map(item => item.imageUrl)
    );

    if (response) {
      setResult(response);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gold/10 text-gold mb-4">
          <Wand2 className="w-4 h-4" />
          <span className="text-sm font-medium">AI Virtual Try-On</span>
        </div>
        <h2 className="font-display text-3xl font-semibold mb-2">See How It Looks</h2>
        <p className="text-muted-foreground">
          Upload your photo, select clothes, and let AI show you how they fit
        </p>
      </div>

      {!hasApiKey && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-4 p-4 rounded-xl bg-gold/10 border border-gold/30"
        >
          <AlertCircle className="w-5 h-5 text-gold flex-shrink-0" />
          <p className="text-sm flex-1">
            Connect your Gemini API key to enable AI-powered virtual try-on
          </p>
          <Button variant="gold" size="sm" onClick={onOpenApiSettings}>
            Setup API Key
          </Button>
        </motion.div>
      )}

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Profile Photo Section */}
        <div className="space-y-4">
          <h3 className="font-display text-xl font-medium flex items-center gap-2">
            <User className="w-5 h-5 text-gold" />
            Your Photo
          </h3>
          <ImageUpload
            onImageSelect={(url) => setProfile({ ...profile, profileImage: url })}
            currentImage={profile.profileImage}
            onRemove={() => setProfile({ ...profile, profileImage: undefined })}
            label="Upload Your Photo"
            aspectRatio="portrait"
            className="max-w-xs"
          />
        </div>

        {/* Selected Items Section */}
        <div className="space-y-4">
          <h3 className="font-display text-xl font-medium flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-gold" />
            Selected Items ({selectedItems.length})
          </h3>
          
          {selectedItems.length === 0 ? (
            <div className="p-8 rounded-xl border-2 border-dashed border-border text-center text-muted-foreground">
              <p>Select items from your wardrobe below</p>
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-3">
              {selectedItems.map(item => (
                <div key={item.id} className="relative aspect-square rounded-lg overflow-hidden">
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                  <button
                    onClick={() => handleSelectItem(item)}
                    className="absolute top-1 right-1 w-6 h-6 rounded-full bg-charcoal/80 text-white text-xs flex items-center justify-center hover:bg-destructive transition-colors"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}

          <Button
            variant="gold"
            size="lg"
            className="w-full"
            onClick={handleTryOn}
            disabled={!hasApiKey || !profile.profileImage || selectedItems.length === 0 || isLoading}
          >
            {isLoading ? (
              <>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                >
                  <Sparkles className="w-5 h-5" />
                </motion.div>
                Analyzing Style...
              </>
            ) : (
              <>
                <Wand2 className="w-5 h-5" />
                Generate Style Analysis
              </>
            )}
          </Button>

          {error && (
            <p className="text-sm text-destructive text-center">{error}</p>
          )}
        </div>
      </div>

      {/* AI Result */}
      <AnimatePresence>
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="p-6 rounded-2xl bg-gradient-to-br from-gold/5 to-gold/10 border border-gold/20"
          >
            <h3 className="font-display text-xl font-medium mb-4 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-gold" />
              AI Style Analysis
            </h3>
            <div className="prose prose-sm max-w-none text-foreground">
              {result.split('\n').map((paragraph, i) => (
                <p key={i} className="mb-2">{paragraph}</p>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Wardrobe Selection */}
      {clothes.length > 0 && (
        <div className="space-y-4">
          <h3 className="font-display text-xl font-medium">Select from Wardrobe</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {clothes.map(item => (
              <ClothingCard
                key={item.id}
                item={item}
                onSelect={handleSelectItem}
                isSelected={selectedItems.some(i => i.id === item.id)}
                showActions={false}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
