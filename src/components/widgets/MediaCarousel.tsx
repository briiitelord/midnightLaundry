import { useState, useEffect, useRef } from 'react';
import { Play, Pause, SkipForward, Volume2, VolumeX } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { Database } from '../../types/database.types';

type VideoItem = Database['public']['Tables']['videos']['Row'];
type MusicItem = Database['public']['Tables']['music_items']['Row'];

type MediaItem = 
  | { type: 'audio'; item: MusicItem }
  | { type: 'video'; item: VideoItem };

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
        .select('*')
        .not('file_url', 'is', null)
        .limit(11);

      // Fetch videos
      const { data: videoData } = await supabase
        .from('videos')
        .select('*')
        .not('file_url', 'is', null)
        .limit(11);

      const music: MediaItem[] = (musicData || []).map(item => ({
        type: 'audio' as const,
        item: item
      }));

      const videos: MediaItem[] = (videoData || []).map(item => ({
        type: 'video' as const,
        item: item
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
    // Stop playback when item changes and reset media elements
    pauseCurrentMedia();
    setIsPlaying(false);
    setCurrentTime(0);
    
    // Load the new media
    const mediaElement = currentItem?.type === 'audio' ? audioRef.current : videoRef.current;
    if (mediaElement && mediaUrl) {
      mediaElement.load();
      
      // Autoplay after a short delay to ensure media is loaded
      const autoplayTimer = setTimeout(() => {
        playCurrentMedia();
      }, 100);
      
      return () => clearTimeout(autoplayTimer);
    }
  }, [currentIndex]);

  const playCurrentMedia = () => {
    const mediaElement = currentItem?.type === 'audio' ? audioRef.current : videoRef.current;
    if (mediaElement && mediaUrl) {
      // Ensure media is loaded before playing
      if (mediaElement.readyState === 0) {
        mediaElement.load();
      }
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

  const mediaUrl = currentItem.type === 'audio' 
    ? (currentItem.item.preview_url || currentItem.item.file_url)
    : (currentItem.item.preview_url || currentItem.item.file_url);

  // Debug log to check if URLs are present
  if (!mediaUrl) {
    console.warn('No media URL for item:', currentItem);
  }

  return (
    <div className="bg-gradient-to-br from-canopy-100 to-canopy-50 rounded-xl p-6 border border-canopy-200 shadow-lg">
      <div className="space-y-4">
        {/* Media Display */}
        <div className="relative bg-forest-950 rounded-lg overflow-hidden aspect-video flex items-center justify-center">
          {currentItem.type === 'audio' ? (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-emerald-900 to-slate-900 relative">
              {/* Artwork Background */}
              {currentItem.item.artwork_url && (
                <div className="absolute inset-0">
                  <img 
                    src={currentItem.item.artwork_url} 
                    alt={currentItem.item.title} 
                    className="w-full h-full object-cover opacity-30 blur-sm"
                  />
                  <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/70 to-slate-900/70"></div>
                </div>
              )}
              <audio
                ref={audioRef}
                src={mediaUrl || ''}
                preload="metadata"
                className="hidden"
                crossOrigin="anonymous"
                muted={isMuted}
              />
              <div className="text-center space-y-4 relative z-10">
                {/* Artwork */}
                {currentItem.item.artwork_url ? (
                  <div className="w-48 h-48 mx-auto rounded-lg overflow-hidden shadow-2xl ring-4 ring-emerald-500/30">
                    <img 
                      src={currentItem.item.artwork_url} 
                      alt={currentItem.item.title} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-24 h-24 bg-emerald-600 rounded-full flex items-center justify-center mx-auto">
                    {isPlaying ? (
                      <Pause className="w-12 h-12 text-white" />
                    ) : (
                      <Play className="w-12 h-12 text-white ml-1" />
                    )}
                  </div>
                )}
                <p className="text-white text-lg font-semibold px-4">{currentItem.item.title}</p>
              </div>
            </div>
          ) : (
            <video
              ref={videoRef}
              src={mediaUrl || ''}
              preload="metadata"
              className="w-full h-full object-cover"
              crossOrigin="anonymous"
              muted={isMuted}
            />
          )}
        </div>

        {/* Info */}
        <div className="px-2">
          <h3 className="font-bold text-slate-900 truncate">{currentItem.item.title}</h3>
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
