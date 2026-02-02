/*
  # Add enhancements to existing tables
  
  Adds soft delete, slug, and timestamp columns to all existing tables
*/

-- ============================================================================
-- ADD COLUMNS TO EXISTING TABLES
-- ============================================================================

-- Music Items
ALTER TABLE IF EXISTS music_items 
  ADD COLUMN IF NOT EXISTS slug text UNIQUE,
  ADD COLUMN IF NOT EXISTS deleted_at timestamptz,
  ADD COLUMN IF NOT EXISTS updated_at timestamptz DEFAULT now();

-- Videos
ALTER TABLE IF EXISTS videos 
  ADD COLUMN IF NOT EXISTS slug text UNIQUE,
  ADD COLUMN IF NOT EXISTS deleted_at timestamptz,
  ADD COLUMN IF NOT EXISTS updated_at timestamptz DEFAULT now();

-- Writing Pieces
ALTER TABLE IF EXISTS writing_pieces 
  ADD COLUMN IF NOT EXISTS slug text UNIQUE,
  ADD COLUMN IF NOT EXISTS deleted_at timestamptz,
  ADD COLUMN IF NOT EXISTS updated_at timestamptz DEFAULT now();

-- Research Papers
ALTER TABLE IF EXISTS research_papers 
  ADD COLUMN IF NOT EXISTS slug text UNIQUE,
  ADD COLUMN IF NOT EXISTS deleted_at timestamptz,
  ADD COLUMN IF NOT EXISTS updated_at timestamptz DEFAULT now();

-- Research Citations
ALTER TABLE IF EXISTS research_citations 
  ADD COLUMN IF NOT EXISTS deleted_at timestamptz,
  ADD COLUMN IF NOT EXISTS updated_at timestamptz DEFAULT now();

-- Social Posts
ALTER TABLE IF EXISTS social_posts 
  ADD COLUMN IF NOT EXISTS deleted_at timestamptz,
  ADD COLUMN IF NOT EXISTS updated_at timestamptz DEFAULT now();

-- Messages
ALTER TABLE IF EXISTS messages 
  ADD COLUMN IF NOT EXISTS deleted_at timestamptz,
  ADD COLUMN IF NOT EXISTS updated_at timestamptz DEFAULT now();

-- Gifts
ALTER TABLE IF EXISTS gifts 
  ADD COLUMN IF NOT EXISTS deleted_at timestamptz,
  ADD COLUMN IF NOT EXISTS updated_at timestamptz DEFAULT now();

-- Commission Inquiries
ALTER TABLE IF EXISTS commission_inquiries 
  ADD COLUMN IF NOT EXISTS deleted_at timestamptz,
  ADD COLUMN IF NOT EXISTS updated_at timestamptz DEFAULT now();

-- ============================================================================
-- DROP OLD POLICIES (if they exist) AND CREATE NEW ONES
-- ============================================================================

-- Drop old music_items policies
DROP POLICY IF EXISTS "Anyone can view music items" ON music_items;
DROP POLICY IF EXISTS "Authenticated users can insert music items" ON music_items;
DROP POLICY IF EXISTS "Authenticated users can update music items" ON music_items;
DROP POLICY IF EXISTS "Authenticated users can delete music items" ON music_items;

-- Create new music_items policies with soft delete support
CREATE POLICY "Anyone can view music items"
  ON music_items FOR SELECT
  TO public
  USING (deleted_at IS NULL);

CREATE POLICY "Authenticated users can insert music items"
  ON music_items FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update music items"
  ON music_items FOR UPDATE
  TO authenticated
  USING (deleted_at IS NULL)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete music items (soft)"
  ON music_items FOR DELETE
  TO authenticated
  USING (deleted_at IS NULL);

-- Drop old video policies
DROP POLICY IF EXISTS "Anyone can view SFW videos" ON videos;
DROP POLICY IF EXISTS "Anyone can view NSFW videos" ON videos;
DROP POLICY IF EXISTS "Authenticated users can insert videos" ON videos;
DROP POLICY IF EXISTS "Authenticated users can update videos" ON videos;
DROP POLICY IF EXISTS "Authenticated users can delete videos" ON videos;

-- Create new video policies with soft delete support
CREATE POLICY "Anyone can view SFW videos"
  ON videos FOR SELECT
  TO public
  USING (content_rating = 'sfw' AND deleted_at IS NULL);

CREATE POLICY "Anyone can view NSFW videos"
  ON videos FOR SELECT
  TO public
  USING (content_rating = 'nsfw' AND deleted_at IS NULL);

CREATE POLICY "Authenticated users can insert videos"
  ON videos FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update videos"
  ON videos FOR UPDATE
  TO authenticated
  USING (deleted_at IS NULL)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete videos (soft)"
  ON videos FOR DELETE
  TO authenticated
  USING (deleted_at IS NULL);

