# Web Manager Workflows - midnightLaundry

## Overview

This document outlines the complete web manager workflows for maintaining the midnightLaundry portfolio. These are step-by-step procedures for common content management tasks.

---

## Workflow 1: Publishing New Music

**Purpose**: Add a new track to one of the music categories
**Time**: ~5 minutes
**Frequency**: Weekly or as needed

### Steps

1. **Access Admin Dashboard**
   - Click Settings icon (⚙️) in top-right header
   - Enter password: `briiite2025`
   - Click "Music" in sidebar

2. **Click "Add Music" Button**
   - Blue button in top-right of Music Manager section
   - Form modal will appear

3. **Fill Required Fields**
   - **Title**: Track name (e.g., "Midnight Reflections")
   - **Category**: Select from dropdown:
     - New Release: Latest albums/singles
     - Mix: DJ mixes and remixes
     - Beat for Sale: Selling instrumentals
     - Podcast Clip: Audio excerpts
     - Exclusive Release: Paywalled content

4. **Add Optional Details**
   - **Description**: Track notes, credits, lyrics info
   - **File URL**: Direct link to Supabase storage or streaming
   - **Embed URL**: SoundCloud, YouTube, or Spotify embed code
   - **Price**: If selling beats ($0 for free)

5. **Set Exclusivity (if applicable)**
   - Check "Exclusive Release" box if this is paywalled content
   - Set price if not free

6. **Submit**
   - Click "Create" button
   - Form clears, music appears in list
   - Immediately visible on public site under category

### Tips
- ✅ Use clear, descriptive titles
- ✅ Upload files to Supabase storage first for fast delivery
- ✅ Test embeds before saving
- ✅ Group related tracks in one category

### Example

```
Title: "Cosmic Journey (Sunset Mix)"
Category: Mix
Description: A 45-minute ambient mix perfect for study or meditation
File URL: https://cdn.supabase.co/music/2026-01/cosmic-journey.mp3
Embed URL: https://open.spotify.com/...
Price: 0.00
Exclusive: ☐ (unchecked)
```

---

## Workflow 2: Managing Video Content

**Purpose**: Add and organize video portfolio content
**Time**: ~10 minutes per video
**Frequency**: As content is created

### Steps

1. **Access Videos Manager**
   - In Admin Dashboard, click "Videos" in sidebar

2. **Click "Add Video"**
   - Fill in video details

3. **Key Fields**
   - **Title**: Video name
   - **Content Rating**: 
     - SFW: Family-friendly
     - NSFW: Explicit/adult content
   - **Description**: Plot, details, context
   - **Embed URL**: YouTube player code or Vimeo embed
   - **Is Paygated**: Toggle if video requires purchase

4. **Paygated Videos**
   - If toggled ON, provide:
     - **Paygate URL**: Link to payment processor (Gumroad, Patreon, etc.)

5. **Submit**
   - Click "Create"
   - Video appears on site with correct rating

### Content Rating Best Practices

| Rating | Content Type | Example |
|--------|-------------|---------|
| SFW | Music videos, tutorials, behind-the-scenes | "Recording Studio Tour" |
| NSFW | Explicit music, adult performance, mature themes | "Uncensored Performance 18+" |

---

## Workflow 3: Publishing Written Works

**Purpose**: Share poetry, stories, and essays
**Time**: ~7 minutes per piece
**Frequency**: As writing is completed

### Steps

1. **Access Writing Manager**
   - Click "Writing" in admin sidebar

2. **Click "Add Writing"**
   - New form appears

3. **Required Information**
   - **Title**: Piece name
   - **Category**: 
     - Poetry: Poems and verse
     - Short Story: Fiction under 5000 words
     - Extended Work: Novels, long-form essays
   - **Full Content**: Complete text (paste from document)

4. **Optional Details**
   - **Excerpt**: 50-100 word preview for listings
   - **File URL**: Link to PDF or document version

5. **Publish**
   - Click "Create"
   - Content appears on Writing section
   - Visitors can read directly or download PDF

### Content Preparation Tips

✅ **Best Practices**:
- Copy text from Google Docs to preserve formatting
- Keep excerpts engaging and concise
- Include line breaks in poetry (system preserves them)
- Provide PDF for longer works
- Use consistent capitalization and punctuation

---

## Workflow 4: Managing Research & Academic Work

**Purpose**: Showcase research papers and academic contributions
**Time**: ~5 minutes per paper
**Frequency**: As research is completed

### Steps

1. **Access Research Manager**
   - Click "Research" in admin sidebar

2. **Click "Add Paper"**
   - Research form appears

3. **Complete Required Fields**
   - **Title**: Paper title
   - **File URL**: Link to PDF on Supabase or ResearchGate

4. **Add Context**
   - **Description**: Abstract or summary (what the paper is about)

