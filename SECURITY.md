# Security Setup Guide

## 🔐 Before Making Repository Public

This guide helps you properly configure security settings before deploying or sharing this repository.

## Required Environment Variables

This application requires environment variables to be set. **Never commit the `.env` file to version control.**

### 1. Create Your `.env` File

Copy the example file and configure it:
```bash
cp .env.example .env
```

### 2. Configure Supabase

Get your Supabase credentials:
1. Go to your [Supabase Dashboard](https://app.supabase.com)
2. Select your project
3. Navigate to Settings → API
4. Copy the following values:
   - **Project URL** → `VITE_SUPABASE_URL`
   - **Anon/Public Key** → `VITE_SUPABASE_ANON_KEY`

Update your `.env`:
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here
```

### 3. Configure Admin Password

The admin password uses encryption for security in the client-side code.

**Step 1: Generate a Strong Secret Key**
```env
VITE_ADMIN_SECRET_KEY=a_very_long_random_string_at_least_32_characters_long
```

**Step 2: Encrypt Your Password**

Option A - Using Browser Console:
1. Run the dev server: `npm run dev`
2. Open browser console (F12)
3. Paste this code:
```javascript
import { encryptPassword } from './src/utils/encryption.ts';
console.log(encryptPassword('your_secure_password_here'));
```

Option B - Using Node.js:
1. Create a temporary script:
```javascript
// temp-encrypt.js
import { encryptPassword } from './src/utils/encryption.js';
console.log(encryptPassword('your_secure_password_here'));
```
2. Run: `node temp-encrypt.js`
3. Delete the temp file after use

**Step 3: Set the Encrypted Password**
```env
VITE_ENCRYPTED_ADMIN_PASSWORD=the_encrypted_output_from_step2
```

## Security Checklist

Before making your repository public, verify:

- [ ] `.env` file is in `.gitignore` (already configured)
- [ ] No hardcoded API keys, passwords, or secrets in code
- [ ] `.env.example` exists with placeholder values only
- [ ] Supabase Row Level Security (RLS) policies are enabled
- [ ] Admin password is encrypted and secret key is strong
- [ ] No real Supabase URLs in README or documentation
- [ ] All documentation references use placeholders for sensitive data

## What's Safe to Commit

✅ **Safe:**
- `.env.example` with placeholder values
- Code that reads from `import.meta.env.*`
- Documentation with generic setup instructions
- Supabase migration files (SQL schema definitions)

❌ **Never Commit:**
- `.env` file with real values
- Hardcoded API keys or passwords
- Hardcoded Supabase URLs or keys
- Unencrypted admin credentials

## Production Deployment

When deploying to production:

1. **Use environment variables on your hosting platform**
   - Vercel: Project Settings → Environment Variables
   - Netlify: Site Settings → Environment Variables
   - Others: Refer to your platform's documentation

2. **Rotate secrets regularly**
   - Change admin passwords every 90 days
   - Rotate API keys if compromised
   - Update secret keys periodically

3. **Monitor access**
   - Review Supabase logs regularly
   - Set up alerts for suspicious activity
   - Use Supabase's built-in monitoring tools

## Reporting Security Issues

If you discover a security vulnerability, please email: [your-security-email@example.com]

**Do not** create public GitHub issues for security vulnerabilities.

---

**Last Updated**: February 4, 2026
