import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type ThemeMode = 'dark' | 'light';

export interface AccentColor {
  name: string;
  value: string;
  light: string;
  description: string;
}

export const accentColors: AccentColor[] = [
  {
    name: 'Gold',
    value: '#d4af37',
    light: '#f4d03f',
    description: 'Premium Gold (Default)',
  },
  {
    name: 'Neon Blue',
    value: '#00d4ff',
    light: '#00e5ff',
    description: 'Electric Blue',
  },
  {
    name: 'Neon Pink',
    value: '#ff006e',
    light: '#ff3d8f',
    description: 'Vibrant Pink',
  },
  {
    name: 'Purple',
    value: '#8b5cf6',
    light: '#a78bfa',
    description: 'Royal Purple',
  },
  {
    name: 'Emerald',
    value: '#10b981',
    light: '#34d399',
    description: 'Emerald Green',
  },
  {
    name: 'Orange',
    value: '#f59e0b',
    light: '#fbbf24',
    description: 'Sunset Orange',
  },
  {
    name: 'Crimson',
    value: '#dc2626',
    light: '#ef4444',
    description: 'Deep Crimson',
  },
  {
    name: 'Cyan',
    value: '#06b6d4',
    light: '#22d3ee',
    description: 'Bright Cyan',
  },
];

interface ThemeContextType {
  mode: ThemeMode;
  accentColor: AccentColor;
  customCursorEnabled: boolean;
  toggleMode: () => void;
  setMode: (mode: ThemeMode) => void;
  setAccentColor: (color: AccentColor) => void;
  toggleCustomCursor: () => void;
  setCustomCursorEnabled: (enabled: boolean) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [mode, setModeState] = useState<ThemeMode>(() => {
    const saved = localStorage.getItem('theme-mode');
    return (saved as ThemeMode) || 'dark';
  });

  const [accentColor, setAccentColorState] = useState<AccentColor>(() => {
    const saved = localStorage.getItem('accent-color');
    if (saved) {
      const parsed = JSON.parse(saved);
      return accentColors.find(c => c.name === parsed.name) || accentColors[0];
    }
    return accentColors[0];
  });

  const [customCursorEnabled, setCustomCursorEnabledState] = useState<boolean>(() => {
    const saved = localStorage.getItem('custom-cursor-enabled');
    return saved ? JSON.parse(saved) : false; // Default to false for better compatibility
  });

  useEffect(() => {
    const root = document.documentElement;
    
    // Apply theme mode
    if (mode === 'dark') {
      root.classList.add('dark');
      root.classList.remove('light');
    } else {
      root.classList.add('light');
      root.classList.remove('dark');
    }

    // Apply accent color
    const primaryColor = accentColor.value;
    const primaryLight = accentColor.light;

    root.style.setProperty('--primary', primaryColor);
    root.style.setProperty('--accent', primaryColor);
    root.style.setProperty('--ring', primaryColor);
    root.style.setProperty('--chart-1', primaryColor);
    root.style.setProperty('--sidebar-primary', primaryColor);
    root.style.setProperty('--sidebar-ring', primaryColor);
    
    // Update border with opacity
    const rgb = hexToRgb(primaryColor);
    if (rgb) {
      root.style.setProperty('--border', `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.1)`);
      root.style.setProperty('--input', `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.1)`);
      root.style.setProperty('--sidebar-border', `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.1)`);
    }

    // Save preferences
    localStorage.setItem('theme-mode', mode);
    localStorage.setItem('accent-color', JSON.stringify(accentColor));
  }, [mode, accentColor]);

  useEffect(() => {
    // Save cursor preference
    localStorage.setItem('custom-cursor-enabled', JSON.stringify(customCursorEnabled));
  }, [customCursorEnabled]);

  const toggleMode = () => {
    setModeState(prev => prev === 'dark' ? 'light' : 'dark');
  };

  const setMode = (newMode: ThemeMode) => {
    setModeState(newMode);
  };

  const setAccentColor = (color: AccentColor) => {
    setAccentColorState(color);
  };

  const toggleCustomCursor = () => {
    setCustomCursorEnabledState(prev => !prev);
  };

  const setCustomCursorEnabled = (enabled: boolean) => {
    setCustomCursorEnabledState(enabled);
  };

  return (
    <ThemeContext.Provider 
      value={{ 
        mode, 
        accentColor, 
        customCursorEnabled,
        toggleMode, 
        setMode, 
        setAccentColor,
        toggleCustomCursor,
        setCustomCursorEnabled
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

// Helper function to convert hex to rgb
function hexToRgb(hex: string) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}
