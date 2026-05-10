"use client"

import { motion, AnimatePresence } from "framer-motion"
import { X, LogIn, UserPlus } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

interface AuthGateModalProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  message?: string
  returnTo?: string
}

export function AuthGateModal({
  isOpen,
  onClose,
  title = "Sign in required",
  message = "Please sign in or create an account to continue.",
  returnTo,
}: AuthGateModalProps) {
  const signinHref = returnTo ? `/signin?returnTo=${encodeURIComponent(returnTo)}` : "/signin"
  const signupHref = returnTo ? `/signup?returnTo=${encodeURIComponent(returnTo)}` : "/signup"

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

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-6"
          >
            <div className="bg-zapatos-cream w-full max-w-md luxury-border p-8 relative">
              {/* Close button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-2 hover:bg-zapatos-taupe/20 rounded-full transition-colors"
              >
                <X className="h-5 w-5" />
              </button>

              {/* Content */}
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-zapatos-gold/10 mb-6">
                  <LogIn className="h-7 w-7 text-zapatos-gold" />
                </div>

                <h2 className="text-2xl font-serif mb-3">{title}</h2>
                <p className="text-sm text-zapatos-charcoal/70 editorial-spacing mb-8">
                  {message}
                </p>

                <div className="space-y-3">
                  <Button size="lg" className="w-full" asChild>
                    <Link href={signinHref}>
                      <LogIn className="mr-2 h-5 w-5" />
                      Sign In
                    </Link>
                  </Button>

                  <Button size="lg" variant="outline" className="w-full" asChild>
                    <Link href={signupHref}>
                      <UserPlus className="mr-2 h-5 w-5" />
                      Create Account
                    </Link>
                  </Button>
                </div>

                <p className="text-xs text-zapatos-charcoal/50 mt-6">
                  Creating an account lets you save gifts, track orders, and get personalized recommendations.
                </p>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