5. **Submit**
   - Click "Create"
   - Paper appears in Research section with download link

### Academic Content Tips

- 📄 Upload PDF to Supabase storage (not external links)
- 📝 Write clear abstracts (100-200 words)
- 🔗 Include citations or DOI where applicable
- 📅 Papers stay permanently accessible

---

## Workflow 5: Social Media Synchronization

**Purpose**: Keep track of cross-platform social presence
**Time**: ~2 minutes per post
**Frequency**: After posting to social media

### Steps

1. **Access Social Posts Manager**
   - Click "Social Posts" in admin sidebar

2. **Add Post**
   - Click "Add Post" button
   - Form appears

3. **Fill Post Information**
   - **Platform**: Twitter/X, Instagram, TikTok, YouTube, Other
   - **Content**: Post text/caption
   - **Post URL**: Direct link to the post (copy from social media)
   - **Logo URL**: Optional platform logo image

4. **Track Date**
   - Posted date auto-fills with current date
   - Can edit to past date if backdating

5. **Submit**
   - Click "Create"
   - Post tracked in dashboard history

### Why Track Posts?

- 📊 Social media analytics in one place
- 🔍 Quick reference to past content
- 📱 Coordination across platforms
- 📈 Content calendar view

---

## Workflow 6: Handling Commission Inquiries

**Purpose**: Process custom work requests
**Time**: ~3 minutes per inquiry
**Frequency**: As inquiries arrive

### Steps

1. **Access Commissions Manager**
   - Click "Commissions" in admin sidebar
   - Inquiries appear as list

2. **Review Inquiry**
   - Click Eye icon to view full details
   - Read:
     - Client name & email
     - Type of work (Personal, Business, Creative)
     - Project description
     - Budget range
     - Submission date

3. **Respond to Client**
   - Click email to open email client
   - Compose response with:
     - Thank you for inquiry
     - Initial questions or clarifications needed
     - Proposed timeline
     - Your rate or package options
     - Next steps

4. **Archive Inquiry**
   - After responding, can delete from dashboard
   - (Or keep for reference)

### Commission Types

| Type | Typical Use |
|------|------------|
| **Personal** | Fans requesting custom work |
| **Business Licensing** | Brands licensing music/content |
| **Creative Pursuit** | Collaborations, features, remixes |

---

## Workflow 7: Managing Direct Messages

**Purpose**: Read and respond to audience messages
**Time**: ~2 minutes per message
**Frequency**: Daily or as notifications arrive

### Steps

1. **Access Messages Manager**
   - Click "Messages" in admin sidebar
   - Inbox displays newest first

2. **Read Message**
   - Click Eye icon to view full content
   - Modal shows:
     - Sender name
     - Email address
     - Full message content
     - Receive date/time

3. **Respond**
   - Click email to open email client
   - Compose and send response
   - Keep tone friendly and professional

4. **Organize**
   - Delete messages after responding
   - Or keep for email threading

### Message Types You Might Receive

- 💬 Fan appreciation
- ❓ General questions
- 🎵 Collaboration proposals
- 💼 Business inquiries
- 🐛 Bug reports / feedback

---

## Workflow 8: Tracking Donations & Gifts

**Purpose**: Monitor supporter contributions
**Time**: ~1 minute to review
**Frequency**: Daily/weekly

### Steps

1. **Access Gifts Manager**
   - Click "Gifts" in admin sidebar
   - Dashboard shows total received

2. **View Donation**
   - Click Eye icon on any donation
   - See:
     - Donor name (or "Anonymous")
     - Amount
     - Payment method
     - Donor message
     - Date received

3. **Send Thank You** (optional)
   - If donor provided email, send thank you message
   - Express gratitude
   - Offer special thanks in social media

4. **Track Totals**
   - Top of dashboard shows cumulative donations
   - Useful for setting fundraising goals

### Donation Acknowledgment Best Practices

✅ **Do:**
- Thank donors personally if possible
- Acknowledge donations in streams/posts
- Provide exclusive thanks/recognition
- Update goals regularly

---

## Workflow 9: Editing Existing Content

**Purpose**: Update published content details
**Time**: ~3 minutes
**Frequency**: As needed

### Steps (Same for all content types)

1. **Find Content**
   - Go to appropriate manager (Music, Videos, etc.)
   - Use search to find item
   - Or scroll through list

2. **Click Edit**
   - Pencil icon on right side of item
   - Edit form appears with current values

3. **Modify Fields**
   - Update any field needed
   - Leave others unchanged
   - Clear unwanted content

4. **Save Changes**
   - Click "Update" button
   - Changes apply immediately
   - Form closes, list refreshes

### Common Edits

- 🏷️ Correct title typos
- 💰 Adjust pricing
- 📝 Update descriptions
- 🔗 Fix broken URLs
- 🏷️ Recategorize content

