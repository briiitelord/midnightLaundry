# midnightLaundry - briiite's Creative Universe

A comprehensive multimedia artist portfolio platform for briiite, featuring music, videos, writing, research, and social media integration.

## Features

### Music Section
- **New Release**: Embedded and playable links to music from streaming platforms
- **Mixes**: Collection of DJ mixes and audio compilations
- **Beats 4 Sale**: Purchasable beat library with pricing
- **briiite be spittin'**: Organized audiocast clips
- **Commission Work**: Custom inquiry form for personal, business licensing, or creative pursuits

### Video Section
- **SFW Videos**: Public video content with embedded players
- **NSFW Videos**: Age-gated content with verification system
- Support for both embedded links and direct file uploads
- Paygate integration for premium content

### Writing Section
- **Poetry**: Poetic works with beautiful typography
- **Short Stories**: Narrative fiction pieces
- **Extended Works**: Long-form literary content
- Full-screen reading experience with downloadable files

### Research Section
- Academic papers and research documents
- PDF viewer integration
- Citations management with expandable reference lists
- Support for multiple file hosting services

### Social Feed
- Real-time aggregation of posts from X, Facebook, Instagram, and other platforms
- Normalized display with platform logos
- Timestamped updates
- Direct links to original posts

### Interactive Widgets
- **TalkToBriiite**: Floating messaging widget for direct communication
- **Gift Bucket**: Support system accepting multiple payment methods (PayPal, CashApp, Venmo, Crypto)

## Technology Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS with custom speckle marble theme
- **Database**: Supabase (PostgreSQL)
- **Icons**: Lucide React
- **Fonts**: Inter (primary), JetBrains Mono (monospace)

## Design Theme

- **Colors**: Speckle black and white with off-whites and light grays
- **Accents**: Forest green (emerald) and gold/amber
- **Typography**: Bold yet clinical aesthetic
- **Pattern**: Subtle speckle/marble texture throughout

## Database Schema

The application uses Supabase with the following tables:
- `music_items`: Music content across all categories
- `videos`: Video content with SFW/NSFW classification
- `writing_pieces`: Literary works by category
- `research_papers`: Academic documents
- `research_citations`: Citation references
- `social_posts`: Aggregated social media content
- `messages`: User messages from TalkToBriiite widget
- `gifts`: Gift/tip transactions
- `commission_inquiries`: Custom work requests

## Setup Instructions

1. Install dependencies:
   ```bash
   npm install
   ```

2. Configure Supabase:
   - Update `.env` with your Supabase credentials:
     ```
     VITE_SUPABASE_URL=https://knpgxbafbxwrzsgetlnm.supabase.co
     VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
     ```

3. Run development server:
   ```bash
   npm run dev
   ```

4. Build for production:
   ```bash
   npm run build
   ```

## Future Enhancements

- AWS S3 integration for file uploads
- Payment gateway integration (Stripe/PayPal)
- Social media API integration for automated post fetching
- Admin dashboard for content management
- Advanced age verification with geolocation
- Analytics and engagement tracking

## Security Features

- Row Level Security (RLS) policies on all tables
- Age verification for NSFW content
- Secure message handling
- Input validation and sanitization

## License

Copyright © briiite. All rights reserved.
