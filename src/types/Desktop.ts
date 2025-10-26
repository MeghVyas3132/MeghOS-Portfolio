export interface WindowState {
  id: string;
  title: string;
  component: React.ComponentType<any>;
  isMinimized: boolean;
  isMaximized: boolean;
  position: { x: number; y: number };
  size: { width: number; height: number };
  zIndex: number;
}

export interface AppInfo {
  id: string;
  name: string;
  icon: React.ComponentType<any>;
  component: React.ComponentType<any>;
  defaultSize?: { width: number; height: number };
}

export interface TerminalCommand {
  command: string;
  output: string;
}
