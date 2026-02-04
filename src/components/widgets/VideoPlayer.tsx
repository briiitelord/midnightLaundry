import { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, Maximize } from 'lucide-react';

interface VideoPlayerProps {
  src: string;
  title?: string;
  poster?: string;
}

export default function VideoPlayer({ src, title, poster }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleTimeUpdate = () => {
      setCurrentTime(video.currentTime);
    };

    const handleLoadedMetadata = () => {
      setDuration(video.duration);
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
      // Explicitly ensure video doesn't loop
      if (video.currentTime >= video.duration) {
        video.currentTime = 0;
      }
    };

    const handleError = () => {
      setError('Failed to load video');
      setIsPlaying(false);
      console.error('Video load error:', video.error);
    };

    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('loadedmetadata', handleLoadedMetadata);
    video.addEventListener('ended', handleEnded);
    video.addEventListener('error', handleError);
    document.addEventListener('fullscreenchange', handleFullscreenChange);

    return () => {
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
      video.removeEventListener('ended', handleEnded);
      video.removeEventListener('error', handleError);
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  const handlePlayPause = () => {
    const video = videoRef.current;
    if (!video) return;

    if (isPlaying) {
      video.pause();
      setIsPlaying(false);
    } else {
      video.play().catch((err) => {
        console.error('Play failed:', err);
        setIsPlaying(false);
      });
      setIsPlaying(true);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (videoRef.current) {
      videoRef.current.volume = newVolume;
    }
    if (newVolume > 0) {
      setIsMuted(false);
    }
  };

  const handleMuteToggle = () => {
    if (!videoRef.current) return;
    setIsMuted(!isMuted);
    videoRef.current.volume = isMuted ? volume : 0;
  };

  const handleProgressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseFloat(e.target.value);
    setCurrentTime(newTime);
    if (videoRef.current) {
      videoRef.current.currentTime = newTime;
    }
  };

  const handleFullscreen = async () => {
    if (!containerRef.current) return;

    try {
      if (!document.fullscreenElement) {
        await containerRef.current.requestFullscreen();
      } else {
        await document.exitFullscreen();
      }
    } catch (err) {
      console.error('Fullscreen failed:', err);
    }
  };

  const formatTime = (time: number) => {
    if (!Number.isFinite(time)) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div 
      ref={containerRef}
      className="w-full bg-black rounded-lg overflow-hidden shadow-lg relative group"
    >
      <div className="relative aspect-video">
        <video
          ref={videoRef}
          src={src}
          poster={poster}
          preload="none"
          className="w-full h-full object-contain"
          crossOrigin="anonymous"
          playsInline
          disablePictureInPicture
          controlsList="nodownload"
          onClick={handlePlayPause}
        >
          Your browser does not support the video tag.
        </video>

        {/* Play button overlay */}
        {!isPlaying && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/30 cursor-pointer" onClick={handlePlayPause}>
            <div className="w-20 h-20 bg-white/90 rounded-full flex items-center justify-center hover:bg-white transition-all">
              <Play className="w-10 h-10 text-black ml-1" />
            </div>
          </div>
        )}

        {/* Controls overlay */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 opacity-0 group-hover:opacity-100 transition-opacity">
          {title && (
            <p className="text-sm font-semibold text-white mb-2 truncate">
              {title}
            </p>
          )}

          {error && (
            <div className="mb-2 p-2 bg-red-600/90 rounded text-xs text-white">
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
            className="w-full h-1 bg-white/30 rounded-lg appearance-none cursor-pointer accent-red-600 mb-2"
            disabled={!!error}
          />

          <div className="flex items-center justify-between text-xs text-white mb-2">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-between gap-3">
            <button
              onClick={handlePlayPause}
              className="p-2 rounded-lg bg-white/20 hover:bg-white/30 text-white transition-all flex-shrink-0 disabled:opacity-50 disabled:cursor-not-allowed"
              title={isPlaying ? 'Pause' : 'Play'}
              disabled={!!error}
            >
              {isPlaying ? (
                <Pause className="w-5 h-5" />
              ) : (
                <Play className="w-5 h-5" />
              )}
            </button>

            {/* Volume Control */}
            <div className="flex items-center gap-2 flex-1">
              <button
                onClick={handleMuteToggle}
                className="p-2 hover:bg-white/20 rounded transition-colors flex-shrink-0"
                title={isMuted ? 'Unmute' : 'Mute'}
              >
                {isMuted ? (
                  <VolumeX className="w-5 h-5 text-white" />
                ) : (
                  <Volume2 className="w-5 h-5 text-white" />
                )}
              </button>

              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={isMuted ? 0 : volume}
                onChange={handleVolumeChange}
                className="h-1 bg-white/30 rounded-lg appearance-none cursor-pointer accent-red-600 flex-1 max-w-24"
                title="Volume"
              />
            </div>

            {/* Fullscreen */}
            <button
              onClick={handleFullscreen}
              className="p-2 rounded-lg bg-white/20 hover:bg-white/30 text-white transition-all flex-shrink-0"
              title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
            >
              <Maximize className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
