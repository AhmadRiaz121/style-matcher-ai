import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, CalendarPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Event } from '@/types/wardrobe';
import { format } from 'date-fns';

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

  const handleSubmit = () => {
    if (!name.trim() || !date) return;

    onAdd({
      name: name.trim(),
      date: new Date(date),
      type,
    });

    // Reset form
    setName('');
    setDate(format(new Date(), 'yyyy-MM-dd'));
    setType('casual');
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
