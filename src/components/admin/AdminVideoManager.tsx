import { useState, useEffect } from 'react';
import { Plus, Trash2, Edit2, Search } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { Database } from '../../types/database.types';
import { generateAndUploadVideoPreview } from '../../lib/videoPreview';

type Video = Database['public']['Tables']['videos']['Row'];
type VideoInsert = Database['public']['Tables']['videos']['Insert'];

export default function AdminVideoManager() {
  const [items, setItems] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<VideoInsert>({
    title: '',
    content_rating: 'sfw',
    is_paygated: false,
  });

  useEffect(() => {
    fetchItems();
  }, []);

  const generatePreviewForVideo = async (video: Video) => {
    if (!video.file_url) return;

    try {
      await supabase
        .from('videos')
        .update({ preview_status: 'pending' })
        .eq('id', video.id);

      const { previewUrl, previewTimestamp } = await generateAndUploadVideoPreview({
        videoUrl: video.file_url,
        contentRating: video.content_rating,
        videoId: video.id,
      });

      const previewUpdate = video.content_rating === 'nsfw'
        ? { preview_blurred_url: previewUrl }
        : { preview_url: previewUrl };

      await supabase
        .from('videos')
        .update({
          ...previewUpdate,
          preview_ts: previewTimestamp,
          preview_status: 'ready',
        })
        .eq('id', video.id);
    } catch (error) {
      console.error('Preview generation failed:', error);
      await supabase
        .from('videos')
        .update({ preview_status: 'failed' })
        .eq('id', video.id);
    }
  };

  const fetchItems = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('videos')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data) {
      setItems(data);
    }
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingId) {
      const existingItem = items.find((item) => item.id === editingId);
      const { data, error } = await supabase
        .from('videos')
        .update(formData)
        .eq('id', editingId)
        .select('*')
        .single();

      if (!error && data) {
        const shouldGeneratePreview = !!data.file_url && (
          !existingItem ||
          existingItem.file_url !== data.file_url ||
          existingItem.content_rating !== data.content_rating ||
          (!data.preview_url && !data.preview_blurred_url)
        );

        if (shouldGeneratePreview) {
          generatePreviewForVideo(data);
        }

        setEditingId(null);
        setFormData({
          title: '',
          content_rating: 'sfw',
          is_paygated: false,
        });
        setShowForm(false);
        fetchItems();
      }
    } else {
      const { data, error } = await supabase
        .from('videos')
        .insert([formData])
        .select('*')
        .single();

      if (!error && data) {
        if (data.file_url) {
          generatePreviewForVideo(data);
        }

        setFormData({
          title: '',
          content_rating: 'sfw',
          is_paygated: false,
        });
        setShowForm(false);
        fetchItems();
      }
    }
  };

  const handleEdit = (item: Video) => {
    setEditingId(item.id);
    setFormData({
      title: item.title,
      description: item.description,
      content_rating: item.content_rating,
      embed_url: item.embed_url,
      file_url: item.file_url,
      is_paygated: item.is_paygated,
      paygate_url: item.paygate_url,
      slug: item.slug,
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure? This will permanently delete the item.')) {
      console.log('Attempting to delete video:', id);
      const { error } = await supabase
        .from('videos')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting video:', error);
        setErrorMessage(`Failed to delete item: ${error.message}`);
      } else {
        console.log('Successfully deleted video:', id);
        fetchItems();
      }
    }
  };

  const filteredItems = items.filter((item) =>
    item.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Video Manager</h2>
          <p className="text-gray-400 text-sm mt-1">Manage your video content</p>
        </div>
        <button
          onClick={() => {
            setEditingId(null);
            setFormData({
              title: '',
              content_rating: 'sfw',
              is_paygated: false,
            });
            setShowForm(true);
          }}
          className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 rounded-lg transition"
        >
          <Plus className="w-4 h-4" />
          Add Video
        </button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-3 w-5 h-5 text-gray-500" />
        <input
          type="text"
          placeholder="Search by title..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500"
        />
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-start sm:items-center justify-center z-50 p-4 sm:p-6 overflow-auto">
          <div className="bg-gray-800 rounded-lg p-6 w-full max-w-2xl max-h-[calc(100vh-6rem)] overflow-hidden">
            <h3 className="text-xl font-bold mb-4">{editingId ? 'Edit Video' : 'Add New Video'}</h3>
            <form onSubmit={handleSubmit} className="space-y-4 overflow-y-auto max-h-[60vh] sm:max-h-[calc(100vh-14rem)]">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Title</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Content Rating</label>
                  <select
                    value={formData.content_rating}
                    onChange={(e) => setFormData({ ...formData, content_rating: e.target.value as any })}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="sfw">SFW</option>
                    <option value="nsfw">NSFW</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Description</label>
                <textarea
                  value={formData.description || ''}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-emerald-500 h-24"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Embed URL
                    <span className="text-xs text-gray-400 ml-2">(for YouTube, Vimeo, etc.)</span>
                  </label>
                  <input
                    type="url"
                    value={formData.embed_url || ''}
                    onChange={(e) => setFormData({ ...formData, embed_url: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-emerald-500 text-sm"
                    placeholder="https://www.youtube.com/embed/..."
                  />
                  <p className="text-xs text-amber-400 mt-1">
                    ⚠️ Autoplay will be automatically disabled
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    File URL
                    <span className="text-xs text-gray-400 ml-2">(direct video file)</span>
                  </label>
                  <input
                    type="url"
                    value={formData.file_url || ''}
                    onChange={(e) => setFormData({ ...formData, file_url: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-emerald-500 text-sm"
                    placeholder="https://...storage.../video.mp4"
                  />
                  <p className="text-xs text-gray-400 mt-1">
                    Direct link to MP4/video file
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="paygated"
                    checked={formData.is_paygated}
                    onChange={(e) => setFormData({ ...formData, is_paygated: e.target.checked })}
                    className="w-4 h-4"
                  />
                  <label htmlFor="paygated" className="text-sm font-medium text-gray-300">
                    Is Paygated
                  </label>
                </div>
                {formData.is_paygated && (
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Paygate URL</label>
                    <input
                      type="url"
                      value={formData.paygate_url || ''}
                      onChange={(e) => setFormData({ ...formData, paygate_url: e.target.value })}
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-emerald-500 text-sm"
                    />
                  </div>
                )}
              </div>

              <div className="flex gap-3 justify-end mt-6">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 rounded-lg transition"
                >
                  {editingId ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {loading ? (
          <p className="text-gray-400">Loading...</p>
        ) : filteredItems.length === 0 ? (
          <p className="text-gray-400">No videos found.</p>
        ) : (
          filteredItems.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between p-4 bg-gray-800/50 border border-gray-700 rounded-lg hover:bg-gray-800 transition"
            >
              <div className="flex-1">
                <h3 className="font-semibold">{item.title}</h3>
                <p className="text-sm text-gray-400">
                  {item.content_rating.toUpperCase()}
                  {item.is_paygated && <span className="ml-2 text-yellow-500">💰 Paygated</span>}
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(item)}
                  className="p-2 bg-blue-600/20 hover:bg-blue-600/40 rounded-lg transition"
                >
                  <Edit2 className="w-4 h-4 text-blue-400" />
                </button>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="p-2 bg-red-600/20 hover:bg-red-600/40 rounded-lg transition"
                >
                  <Trash2 className="w-4 h-4 text-red-400" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
function setErrorMessage(arg0: string) {
  throw new Error('Function not implemented.');
}

