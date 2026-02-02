# Database Schema Analysis - midnightLaundry

## Current Status ✅
Your Supabase schema is well-designed and covers all major content types. Here's the complete breakdown:

## Tables by Section Component

### 1. **Music Section** (`MusicSection.tsx`)
- **Table**: `music_items`
- **Data Structure**:
  ```typescript
  {
    id: UUID (Primary Key)
    title: string (required)
    description?: string
    category: 'new_release' | 'mix' | 'beat_for_sale' | 'podcast_clip' | 'exclusive_release'
    file_url?: string (audio file URL)
    embed_url?: string (embedded player)
    price: number (default: 0)
    is_exclusive: boolean (default: false)
    created_at: timestamp
  }
  ```
- **Indexes**: `idx_music_category`

---

### 2. **Video Section** (`VideoSection.tsx`)
- **Table**: `videos`
- **Data Structure**:
  ```typescript
  {
    id: UUID (Primary Key)
    title: string (required)
    description?: string
    content_rating: 'sfw' | 'nsfw' (required)
    embed_url?: string
    file_url?: string
    is_paygated: boolean (default: false)
    paygate_url?: string
    created_at: timestamp
  }
  ```
- **Indexes**: `idx_video_rating`
- **Note**: Age gating is handled on the frontend; NSFW content requires age verification

---

### 3. **Writing Section** (`WritingSection.tsx`)
- **Table**: `writing_pieces`
- **Data Structure**:
  ```typescript
  {
    id: UUID (Primary Key)
    title: string (required)
    category: 'poetry' | 'short_story' | 'extended_work' (required)
    content: string (full text)
    file_url?: string (PDF or document)
    excerpt: string (preview text)
    created_at: timestamp
  }
  ```
- **Indexes**: `idx_writing_category`

---

### 4. **Research Section** (`ResearchSection.tsx`)
- **Tables**: `research_papers` + `research_citations` (one-to-many relationship)

**research_papers**:
```typescript
{
  id: UUID (Primary Key)
  title: string (required)
  description?: string
  file_url: string (required - PDF location)
  created_at: timestamp
}
```

**research_citations**:
```typescript
{
  id: UUID (Primary Key)
  research_paper_id: UUID (Foreign Key → research_papers)
  citation_text: string (required)
  order_index: integer (ordering)
  created_at: timestamp
}
```
- **Indexes**: `idx_citations_paper`

---

### 5. **Social Feed** (`SocialFeed.tsx`)
- **Table**: `social_posts`
- **Data Structure**:
  ```typescript
  {
    id: UUID (Primary Key)
    platform: string (e.g., 'twitter', 'instagram', 'tiktok')
    content: string (post text)
    post_url: string (required - link to original post)
    platform_logo_url?: string
    posted_at: timestamp (when posted on original platform)
    created_at: timestamp (when added to DB)
  }
  ```
- **Indexes**: `idx_social_posted_at`
- **Real-time**: Uses Supabase real-time subscriptions

---

## Additional Tables (Not in section components)

### 6. **Messages** (`TalkToBriiiteWidget`)
- **Table**: `messages`
- **Data Structure**:
  ```typescript
  {
    id: UUID
    sender_name: string (required)
    sender_email: string (required)
    message_content: string (required)
    created_at: timestamp
    is_read: boolean (default: false)
  }
  ```

### 7. **Gifts** (`GiftBucketWidget`)
- **Table**: `gifts`
- **Data Structure**:
  ```typescript
  {
    id: UUID
    sender_name: string (default: 'Anonymous')
    sender_email?: string
    amount: decimal(10,2) (required)
    payment_method?: string
    message?: string
    created_at: timestamp
  }
  ```

### 8. **Commission Inquiries** (`CommissionForm`)
- **Table**: `commission_inquiries`
- **Data Structure**:
  ```typescript
  {
    id: UUID
    name: string (required)
    email: string (required)
    inquiry_type: 'personal' | 'business_licensing' | 'creative_pursuit' (required)
    project_description: string (required)
    budget_range?: string
    status: 'pending' | 'reviewed' | 'accepted' | 'declined' (default: 'pending')
    created_at: timestamp
  }
  ```

---

## Security & RLS Policies ✅

All tables have Row Level Security (RLS) enabled with these standard policies:

| Operation | Public Access | Authenticated Access |
|-----------|---|---|
| **SELECT** | ✅ For content tables | ✅ Full access |
| **INSERT** | ⚠️ Limited (forms/messages/gifts only) | ✅ Full access |
| **UPDATE** | ❌ No | ✅ Authenticated only |
| **DELETE** | ❌ No | ✅ Authenticated only |

---

## Issues Found & Recommendations

### ⚠️ Table Name Mismatch
**File**: `MusicSection.tsx` (line 37)
- **Current**: Component queries `music_files` table
- **Migration defines**: `music_items` table
- **Fix**: Either rename table in migration or update the query

### ✅ Schema Completeness
- All necessary fields are present
- Proper relationships established (citations → papers)
- Indexes optimized for common queries
- Constraints in place for data integrity

### 🔄 Recommended Enhancements (Optional)
1. **Add soft deletes**: Add `deleted_at` column for archival
2. **Add ownership**: Add `created_by` for multi-admin scenarios
3. **Add slugs**: Add URL-friendly slugs to content tables
4. **Add tags/categories**: Separate genre/tag tables for better organization

---

## Quick Reference for Development

### To fetch music by category:
```typescript
supabase
  .from('music_items')
  .select('*')
  .eq('category', 'new_release')
  .order('created_at', { ascending: false })
```

### To fetch papers with citations:
```typescript
const papers = await supabase
  .from('research_papers')
  .select('*')

const papersWithCitations = await Promise.all(
  papers.map(paper => ({
    ...paper,
    citations: await supabase
      .from('research_citations')
      .select('*')
      .eq('research_paper_id', paper.id)
  }))
)
```

### To filter NSFW content:
```typescript
supabase
  .from('videos')
  .select('*')
  .eq('content_rating', 'nsfw')
```

---

## Generated Supabase Types ✅
Run the following to generate TypeScript types:
```bash
npx supabase gen types typescript --project-id YOUR_PROJECT_ID > src/types/database.types.ts
```

This will keep your type definitions in sync with your actual schema.
