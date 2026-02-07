import { useState, useEffect } from 'react';
import { Music, Disc3, ShoppingCart, Mail } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import CommissionForm from '../forms/CommissionForm';
import MediaPlayer from '../widgets/MediaPlayer';
import PurchaseModal from '../widgets/PurchaseModal';
import LegalDocumentView from '../LegalDocumentView';
import { FEATURE_FLAGS } from '../../config/featureFlags';

type MusicFile = {
  preview_url: string | null;
  preview_status: string | null;
  id: string;
  title: string;
  description: string | null;
  category: 'new_release' | 'mix' | 'beat_for_sale' | 'podcast_clip' | 'exclusive_release';
  file_url: string | null;
  embed_url: string | null;
  price: number;
  is_exclusive: boolean;
  embed_full_track: boolean;
  legal_docs: string[];
  producer_credit: string;
  view_count: number;
  created_at: string;
  source_type: 'direct_upload' | 'united_masters' | null;
  united_masters_link: string | null;
  license_single_use_price: number | null;
  license_master_file_price: number | null;
};
type MusicCategory = 'new_release' | 'mix' | 'beat_for_sale' | 'podcast_clip' | 'exclusive_release';

export default function MusicSection() {
  const [activeTab, setActiveTab] = useState<MusicCategory | 'commission'>('new_release');
  const [musicItems, setMusicItems] = useState<MusicFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [purchaseModal, setPurchaseModal] = useState<MusicFile | null>(null);
  const [legalModalSlug, setLegalModalSlug] = useState<string | null>(null);

  useEffect(() => {
    fetchMusicItems();
  }, [activeTab]);

  const fetchMusicItems = async () => {
    if (activeTab === 'commission') {
      setLoading(false);
      return;
    }

    setLoading(true);
    const { data, error } = await supabase
      .from('music_items')
      .select('*')
      .eq('category', activeTab)
      .order('created_at', { ascending: false });

    if (!error && data) {
      setMusicItems(data);
    }
    setLoading(false);
  };

  const tabs = [
    { id: 'new_release' as const, label: 'New Release', icon: Music },
    { id: 'mix' as const, label: 'Mixes', icon: Disc3 },
    { id: 'beat_for_sale' as const, label: 'Beats 4 Sale', icon: ShoppingCart },
    { id: 'commission' as const, label: 'Commission Work', icon: Mail },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-3">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                flex items-center space-x-2 px-5 py-3 rounded-lg font-semibold
                transition-all duration-200 border-2
                ${
                  isActive
                    ? 'bg-forest bg-cover text-white border-forest-800 shadow-lg'
                    : 'bg-white text-gray-700 border-gray-200 hover:border-forest-600 hover:text-forest-700'
                }
              `}
            >
              <Icon className="w-5 h-5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {activeTab === 'commission' ? (
        <div className="bg-white rounded-xl shadow-md p-8 border border-gray-100">
          <CommissionForm />
        </div>
      ) : (
        <div className="space-y-4">
          {/* SoundCloud Playlist Embed for Mixes tab */}
          {activeTab === 'mix' && (
            <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
              <h3 className="text-xl font-bold text-gray-900 mb-4">midnightLaundry Mixes</h3>
              <iframe 
                width="100%" 
                height="450" 
                scrolling="no" 
                frameBorder="no" 
                allow="encrypted-media" 
                src="https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/playlists/soundcloud%253Aplaylists%253A2186055977&color=%23287530&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true&visual=true"
                loading="lazy"
                sandbox="allow-scripts allow-same-origin allow-presentation"
              />
              <div style={{fontSize: '10px', color: '#cccccc', lineBreak: 'anywhere', wordBreak: 'normal', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis', fontFamily: 'Interstate,Lucida Grande,Lucida Sans Unicode,Lucida Sans,Garuda,Verdana,Tahoma,sans-serif', fontWeight: 100}}>
                <a href="https://soundcloud.com/likeprayer" title="briiite." target="_blank" rel="noopener noreferrer" style={{color: '#cccccc', textDecoration: 'none'}}>briiite.</a> · <a href="https://soundcloud.com/likeprayer/sets/midnightlaundry-mixes" title="midnightLaundry Mixes" target="_blank" rel="noopener noreferrer" style={{color: '#cccccc', textDecoration: 'none'}}>midnightLaundry Mixes</a>
              </div>
            </div>
          )}
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-emerald-600 border-t-transparent"></div>
              <p className="text-gray-600 mt-4">Loading music...</p>
            </div>
          ) : musicItems.length === 0 ? (
            <div className="bg-white rounded-xl shadow-md p-12 text-center border border-gray-100">
              <Music className="w-16 h-16 mx-auto text-gray-300 mb-4" />
              <p className="text-gray-600">No items in this category yet</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {musicItems.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 group"
                >
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-emerald-700 transition-colors">
                      {item.title}
                    </h3>
                    {item.description && (
                      <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                        {item.description}
                      </p>
                    )}

                    {/* United Masters Link */}
                    {item.source_type === 'united_masters' && item.united_masters_link && (
                      <div className="mb-4">
                        <div className="bg-gradient-to-br from-purple-50 to-indigo-50 border-2 border-purple-200 rounded-lg p-4">
                          <div className="flex items-center gap-3 mb-3">
                            <Music className="w-6 h-6 text-purple-600" />
                            <div className="flex-1">
                              <p className="text-sm font-semibold text-purple-900">Available on United Masters</p>
                              <p className="text-xs text-purple-700">Full track with cover art</p>
                            </div>
                          </div>
                          <a
                            href={item.united_masters_link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block w-full px-4 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-lg font-semibold text-center transition-all shadow-md hover:shadow-lg"
                          >
                            Listen on United Masters →
                          </a>
                        </div>
                      </div>
                    )}

                    {/* Regular preview/file player */}
                    {item.source_type !== 'united_masters' && (() => {
                      // Feature flag: Enhanced embed handling
                      if (!FEATURE_FLAGS.USE_ENHANCED_EMBED_HANDLING) {
                        // Fallback: Simple rendering without embed detection
                        const audioSource = item.preview_url || item.file_url;
                        if (audioSource) {
                          return (
                            <div className="mb-4">
                              <MediaPlayer
                                src={audioSource}
                                title={`${item.title} ${(item.embed_full_track ?? false) ? '' : '(Preview)'}`}
                                maxDuration={(item.embed_full_track ?? false) ? undefined : 22}
                                artworkUrl={item.artwork_url}
                              />
                            </div>
                          );
                        }
                        return null;
                      }

                      // Enhanced logic with embed detection
                      // Helper function to check if URL is an actual embed player (not a direct file)
                      const isEmbedPlayer = (url: string) => {
                        const lowerUrl = url.toLowerCase();
                        return (
                          lowerUrl.includes('soundcloud.com/player') ||
                          lowerUrl.includes('spotify.com/embed') ||
                          lowerUrl.includes('youtube.com/embed') ||
                          lowerUrl.includes('bandcamp.com/EmbeddedPlayer') ||
                          lowerUrl.includes('audiomack.com/embed')
                        );
                      };

                      // Determine the source to use: preview_url > file_url
                      const audioSource = item.preview_url || item.file_url;
                      
                      // Show embed player ONLY if embed_url is a real embed player
                      if (item.embed_url && isEmbedPlayer(item.embed_url)) {
                        // Ensure autoplay is disabled
                        let embedUrl = item.embed_url;
                        
                        // Remove any existing autoplay parameters first
                        embedUrl = embedUrl.replace(/[?&]autoplay=1/gi, '');
                        embedUrl = embedUrl.replace(/[?&]auto_play=true/gi, '');
                        
                        const separator = embedUrl.includes('?') ? '&' : '?';
                        embedUrl = `${embedUrl}${separator}autoplay=0&auto_play=false`;
                        
                        return (
                          <div className="mb-4">
                            <iframe
                              src={embedUrl}
                              className="w-full h-32 rounded-lg"
                              allow="encrypted-media"
                              loading="lazy"
                              sandbox="allow-scripts allow-same-origin allow-presentation"
                            />
                          </div>
                        );
                      }

                      // Show preview status
                      if (item.preview_status === 'pending') {
                        return (
                          <div className="mb-4 text-sm text-gray-500 italic">
                            Preview generating...
                          </div>
                        );
                      }

                      if (item.preview_status === 'failed') {
                        return (
                          <div className="mb-4 text-sm text-red-500 italic">
                            Preview generation failed. Using limited playback.
                          </div>
                        );
                      }

                      // Use MediaPlayer for audio files
                      if (audioSource) {
                        return (
                          <div className="mb-4">
                            <MediaPlayer
                              src={audioSource}
                              title={`${item.title} ${(item.embed_full_track ?? false) ? '' : '(Preview)'}`}
                              maxDuration={(item.embed_full_track ?? false) ? undefined : 22}
                              artworkUrl={item.artwork_url}
                            />
                          </div>
                        );
                      }

                      return null;
                    })()}

                    {/* Metadata Section */}
                    <div className="bg-gray-50 rounded-lg p-3 mb-4 space-y-2 text-sm">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">
                          <span className="font-semibold">Producer:</span> {item.producer_credit}
                        </span>
                        <span className="text-gray-500">{item.view_count} plays</span>
                      </div>

                      {item.legal_docs && item.legal_docs.length > 0 && (
                        <div className="pt-2 border-t border-gray-200">
                          <p className="text-gray-600 font-semibold mb-1">Legal:</p>
                          <div className="flex flex-wrap gap-2">
                            {item.legal_docs.map((slug) => {
                              const docTitle = slug
                                .split('-')
                                .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                                .join(' ');
                              return (
                                <button
                                  key={slug}
                                  onClick={() => setLegalModalSlug(slug)}
                                  className="px-2 py-1 text-xs bg-canopy-100 text-forest-700 rounded hover:bg-canopy-200 border border-canopy-300 transition-all"
                                >
                                  {docTitle}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>

                    {item.price > 0 && (
                      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                        <span className="text-2xl font-bold text-emerald-700">
                          ${item.price.toFixed(2)}
                        </span>
                        <button
                          onClick={() => setPurchaseModal(item)}
                          className="px-4 py-2 bg-forest bg-cover text-white rounded-lg border-2 border-forest-800 hover:opacity-90 transition-all font-semibold shadow-lg"
                        >
                          Purchase
                        </button>
                      </div>
                    )}

                    {item.is_exclusive && (
                      <div className="mt-3">
                        <span className="inline-block px-3 py-1 bg-gradient-to-r from-amber-400 to-yellow-500 text-black text-xs font-bold rounded-full">
                          EXCLUSIVE
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {purchaseModal && (
        <PurchaseModal
          track={purchaseModal}
          onClose={() => setPurchaseModal(null)}
        />
      )}

      {legalModalSlug && (
        <LegalDocumentView
          slug={legalModalSlug}
          onClose={() => setLegalModalSlug(null)}
        />
      )}
    </div>
  );
}
