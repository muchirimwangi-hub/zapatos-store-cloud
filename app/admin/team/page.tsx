"use client"

import { useState } from "react"
import { Shield, Plus, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { createEmployee } from "./actions"

export default function TeamManagementPage() {
  const [isDeploying, setIsDeploying] = useState(false)
  const [message, setMessage] = useState<{ type: 'error' | 'success', text: string } | null>(null)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsDeploying(true)
    setMessage(null)

    const formData = new FormData(e.currentTarget)
    const result = await createEmployee(null, formData)

    if (result.error) {
      setMessage({ type: 'error', text: result.error })
    } else if (result.success) {
      setMessage({ type: 'success', text: "Employee access provisioned successfully." })
      ;(e.target as HTMLFormElement).reset()
    }
    
    setIsDeploying(false)
  }

  return (
    <div className="space-y-6 p-6 max-w-3xl mx-auto">
      <div className="flex justify-between items-center border-b border-zinc-200 pb-4">
        <div>
          <h1 className="text-2xl font-bold uppercase tracking-tight">Team Protocol</h1>
          <p className="text-sm text-zinc-500 font-mono mt-1">Provision restricted employee accounts</p>
        </div>
        <Shield className="w-8 h-8 text-zinc-300" />
      </div>

      <div className="bg-white border border-gray-200 shadow-sm p-6">
        <h2 className="text-[11px] font-bold uppercase tracking-widest text-zinc-400 mb-6">Deploy New Access Profile</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {message && (
            <div className={`p-3 text-xs font-mono font-bold uppercase tracking-wide ${message.type === 'error' ? 'bg-red-50 text-red-600 border border-red-200' : 'bg-green-50 text-green-700 border border-green-200'}`}>
              {message.text}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Operative Name</label>
              <Input name="name" placeholder="Sarah" className="rounded-none h-11 bg-zinc-50 border-zinc-200" required />
            </div>
            
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Zapatos Email</label>
              <Input name="email" type="email" placeholder="sarah@zapatoscave.com" className="rounded-none h-11 bg-zinc-50 border-zinc-200" required />
            </div>
          </div>

          <div className="space-y-2 pt-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Temporary Password</label>
            <Input name="password" type="text" placeholder="Set a secure starting password" minLength={6} className="rounded-none h-11 bg-zinc-50 border-zinc-200" required />
          </div>

          <div className="pt-4">
            <Button type="submit" disabled={isDeploying} className="w-full h-12 bg-black text-white hover:bg-zinc-800 rounded-none uppercase tracking-widest text-xs font-bold transition-all">
              {isDeploying ? (
                <span className="flex items-center gap-2"><Loader2 className="w-4 h-4 animate-spin" /> Provisioning...</span>
              ) : (
                <span className="flex items-center gap-2"><Plus className="w-4 h-4" /> Grant Employee Access</span>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}