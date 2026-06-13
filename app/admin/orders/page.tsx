"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { ShoppingCart, Eye, Plus, Trash2, Edit2, Search, ArrowLeftRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { createClient } from "@/lib/supabase/client"
import { formatCurrency } from "@/lib/utils"
import { kenyanShippingRates } from "@/lib/utils/shippingRates" 
import { sendDispatchNotification } from "@/app/actions/email"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"

interface OrderRow {
  id: string
  email: string
  status: string
  total_amount: number
  shipping_cost: number
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

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<OrderRow[]>([])
  const [search, setSearch] = useState("")
  const [isLoading, setIsLoading] = useState(true)

  const [selectedOrder, setSelectedOrder] = useState<OrderRow | null>(null)
  const [selectedOrderItems, setSelectedOrderItems] = useState<OrderItem[]>([])
  const [isDetailOpen, setIsDetailOpen] = useState(false)
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [isEditingItems, setIsEditingItems] = useState(false)
  const [isEditingTracking, setIsEditingTracking] = useState(false)
  const [trackingInput, setTrackingInput] = useState("")

  const [allVariants, setAllVariants] = useState<ProductVariantSelection[]>([])
  const [knownCustomers, setKnownCustomers] = useState<any[]>([])

  const [variantSearchQuery, setVariantSearchQuery] = useState("")
  const [shippingSearchQuery, setShippingSearchQuery] = useState("")

  const [newOrderEmail, setNewOrderEmail] = useState("")
  const [newOrderFirstName, setNewOrderFirstName] = useState("")
  const [newOrderLastName, setNewOrderLastName] = useState("")
  const [newOrderPhone, setNewOrderPhone] = useState("")
  const [newOrderAddress, setNewOrderAddress] = useState("")
  const [newOrderShippingCost, setNewOrderShippingCost] = useState(0)
  const [newOrderItems, setNewOrderItems] = useState<{ variantId: string; quantity: number }[]>([])
  const [newOrderStatus, setNewOrderStatus] = useState("reserved") 

  const supabase = createClient()

  const loadOrders = async () => {
    setIsLoading(true)
    const { data } = await supabase.from("orders").select("*").order("created_at", { ascending: false })
    if (data) {
      setOrders(data as OrderRow[])
      const custMap = new Map()
      data.forEach(o => {
        if (o.email && !custMap.has(o.email)) {
          custMap.set(o.email, {
            email: o.email,
            first_name: o.shipping_address?.first_name || "",
            last_name: o.shipping_address?.last_name || "",
            phone: o.shipping_address?.phone || "",
            address: o.shipping_address?.address || ""
          })
        }
      })
      setKnownCustomers(Array.from(custMap.values()))
    }
    setIsLoading(false)
  }

  const loadCatalog = async () => {
    const { data } = await supabase.from("product_variants").select(`id, price, stock_quantity, attributes, products(name)`)
    if (data) {
      const formatted = data.map((v: any) => ({
        id: v.id,
        product_id: v.product_id,
        product_name: v.products?.name || "Unknown Product",
        variant_name: v.attributes ? Object.values(v.attributes).join(" / ") : "Standard",
        price: v.price,
        stock_quantity: v.stock_quantity || 0
      }))
      setAllVariants(formatted)
    }
  }

  useEffect(() => {
    loadOrders()
    loadCatalog()
  }, [])

  const handleCustomerSelect = (email: string) => {
    const cust = knownCustomers.find(c => c.email === email)
    if (cust) {
      setNewOrderEmail(cust.email); setNewOrderFirstName(cust.first_name); 
      setNewOrderLastName(cust.last_name); setNewOrderPhone(cust.phone); setNewOrderAddress(cust.address)
    }
  }

