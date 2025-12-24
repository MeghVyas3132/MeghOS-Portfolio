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
      className="group relative p-2 sm:p-3 rounded-xl hover:bg-white/10 active:bg-white/20 transition-all duration-150 hover:scale-110 active:scale-95 will-change-transform"
      title={app.name}
    >
      <Icon className="w-6 h-6 sm:w-8 sm:h-8 text-white/80 group-hover:text-primary transition-colors duration-150" />
      <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-black/70 backdrop-blur-md px-3 py-1 rounded-md text-xs text-white opacity-0 group-hover:opacity-100 transition-opacity duration-150 pointer-events-none whitespace-nowrap border border-white/10 hidden sm:block">
        {app.name}
      </div>
    </button>
  );
};

export const Dock: React.FC<{ apps: AppInfo[] }> = ({ apps }) => {
  const { openWindow, windows } = useWindowManager();

  return (
    <div className="fixed bottom-2 left-1/2 -translate-x-1/2 z-50 max-w-[95vw]">
      <div className="dock-glass rounded-2xl p-1.5 sm:p-2 shadow-2xl animate-slide-up">
        <div className="flex items-center gap-0.5 sm:gap-1">
          {apps.map(app => (
            <DockApp key={app.id} app={app} onClick={() => openWindow(app)} />
          ))}
          
          {windows.length > 0 && (
            <>
              <div className="w-px h-6 sm:h-8 bg-white/20 mx-0.5 sm:mx-1" />
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
                    <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
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
