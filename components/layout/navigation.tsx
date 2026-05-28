"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ShoppingBag, User, Menu, X, ChevronDown, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { motion, AnimatePresence } from "framer-motion"
import { useCartStore } from "@/lib/store/cart-store"
import { CartDrawer } from "@/components/cart/cart-drawer"
import { createClient } from "@/lib/supabase/client"

const navLinks = [
  { href: "/shop", label: "Shop All" },
  { href: "/shop?category=compression", label: "Compression Wear" },
  { href: "/shop?category=tracksuits", label: "Premium Tracksuits" },
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
  const addItem = useCartStore((state) => state.addItem)

  useEffect(() => {
    const handleVariantCartAddition = (event: Event) => {
      const customEvent = event as CustomEvent
      const payload = customEvent.detail

      if (!payload) return

      const formattedProductMock = {
        id: payload.variantId || payload.productId, 
        name: payload.name,
        price: payload.price,
        images: [payload.image], 
        slug: payload.sku,
        brand: "Zapatos Cave",
        selectedOptions: payload.selectedOptions 
      }

      addItem(formattedProductMock as any)
      setIsCartOpen(true)
    }

    window.addEventListener("zapatos-add-to-cart", handleVariantCartAddition)
    return () => window.removeEventListener("zapatos-add-to-cart", handleVariantCartAddition)
  }, [addItem])

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

  return (
    <>
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />

      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 md:hidden"
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              className="fixed left-0 top-0 h-full w-full max-w-sm bg-white dark:bg-[#08080A] shadow-2xl z-50 md:hidden flex flex-col border-r border-zinc-100 dark:border-zinc-900 rounded-none"
            >
              <div className="flex items-center justify-between p-6 border-b border-zinc-100 dark:border-zinc-900">
                <Link href="/" onClick={() => setIsMobileMenuOpen(false)}>
                  <span className="text-xl font-black tracking-tighter text-zinc-950 dark:text-white uppercase">Zapatos Cave</span>
                </Link>
                <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 text-zinc-500 hover:text-zinc-950 dark:hover:text-white">
                  <X className="h-5 w-5 stroke-[1.5]" />
                </button>
              </div>

              <nav className="flex-1 py-8 px-6 overflow-y-auto">
                <div className="space-y-1">
                  {navLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="block py-4 text-sm font-black uppercase tracking-wider text-zinc-500 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-white transition-colors border-b border-zinc-50 dark:border-zinc-900/50"
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              </nav>

              <div className="p-6 border-t border-zinc-100 dark:border-zinc-900">
                <p className="text-[10px] font-mono text-zinc-400 dark:text-zinc-600 uppercase tracking-widest">
                  Premium activewear designed for modern paces.
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="sticky top-0 z-40 w-full border-b border-zinc-100 dark:border-zinc-900/80 bg-white/95 dark:bg-[#08080A]/95 backdrop-blur-sm transition-colors duration-500"
      >
        <div className="max-w-6xl mx-auto px-6 lg:px-12">
          <div className="flex h-20 items-center justify-between">
            <Button
              variant="ghost"
              size="icon"
              className="rounded-none md:hidden text-zinc-900 dark:text-white hover:bg-zinc-100 dark:hover:bg-zinc-900"
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <Menu className="h-5 w-5 stroke-[1.5]" />
            </Button>

            <Link href="/" className="group">
              <span className="text-2xl font-black tracking-tighter text-zinc-950 dark:text-white uppercase transition-opacity group-hover:opacity-70">
                Zapatos Cave
              </span>
            </Link>

            <nav className="hidden md:flex items-center space-x-10">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-xs uppercase tracking-[0.2em] font-black text-zinc-600 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-white transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            <div className="flex items-center space-x-4">
              <Button 
                variant="ghost" 
                size="icon" 
                className="rounded-none relative text-zinc-900 dark:text-white hover:bg-zinc-100 dark:hover:bg-zinc-900" 
                onClick={() => setIsCartOpen(true)}
              >
                <ShoppingBag className="h-5 w-5 stroke-[1.5]" />
                {isMounted && itemCount > 0 && (
                  <span className="absolute -top-1 -right-1 h-4 w-4 rounded-none bg-zinc-950 dark:bg-white text-[9px] font-mono font-bold text-white dark:text-black flex items-center justify-center">
                    {itemCount}
                  </span>
                )}
              </Button>

              <div className="relative hidden sm:block" ref={userMenuRef}>
                {authUser ? (
                  <div className="relative">
                    <button 
                      onClick={() => setIsUserMenuOpen(!isUserMenuOpen)} 
                      className="flex items-center gap-1 text-zinc-600 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-white transition-colors font-medium text-xs uppercase tracking-wider"
                    >
                      <User className="h-5 w-5 stroke-[1.5]" />
                      <ChevronDown className="h-3 w-3 opacity-50" />
                    </button>
                    
                    <AnimatePresence>
                      {isUserMenuOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 10 }}
                          className="absolute right-0 mt-3 w-48 bg-white dark:bg-[#0C0C10] border border-zinc-200 dark:border-zinc-900 shadow-xl rounded-none py-1 z-50 text-left"
                        >
                          <div className="px-4 py-2 border-b border-zinc-100 dark:border-zinc-900">
                            <p className="text-[10px] font-mono text-zinc-400 dark:text-zinc-600 uppercase tracking-wider">Account Profile</p>
                            <p className="text-xs font-bold text-zinc-950 dark:text-white truncate mt-0.5">{authUser.full_name}</p>
                          </div>
                          <button
                            onClick={handleSignOut}
                            className="w-full text-left px-4 py-2.5 text-xs font-bold text-red-600 dark:text-red-400 hover:bg-zinc-50 dark:hover:bg-zinc-900 flex items-center gap-2 transition-colors uppercase tracking-wider"
                          >
                            <LogOut className="h-3.5 w-3.5 stroke-[1.8]" />
                            Sign Out
                          </button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ) : (
                  <Link href="/signin" className="text-zinc-600 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-white transition-colors">
                    <User className="h-5 w-5 stroke-[1.5]" />
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </motion.header>
    </>
  )
}