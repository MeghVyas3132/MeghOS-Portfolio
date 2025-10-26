import React, { useState } from 'react';
import { Folder, File, ChevronRight, Home } from 'lucide-react';

interface FileItem {
  name: string;
  type: 'folder' | 'file';
  children?: FileItem[];
  content?: string;
}

const FILE_SYSTEM: FileItem[] = [
  {
    name: 'home',
    type: 'folder',
    children: [
      {
        name: 'projects',
        type: 'folder',
        children: [
          { name: 'kubernetes-cluster', type: 'folder' },
          { name: 'docker-compose-stack', type: 'folder' },
          { name: 'terraform-infrastructure', type: 'folder' },
        ],
      },
      {
        name: 'scripts',
        type: 'folder',
        children: [
          { name: 'deploy.sh', type: 'file', content: '#!/bin/bash\necho "Deploying application..."' },
          { name: 'backup.sh', type: 'file', content: '#!/bin/bash\necho "Running backup..."' },
        ],
      },
      {
        name: 'Documents',
        type: 'folder',
        children: [
          { name: 'resume.pdf', type: 'file' },
          { name: 'certificates', type: 'folder' },
        ],
      },
    ],
  },
];

export const FileManager: React.FC = () => {
  const [currentPath, setCurrentPath] = useState<string[]>(['home']);
  const [selectedFile, setSelectedFile] = useState<FileItem | null>(null);

  const getCurrentFolder = (): FileItem | null => {
    let current: FileItem | undefined = FILE_SYSTEM[0];
    
    for (let i = 1; i < currentPath.length; i++) {
      if (!current?.children) return null;
      current = current.children.find(item => item.name === currentPath[i]);
      if (!current) return null;
    }
    
    return current || null;
  };

  const currentFolder = getCurrentFolder();

  const handleItemClick = (item: FileItem) => {
    if (item.type === 'folder') {
      setCurrentPath([...currentPath, item.name]);
      setSelectedFile(null);
    } else {
      setSelectedFile(item);
    }
  };

  const navigateUp = () => {
    if (currentPath.length > 1) {
      setCurrentPath(currentPath.slice(0, -1));
      setSelectedFile(null);
    }
  };

  return (
    <div className="h-full flex">
      {/* File Browser */}
      <div className="w-2/3 border-r border-border flex flex-col">
        {/* Path Bar */}
        <div className="border-b border-border p-3 flex items-center gap-2 bg-muted/20">
          <Home className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm font-mono text-foreground">/{currentPath.join('/')}</span>
        </div>

        {/* File List */}
        <div className="flex-1 overflow-auto p-4">
          {currentPath.length > 1 && (
            <button
              onClick={navigateUp}
              className="w-full flex items-center gap-3 p-3 hover:bg-muted/50 rounded-lg transition-colors text-left"
            >
              <Folder className="w-5 h-5 text-primary" />
              <span className="font-medium">..</span>
            </button>
          )}
          
          {currentFolder?.children?.map((item, index) => (
            <button
              key={index}
              onClick={() => handleItemClick(item)}
              className={`
                w-full flex items-center gap-3 p-3 hover:bg-muted/50 rounded-lg transition-colors text-left
                ${selectedFile?.name === item.name ? 'bg-primary/10' : ''}
              `}
            >
              {item.type === 'folder' ? (
                <Folder className="w-5 h-5 text-primary" />
              ) : (
                <File className="w-5 h-5 text-accent" />
              )}
              <span className="font-medium">{item.name}</span>
              {item.type === 'folder' && (
                <ChevronRight className="w-4 h-4 ml-auto text-muted-foreground" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* File Preview */}
      <div className="flex-1 p-6 bg-black/30">
        {selectedFile ? (
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <File className="w-6 h-6 text-accent" />
              <h3 className="text-lg font-semibold">{selectedFile.name}</h3>
            </div>
            
            {selectedFile.content && (
              <pre className="p-4 bg-black/50 rounded-lg font-mono text-sm text-primary terminal-glow overflow-auto">
                {selectedFile.content}
              </pre>
            )}
          </div>
        ) : (
          <div className="h-full flex items-center justify-center text-muted-foreground">
            <p>Select a file to preview</p>
          </div>
        )}
      </div>
    </div>
  );
};
