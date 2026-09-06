/**
 * SMANV EduERP Theme Context
 * Manages Light / Dark mode and Material Design 3 tokens
 * Developed by SMANV Info Tech Private Limited
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useColorScheme } from 'react-native';
import { Colors, ThemeColors } from '../constants/Colors';
import { getSecureItem, setSecureItem } from '../services/storage';

interface ThemeContextType {
  isDarkMode: boolean;
  colors: ThemeColors;
  toggleTheme: () => void;
  setThemeMode: (mode: 'light' | 'dark' | 'system') => void;
}

const ThemeContext = createContext<ThemeContextType>({
  isDarkMode: false,
  colors: Colors.light,
  toggleTheme: () => {},
  setThemeMode: () => {},
});

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const systemScheme = useColorScheme();
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);

  useEffect(() => {
    // Load saved theme preference
    getSecureItem('smanv_theme_mode').then((saved) => {
      if (saved === 'dark') {
        setIsDarkMode(true);
      } else if (saved === 'light') {
        setIsDarkMode(false);
      } else {
        setIsDarkMode(systemScheme === 'dark');
      }
    });
  }, [systemScheme]);

  const toggleTheme = () => {
    const next = !isDarkMode;
    setIsDarkMode(next);
    setSecureItem('smanv_theme_mode', next ? 'dark' : 'light');
  };

  const setThemeMode = (mode: 'light' | 'dark' | 'system') => {
    if (mode === 'system') {
      setIsDarkMode(systemScheme === 'dark');
      setSecureItem('smanv_theme_mode', 'system');
    } else {
      const isDark = mode === 'dark';
      setIsDarkMode(isDark);
      setSecureItem('smanv_theme_mode', mode);
    }
  };

  const colors = isDarkMode ? Colors.dark : Colors.light;

  return (
    <ThemeContext.Provider value={{ isDarkMode, colors, toggleTheme, setThemeMode }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
