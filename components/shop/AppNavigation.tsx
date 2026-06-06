"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Compass, ShoppingBag, User, LayoutDashboard, Layers, Activity } from "lucide-react"

export function AppNavigation() {
  const pathname = usePathname()

  // Strict technical navigation pillars
  const desktopNavItems = [
    { label: "New Drops", href: "/shop" },
    { label: "Men", href: "/shop?category=men" },
    { label: "Women", href: "/shop?category=women" },
    { label: "Blueprint", href: "/quiz" },
    { label: "About", href: "/about" },
  ]

  // Mobile navigation tab mappings for single-hand app mechanics
  const mobileNavItems = [
    { label: "Explore", href: "/shop", icon: Compass },
    { label: "Cart", href: "/cart", icon: ShoppingBag },
    { label: "Blueprint", href: "/quiz", icon: Activity },
    { label: "Profile", href: "/profile", icon: User },
  ]

  return (
    <>
      {/* 1. ARCHITECTURAL DESKTOP HEADER */}
      <header className="hidden md:flex fixed top-0 left-0 right-0 h-20 border-b border-zinc-100 dark:border-zinc-900 bg-white/80 dark:bg-[#08080A]/80 backdrop-blur-md z-50 items-center justify-between px-16 transition-all duration-300">
        
        {/* Brand Monolith */}
        <Link href="/" className="font-black text-base uppercase tracking-[0.5em] text-zinc-950 dark:text-white hover:opacity-80 transition-opacity">
          Zapatos Cave
        </Link>
        
        {/* Central Core Navigation Menu */}
        <nav className="flex items-center gap-10 text-[10px] uppercase font-black tracking-[0.25em]">
          {desktopNavItems.map((item) => {
            const isActive = pathname === item.href || (item.href.includes('about') && pathname.startsWith('/about'))
            return (
              <Link 
                key={item.href} 
                href={item.href} 
                className={`transition-colors duration-200 relative py-2 ${
                  isActive 
                    ? "text-zinc-950 dark:text-white" 
                    : "text-zinc-400 hover:text-zinc-950 dark:hover:text-white"
                }`}
              >
                {item.label}
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-zinc-950 dark:bg-white" />
                )}
              </Link>
            )
          })}
        </nav>

        {/* Action Control Desk */}
        <div className="flex items-center gap-6 text-zinc-400">
          <Link href="/cart" className="hover:text-zinc-950 dark:hover:text-white transition-colors relative">
            <ShoppingBag className="w-4 h-4 stroke-[1.5]" />
          </Link>
          <Link href="/admin/products" className="hover:text-zinc-950 dark:hover:text-white transition-colors">
            <LayoutDashboard className="w-4 h-4 stroke-[1.5]" />
          </Link>
        </div>
      </header>

      {/* 2. MOBILE APPLICATION TAB BAR */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 border-t border-zinc-100 dark:border-zinc-900 bg-white/90 dark:bg-[#08080A]/90 backdrop-blur-lg z-50 flex items-center justify-around pb-safe transition-colors duration-300">
        {mobileNavItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname.startsWith(item.href)
          return (
            <Link 
              key={item.href} 
              href={item.href} 
              className="flex flex-col items-center justify-center w-16 h-full space-y-1 group"
            >
              <Icon className={`h-4 w-4 stroke-[1.5] transition-transform group-active:scale-90 ${
                isActive ? "text-zinc-950 dark:text-white stroke-[2.2]" : "text-zinc-400 dark:text-zinc-600"
              }`} />
              <span className={`text-[9px] uppercase font-mono tracking-wider transition-colors ${
                isActive ? "text-zinc-950 dark:text-white font-bold" : "text-zinc-400 dark:text-zinc-600"
              }`}>
                {item.label}
              </span>
            </Link>
          )
        })}
      </nav>
    </>
  )
}