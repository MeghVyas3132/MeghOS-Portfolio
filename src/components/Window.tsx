import React, { useEffect } from 'react';
import { X, Minimize, Maximize, Maximize2 } from 'lucide-react';
import { WindowState } from '@/types/desktop';
import { useWindowManager } from '@/contexts/WindowManagerContext';
import { useDraggable } from '@/hooks/useDraggable';

interface WindowProps {
  window: WindowState;
}

export const Window: React.FC<WindowProps> = ({ window }) => {
  const { closeWindow, minimizeWindow, maximizeWindow, focusWindow, updateWindowPosition } = useWindowManager();
  
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

  if (window.isMinimized) return null;

  const Component = window.component;

  return (
    <div
      className={`
        absolute glass-strong rounded-lg shadow-2xl overflow-hidden
        animate-window-open
        ${isDragging ? 'cursor-grabbing' : ''}
      `}
      style={{
        left: window.isMaximized ? 0 : position.x,
        top: window.isMaximized ? 0 : position.y,
        width: window.isMaximized ? '100vw' : window.size.width,
        height: window.isMaximized ? 'calc(100vh - 80px)' : window.size.height,
        zIndex: window.zIndex,
      }}
      onMouseDown={() => focusWindow(window.id)}
    >
      {/* Title Bar */}
      <div
        className="h-10 bg-muted/50 border-b border-border flex items-center justify-between px-4 cursor-grab active:cursor-grabbing"
        onMouseDown={handleMouseDown}
      >
        <span className="text-sm font-medium text-foreground">{window.title}</span>
        <div className="flex gap-2 no-drag">
          <button
            onClick={() => minimizeWindow(window.id)}
            className="w-6 h-6 rounded-full bg-yellow-500 hover:bg-yellow-600 flex items-center justify-center transition-colors"
          >
            <Minimize className="w-3 h-3 text-yellow-900" />
          </button>
          <button
            onClick={() => maximizeWindow(window.id)}
            className="w-6 h-6 rounded-full bg-green-500 hover:bg-green-600 flex items-center justify-center transition-colors"
          >
            {window.isMaximized ? (
              <Maximize2 className="w-3 h-3 text-green-900" />
            ) : (
              <Maximize className="w-3 h-3 text-green-900" />
            )}
          </button>
          <button
            onClick={() => closeWindow(window.id)}
            className="w-6 h-6 rounded-full bg-red-500 hover:bg-red-600 flex items-center justify-center transition-colors"
          >
            <X className="w-3 h-3 text-red-900" />
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
