"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Search, Eye, Package, Truck, ShoppingBag, User } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/client"
import { formatCurrency } from "@/lib/utils"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"

interface CustomerOrder {
  id: string
  email: string
  status: string
  total_amount: number
  shipping_cost: number
  created_at: string
  tracking_number?: string
  shipping_address?: {
    first_name?: string
    last_name?: string
    phone?: string
    address?: string
  }
}

interface CustomerProfile {
  email: string
  full_name: string
  phone: string
  address: string
  orderCount: number
  goodsSpent: number
  shippingSpent: number
  totalSpent: number
  lastOrderDate: string
  orders: CustomerOrder[]
}

interface CatalogVariant {
  id: string
  product_name: string
  variant_name: string
}

const statusColors: Record<string, string> = {
  draft: "bg-gray-100 text-gray-600",
  reserved: "bg-orange-100 text-orange-800",
  pending: "bg-yellow-100 text-yellow-800",
  processing: "bg-blue-100 text-blue-800",
  shipped: "bg-indigo-100 text-indigo-800",
  completed: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
  returned: "bg-red-100 text-red-800",
}

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<CustomerProfile[]>([])
  const [catalogVariants, setCatalogVariants] = useState<CatalogVariant[]>([])
  const [search, setSearch] = useState("")
  const [isLoading, setIsLoading] = useState(true)

  const [selectedCustomer, setSelectedCustomer] = useState<CustomerProfile | null>(null)
  const [customerOrderItems, setCustomerOrderItems] = useState<Record<string, any[]>>({})
  const [isLoadingItems, setIsLoadingItems] = useState(false)

  const supabase = createClient()

  useEffect(() => {
    const load = async () => {
      setIsLoading(true)

      const [{ data: ordersData }, { data: variantsData }] = await Promise.all([
        supabase
          .from("orders")
          .select("id, email, status, total_amount, shipping_cost, created_at, tracking_number, shipping_address")
          .order("created_at", { ascending: false }),
        supabase
          .from("product_variants")
          .select("id, attributes, products(name)"),
      ])

      if (variantsData) {
        const formattedVariants = variantsData.map((v: any) => ({
          id: v.id,
          product_name: v.products?.name || "Unknown Product",
          variant_name: v.attributes ? Object.values(v.attributes).join(" / ") : "Standard",
        }))
        setCatalogVariants(formattedVariants)
      }

      const customerMap = new Map<string, CustomerProfile>()

      ordersData?.forEach((o: CustomerOrder) => {
        if (!o.email) return
        const emailKey = o.email.trim().toLowerCase()
        const orderTotal = Number(o.total_amount) || 0
        const orderShipping = Number(o.shipping_cost) || 0
        const orderGoods = Math.max(0, orderTotal - orderShipping)
        const isCancelledOrReturned = ["cancelled", "returned"].includes((o.status || "").toLowerCase())

        const firstName = o.shipping_address?.first_name?.trim() || ""
        const lastName = o.shipping_address?.last_name?.trim() || ""
        const fullName = `${firstName} ${lastName}`.trim()

        if (!customerMap.has(emailKey)) {
          customerMap.set(emailKey, {
            email: emailKey,
            full_name: fullName,
            phone: o.shipping_address?.phone || "",
            address: o.shipping_address?.address || "",
            orderCount: 1,
            goodsSpent: isCancelledOrReturned ? 0 : orderGoods,
            shippingSpent: isCancelledOrReturned ? 0 : orderShipping,
            totalSpent: isCancelledOrReturned ? 0 : orderTotal,
            lastOrderDate: o.created_at,
            orders: [o],
          })
        } else {
          const existing = customerMap.get(emailKey)!
          existing.orders.push(o)
          existing.orderCount += 1

          if (!existing.full_name && fullName) existing.full_name = fullName
          if (!existing.phone && o.shipping_address?.phone) existing.phone = o.shipping_address.phone
          if (!existing.address && o.shipping_address?.address) existing.address = o.shipping_address.address

          if (!isCancelledOrReturned) {
            existing.goodsSpent += orderGoods
            existing.shippingSpent += orderShipping
            existing.totalSpent += orderTotal
          }
        }
      })

      setCustomers(Array.from(customerMap.values()))
      setIsLoading(false)
    }

    load()
  }, [])

  const handleOpenCustomer = async (customer: CustomerProfile) => {
    setSelectedCustomer(customer)
    setCustomerOrderItems({})
    setIsLoadingItems(true)

    const orderIds = customer.orders.map((o) => o.id)
    if (orderIds.length > 0) {
      const { data, error } = await supabase
        .from("order_items")
        .select("*")
        .in("order_id", orderIds)

      if (error) {
        console.error("Failed to load customer order items:", error)
      }

      if (data) {
        const grouped: Record<string, any[]> = {}
        data.forEach((item: any) => {
          const catalogMatch = catalogVariants.find((v) => v.id === item.product_variant_id)
          const resolvedItem = {
            ...item,
            resolved_product_name: item.product_name || catalogMatch?.product_name || "Product",
            resolved_variant_name: item.variant_name || catalogMatch?.variant_name || "Standard",
          }

          if (!grouped[item.order_id]) grouped[item.order_id] = []
          grouped[item.order_id].push(resolvedItem)
        })
        setCustomerOrderItems(grouped)
      }
    }

    setIsLoadingItems(false)
  }

  const filtered = customers.filter((c) => {
    const q = search.toLowerCase().trim()
    if (!q) return true
    return (
      (c.full_name || "").toLowerCase().includes(q) ||
      (c.email || "").toLowerCase().includes(q) ||
      (c.phone || "").toLowerCase().includes(q)
    )
  })

  const totalGoodsRevenue = customers.reduce((sum, c) => sum + c.goodsSpent, 0)
  const totalShippingRevenue = customers.reduce((sum, c) => sum + c.shippingSpent, 0)
  const totalCombinedRevenue = customers.reduce((sum, c) => sum + c.totalSpent, 0)

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto px-4 py-2">
      <div>
        <h1 className="text-3xl font-black tracking-tight uppercase">Customers</h1>
        <p className="text-xs font-mono text-gray-500 mt-1 uppercase">
          Verified Directory: {customers.length} Unique Profiles
        </p>
      </div>

      {/* Storewide Customer Spend Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-zinc-200 p-4">
          <div className="text-[10px] font-mono uppercase tracking-widest text-zinc-400">Active Customers</div>
          <div className="text-2xl font-black mt-1">{customers.length}</div>
        </div>
        <div className="bg-white border border-zinc-200 p-4">
          <div className="text-[10px] font-mono uppercase tracking-widest text-zinc-400">Total Goods Value</div>
          <div className="text-2xl font-black mt-1">{formatCurrency(totalGoodsRevenue)}</div>
        </div>
        <div className="bg-white border border-zinc-200 p-4">
          <div className="text-[10px] font-mono uppercase tracking-widest text-zinc-400">Total Shipping Value</div>
          <div className="text-2xl font-black mt-1">{formatCurrency(totalShippingRevenue)}</div>
        </div>
        <div className="bg-white border border-zinc-200 p-4">
          <div className="text-[10px] font-mono uppercase tracking-widest text-zinc-400">Combined Lifetime Spend</div>
          <div className="text-2xl font-black mt-1">{formatCurrency(totalCombinedRevenue)}</div>
        </div>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search customers by name, email, or phone..."
          className="pl-9 bg-white rounded-none border-zinc-200 h-11 text-sm"
        />
      </div>

      <div className="bg-white border border-zinc-200 rounded-none overflow-hidden shadow-sm">
        {isLoading ? (
          <div className="p-16 text-center text-xs font-mono text-gray-400 uppercase tracking-widest">
            Polling Customer Ledger...
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-16 text-center text-xs font-mono text-gray-400 uppercase tracking-widest">
            No customer records match.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left border-collapse">
              <thead className="bg-zinc-50 border-b border-zinc-200 text-[11px] font-mono uppercase text-zinc-500 tracking-wider">
                <tr>
                  <th className="px-6 py-4">Customer</th>
                  <th className="px-6 py-4">Email</th>
                  <th className="px-6 py-4 text-center">Orders</th>
                  <th className="px-6 py-4 text-right">Goods Spent</th>
                  <th className="px-6 py-4 text-right">Shipping</th>
                  <th className="px-6 py-4 text-right">Total Spent</th>
                  <th className="px-6 py-4 text-right">History</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {filtered.map((c, index) => (
                  <motion.tr
                    key={c.email}
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.015 }}
                    onClick={() => handleOpenCustomer(c)}
                    className="hover:bg-zinc-50/80 cursor-pointer transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="font-semibold text-zinc-900">{c.full_name || "Guest User"}</div>
                      {c.phone && <div className="text-[11px] font-mono text-zinc-400">{c.phone}</div>}
                    </td>
                    <td className="px-6 py-4 text-zinc-500 font-mono text-xs">{c.email}</td>
                    <td className="px-6 py-4 text-center">
                      <span className="inline-flex items-center px-2.5 py-0.5 text-xs font-mono font-bold bg-zinc-100 text-zinc-800">
                        {c.orderCount}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right font-mono text-xs text-zinc-700">
                      {formatCurrency(c.goodsSpent)}
                    </td>
                    <td className="px-6 py-4 text-right font-mono text-xs text-zinc-500">
                      {formatCurrency(c.shippingSpent)}
                    </td>
                    <td className="px-6 py-4 text-right font-bold text-zinc-900">
                      {formatCurrency(c.totalSpent)}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 text-xs font-medium text-zinc-500 rounded-none"
                      >
                        <Eye className="h-3.5 w-3.5 mr-1.5" /> View
                      </Button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Customer Detail & Order History Drawer */}
      <Sheet open={!!selectedCustomer} onOpenChange={(open) => !open && setSelectedCustomer(null)}>
        <SheetContent className="sm:max-w-2xl w-full overflow-y-auto bg-white rounded-none border-l border-zinc-200 p-8 space-y-6">
          {selectedCustomer && (
            <>
              <SheetHeader className="space-y-1 border-b border-zinc-100 pb-5">
                <div className="text-[10px] font-mono tracking-widest text-zinc-400 uppercase flex items-center gap-1.5">
                  <User className="h-3 w-3" /> Customer Financial Profile
                </div>
                <SheetTitle className="text-2xl font-black uppercase tracking-tight">
                  {selectedCustomer.full_name || "Guest User"}
                </SheetTitle>
                <div className="text-xs font-mono text-zinc-500 space-y-0.5 pt-1">
                  <div>{selectedCustomer.email}</div>
                  {selectedCustomer.phone && <div>Tel: {selectedCustomer.phone}</div>}
                  {selectedCustomer.address && <div>Location: {selectedCustomer.address}</div>}
                </div>
              </SheetHeader>

              {/* Financial Breakdown Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="bg-zinc-50 border border-zinc-200 p-3">
                  <div className="text-[10px] font-mono uppercase text-zinc-400 flex items-center gap-1">
                    <ShoppingBag className="h-3 w-3" /> Orders
                  </div>
                  <div className="text-lg font-black mt-1">{selectedCustomer.orderCount}</div>
                </div>
                <div className="bg-zinc-50 border border-zinc-200 p-3">
                  <div className="text-[10px] font-mono uppercase text-zinc-400 flex items-center gap-1">
                    <Package className="h-3 w-3" /> Goods
                  </div>
                  <div className="text-lg font-black mt-1">{formatCurrency(selectedCustomer.goodsSpent)}</div>
                </div>
                <div className="bg-zinc-50 border border-zinc-200 p-3">
                  <div className="text-[10px] font-mono uppercase text-zinc-400 flex items-center gap-1">
                    <Truck className="h-3 w-3" /> Shipping
                  </div>
                  <div className="text-lg font-black mt-1">{formatCurrency(selectedCustomer.shippingSpent)}</div>
                </div>
                <div className="bg-black text-white p-3">
                  <div className="text-[10px] font-mono uppercase text-zinc-400">Total Spent</div>
                  <div className="text-lg font-black mt-1">{formatCurrency(selectedCustomer.totalSpent)}</div>
                </div>
              </div>

              <p className="text-[10px] font-mono text-zinc-400 uppercase">
                * Totals exclude cancelled and returned orders.
              </p>

              {/* Complete Order History */}
              <div className="space-y-3">
                <h3 className="text-[11px] font-mono font-bold tracking-widest uppercase text-zinc-400">
                  Order Manifest History ({selectedCustomer.orders.length})
                </h3>

                <div className="space-y-3">
                  {selectedCustomer.orders.map((order) => {
                    const orderTotal = Number(order.total_amount) || 0
                    const orderShipping = Number(order.shipping_cost) || 0
                    const orderGoods = Math.max(0, orderTotal - orderShipping)
                    const items = customerOrderItems[order.id] || []

                    return (
                      <div key={order.id} className="border border-zinc-200 bg-white p-4 space-y-3">
                        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-zinc-100 pb-3">
                          <div>
                            <span className="font-mono text-xs font-bold uppercase text-black">
                              #{order.id.substring(0, 8)}
                            </span>
                            <span className="text-xs font-mono text-zinc-400 ml-3">
                              {new Date(order.created_at).toLocaleDateString()}
                            </span>
                          </div>
                          <span
                            className={`text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-1 rounded-full ${
                              statusColors[order.status] || "bg-gray-100 text-gray-600"
                            }`}
                          >
                            {order.status}
                          </span>
                        </div>

                        {/* Line items inside this order */}
                        <div className="divide-y divide-zinc-100">
                          {isLoadingItems ? (
                            <div className="py-2 text-[11px] font-mono text-zinc-400">Loading items...</div>
                          ) : items.length === 0 ? (
                            <div className="py-2 text-[11px] font-mono text-zinc-400">No line items recorded.</div>
                          ) : (
                            items.map((item: any) => (
                              <div key={item.id} className="py-2 flex items-center justify-between text-xs gap-3">
                                <div>
                                  <div className="font-bold uppercase text-zinc-900">
                                    {item.resolved_product_name}
                                  </div>
                                  <div className="text-[10px] font-mono text-zinc-500 uppercase">
                                    {item.resolved_variant_name} • QTY: {item.quantity} × {formatCurrency(Number(item.price) || 0)}
                                  </div>
                                </div>
                                <span className="font-mono font-bold text-zinc-900 shrink-0">
                                  {formatCurrency((Number(item.price) || 0) * (Number(item.quantity) || 1))}
                                </span>
                              </div>
                            ))
                          )}
                        </div>

                        {/* Separate Goods vs Shipping breakdown per order */}
                        <div className="pt-2 border-t border-zinc-100 flex flex-wrap justify-between items-center text-xs font-mono gap-2 bg-zinc-50 px-3 py-2">
                          <div className="text-zinc-500">
                            Goods: <span className="text-zinc-900 font-semibold">{formatCurrency(orderGoods)}</span>
                          </div>
                          <div className="text-zinc-500">
                            Shipping: <span className="text-zinc-900 font-semibold">{formatCurrency(orderShipping)}</span>
                          </div>
                          <div className="font-bold text-black">
                            Total: {formatCurrency(orderTotal)}
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  )
}