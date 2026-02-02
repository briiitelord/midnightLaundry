# Database Implementation Guide

## Summary of Changes

### ✅ What Was Done

1. **Analyzed** all 5 section components and their data types
2. **Verified** existing Supabase schema covers all needs
3. **Fixed** table name mismatch: `music_files` → `music_items` in MusicSection.tsx
4. **Enhanced** schema with:
   - Soft delete support (`deleted_at` column)
   - URL-friendly slugs for SEO
   - Automatic timestamp updates (`updated_at`)
   - Additional performance indexes
5. **Created** TypeScript types file matching schema

---

## Next Steps

### 1. Deploy New Migration (Optional)
The enhanced migration is optional - your original schema works perfectly. To apply enhancements:

```bash
cd /Users/briiitelord/Desktop/demo\ repos/midnightLaundry
npx supabase db push
```

This will:
- ✅ Add soft delete columns to all tables
- ✅ Add slug columns for SEO-friendly URLs
- ✅ Add automatic `updated_at` triggers
- ✅ Keep all existing data intact

### 2. Update Component Queries (If Using New Schema)

If you deploy the enhanced migration, update your queries to exclude soft-deleted records:

**Before**:
```typescript
const { data } = await supabase
  .from('music_items')
  .select('*')
  .eq('category', activeTab)
```

**After**:
```typescript
const { data } = await supabase
  .from('music_items')
  .select('*')
  .eq('category', activeTab)
  .is('deleted_at', null)  // Exclude soft-deleted records
```

### 3. Generate Updated TypeScript Types

```bash
npx supabase gen types typescript \
  --project-id YOUR_PROJECT_ID > src/types/database.types.ts
```

This keeps your types in sync with Supabase.

---

## Database Query Examples

### Music Section
```typescript
// Fetch new releases
const { data: newReleases } = await supabase
  .from('music_items')
  .select('*')
  .eq('category', 'new_release')
  .is('deleted_at', null)
  .order('created_at', { ascending: false })

// Fetch exclusive content
const { data: exclusive } = await supabase
  .from('music_items')
  .select('*')
  .eq('is_exclusive', true)
  .is('deleted_at', null)
```

### Video Section
```typescript
// Fetch by content rating
const { data: videos } = await supabase
  .from('videos')
  .select('*')
  .eq('content_rating', 'sfw')
  .is('deleted_at', null)
  .order('created_at', { ascending: false })

// Fetch paygated content
const { data: paygated } = await supabase
  .from('videos')
  .select('*')
  .eq('is_paygated', true)
  .is('deleted_at', null)
```

### Writing Section
```typescript
// Fetch by category
const { data: poems } = await supabase
  .from('writing_pieces')
  .select('*')
  .eq('category', 'poetry')
  .is('deleted_at', null)
  .order('created_at', { ascending: false })
```

### Research Section
```typescript
// Fetch papers with citations
const { data: papers } = await supabase
  .from('research_papers')
  .select('*')
  .is('deleted_at', null)
  .order('created_at', { ascending: false })

const papersWithCitations = await Promise.all(
  papers.map(async (paper) => {
    const { data: citations } = await supabase
      .from('research_citations')
      .select('*')
      .eq('research_paper_id', paper.id)
      .is('deleted_at', null)
      .order('order_index', { ascending: true })
    
    return { ...paper, citations }
  })
)
```

### Social Feed
```typescript
// Fetch latest posts
const { data: posts } = await supabase
  .from('social_posts')
  .select('*')
  .is('deleted_at', null)
  .order('posted_at', { ascending: false })
  .limit(10)

// Fetch by platform
const { data: tweets } = await supabase
  .from('social_posts')
  .select('*')
  .eq('platform', 'twitter')
  .is('deleted_at', null)
```

### Messaging & Support
```typescript
// Insert a message
const { data: message } = await supabase
  .from('messages')
  .insert({
    sender_name: 'John',
    sender_email: 'john@example.com',
    message_content: 'Your work is amazing!'
  })

// Record a gift/tip
const { data: gift } = await supabase
  .from('gifts')
  .insert({
    sender_name: 'Jane',
    amount: 25.00,
    message: 'Keep creating!'
  })

// Insert commission inquiry
const { data: inquiry } = await supabase
  .from('commission_inquiries')
  .insert({
    name: 'Bob',
    email: 'bob@example.com',
    inquiry_type: 'creative_pursuit',
    project_description: 'I need a custom beat',
    budget_range: '$100-500'
  })
```

