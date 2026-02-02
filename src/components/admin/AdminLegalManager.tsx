import { useState, useEffect } from 'react';
import { Plus, Trash2, Edit2, Search } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { Database } from '../../types/database.types';

type LegalDocument = Database['public']['Tables']['legal_documents']['Row'];
type LegalDocumentInsert = Database['public']['Tables']['legal_documents']['Insert'];

export default function AdminLegalManager() {
  const [items, setItems] = useState<LegalDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<LegalDocumentInsert>({
    slug: '',
    title: '',
    content: '',
  });

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('legal_documents')
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
        .from('legal_documents')
        .update(formData)
        .eq('id', editingId);

      if (!error) {
        setEditingId(null);
        setFormData({ slug: '', title: '', content: '' });
        setShowForm(false);
        fetchItems();
      }
    } else {
      const { error } = await supabase
        .from('legal_documents')
        .insert([formData]);

      if (!error) {
        setFormData({ slug: '', title: '', content: '' });
        setShowForm(false);
        fetchItems();
      }
    }
  };

  const handleEdit = (item: LegalDocument) => {
    setEditingId(item.id);
    setFormData({
      slug: item.slug,
      title: item.title,
      content: item.content,
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure? This will permanently delete the item.')) {
      console.log('Attempting to delete legal document:', id);
      const { error } = await supabase
        .from('legal_documents')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting legal document:', error);
        setErrorMessage(`Failed to delete item: ${error.message}`);
      } else {
        console.log('Successfully deleted legal document:', id);
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
          <h2 className="text-2xl font-bold">Legal Documents</h2>
          <p className="text-gray-400 text-sm mt-1">Manage legal documents and licenses</p>
        </div>
        <button
          onClick={() => {
            setEditingId(null);
            setFormData({ slug: '', title: '', content: '' });
            setShowForm(true);
          }}
          className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 rounded-lg transition"
        >
          <Plus className="w-4 h-4" />
          Add Document
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
            <h3 className="text-xl font-bold mb-4">{editingId ? 'Edit Document' : 'Add New Document'}</h3>
            <form onSubmit={handleSubmit} className="space-y-4 overflow-y-auto max-h-[60vh] sm:max-h-[calc(100vh-14rem)]">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Slug</label>
                <input
                  type="text"
                  required
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  placeholder="e.g., public-license-notice"
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-emerald-500"
                />
                <p className="text-xs text-gray-400 mt-1">Used in URLs, lowercase with hyphens</p>
              </div>

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
                <label className="block text-sm font-medium text-gray-300 mb-1">Content</label>
                <textarea
                  required
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-emerald-500 h-64"
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
          <p className="text-gray-400">No documents found.</p>
        ) : (
          filteredItems.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between p-4 bg-gray-800/50 border border-gray-700 rounded-lg hover:bg-gray-800 transition"
            >
              <div className="flex-1">
                <h3 className="font-semibold">{item.title}</h3>
                <p className="text-sm text-gray-400">Slug: {item.slug}</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleEdit(item)}
                  className="p-2 text-emerald-500 hover:bg-gray-700 rounded transition"
                  title="Edit"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="p-2 text-red-500 hover:bg-gray-700 rounded transition"
                  title="Delete"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
