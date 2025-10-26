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

  useEffect(() => {
    fetchPhotos();
    window.addEventListener('storage', fetchPhotos);
    return () => window.removeEventListener('storage', fetchPhotos);
  }, []);

  const fetchPhotos = () => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const data = JSON.parse(stored);
        if (data.googleDrivePhotos) {
          // Note: Google Drive integration requires public folder links
          // This is a placeholder - users should add their own Google Drive folder ID
          setPhotos([]);
        }
      } catch (error) {
        console.error('Failed to parse photos');
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
        <div className="text-center space-y-4 max-w-md">
          <div className="w-24 h-24 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
            <ImageIcon className="w-12 h-12 text-primary" />
          </div>
          <h3 className="text-xl font-bold">No Photos Available</h3>
          <p className="text-muted-foreground">
            To display your photos from Google Drive:
          </p>
          <ol className="text-left text-sm text-muted-foreground space-y-2 glass-strong rounded-lg p-4">
            <li>1. Upload photos to a Google Drive folder</li>
            <li>2. Make the folder publicly accessible</li>
            <li>3. Click the lock icon in the top bar</li>
            <li>4. Enter the Google Drive folder ID in Edit Mode</li>
          </ol>
          <p className="text-xs text-muted-foreground">
            Folder ID is the part after /folders/ in your Google Drive URL
          </p>
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
                aspect-square rounded-lg overflow-hidden hover:ring-2 hover:ring-primary transition-all
                ${selectedPhoto?.id === photo.id ? 'ring-2 ring-primary' : ''}
              `}
            >
              <img
                src={photo.url}
                alt={photo.title}
                className="w-full h-full object-cover"
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
