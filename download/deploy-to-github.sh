#!/bin/bash
# ClaimGuard Tort - Quick Deploy to GitHub
# Usage: ./deploy-to-github.sh YOUR_GITHUB_TOKEN

set -e

TOKEN="$1"
if [ -z "$TOKEN" ]; then
    echo "=== ClaimGuard Tort - Deploy to GitHub ==="
    echo ""
    echo "Usage: ./deploy-to-github.sh YOUR_GITHUB_PERSONAL_ACCESS_TOKEN"
    echo ""
    echo "How to get a token:"
    echo "  1. Go to https://github.com/settings/tokens"
    echo "  2. Click 'Generate new token (classic)'"
    echo "  3. Select 'repo' scope only"
    echo "  4. Copy and paste it here"
    echo ""
    echo "Railway will auto-deploy within 2 minutes after push."
    exit 1
fi

REPO="devil8381-cyber/claimguardtort"
echo "Pushing fixed code to github.com/${REPO}..."

# Create a temp directory for clean push
TMPDIR=$(mktemp -d)
cd "$TMPDIR"

# Initialize fresh repo
git init
git remote add origin "https://x-access-token:${TOKEN}@github.com/${REPO}.git"

# Copy the fixed source files
cp -r /path/to/claimguardtort-ready/* .
cp /path/to/claimguardtort-ready/.gitignore .

# Commit and force push
git add -A
git commit -m "Fix: Runtime TypeError crash + 8 bug fixes + security patches"
git push origin main --force

echo ""
echo "SUCCESS! Code pushed to GitHub."
echo "Railway will auto-deploy within 2 minutes."
echo "Check: https://claimguardtort-production.up.railway.app"
rm -rf "$TMPDIR"
