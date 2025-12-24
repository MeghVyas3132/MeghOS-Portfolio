import React, { useState, useEffect } from 'react';
import { Power, Settings, User, Lock, Unlock, LogOut, RefreshCw, Volume2, Sun } from 'lucide-react';
import { useWindowManager } from '@/contexts/WindowManagerContext';
import { useSettings } from '@/contexts/SettingsContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Slider } from '@/components/ui/slider';
import { About } from './apps/About';

interface TopBarProps {
  onEditModeToggle: () => void;
  isEditMode: boolean;
}

export const TopBar: React.FC<TopBarProps> = ({ onEditModeToggle, isEditMode }) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const { brightness, setBrightness } = useSettings();
  const { openWindow } = useWindowManager();

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formattedTime = currentTime.toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
  });

  const formattedDate = currentTime.toLocaleDateString('en-IN', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });

  const handleShutdown = () => {
    // Trigger the landing page to show again
    window.dispatchEvent(new Event('showLanding'));
  };

  const handleRestart = () => {
    if (confirm('Are you sure you want to restart?')) {
      window.location.reload();
    }
  };

  const handleOpenAbout = () => {
    openWindow({
      id: 'about',
      name: 'About Me',
      icon: User,
      component: About,
      defaultSize: { width: 800, height: 600 },
    });
  };

  return (
    <div className="h-8 glass-strong border-b border-border flex items-center justify-between px-2 sm:px-3 relative z-50">
      <div className="flex items-center gap-2 sm:gap-4">
        <span className="text-xs sm:text-sm font-bold text-primary terminal-glow truncate">Megh's Portfolio</span>
      </div>

      <div className="flex items-center gap-2 sm:gap-4">
        <div className="text-[10px] sm:text-xs text-muted-foreground hidden xs:block sm:block">
          <span className="hidden sm:inline">{formattedDate} </span>{formattedTime}
        </div>
        
        <button
          onClick={onEditModeToggle}
          className="p-1 hover:bg-muted/50 rounded transition-colors"
          title={isEditMode ? "Exit Edit Mode" : "Enter Edit Mode"}
        >
          {isEditMode ? (
            <Unlock className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary terminal-glow" />
          ) : (
            <Lock className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-muted-foreground hover:text-primary transition-colors" />
          )}
        </button>
        
        {/* Settings Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="p-1 hover:bg-muted/50 rounded transition-colors">
              <Settings className="w-4 h-4 text-muted-foreground" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-64 glass-strong">
            <div className="p-3 space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Volume2 className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Volume</span>
                  </div>
                  <span className="text-xs text-muted-foreground">Locked</span>
                </div>
                <Slider
                  value={[50]}
                  max={100}
                  step={1}
                  disabled
                  className="w-full opacity-50 cursor-not-allowed"
                />
                <p className="text-[10px] text-muted-foreground">Volume control is disabled</p>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sun className="w-4 h-4 text-primary" />
                    <span className="text-sm">Brightness</span>
                  </div>
                  <span className="text-xs text-muted-foreground">{brightness[0]}%</span>
                </div>
                <Slider
                  value={brightness}
                  onValueChange={setBrightness}
                  max={100}
                  step={1}
                  className="w-full"
                />
                <p className="text-[10px] text-primary">Synced with Settings app</p>
              </div>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* User Button - Opens About Me */}
        <button 
          onClick={handleOpenAbout}
          className="p-1 hover:bg-muted/50 rounded transition-colors"
          title="About Me"
        >
          <User className="w-4 h-4 text-muted-foreground hover:text-primary transition-colors" />
        </button>

        {/* Power Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="p-1 hover:bg-muted/50 rounded transition-colors">
              <Power className="w-4 h-4 text-muted-foreground" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="glass-strong">
            <DropdownMenuItem onClick={handleRestart} className="cursor-pointer">
              <RefreshCw className="w-4 h-4 mr-2" />
              Restart
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleShutdown} className="cursor-pointer text-red-500">
              <LogOut className="w-4 h-4 mr-2" />
              Shut Down
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};
