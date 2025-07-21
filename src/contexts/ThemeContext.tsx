import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';

import { parseINIString } from '../utils/ini';
import { renderThemeGraphics } from '../utils/themeGraphics';

async function loadTheme(themeUrl: string): Promise<Record<string, string>> {
  const response = await fetch(themeUrl);
  const themeIni = await response.text();
  const theme = parseINIString(themeIni);
  const colors = theme['Control Panel\\Colors'];

  if (!colors || typeof colors !== 'object') {
    throw new Error('Invalid theme file: missing [Control Panel\\Colors] section.');
  }

  const cssProperties: Record<string, string> = {};
  for (const key in colors) {
    if (!key.match(/\W/)) {
      cssProperties[`--${key}`] = `rgb(${colors[key].split(' ').join(', ')})`;
    }
  }

  return { ...cssProperties, ...renderThemeGraphics(cssProperties) };
}

interface ThemeContextType {
  setTheme: (themeUrl: string) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [theme, setThemeState] = useState<Record<string, string>>({});

  const setTheme = async (themeUrl: string) => {
    const newTheme = await loadTheme(themeUrl);
    setThemeState(newTheme);
  };

  useEffect(() => {
    // Apply the theme to the root element
    Object.entries(theme).forEach(([key, value]) => {
      document.documentElement.style.setProperty(key, value);
    });
  }, [theme]);

  // Load a default theme on mount
  useEffect(() => {
    setTheme('/desktop/Themes/Windows Official/Windows Default.theme');
  }, []);

  return (
    <ThemeContext.Provider value={{ setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
