"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ShoppingBag, User, Heart, Menu, X, LogOut, Gift, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { motion, AnimatePresence } from "framer-motion"
import { useCartStore } from "@/lib/store/cart-store"
import { CartDrawer } from "@/components/cart/cart-drawer"
import { createClient } from "@/lib/supabase/client"

const navLinks = [
  { href: "/shop", label: "Shop" },
  { href: "/quiz", label: "Discover Your Aura" },
  { href: "/gift-curator", label: "Gift Curator" },
  { href: "/about", label: "About" },
]

export default function Navigation() {
  const router = useRouter()
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  const [authUser, setAuthUser] = useState<{ email?: string; full_name?: string } | null>(null)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const userMenuRef = useRef<HTMLDivElement>(null)
  const itemCount = useCartStore((state) => state.getItemCount())

  useEffect(() => {
    setIsMounted(true)

    const supabase = createClient()
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        setAuthUser({
          email: user.email,
          full_name: user.user_metadata?.full_name || user.email?.split("@")[0],
        })
      }
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setAuthUser({
          email: session.user.email,
          full_name: session.user.user_metadata?.full_name || session.user.email?.split("@")[0],
        })
      } else {
        setAuthUser(null)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  // Close user menu on outside click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setIsUserMenuOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClick)
    return () => document.removeEventListener("mousedown", handleClick)
  }, [])

  const handleSignOut = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    setAuthUser(null)
    setIsUserMenuOpen(false)
    router.push("/")
    router.refresh()
  }

  // Close mobile menu on route change
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [isMobileMenuOpen])

  return (
    <>
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-zapatos-obsidian/60 backdrop-blur-sm z-50 md:hidden"
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="fixed left-0 top-0 h-full w-full max-w-sm bg-zapatos-cream shadow-2xl z-50 md:hidden flex flex-col"
            >
              {/* Mobile Menu Header */}
              <div className="flex items-center justify-between p-6 border-b border-zapatos-taupe/30">
                <Link href="/" onClick={() => setIsMobileMenuOpen(false)}>
                  <img
                    src="https://res.cloudinary.com/dufw6bsko/image/upload/q_auto/f_auto/v1775663961/ABA_Logo_Primary_Plum_pexjmf.png"
                    alt="Zapatos"
                    className="h-10 w-auto"
                  />
                </Link>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2 hover:bg-zapatos-taupe/20 rounded-full transition-colors"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              {/* Mobile Nav Links */}
              <nav className="flex-1 py-8 px-6">
                <div className="space-y-2">
                  {navLinks.map((link, index) => (
                    <motion.div
                      key={link.href}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Link
                        href={link.href}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="block py-4 text-lg font-serif border-b border-zapatos-taupe/20 hover:text-zapatos-gold transition-colors"
                      >
                        {link.label}
                      </Link>
                    </motion.div>
                  ))}
                </div>
              </nav>

              {/* Mobile Menu Footer */}
              <div className="p-6 border-t border-zapatos-taupe/30 space-y-4">
                <Link
                  href="/wishlist"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-3 text-sm text-zapatos-charcoal/70 hover:text-zapatos-gold transition-colors"
                >
                  <Heart className="h-5 w-5" />
                  Wishlist
                </Link>
                {authUser ? (
                  <>
                    <Link
                      href="/account/gifts"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center gap-3 text-sm text-zapatos-charcoal/70 hover:text-zapatos-gold transition-colors"
                    >
                      <Gift className="h-5 w-5" />
                      Saved Gifts
                    </Link>
                    <button
                      onClick={() => { setIsMobileMenuOpen(false); handleSignOut() }}
                      className="flex items-center gap-3 text-sm text-zapatos-charcoal/70 hover:text-zapatos-gold transition-colors"
                    >
                      <LogOut className="h-5 w-5" />
                      Sign out
                    </button>
                  </>
                ) : (
                  <Link
                    href="/signin"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center gap-3 text-sm text-zapatos-charcoal/70 hover:text-zapatos-gold transition-colors"
                  >
                    <User className="h-5 w-5" />
                    Sign in
                  </Link>
                )}
                <p className="text-xs text-zapatos-charcoal/50 editorial-spacing">
                  Where luxury meets ritual.
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="sticky top-0 z-40 w-full luxury-border border-t-0 border-l-0 border-r-0 bg-zapatos-cream/95 backdrop-blur-sm"
      >
        <div className="container mx-auto px-6 lg:px-12">
          <div className="flex h-20 items-center justify-between">
            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full md:hidden"
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <Menu className="h-5 w-5" />
              <span className="sr-only">Menu</span>
            </Button>

            {/* Logo */}
            <Link href="/" className="group">
              <img
                src="https://res.cloudinary.com/dufw6bsko/image/upload/q_auto/f_auto/v1775663961/ABA_Logo_Primary_Plum_pexjmf.png"
                alt="Zapatos"
                className="h-12 lg:h-14 w-auto transition-opacity group-hover:opacity-80"
              />
            </Link>

            {/* Center Navigation */}
            <nav className="hidden md:flex items-center space-x-10 editorial-spacing">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm uppercase tracking-widest hover:text-zapatos-gold transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Right Actions */}
            <div className="flex items-center space-x-2 sm:space-x-4">
              <Button variant="ghost" size="icon" className="rounded-full hidden sm:inline-flex" asChild>
                <Link href="/wishlist">
                  <Heart className="h-5 w-5" />
                  <span className="sr-only">Wishlist</span>
                </Link>
              </Button>
              {/* User / Auth */}
              <div className="relative hidden sm:block" ref={userMenuRef}>
                {authUser ? (
                  <>
                    <button
                      onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                      className="flex items-center gap-1.5 px-3 py-2 rounded-full hover:bg-zapatos-taupe/10 transition-colors"
                    >
                      <div className="w-7 h-7 rounded-full bg-zapatos-gold/15 flex items-center justify-center">
                        <span className="text-xs font-medium text-zapatos-gold">
                          {(authUser.full_name || authUser.email || "U")[0].toUpperCase()}
                        </span>
                      </div>
                      <ChevronDown className={`h-3 w-3 text-zapatos-charcoal/50 transition-transform ${isUserMenuOpen ? "rotate-180" : ""}`} />
                    </button>

                    <AnimatePresence>
                      {isUserMenuOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: 8, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 8, scale: 0.95 }}
                          transition={{ duration: 0.15 }}
                          className="absolute right-0 top-full mt-2 w-56 bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden z-50"
                        >
                          <div className="px-4 py-3 border-b border-gray-100">
                            <p className="text-sm font-medium text-gray-900 truncate">{authUser.full_name}</p>
                            <p className="text-xs text-gray-400 truncate">{authUser.email}</p>
                          </div>
                          <div className="py-1">
                            <Link
                              href="/wishlist"
                              onClick={() => setIsUserMenuOpen(false)}
                              className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                            >
                              <Heart className="h-4 w-4 text-gray-400" />
                              Wishlist
                            </Link>
                            <Link
                              href="/account/gifts"
                              onClick={() => setIsUserMenuOpen(false)}
                              className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                            >
                              <Gift className="h-4 w-4 text-gray-400" />
                              Saved Gifts
                            </Link>
                            <button
                              onClick={handleSignOut}
                              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                            >
                              <LogOut className="h-4 w-4 text-gray-400" />
                              Sign out
                            </button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </>
                ) : (
                  <Button variant="ghost" size="icon" className="rounded-full" asChild>
                    <Link href="/signin">
                      <User className="h-5 w-5" />
                      <span className="sr-only">Sign in</span>
                    </Link>
                  </Button>
                )}
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full relative"
                onClick={() => setIsCartOpen(true)}
              >
                <ShoppingBag className="h-5 w-5" />
                {isMounted && itemCount > 0 && (
                  <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-zapatos-gold text-[10px] font-medium text-white flex items-center justify-center">
                    {itemCount}
                  </span>
                )}
                <span className="sr-only">Shopping bag</span>
              </Button>
            </div>
          </div>
        </div>
      </motion.header>
    </>
  )
}
