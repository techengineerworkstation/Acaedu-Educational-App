# ═══════════════════════════════════════════════════════════════
# Acaedu - Supabase + Email Setup Guide
# ═══════════════════════════════════════════════════════════════

## 1. Install Supabase CLI
npm install -g supabase
# or
pnpm add -g supabase

## 2. Login to Supabase
supabase login

## 3. Link your project (get project ref from Supabase dashboard URL)
supabase link --project-ref YOUR_PROJECT_REF

## 4. Run database schema
# Option A - via Supabase dashboard (recommended):
# Go to supabase.com/dashboard → SQL Editor
# Copy contents of supabase_schema.sql → Paste → Run

# Option B - via CLI:
supabase db push

## 5. Set environment variables in .env file
cat > .env << EOF
VITE_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_RESEND_API_KEY=re_your-resend-key
EOF

## 6. Deploy Email Edge Function (for Resend integration)
# Get Resend API key from resend.com
supabase secrets set RESEND_API_KEY=re_your-resend-key
supabase functions deploy send-email

## 7. Test locally
npm run dev

## 8. Build for production
npm run build

## 9. Deploy to Vercel
npm i -g vercel
vercel --prod

## 10. Deploy to Render (via GitHub push)
git add . && git commit -m "Deploy" && git push origin master

# ═══════════════════════════════════════════════════════════════
# Resend Email Setup (for email notifications)
# ═══════════════════════════════════════════════════════════════
# 1. Sign up at resend.com
# 2. Get your API key from resend.com/api-keys
# 3. Add domain acaedu.sbs in resend.com/domains
# 4. Add DNS records (SPF, DKIM, MX) in Hostinger
# 5. Set VITE_RESEND_API_KEY in .env

# ═══════════════════════════════════════════════════════════════
# Paystack Setup (for payments)
# ═══════════════════════════════════════════════════════════════
# 1. Sign up at paystack.com
# 2. Get public key from dashboard.paystack.com/#/settings/developer
# 3. Set VITE_PAYSTACK_PUBLIC_KEY in .env

# ═══════════════════════════════════════════════════════════════
# PayPal Setup (for payments)
# ═══════════════════════════════════════════════════════════════
# 1. Sign up at developer.paypal.com
# 2. Create app in REST API apps
# 3. Get Client ID from app settings
# 4. Set VITE_PAYPAL_CLIENT_ID in .env
