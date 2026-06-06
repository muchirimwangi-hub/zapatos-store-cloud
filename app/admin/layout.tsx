"use client"

import { useState, useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import Link from "next/link"
import { motion } from "framer-motion"
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  Users, 
  Settings, 
  LogOut, 
  Menu, 
  X, 
  ChevronRight,
  Upload, 
  BarChart
} from "lucide-react"

// Ensure these paths match your folder structure exactly
import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/client"

const adminNavItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/products", label: "Products", icon: Package },
  { href: "/admin/orders", label: "Orders", icon: ShoppingCart },
  { href: "/admin/customers", label: "Customers", icon: Users },
  { href: "/admin/import", label: "Data Import", icon: Upload }, 
  { href: "/admin/research", label: "Research Centre", icon: BarChart },
  { href: "/admin/settings", label: "Settings", icon: Settings },
]

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const pathname = usePathname()
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [user, setUser] = useState<{ email?: string; full_name?: string } | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const isLoginPage = pathname === "/admin/login"

  useEffect(() => {
    if (isLoginPage) {
      setIsLoading(false)
      return
    }

    const checkAuth = async () => {
      const supabase = createClient()
      const { data: { user: authUser } } = await supabase.auth.getUser()

      if (!authUser) {
        router.push("/admin/login")
        return
      }

      setUser({
        email: authUser.email,
        full_name: authUser.user_metadata?.full_name || authUser.email?.split("@")[0],
      })
      setIsLoading(false)
    }

    checkAuth()
  }, [isLoginPage, router])

  const handleSignOut = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push("/admin/login")
    router.refresh()
  }

  if (isLoginPage) {
    return <>{children}</>
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#1A1A1A] flex items-center justify-center">
        <motion.div
          className="w-10 h-10 rounded-full border-2 border-[#B8936D]/20"
          style={{ borderTopColor: "#B8936D" }}
          animate={{ rotate: 360 }}
          transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }}
        />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-[#1A1A1A] text-[#FAF7F2] flex flex-col transform transition-transform duration-300 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="flex items-center justify-between p-6 border-b border-[#FAF7F2]/10">
          <Link href="/admin" className="group">
            <h1 className="text-xl font-serif font-light tracking-wider group-hover:text-[#B8936D] transition-colors">
              ZAPATOS HQ
            </h1>
          </Link>
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="lg:hidden text-[#FAF7F2]/50 hover:text-[#FAF7F2]"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex-1 py-6 px-3 space-y-1">
          {adminNavItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href))
            const Icon = item.icon

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsSidebarOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-md text-sm transition-all ${
                  isActive
                    ? "bg-[#B8936D]/15 text-[#B8936D]"
                    : "text-[#FAF7F2]/60 hover:text-[#FAF7F2] hover:bg-[#FAF7F2]/5"
                }`}
              >
                <Icon className="h-5 w-5 flex-shrink-0" />
                {item.label}
                {isActive && <ChevronRight className="h-4 w-4 ml-auto" />}
              </Link>
            )
          })}
        </nav>

        <div className="p-4 border-t border-[#FAF7F2]/10">
          <div className="px-4 py-2 mb-3">
            <p className="text-sm text-[#FAF7F2]/90 truncate">{user?.full_name}</p>
            <p className="text-xs text-[#FAF7F2]/40 truncate">{user?.email}</p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="sm"
              className="flex-1 text-[#FAF7F2]/50 hover:text-[#FAF7F2] hover:bg-[#FAF7F2]/5 justify-start"
              asChild
            >
              <Link href="/">← Store</Link>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleSignOut}
              className="text-[#FAF7F2]/50 hover:text-red-400 hover:bg-red-500/10"
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-h-screen">
        <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center gap-4 sticky top-0 z-30">
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="lg:hidden text-gray-600 hover:text-gray-900"
          >
            <Menu className="h-5 w-5" />
          </button>
          <div className="flex-1">
            <h2 className="text-lg font-medium text-gray-800">
              {adminNavItems.find(
                (i) => i.href === pathname || (i.href !== "/admin" && pathname.startsWith(i.href))
              )?.label || "Dashboard"}
            </h2>
          </div>
        </header>
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  )
}