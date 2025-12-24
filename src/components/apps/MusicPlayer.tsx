import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2, Music } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';

interface Song {
  id: number;
  title: string;
  artist: string;
  url: string;
  duration: string;
}

/**
 * Music Player with Streaming URLs
 * These are royalty-free tracks that can be streamed directly
 */
const DEMO_SONGS: Song[] = [
  {
    id: 1,
    title: 'Chill Vibes',
    artist: 'Chillhop Music',
    url: 'https://files.freemusicarchive.org/storage-freemusicarchive-org/music/ccCommunity/Chad_Crouch/Arps/Chad_Crouch_-_Shipping_Lanes.mp3',
    duration: '0:00',
  },
  {
    id: 2,
    title: 'Ethereal',
    artist: 'Kevin MacLeod',
    url: 'https://files.freemusicarchive.org/storage-freemusicarchive-org/music/no_curator/Kevin_MacLeod/Calming/Kevin_MacLeod_-_Meditation_Impromptu.mp3',
    duration: '0:00',
  },
  {
    id: 3,
    title: 'Lo-Fi Dreams',
    artist: 'Blue Dot Sessions',
    url: 'https://files.freemusicarchive.org/storage-freemusicarchive-org/music/ccCommunity/Blue_Dot_Sessions/Vernonia/Blue_Dot_Sessions_-_Rain_and_Shine.mp3',
    duration: '0:00',
  },
  {
    id: 4,
    title: 'Ambient Flow',
    artist: 'Scott Buckley',
    url: 'https://files.freemusicarchive.org/storage-freemusicarchive-org/music/ccCommunity/Scott_Buckley/Scott_Buckley_-_Filaments/Scott_Buckley_-_Filaments.mp3',
    duration: '0:00',
  },
  {
    id: 5,
    title: 'Night Drive',
    artist: 'Lobo Loco',
    url: 'https://files.freemusicarchive.org/storage-freemusicarchive-org/music/ccCommunity/Lobo_Loco/Loco_Lounge/Lobo_Loco_-_05_-_Thai_Sunrise_ID_1082.mp3',
    duration: '0:00',
  },
  {
    id: 6,
    title: 'Peaceful Morning',
    artist: 'Chad Crouch',
    url: 'https://files.freemusicarchive.org/storage-freemusicarchive-org/music/ccCommunity/Chad_Crouch/Arps/Chad_Crouch_-_Algorithms.mp3',
    duration: '0:00',
  },
  {
    id: 7,
    title: 'Floating',
    artist: 'Blue Dot Sessions',
    url: 'https://files.freemusicarchive.org/storage-freemusicarchive-org/music/ccCommunity/Blue_Dot_Sessions/Bitters/Blue_Dot_Sessions_-_Pangea.mp3',
    duration: '0:00',
  },
  {
    id: 8,
    title: 'Serenity',
    artist: 'Kevin MacLeod',
    url: 'https://files.freemusicarchive.org/storage-freemusicarchive-org/music/no_curator/Kevin_MacLeod/Calming/Kevin_MacLeod_-_Peaceful_Desolation.mp3',
    duration: '0:00',
  },
  {
    id: 9,
    title: 'Deep Focus',
    artist: 'Scott Buckley',
    url: 'https://files.freemusicarchive.org/storage-freemusicarchive-org/music/ccCommunity/Scott_Buckley/Scott_Buckley_-_Legions/Scott_Buckley_-_Legions.mp3',
    duration: '0:00',
  },
  {
    id: 10,
    title: 'Sunset Waves',
    artist: 'Lobo Loco',
    url: 'https://files.freemusicarchive.org/storage-freemusicarchive-org/music/ccCommunity/Lobo_Loco/Loco_Lounge/Lobo_Loco_-_04_-_Sitar_Sunrise_ID_1080.mp3',
    duration: '0:00',
  },
];

