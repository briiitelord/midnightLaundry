/*
  # Fix RLS policies for admin deletes

  Ensures public role can insert/update/delete commission_inquiries and messages.
  Also cleans up any missing public policies.
*/

-- commission_inquiries
DROP POLICY IF EXISTS "Anyone can insert commission_inquiries" ON commission_inquiries;
DROP POLICY IF EXISTS "Anyone can update commission_inquiries" ON commission_inquiries;
DROP POLICY IF EXISTS "Anyone can delete commission_inquiries" ON commission_inquiries;

CREATE POLICY "Anyone can insert commission_inquiries"
  ON commission_inquiries FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Anyone can update commission_inquiries"
  ON commission_inquiries FOR UPDATE
  TO public
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Anyone can delete commission_inquiries"
  ON commission_inquiries FOR DELETE
  TO public
  USING (true);

-- messages
DROP POLICY IF EXISTS "Anyone can insert messages" ON messages;
DROP POLICY IF EXISTS "Anyone can update messages" ON messages;
DROP POLICY IF EXISTS "Anyone can delete messages" ON messages;

CREATE POLICY "Anyone can insert messages"
  ON messages FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Anyone can update messages"
  ON messages FOR UPDATE
  TO public
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Anyone can delete messages"
  ON messages FOR DELETE
  TO public
  USING (true);

-- gifts
DROP POLICY IF EXISTS "Anyone can insert gifts" ON gifts;
DROP POLICY IF EXISTS "Anyone can update gifts" ON gifts;
DROP POLICY IF EXISTS "Anyone can delete gifts" ON gifts;

CREATE POLICY "Anyone can insert gifts"
  ON gifts FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Anyone can update gifts"
  ON gifts FOR UPDATE
  TO public
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Anyone can delete gifts"
  ON gifts FOR DELETE
  TO public
  USING (true);
