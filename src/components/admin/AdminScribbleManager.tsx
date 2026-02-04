import { useState, useEffect } from 'react';
import { Upload, Trash2, Eye, EyeOff, Calendar, FileText } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { uploadToStorage } from '../../lib/storage';

type Scribble = {
  id: string;
  title: string;
  description: string | null;
  pdf_url: string;
  is_active: boolean;
  display_date: string;
  created_at: string;
  updated_at: string;
};

export default function AdminScribbleManager() {
  const [scribbles, setScribbles] = useState<Scribble[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  
  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [displayDate, setDisplayDate] = useState(new Date().toISOString().split('T')[0]);
  const [pdfFile, setPdfFile] = useState<File | null>(null);

  useEffect(() => {
    fetchScribbles();
  }, []);

  const fetchScribbles = async () => {
    try {
      const { data, error } = await supabase
        .from('scribbles')
        .select('*')
        .order('display_date', { ascending: false });

      if (error) {
        console.error('Error fetching scribbles:', error);
        setErrorMessage('Failed to load scribbles');
        return;
      }

      setScribbles(data || []);
    } catch (error) {
      console.error('Error:', error);
      setErrorMessage('Failed to load scribbles');
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type !== 'application/pdf') {
        setErrorMessage('Please select a PDF file');
        return;
      }
      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        setErrorMessage('PDF file must be less than 10MB');
        return;
      }
      setPdfFile(file);
      setErrorMessage('');
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!pdfFile || !title.trim()) {
      setErrorMessage('Please provide a title and select a PDF file');
      return;
    }

    setUploading(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      // Upload PDF to storage
      const pdfUrl = await uploadToStorage(pdfFile, 'scribbles');
      
      if (!pdfUrl) {
        throw new Error('Failed to upload PDF');
      }

      // Save to database
      const { error } = await supabase
        .from('scribbles')
        .insert({
          title,
          description: description.trim() || null,
          pdf_url: pdfUrl,
          display_date: displayDate,
          is_active: false // Start as inactive
        });

      if (error) {
        console.error('Error saving scribble:', error);
        throw error;
      }

      setSuccessMessage('Scribble uploaded successfully!');
      setTitle('');
      setDescription('');
      setPdfFile(null);
      setDisplayDate(new Date().toISOString().split('T')[0]);
      
      // Reset file input
      const fileInput = document.getElementById('pdf-upload') as HTMLInputElement;
      if (fileInput) fileInput.value = '';

      await fetchScribbles();
    } catch (error) {
      console.error('Error uploading scribble:', error);
      setErrorMessage('Failed to upload scribble. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const toggleActive = async (id: string, currentStatus: boolean) => {
    try {
      // If activating this scribble, deactivate all others first
      if (!currentStatus) {
        await supabase
          .from('scribbles')
          .update({ is_active: false })
          .neq('id', id);
      }

      const { error } = await supabase
        .from('scribbles')
        .update({ is_active: !currentStatus })
        .eq('id', id);

      if (error) {
        console.error('Error toggling scribble:', error);
        setErrorMessage('Failed to update scribble');
        return;
      }

      setSuccessMessage(!currentStatus ? 'Scribble activated!' : 'Scribble deactivated!');
      await fetchScribbles();
    } catch (error) {
      console.error('Error:', error);
      setErrorMessage('Failed to update scribble');
    }
  };

  const handleDelete = async (id: string, pdfUrl: string) => {
    if (!confirm('Are you sure you want to delete this scribble?')) return;

    try {
      // Delete from storage
      const fileName = pdfUrl.split('/').pop();
      if (fileName) {
        const { error: storageError } = await supabase.storage
          .from('scribbles')
          .remove([fileName]);
        
        if (storageError) {
          console.error('Error deleting file from storage:', storageError);
        }
      }

      // Delete from database
      const { error } = await supabase
        .from('scribbles')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting scribble:', error);
        setErrorMessage('Failed to delete scribble');
        return;
      }

      setSuccessMessage('Scribble deleted successfully!');
      await fetchScribbles();
    } catch (error) {
      console.error('Error:', error);
      setErrorMessage('Failed to delete scribble');
    }
  };

  if (loading) {
    return <div className="text-slate-500">Loading scribbles...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-900">Scribble of the Day Manager</h2>
      </div>

      {errorMessage && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {errorMessage}
        </div>
      )}

      {successMessage && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded">
          {successMessage}
        </div>
      )}

      {/* Upload Form */}
      <form onSubmit={handleUpload} className="bg-white rounded-lg border border-slate-200 p-6 space-y-4">
        <h3 className="text-lg font-semibold text-slate-900">Upload New Scribble</h3>
        
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Title *
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-forest-500 focus:border-forest-500"
            placeholder="Enter scribble title"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-forest-500 focus:border-forest-500"
            placeholder="Optional description"
            rows={3}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Display Date
          </label>
          <input
            type="date"
            value={displayDate}
            onChange={(e) => setDisplayDate(e.target.value)}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-forest-500 focus:border-forest-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            PDF File * (Max 10MB)
          </label>
          <input
            id="pdf-upload"
            type="file"
            accept=".pdf"
            onChange={handleFileChange}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-forest-500 focus:border-forest-500"
            required
          />
          {pdfFile && (
            <p className="text-sm text-slate-600 mt-1">
              Selected: {pdfFile.name} ({(pdfFile.size / 1024 / 1024).toFixed(2)} MB)
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={uploading}
          className="flex items-center gap-2 bg-forest-800 hover:bg-forest-900 text-white px-6 py-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Upload className="w-4 h-4" />
          {uploading ? 'Uploading...' : 'Upload Scribble'}
        </button>
      </form>

      {/* Scribbles List */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-slate-900">
          Existing Scribbles ({scribbles.length})
        </h3>
        
        {scribbles.length === 0 ? (
          <p className="text-slate-500 text-center py-8">No scribbles uploaded yet</p>
        ) : (
          <div className="space-y-3">
            {scribbles.map((scribble) => (
              <div
                key={scribble.id}
                className={`bg-white rounded-lg border-2 p-4 transition-colors ${
                  scribble.is_active 
                    ? 'border-green-400 bg-green-50' 
                    : 'border-slate-200'
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <FileText className="w-5 h-5 text-slate-600" />
                      <h4 className="font-semibold text-slate-900">{scribble.title}</h4>
                      {scribble.is_active && (
                        <span className="bg-green-500 text-white text-xs px-2 py-1 rounded">
                          ACTIVE
                        </span>
                      )}
                    </div>
                    
                    {scribble.description && (
                      <p className="text-sm text-slate-600 mb-2">{scribble.description}</p>
                    )}
                    
                    <div className="flex items-center gap-4 text-xs text-slate-500">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(scribble.display_date).toLocaleDateString()}
                      </span>
                      <span>
                        Uploaded: {new Date(scribble.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <a
                      href={scribble.pdf_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                      title="View PDF"
                    >
                      <Eye className="w-5 h-5" />
                    </a>
                    
                    <button
                      onClick={() => toggleActive(scribble.id, scribble.is_active)}
                      className={`p-2 rounded transition-colors ${
                        scribble.is_active
                          ? 'text-orange-600 hover:bg-orange-50'
                          : 'text-green-600 hover:bg-green-50'
                      }`}
                      title={scribble.is_active ? 'Deactivate' : 'Activate'}
                    >
                      {scribble.is_active ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>

                    <button
                      onClick={() => handleDelete(scribble.id, scribble.pdf_url)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
