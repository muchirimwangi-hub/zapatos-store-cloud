"use client"

import Link from "next/link"
import { Instagram, Phone, MessageCircle } from "lucide-react"

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="w-full bg-white dark:bg-[#08080A] border-t border-zinc-100 dark:border-zinc-900 transition-colors duration-500 mt-32 pb-20 md:pb-8">
      <div className="max-w-6xl mx-auto px-6 lg:px-12 py-16">
        
        {/* 1. BRAND MONOLITH LOGO */}
        <div className="text-center mb-16">
          <h2 className="tracking-[0.5em] uppercase font-black text-zinc-950 dark:text-white text-lg">
            Zapatos Cave
          </h2>
          <p className="text-[9px] font-mono uppercase tracking-[0.3em] text-zinc-400 dark:text-zinc-600 mt-2">
            Premium Training Systems
          </p>
          <div className="w-8 h-[1px] bg-zinc-900 dark:bg-zinc-800 mx-auto mt-6" />
        </div>

        {/* 2. NAVIGATION GRID */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-12 mb-16 text-left max-w-4xl mx-auto">
          
          {/* COLLECTIONS INDEX */}
          <div className="space-y-4">
            <h3 className="text-[10px] font-mono uppercase tracking-[0.2em] font-bold text-zinc-400 dark:text-zinc-600">
              COLLECTIONS
            </h3>
            <ul className="space-y-2.5 text-xs font-black uppercase tracking-wider">
              <li>
                <Link href="/shop?filter=new" className="text-zinc-500 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-white transition-colors">
                  New Drops
                </Link>
              </li>
              <li>
                <Link href="/shop?category=compression" className="text-zinc-500 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-white transition-colors">
                  Compression Wear
                </Link>
              </li>
              <li>
                <Link href="/shop?category=tracksuits" className="text-zinc-500 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-white transition-colors">
                  Premium Tracksuits
                </Link>
              </li>
            </ul>
          </div>

          {/* CUSTOMER ASSISTANCE */}
          <div className="space-y-4">
            <h3 className="text-[10px] font-mono uppercase tracking-[0.2em] font-bold text-zinc-400 dark:text-zinc-600">
              ASSISTANCE
            </h3>
            <ul className="space-y-2.5 text-xs font-black uppercase tracking-wider">
              <li>
                <Link href="/about" className="text-zinc-500 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-white transition-colors">
                  Our Story
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-zinc-500 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-white transition-colors">
                  Contact Studio
                </Link>
              </li>
              <li>
                <Link href="/shipping" className="text-zinc-500 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-white transition-colors">
                  Shipping &amp; Returns
                </Link>
              </li>
              {/* New Size Guide Link */}
              <li>
                <Link href="/size-guide" className="text-zinc-500 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-white transition-colors">
                  Size Guide
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-zinc-500 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-white transition-colors">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/* LEGAL & COMPLIANCE */}
          <div className="space-y-4 col-span-2 md:col-span-1">
            <h3 className="text-[10px] font-mono uppercase tracking-[0.2em] font-bold text-zinc-400 dark:text-zinc-600">
              LEGAL
            </h3>
            <ul className="space-y-2.5 text-xs font-black uppercase tracking-wider">
              <li>
                <Link href="/privacy" className="text-zinc-500 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-zinc-500 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-white transition-colors">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>

        </div>

        {/* 3. LOWER STATUS BAR */}
        <div className="pt-8 border-t border-zinc-100 dark:border-zinc-900 text-center space-y-4">
          <div className="flex justify-center gap-3">
            
            {/* X (Twitter) */}
            <a
              href="https://x.com/zapatoscaveske"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 border border-zinc-200 dark:border-zinc-900 bg-zinc-50 dark:bg-[#0C0C10] text-zinc-400 hover:text-zinc-950 dark:hover:text-white transition-colors"
              aria-label="X"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                <path d="M4 4l11.733 16h4.267l-11.733 -16z" />
                <path d="M4 20l6.768 -6.768m2.46 -2.46l6.772 -6.772" />
              </svg>
            </a>

            {/* Instagram */}
            <a
              href="https://www.instagram.com/zapatoscave/"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 border border-zinc-200 dark:border-zinc-900 bg-zinc-50 dark:bg-[#0C0C10] text-zinc-400 hover:text-zinc-950 dark:hover:text-white transition-colors"
              aria-label="Instagram"
            >
              <Instagram className="h-4 w-4 stroke-[1.5]" />
            </a>

            {/* TikTok */}
            <a
              href="https://www.tiktok.com/@zapatoscaveske"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 border border-zinc-200 dark:border-zinc-900 bg-zinc-50 dark:bg-[#0C0C10] text-zinc-400 hover:text-zinc-950 dark:hover:text-white transition-colors"
              aria-label="TikTok"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5v3a3 3 0 0 1-3-3v7a6 6 0 1 1-6-6v3a3 3 0 0 0 3 3Z" />
              </svg>
            </a>

            {/* WhatsApp */}
            <a
              href="https://wa.me/254720383601"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 border border-zinc-200 dark:border-zinc-900 bg-zinc-50 dark:bg-[#0C0C10] text-zinc-400 hover:text-zinc-950 dark:hover:text-white transition-colors"
              aria-label="WhatsApp"
            >
              <MessageCircle className="h-4 w-4 stroke-[1.5]" />
            </a>

            {/* Phone Call */}
            <a
              href="tel:+254720383601"
              className="p-2 border border-zinc-200 dark:border-zinc-900 bg-zinc-50 dark:bg-[#0C0C10] text-zinc-400 hover:text-zinc-950 dark:hover:text-white transition-colors"
              aria-label="Call Us"
            >
              <Phone className="h-4 w-4 stroke-[1.5]" />
            </a>

          </div>
          <p className="text-[10px] font-mono text-zinc-400 dark:text-zinc-600 uppercase tracking-widest">
            © {currentYear} Zapatos Cave. All rights reserved.
          </p>
        </div>

      </div>
    </footer>
  )
}