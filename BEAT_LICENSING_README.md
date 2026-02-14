# Beat Licensing & Commission Code System

## Overview
The site now features a sophisticated beat licensing system for the "Beats 4 Sale" section, allowing purchasers to choose between different license types with corresponding pricing and benefits.

## Features Implemented

### 1. **Two License Types for Beats**

#### Single Use Creative License
- **Purpose**: Upload to DSP (Digital Service Providers) only
- **Restrictions**: No additional commercial use (sync licensing, film licensing, etc.)
- **Pricing**: Set per beat in admin dashboard
- **Field**: `license_single_use_price`

#### Master File License
- **Purpose**: Full creative and commercial use
- **Rights**: Producer and songwriting rights retained by briiite
- **Benefits**: Includes 3 free commission requests
- **Pricing**: Set per beat in admin dashboard
- **Field**: `license_master_file_price`
- **Bonus**: Auto-generates 8-digit commission code

### 2. **Commission Code System**

#### Code Generation
- Automatically generated when master file license is purchased
- 8-digit numeric code (e.g., `12345678`)
- Stored in `commission_codes` table with purchaser info
- Includes 3 free uses
- Expires after 1 year

#### Code Validation
- Commission page has dedicated code input section
- Real-time validation against database
- Shows remaining uses
- Prevents expired or depleted codes

#### Code Benefits
- Bypasses $222 commission deposit requirement
- Tracks usage count (decrements on each submission)
- Links to original beat purchase via `music_item_id`

### 3. **Purchase Flow**

#### For Regular Tracks
1. User clicks "Buy" on any track
2. Modal shows standard purchase with single price
3. Redirects to PayPal for payment

#### For Beats (beat_for_sale category)
1. User clicks "Buy" on a beat
2. Modal displays two license options (if configured):
   - Single Use Creative License with price
   - Master File License with price + bonus badge
3. User selects desired license
4. If Master File selected:
   - Must enter name and email
   - Code will be sent to email (future enhancement)
5. Redirects to PayPal for payment
6. If Master File purchased:
   - Shows success screen with 8-digit code
   - Displays clickable link to Commission page
   - Code is stored in database

### 4. **Commission Workflow**

#### With Commission Code
1. User goes to Commission Work page
2. Enters 8-digit code in purple banner at top
3. Code validates (green success or red error)
4. If valid:
   - Payment section is bypassed
   - Form becomes active
   - Submit button shows "Submit Free Commission (X remaining)"
5. On submission:
   - Code usage decremented
   - Inquiry saved with `is_free_commission: true`
   - Code tracked in `commission_code` field

#### Without Code (Standard)
1. User pays $222 deposit via PayPal
2. Once paid, form activates
3. Submits as paid commission inquiry

## Database Schema

### New Tables

#### `commission_codes`
```sql
- id (uuid, primary key)
- code (text, unique, indexed)
- music_item_id (uuid, references music_items)
- purchaser_email (text, indexed)
- purchaser_name (text)
- uses_remaining (integer, default 3)
- created_at (timestamptz)
- expires_at (timestamptz, default 1 year from creation)
- last_used_at (timestamptz)
```

### Updated Tables

#### `music_items`
Added columns:
- `license_single_use_price` (decimal)
- `license_master_file_price` (decimal)

#### `commission_inquiries`
Added columns:
- `commission_code` (text)
- `is_free_commission` (boolean)

## Admin Dashboard Updates

### Music Manager
- New licensing section for `beat_for_sale` category
- Two price input fields:
  - Single Use License Price
  - Master File License Price
- Amber-colored UI section with helpful descriptions
- Auto-hides for non-beat categories

### Future Enhancement: Commission Code Manager
Could add admin view to:
- See all issued codes
- Check usage statistics
- Manually expire or extend codes
- View which beats generated which codes

## User Experience Highlights

### Visual Indicators
- **Purple banner** on Commission page for code entry
- **Green success badge** when code validates
- **Amber badge** on Master File option showing "3 Free Commissions"
- **License descriptions** clearly explain restrictions
- **Radio button UI** for license selection

### Navigation
- Purchase confirmation links directly to Commission page
- Smooth scroll to commission section
- Commission page has unique `id="commission-section"`

### Form Validation
- 8-digit numeric code enforcement
- Real-time validation on blur/complete
- Clear error messages:
  - Invalid code
  - Expired code
  - Depleted uses
  - Invalid format

## Setup Instructions

### 1. Apply Database Migration
Run [SETUP_BEAT_LICENSING.sql](SETUP_BEAT_LICENSING.sql) in Supabase SQL Editor

This creates:
- New columns on `music_items`
- `commission_codes` table
- RLS policies
- Indexes
- Updates to `commission_inquiries`

### 2. Configure Beat Prices (Admin Dashboard)
1. Log into admin dashboard
2. Go to Music section
3. Edit or create beats (`beat_for_sale` category)
4. In the "Beat Licensing Options" section:
   - Set Single Use License Price (e.g., $25.00)
   - Set Master File License Price (e.g., $100.00)
5. Save

### 3. Test the Flow
1. Go to "Beats 4 Sale" section on site
2. Click "Buy" on a beat with licensing configured
3. Select Master File License
4. Enter test name/email
5. Note the 8-digit code shown
6. Navigate to Commission Work page
7. Enter the code and validate
8. Submit a free commission request

## Future Enhancements

### Email Integration
- Send code to purchaser email automatically
- Include instructions for using code
- Send reminder before expiration

### Code Management Dashboard
- Admin can view all codes
- See usage statistics
- Manually create codes for promotions
- Extend or expire codes

### Purchaser Portal
- Users can view their purchased licenses
- See remaining commission uses
- Download receipts
- Request license transfers

### Analytics
- Track most purchased license type
- Monitor commission code usage
- Revenue breakdown by license type

## Technical Notes

### Code Generation
- Uses `Math.random()` for 8-digit generation
- Range: 10000000 to 99999999
- Uniqueness enforced by database constraint

### Security
- RLS policies allow public read/update for validation
- Prevents code manipulation via `uses_remaining` check
- Expiration enforced at validation time

### Performance
- Indexed on `code` for fast lookups
- Indexed on `purchaser_email` for user searches
- Efficient single query validation

## Related Files

### Frontend
- `src/components/admin/AdminMusicManager.tsx` - Admin licensing config
- `src/components/widgets/PurchaseModal.tsx` - License selection UI
- `src/components/forms/CommissionForm.tsx` - Code validation
- `src/components/sections/MusicSection.tsx` - Beat display
- `src/types/database.types.ts` - TypeScript types

### Database
- `supabase/migrations/20260207_add_beat_licensing_and_commission_codes.sql` - Migration
- `SETUP_BEAT_LICENSING.sql` - Manual setup script

### Configuration
- License descriptions are hardcoded in modal
- Commission deposit amount: $222 (from `paymentConfig.ts`)
- Code length: 8 digits (hardcoded)
- Free commissions: 3 per code (hardcoded, can be changed in migration)
- Expiration: 1 year (can be changed in migration)
