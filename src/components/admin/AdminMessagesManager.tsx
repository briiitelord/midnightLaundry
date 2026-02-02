import { useState, useEffect } from 'react';
import { Trash2, Eye, Search } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { Database } from '../../types/database.types';

type Message = Database['public']['Tables']['messages']['Row'];

export default function AdminMessagesManager() {
  const [items, setItems] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data) {
      setItems(data);
    }
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure? This will permanently delete the message.')) {
      const { error } = await supabase
        .from('messages')
        .delete()
        .eq('id', id);

      if (!error) {
        fetchItems();
      }
    }
  };

  const filteredItems = items.filter(
    (item) =>
      item.sender_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.sender_email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedItem = items.find((item) => item.id === selectedId);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Direct Messages</h2>
        <p className="text-gray-400 text-sm mt-1">Manage messages from your audience</p>
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

      {selectedItem && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-bold mb-4">Message Details</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">From</label>
                <p className="text-white">{selectedItem.sender_name}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Email</label>
                <a href={`mailto:${selectedItem.sender_email}`} className="text-emerald-400 hover:underline">
                  {selectedItem.sender_email}
                </a>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Message</label>
                <p className="text-gray-300 whitespace-pre-wrap">{selectedItem.message_content}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Received</label>
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
          <p className="text-gray-400">No messages found.</p>
        ) : (
          filteredItems.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between p-4 bg-gray-800/50 border border-gray-700 rounded-lg hover:bg-gray-800 transition"
            >
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold">{item.sender_name}</h3>
                <p className="text-sm text-gray-400 truncate">{item.sender_email}</p>
                <p className="text-sm text-gray-300 line-clamp-2 mt-1">
                  {item.message_content}
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
          ))
        )}
      </div>
    </div>
  );
}
