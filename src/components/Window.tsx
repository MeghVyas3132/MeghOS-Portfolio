import React, { useEffect, useState } from 'react';
import { X, Minimize, Maximize, Maximize2 } from 'lucide-react';
import { WindowState } from '@/types/Desktop';
import { useWindowManager } from '@/contexts/WindowManagerContext';
import { useDraggable } from '@/hooks/useDraggable';

interface WindowProps {
  window: WindowState;
}

export const Window: React.FC<WindowProps> = ({ window }) => {
  const { closeWindow, minimizeWindow, maximizeWindow, focusWindow, updateWindowPosition } = useWindowManager();
  const [isClosing, setIsClosing] = useState(false);
  const [isMinimizing, setIsMinimizing] = useState(false);
  const [isMaximizing, setIsMaximizing] = useState(false);
  
  const { position, isDragging, handleMouseDown, handleMouseMove, handleMouseUp } = useDraggable(
    window.position,
    (newPos) => updateWindowPosition(window.id, newPos)
  );

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
      closeWindow(window.id);
    }, 150); // Match faster animation duration
  };

  const handleMinimize = () => {
    setIsMinimizing(true);
    setTimeout(() => {
      minimizeWindow(window.id);
      setIsMinimizing(false);
    }, 200); // Match faster animation duration
  };

  const handleMaximize = () => {
    setIsMaximizing(true);
    maximizeWindow(window.id);
    setTimeout(() => {
      setIsMaximizing(false);
    }, 150); // Match faster animation duration
  };

  if (window.isMinimized) return null;

  const Component = window.component;

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
        left: window.isMaximized ? 0 : position.x,
        top: window.isMaximized ? 0 : position.y,
        width: window.isMaximized ? '100vw' : window.size.width,
        height: window.isMaximized ? 'calc(100vh - 80px)' : window.size.height,
        zIndex: window.zIndex,
        transform: 'translate3d(0, 0, 0)',
        backfaceVisibility: 'hidden',
        WebkitBackfaceVisibility: 'hidden',
      }}
      onMouseDown={() => focusWindow(window.id)}
    >
      {/* Title Bar */}
      <div
        className="h-10 bg-muted/50 border-b border-border flex items-center justify-between px-4 cursor-grab active:cursor-grabbing select-none"
        onMouseDown={handleMouseDown}
      >
        <span className="text-sm font-medium text-foreground">{window.title}</span>
        <div className="flex gap-2 no-drag">
          <button
            onClick={handleMinimize}
            className="w-6 h-6 rounded-full bg-yellow-500 hover:bg-yellow-600 flex items-center justify-center transition-transform duration-100 hover:scale-110 active:scale-95"
          >
            <Minimize className="w-3 h-3 text-yellow-900 opacity-0 group-hover:opacity-100 transition-opacity" />
          </button>
          <button
            onClick={handleMaximize}
            className="w-6 h-6 rounded-full bg-green-500 hover:bg-green-600 flex items-center justify-center transition-transform duration-100 hover:scale-110 active:scale-95"
          >
            {window.isMaximized ? (
              <Maximize2 className="w-3 h-3 text-green-900 opacity-0 group-hover:opacity-100 transition-opacity" />
            ) : (
              <Maximize className="w-3 h-3 text-green-900 opacity-0 group-hover:opacity-100 transition-opacity" />
            )}
          </button>
          <button
            onClick={handleClose}
            className="w-6 h-6 rounded-full bg-red-500 hover:bg-red-600 flex items-center justify-center transition-transform duration-100 hover:scale-110 active:scale-95 group"
          >
            <X className="w-3 h-3 text-red-900 opacity-0 group-hover:opacity-100 transition-opacity" />
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