-- Drop old writing_pieces policies
DROP POLICY IF EXISTS "Anyone can view writing pieces" ON writing_pieces;
DROP POLICY IF EXISTS "Authenticated users can insert writing pieces" ON writing_pieces;
DROP POLICY IF EXISTS "Authenticated users can update writing pieces" ON writing_pieces;
DROP POLICY IF EXISTS "Authenticated users can delete writing pieces" ON writing_pieces;

-- Create new writing_pieces policies
CREATE POLICY "Anyone can view writing pieces"
  ON writing_pieces FOR SELECT
  TO public
  USING (deleted_at IS NULL);

CREATE POLICY "Authenticated users can insert writing pieces"
  ON writing_pieces FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update writing pieces"
  ON writing_pieces FOR UPDATE
  TO authenticated
  USING (deleted_at IS NULL)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete writing pieces (soft)"
  ON writing_pieces FOR DELETE
  TO authenticated
  USING (deleted_at IS NULL);

-- Drop old research_papers policies
DROP POLICY IF EXISTS "Anyone can view research papers" ON research_papers;
DROP POLICY IF EXISTS "Authenticated users can insert research papers" ON research_papers;
DROP POLICY IF EXISTS "Authenticated users can update research papers" ON research_papers;
DROP POLICY IF EXISTS "Authenticated users can delete research papers" ON research_papers;

-- Create new research_papers policies
CREATE POLICY "Anyone can view research papers"
  ON research_papers FOR SELECT
  TO public
  USING (deleted_at IS NULL);

CREATE POLICY "Authenticated users can insert research papers"
  ON research_papers FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update research papers"
  ON research_papers FOR UPDATE
  TO authenticated
  USING (deleted_at IS NULL)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete research papers (soft)"
  ON research_papers FOR DELETE
  TO authenticated
  USING (deleted_at IS NULL);

-- Drop old research_citations policies
DROP POLICY IF EXISTS "Anyone can view research citations" ON research_citations;
DROP POLICY IF EXISTS "Authenticated users can insert citations" ON research_citations;
DROP POLICY IF EXISTS "Authenticated users can update citations" ON research_citations;
DROP POLICY IF EXISTS "Authenticated users can delete citations" ON research_citations;

-- Create new research_citations policies
CREATE POLICY "Anyone can view research citations"
  ON research_citations FOR SELECT
  TO public
  USING (deleted_at IS NULL);

CREATE POLICY "Authenticated users can insert citations"
  ON research_citations FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update citations"
  ON research_citations FOR UPDATE
  TO authenticated
  USING (deleted_at IS NULL)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete citations (soft)"
  ON research_citations FOR DELETE
  TO authenticated
  USING (deleted_at IS NULL);

-- Drop old social_posts policies
DROP POLICY IF EXISTS "Anyone can view social posts" ON social_posts;
DROP POLICY IF EXISTS "Authenticated users can insert social posts" ON social_posts;
DROP POLICY IF EXISTS "Authenticated users can update social posts" ON social_posts;
DROP POLICY IF EXISTS "Authenticated users can delete social posts" ON social_posts;

-- Create new social_posts policies
CREATE POLICY "Anyone can view social posts"
  ON social_posts FOR SELECT
  TO public
  USING (deleted_at IS NULL);

CREATE POLICY "Authenticated users can insert social posts"
  ON social_posts FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update social posts"
  ON social_posts FOR UPDATE
  TO authenticated
  USING (deleted_at IS NULL)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete social posts (soft)"
  ON social_posts FOR DELETE
  TO authenticated
  USING (deleted_at IS NULL);

-- Drop old message policies
DROP POLICY IF EXISTS "Authenticated users can view messages" ON messages;
DROP POLICY IF EXISTS "Anyone can insert messages" ON messages;
DROP POLICY IF EXISTS "Authenticated users can update messages" ON messages;
DROP POLICY IF EXISTS "Authenticated users can delete messages" ON messages;

-- Create new message policies
CREATE POLICY "Authenticated users can view messages"
  ON messages FOR SELECT
  TO authenticated
  USING (deleted_at IS NULL);

CREATE POLICY "Anyone can insert messages"
  ON messages FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update messages"
  ON messages FOR UPDATE
  TO authenticated
  USING (deleted_at IS NULL)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete messages (soft)"
  ON messages FOR DELETE
  TO authenticated
  USING (deleted_at IS NULL);

-- Drop old gift policies
DROP POLICY IF EXISTS "Authenticated users can view gifts" ON gifts;
DROP POLICY IF EXISTS "Anyone can insert gifts" ON gifts;
DROP POLICY IF EXISTS "Authenticated users can update gifts" ON gifts;
DROP POLICY IF EXISTS "Authenticated users can delete gifts" ON gifts;