  // WILDCARD BYPASS: Ignores schema cache entirely
  const handleViewDetails = async (order: OrderRow) => {
    setSelectedOrder(order); setIsDetailOpen(true); setIsEditingItems(false); setSelectedOrderItems([])
    
    const { data, error } = await supabase
      .from("order_items")
      .select(`*`) 
      .eq("order_id", order.id)

    if (error) {
      alert(`SUPABASE ERROR:\n${error.message || JSON.stringify(error)}`)
    } else if (data && data.length === 0) {
      alert(`DEBUG ALARM 🚨\n\nThe app successfully asked Supabase for items belonging to Order:\n${order.id}\n\nSupabase responded with: 0 items.\n\nSince your screenshot proves they exist in the database, RLS is blocking the read. Run the SQL to disable it.`)
    }

    if (data) {
      const formatted = data.map((item: any) => {
        const catalogMatch = allVariants.find(v => v.id === item.product_variant_id)
        return {
          id: item.id,
          order_id: item.order_id,
          product_variant_id: item.product_variant_id,
          quantity: item.quantity,
          price: item.price,
          products: { name: catalogMatch?.product_name || "Unknown Product" },
          product_variants: { attributes: catalogMatch ? { label: catalogMatch.variant_name } : undefined }
        }
      })
      setSelectedOrderItems(formatted)
    }
  }

