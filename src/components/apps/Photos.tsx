import React, { useEffect, useState } from 'react';
import { Loader2, ImageIcon } from 'lucide-react';

const STORAGE_KEY = 'portfolio_content';

interface Photo {
  id: string;
  title: string;
  url: string;
  description: string | null;
}

export const Photos: React.FC = () => {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    fetchPhotos();
    window.addEventListener('storage', fetchPhotos);
    return () => window.removeEventListener('storage', fetchPhotos);
  }, []);

  const fetchPhotos = async () => {
    setError('');
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const data = JSON.parse(stored);
        if (data.googleDrivePhotos) {
          const input = data.googleDrivePhotos.trim();
          
          // Check if input contains direct image URLs (comma-separated)
          // Supports: Imgur, direct URLs, or any publicly accessible image URL
          if (input.includes('http://') || input.includes('https://')) {
            const urls = input.split(',').map((url: string) => url.trim()).filter(Boolean);
            const fetchedPhotos = urls.map((url: string, index: number) => ({
              id: `photo-${index}`,
              title: `Photo ${index + 1}`,
              url: url,
              description: null,
            }));
            setPhotos(fetchedPhotos);
            setLoading(false);
            return;
          }
          
          // Check if input contains individual file IDs (comma-separated)
          if (input.includes(',')) {
            // Individual file IDs - This is the recommended method
            const fileIds = input.split(',').map((item: string) => {
              const trimmed = item.trim();
              // Check if it's a full URL and extract the ID
              if (trimmed.includes('drive.google.com')) {
                const match = trimmed.match(/\/d\/([a-zA-Z0-9_-]+)/);
                return match ? match[1] : trimmed;
              }
              return trimmed;
            }).filter(Boolean);
            
            const fetchedPhotos = fileIds.map((id: string, index: number) => ({
              id: id,
              title: `Photo ${index + 1}`,
              url: `https://drive.google.com/uc?export=view&id=${id}`,
              description: null,
            }));
            setPhotos(fetchedPhotos);
            setLoading(false);
            return;
          }
          
          // Check if input is a single Google Drive share link and extract ID
          if (input.includes('drive.google.com')) {
            const match = input.match(/\/d\/([a-zA-Z0-9_-]+)/);
            if (match && match[1]) {
              const fileId = match[1];
              const fetchedPhotos = [{
                id: fileId,
                title: 'Photo 1',
                url: `https://drive.google.com/uc?export=view&id=${fileId}`,
                description: null,
              }];
              setPhotos(fetchedPhotos);
              setLoading(false);
              return;
            }
          } 
          
          // If not comma-separated, treat as folder ID and try API
          if (input.length > 10) {
            try {
              const folderId = input;
              // Note: This API key is public and limited. Users should create their own.
              const apiKey = 'AIzaSyCUuMg9Oz3QXe-5YvJ-6hKNDN4qZpxhvBE';
              const apiUrl = `https://www.googleapis.com/drive/v3/files?q='${folderId}'+in+parents&key=${apiKey}&fields=files(id,name,mimeType)`;
              
              console.log('Fetching from Google Drive API...');
              const response = await fetch(apiUrl);
              
              if (response.ok) {
                const result = await response.json();
                console.log('API Response:', result);
                
                if (result.files && result.files.length > 0) {
                  // Filter only image files
                  const imageFiles = result.files.filter((file: any) => 
                    file.mimeType && file.mimeType.startsWith('image/')
                  );
                  
                  if (imageFiles.length > 0) {
                    const fetchedPhotos = imageFiles.map((file: any) => ({
                      id: file.id,
                      title: file.name || 'Untitled',
                      url: `https://drive.google.com/thumbnail?id=${file.id}&sz=w2000`,
                      description: null,
                    }));
                    setPhotos(fetchedPhotos);
                  } else {
                    setError('No image files found in the folder. Make sure it contains images.');
                  }
                } else {
                  setError('Folder is empty or not accessible. Make sure folder is shared publicly (Anyone with the link).');
                }
              } else {
                const errorText = await response.text();
                console.error('API request failed:', response.status, errorText);
                setError(`API Error (${response.status}): The folder might not be publicly accessible. Try using individual file IDs instead (comma-separated).`);
              }
            } catch (error) {
              console.error('Failed to fetch photos from Google Drive:', error);
              setError('Failed to connect to Google Drive. Try using individual file IDs instead (easier method).');
            }
          }
        }
      } catch (error) {
        console.error('Failed to parse photos');
        setError('Failed to load photo configuration.');
      }
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (photos.length === 0) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-8 bg-gradient-to-br from-background to-muted/20">
        <div className="text-center space-y-4 max-w-2xl">
          <div className="w-24 h-24 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
            <ImageIcon className="w-12 h-12 text-primary" />
          </div>
          <h3 className="text-xl font-bold">No Photos Available</h3>
          
          {error && (
            <div className="glass-strong border border-red-500/50 rounded-lg p-4 text-left">
              <p className="text-sm text-red-400">
                <strong>Error:</strong> {error}
              </p>
            </div>
          )}
          
          <p className="text-muted-foreground">
            Choose one of these methods to display your photos:
          </p>
          
          <div className="grid md:grid-cols-2 gap-4 text-left">
            {/* Method 1 - Imgur */}
            <div className="glass-strong rounded-lg p-4 space-y-2 border-2 border-primary/50">
              <h4 className="text-primary font-semibold">✅ Method 1: Imgur (EASIEST & RECOMMENDED)</h4>
              <ol className="text-sm text-muted-foreground space-y-1.5">
                <li>1. Go to <a href="https://imgur.com/upload" target="_blank" className="text-primary underline">imgur.com/upload</a></li>
                <li>2. Upload your photos (no account needed!)</li>
                <li>3. After upload, right-click each image → "Copy image address"</li>
                <li>4. Click 🔒 → Paste URLs separated by commas</li>
                <li className="text-xs text-primary">Example: https://i.imgur.com/abc123.jpg, https://i.imgur.com/xyz789.png</li>
              </ol>
              <div className="bg-primary/10 rounded p-2 mt-2">
                <p className="text-xs text-primary">✨ Works instantly, no configuration needed!</p>
              </div>
            </div>
            
            {/* Method 2 - Direct URLs */}
            <div className="glass-strong rounded-lg p-4 space-y-2 border-2 border-accent/50">
              <h4 className="text-accent font-semibold">⚡ Method 2: Any Direct Image URLs</h4>
              <ol className="text-sm text-muted-foreground space-y-1.5">
                <li>1. Upload images to any hosting service:</li>
                <li className="text-xs pl-4">• Imgur, Cloudinary, imgbb, etc.</li>
                <li>2. Get direct image URLs (must end in .jpg, .png, etc.)</li>
                <li>3. Click 🔒 → Paste URLs separated by commas</li>
              </ol>
              <div className="bg-accent/10 rounded p-2 mt-2">
                <p className="text-xs text-accent-foreground">Any publicly accessible image URL works!</p>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4 text-left mt-4">
            {/* Method 3 - Google Drive */}
            <div className="glass-strong rounded-lg p-4 space-y-2">
              <h4 className="text-muted-foreground font-semibold">❌ Method 3: Google Drive (Not Recommended)</h4>
              <ol className="text-sm text-muted-foreground space-y-1.5">
                <li className="text-amber-400">Google Drive has CORS restrictions that prevent images from loading in web apps.</li>
                <li className="text-xs">Use Imgur or another image hosting service instead.</li>
              </ol>
            </div>
            
            {/* Method 4 - Local */}
            <div className="glass-strong rounded-lg p-4 space-y-2">
              <h4 className="text-muted-foreground font-semibold">📁 Method 4: Local Images (For Deployment)</h4>
              <ol className="text-sm text-muted-foreground space-y-1.5">
                <li>1. Add images to <code className="text-primary text-xs">public/photos/</code></li>
                <li>2. Click 🔒 → Enter: <code className="text-primary text-xs">/photos/img1.jpg, /photos/img2.jpg</code></li>
              </ol>
            </div>
          </div>

          <div className="glass-strong rounded-lg p-3 mt-4">
            <p className="text-xs text-muted-foreground">
              💡 <strong>Quick Tip:</strong> Method 1 is easier! Just get each photo's file ID from its share link and paste them separated by commas.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex">
      {/* Thumbnail Grid */}
      <div className="w-1/3 border-r border-border overflow-auto p-4">
        <div className="grid grid-cols-2 gap-2">
          {photos.map((photo) => (
            <button
              key={photo.id}
              onClick={() => setSelectedPhoto(photo)}
              className={`
                aspect-square rounded-lg overflow-hidden hover:ring-2 hover:ring-primary transition-all bg-muted/30
                ${selectedPhoto?.id === photo.id ? 'ring-2 ring-primary' : ''}
              `}
            >
              <img
                src={photo.url}
                alt={photo.title}
                className="w-full h-full object-cover"
                loading="lazy"
                onError={(e) => {
                  console.error('Image failed to load:', photo.url);
                  const img = e.target as HTMLImageElement;
                  img.style.display = 'none';
                  const parent = img.parentElement;
                  if (parent) {
                    parent.innerHTML = `<div class="w-full h-full flex items-center justify-center text-xs text-muted-foreground p-2">${photo.title}</div>`;
                  }
                }}
              />
            </button>
          ))}
        </div>
      </div>

      {/* Main View */}
      <div className="flex-1 flex flex-col items-center justify-center p-8 bg-black/50">
        {selectedPhoto ? (
          <div className="max-w-full max-h-full flex flex-col items-center gap-4">
            <img
              src={selectedPhoto.url}
              alt={selectedPhoto.title}
              className="max-w-full max-h-[500px] object-contain rounded-lg shadow-2xl"
              onError={(e) => {
                console.error('Main image failed to load:', selectedPhoto.url);
                const img = e.target as HTMLImageElement;
                img.style.display = 'none';
                const parent = img.parentElement;
                if (parent) {
                  parent.innerHTML = `<div class="glass-strong rounded-lg p-8 text-center"><p class="text-muted-foreground">Image failed to load</p><p class="text-xs text-primary mt-2">URL: ${selectedPhoto.url}</p></div>`;
                }
              }}
            />
            <div className="text-center">
              <h3 className="text-lg font-semibold text-foreground">{selectedPhoto.title}</h3>
              {selectedPhoto.description && (
                <p className="text-sm text-muted-foreground mt-1">{selectedPhoto.description}</p>
              )}
            </div>
          </div>
        ) : (
          <div className="text-center text-muted-foreground">
            <p>Select a photo to view</p>
          </div>
        )}
      </div>
    </div>
  );
};
