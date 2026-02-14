# Security & Sensitive Data Management

## 🔐 Files in .gitignore (Protected from Git)

### Environment Variables ⚠️ CRITICAL
These files contain **sensitive credentials and secrets** and must NEVER be committed to version control:

```
.env                    # Main environment file (used in development)
.env.local              # Local overrides
.env.production         # Production-specific secrets
.env.development        # Development-specific secrets
.env.*.local            # Any local environment variations
```

**Contains:**
- `VITE_ADMIN_SECRET_KEY` - Encryption key for admin password
- `VITE_ENCRYPTED_ADMIN_PASSWORD` - Encrypted admin password
- `VITE_SUPABASE_URL` - Supabase project URL
- `VITE_SUPABASE_ANON_KEY` - Supabase anonymous key

**Why Protected:**
- Exposed secrets allow unauthorized admin access
- Supabase keys can be abused for database manipulation
- Encryption keys compromise password security

### Test Files with Hardcoded Secrets 🧪
```
test-password.html                  # Browser password test (has SECRET_KEY)
scripts/test-password-decrypt.mjs   # Node.js password test (has SECRET_KEY)
```

**Contains:**
- Hardcoded `SECRET_KEY` for testing
- Hardcoded `ENCRYPTED_PASSWORD`
- Test logic that reveals decryption methods

**Why Protected:**
- Contains actual production credentials for demonstration
- Reveals encryption/decryption implementation details
- Should not be exposed in public repositories

### Large Binary Files 📁
```
public/forest-texture.jpg          # Large texture file (size optimization)
```

**Why Protected:**
- File size too large for git (bloats repository)
- Better served from CDN or Supabase Storage
- Can be added manually to hosting platform

---

## ✅ Safe Files (NOT in .gitignore)

These files are safe to commit and contain no sensitive data:

### Test Files (Safe)
```
test-filename-sanitize.html        # Tests filename sanitization only
```
- No credentials
- No API keys
- Only contains sanitization logic

### Documentation (Safe)
```
*.md files                         # All markdown documentation
ADMIN_PASSWORD_AND_UPLOAD_FIX.md  # Documents process but not actual secrets
SITE_BUILD_DYNAMIC_IMAGES_FIX.md  # Technical documentation
```
- No working credentials (passwords shown are for example/explanation)
- No actual secret keys
- Safe to share publicly

### Source Code (Safe)
```
src/**/*.tsx                       # All TypeScript/React components
src/**/*.ts                        # All utility files
```
- Uses `import.meta.env.*` to reference environment variables
- No hardcoded secrets in source
- Safe to open source

---

## 🚨 What Happens If Secrets Are Exposed?

### If `.env` is committed to git:

**Immediate Actions Required:**
1. ✅ **Rotate admin password** immediately
   ```bash
   # Generate new encrypted password
   node scripts/encrypt-admin-password.mjs
   ```

2. ✅ **Change Supabase keys**
   - Go to Supabase Dashboard → Settings → API
   - Reset `anon` key (public key)
   - Update `.env` with new key
   - Redeploy application

3. ✅ **Generate new SECRET_KEY**
   ```bash
   # Generate random 32-byte base64 key
   node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
   ```

4. ✅ **Review git history**
   ```bash
   # Remove file from git history (use with caution)
   git filter-branch --force --index-filter \
     'git rm --cached --ignore-unmatch .env' \
     --prune-empty --tag-name-filter cat -- --all
   ```

5. ✅ **Force push** (if history was cleaned)
   ```bash
   git push --force --all
   ```

### If test files with secrets are exposed:

**Lower Risk but Still Important:**
1. ✅ Rotate the admin password shown in the test files
2. ✅ Generate new SECRET_KEY
3. ✅ Update production environment variables
4. ⚠️ Test files reveal encryption method - consider additional security layers

---

## 🛡️ Security Best Practices

