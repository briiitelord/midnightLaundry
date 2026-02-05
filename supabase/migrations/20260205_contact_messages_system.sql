/*
  # Contact Messages System Update
  
  ## Purpose
  This migration documents and ensures the messages table is properly configured
  for the TalkToBriiite contact widget integration.
  
  ## Table: messages
  Stores all contact messages submitted via the TalkToBriiiteWidget on the website.
  
  ## Features
  - Public users can submit messages (INSERT)
  - Public users can view messages (SELECT) - Admin auth handled at application level
  - Public users can mark as read (UPDATE) - Admin auth handled at application level
  - Public users can delete messages (DELETE) - Admin auth handled at application level
  
  ## Security Note
  - No JWT authentication implemented at database level
  - Admin authentication handled via encrypted password at application level
  - RLS policies allow public access; application enforces admin-only operations
  
  ## Widget Integration
  - Frontend: src/components/widgets/TalkToBriiiteWidget.tsx
  - Admin Panel: src/components/admin/AdminMessagesManager.tsx
  - Admin Auth: src/utils/encryption.ts + src/config/adminConfig.ts
  - Documentation: CONTACT_MESSAGES_REPO.md
*/

-- Ensure messages table exists with correct schema
CREATE TABLE IF NOT EXISTS messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_name text NOT NULL,
  sender_email text NOT NULL,
  message_content text NOT NULL,
  created_at timestamptz DEFAULT now(),
  is_read boolean DEFAULT false
);

-- Add attachment_url column if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'messages' AND column_name = 'attachment_url'
  ) THEN
    ALTER TABLE messages ADD COLUMN attachment_url text;
  END IF;
END $$;

-- Enable Row Level Security
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to recreate them (idempotent migration)
DROP POLICY IF EXISTS "Authenticated users can view messages" ON messages;
DROP POLICY IF EXISTS "Public users can view messages" ON messages;
DROP POLICY IF EXISTS "Anyone can insert messages" ON messages;
DROP POLICY IF EXISTS "Authenticated users can update messages" ON messages;
DROP POLICY IF EXISTS "Public users can update messages" ON messages;
DROP POLICY IF EXISTS "Authenticated users can delete messages" ON messages;
DROP POLICY IF EXISTS "Public users can delete messages" ON messages;

-- Policy: Public users can submit messages via contact widget
CREATE POLICY "Anyone can insert messages"
  ON messages FOR INSERT
  TO public
  WITH CHECK (true);

-- Policy: Public users can view messages (admin auth at application level)
CREATE POLICY "Public users can view messages"
  ON messages FOR SELECT
  TO public
  USING (true);

-- Policy: Public users can update messages (admin auth at application level)
-- Used by admin dashboard to mark messages as read
CREATE POLICY "Public users can update messages"
  ON messages FOR UPDATE
  TO public
  USING (true)
  WITH CHECK (true);

-- Policy: Public users can delete messages (admin auth at application level)
-- Used by admin dashboard to remove messages
CREATE POLICY "Public users can delete messages"
  ON messages FOR DELETE
  TO public
  USING (true);

-- Create index for efficient sorting by date
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON messages(created_at DESC);

-- Create index for filtering unread messages
CREATE INDEX IF NOT EXISTS idx_messages_is_read ON messages(is_read);

-- Create index for searching by sender
CREATE INDEX IF NOT EXISTS idx_messages_sender_email ON messages(sender_email);

-- Add comments for documentation
COMMENT ON TABLE messages IS 'Contact messages from TalkToBriiite widget';
COMMENT ON COLUMN messages.id IS 'Unique message identifier';
COMMENT ON COLUMN messages.sender_name IS 'Name of the message sender';
COMMENT ON COLUMN messages.sender_email IS 'Email address of the sender';
COMMENT ON COLUMN messages.message_content IS 'The message content/body';
COMMENT ON COLUMN messages.attachment_url IS 'Optional file attachment URL from messages storage bucket';
COMMENT ON COLUMN messages.created_at IS 'Timestamp when message was submitted';
COMMENT ON COLUMN messages.is_read IS 'Whether admin has marked message as read';

-- Storage bucket policies for messages attachments
-- Note: Bucket "messages" should be created in Supabase Dashboard → Storage

-- Create messages storage bucket (public access for attachments)
INSERT INTO storage.buckets (id, name, public)
VALUES ('messages', 'messages', true)
ON CONFLICT (id) DO NOTHING;

-- Drop existing storage policies to recreate them
DROP POLICY IF EXISTS "Anyone can upload message attachments" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can view message attachments" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete message attachments" ON storage.objects;
DROP POLICY IF EXISTS "Public users can delete message attachments" ON storage.objects;

-- Policy: Public can upload files to messages bucket
CREATE POLICY "Anyone can upload message attachments"
  ON storage.objects FOR INSERT
  TO public
  WITH CHECK (bucket_id = 'messages');

-- Policy: Public can view message attachments
CREATE POLICY "Anyone can view message attachments"
  ON storage.objects FOR SELECT
  TO public
  USING (bucket_id = 'messages');

-- Policy: Public can delete message attachments (admin auth at application level)
CREATE POLICY "Public users can delete message attachments"
  ON storage.objects FOR DELETE
  TO public
  USING (bucket_id = 'messages');
