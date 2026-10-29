"use client"

import { useState, useEffect } from "react"
import { Shield, Plus, Loader2, Users, Edit2, Trash2, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { createEmployee, getTeamMembers, updateEmployee, deleteEmployee } from "./actions"

export default function TeamManagementPage() {
  const [isDeploying, setIsDeploying] = useState(false)
  const [message, setMessage] = useState<{ type: 'error' | 'success', text: string } | null>(null)
  const [team, setTeam] = useState<any[]>([])
  const [isLoadingTeam, setIsLoadingTeam] = useState(true)
  const [editingId, setEditingId] = useState<string | null>(null)

  // Controlled form state
  const defaultForm = {
    name: "",
    email: "",
    password: "",
    perm_pricing: true,
    perm_discounts: true,
    discount_limit: 300, // Defaulting to your KES 300 limit
    perm_inventory: true,
    perm_orders: true,
    perm_customers: false
  }
  const [formData, setFormData] = useState(defaultForm)

  useEffect(() => {
    loadTeam()
  }, [])

  const loadTeam = async () => {
    setIsLoadingTeam(true)
    const result = await getTeamMembers()
    if (result.users) setTeam(result.users)
    setIsLoadingTeam(false)
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsDeploying(true)
    setMessage(null)

    const formElementData = new FormData(e.currentTarget)
    
    let result;
    if (editingId) {
      result = await updateEmployee(null, formElementData)
    } else {
      result = await createEmployee(null, formElementData)
    }

    if (result?.error) {
      setMessage({ type: 'error', text: result.error })
    } else if (result?.success) {
      setMessage({ type: 'success', text: editingId ? "Employee profile updated successfully." : "Employee access provisioned successfully." })
      setEditingId(null)
      setFormData(defaultForm)
      await loadTeam()
    }
    
    setIsDeploying(false)
  }

  const handleEditClick = (employee: any) => {
    const perms = employee.user_metadata?.permissions || {}
    setEditingId(employee.id)
    setFormData({
      name: employee.user_metadata?.name || "",
      email: employee.email || "",
      password: "", 
      perm_pricing: !!perms.can_edit_pricing,
      perm_discounts: !!perms.can_edit_discounts,
      discount_limit: Number(perms.discount_limit) || 300, // Loads their saved limit
      perm_inventory: !!perms.can_manage_inventory,
      perm_orders: !!perms.can_process_orders,
      perm_customers: !!perms.can_view_customers,
    })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const cancelEdit = () => {
    setEditingId(null)
    setFormData(defaultForm)
    setMessage(null)
  }

  const handleDeleteClick = async (id: string) => {
    if (!window.confirm("Are you sure you want to permanently revoke this operative's access?")) return
    await deleteEmployee(id)
    await loadTeam()
  }

  return (
    <div className="space-y-8 p-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center border-b border-zinc-200 pb-4">
        <div>
          <h1 className="text-2xl font-bold uppercase tracking-tight">Team Protocol</h1>
          <p className="text-sm text-zinc-500 font-mono mt-1">Provision restricted employee accounts</p>
        </div>
        <Shield className="w-8 h-8 text-zinc-300" />
      </div>

      {/* CREATION & EDIT FORM */}
      <div className="bg-white border border-gray-200 shadow-sm p-6 relative">
        {editingId && (
          <button onClick={cancelEdit} className="absolute top-6 right-6 p-2 text-zinc-400 hover:text-zinc-900 transition-colors">
            <X className="h-4 w-4" />
          </button>
        )}
        
        <h2 className="text-[11px] font-bold uppercase tracking-widest text-zinc-400 mb-6">
          {editingId ? "Update Access Profile" : "Deploy New Access Profile"}
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {editingId && <input type="hidden" name="id" value={editingId} />}
          
          {message && (
            <div className={`p-3 text-xs font-mono font-bold uppercase tracking-wide ${message.type === 'error' ? 'bg-red-50 text-red-600 border border-red-200' : 'bg-green-50 text-green-700 border border-green-200'}`}>
              {message.text}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Operative Name</label>
              <Input name="name" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} placeholder="Sarah" className="rounded-none h-11 bg-zinc-50 border-zinc-200" required />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Zapatos Email</label>
              <Input name="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} type="email" placeholder="sarah@zapatoscave.com" className="rounded-none h-11 bg-zinc-50 border-zinc-200 disabled:opacity-50" required disabled={!!editingId} />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">{editingId ? "Reset Password (Optional)" : "Temporary Password"}</label>
            <Input name="password" value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} type="text" placeholder={editingId ? "Leave blank to keep current password" : "Set a secure starting password"} minLength={6} className="rounded-none h-11 bg-zinc-50 border-zinc-200" required={!editingId} />
          </div>

          <div className="pt-6 mt-6 border-t border-zinc-100">
            <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-950 block mb-4">Module Access Rights</label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              
              <label className="flex items-start gap-3 p-4 border border-zinc-200 bg-zinc-50 cursor-pointer hover:border-zinc-400 transition-colors">
                <input type="checkbox" name="perm_pricing" checked={formData.perm_pricing} onChange={(e) => setFormData({...formData, perm_pricing: e.target.checked})} className="mt-1 w-4 h-4 accent-black" />
                <div>
                  <div className="text-xs font-bold uppercase tracking-wide text-zinc-950">Core Pricing</div>
                  <div className="text-[10px] text-zinc-500 mt-1">Allow permanent editing of product base prices and margins.</div>
                </div>
              </label>

              <div className="flex flex-col gap-3 p-4 border border-zinc-200 bg-zinc-50 hover:border-zinc-400 transition-colors">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input type="checkbox" name="perm_discounts" checked={formData.perm_discounts} onChange={(e) => setFormData({...formData, perm_discounts: e.target.checked})} className="mt-1 w-4 h-4 accent-black" />
                  <div>
                    <div className="text-xs font-bold uppercase tracking-wide text-zinc-950">Sales & Discounts</div>
                    <div className="text-[10px] text-zinc-500 mt-1">Allow application of temporary sales and markdowns.</div>
                  </div>
                </label>
                
                {/* Dynamic Limit Input */}
                {formData.perm_discounts && (
                  <div className="ml-7 mt-2 pt-3 border-t border-zinc-200">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 block mb-2">Max Discount Limit (KES)</label>
                    <Input 
                      name="discount_limit" 
                      type="number" 
                      value={formData.discount_limit} 
                      onChange={(e) => setFormData({...formData, discount_limit: Number(e.target.value)})} 
                      className="rounded-none h-9 bg-white border-zinc-200 text-xs w-full max-w-[200px]" 
                      min="0"
                    />
                  </div>
                )}
              </div>

              <label className="flex items-start gap-3 p-4 border border-zinc-200 bg-zinc-50 cursor-pointer hover:border-zinc-400 transition-colors">
                <input type="checkbox" name="perm_inventory" checked={formData.perm_inventory} onChange={(e) => setFormData({...formData, perm_inventory: e.target.checked})} className="mt-1 w-4 h-4 accent-black" />
                <div>
                  <div className="text-xs font-bold uppercase tracking-wide text-zinc-950">Inventory & Limits</div>
                  <div className="text-[10px] text-zinc-500 mt-1">Allow adjustments to physical stock quantities.</div>
                </div>
              </label>

              <label className="flex items-start gap-3 p-4 border border-zinc-200 bg-zinc-50 cursor-pointer hover:border-zinc-400 transition-colors">
                <input type="checkbox" name="perm_orders" checked={formData.perm_orders} onChange={(e) => setFormData({...formData, perm_orders: e.target.checked})} className="mt-1 w-4 h-4 accent-black" />
                <div>
                  <div className="text-xs font-bold uppercase tracking-wide text-zinc-950">Order Fulfillment</div>
                  <div className="text-[10px] text-zinc-500 mt-1">Allow processing and dispatching of orders.</div>
                </div>
              </label>

              <label className="flex items-start gap-3 p-4 border border-zinc-200 bg-zinc-50 cursor-pointer hover:border-zinc-400 transition-colors">
                <input type="checkbox" name="perm_customers" checked={formData.perm_customers} onChange={(e) => setFormData({...formData, perm_customers: e.target.checked})} className="mt-1 w-4 h-4 accent-black" />
                <div>
                  <div className="text-xs font-bold uppercase tracking-wide text-zinc-950">Customer Data</div>
                  <div className="text-[10px] text-zinc-500 mt-1">Allow access to sensitive client contact details.</div>
                </div>
              </label>

            </div>
          </div>

          <div className="pt-6">
            <Button type="submit" disabled={isDeploying} className="w-full h-12 bg-black text-white hover:bg-zinc-800 rounded-none uppercase tracking-widest text-xs font-bold transition-all">
              {isDeploying ? (
                <span className="flex items-center gap-2"><Loader2 className="w-4 h-4 animate-spin" /> {editingId ? "Updating..." : "Provisioning..."}</span>
              ) : (
                <span className="flex items-center gap-2">
                  {editingId ? <><Edit2 className="w-4 h-4" /> Update Operative Profile</> : <><Plus className="w-4 h-4" /> Grant Employee Access</>}
                </span>
              )}
            </Button>
          </div>
        </form>
      </div>

      {/* ACTIVE TEAM ROSTER */}
      <div className="bg-white border border-gray-200 shadow-sm p-6">
        <div className="flex items-center gap-2 mb-6">
          <Users className="h-4 w-4 text-zinc-400" />
          <h2 className="text-[11px] font-bold uppercase tracking-widest text-zinc-400">Active Operatives</h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left whitespace-nowrap">
            <thead className="bg-zinc-50 text-[10px] font-mono uppercase tracking-widest text-zinc-500 border-b border-zinc-200">
              <tr>
                <th className="px-4 py-3 font-bold">Name</th>
                <th className="px-4 py-3 font-bold">Email</th>
                <th className="px-4 py-3 font-bold">Created</th>
                <th className="px-4 py-3 font-bold">Permissions</th>
                <th className="px-4 py-3 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 text-xs font-medium text-zinc-700">
              {isLoadingTeam ? (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-zinc-400 font-mono text-[10px] uppercase tracking-widest">
                    Loading roster...
                  </td>
                </tr>
              ) : team.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-zinc-400 font-mono text-[10px] uppercase tracking-widest">
                    No active employees found.
                  </td>
                </tr>
              ) : (
                team.map((employee) => {
                  const perms = employee.user_metadata?.permissions || {}
                  const activePermsCount = Object.values(perms).filter(Boolean).length
                  
                  return (
                    <tr key={employee.id} className="hover:bg-zinc-50/50 transition-colors">
                      <td className="px-4 py-4 font-black uppercase text-zinc-950">
                        {employee.user_metadata?.name || "Unknown"}
                      </td>
                      <td className="px-4 py-4 text-zinc-500">
                        {employee.email}
                      </td>
                      <td className="px-4 py-4 font-mono text-[10px] text-zinc-400">
                        {new Date(employee.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-4 font-mono text-[10px] text-zinc-500">
                        {activePermsCount} Active Modules
                      </td>
                      <td className="px-4 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          <button onClick={() => handleEditClick(employee)} className="p-2 text-zinc-400 hover:text-blue-600 transition-colors" aria-label="Edit Profile">
                            <Edit2 className="h-4 w-4" />
                          </button>
                          <button onClick={() => handleDeleteClick(employee.id)} className="p-2 text-zinc-400 hover:text-red-600 transition-colors" aria-label="Revoke Access">
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}