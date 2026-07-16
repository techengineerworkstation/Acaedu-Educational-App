# ═══════════════════════════════════════════════════════════════
# Acaedu - Vercel Deployment Guide
# ═══════════════════════════════════════════════════════════════

## 1. Connect GitHub to Vercel
1. Go to vercel.com → Add New Project
2. Import `techengineerworkstation/Acaedu-Educational-App`
3. Framework Preset: Vite
4. Build Command: `npm run build`
5. Output Directory: `dist`

## 2. Set Environment Variables in Vercel Dashboard
Go to Project → Settings → Environment Variables:

| Key | Value |
|-----|-------|
| VITE_SUPABASE_URL | https://YOUR_PROJECT.supabase.co |
| VITE_SUPABASE_ANON_KEY | your-anon-key |
| VITE_RESEND_API_KEY | re_your-resend-key |
| VITE_PAYSTACK_PUBLIC_KEY | pk_test_xxx |
| VITE_PAYPAL_CLIENT_ID | your-paypal-client-id |

## 3. Custom Domain
1. Go to Project → Settings → Domains
2. Add `acaedu.sbs`
3. Add DNS records in Hostinger:
   - Type: A, Name: @, Value: 76.76.21.21
   - Type: CNAME, Name: www, Value: cname.vercel-dns.com

## 4. Deploy
```bash
# Option A: Auto-deploy on push (recommended)
git push origin master

# Option B: Manual deploy via CLI
npm i -g vercel
vercel --prod
```

## 5. Supabase Setup
```bash
# Install Supabase CLI
npm install -g supabase

# Login
supabase login

# Link project
supabase link --project-ref YOUR_PROJECT_REF

# Push database schema
supabase db push

# Deploy Edge Functions (for email)
supabase functions deploy send-email
supabase secrets set RESEND_API_KEY=re_xxx
```
