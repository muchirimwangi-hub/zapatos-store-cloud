"use client"

import { Suspense, useEffect, useState } from "react"
import { motion } from "framer-motion"
import { CheckCircle, Package, Mail, ArrowRight, AlertCircle } from "lucide-react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"

function ConfirmationContent() {
  const searchParams = useSearchParams()
  const txRef = searchParams.get('tx_ref') || searchParams.get('order') || 'Unknown'
  const transactionId = searchParams.get('transaction_id')
  const paymentStatus = searchParams.get('status')
  const [isVerifying, setIsVerifying] = useState(!!transactionId)
  const [isVerified, setIsVerified] = useState(!transactionId)
  const [verifyError, setVerifyError] = useState<string | null>(null)

  useEffect(() => {
    // If redirected from Flutterwave with a transaction_id, verify it
    if (transactionId) {
      async function verify() {
        try {
          const res = await fetch(
            `/api/payment/verify?transaction_id=${transactionId}&tx_ref=${txRef}`
          )
          const data = await res.json()

          if (res.ok && data.success) {
            setIsVerified(true)
          } else {
            setVerifyError(data.error || 'Payment verification failed')
            setIsVerified(false)
          }
        } catch {
          setVerifyError('Failed to verify payment. Please contact support.')
          setIsVerified(false)
        } finally {
          setIsVerifying(false)
        }
      }
      verify()
    } else if (paymentStatus === 'cancelled') {
      setVerifyError('Payment was cancelled.')
      setIsVerified(false)
      setIsVerifying(false)
    }
  }, [transactionId, txRef, paymentStatus])

  if (isVerifying) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-zapatos-gold mx-auto mb-4" />
          <p className="text-zapatos-charcoal/70">Verifying your payment...</p>
        </div>
      </div>
    )
  }

  if (!isVerified) {
    return (
      <div className="min-h-screen flex items-center justify-center py-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="container mx-auto px-6 lg:px-12 max-w-2xl text-center"
        >
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-red-100 mb-8">
            <AlertCircle className="h-10 w-10 text-red-600" />
          </div>
          <h1 className="text-4xl md:text-5xl font-serif font-light mb-4">
            Payment Verification Failed
          </h1>
          <p className="text-lg text-zapatos-charcoal/80 mb-8">
            {verifyError || 'We could not verify your payment. Please contact support if you were charged.'}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild>
              <Link href="/contact">Contact Support</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/">Return Home</Link>
            </Button>
          </div>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center py-20">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="container mx-auto px-6 lg:px-12 max-w-2xl text-center"
      >
        {/* Success Icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2, type: "spring" }}
          className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-100 mb-8"
        >
          <CheckCircle className="h-10 w-10 text-green-600" />
        </motion.div>

        {/* Heading */}
        <h1 className="text-4xl md:text-5xl font-serif font-light mb-4">
          Order Confirmed!
        </h1>
        <p className="text-lg text-zapatos-charcoal/80 editorial-spacing mb-8">
          Thank you for your purchase. Your order has been received and is being processed.
        </p>

        {/* Order Number */}
        <div className="luxury-border bg-zapatos-taupe/5 p-6 mb-8">
          <p className="text-sm text-zapatos-charcoal/60 mb-2">Order Number</p>
          <p className="text-2xl font-serif tracking-wider">{txRef}</p>
        </div>

        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <div className="luxury-border p-6 text-left">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-zapatos-gold/10 rounded-full">
                <Mail className="h-5 w-5 text-zapatos-gold" />
              </div>
              <div>
                <h3 className="font-medium mb-1">Confirmation Email</h3>
                <p className="text-sm text-zapatos-charcoal/70">
                  A confirmation email has been sent to your email address with order details.
                </p>
              </div>
            </div>
          </div>

          <div className="luxury-border p-6 text-left">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-zapatos-gold/10 rounded-full">
                <Package className="h-5 w-5 text-zapatos-gold" />
              </div>
              <div>
                <h3 className="font-medium mb-1">Shipping</h3>
                <p className="text-sm text-zapatos-charcoal/70">
                  Your order will be shipped within 2-3 business days. Track your package via email.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" asChild>
            <Link href="/shop">
              Continue Shopping
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link href="/">
              Return Home
            </Link>
          </Button>
        </div>

        {/* Support */}
        <p className="text-sm text-zapatos-charcoal/60 mt-12">
          Questions about your order?{' '}
          <Link href="/contact" className="underline hover:text-zapatos-gold transition-colors">
            Contact us
          </Link>
        </p>
      </motion.div>
    </div>
  )
}

export default function OrderConfirmationPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    }>
      <ConfirmationContent />
    </Suspense>
  )
}
