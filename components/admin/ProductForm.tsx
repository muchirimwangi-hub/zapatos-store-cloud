"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Plus, Trash2, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { createClient } from "@/lib/supabase/client"

interface ProductFormProps {
  productId?: string
}

export function ProductForm({ productId }: ProductFormProps) {
  const router = useRouter()
  const [isSaving, setIsSaving] = useState(false)
  const [name, setName] = useState("")
  const [slug, setSlug] = useState("")
  const [price, setPrice] = useState("")
  const [shortDescription, setShortDescription] = useState("")
  const [description, setDescription] = useState("")
  
  // Local array matching dynamic option modifications
  const [variants, setVariants] = useState<Array<{ id?: string; size: string; stock_quantity: number }>>([])

  useEffect(() => {
    if (!productId) return
    
    async function loadData() {
      const supabase = createClient()
      
      // Fetch core item definitions
      const { data: product } = await supabase
        .from("products")
        .select("*")
        .eq("id", productId)
        .single()

      if (product) {
        setName(product.name || "")
        setSlug(product.slug || "")
        setPrice(product.price?.toString() || "")
        setShortDescription(product.short_description || "")
        setDescription(product.description || "")

        // Fetch corresponding attributes to populate edit form
        const { data: variantRecords } = await supabase
          .from("product_variants")
          .select("*")
          .eq("product_id", productId)

        if (variantRecords) {
          setVariants(variantRecords.map(v => ({
            id: v.id,
            size: v.size || "",
            stock_quantity: v.stock_quantity || 0
          })))
        }
      }
    }
    loadData()
  }, [productId])

  const addVariantField = () => {
    setVariants([...variants, { size: "M", stock_quantity: 0 }])
  }

  const removeVariantField = (index: number) => {
    setVariants(variants.filter((_, i) => i !== index))
  }

  const updateVariant = (index: number, field: string, value: any) => {
    const updated = [...variants]
    updated[index] = { ...updated[index], [field]: value }
    setVariants(updated)
  }

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (isSaving) return
    setIsSaving(true)

    try {
      const supabase = createClient()
      const fallbackSlug = slug.trim() || name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")
      
      // Step 1: Force synchronous upsert execution for parent apparel spec
      const { data: parentProduct, error: productError } = await supabase
        .from("products")
        .upsert({
          ...(productId ? { id: productId } : {}),
          name,
          slug: fallbackSlug,
          price: parseFloat(price) || 0,
          short_description: shortDescription,
          description,
          brand: "Zapatos Cave",
          is_active: true
        })
        .select()
        .single()

      if (productError || !parentProduct) {
        throw new Error(productError?.message || "Parent allocation signature failed.")
      }

      // Step 2: Clear historical variant configurations to cleanly avoid duplication blocks
      await supabase
        .from("product_variants")
        .delete()
        .eq("product_id", parentProduct.id)

      // Step 3: Insert modified attributes matrix
      if (variants.length > 0) {
        const formattedVariants = variants.map(v => ({
          product_id: parentProduct.id,
          sku: `${fallbackSlug}-${v.size.toLowerCase()}`,
          size: v.size,
          stock_quantity: Math.max(0, parseInt(v.stock_quantity as any) || 0),
          price: parentProduct.price,
          color: "Standard"
        }))

        const { error: variantError } = await supabase
          .from("product_variants")
          .insert(formattedVariants)

        if (variantError) throw variantError
      }

      router.push("/admin/products")
      router.refresh()
    } catch (err) {
      console.error("Transactional submission failure:", err)
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <form onSubmit={handleFormSubmit} className="space-y-8 max-w-3xl mx-auto text-left">
      <div className="flex items-center gap-4">
        <Button type="button" variant="ghost" size="icon" className="rounded-none" onClick={() => router.push("/admin/products")}>
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <h2 className="text-xl font-black uppercase tracking-wider text-zinc-950 dark:text-white">
          {productId ? "Modify Apparel Specifications" : "Assign New Equipment Node"}
        </h2>
      </div>

      {/* CORE SPECIFICATIONS METRICS BOX */}
      <div className="p-6 border border-zinc-200 dark:border-zinc-900 bg-white dark:bg-[#0C0C10] space-y-4 rounded-none">
        <div className="space-y-1">
          <label className="text-[10px] font-mono uppercase tracking-widest text-zinc-400">Apparel Title</label>
          <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g., Core Compression Leggings" required className="rounded-none" />
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-[10px] font-mono uppercase tracking-widest text-zinc-400">URL Slug Parameter</label>
            <Input value={slug} onChange={(e) => setSlug(e.target.value)} placeholder="e.g., core-compression-leggings" className="rounded-none" />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-mono uppercase tracking-widest text-zinc-400">Retail Unit Value (KSh)</label>
            <Input type="number" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="4500" required className="rounded-none" />
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-[10px] font-mono uppercase tracking-widest text-zinc-400">Short Summary description</label>
          <Input value={shortDescription} onChange={(e) => setShortDescription(e.target.value)} placeholder="High-tension poly-spandex recovery structure." className="rounded-none" />
        </div>

        <div className="space-y-1">
          <label className="text-[10px] font-mono uppercase tracking-widest text-zinc-400">Detailed Fabric Manifesto</label>
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={4} className="w-full p-3 border border-zinc-200 dark:border-zinc-900 bg-white dark:bg-[#0C0C10] text-sm text-zinc-900 dark:text-white rounded-none focus:outline-none focus:border-zinc-400 font-sans" placeholder="State structural panel allocations and mechanical output attributes..." />
        </div>
      </div>

      {/* ATHLETIC ATTRIBUTES ARRAY INTERFACE */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-black uppercase tracking-widest text-zinc-400">Sizing &amp; Stock Parameter Allocation Matrix</h3>
          <Button type="button" variant="outline" size="sm" onClick={addVariantField} className="rounded-none border-zinc-200 dark:border-zinc-900 font-mono text-[10px]">
            <Plus className="w-3.5 h-3.5 mr-1" /> ADD CONFIGURATION
          </Button>
        </div>

        {variants.length === 0 ? (
          <div className="border border-dashed border-zinc-200 dark:border-zinc-900 p-8 text-center text-xs font-mono uppercase tracking-wider text-zinc-400">
            No size parameters loaded. Items require configurations to verify cart inputs.
          </div>
        ) : (
          <div className="space-y-2">
            {variants.map((v, index) => (
              <div key={index} className="flex items-center gap-4 p-3 bg-zinc-50 dark:bg-[#0C0C10] border border-zinc-200 dark:border-zinc-900 rounded-none">
                <div className="flex-1 grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <span className="text-[9px] font-mono text-zinc-400">SIZE:</span>
                    <Input value={v.size} onChange={(e) => updateVariant(index, "size", e.target.value.toUpperCase())} placeholder="M" required className="h-9 rounded-none font-mono text-center uppercase" />
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[9px] font-mono text-zinc-400">STOCK:</span>
                    <Input type="number" value={v.stock_quantity} onChange={(e) => updateVariant(index, "stock_quantity", parseInt(e.target.value) || 0)} placeholder="24" required className="h-9 rounded-none font-mono" />
                  </div>
                </div>
                <Button type="button" variant="ghost" size="icon" onClick={() => removeVariantField(index)} className="text-zinc-400 hover:text-red-500 rounded-none h-9 w-9">
                  <Trash2 className="w-4 h-4 stroke-[1.5]" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* COMMIT ACTIONS LAYOUT TABS */}
      <div className="pt-4 flex justify-end">
        <Button type="submit" disabled={isSaving} className="bg-black dark:bg-white text-white dark:text-black hover:bg-zinc-800 dark:hover:bg-zinc-200 rounded-none h-12 px-12 text-xs font-black uppercase tracking-[0.2em]">
          {isSaving ? "TRANSMITTING DATA..." : "COMMIT APPAREL RECORD"}
        </Button>
      </div>
    </form>
  )
}