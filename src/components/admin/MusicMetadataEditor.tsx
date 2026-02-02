import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { Database } from '../../types/database.types';

type LegalDocument = Database['public']['Tables']['legal_documents']['Row'];
type MusicItem = Database['public']['Tables']['music_items']['Row'];

interface MusicMetadataEditorProps {
  music: MusicItem;
  onClose: () => void;
  onSave: (metadata: { legal_docs: string[]; producer_credit: string }) => void;
}

export default function MusicMetadataEditor({
  music,
  onClose,
  onSave,
}: MusicMetadataEditorProps) {
  const [legalDocuments, setLegalDocuments] = useState<LegalDocument[]>([]);
  const [selectedDocs, setSelectedDocs] = useState<string[]>(music.legal_docs || []);
  const [producerCredit, setProducerCredit] = useState(
    music.producer_credit || 'produced by briiite.'
  );
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchLegalDocs = async () => {
      const { data, error } = await supabase
        .from('legal_documents')
        .select('*')
        .is('deleted_at', null)
        .order('title', { ascending: true });

      if (!error && data) {
        setLegalDocuments(data);
      }
      setLoading(false);
    };

    fetchLegalDocs();
  }, []);

  const handleToggleDoc = (slug: string) => {
    setSelectedDocs((prev) =>
      prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug]
    );
  };

  const handleSave = async () => {
    setSaving(true);
    onSave({
      legal_docs: selectedDocs,
      producer_credit: producerCredit,
    });
    setSaving(false);
    onClose();
  };

  const uploadDate = new Date(music.created_at).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className="fixed inset-0 bg-black/50 flex items-start sm:items-center justify-center z-50 p-4 sm:p-6 overflow-auto">
      <div className="bg-gray-800 rounded-lg p-6 w-full max-w-2xl max-h-[calc(100vh-3rem)] overflow-hidden flex flex-col">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-white">Track Metadata</h3>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-700 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        <div className="overflow-y-auto flex-1 space-y-6 pr-2">
          {/* Track Info */}
          <div className="bg-gray-700/50 rounded-lg p-4 border border-gray-600">
            <h4 className="text-sm font-semibold text-gray-300 mb-2">Track Information</h4>
            <p className="text-sm text-gray-400">
              <span className="text-gray-300">Title:</span> {music.title}
            </p>
            <p className="text-sm text-gray-400 mt-1">
              <span className="text-gray-300">Uploaded:</span> {uploadDate}
            </p>
            <p className="text-sm text-gray-400 mt-1">
              <span className="text-gray-300">Views:</span> {music.view_count || 0}
            </p>
          </div>

          {/* Producer Credit */}
          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-2">
              Producer Credit
            </label>
            <input
              type="text"
              value={producerCredit}
              onChange={(e) => setProducerCredit(e.target.value)}
              placeholder="e.g., produced by briiite."
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-emerald-500 text-sm"
            />
            <p className="text-xs text-gray-400 mt-1">
              This credit appears on the track in the public view.
            </p>
          </div>

          {/* Legal Documents */}
          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-3">
              Applied Legal Documents
            </label>
            {loading ? (
              <p className="text-sm text-gray-400">Loading documents...</p>
            ) : legalDocuments.length === 0 ? (
              <p className="text-sm text-gray-400">No legal documents available.</p>
            ) : (
              <div className="space-y-2">
                {legalDocuments.map((doc) => (
                  <div key={doc.id} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id={`doc-${doc.id}`}
                      checked={selectedDocs.includes(doc.slug)}
                      onChange={() => handleToggleDoc(doc.slug)}
                      className="w-4 h-4 rounded accent-emerald-600 cursor-pointer"
                    />
                    <label
                      htmlFor={`doc-${doc.id}`}
                      className="text-sm text-gray-300 cursor-pointer hover:text-emerald-400 transition-colors"
                    >
                      {doc.title}
                    </label>
                  </div>
                ))}
              </div>
            )}
            <p className="text-xs text-gray-400 mt-2">
              Select the legal documents that apply to this track. Users will see these linked
              in the track details.
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 justify-end mt-6 border-t border-gray-700 pt-4">
          <button
            onClick={onClose}
            disabled={saving}
            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors text-sm font-medium disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors text-sm font-medium text-white disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Save Metadata'}
          </button>
        </div>
      </div>
    </div>
  );
}
