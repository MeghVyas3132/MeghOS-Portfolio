import React from 'react';
import { useWindowManager } from '@/contexts/WindowManagerContext';
import type { AppInfo } from '@/types/Desktop';

interface DockAppProps {
  app: AppInfo & {
    icon: React.ComponentType<{ className?: string }>;
  };
  onClick: () => void;
}

const DockApp: React.FC<DockAppProps> = ({ app, onClick }) => {
  const Icon = app.icon;
  
  return (
    <button
      onClick={onClick}
      className="group relative p-3 glass rounded-xl hover:bg-primary/20 transition-all duration-300 hover:scale-110"
      title={app.name}
    >
      <Icon className="w-8 h-8 text-foreground group-hover:text-primary transition-colors" />
      <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-popover px-3 py-1 rounded-md text-xs opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
        {app.name}
      </div>
    </button>
  );
};

export const Dock: React.FC<{ apps: AppInfo[] }> = ({ apps }) => {
  const { openWindow, windows } = useWindowManager();

  return (
    <div className="fixed bottom-2 left-1/2 -translate-x-1/2 z-50">
      <div className="glass-strong rounded-2xl p-2 shadow-2xl backdrop-blur-xl animate-slide-up">
        <div className="flex items-center gap-2">
          {apps.map(app => (
            <React.Fragment key={app.id}>
              <DockApp app={app} onClick={() => openWindow(app)} />
              {app.id === 'terminal' && (
                <div className="w-px h-8 bg-border/50" />
              )}
            </React.Fragment>
          ))}
          
          {windows.length > 0 && (
            <>
              <div className="w-px h-8 bg-border/50" />
              {windows.map(window => {
                const app = apps.find(a => a.id === window.id);
                if (!app) return null;
                const Icon = app.icon;
                
                return (
                  <div
                    key={window.id}
                    className={`
                      p-1 rounded-lg transition-colors
                      ${!window.isMinimized ? 'bg-primary/20' : 'bg-muted/20'}
                    `}
                  >
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                );
              })}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
