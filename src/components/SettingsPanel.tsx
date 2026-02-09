import { motion } from 'framer-motion';
import { Key, User, Trash2, CheckCircle, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useGeminiApi } from '@/hooks/useGeminiApi';
import { useWardrobe } from '@/hooks/useWardrobe';
import { getSampleClothingWithIds, sampleProfile } from '@/utils/sampleData';
import { useToast } from '@/hooks/use-toast';

interface SettingsPanelProps {
  onOpenApiSettings: () => void;
}

export function SettingsPanel({ onOpenApiSettings }: SettingsPanelProps) {
  const { hasApiKey, setApiKey } = useGeminiApi();
  const { profile, setProfile, clothes } = useWardrobe();
  const { toast } = useToast();

  const handleClearApiKey = () => {
    alert('API keys are now managed server-side in the .env file. Please edit the .env file to update or remove your key.');
  };

  const handleLoadSampleData = () => {
    if (clothes.length > 0) {
      if (!confirm('This will add sample clothing items to your wardrobe. Continue?')) {
        return;
      }
    }

    const sampleClothes = getSampleClothingWithIds();
    const existingClothes = localStorage.getItem('wardrobe-clothes');
    const currentClothes = existingClothes ? JSON.parse(existingClothes) : [];
    
    localStorage.setItem('wardrobe-clothes', JSON.stringify([...currentClothes, ...sampleClothes]));
    localStorage.setItem('wardrobe-profile', JSON.stringify(sampleProfile));
    
    toast({
      title: "✨ Sample Data Loaded!",
      description: `Added ${sampleClothes.length} South Asian clothing items and a profile image.`,
    });
    
    setTimeout(() => window.location.reload(), 1000);
  };

  const handleClearWardrobe = () => {
    if (confirm('Are you sure you want to clear your entire wardrobe? This cannot be undone.')) {
      localStorage.removeItem('wardrobe-clothes');
      localStorage.removeItem('wardrobe-history');
      localStorage.removeItem('wardrobe-events');
      localStorage.removeItem('wardrobe-profile');
      window.location.reload();
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div className="text-center">
        <h2 className="font-display text-3xl font-semibold mb-2">Settings</h2>
        <p className="text-muted-foreground">Manage your account and preferences</p>
      </div>

      {/* API Key Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-6 rounded-3xl bg-card border border-slate-100 shadow-soft"
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center">
            <Key className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-display text-lg font-medium">Gemini API Key</h3>
            <p className="text-sm text-muted-foreground">Required for AI features</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {hasApiKey ? (
            <>
              <div className="flex items-center gap-2 text-accent">
                <CheckCircle className="w-5 h-5" />
                <span className="text-sm font-medium">API Key Connected</span>
              </div>
              <div className="flex gap-2 ml-auto">
                <Button variant="outline" size="sm" onClick={onOpenApiSettings}>
                  Update Key
                </Button>
                <Button variant="ghost" size="sm" onClick={handleClearApiKey} className="text-destructive hover:text-destructive">
                  Remove
                </Button>
              </div>
            </>
          ) : (
            <>
              <span className="text-sm text-muted-foreground">No API key configured</span>
              <Button className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-soft rounded-2xl ml-auto" size="sm" onClick={onOpenApiSettings}>
                Add API Key
              </Button>
            </>
          )}
        </div>
      </motion.div>

      {/* Profile Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="p-6 rounded-3xl bg-card border border-slate-100 shadow-soft"
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center">
            <User className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-display text-lg font-medium">Profile</h3>
            <p className="text-sm text-muted-foreground">Your personal information</p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <Label htmlFor="profileName">Name (optional)</Label>
            <Input
              id="profileName"
              value={profile.name || ''}
              onChange={(e) => setProfile({ ...profile, name: e.target.value })}
              placeholder="Your name"
              className="mt-1.5"
            />
          </div>
        </div>
      </motion.div>

      {/* Sample Data Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="p-6 rounded-3xl bg-gradient-to-br from-indigo-50/50 to-indigo-100/30 border border-indigo-200"
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center">
            <Download className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-display text-lg font-medium">Sample Data</h3>
            <p className="text-sm text-muted-foreground">Try the app with pre-loaded clothing</p>
          </div>
        </div>

        <p className="text-sm text-muted-foreground mb-4">
          Load sample South Asian clothing items (Shalwar Kameez, Anarkali, Dupatta, etc.) 
          and a profile photo to test the virtual try-on features.
        </p>
        
        <Button 
          className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-soft rounded-2xl w-full"
          onClick={handleLoadSampleData}
        >
          <Download className="w-4 h-4 mr-2" />
          Load Sample Wardrobe
        </Button>
      </motion.div>

      {/* Stats Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="p-6 rounded-3xl bg-card border border-slate-100 shadow-soft"
      >
        <h3 className="font-display text-lg font-medium mb-4">Your Wardrobe Stats</h3>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="p-4 rounded-xl bg-muted">
            <p className="text-2xl font-semibold text-indigo-600">{clothes.length}</p>
            <p className="text-sm text-muted-foreground">Total Items</p>
          </div>
          <div className="p-4 rounded-xl bg-muted">
            <p className="text-2xl font-semibold text-indigo-600">
              {new Set(clothes.map(c => c.category)).size}
            </p>
            <p className="text-sm text-muted-foreground">Categories</p>
          </div>
          <div className="p-4 rounded-xl bg-muted">
            <p className="text-2xl font-semibold text-indigo-600">
              {clothes.reduce((sum, c) => sum + c.wearCount, 0)}
            </p>
            <p className="text-sm text-muted-foreground">Total Wears</p>
          </div>
        </div>
      </motion.div>

      {/* Danger Zone */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="p-6 rounded-3xl border border-destructive/30 bg-destructive/5"
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-destructive/20 flex items-center justify-center">
            <Trash2 className="w-5 h-5 text-destructive" />
          </div>
          <div>
            <h3 className="font-display text-lg font-medium text-destructive">Danger Zone</h3>
            <p className="text-sm text-muted-foreground">Irreversible actions</p>
          </div>
        </div>

        <Button
          variant="destructive"
          onClick={handleClearWardrobe}
          className="w-full"
        >
          Clear All Data
        </Button>
        <p className="text-xs text-muted-foreground text-center mt-2">
          This will permanently delete your wardrobe, history, and events.
        </p>
      </motion.div>
    </div>
  );
}
