# Custom Domain & HTTPS Configuration Guide

## 📋 Complete DNS Configuration

### Step 1: Configure DNS Records at Your DNS Provider

Go to your domain registrar's DNS management panel and add these exact records:

#### For www.midnightlaundry.com (CNAME Record)
```
Type:  CNAME
Name:  www
Value: briiitelord.github.io
TTL:   3600 (or Auto)
```

#### For midnightlaundry.com (A Records - GitHub Pages IPs)
```
Type:  A
Name:  @ (or leave blank for apex/root domain)
Value: 185.199.108.153
TTL:   3600

Type:  A  
Name:  @ (or leave blank)
Value: 185.199.109.153
TTL:   3600

Type:  A
Name:  @ (or leave blank)
Value: 185.199.110.153
TTL:   3600

Type:  A
Name:  @ (or leave blank)
Value: 185.199.111.153
TTL:   3600
```

### Step 2: CNAME File Configuration ✅

The `public/CNAME` file has been created with:
```
www.midnightlaundry.com
```

This file will be automatically copied to your `dist/` folder during build and deployed with your site.

### Step 3: GitHub Pages Configuration

1. **Wait for DNS propagation** (can take 5 minutes to 48 hours)
   - Check status: `dig www.midnightlaundry.com`
   - Or use: https://dnschecker.org

2. **Enable Custom Domain in GitHub**:
   - Go to: https://github.com/briiitelord/midnightLaundry/settings/pages
   - Under "Custom domain", enter: `www.midnightlaundry.com`
   - Click **Save**

3. **Wait for DNS verification** (GitHub will check your DNS records)

4. **Enable HTTPS** (after DNS is verified):
   - Check the box: **"Enforce HTTPS"**
   - GitHub will automatically provision a free SSL certificate from Let's Encrypt

## 🔒 HTTPS Configuration

### Automatic HTTPS (Recommended)
GitHub Pages provides **free automatic HTTPS** via Let's Encrypt:

1. ✅ DNS configured correctly (Step 1)
2. ✅ CNAME file in repository (Step 2)
3. ✅ Custom domain set in GitHub Pages settings (Step 3)
4. ✅ "Enforce HTTPS" enabled in GitHub Pages settings
5. ✅ SSL certificate automatically provisioned and renewed

### HTTPS Features You Get:
- 🔐 Free SSL/TLS certificate
- 🔄 Auto-renewal (no manual intervention)
- ✅ Modern encryption (TLS 1.2+)
- 🚀 HTTP/2 support
- ⚡ CDN with HTTPS

### Force HTTPS Redirects
Once "Enforce HTTPS" is enabled, GitHub automatically:
- Redirects `http://` → `https://`
- Redirects `midnightlaundry.com` → `www.midnightlaundry.com`
- Serves all content over HTTPS

## 🔍 Verification Steps

### 1. Check DNS Configuration
```bash
# Check CNAME record
dig www.midnightlaundry.com CNAME

# Expected output:
# www.midnightlaundry.com. 3600 IN CNAME briiitelord.github.io.

# Check A records
dig midnightlaundry.com A

# Expected output: All 4 GitHub IP addresses
```

### 2. Check HTTPS Certificate
Once DNS is propagated and HTTPS is enabled:
```bash
curl -I https://www.midnightlaundry.com
```

Expected: `HTTP/2 200` with valid SSL certificate

### 3. Test in Browser
- Visit: https://www.midnightlaundry.com
- Check for 🔒 padlock icon in address bar
- No certificate warnings

## ⚙️ Build Configuration

The GitHub Actions workflow already handles the CNAME file correctly:
- `public/CNAME` is automatically included in the build
- Vite copies everything from `public/` to `dist/`
- GitHub Pages deployment includes the CNAME file

## 🚨 Troubleshooting

### DNS Not Propagating
```bash
# Clear local DNS cache (macOS)
sudo dscacheutil -flushcache; sudo killall -HUP mDNSResponder

# Check global propagation
# Visit: https://dnschecker.org
# Enter: www.midnightlaundry.com
```

### "CNAME already exists" Error
- Another repository is using this domain
- Remove domain from other GitHub Pages sites first

### Certificate Not Provisioning
1. Ensure DNS is fully propagated (wait 24-48 hours)
2. Remove and re-add custom domain in GitHub settings
3. Check that "Enforce HTTPS" is checked

### Mixed Content Warnings
If you get HTTPS but see warnings:
- Check all external resources use `https://` URLs
- Update any `http://` links in your code to `https://`
- Check Supabase URLs are using HTTPS

## 📝 DNS Provider Specific Instructions

### GoDaddy
1. Login → My Products → DNS
2. Add records as shown above
3. Remove any existing conflicting records

### Namecheap
1. Login → Domain List → Manage → Advanced DNS
2. Add records as shown above
3. Set TTL to Automatic

### Cloudflare
1. Login → Select domain → DNS
2. Add records as shown above
3. Set Proxy status: DNS only (grey cloud)
4. SSL/TLS mode: Full

### Google Domains
1. Login → My domains → DNS
2. Custom resource records
3. Add records as shown above

## ✅ Final Checklist

Before deployment:
- [ ] DNS CNAME record created (`www` → `briiitelord.github.io`)
- [ ] DNS A records created (4 GitHub IPs)
- [ ] `public/CNAME` file committed to repository
- [ ] DNS propagated (check with dig/nslookup)
- [ ] Custom domain added in GitHub Pages settings
- [ ] DNS verification passed (green checkmark in GitHub)
- [ ] "Enforce HTTPS" enabled
- [ ] SSL certificate active (may take a few minutes)
- [ ] Site accessible via https://www.midnightlaundry.com
- [ ] GitHub Secrets configured (for environment variables)

## 🔄 Deployment Workflow

With DNS and HTTPS configured:

1. **Push to main branch**
   ```bash
   git push origin main
   ```

2. **GitHub Actions runs automatically**
   - Builds project with environment variables
   - Creates `dist/` folder with CNAME file
   - Deploys to GitHub Pages

3. **Site updates** at https://www.midnightlaundry.com

4. **HTTPS automatically enforced**
   - All HTTP requests redirect to HTTPS
   - Secure connection guaranteed

## 📚 Additional Resources

- [GitHub Pages Custom Domains](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site)
- [GitHub Pages HTTPS](https://docs.github.com/en/pages/getting-started-with-github-pages/securing-your-github-pages-site-with-https)
- [DNS Configuration](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site)
