# ═══════════════════════════════════════════════════════════════
# Acaedu - Supabase Setup Commands
# Copy and run these commands in your terminal
# ═══════════════════════════════════════════════════════════════

# 1. Install Supabase CLI
npm install -g supabase
# or
pnpm add -g supabase

# 2. Login to Supabase
supabase login

# 3. Link your project (get project ref from Supabase dashboard URL)
supabase link --project-ref YOUR_PROJECT_REF

# 4. Run database schema (Option A - via Supabase dashboard)
# Go to supabase.com/dashboard → SQL Editor
# Copy contents of supabase_schema.sql → Paste → Run

# 5. Run database schema (Option B - via CLI)
supabase db push

# 6. Set environment variables in .env file
echo "VITE_SUPABASE_URL=https://YOUR_PROJECT.supabase.co" > .env
echo "VITE_SUPABASE_ANON_KEY=your-anon-key" >> .env

# 7. Test locally
npm run dev

# 8. Build for production
npm run build

# 9. Deploy to Vercel
npm i -g vercel
vercel --prod

# 10. Deploy to Render (via GitHub push)
git add . && git commit -m "Deploy" && git push origin main
