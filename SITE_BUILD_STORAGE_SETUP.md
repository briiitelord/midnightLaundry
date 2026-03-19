# Site Build Storage Setup

## Problem

Getting error when uploading images via Site Build Manager:
```
StorageApiError: bucket not found
```

This means the `site-images` storage bucket doesn't exist in Supabase yet.

---

## Solution: Run Migration

### Option 1: Using Supabase Dashboard (Recommended)

1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Select your project: `knpgxbafbxwrzsgetlnm`
3. Navigate to **SQL Editor** (left sidebar)
4. Click **New Query**
5. Copy and paste the contents of: [`supabase/migrations/20260214_create_site_images_bucket.sql`](supabase/migrations/20260214_create_site_images_bucket.sql)
6. Click **Run** (or press `Ctrl+Enter`)
7. Wait for "Success" message

### Option 2: Using Supabase CLI (If installed)

```bash
# Navigate to project
cd "/Users/briiitelord/Desktop/demo repos/midnightLaundry"

# Run migration
supabase db push
```

---

## What This Migration Creates

### 1. Storage Bucket: `site-images`
- **Public:** Yes (images need to be publicly accessible on the site)
- **File Size Limit:** 10MB per file
- **Allowed Formats:** JPEG, JPG, PNG, WebP, GIF

### 2. Storage Policies
- ✅ **Public Read:** Anyone can view/download images
- ✅ **Admin Upload:** Authenticated users can upload
- ✅ **Admin Update:** Authenticated users can replace images
- ✅ **Admin Delete:** Authenticated users can delete images

### 3. Database Table: `site_settings`
- Stores image URLs and site configuration
- Has RLS policies for public read, admin write
- Auto-updated `updated_at` timestamp

### 4. Default Settings
Initializes the database with default values:
```
background_image: /laundry-sketch.JPG
button_theme_image: /forest-texture.jpg
header_image: /nebula-bg.jpg
footer_image: /nebula-bg.jpg
```

---

## Verification

After running the migration, verify it worked:

### Check Storage Bucket
1. Go to Supabase Dashboard → **Storage**
2. You should see `site-images` bucket listed
3. Click on it - should be empty (ready for uploads)

### Check Database Table
1. Go to Supabase Dashboard → **Table Editor**
2. Select `site_settings` table
3. Should see 4 rows with default image paths

### Test Upload
1. Go to: `https://midnightlaundry247.com/admin.html`
2. Login with password: `briiite2025`
3. Navigate to **Site Build** section
4. Try uploading an image
5. Should succeed with "✅ Updated successfully!" message

---

## Troubleshooting

### Error: "permission denied for table storage.buckets"
**Cause:** Using anon key instead of service role key
**Solution:** Run migration from Supabase Dashboard (it uses admin permissions)

### Error: "bucket 'site-images' already exists"
**Cause:** Bucket was created previously
**Solution:** This is fine! The migration uses `ON CONFLICT DO NOTHING`

### Images still not uploading
1. Check browser console for detailed error
2. Verify you're logged in as admin (authenticated)
3. Check Supabase Dashboard → Storage → site-images for policies
4. Ensure bucket is marked as **Public**

---

## What Happens After Setup

1. **Admin uploads image** via Site Build Manager
   - Image uploaded to `site-images` bucket
   - URL like: `https://knpgxbafbxwrzsgetlnm.supabase.co/storage/v1/object/public/site-images/1234567890-myimage.jpg`

2. **Database updated** with new URL
   - `site_settings` table row updated
   - `setting_value` changes from `/laundry-sketch.JPG` → full Supabase URL

3. **Public site fetches** new URL
   - `useSiteSettings()` hook queries database
   - Gets latest image URL
   - Renders new image

4. **Instant updates** (after page refresh)
   - No code redeployment needed
   - Just refresh browser to see changes

---

## Security Notes

### Why Public Bucket?
- Site images (backgrounds, headers) need to be accessible to all visitors
- No sensitive data in these images
- Standard practice for public website assets

### Admin Access Only
- **Upload/Delete:** Requires authentication (admin login)
- **RLS Policies:** Prevent unauthorized modifications
- **Anon Key:** Only allows read access

### Bucket Policies Summary
```
Read (SELECT):   Anyone (public)
Insert:          Authenticated users only
Update:          Authenticated users only  
Delete:          Authenticated users only
```

---

## Status After Running Migration

- ✅ `site-images` bucket created
- ✅ Storage policies configured
- ✅ `site_settings` table ready
- ✅ Default values initialized
- ✅ Ready to upload images via admin dashboard

**Next Step:** Upload images via admin dashboard and they'll work immediately!
