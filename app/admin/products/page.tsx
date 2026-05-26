"use client"
import React, { useState, useEffect } from "react";
import { ChevronDown, ChevronUp, Edit, Trash2 } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { createClient } from "@/lib/supabase/client"
import { formatCurrency } from "@/lib/utils"

export default function AdminProductsPage() {
  const [products, setProducts] = useState<any[]>([])
  const [search, setSearch] = useState("")
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set())

  useEffect(() => {
    const loadData = async () => {
      const supabase = createClient()
      const { data } = await supabase
        .from("products")
        .select("*, product_variants(*)")
        .order("created_at", { ascending: false })
      setProducts(data || [])
    }
    loadData()
  }, [])

  const filtered = products.filter(p => 
    p.name?.toLowerCase().includes(search.toLowerCase()) || 
    p.product_variants?.some((v: any) => v.sku?.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Products</h1>
        <Button asChild><Link href="/admin/products/new">Add Product</Link></Button>
      </div>
      
      <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by name or SKU..." />
      
      <div className="bg-white border border-gray-200">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 text-left text-xs uppercase">
              <th className="p-4"></th>
              <th className="p-4">Name</th>
              <th className="p-4">Total Inventory</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(product => (
              <React.Fragment key={product.id}>
                <tr className="border-b hover:bg-gray-50">
                  <td className="p-4">
                    <button onClick={() => {
                        const next = new Set(expandedRows);
                        next.has(product.id) ? next.delete(product.id) : next.add(product.id);
                        setExpandedRows(next);
                    }}>
                      {expandedRows.has(product.id) ? <ChevronUp className="w-4 h-4"/> : <ChevronDown className="w-4 h-4"/>}
                    </button>
                  </td>
                  <td className="p-4 font-bold">{product.name}</td>
                  <td className="p-4">{product.product_variants?.reduce((acc: number, v: any) => acc + (v.stock_quantity || 0), 0)} Total</td>
                  <td className="p-4 text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon" asChild>
                        <Link href={`/admin/products/edit/${product.id}`}><Edit className="w-4 h-4" /></Link>
                      </Button>
                    </div>
                  </td>
                </tr>
                {expandedRows.has(product.id) && (
                  <tr>
                    <td colSpan={4} className="bg-gray-50 p-4">
                      {product.product_variants.map((v: any) => (
                        <div key={v.id} className="flex justify-between border-b py-2 text-sm">
                          <span>{v.color} / {v.size} (SKU: {v.sku})</span>
                          <span>{formatCurrency(v.price)} | {v.stock_quantity} in stock</span>
                        </div>
                      ))}
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}