import { useState, useEffect } from 'react';
import { Plus, Trash2, Edit2, Search } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { Database } from '../../types/database.types';

type WritingPiece = Database['public']['Tables']['writing_pieces']['Row'];
type WritingInsert = Database['public']['Tables']['writing_pieces']['Insert'];

export default function AdminWritingManager() {
  const [items, setItems] = useState<WritingPiece[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<WritingInsert>({
    title: '',
    category: 'poetry',
    price: 0,
  });

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('writing_pieces')
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
        .from('writing_pieces')
        .update(formData)
        .eq('id', editingId);

      if (!error) {
        setEditingId(null);
        setFormData({ title: '', category: 'poetry', price: 0 });
        setShowForm(false);
        fetchItems();
      }
    } else {
      const { error } = await supabase
        .from('writing_pieces')
        .insert([formData]);

      if (!error) {
        setFormData({ title: '', category: 'poetry', price: 0 });
        setShowForm(false);
        fetchItems();
      }
    }
  };

  const handleEdit = (item: WritingPiece) => {
    setEditingId(item.id);
    setFormData({
      title: item.title,
      category: item.category,
      content: item.content,
      file_url: item.file_url,
      excerpt: item.excerpt,
      price: item.price,
      slug: item.slug,
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure? This will permanently delete the item.')) {
      console.log('Attempting to delete writing piece:', id);
      const { error } = await supabase
        .from('writing_pieces')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting writing piece:', error);
        setErrorMessage(`Failed to delete item: ${error.message}`);
      } else {
        console.log('Successfully deleted writing piece:', id);
        fetchItems();
      }
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
          <h2 className="text-2xl font-bold">Writing Manager</h2>
          <p className="text-gray-400 text-sm mt-1">Manage your poetry, stories, and written works</p>
        </div>
        <button
          onClick={() => {
            setEditingId(null);
            setFormData({ title: '', category: 'poetry' });
            setShowForm(true);
          }}
          className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 rounded-lg transition"
        >
          <Plus className="w-4 h-4" />
          Add Writing
        </button>
      </div>

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

      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-bold mb-4">
              {editingId ? 'Edit Writing' : 'Add New Writing'}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
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

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-emerald-500"
                >
                  <option value="poetry">Poetry</option>
                  <option value="short_story">Short Story</option>
                  <option value="extended_work">Extended Work</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Excerpt</label>
                <textarea
                  value={formData.excerpt || ''}
                  onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                  placeholder="Brief excerpt or summary"
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-emerald-500 h-16"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Full Content</label>
                <textarea
                  value={formData.content || ''}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  placeholder="Full text content"
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-emerald-500 h-32"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">File URL</label>
                <input
                  type="url"
                  value={formData.file_url || ''}
                  onChange={(e) => setFormData({ ...formData, file_url: e.target.value })}
                  placeholder="Optional: PDF or document link"
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-emerald-500 text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Download Price ($)</label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.price || 0}
                  onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                  placeholder="0 for free, or price for PayPal paygate"
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-emerald-500"
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
          <p className="text-gray-400">No writing pieces found.</p>
        ) : (
          filteredItems.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between p-4 bg-gray-800/50 border border-gray-700 rounded-lg hover:bg-gray-800 transition"
            >
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold truncate">{item.title}</h3>
                <p className="text-sm text-gray-400 truncate">
                  {item.category.replace(/_/g, ' ')}
                  {item.excerpt && ` • ${item.excerpt.substring(0, 50)}...`}
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
