# GitHub Secrets Setup - Quick Reference

## 🚀 Quick Start

### Step 1: Navigate to Secrets
```
Your Repo → Settings → Secrets and variables → Actions → New repository secret
```

### Step 2: Add Required Secrets

Copy and paste each secret from your local `.env` file:

#### 🔑 Secret #1: VITE_SUPABASE_URL
```
Name: VITE_SUPABASE_URL
Value: https://xxxxxxxxxxxxx.supabase.co
```
📍 Get from: Supabase Dashboard → Project Settings → API → Project URL

#### 🔑 Secret #2: VITE_SUPABASE_ANON_KEY
```
Name: VITE_SUPABASE_ANON_KEY
Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```
📍 Get from: Supabase Dashboard → Project Settings → API → Project API keys → anon public

#### 🔑 Secret #3: VITE_ADMIN_SECRET_KEY
```
Name: VITE_ADMIN_SECRET_KEY
Value: [Generate a strong 32+ character random string]
```
💡 Generate using:
```bash
# On macOS/Linux:
openssl rand -base64 32

# Or online: https://www.random.org/strings/
# Settings: 32 characters, alphanumeric + symbols
```

#### 🔑 Secret #4: VITE_ENCRYPTED_ADMIN_PASSWORD
```
Name: VITE_ENCRYPTED_ADMIN_PASSWORD
Value: [Encrypted output from encryption script]
```
💡 See DEPLOYMENT_GUIDE.md section "Generate Encrypted Admin Password"

### Step 3: Trigger Deployment

**Option A: Push to main branch**
```bash
git add .
git commit -m "Add deployment configuration"
git push origin main
```

**Option B: Manual trigger**
```
Your Repo → Actions → Deploy to GitHub Pages → Run workflow
```

### Step 4: Enable GitHub Pages

```
Settings → Pages → Source: GitHub Actions → Save
```

## ✅ Verification Checklist

- [ ] All 4 required secrets added in GitHub
- [ ] Secret names match exactly (case-sensitive)
- [ ] `.env` file is in `.gitignore`
- [ ] Local `.env` file NOT committed to git
- [ ] GitHub Actions workflow file exists: `.github/workflows/deploy.yml`
- [ ] GitHub Pages source set to "GitHub Actions"
- [ ] First deployment workflow completed successfully

## 🎯 Your Site URL

After successful deployment:
```
https://[your-github-username].github.io/midnightLaundry/
```

## 🆘 Troubleshooting

### Build fails in GitHub Actions
1. Check Actions tab for error messages
2. Verify all 4 secrets are set correctly
3. Check secret names match exactly

### Admin login fails
1. Verify VITE_ADMIN_SECRET_KEY matches the one used for encryption
2. Re-encrypt password using same secret key
3. Update VITE_ENCRYPTED_ADMIN_PASSWORD secret

### Supabase not connecting
1. Check VITE_SUPABASE_URL is correct
2. Verify VITE_SUPABASE_ANON_KEY is the anon public key (not service role)
3. Ensure Supabase project is active

## 📚 Full Documentation

- [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md) - Complete deployment instructions
- [SECURITY.md](SECURITY.md) - Security best practices
- [.env.example](.env.example) - Environment variable template
