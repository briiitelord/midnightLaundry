/*
  # midnightLaundry Platform Database Schema

  ## Overview
  Complete database schema for briiite's multimedia artist portfolio platform.
  
  ## Tables Created

  1. **music_items**
     - Stores all music content including releases, mixes, beats, and podcast clips
     - Fields: id, title, description, category, embed_url, file_url, price, is_exclusive, created_at
     - Categories: new_release, mix, beat_for_sale, podcast_clip, exclusive_release

  2. **videos**
     - Stores video content with SFW/NSFW classification
     - Fields: id, title, description, content_rating, embed_url, file_url, is_paygated, paygate_url, created_at
     - Content ratings: sfw, nsfw

  3. **writing_pieces**
     - Stores written works across different categories
     - Fields: id, title, category, content, file_url, excerpt, created_at
     - Categories: poetry, short_story, extended_work

  4. **research_papers**
     - Stores research PDFs and academic works
     - Fields: id, title, description, file_url, created_at

  5. **research_citations**
     - Citations linked to research papers
     - Fields: id, research_paper_id, citation_text, order_index

  6. **social_posts**
     - Aggregated social media posts
     - Fields: id, platform, content, post_url, platform_logo_url, posted_at, created_at

  7. **messages**
     - User messages from TalkToBriiite widget
     - Fields: id, sender_name, sender_email, message_content, created_at, is_read

  8. **gifts**
     - Gift/tip transactions
     - Fields: id, sender_name, sender_email, amount, payment_method, message, created_at

  9. **commission_inquiries**
     - Custom work commission requests
     - Fields: id, name, email, inquiry_type, project_description, budget_range, created_at, status

  ## Security
  - RLS enabled on all tables
  - Public read access for content tables
  - Authenticated-only write access for admin operations
*/

-- Music Items Table
CREATE TABLE IF NOT EXISTS music_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text DEFAULT '',
  category text NOT NULL CHECK (category IN ('new_release', 'mix', 'beat_for_sale', 'podcast_clip', 'exclusive_release')),
  embed_url text,
  file_url text,
  price decimal(10,2) DEFAULT 0,
  is_exclusive boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE music_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view music items"
  ON music_items FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Authenticated users can insert music items"
  ON music_items FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update music items"
  ON music_items FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete music items"
  ON music_items FOR DELETE
  TO authenticated
  USING (true);

-- Videos Table
CREATE TABLE IF NOT EXISTS videos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text DEFAULT '',
  content_rating text NOT NULL CHECK (content_rating IN ('sfw', 'nsfw')),
  embed_url text,
  file_url text,
  is_paygated boolean DEFAULT false,
  paygate_url text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE videos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view SFW videos"
  ON videos FOR SELECT
  TO public
  USING (content_rating = 'sfw');

CREATE POLICY "Anyone can view NSFW videos"
  ON videos FOR SELECT
  TO public
  USING (content_rating = 'nsfw');

CREATE POLICY "Authenticated users can insert videos"
  ON videos FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update videos"
  ON videos FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete videos"
  ON videos FOR DELETE
  TO authenticated
  USING (true);

-- Writing Pieces Table
CREATE TABLE IF NOT EXISTS writing_pieces (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  category text NOT NULL CHECK (category IN ('poetry', 'short_story', 'extended_work')),
  content text DEFAULT '',
  file_url text,
  excerpt text DEFAULT '',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE writing_pieces ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view writing pieces"
  ON writing_pieces FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Authenticated users can insert writing pieces"
  ON writing_pieces FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update writing pieces"
  ON writing_pieces FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete writing pieces"
  ON writing_pieces FOR DELETE
  TO authenticated
  USING (true);

-- Research Papers Table
CREATE TABLE IF NOT EXISTS research_papers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text DEFAULT '',
  file_url text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE research_papers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view research papers"
  ON research_papers FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Authenticated users can insert research papers"
  ON research_papers FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update research papers"
  ON research_papers FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete research papers"
  ON research_papers FOR DELETE
  TO authenticated
  USING (true);

-- Research Citations Table
CREATE TABLE IF NOT EXISTS research_citations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  research_paper_id uuid NOT NULL REFERENCES research_papers(id) ON DELETE CASCADE,
  citation_text text NOT NULL,
  order_index integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE research_citations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view research citations"
  ON research_citations FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Authenticated users can insert citations"
  ON research_citations FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update citations"
  ON research_citations FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete citations"
  ON research_citations FOR DELETE
  TO authenticated
  USING (true);

-- Social Posts Table
CREATE TABLE IF NOT EXISTS social_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  platform text NOT NULL,
  content text NOT NULL,
  post_url text NOT NULL,
  platform_logo_url text DEFAULT '',
  posted_at timestamptz NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE social_posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view social posts"
  ON social_posts FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Authenticated users can insert social posts"
  ON social_posts FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update social posts"
  ON social_posts FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete social posts"
  ON social_posts FOR DELETE
  TO authenticated
  USING (true);

-- Messages Table
CREATE TABLE IF NOT EXISTS messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_name text NOT NULL,
  sender_email text NOT NULL,
  message_content text NOT NULL,
  created_at timestamptz DEFAULT now(),
  is_read boolean DEFAULT false
);

ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view messages"
  ON messages FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Anyone can insert messages"
  ON messages FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update messages"
  ON messages FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete messages"
  ON messages FOR DELETE
  TO authenticated
  USING (true);

-- Gifts Table
CREATE TABLE IF NOT EXISTS gifts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_name text DEFAULT 'Anonymous',
  sender_email text DEFAULT '',
  amount decimal(10,2) NOT NULL,
  payment_method text DEFAULT '',
  message text DEFAULT '',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE gifts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view gifts"
  ON gifts FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Anyone can insert gifts"
  ON gifts FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update gifts"
  ON gifts FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete gifts"
  ON gifts FOR DELETE
  TO authenticated
  USING (true);

-- Commission Inquiries Table
CREATE TABLE IF NOT EXISTS commission_inquiries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  inquiry_type text NOT NULL CHECK (inquiry_type IN ('personal', 'business_licensing', 'creative_pursuit')),
  project_description text NOT NULL,
  budget_range text DEFAULT '',
  created_at timestamptz DEFAULT now(),
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'reviewed', 'accepted', 'declined'))
);

ALTER TABLE commission_inquiries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view inquiries"
  ON commission_inquiries FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Anyone can insert inquiries"
  ON commission_inquiries FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update inquiries"
  ON commission_inquiries FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete inquiries"
  ON commission_inquiries FOR DELETE
  TO authenticated
  USING (true);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_music_category ON music_items(category);
CREATE INDEX IF NOT EXISTS idx_video_rating ON videos(content_rating);
CREATE INDEX IF NOT EXISTS idx_writing_category ON writing_pieces(category);
CREATE INDEX IF NOT EXISTS idx_citations_paper ON research_citations(research_paper_id);
CREATE INDEX IF NOT EXISTS idx_social_posted_at ON social_posts(posted_at DESC);
CREATE INDEX IF NOT EXISTS idx_messages_created ON messages(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_gifts_created ON gifts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_inquiries_status ON commission_inquiries(status);