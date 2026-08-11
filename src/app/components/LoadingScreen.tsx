import { motion } from 'motion/react';
import { Wine } from 'lucide-react';

export function LoadingScreen() {
  return (
    <div className="fixed inset-0 bg-background flex items-center justify-center z-50 overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 opacity-10">
        <div 
          className="absolute inset-0 bg-cover bg-center animate-pulse"
          style={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1648411897425-7713de428509?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiYXIlMjBpbnRlcmlvciUyMGRhcmslMjBlbGVnYW50fGVufDF8fHx8MTc2MDQzNzIxMXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral)',
          }}
        />
      </div>

      <div className="text-center relative z-10">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="mb-4 inline-block relative"
        >
          <motion.div
            animate={{
              boxShadow: [
                '0 0 20px rgba(212, 175, 55, 0.3)',
                '0 0 40px rgba(212, 175, 55, 0.6)',
                '0 0 20px rgba(212, 175, 55, 0.3)',
              ],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
            }}
            className="rounded-full p-4 bg-[#d4af37]/10"
          >
            <Wine className="w-16 h-16 text-[#d4af37]" />
          </motion.div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="neon-text"
        >
          <h2>Sixth Stage</h2>
          <p className="text-muted-foreground mt-2">Loading your inventory...</p>
        </motion.div>
        <motion.div
          className="flex gap-2 justify-center mt-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-2 h-2 rounded-full bg-[#d4af37]"
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 1,
                repeat: Infinity,
                delay: i * 0.2,
              }}
            />
          ))}
        </motion.div>
      </div>
    </div>
  );
}
