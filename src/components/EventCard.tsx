import { motion } from 'framer-motion';
import { Calendar, Clock, Trash2, Shirt, Pencil } from 'lucide-react';
import { Event, ClothingItem } from '@/types/wardrobe';
import { Button } from '@/components/ui/button';
import { format, formatDistanceToNow, isPast, isToday } from 'date-fns';

interface EventCardProps {
  event: Event;
  onDelete?: (id: string) => void;
  onSelectOutfit?: (event: Event) => void;
  onEdit?: (event: Event) => void;
  selectedOutfits?: ClothingItem[];
}

const eventTypeColors: Record<Event['type'], string> = {
  casual: 'bg-blue-100 text-blue-700',
  formal: 'bg-purple-100 text-purple-700',
  business: 'bg-gray-100 text-gray-700',
  party: 'bg-pink-100 text-pink-700',
  outdoor: 'bg-green-100 text-green-700',
  other: 'bg-gold/20 text-gold-dark',
};

export function EventCard({ event, onDelete, onSelectOutfit, onEdit, selectedOutfits }: EventCardProps) {
  const eventDate = new Date(event.date);
  const isPastEvent = isPast(eventDate) && !isToday(eventDate);
  const isTodayEvent = isToday(eventDate);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className={`p-4 rounded-xl border transition-all ${isPastEvent
        ? 'bg-muted/50 border-border opacity-60'
        : isTodayEvent
          ? 'bg-gold/5 border-gold/30 shadow-gold'
          : 'bg-card border-border shadow-soft hover:shadow-card'
        }`}
    >
      <div className="flex items-start justify-between gap-4">
        {/* Outfit thumbnail */}
        {selectedOutfits && selectedOutfits.length > 0 && (
          <div className="flex-shrink-0 flex -space-x-4 overflow-hidden py-1 pl-1">
            {selectedOutfits.map((item, index) => (
              <div
                key={item.id}
                className="w-16 h-20 rounded-lg overflow-hidden border border-border shadow-soft relative z-[1]"
                style={{ zIndex: index }}
              >
                <img
                  src={item.imageUrl}
                  alt={item.name}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        )}

        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${eventTypeColors[event.type]}`}>
              {event.type.charAt(0).toUpperCase() + event.type.slice(1)}
            </span>
            {isTodayEvent && (
              <span className="px-2.5 py-1 rounded-full bg-gold text-charcoal text-xs font-semibold">
                Today!
              </span>
            )}
          </div>

          <h3 className="font-medium text-lg">{event.name}</h3>

          <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4" />
              <span>{format(eventDate, 'MMM d, yyyy')}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock className="w-4 h-4" />
              <span>
                {isPastEvent
                  ? 'Passed'
                  : formatDistanceToNow(eventDate, { addSuffix: true })}
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          {!isPastEvent && onSelectOutfit && (
            <Button
              size="sm"
              variant="elegant"
              onClick={() => onSelectOutfit(event)}
              className="whitespace-nowrap"
            >
              <Shirt className="w-4 h-4 mr-1" />
              {(event.outfitId || (event.outfitIds && event.outfitIds.length > 0)) ? 'Change Outfit' : 'Plan Outfit'}
            </Button>
          )}
          <div className="flex gap-1">
            {onEdit && (
              <Button
                size="sm"
                variant="ghost"
                onClick={() => onEdit(event)}
                className="text-muted-foreground hover:text-foreground"
              >
                <Pencil className="w-4 h-4" />
              </Button>
            )}
            {onDelete && (
              <Button
                size="sm"
                variant="ghost"
                onClick={() => onDelete(event.id)}
                className="text-muted-foreground hover:text-destructive"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