-- Create new gift policies
CREATE POLICY "Authenticated users can view gifts"
  ON gifts FOR SELECT
  TO authenticated
  USING (deleted_at IS NULL);

CREATE POLICY "Anyone can insert gifts"
  ON gifts FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update gifts"
  ON gifts FOR UPDATE
  TO authenticated
  USING (deleted_at IS NULL)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete gifts (soft)"
  ON gifts FOR DELETE
  TO authenticated
  USING (deleted_at IS NULL);

-- Drop old commission_inquiries policies
DROP POLICY IF EXISTS "Authenticated users can view inquiries" ON commission_inquiries;
DROP POLICY IF EXISTS "Anyone can insert inquiries" ON commission_inquiries;
DROP POLICY IF EXISTS "Authenticated users can update inquiries" ON commission_inquiries;
DROP POLICY IF EXISTS "Authenticated users can delete inquiries" ON commission_inquiries;

-- Create new commission_inquiries policies
CREATE POLICY "Authenticated users can view inquiries"
  ON commission_inquiries FOR SELECT
  TO authenticated
  USING (deleted_at IS NULL);

CREATE POLICY "Anyone can insert inquiries"
  ON commission_inquiries FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update inquiries"
  ON commission_inquiries FOR UPDATE
  TO authenticated
  USING (deleted_at IS NULL)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete inquiries (soft)"
  ON commission_inquiries FOR DELETE
  TO authenticated
  USING (deleted_at IS NULL);

-- ============================================================================
-- ADD INDEXES
-- ============================================================================

CREATE INDEX IF NOT EXISTS idx_music_category ON music_items(category) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_music_created ON music_items(created_at DESC) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_music_slug ON music_items(slug) WHERE deleted_at IS NULL;

CREATE INDEX IF NOT EXISTS idx_video_rating ON videos(content_rating) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_video_created ON videos(created_at DESC) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_video_slug ON videos(slug) WHERE deleted_at IS NULL;

CREATE INDEX IF NOT EXISTS idx_writing_category ON writing_pieces(category) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_writing_created ON writing_pieces(created_at DESC) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_writing_slug ON writing_pieces(slug) WHERE deleted_at IS NULL;

CREATE INDEX IF NOT EXISTS idx_research_created ON research_papers(created_at DESC) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_research_slug ON research_papers(slug) WHERE deleted_at IS NULL;

CREATE INDEX IF NOT EXISTS idx_citations_paper ON research_citations(research_paper_id) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_citations_order ON research_citations(order_index) WHERE deleted_at IS NULL;

CREATE INDEX IF NOT EXISTS idx_social_posted_at ON social_posts(posted_at DESC) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_social_created ON social_posts(created_at DESC) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_social_platform ON social_posts(platform) WHERE deleted_at IS NULL;

CREATE INDEX IF NOT EXISTS idx_messages_created ON messages(created_at DESC) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_messages_read ON messages(is_read) WHERE deleted_at IS NULL;

CREATE INDEX IF NOT EXISTS idx_gifts_created ON gifts(created_at DESC) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_gifts_amount ON gifts(amount DESC) WHERE deleted_at IS NULL;

CREATE INDEX IF NOT EXISTS idx_inquiries_status ON commission_inquiries(status) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_inquiries_created ON commission_inquiries(created_at DESC) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_inquiries_email ON commission_inquiries(email);

-- ============================================================================
-- FUNCTION FOR AUTOMATIC UPDATED_AT
-- ============================================================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply update triggers to all tables
DROP TRIGGER IF EXISTS update_music_items_updated_at ON music_items;
CREATE TRIGGER update_music_items_updated_at BEFORE UPDATE
    ON music_items FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_videos_updated_at ON videos;
CREATE TRIGGER update_videos_updated_at BEFORE UPDATE
    ON videos FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_writing_pieces_updated_at ON writing_pieces;
CREATE TRIGGER update_writing_pieces_updated_at BEFORE UPDATE
    ON writing_pieces FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_research_papers_updated_at ON research_papers;
CREATE TRIGGER update_research_papers_updated_at BEFORE UPDATE
    ON research_papers FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_research_citations_updated_at ON research_citations;
CREATE TRIGGER update_research_citations_updated_at BEFORE UPDATE
    ON research_citations FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_social_posts_updated_at ON social_posts;
CREATE TRIGGER update_social_posts_updated_at BEFORE UPDATE
    ON social_posts FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_messages_updated_at ON messages;
CREATE TRIGGER update_messages_updated_at BEFORE UPDATE
    ON messages FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_gifts_updated_at ON gifts;
CREATE TRIGGER update_gifts_updated_at BEFORE UPDATE
    ON gifts FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_commission_inquiries_updated_at ON commission_inquiries;
CREATE TRIGGER update_commission_inquiries_updated_at BEFORE UPDATE
    ON commission_inquiries FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
