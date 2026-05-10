"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { ShoppingBag } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Toast } from "@/components/ui/toast"
import { useCartStore } from "@/lib/store/cart-store"
import { formatCurrency } from "@/lib/utils"
import type { Product } from "@/lib/types/product"

interface ProductCardProps {
  product: Product
  index?: number
}

export function ProductCard({ product, index = 0 }: ProductCardProps) {
  const [showToast, setShowToast] = useState(false)
  const addItem = useCartStore((state) => state.addItem)

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    addItem(product)
    setShowToast(true)
    setTimeout(() => setShowToast(false), 3000)
  }

  const primaryImage = Array.isArray(product.images) && product.images.length > 0
    ? typeof product.images[0] === 'string' 
      ? product.images[0]
      : product.images[0].url
    : 'https://images.unsplash.com/photo-1588405748880-12d1d2a59d75?w=800&q=80'

  return (
    <>
    <Toast 
      message={`${product.name} added to cart`}
      isVisible={showToast}
      onClose={() => setShowToast(false)}
    />
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
    >
      <Link href={`/shop/${product.slug}`} className="group block">
        {/* Product Image */}
        <div className="relative aspect-[3/4] overflow-hidden luxury-border mb-4 bg-zapatos-cream/50">
          <div 
            className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
            style={{ backgroundImage: `url('${primaryImage}')` }}
          />
          
          {/* Overlay on hover */}
          <div className="absolute inset-0 bg-gradient-to-t from-zapatos-obsidian/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          
          {/* Featured badge */}
          {product.is_featured && (
            <div className="absolute top-4 left-4 bg-zapatos-gold text-white text-xs uppercase tracking-widest px-3 py-1">
              Featured
            </div>
          )}

          {/* Quick add to cart button */}
          <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <Button
              size="icon"
              className="rounded-full bg-zapatos-cream text-zapatos-obsidian hover:bg-white shadow-lg"
              onClick={handleAddToCart}
            >
              <ShoppingBag className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Product Info */}
        <div className="space-y-2">
          {/* Brand */}
          {product.brand && (
            <p className="text-xs uppercase tracking-widest text-zapatos-charcoal/60">
              {product.brand}
            </p>
          )}

          {/* Product Name */}
          <h3 className="text-xl font-serif group-hover:text-zapatos-gold transition-colors">
            {product.name}
          </h3>

          {/* Short Description */}
          {product.short_description && (
            <p className="text-sm text-zapatos-charcoal/70 editorial-spacing line-clamp-2">
              {product.short_description}
            </p>
          )}

          {/* Volume */}
          {product.volume && (
            <p className="text-xs text-zapatos-charcoal/50">
              {product.volume}
            </p>
          )}

          {/* Price */}
          <div className="flex items-center gap-3 pt-2">
            <span className="text-lg font-medium">
              {formatCurrency(product.price)}
            </span>
            {product.compare_at_price && product.compare_at_price > product.price && (
              <span className="text-sm text-zapatos-charcoal/50 line-through">
                {formatCurrency(product.compare_at_price)}
              </span>
            )}
          </div>

          {/* Tags */}
          {product.personality_tags && product.personality_tags.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-2">
              {product.personality_tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="text-xs px-2 py-1 bg-zapatos-taupe/30 text-zapatos-charcoal/70 rounded-sm"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </Link>
    </motion.div>
    </>
  )
}
