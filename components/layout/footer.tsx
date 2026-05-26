"use client"

import Link from "next/link"
import { Instagram } from "lucide-react"

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
            // Technical Apparel Framework
          </p>
          <div className="w-8 h-[1px] bg-zinc-900 dark:bg-zinc-800 mx-auto mt-6" />
        </div>

        {/* 2. BRUTALIST STRUCTURAL NAVIGATION GRID */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-12 mb-16 text-left max-w-4xl mx-auto">
          
          {/* CATEGORY VECTOR INDEX */}
          <div className="space-y-4">
            <h3 className="text-[10px] font-mono uppercase tracking-[0.2em] font-bold text-zinc-400 dark:text-zinc-600">
              // SPEC INDEX
            </h3>
            <ul className="space-y-2.5 text-xs font-black uppercase tracking-wider">
              <li>
                <Link href="/shop?filter=new" className="text-zinc-500 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-white transition-colors">
                  New Drops
                </Link>
              </li>
              <li>
                <Link href="/shop?category=compression" className="text-zinc-500 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-white transition-colors">
                  Compression Arrays
                </Link>
              </li>
              <li>
                <Link href="/shop?category=tracksuits" className="text-zinc-500 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-white transition-colors">
                  Thermal Tracksuits
                </Link>
              </li>
            </ul>
          </div>

          {/* SYSTEM ARCHITECTURE METRICS */}
          <div className="space-y-4">
            <h3 className="text-[10px] font-mono uppercase tracking-[0.2em] font-bold text-zinc-400 dark:text-zinc-600">
              // LOGISTICS
            </h3>
            <ul className="space-y-2.5 text-xs font-black uppercase tracking-wider">
              <li>
                <Link href="/about" className="text-zinc-500 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-white transition-colors">
                  Read Manifesto
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-zinc-500 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-white transition-colors">
                  Contact Terminal
                </Link>
              </li>
              <li>
                <Link href="/shipping" className="text-zinc-500 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-white transition-colors">
                  Shipping &amp; Returns
                </Link>
              </li>
            </ul>
          </div>

          {/* LEGAL LOG ENFORCEMENT */}
          <div className="space-y-4 col-span-2 md:col-span-1">
            <h3 className="text-[10px] font-mono uppercase tracking-[0.2em] font-bold text-zinc-400 dark:text-zinc-600">
              // COMPLIANCE
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

        {/* 3. LOWER TERMINAL STATUS BAR */}
        <div className="pt-8 border-t border-zinc-100 dark:border-zinc-900 text-center space-y-4">
          <div className="flex justify-center">
            <a
              href="https://www.instagram.com/zapatoscave"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 border border-zinc-200 dark:border-zinc-900 bg-zinc-50 dark:bg-[#0C0C10] text-zinc-400 hover:text-zinc-950 dark:hover:text-white transition-colors"
              aria-label="Instagram Link"
            >
              <Instagram className="h-4 w-4 stroke-[1.5]" />
            </a>
          </div>
          <p className="text-[10px] font-mono text-zinc-400 dark:text-zinc-600 uppercase tracking-widest">
            © {currentYear} Zapatos Cave. System connection closed.
          </p>
        </div>

      </div>
    </footer>
  )
}