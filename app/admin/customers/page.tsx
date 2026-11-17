"use client"

import { useState, useEffect, useMemo } from "react"
import { motion } from "framer-motion"
import {
  Search,
  Eye,
  Edit2,
  Check,
  X,
  ShoppingBag,
  Package,
  Truck,
  CreditCard,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { createClient } from "@/lib/supabase/client"
import { formatCurrency } from "@/lib/utils"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"

interface OrderItemRecord {
  id: string
  order_id: string
  product_variant_id: string
  quantity: number
  price: number
  product_name?: string
  variant_name?: string
}

interface OrderRecord {
  id: string
  email: string
  status: string
  total_amount: number
  shipping_cost: number
  discount_amount?: number
  created_at: string
  shipping_address?: {
    first_name?: string
    last_name?: string
    phone?: string
    address?: string
    [key: string]: any
  }
}

interface CustomerProfile {
  email: string
  first_name: string
  last_name: string
  full_name: string
  phone: string
  address: string
  valid_order_count: number
  total_order_count: number
  goods_spend: number
  shipping_spend: number
  total_spend: number
  last_order_date: string
  orders: OrderRecord[]
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

const MONTHS = [
  { value: "0", label: "January" },
  { value: "1", label: "February" },
  { value: "2", label: "March" },
  { value: "3", label: "April" },
  { value: "4", label: "May" },
  { value: "5", label: "June" },
  { value: "6", label: "July" },
  { value: "7", label: "August" },
  { value: "8", label: "September" },
  { value: "9", label: "October" },
  { value: "10", label: "November" },
  { value: "11", label: "December" },
]

function isExcludedStatus(status: string): boolean {
  const normalized = (status || "").toLowerCase().trim()
  return normalized === "cancelled" || normalized === "returned"
}

function buildCustomerProfiles(orderList: OrderRecord[]): CustomerProfile[] {
  const map = new Map<string, CustomerProfile>()

  // Orders are sorted newest-first so the most recent non-empty contact info wins
  orderList.forEach((order) => {
    if (!order.email) return
    const emailKey = order.email.trim().toLowerCase()
    const excluded = isExcludedStatus(order.status)

    const shipping = Number(order.shipping_cost) || 0
    const total = Number(order.total_amount) || 0
    const goods = Math.max(0, total - shipping)

    const fName = (order.shipping_address?.first_name || "").trim()
    const lName = (order.shipping_address?.last_name || "").trim()
    const phone = (order.shipping_address?.phone || "").trim()
    const address = (order.shipping_address?.address || "").trim()

    if (!map.has(emailKey)) {
      const combinedName = `${fName} ${lName}`.trim()
      map.set(emailKey, {
        email: emailKey,
        first_name: fName,
        last_name: lName,
        full_name: combinedName || emailKey,
        phone,
        address,
        valid_order_count: excluded ? 0 : 1,
        total_order_count: 1,
        goods_spend: excluded ? 0 : goods,
        shipping_spend: excluded ? 0 : shipping,
        total_spend: excluded ? 0 : total,
        last_order_date: order.created_at,
        orders: [order],
      })
    } else {
      const existing = map.get(emailKey)!
      existing.total_order_count += 1
      existing.orders.push(order)

      if (!excluded) {
        existing.valid_order_count += 1
        existing.goods_spend += goods
        existing.shipping_spend += shipping
        existing.total_spend += total
      }

      if (!existing.first_name && fName) existing.first_name = fName
      if (!existing.last_name && lName) existing.last_name = lName
      const updatedFull = `${existing.first_name} ${existing.last_name}`.trim()
      if (updatedFull) existing.full_name = updatedFull

      if (!existing.phone && phone) existing.phone = phone
      if (!existing.address && address) existing.address = address

      if (new Date(order.created_at) > new Date(existing.last_order_date)) {
        existing.last_order_date = order.created_at
      }
    }
  })

  return Array.from(map.values()).sort((a, b) => b.total_spend - a.total_spend)
}

export default function AdminCustomersPage() {
  const [orders, setOrders] = useState<OrderRecord[]>([])
  const [orderItemsMap, setOrderItemsMap] = useState<Record<string, OrderItemRecord[]>>({})
  const [isLoading, setIsLoading] = useState(true)

  // Filters
  const [search, setSearch] = useState("")
  const [selectedYear, setSelectedYear] = useState<string>("all")
  const [selectedMonth, setSelectedMonth] = useState<string>("all")
  const [dateFrom, setDateFrom] = useState<string>("")
  const [dateTo, setDateTo] = useState<string>("")

  // Selected Customer Drawer States
  const [selectedCustomerEmail, setSelectedCustomerEmail] = useState<string | null>(null)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [drawerScope, setDrawerScope] = useState<"period" | "all">("period")

  // Edit Customer Details States
  const [isEditingCustomer, setIsEditingCustomer] = useState(false)
  const [editFirstName, setEditFirstName] = useState("")
  const [editLastName, setEditLastName] = useState("")
  const [editEmail, setEditEmail] = useState("")
  const [editPhone, setEditPhone] = useState("")
  const [editAddress, setEditAddress] = useState("")
  const [isSavingCustomer, setIsSavingCustomer] = useState(false)

  const supabase = createClient()

  const loadData = async () => {
    setIsLoading(true)
    const [{ data: ordersData }, { data: itemsData }, { data: variantsData }] = await Promise.all([
      supabase.from("orders").select("*").order("created_at", { ascending: false }),
      supabase.from("order_items").select("*"),
      supabase.from("product_variants").select("id, attributes, products(name)"),
    ])

    const variantLookup = new Map<string, { product_name: string; variant_name: string }>()
    if (variantsData) {
      variantsData.forEach((v: any) => {
        variantLookup.set(v.id, {
          product_name: v.products?.name || "Item",
          variant_name: v.attributes ? Object.values(v.attributes).join(" / ") : "Standard",
        })
      })
    }

    if (itemsData) {
      const grouped: Record<string, OrderItemRecord[]> = {}
      itemsData.forEach((item: any) => {
        const fallback = variantLookup.get(item.product_variant_id)
        const formatted: OrderItemRecord = {
          id: item.id,
          order_id: item.order_id,
          product_variant_id: item.product_variant_id,
          quantity: Number(item.quantity) || 1,
          price: Number(item.price) || 0,
          product_name: item.product_name || fallback?.product_name || "Product",
          variant_name: item.variant_name || fallback?.variant_name || "Standard",
        }
        if (!grouped[item.order_id]) grouped[item.order_id] = []
        grouped[item.order_id].push(formatted)
      })
      setOrderItemsMap(grouped)
    }

    if (ordersData) {
      setOrders(ordersData as OrderRecord[])
    }
    setIsLoading(false)
  }

  useEffect(() => {
    loadData()
  }, [])

  const availableYears = useMemo(() => {
    const years = new Set<string>()
    orders.forEach((o) => {
      if (o.created_at) {
        years.add(String(new Date(o.created_at).getFullYear()))
      }
    })
    return Array.from(years).sort((a, b) => Number(b) - Number(a))
  }, [orders])

  const hasActiveDateFilter =
    selectedYear !== "all" || selectedMonth !== "all" || Boolean(dateFrom) || Boolean(dateTo)

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const created = new Date(order.created_at)
      if (isNaN(created.getTime())) return false

      if (selectedYear !== "all" && String(created.getFullYear()) !== selectedYear) {
        return false
      }
      if (selectedMonth !== "all" && String(created.getMonth()) !== selectedMonth) {
        return false
      }
      if (dateFrom) {
        const start = new Date(`${dateFrom}T00:00:00`)
        if (created < start) return false
      }
      if (dateTo) {
        const end = new Date(`${dateTo}T23:59:59.999`)
        if (created > end) return false
      }
      return true
    })
  }, [orders, selectedYear, selectedMonth, dateFrom, dateTo])

  const periodCustomers = useMemo(() => buildCustomerProfiles(filteredOrders), [filteredOrders])
  const allTimeCustomers = useMemo(() => buildCustomerProfiles(orders), [orders])

  const searchedCustomers = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return periodCustomers
    return periodCustomers.filter(
      (c) =>
        c.full_name.toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q) ||
        c.phone.toLowerCase().includes(q) ||
        c.address.toLowerCase().includes(q)
    )
  }, [periodCustomers, search])

  const kpiStats = useMemo(() => {
    let goods = 0
    let shipping = 0
    let gross = 0
    searchedCustomers.forEach((c) => {
      goods += c.goods_spend
      shipping += c.shipping_spend
      gross += c.total_spend
    })
    return {
      activeCount: searchedCustomers.length,
      goods,
      shipping,
      gross,
    }
  }, [searchedCustomers])

  const activeDrawerCustomer = useMemo(() => {
    if (!selectedCustomerEmail) return null
    const sourceList = hasActiveDateFilter && drawerScope === "period" ? periodCustomers : allTimeCustomers
    return (
      sourceList.find((c) => c.email === selectedCustomerEmail) ||
      allTimeCustomers.find((c) => c.email === selectedCustomerEmail) ||
      null
    )
  }, [selectedCustomerEmail, hasActiveDateFilter, drawerScope, periodCustomers, allTimeCustomers])

  const handleOpenCustomer = (customer: CustomerProfile) => {
    setSelectedCustomerEmail(customer.email)
    setDrawerScope(hasActiveDateFilter ? "period" : "all")
    setIsEditingCustomer(false)
    setIsDrawerOpen(true)
  }

  const handleStartEditCustomer = () => {
    if (!activeDrawerCustomer) return
    setEditFirstName(activeDrawerCustomer.first_name)
    setEditLastName(activeDrawerCustomer.last_name)
    setEditEmail(activeDrawerCustomer.email)
    setEditPhone(activeDrawerCustomer.phone)
    setEditAddress(activeDrawerCustomer.address)
    setIsEditingCustomer(true)
  }

  const handleCancelEditCustomer = () => {
    setIsEditingCustomer(false)
  }

  const handleSaveCustomerDetails = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedCustomerEmail || !activeDrawerCustomer) return

    const normalizedNewEmail = editEmail.trim().toLowerCase()
    if (!normalizedNewEmail || !normalizedNewEmail.includes("@")) {
      return alert("Please enter a valid email address.")
    }

    const updatedFirstName = editFirstName.trim()
    const updatedLastName = editLastName.trim()
    const updatedPhone = editPhone.trim()
    const updatedAddress = editAddress.trim()

    const matchingOrders = orders.filter(
      (o) => (o.email || "").trim().toLowerCase() === selectedCustomerEmail
    )

    if (matchingOrders.length === 0) return

    setIsSavingCustomer(true)

    try {
      for (const order of matchingOrders) {
        const mergedShippingAddress = {
          ...(order.shipping_address || {}),
          first_name: updatedFirstName,
          last_name: updatedLastName,
          phone: updatedPhone,
          address: updatedAddress,
        }

        const { error } = await supabase
          .from("orders")
          .update({
            email: normalizedNewEmail,
            shipping_address: mergedShippingAddress,
          })
          .eq("id", order.id)

        if (error) {
          throw new Error(error.message)
        }
      }

      // Sync local orders state immediately so directory and drawer update live
      setOrders((prev) =>
        prev.map((order) => {
          if ((order.email || "").trim().toLowerCase() !== selectedCustomerEmail) {
            return order
          }
          return {
            ...order,
            email: normalizedNewEmail,
            shipping_address: {
              ...(order.shipping_address || {}),
              first_name: updatedFirstName,
              last_name: updatedLastName,
              phone: updatedPhone,
              address: updatedAddress,
            },
          }
        })
      )

      setSelectedCustomerEmail(normalizedNewEmail)
      setIsEditingCustomer(false)
    } catch (err: any) {
      alert(`Failed to update customer profile: ${err.message || "Unknown error"}`)
    } finally {
      setIsSavingCustomer(false)
    }
  }

  const existingEmailCollision =
    isEditingCustomer &&
    editEmail.trim().toLowerCase() !== selectedCustomerEmail &&
    allTimeCustomers.some((c) => c.email === editEmail.trim().toLowerCase())

  const periodBadgeLabel = useMemo(() => {
    const parts: string[] = []
    if (selectedYear !== "all") parts.push(selectedYear)
    if (selectedMonth !== "all") {
      const m = MONTHS.find((item) => item.value === selectedMonth)
      if (m) parts.push(m.label.toUpperCase())
    }
    if (dateFrom || dateTo) {
      parts.push(`${dateFrom || "START"} → ${dateTo || "PRESENT"}`)
    }
    return parts.length > 0 ? parts.join(" • ") : "ALL TIME"
  }, [selectedYear, selectedMonth, dateFrom, dateTo])

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto px-4 py-2">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight uppercase">Customers</h1>
          <p className="text-xs font-mono text-zinc-500 mt-1 uppercase">
            Verified Directory: {searchedCustomers.length} Unique Profiles • Period: {periodBadgeLabel}
          </p>
        </div>

        {hasActiveDateFilter && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setSelectedYear("all")
              setSelectedMonth("all")
              setDateFrom("")
              setDateTo("")
            }}
            className="h-9 text-[11px] font-mono uppercase rounded-none border-zinc-300"
          >
            <X className="h-3.5 w-3.5 mr-1.5" /> Reset Date Filters
          </Button>
        )}
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-zinc-200 p-5">
          <div className="text-[10px] font-mono uppercase tracking-widest text-zinc-400">Active Customers</div>
          <div className="text-2xl font-black mt-1">{kpiStats.activeCount}</div>
        </div>
        <div className="bg-white border border-zinc-200 p-5">
          <div className="text-[10px] font-mono uppercase tracking-widest text-zinc-400">Total Goods Value</div>
          <div className="text-2xl font-black mt-1">{formatCurrency(kpiStats.goods)}</div>
        </div>
        <div className="bg-white border border-zinc-200 p-5">
          <div className="text-[10px] font-mono uppercase tracking-widest text-zinc-400">Total Shipping</div>
          <div className="text-2xl font-black mt-1">{formatCurrency(kpiStats.shipping)}</div>
        </div>
        <div className="bg-black text-white p-5">
          <div className="text-[10px] font-mono uppercase tracking-widest text-zinc-400">Total Gross Spend</div>
          <div className="text-2xl font-black mt-1">{formatCurrency(kpiStats.gross)}</div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white border border-zinc-200 p-4 grid grid-cols-1 md:grid-cols-12 gap-3 items-end">
        <div className="md:col-span-4 space-y-1">
          <label className="text-[10px] font-mono uppercase tracking-widest text-zinc-400 block">
            Customer Search
          </label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, email, or phone..."
              className="pl-9 bg-white rounded-none border-zinc-200 h-10 text-sm"
            />
          </div>
        </div>

        <div className="md:col-span-2 space-y-1">
          <label className="text-[10px] font-mono uppercase tracking-widest text-zinc-400 block">Year</label>
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            className="w-full h-10 border border-zinc-200 bg-white px-3 text-xs font-mono uppercase text-zinc-800 rounded-none focus:outline-none focus:border-black"
          >
            <option value="all">ALL YEARS</option>
            {availableYears.map((yr) => (
              <option key={yr} value={yr}>
                {yr}
              </option>
            ))}
          </select>
        </div>

        <div className="md:col-span-2 space-y-1">
          <label className="text-[10px] font-mono uppercase tracking-widest text-zinc-400 block">Month</label>
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="w-full h-10 border border-zinc-200 bg-white px-3 text-xs font-mono uppercase text-zinc-800 rounded-none focus:outline-none focus:border-black"
          >
            <option value="all">ALL MONTHS</option>
            {MONTHS.map((m) => (
              <option key={m.value} value={m.value}>
                {m.label.toUpperCase()}
              </option>
            ))}
          </select>
        </div>

        <div className="md:col-span-2 space-y-1">
          <label className="text-[10px] font-mono uppercase tracking-widest text-zinc-400 block">From</label>
          <input
            type="date"
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
            className="w-full h-10 border border-zinc-200 bg-white px-3 text-xs font-mono text-zinc-800 rounded-none focus:outline-none focus:border-black"
          />
        </div>

        <div className="md:col-span-2 space-y-1">
          <label className="text-[10px] font-mono uppercase tracking-widest text-zinc-400 block">To</label>
          <input
            type="date"
            value={dateTo}
            onChange={(e) => setDateTo(e.target.value)}
            className="w-full h-10 border border-zinc-200 bg-white px-3 text-xs font-mono text-zinc-800 rounded-none focus:outline-none focus:border-black"
          />
        </div>
      </div>

      {/* Customers Table */}
      <div className="bg-white rounded-none border border-zinc-200 overflow-hidden shadow-sm">
        {isLoading ? (
          <div className="p-16 text-center text-xs font-mono text-gray-400 uppercase tracking-widest">
            Indexing Customer Profiles...
          </div>
        ) : searchedCustomers.length === 0 ? (
          <div className="p-16 text-center text-xs font-mono text-gray-400 uppercase tracking-widest">
            No customer records match active parameters.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-zinc-200 bg-zinc-50 text-[11px] font-mono uppercase text-zinc-500 tracking-wider">
                  <th className="px-6 py-4">Customer</th>
                  <th className="px-6 py-4">Email</th>
                  <th className="px-6 py-4 text-center">Orders</th>
                  <th className="px-6 py-4">Goods Spend</th>
                  <th className="px-6 py-4">Shipping</th>
                  <th className="px-6 py-4">Total Spend</th>
                  <th className="px-6 py-4">Last Activity</th>
                  <th className="px-6 py-4 text-right">Ledger</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 text-sm">
                {searchedCustomers.map((cust, idx) => (
                  <motion.tr
                    key={cust.email}
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.015 }}
                    onClick={() => handleOpenCustomer(cust)}
                    className="hover:bg-zinc-50/70 cursor-pointer"
                  >
                    <td className="px-6 py-4">
                      <div className="font-semibold text-zinc-900">{cust.full_name}</div>
                      <div className="text-xs font-mono text-zinc-400">{cust.phone || "No phone"}</div>
                    </td>
                    <td className="px-6 py-4 font-mono text-xs text-zinc-600">{cust.email}</td>
                    <td className="px-6 py-4 text-center">
                      <span className="inline-flex items-center justify-center min-w-[28px] h-7 px-2 bg-zinc-100 font-mono text-xs font-bold text-zinc-800">
                        {cust.valid_order_count}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-mono text-xs text-zinc-700">
                      {formatCurrency(cust.goods_spend)}
                    </td>
                    <td className="px-6 py-4 font-mono text-xs text-zinc-500">
                      {formatCurrency(cust.shipping_spend)}
                    </td>
                    <td className="px-6 py-4 font-bold text-zinc-900">{formatCurrency(cust.total_spend)}</td>
                    <td className="px-6 py-4 font-mono text-xs text-zinc-500">
                      {new Date(cust.last_order_date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Button variant="ghost" size="sm" className="h-8 text-xs font-medium text-zinc-500 rounded-none">
                        <Eye className="h-3.5 w-3.5 mr-1.5" /> Inspect
                      </Button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Customer Financial Profile & Edit Drawer */}
      <Sheet
        open={isDrawerOpen}
        onOpenChange={(open) => {
          setIsDrawerOpen(open)
          if (!open) setIsEditingCustomer(false)
        }}
      >
        <SheetContent className="sm:max-w-xl w-full overflow-y-auto bg-white rounded-none border-l border-zinc-200 p-8 space-y-6">
          {activeDrawerCustomer && (
            <>
              <SheetHeader className="space-y-3 border-b border-zinc-100 pb-6">
                <div className="flex items-center justify-between pr-6">
                  <div className="text-[10px] font-mono tracking-widest text-zinc-400 uppercase">
                    Customer Financial Profile
                  </div>
                  {!isEditingCustomer && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={handleStartEditCustomer}
                      className="h-7 px-2.5 text-[10px] font-mono uppercase rounded-none border-zinc-300 hover:bg-black hover:text-white"
                    >
                      <Edit2 className="h-3 w-3 mr-1" /> Edit Details
                    </Button>
                  )}
                </div>

                {!isEditingCustomer ? (
                  <div className="space-y-1.5 text-left">
                    <SheetTitle className="text-2xl font-black uppercase tracking-tight">
                      {activeDrawerCustomer.full_name}
                    </SheetTitle>
                    <div className="text-xs font-mono text-zinc-600 space-y-1 pt-1">
                      <div>{activeDrawerCustomer.email}</div>
                      <div>Tel: {activeDrawerCustomer.phone || "N/A"}</div>
                      <div>Location: {activeDrawerCustomer.address || "N/A"}</div>
                    </div>
                  </div>
                ) : (
                  <form
                    onSubmit={handleSaveCustomerDetails}
                    className="bg-zinc-50 border border-zinc-200 p-4 space-y-3 text-left"
                  >
                    <div className="text-[10px] font-mono font-bold uppercase tracking-widest text-zinc-500">
                      Edit Customer Contact & Location
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-[9px] font-mono uppercase text-zinc-400 block mb-1">
                          First Name
                        </label>
                        <Input
                          required
                          value={editFirstName}
                          onChange={(e) => setEditFirstName(e.target.value)}
                          placeholder="First Name"
                          className="h-9 text-xs rounded-none bg-white border-zinc-300"
                        />
                      </div>
                      <div>
                        <label className="text-[9px] font-mono uppercase text-zinc-400 block mb-1">
                          Last Name
                        </label>
                        <Input
                          required
                          value={editLastName}
                          onChange={(e) => setEditLastName(e.target.value)}
                          placeholder="Last Name"
                          className="h-9 text-xs rounded-none bg-white border-zinc-300"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-[9px] font-mono uppercase text-zinc-400 block mb-1">
                        Email Address
                      </label>
                      <Input
                        type="email"
                        required
                        value={editEmail}
                        onChange={(e) => setEditEmail(e.target.value)}
                        placeholder="Email Address"
                        className="h-9 text-xs font-mono rounded-none bg-white border-zinc-300"
                      />
                    </div>

                    {existingEmailCollision && (
                      <div className="bg-amber-50 border border-amber-200 px-3 py-2 text-[11px] font-mono text-amber-800">
                        Note: Another profile already uses this email. Saving will merge all orders into that profile.
                      </div>
                    )}

                    <div>
                      <label className="text-[9px] font-mono uppercase text-zinc-400 block mb-1">
                        Phone / Contact Number
                      </label>
                      <Input
                        type="tel"
                        value={editPhone}
                        onChange={(e) => setEditPhone(e.target.value)}
                        placeholder="+2547..."
                        className="h-9 text-xs font-mono rounded-none bg-white border-zinc-300"
                      />
                    </div>

                    <div>
                      <label className="text-[9px] font-mono uppercase text-zinc-400 block mb-1">
                        Location / Delivery Address
                      </label>
                      <Input
                        value={editAddress}
                        onChange={(e) => setEditAddress(e.target.value)}
                        placeholder="Apartment, Street, Area, City..."
                        className="h-9 text-xs rounded-none bg-white border-zinc-300"
                      />
                    </div>

                    <div className="flex items-center justify-end gap-2 pt-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        disabled={isSavingCustomer}
                        onClick={handleCancelEditCustomer}
                        className="h-8 px-3 text-[10px] font-mono uppercase rounded-none"
                      >
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        size="sm"
                        disabled={isSavingCustomer}
                        className="h-8 px-4 text-[10px] font-mono uppercase font-bold rounded-none bg-black text-white hover:bg-zinc-800"
                      >
                        <Check className="h-3.5 w-3.5 mr-1" />
                        {isSavingCustomer ? "Saving..." : "Save Profile"}
                      </Button>
                    </div>
                  </form>
                )}

                {hasActiveDateFilter && (
                  <div className="flex items-center gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setDrawerScope("period")}
                      className={`px-3 py-1 text-[10px] font-mono uppercase border ${
                        drawerScope === "period"
                          ? "bg-black text-white border-black font-bold"
                          : "bg-white text-zinc-600 border-zinc-200 hover:border-black"
                      }`}
                    >
                      Filtered Period
                    </button>
                    <button
                      type="button"
                      onClick={() => setDrawerScope("all")}
                      className={`px-3 py-1 text-[10px] font-mono uppercase border ${
                        drawerScope === "all"
                          ? "bg-black text-white border-black font-bold"
                          : "bg-white text-zinc-600 border-zinc-200 hover:border-black"
                      }`}
                    >
                      All-Time History
                    </button>
                  </div>
                )}
              </SheetHeader>

              {/* 4 Summary Metric Boxes */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="border border-zinc-200 p-3.5">
                  <div className="flex items-center gap-1.5 text-[10px] font-mono uppercase text-zinc-400">
                    <ShoppingBag className="h-3 w-3" /> Orders
                  </div>
                  <div className="text-xl font-black mt-1.5">{activeDrawerCustomer.valid_order_count}</div>
                </div>
                <div className="border border-zinc-200 p-3.5">
                  <div className="flex items-center gap-1.5 text-[10px] font-mono uppercase text-zinc-400">
                    <Package className="h-3 w-3" /> Goods
                  </div>
                  <div className="text-lg font-black mt-1.5">
                    {formatCurrency(activeDrawerCustomer.goods_spend)}
                  </div>
                </div>
                <div className="border border-zinc-200 p-3.5">
                  <div className="flex items-center gap-1.5 text-[10px] font-mono uppercase text-zinc-400">
                    <Truck className="h-3 w-3" /> Shipping
                  </div>
                  <div className="text-lg font-black mt-1.5">
                    {formatCurrency(activeDrawerCustomer.shipping_spend)}
                  </div>
                </div>
                <div className="bg-black text-white p-3.5">
                  <div className="flex items-center gap-1.5 text-[10px] font-mono uppercase text-zinc-400">
                    <CreditCard className="h-3 w-3" /> Total Spent
                  </div>
                  <div className="text-lg font-black mt-1.5">
                    {formatCurrency(activeDrawerCustomer.total_spend)}
                  </div>
                </div>
              </div>

              <div className="text-[10px] font-mono uppercase text-zinc-400">
                * Totals exclude cancelled and returned orders.
              </div>

              {/* Order Manifest History */}
              <div className="space-y-3">
                <h3 className="text-[11px] font-mono font-bold tracking-widest uppercase text-zinc-400">
                  Order Manifest History ({activeDrawerCustomer.orders.length})
                </h3>

                <div className="space-y-3">
                  {activeDrawerCustomer.orders.map((ord) => {
                    const items = orderItemsMap[ord.id] || []
                    const shipping = Number(ord.shipping_cost) || 0
                    const total = Number(ord.total_amount) || 0
                    const goods = Math.max(0, total - shipping)

                    return (
                      <div key={ord.id} className="border border-zinc-200 bg-white">
                        <div className="px-4 py-3 border-b border-zinc-100 flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <span className="font-mono text-xs font-bold uppercase text-black">
                              #{ord.id.substring(0, 8)}
                            </span>
                            <span className="font-mono text-xs text-zinc-400">
                              {new Date(ord.created_at).toLocaleDateString()}
                            </span>
                          </div>
                          <span
                            className={`text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${
                              statusColors[ord.status] || "bg-zinc-100 text-zinc-700"
                            }`}
                          >
                            {ord.status}
                          </span>
                        </div>

                        <div className="divide-y divide-zinc-100 px-4">
                          {items.length === 0 ? (
                            <div className="py-3 text-xs font-mono text-zinc-400">No line items recorded.</div>
                          ) : (
                            items.map((item) => (
                              <div key={item.id} className="py-3 flex items-center justify-between text-xs">
                                <div>
                                  <div className="font-bold uppercase text-zinc-900">{item.product_name}</div>
                                  <div className="font-mono text-[10px] text-zinc-500 uppercase mt-0.5">
                                    {item.variant_name} • QTY: {item.quantity} × {formatCurrency(item.price)}
                                  </div>
                                </div>
                                <div className="font-bold font-mono text-zinc-900">
                                  {formatCurrency(item.price * item.quantity)}
                                </div>
                              </div>
                            ))
                          )}
                        </div>

                        <div className="px-4 py-2.5 bg-zinc-50 border-t border-zinc-100 flex items-center justify-between text-xs font-mono">
                          <span className="text-zinc-500">
                            Goods: <strong className="text-zinc-900">{formatCurrency(goods)}</strong>
                          </span>
                          <span className="text-zinc-500">
                            Shipping: <strong className="text-zinc-900">{formatCurrency(shipping)}</strong>
                          </span>
                          <span className="text-zinc-900 font-bold">Total: {formatCurrency(total)}</span>
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