export const MusicPlayer: React.FC = () => {
  const [currentSong, setCurrentSong] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState([70]);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState('0:00');
  const [duration, setDuration] = useState('0:00');
  const audioRef = useRef<HTMLAudioElement>(null);

  const formatTime = (seconds: number): string => {
    if (isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateProgress = () => {
      const progressPercent = (audio.currentTime / audio.duration) * 100;
      setProgress(isNaN(progressPercent) ? 0 : progressPercent);
      setCurrentTime(formatTime(audio.currentTime));
    };

    const handleLoadedMetadata = () => {
      setDuration(formatTime(audio.duration));
    };

    audio.addEventListener('timeupdate', updateProgress);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('ended', handleNext);

    return () => {
      audio.removeEventListener('timeupdate', updateProgress);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('ended', handleNext);
    };
  }, [currentSong]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume[0] / 100;
    }
  }, [volume]);

  const handlePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch(() => {
          // Handle autoplay restrictions
          console.log('Playback failed - user interaction required');
        });
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleNext = () => {
    setCurrentSong((prev) => (prev + 1) % DEMO_SONGS.length);
    setIsPlaying(false);
  };

  const handlePrevious = () => {
    setCurrentSong((prev) => (prev - 1 + DEMO_SONGS.length) % DEMO_SONGS.length);
    setIsPlaying(false);
  };

  const handleSongSelect = (index: number) => {
    setCurrentSong(index);
    setIsPlaying(false);
  };

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-background via-background to-muted/20">
      <audio ref={audioRef} src={DEMO_SONGS[currentSong].url} />
      
      {/* Main Player */}
      <div className="flex-1 flex flex-col items-center justify-center p-8 space-y-8">
        <div className="w-48 h-48 bg-gradient-to-br from-primary/20 to-primary/5 rounded-2xl glass-strong flex items-center justify-center animate-pulse">
          <Music className="w-24 h-24 text-primary terminal-glow" />
        </div>

        <div className="text-center space-y-2">
          <h2 className="text-3xl font-bold text-primary terminal-glow">{DEMO_SONGS[currentSong].title}</h2>
          <p className="text-lg text-muted-foreground">{DEMO_SONGS[currentSong].artist}</p>
        </div>

        {/* Progress Bar */}
        <div className="w-full max-w-md space-y-2">
          <Slider
            value={[progress]}
            max={100}
            step={1}
            className="cursor-pointer"
            onValueChange={(value) => {
              if (audioRef.current) {
                audioRef.current.currentTime = (value[0] / 100) * audioRef.current.duration;
              }
            }}
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>{currentTime}</span>
            <span>{duration}</span>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            className="h-12 w-12 hover:scale-110 transition-transform"
            onClick={handlePrevious}
          >
            <SkipBack className="h-6 w-6" />
          </Button>
          
          <Button
            size="icon"
            className="h-16 w-16 bg-primary hover:bg-primary/90 hover:scale-105 transition-all"
            onClick={handlePlayPause}
          >
            {isPlaying ? (
              <Pause className="h-8 w-8" />
            ) : (
              <Play className="h-8 w-8 ml-1" />
            )}
          </Button>
          
          <Button
            variant="ghost"
            size="icon"
            className="h-12 w-12 hover:scale-110 transition-transform"
            onClick={handleNext}
          >
            <SkipForward className="h-6 w-6" />
          </Button>
        </div>

        {/* Volume Control */}
        <div className="flex items-center gap-2 w-48">
          <Volume2 className="h-4 w-4 text-muted-foreground" />
          <Slider
            value={volume}
            max={100}
            step={1}
            onValueChange={setVolume}
          />
        </div>
      </div>

      {/* Playlist - Scrollable */}
      <div className="border-t border-border bg-muted/30 p-4 max-h-[200px] overflow-y-auto">
        <h3 className="text-sm font-semibold mb-3 text-muted-foreground sticky top-0 bg-muted/30 py-1">PLAYLIST ({DEMO_SONGS.length} songs)</h3>
        <div className="space-y-1">
          {DEMO_SONGS.map((song, index) => (
            <button
              key={song.id}
              onClick={() => handleSongSelect(index)}
              className={`
                w-full text-left p-2 rounded-lg transition-all duration-200 hover:scale-[1.01]
                ${currentSong === index
                  ? 'bg-primary/20 text-primary border border-primary/50'
                  : 'hover:bg-muted/50 text-foreground'
                }
              `}
            >
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3 flex-1">
                  <span className="text-xs text-muted-foreground w-5">{index + 1}</span>
                  <div>
                    <p className="text-sm font-medium">{song.title}</p>
                    <p className="text-xs text-muted-foreground">{song.artist}</p>
                  </div>
                </div>
                {currentSong === index && isPlaying && (
                  <div className="flex gap-0.5 items-end h-4">
                    <div className="w-1 bg-primary animate-pulse" style={{ height: '60%' }} />
                    <div className="w-1 bg-primary animate-pulse" style={{ height: '100%', animationDelay: '0.2s' }} />
                    <div className="w-1 bg-primary animate-pulse" style={{ height: '40%', animationDelay: '0.4s' }} />
                  </div>
                )}
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
