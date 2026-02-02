import { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { Database } from '../types/database.types';

type LegalDocument = Database['public']['Tables']['legal_documents']['Row'];

interface LegalDocumentViewProps {
  slug: string;
  onClose: () => void;
}

export default function LegalDocumentView({ slug, onClose }: LegalDocumentViewProps) {
  const [document, setDocument] = useState<LegalDocument | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDocument = async () => {
      const { data, error } = await supabase
        .from('legal_documents')
        .select('*')
        .eq('slug', slug)
        .is('deleted_at', null)
        .single();

      if (!error && data) {
        setDocument(data);
      }
      setLoading(false);
    };

    fetchDocument();
  }, [slug]);

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-start sm:items-center justify-center p-4 sm:p-6 overflow-auto">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[85vh] overflow-hidden flex flex-col">
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">
            {loading ? 'Loading...' : document?.title || 'Document'}
          </h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-6 h-6 text-gray-600" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-emerald-600 border-t-transparent"></div>
              <p className="text-gray-600 mt-4">Loading document...</p>
            </div>
          ) : document ? (
            <div className="prose prose-sm max-w-none text-gray-700 whitespace-pre-wrap leading-relaxed">
              {document.content}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-600">Document not found.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
