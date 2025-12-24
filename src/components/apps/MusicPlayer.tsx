import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, Music, Shuffle, Repeat, List } from 'lucide-react';
import { Slider } from '@/components/ui/slider';

interface Song {
  id: number;
  title: string;
  artist: string;
  album: string;
  genre: string;
  duration: string;
  url: string;
}

/**
 * Music Player - Personal Playlist
 * Add your MP3 files to /public/music/ folder
 */
const DEMO_SONGS: Song[] = [
  {
    id: 1,
    title: 'Tere Bina',
    artist: 'A.R. Rahman, Chinmayi Sripada',
    album: 'Guru (Original Motion Picture Soundtrack)',
    genre: 'Bollywood',
    duration: '5:10',
    url: '/music/a-r-rahman-tere-bina-lyrical-song-aishwarya-rai-abhishek-bachchan-guru-gulzar-128-ytshorts.savetube.me.mp3',
  },
  {
    id: 2,
    title: 'Rang Bhini Radha',
    artist: 'Aditya Gadhvi',
    album: 'Rang Bhini Radha - Single',
    genre: 'Folk',
    duration: '4:07',
    url: '/music/rang-bhini-radha-folk-box-feat-aditya-gadhavi-kavi-shri-daan-alagari-128-ytshorts.savetube.me.mp3',
  },
  {
    id: 3,
    title: 'GUILT TRIPPIN',
    artist: 'Central Cee & Sexyy Red',
    album: 'GUILT TRIPPIN - Single',
    genre: 'Hip-Hop/Rap',
    duration: '2:33',
    url: '/music/central-cee-x-sexyy-red-guilt-trippin-music-video-128-ytshorts.savetube.me.mp3',
  },
  {
    id: 4,
    title: 'No Role Modelz',
    artist: 'J. Cole',
    album: '2014 Forest Hills Drive',
    genre: 'Hip-Hop/Rap',
    duration: '4:53',
    url: '/music/j-cole-no-role-modelz-explicit-128-ytshorts.savetube.me.mp3',
  },
  {
    id: 5,
    title: 'Living in the Shadows',
    artist: 'Matthew Perryman Jones',
    album: 'Living in the Shadows - Single',
    genre: 'Singer/Songwriter',
    duration: '3:32',
    url: '/music/matthew-perryman-jones-living-in-the-shadows-official-audio-128-ytshorts.savetube.me.mp3',
  },
];

