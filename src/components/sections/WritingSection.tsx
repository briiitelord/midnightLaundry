import { useState, useEffect, useRef } from 'react';
import { BookOpen, FileText, BookMarked } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { PAYPAL_ME_BASE_URL } from '../../config/paymentConfig';
import type { Database } from '../../types/database.types';

type WritingPiece = Database['public']['Tables']['writing_pieces']['Row'];
type WritingCategory = 'poetry' | 'short_story' | 'extended_work';

export default function WritingSection() {
  const [activeTab, setActiveTab] = useState<WritingCategory>('poetry');
  const [writings, setWritings] = useState<WritingPiece[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPiece, setSelectedPiece] = useState<WritingPiece | null>(null);
  const [autoDownload, setAutoDownload] = useState(false);
  const downloadRef = useRef<HTMLAnchorElement>(null);

  const paypalLink = PAYPAL_ME_BASE_URL ? PAYPAL_ME_BASE_URL.replace(/\/+$/, '') : '';

  useEffect(() => {
    // Check if returning from PayPal payment
    const params = new URLSearchParams(window.location.search);
    const pieceId = params.get('piece_id');
    if (params.get('paid') === 'true' && pieceId) {
      // Find the piece that was paid for
      const paidPiece = writings.find(w => w.id === pieceId);
      if (paidPiece?.file_url) {
        setSelectedPiece(paidPiece);
        setAutoDownload(true);
      }
    }
  }, [writings]);

  useEffect(() => {
    // Trigger auto-download and hide modal
    if (autoDownload && downloadRef.current) {
      setTimeout(() => {
        downloadRef.current?.click();
        setSelectedPiece(null);
        setAutoDownload(false);
        // Clean up URL params
        window.history.replaceState({}, document.title, window.location.pathname);
      }, 100);
    }
  }, [autoDownload]);

  const handleModalScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const element = e.currentTarget;
    if (element.scrollTop === 0) {
      setSelectedPiece(null);
    }
  };

  const buildPayPalLink = (amount: number) => {
    if (!paypalLink || !selectedPiece) return '';
    const base = paypalLink;
    // Append ?paid=true&piece_id= to return URL for auto-download detection
    const returnUrl = `${window.location.origin}${window.location.pathname}?paid=true&piece_id=${selectedPiece.id}`;
    return `${base}/${amount.toFixed(2)}`;
  };

  useEffect(() => {
    fetchWritings();
  }, [activeTab]);

  useEffect(() => {
    // Fetch all writings on mount to handle payment returns
    const fetchAllWritings = async () => {
      const { data } = await supabase
        .from('writing_pieces')
        .select('*');
      if (data) {
        setWritings(data);
      }
    };
    fetchAllWritings();
  }, []);

  const fetchWritings = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('writing_pieces')
      .select('*')
      .eq('category', activeTab)
      .order('created_at', { ascending: false });

    if (!error && data) {
      setWritings(data);
    }
    setLoading(false);
  };

  const tabs = [
    { id: 'poetry' as const, label: 'Poetry', icon: BookOpen },
    { id: 'short_story' as const, label: 'Short Stories', icon: FileText },
    { id: 'extended_work' as const, label: 'Extended Works', icon: BookMarked },
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
                flex items-center space-x-2 px-6 py-3 rounded-lg font-semibold
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

      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-emerald-600 border-t-transparent"></div>
          <p className="text-gray-600 mt-4">Loading writings...</p>
        </div>
      ) : writings.length === 0 ? (
        <div className="bg-white rounded-xl shadow-md p-12 text-center border border-gray-100">
          <BookOpen className="w-16 h-16 mx-auto text-gray-300 mb-4" />
          <p className="text-gray-600">No writings in this category yet</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {writings.map((piece) => (
            <div
              key={piece.id}
              className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 group cursor-pointer"
              onClick={() => setSelectedPiece(piece)}
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23000000' fill-opacity='0.02'%3E%3Cpath d='M0 0h40v1H0zM0 10h40v1H0zM0 20h40v1H0zM0 30h40v1H0z'/%3E%3C/g%3E%3C/svg%3E")`,
                backgroundSize: '40px 40px'
              }}
            >
              <div className="p-6 bg-gradient-to-br from-white/95 to-gray-50/95">
                <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-emerald-700 transition-colors">
                  {piece.title}
                </h3>
                {piece.excerpt && (
                  <p className="text-gray-600 text-sm leading-relaxed line-clamp-4 italic">
                    {piece.excerpt}
                  </p>
                )}
                <div className="mt-4 text-emerald-600 font-semibold text-sm">
                  Read more →
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedPiece && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex flex-col overflow-hidden">
          <div
            className="flex-1 overflow-y-auto bg-white"
            onScroll={handleModalScroll}
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23000000' fill-opacity='0.02'%3E%3Cpath d='M0 0h40v1H0zM0 10h40v1H0zM0 20h40v1H0zM0 30h40v1H0z'/%3E%3C/g%3E%3C/svg%3E")`,
              backgroundSize: '40px 40px'
            }}
          >
            <div className="max-w-3xl mx-auto w-full p-8 bg-gradient-to-br from-white/98 to-gray-50/98">
              <button
                onClick={() => setSelectedPiece(null)}
                className="fixed top-4 right-4 w-10 h-10 flex items-center justify-center bg-gray-100 hover:bg-gray-200 rounded-full transition-colors z-50"
              >
                ✕
              </button>

              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                {selectedPiece.title}
              </h2>

              <div className="prose prose-lg max-w-none mb-8">
                <div className="whitespace-pre-wrap text-gray-700 leading-relaxed">
                  {selectedPiece.content || selectedPiece.excerpt}
                </div>
              </div>

              {/* Show PDF Preview if available */}
              {selectedPiece.file_url && (
                <div className="mb-8 border-2 border-gray-200 rounded-lg overflow-hidden">
                  <iframe
                    src={selectedPiece.file_url}
                    className="w-full h-[600px]"
                    title={`${selectedPiece.title} PDF Preview`}
                  />
                </div>
              )}

              <div className="border-t border-gray-200 pt-6 flex gap-3">
                {selectedPiece.price > 0 && paypalLink && (
                  <a
                    href={buildPayPalLink(selectedPiece.price)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block px-6 py-3 bg-gradient-to-r from-amber-400 to-yellow-500 text-black rounded-lg hover:from-amber-500 hover:to-yellow-600 transition-colors font-semibold"
                  >
                    Unlock Download - ${selectedPiece.price.toFixed(2)}
                  </a>
                )}

                {selectedPiece.price === 0 && selectedPiece.file_url && (
                  <a
                    ref={downloadRef}
                    href={selectedPiece.file_url}
                    download
                    className="inline-block px-6 py-3 bg-forest bg-cover text-white rounded-lg border-2 border-forest-800 hover:opacity-90 transition-all font-semibold shadow-lg"
                  >
                    Download Full Version
                  </a>
                )}
              </div>

              <p className="text-xs text-gray-500 mt-6 text-center">
                Scroll to top to close
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
