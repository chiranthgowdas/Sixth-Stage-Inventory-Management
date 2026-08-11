import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Palette, X, Check } from 'lucide-react';
import { Button } from './ui/button';
import { useTheme, accentColors } from '../store/ThemeStore';
import { toast } from 'sonner@2.0.3';

export function QuickThemeToggle() {
  const [isOpen, setIsOpen] = useState(false);
  const { accentColor, setAccentColor } = useTheme();

  return (
    <>
      {/* Floating Button */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        className="fixed bottom-6 right-6 z-50"
      >
        <Button
          size="icon"
          onClick={() => setIsOpen(!isOpen)}
          className="w-14 h-14 rounded-full bg-[var(--primary)] hover:bg-[var(--primary)]/90 text-white shadow-lg neon-glow"
        >
          <Palette className="w-6 h-6" />
        </Button>
      </motion.div>

      {/* Quick Theme Panel */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-40"
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 100 }}
              className="fixed right-6 bottom-24 w-80 glass-effect border border-border rounded-lg shadow-xl z-50 overflow-hidden"
            >
              <div className="p-4 border-b border-border flex items-center justify-between">
                <h3 className="text-[var(--primary)]">Quick Theme</h3>
                <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
                  <X className="w-4 h-4" />
                </Button>
              </div>
              <div className="p-4 space-y-3">
                <p className="text-sm text-muted-foreground">Choose accent color:</p>
                <div className="grid grid-cols-2 gap-2">
                  {accentColors.map((color) => (
                    <motion.button
                      key={color.name}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => {
                        setAccentColor(color);
                        toast.success(`${color.name} theme applied!`);
                      }}
                      className={`p-3 rounded-lg border-2 transition-all text-left ${
                        accentColor.name === color.name
                          ? 'border-[var(--primary)] bg-secondary/50'
                          : 'border-border hover:border-[var(--primary)]/50'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <div
                          className="w-6 h-6 rounded-full flex items-center justify-center"
                          style={{ backgroundColor: color.value }}
                        >
                          {accentColor.name === color.name && (
                            <Check className="w-4 h-4 text-white" />
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-medium">{color.name}</p>
                        </div>
                      </div>
                    </motion.button>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground text-center pt-2">
                  Go to Settings for more options
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
