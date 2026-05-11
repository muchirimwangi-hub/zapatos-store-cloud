"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { ArrowLeft, CreditCard, Lock, Shield } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { AuthGateModal } from "@/components/auth/auth-gate-modal"
import { LocationSelect } from "@/components/ui/location-select"
import { useCartStore } from "@/lib/store/cart-store"
import { formatCurrency } from "@/lib/utils"
import { createClient } from "@/lib/supabase/client"
import type { CheckoutFormData } from "@/lib/types/checkout"

export default function CheckoutPage() {
  const router = useRouter()
  const { items, getTotal, clearCart } = useCartStore()
  const [isProcessing, setIsProcessing] = useState(false)
  const [sameAsShipping, setSameAsShipping] = useState(true)
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null)
  const [paymentError, setPaymentError] = useState<string | null>(null)

  useEffect(() => {
    async function checkAuth() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        setShowAuthModal(true)
        setIsAuthenticated(false)
      } else {
        setIsAuthenticated(true)
      }
    }
    checkAuth()
  }, [])
  
  const [formData, setFormData] = useState<CheckoutFormData>({
    shipping: {
      fullName: '',
      email: '',
      phone: '',
      addressLine1: '',
      addressLine2: '',
      city: '',
      state: '',
      postalCode: '',
      country: 'NG',
    },
    billing: {
      fullName: '',
      email: '',
      phone: '',
      addressLine1: '',
      addressLine2: '',
      city: '',
      state: '',
      postalCode: '',
      country: 'NG',
    },
    sameAsShipping: true,
  })

  const subtotal = getTotal()
  const tax = subtotal * 0.075 // 7.5% VAT
  const total = subtotal + tax

  const handleInputChange = (
    section: 'shipping' | 'billing',
    field: string,
    value: string
  ) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }))
  }

  const handleFlutterwavePayment = async () => {
    setPaymentError(null)

    try {
      // Initialize payment on the server to get a hosted checkout link
      const initRes = await fetch('/api/payment/initialize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.shipping.email,
          name: formData.shipping.fullName,
          phone: formData.shipping.phone,
          amount: total,
          currency: 'NGN',
          subtotal,
          shipping: 0,
          tax,
          shippingAddress: formData.shipping,
          items: items.map(i => ({ id: i.product.id, name: i.product.name, qty: i.quantity, price: i.product.price })),
        }),
      })

      const initData = await initRes.json()

      if (!initRes.ok || !initData.link) {
        throw new Error(initData.error || 'Failed to initialize payment')
      }

      // Clear cart and redirect user to Flutterwave's hosted checkout page
      clearCart()
      window.location.href = initData.link
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Payment initialization failed'
      setPaymentError(message)
      setIsProcessing(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!isAuthenticated) {
      setShowAuthModal(true)
      return
    }

    setIsProcessing(true)
    handleFlutterwavePayment()
  }

  // Redirect if cart is empty
  if (items.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-serif mb-4">Your cart is empty</h1>
          <p className="text-zapatos-charcoal/70 mb-6">Add some products before checking out</p>
          <Button asChild>
            <Link href="/shop">Continue Shopping</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-6 lg:px-12">
        {/* Back Button */}
        <Link 
          href="/shop" 
          className="inline-flex items-center text-sm text-zapatos-charcoal/70 hover:text-zapatos-gold transition-colors mb-8"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Shop
        </Link>

        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-serif font-light mb-4">Checkout</h1>
          <p className="text-zapatos-charcoal/70">Complete your order</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Left Column - Forms */}
            <div className="lg:col-span-2 space-y-8">
              {/* Shipping Information */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="luxury-border p-8"
              >
                <h2 className="text-2xl font-serif mb-6">Shipping Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm mb-2">Full Name *</label>
                    <Input
                      required
                      value={formData.shipping.fullName}
                      onChange={(e) => handleInputChange('shipping', 'fullName', e.target.value)}
                      placeholder="John Doe"
                    />
                  </div>
                  <div>
                    <label className="block text-sm mb-2">Email *</label>
                    <Input
                      required
                      type="email"
                      value={formData.shipping.email}
                      onChange={(e) => handleInputChange('shipping', 'email', e.target.value)}
                      placeholder="john@example.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm mb-2">Phone *</label>
                    <Input
                      required
                      type="tel"
                      value={formData.shipping.phone}
                      onChange={(e) => handleInputChange('shipping', 'phone', e.target.value)}
                      placeholder="+234 800 000 0000"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm mb-2">Address Line 1 *</label>
                    <Input
                      required
                      value={formData.shipping.addressLine1}
                      onChange={(e) => handleInputChange('shipping', 'addressLine1', e.target.value)}
                      placeholder="12 Allen Avenue"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm mb-2">Address Line 2</label>
                    <Input
                      value={formData.shipping.addressLine2}
                      onChange={(e) => handleInputChange('shipping', 'addressLine2', e.target.value)}
                      placeholder="Flat/Suite (optional)"
                    />
                  </div>
                  <LocationSelect
                    countryValue={formData.shipping.country}
                    stateValue={formData.shipping.state}
                    cityValue={formData.shipping.city}
                    onCountryChange={(v) => handleInputChange('shipping', 'country', v)}
                    onStateChange={(v) => handleInputChange('shipping', 'state', v)}
                    onCityChange={(v) => handleInputChange('shipping', 'city', v)}
                  />
                </div>
              </motion.div>

              {/* Billing Address */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="luxury-border p-8"
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-serif">Billing Address</h2>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={sameAsShipping}
                      onChange={(e) => setSameAsShipping(e.target.checked)}
                      className="w-4 h-4 accent-zapatos-gold"
                    />
                    <span className="text-sm text-zapatos-charcoal/70">Same as shipping</span>
                  </label>
                </div>
                {!sameAsShipping && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div className="md:col-span-2">
                      <label className="block text-sm mb-2">Full Name *</label>
                      <Input
                        required
                        value={formData.billing.fullName}
                        onChange={(e) => handleInputChange('billing', 'fullName', e.target.value)}
                        placeholder="John Doe"
                      />
                    </div>
                    <div>
                      <label className="block text-sm mb-2">Email *</label>
                      <Input
                        required
                        type="email"
                        value={formData.billing.email}
                        onChange={(e) => handleInputChange('billing', 'email', e.target.value)}
                        placeholder="john@example.com"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm mb-2">Address Line 1 *</label>
                      <Input
                        required
                        value={formData.billing.addressLine1}
                        onChange={(e) => handleInputChange('billing', 'addressLine1', e.target.value)}
                        placeholder="12 Allen Avenue"
                      />
                    </div>
                    <LocationSelect
                      countryValue={formData.billing.country}
                      stateValue={formData.billing.state}
                      cityValue={formData.billing.city}
                      onCountryChange={(v) => handleInputChange('billing', 'country', v)}
                      onStateChange={(v) => handleInputChange('billing', 'state', v)}
                      onCityChange={(v) => handleInputChange('billing', 'city', v)}
                    />
                  </div>
                )}
              </motion.div>

              {/* Payment Information */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.15 }}
                className="luxury-border p-8"
              >
                <h2 className="text-2xl font-serif mb-6">Payment Method</h2>
                <div className="bg-zapatos-taupe/10 luxury-border p-6 text-center">
                  <CreditCard className="h-12 w-12 mx-auto mb-4 text-zapatos-charcoal/50" />
                  <p className="text-zapatos-charcoal/70 mb-2">Secure Payment via Flutterwave</p>
                  <p className="text-sm text-zapatos-charcoal/50">
                    Card, Bank Transfer & USSD supported
                  </p>
                  <div className="flex items-center justify-center gap-2 mt-3 text-xs text-zapatos-charcoal/40">
                    <Shield className="h-3 w-3" />
                    <span>256-bit SSL Encrypted</span>
                  </div>
                </div>
                {paymentError && (
                  <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-md">
                    <p className="text-sm text-red-600">{paymentError}</p>
                  </div>
                )}
              </motion.div>
            </div>

            {/* Right Column - Order Summary */}
            <div className="lg:col-span-1">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="luxury-border p-6 sticky top-24"
              >
                <h2 className="text-xl font-serif mb-6">Order Summary</h2>
                
                {/* Cart Items */}
                <div className="space-y-4 mb-6 pb-6 border-b border-zapatos-taupe/30">
                  {items.map((item) => {
                    const imgUrl = Array.isArray(item.product?.images) && item.product.images.length > 0
  ? (typeof item.product.images[0] === 'string' ? item.product.images[0] : item.product.images[0].url)
  : 'https://images.unsplash.com/photo-1588405748880-12d1d2a59d75?w=400&q=80';

return (
  <div key={item.product?.id || item.id} className="flex gap-3">
                      <div
                        className="w-16 h-16 luxury-border bg-zapatos-taupe/10 flex-shrink-0 bg-cover bg-center"
                        style={{ backgroundImage: `url('${imgUrl}')` }}
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{item.product.name}</p>
                        <p className="text-xs text-zapatos-charcoal/60">Qty: {item.quantity}</p>
                      </div>
                      <p className="text-sm font-medium">
                        {formatCurrency(item.product.price * item.quantity)}
                      </p>
                    </div>
                    )
                  })}
                </div>

                {/* Pricing Breakdown */}
                <div className="space-y-3 mb-6 pb-6 border-b border-zapatos-taupe/30">
                  <div className="flex justify-between text-sm">
                    <span className="text-zapatos-charcoal/70">Subtotal</span>
                    <span>{formatCurrency(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-zapatos-charcoal/70">Tax</span>
                    <span>{formatCurrency(tax)}</span>
                  </div>
                </div>

                {/* Total */}
                <div className="flex justify-between text-lg font-medium mb-6">
                  <span>Total</span>
                  <span>{formatCurrency(total)}</span>
                </div>


                {/* Place Order Button */}
                <Button
                  type="submit"
                  size="lg"
                  className="w-full mb-4"
                  disabled={isProcessing}
                >
                  {isProcessing ? (
                    <>Processing...</>
                  ) : (
                    <>
                      <Lock className="mr-2 h-4 w-4" />
                      Place Order
                    </>
                  )}
                </Button>

                <p className="text-xs text-zapatos-charcoal/50 text-center">
                  Your payment information is secure and encrypted
                </p>
              </motion.div>
            </div>
          </div>
        </form>
      </div>
      <AuthGateModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        title="Sign in to place your order"
        message="Please sign in or create an account to complete your purchase. This lets us send you order confirmations and track your delivery."
        returnTo="/checkout"
      />
    </div>
  )
}
