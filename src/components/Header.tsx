import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

export function Header() {
  return (
    <header className="sticky top-0 z-50 glass-panel border-b border-border">
      <div className="container mx-auto px-4 py-4">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-center gap-3"
        >
          <div className="w-10 h-10 rounded-2xl bg-indigo-600 flex items-center justify-center shadow-soft">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <h1 className="font-display text-2xl font-semibold tracking-tight">
            Style<span className="text-indigo-600">AI</span>
          </h1>
        </motion.div>
      </div>
    </header>
  );
}
