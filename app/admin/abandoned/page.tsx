"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Trash2, AlertTriangle, RefreshCw, ShoppingBag, Phone, Mail } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { formatCurrency } from "@/lib/utils"

interface AbandonedCartRow {
  id: string
  session_id: string
  email: string | null
  phone: string | null
  first_name: string | null
  last_name: string | null
  items: any[]
  total_value: number
  status: 'abandoned' | 'payment_failed' | 'recovered'
  last_active: string
}

const statusBadges: Record<string, string> = {
  abandoned: "bg-gray-100 text-gray-700 border border-gray-300",
  payment_failed: "bg-red-50 text-red-700 border border-red-200 font-bold",
  recovered: "bg-green-100 text-green-800 border border-green-200",
}

export default function AbandonedCartsPage() {
  const [carts, setCarts] = useState<AbandonedCartRow[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const supabase = createClient()

  const loadCarts = async () => {
    setIsLoading(true)
    const { data } = await supabase
      .from("abandoned_carts")
      .select("*")
      .order("last_active", { ascending: false })
    
    if (data) setCarts(data as AbandonedCartRow[])
    setIsLoading(false)
  }

  useEffect(() => {
    loadCarts()
  }, [])

  // Analytical Totals
  const totalLostValue = carts
    .filter(c => c.status !== 'recovered')
    .reduce((acc, curr) => acc + Number(curr.total_value || 0), 0)

  const failedPaymentCount = carts.filter(c => c.status === 'payment_failed').length

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto px-4 py-2">
      {/* Header Pipeline */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight uppercase">Checkout Drop-Off Monitor</h1>
          <p className="text-xs font-mono text-gray-500 mt-1 uppercase">Leakage Matrix: {carts.length} Sessions Logged</p>
        </div>
        <button 
          onClick={loadCarts}
          className="flex items-center justify-center gap-2 border border-zinc-300 bg-white hover:bg-zinc-50 font-mono text-xs uppercase tracking-wider h-11 px-4 self-start sm:self-center"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${isLoading ? 'animate-spin' : ''}`} /> Sync Metrics
        </button>
      </div>

      {/* Analytics Command Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-white border border-zinc-200 p-6 flex flex-col justify-between">
          <span className="text-[11px] font-mono text-zinc-400 uppercase tracking-widest block">Trapped Pipeline Value</span>
          <span className="text-3xl font-black font-mono text-black mt-2">{formatCurrency(totalLostValue)}</span>
        </div>
        <div className="bg-red-50/50 border border-red-100 p-6 flex flex-col justify-between">
          <span className="text-[11px] font-mono text-red-500 uppercase tracking-widest block">Active Payment Rejections</span>
          <span className="text-3xl font-black font-mono text-red-600 mt-2">{failedPaymentCount} Gateways Flagged</span>
        </div>
        <div className="bg-zinc-900 border border-zinc-900 p-6 flex flex-col justify-between text-white md:col-span-2 lg:col-span-1">
          <span className="text-[11px] font-mono text-zinc-400 uppercase tracking-widest block">Recovery Instruction</span>
          <p className="text-xs text-zinc-300 leading-relaxed mt-2 uppercase font-mono">Use profiles below with missing references to launch custom target re-engagement campaigns via WhatsApp or Email channels.</p>
        </div>
      </div>

      {/* Primary Log Grid */}
      <div className="bg-white border border-zinc-200 overflow-hidden">
        {isLoading ? (
          <div className="p-16 text-center text-xs font-mono text-gray-400 uppercase tracking-widest">Polling Live Interceptions...</div>
        ) : carts.length === 0 ? (
          <div className="p-16 text-center text-xs font-mono text-gray-400 uppercase tracking-widest">No dropped carts detected in this frame.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-zinc-200 bg-zinc-50 text-[11px] font-mono uppercase text-zinc-500 tracking-wider">
                  <th className="px-6 py-4">Session Target / Timestamp</th>
                  <th className="px-6 py-4">Fulfillment Diagnostic</th>
                  <th className="px-6 py-4">Manifest Breakout</th>
                  <th className="px-6 py-4 text-right">Lost Value</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 text-sm">
                {carts.map((cart, idx) => {
                  // Safely parse items
                  const parsedItems = Array.isArray(cart.items) 
                    ? cart.items 
                    : (typeof cart.items === 'string' ? JSON.parse(cart.items) : []);

                  // Safely calculate math to eliminate NaN errors
                  const rawItemsTotal = parsedItems.reduce((sum: number, it: any) => {
                    const price = Number(it.price || it.product?.price || it.variant?.price || 0);
                    const qty = Number(it.quantity || 1);
                    return sum + (price * qty);
                  }, 0);
                  
                  const cartTotal = isNaN(Number(cart.total_value)) ? 0 : Number(cart.total_value);
                  const calculatedShipping = cartTotal - rawItemsTotal;

                  return (
                    <motion.tr 
                      key={cart.id}
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.01 }}
                      className="hover:bg-zinc-50/40 vertical-align-top align-top"
                    >
                      {/* Customer Profiling */}
                      <td className="px-6 py-4 max-w-xs">
                        <div className="font-semibold text-zinc-900 uppercase tracking-tight">
                          {cart.first_name || cart.last_name ? `${cart.first_name || ''} ${cart.last_name || ''}` : "Anonymous Session"}
                        </div>
                        <div className="space-y-1 mt-1.5 font-mono text-xs text-zinc-500">
                          {cart.email && <div className="flex items-center gap-1.5"><Mail className="h-3 w-3 flex-shrink-0 text-zinc-400" /> {cart.email}</div>}
                          {cart.phone && <div className="flex items-center gap-1.5"><Phone className="h-3 w-3 flex-shrink-0 text-zinc-400" /> {cart.phone}</div>}
                          <div className="text-[10px] text-zinc-400 pt-1">Active: {new Date(cart.last_active).toLocaleString()}</div>
                        </div>
                      </td>

                      {/* Status Vector */}
                      <td className="px-6 py-4">
                        <span className={`inline-block px-2.5 py-1 text-[10px] font-mono uppercase tracking-wider rounded-none ${statusBadges[cart.status] || statusBadges.abandoned}`}>
                          {cart.status === 'payment_failed' ? '🚨 PAYMENT REJECTED' : '💤 TAB ABANDONED'}
                        </span>
                      </td>

                      {/* Array Breakout & Developer X-Ray */}
                      <td className="px-6 py-4 max-w-md">
                        <div className="space-y-2">
                          {parsedItems.map((item: any, i: number) => {
                            const itemName = item.product?.name || item.name || item.title || item.variant?.product?.name || "Unknown Apparel Item";
                            
                            // Find the attributes and parse them if they are stored as a string
                            let rawAttrs = item.selectedOptions || item.attributes || item.selectedAttributes || item.variant?.attributes || item.options || null;
                            if (typeof rawAttrs === 'string') {
                              try { rawAttrs = JSON.parse(rawAttrs) } catch(e) {}
                            }

                            let attributeValues = "";
                            if (rawAttrs && typeof rawAttrs === 'object') {
                              attributeValues = Object.values(rawAttrs)
                                .filter(val => typeof val === 'string' || typeof val === 'number')
                                .join(" / ");
                            }

                            return (
                              <div key={i} className="text-xs bg-zinc-50 border border-zinc-100 p-2 flex justify-between items-start">
                                <div className="w-full pr-2">
                                  <span className="font-bold uppercase text-zinc-800">{itemName}</span>
                                  
                                  {attributeValues ? (
                                    <span className="block text-[10px] text-zinc-500 font-bold uppercase font-mono mt-0.5">
                                      {attributeValues}
                                    </span>
                                  ) : (
                                    /* 🛠 THE X-RAY: If we still can't find them, reveal the raw data! */
                                    <details className="mt-1 cursor-pointer group">
                                      <summary className="text-[9px] text-blue-500 group-hover:text-blue-700 uppercase font-mono tracking-widest outline-none">
                                        [🔍 Inspect Cart Data]
                                      </summary>
                                      <pre className="mt-1 text-[8px] bg-zinc-900 text-green-400 p-2 overflow-x-auto rounded-none max-w-[200px]">
                                        {JSON.stringify(item, null, 2)}
                                      </pre>
                                    </details>
                                  )}
                                </div>
                                <span className="font-mono text-[11px] text-zinc-500 font-semibold bg-white border border-zinc-200 px-1.5 py-0.5 whitespace-nowrap h-fit">
                                  QTY: {item.quantity || 1}
                                </span>
                              </div>
                            )
                          })}
                        </div>
                      </td>

                      {/* Item Total & Shipping Breakdown */}
                      <td className="px-6 py-4 text-right">
                        <div className="font-mono font-bold text-zinc-900 text-sm">
                          {formatCurrency(cartTotal)}
                        </div>
                        <div className="mt-1 flex flex-col gap-0.5 items-end text-[10px] font-mono uppercase tracking-widest text-zinc-400">
                          <span>Items: {formatCurrency(rawItemsTotal)}</span>
                          <span>Shipping: {calculatedShipping > 0 ? formatCurrency(calculatedShipping) : "Pending/Zero"}</span>
                          
                          {/* Ready to display the Region name once we save it! */}
                          {(cart as any).shipping_region && (
                            <span className="text-blue-600 font-bold">Route: {(cart as any).shipping_region}</span>
                          )}
                        </div>
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}