import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

type SiteSettings = {
  background_image: string;
  button_theme_image: string;
  header_image: string;
  footer_image: string;
};

const DEFAULT_SETTINGS: SiteSettings = {
  background_image: '/laundry-sketch.JPG',
  button_theme_image: '/forest-texture.jpg',
  header_image: '/nebula-bg.jpg',
  footer_image: '/nebula-bg.jpg',
};

/**
 * Hook to fetch and cache site-wide image settings from the database
 * Falls back to default hardcoded paths if database fetch fails
 */
export function useSiteSettings() {
  const [settings, setSettings] = useState<SiteSettings>(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('site_settings')
        .select('setting_key, setting_value')
        .in('setting_key', [
          'background_image',
          'button_theme_image',
          'header_image',
          'footer_image'
        ]);

      if (error) {
        console.error('Error fetching site settings:', error);
        setLoading(false);
        return;
      }

      if (data && data.length > 0) {
        const fetchedSettings: Partial<SiteSettings> = {};
        data.forEach((setting) => {
          fetchedSettings[setting.setting_key as keyof SiteSettings] = setting.setting_value;
        });

        setSettings({
          ...DEFAULT_SETTINGS,
          ...fetchedSettings,
        });
      }
    } catch (error) {
      console.error('Unexpected error fetching site settings:', error);
    } finally {
      setLoading(false);
    }
  };

  return { settings, loading };
}
