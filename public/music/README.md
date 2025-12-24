# Music Folder

Place your MP3 files in this folder to use them in the Music Player.

## How to add your music:

1. **Copy your MP3 files** to this folder (`public/music/`)

2. **Rename your files** to match the expected names:
   - `song1.mp3`
   - `song2.mp3`
   - `song3.mp3`
   - `song4.mp3`
   - `song5.mp3`
   - `song6.mp3`
   - `song7.mp3`
   - `song8.mp3`
   - `song9.mp3`
   - `song10.mp3`

3. **Update song details** in `src/components/apps/MusicPlayer.tsx`:
   - Open the file
   - Find the `DEMO_SONGS` array
   - Update the `title` and `artist` for each song

## Example:

```typescript
const DEMO_SONGS: Song[] = [
  {
    id: 1,
    title: 'My Favorite Song',    // Your song title
    artist: 'Artist Name',         // Artist name
    url: '/music/song1.mp3',       // Keep this path
    duration: '0:00',              // Will auto-detect
  },
  // ... more songs
];
```

## Supported Formats:
- MP3 (recommended)
- WAV
- OGG
- M4A

## Notes:
- The duration will be automatically detected when the song loads
- Make sure your audio files are properly encoded
- Larger files may take longer to load
