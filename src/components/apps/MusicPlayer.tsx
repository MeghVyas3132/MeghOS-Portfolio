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

const DEMO_SONGS: Song[] = [
  {
    id: 1,
    title: 'Calm Coding',
    artist: 'Lo-Fi Beats',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    duration: '3:45',
  },
  {
    id: 2,
    title: 'Deep Focus',
    artist: 'Study Music',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
    duration: '4:12',
  },
  {
    id: 3,
    title: 'Terminal Vibes',
    artist: 'DevOps Mix',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
    duration: '3:58',
  },
  {
    id: 4,
    title: 'Container Orchestra',
    artist: 'Docker Beats',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3',
    duration: '4:30',
  },
  {
    id: 5,
    title: 'Cloud Nine',
    artist: 'SRE Sessions',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3',
    duration: '3:22',
  },
];

export const MusicPlayer: React.FC = () => {
  const [currentSong, setCurrentSong] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState([70]);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateProgress = () => {
      const progress = (audio.currentTime / audio.duration) * 100;
      setProgress(progress);
    };

    audio.addEventListener('timeupdate', updateProgress);
    audio.addEventListener('ended', handleNext);

    return () => {
      audio.removeEventListener('timeupdate', updateProgress);
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
        audioRef.current.play();
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
          <h2 className="text-3xl font-bold terminal-glow">{DEMO_SONGS[currentSong].title}</h2>
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
            <span>0:00</span>
            <span>{DEMO_SONGS[currentSong].duration}</span>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            className="h-12 w-12"
            onClick={handlePrevious}
          >
            <SkipBack className="h-6 w-6" />
          </Button>
          
          <Button
            size="icon"
            className="h-16 w-16 bg-primary hover:bg-primary/90 terminal-glow"
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
            className="h-12 w-12"
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

      {/* Playlist */}
      <div className="border-t border-border bg-muted/30 p-4">
        <h3 className="text-sm font-semibold mb-3 text-muted-foreground">PLAYLIST</h3>
        <div className="space-y-1">
          {DEMO_SONGS.map((song, index) => (
            <button
              key={song.id}
              onClick={() => handleSongSelect(index)}
              className={`
                w-full text-left p-2 rounded-lg transition-all
                ${currentSong === index
                  ? 'bg-primary/20 text-primary border border-primary/50'
                  : 'hover:bg-muted/50 text-foreground'
                }
              `}
            >
              <div className="flex justify-between items-center">
                <div className="flex-1">
                  <p className="text-sm font-medium">{song.title}</p>
                  <p className="text-xs text-muted-foreground">{song.artist}</p>
                </div>
                <span className="text-xs text-muted-foreground">{song.duration}</span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
