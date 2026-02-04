import { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Play, Pause, Volume2, VolumeX, Maximize } from 'lucide-react';

interface MediaItem {
  id: string;
  title: string;
  description: string | null;
  file_url: string | null;
  preview_url: string | null;
  type: 'video' | 'audio';
}

interface CarouselMediaPlayerProps {
  items: MediaItem[];
}

export default function CarouselMediaPlayer({ items }: CarouselMediaPlayerProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(1);
  const videoRef = useRef<HTMLVideoElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  const currentItem = items[currentIndex];
  const mediaRef = currentItem?.type === 'video' ? videoRef : audioRef;

  useEffect(() => {
    // Reset play state when changing items
    setIsPlaying(false);
    if (videoRef.current) videoRef.current.pause();
    if (audioRef.current) audioRef.current.pause();
  }, [currentIndex]);

  const handlePlayPause = () => {
    const media = mediaRef.current;
    if (!media) return;

    if (isPlaying) {
      media.pause();
    } else {
      media.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleVolumeToggle = () => {
    const media = mediaRef.current;
    if (!media) return;

    media.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    
    if (videoRef.current) videoRef.current.volume = newVolume;
    if (audioRef.current) audioRef.current.volume = newVolume;
    
    if (newVolume === 0) {
      setIsMuted(true);
    } else if (isMuted) {
      setIsMuted(false);
    }
  };

  const handleFullscreen = () => {
    if (videoRef.current) {
      if (videoRef.current.requestFullscreen) {
        videoRef.current.requestFullscreen();
      }
    }
  };

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? items.length - 1 : prev - 1));
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev === items.length - 1 ? 0 : prev + 1));
  };

  const handleMediaEnd = () => {
    // Auto-advance to next item when current one ends
    goToNext();
  };

  if (!items.length || !currentItem) {
    return (
      <div className="bg-white rounded-xl shadow-md p-12 text-center border border-gray-100">
        <p className="text-gray-600">No performances available yet</p>
      </div>
    );
  }

  const mediaUrl = currentItem.file_url || currentItem.preview_url;

  return (
    <div className="bg-white rounded-xl shadow-xl overflow-hidden border border-gray-100">
      {/* Media Display Area */}
      <div className="relative bg-black aspect-video">
        {currentItem.type === 'video' ? (
          <video
            ref={videoRef}
            src={mediaUrl || undefined}
            className="w-full h-full object-contain"
            preload="metadata"
            onEnded={handleMediaEnd}
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
            crossOrigin="anonymous"
          >
            Your browser does not support the video tag.
          </video>
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900">
            <div className="text-center">
              <div className="text-8xl mb-4">🎤</div>
              <h3 className="text-white text-2xl font-bold">{currentItem.title}</h3>
              <audio
                ref={audioRef}
                src={mediaUrl || undefined}
                preload="metadata"
                onEnded={handleMediaEnd}
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
                crossOrigin="anonymous"
              />
            </div>
          </div>
        )}

        {/* Fullscreen Button (Video Only) */}
        {currentItem.type === 'video' && (
          <button
            onClick={handleFullscreen}
            className="absolute top-4 right-4 p-2 bg-black/60 hover:bg-black/80 rounded-lg transition-colors"
            title="Fullscreen"
          >
            <Maximize className="w-5 h-5 text-white" />
          </button>
        )}
      </div>

      {/* Controls */}
      <div className="p-6 space-y-4">
        {/* Title and Description */}
        <div className="text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-2">{currentItem.title}</h3>
          {currentItem.description && (
            <p className="text-gray-600">{currentItem.description}</p>
          )}
          <p className="text-sm text-gray-500 mt-2">
            {currentIndex + 1} of {items.length}
          </p>
        </div>

        {/* Playback Controls */}
        <div className="flex items-center justify-center gap-6">
          {/* Previous Button */}
          <button
            onClick={goToPrevious}
            className="p-3 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
            title="Previous"
          >
            <ChevronLeft className="w-6 h-6 text-gray-700" />
          </button>

          {/* Play/Pause Button */}
          <button
            onClick={handlePlayPause}
            className="p-4 bg-emerald-600 hover:bg-emerald-700 rounded-full transition-colors shadow-lg"
            title={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? (
              <Pause className="w-8 h-8 text-white" />
            ) : (
              <Play className="w-8 h-8 text-white ml-1" />
            )}
          </button>

          {/* Next Button */}
          <button
            onClick={goToNext}
            className="p-3 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
            title="Next"
          >
            <ChevronRight className="w-6 h-6 text-gray-700" />
          </button>
        </div>

        {/* Volume Controls */}
        <div className="flex items-center justify-center gap-3 max-w-xs mx-auto">
          <button
            onClick={handleVolumeToggle}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            title={isMuted ? 'Unmute' : 'Mute'}
          >
            {isMuted || volume === 0 ? (
              <VolumeX className="w-5 h-5 text-gray-600" />
            ) : (
              <Volume2 className="w-5 h-5 text-gray-600" />
            )}
          </button>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={volume}
            onChange={handleVolumeChange}
            className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            style={{
              background: `linear-gradient(to right, #10b981 0%, #10b981 ${volume * 100}%, #e5e7eb ${volume * 100}%, #e5e7eb 100%)`
            }}
          />
        </div>

        {/* Thumbnail Navigation */}
        {items.length > 1 && (
          <div className="flex gap-2 overflow-x-auto pb-2">
            {items.map((item, index) => (
              <button
                key={item.id}
                onClick={() => setCurrentIndex(index)}
                className={`
                  flex-shrink-0 px-4 py-2 rounded-lg text-sm font-medium transition-all
                  ${index === currentIndex
                    ? 'bg-emerald-600 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }
                `}
              >
                {index + 1}. {item.title.length > 20 ? item.title.substring(0, 20) + '...' : item.title}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
