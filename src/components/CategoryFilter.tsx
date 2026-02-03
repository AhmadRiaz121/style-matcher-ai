import { motion } from 'framer-motion';
import { ClothingCategory } from '@/types/wardrobe';
import { Shirt, Footprints, Briefcase, Sparkles } from 'lucide-react';

interface CategoryFilterProps {
  selected: ClothingCategory | 'all';
  onChange: (category: ClothingCategory | 'all') => void;
}

const categories: { id: ClothingCategory | 'all'; label: string; icon: React.ReactNode }[] = [
  { id: 'all', label: 'All Items', icon: <Sparkles className="w-4 h-4" /> },
  { id: 'tops', label: 'Tops', icon: <Shirt className="w-4 h-4" /> },
  { id: 'bottoms', label: 'Bottoms', icon: <Shirt className="w-4 h-4" /> },
  { id: 'suits', label: 'Suits', icon: <Briefcase className="w-4 h-4" /> },
  { id: 'dresses', label: 'Dresses', icon: <Shirt className="w-4 h-4" /> },
  { id: 'outerwear', label: 'Outerwear', icon: <Shirt className="w-4 h-4" /> },
  { id: 'shoes', label: 'Shoes', icon: <Footprints className="w-4 h-4" /> },
  { id: 'accessories', label: 'Accessories', icon: <Sparkles className="w-4 h-4" /> },
];

export function CategoryFilter({ selected, onChange }: CategoryFilterProps) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
      {categories.map((cat) => (
        <motion.button
          key={cat.id}
          onClick={() => onChange(cat.id)}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
            selected === cat.id
              ? 'bg-gradient-gold text-charcoal shadow-gold'
              : 'bg-muted hover:bg-muted/80 text-muted-foreground hover:text-foreground'
          }`}
        >
          {cat.icon}
          {cat.label}
        </motion.button>
      ))}
    </div>
  );
}
