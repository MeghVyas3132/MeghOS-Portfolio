import React, { useState, useRef } from 'react';
import { ArrowLeft, ArrowRight, RotateCw, Home, Search, ExternalLink, Youtube, Globe, Music2, FileText, Code } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

// Sites that CAN be embedded in iframes
const EMBEDDABLE_SITES = [
  { name: 'Wikipedia', url: 'https://en.m.wikipedia.org', icon: FileText },
  { name: 'MDN Docs', url: 'https://developer.mozilla.org', icon: Code },
];

// Popular sites that CANNOT be embedded (will open in new tab)
const EXTERNAL_SITES = [
  { name: 'YouTube', url: 'https://youtube.com', icon: Youtube, color: 'text-red-500' },
  { name: 'Google', url: 'https://google.com', icon: Search, color: 'text-blue-500' },
  { name: 'Spotify', url: 'https://open.spotify.com', icon: Music2, color: 'text-green-500' },
];

// Sites known to block iframes
const BLOCKED_DOMAINS = [
  'youtube.com', 'www.youtube.com', 'google.com', 'www.google.com',
  'facebook.com', 'twitter.com', 'x.com', 'instagram.com',
  'linkedin.com', 'github.com', 'spotify.com', 'open.spotify.com',
  'netflix.com', 'amazon.com', 'reddit.com'
];

