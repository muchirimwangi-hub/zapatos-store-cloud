"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { ShoppingCart, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { createClient } from "@/lib/supabase/client"
import { formatCurrency } from "@/lib/utils"

// Updated to perfectly map your database schema columns
interface OrderRow {
  id: string
  email: string
  status: string
  total_amount: number
  shipping_cost: number
  tax: number
  created_at: string
  shipping_address: any
}

const statusColors: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  processing: "bg-blue-100 text-blue-800",
  shipped: "bg-indigo-100 text-indigo-800",
  completed: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<OrderRow[]>([])
  const [search, setSearch] = useState("")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      const supabase = createClient()
      const { data } = await supabase
        .from("orders")
        .select("*")
        .order("created_at", { ascending: false })

      setOrders((data as OrderRow[]) || [])
      setIsLoading(false)
    }
    load()
  }, [])

  const updateStatus = async (id: string, newStatus: string) => {
    const supabase = createClient()
    await supabase.from("orders").update({ status: newStatus }).eq("id", id)
    setOrders((prev) =>
      prev.map((o) => (o.id === id ? { ...o, status: newStatus } : o))
    )
  }

  // FIXED: Defensively strings out variables to completely block runtime .toLowerCase() crashes
  const filtered = orders.filter((o) => {
    const currentSearch = (search || "").toLowerCase();
    const orderRef = (o.id || "").toLowerCase();
    const orderStatus = (o.status || "").toLowerCase();
    const customerEmail = (o.email || "").toLowerCase();

    return (
      orderRef.includes(currentSearch) ||
      orderStatus.includes(currentSearch) ||
      customerEmail.includes(currentSearch)
    );
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Orders</h1>
        <p className="text-sm text-gray-500 mt-1">{orders.length} order{orders.length !== 1 ? "s" : ""}</p>
      </div>

      <div className="relative max-w-md">
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by ID, Status, or Email..."
          className="bg-white"
        />
      </div>

      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        {isLoading ? (
          <div className="p-12 text-center text-gray-400">Loading orders...</div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center">
            <ShoppingCart className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No orders found.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Order Reference</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Customer Info</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                  <th className="text-right px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.map((order, index) => (
                  <motion.tr
                    key={order.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: index * 0.03 }}
                    className="hover:bg-gray-50"
                  >
                    <td className="px-6 py-4">
                      {/* Shortens the raw UUID string to form a clean tracking reference badge */}
                      <p className="text-sm font-mono font-medium text-gray-900 uppercase">
                        #{order.id.substring(0, 8)}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-medium text-gray-700">
                        {order.shipping_address?.first_name || ""} {order.shipping_address?.last_name || ""}
                      </p>
                      <p className="text-xs text-gray-400">{order.email}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-gray-500">
                        {new Date(order.created_at).toLocaleDateString()}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <select
                        value={order.status}
                        onChange={(e) => updateStatus(order.id, e.target.value)}
                        className={`text-xs px-2.5 py-1 rounded-full border-0 cursor-pointer ${
                          statusColors[order.status] || "bg-gray-100 text-gray-600"
                        }`}
                      >
                        <option value="pending">Pending</option>
                        <option value="processing">Processing</option>
                        <option value="shipped">Shipped</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>
                    <td className="px-6 py-4">
                      {/* FIXED: Uses total_amount parameter to display values safely */}
                      <span className="text-sm font-medium">{formatCurrency(order.total_amount)}</span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Button variant="ghost" size="sm" className="text-xs">
                        <Eye className="h-3.5 w-3.5 mr-1" />
                        Details
                      </Button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}