---

## Real-Time Subscriptions

### Subscribe to New Music Uploads
```typescript
const subscription = supabase
  .channel('music_changes')
  .on(
    'postgres_changes',
    {
      event: 'INSERT',
      schema: 'public',
      table: 'music_items',
    },
    (payload) => {
      console.log('New music uploaded:', payload.new)
    }
  )
  .subscribe()

// Cleanup
subscription.unsubscribe()
```

### Subscribe to Social Posts
```typescript
const subscription = supabase
  .channel('social_posts_changes')
  .on(
    'postgres_changes',
    {
      event: '*',  // All events
      schema: 'public',
      table: 'social_posts',
    },
    () => {
      fetchSocialPosts()  // Refetch when changes occur
    }
  )
  .subscribe()
```

---

## Row Level Security (RLS) Rules

| Table | Public Select | Public Insert | Auth Update/Delete |
|-------|---|---|---|
| music_items | ✅ | ❌ | ✅ |
| videos | ✅ (SFW + NSFW) | ❌ | ✅ |
| writing_pieces | ✅ | ❌ | ✅ |
| research_papers | ✅ | ❌ | ✅ |
| research_citations | ✅ | ❌ | ✅ |
| social_posts | ✅ | ❌ | ✅ |
| messages | ❌ | ✅ | ✅ (auth only) |
| gifts | ❌ | ✅ | ✅ (auth only) |
| commission_inquiries | ❌ | ✅ | ✅ (auth only) |

---

## Storage Setup

### Create Storage Buckets
```typescript
// Music files
await supabase.storage.createBucket('music_files', {
  public: true,
  allowedMimeTypes: ['audio/mpeg', 'audio/wav', 'audio/mp4'],
})

// Videos
await supabase.storage.createBucket('videos', {
  public: true,
  allowedMimeTypes: ['video/mp4', 'video/webm'],
})

// Writing documents
await supabase.storage.createBucket('writings', {
  public: true,
  allowedMimeTypes: ['application/pdf', 'text/plain'],
})

// Research PDFs
await supabase.storage.createBucket('research', {
  public: true,
  allowedMimeTypes: ['application/pdf'],
})
```

### Upload File Example
```typescript
const uploadMusic = async (file: File, category: string) => {
  const fileName = `${Date.now()}-${file.name}`
  const { data, error } = await supabase.storage
    .from('music_files')
    .upload(`${category}/${fileName}`, file)

  if (error) {
    console.error('Upload failed:', error)
    return null
  }

  // Get public URL
  const { data: urlData } = supabase.storage
    .from('music_files')
    .getPublicUrl(data.path)

  return urlData.publicUrl
}
```

---

## Testing Your Schema

### Quick Test in Supabase Studio
1. Go to https://app.supabase.com
2. Select your project
3. Navigate to SQL Editor
4. Insert test data:

```sql
-- Add a test music item
INSERT INTO music_items (title, category, description, price)
VALUES ('Test Beat', 'beat_for_sale', 'A sample beat', 49.99);

-- Add a test video
INSERT INTO videos (title, content_rating, description)
VALUES ('Test Video', 'sfw', 'A sample video');

-- Add a test writing piece
INSERT INTO writing_pieces (title, category, excerpt)
VALUES ('Test Poem', 'poetry', 'A sample poem excerpt...');
```

---

## Troubleshooting

### ❌ "Table does not exist"
- Run migration: `npx supabase db push`
- Check table name matches exactly (case-sensitive)

### ❌ "Permission denied" errors
- Verify RLS policies are enabled
- Check you're using correct auth credentials
- For public reads, ensure RLS policy allows it

### ❌ "Foreign key constraint failed"
- For citations: ensure `research_paper_id` exists in `research_papers`
- Check both IDs are valid UUIDs

### ✅ All working? 
Document your experience and share feedback!

---

## Files Reference

| File | Purpose |
|------|---------|
| [SCHEMA_ANALYSIS.md](SCHEMA_ANALYSIS.md) | Complete schema breakdown |
| [supabase/migrations/20260131_update_schema_enhancements.sql](supabase/migrations/20260131_update_schema_enhancements.sql) | Enhanced migration (optional) |
| [src/types/database.types.ts](src/types/database.types.ts) | TypeScript types |
| [src/components/sections/MusicSection.tsx](src/components/sections/MusicSection.tsx) | ✅ Fixed table name |

---

**Last Updated**: January 31, 2026
