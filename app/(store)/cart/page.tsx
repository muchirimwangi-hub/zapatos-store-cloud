"use client"

import { motion } from "framer-motion"
import { Minus, Plus, ShoppingBag, ArrowRight, Trash2 } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useCartStore } from "@/lib/store/cart-store"
import { formatCurrency, getProductImageUrl } from "@/lib/utils"
import { useEffect, useState } from "react"

export default function CartPage() {
  const { items, updateQuantity, removeItem, getTotal, getItemCount } = useCartStore()
  const [isMounted, setIsMounted] = useState(false)
  const easeQuint = [0.16, 1, 0.3, 1]

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) {
    return (
      <div className="min-h-screen bg-white dark:bg-[#08080A] flex flex-col items-center justify-center font-mono text-[10px] uppercase tracking-[0.3em] text-zinc-400">
        Loading Bag State...
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white dark:bg-[#08080A] text-zinc-900 dark:text-zinc-100 font-sans antialiased transition-colors duration-500 py-32 md:py-44 relative">
      
      {/* MINIMALIST GEOMETRIC BACKGROUND OVERLAY */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] dark:opacity-[0.02] bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:40px_40px] z-0" />

      <div className="max-w-6xl mx-auto px-6 relative z-10">
        
        {/* PAGE HEADER */}
        <div className="border-b border-zinc-100 dark:border-zinc-900 pb-8 text-left mb-12">
          <span className="text-[10px] font-mono text-zinc-400 dark:text-zinc-600 tracking-widest uppercase">Shopping Bag Summary</span>
          <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter text-zinc-950 dark:text-white mt-2">
            Your Selection ({getItemCount()})
          </h1>
        </div>

        {items.length === 0 ? (
          /* EMPTY CART STATE */
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: easeQuint }}
            className="flex flex-col items-center justify-center py-24 text-center space-y-6 border border-zinc-100 dark:border-zinc-900 bg-zinc-50 dark:bg-[#0C0C10]"
          >
            <ShoppingBag className="h-10 w-10 text-zinc-300 dark:text-zinc-700 stroke-[1.2]" />
            <div className="space-y-1">
              <h2 className="text-sm font-black uppercase tracking-wider text-zinc-950 dark:text-white">Your bag is currently empty</h2>
              <p className="text-xs text-zinc-400 dark:text-zinc-500 font-light max-w-sm mx-auto leading-relaxed">
                Review our latest drops or browse our signature collections to populate your checkout selection.
              </p>
            </div>
            <Button 
              className="bg-black dark:bg-white text-white dark:text-black hover:bg-zinc-800 dark:hover:bg-zinc-200 rounded-none h-12 px-8 text-xs font-black uppercase tracking-widest transition-transform active:scale-95"
              asChild
            >
              <Link href="/shop">
                Explore Apparel
              </Link>
            </Button>
          </motion.div>
        ) : (
          /* MAIN CART LAYOUT SPLIT GRID */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
            
            {/* LEFT COLUMN: PRODUCTS LIST ARRAY */}
            <div className="lg:col-span-8 space-y-6">
              {items.map((item) => {
                const activeOptions = (item as any).selectedOptions || {};

                return (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex gap-6 p-6 border border-zinc-100 dark:border-zinc-900 bg-zinc-50/50 dark:bg-[#0C0C10]/40 transition-colors duration-300 rounded-none items-start relative group"
                  >
                    {/* Image Thumbnail Frame */}
                    <Link
                      href={`/shop/${item.product.slug}`}
                      className="flex-shrink-0 w-24 h-28 border border-zinc-200 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-900 overflow-hidden hover:opacity-80 transition-opacity rounded-none"
                    >
                      <div
                        className="w-full h-full bg-cover bg-center grayscale dark:brightness-[0.75]"
                        style={{ backgroundImage: `url('${getProductImageUrl(item.product)}')` }}
                      />
                    </Link>

                    {/* Meta Info Context Matrix */}
                    <div className="flex-1 min-w-0 flex flex-col sm:flex-row justify-between gap-4 h-full">
                      <div className="space-y-1 text-left">
                        <Link
                          href={`/shop/${item.product.slug}`}
                          className="block text-sm font-black uppercase tracking-tight text-zinc-950 dark:text-white hover:opacity-70 transition-opacity"
                        >
                          {item.product.name}
                        </Link>
                        <p className="text-[10px] font-mono font-bold text-zinc-400 dark:text-zinc-600 uppercase tracking-wider">
                          Premium Edition
                        </p>

                        {/* Selected parameters loop */}
                        {Object.keys(activeOptions).length > 0 && (
                          <div className="flex flex-wrap gap-x-3 pt-2 text-[10px] font-mono uppercase text-zinc-400 dark:text-zinc-500">
                            {Object.entries(activeOptions).map(([key, val]) => (
                              <span key={key} className="bg-zinc-100 dark:bg-[#121218] px-2 py-0.5 border border-zinc-200/40 dark:border-zinc-800/40">
                                {key}: {String(val)}
                              </span>
                            ))}
                          </div>
                        )}

                        {/* Quantity adjust triggers */}
                        <div className="flex items-center gap-4 pt-4">
                          <div className="flex items-center border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#08080A]">
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="p-1.5 text-zinc-400 hover:text-zinc-950 dark:hover:text-white transition-colors"
                              aria-label="Decrease quantity"
                            >
                              <Minus className="h-3 w-3 stroke-[2]" />
                            </button>
                            <span className="px-3 text-xs font-mono font-bold text-zinc-950 dark:text-white min-w-[20px] text-center">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              disabled={item.quantity >= item.product.stock_quantity}
                              className="p-1.5 text-zinc-400 hover:text-zinc-950 dark:hover:text-white transition-colors disabled:opacity-20"
                              aria-label="Increase quantity"
                            >
                              <Plus className="h-3 w-3 stroke-[2]" />
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Pricing summary columns */}
                      <div className="sm:text-right flex sm:flex-col justify-between sm:justify-between items-center sm:items-end flex-shrink-0 h-full min-h-[80px]">
                        <p className="text-sm font-black text-zinc-950 dark:text-white">
                          {formatCurrency(item.product.price * item.quantity)}
                        </p>
                        
                        <button
                          onClick={() => removeItem(item.id)}
                          className="p-2 border border-zinc-200 dark:border-zinc-900 hover:border-red-500 dark:hover:border-red-500/50 text-zinc-400 hover:text-red-500 transition-all rounded-none sm:mt-auto"
                          aria-label="Remove item"
                        >
                          <Trash2 className="h-3.5 w-3.5 stroke-[1.5]" />
                        </button>
                      </div>
                    </div>

                  </motion.div>
                )
              })}
            </div>

            {/* RIGHT COLUMN: TRANSACTION SUMMARY CARD */}
            <div className="lg:col-span-4 border border-zinc-100 dark:border-zinc-900 bg-zinc-50 dark:bg-[#0C0C10] p-8 transition-colors duration-500 rounded-none">
              <h2 className="text-xs font-black uppercase tracking-widest text-zinc-950 dark:text-white border-b border-zinc-200 dark:border-zinc-900 pb-4 mb-6">
                Order Summary
              </h2>
              
              <div className="space-y-4 text-xs">
                <div className="flex justify-between text-zinc-500 dark:text-zinc-400 font-light">
                  <span>Bag Subtotal</span>
                  <span className="font-mono font-medium">{formatCurrency(getTotal())}</span>
                </div>
                <div className="flex justify-between text-zinc-500 dark:text-zinc-400 font-light border-b border-zinc-200/60 dark:border-zinc-900/60 pb-4">
                  <span>Estimated Delivery</span>
                  <span className="font-mono text-[10px] text-zinc-400 uppercase tracking-wider">Calculated next</span>
                </div>
                <div className="flex justify-between items-baseline pt-2 text-sm">
                  <span className="font-black text-zinc-950 dark:text-white uppercase tracking-wider text-[11px]">Total Aggregate</span>
                  <span className="text-xl font-black text-zinc-950 dark:text-white font-mono">{formatCurrency(getTotal())}</span>
                </div>
              </div>

              <p className="text-[10px] font-mono text-zinc-400 dark:text-zinc-500 text-center uppercase tracking-wider mt-6 leading-relaxed">
                Logistics routes and shipping fields finalized at processing.
              </p>

              <div className="space-y-2 pt-6">
                <Button 
                  size="lg" 
                  className="w-full bg-black dark:bg-white text-white dark:text-black hover:bg-zinc-800 dark:hover:bg-zinc-200 rounded-none h-14 text-xs font-black tracking-[0.25em] uppercase transition-transform active:scale-95 flex items-center justify-center gap-2" 
                  asChild
                >
                  <Link href="/checkout">
                    PROCEED TO CHECKOUT
                    <ArrowRight className="h-4 w-4 stroke-[2]" />
                  </Link>
                </Button>

                <Button
                  size="lg"
                  variant="outline"
                  className="w-full border-zinc-200 dark:border-zinc-800 bg-transparent text-zinc-800 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-900 rounded-none h-12 text-xs font-black tracking-widest uppercase transition-transform active:scale-95"
                  asChild
                >
                  <Link href="/shop">
                    CONTINUE SHOPPING
                  </Link>
                </Button>
              </div>

            </div>

          </div>
        )}

      </div>
    </div>
  )
}