### 1. Environment Variables
```bash
# ✅ DO: Use environment variables
const apiKey = import.meta.env.VITE_API_KEY;

# ❌ DON'T: Hardcode secrets
const apiKey = "abc123def456";
```

### 2. .env.example Template
Always maintain a `.env.example` file with placeholder values:
```bash
# ✅ Good - no actual secrets
VITE_ADMIN_SECRET_KEY=your_secret_key_here
VITE_ENCRYPTED_ADMIN_PASSWORD=your_encrypted_password_here
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here
```

### 3. Git Hooks (Pre-commit Check)
Create `.git/hooks/pre-commit`:
```bash
#!/bin/bash
# Check if .env file is staged
if git diff --cached --name-only | grep -E "^\.env$"; then
  echo "❌ ERROR: .env file is about to be committed!"
  echo "This file contains sensitive credentials."
  exit 1
fi
```

### 4. Secret Scanning
Use GitHub's secret scanning or tools like:
- `git-secrets` - AWS
- `truffleHog` - General secret detection
- `gitleaks` - Git secret scanning

---

## 📋 Security Checklist

### Before Deployment
- [ ] `.env` is in `.gitignore`
- [ ] No secrets in source code
- [ ] All test files with credentials in `.gitignore`
- [ ] Environment variables set in hosting platform
- [ ] Admin password is strong and unique
- [ ] SECRET_KEY is cryptographically random (32+ bytes)

### In Production
- [ ] HTTPS enabled on all domains
- [ ] Supabase RLS (Row Level Security) enabled
- [ ] Admin dashboard uses secure password authentication
- [ ] Rate limiting on login attempts (recommended)
- [ ] Regular password rotation (every 90 days)
- [ ] Monitor Supabase logs for suspicious activity

### Regular Maintenance
- [ ] Review git history for accidentally committed secrets
- [ ] Update dependencies for security patches
- [ ] Rotate credentials periodically
- [ ] Audit admin access logs
- [ ] Keep `.gitignore` updated

---

## 🔑 Current Protected Credentials

### Admin Dashboard
- **Password:** Encrypted in `.env` as `VITE_ENCRYPTED_ADMIN_PASSWORD`
- **Secret Key:** Stored in `.env` as `VITE_ADMIN_SECRET_KEY`
- **Access URL:** `https://midnightlaundry247.com/admin.html`

### Supabase
- **Project URL:** In `.env` as `VITE_SUPABASE_URL`
- **Anon Key:** In `.env` as `VITE_SUPABASE_ANON_KEY` (public, but still managed)
- **Service Role Key:** ⚠️ NEVER expose client-side! Server-only!

---

## 📞 Security Incident Response

If credentials are compromised:

1. **Immediately:** Rotate all affected credentials
2. **Within 1 hour:** Update production environment variables
3. **Within 24 hours:** Review access logs for unauthorized activity
4. **Within 1 week:** Implement additional security measures if needed

**Emergency Contacts:**
- Supabase Support: https://supabase.com/support
- GitHub Security: security@github.com (for exposed secrets in public repos)

---

## ✅ Status: SECURED

Your sensitive data is now properly protected:
- ✅ `.env` files in `.gitignore`
- ✅ Test files with secrets in `.gitignore`
- ✅ No hardcoded credentials in source code
- ✅ Documentation updated
- ✅ Security best practices documented

### Deployment Requirements

**After Adding These Security Changes:**
1. ✅ Commit changes: `git add . && git commit -m "Add security protections"`
2. ✅ Push to remote: `git push origin main`
3. ✅ **YES, you MUST redeploy** - code files changed
4. ✅ Set environment variables in hosting platform (Vercel/Netlify/etc.)

**Future Image/Data Changes via Admin:**
- ❌ No code changes needed
- ❌ No rebuild needed
- ❌ No redeployment needed
- ✅ Just upload via admin dashboard

**Remember:** Never commit secrets, always use environment variables, and rotate credentials regularly!
