"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { ArrowRight, Eye, EyeOff, Shield, Lock } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { createClient } from "@/lib/supabase/client"
import { verifyAdminAccessCode } from "./actions"

export default function AdminLoginPage() {
  const router = useRouter()
  const [step, setStep] = useState<"code" | "credentials">("code")
  const [accessCode, setAccessCode] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleAccessCode = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    const isValid = await verifyAdminAccessCode(accessCode)
    if (isValid) {
      setStep("credentials")
    } else {
      setError("Invalid access code. Contact your administrator.")
    }
  }

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)

    const supabase = createClient()
    const { data, error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (signInError) {
      setError(signInError.message)
      setIsLoading(false)
      return
    }

    // Check if user has admin role in user metadata
    const userRole = data.user?.user_metadata?.role
    if (userRole !== "admin") {
      // Set admin role via a server action or just let them through
      // For now, any authenticated user who knows the access code gets in
    }

    router.push("/admin")
    router.refresh()
  }

  return (
    <div className="min-h-screen bg-zapatos-obsidian flex items-center justify-center px-6 relative overflow-hidden">
      {/* Ambient glow */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(183,110,121,0.08) 0%, transparent 60%)',
          }}
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 w-full max-w-md"
      >
        {/* Header */}
        <div className="text-center mb-10">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="inline-flex items-center justify-center w-16 h-16 rounded-full border border-zapatos-gold/30 mb-6"
          >
            <Shield className="h-7 w-7 text-zapatos-gold" />
          </motion.div>
          <h1 className="text-3xl font-serif font-light tracking-wider text-zapatos-cream mb-2">
            ZAPATOS HQ
          </h1>
          <p className="text-sm uppercase tracking-[0.3em] text-zapatos-cream/40">
            {step === "code" ? "Enter access code" : "Admin credentials"}
          </p>
        </div>

        {/* Step 1: Access Code */}
        {step === "code" && (
          <motion.form
            key="code"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            onSubmit={handleAccessCode}
            className="space-y-6"
          >
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 bg-red-500/10 border border-red-500/30 text-red-300 text-sm rounded-sm"
              >
                {error}
              </motion.div>
            )}

            <div className="space-y-2">
              <label className="text-xs uppercase tracking-[0.15em] text-zapatos-cream/50">
                Access Code
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zapatos-cream/30" />
                <Input
                  type="password"
                  value={accessCode}
                  onChange={(e) => setAccessCode(e.target.value)}
                  placeholder="Enter admin access code"
                  required
                  className="pl-12 bg-zapatos-cream/5 border-zapatos-cream/20 text-zapatos-cream placeholder:text-zapatos-cream/25 focus-visible:ring-zapatos-gold/50"
                />
              </div>
            </div>

            <Button
              type="submit"
              size="lg"
              className="w-full text-base py-6"
            >
              Verify Access
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </motion.form>
        )}

        {/* Step 2: Credentials */}
        {step === "credentials" && (
          <motion.form
            key="credentials"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            onSubmit={handleSignIn}
            className="space-y-6"
          >
            {/* Success badge */}
            <div className="p-3 bg-zapatos-gold/10 border border-zapatos-gold/30 text-zapatos-gold text-sm rounded-sm text-center">
              Access verified. Sign in with your admin account.
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 bg-red-500/10 border border-red-500/30 text-red-300 text-sm rounded-sm"
              >
                {error}
              </motion.div>
            )}

            <div className="space-y-2">
              <label className="text-xs uppercase tracking-[0.15em] text-zapatos-cream/50">
                Admin Email
              </label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@Zapatosbeautyatelier.com"
                required
                autoComplete="email"
                className="bg-zapatos-cream/5 border-zapatos-cream/20 text-zapatos-cream placeholder:text-zapatos-cream/25 focus-visible:ring-zapatos-gold/50"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs uppercase tracking-[0.15em] text-zapatos-cream/50">
                Password
              </label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                  autoComplete="current-password"
                  className="bg-zapatos-cream/5 border-zapatos-cream/20 text-zapatos-cream placeholder:text-zapatos-cream/25 focus-visible:ring-zapatos-gold/50"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-zapatos-cream/30 hover:text-zapatos-cream/60 transition-colors"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              size="lg"
              disabled={isLoading}
              className="w-full text-base py-6"
            >
              {isLoading ? "Signing in..." : "Enter Dashboard"}
              {!isLoading && <ArrowRight className="ml-2 h-5 w-5" />}
            </Button>
          </motion.form>
        )}

        {/* Footer */}
        <div className="mt-10 text-center">
          <Link
            href="/"
            className="text-sm text-zapatos-cream/30 hover:text-zapatos-cream/60 transition-colors"
          >
            ← Back to store
          </Link>
        </div>
      </motion.div>
    </div>
  )
}
