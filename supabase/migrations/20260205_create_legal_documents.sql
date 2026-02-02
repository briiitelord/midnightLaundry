/*
  # Create legal_documents table

  Stores legal documents (Public License Notice, Limited Creative Use License, etc.)
*/

CREATE TABLE legal_documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  title text NOT NULL,
  content text NOT NULL,
  deleted_at timestamp,
  created_at timestamp DEFAULT now(),
  updated_at timestamp DEFAULT now()
);

-- RLS policy: Allow anyone to read
ALTER TABLE legal_documents ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read legal documents"
  ON legal_documents FOR SELECT
  TO public
  USING (true);

-- RLS policy: Allow public insert/update (admin)
CREATE POLICY "Anyone can update legal documents"
  ON legal_documents FOR UPDATE
  TO public
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Anyone can insert legal documents"
  ON legal_documents FOR INSERT
  TO public
  WITH CHECK (true);

-- Insert default documents
INSERT INTO legal_documents (slug, title, content) VALUES
  ('public-license-notice', 'Public License Notice', 'This is a placeholder for the Public License Notice. Update this document in the Admin Dashboard.'),
  ('limited-creative-use-license', 'Limited Creative Use License', 'This is a placeholder for the Limited Creative Use License. Update this document in the Admin Dashboard.')
ON CONFLICT (slug) DO NOTHING;
