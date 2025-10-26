import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, RotateCw, Home, Lock } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export const Browser: React.FC = () => {
  const [url, setUrl] = useState('https://example.com');
  const [currentUrl, setCurrentUrl] = useState('https://example.com');

  const handleNavigate = () => {
    setCurrentUrl(url);
  };

  return (
    <div className="h-full flex flex-col bg-background">
      {/* Browser Controls */}
      <div className="flex items-center gap-2 p-2 border-b border-border bg-muted/30">
        <div className="flex gap-1">
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <ArrowRight className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <RotateCw className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <Home className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex-1 flex items-center gap-2">
          <Lock className="h-4 w-4 text-primary" />
          <Input
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleNavigate()}
            className="bg-background/50"
            placeholder="Enter URL"
          />
        </div>
      </div>

      {/* Browser Content */}
      <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-background to-muted/20 p-8">
        <div className="text-center space-y-4 max-w-md">
          <div className="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
            <Lock className="w-8 h-8 text-primary" />
          </div>
          <h3 className="text-xl font-bold">Web Browser</h3>
          <p className="text-muted-foreground">
            This is a demo browser interface. In a real implementation, you could embed websites using iframes or integrate with web APIs.
          </p>
          <div className="glass-strong rounded-lg p-4 mt-4 text-left">
            <p className="text-sm text-muted-foreground mb-2">Current URL:</p>
            <code className="text-sm text-primary terminal-glow break-all">{currentUrl}</code>
          </div>
        </div>
      </div>
    </div>
  );
};
