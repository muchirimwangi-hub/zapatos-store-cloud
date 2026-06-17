"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Check, X, Edit2, Save, Loader2, Plus, Trash2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export default function AdminLogisticsPage() {
  const [rates, setRates] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  
  // Create State
  const [isCreating, setIsCreating] = useState(false)
  const [newName, setNewName] = useState("")
  const [newPrice, setNewPrice] = useState(0)
  const [newEta, setNewEta] = useState("")
  const [newLimit, setNewLimit] = useState(0)
  const [newOverage, setNewOverage] = useState(0)

  // Edit State
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editPrice, setEditPrice] = useState<number>(0)
  const [editEta, setEditEta] = useState<string>("")
  const [editLimit, setEditLimit] = useState<number>(0)
  const [editOverage, setEditOverage] = useState<number>(0)

  const supabase = createClient()

  useEffect(() => {
    fetchRates()
  }, [])

  async function fetchRates() {
    setLoading(true)
    const { data, error } = await supabase.from("shipping_rates").select("*").order("name", { ascending: true })
    if (error) console.error("Error fetching rates:", error)
    if (data) setRates(data)
    setLoading(false)
  }

  async function handleCreate() {
    if (!newName || newPrice < 0) return alert("Name and base price are required.");
    
    const { data, error } = await supabase.from("shipping_rates").insert([{
      name: newName,
      price: newPrice,
      eta: newEta || "TBD",
      base_weight_limit: newLimit,
      overage_price_per_kg: newOverage,
      is_active: true
    }]).select().single()

    if (error) {
      alert("Failed to create rate. Check database connection.");
    } else if (data) {
      setRates([...rates, data].sort((a, b) => a.name.localeCompare(b.name)));
      setIsCreating(false);
      setNewName(""); setNewPrice(0); setNewEta(""); setNewLimit(0); setNewOverage(0);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to permanently delete this logistics route?")) return;
    const { error } = await supabase.from("shipping_rates").delete().eq("id", id);
    if (!error) setRates(rates.filter(r => r.id !== id));
  }

  async function toggleActive(id: string, currentStatus: boolean) {
    const { error } = await supabase.from("shipping_rates").update({ is_active: !currentStatus }).eq("id", id)
    if (!error) setRates(rates.map(r => r.id === id ? { ...r, is_active: !currentStatus } : r))
  }

  async function saveEdits(id: string) {
    const { error } = await supabase.from("shipping_rates").update({ 
      price: editPrice, eta: editEta, base_weight_limit: editLimit, overage_price_per_kg: editOverage 
    }).eq("id", id)

    if (!error) {
      setRates(rates.map(r => r.id === id ? { ...r, price: editPrice, eta: editEta, base_weight_limit: editLimit, overage_price_per_kg: editOverage } : r))
      setEditingId(null)
    }
  }

  function startEditing(rate: any) {
    setEditingId(rate.id)
    setEditPrice(rate.price)
    setEditEta(rate.eta)
    setEditLimit(rate.base_weight_limit || 0)
    setEditOverage(rate.overage_price_per_kg || 0)
  }

  if (loading) return <div className="flex justify-center p-12"><Loader2 className="animate-spin text-zinc-500" /></div>

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 dark:text-zinc-100">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-black uppercase tracking-tighter">Logistics Command Center</h1>
          <p className="text-sm text-zinc-500 mt-2">Manage delivery zones, ETAs, and dynamic weight-based pricing.</p>
        </div>
        <Button onClick={() => setIsCreating(!isCreating)} className="bg-black text-white rounded-none uppercase tracking-widest text-xs font-bold px-6 h-12">
          {isCreating ? "Cancel" : <><Plus className="w-4 h-4 mr-2"/> New Route</>}
        </Button>
      </div>

      {isCreating && (
        <div className="bg-zinc-50 dark:bg-[#111115] border border-zinc-200 dark:border-zinc-800 p-6 space-y-4">
          <h3 className="text-[10px] font-mono text-zinc-400 tracking-widest uppercase">Configure New Route</h3>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <Input placeholder="Route Name (e.g., Nairobi CBD)" value={newName} onChange={e => setNewName(e.target.value)} className="h-10 rounded-none text-xs" />
            <Input placeholder="ETA (e.g., 24-48 Hrs)" value={newEta} onChange={e => setNewEta(e.target.value)} className="h-10 rounded-none text-xs" />
            <Input type="number" placeholder="Base Price (KES)" value={newPrice || ""} onChange={e => setNewPrice(Number(e.target.value))} className="h-10 rounded-none text-xs" />
            <Input type="number" placeholder="Weight Limit (kg) - 0 for none" value={newLimit || ""} onChange={e => setNewLimit(Number(e.target.value))} className="h-10 rounded-none text-xs" />
            <Input type="number" placeholder="Extra Ksh / kg" value={newOverage || ""} onChange={e => setNewOverage(Number(e.target.value))} className="h-10 rounded-none text-xs" />
          </div>
          <Button onClick={handleCreate} className="bg-green-600 hover:bg-green-700 text-white rounded-none uppercase tracking-widest text-xs font-bold w-full h-10">Deploy Route</Button>
        </div>
      )}

      <div className="border border-zinc-200 dark:border-zinc-800 rounded-lg overflow-x-auto bg-white dark:bg-[#0C0C10]">
        <table className="w-full text-left text-sm min-w-[800px]">
          <thead className="bg-zinc-50 dark:bg-[#111115] border-b border-zinc-200 dark:border-zinc-800 text-[10px] uppercase tracking-widest text-zinc-500">
            <tr>
              <th className="p-4 font-bold">Region / Method</th>
              <th className="p-4 font-bold">ETA</th>
              <th className="p-4 font-bold">Base Price</th>
              <th className="p-4 font-bold">Weight Limit</th>
              <th className="p-4 font-bold">Overage/kg</th>
              <th className="p-4 font-bold text-center">Status</th>
              <th className="p-4 font-bold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
            {rates.map((rate) => (
              <tr key={rate.id} className="hover:bg-zinc-50 dark:hover:bg-[#111115]/50 transition-colors">
                <td className="p-4 font-medium uppercase text-xs">{rate.name}</td>
                
                <td className="p-4">
                  {editingId === rate.id ? <Input value={editEta} onChange={(e) => setEditEta(e.target.value)} className="h-8 text-xs bg-transparent" /> : <span className="text-zinc-500 font-mono text-xs">{rate.eta}</span>}
                </td>

                <td className="p-4">
                  {editingId === rate.id ? <Input type="number" value={editPrice} onChange={(e) => setEditPrice(Number(e.target.value))} className="h-8 text-xs bg-transparent w-20" /> : <span className="font-mono text-xs">Ksh {Number(rate.price).toLocaleString()}</span>}
                </td>

                <td className="p-4">
                  {editingId === rate.id ? <Input type="number" value={editLimit} onChange={(e) => setEditLimit(Number(e.target.value))} className="h-8 text-xs bg-transparent w-20" /> : <span className="font-mono text-xs text-zinc-400">{rate.base_weight_limit > 0 ? `${rate.base_weight_limit} kg` : "None"}</span>}
                </td>

                <td className="p-4">
                  {editingId === rate.id ? <Input type="number" value={editOverage} onChange={(e) => setEditOverage(Number(e.target.value))} className="h-8 text-xs bg-transparent w-20" /> : <span className="font-mono text-xs text-zinc-400">{rate.overage_price_per_kg > 0 ? `+ Ksh ${rate.overage_price_per_kg}` : "N/A"}</span>}
                </td>

                <td className="p-4 text-center">
                  <button onClick={() => toggleActive(rate.id, rate.is_active)} className={`px-2 py-1 text-[9px] uppercase tracking-widest font-bold rounded transition-colors ${rate.is_active ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                    {rate.is_active ? "Live" : "Disabled"}
                  </button>
                </td>

                <td className="p-4 text-right">
                  {editingId === rate.id ? (
                    <div className="flex justify-end gap-2">
                      <Button size="sm" variant="ghost" onClick={() => setEditingId(null)}><X className="w-4 h-4" /></Button>
                      <Button size="sm" className="bg-black text-white" onClick={() => saveEdits(rate.id)}><Save className="w-3 h-3 mr-1" /> Save</Button>
                    </div>
                  ) : (
                    <div className="flex justify-end gap-2">
                      <Button size="icon" variant="ghost" className="h-8 w-8 text-zinc-500" onClick={() => startEditing(rate)}><Edit2 className="w-3.5 h-3.5" /></Button>
                      <Button size="icon" variant="ghost" className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50" onClick={() => handleDelete(rate.id)}><Trash2 className="w-3.5 h-3.5" /></Button>
                    </div>
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