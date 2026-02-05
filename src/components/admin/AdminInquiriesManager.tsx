import { useState, useEffect } from 'react';
import { Trash2, Eye, Search, CheckSquare, Square } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { Database } from '../../types/database.types';

type Commission = Database['public']['Tables']['commission_inquiries']['Row'];

export default function AdminInquiriesManager() {
  const [items, setItems] = useState<Commission[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('commission_inquiries')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data) {
      setItems(data);
    }
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure? This will permanently delete the inquiry.')) {
      const { error } = await supabase
        .from('commission_inquiries')
        .delete()
        .eq('id', id);

      if (!error) {
        fetchItems();
      }
    }
  };

  const handleBulkDelete = async () => {
    if (selectedIds.size === 0) return;
    if (confirm(`Are you sure? This will permanently delete ${selectedIds.size} inquiry(ies).`)) {
      const { error } = await supabase
        .from('commission_inquiries')
        .delete()
        .in('id', Array.from(selectedIds));

      if (!error) {
        setSelectedIds(new Set());
        fetchItems();
      }
    }
  };

  const toggleSelectAll = () => {
    if (selectedIds.size === filteredItems.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredItems.map(item => item.id)));
    }
  };

  const toggleSelect = (id: string) => {
    const newSelected = new Set(selectedIds);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedIds(newSelected);
  };

  const filteredItems = items.filter(
    (item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedItem = items.find((item) => item.id === selectedId);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Commission Inquiries</h2>
        <p className="text-gray-400 text-sm mt-1">Manage custom work requests and inquiries</p>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-3 w-5 h-5 text-gray-500" />
        <input
          type="text"
          placeholder="Search by name or email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500"
        />
      </div>

      {selectedIds.size > 0 && (
        <div className="flex items-center gap-3 p-4 bg-emerald-900/20 border border-emerald-500/30 rounded-lg">
          <span className="text-emerald-400 font-medium">{selectedIds.size} selected</span>
          <div className="flex-1" />
          <button
            onClick={handleBulkDelete}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition flex items-center gap-2"
          >
            <Trash2 className="w-4 h-4" />
            Delete Selected
          </button>
        </div>
      )}

      {selectedItem && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-bold mb-4">Inquiry Details</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Name</label>
                <p className="text-white">{selectedItem.name}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Email</label>
                <a href={`mailto:${selectedItem.email}`} className="text-emerald-400 hover:underline">
                  {selectedItem.email}
                </a>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Type</label>
                <p className="text-white capitalize">{selectedItem.inquiry_type.replace(/_/g, ' ')}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Budget Range</label>
                <p className="text-white">{selectedItem.budget_range}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Project Description</label>
                <p className="text-gray-300 whitespace-pre-wrap">{selectedItem.project_description}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Submitted</label>
                <p className="text-gray-400 text-sm">
                  {new Date(selectedItem.created_at).toLocaleString()}
                </p>
              </div>
              <button
                onClick={() => setSelectedId(null)}
                className="w-full px-4 py-2 bg-emerald-600 hover:bg-emerald-700 rounded-lg transition mt-6"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {loading ? (
          <p className="text-gray-400">Loading...</p>
        ) : filteredItems.length === 0 ? (
          <p className="text-gray-400">No inquiries found.</p>
        ) : (
          <>
            <div className="flex items-center gap-3 p-3 bg-gray-800/30 border border-gray-700 rounded-lg">
              <button
                onClick={toggleSelectAll}
                className="p-1 hover:bg-gray-700 rounded transition"
              >
                {selectedIds.size === filteredItems.length ? (
                  <CheckSquare className="w-5 h-5 text-emerald-400" />
                ) : (
                  <Square className="w-5 h-5 text-gray-400" />
                )}
              </button>
              <span className="text-sm text-gray-400">Select All</span>
            </div>
            {filteredItems.map((item) => (
              <div
                key={item.id}
                className={`flex items-center gap-3 p-4 border rounded-lg transition ${
                  selectedIds.has(item.id)
                    ? 'bg-emerald-900/20 border-emerald-500/30'
                    : 'bg-gray-800/50 border-gray-700 hover:bg-gray-800'
                }`}
              >
                <button
                  onClick={() => toggleSelect(item.id)}
                  className="p-1 hover:bg-gray-700 rounded transition flex-shrink-0"
                >
                  {selectedIds.has(item.id) ? (
                    <CheckSquare className="w-5 h-5 text-emerald-400" />
                  ) : (
                    <Square className="w-5 h-5 text-gray-400" />
                  )}
                </button>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold">{item.name}</h3>
                  <p className="text-sm text-gray-400 truncate">{item.email}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {item.inquiry_type.replace(/_/g, ' ')} • {item.budget_range}
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {new Date(item.created_at).toLocaleString()}
                  </p>
                </div>
                <div className="flex gap-2 ml-4">
                  <button
                    onClick={() => setSelectedId(item.id)}
                    className="p-2 bg-blue-600/20 hover:bg-blue-600/40 rounded-lg transition flex-shrink-0"
                  >
                    <Eye className="w-4 h-4 text-blue-400" />
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="p-2 bg-red-600/20 hover:bg-red-600/40 rounded-lg transition flex-shrink-0"
                  >
                    <Trash2 className="w-4 h-4 text-red-400" />
                  </button>
                </div>
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
}
