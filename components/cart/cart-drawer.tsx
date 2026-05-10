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
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-zapatos-obsidian/60 backdrop-blur-sm z-50"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-zapatos-cream shadow-2xl z-50 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-zapatos-taupe/30">
              <div>
                <h2 className="text-2xl font-serif">Shopping Bag</h2>
                <p className="text-sm text-zapatos-charcoal/60 mt-1">
                  {getItemCount()} {getItemCount() === 1 ? 'item' : 'items'}
                </p>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-zapatos-taupe/20 rounded-full transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto p-6">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center py-12">
                  <ShoppingBag className="h-16 w-16 text-zapatos-charcoal/30 mb-4" />
                  <h3 className="text-xl font-serif mb-2">Your bag is empty</h3>
                  <p className="text-sm text-zapatos-charcoal/60 mb-6">
                    Start adding your favorite products
                  </p>
                  <Button onClick={onClose} asChild>
                    <Link href="/shop">
                      Continue Shopping
                    </Link>
                  </Button>
                </div>
              ) : (
                <div className="space-y-6">
                  {items.map((item) => (
                    <motion.div
                      key={item.id}
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -100 }}
                      className="flex gap-4 pb-6 border-b border-zapatos-taupe/20"
                    >
                      {/* Product Image */}
                      <Link
                        href={`/shop/${item.product.slug}`}
                        onClick={onClose}
                        className="flex-shrink-0 w-24 h-24 luxury-border overflow-hidden hover:opacity-75 transition-opacity"
                      >
                        <div
                          className="w-full h-full bg-cover bg-center"
                          style={{ backgroundImage: `url('${getProductImageUrl(item.product)}')` }}
                        />
                      </Link>

                      {/* Product Info */}
                      <div className="flex-1 min-w-0">
                        <Link
                          href={`/shop/${item.product.slug}`}
                          onClick={onClose}
                          className="block hover:text-zapatos-gold transition-colors"
                        >
                          <h3 className="font-serif text-lg mb-1 truncate">
                            {item.product.name}
                          </h3>
                        </Link>
                        
                        {item.product.volume && (
                          <p className="text-xs text-zapatos-charcoal/60 mb-2">
                            {item.product.volume}
                          </p>
                        )}

                        <p className="text-sm font-medium mb-3">
                          {formatCurrency(item.product.price)}
                        </p>

                        {/* Quantity Controls */}
                        <div className="flex items-center gap-3">
                          <div className="flex items-center luxury-border">
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="p-1.5 hover:bg-zapatos-taupe/10 transition-colors"
                            >
                              <Minus className="h-3 w-3" />
                            </button>
                            <span className="px-3 text-sm font-medium">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              disabled={item.quantity >= item.product.stock_quantity}
                              className="p-1.5 hover:bg-zapatos-taupe/10 transition-colors disabled:opacity-30"
                            >
                              <Plus className="h-3 w-3" />
                            </button>
                          </div>

                          <button
                            onClick={() => removeItem(item.id)}
                            className="text-xs text-zapatos-charcoal/60 hover:text-red-600 transition-colors underline"
                          >
                            Remove
                          </button>
                        </div>
                      </div>

                      {/* Item Total */}
                      <div className="text-right">
                        <p className="font-medium">
                          {formatCurrency(item.product.price * item.quantity)}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer with Total and Checkout */}
            {items.length > 0 && (
              <div className="border-t border-zapatos-taupe/30 p-6 space-y-4 bg-zapatos-taupe/5">
                {/* Subtotal */}
                <div className="flex justify-between text-lg">
                  <span className="font-serif">Subtotal</span>
                  <span className="font-medium">{formatCurrency(getTotal())}</span>
                </div>

                <p className="text-xs text-zapatos-charcoal/60 text-center">
                  Shipping and taxes calculated at checkout
                </p>

                {/* Checkout Button */}
                <Button size="lg" className="w-full text-base" onClick={onClose} asChild>
                  <Link href="/checkout">
                    Proceed to Checkout
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>

                <Button
                  size="lg"
                  variant="outline"
                  className="w-full text-base"
                  onClick={onClose}
                  asChild
                >
                  <Link href="/shop">
                    Continue Shopping
                  </Link>
                </Button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
