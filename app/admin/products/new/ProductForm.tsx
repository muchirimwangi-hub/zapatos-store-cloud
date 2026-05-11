"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Save, Plus, X } from "lucide-react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { createClient } from "@/lib/supabase/client"

interface ProductFormProps {
  initialData?: any;
}

export default function ProductForm({ initialData }: ProductFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [form, setForm] = useState({
    name: initialData?.name || "",
    slug: initialData?.slug || "",
    description: initialData?.description || "",
    short_description: initialData?.short_description || "",
    price: initialData?.price?.toString() || "",
    compare_at_price: initialData?.compare_at_price?.toString() || "",
    category: initialData?.category || "training",
    subcategory: initialData?.subcategory || "",
    brand: initialData?.brand || "Zapatos Cave",
    sku: initialData?.sku || "",
    stock_quantity: initialData?.stock_quantity?.toString() || "0",
    is_active: initialData?.is_active ?? true,
    is_featured: initialData?.is_featured ?? false,
    volume: initialData?.volume || "",
  })

  // Updated Categories for Zapatos Cave
  const SUBCATEGORY_OPTIONS = {
    training: ["Tops", "Shorts", "Compression", "Outerwear"],
    accessories: ["Bags", "Headwear", "Equipment"],
    "new-drops": ["Limited Edition", "Seasonal"],
  }

  const [imageUrls, setImageUrls] = useState<string[]>(initialData?.images?.map((img: any) => img.url) || [""])
  const [personalityTags, setPersonalityTags] = useState<string[]>(initialData?.personality_tags || [])
  const [newTag, setNewTag] = useState("")

  const updateField = (field: string, value: string | boolean) => {
    setForm((prev) => ({ ...prev, [field]: value }))
    if (field === "name" && !initialData && !form.slug) {
      const slug = (value as string).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")
      setForm((prev) => ({ ...prev, slug }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)

    const supabase = createClient()
    const images = imageUrls.filter((url) => url.trim()).map((url) => ({ url: url.trim() }))

    const payload = {
      ...form,
      price: parseFloat(form.price),
      compare_at_price: form.compare_at_price ? parseFloat(form.compare_at_price) : null,
      stock_quantity: parseInt(form.stock_quantity) || 0,
      images,
      personality_tags: personalityTags,
    }

    let result;
    if (initialData?.id) {
      // Update existing
      result = await supabase.from("products").update(payload).eq("id", initialData.id)
    } else {
      // Insert new
      result = await supabase.from("products").insert(payload)
    }

    if (result.error) {
      setError(result.error.message)
      setIsLoading(false)
    } else {
      router.push("/admin/products")
      router.refresh()
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {error && <div className="p-4 bg-red-50 text-red-700 rounded-lg border border-red-200">{error}</div>}
      
      {/* Basic Info Section */}
      <div className="bg-white p-8 rounded-none border border-black/10 space-y-6">
        <h2 className="text-xs font-bold uppercase tracking-[0.2em] border-b pb-4 mb-4">Product Specifications</h2>
        
        <div className="space-y-2">
          <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Product Name</label>
          <Input 
            value={form.name} 
            onChange={(e) => updateField("name", e.target.value)} 
            required 
            className="rounded-none border-black/10 focus:border-black"
          />
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">URL Slug</label>
          <Input 
            value={form.slug} 
            onChange={(e) => updateField("slug", e.target.value)} 
            required 
            className="rounded-none border-black/10"
          />
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Full Description</label>
          <textarea 
            className="w-full border border-black/10 p-3 text-sm min-h-[120px] focus:outline-none focus:border-black" 
            placeholder="Describe the performance features..."
            value={form.description}
            onChange={(e) => updateField("description", e.target.value)}
          />
        </div>
      </div>

      {/* Pricing & Stock Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white p-8 border border-black/10">
         <div className="space-y-2">
           <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Price (Ksh)</label>
           <Input 
             type="number" 
             value={form.price} 
             onChange={(e) => updateField("price", e.target.value)} 
             className="rounded-none border-black/10"
           />
         </div>
         <div className="space-y-2">
           <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Stock Quantity</label>
           <Input 
             type="number" 
             value={form.stock_quantity} 
             onChange={(e) => updateField("stock_quantity", e.target.value)} 
             className="rounded-none border-black/10"
           />
         </div>
      </div>

      <Button 
        type="submit" 
        disabled={isLoading} 
        className="w-full bg-black text-white hover:bg-gray-800 rounded-none h-14 uppercase tracking-[0.3em] font-bold text-xs transition-all"
      >
        {isLoading ? "Synchronizing..." : initialData ? "Update Gear" : "Launch Product"}
      </Button>
    </form>
  )
}