# Deployment Guide for GitHub Pages

This guide explains how to securely deploy your midnightLaundry application to GitHub Pages while keeping sensitive credentials safe.

## 🔐 Security Overview

**Important**: Your `.env` file is already in `.gitignore` and should NEVER be committed to the repository. Instead, we use **GitHub Secrets** to store sensitive data securely.

## 📋 Step-by-Step Deployment

### 1. Set Up GitHub Secrets

GitHub Secrets are encrypted environment variables that are only accessible during the build process and never exposed in your repository.

**To add secrets:**

1. Go to your GitHub repository: `https://github.com/yourusername/midnightLaundry`
2. Click **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret**
4. Add each of the following secrets:

#### Required Secrets:

| Secret Name | Description | Where to get it |
|------------|-------------|-----------------|
| `VITE_SUPABASE_URL` | Your Supabase project URL | Supabase Dashboard → Project Settings → API |
| `VITE_SUPABASE_ANON_KEY` | Your Supabase anonymous key | Supabase Dashboard → Project Settings → API |
| `VITE_ADMIN_SECRET_KEY` | Strong encryption key (min 32 chars) | Generate a secure random string |
| `VITE_ENCRYPTED_ADMIN_PASSWORD` | Your encrypted admin password | Use the encryption utility (see below) |

#### Optional Secrets (if using payment features):
- `VITE_STRIPE_PUBLIC_KEY`
- `VITE_PAYPAL_CLIENT_ID`

### 2. Generate Encrypted Admin Password

Before setting the `VITE_ENCRYPTED_ADMIN_PASSWORD` secret, you need to encrypt your desired admin password:

**Option A: Using the encryption utility locally**

```bash
# 1. Create a temporary .env file with your secret key
echo "VITE_ADMIN_SECRET_KEY=your_strong_secret_key_min_32_chars" > .env

# 2. Use the encryption utility script
node scripts/encrypt-admin-password.mjs

# 3. Follow the prompts to generate your encrypted password
# 4. Copy the output and add both secrets to GitHub
```

**Option B: Using browser console (less secure)**

You can also use the browser console while running the app in development mode, but make sure to delete browser history afterward.

### 3. Enable GitHub Pages

1. Go to **Settings** → **Pages**
2. Under **Source**, select **GitHub Actions**
3. Save the settings

### 4. Trigger Deployment

The deployment will automatically trigger when you:
- Push to the `main` branch
- Manually trigger it from **Actions** → **Deploy to GitHub Pages** → **Run workflow**

### 5. Verify Deployment

1. Go to **Actions** tab in your repository
2. Watch the deployment workflow complete
3. Your site will be available at: `https://yourusername.github.io/midnightLaundry/`

## 🔒 Security Best Practices

### ✅ DO:
- Use GitHub Secrets for all sensitive data
- Use strong, unique secret keys (minimum 32 characters)
- Rotate credentials periodically
- Review the `.gitignore` file regularly to ensure `.env` files are excluded
- Use the encrypted password for admin authentication

### ❌ DON'T:
- Never commit `.env` files to the repository
- Never hardcode credentials in your source code
- Never share your GitHub secrets publicly
- Never use production database credentials in development

## 🛠️ Local Development

For local development, use a `.env` file:

```bash
# Copy the example file
cp .env.example .env

# Edit .env with your local credentials
nano .env
```

Your `.env` file will be ignored by git and only used locally.

## 🔄 Updating Secrets

To update any secret:

1. Go to **Settings** → **Secrets and variables** → **Actions**
2. Click on the secret you want to update
3. Click **Update secret**
4. Enter the new value and save
5. Re-run the deployment workflow

## 🚨 Troubleshooting

### Build fails with "undefined" errors
- Check that all required secrets are set in GitHub
- Verify secret names match exactly (case-sensitive)
- Check the Actions log for specific missing variables

### Admin login not working
- Verify `VITE_ADMIN_SECRET_KEY` and `VITE_ENCRYPTED_ADMIN_PASSWORD` match
- Make sure you used the same secret key when encrypting the password
- Try re-encrypting the password with the correct secret key

### Supabase connection fails
- Verify `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are correct
- Check that your Supabase project is active
- Verify Row Level Security (RLS) policies are configured correctly

## 📚 Additional Resources

- [GitHub Secrets Documentation](https://docs.github.com/en/actions/security-guides/encrypted-secrets)
- [GitHub Pages Documentation](https://docs.github.com/en/pages)
- [Vite Environment Variables](https://vitejs.dev/guide/env-and-mode.html)
- See `SECURITY.md` for comprehensive security guidelines

## 🔐 Environment Variable Reference

All environment variables used in the application:

```bash
# Required
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_ADMIN_SECRET_KEY=your-secret-key-min-32-chars
VITE_ENCRYPTED_ADMIN_PASSWORD=encrypted-output

# Optional
VITE_STRIPE_PUBLIC_KEY=pk_test_...
VITE_PAYPAL_CLIENT_ID=your-client-id
```

These are injected at build time and baked into the static files, so they need to be set before building for production.
