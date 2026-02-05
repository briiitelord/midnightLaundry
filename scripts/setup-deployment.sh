#!/bin/bash

# GitHub Pages Deployment Setup Script
# This script helps you prepare for GitHub Pages deployment

set -e

echo ""
echo "🚀 GitHub Pages Deployment Setup"
echo "=================================="
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Check if .env exists
if [ -f ".env" ]; then
    echo -e "${GREEN}✓${NC} Found .env file"
else
    echo -e "${YELLOW}⚠${NC} No .env file found"
    read -p "Do you want to create one from .env.example? (y/n): " create_env
    if [ "$create_env" = "y" ]; then
        cp .env.example .env
        echo -e "${GREEN}✓${NC} Created .env file from template"
        echo -e "${YELLOW}⚠${NC} Please edit .env with your credentials"
    fi
fi

echo ""
echo "📋 Checklist for GitHub Pages Deployment"
echo "========================================="
echo ""

# 1. Check if workflow exists
if [ -f ".github/workflows/deploy.yml" ]; then
    echo -e "${GREEN}✓${NC} GitHub Actions workflow file exists"
else
    echo -e "${RED}✗${NC} Missing .github/workflows/deploy.yml"
fi

# 2. Check if .env is in .gitignore
if grep -q "^\.env$" .gitignore 2>/dev/null || grep -q "^\.env$" .gitignore 2>/dev/null; then
    echo -e "${GREEN}✓${NC} .env is in .gitignore"
else
    echo -e "${YELLOW}⚠${NC} .env might not be properly excluded in .gitignore"
fi

# 3. Check if dist is in .gitignore
if grep -q "^dist" .gitignore 2>/dev/null; then
    echo -e "${GREEN}✓${NC} dist/ is in .gitignore (build artifacts excluded)"
else
    echo -e "${YELLOW}⚠${NC} Consider adding dist/ to .gitignore"
fi

# 4. Check for required files
required_files=("package.json" "vite.config.ts" "index.html")
for file in "${required_files[@]}"; do
    if [ -f "$file" ]; then
        echo -e "${GREEN}✓${NC} Found $file"
    else
        echo -e "${RED}✗${NC} Missing $file"
    fi
done

echo ""
echo "🔐 Next Steps for Secure Deployment"
echo "===================================="
echo ""
echo "1. Generate encrypted admin password:"
echo -e "   ${BLUE}node scripts/encrypt-admin-password.mjs${NC}"
echo ""
echo "2. Add GitHub Secrets (Settings → Secrets and variables → Actions):"
echo "   - VITE_SUPABASE_URL"
echo "   - VITE_SUPABASE_ANON_KEY"
echo "   - VITE_ADMIN_SECRET_KEY"
echo "   - VITE_ENCRYPTED_ADMIN_PASSWORD"
echo ""
echo "3. Enable GitHub Pages:"
echo "   Settings → Pages → Source: GitHub Actions"
echo ""
echo "4. Push to trigger deployment:"
echo -e "   ${BLUE}git push origin main${NC}"
echo ""
echo "📚 For detailed instructions, see:"
echo "   - GITHUB_SECRETS_SETUP.md (Quick reference)"
echo "   - DEPLOYMENT_GUIDE.md (Complete guide)"
echo ""
