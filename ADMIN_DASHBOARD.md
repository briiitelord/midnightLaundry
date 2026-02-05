# Admin Dashboard - Web Manager Documentation

## Overview

The Admin Dashboard is a secure content management interface for briiite to manage all portfolio content, communications, and transactions. Access is protected by an admin password.

## Quick Start

### Accessing the Admin Dashboard

1. Click the **Settings** icon (⚙️) in the top-right corner of the website header
2. You'll be redirected to the login page
3. Enter the admin password: `briiite2025`
4. You'll gain access to the full admin dashboard

**Alternative**: Directly navigate to `/#/admin` in the URL bar

### Password Management

⚠️ **Important**: Configure a secure admin password before deploying to production!

**To configure the password:**
1. Set `VITE_ADMIN_SECRET_KEY` in your `.env` file with a strong secret key
2. Use the encryption utility to generate an encrypted password:
   - In browser console or Node.js: `encryptPassword('your-secure-password')`
3. Set `VITE_ENCRYPTED_ADMIN_PASSWORD` in your `.env` file with the output
4. Rebuild and redeploy

## Dashboard Sections

### 1. **Music Manager**

Manage your music catalog including new releases, mixes, beats, podcasts, and exclusive content.

**Features:**
- ✅ Add new music tracks
- ✏️ Edit existing tracks (title, category, price, exclusivity status)
- 🗑️ Soft-delete tracks (recoverable)
- 🔍 Search by title or category
- 💰 Set pricing for beats and exclusive releases
- 🔗 Add file URLs and embed URLs (SoundCloud, YouTube, etc.)

**Fields:**
- **Title** (required): Track name
- **Category**: New Release, Mix, Beat for Sale, Podcast Clip, Exclusive Release
- **Description**: Optional metadata
- **Price**: Decimal (0.00 for free)
- **File URL**: Direct link to audio file
- **Embed URL**: SoundCloud, YouTube embed link
- **Exclusive Release**: Toggle for paywalled content

### 2. **Video Manager**

Manage video content organized by content rating and paywall status.

**Features:**
- ✅ Add new videos
- ✏️ Edit video details
- 🗑️ Soft-delete videos
- 🔍 Search by title
- 💰 Mark videos as paygated

**Fields:**
- **Title** (required)
- **Content Rating**: SFW or NSFW
- **Description**: Video details
- **Embed URL**: YouTube, Vimeo embed
- **File URL**: Direct video file link
- **Paygated**: Toggle to require payment
- **Paygate URL**: Payment processing link (if paygated)

### 3. **Writing Manager**

Manage poetry, short stories, and extended written works.

**Features:**
- ✅ Add new writings
- ✏️ Edit existing pieces
- 🗑️ Soft-delete pieces
- 🔍 Search by title/category
- 📝 Store full content in database
- 📄 Link to external documents

**Fields:**
- **Title** (required)
- **Category**: Poetry, Short Story, Extended Work
- **Excerpt**: Summary preview
- **Full Content**: Complete text (supports line breaks)
- **File URL**: PDF or document link

### 4. **Research Manager**

Manage academic papers, research articles, and citations.

**Features:**
- ✅ Add research papers
- ✏️ Edit paper details
- 🗑️ Soft-delete papers
- 🔍 Search by title

**Fields:**
- **Title** (required)
- **Description**: Abstract or summary
- **File URL** (required): Link to PDF or document

### 5. **Social Posts Manager**

Track social media presence across platforms.

**Features:**
- ✅ Add social posts
- ✏️ Edit post details
- 🗑️ Delete posts
- 🔍 Search by platform or content

**Fields:**
- **Platform**: Twitter/X, Instagram, TikTok, YouTube, Other
- **Content** (required): Post text
- **Post URL** (required): Link to actual post
- **Logo URL**: Platform logo image link
- **Posted Date**: When content was published

### 6. **Commission Inquiries**

Review incoming commission and custom work requests from clients.

**Features:**
- 👁️ View full inquiry details
- 📧 Email client directly from dashboard
- 🗑️ Delete inquiries

**Information Captured:**
- Client name & email
- Inquiry type (Personal, Business, Creative Pursuit)
- Project description
- Budget range
- Submission date/time

### 7. **Direct Messages**

Manage incoming messages from your audience via the contact widget.

