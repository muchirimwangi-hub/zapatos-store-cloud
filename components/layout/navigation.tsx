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
  { href: "/shop", label: "Shop All" },
  { href: "/shop?category=training", label: "Training" },
  { href: "/shop?category=new-drops", label: "New Drops" },
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
  
  // Zustand State hooks integration mapping handles
  const itemCount = useCartStore((state) => state.getItemCount())
  const addItem = useCartStore((state) => state.addItem)

  // FIXED: Listens for variant click streams and opens the sidebar cart drawer
  useEffect(() => {
    const handleVariantCartAddition = (event: Event) => {
      const customEvent = event as CustomEvent;
      const payload = customEvent.detail;

      if (!payload) return;

      // Unpack raw context variables to align matching structures inside useCartStore
      const formattedProductMock = {
        id: payload.variantId || payload.productId, 
        name: payload.name,
        price: payload.price,
        images: [payload.image], 
        slug: payload.sku,
        brand: "Zapatos Cave",
        selectedOptions: payload.selectedOptions 
      };

      // Dispatches values directly to your Zustand cache store
      addItem(formattedProductMock as any);

      // Slides open your canvas Cart Drawer interface layer smoothly
      setIsCartOpen(true);
    };

    window.addEventListener("zapatos-add-to-cart", handleVariantCartAddition);
    return () => window.removeEventListener("zapatos-add-to-cart", handleVariantCartAddition);
  }, [addItem]);

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
              className="fixed left-0 top-0 h-full w-full max-w-sm bg-white shadow-2xl z-50 md:hidden flex flex-col"
            >
              <div className="flex items-center justify-between p-6 border-b border-gray-100">
                <Link href="/" onClick={() => setIsMobileMenuOpen(false)}>
                  <span className="text-xl font-bold tracking-tighter">ZAPATOS</span>
                </Link>
                <button onClick={() => setIsMobileMenuOpen(false)} className="p-2">
                  <X className="h-6 w-6" />
                </button>
              </div>

              <nav className="flex-1 py-8 px-6">
                <div className="space-y-2">
                  {navLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="block py-4 text-lg border-b border-gray-50 hover:text-gray-500 transition-colors"
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              </nav>

              <div className="p-6 border-t border-gray-100 space-y-4">
                <p className="text-xs text-gray-400 uppercase tracking-widest">
                  Performance gear for the minimalist.
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="sticky top-0 z-40 w-full border-b border-gray-100 bg-white/95 backdrop-blur-sm"
      >
        <div className="container mx-auto px-6 lg:px-12">
          <div className="flex h-20 items-center justify-between">
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full md:hidden"
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <Menu className="h-5 w-5" />
            </Button>

            <Link href="/" className="group">
               <span className="text-2xl font-black tracking-tighter group-hover:opacity-70 transition-opacity">ZAPATOS</span>
            </Link>

            <nav className="hidden md:flex items-center space-x-10">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-xs uppercase tracking-[0.2em] font-medium hover:text-gray-500 transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="icon" className="rounded-full relative" onClick={() => setIsCartOpen(true)}>
                <ShoppingBag className="h-5 w-5" />
                {isMounted && itemCount > 0 && (
                  <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-black text-[10px] font-medium text-white flex items-center justify-center">
                    {itemCount}
                  </span>
                )}
              </Button>

              <div className="relative hidden sm:block" ref={userMenuRef}>
                {authUser ? (
                  <button onClick={() => setIsUserMenuOpen(!isUserMenuOpen)} className="flex items-center gap-1">
                    <User className="h-5 w-5" />
                    <ChevronDown className="h-3 w-3" />
                  </button>
                ) : (
                  <Link href="/signin">
                    <User className="h-5 w-5" />
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