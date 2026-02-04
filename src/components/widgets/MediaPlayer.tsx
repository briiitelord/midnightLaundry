import { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX } from 'lucide-react';

interface MediaPlayerProps {
  src: string;
  title?: string;
  maxDuration?: number;
  artworkUrl?: string | null;
}

export default function MediaPlayer({ src, title, maxDuration, artworkUrl }: MediaPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
      if (maxDuration && audio.currentTime >= maxDuration) {
        audio.pause();
        audio.currentTime = maxDuration;
        setIsPlaying(false);
        setCurrentTime(maxDuration);
      }
    };

    const handleLoadedMetadata = () => {
      setDuration(maxDuration ? Math.min(audio.duration, maxDuration) : audio.duration);
    };

    const handleEnded = () => {
      setIsPlaying(false);
      if (maxDuration) {
        setCurrentTime(maxDuration);
      } else {
        setCurrentTime(0);
      }
    };

    const handleError = () => {
      setError('Failed to load audio');
      setIsPlaying(false);
      console.error('Audio load error:', audio.error);
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('error', handleError);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('error', handleError);
    };
  }, [maxDuration]);

  const handlePlayPause = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      // Reset to start if at the end
      if (maxDuration && audio.currentTime >= maxDuration) {
        audio.currentTime = 0;
        setCurrentTime(0);
      }
      audio.play().catch((err) => {
        console.error('Play failed:', err);
        setIsPlaying(false);
      });
      setIsPlaying(true);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
    if (newVolume > 0) {
      setIsMuted(false);
    }
  };

  const handleMuteToggle = () => {
    if (!audioRef.current) return;
    setIsMuted(!isMuted);
    audioRef.current.volume = isMuted ? volume : 0;
  };

  const handleProgressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseFloat(e.target.value);
    const clampedTime = maxDuration ? Math.min(newTime, maxDuration) : newTime;
    setCurrentTime(clampedTime);
    if (audioRef.current) {
      audioRef.current.currentTime = clampedTime;
    }
  };

  const formatTime = (time: number) => {
    if (!Number.isFinite(time)) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="w-full bg-gradient-to-r from-slate-100 to-slate-50 rounded-lg overflow-hidden border border-slate-200 shadow-sm">
      <audio
        ref={audioRef}
        src={src}
        preload="none"
        onVolumeChange={() => {}}
        crossOrigin="anonymous"
      />

      {/* Artwork Display */}
      {artworkUrl && (
        <div className="w-full aspect-square bg-gray-900 overflow-hidden">
          <img 
            src={artworkUrl} 
            alt={title || 'Album artwork'} 
            className="w-full h-full object-cover"
          />
        </div>
      )}

      <div className="p-4">
        {title && (
          <p className="text-sm font-semibold text-slate-700 mb-3 truncate">
            {title}
          </p>
        )}

      {error && (
        <div className="mb-3 p-2 bg-red-50 border border-red-200 rounded text-xs text-red-700">
          {error}
        </div>
      )}

      {/* Progress Bar */}
      <input
        type="range"
        min="0"
        max={Math.max(duration, 0)}
        value={currentTime}
        onChange={handleProgressChange}
        className="w-full h-1 bg-slate-300 rounded-lg appearance-none cursor-pointer accent-emerald-600 mb-2"
        disabled={!!error}
      />

      <div className="flex items-center justify-between text-xs text-slate-600 mb-3">
        <span>{formatTime(currentTime)}</span>
        <span>{formatTime(duration)}</span>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between gap-3">
        <button
          onClick={handlePlayPause}
          className="p-2 rounded-lg bg-forest bg-cover hover:opacity-90 text-white transition-all flex-shrink-0 disabled:opacity-50 disabled:cursor-not-allowed"
          title={isPlaying ? 'Pause' : 'Play'}
          disabled={!!error}
        >
          {isPlaying ? (
            <Pause className="w-4 h-4" />
          ) : (
            <Play className="w-4 h-4 ml-0.5" />
          )}
        </button>

        {/* Volume Control */}
        <div className="flex items-center gap-2 flex-1">
          <button
            onClick={handleMuteToggle}
            className="p-1.5 hover:bg-slate-200 rounded transition-colors flex-shrink-0"
            title={isMuted ? 'Unmute' : 'Mute'}
          >
            {isMuted ? (
              <VolumeX className="w-4 h-4 text-slate-600" />
            ) : (
              <Volume2 className="w-4 h-4 text-slate-600" />
            )}
          </button>

          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={isMuted ? 0 : volume}
            onChange={handleVolumeChange}
            className="h-1 bg-slate-300 rounded-lg appearance-none cursor-pointer accent-emerald-600 flex-1"
            title="Volume"
          />
        </div>
      </div>
      </div>
    </div>
  );
}