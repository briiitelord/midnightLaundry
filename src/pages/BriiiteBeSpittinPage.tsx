import { useState, useEffect } from 'react';
import { Mic } from 'lucide-react';
import { supabase } from '../lib/supabase';
import CarouselMediaPlayer from '../components/widgets/CarouselMediaPlayer';

type PerformanceItem = {
  id: string;
  title: string;
  description: string | null;
  category: string;
  file_url: string | null;
  preview_url: string | null;
  created_at: string;
};

export default function BriiiteBeSpittinPage() {
  const [performances, setPerformances] = useState<PerformanceItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPerformances();
  }, []);

  const fetchPerformances = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('music_items')
      .select('*')
      .eq('category', 'podcast_clip')
      .order('created_at', { ascending: false });

    if (!error && data) {
      // Transform data to include type information
      const transformedData = data.map(item => {
        const url = item.file_url || item.preview_url || '';
        const isVideo = url.toLowerCase().match(/\.(mp4|webm|mov|avi)$/);
        
        return {
          ...item,
          type: isVideo ? 'video' : 'audio'
        } as PerformanceItem & { type: 'video' | 'audio' };
      });
      setPerformances(transformedData);
    }
    setLoading(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-br from-purple-600 via-indigo-600 to-blue-600 rounded-xl shadow-lg p-8 text-white">
        <div className="flex items-center gap-4 mb-4">
          <div className="p-4 bg-white/20 rounded-xl backdrop-blur-sm">
            <Mic className="w-10 h-10" />
          </div>
          <div>
            <h2 className="text-4xl font-bold">briiite be spittin'</h2>
            <p className="text-purple-100 text-lg mt-2">
              Live performances, freestyles, and spoken word pieces
            </p>
          </div>
        </div>
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 mt-6">
          <p className="text-sm text-purple-50">
            🎤 Experience raw, unfiltered performances from briiite. Each piece is a moment captured in time—
            whether it's a spontaneous freestyle, a carefully crafted spoken word piece, or a live performance excerpt.
          </p>
        </div>
      </div>

      {/* Carousel Player */}
      {loading ? (
        <div className="bg-white rounded-xl shadow-md p-12 text-center border border-gray-100">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-emerald-600 border-t-transparent"></div>
          <p className="text-gray-600 mt-4">Loading performances...</p>
        </div>
      ) : performances.length === 0 ? (
        <div className="bg-white rounded-xl shadow-md p-12 text-center border border-gray-100">
          <Mic className="w-16 h-16 mx-auto text-gray-300 mb-4" />
          <p className="text-gray-600">No performances available yet</p>
          <p className="text-gray-500 text-sm mt-2">Check back soon for new content!</p>
        </div>
      ) : (
        <CarouselMediaPlayer items={performances as any} />
      )}

      {/* Info Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
          <div className="text-3xl mb-3">🎙️</div>
          <h3 className="text-lg font-bold text-gray-900 mb-2">Freestyle Sessions</h3>
          <p className="text-gray-600 text-sm">
            Spontaneous bars and improvised flows captured in the moment
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
          <div className="text-3xl mb-3">📜</div>
          <h3 className="text-lg font-bold text-gray-900 mb-2">Spoken Word</h3>
          <p className="text-gray-600 text-sm">
            Poetry, storytelling, and powerful words delivered with intention
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
          <div className="text-3xl mb-3">🎬</div>
          <h3 className="text-lg font-bold text-gray-900 mb-2">Live Clips</h3>
          <p className="text-gray-600 text-sm">
            Excerpts from live performances, showcases, and special events
          </p>
        </div>
      </div>
    </div>
  );
}
