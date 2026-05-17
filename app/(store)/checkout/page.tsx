"use client"

import { useEffect, useState } from "react"
import { useCartStore } from "@/lib/store/cart-store"
import CheckoutForm from "@/components/checkout/CheckoutForm"
import Link from "next/link"

export default function CheckoutPage() {
  const [isMounted, setIsMounted] = useState(false)
  
  // Adaptive selector supports both .items or .cart array naming conventions
  const cartItems = useCartStore((state: any) => state.items || state.cart || [])

  useEffect(() => {
    setIsMounted(true)
    // Prints out the structure to your browser console for transparency
    console.log("Zapatos Checkout Cart Sync Vector:", cartItems)
  }, [cartItems])

  if (!isMounted) {
    return (
      <div className="min-h-screen bg-[#FAF7F2] flex items-center justify-center">
        <div className="text-[10px] uppercase tracking-[0.3em] text-zinc-400 animate-pulse">
          Loading Checkout Parameters...
        </div>
      </div>
    )
  }

  if (!Array.isArray(cartItems) || cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-[#FAF7F2] flex flex-col items-center justify-center p-6 text-center space-y-4">
        <h1 className="text-xl font-serif uppercase tracking-tight text-zinc-900">Your bag is empty</h1>
        <p className="text-xs text-zinc-500 max-w-sm editorial-spacing">
          Add performance activewear or sportswear from the catalog before entering the delivery pipeline.
        </p>
        <Link 
          href="/shop" 
          className="bg-black text-white px-8 py-4 text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-zinc-900 transition-colors pt-4"
        >
          Return to Shop
        </Link>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-[#FAF7F2] pt-28 pb-12">
      <div className="container mx-auto max-w-6xl px-4 mb-6">
        <h1 className="text-2xl font-serif font-light tracking-tight text-zinc-900 px-2">Checkout</h1>
      </div>
      <CheckoutForm cartItems={cartItems} />
    </main>
  )
}