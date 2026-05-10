# Zapatos

An affordable luxury headless e-commerce platform for premium fragrance and body care products.

## Tech Stack

- **Frontend**: Next.js 14 (App Router), React, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui, Framer Motion
- **Backend**: Next.js Route Handlers / Server Actions
- **Database & Auth**: Supabase (PostgreSQL)
- **AI**: Vercel AI SDK
- **Payments**: Stripe

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
   - Copy `.env.example` to `.env.local`
   - Fill in your Supabase, Stripe, and OpenAI credentials

3. Run the Supabase SQL schema (found in `/supabase/schema.sql`)

4. Start the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## Core Features

- **E-commerce Foundation**: Product catalog, PDPs, cart management, Stripe checkout
- **AI Personality Tester**: Interactive quiz with personalized product recommendations
- **Gift Curator**: Custom bundle builder with save & share functionality

## Design Philosophy

Inspired by Aesop, Jo Malone, and Maison 21G - affordable luxury, minimalist, and editorial.
