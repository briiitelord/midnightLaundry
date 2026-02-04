import { useState, useEffect } from 'react';
import { Upload, Image as ImageIcon, RefreshCw } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { uploadToStorage } from '../../lib/storage';

type ImageSetting = {
  key: string;
  label: string;
  description: string;
  currentUrl: string;
};

export default function AdminSiteBuildManager() {
  const [settings, setSettings] = useState<ImageSetting[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('site_settings')
        .select('*')
        .in('setting_key', [
          'background_image',
          'button_theme_image',
          'header_image',
          'footer_image'
        ]);

      if (error) {
        console.error('Error fetching settings:', error);
        setErrorMessage('Failed to load settings');
        return;
      }

      const imageSettings: ImageSetting[] = [
        {
          key: 'background_image',
          label: 'Main Background Image',
          description: 'Site-wide background image (laundry sketch)',
          currentUrl: data?.find(s => s.setting_key === 'background_image')?.setting_value || '/laundry-sketch.JPG'
        },
        {
          key: 'button_theme_image',
          label: 'Button Theme Image',
          description: 'Forest texture for active buttons',
          currentUrl: data?.find(s => s.setting_key === 'button_theme_image')?.setting_value || '/forest-texture.jpg'
        },
        {
          key: 'header_image',
          label: 'Header Background Image',
          description: 'Navigation header background',
          currentUrl: data?.find(s => s.setting_key === 'header_image')?.setting_value || '/nebula-bg.jpg'
        },
        {
          key: 'footer_image',
          label: 'Footer Background Image',
          description: 'Footer section background',
          currentUrl: data?.find(s => s.setting_key === 'footer_image')?.setting_value || '/nebula-bg.jpg'
        }
      ];

      setSettings(imageSettings);
    } catch (error) {
      console.error('Error:', error);
      setErrorMessage('Failed to load settings');
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (settingKey: string, file: File) => {
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setErrorMessage('Please select an image file');
      return;
    }

    // Validate file size (10MB limit)
    if (file.size > 10 * 1024 * 1024) {
      setErrorMessage('Image must be less than 10MB');
      return;
    }

    setUploading(settingKey);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      // Upload to storage
      const imageUrl = await uploadToStorage(file, 'site-images');

      if (!imageUrl) {
        throw new Error('Failed to upload image');
      }

      // Update database
      const { error } = await supabase
        .from('site_settings')
        .upsert({
          setting_key: settingKey,
          setting_value: imageUrl,
          description: settings.find(s => s.key === settingKey)?.description || ''
        }, {
          onConflict: 'setting_key'
        });

      if (error) {
        console.error('Error updating setting:', error);
        throw error;
      }

      setSuccessMessage(`${settings.find(s => s.key === settingKey)?.label} updated successfully! Refresh the page to see changes.`);
      await fetchSettings();
    } catch (error) {
      console.error('Error uploading image:', error);
      setErrorMessage('Failed to upload image. Please try again.');
    } finally {
      setUploading(null);
    }
  };

  const handleFileSelect = (settingKey: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleImageUpload(settingKey, file);
    }
  };

  if (loading) {
    return <div className="text-slate-500">Loading site settings...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Site Build Manager</h2>
          <p className="text-slate-600 text-sm mt-1">Manage site-wide images and styling</p>
        </div>
        <button
          onClick={() => window.location.reload()}
          className="flex items-center gap-2 px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
          title="Refresh to see changes"
        >
          <RefreshCw className="w-4 h-4" />
          Refresh Page
        </button>
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

      <div className="space-y-6">
        {settings.map((setting) => (
          <div
            key={setting.key}
            className="bg-white rounded-lg border border-slate-200 p-6"
          >
            <div className="flex items-start justify-between gap-6">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-slate-900 mb-1">
                  {setting.label}
                </h3>
                <p className="text-sm text-slate-600 mb-4">{setting.description}</p>

                {/* Current Image Preview */}
                <div className="mb-4">
                  <p className="text-xs font-medium text-slate-700 mb-2">Current Image:</p>
                  <div className="relative w-64 h-40 bg-slate-100 rounded-lg overflow-hidden border border-slate-300">
                    <img
                      src={setting.currentUrl}
                      alt={setting.label}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="150"%3E%3Crect fill="%23ddd" width="200" height="150"/%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" fill="%23666" font-size="16"%3ENo Image%3C/text%3E%3C/svg%3E';
                      }}
                    />
                  </div>
                  <p className="text-xs text-slate-500 mt-1">{setting.currentUrl}</p>
                </div>

                {/* Upload Button */}
                <label className="inline-block">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileSelect(setting.key, e)}
                    disabled={uploading !== null}
                    className="hidden"
                  />
                  <span
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors cursor-pointer ${
                      uploading === setting.key
                        ? 'bg-gray-400 cursor-not-allowed'
                        : 'bg-forest-800 hover:bg-forest-900 text-white'
                    }`}
                  >
                    {uploading === setting.key ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                        <span>Uploading...</span>
                      </>
                    ) : (
                      <>
                        <Upload className="w-4 h-4" />
                        <span>Upload New Image</span>
                      </>
                    )}
                  </span>
                </label>
              </div>

              <ImageIcon className="w-8 h-8 text-slate-400" />
            </div>
          </div>
        ))}
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
        <h4 className="font-semibold text-amber-900 mb-2">Important Notes:</h4>
        <ul className="text-sm text-amber-800 space-y-1 list-disc list-inside">
          <li>Images are uploaded to the <code className="bg-amber-100 px-1 rounded">site-images</code> storage bucket</li>
          <li>Maximum file size: 10MB</li>
          <li>Recommended formats: JPG, PNG, WebP</li>
          <li><strong>Refresh the page</strong> after uploading to see changes take effect</li>
          <li>Old images remain in storage but are replaced in the database</li>
        </ul>
      </div>
    </div>
  );
}
