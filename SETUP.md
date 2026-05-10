# Zapatos - Setup Guide

## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables

Create a `.env.local` file in the root directory:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Stripe Configuration
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# AI Configuration (OpenAI)
OPENAI_API_KEY=sk-...

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 3. Set Up Supabase Database

1. Create a new Supabase project at [supabase.com](https://supabase.com)
2. Go to the SQL Editor in your Supabase dashboard
3. Copy and paste the entire contents of `/supabase/schema.sql`
4. Execute the SQL to create all tables, indexes, RLS policies, and sample data
5. Your database is now ready!

### 4. Configure Stripe

1. Sign up at [stripe.com](https://stripe.com)
2. Go to Developers > API Keys
3. Copy your publishable and secret keys to `.env.local`
4. For webhooks (optional in development):
   - Install Stripe CLI: `stripe listen --forward-to localhost:3000/api/webhooks/stripe`
   - Use the webhook signing secret provided

### 5. Configure OpenAI

1. Sign up at [platform.openai.com](https://platform.openai.com)
2. Go to API Keys section
3. Create a new secret key
4. Add it to `.env.local`

### 6. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure

```
Zapatos/
├── app/                    # Next.js App Router pages
│   ├── layout.tsx         # Root layout with fonts and navigation
│   ├── page.tsx           # Landing page
│   └── globals.css        # Global styles with design system
├── components/            
│   ├── layout/            # Header, footer, navigation
│   └── ui/                # shadcn/ui components
├── lib/                   
│   ├── supabase/          # Supabase client utilities
│   └── utils.ts           # Helper functions
├── supabase/              
│   └── schema.sql         # Complete database schema
└── middleware.ts          # Auth middleware

```

## 🎨 Design System

### Colors
- **Cream**: `#FAF7F2` - Primary background
- **Taupe**: `#D4C7BA` - Secondary/muted elements
- **Terracotta**: `#C9A689` - Accent color
- **Obsidian**: `#1A1A1A` - Primary text
- **Charcoal**: `#2D2D2D` - Secondary text
- **Gold**: `#B8936D` - Highlights/CTAs

### Typography
- **Headings**: Cormorant Garamond (serif)
- **Body**: Inter (sans-serif)

### Utilities
- `.editorial-spacing` - Refined letter and line spacing
- `.luxury-border` - Subtle taupe borders
- `.glass-effect` - Frosted glass backdrop

## 🗃️ Database Schema

The schema includes:
- **products** - Product catalog with AI matching
- **user_profiles** - Extended user data
- **gift_boxes** - Custom curated gift sets
- **gift_box_items** - Products in each box (1-4 slots)
- **orders** - Order management
- **order_items** - Line items for orders
- **quiz_responses** - Personality quiz data

All tables have Row Level Security (RLS) enabled.

## 🔐 Authentication

Supabase Auth is configured with:
- Email/password authentication
- Magic link sign-in (optional)
- OAuth providers (optional)

Protected routes are handled by middleware.

## 📝 Next Steps

After setup, you can:
1. ✅ View the landing page at `/`
2. Start building the product catalog (`/shop`)
3. Create the personality quiz (`/quiz`)
4. Build the gift curator (`/gift-curator`)
5. Implement cart and checkout flow

## 🛠️ Development Commands

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

## 📚 Tech Stack Reference

- [Next.js 14 Docs](https://nextjs.org/docs)
- [Supabase Docs](https://supabase.com/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [shadcn/ui](https://ui.shadcn.com)
- [Framer Motion](https://www.framer.com/motion/)
- [Stripe Docs](https://stripe.com/docs)
- [Vercel AI SDK](https://sdk.vercel.ai/docs)

---

**Happy building! 🎨✨**
