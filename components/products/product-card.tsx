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

const cleanImageUrl = (imgData: any): string => {
  if (!imgData) return "";
  if (typeof imgData === 'object' && imgData !== null) {
    const targetUrl = imgData.url || imgData.image_url || "";
    return cleanImageUrl(targetUrl);
  }
  if (typeof imgData === 'string') {
    if (imgData.startsWith('[') || imgData.startsWith('{')) {
      try {
        const parsed = JSON.parse(imgData);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return cleanImageUrl(parsed[0]);
        }
        return cleanImageUrl(parsed);
      } catch {}
    }
    return imgData
      .replace(/['"[\]]/g, '')
      .replace('/render/image/public/', '/object/public/')
      .trim();
  }
  return "";
};

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
    ? cleanImageUrl(product.images[0])
    : cleanImageUrl(product.images) || 'https://images.unsplash.com/photo-1588405748880-12d1d2a59d75?w=800&q=80'

  return (
    <>
      <Toast 
        message={`${product.name} added to cart`}
        isVisible={showToast}
        onClose={() => setShowToast(false)}
      />
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: index * 0.05 }}
        className="w-full text-left"
      >
        <Link href={`/shop/${product.slug}`} className="group block space-y-4">
          
          <div className="relative aspect-[3/4] overflow-hidden border border-zinc-200 dark:border-zinc-900 bg-zinc-50 dark:bg-[#0C0C10] rounded-none">
            {/* The grayscale/brightness filters have been removed so your true colors show */}
            <div 
              className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
              style={{ backgroundImage: `url('${primaryImage}')` }}
            />
            <div className="absolute inset-0 bg-zinc-950/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            
            {product.is_featured && (
              <div className="absolute top-4 left-4 bg-zinc-950 dark:bg-white text-white dark:text-black text-[9px] uppercase font-mono tracking-widest px-2.5 py-1 border border-zinc-800 dark:border-zinc-200">
                Featured
              </div>
            )}

            <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <Button
                size="icon"
                className="rounded-none bg-zinc-950 dark:bg-white text-white dark:text-black hover:bg-zinc-800 dark:hover:bg-zinc-200 shadow-xl w-10 h-10 border border-zinc-800"
                onClick={handleAddToCart}
              >
                <ShoppingBag className="h-4 w-4 stroke-[1.8]" />
              </Button>
            </div>
          </div>

          <div className="space-y-1">
            <p className="text-[9px] font-mono uppercase tracking-widest text-zinc-400 dark:text-zinc-600">
              {product.brand || "Zapatos Cave"}
            </p>
            <h3 className="text-sm font-black uppercase tracking-wide text-zinc-950 dark:text-white transition-opacity group-hover:opacity-70 truncate">
              {product.name}
            </h3>
            <p className="text-xs font-light text-zinc-500 dark:text-zinc-400 line-clamp-1">
              {product.short_description}
            </p>
            <div className="flex items-baseline gap-2 pt-1">
              <span className="text-xs font-bold text-zinc-950 dark:text-white">
                {formatCurrency(product.price)}
              </span>
              
              {/* TYPESCRIPT & ZERO BUG FIX: Safely checks for value and returns null if false */}
              {(product.compare_at_price || 0) > product.price ? (
                <span className="text-[10px] text-zinc-400 dark:text-zinc-700 line-through font-mono">
                  {formatCurrency(product.compare_at_price)}
                </span>
              ) : null}
              
            </div>
          </div>

        </Link>
      </motion.div>
    </>
  )
}