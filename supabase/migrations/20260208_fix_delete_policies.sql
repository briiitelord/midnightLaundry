/*
  # Fix DELETE policies for all tables
  
  Ensures that the public role can actually DELETE rows (not just update deleted_at).
  The previous policies were for UPDATE operations (soft delete), now we need DELETE.
*/

-- music_items
DROP POLICY IF EXISTS "Anyone can delete music items" ON music_items;
CREATE POLICY "Anyone can delete music items"
  ON music_items FOR DELETE
  TO public
  USING (true);

-- videos
DROP POLICY IF EXISTS "Anyone can delete videos" ON videos;
CREATE POLICY "Anyone can delete videos"
  ON videos FOR DELETE
  TO public
  USING (true);

-- writing_pieces
DROP POLICY IF EXISTS "Anyone can delete writing_pieces" ON writing_pieces;
CREATE POLICY "Anyone can delete writing_pieces"
  ON writing_pieces FOR DELETE
  TO public
  USING (true);

-- research_papers
DROP POLICY IF EXISTS "Anyone can delete research_papers" ON research_papers;
CREATE POLICY "Anyone can delete research_papers"
  ON research_papers FOR DELETE
  TO public
  USING (true);

-- social_posts
DROP POLICY IF EXISTS "Anyone can delete social_posts" ON social_posts;
CREATE POLICY "Anyone can delete social_posts"
  ON social_posts FOR DELETE
  TO public
  USING (true);

-- legal_documents
DROP POLICY IF EXISTS "Anyone can delete legal_documents" ON legal_documents;
CREATE POLICY "Anyone can delete legal_documents"
  ON legal_documents FOR DELETE
  TO public
  USING (true);

-- messages
DROP POLICY IF EXISTS "Anyone can delete messages" ON messages;
CREATE POLICY "Anyone can delete messages"
  ON messages FOR DELETE
  TO public
  USING (true);

-- gifts
DROP POLICY IF EXISTS "Anyone can delete gifts" ON gifts;
CREATE POLICY "Anyone can delete gifts"
  ON gifts FOR DELETE
  TO public
  USING (true);

-- commission_inquiries
DROP POLICY IF EXISTS "Anyone can delete commission_inquiries" ON commission_inquiries;
CREATE POLICY "Anyone can delete commission_inquiries"
  ON commission_inquiries FOR DELETE
  TO public
  USING (true);
