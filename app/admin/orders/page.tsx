"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Eye, Plus, Trash2, Edit2, Search, ArrowLeftRight, UserCheck, X, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { createClient } from "@/lib/supabase/client"
import { formatCurrency } from "@/lib/utils"
import { sendDispatchNotification } from "@/app/actions/email"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"

interface PaymentLog {
  id: string
  amount: number
  date: string
  note?: string
}

interface OrderRow {
  id: string
  email: string
  status: string
  total_amount: number
  shipping_cost: number
  discount_amount?: number
  amount_paid?: number
  payment_logs?: PaymentLog[]
  tax: number
  created_at: string
  tracking_number?: string
  shipping_address: {
    first_name?: string
    last_name?: string
    address?: string
    phone?: string
    [key: string]: any
  }
}

interface OrderItem {
  id: string
  order_id: string
  product_variant_id: string
  quantity: number
  price: number
  products?: { name: string }
  product_variants?: { attributes?: Record<string, string> }
}

interface ProductVariantSelection {
  id: string
  product_id: string
  product_name: string
  variant_name: string
  price: number
  stock_quantity: number
}

interface KnownCustomer {
  email: string
  first_name: string
  last_name: string
  phone: string
  address: string
  order_count: number
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

function getTodayDateInput(): string {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, "0")
  const day = String(now.getDate()).padStart(2, "0")
  return `${year}-${month}-${day}`
}

