"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Package, ShoppingCart, Users, DollarSign, TrendingUp, Eye } from "lucide-react"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"
import { formatCurrency } from "@/lib/utils"

interface DashboardStats {
  totalProducts: number
  totalOrders: number
  totalCustomers: number
  totalRevenue: number
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalProducts: 0,
    totalOrders: 0,
    totalCustomers: 0,
    totalRevenue: 0,
  })
  const [recentOrders, setRecentOrders] = useState<
    { id: string; order_number: string; total: number; status: string; created_at: string }[]
  >([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadStats = async () => {
      const supabase = createClient()

      const [productsRes, ordersRes, customersRes] = await Promise.all([
        supabase.from("products").select("id", { count: "exact", head: true }),
        supabase.from("orders").select("*").order("created_at", { ascending: false }).limit(5),
        supabase.from("user_profiles").select("id", { count: "exact", head: true }),
      ])

      const orders = ordersRes.data || []
      const totalRevenue = orders.reduce((sum, o) => sum + (o.total || 0), 0)

      setStats({
        totalProducts: productsRes.count || 0,
        totalOrders: orders.length,
        totalCustomers: customersRes.count || 0,
        totalRevenue,
      })
      setRecentOrders(
        orders.map((o) => ({
          id: o.id,
          order_number: o.order_number,
          total: o.total,
          status: o.status,
          created_at: o.created_at,
        }))
      )
      setIsLoading(false)
    }

    loadStats()
  }, [])

  const statCards = [
    {
      label: "Total Products",
      value: stats.totalProducts,
      icon: Package,
      href: "/admin/products",
      color: "bg-blue-500/10 text-blue-600",
    },
    {
      label: "Total Orders",
      value: stats.totalOrders,
      icon: ShoppingCart,
      href: "/admin/orders",
      color: "bg-green-500/10 text-green-600",
    },
    {
      label: "Customers",
      value: stats.totalCustomers,
      icon: Users,
      href: "/admin/customers",
      color: "bg-purple-500/10 text-purple-600",
    },
    {
      label: "Revenue",
      value: formatCurrency(stats.totalRevenue),
      icon: DollarSign,
      href: "/admin/orders",
      color: "bg-amber-500/10 text-amber-600",
    },
  ]

  const statusColors: Record<string, string> = {
    pending: "bg-yellow-100 text-yellow-800",
    processing: "bg-blue-100 text-blue-800",
    completed: "bg-green-100 text-green-800",
    cancelled: "bg-red-100 text-red-800",
  }

  return (
    <div className="space-y-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, index) => {
          const Icon = card.icon
          return (
            <motion.div
              key={card.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Link
                href={card.href}
                className="block bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">{card.label}</p>
                    <p className="text-3xl font-semibold text-gray-900">
                      {isLoading ? "—" : card.value}
                    </p>
                  </div>
                  <div className={`p-3 rounded-lg ${card.color}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                </div>
              </Link>
            </motion.div>
          )
        })}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-lg border border-gray-200"
        >
          <div className="flex items-center justify-between p-6 border-b border-gray-100">
            <h3 className="font-medium text-gray-900">Recent Orders</h3>
            <Link
              href="/admin/orders"
              className="text-sm text-zapatos-gold hover:text-zapatos-terracotta transition-colors"
            >
              View all →
            </Link>
          </div>
          <div className="divide-y divide-gray-100">
            {isLoading ? (
              <div className="p-6 text-center text-gray-400 text-sm">Loading...</div>
            ) : recentOrders.length > 0 ? (
              recentOrders.map((order) => (
                <div key={order.id} className="px-6 py-4 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900">#{order.order_number}</p>
                    <p className="text-xs text-gray-400">
                      {new Date(order.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        statusColors[order.status] || "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {order.status}
                    </span>
                    <span className="text-sm font-medium">{formatCurrency(order.total)}</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-6 text-center text-gray-400 text-sm">No orders yet</div>
            )}
          </div>
        </motion.div>

        {/* Quick Links */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-lg border border-gray-200"
        >
          <div className="p-6 border-b border-gray-100">
            <h3 className="font-medium text-gray-900">Quick Actions</h3>
          </div>
          <div className="p-6 space-y-3">
            <Link
              href="/admin/products/new"
              className="flex items-center gap-3 p-4 rounded-lg border border-gray-200 hover:border-zapatos-gold hover:bg-zapatos-gold/5 transition-all group"
            >
              <div className="p-2 bg-zapatos-gold/10 rounded-lg">
                <Package className="h-5 w-5 text-zapatos-gold" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900 group-hover:text-zapatos-gold transition-colors">
                  Add New Product
                </p>
                <p className="text-xs text-gray-400">Create a new product listing</p>
              </div>
              <TrendingUp className="h-4 w-4 text-gray-300" />
            </Link>

            <Link
              href="/"
              target="_blank"
              className="flex items-center gap-3 p-4 rounded-lg border border-gray-200 hover:border-zapatos-gold hover:bg-zapatos-gold/5 transition-all group"
            >
              <div className="p-2 bg-blue-500/10 rounded-lg">
                <Eye className="h-5 w-5 text-blue-500" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900 group-hover:text-zapatos-gold transition-colors">
                  View Storefront
                </p>
                <p className="text-xs text-gray-400">See your store as customers see it</p>
              </div>
              <TrendingUp className="h-4 w-4 text-gray-300" />
            </Link>

            <Link
              href="/admin/orders"
              className="flex items-center gap-3 p-4 rounded-lg border border-gray-200 hover:border-zapatos-gold hover:bg-zapatos-gold/5 transition-all group"
            >
              <div className="p-2 bg-green-500/10 rounded-lg">
                <ShoppingCart className="h-5 w-5 text-green-500" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900 group-hover:text-zapatos-gold transition-colors">
                  Manage Orders
                </p>
                <p className="text-xs text-gray-400">View and process orders</p>
              </div>
              <TrendingUp className="h-4 w-4 text-gray-300" />
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
