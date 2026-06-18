#!/bin/bash
# ═══════════════════════════════════════════════════════════════
# Acaedu - Supabase Database Setup Script
# Run this after creating your Supabase project
# ═══════════════════════════════════════════════════════════════

echo "═══════════════════════════════════════════════════════════"
echo "  Acaedu - Supabase Database Setup"
echo "═══════════════════════════════════════════════════════════"
echo ""

# Step 1: Install Supabase CLI
echo "[1/5] Installing Supabase CLI..."
npm install -g supabase
echo "✅ Supabase CLI installed"
echo ""

# Step 2: Login to Supabase
echo "[2/5] Login to Supabase..."
echo "Run: supabase login"
echo "(This opens your browser for authentication)"
echo ""

# Step 3: Link your project
echo "[3/5] Link your Supabase project..."
echo "Run: supabase link --project-ref YOUR_PROJECT_REF"
echo "(Get your project ref from Supabase dashboard URL: supabase.com/dashboard/project/YOUR_PROJECT_REF)"
echo ""

# Step 4: Run the database schema
echo "[4/5] Running database schema..."
echo "Option A - Via Supabase SQL Editor (recommended):"
echo "  1. Go to supabase.com/dashboard → SQL Editor"
echo "  2. Copy contents of supabase_schema.sql"
echo "  3. Paste and run"
echo ""
echo "Option B - Via CLI:"
echo "  supabase db push"
echo ""

# Step 5: Set environment variables
echo "[5/5] Set environment variables in your deployment:"
echo "  VITE_SUPABASE_URL=https://YOUR_PROJECT.supabase.co"
echo "  VITE_SUPABASE_ANON_KEY=your-anon-key"
echo ""

echo "═══════════════════════════════════════════════════════════"
echo "  Setup complete! Your app is ready to deploy."
echo "═══════════════════════════════════════════════════════════"
