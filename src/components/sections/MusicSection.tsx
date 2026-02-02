import { useState, useEffect } from 'react';
import { Music, Disc3, ShoppingCart, Mic, Mail } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { PAYPAL_ME_BASE_URL } from '../../config/paymentConfig';
import CommissionForm from '../forms/CommissionForm';
import MediaPlayer from '../widgets/MediaPlayer';
import PurchaseModal from '../widgets/PurchaseModal';
import LegalDocumentView from '../LegalDocumentView';

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
  legal_docs: string[];
  producer_credit: string;
  view_count: number;
  created_at: string;
};
type MusicCategory = 'new_release' | 'mix' | 'beat_for_sale' | 'podcast_clip' | 'exclusive_release';

export default function MusicSection() {
  const [activeTab, setActiveTab] = useState<MusicCategory | 'commission'>('new_release');
  const [musicItems, setMusicItems] = useState<MusicFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [purchaseModal, setPurchaseModal] = useState<MusicFile | null>(null);
  const [legalModalSlug, setLegalModalSlug] = useState<string | null>(null);

  const buildPayPalLink = (amount: number) => {
    if (!PAYPAL_ME_BASE_URL) return '';
    const base = PAYPAL_ME_BASE_URL.replace(/\/+$/, '');
    return `${base}/${amount.toFixed(2)}`;
  };

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
    { id: 'podcast_clip' as const, label: 'briiite be spittin\'', icon: Mic },
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

                    {item.preview_url && item.preview_status === 'ready' && (
                      <div className="mb-4">
                        <MediaPlayer
                          src={item.preview_url}
                          title={`${item.title} (Preview)`}
                          maxDuration={22}
                        />
                      </div>
                    )}

                    {item.file_url && !item.preview_url && (
                      <div className="mb-4">
                        <MediaPlayer
                          src={item.file_url}
                          title={`${item.title} (Preview)`}
                          maxDuration={22}
                        />
                      </div>
                    )}

                    {item.preview_status === 'pending' && (
                      <div className="mb-4 text-sm text-gray-500 italic">
                        Preview generating...
                      </div>
                    )}

                    {item.preview_status === 'failed' && (
                      <div className="mb-4 text-sm text-red-500 italic">
                        Preview generation failed. Using limited playback.
                      </div>
                    )}

                    {item.embed_url && (
                      <div className="mb-4">
                        <iframe
                          src={item.embed_url}
                          className="w-full h-32 rounded-lg"
                          allow="autoplay"
                        />
                      </div>
                    )}

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
                                  className="px-2 py-1 text-xs bg-emerald-100 text-emerald-700 rounded hover:bg-emerald-200 transition-colors"
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
                          className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-semibold"
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
