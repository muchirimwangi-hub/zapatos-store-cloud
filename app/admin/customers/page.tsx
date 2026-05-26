"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Users, Mail } from "lucide-react"
import { Input } from "@/components/ui/input"
import { createClient } from "@/lib/supabase/client"

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<any[]>([])
  const [search, setSearch] = useState("")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      const supabase = createClient()
      const { data } = await supabase
        .from("orders")
        .select("email, shipping_address, created_at")
        .order("created_at", { ascending: false })

      // Deduplicate by email so each customer appears only once
      const uniqueMap = new Map();
      data?.forEach(o => {
        if (!uniqueMap.has(o.email)) {
          uniqueMap.set(o.email, {
            id: o.email, // Use email as unique ID
            email: o.email,
            full_name: `${o.shipping_address?.first_name || ''} ${o.shipping_address?.last_name || ''}`,
            created_at: o.created_at
          });
        }
      });
      
      setCustomers(Array.from(uniqueMap.values()))
      setIsLoading(false)
    }
    load()
  }, [])

  const filtered = customers.filter((c) =>
    (c.full_name || "").toLowerCase().includes(search.toLowerCase()) ||
    (c.email || "").toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Customers</h1>
      <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search customers..." className="max-w-md bg-white" />
      <div className="bg-white border rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-6 py-3 text-left">Name</th>
              <th className="px-6 py-3 text-left">Email</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {filtered.map((c) => (
              <tr key={c.email}>
                <td className="px-6 py-4 font-medium">{c.full_name.trim() || "Guest User"}</td>
                <td className="px-6 py-4 text-gray-500">{c.email}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}