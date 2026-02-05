# Contact Messages Repository

## Purpose
This repository tracks all messages received through the TalkToBriiite widget on the midnightLaundry website.

## Database Table: `messages`

Messages are stored in the Supabase `messages` table with the following structure:

### Schema
```sql
Table: messages
- id (uuid, primary key)
- created_at (timestamp)
- name (text) - Sender's name
- email (text) - Sender's email
- message (text) - Message content
- is_read (boolean) - Message read status
```

## Features

### User-Facing (TalkToBriiiteWidget)
- **Location**: Floating widget on homepage (bottom-right corner)
- **Component**: `src/components/widgets/TalkToBriiiteWidget.tsx`
- **Functionality**:
  - Users can send direct messages
  - Required fields: name, email, message
  - Messages saved to Supabase `messages` table
  - Success confirmation after submission

### Admin-Facing (AdminMessagesManager)
- **Location**: Admin Dashboard → Messages section
- **Component**: `src/components/admin/AdminMessagesManager.tsx`
- **Functionality**:
  - View all received messages
  - Sort by date (newest first)
  - Mark messages as read
  - Delete messages
  - Filter unread messages
  - Display sender info (name, email, timestamp)

## Access & Security

### Public Access (Widget)
- Anyone can submit messages via the TalkToBriiiteWidget
- No authentication required for sending messages
- RLS policy allows INSERT for anonymous users

### Admin Access (Dashboard)
- View/manage messages requires admin authentication
- Protected by admin login system
- RLS policies restrict SELECT/UPDATE/DELETE to authenticated admins

## Message Workflow

1. **User Submission**
   - User fills out TalkToBriiiteWidget form
   - Message inserted into `messages` table
   - `is_read` defaults to `false`

2. **Admin Review**
   - Admin logs into dashboard
   - Navigates to Messages section
   - Views all messages (unread highlighted)
   - Can mark as read or delete

3. **Message States**
   - `is_read: false` - New/unread message
   - `is_read: true` - Reviewed message
   - Deleted - Removed from database

## Database Queries

### Insert New Message (Public)
```typescript
await supabase
  .from('messages')
  .insert([{
    name: formData.name,
    email: formData.email,
    message: formData.message
  }]);
```

### Fetch All Messages (Admin)
```typescript
const { data } = await supabase
  .from('messages')
  .select('*')
  .order('created_at', { ascending: false });
```

### Mark as Read (Admin)
```typescript
await supabase
  .from('messages')
  .update({ is_read: true })
  .eq('id', messageId);
```

### Delete Message (Admin)
```typescript
await supabase
  .from('messages')
  .delete()
  .eq('id', messageId);
```

## Migration File
- **Location**: `supabase/migrations/20260127142439_create_midnight_laundry_schema.sql`
- Contains table creation and RLS policies for messages

## Future Enhancements
- Email notifications for new messages
- Message reply functionality
- Archive system for old messages
- Search/filter by sender or content
- Export messages to CSV
- Mark multiple as read/delete bulk actions
- Message categories/tags
- Spam filtering
