"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Check, X, Edit2, Save, Loader2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export default function AdminLogisticsPage() {
  const [rates, setRates] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState<string | null>(null)
  
  // Edit State
  const [editPrice, setEditPrice] = useState<number>(0)
  const [editEta, setEditEta] = useState<string>("")

  const supabase = createClient()

  useEffect(() => {
    fetchRates()
  }, [])

  async function fetchRates() {
    setLoading(true)
    const { data, error } = await supabase
      .from("shipping_rates")
      .select("*")
      .order("name", { ascending: true })

    if (error) console.error("Error fetching rates:", error)
    if (data) setRates(data)
    setLoading(false)
  }

  async function toggleActive(id: string, currentStatus: boolean) {
    const { error } = await supabase
      .from("shipping_rates")
      .update({ is_active: !currentStatus })
      .eq("id", id)

    if (!error) {
      setRates(rates.map(r => r.id === id ? { ...r, is_active: !currentStatus } : r))
    } else {
      alert("Failed to update status. Check your RLS policies.")
    }
  }

  async function saveEdits(id: string) {
    const { error } = await supabase
      .from("shipping_rates")
      .update({ price: editPrice, eta: editEta })
      .eq("id", id)

    if (!error) {
      setRates(rates.map(r => r.id === id ? { ...r, price: editPrice, eta: editEta } : r))
      setEditingId(null)
    } else {
      alert("Failed to save changes. Check your RLS policies.")
    }
  }

  function startEditing(rate: any) {
    setEditingId(rate.id)
    setEditPrice(rate.price)
    setEditEta(rate.eta)
  }

  if (loading) {
    return <div className="flex justify-center p-12"><Loader2 className="animate-spin text-zinc-500" /></div>
  }

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8 dark:text-zinc-100">
      <div>
        <h1 className="text-3xl font-black uppercase tracking-tighter">Logistics Command Center</h1>
        <p className="text-sm text-zinc-500 mt-2">Manage live delivery zones, ETAs, and pricing for your checkout.</p>
      </div>

      <div className="border border-zinc-200 dark:border-zinc-800 rounded-lg overflow-hidden bg-white dark:bg-[#0C0C10]">
        <table className="w-full text-left text-sm">
          <thead className="bg-zinc-50 dark:bg-[#111115] border-b border-zinc-200 dark:border-zinc-800 text-[10px] uppercase tracking-widest text-zinc-500">
            <tr>
              <th className="p-4 font-bold">Region / Method</th>
              <th className="p-4 font-bold">ETA</th>
              <th className="p-4 font-bold">Price (KES)</th>
              <th className="p-4 font-bold text-center">Live Status</th>
              <th className="p-4 font-bold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
            {rates.map((rate) => (
              <tr key={rate.id} className="hover:bg-zinc-50 dark:hover:bg-[#111115]/50 transition-colors">
                <td className="p-4 font-medium">{rate.name}</td>
                
                {/* ETA Column */}
                <td className="p-4">
                  {editingId === rate.id ? (
                    <Input value={editEta} onChange={(e) => setEditEta(e.target.value)} className="h-8 text-xs bg-transparent border-zinc-300 dark:border-zinc-700" />
                  ) : (
                    <span className="text-zinc-500">{rate.eta}</span>
                  )}
                </td>

                {/* Price Column */}
                <td className="p-4">
                  {editingId === rate.id ? (
                    <Input type="number" value={editPrice} onChange={(e) => setEditPrice(Number(e.target.value))} className="h-8 text-xs bg-transparent border-zinc-300 dark:border-zinc-700 w-24" />
                  ) : (
                    <span className="font-mono">Ksh {Number(rate.price).toLocaleString()}</span>
                  )}
                </td>

                {/* Status Column */}
                <td className="p-4 text-center">
                  <button 
                    onClick={() => toggleActive(rate.id, rate.is_active)}
                    className={`px-3 py-1 text-[10px] uppercase tracking-widest font-bold rounded-full transition-colors ${
                      rate.is_active 
                        ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" 
                        : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                    }`}
                  >
                    {rate.is_active ? "Active" : "Disabled"}
                  </button>
                </td>

                {/* Actions Column */}
                <td className="p-4 text-right">
                  {editingId === rate.id ? (
                    <div className="flex justify-end gap-2">
                      <Button size="sm" variant="ghost" onClick={() => setEditingId(null)}><X className="w-4 h-4" /></Button>
                      <Button size="sm" className="bg-black dark:bg-white text-white dark:text-black" onClick={() => saveEdits(rate.id)}><Save className="w-4 h-4 mr-2" /> Save</Button>
                    </div>
                  ) : (
                    <Button size="sm" variant="outline" className="text-xs uppercase tracking-widest" onClick={() => startEditing(rate)}>
                      <Edit2 className="w-3 h-3 mr-2" /> Edit
                    </Button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}