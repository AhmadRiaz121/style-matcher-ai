import { motion } from 'framer-motion';
import { Calendar, Trash2, Check } from 'lucide-react';
import { ClothingItem } from '@/types/wardrobe';
import { Button } from '@/components/ui/button';
import { formatDistanceToNow } from 'date-fns';

interface ClothingCardProps {
  item: ClothingItem;
  onSelect?: (item: ClothingItem) => void;
  onDelete?: (id: string) => void;
  onMarkWorn?: (id: string) => void;
  isSelected?: boolean;
  showActions?: boolean;
}

export function ClothingCard({
  item,
  onSelect,
  onDelete,
  onMarkWorn,
  isSelected = false,
  showActions = true,
}: ClothingCardProps) {
  const isRecommended = !item.lastWorn || 
    (new Date().getTime() - new Date(item.lastWorn).getTime()) / (1000 * 60 * 60 * 24) >= item.cooldownDays;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      whileHover={{ y: -4 }}
      onClick={() => onSelect?.(item)}
      className={`relative group rounded-xl overflow-hidden cursor-pointer transition-all ${
        isSelected 
          ? 'ring-2 ring-gold ring-offset-2 ring-offset-background' 
          : 'shadow-soft hover:shadow-card'
      }`}
    >
      <div className="aspect-[3/4] overflow-hidden">
        <img
          src={item.imageUrl}
          alt={item.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>

      {isSelected && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute top-3 right-3 w-8 h-8 rounded-full bg-gold flex items-center justify-center"
        >
          <Check className="w-5 h-5 text-charcoal" />
        </motion.div>
      )}

      {isRecommended && !isSelected && (
        <div className="absolute top-3 left-3">
          <span className="px-2.5 py-1 rounded-full bg-gold/90 text-charcoal text-xs font-semibold backdrop-blur-sm">
            Recommended
          </span>
        </div>
      )}

      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-charcoal via-charcoal/80 to-transparent p-4 pt-12">
        <h3 className="font-medium text-white truncate">{item.name}</h3>
        <div className="flex items-center gap-2 mt-1 text-white/70 text-sm">
          <Calendar className="w-3.5 h-3.5" />
          {item.lastWorn ? (
            <span>Worn {formatDistanceToNow(new Date(item.lastWorn), { addSuffix: true })}</span>
          ) : (
            <span>Never worn</span>
          )}
        </div>

        {showActions && (
          <div className="flex gap-2 mt-3 opacity-0 group-hover:opacity-100 transition-opacity">
            {onMarkWorn && (
              <Button
                size="sm"
                variant="secondary"
                onClick={(e) => {
                  e.stopPropagation();
                  onMarkWorn(item.id);
                }}
                className="flex-1 bg-white/20 hover:bg-white/30 text-white border-0"
              >
                Mark as Worn
              </Button>
            )}
            {onDelete && (
              <Button
                size="sm"
                variant="ghost"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(item.id);
                }}
                className="text-white/70 hover:text-destructive hover:bg-destructive/20"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
}
