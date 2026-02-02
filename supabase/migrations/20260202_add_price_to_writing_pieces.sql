/*
  # Add pricing support to writing_pieces

  Adds `price` column to writing_pieces table to enable PayPal paygate for downloads.
  - price = 0: free download (no PayPal required)
  - price > 0: PayPal paygate required before download
*/

ALTER TABLE writing_pieces ADD COLUMN price decimal(10, 2) DEFAULT 0;
