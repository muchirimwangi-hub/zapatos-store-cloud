"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { ArrowLeft, ShoppingBag, Heart, Minus, Plus } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Toast } from "@/components/ui/toast"
import { useCartStore } from "@/lib/store/cart-store"
import { useWishlistStore } from "@/lib/store/wishlist-store"
import { formatCurrency } from "@/lib/utils"
import type { Product } from "@/lib/types/product"

interface ProductDetailClientProps {
  product: Product
}

export function ProductDetailClient({ product }: ProductDetailClientProps) {
  const [quantity, setQuantity] = useState(1)
  const [selectedImage, setSelectedImage] = useState(0)
  const [isMounted, setIsMounted] = useState(false)
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState('')
  
  const addItem = useCartStore((state) => state.addItem)
  const { addItem: addToWishlist, removeItem: removeFromWishlist, isInWishlist } = useWishlistStore()
  
  useEffect(() => {
    setIsMounted(true)
  }, [])
  
  const isWishlisted = isMounted && isInWishlist(product.id)

  const handleAddToCart = () => {
    addItem(product, quantity)
    setToastMessage(`Added ${quantity} ${quantity > 1 ? 'items' : 'item'} to cart`)
    setShowToast(true)
    setTimeout(() => setShowToast(false), 3000)
  }

  const handleToggleWishlist = () => {
    if (isWishlisted) {
      removeFromWishlist(product.id)
      setToastMessage('Removed from wishlist')
    } else {
      addToWishlist(product)
      setToastMessage('Added to wishlist')
    }
    setShowToast(true)
    setTimeout(() => setShowToast(false), 3000)
  }


  const incrementQuantity = () => {
    if (quantity < product.stock_quantity) {
      setQuantity(quantity + 1)
    }
  }

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1)
    }
  }

  const images = Array.isArray(product.images) && product.images.length > 0
    ? product.images.map(img => typeof img === 'string' ? img : img.url)
    : ['https://images.unsplash.com/photo-1588405748880-12d1d2a59d75?w=1200&q=80']

  return (
    <>
    <Toast 
      message={toastMessage}
      isVisible={showToast}
      onClose={() => setShowToast(false)}
    />
    <div className="min-h-screen">
      {/* Back Button */}
      <div className="container mx-auto px-6 lg:px-12 py-8">
        <Link 
          href="/shop" 
          className="inline-flex items-center text-sm text-zapatos-charcoal/70 hover:text-zapatos-gold transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Shop
        </Link>
      </div>

      {/* Product Content */}
      <section className="container mx-auto px-6 lg:px-12 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Image Gallery */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Main Image */}
            <div className="aspect-[3/4] luxury-border overflow-hidden mb-4 bg-zapatos-cream/50">
              <motion.div
                key={selectedImage}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="w-full h-full bg-cover bg-center"
                style={{ backgroundImage: `url('${images[selectedImage]}')` }}
              />
            </div>

            {/* Thumbnail Gallery */}
            {images.length > 1 && (
              <div className="grid grid-cols-4 gap-3">
                {images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`aspect-square luxury-border overflow-hidden transition-all ${
                      selectedImage === index 
                        ? 'ring-2 ring-zapatos-gold' 
                        : 'opacity-60 hover:opacity-100'
                    }`}
                  >
                    <div
                      className="w-full h-full bg-cover bg-center"
                      style={{ backgroundImage: `url('${image}')` }}
                    />
                  </button>
                ))}
              </div>
            )}

            {/* Featured Badge */}
            {product.is_featured && (
              <div className="mt-6 inline-block">
                <span className="bg-zapatos-gold text-white text-xs uppercase tracking-widest px-3 py-2">
                  Featured Product
                </span>
              </div>
            )}
          </motion.div>

          {/* Product Info */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            {/* Brand */}
            {product.brand && (
              <p className="text-sm uppercase tracking-[0.3em] text-zapatos-gold">
                {product.brand}
              </p>
            )}

            {/* Product Name */}
            <h1 className="text-4xl md:text-5xl font-serif font-light">
              {product.name}
            </h1>

            {/* Short Description */}
            {product.short_description && (
              <p className="text-lg text-zapatos-charcoal/80 editorial-spacing">
                {product.short_description}
              </p>
            )}

            {/* Price */}
            <div className="flex items-center gap-4 py-4 border-y border-zapatos-taupe/30">
              <span className="text-3xl font-medium">
                {formatCurrency(product.price)}
              </span>
              {product.compare_at_price && product.compare_at_price > product.price && (
                <span className="text-xl text-zapatos-charcoal/50 line-through">
                  {formatCurrency(product.compare_at_price)}
                </span>
              )}
            </div>

            {/* Volume & Category */}
            <div className="flex gap-6 text-sm">
              {product.volume && (
                <div>
                  <span className="text-zapatos-charcoal/60">Volume:</span>{' '}
                  <span className="font-medium">{product.volume}</span>
                </div>
              )}
              <div>
                <span className="text-zapatos-charcoal/60">Category:</span>{' '}
                <span className="font-medium capitalize">{product.category}</span>
              </div>
            </div>

            {/* Personality Tags */}
            {product.personality_tags && product.personality_tags.length > 0 && (
              <div>
                <p className="text-sm text-zapatos-charcoal/60 mb-2">Characteristics:</p>
                <div className="flex flex-wrap gap-2">
                  {product.personality_tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-sm px-3 py-1 bg-zapatos-taupe/30 text-zapatos-charcoal rounded-sm capitalize"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity Selector */}
            <div className="space-y-4">
              <p className="text-sm text-zapatos-charcoal/60">Quantity:</p>
              <div className="flex items-center gap-4">
                <div className="flex items-center luxury-border">
                  <button
                    onClick={decrementQuantity}
                    disabled={quantity <= 1}
                    className="p-3 hover:bg-zapatos-taupe/10 transition-colors disabled:opacity-30"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="px-6 font-medium">{quantity}</span>
                  <button
                    onClick={incrementQuantity}
                    disabled={quantity >= product.stock_quantity}
                    className="p-3 hover:bg-zapatos-taupe/10 transition-colors disabled:opacity-30"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
                <span className="text-sm text-zapatos-charcoal/60">
                  {product.stock_quantity} available
                </span>
              </div>
            </div>

            {/* Add to Cart Button */}
            <div className="flex gap-3 pt-4">
              <Button
                size="lg"
                className="flex-1 text-base"
                onClick={handleAddToCart}
                disabled={product.stock_quantity === 0}
              >
                <ShoppingBag className="mr-2 h-5 w-5" />
                {product.stock_quantity === 0 ? 'Out of Stock' : 'Add to Cart'}
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                onClick={handleToggleWishlist}
                className={isWishlisted ? 'border-red-500 text-red-500 hover:bg-red-50' : ''}
              >
                <Heart className={`h-5 w-5 ${isWishlisted ? 'fill-current' : ''}`} />
              </Button>
            </div>

            {/* SKU */}
            {product.sku && (
              <p className="text-xs text-zapatos-charcoal/50 pt-4">
                SKU: {product.sku}
              </p>
            )}
          </motion.div>
        </div>

        {/* Product Details Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mt-20 space-y-12"
        >
          {/* Description */}
          {product.description && (
            <div className="max-w-3xl">
              <h2 className="text-2xl font-serif mb-4">Description</h2>
              <p className="text-zapatos-charcoal/80 editorial-spacing leading-relaxed">
                {product.description}
              </p>
            </div>
          )}

          {/* Technical Specs (Previously Notes) */}
{product.notes && product.notes.length > 0 && (
  <div className="max-w-3xl">
    <h2 className="text-xl font-bold uppercase tracking-widest mb-4">Technical Specs</h2>
    <div className="space-y-2">
      {product.notes?.map((note, index) => ( // Added the '?'
        <p key={index} className="text-zapatos-charcoal/80 text-sm">
          • {note}
        </p>
      ))}
    </div>
  </div>
)}

{/* Materials & Build (Previously Ingredients) */}
{product.ingredients && product.ingredients.length > 0 && (
  <div className="max-w-3xl">
    <h2 className="text-xl font-bold uppercase tracking-widest mb-4">Materials & Build</h2>
    <p className="text-sm text-zapatos-charcoal/70 leading-relaxed">
      {product.ingredients?.join(', ')} {/* Added the '?' */}
    </p>
  </div>
)}
        </motion.div>
      </section>
    </div>
    </>
  )
}
