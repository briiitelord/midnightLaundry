import { useState, useEffect } from 'react';
import { Plus, Trash2, Edit2, Search } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { Database } from '../../types/database.types';

type SocialPost = Database['public']['Tables']['social_posts']['Row'];
type SocialInsert = Database['public']['Tables']['social_posts']['Insert'];

export default function AdminSocialManager() {
  const [items, setItems] = useState<SocialPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<SocialInsert>({
    content: '',
    platform: 'twitter',
    post_url: '',
    posted_at: new Date().toISOString(),
  });

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('social_posts')
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
      const { error } = await supabase
        .from('social_posts')
        .update(formData)
        .eq('id', editingId);

      if (!error) {
        setEditingId(null);
        setFormData({
          content: '',
          platform: 'twitter',
          post_url: '',
          posted_at: new Date().toISOString(),
        });
        setShowForm(false);
        fetchItems();
      }
    } else {
      const { error } = await supabase
        .from('social_posts')
        .insert([formData]);

      if (!error) {
        setFormData({
          content: '',
          platform: 'twitter',
          post_url: '',
          posted_at: new Date().toISOString(),
        });
        setShowForm(false);
        fetchItems();
      }
    }
  };

  const handleEdit = (item: SocialPost) => {
    setEditingId(item.id);
    setFormData({
      content: item.content,
      platform: item.platform,
      post_url: item.post_url,
      posted_at: item.posted_at,
      platform_logo_url: item.platform_logo_url,
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure? This will permanently delete the item.')) {
      console.log('Attempting to delete social post:', id);
      const { error } = await supabase
        .from('social_posts')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting social post:', error);
        setErrorMessage(`Failed to delete item: ${error.message}`);
      } else {
        console.log('Successfully deleted social post:', id);
        fetchItems();
      }
    }
  };

  const filteredItems = items.filter((item) =>
    item.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.platform.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Social Posts Manager</h2>
          <p className="text-gray-400 text-sm mt-1">Manage your social media posts</p>
        </div>
        <button
          onClick={() => {
            setEditingId(null);
            setFormData({
              content: '',
              platform: 'twitter',
              post_url: '',
              posted_at: new Date().toISOString(),
            });
            setShowForm(true);
          }}
          className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 rounded-lg transition"
        >
          <Plus className="w-4 h-4" />
          Add Post
        </button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-3 w-5 h-5 text-gray-500" />
        <input
          type="text"
          placeholder="Search by content or platform..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500"
        />
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-start sm:items-center justify-center z-50 p-4 sm:p-6 overflow-auto">
          <div className="bg-gray-800 rounded-lg p-6 w-full max-w-2xl max-h-[calc(100vh-6rem)] overflow-hidden">
            <h3 className="text-xl font-bold mb-4">
              {editingId ? 'Edit Post' : 'Add New Post'}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4 overflow-y-auto max-h-[60vh] sm:max-h-[calc(100vh-14rem)]">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Platform</label>
                <select
                  value={formData.platform}
                  onChange={(e) => setFormData({ ...formData, platform: e.target.value as any })}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-emerald-500"
                >
                  <option value="twitter">Twitter/X</option>
                  <option value="instagram">Instagram</option>
                  <option value="tiktok">TikTok</option>
                  <option value="youtube">YouTube</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Content *</label>
                <textarea
                  required
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-emerald-500 h-24"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Post URL *</label>
                <input
                  type="url"
                  required
                  value={formData.post_url}
                  onChange={(e) => setFormData({ ...formData, post_url: e.target.value })}
                  placeholder="Link to the actual post"
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-emerald-500 text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Logo URL</label>
                <input
                  type="url"
                  value={formData.platform_logo_url || ''}
                  onChange={(e) => setFormData({ ...formData, platform_logo_url: e.target.value })}
                  placeholder="Platform logo URL (optional)"
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-emerald-500 text-sm"
                />
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
          <p className="text-gray-400">No posts found.</p>
        ) : (
          filteredItems.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between p-4 bg-gray-800/50 border border-gray-700 rounded-lg hover:bg-gray-800 transition"
            >
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold capitalize text-sm text-gray-300">{item.platform}</h3>
                <p className="text-sm text-gray-400 line-clamp-2">
                  {item.content}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {new Date(item.posted_at).toLocaleDateString()}
                </p>
              </div>
              <div className="flex gap-2 ml-4">
                <button
                  onClick={() => handleEdit(item)}
                  className="p-2 bg-blue-600/20 hover:bg-blue-600/40 rounded-lg transition flex-shrink-0"
                >
                  <Edit2 className="w-4 h-4 text-blue-400" />
                </button>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="p-2 bg-red-600/20 hover:bg-red-600/40 rounded-lg transition flex-shrink-0"
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
