import { useState, useEffect, useRef } from 'react';
import { Play, Pause, SkipForward, Volume2, VolumeX } from 'lucide-react';
import { supabase } from '../../lib/supabase';

type MediaItem = {
  id: string;
  title: string;
  type: 'audio' | 'video';
  url: string;
  preview_url?: string | null;
};

export default function MediaCarousel() {
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const PREVIEW_DURATION = 11; // seconds

  useEffect(() => {
    fetchMediaItems();
  }, []);

  const fetchMediaItems = async () => {
    try {
      // Fetch music items
      const { data: musicData } = await supabase
        .from('music_items')
        .select('id, title, file_url, preview_url')
        .not('file_url', 'is', null)
        .limit(11);

      // Fetch videos
      const { data: videoData } = await supabase
        .from('videos')
        .select('id, title, video_url, preview_url')
        .not('video_url', 'is', null)
        .limit(11);

      const music: MediaItem[] = (musicData || []).map(item => ({
        id: item.id,
        title: item.title,
        type: 'audio' as const,
        url: item.file_url!,
        preview_url: item.preview_url,
      }));

      const videos: MediaItem[] = (videoData || []).map(item => ({
        id: item.id,
        title: item.title,
        type: 'video' as const,
        url: item.video_url!,
        preview_url: item.preview_url,
      }));

      // Shuffle and combine
      const combined = [...music, ...videos].sort(() => Math.random() - 0.5);
      setMediaItems(combined);
    } catch (error) {
      console.error('Error fetching media items:', error);
    }
  };

  const currentItem = mediaItems[currentIndex];

  useEffect(() => {
    const mediaElement = currentItem?.type === 'audio' ? audioRef.current : videoRef.current;
    if (!mediaElement) return;

    const handleTimeUpdate = () => {
      setCurrentTime(mediaElement.currentTime);
      if (mediaElement.currentTime >= PREVIEW_DURATION) {
        handleNext();
      }
    };

    const handleEnded = () => {
      handleNext();
    };

    mediaElement.addEventListener('timeupdate', handleTimeUpdate);
    mediaElement.addEventListener('ended', handleEnded);

    return () => {
      mediaElement.removeEventListener('timeupdate', handleTimeUpdate);
      mediaElement.removeEventListener('ended', handleEnded);
    };
  }, [currentIndex, currentItem]);

  useEffect(() => {
    // Auto-play when item changes if we were playing
    if (isPlaying && currentItem) {
      playCurrentMedia();
    }
  }, [currentIndex]);

  const playCurrentMedia = () => {
    const mediaElement = currentItem?.type === 'audio' ? audioRef.current : videoRef.current;
    if (mediaElement) {
      mediaElement.currentTime = 0;
      mediaElement.play().catch(err => console.error('Play failed:', err));
      setIsPlaying(true);
      setCurrentTime(0);
    }
  };

  const pauseCurrentMedia = () => {
    const mediaElement = currentItem?.type === 'audio' ? audioRef.current : videoRef.current;
    if (mediaElement) {
      mediaElement.pause();
      setIsPlaying(false);
    }
  };

  const handlePlayPause = () => {
    if (isPlaying) {
      pauseCurrentMedia();
    } else {
      playCurrentMedia();
    }
  };

  const handleNext = () => {
    pauseCurrentMedia();
    setCurrentIndex((prev) => (prev + 1) % mediaItems.length);
  };

  const handleMuteToggle = () => {
    const mediaElement = currentItem?.type === 'audio' ? audioRef.current : videoRef.current;
    if (mediaElement) {
      mediaElement.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  if (mediaItems.length === 0) {
    return (
      <div className="bg-gradient-to-br from-slate-100 to-slate-50 rounded-xl p-8 border border-slate-200 shadow-sm">
        <p className="text-slate-500 text-center">Loading media...</p>
      </div>
    );
  }

  if (!currentItem) return null;

  const mediaUrl = currentItem.preview_url || currentItem.url;

  return (
    <div className="bg-gradient-to-br from-canopy-100 to-canopy-50 rounded-xl p-6 border border-canopy-200 shadow-lg">
      <div className="space-y-4">
        {/* Media Display */}
        <div className="relative bg-forest-950 rounded-lg overflow-hidden aspect-video flex items-center justify-center">
          {currentItem.type === 'audio' ? (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-emerald-900 to-slate-900">
              <audio
                ref={audioRef}
                src={mediaUrl}
                className="hidden"
                crossOrigin="anonymous"
              />
              <div className="text-center space-y-4">
                <div className="w-24 h-24 bg-emerald-600 rounded-full flex items-center justify-center mx-auto">
                  <Play className="w-12 h-12 text-white" />
                </div>
                <p className="text-white text-lg font-semibold px-4">{currentItem.title}</p>
              </div>
            </div>
          ) : (
            <video
              ref={videoRef}
              src={mediaUrl}
              className="w-full h-full object-cover"
              crossOrigin="anonymous"
            />
          )}
        </div>

        {/* Info */}
        <div className="px-2">
          <h3 className="font-bold text-slate-900 truncate">{currentItem.title}</h3>
          <p className="text-xs text-slate-600 capitalize">{currentItem.type}</p>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2 px-2">
          <div className="h-1.5 bg-canopy-300 rounded-full overflow-hidden">
            <div 
              className="h-full bg-forest bg-cover transition-all duration-300"
              style={{ width: `${(currentTime / PREVIEW_DURATION) * 100}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-slate-600">
            <span>{Math.floor(currentTime)}s</span>
            <span>{PREVIEW_DURATION}s</span>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between gap-3 px-2">
          <button
            onClick={handlePlayPause}
            className="p-3 rounded-lg bg-forest bg-cover hover:opacity-90 text-white transition-all"
            title={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? (
              <Pause className="w-5 h-5" />
            ) : (
              <Play className="w-5 h-5 ml-0.5" />
            )}
          </button>

          <button
            onClick={handleNext}
            className="p-3 rounded-lg bg-forest-800 hover:bg-forest-900 text-white transition-colors"
            title="Next"
          >
            <SkipForward className="w-5 h-5" />
          </button>

          <button
            onClick={handleMuteToggle}
            className="p-3 rounded-lg hover:bg-slate-200 transition-colors"
            title={isMuted ? 'Unmute' : 'Mute'}
          >
            {isMuted ? (
              <VolumeX className="w-5 h-5 text-slate-600" />
            ) : (
              <Volume2 className="w-5 h-5 text-slate-600" />
            )}
          </button>

          <div className="text-sm text-canopy-700">
            {currentIndex + 1} / {mediaItems.length}
          </div>
        </div>
      </div>
    </div>
  );
}
