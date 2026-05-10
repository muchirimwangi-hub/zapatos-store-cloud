import Link from "next/link"
import { Instagram } from "lucide-react"

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="luxury-border border-b-0 border-l-0 border-r-0 bg-zapatos-cream mt-32">
      <div className="container mx-auto px-6 lg:px-12 py-16">
        {/* Brand */}
        <div className="text-center mb-12">
          <h2 className="font-serif font-light tracking-wider mb-3">
            <span className="text-4xl italic">Zapatos</span>
            <br />
            <span className="text-xs uppercase tracking-[0.4em] text-zapatos-charcoal/60">Beauty Atelier</span>
          </h2>
          <div className="w-12 h-[1px] bg-zapatos-gold/40 mx-auto mt-4" />
        </div>

        {/* Links */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12 text-center">
          {/* Shop */}
          <div>
            <h3 className="text-xs uppercase tracking-[0.2em] font-medium mb-4">Shop</h3>
            <ul className="space-y-2 text-sm text-zapatos-charcoal/70">
              <li>
                <Link href="/shop/fragrance" className="hover:text-zapatos-gold transition-colors">
                  Fragrance
                </Link>
              </li>
              <li>
                <Link href="/shop/bodycare" className="hover:text-zapatos-gold transition-colors">
                  Body Care
                </Link>
              </li>
              <li>
                <Link href="/shop" className="hover:text-zapatos-gold transition-colors">
                  All Products
                </Link>
              </li>
            </ul>
          </div>

          {/* Experience */}
          <div>
            <h3 className="text-xs uppercase tracking-[0.2em] font-medium mb-4">Experience</h3>
            <ul className="space-y-2 text-sm text-zapatos-charcoal/70">
              <li>
                <Link href="/quiz" className="hover:text-zapatos-gold transition-colors">
                  Personality Quiz
                </Link>
              </li>
              <li>
                <Link href="/gift-curator" className="hover:text-zapatos-gold transition-colors">
                  Gift Curator
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-xs uppercase tracking-[0.2em] font-medium mb-4">Company</h3>
            <ul className="space-y-2 text-sm text-zapatos-charcoal/70">
              <li>
                <Link href="/about" className="hover:text-zapatos-gold transition-colors">
                  Our Story
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-zapatos-gold transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-xs uppercase tracking-[0.2em] font-medium mb-4">Support</h3>
            <ul className="space-y-2 text-sm text-zapatos-charcoal/70">
              <li>
                <Link href="/shipping" className="hover:text-zapatos-gold transition-colors">
                  Shipping & Returns
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-zapatos-gold transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-zapatos-gold transition-colors">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-zapatos-taupe/30 text-center">
          <div className="flex justify-center gap-4 mb-4">
            <a
              href="https://www.instagram.com/Zapatosbeautyatelier_ng?igsh=azlvdXFuYm04NWV2"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-full hover:bg-zapatos-taupe/20 transition-colors text-zapatos-charcoal/60 hover:text-zapatos-gold"
              aria-label="Instagram"
            >
              <Instagram className="h-5 w-5" />
            </a>
          </div>
          <p className="text-xs text-zapatos-charcoal/50">
            © {currentYear} Zapatos. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
