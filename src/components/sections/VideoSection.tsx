import { useState, useEffect } from 'react';
import { Video, Eye, EyeOff, AlertTriangle } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import type { Database } from '../../types/database.types';

type VideoItem = Database['public']['Tables']['videos']['Row'];

export default function VideoSection() {
  const [activeTab, setActiveTab] = useState<'sfw' | 'nsfw'>('sfw');
  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [ageVerified, setAgeVerified] = useState(false);
  const [showAgeGate, setShowAgeGate] = useState(false);
  const [showSecondConfirmation, setShowSecondConfirmation] = useState(false);

  useEffect(() => {
    fetchVideos();
  }, [activeTab]);

  const fetchVideos = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('videos')
      .select('*')
      .eq('content_rating', activeTab)
      .order('created_at', { ascending: false });

    if (!error && data) {
      setVideos(data);
    }
    setLoading(false);
  };

  const handleNSFWClick = () => {
    if (!ageVerified) {
      setShowAgeGate(true);
    } else {
      setActiveTab('nsfw');
    }
  };

  const handleAgeVerification = (verified: boolean) => {
    if (verified) {
      setShowAgeGate(false);
      setShowSecondConfirmation(true);
    } else {
      setShowAgeGate(false);
      setActiveTab('sfw');
    }
  };

  const handleFinalConfirmation = (confirmed: boolean) => {
    if (confirmed) {
      // Play bacon sizzling sound effect for 2.2 seconds
      const sizzle = new Audio('https://cdn.freesound.org/previews/321/321903_5260872-lq.mp3');
      sizzle.volume = 0.5;
      
      // Add event listener to ensure it plays
      sizzle.addEventListener('canplaythrough', () => {
        sizzle.play().catch(err => {
          console.log('Audio play failed:', err);
          // Try alternative sound if first fails
          const backup = new Audio('https://www.soundjay.com/misc/sounds/sizzle-1.mp3');
          backup.volume = 0.5;
          backup.play().catch(e => console.log('Backup audio failed:', e));
          setTimeout(() => {
            backup.pause();
            backup.currentTime = 0;
          }, 2200);
        });
      }, { once: true });
      
      sizzle.load();
      
      // Stop audio after 2.2 seconds
      setTimeout(() => {
        sizzle.pause();
        sizzle.currentTime = 0;
      }, 2200);
      
      setAgeVerified(true);
      setShowSecondConfirmation(false);
      setActiveTab('nsfw');
    } else {
      setShowSecondConfirmation(false);
      setActiveTab('sfw');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex gap-3">
        <button
          onClick={() => setActiveTab('sfw')}
          className={`
            flex items-center space-x-2 px-6 py-3 rounded-lg font-semibold
            transition-all duration-200 border-2
            ${
              activeTab === 'sfw'
                ? 'bg-emerald-600 text-white border-emerald-700 shadow-lg'
                : 'bg-white text-gray-700 border-gray-200 hover:border-emerald-500'
            }
          `}
        >
          <Eye className="w-5 h-5" />
          <span>SFW Videos</span>
        </button>

        <button
          onClick={handleNSFWClick}
          className={`
            flex items-center space-x-2 px-6 py-3 rounded-lg font-semibold
            transition-all duration-200 border-2
            ${
              activeTab === 'nsfw'
                ? 'bg-red-600 text-white border-red-700 shadow-lg'
                : 'bg-white text-gray-700 border-gray-200 hover:border-red-500'
            }
          `}
        >
          <EyeOff className="w-5 h-5" />
          <span>NSFW Videos</span>
          {!ageVerified && <AlertTriangle className="w-4 h-4" />}
        </button>
      </div>

      {showAgeGate && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-6">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-8">
            <AlertTriangle className="w-16 h-16 text-red-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-4 text-center">
              Age Verification Required
            </h2>
            <p className="text-gray-600 mb-6 text-center">
              You must be 18 years or older to view NSFW content. By clicking "I'm 18+", you confirm that you meet the age requirement.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => handleAgeVerification(true)}
                className="flex-1 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-semibold"
              >
                I'm 18+
              </button>
              <button
                onClick={() => handleAgeVerification(false)}
                className="flex-1 px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-semibold"
              >
                Exit
              </button>
            </div>
          </div>
        </div>
      )}

      {showSecondConfirmation && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-6">
          <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-xl shadow-2xl max-w-md w-full p-8 border-2 border-red-300">
            <div className="text-center mb-6">
              <div className="text-6xl mb-4">🔥</div>
              <h2 className="text-2xl font-bold text-red-900 mb-3">
                Are you SURE you're 18+?
              </h2>
              <p className="text-red-700 font-semibold text-lg">
                ...it gets hot in this kitchen...
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => handleFinalConfirmation(true)}
                className="flex-1 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-semibold shadow-lg"
              >
                Yes, I'm Sure 🔥
              </button>
              <button
                onClick={() => handleFinalConfirmation(false)}
                className="flex-1 px-6 py-3 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 transition-colors font-semibold"
              >
                Take Me Back
              </button>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'nsfw' && !ageVerified ? (
        <div className="bg-white rounded-xl shadow-md p-12 text-center border border-gray-100">
          <EyeOff className="w-16 h-16 mx-auto text-gray-300 mb-4" />
          <p className="text-gray-600">Please verify your age to view NSFW content</p>
        </div>
      ) : (
        <div className="space-y-4">
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-emerald-600 border-t-transparent"></div>
              <p className="text-gray-600 mt-4">Loading videos...</p>
            </div>
          ) : videos.length === 0 ? (
            <div className="bg-white rounded-xl shadow-md p-12 text-center border border-gray-100">
              <Video className="w-16 h-16 mx-auto text-gray-300 mb-4" />
              <p className="text-gray-600">No videos in this category yet</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {videos.map((video) => (
                <div
                  key={video.id}
                  className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 group"
                >
                  <div className="p-6">
                    {(() => {
                      const previewUrl = video.content_rating === 'nsfw'
                        ? (video.preview_blurred_url || video.preview_url)
                        : video.preview_url;

                      if (previewUrl) {
                        return (
                          <div className="mb-4 aspect-video bg-gray-100 rounded-lg overflow-hidden">
                            <img
                              src={previewUrl}
                              alt={`${video.title} preview`}
                              className="w-full h-full object-cover"
                              loading="lazy"
                            />
                          </div>
                        );
                      }

                      if (video.embed_url) {
                        return (
                          <div className="mb-4 aspect-video">
                            <iframe
                              src={video.embed_url}
                              className="w-full h-full rounded-lg"
                              allow="autoplay; fullscreen"
                            />
                          </div>
                        );
                      }

                      return null;
                    })()}
                    <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-emerald-700 transition-colors">
                      {video.title}
                    </h3>
                    {video.description && (
                      <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                        {video.description}
                      </p>
                    )}

                    {video.is_paygated && video.paygate_url && (
                      <a
                        href={video.paygate_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block w-full px-4 py-3 bg-gradient-to-r from-amber-400 to-yellow-500 text-black rounded-lg hover:from-amber-500 hover:to-yellow-600 transition-all font-semibold text-center"
                      >
                        View Full Content
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
