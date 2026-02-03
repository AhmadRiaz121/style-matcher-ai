import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Key, Eye, EyeOff, CheckCircle, XCircle, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useGeminiApi } from '@/hooks/useGeminiApi';

interface ApiKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ApiKeyModal({ isOpen, onClose }: ApiKeyModalProps) {
  const { apiKey, setApiKey, validateApiKey } = useGeminiApi();
  const [inputKey, setInputKey] = useState(apiKey);
  const [showKey, setShowKey] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [validationStatus, setValidationStatus] = useState<'idle' | 'valid' | 'invalid'>('idle');

  const handleValidate = async () => {
    if (!inputKey.trim()) return;
    
    setIsValidating(true);
    setValidationStatus('idle');
    
    const isValid = await validateApiKey(inputKey.trim());
    setValidationStatus(isValid ? 'valid' : 'invalid');
    setIsValidating(false);
  };

  const handleSave = () => {
    if (inputKey.trim() && validationStatus === 'valid') {
      setApiKey(inputKey.trim());
      onClose();
    }
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
            <div className="bg-card rounded-2xl shadow-elevated p-8 border border-border w-full max-w-md">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl bg-gradient-gold flex items-center justify-center">
                  <Key className="w-6 h-6 text-charcoal" />
                </div>
                <div>
                  <h2 className="font-display text-2xl font-semibold">API Key Setup</h2>
                  <p className="text-sm text-muted-foreground">Connect your Gemini AI</p>
                </div>
              </div>

              <p className="text-muted-foreground mb-6">
                Enter your Google Gemini API key to enable AI-powered virtual try-on and style recommendations.
              </p>

              <a
                href="https://aistudio.google.com/api-keys"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-gold hover:text-gold-dark transition-colors mb-6"
              >
                <ExternalLink className="w-4 h-4" />
                <span className="text-sm font-medium">Get your API key from Google AI Studio</span>
              </a>

              <div className="space-y-4">
                <div className="relative">
                  <Input
                    type={showKey ? 'text' : 'password'}
                    placeholder="Enter your Gemini API key"
                    value={inputKey}
                    onChange={(e) => {
                      setInputKey(e.target.value);
                      setValidationStatus('idle');
                    }}
                    className="pr-10 h-12"
                  />
                  <button
                    type="button"
                    onClick={() => setShowKey(!showKey)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showKey ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>

                {validationStatus !== 'idle' && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex items-center gap-2 text-sm ${
                      validationStatus === 'valid' ? 'text-green-600' : 'text-destructive'
                    }`}
                  >
                    {validationStatus === 'valid' ? (
                      <CheckCircle className="w-4 h-4" />
                    ) : (
                      <XCircle className="w-4 h-4" />
                    )}
                    <span>
                      {validationStatus === 'valid' 
                        ? 'API key is valid!' 
                        : 'Invalid API key. Please check and try again.'}
                    </span>
                  </motion.div>
                )}

                <div className="flex gap-3 pt-2">
                  <Button
                    variant="outline"
                    onClick={handleValidate}
                    disabled={!inputKey.trim() || isValidating}
                    className="flex-1"
                  >
                    {isValidating ? 'Validating...' : 'Validate'}
                  </Button>
                  <Button
                    variant="gold"
                    onClick={handleSave}
                    disabled={validationStatus !== 'valid'}
                    className="flex-1"
                  >
                    Save Key
                  </Button>
                </div>

                <Button
                  variant="ghost"
                  onClick={onClose}
                  className="w-full mt-2"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
