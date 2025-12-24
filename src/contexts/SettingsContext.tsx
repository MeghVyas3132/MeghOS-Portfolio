import React, { createContext, useContext, useState, useEffect } from 'react';

interface SettingsContextType {
  brightness: number[];
  setBrightness: (value: number[]) => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [brightness, setBrightness] = useState([80]);

  useEffect(() => {
    const savedBrightness = localStorage.getItem('screen_brightness');
    if (savedBrightness) {
      setBrightness([parseInt(savedBrightness)]);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('screen_brightness', brightness[0].toString());
    // Map 0-100 slider value to 15-100 actual brightness
    // This ensures screen is always visible (minimum 15% brightness)
    const actualBrightness = 15 + (brightness[0] * 0.85);
    document.documentElement.style.filter = `brightness(${actualBrightness}%)`;
    
    return () => {
      document.documentElement.style.filter = '';
    };
  }, [brightness]);

  return (
    <SettingsContext.Provider value={{ brightness, setBrightness }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within SettingsProvider');
  }
  return context;
};
