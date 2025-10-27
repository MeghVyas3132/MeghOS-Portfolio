import React, { useState } from 'react';
import { ImageIcon } from 'lucide-react';

// Import local photos
import photo1 from '@/assets/photo-1.jpg';
import photo2 from '@/assets/photo-2.jpg';
import photo3 from '@/assets/photo-3.jpg';
import photo4 from '@/assets/photo-4.jpg';
import photo5 from '@/assets/photo-5.jpg';
import photo6 from '@/assets/photo-6.jpg';

interface Photo {
  id: string;
  title: string;
  url: string;
}

const PHOTOS: Photo[] = [
  { id: '1', title: 'Photo 1', url: photo1 },
  { id: '2', title: 'Photo 2', url: photo2 },
  { id: '3', title: 'Photo 3', url: photo3 },
  { id: '4', title: 'Photo 4', url: photo4 },
  { id: '5', title: 'Photo 5', url: photo5 },
  { id: '6', title: 'Photo 6', url: photo6 },
];

export const Photos: React.FC = () => {
  const [selectedPhoto, setSelectedPhoto] = useState<Photo>(PHOTOS[0]);

  return (
    <div className="h-full flex">
      {/* Thumbnail Grid */}
      <div className="w-1/3 border-r border-border overflow-auto p-4 bg-muted/10">
        <h3 className="text-sm font-semibold text-primary mb-3 flex items-center gap-2">
          <ImageIcon className="w-4 h-4" />
          My Photos ({PHOTOS.length})
        </h3>
        <div className="grid grid-cols-2 gap-3">
          {PHOTOS.map((photo) => (
            <button
              key={photo.id}
              onClick={() => setSelectedPhoto(photo)}
              className={`
                aspect-square rounded-lg overflow-hidden hover:ring-2 hover:ring-primary transition-all
                ${selectedPhoto?.id === photo.id ? 'ring-2 ring-primary shadow-lg' : 'ring-1 ring-border/50'}
              `}
            >
              <img
                src={photo.url}
                alt={photo.title}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-200"
                loading="lazy"
              />
            </button>
          ))}
        </div>
      </div>

      {/* Main View */}
      <div className="flex-1 flex flex-col items-center justify-center p-8 bg-gradient-to-br from-black/50 to-black/30">
        {selectedPhoto && (
          <div className="max-w-full max-h-full flex flex-col items-center gap-6 animate-fade-in">
            <img
              src={selectedPhoto.url}
              alt={selectedPhoto.title}
              className="max-w-full max-h-[600px] object-contain rounded-lg shadow-2xl ring-1 ring-primary/20"
            />
            <div className="glass-strong rounded-lg px-6 py-3">
              <h3 className="text-lg font-semibold text-primary">{selectedPhoto.title}</h3>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
