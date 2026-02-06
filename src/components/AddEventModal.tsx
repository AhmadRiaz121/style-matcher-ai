import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, CalendarPlus, Sparkles, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Event, ClothingItem } from '@/types/wardrobe';
import { format } from 'date-fns';
import { useGeminiApi } from '@/hooks/useGeminiApi';
import { useWardrobe } from '@/hooks/useWardrobe';

interface AddEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (event: Omit<Event, 'id'>) => void;
}

const eventTypes: { value: Event['type']; label: string }[] = [
  { value: 'casual', label: 'Casual' },
  { value: 'formal', label: 'Formal' },
  { value: 'business', label: 'Business' },
  { value: 'party', label: 'Party' },
  { value: 'outdoor', label: 'Outdoor' },
  { value: 'other', label: 'Other' },
];

export function AddEventModal({ isOpen, onClose, onAdd }: AddEventModalProps) {
  const [name, setName] = useState('');
  const [date, setDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [type, setType] = useState<Event['type']>('casual');
  const [suggestions, setSuggestions] = useState<string>('');
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);
  const { apiKey, hasApiKey } = useGeminiApi();
  const { clothes } = useWardrobe();

  // Generate outfit suggestions based on event type
  const generateSuggestions = async (eventType: Event['type'], eventName: string) => {
    if (!hasApiKey || !apiKey || clothes.length === 0) {
      return;
    }

    setIsLoadingSuggestions(true);
    try {
      const wardrobeList = clothes.map((c, idx) =>
        `${idx}: ${c.name} (${c.category}${c.color ? `, ${c.color}` : ''})`
      ).join('\n');

      const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-lite-latest:generateContent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-goog-api-key': apiKey,
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `You are a fashion stylist AI. The user is planning for a "${eventName}" event (type: ${eventType}).

Here is their current wardrobe with item numbers:
${wardrobeList}

Based on their wardrobe, suggest 2-3 complete outfit combinations that would be perfect for this ${eventType} event.

IMPORTANT: Return ONLY a JSON array in this exact format:
[
  {
    "name": "Outfit name",
    "items": [0, 2, 5],
    "tip": "One sentence styling tip"
  }
]

The "items" array should contain the item numbers from the wardrobe list above. Only use numbers that exist in the list.
Return ONLY valid JSON, no other text.`
            }]
          }],
          generationConfig: {
            temperature: 0.4,
            topK: 20,
            topP: 0.8,
            maxOutputTokens: 512,
          }
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';

        // Extract JSON from response
        const jsonMatch = text.match(/\[[\s\S]*\]/);
        if (jsonMatch) {
          const outfits = JSON.parse(jsonMatch[0]);
          setSuggestions(JSON.stringify(outfits));
        } else {
          setSuggestions('');
        }
      }
    } catch (error) {
      console.error('Suggestion generation error:', error);
      setSuggestions('');
    } finally {
      setIsLoadingSuggestions(false);
    }
  };

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setName('');
      setDate(format(new Date(), 'yyyy-MM-dd'));
      setType('casual');
      setSuggestions('');
      setIsLoadingSuggestions(false);
    }
  }, [isOpen]);

  // Generate suggestions when event type or name changes
  useEffect(() => {
    if (isOpen && name && type && hasApiKey && clothes.length > 0) {
      const debounceTimer = setTimeout(() => {
        generateSuggestions(type, name);
      }, 500);
      return () => clearTimeout(debounceTimer);
    } else {
      setSuggestions('');
    }
  }, [type, name, hasApiKey, clothes.length, isOpen]);

  const handleSubmit = () => {
    if (!name.trim() || !date) return;

    onAdd({
      name: name.trim(),
      date: new Date(date),
      type,
    });

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
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="bg-card rounded-2xl shadow-elevated p-6 border border-border w-full max-w-md">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-gold flex items-center justify-center">
                    <CalendarPlus className="w-5 h-5 text-charcoal" />
                  </div>
                  <h2 className="font-display text-2xl font-semibold">Add Event</h2>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 rounded-full hover:bg-muted transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="eventName">Event Name</Label>
                  <Input
                    id="eventName"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g., Wedding, Interview, Date Night"
                    className="mt-1.5"
                  />
                </div>

                <div>
                  <Label htmlFor="eventDate">Date</Label>
                  <Input
                    id="eventDate"
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    min={format(new Date(), 'yyyy-MM-dd')}
                    className="mt-1.5"
                  />
                </div>

                <div>
                  <Label htmlFor="eventType">Event Type</Label>
                  <Select value={type} onValueChange={(v) => setType(v as Event['type'])}>
                    <SelectTrigger className="mt-1.5">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {eventTypes.map((et) => (
                        <SelectItem key={et.value} value={et.value}>
                          {et.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Outfit Suggestions */}
              {hasApiKey && clothes.length > 0 && (
                <div className="mt-6 p-4 rounded-xl bg-muted/30 border border-border">
                  <div className="flex items-center gap-2 mb-3">
                    <Sparkles className="w-4 h-4 text-gold" />
                    <h3 className="font-medium text-sm">Outfit Suggestions from Your Wardrobe</h3>
                  </div>
                  {isLoadingSuggestions ? (
                    <div className="flex items-center justify-center py-6">
                      <Loader2 className="w-5 h-5 animate-spin text-gold" />
                      <span className="ml-2 text-sm text-muted-foreground">Analyzing your wardrobe...</span>
                    </div>
                  ) : suggestions ? (
                    <div className="space-y-4 max-h-96 overflow-y-auto">
                      {(() => {
                        try {
                          const outfits = JSON.parse(suggestions);
                          return outfits.map((outfit: any, idx: number) => (
                            <div key={idx} className="p-3 rounded-lg bg-background/50 border border-border/50">
                              <h4 className="font-medium text-sm mb-2 flex items-center gap-2">
                                <span className="text-gold">✨</span>
                                {outfit.name}
                              </h4>
                              <div className="flex gap-2 mb-2 overflow-x-auto pb-2">
                                {outfit.items?.map((itemIdx: number) => {
                                  const item = clothes[itemIdx];
                                  if (!item) return null;
                                  return (
                                    <div key={itemIdx} className="flex-shrink-0 w-20">
                                      <div className="aspect-[3/4] rounded-lg overflow-hidden bg-muted mb-1">
                                        <img
                                          src={item.imageUrl}
                                          alt={item.name}
                                          className="w-full h-full object-cover"
                                        />
                                      </div>
                                      <p className="text-xs text-center text-muted-foreground truncate">
                                        {item.name}
                                      </p>
                                    </div>
                                  );
                                })}
                              </div>
                              {outfit.tip && (
                                <p className="text-xs text-muted-foreground italic">
                                  💡 {outfit.tip}
                                </p>
                              )}
                            </div>
                          ));
                        } catch (e) {
                          return (
                            <p className="text-sm text-muted-foreground">
                              Unable to load suggestions. Please try again.
                            </p>
                          );
                        }
                      })()}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      Enter an event name to get personalized outfit suggestions!
                    </p>
                  )}
                </div>
              )}

              <div className="flex gap-3 mt-6">
                <Button variant="outline" onClick={onClose} className="flex-1">
                  Cancel
                </Button>
                <Button
                  variant="gold"
                  onClick={handleSubmit}
                  disabled={!name.trim() || !date}
                  className="flex-1"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Add Event
                </Button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
