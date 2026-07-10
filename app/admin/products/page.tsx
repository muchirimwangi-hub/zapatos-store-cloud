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

  const loadData = async () => {
    const supabase = createClient()
    const { data } = await supabase
      .from("products")
      .select("*, product_variants(*)")
      .order("created_at", { ascending: false })
        console.log("SUPABASE PRODUCTS DUMP:", data);

    setProducts(data || [])
  }

  useEffect(() => {
    loadData()
  }, [])

  // 👉 NEW: Instantly toggles a product between Active and Draft
  const handleToggleActive = async (id: string, currentStatus: boolean) => {
    const newStatus = !currentStatus;
    const supabase = createClient();
    
    // Optimistic UI Update (Feels instant)
    setProducts(products.map(p => p.id === id ? { ...p, is_active: newStatus } : p));
    
    // Update the Database
    const { error } = await supabase.from("products").update({ is_active: newStatus }).eq("id", id);
    if (error) {
      console.error("Failed to toggle status", error);
      // Revert if it fails
      setProducts(products.map(p => p.id === id ? { ...p, is_active: currentStatus } : p));
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure? This will delete the product and all variants.")) return;
    
    const supabase = createClient();
    
    // 1. Delete variants first to avoid foreign key errors
    await supabase.from("product_variants").delete().eq("product_id", id);
    
    // 2. Delete the product
    await supabase.from("products").delete().eq("id", id);
    
    // 3. Refresh the list
    setProducts(products.filter(p => p.id !== id));
  };

// 👉 NEW: Clean Multi-Word & Attribute Scanner
  const filtered = products.filter(p => {
    if (!search.trim()) return true;

    // Split the search into lowercase terms: "tshirt champagne" -> ["tshirt", "champagne"]
    const searchTerms = search.toLowerCase().trim().split(/\s+/).filter(Boolean);

    // Collect EVERY piece of text associated with this product into one giant array of strings
    const allProductText: string[] = [
      p.name || "",
      p.category || "",
      p.description || "",
      ...(p.product_variants || []).flatMap((v: any) => [
        v.sku || "",
        ...(v.attributes ? Object.values(v.attributes).map(val => String(val)) : []),
        // Fallback: stringify the variant just in case Supabase nested it differently
        JSON.stringify(v)
      ])
    ];

    // Combine it into one master lowercase string, removing punctuation/hyphens so "T-shirt" matches "tshirt"
    const masterString = allProductText
      .join(" ")
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, ""); // removes hyphens, symbols, but keeps letters/numbers

    // Guarantee that EVERY word typed appears somewhere in that master string
    return searchTerms.every(term => {
      const cleanTerm = term.replace(/[^a-z0-9]/g, "");
      
      // Allow singular/plural flexibility (if searching "tshirt", match "tshirts")
      return masterString.includes(cleanTerm) || 
             masterString.includes(`${cleanTerm}s`) || 
             (cleanTerm.endsWith('s') && masterString.includes(cleanTerm.slice(0, -1)));
    });
  });

  return (
    <div className="space-y-6 p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold uppercase tracking-tight">Product Pipeline</h1>
        <Button asChild className="rounded-none bg-black text-white hover:bg-zinc-800 font-bold uppercase tracking-widest text-xs h-11 px-6">
          <Link href="/admin/products/new">Deploy New Product</Link>
        </Button>
      </div>
      
      <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Filter by Title or SKU String..." className="max-w-md rounded-none border-zinc-200 h-11" />
      
      <div className="bg-white border border-gray-200 shadow-sm">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200 text-left text-[11px] uppercase tracking-widest text-zinc-500 font-mono">
              <th className="p-4 w-12"></th>
              <th className="p-4">Identity</th>
              <th className="p-4 text-center">Status</th>
              <th className="p-4">Global Inventory</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {filtered.map(product => {
              // Safety fallback: if is_active is null in older DB rows, default to true
              const isActive = product.is_active !== false; 
              
              return (
                <React.Fragment key={product.id}>
                  <tr className="border-b border-gray-100 hover:bg-gray-50/50 transition-colors">
                    <td className="p-4">
                      <button onClick={() => {
                          const next = new Set(expandedRows);
                          next.has(product.id) ? next.delete(product.id) : next.add(product.id);
                          setExpandedRows(next);
                      }} className="text-zinc-400 hover:text-black transition-colors">
                        {expandedRows.has(product.id) ? <ChevronUp className="w-4 h-4"/> : <ChevronDown className="w-4 h-4"/>}
                      </button>
                    </td>
                    <td className="p-4 font-bold text-zinc-900 uppercase tracking-tight">{product.name}</td>
                    
                    {/* 👉 THE ACTIVE/DRAFT TOGGLE SWITCH */}
                    <td className="p-4 text-center">
                      <button 
                        onClick={() => handleToggleActive(product.id, isActive)}
                        className={`px-3 py-1.5 rounded-full text-[9px] font-bold uppercase tracking-widest transition-colors ${
                          isActive 
                            ? 'bg-green-100 text-green-700 hover:bg-green-200' 
                            : 'bg-zinc-100 text-zinc-500 hover:bg-zinc-200'
                        }`}
                      >
                        {isActive ? 'Active' : 'Draft'}
                      </button>
                    </td>

                    <td className="p-4 font-mono text-zinc-600">{product.product_variants?.reduce((acc: number, v: any) => acc + (parseInt(v.stock_quantity) || 0), 0)} Units</td>
                    <td className="p-4 text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon" asChild className="hover:bg-zinc-100 rounded-none h-8 w-8 text-zinc-500">
                          <Link href={`/admin/products/edit/${product.id}`}><Edit className="w-3.5 h-3.5" /></Link>
                        </Button>
                        <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-700 hover:bg-red-50 rounded-none h-8 w-8" onClick={() => handleDelete(product.id)}>
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                  {expandedRows.has(product.id) && (
                    <tr>
                      <td colSpan={5} className="bg-zinc-50/80 p-0 border-b border-gray-200">
                        <div className="p-4 pl-12 space-y-1">
                          <div className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest mb-3">Variant Sub-Matrix</div>
                          {product.product_variants?.map((v: any) => (
                            <div key={v.id} className="flex justify-between items-center py-2 border-b border-zinc-200/50 last:border-0 text-xs hover:bg-white px-3 rounded transition-colors">
                              <span className="font-semibold uppercase tracking-wide text-zinc-700">
                                {Object.values(v.attributes || {}).join(" / ")} 
                                <span className="ml-2 font-mono text-[10px] text-zinc-400 bg-zinc-100 px-2 py-0.5 rounded-full">{v.sku}</span>
                              </span>
                              <span className="font-mono text-zinc-600">
                                {/* 👉 NEW: Discount Engine Display */}
                                {Number(product.compare_at_price || v.compare_at_price || 0) > 0 && (
                                  <span className="line-through text-red-400 mr-2 text-[10px]">
                                    {formatCurrency(Number(product.compare_at_price || v.compare_at_price))}
                                  </span>
                                )}
                                <span className={Number(product.compare_at_price || v.compare_at_price || 0) > 0 ? "text-green-600 font-bold" : ""}>
                                  {formatCurrency(v.price)}
                                </span> 
                                <span className="mx-2 text-zinc-300">|</span> 
                                <span className={v.stock_quantity > 0 ? "text-green-600 font-bold" : "text-red-500 font-bold"}>
                                  {v.stock_quantity} IN STOCK
                                </span>
                              </span>
                            </div>
                          ))}
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}