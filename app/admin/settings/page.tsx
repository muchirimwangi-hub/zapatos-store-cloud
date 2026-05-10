"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Save, Shield } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { createClient } from "@/lib/supabase/client"

export default function AdminSettingsPage() {
  const [user, setUser] = useState<{ email: string; full_name: string } | null>(null)
  const [newName, setNewName] = useState("")
  const [isSaving, setIsSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    const load = async () => {
      const supabase = createClient()
      const { data: { user: authUser } } = await supabase.auth.getUser()
      if (authUser) {
        const name = authUser.user_metadata?.full_name || ""
        setUser({ email: authUser.email || "", full_name: name })
        setNewName(name)
      }
    }
    load()
  }, [])

  const handleSave = async () => {
    setIsSaving(true)
    const supabase = createClient()
    await supabase.auth.updateUser({
      data: { full_name: newName },
    })
    setIsSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  return (
    <div className="max-w-2xl space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Settings</h1>
        <p className="text-sm text-gray-500 mt-1">Manage your admin account</p>
      </div>

      {/* Profile */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-lg border border-gray-200 p-6 space-y-6"
      >
        <div className="flex items-center gap-3">
          <div className="p-2 bg-zapatos-gold/10 rounded-lg">
            <Shield className="h-5 w-5 text-zapatos-gold" />
          </div>
          <h2 className="text-lg font-medium text-gray-900">Admin Profile</h2>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Email</label>
            <Input
              value={user?.email || ""}
              disabled
              className="bg-gray-50 text-gray-500"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Display Name</label>
            <Input
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="Your name"
              className="bg-white"
            />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button onClick={handleSave} disabled={isSaving}>
            <Save className="mr-2 h-4 w-4" />
            {isSaving ? "Saving..." : "Save Changes"}
          </Button>
          {saved && (
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-sm text-green-600"
            >
              Saved successfully
            </motion.span>
          )}
        </div>
      </motion.div>

      {/* Store Info */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-lg border border-gray-200 p-6 space-y-4"
      >
        <h2 className="text-lg font-medium text-gray-900">Store Information</h2>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-gray-500">Store Name</p>
            <p className="font-medium">Zapatos</p>
          </div>
          <div>
            <p className="text-gray-500">Currency</p>
            <p className="font-medium">NGN (₦)</p>
          </div>
          <div>
            <p className="text-gray-500">Platform</p>
            <p className="font-medium">Next.js + Supabase</p>
          </div>
          <div>
            <p className="text-gray-500">Payments</p>
            <p className="font-medium">Flutterwave</p>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
