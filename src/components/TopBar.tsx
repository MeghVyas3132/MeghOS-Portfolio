import React, { useState, useEffect } from 'react';
import { Power, Settings, User, Lock, Unlock } from 'lucide-react';
import { useWindowManager } from '@/contexts/WindowManagerContext';

interface TopBarProps {
  onEditModeToggle: () => void;
  isEditMode: boolean;
}

export const TopBar: React.FC<TopBarProps> = ({ onEditModeToggle, isEditMode }) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const { } = useWindowManager();

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formattedTime = currentTime.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });

  const formattedDate = currentTime.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });

  return (
    <div className="h-8 glass-strong border-b border-border flex items-center justify-between px-4 relative z-50">
      <div className="flex items-center gap-4">
        <span className="text-sm font-bold text-primary terminal-glow">Linux Portfolio</span>
      </div>

      <div className="flex items-center gap-4">
        <div className="text-xs text-muted-foreground">
          {formattedDate} {formattedTime}
        </div>
        
        <button
          onClick={onEditModeToggle}
          className="p-1 hover:bg-muted/50 rounded transition-colors"
          title={isEditMode ? "Exit Edit Mode" : "Enter Edit Mode"}
        >
          {isEditMode ? (
            <Unlock className="w-4 h-4 text-primary terminal-glow" />
          ) : (
            <Lock className="w-4 h-4 text-muted-foreground hover:text-primary transition-colors" />
          )}
        </button>
        
        <button className="p-1 hover:bg-muted/50 rounded transition-colors">
          <Settings className="w-4 h-4 text-muted-foreground" />
        </button>
        <button className="p-1 hover:bg-muted/50 rounded transition-colors">
          <User className="w-4 h-4 text-muted-foreground" />
        </button>
        <button className="p-1 hover:bg-muted/50 rounded transition-colors">
          <Power className="w-4 h-4 text-muted-foreground" />
        </button>
      </div>
    </div>
  );
};