function formatPaymentDate(dateStr: string): string {
  if (!dateStr) return ""
  const parsed = new Date(`${dateStr}T00:00:00`)
  if (isNaN(parsed.getTime())) return dateStr
  return parsed.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  })
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<OrderRow[]>([])
  const [search, setSearch] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [isEmployee, setIsEmployee] = useState(false)

  const [selectedOrder, setSelectedOrder] = useState<OrderRow | null>(null)
  const [selectedOrderItems, setSelectedOrderItems] = useState<OrderItem[]>([])
  const [isDetailOpen, setIsDetailOpen] = useState(false)
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [isEditingItems, setIsEditingItems] = useState(false)
  const [isEditingTracking, setIsEditingTracking] = useState(false)
  const [trackingInput, setTrackingInput] = useState("")

  // Extra Discount & Partial Payment States inside Order Details Drawer
  const [extraDiscountInput, setExtraDiscountInput] = useState<string>("0")
  const [isSavingDiscount, setIsSavingDiscount] = useState(false)
  const [paymentAmountInput, setPaymentAmountInput] = useState<string>("")
  const [paymentDateInput, setPaymentDateInput] = useState<string>(getTodayDateInput())
  const [paymentNoteInput, setPaymentNoteInput] = useState<string>("")
  const [isSavingPayment, setIsSavingPayment] = useState(false)

  const [allVariants, setAllVariants] = useState<ProductVariantSelection[]>([])
  const [shippingRates, setShippingRates] = useState<any[]>([])
  const [knownCustomers, setKnownCustomers] = useState<KnownCustomer[]>([])

  // Live Customer Search States
  const [customerSearchQuery, setCustomerSearchQuery] = useState("")
  const [linkedCustomerEmail, setLinkedCustomerEmail] = useState<string | null>(null)

  const [variantSearchQuery, setVariantSearchQuery] = useState("")
  const [shippingSearchQuery, setShippingSearchQuery] = useState("")

  const [newOrderEmail, setNewOrderEmail] = useState("")
  const [newOrderFirstName, setNewOrderFirstName] = useState("")
  const [newOrderLastName, setNewOrderLastName] = useState("")
  const [newOrderPhone, setNewOrderPhone] = useState("")
  const [newOrderAddress, setNewOrderAddress] = useState("")
  const [newOrderShippingCost, setNewOrderShippingCost] = useState(0)

  const [newOrderItems, setNewOrderItems] = useState<{ variantId: string; quantity: number; discount?: number }[]>([])
  const [newOrderStatus, setNewOrderStatus] = useState("reserved")

  const supabase = createClient()

  const loadOrders = async () => {
    setIsLoading(true)
    const { data } = await supabase.from("orders").select("*").order("created_at", { ascending: false })
    if (data) {
      setOrders(data as OrderRow[])
      const custMap = new Map<string, KnownCustomer>()

      data.forEach((o) => {
        if (!o.email) return
        const emailKey = o.email.trim().toLowerCase()
        if (!custMap.has(emailKey)) {
          custMap.set(emailKey, {
            email: emailKey,
            first_name: o.shipping_address?.first_name || "",
            last_name: o.shipping_address?.last_name || "",
            phone: o.shipping_address?.phone || "",
            address: o.shipping_address?.address || "",
            order_count: 1,
          })
        } else {
          const existing = custMap.get(emailKey)!
          existing.order_count += 1
          if (!existing.first_name && o.shipping_address?.first_name) existing.first_name = o.shipping_address.first_name
          if (!existing.last_name && o.shipping_address?.last_name) existing.last_name = o.shipping_address.last_name
          if (!existing.phone && o.shipping_address?.phone) existing.phone = o.shipping_address.phone
          if (!existing.address && o.shipping_address?.address) existing.address = o.shipping_address.address
        }
      })

      setKnownCustomers(Array.from(custMap.values()))
    }
    setIsLoading(false)
  }

  const loadCatalog = async () => {
    const { data } = await supabase
      .from("product_variants")
      .select(`id, product_id, price, stock_quantity, attributes, products(name)`)
    if (data) {
      const formatted = data.map((v: any) => ({
        id: v.id,
        product_id: v.product_id,
        product_name: v.products?.name || "Unknown Product",
        variant_name: v.attributes ? Object.values(v.attributes).join(" / ") : "Standard",
        price: v.price,
        stock_quantity: v.stock_quantity || 0,
      }))
      setAllVariants(formatted)
    }
  }

  const loadShippingRates = async () => {
    const { data } = await supabase.from("shipping_rates").select("*").order("name", { ascending: true })
    if (data) setShippingRates(data)
  }

  useEffect(() => {
    const checkUserRole = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      const isDomainEmployee = user?.email?.endsWith("@zapatoscave.com") && user?.email !== "admin@zapatoscave.com"
      const isMetadataEmployee = user?.user_metadata?.role === "employee"

      if (isDomainEmployee || isMetadataEmployee) {
        setIsEmployee(true)
      }
    }

    checkUserRole()
    loadOrders()
    loadCatalog()
    loadShippingRates()
  }, [])

  const handleSelectExistingCustomer = (cust: KnownCustomer) => {
    setNewOrderEmail(cust.email)
    setNewOrderFirstName(cust.first_name)
    setNewOrderLastName(cust.last_name)
    setNewOrderPhone(cust.phone)
    setNewOrderAddress(cust.address)
    setLinkedCustomerEmail(cust.email)
    setCustomerSearchQuery("")
  }

  const handleClearLinkedCustomer = () => {
    setLinkedCustomerEmail(null)
    setNewOrderEmail("")
    setNewOrderFirstName("")
    setNewOrderLastName("")
    setNewOrderPhone("")
    setNewOrderAddress("")
  }

  const matchingCustomers = customerSearchQuery.trim()
    ? knownCustomers.filter((c) => {
        const searchTerms = customerSearchQuery.toLowerCase().split(" ").filter(Boolean)
        const searchableText = `${c.first_name} ${c.last_name} ${c.email} ${c.phone}`.toLowerCase()
        return searchTerms.every((term) => searchableText.includes(term))
      })
    : []

  const exactEmailMatch =
    !linkedCustomerEmail && newOrderEmail.trim()
      ? knownCustomers.find((c) => c.email === newOrderEmail.trim().toLowerCase())
      : null

  const handleViewDetails = async (order: OrderRow) => {
    setSelectedOrder(order)
    setExtraDiscountInput(String(Number(order.discount_amount) || 0))
    setPaymentAmountInput("")
    setPaymentDateInput(getTodayDateInput())
    setPaymentNoteInput("")
    setIsDetailOpen(true)
    setIsEditingItems(false)
    setSelectedOrderItems([])

    const { data, error } = await supabase.from("order_items").select(`*`).eq("order_id", order.id)

    if (error) {
      alert(`SUPABASE ERROR:\n${error.message || JSON.stringify(error)}`)
      return
    }

    if (data) {
      const formatted = data.map((item: any) => {
        const catalogMatch = allVariants.find((v) => v.id === item.product_variant_id)

        return {
          id: item.id,
          order_id: item.order_id,
          product_variant_id: item.product_variant_id,
          quantity: item.quantity,
          price: item.price,
          products: { name: item.product_name || catalogMatch?.product_name || "UNAVAILABLE GHOST ITEM" },
          product_variants: { attributes: { label: item.variant_name || catalogMatch?.variant_name || "Standard" } },
        }
      })
      setSelectedOrderItems(formatted)
    }
  }

  // Compute Gross Amount (Items + Shipping before extra order-level discount)
  const selectedOrderItemsSubtotal = selectedOrderItems.reduce(
    (sum, item) => sum + (Number(item.price) || 0) * (Number(item.quantity) || 1),
    0
  )
  const selectedOrderGrossAmount = selectedOrder
    ? selectedOrderItems.length > 0
      ? selectedOrderItemsSubtotal + (Number(selectedOrder.shipping_cost) || 0)
      : (Number(selectedOrder.total_amount) || 0) + (Number(selectedOrder.discount_amount) || 0)
    : 0

  const parsedExtraDiscount = Math.max(0, parseFloat(extraDiscountInput) || 0)
  const liveNetPayable = Math.max(0, selectedOrderGrossAmount - parsedExtraDiscount)
  const savedPaymentLogs: PaymentLog[] = Array.isArray(selectedOrder?.payment_logs) ? selectedOrder!.payment_logs : []
  const totalPaidAmount = savedPaymentLogs.length > 0
    ? savedPaymentLogs.reduce((sum, p) => sum + (Number(p.amount) || 0), 0)
    : Number(selectedOrder?.amount_paid) || 0
  const liveBalanceDue = Math.max(0, liveNetPayable - totalPaidAmount)

  const handleSaveExtraDiscount = async () => {
    if (!selectedOrder) return

    let discountVal = Math.max(0, parseFloat(extraDiscountInput) || 0)
    if (isEmployee && discountVal > 200) {
      discountVal = 200
      setExtraDiscountInput("200")
    }

    const updatedNetTotal = Math.max(0, selectedOrderGrossAmount - discountVal)
    setIsSavingDiscount(true)

    const { error } = await supabase
      .from("orders")
      .update({
        discount_amount: discountVal,
        total_amount: updatedNetTotal,
      })
      .eq("id", selectedOrder.id)

    setIsSavingDiscount(false)

    if (error) {
      return alert(`Failed to update discount: ${error.message}`)
    }

    const updatedOrder: OrderRow = {
      ...selectedOrder,
      discount_amount: discountVal,
      total_amount: updatedNetTotal,
    }
    setSelectedOrder(updatedOrder)
    setOrders((prev) => prev.map((o) => (o.id === selectedOrder.id ? updatedOrder : o)))
  }

  const handleRecordPayment = async (customAmount?: number) => {
    if (!selectedOrder) return
    const amount = customAmount !== undefined ? customAmount : parseFloat(paymentAmountInput) || 0
    if (amount <= 0) return alert("Enter a valid payment amount greater than 0.")
    if (!paymentDateInput) return alert("Select a payment date.")

    const newLog: PaymentLog = {
      id: `${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      amount,
      date: paymentDateInput,
      note: paymentNoteInput.trim() || undefined,
    }

    const updatedLogs = [...savedPaymentLogs, newLog]
    const updatedAmountPaid = updatedLogs.reduce((sum, p) => sum + (Number(p.amount) || 0), 0)

    setIsSavingPayment(true)
    const { error } = await supabase
      .from("orders")
      .update({
        payment_logs: updatedLogs,
        amount_paid: updatedAmountPaid,
      })
      .eq("id", selectedOrder.id)

    setIsSavingPayment(false)

    if (error) {
      return alert(`Failed to record payment: ${error.message}`)
    }

    const updatedOrder: OrderRow = {
      ...selectedOrder,
      payment_logs: updatedLogs,
      amount_paid: updatedAmountPaid,
    }
    setSelectedOrder(updatedOrder)
    setOrders((prev) => prev.map((o) => (o.id === selectedOrder.id ? updatedOrder : o)))
    setPaymentAmountInput("")
    setPaymentNoteInput("")
  }

  const handleDeletePaymentLog = async (logId: string) => {
    if (!selectedOrder) return
    if (!confirm("Remove this payment entry?")) return

    const updatedLogs = savedPaymentLogs.filter((p) => p.id !== logId)
    const updatedAmountPaid = updatedLogs.reduce((sum, p) => sum + (Number(p.amount) || 0), 0)

    const { error } = await supabase
      .from("orders")
      .update({
        payment_logs: updatedLogs,
        amount_paid: updatedAmountPaid,
      })
      .eq("id", selectedOrder.id)

    if (error) {
      return alert(`Failed to remove payment: ${error.message}`)
    }

    const updatedOrder: OrderRow = {
      ...selectedOrder,
      payment_logs: updatedLogs,
      amount_paid: updatedAmountPaid,
    }
    setSelectedOrder(updatedOrder)
    setOrders((prev) => prev.map((o) => (o.id === selectedOrder.id ? updatedOrder : o)))
  }

  const updateStatus = async (id: string, newStatus: string) => {
    await supabase.from("orders").update({ status: newStatus }).eq("id", id)

    setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status: newStatus } : o)))
    if (selectedOrder?.id === id) setSelectedOrder((prev) => (prev ? { ...prev, status: newStatus } : null))

    if (newStatus === "shipped" || newStatus === "completed") {
      const orderToEmail = orders.find((o) => o.id === id)

      if (orderToEmail && orderToEmail.email) {
        const result = await sendDispatchNotification(
          orderToEmail.email,
          orderToEmail.shipping_address?.first_name || "Client",
          orderToEmail.id,
          orderToEmail.tracking_number || "PENDING"
        )

        if (!result.success) {
          console.error("Failed to transmit Dispatch Email:", result.error)
        }
      }
    }
  }

  const handleSaveTracking = async () => {
    if (!selectedOrder) return
    await supabase.from("orders").update({ tracking_number: trackingInput }).eq("id", selectedOrder.id)

    setSelectedOrder((prev) => (prev ? { ...prev, tracking_number: trackingInput } : null))
    setOrders((prev) => prev.map((o) => (o.id === selectedOrder.id ? { ...o, tracking_number: trackingInput } : o)))
    setIsEditingTracking(false)
  }

  const handleReturnItem = async (item: OrderItem) => {
    if (!selectedOrder) return
    const confirmReturn = confirm("Remove item from invoice and return quantity to warehouse stock?")
    if (!confirmReturn) return

    const { data: variant } = await supabase
      .from("product_variants")
      .select("stock_quantity")
      .eq("id", item.product_variant_id)
      .single()
    if (variant) {
      await supabase
        .from("product_variants")
        .update({ stock_quantity: variant.stock_quantity + item.quantity })
        .eq("id", item.product_variant_id)
    }

    const activeDiscount = Number(selectedOrder.discount_amount) || 0
    const newGross = Math.max(0, selectedOrderGrossAmount - item.price * item.quantity)
    const revisedTotal = Math.max(0, newGross - activeDiscount)

    await supabase.from("order_items").delete().eq("id", item.id)
    await supabase.from("orders").update({ total_amount: revisedTotal }).eq("id", selectedOrder.id)

    setSelectedOrderItems((prev) => prev.filter((i) => i.id !== item.id))
    setSelectedOrder((prev) => (prev ? { ...prev, total_amount: revisedTotal } : null))
    setOrders((prev) => prev.map((o) => (o.id === selectedOrder.id ? { ...o, total_amount: revisedTotal } : o)))
    loadCatalog()
  }

  const handleAddLineItemToExisting = async (variantId: string) => {
    if (!selectedOrder) return
    const target = allVariants.find((v) => v.id === variantId)
    if (!target || target.stock_quantity < 1) return alert("Item out of stock.")

    await supabase
      .from("product_variants")
      .update({ stock_quantity: target.stock_quantity - 1 })
      .eq("id", variantId)

    const { data, error } = await supabase
      .from("order_items")
      .insert({
        order_id: selectedOrder.id,
        product_id: target.product_id,
        product_variant_id: variantId,
        quantity: 1,
        price: target.price,
      })
      .select("*")
      .single()

    if (error) console.error("Insert Error", error)

    if (data) {
      const newItem: OrderItem = {
        id: data.id,
        order_id: data.order_id,
        product_variant_id: data.product_variant_id,
        quantity: data.quantity,
        price: data.price,
        products: { name: target.product_name },
        product_variants: { attributes: { label: target.variant_name } },
      }
      const activeDiscount = Number(selectedOrder.discount_amount) || 0
      const newGross = selectedOrderGrossAmount + target.price
      const revisedTotal = Math.max(0, newGross - activeDiscount)

      await supabase.from("orders").update({ total_amount: revisedTotal }).eq("id", selectedOrder.id)

      setSelectedOrderItems((prev) => [...prev, newItem])
      setSelectedOrder((prev) => (prev ? { ...prev, total_amount: revisedTotal } : null))
      setOrders((prev) => prev.map((o) => (o.id === selectedOrder.id ? { ...o, total_amount: revisedTotal } : o)))
      loadCatalog()
    }
  }

  const handleCreateManualOrder = async (e: React.FormEvent) => {
    e.preventDefault()
    if (newOrderItems.length === 0) return alert("Add at least one item.")

    if (isEmployee) {
      const exceedsLimit = newOrderItems.some((item) => (item.discount || 0) > 200)
      if (exceedsLimit) {
        return alert("Security Protocol: Employees cannot authorize discounts greater than 200 KSH per item.")
      }
    }

    const calculatedSubtotal = newOrderItems.reduce((acc, item) => {
      const match = allVariants.find((v) => v.id === item.variantId)
      const lineTotal = (match ? match.price * item.quantity : 0) - (item.discount || 0)
      return acc + Math.max(0, lineTotal)
    }, 0)
    const totalWithShipping = calculatedSubtotal + Number(newOrderShippingCost)

    const normalizedEmail = newOrderEmail.trim().toLowerCase()

    const shippingPayload = {
      first_name: newOrderFirstName.trim(),
      last_name: newOrderLastName.trim(),
      address: newOrderAddress.trim(),
      phone: newOrderPhone.trim(),
    }

    const { data: orderData, error: orderErr } = await supabase
      .from("orders")
      .insert({
        email: normalizedEmail,
        status: newOrderStatus,
        shipping_cost: Number(newOrderShippingCost),
        discount_amount: 0,
        amount_paid: 0,
        payment_logs: [],
        total_amount: totalWithShipping,
        tax: 0,
        shipping_address: shippingPayload,
      })
      .select()
      .single()

    if (orderErr) return alert(`Order execution failure: ${orderErr.message}`)

    const itemsPayload = newOrderItems.map((item) => {
      const match = allVariants.find((v) => v.id === item.variantId)
      const basePrice = match?.price || 0

      const totalLinePrice = Math.max(0, basePrice * item.quantity - (item.discount || 0))
      const effectiveUnitPrice = item.quantity > 0 ? totalLinePrice / item.quantity : 0

      return {
        order_id: orderData.id,
        product_id: match?.product_id,
        product_variant_id: item.variantId,
        quantity: item.quantity,
        price: effectiveUnitPrice,
        product_name: match?.product_name || "Manual Item",
        variant_name: match?.variant_name || "Standard",
      }
    })

    const { error: itemsErr } = await supabase.from("order_items").insert(itemsPayload)
    if (itemsErr) {
      console.error(itemsErr)
      return alert(`Line item construction failure. Check console.`)
    }

    if (newOrderStatus === "shipped") {
      await sendDispatchNotification(normalizedEmail, newOrderFirstName.trim(), orderData.id, "PENDING")
    }

    if (newOrderStatus !== "draft") {
      for (const item of newOrderItems) {
        const match = allVariants.find((v) => v.id === item.variantId)
        if (match) {
          await supabase
            .from("product_variants")
            .update({ stock_quantity: match.stock_quantity - item.quantity })
            .eq("id", item.variantId)
        }
      }
    }

    handleClearLinkedCustomer()
    setCustomerSearchQuery("")
    setNewOrderShippingCost(0)
    setNewOrderItems([])
    setIsCreateOpen(false)
    loadOrders()
    loadCatalog()
  }

  const filtered = orders.filter((o) => {
    const s = (search || "").toLowerCase()
    const fullName = `${o.shipping_address?.first_name || ""} ${o.shipping_address?.last_name || ""}`.toLowerCase()
    return (
      (o.id || "").toLowerCase().includes(s) ||
      (o.status || "").toLowerCase().includes(s) ||
      (o.email || "").toLowerCase().includes(s) ||
      fullName.includes(s)
    )
  })

  const newOrderSubtotal = newOrderItems.reduce((acc, item) => {
    const match = allVariants.find((v) => v.id === item.variantId)
    const lineTotal = (match ? match.price * item.quantity : 0) - (item.discount || 0)
    return acc + Math.max(0, lineTotal)
  }, 0)

  const newOrderFinalTotal = newOrderSubtotal + newOrderShippingCost

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto px-4 py-2">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight uppercase">Logistics Pipeline</h1>
          <p className="text-xs font-mono text-gray-500 mt-1 uppercase">System Manifest: {orders.length} Records</p>
        </div>
        <Button
          onClick={() => setIsCreateOpen(true)}
          className="bg-black hover:bg-zinc-800 text-white font-bold rounded-none uppercase tracking-widest text-xs h-12 px-6"
        >
          <Plus className="h-4 w-4 mr-2" /> Manual Generation
        </Button>
      </div>

      <Input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Filter by Reference, Customer Name, Status, or Email..."
        className="max-w-md bg-white rounded-none border-zinc-200 h-11 text-sm"
      />

      <div className="bg-white rounded-none border border-zinc-200 overflow-hidden shadow-sm">
        {isLoading ? (
          <div className="p-16 text-center text-xs font-mono text-gray-400 uppercase tracking-widest">
            Polling Datastore...
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-16 text-center text-xs font-mono text-gray-400 uppercase tracking-widest">
            No parameters match.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-zinc-200 bg-zinc-50 text-[11px] font-mono uppercase text-zinc-500 tracking-wider">
                  <th className="px-6 py-4">Reference</th>
                  <th className="px-6 py-4">Consignee Profile</th>
                  <th className="px-6 py-4">Timestamp</th>
                  <th className="px-6 py-4">Fulfillment Track</th>
                  <th className="px-6 py-4">Financial Capture</th>
                  <th className="px-6 py-4 text-right">Manifest</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 text-sm">
                {filtered.map((order, index) => {
                  const paid = Number(order.amount_paid) || 0
                  const total = Number(order.total_amount) || 0
                  const bal = Math.max(0, total - paid)

                  return (
                    <motion.tr
                      key={order.id}
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.015 }}
                      className="hover:bg-zinc-50/70 cursor-pointer"
                      onClick={() => handleViewDetails(order)}
                    >
                      <td className="px-6 py-4 font-mono text-xs font-bold text-black uppercase">
                        #{order.id.substring(0, 8)}
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-semibold text-zinc-900">
                          {order.shipping_address?.first_name} {order.shipping_address?.last_name}
                        </div>
                        <div className="text-xs text-zinc-400 font-mono">{order.email}</div>
                      </td>
                      <td className="px-6 py-4 text-zinc-600 text-xs font-mono">
                        {new Date(order.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4" onClick={(e) => e.stopPropagation()}>
                        <select
                          value={order.status}
                          onChange={(e) => updateStatus(order.id, e.target.value)}
                          className={`text-[10px] font-mono font-bold uppercase tracking-wider px-3 py-1.5 rounded-full border-0 cursor-pointer ${
                            statusColors[order.status]
                          }`}
                        >
                          <option value="draft">Draft (Unpaid)</option>
                          <option value="reserved">Reserved (Awaiting Pay)</option>
                          <option value="pending">Pending</option>
                          <option value="processing">Processing</option>
                          <option value="shipped">Shipped</option>
                          <option value="completed">Completed</option>
                          <option value="cancelled">Cancelled</option>
                          <option value="returned">Returned</option>
                        </select>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-bold">{formatCurrency(total)}</div>
                        {paid > 0 && bal > 0 && (
                          <div className="text-[10px] font-mono font-bold text-orange-600 uppercase">
                            BAL: {formatCurrency(bal)}
                          </div>
                        )}
                        {paid > 0 && bal === 0 && total > 0 && (
                          <div className="text-[10px] font-mono font-bold text-green-600 uppercase">
                            PAID IN FULL
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Button variant="ghost" size="sm" className="h-8 text-xs font-medium text-zinc-500 rounded-none">
                          <Eye className="h-3.5 w-3.5 mr-1.5" /> Details
                        </Button>
                      </td>
                    </motion.tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Order Details Drawer */}
      <Sheet open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <SheetContent className="sm:max-w-xl w-full overflow-y-auto bg-white rounded-none border-l border-zinc-200 p-8 space-y-8">
          {selectedOrder && (
            <>
              <SheetHeader className="space-y-2 border-b border-zinc-100 pb-6">
                <div className="text-[10px] font-mono tracking-widest text-zinc-400 uppercase">Fulfillment Matrix</div>
                <SheetTitle className="text-2xl font-black uppercase tracking-tight">
                  Manifest #{selectedOrder.id.substring(0, 12).toUpperCase()}
                </SheetTitle>
              </SheetHeader>

              <div className="space-y-4">
                <h3 className="text-[11px] font-mono font-bold tracking-widest uppercase text-zinc-400">
                  Consignee Routing Details
                </h3>
                <div className="bg-zinc-50 p-4 border border-zinc-100 space-y-3 text-sm">
                  <div className="grid grid-cols-3 border-b border-zinc-100/80 pb-2">
                    <span className="text-xs font-mono uppercase text-zinc-400">Identity</span>
                    <span className="col-span-2 font-semibold text-zinc-900">
                      {selectedOrder.shipping_address?.first_name} {selectedOrder.shipping_address?.last_name}
                    </span>
                  </div>
                  <div className="grid grid-cols-3 border-b border-zinc-100/80 pb-2">
                    <span className="text-xs font-mono uppercase text-zinc-400">Network Link</span>
                    <span className="col-span-2 font-mono text-xs text-zinc-700">{selectedOrder.email}</span>
                  </div>
                  <div className="grid grid-cols-3 border-b border-zinc-100/80 pb-2">
                    <span className="text-xs font-mono uppercase text-zinc-400">Telecom Link</span>
                    <span className="col-span-2 font-mono text-xs text-zinc-700">
                      {selectedOrder.shipping_address?.phone || "N/A"}
                    </span>
                  </div>
                  <div className="grid grid-cols-3">
                    <span className="text-xs font-mono uppercase text-zinc-400">Physical Drop</span>
                    <span className="col-span-2 text-xs text-zinc-600 leading-relaxed">
                      {selectedOrder.shipping_address?.address || "N/A"}
                    </span>
                  </div>
                  <div className="grid grid-cols-3 border-t border-zinc-100/80 pt-3 mt-3">
                    <span className="text-xs font-mono uppercase text-zinc-400 mt-2">Tracking Code</span>
                    <span className="col-span-2">
                      {isEditingTracking ? (
                        <div className="flex gap-2">
                          <Input
                            value={trackingInput}
                            onChange={(e) => setTrackingInput(e.target.value)}
                            placeholder="Paste Waybill/Tracking..."
                            className="h-8 text-xs font-mono rounded-none border-zinc-300"
                          />
                          <Button
                            size="sm"
                            className="h-8 rounded-none text-[10px] uppercase font-bold"
                            onClick={handleSaveTracking}
                          >
                            Save
                          </Button>
                        </div>
                      ) : (
                        <div className="flex items-center justify-between">
                          <span className="font-mono text-xs text-zinc-800 font-bold">
                            {selectedOrder.tracking_number || "AWAITING DISPATCH"}
                          </span>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 text-[10px] uppercase text-zinc-400 hover:text-black"
                            onClick={() => {
                              setTrackingInput(selectedOrder.tracking_number || "")
                              setIsEditingTracking(true)
                            }}
                          >
                            <Edit2 className="h-3 w-3 mr-1" /> Edit
                          </Button>
                        </div>
                      )}
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-[11px] font-mono font-bold tracking-widest uppercase text-zinc-400">
                    Allocated Line Items
                  </h3>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-7 text-[10px] font-mono uppercase rounded-none tracking-wider"
                    onClick={() => setIsEditingItems(!isEditingItems)}
                  >
                    {isEditingItems ? (
                      <span className="text-green-600 font-bold">Lock Ledger</span>
                    ) : (
                      <span className="flex items-center">
                        <ArrowLeftRight className="h-3 w-3 mr-1" /> Returns & Exchanges
                      </span>
                    )}
                  </Button>
                </div>

                <div className="divide-y divide-zinc-100 border border-zinc-100">
                  {selectedOrderItems.length === 0 && (
                    <div className="p-4 text-xs text-zinc-400 text-center font-mono">No products connected.</div>
                  )}
                  {selectedOrderItems.map((item) => (
                    <div key={item.id} className="p-4 flex items-center justify-between text-sm hover:bg-zinc-50/50">
                      <div>
                        <div className="font-bold text-zinc-900 uppercase tracking-tight">{item.products?.name}</div>
                        <div className="text-xs text-zinc-500 uppercase font-mono mt-0.5">
                          {item.product_variants?.attributes
                            ? Object.values(item.product_variants.attributes).join(" / ")
                            : "Standard"}
                        </div>
                        <div className="text-xs font-mono text-zinc-400 mt-1">
                          QTY: {item.quantity} × {formatCurrency(item.price)}
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="font-bold text-zinc-900">{formatCurrency(item.price * item.quantity)}</span>
                        {isEditingItems && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 text-xs text-red-500 hover:text-red-700 bg-red-50 rounded-none uppercase font-bold tracking-widest"
                            onClick={() => handleReturnItem(item)}
                          >
                            Return to Stock
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {isEditingItems && (
                  <div className="p-4 bg-zinc-50 border border-dashed border-zinc-200 space-y-2">
                    <label className="text-[10px] font-mono uppercase tracking-widest text-zinc-400 block">
                      Inject New Variant (Deducts Stock)
                    </label>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3 w-3 text-zinc-400" />
                      <Input
                        placeholder="Search catalog..."
                        value={variantSearchQuery}
                        onChange={(e) => setVariantSearchQuery(e.target.value)}
                        className="pl-8 rounded-none h-9 text-xs border-zinc-200"
                      />
                    </div>
                    {variantSearchQuery && (
                      <div className="max-h-40 overflow-y-auto border border-zinc-200 bg-white shadow-sm z-10 relative">
                        {allVariants
                          .filter((v) => {
                            const searchTerms = variantSearchQuery.toLowerCase().split(" ").filter(Boolean)
                            const searchableText = `${v.product_name} ${v.variant_name}`.toLowerCase()
                            return searchTerms.every((term) => searchableText.includes(term))
                          })
                          .map((v) => (
                            <div
                              key={v.id}
                              className="px-3 py-2 text-xs cursor-pointer hover:bg-zinc-100 border-b border-zinc-100 flex justify-between items-center"
                              onClick={() => {
                                handleAddLineItemToExisting(v.id)
                                setVariantSearchQuery("")
                              }}
                            >
                              <div>
                                <span className="font-bold uppercase">{v.product_name}</span>{" "}
                                <span className="text-zinc-500 font-mono text-[10px]">({v.variant_name})</span>
                              </div>
                              <div className="text-right">
                                <div>{formatCurrency(v.price)}</div>
                                <div
                                  className={
                                    v.stock_quantity > 0
                                      ? "text-green-600 font-mono text-[9px] font-bold"
                                      : "text-red-500 font-mono text-[9px] font-bold"
                                  }
                                >
                                  {v.stock_quantity} In Stock
                                </div>
                              </div>
                            </div>
                          ))}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Financial & Payment Ledger (Gross, Extra Discount, Payments with Date, Auto Balance) */}
              <div className="space-y-4 pt-4 border-t border-zinc-200">
                <h3 className="text-[11px] font-mono font-bold tracking-widest uppercase text-zinc-400">
                  Financial & Payment Ledger
                </h3>

                <div className="bg-zinc-50 border border-zinc-200 p-4 space-y-3">
                  {/* Shipping Surcharge */}
                  <div className="flex justify-between text-xs font-mono text-zinc-500">
                    <span>Shipping Route Surcharge</span>
                    <span>{formatCurrency(selectedOrder.shipping_cost)}</span>
                  </div>

                  {/* Gross Amount before extra order discount */}
                  <div className="flex justify-between text-xs font-mono text-zinc-700 font-semibold">
                    <span>Order Gross Amount</span>
                    <span>{formatCurrency(selectedOrderGrossAmount)}</span>
                  </div>

                  {/* Extra Order-Level Discount Input */}
                  <div className="pt-2 border-t border-zinc-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <label className="text-xs font-mono uppercase text-zinc-600">
                      Extra Discount {isEmployee && <span className="text-orange-600">(Max 200)</span>}
                    </label>
                    <div className="flex items-center gap-2">
                      <Input
                        type="number"
                        min="0"
                        max={isEmployee ? 200 : undefined}
                        value={extraDiscountInput}
                        onChange={(e) => {
                          let val = parseFloat(e.target.value)
                          if (isNaN(val)) {
                            setExtraDiscountInput(e.target.value)
                            return
                          }
                          if (isEmployee && val > 200) val = 200
                          setExtraDiscountInput(String(Math.max(0, val)))
                        }}
                        placeholder="0"
                        className="w-28 h-8 text-xs font-mono rounded-none bg-white border-zinc-300 text-right"
                      />
                      <Button
                        type="button"
                        size="sm"
                        disabled={isSavingDiscount}
                        onClick={handleSaveExtraDiscount}
                        className="h-8 px-3 rounded-none text-[10px] font-mono uppercase font-bold bg-black text-white hover:bg-zinc-800"
                      >
                        {isSavingDiscount ? "..." : "Apply"}
                      </Button>
                    </div>
                  </div>

                  {/* Net Payable Amount */}
                  <div className="flex justify-between text-sm font-black text-zinc-900 pt-2 border-t border-zinc-200 uppercase">
                    <span>Net Ledger Amount</span>
                    <span className="font-mono">{formatCurrency(liveNetPayable)}</span>
                  </div>
                </div>

                {/* Recorded Payments & Add Payment Form */}
                <div className="border border-zinc-200 bg-white p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-zinc-500">
                      Payments Received ({savedPaymentLogs.length})
                    </span>
                    {liveBalanceDue > 0 && (
                      <button
                        type="button"
                        onClick={() => handleRecordPayment(liveBalanceDue)}
                        disabled={isSavingPayment}
                        className="text-[10px] font-mono font-bold uppercase underline text-green-700 hover:text-green-900"
                      >
                        Mark Full Balance Paid ({formatCurrency(liveBalanceDue)})
                      </button>
                    )}
                  </div>

                  {/* Logged Payments List */}
                  {savedPaymentLogs.length > 0 && (
                    <div className="divide-y divide-zinc-100 border border-zinc-100 bg-zinc-50/60">
                      {savedPaymentLogs.map((log) => (
                        <div key={log.id} className="px-3 py-2 flex items-center justify-between text-xs font-mono">
                          <div>
                            <span className="font-bold text-green-700">{formatCurrency(log.amount)}</span>
                            <span className="text-zinc-500 ml-2">on {formatPaymentDate(log.date)}</span>
                            {log.note && <span className="text-zinc-400 ml-2">({log.note})</span>}
                          </div>
                          <button
                            type="button"
                            onClick={() => handleDeletePaymentLog(log.id)}
                            className="text-zinc-400 hover:text-red-600 p-1"
                            title="Remove payment entry"
                          >
                            <X className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Add New Payment Row */}
                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-2 pt-1">
                    <div className="sm:col-span-4">
                      <Input
                        type="number"
                        min="1"
                        placeholder="Paid e.g. 2300"
                        value={paymentAmountInput}
                        onChange={(e) => setPaymentAmountInput(e.target.value)}
                        className="h-9 text-xs font-mono rounded-none border-zinc-200"
                      />
                    </div>
                    <div className="sm:col-span-4">
                      <input
                        type="date"
                        value={paymentDateInput}
                        onChange={(e) => setPaymentDateInput(e.target.value)}
                        className="w-full h-9 border border-zinc-200 bg-white px-2.5 text-xs font-mono text-zinc-800 rounded-none focus:outline-none focus:border-black"
                      />
                    </div>
                    <div className="sm:col-span-4 flex gap-1.5">
                      <Input
                        type="text"
                        placeholder="Ref / Note"
                        value={paymentNoteInput}
                        onChange={(e) => setPaymentNoteInput(e.target.value)}
                        className="h-9 text-xs font-mono rounded-none border-zinc-200"
                      />
                      <Button
                        type="button"
                        disabled={isSavingPayment}
                        onClick={() => handleRecordPayment()}
                        className="h-9 px-3 rounded-none bg-black hover:bg-zinc-800 text-white text-[10px] font-mono uppercase font-bold shrink-0"
                      >
                        <Check className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>

                  {/* Summary Totals: Total Paid & Auto-Recalculated Balance */}
                  <div className="pt-3 border-t border-zinc-200 space-y-1.5">
                    <div className="flex justify-between text-xs font-mono text-green-700 font-bold">
                      <span>Total Paid:</span>
                      <span>{formatCurrency(totalPaidAmount)}</span>
                    </div>
                    <div className="flex justify-between items-center bg-black text-white px-3 py-2.5 font-mono">
                      <span className="text-xs font-bold uppercase tracking-wider">Balance Due:</span>
                      <span className="text-base font-black">{formatCurrency(liveBalanceDue)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>

      {/* Manual Direct Order Creation Drawer */}
      <Sheet open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <SheetContent className="sm:max-w-xl w-full overflow-y-auto bg-white rounded-none border-l border-zinc-200 p-8">
          <form onSubmit={handleCreateManualOrder} className="space-y-6">
            <SheetHeader className="space-y-1 border-b border-zinc-100 pb-4">
              <SheetTitle className="text-2xl font-black uppercase tracking-tight">Generate Direct Order</SheetTitle>
            </SheetHeader>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-[10px] font-mono font-bold tracking-widest uppercase text-zinc-400">
                  Customer Identity
                </h3>
                {linkedCustomerEmail && (
                  <button
                    type="button"
                    onClick={handleClearLinkedCustomer}
                    className="text-[10px] font-mono uppercase text-zinc-500 hover:text-black flex items-center gap-1"
                  >
                    <X className="h-3 w-3" /> New Customer
                  </button>
                )}
              </div>

              {/* Live Type-to-Search Existing Customers */}
              {knownCustomers.length > 0 && (
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-400" />
                  <Input
                    placeholder="Search existing customer by name, email, or phone..."
                    value={customerSearchQuery}
                    onChange={(e) => setCustomerSearchQuery(e.target.value)}
                    className="pl-9 rounded-none h-10 text-xs bg-zinc-50 border-zinc-200 font-mono"
                  />

                  {customerSearchQuery.trim() && (
                    <div className="max-h-48 overflow-y-auto border border-zinc-300 bg-white shadow-md z-20 absolute w-full top-[42px]">
                      {matchingCustomers.length === 0 ? (
                        <div className="px-3 py-2.5 text-xs font-mono text-zinc-400">
                          No existing customer found — fill details below to create new profile.
                        </div>
                      ) : (
                        matchingCustomers.map((c) => (
                          <div
                            key={c.email}
                            onClick={() => handleSelectExistingCustomer(c)}
                            className="px-3 py-2.5 text-xs cursor-pointer hover:bg-zinc-100 border-b border-zinc-100 last:border-0 flex items-center justify-between"
                          >
                            <div>
                              <div className="font-bold text-zinc-900">
                                {c.first_name} {c.last_name}
                              </div>
                              <div className="font-mono text-[10px] text-zinc-500">
                                {c.email} {c.phone ? `• ${c.phone}` : ""}
                              </div>
                            </div>
                            <span className="text-[10px] font-mono bg-zinc-100 px-2 py-0.5 text-zinc-600">
                              {c.order_count} {c.order_count === 1 ? "order" : "orders"}
                            </span>
                          </div>
                        ))
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Linked Account Confirmation Banner */}
              {linkedCustomerEmail && (
                <div className="bg-green-50 border border-green-200 px-3 py-2 flex items-center justify-between text-xs">
                  <span className="flex items-center gap-1.5 text-green-800 font-mono text-[11px]">
                    <UserCheck className="h-3.5 w-3.5 shrink-0" />
                    Linked to existing account ({linkedCustomerEmail})
                  </span>
                  <button
                    type="button"
                    onClick={handleClearLinkedCustomer}
                    className="text-[10px] font-mono underline text-green-700 hover:text-green-950"
                  >
                    Unlink
                  </button>
                </div>
              )}

              {/* Duplicate Email Warning if typed manually */}
              {exactEmailMatch && (
                <div className="bg-amber-50 border border-amber-200 px-3 py-2 flex items-center justify-between text-xs">
                  <span className="text-amber-800 font-mono text-[11px]">
                    Existing profile found for {exactEmailMatch.first_name} {exactEmailMatch.last_name}.
                  </span>
                  <button
                    type="button"
                    onClick={() => handleSelectExistingCustomer(exactEmailMatch)}
                    className="text-[10px] font-mono font-bold uppercase underline text-amber-900"
                  >
                    Auto-Fill
                  </button>
                </div>
              )}

              <div className="space-y-2">
                <Input
                  placeholder="Email Address"
                  type="email"
                  required
                  value={newOrderEmail}
                  onChange={(e) => {
                    setNewOrderEmail(e.target.value)
                    if (linkedCustomerEmail && e.target.value.trim().toLowerCase() !== linkedCustomerEmail) {
                      setLinkedCustomerEmail(null)
                    }
                  }}
                  className="rounded-none h-10 text-xs"
                />
                <div className="grid grid-cols-2 gap-2">
                  <Input
                    placeholder="First Name"
                    required
                    value={newOrderFirstName}
                    onChange={(e) => setNewOrderFirstName(e.target.value)}
                    className="rounded-none h-10 text-xs"
                  />
                  <Input
                    placeholder="Last Name"
                    required
                    value={newOrderLastName}
                    onChange={(e) => setNewOrderLastName(e.target.value)}
                    className="rounded-none h-10 text-xs"
                  />
                </div>
                <Input
                  placeholder="Phone"
                  type="tel"
                  required
                  value={newOrderPhone}
                  onChange={(e) => setNewOrderPhone(e.target.value)}
                  className="rounded-none h-10 text-xs"
                />
                <Input
                  placeholder="Address"
                  required
                  value={newOrderAddress}
                  onChange={(e) => setNewOrderAddress(e.target.value)}
                  className="rounded-none h-10 text-xs"
                />
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="text-[10px] font-mono font-bold tracking-widest uppercase text-zinc-400">
                Cargo Manifest Build
              </h3>
              <div className="space-y-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
                  <Input
                    placeholder="Search catalog..."
                    value={variantSearchQuery}
                    onChange={(e) => setVariantSearchQuery(e.target.value)}
                    className="pl-9 rounded-none h-11 text-xs border-zinc-200"
                  />
                </div>
                {variantSearchQuery && (
                  <div className="max-h-40 overflow-y-auto border border-zinc-200 bg-white shadow-sm z-10 relative">
                    {allVariants
                      .filter((v) => {
                        const searchTerms = variantSearchQuery.toLowerCase().split(" ").filter(Boolean)
                        const searchableText = `${v.product_name} ${v.variant_name}`.toLowerCase()
                        return searchTerms.every((term) => searchableText.includes(term))
                      })
                      .map((v) => (
                        <div
                          key={v.id}
                          className={`px-3 py-2 text-xs border-b border-zinc-100 flex justify-between items-center ${
                            v.stock_quantity > 0
                              ? "cursor-pointer hover:bg-zinc-100"
                              : "opacity-50 cursor-not-allowed bg-zinc-50"
                          }`}
                          onClick={() => {
                            if (v.stock_quantity < 1) return
                            const exists = newOrderItems.find((i) => i.variantId === v.id)
                            if (exists && exists.quantity >= v.stock_quantity) {
                              return alert("Cannot exceed available stock.")
                            }

                            if (exists) {
                              setNewOrderItems((prev) =>
                                prev.map((i) => (i.variantId === v.id ? { ...i, quantity: i.quantity + 1 } : i))
                              )
                            } else {
                              setNewOrderItems((prev) => [...prev, { variantId: v.id, quantity: 1, discount: 0 }])
                            }

                            setVariantSearchQuery("")
                          }}
                        >
                          <div>
                            <span className="font-bold uppercase">{v.product_name}</span>{" "}
                            <span className="text-zinc-500 font-mono text-[10px]">({v.variant_name})</span>
                          </div>
                          <div className="text-right">
                            <div>{formatCurrency(v.price)}</div>
                            <div
                              className={
                                v.stock_quantity > 0
                                  ? "text-green-600 font-mono text-[9px] font-bold"
                                  : "text-red-500 font-mono text-[9px] font-bold"
                              }
                            >
                              {v.stock_quantity} In Stock
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                )}
              </div>

              {newOrderItems.length > 0 && (
                <div className="border border-zinc-100 divide-y divide-zinc-100 max-h-40 overflow-y-auto mt-2">
                  {newOrderItems.map((item, index) => {
                    const matchedVariant = allVariants.find((v) => v.id === item.variantId)
                    const lineTotal = (matchedVariant?.price || 0) * item.quantity - (item.discount || 0)

                    return (
                      <div key={index} className="p-3 text-xs flex items-center justify-between bg-zinc-50/50">
                        <div className="flex-1 pr-2">
                          <div className="font-bold text-zinc-900 uppercase">{matchedVariant?.product_name}</div>
                          <div className="text-zinc-400 uppercase text-[10px] mt-0.5">{matchedVariant?.variant_name}</div>
                          <div className="text-zinc-500 font-mono mt-1 text-[10px]">
                            Unit Price: {formatCurrency(matchedVariant?.price || 0)}
                          </div>
                        </div>

                        <div className="flex items-center gap-2 sm:gap-3">
                          <div className="flex flex-col items-center">
                            <span className="text-[8px] uppercase text-zinc-400 mb-0.5">Qty</span>
                            <input
                              type="number"
                              min="1"
                              max={matchedVariant?.stock_quantity || 1}
                              className="w-10 sm:w-12 text-center h-7 border border-zinc-200 font-mono text-xs"
                              value={item.quantity}
                              onChange={(e) => {
                                const max = matchedVariant?.stock_quantity || 1
                                let val = parseInt(e.target.value) || 1
                                if (val > max) val = max
                                setNewOrderItems((prev) =>
                                  prev.map((i) =>
                                    i.variantId === item.variantId ? { ...i, quantity: Math.max(1, val) } : i
                                  )
                                )
                              }}
                            />
                          </div>

                          <div className="flex flex-col items-center">
                            <span className="text-[8px] uppercase text-zinc-400 mb-0.5">
                              Discount {isEmployee && <span className="text-orange-500">(Max 200)</span>}
                            </span>
                            <input
                              type="number"
                              min="0"
                              max={isEmployee ? 200 : undefined}
                              placeholder="0"
                              className="w-14 sm:w-16 text-center h-7 border border-zinc-200 font-mono text-xs"
                              value={item.discount === 0 ? "" : item.discount}
                              onChange={(e) => {
                                let val = parseFloat(e.target.value) || 0
                                if (isEmployee && val > 200) val = 200
                                setNewOrderItems((prev) =>
                                  prev.map((i) =>
                                    i.variantId === item.variantId ? { ...i, discount: Math.max(0, val) } : i
                                  )
                                )
                              }}
                            />
                          </div>

                          <div className="flex flex-col items-end min-w-[60px]">
                            <span className="text-[8px] uppercase text-zinc-400 mb-0.5">Total</span>
                            <span className="font-bold font-mono">{formatCurrency(lineTotal > 0 ? lineTotal : 0)}</span>
                          </div>

                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 text-red-500 shrink-0 ml-1"
                            onClick={() =>
                              setNewOrderItems((prev) => prev.filter((i) => i.variantId !== item.variantId))
                            }
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>

            <div className="space-y-3 pt-2">
              <h3 className="text-[10px] font-mono font-bold tracking-widest uppercase text-zinc-400">
                Logistics Cost Overrides
              </h3>
              <div className="space-y-1 relative">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
                  <Input
                    placeholder={
                      newOrderShippingCost > 0 ? `Selected: KSH ${newOrderShippingCost}` : "Search destination..."
                    }
                    value={shippingSearchQuery}
                    onChange={(e) => setShippingSearchQuery(e.target.value)}
                    className="pl-9 rounded-none h-11 text-xs border-zinc-200"
                  />
                </div>
                {shippingSearchQuery && (
                  <div className="max-h-40 overflow-y-auto border border-zinc-200 bg-white shadow-sm z-10 absolute w-full top-[44px]">
                    <div
                      className="px-3 py-2 text-xs cursor-pointer hover:bg-zinc-100 border-b border-zinc-100 text-red-600 font-mono font-bold"
                      onClick={() => {
                        setNewOrderShippingCost(0)
                        setShippingSearchQuery("")
                      }}
                    >
                      Clear / No Surcharge (KSH 0)
                    </div>
                    {shippingRates
                      .filter((r) => r.name.toLowerCase().includes(shippingSearchQuery.toLowerCase()))
                      .map((rate) => (
                        <div
                          key={rate.id}
                          className="px-3 py-2 text-xs cursor-pointer hover:bg-zinc-100 border-b border-zinc-100 last:border-0"
                          onClick={() => {
                            setNewOrderShippingCost(rate.price)
                            setShippingSearchQuery("")
                          }}
                        >
                          <span className="font-bold">{rate.name}</span> — {formatCurrency(rate.price)}
                        </div>
                      ))}
                  </div>
                )}
              </div>
            </div>

            <div className="pt-6 border-t border-zinc-200 space-y-2">
              <div className="flex justify-between text-xs text-zinc-500 font-mono">
                <span>Total Goods Value:</span>
                <span>{formatCurrency(newOrderSubtotal)}</span>
              </div>
              <div className="flex justify-between text-xs text-zinc-500 font-mono">
                <span>Shipping Surcharge:</span>
                <span>{formatCurrency(newOrderShippingCost)}</span>
              </div>
              <div className="flex justify-between text-base font-black text-black pt-2 border-t border-zinc-200">
                <span className="uppercase">Final Receipt:</span>
                <span>{formatCurrency(newOrderFinalTotal)}</span>
              </div>
            </div>

            <div className="pt-2">
              <label className="text-[10px] font-mono font-bold tracking-widest uppercase text-zinc-400 block mb-2">
                Order Execution Protocol
              </label>
              <select
                className="w-full h-11 border border-zinc-200 bg-zinc-50 px-3 text-xs font-bold font-mono focus:outline-none rounded-none text-zinc-700"
                value={newOrderStatus}
                onChange={(e) => setNewOrderStatus(e.target.value)}
              >
                <option value="reserved">Reserve Order (DEDUCT STOCK NOW)</option>
                <option value="draft">Save as Draft (DO NOT DEDUCT STOCK)</option>
              </select>
            </div>

            <div className="pt-2 grid grid-cols-2 gap-3">
              <Button
                type="button"
                variant="outline"
                className="h-12 text-xs font-bold uppercase rounded-none tracking-widest"
                onClick={() => setIsCreateOpen(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="h-12 text-xs font-bold uppercase rounded-none tracking-widest bg-black text-white hover:bg-zinc-800"
              >
                Execute Order
              </Button>
            </div>
          </form>
        </SheetContent>
      </Sheet>
    </div>
  )
}