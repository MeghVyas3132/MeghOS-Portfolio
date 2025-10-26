import React, { useState } from 'react';
import { Terminal as TerminalIcon, Image, FolderOpen, User, Globe, Music, Settings } from 'lucide-react';
import { TopBar } from './TopBar';
import { Dock } from './Dock';
import { Window } from './Window';
import { WindowManagerProvider, useWindowManager } from '@/contexts/WindowManagerContext';
import { Terminal } from './apps/Terminal';
import { Photos } from './apps/Photos';
import { FileManager } from './apps/FileManager';
import { About } from './apps/About';
import { Browser } from './apps/Browser';
import { MusicPlayer } from './apps/MusicPlayer';
import { Settings as SettingsApp } from './apps/Settings';
import { EditMode } from './EditMode';
import { AppInfo } from '@/types/desktop';

const APPS: AppInfo[] = [
  {
    id: 'terminal',
    name: 'Terminal',
    icon: TerminalIcon,
    component: Terminal,
    defaultSize: { width: 900, height: 600 },
  },
  {
    id: 'browser',
    name: 'Browser',
    icon: Globe,
    component: Browser,
    defaultSize: { width: 1100, height: 700 },
  },
  {
    id: 'files',
    name: 'Files',
    icon: FolderOpen,
    component: FileManager,
    defaultSize: { width: 900, height: 600 },
  },
  {
    id: 'photos',
    name: 'Photos',
    icon: Image,
    component: Photos,
    defaultSize: { width: 1000, height: 700 },
  },
  {
    id: 'music',
    name: 'Music',
    icon: Music,
    component: MusicPlayer,
    defaultSize: { width: 500, height: 700 },
  },
  {
    id: 'settings',
    name: 'Settings',
    icon: Settings,
    component: SettingsApp,
    defaultSize: { width: 700, height: 600 },
  },
  {
    id: 'about',
    name: 'About Me',
    icon: User,
    component: About,
    defaultSize: { width: 800, height: 600 },
  },
];

const DesktopContent: React.FC = () => {
  const { windows } = useWindowManager();
  const [isEditMode, setIsEditMode] = useState(false);

  return (
    <>
      <div className="h-screen w-full overflow-hidden bg-gradient-to-br from-background via-background to-muted/20">
        <TopBar 
          onEditModeToggle={() => setIsEditMode(!isEditMode)} 
          isEditMode={isEditMode}
        />
        
        {/* Desktop Area */}
        <div className="h-[calc(100vh-2rem)] relative">
          {windows.map((window) => (
            <Window key={window.id} window={window} />
          ))}
        </div>

        <Dock apps={APPS} />
      </div>

      {isEditMode && <EditMode onClose={() => setIsEditMode(false)} />}
    </>
  );
};

export const Desktop: React.FC = () => {
  return (
    <WindowManagerProvider>
      <DesktopContent />
    </WindowManagerProvider>
  );
};
