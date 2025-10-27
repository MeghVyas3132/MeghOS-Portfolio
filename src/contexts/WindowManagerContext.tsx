import React, { createContext, useContext, useState, useCallback } from 'react';
import { WindowState, AppInfo } from '@/types/Desktop';

interface WindowManagerContextType {
  windows: WindowState[];
  openWindow: (app: AppInfo) => void;
  closeWindow: (id: string) => void;
  minimizeWindow: (id: string) => void;
  maximizeWindow: (id: string) => void;
  focusWindow: (id: string) => void;
  updateWindowPosition: (id: string, position: { x: number; y: number }) => void;
  updateWindowSize: (id: string, size: { width: number; height: number }) => void;
}

const WindowManagerContext = createContext<WindowManagerContextType | undefined>(undefined);

export const WindowManagerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [windows, setWindows] = useState<WindowState[]>([]);
  const [nextZIndex, setNextZIndex] = useState(1);

  const openWindow = useCallback((app: AppInfo) => {
    const existingWindow = windows.find(w => w.id === app.id);
    if (existingWindow) {
      focusWindow(app.id);
      if (existingWindow.isMinimized) {
        minimizeWindow(app.id);
      }
      return;
    }

    const newWindow: WindowState = {
      id: app.id,
      title: app.name,
      component: app.component,
      isMinimized: false,
      isMaximized: false,
      position: { 
        x: 50 + windows.length * 30, 
        y: 50 + windows.length * 30 
      },
      size: app.defaultSize || { width: 800, height: 600 },
      zIndex: nextZIndex,
    };

    setWindows(prev => [...prev, newWindow]);
    setNextZIndex(prev => prev + 1);
  }, [windows, nextZIndex]);

  const closeWindow = useCallback((id: string) => {
    setWindows(prev => prev.filter(w => w.id !== id));
  }, []);

  const minimizeWindow = useCallback((id: string) => {
    setWindows(prev => prev.map(w => 
      w.id === id ? { ...w, isMinimized: !w.isMinimized } : w
    ));
  }, []);

  const maximizeWindow = useCallback((id: string) => {
    setWindows(prev => prev.map(w => 
      w.id === id ? { ...w, isMaximized: !w.isMaximized } : w
    ));
  }, []);

  const focusWindow = useCallback((id: string) => {
    setWindows(prev => {
      const maxZ = Math.max(...prev.map(w => w.zIndex), nextZIndex);
      return prev.map(w => 
        w.id === id ? { ...w, zIndex: maxZ + 1 } : w
      );
    });
    setNextZIndex(prev => prev + 1);
  }, [nextZIndex]);

  const updateWindowPosition = useCallback((id: string, position: { x: number; y: number }) => {
    setWindows(prev => prev.map(w => 
      w.id === id ? { ...w, position } : w
    ));
  }, []);

  const updateWindowSize = useCallback((id: string, size: { width: number; height: number }) => {
    setWindows(prev => prev.map(w => 
      w.id === id ? { ...w, size } : w
    ));
  }, []);

  return (
    <WindowManagerContext.Provider value={{
      windows,
      openWindow,
      closeWindow,
      minimizeWindow,
      maximizeWindow,
      focusWindow,
      updateWindowPosition,
      updateWindowSize,
    }}>
      {children}
    </WindowManagerContext.Provider>
  );
};

export const useWindowManager = () => {
  const context = useContext(WindowManagerContext);
  if (!context) {
    throw new Error('useWindowManager must be used within WindowManagerProvider');
  }
  return context;
};