export const MusicPlayer: React.FC = () => {
  const [currentSong, setCurrentSong] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState([70]);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState('0:00');
  const [duration, setDuration] = useState('0:00');
  const [showPlaylist, setShowPlaylist] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [shuffle, setShuffle] = useState(false);
  const [repeat, setRepeat] = useState(false);
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

    const handleEnded = () => {
      if (repeat) {
        audio.currentTime = 0;
        audio.play();
      } else {
        handleNext();
      }
    };

    audio.addEventListener('timeupdate', updateProgress);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', updateProgress);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [currentSong, repeat]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume[0] / 100;
    }
  }, [volume, isMuted]);

  const handlePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch(() => {
          console.log('Playback failed - user interaction required');
        });
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleNext = () => {
    if (shuffle) {
      const nextIndex = Math.floor(Math.random() * DEMO_SONGS.length);
      setCurrentSong(nextIndex);
    } else {
      setCurrentSong((prev) => (prev + 1) % DEMO_SONGS.length);
    }
    setIsPlaying(false);
  };

  const handlePrevious = () => {
    setCurrentSong((prev) => (prev - 1 + DEMO_SONGS.length) % DEMO_SONGS.length);
    setIsPlaying(false);
  };

  const handleSongSelect = (index: number) => {
    setCurrentSong(index);
    setIsPlaying(false);
    setTimeout(() => {
      audioRef.current?.play();
      setIsPlaying(true);
    }, 100);
  };

  return (
    <div className="h-full flex flex-col bg-transparent backdrop-blur-xl">
      <audio ref={audioRef} src={DEMO_SONGS[currentSong].url} />
      
      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Now Playing - Left Side */}
        <div className={`flex-1 flex flex-col items-center justify-center p-6 ${showPlaylist ? 'border-r border-white/10' : ''}`}>
          
          {/* Album Art */}
          <div className="relative group mb-6">
            <div className={`w-40 h-40 sm:w-48 sm:h-48 rounded-2xl bg-gradient-to-br from-primary/30 via-primary/10 to-transparent backdrop-blur-sm border border-white/10 flex items-center justify-center shadow-2xl transition-transform duration-500 ${isPlaying ? 'scale-105' : ''}`}>
              <Music className={`w-16 h-16 sm:w-20 sm:h-20 text-primary/80 transition-all duration-500 ${isPlaying ? 'animate-pulse' : ''}`} />
            </div>
            {/* Glow effect when playing */}
            {isPlaying && (
              <div className="absolute inset-0 rounded-2xl bg-primary/20 blur-2xl -z-10 animate-pulse" />
            )}
          </div>

          {/* Song Info */}
          <div className="text-center space-y-1 mb-6 max-w-full px-4">
            <h2 className="text-xl sm:text-2xl font-semibold text-white truncate">{DEMO_SONGS[currentSong].title}</h2>
            <p className="text-sm sm:text-base text-white/60 truncate">{DEMO_SONGS[currentSong].artist}</p>
            <p className="text-xs text-white/40 truncate">{DEMO_SONGS[currentSong].album}</p>
          </div>

          {/* Progress Bar */}
          <div className="w-full max-w-xs space-y-2 mb-6 px-4">
            <Slider
              value={[progress]}
              max={100}
              step={0.1}
              className="cursor-pointer"
              onValueChange={(value) => {
                if (audioRef.current && audioRef.current.duration) {
                  audioRef.current.currentTime = (value[0] / 100) * audioRef.current.duration;
                }
              }}
            />
            <div className="flex justify-between text-[11px] text-white/50 font-medium">
              <span>{currentTime}</span>
              <span>{duration}</span>
            </div>
          </div>

          {/* Main Controls */}
          <div className="flex items-center justify-center gap-3 sm:gap-6 mb-6">
            <button
              onClick={() => setShuffle(!shuffle)}
              className={`p-2 rounded-full transition-all hover:bg-white/10 ${shuffle ? 'text-orange-500' : 'text-white/50 hover:text-white'}`}
            >
              <Shuffle className="h-4 w-4" />
            </button>
            
            <button
              className="p-3 rounded-full text-white/80 hover:text-white hover:bg-white/10 transition-all active:scale-90"
              onClick={handlePrevious}
            >
              <SkipBack className="h-5 w-5 fill-current" />
            </button>
            
            <button
              className="p-4 rounded-full bg-white text-black hover:scale-105 transition-all active:scale-95 shadow-lg"
              onClick={handlePlayPause}
            >
              {isPlaying ? (
                <Pause className="h-6 w-6 fill-current" />
              ) : (
                <Play className="h-6 w-6 fill-current ml-0.5" />
              )}
            </button>
            
            <button
              className="p-3 rounded-full text-white/80 hover:text-white hover:bg-white/10 transition-all active:scale-90"
              onClick={handleNext}
            >
              <SkipForward className="h-5 w-5 fill-current" />
            </button>

            <button
              onClick={() => setRepeat(!repeat)}
              className={`p-2 rounded-full transition-all hover:bg-white/10 ${repeat ? 'text-orange-500' : 'text-white/50 hover:text-white'}`}
            >
              <Repeat className="h-4 w-4" />
            </button>
          </div>

          {/* Volume Control */}
          <div className="flex items-center gap-3 w-36">
            <button 
              onClick={() => setIsMuted(!isMuted)}
              className="text-white/50 hover:text-white transition-colors"
            >
              {isMuted || volume[0] === 0 ? (
                <VolumeX className="h-4 w-4" />
              ) : (
                <Volume2 className="h-4 w-4" />
              )}
            </button>
            <Slider
              value={isMuted ? [0] : volume}
              max={100}
              step={1}
              onValueChange={(v) => {
                setVolume(v);
                setIsMuted(false);
              }}
              className="flex-1"
            />
          </div>
        </div>

        {/* Playlist - Right Side */}
        {showPlaylist && (
          <div className="w-72 sm:w-80 flex flex-col bg-black/30 backdrop-blur-sm">
            <div className="p-4 border-b border-white/10 shrink-0">
              <h3 className="text-sm font-semibold text-white/80">Up Next</h3>
              <p className="text-xs text-white/40">{DEMO_SONGS.length} songs</p>
            </div>
            
            <div className="flex-1 overflow-y-auto min-h-0">
              {DEMO_SONGS.map((song, index) => (
                <button
                  key={song.id}
                  onClick={() => handleSongSelect(index)}
                  className={`
                    w-full text-left px-4 py-3 transition-all border-b border-white/5
                    ${currentSong === index
                      ? 'bg-white/10'
                      : 'hover:bg-white/5'
                    }
                  `}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-white/10 to-white/5 flex items-center justify-center shrink-0">
                      {currentSong === index && isPlaying ? (
                        <div className="flex gap-0.5 items-end h-4">
                          <div className="w-0.5 rounded-full animate-bounce" style={{ height: '40%', animationDelay: '0ms', backgroundColor: 'hsl(24, 95%, 53%)' }} />
                          <div className="w-0.5 rounded-full animate-bounce" style={{ height: '70%', animationDelay: '150ms', backgroundColor: 'hsl(24, 95%, 53%)' }} />
                          <div className="w-0.5 rounded-full animate-bounce" style={{ height: '50%', animationDelay: '300ms', backgroundColor: 'hsl(24, 95%, 53%)' }} />
                          <div className="w-0.5 rounded-full animate-bounce" style={{ height: '80%', animationDelay: '450ms', backgroundColor: 'hsl(24, 95%, 53%)' }} />
                        </div>
                      ) : (
                        <Music className="w-4 h-4 text-white/40" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-medium truncate ${currentSong === index ? 'text-orange-500' : 'text-white/90'}`}>
                        {song.title}
                      </p>
                      <p className="text-xs text-white/40 truncate">{song.artist}</p>
                    </div>
                    <span className="text-xs text-white/30 shrink-0">{song.duration}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Toggle Playlist Button */}
      <button
        onClick={() => setShowPlaylist(!showPlaylist)}
        className={`absolute top-3 right-3 p-2 rounded-lg transition-all hover:bg-white/10 ${showPlaylist ? 'text-orange-500' : 'text-white/50'}`}
      >
        <List className="h-4 w-4" />
      </button>
    </div>
  );
};
