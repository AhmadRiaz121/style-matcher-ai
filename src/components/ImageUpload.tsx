import { useCallback, useRef } from 'react';
import { motion } from 'framer-motion';
import { Upload, Camera, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ImageUploadProps {
  onImageSelect: (imageUrl: string) => void;
  currentImage?: string;
  onRemove?: () => void;
  label?: string;
  aspectRatio?: 'square' | 'portrait';
  className?: string;
}

export function ImageUpload({
  onImageSelect,
  currentImage,
  onRemove,
  label = 'Upload Image',
  aspectRatio = 'portrait',
  className = '',
}: ImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onImageSelect(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  }, [onImageSelect]);

  const handleClick = () => {
    inputRef.current?.click();
  };

  const aspectClasses = aspectRatio === 'square' ? 'aspect-square' : 'aspect-[3/4]';

  return (
    <div className={className}>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />
      
      {currentImage ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className={`relative ${aspectClasses} rounded-xl overflow-hidden group`}
        >
          <img
            src={currentImage}
            alt="Uploaded"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-charcoal/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="absolute bottom-3 left-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              size="sm"
              variant="secondary"
              onClick={handleClick}
              className="flex-1 bg-background/90 backdrop-blur-sm"
            >
              <Camera className="w-4 h-4 mr-1" />
              Change
            </Button>
            {onRemove && (
              <Button
                size="sm"
                variant="destructive"
                onClick={onRemove}
                className="bg-destructive/90 backdrop-blur-sm"
              >
                <X className="w-4 h-4" />
              </Button>
            )}
          </div>
        </motion.div>
      ) : (
        <motion.button
          onClick={handleClick}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className={`${aspectClasses} w-full rounded-xl border-2 border-dashed border-gold/30 bg-muted/30 hover:bg-muted/50 hover:border-gold/50 transition-all flex flex-col items-center justify-center gap-3 cursor-pointer group`}
        >
          <div className="w-14 h-14 rounded-full bg-gold/10 group-hover:bg-gold/20 flex items-center justify-center transition-colors">
            <Upload className="w-6 h-6 text-gold" />
          </div>
          <span className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors">
            {label}
          </span>
        </motion.button>
      )}
    </div>
  );
}
