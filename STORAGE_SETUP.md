# Supabase Storage Setup Guide

## Overview
Music files (and other media) are stored in **Supabase Storage** buckets. This guide explains how to set up and use storage for your midnightLaundry app.

## Storage Buckets

Your app uses the following buckets:
- `music_files` — Audio files (MP3, WAV, FLAC, etc.)
- `videos` — Video files (MP4, WebM, etc.) organized by rating (sfw/nsfw)
- `writings` — PDF documents and text files
- `research` — Research PDF files
- `scribbles` — Daily scribble PDFs for chalkboard widget
- (Optional) `images` — Cover art and thumbnails

## Setup Instructions

### 1. Create Storage Buckets in Supabase

Go to your Supabase project → **Storage** → Create new bucket.

**Bucket 1: `music_files`**
- Name: `music_files`
- Public bucket: ✅ **Yes** (so files can be accessed publicly)
- File size limit: 100 MB (or adjust as needed)

**Bucket 2: `videos`**
- Name: `videos`
- Public bucket: ✅ **Yes**
- File size limit: 500 MB (or adjust as needed)

**Bucket 3: `writings`**
- Name: `writings`
- Public bucket: ✅ **Yes**
- File size limit: 50 MB

**Bucket 4: `research`**
- Name: `research`
- Public bucket: ✅ **Yes**
- File size limit: 100 MB

### 2. Set Storage Policies (RLS for Storage)

Go to **Storage** → Select bucket → **Policies** tab.

For each bucket, create policies to allow:
- **Public reads**: Everyone can view/download files
- **Authenticated writes**: Only logged-in users can upload/delete

**Example Policy for Public Read:**
```sql
CREATE POLICY "Public can read music files"
ON storage.objects
FOR SELECT
USING (bucket_id = 'music_files');
```

**Example Policy for Authenticated Write:**
```sql
CREATE POLICY "Authenticated can write music files"
ON storage.objects
FOR INSERT
WITH CHECK (
  bucket_id = 'music_files' 
  AND auth.role() = 'authenticated'
);
```

Most likely, your Supabase project already has default policies set. You can verify in the UI.

---

## Usage in Code

### Storage Utilities

Use the helper functions in `src/lib/storage.ts`:

```typescript
import { uploadMusicFile, getPublicUrl, deleteFile } from '../../lib/storage';

// Upload a music file
const publicUrl = await uploadMusicFile(file, 'new_release');

// Get public URL for an existing file
const url = getPublicUrl('music_files', 'new_release/1234567890-song.mp3');

// Delete a file
await deleteFile('music_files', 'new_release/1234567890-song.mp3');
```

### MusicSection Component

The `MusicSection` component now:
1. Uploads files to `music_files` bucket (organized by category)
2. Saves the public URL to the `music_items` database table
3. Displays audio player with the file URL

**Upload Example:**
```typescript
const url = await uploadMusicFile(audioFile, 'new_release');
// File stored at: music_files/new_release/1704067200000-track.mp3
// Accessible at: https://your-project.supabase.co/storage/v1/object/public/music_files/new_release/1704067200000-track.mp3
```

---

## File Organization

### Music Files Structure
```
music_files/
├── new_release/
│   ├── 1704067200000-single.mp3
│   └── 1704067300000-ep.mp3
├── mix/
│   ├── 1704067400000-mixtape.mp3
│   └── 1704067500000-house-mix.mp3
├── beat_for_sale/
│   ├── 1704067600000-trap-beat.mp3
│   └── 1704067700000-lofi-beat.mp3
├── podcast_clip/
│   ├── 1704067800000-episode-1.mp3
│   └── 1704067900000-interview.mp3
└── exclusive_release/
    ├── 1704068000000-unreleased.mp3
    └── 1704068100000-vip-mix.mp3
```

### Videos Structure
```
videos/
├── sfw/
│   ├── 1704067200000-music-video.mp4
│   └── 1704067300000-tutorial.mp4
└── nsfw/
    ├── 1704067400000-adult-content.mp4
    └── 1704067500000-explicit.mp4
```

---

## Testing

### Add Test Music to Database

Use Supabase SQL Editor or the test script to add music items:

```sql
INSERT INTO music_items (title, category, file_url, description, price, is_exclusive)
VALUES (
  'My First Track',
  'new_release',
  'https://knpgxbafbxwrzsgetlnm.supabase.co/storage/v1/object/public/music_files/new_release/test-track.mp3',
  'An awesome new release',
  0,
  false
);
```

Or upload through the UI:
1. Open http://localhost:5173 in your browser
2. Navigate to Music section
3. Upload a music file (you'll need admin auth)
4. File should appear in the list with playback controls

---

## Common Issues & Solutions

### ❌ "Bucket not found"
- Verify bucket name is correct (case-sensitive)
- Check bucket exists in Supabase Storage UI
- Confirm public read policies are enabled

### ❌ "Storage file not found (404)"
- File path may be incorrect
- Check file exists in Supabase Storage UI
- Verify file upload completed successfully

### ❌ "CORS errors when playing audio"
- Ensure bucket has public read policy enabled
- Check browser console for specific CORS error
- May need to configure bucket CORS settings

### ✅ Files playing but not saving to DB
- Verify `music_items` table insert permissions
- Check authenticated RLS policies on `music_items`
- Look for console errors in browser dev tools

---

## Accessing Files Programmatically

### Get File Download URL
```typescript
const { data } = supabase.storage
  .from('music_files')
  .getPublicUrl('new_release/1704067200000-track.mp3');

console.log(data.publicUrl); // Public HTTP URL
```

### List All Files in Folder
```typescript
const { data, error } = await supabase.storage
  .from('music_files')
  .list('new_release');

console.log(data); // Array of files
```

### Download File (Private/Protected)
```typescript
const { data, error } = await supabase.storage
  .from('music_files')
  .download('exclusive_release/1704068000000-unreleased.mp3');

if (data) {
  const url = URL.createObjectURL(data);
  // Use url for download or playback
}
```

---

## Helpful Resources

- [Supabase Storage Docs](https://supabase.com/docs/guides/storage)
- [Supabase Storage RLS](https://supabase.com/docs/guides/storage/security)
- [Storage Quickstart](https://supabase.com/docs/guides/storage/quickstart)

---

## Next Steps

1. ✅ Create the storage buckets (music_files, videos, etc.)
2. ✅ Test by uploading a music file through the app UI
3. ✅ Verify file appears in Supabase Storage UI
4. ✅ Check file plays in browser on Music section
5. Optional: Set up CDN caching for better performance
6. Optional: Configure signed URLs for premium content

Once storage is set up, your app can serve unlimited media files directly from Supabase!