---

## Workflow 10: Archiving & Deleting Content

**Purpose**: Remove outdated or unwanted content
**Time**: ~1 minute per item
**Frequency**: Monthly cleanup

### Steps

1. **Find Content to Delete**
   - Locate in appropriate manager
   - Search helps narrow list

2. **Click Delete**
   - Trash icon on right side
   - Confirmation dialog appears

3. **Confirm**
   - Click "OK" in confirmation
   - Content removed from public view
   - Preserved in database (soft delete)

### Soft Deletes Explained

- 🔒 Content marked as deleted but NOT removed
- 🔄 Can be recovered if needed
- 📊 Database remains intact
- ⚡ Doesn't affect performance

### Backup Strategy

```
Weekly:
- Export database from Supabase
- Save to local backup drive

Monthly:
- Archive old content descriptions
- Document what's no longer public
- Keep version history
```

---

## Quick Reference: Daily Tasks

### Morning Check-in (5 min)
```
□ Log into admin dashboard
□ Check new messages inbox
□ Review commission inquiries
□ Note any urgent responses needed
```

### Weekly Updates (30 min)
```
□ Add new music if available
□ Update social posts tracking
□ Review analytics/trends
□ Check all platforms synced
□ Respond to inquiries
```

### Monthly Maintenance (30 min)
```
□ Archive old content
□ Update pricing if needed
□ Review and update descriptions
□ Back up database
□ Check for broken links
□ Update portfolio summary stats
```

---

## Troubleshooting Common Issues

### Music Won't Upload

**Problem**: File uploads but doesn't appear
- ✅ Check file URL is accessible
- ✅ Verify file is in Supabase storage
- ✅ Refresh browser cache (Cmd+Shift+R)

### Embedded Videos Not Playing

**Problem**: Embed URL provided but video blank
- ✅ Verify it's an embed code, not page URL
- ✅ Check platform still hosts the video
- ✅ Test embed on different browser

### Changes Not Appearing

**Problem**: Edited content but changes don't show
- ✅ Refresh page or clear cache
- ✅ Check for error messages in form
- ✅ Verify all required fields filled
- ✅ Try in incognito/private window

### Can't Access Admin

**Problem**: Settings button doesn't work
- ✅ Try manual URL: `/#/admin`
- ✅ Verify you're using correct password
- ✅ Clear browser cookies and try again
- ✅ Try different browser

---

## Password Management

### Change Admin Password

⚠️ **Follow these steps AFTER initial setup:**

1. Open your code editor
2. Find `src/App.tsx`
3. Locate line: `const ADMIN_PASSWORD = 'briiite2025';`
4. Change to: `const ADMIN_PASSWORD = 'your-new-secure-password';`
5. Save file
6. Rebuild: `npm run build`
7. Deploy to production
8. You'll now use new password to login

### Password Requirements

✅ Strong passwords:
- 12+ characters
- Mix of uppercase, lowercase, numbers
- At least one special character (!@#$%^&*)
- No dictionary words
- No birth dates or personal info

❌ Weak passwords:
- "password123"
- Your name or social media handle
- Sequential numbers "12345"
- Dictionary words

---

## Performance Tips

### Optimize Image Files

```
Before uploading:
□ Compress images (TinyPNG.com)
□ Use WebP format when possible
□ Max dimensions: 1920x1080 for videos
□ Max file size: 50MB
```

### Fast Content Publishing

```
Pre-done setup:
□ Have descriptions written
□ Have files ready in Supabase
□ Have cover images prepared
□ Have tags/categories planned
```

### Batch Efficiency

```
□ Update multiple items in one session
□ Use copy/paste for similar descriptions
□ Prepare content calendar weekly
□ Batch upload during off-peak hours
```

---

## Summary

| Task | Access | Time | Frequency |
|------|--------|------|-----------|
| Add Music | Music Manager | 5 min | Weekly |
| Add Video | Video Manager | 10 min | Monthly |
| Add Writing | Writing Manager | 7 min | As written |
| Add Research | Research Manager | 5 min | As published |
| Track Posts | Social Manager | 2 min | After posting |
| Review Inquiries | Commissions | 3 min | As received |
| Read Messages | Messages | 2 min | Daily |
| Track Donations | Gifts | 1 min | Weekly |
| Edit Content | Any Manager | 3 min | As needed |
| Delete Content | Any Manager | 1 min | Monthly |

---

## Key Contacts

For issues or questions:

- **Tech Support**: Check documentation in `ADMIN_DASHBOARD.md`
- **Database Issues**: Supabase dashboard at `supabase.com`
- **Deployment**: Check GitHub Actions or CI/CD pipeline
- **Emergency**: Restore from latest backup

---

**Last Updated**: January 31, 2026
**Version**: 1.0
**Status**: Production Ready
