# Crimson Parents Newsletter Builder

A beautiful newsletter creation tool for the Harvard Business School Crimson Parents Club. Create stunning monthly PDFs to share on WhatsApp.

## Features
- 🎨 8 seasonal themes (Crimson Classic, Halloween, Thanksgiving, Holiday, Valentine's, Spring, Summer, Back to School)
- 📝 9 section types (header, president's message, events, birthdays, birth announcements, and more)
- 🖱️ Drag-and-drop section reordering
- 💾 Auto-saves every 30 seconds
- 📄 One-click PDF export (optimized for WhatsApp)
- 👥 Up to 5 officer accounts

## Setup

### 1. Clone & Install
```bash
git clone <your-repo>
cd crimson-parents-newsletter
npm install
```

### 2. Supabase Setup
1. Go to [Supabase](https://supabase.com) and open your project
2. Run the SQL in `supabase/migrations/001_init.sql` in the SQL editor
3. Copy your project's anon key from Settings → API

### 3. Environment Variables
Copy `.env.example` to `.env.local` and fill in:
```
VITE_SUPABASE_URL=https://pebcsrjdvqvpnmpsoofb.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here
```

### 4. Run Locally
```bash
npm run dev
```

### 5. Deploy to Vercel
1. Push to GitHub
2. Import repo in Vercel
3. Add environment variables in Vercel dashboard
4. Deploy ✅

## Usage
1. Sign up with your email
2. Click **New Newsletter** to create
3. Add/remove/reorder sections in the left sidebar
4. Click any section to edit it in the right panel
5. Pick a theme to match the month
6. Click **Export PDF** when ready — share on WhatsApp!
