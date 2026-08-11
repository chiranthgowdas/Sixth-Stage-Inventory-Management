import { useEffect, useState } from 'react';
import { motion } from 'motion/react';

interface CustomCursorProps {
  enabled?: boolean;
}

export function CustomCursor({ enabled = false }: CustomCursorProps) {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Always ensure cursor is visible by default
    document.body.classList.remove('custom-cursor-enabled');
    
    // Enable/disable custom cursor globally
    if (enabled) {
      document.body.classList.add('custom-cursor-enabled');
    }

    return () => {
      document.body.classList.remove('custom-cursor-enabled');
    };
  }, [enabled]);

  useEffect(() => {
    if (!enabled) return; // Don't attach listeners if disabled

    const updateMousePosition = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
      setIsVisible(true);
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.tagName === 'BUTTON' ||
        target.tagName === 'A' ||
        target.tagName === 'INPUT' ||
        target.closest('button') ||
        target.closest('a') ||
        target.closest('input')
      ) {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    window.addEventListener('mousemove', updateMousePosition);
    window.addEventListener('mouseover', handleMouseOver);
    document.body.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('mousemove', updateMousePosition);
      window.removeEventListener('mouseover', handleMouseOver);
      document.body.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [enabled]);

  // Don't render if custom cursor is disabled
  if (!enabled || !isVisible) return null;

  return (
    <>
      <motion.div
        className="fixed top-0 left-0 w-8 h-8 rounded-full pointer-events-none z-[9999] mix-blend-difference"
        style={{
          background: `radial-gradient(circle, var(--primary) 0%, color-mix(in srgb, var(--primary) 20%, transparent) 70%, transparent 100%)`,
          boxShadow: `0 0 20px color-mix(in srgb, var(--primary) 60%, transparent)`,
        }}
        animate={{
          x: mousePosition.x - 16,
          y: mousePosition.y - 16,
          scale: isHovering ? 1.5 : 1,
        }}
        transition={{
          type: 'spring',
          stiffness: 500,
          damping: 28,
          mass: 0.5,
        }}
      />
      <motion.div
        className="fixed top-0 left-0 w-1 h-1 rounded-full pointer-events-none z-[9999]"
        style={{ backgroundColor: 'var(--primary)' }}
        animate={{
          x: mousePosition.x - 2,
          y: mousePosition.y - 2,
        }}
        transition={{
          type: 'spring',
          stiffness: 1000,
          damping: 28,
        }}
      />
    </>
  );
}