  const updateStatus = async (id: string, newStatus: string) => {
    // 1. Update the database
    await supabase.from("orders").update({ status: newStatus }).eq("id", id)
    
    // 2. Update the local UI state
    setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status: newStatus } : o)))
    if (selectedOrder?.id === id) setSelectedOrder(prev => prev ? { ...prev, status: newStatus } : null)

    // 3. FIRE THE EMAIL if the status is exactly "shipped"
    if (newStatus === "shipped") {
      const orderToEmail = orders.find(o => o.id === id);
      if (orderToEmail && orderToEmail.email) {
        
        // Visual feedback so you know it's trying to send
        console.log(`Attempting to dispatch email to ${orderToEmail.email}...`);
        
        await sendDispatchNotification(
          orderToEmail.email,
          orderToEmail.shipping_address?.first_name || "Client",
          orderToEmail.id,
          orderToEmail.tracking_number || "PENDING"
        );
      }
    }
  }

  const handleSaveTracking = async () => {
    if (!selectedOrder) return;
    await supabase.from("orders").update({ tracking_number: trackingInput }).eq("id", selectedOrder.id);
    
    // Update local UI immediately
    setSelectedOrder(prev => prev ? { ...prev, tracking_number: trackingInput } : null);
    setOrders(prev => prev.map(o => o.id === selectedOrder.id ? { ...o, tracking_number: trackingInput } : o));
    setIsEditingTracking(false);
  }

  const handleReturnItem = async (item: OrderItem) => {
    if (!selectedOrder) return
    const confirmReturn = confirm("Remove item from invoice and return quantity to warehouse stock?")
    if (!confirmReturn) return

    const { data: variant } = await supabase.from('product_variants').select('stock_quantity').eq('id', item.product_variant_id).single()
    if (variant) await supabase.from('product_variants').update({ stock_quantity: variant.stock_quantity + item.quantity }).eq('id', item.product_variant_id)

    const revisedTotal = Math.max(0, selectedOrder.total_amount - (item.price * item.quantity))
    await supabase.from("order_items").delete().eq("id", item.id)
    await supabase.from("orders").update({ total_amount: revisedTotal }).eq("id", selectedOrder.id)

    setSelectedOrderItems(prev => prev.filter(i => i.id !== item.id))
    setSelectedOrder(prev => prev ? { ...prev, total_amount: revisedTotal } : null)
    setOrders(prev => prev.map(o => o.id === selectedOrder.id ? { ...o, total_amount: revisedTotal } : o))
    loadCatalog() 
  }

  const handleAddLineItemToExisting = async (variantId: string) => {
    if (!selectedOrder) return
    const target = allVariants.find(v => v.id === variantId)
    if (!target || target.stock_quantity < 1) return alert("Item out of stock.")

    await supabase.from('product_variants').update({ stock_quantity: target.stock_quantity - 1 }).eq('id', variantId)

    const { data, error } = await supabase
      .from("order_items")
      .insert({ order_id: selectedOrder.id, product_id: target.product_id, product_variant_id: variantId, quantity: 1, price: target.price })
      .select('*')
      .single()

    if (error) console.error("Insert Error", error);

    if (data) {
      const newItem: OrderItem = {
         id: data.id, 
         order_id: data.order_id, 
         product_variant_id: data.product_variant_id, 
         quantity: data.quantity, 
         price: data.price,
         products: { name: target.product_name },
         product_variants: { attributes: { label: target.variant_name } }
      }
      const revisedTotal = selectedOrder.total_amount + target.price
      await supabase.from("orders").update({ total_amount: revisedTotal }).eq("id", selectedOrder.id)
      
      setSelectedOrderItems(prev => [...prev, newItem])
      setSelectedOrder(prev => prev ? { ...prev, total_amount: revisedTotal } : null)
      setOrders(prev => prev.map(o => o.id === selectedOrder.id ? { ...o, total_amount: revisedTotal } : o))
      loadCatalog() 
    }
  }

  const handleCreateManualOrder = async (e: React.FormEvent) => {
    e.preventDefault()
    if (newOrderItems.length === 0) return alert("Add at least one item.")

    const calculatedSubtotal = newOrderItems.reduce((acc, item) => {
      const match = allVariants.find(v => v.id === item.variantId)
      return acc + (match ? match.price * item.quantity : 0)
    }, 0)
    const totalWithShipping = calculatedSubtotal + Number(newOrderShippingCost)

    const shippingPayload = {
      first_name: newOrderFirstName, last_name: newOrderLastName,
      address: newOrderAddress, phone: newOrderPhone
    }

    const { data: orderData, error: orderErr } = await supabase.from("orders").insert({
        email: newOrderEmail, status: newOrderStatus, shipping_cost: Number(newOrderShippingCost),
        total_amount: totalWithShipping, tax: 0, shipping_address: shippingPayload
    }).select().single()

    if (orderErr) return alert(`Order execution failure: ${orderErr.message}`)

    const itemsPayload = newOrderItems.map(item => {
      const match = allVariants.find(v => v.id === item.variantId)
      return {
         order_id: orderData.id,
         product_id: match?.product_id,
         product_variant_id: item.variantId, 
         quantity: item.quantity, 
         price: match?.price || 0
       }
    })
    
    const { error: itemsErr } = await supabase.from("order_items").insert(itemsPayload)
    if (itemsErr) {
       console.error(itemsErr)
       return alert(`Line item construction failure. Check console.`)
    }

if (newOrderStatus === "shipped") {
       console.log("Dispatching manual order email...");
       await sendDispatchNotification(
         newOrderEmail,
         newOrderFirstName,
         orderData.id,
         "PENDING"
       );
    }

    if (newOrderStatus !== "draft") {
      for (const item of newOrderItems) {
        const match = allVariants.find(v => v.id === item.variantId)
        if (match) await supabase.from('product_variants').update({ stock_quantity: match.stock_quantity - item.quantity }).eq('id', item.variantId)
      }
    }

    setNewOrderEmail(""); setNewOrderFirstName(""); setNewOrderLastName(""); setNewOrderPhone(""); setNewOrderAddress("")
    setNewOrderShippingCost(0); setNewOrderItems([]); setIsCreateOpen(false)
    loadOrders(); loadCatalog()
  }

  const filtered = orders.filter((o) => {
    const s = (search || "").toLowerCase()
    return (o.id || "").toLowerCase().includes(s) || (o.status || "").toLowerCase().includes(s) || (o.email || "").toLowerCase().includes(s)
  })

  const newOrderSubtotal = newOrderItems.reduce((acc, item) => {
    const match = allVariants.find(v => v.id === item.variantId)
    return acc + (match ? match.price * item.quantity : 0)
  }, 0)
  const newOrderFinalTotal = newOrderSubtotal + newOrderShippingCost

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto px-4 py-2">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight uppercase">Logistics Pipeline</h1>
          <p className="text-xs font-mono text-gray-500 mt-1 uppercase">System Manifest: {orders.length} Records</p>
        </div>
        <Button onClick={() => setIsCreateOpen(true)} className="bg-black hover:bg-zinc-800 text-white font-bold rounded-none uppercase tracking-widest text-xs h-12 px-6">
          <Plus className="h-4 w-4 mr-2" /> Manual Generation
        </Button>
      </div>

      <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Filter by Reference, Status, or Email..." className="max-w-md bg-white rounded-none border-zinc-200 h-11 text-sm" />

      <div className="bg-white rounded-none border border-zinc-200 overflow-hidden shadow-sm">
        {isLoading ? (
          <div className="p-16 text-center text-xs font-mono text-gray-400 uppercase tracking-widest">Polling Datastore...</div>
        ) : filtered.length === 0 ? (
          <div className="p-16 text-center text-xs font-mono text-gray-400 uppercase tracking-widest">No parameters match.</div>
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
                {filtered.map((order, index) => (
                  <motion.tr
                    key={order.id} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.015 }}
                    className="hover:bg-zinc-50/70 cursor-pointer" onClick={() => handleViewDetails(order)}
                  >
                    <td className="px-6 py-4 font-mono text-xs font-bold text-black uppercase">#{order.id.substring(0, 8)}</td>
                    <td className="px-6 py-4">
                      <div className="font-semibold text-zinc-900">{order.shipping_address?.first_name} {order.shipping_address?.last_name}</div>
                      <div className="text-xs text-zinc-400 font-mono">{order.email}</div>
                    </td>
                    <td className="px-6 py-4 text-zinc-600 text-xs font-mono">{new Date(order.created_at).toLocaleDateString()}</td>
                    <td className="px-6 py-4" onClick={(e) => e.stopPropagation()}>
                      <select
                        value={order.status} onChange={(e) => updateStatus(order.id, e.target.value)}
                        className={`text-[10px] font-mono font-bold uppercase tracking-wider px-3 py-1.5 rounded-full border-0 cursor-pointer ${statusColors[order.status]}`}
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
                    <td className="px-6 py-4 font-bold">{formatCurrency(order.total_amount)}</td>
                    <td className="px-6 py-4 text-right">
                      <Button variant="ghost" size="sm" className="h-8 text-xs font-medium text-zinc-500 rounded-none"><Eye className="h-3.5 w-3.5 mr-1.5" /> Details</Button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Sheet open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <SheetContent className="sm:max-w-xl w-full overflow-y-auto bg-white rounded-none border-l border-zinc-200 p-8 space-y-8">
          {selectedOrder && (
            <>
              <SheetHeader className="space-y-2 border-b border-zinc-100 pb-6">
                <div className="text-[10px] font-mono tracking-widest text-zinc-400 uppercase">Fulfillment Matrix</div>
                <SheetTitle className="text-2xl font-black uppercase tracking-tight">Manifest #{selectedOrder.id.substring(0, 12).toUpperCase()}</SheetTitle>
              </SheetHeader>

              <div className="space-y-4">
                <h3 className="text-[11px] font-mono font-bold tracking-widest uppercase text-zinc-400">Consignee Routing Details</h3>
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
                    <span className="col-span-2 font-mono text-xs text-zinc-700">{selectedOrder.shipping_address?.phone || "N/A"}</span>
                  </div>
                  <div className="grid grid-cols-3">
                    <span className="text-xs font-mono uppercase text-zinc-400">Physical Drop</span>
                    <span className="col-span-2 text-xs text-zinc-600 leading-relaxed">{selectedOrder.shipping_address?.address || "N/A"}</span>
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
                          <Button size="sm" className="h-8 rounded-none text-[10px] uppercase font-bold" onClick={handleSaveTracking}>Save</Button>
                        </div>
                      ) : (
                        <div className="flex items-center justify-between">
                          <span className="font-mono text-xs text-zinc-800 font-bold">
                            {selectedOrder.tracking_number || "AWAITING DISPATCH"}
                          </span>
                          <Button variant="ghost" size="sm" className="h-6 text-[10px] uppercase text-zinc-400 hover:text-black" onClick={() => { setTrackingInput(selectedOrder.tracking_number || ""); setIsEditingTracking(true); }}>
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
                  <h3 className="text-[11px] font-mono font-bold tracking-widest uppercase text-zinc-400">Allocated Line Items</h3>
                  <Button variant="outline" size="sm" className="h-7 text-[10px] font-mono uppercase rounded-none tracking-wider" onClick={() => setIsEditingItems(!isEditingItems)}>
                    {isEditingItems ? <span className="text-green-600 font-bold">Lock Ledger</span> : <span className="flex items-center"><ArrowLeftRight className="h-3 w-3 mr-1" /> Returns & Exchanges</span>}
                  </Button>
                </div>

                <div className="divide-y divide-zinc-100 border border-zinc-100">
                  {selectedOrderItems.length === 0 && <div className="p-4 text-xs text-zinc-400 text-center font-mono">No products connected.</div>}
                  {selectedOrderItems.map((item) => (
                    <div key={item.id} className="p-4 flex items-center justify-between text-sm hover:bg-zinc-50/50">
                      <div>
                        <div className="font-bold text-zinc-900 uppercase tracking-tight">{item.products?.name}</div>
                        <div className="text-xs text-zinc-500 uppercase font-mono mt-0.5">
                          {item.product_variants?.attributes ? Object.values(item.product_variants.attributes).join(" / ") : "Standard"}
                        </div>
                        <div className="text-xs font-mono text-zinc-400 mt-1">QTY: {item.quantity} × {formatCurrency(item.price)}</div>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="font-bold text-zinc-900">{formatCurrency(item.price * item.quantity)}</span>
                        {isEditingItems && (
                          <Button variant="ghost" size="sm" className="h-8 text-xs text-red-500 hover:text-red-700 bg-red-50 rounded-none uppercase font-bold tracking-widest" onClick={() => handleReturnItem(item)}>
                            Return to Stock
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {isEditingItems && (
                  <div className="p-4 bg-zinc-50 border border-dashed border-zinc-200 space-y-2">
                    <label className="text-[10px] font-mono uppercase tracking-widest text-zinc-400 block">Inject New Variant (Deducts Stock)</label>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3 w-3 text-zinc-400" />
                      <Input placeholder="Search catalog..." value={variantSearchQuery} onChange={e => setVariantSearchQuery(e.target.value)} className="pl-8 rounded-none h-9 text-xs border-zinc-200" />
                    </div>
                    {variantSearchQuery && (
                      <div className="max-h-40 overflow-y-auto border border-zinc-200 bg-white shadow-sm z-10 relative">
                        {allVariants.filter(v => v.product_name.toLowerCase().includes(variantSearchQuery.toLowerCase())).map(v => (
                          <div key={v.id} className="px-3 py-2 text-xs cursor-pointer hover:bg-zinc-100 border-b border-zinc-100 flex justify-between items-center"
                            onClick={() => {
                              handleAddLineItemToExisting(v.id); setVariantSearchQuery("");
                            }}>
                            <div><span className="font-bold uppercase">{v.product_name}</span> <span className="text-zinc-500 font-mono text-[10px]">({v.variant_name})</span></div>
                            <div className="text-right">
                              <div>{formatCurrency(v.price)}</div>
                              <div className={v.stock_quantity > 0 ? "text-green-600 font-mono text-[9px] font-bold" : "text-red-500 font-mono text-[9px] font-bold"}>{v.stock_quantity} In Stock</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="space-y-4 pt-4 border-t border-zinc-100">
                <div className="flex justify-between text-zinc-500 font-light text-sm">
                  <span>Shipping Route Surcharge</span><span className="font-mono">{formatCurrency(selectedOrder.shipping_cost)}</span>
                </div>
                <div className="flex justify-between text-base font-black text-zinc-900 pt-3 border-t border-zinc-100 uppercase tracking-tight">
                  <span>Net Ledger Amount</span><span className="font-mono">{formatCurrency(selectedOrder.total_amount)}</span>
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>

      <Sheet open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <SheetContent className="sm:max-w-xl w-full overflow-y-auto bg-white rounded-none border-l border-zinc-200 p-8">
          <form onSubmit={handleCreateManualOrder} className="space-y-6">
            <SheetHeader className="space-y-1 border-b border-zinc-100 pb-4">
              <SheetTitle className="text-2xl font-black uppercase tracking-tight">Generate Direct Order</SheetTitle>
            </SheetHeader>

            <div className="space-y-3">
              <h3 className="text-[10px] font-mono font-bold tracking-widest uppercase text-zinc-400">Customer Identity</h3>
              {knownCustomers.length > 0 && (
                <select className="w-full h-10 border border-zinc-200 bg-zinc-50 px-3 text-xs font-mono focus:outline-none rounded-none" onChange={(e) => handleCustomerSelect(e.target.value)} defaultValue="">
                  <option value="" disabled>Auto-fill from previous customers...</option>
                  {knownCustomers.map(c => <option key={c.email} value={c.email}>{c.first_name} {c.last_name} — {c.email}</option>)}
                </select>
              )}
              <div className="space-y-2">
                <Input placeholder="Email Address" type="email" required value={newOrderEmail} onChange={e => setNewOrderEmail(e.target.value)} className="rounded-none h-10 text-xs" />
                <div className="grid grid-cols-2 gap-2">
                  <Input placeholder="First Name" required value={newOrderFirstName} onChange={e => setNewOrderFirstName(e.target.value)} className="rounded-none h-10 text-xs" />
                  <Input placeholder="Last Name" required value={newOrderLastName} onChange={e => setNewOrderLastName(e.target.value)} className="rounded-none h-10 text-xs" />
                </div>
                <Input placeholder="Phone" type="tel" required value={newOrderPhone} onChange={e => setNewOrderPhone(e.target.value)} className="rounded-none h-10 text-xs" />
                <Input placeholder="Address" required value={newOrderAddress} onChange={e => setNewOrderAddress(e.target.value)} className="rounded-none h-10 text-xs" />
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="text-[10px] font-mono font-bold tracking-widest uppercase text-zinc-400">Cargo Manifest Build</h3>
              <div className="space-y-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
                  <Input placeholder="Search catalog..." value={variantSearchQuery} onChange={e => setVariantSearchQuery(e.target.value)} className="pl-9 rounded-none h-11 text-xs border-zinc-200" />
                </div>
                {variantSearchQuery && (
                  <div className="max-h-40 overflow-y-auto border border-zinc-200 bg-white shadow-sm z-10 relative">
                    {allVariants.filter(v => v.product_name.toLowerCase().includes(variantSearchQuery.toLowerCase())).map(v => (
                      <div key={v.id} className={`px-3 py-2 text-xs border-b border-zinc-100 flex justify-between items-center ${v.stock_quantity > 0 ? "cursor-pointer hover:bg-zinc-100" : "opacity-50 cursor-not-allowed bg-zinc-50"}`}
                        onClick={() => {
                          if (v.stock_quantity < 1) return;
                          const exists = newOrderItems.find(i => i.variantId === v.id)
                          if (exists && exists.quantity >= v.stock_quantity) return alert("Cannot exceed available stock.")
                          if (exists) setNewOrderItems(prev => prev.map(i => i.variantId === v.id ? { ...i, quantity: i.quantity + 1 } : i))
                          else setNewOrderItems(prev => [...prev, { variantId: v.id, quantity: 1 }])
                          setVariantSearchQuery("") 
                        }}
                      >
                        <div><span className="font-bold uppercase">{v.product_name}</span> <span className="text-zinc-500 font-mono text-[10px]">({v.variant_name})</span></div>
                        <div className="text-right">
                          <div>{formatCurrency(v.price)}</div>
                          <div className={v.stock_quantity > 0 ? "text-green-600 font-mono text-[9px] font-bold" : "text-red-500 font-mono text-[9px] font-bold"}>{v.stock_quantity} In Stock</div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {newOrderItems.length > 0 && (
                <div className="border border-zinc-100 divide-y divide-zinc-100 max-h-40 overflow-y-auto mt-2">
                  {newOrderItems.map((item, index) => {
                    const matchedVariant = allVariants.find(v => v.id === item.variantId)
                    return (
                      <div key={index} className="p-3 text-xs flex items-center justify-between bg-zinc-50/50">
                        <div>
                          <div className="font-bold text-zinc-900 uppercase">{matchedVariant?.product_name}</div>
                          <div className="text-zinc-400 uppercase text-[10px] mt-0.5">{matchedVariant?.variant_name}</div>
                        </div>
                        <div className="flex items-center gap-3">
                          <input 
                            type="number" min="1" max={matchedVariant?.stock_quantity || 1}
                            className="w-12 text-center h-7 border border-zinc-200 font-mono text-xs" 
                            value={item.quantity} 
                            onChange={(e) => {
                              const max = matchedVariant?.stock_quantity || 1
                              let val = parseInt(e.target.value) || 1
                              if (val > max) val = max
                              setNewOrderItems(prev => prev.map(i => i.variantId === item.variantId ? { ...i, quantity: Math.max(1, val) } : i))
                            }} 
                          />
                          <Button type="button" variant="ghost" size="icon" className="h-6 w-6 text-red-500" onClick={() => setNewOrderItems(prev => prev.filter(i => i.variantId !== item.variantId))}><Trash2 className="h-3.5 w-3.5" /></Button>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>

            <div className="space-y-3 pt-2">
              <h3 className="text-[10px] font-mono font-bold tracking-widest uppercase text-zinc-400">Logistics Cost Overrides</h3>
              <div className="space-y-1 relative">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
                  <Input placeholder={newOrderShippingCost > 0 ? `Selected: Ksh ${newOrderShippingCost}` : "Search destination..."} value={shippingSearchQuery} onChange={e => setShippingSearchQuery(e.target.value)} className="pl-9 rounded-none h-11 text-xs border-zinc-200" />
                </div>
                {shippingSearchQuery && (
                  <div className="max-h-40 overflow-y-auto border border-zinc-200 bg-white shadow-sm z-10 absolute w-full top-[44px]">
                    <div className="px-3 py-2 text-xs cursor-pointer hover:bg-zinc-100 border-b border-zinc-100 text-red-600 font-mono font-bold" onClick={() => { setNewOrderShippingCost(0); setShippingSearchQuery(""); }}>Clear / No Surcharge (Ksh 0)</div>
                    {kenyanShippingRates.filter(r => r.name.toLowerCase().includes(shippingSearchQuery.toLowerCase())).map(rate => (
                        <div key={rate.id} className="px-3 py-2 text-xs cursor-pointer hover:bg-zinc-100 border-b border-zinc-100 last:border-0" onClick={() => { setNewOrderShippingCost(rate.price); setShippingSearchQuery(""); }}>
                          <span className="font-bold">{rate.name}</span> — {formatCurrency(rate.price)}
                        </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="pt-6 border-t border-zinc-200 space-y-2">
              <div className="flex justify-between text-xs text-zinc-500 font-mono"><span>Total Goods Value:</span><span>{formatCurrency(newOrderSubtotal)}</span></div>
              <div className="flex justify-between text-xs text-zinc-500 font-mono"><span>Shipping Surcharge:</span><span>{formatCurrency(newOrderShippingCost)}</span></div>
              <div className="flex justify-between text-base font-black text-black pt-2 border-t border-zinc-200"><span className="uppercase">Final Receipt:</span><span>{formatCurrency(newOrderFinalTotal)}</span></div>
            </div>
            
            <div className="pt-2">
              <label className="text-[10px] font-mono font-bold tracking-widest uppercase text-zinc-400 block mb-2">Order Execution Protocol</label>
              <select className="w-full h-11 border border-zinc-200 bg-zinc-50 px-3 text-xs font-bold font-mono focus:outline-none rounded-none text-zinc-700" value={newOrderStatus} onChange={e => setNewOrderStatus(e.target.value)}>
                <option value="reserved">Reserve Order (DEDUCT STOCK NOW)</option>
                <option value="draft">Save as Draft (DO NOT DEDUCT STOCK)</option>
              </select>
            </div>

            <div className="pt-2 grid grid-cols-2 gap-3">
              <Button type="button" variant="outline" className="h-12 text-xs font-bold uppercase rounded-none tracking-widest" onClick={() => setIsCreateOpen(false)}>Cancel</Button>
              <Button type="submit" className="h-12 text-xs font-bold uppercase rounded-none tracking-widest bg-black text-white hover:bg-zinc-800">Execute Order</Button>
            </div>
          </form>
        </SheetContent>
      </Sheet>
    </div>
  )
}