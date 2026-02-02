import { supabase } from './supabase';

/**
 * Get public URL for a file in Supabase Storage
 */
export function getPublicUrl(bucket: string, path: string): string {
  const { data } = supabase.storage.from(bucket).getPublicUrl(path);
  return data?.publicUrl || '';
}

/**
 * Upload file to Supabase Storage
 */
export async function uploadFile(
  bucket: string,
  path: string,
  file: File
): Promise<string | null> {
  try {
    const { data, error } = await supabase.storage.from(bucket).upload(path, file, {
      cacheControl: '3600',
      upsert: false,
    });

    if (error) {
      console.error(`Upload error (${bucket}/${path}):`, error);
      return null;
    }

    return getPublicUrl(bucket, data.path);
  } catch (err) {
    console.error('Unexpected upload error:', err);
    return null;
  }
}

/**
 * Upload music file to Supabase Storage
 * Stores in bucket: 'music_files' under category folder
 */
export async function uploadMusicFile(file: File, category: string): Promise<string | null> {
  const fileName = `${Date.now()}-${file.name}`;
  const path = `${category}/${fileName}`;
  return uploadFile('music_files', path, file);
}

/**
 * Upload video file to Supabase Storage
 */
export async function uploadVideoFile(
  file: File,
  contentRating: 'sfw' | 'nsfw'
): Promise<string | null> {
  const fileName = `${Date.now()}-${file.name}`;
  const path = `${contentRating}/${fileName}`;
  return uploadFile('videos', path, file);
}

/**
 * Delete file from Supabase Storage
 */
export async function deleteFile(bucket: string, path: string): Promise<boolean> {
  try {
    const { error } = await supabase.storage.from(bucket).remove([path]);
    if (error) {
      console.error(`Delete error (${bucket}/${path}):`, error);
      return false;
    }
    return true;
  } catch (err) {
    console.error('Unexpected delete error:', err);
    return false;
  }
}

/**
 * List files in Supabase Storage folder
 */
export async function listFiles(bucket: string, path: string = '') {
  try {
    const { data, error } = await supabase.storage.from(bucket).list(path);
    if (error) {
      console.error(`List error (${bucket}/${path}):`, error);
      return [];
    }
    return data || [];
  } catch (err) {
    console.error('Unexpected list error:', err);
    return [];
  }
}
