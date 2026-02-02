import { useState, useEffect } from 'react';
import { Plus, Trash2, Edit2, Search, Info, RefreshCw } from 'lucide-react';
import { supabase, debugRest } from '../../lib/supabase';
import { Database } from '../../types/database.types';
import { generateAndUploadAudioPreview } from '../../lib/audioPreview';
import MusicMetadataEditor from './MusicMetadataEditor';

type MusicItem = Database['public']['Tables']['music_items']['Row'];
type MusicInsert = Database['public']['Tables']['music_items']['Insert'];

export default function AdminMusicManager() {
  const [items, setItems] = useState<MusicItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [metadataEditingId, setMetadataEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<MusicInsert>({
    title: '',
    category: 'new_release',
    price: 0,
    is_exclusive: false,
  });

  useEffect(() => {
    fetchItems();
  }, []);

  const generatePreviewForMusic = async (music: MusicItem) => {
    if (!music.file_url) return;

    try {
      await supabase
        .from('music_items')
        .update({ preview_status: 'pending' })
        .eq('id', music.id);

      // Refresh UI to show pending status
      fetchItems();

      const { previewUrl } = await generateAndUploadAudioPreview({
        musicUrl: music.file_url,
        category: music.category,
        musicId: music.id,
        previewDuration: 22,
      });

      await supabase
        .from('music_items')
        .update({
          preview_url: previewUrl,
          preview_status: 'ready',
        })
        .eq('id', music.id);

      console.log('Preview generated for music:', music.id);
      
      // Refresh UI to show ready status
      fetchItems();
    } catch (error) {
      console.error('Preview generation failed for music:', music.id, error);
      await supabase
        .from('music_items')
        .update({ preview_status: 'failed' })
        .eq('id', music.id);
      
      // Refresh UI to show failed status
      fetchItems();
    }
  };

  const fetchItems = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('music_items')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching music items:', error);
        setErrorMessage('Failed to fetch music items. See console for details.');
      } else if (data) {
        setItems(data);
      }
    } catch (err) {
      console.error('Unexpected error fetching music items:', err);
      setErrorMessage('Unexpected error fetching music items.');
    }
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSubmitting(true);
    console.log('Submitting music item', { editingId, formData });
    try {
      if (editingId) {
        const existingItem = items.find((item) => item.id === editingId);
        
        if (import.meta.env.DEV && typeof debugRest === 'function') {
          const res = await debugRest('PATCH', `music_items?id=eq.${editingId}`, formData);
          if (!res.ok) {
            console.error('REST update failed', res);
            setErrorMessage(`Failed to update music item: ${res.status}`);
            return;
          }
          console.log('REST update response', res.body);
        } else {
          const { data, error } = await supabase
            .from('music_items')
            .update(formData)
            .eq('id', editingId)
            .select('*')
            .single();

          if (error) {
            console.error('Error updating music item:', error);
            setErrorMessage('Failed to update music item.');
            return;
          }

          if (data) {
            const shouldGeneratePreview = !!data.file_url && (
              !existingItem ||
              existingItem.file_url !== data.file_url ||
              !data.preview_url
            );

            if (shouldGeneratePreview) {
              generatePreviewForMusic(data);
            }
          }
        }

        setEditingId(null);
        setFormData({
          title: '',
          category: 'new_release',
          price: 0,
          is_exclusive: false,
        });
        setShowForm(false);
        fetchItems();
      } else {
        if (import.meta.env.DEV && typeof debugRest === 'function') {
          const res = await debugRest('POST', 'music_items', [formData]);
          if (!res.ok) {
            console.error('REST insert failed', res);
            setErrorMessage(`Failed to create music item: ${res.status}`);
            return;
          }
          console.log('REST insert response', res.body);
        } else {
          const { data, error } = await supabase
            .from('music_items')
            .insert([formData])
            .select('*')
            .single();

          if (error) {
            console.error('Error inserting music item:', error);
            setErrorMessage('Failed to create music item.');
            return;
          }

          if (data && data.file_url) {
            generatePreviewForMusic(data);
          }

          console.log('Created music item', data);
        }

        setFormData({
          title: '',
          category: 'new_release',
          price: 0,
          is_exclusive: false,
        });
        setShowForm(false);
        fetchItems();
      }
    } catch (err) {
      console.error('Unexpected submit error:', err);
      setErrorMessage('Unexpected error submitting music item.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (item: MusicItem) => {
    setEditingId(item.id);
    setFormData({
      title: item.title,
      category: item.category,
      description: item.description,
      file_url: item.file_url,
      embed_url: item.embed_url,
      price: item.price,
      is_exclusive: item.is_exclusive,
      slug: item.slug,
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure? This will permanently delete the item.')) {
      console.log('Attempting to delete music item:', id);
      const { error } = await supabase
        .from('music_items')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting music item:', error);
        setErrorMessage(`Failed to delete item: ${error.message}`);
      } else {
        console.log('Successfully deleted music item:', id);
        fetchItems();
      }
    }
  };

  const handleSaveMetadata = async (
    musicId: string,
    metadata: { legal_docs: string[]; producer_credit: string }
  ) => {
    const { error } = await supabase
      .from('music_items')
      .update(metadata)
      .eq('id', musicId);

    if (!error) {
      fetchItems();
    }
  };

  const filteredItems = items.filter(
    (item) =>
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Music Manager</h2>
          <p className="text-gray-400 text-sm mt-1">Manage your music items and tracks</p>
        </div>
        <button
          onClick={() => {
            console.log('Opening Add Music form');
            setEditingId(null);
            setFormData({
              title: '',
              category: 'new_release',
              price: 0,
              is_exclusive: false,
            });
            setShowForm(true);
          }}
          className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 rounded-lg transition"
        >
          <Plus className="w-4 h-4" />
          Add Music
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-3 w-5 h-5 text-gray-500" />
        <input
          type="text"
          placeholder="Search by title or category..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500"
        />
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-start sm:items-center justify-center z-50 p-4 sm:p-6 overflow-auto">
          <div className="bg-gray-800 rounded-lg p-6 w-full max-w-2xl max-h-[calc(100vh-6rem)] overflow-hidden">
            <h3 className="text-xl font-bold mb-4">
              {editingId ? 'Edit Music' : 'Add New Music'}
            </h3>
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
                  <label className="block text-sm font-medium text-gray-300 mb-1">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="new_release">New Release</option>
                    <option value="mix">Mix</option>
                    <option value="beat_for_sale">Beat for Sale</option>
                    <option value="podcast_clip">Podcast Clip</option>
                    <option value="exclusive_release">Exclusive Release</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Price</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-emerald-500"
                  />
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
                  <label className="block text-sm font-medium text-gray-300 mb-1">File URL</label>
                  <input
                    type="url"
                    value={formData.file_url || ''}
                    onChange={(e) => setFormData({ ...formData, file_url: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-emerald-500 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Embed URL</label>
                  <input
                    type="url"
                    value={formData.embed_url || ''}
                    onChange={(e) => setFormData({ ...formData, embed_url: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-emerald-500 text-sm"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="exclusive"
                  checked={formData.is_exclusive}
                  onChange={(e) => setFormData({ ...formData, is_exclusive: e.target.checked })}
                  className="w-4 h-4"
                />
                <label htmlFor="exclusive" className="text-sm font-medium text-gray-300">
                  Exclusive Release
                </label>
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
                  disabled={submitting}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 rounded-lg transition disabled:opacity-50"
                >
                  {submitting ? (editingId ? 'Updating...' : 'Creating...') : (editingId ? 'Update' : 'Create')}
                </button>
              </div>
            </form>
            {errorMessage && (
              <p className="text-red-400 mt-3">{errorMessage}</p>
            )}
          </div>
        </div>
      )}

      {/* Items List */}
      <div className="space-y-3">
        {loading ? (
          <p className="text-gray-400">Loading...</p>
        ) : filteredItems.length === 0 ? (
          <p className="text-gray-400">No music items found.</p>
        ) : (
          filteredItems.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between p-4 bg-gray-800/50 border border-gray-700 rounded-lg hover:bg-gray-800 transition"
            >
              <div className="flex-1">
                <h3 className="font-semibold">{item.title}</h3>
                <p className="text-sm text-gray-400">
                  {item.category.replace(/_/g, ' ')} • ${item.price.toFixed(2)}
                  {item.is_exclusive && <span className="ml-2 text-emerald-500">★ Exclusive</span>}
                </p>
                {item.preview_status && (
                  <p className="text-xs text-gray-500 mt-1">
                    Preview: <span className={
                      item.preview_status === 'ready' ? 'text-green-400' :
                      item.preview_status === 'pending' ? 'text-yellow-400' :
                      'text-red-400'
                    }>{item.preview_status}</span>
                  </p>
                )}
              </div>
              <div className="flex gap-2">
                {item.file_url && (
                  <button
                    onClick={() => generatePreviewForMusic(item)}
                    className="p-2 bg-emerald-600/20 hover:bg-emerald-600/40 rounded-lg transition"
                    title="Regenerate Preview"
                  >
                    <RefreshCw className="w-4 h-4 text-emerald-400" />
                  </button>
                )}
                <button
                  onClick={() => setMetadataEditingId(item.id)}
                  className="p-2 bg-purple-600/20 hover:bg-purple-600/40 rounded-lg transition"
                  title="Edit Metadata"
                >
                  <Info className="w-4 h-4 text-purple-400" />
                </button>
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

      {/* Metadata Editor Modal */}
      {metadataEditingId && (
        <MusicMetadataEditor
          music={items.find((item) => item.id === metadataEditingId)!}
          onClose={() => setMetadataEditingId(null)}
          onSave={(metadata) => {
            handleSaveMetadata(metadataEditingId, metadata);
            setMetadataEditingId(null);
          }}
        />
      )}
    </div>
  );
}
