import { motion } from 'framer-motion';
import { Shirt, Wand2, Calendar, Settings, ShoppingBag } from 'lucide-react';

type TabId = 'wardrobe' | 'tryon' | 'shop' | 'events' | 'settings';

interface NavigationProps {
  activeTab: TabId;
  onTabChange: (tab: TabId) => void;
}

const tabs: { id: TabId; label: string; icon: React.ReactNode }[] = [
  { id: 'wardrobe', label: 'Wardrobe', icon: <Shirt className="w-5 h-5" /> },
  { id: 'tryon', label: 'Try On', icon: <Wand2 className="w-5 h-5" /> },
  { id: 'shop', label: 'Shop', icon: <ShoppingBag className="w-5 h-5" /> },
  { id: 'events', label: 'Events', icon: <Calendar className="w-5 h-5" /> },
  { id: 'settings', label: 'Settings', icon: <Settings className="w-5 h-5" /> },
];

export function Navigation({ activeTab, onTabChange }: NavigationProps) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 glass-panel border-t border-border safe-area-pb md:relative md:bottom-auto md:border-t-0 md:border-b">
      <div className="container mx-auto px-4">
        <div className="flex justify-around md:justify-center md:gap-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className="relative flex flex-col items-center gap-1 py-3 px-4 text-sm transition-colors md:flex-row md:gap-2 md:py-4"
            >
              <span className={activeTab === tab.id ? 'text-indigo-600' : 'text-muted-foreground'}>
                {tab.icon}
              </span>
              <span className={`font-medium ${activeTab === tab.id ? 'text-foreground' : 'text-muted-foreground'}`}>
                {tab.label}
              </span>
              {activeTab === tab.id && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute bottom-0 left-1/2 -translate-x-1/2 w-12 h-0.5 bg-indigo-600 rounded-full md:bottom-2"
                />
              )}
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
}