**Features:**
- 👁️ View full message content
- 📧 Reply via email
- 🗑️ Delete messages
- 🔍 Search by sender

**Information Captured:**
- Sender name & email
- Message content
- Reception date/time

### 8. **Gifts & Donations**

Track tips and donations from supporters. Includes total revenue calculation.

**Features:**
- 👁️ View gift details
- 💰 See donation breakdown
- 🗑️ Delete records
- 📊 Total received summary

**Information Displayed:**
- Donor name (or "Anonymous")
- Amount
- Payment method
- Donor message
- Receipt date

## Content Workflow

### Publishing New Music

1. Navigate to **Music Manager**
2. Click **Add Music**
3. Fill in required fields:
   - Title
   - Category
   - Price
4. Optional: Add description, file URL, embed URL
5. Toggle "Exclusive Release" if paywalled
6. Click **Create**
7. Music appears immediately on site

### Updating Existing Content

1. Find the item in the list (use search if needed)
2. Click the **Edit** icon (pencil)
3. Modify fields
4. Click **Update**
5. Changes appear immediately

### Deleting Content

⚠️ **Soft Delete**: Deleted content is marked as deleted but remains in database for recovery

1. Click the **Delete** icon (trash) on any item
2. Confirm deletion
3. Item removed from public view

### Best Practices

✅ **Do:**
- Use descriptive titles
- Include external links for media files
- Set accurate pricing
- Organize by category
- Regularly archive old content

❌ **Don't:**
- Leave required fields blank
- Use unclear descriptions
- Forget to update prices
- Upload files without backup
- Share admin credentials

## Security

### Password Protection

- Admin dashboard requires password authentication
- Session persists in browser local storage
- Logout clears session and requires re-authentication

### Data Access

- All data flows through Supabase with Row Level Security
- Soft deletes preserve data integrity
- No permanent data loss without database access

### Recommendations

1. ✅ Use a strong, unique admin password
2. ✅ Change password quarterly
3. ✅ Don't share admin credentials
4. ✅ Logout after sessions
5. ✅ Keep backups of important content

## Troubleshooting

### Login Issues

**Problem**: Password doesn't work
- **Solution**: Verify exact password (case-sensitive). If you changed it, use new password.

**Problem**: Can't access dashboard
- **Solution**: Try `/#/admin` in URL bar instead of settings button

### Content Not Appearing

**Problem**: Added content but don't see it on site
- **Solution**: Check that `deleted_at` is NULL and content isn't soft-deleted. Refresh browser.

**Problem**: Edit changes don't appear
- **Solution**: Clear browser cache (Cmd+Shift+R on Mac, Ctrl+Shift+R on Windows)

### Form Errors

**Problem**: "Can't submit form"
- **Solution**: Ensure all required fields (*) are filled. Check for invalid URLs.

## Database Schema Reference

### Tables Managed

| Table | Purpose | Records Type |
|-------|---------|--------------|
| `music_items` | Audio tracks | Creatable/Editable |
| `videos` | Video content | Creatable/Editable |
| `writing_pieces` | Written works | Creatable/Editable |
| `research_papers` | Academic work | Creatable/Editable |
| `social_posts` | Social media posts | Creatable/Editable |
| `commission_inquiries` | Work requests | View-only |
| `messages` | Inbox messages | View-only |
| `gifts` | Donations received | View-only |

### Key Fields

All tables include automatic timestamps:
- `created_at`: When record was added
- `updated_at`: When record was last modified
- `deleted_at`: NULL unless soft-deleted

## Advanced Features

### Batch Operations

Currently not available. Single-item operations only.

### Import/Export

Not yet implemented. Feature roadmap item.

### Analytics

Not yet available. Track total gifts shown for reference.

### Content Scheduling

Not yet available. All content published immediately.

## Future Enhancements

🔜 **Planned Features:**
- Batch upload for music/videos
- Content scheduling
- Analytics dashboard
- Email notifications for inquiries
- Content approval workflow
- Backup/restore tools
- Audit logs
- Multi-user support

## Support

For issues or feature requests:
1. Document the problem with screenshots
2. Check troubleshooting section above
3. Review Supabase dashboard for database errors
4. Check browser console (F12) for JavaScript errors

---

**Last Updated**: January 31, 2026
**Version**: 1.0
**Admin Password**: Configured via environment variables (see Setup section)
