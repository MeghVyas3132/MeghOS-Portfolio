import React, { useEffect, useState } from 'react';
import { X, Minimize, Maximize, Maximize2 } from 'lucide-react';
import { WindowState } from '@/types/Desktop';
import { useWindowManager } from '@/contexts/WindowManagerContext';
import { useDraggable } from '@/hooks/useDraggable';

interface WindowProps {
  window: WindowState;
}

// Check if mobile
const isMobile = () => typeof window !== 'undefined' && window.innerWidth < 640;

export const Window: React.FC<WindowProps> = ({ window: windowState }) => {
  const { closeWindow, minimizeWindow, maximizeWindow, focusWindow, updateWindowPosition } = useWindowManager();
  const [isClosing, setIsClosing] = useState(false);
  const [isMinimizing, setIsMinimizing] = useState(false);
  const [isMaximizing, setIsMaximizing] = useState(false);
  const [mobile, setMobile] = useState(isMobile());
  
  const { position, isDragging, handleMouseDown, handleMouseMove, handleMouseUp } = useDraggable(
    windowState.position,
    (newPos) => updateWindowPosition(windowState.id, newPos)
  );

  useEffect(() => {
    const checkMobile = () => setMobile(isMobile());
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp]);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      closeWindow(windowState.id);
    }, 150);
  };

  const handleMinimize = () => {
    setIsMinimizing(true);
    setTimeout(() => {
      minimizeWindow(windowState.id);
      setIsMinimizing(false);
    }, 200);
  };

  const handleMaximize = () => {
    setIsMaximizing(true);
    maximizeWindow(windowState.id);
    setTimeout(() => {
      setIsMaximizing(false);
    }, 150);
  };

  if (windowState.isMinimized) return null;

  const Component = windowState.component;
  
  // On mobile, always show fullscreen
  const isFullscreen = mobile || windowState.isMaximized;

  return (
    <div
      className={`
        absolute rounded-lg shadow-2xl overflow-hidden will-change-transform
        ${isDragging ? 'glass-dragging cursor-grabbing' : 'glass-strong'}
        ${isClosing ? 'animate-window-close' : ''}
        ${isMinimizing ? 'animate-window-minimize' : ''}
        ${isMaximizing ? 'animate-window-maximize' : ''}
        ${!isClosing && !isMinimizing && !isMaximizing ? 'animate-window-open' : ''}
      `}
      style={{
        left: isFullscreen ? 0 : position.x,
        top: isFullscreen ? 0 : position.y,
        width: isFullscreen ? '100vw' : windowState.size.width,
        height: isFullscreen ? 'calc(100vh - 80px)' : windowState.size.height,
        zIndex: windowState.zIndex,
        transform: 'translate3d(0, 0, 0)',
        backfaceVisibility: 'hidden',
        WebkitBackfaceVisibility: 'hidden',
      }}
      onMouseDown={() => focusWindow(windowState.id)}
    >
      {/* Title Bar */}
      <div
        className="h-10 bg-muted/50 border-b border-border flex items-center justify-between px-3 sm:px-4 cursor-grab active:cursor-grabbing select-none"
        onMouseDown={mobile ? undefined : handleMouseDown}
      >
        <span className="text-xs sm:text-sm font-medium text-foreground truncate max-w-[50%]">{windowState.title}</span>
        <div className="flex gap-1.5 sm:gap-2 no-drag">
          <button
            onClick={handleMinimize}
            className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-yellow-500 hover:bg-yellow-600 flex items-center justify-center transition-transform duration-100 hover:scale-110 active:scale-95 group"
          >
            <Minimize className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-yellow-900 opacity-0 group-hover:opacity-100 transition-opacity" />
          </button>
          <button
            onClick={handleMaximize}
            className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-green-500 hover:bg-green-600 flex items-center justify-center transition-transform duration-100 hover:scale-110 active:scale-95 group hidden sm:flex"
          >
            {windowState.isMaximized ? (
              <Maximize2 className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-green-900 opacity-0 group-hover:opacity-100 transition-opacity" />
            ) : (
              <Maximize className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-green-900 opacity-0 group-hover:opacity-100 transition-opacity" />
            )}
          </button>
          <button
            onClick={handleClose}
            className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-red-500 hover:bg-red-600 flex items-center justify-center transition-transform duration-100 hover:scale-110 active:scale-95 group"
          >
            <X className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-red-900 opacity-0 group-hover:opacity-100 transition-opacity" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="h-[calc(100%-2.5rem)] bg-background/95 overflow-auto">
        <Component />
      </div>
    </div>
  );
};
