"use client"

import { motion, AnimatePresence } from "framer-motion"
import { X, Minus, Plus, ShoppingBag, ArrowRight } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useCartStore } from "@/lib/store/cart-store"
import { formatCurrency, getProductImageUrl } from "@/lib/utils"

interface CartDrawerProps {
  isOpen: boolean
  onClose: () => void
}

export function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const { items, updateQuantity, removeItem, getTotal, getItemCount } = useCartStore()

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* BACKGROUND BLUR OVERLAY */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />

          {/* SLIDE OUT PANEL */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 32, stiffness: 300 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-white dark:bg-[#0C0C10] border-l border-zinc-100 dark:border-zinc-900 shadow-2xl z-50 flex flex-col transition-colors duration-500 rounded-none text-left"
          >
            {/* DRAWER HEADER */}
            <div className="flex items-center justify-between p-6 border-b border-zinc-100 dark:border-zinc-900 flex-shrink-0">
              <div>
                <h2 className="text-xl font-black uppercase tracking-tight text-zinc-950 dark:text-white">Shopping Bag</h2>
                <p className="text-[10px] font-mono text-zinc-400 dark:text-zinc-600 uppercase tracking-widest mt-1">
                  {getItemCount()} {getItemCount() === 1 ? 'item summary' : 'items indexed'}
                </p>
              </div>
              <button
                onClick={onClose}
                className="p-2 border border-transparent hover:border-zinc-200 dark:hover:border-zinc-800 text-zinc-400 hover:text-zinc-950 dark:hover:text-white transition-all rounded-none"
                aria-label="Close shopping bag"
              >
                <X className="h-5 w-5 stroke-[1.5]" />
              </button>
            </div>

            {/* CONTAINER LINE PIPELINE */}
            <div className="flex-1 overflow-y-auto p-6 relative">
              <div className="absolute inset-0 pointer-events-none opacity-[0.015] dark:opacity-[0.008] bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:30px_30px]" />

              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center py-12 relative z-10">
                  <ShoppingBag className="h-12 w-12 text-zinc-300 dark:text-zinc-700 mb-4 stroke-[1.2]" />
                  <h3 className="text-sm font-black uppercase tracking-wider text-zinc-950 dark:text-white mb-1">Your bag is empty</h3>
                  <p className="text-xs text-zinc-400 dark:text-zinc-500 max-w-[240px] mx-auto leading-relaxed mb-6">
                    No items have been assigned to your active checkout selection.
                  </p>
                  <Button 
                    onClick={onClose} 
                    className="bg-black dark:bg-white text-white dark:text-black hover:bg-zinc-800 dark:hover:bg-zinc-200 rounded-none text-xs font-black tracking-widest px-8 py-5 uppercase transition-transform active:scale-95"
                    asChild
                  >
                    <Link href="/shop">
                      Continue Shopping
                    </Link>
                  </Button>
                </div>
              ) : (
                <div className="space-y-6 relative z-10">
                  {items.map((item) => {
                    {/* FIXED: Read dynamic options exclusively from the cart item structure wrapper to satisfy static lint rules */}
                    const activeOptions = (item as any).selectedOptions || {};

                    return (
                      <motion.div
                        key={item.id}
                        layout
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: 50 }}
                        transition={{ duration: 0.25 }}
                        className="flex gap-4 pb-6 border-b border-zinc-100 dark:border-zinc-900/60"
                      >
                        {/* Product Thumbnail Layout Frame */}
                        <Link
                          href={`/shop/${item.product.slug}`}
                          onClick={onClose}
                          className="flex-shrink-0 w-20 h-24 border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-[#121218] overflow-hidden hover:opacity-80 transition-opacity rounded-none"
                        >
                          <div
                            className="w-full h-full bg-cover bg-center grayscale dark:brightness-[0.8]"
                            style={{ backgroundImage: `url('${getProductImageUrl(item.product)}')` }}
                          />
                        </Link>

                        {/* Product Metadata Matrix */}
                        <div className="flex-1 min-w-0 flex flex-col justify-between">
                          <div className="space-y-1 text-left">
                            <Link
                              href={`/shop/${item.product.slug}`}
                              onClick={onClose}
                              className="block text-sm font-black uppercase tracking-tight text-zinc-950 dark:text-white hover:opacity-70 transition-opacity truncate"
                            >
                              {item.product.name}
                            </Link>
                            
                            {/* Dynamic attributes loop */}
                            {Object.keys(activeOptions).length > 0 && (
                              <div className="flex flex-wrap gap-x-2 text-[10px] font-mono uppercase text-zinc-400 dark:text-zinc-600">
                                {Object.entries(activeOptions).map(([key, val]) => (
                                  <span key={key}>{key}: {String(val)}</span>
                                ))}
                              </div>
                            )}
                          </div>

                          <div className="flex items-end justify-between mt-2">
                            {/* Sizing & Quantity Interface Blocks */}
                            <div className="flex items-center gap-3">
                              <div className="flex items-center border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#08080A]">
                                <button
                                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                  className="p-1.5 text-zinc-400 hover:text-zinc-950 dark:hover:text-white transition-colors"
                                  aria-label="Decrease item parameter count"
                                >
                                  <Minus className="h-3 w-3 stroke-[2]" />
                                </button>
                                <span className="px-2 text-xs font-mono font-bold text-zinc-950 dark:text-white min-w-[20px] text-center">
                                  {item.quantity}
                                </span>
                                <button
                                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                  disabled={item.quantity >= item.product.stock_quantity}
                                  className="p-1.5 text-zinc-400 hover:text-zinc-950 dark:hover:text-white transition-colors disabled:opacity-20"
                                  aria-label="Increase item parameter count"
                                >
                                  <Plus className="h-3 w-3 stroke-[2]" />
                                </button>
                              </div>

                              <button
                                onClick={() => removeItem(item.id)}
                                className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 hover:text-red-600 dark:hover:text-red-400 transition-colors underline underline-offset-4"
                              >
                                Remove
                              </button>
                            </div>

                            {/* Specific Entry Aggregate Calculation */}
                            <div className="text-right pl-2">
                              <p className="text-xs font-bold text-zinc-950 dark:text-white">
                                {formatCurrency(item.product.price * item.quantity)}
                              </p>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )
                  })}
                </div>
              )}
            </div>

            {/* CHECKOUT DISPATCH ACTIONS BLOCK */}
            {items.length > 0 && (
              <div className="border-t border-zinc-100 dark:border-zinc-900 p-6 space-y-4 bg-zinc-50 dark:bg-[#08080A] flex-shrink-0 transition-colors duration-500">
                <div className="flex justify-between items-center text-sm">
                  <span className="font-mono text-[10px] uppercase tracking-widest text-zinc-400 dark:text-zinc-500">AGGREGATE TOTAL</span>
                  <span className="text-base font-black text-zinc-950 dark:text-white">{formatCurrency(getTotal())}</span>
                </div>

                <p className="text-[10px] font-mono text-zinc-400 dark:text-zinc-600 text-center uppercase tracking-wider">
                  Logistics routes and shipping fields finalized at processing.
                </p>

                <div className="space-y-2 pt-2">
                  <Button 
                    size="lg" 
                    className="w-full bg-black dark:bg-white text-white dark:text-black hover:bg-zinc-800 dark:hover:bg-zinc-200 rounded-none h-14 text-xs font-black tracking-[0.25em] uppercase transition-transform active:scale-95 flex items-center justify-center gap-2" 
                    onClick={onClose} 
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
                    onClick={onClose}
                    asChild
                  >
                    <Link href="/shop">
                      CONTINUE SHOPPING
                    </Link>
                  </Button>
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}