export const Browser: React.FC = () => {
  const [url, setUrl] = useState('');
  const [currentUrl, setCurrentUrl] = useState('');
  const [displayUrl, setDisplayUrl] = useState('');
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [isLoading, setIsLoading] = useState(false);
  const [showHomePage, setShowHomePage] = useState(true);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const isBlockedDomain = (urlString: string): boolean => {
    try {
      const urlObj = new URL(urlString);
      return BLOCKED_DOMAINS.some(domain => urlObj.hostname.includes(domain));
    } catch {
      return false;
    }
  };

  const formatUrl = (inputUrl: string): string => {
    let formatted = inputUrl.trim();
    
    if (!formatted) return '';
    
    // If it looks like a search query, use DuckDuckGo
    if (!formatted.includes('.') || formatted.includes(' ')) {
      return `https://duckduckgo.com/?q=${encodeURIComponent(formatted)}`;
    }
    
    // Add https:// if no protocol
    if (!formatted.startsWith('http://') && !formatted.startsWith('https://')) {
      formatted = 'https://' + formatted;
    }
    
    return formatted;
  };

  const handleNavigate = (newUrl?: string) => {
    const targetUrl = formatUrl(newUrl || url);
    if (!targetUrl) return;
    
    // Check if it's a blocked domain
    if (isBlockedDomain(targetUrl)) {
      window.open(targetUrl, '_blank', 'noopener,noreferrer');
      return;
    }
    
    setIsLoading(true);
    setShowHomePage(false);
    setCurrentUrl(targetUrl);
    setDisplayUrl(targetUrl);
    setUrl(targetUrl);
    
    // Update history
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(targetUrl);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  };

  const handleBack = () => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      setCurrentUrl(history[newIndex]);
      setDisplayUrl(history[newIndex]);
      setUrl(history[newIndex]);
      setShowHomePage(false);
    }
  };

  const handleForward = () => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      setCurrentUrl(history[newIndex]);
      setDisplayUrl(history[newIndex]);
      setUrl(history[newIndex]);
    }
  };

  const handleRefresh = () => {
    if (iframeRef.current && currentUrl) {
      setIsLoading(true);
      iframeRef.current.src = currentUrl;
    }
  };

  const handleHome = () => {
    setShowHomePage(true);
    setCurrentUrl('');
    setDisplayUrl('');
    setUrl('');
  };

  const handleIframeLoad = () => {
    setIsLoading(false);
  };

  const openInNewTab = (urlToOpen?: string) => {
    const targetUrl = urlToOpen || currentUrl || url;
    if (targetUrl) {
      window.open(targetUrl, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div className="h-full flex flex-col bg-background">
      {/* Browser Controls */}
      <div className="flex items-center gap-2 p-2 border-b border-border bg-muted/30">
        <div className="flex gap-1 shrink-0">
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8 hover:bg-primary/10 transition-all duration-200"
            onClick={handleBack}
            disabled={historyIndex <= 0}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8 hover:bg-primary/10 transition-all duration-200"
            onClick={handleForward}
            disabled={historyIndex >= history.length - 1}
          >
            <ArrowRight className="h-4 w-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            className={`h-8 w-8 hover:bg-primary/10 transition-all duration-200 ${isLoading ? 'animate-spin' : ''}`}
            onClick={handleRefresh}
            disabled={!currentUrl}
          >
            <RotateCw className="h-4 w-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8 hover:bg-primary/10 transition-all duration-200"
            onClick={handleHome}
          >
            <Home className="h-4 w-4" />
          </Button>
        </div>

        {/* URL Bar */}
        <div className="flex-1 flex items-center gap-2 min-w-0">
          <div className="relative flex-1 min-w-0">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
            <Input
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleNavigate()}
              className="bg-gray-100 pl-10 pr-4 h-9 text-sm font-mono transition-all duration-200 focus:ring-2 focus:ring-primary/30 text-black placeholder:text-gray-500"
              placeholder="Search or enter URL..."
            />
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 hover:bg-primary/10 transition-all duration-200 shrink-0"
            onClick={() => openInNewTab()}
            title="Open in new tab"
            disabled={!url && !currentUrl}
          >
            <ExternalLink className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Current URL Display */}
      {displayUrl && !showHomePage && (
        <div className="px-3 py-1.5 border-b border-border bg-muted/20 flex items-center gap-2">
          <Globe className="h-3 w-3 text-primary shrink-0" />
          <span className="text-xs text-muted-foreground truncate font-mono">{displayUrl}</span>
        </div>
      )}

      {/* Browser Content */}
      <div className="flex-1 relative overflow-hidden">
        {showHomePage ? (
          // Home Page
          <div className="h-full flex flex-col items-center justify-center bg-gradient-to-b from-background to-muted/20 p-8">
            <div className="text-center space-y-8 max-w-lg w-full">
              <div className="space-y-2">
                <Globe className="w-16 h-16 mx-auto text-primary opacity-80" />
                <h2 className="text-2xl font-bold">Web Browser</h2>
                <p className="text-sm text-muted-foreground">
                  Search the web or enter a URL above
                </p>
              </div>

              {/* Search Box */}
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
                <input
                  type="text"
                  placeholder="Search with DuckDuckGo..."
                  className="w-full pl-12 pr-4 py-3 rounded-full bg-gray-100 border border-border focus:border-primary/50 focus:ring-2 focus:ring-primary/20 outline-none transition-all text-sm text-black placeholder:text-gray-500"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      const target = e.target as HTMLInputElement;
                      handleNavigate(target.value);
                    }
                  }}
                />
              </div>

              {/* External Sites - Open in New Tab */}
              <div className="space-y-3">
                <p className="text-xs text-muted-foreground uppercase tracking-wider">Quick Links (opens in new tab)</p>
                <div className="flex justify-center gap-4">
                  {EXTERNAL_SITES.map((site) => {
                    const Icon = site.icon;
                    return (
                      <button
                        key={site.name}
                        onClick={() => openInNewTab(site.url)}
                        className="flex flex-col items-center gap-2 p-4 rounded-xl hover:bg-muted/50 transition-all duration-200 hover:scale-105 group"
                      >
                        <div className={`w-12 h-12 rounded-full bg-muted/50 flex items-center justify-center group-hover:bg-muted transition-colors ${site.color}`}>
                          <Icon className="w-6 h-6" />
                        </div>
                        <span className="text-xs text-muted-foreground group-hover:text-foreground transition-colors">{site.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Embeddable Sites */}
              <div className="space-y-3">
                <p className="text-xs text-muted-foreground uppercase tracking-wider">Browse in-app</p>
                <div className="flex justify-center gap-4">
                  {EMBEDDABLE_SITES.map((site) => {
                    const Icon = site.icon;
                    return (
                      <button
                        key={site.name}
                        onClick={() => handleNavigate(site.url)}
                        className="flex flex-col items-center gap-2 p-4 rounded-xl hover:bg-muted/50 transition-all duration-200 hover:scale-105 group"
                      >
                        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                          <Icon className="w-6 h-6 text-primary" />
                        </div>
                        <span className="text-xs text-muted-foreground group-hover:text-foreground transition-colors">{site.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <p className="text-xs text-muted-foreground/60 mt-8">
                Note: Some websites (YouTube, Google, etc.) cannot be embedded due to security restrictions.
                <br />They will open in a new browser tab instead.
              </p>
            </div>
          </div>
        ) : (
          // Iframe View
          <>
            {isLoading && (
              <div className="absolute inset-0 bg-background/80 flex items-center justify-center z-10">
                <div className="flex flex-col items-center gap-2">
                  <RotateCw className="h-8 w-8 text-primary animate-spin" />
                  <span className="text-sm text-muted-foreground">Loading...</span>
                </div>
              </div>
            )}
            
            <iframe
              ref={iframeRef}
              src={currentUrl}
              className="w-full h-full border-0 bg-white"
              onLoad={handleIframeLoad}
              sandbox="allow-same-origin allow-scripts allow-popups allow-forms allow-downloads"
              title="Browser"
            />
          </>
        )}
      </div>
    </div>
  );
};
