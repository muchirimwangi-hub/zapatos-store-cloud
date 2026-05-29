"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Plus, Trash2, ArrowLeft, Image as ImageIcon, Video, Layers } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { createClient } from "@/lib/supabase/client"

interface ProductFormProps {
  productId?: string
}

interface VariantInput {
  id?: string
  size: string
  color: string
  sleeve: string
  stock_quantity: number
}

export function ProductForm({ productId }: ProductFormProps) {
  const router = useRouter()
  const [isSaving, setIsSaving] = useState(false)
  
  // Parent metrics fields
  const [name, setName] = useState("")
  const [slug, setSlug] = useState("")
  const [price, setPrice] = useState("")
  const [shortDescription, setShortDescription] = useState("")
  const [description, setDescription] = useState("")
  
  // Media asset array arrays
  const [mediaUrls, setMediaUrls] = useState<string[]>([""])
  
  // Multidimensional attributes matrix configuration state
  const [variants, setVariants] = useState<VariantInput[]>([])

  useEffect(() => {
    if (!productId) return
    
    async function loadData() {
      const supabase = createClient()
      
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
        
        // Populate media urls framework
        if (product.images) {
          const parsedImages = Array.isArray(product.images) 
            ? product.images 
            : [product.images]
          setMediaUrls(parsedImages.length > 0 ? parsedImages : [""])
        }

        const { data: variantRecords } = await supabase
          .from("product_variants")
          .select("*")
          .eq("product_id", productId)

        if (variantRecords && variantRecords.length > 0) {
          setVariants(variantRecords.map(v => ({
            id: v.id,
            size: v.size || "M",
            color: v.color || "Black",
            sleeve: v.sleeve || "Short Sleeve",
            stock_quantity: v.stock_quantity || 0
          })))
        }
      }
    }
    loadData()
  }, [productId])

  // Media arrays manipulation handlers
  const addMediaUrlField = () => setMediaUrls([...mediaUrls, ""])
  const removeMediaUrlField = (index: number) => setMediaUrls(mediaUrls.filter((_, i) => i !== index))
  const updateMediaUrl = (index: number, val: string) => {
    const updated = [...mediaUrls]
    updated[index] = val
    setMediaUrls(updated)
  }

  // Variant fields tracking controllers
  const addVariantField = () => {
    setVariants([...variants, { size: "M", color: "Black", sleeve: "Short Sleeve", stock_quantity: 0 }])
  }
  const removeVariantField = (index: number) => setVariants(variants.filter((_, i) => i !== index))
  const updateVariant = (index: number, field: keyof VariantInput, value: any) => {
    const updated = [...variants]
    updated[index] = { ...updated[index], [field]: value } as any
    setVariants(updated)
  }

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (isSaving) return
    setIsSaving(true)

    try {
      const supabase = createClient()
      const generatedSlug = slug.trim() || name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")
      
      // Clean empty lines from image upload array
      const cleanedMediaJson = mediaUrls.filter(url => url.trim() !== "")

      // 1. Transaction node checkpoint: Save parent apparel specifications
      const { data: parentProduct, error: productError } = await supabase
        .from("products")
        .upsert({
          ...(productId ? { id: productId } : {}),
          name,
          slug: generatedSlug,
          price: parseFloat(price) || 0,
          short_description: shortDescription,
          description,
          brand: "Zapatos Cave",
          images: cleanedMediaJson, // JSON Array containing images and video tracks
          is_active: true // Force fallback constraint to prevent frontend dropping
        })
        .select()
        .single()

      if (productError || !parentProduct) throw productError || new Error("Failed product save.")

      // 2. Cascade cleaning node checkpoint: Wipe out old variation instances
      await supabase
        .from("product_variants")
        .delete()
        .eq("product_id", parentProduct.id)

      // 3. Multidimensional distribution checkpoint: Save compound parameters matrix
      if (variants.length > 0) {
        const formattedVariants = variants.map(v => {
          // Compute distinct hardware SKU paths automatically based on configurations chosen
          const skuCode = `${generatedSlug}-${v.color.toLowerCase()}-${v.sleeve.toLowerCase().replace(/\s+/g, "-")}-${v.size.toLowerCase()}`
          
          return {
            product_id: parentProduct.id,
            sku: skuCode,
            size: v.size,
            color: v.color,
            sleeve: v.sleeve,
            stock_quantity: Math.max(0, parseInt(v.stock_quantity as any) || 0),
            price: parentProduct.price
          }
        })

        const { error: variantError } = await supabase
          .from("product_variants")
          .insert(formattedVariants)

        if (variantError) throw variantError
      }

      router.push("/admin/products")
      router.refresh()
    } catch (err) {
      console.error("Critical submission runtime block:", err)
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <form onSubmit={handleFormSubmit} className="space-y-10 max-w-4xl mx-auto text-left pb-24">
      <div className="flex items-center gap-4">
        <Button type="button" variant="ghost" size="icon" className="rounded-none border border-zinc-200 dark:border-zinc-800" onClick={() => router.push("/admin/products")}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <span className="text-[9px] font-mono tracking-widest text-zinc-400 block">// INVENTORY CORE ENGINE</span>
          <h2 className="text-xl font-black uppercase tracking-tight text-zinc-950 dark:text-white mt-0.5">
            Modify Apparel Specifications
          </h2>
        </div>
      </div>

      {/* BLOCK 1: BASE DATA PARAMETERS */}
      <div className="p-6 border border-zinc-100 dark:border-zinc-900 bg-white dark:bg-[#0C0C10] space-y-4 rounded-none shadow-sm">
        <div className="space-y-1">
          <label className="text-[10px] font-mono uppercase tracking-widest text-zinc-400 font-bold">Apparel Title</label>
          <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g., Pista Premium Thermal Tracksuit" required className="rounded-none h-11" />
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="space-y-1">
            <label className="text-[10px] font-mono uppercase tracking-widest text-zinc-400 font-bold">URL Slug Parameter</label>
            <Input value={slug} onChange={(e) => setSlug(e.target.value)} placeholder="pista-premium-thermal-tracksuit" className="rounded-none h-11 font-mono text-xs" />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-mono uppercase tracking-widest text-zinc-400 font-bold">Retail Unit Value (KSh)</label>
            <Input type="number" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="6500" required className="rounded-none h-11 font-mono" />
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-[10px] font-mono uppercase tracking-widest text-zinc-400 font-bold">Short Summary Description</label>
          <Input value={shortDescription} onChange={(e) => setShortDescription(e.target.value)} placeholder="Premium double-knit insulated activewear set." className="rounded-none h-11" />
        </div>

        <div className="space-y-1">
          <label className="text-[10px] font-mono uppercase tracking-widest text-zinc-400 font-bold">Detailed Fabric Manifesto</label>
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={4} className="w-full p-3 border border-zinc-200 dark:border-zinc-900 bg-white dark:bg-[#0C0C10] text-sm text-zinc-900 dark:text-white rounded-none focus:outline-none focus:border-zinc-400 transition-colors" placeholder="State insulation attributes, composition thresholds, and training lifecycle parameters..." />
        </div>
      </div>

      {/* BLOCK 2: MEDIA LOGS MATRIX LAYER (JPEG/MP4/VIDEO URL PIPELINE) */}
      <div className="p-6 border border-zinc-100 dark:border-zinc-900 bg-white dark:bg-[#0C0C10] space-y-4 rounded-none shadow-sm">
        <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-900 pb-3">
          <div className="flex items-center gap-2">
            <ImageIcon className="w-4 h-4 text-zinc-400" />
            <h3 className="text-xs font-black uppercase tracking-widest text-zinc-950 dark:text-white">Media Assets Matrix</h3>
          </div>
          <Button type="button" variant="outline" size="sm" onClick={addMediaUrlField} className="rounded-none text-[9px] font-mono tracking-wider h-8">
            ADD MEDIA SOURCE
          </Button>
        </div>

        <div className="space-y-2">
          {mediaUrls.map((url, index) => (
            <div key={index} className="flex gap-2 items-center">
              <div className="relative flex-1">
                <Input value={url} onChange={(e) => updateMediaUrl(index, e.target.value)} placeholder="Paste high-res image JPEG or video file URL trace string..." className="rounded-none pr-10 font-mono text-xs h-10" />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                  {url.toLowerCase().endsWith(".mp4") || url.toLowerCase().includes("video") ? (
                    <Video className="w-3.5 h-3.5 text-zinc-400" />
                  ) : (
                    <ImageIcon className="w-3.5 h-3.5 text-zinc-400" />
                  )}
                </div>
              </div>
              {mediaUrls.length > 1 && (
                <Button type="button" variant="ghost" size="icon" onClick={() => removeMediaUrlField(index)} className="text-zinc-400 hover:text-red-500 rounded-none h-10 w-10 border border-zinc-100 dark:border-zinc-900">
                  <Trash2 className="w-4 h-4 stroke-[1.5]" />
                </Button>
              )}
            </div>
          ))}
        </div>
        <p className="text-[10px] font-mono text-zinc-400 leading-relaxed uppercase tracking-wide pt-1">
          Provide complete media URLs (e.g., Unsplash asset nodes or stored storage buckets) ending in standard format protocols like .jpg, .jpeg, or video streaming extensions (.mp4).
        </p>
      </div>

      {/* BLOCK 3: EXPANDED MULTIDIMENSIONAL VARIATIONS MATRIX */}
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-900 pb-3">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-zinc-400" />
            <h3 className="text-xs font-black uppercase tracking-widest text-zinc-400">Sizing &amp; Attribute Configuration Matrix</h3>
          </div>
          <Button type="button" variant="outline" size="sm" onClick={addVariantField} className="rounded-none border-zinc-200 dark:border-zinc-900 font-mono text-[10px] h-8">
            <Plus className="w-3.5 h-3.5 mr-1" /> ADD CONFIGURATION VARIANT
          </Button>
        </div>

        {variants.length === 0 ? (
          <div className="border border-dashed border-zinc-200 dark:border-zinc-900 p-12 text-center text-xs font-mono uppercase tracking-wider text-zinc-400 bg-zinc-50/50 dark:bg-[#0C0C10]/10">
            No active configuration variants assigned. Create variants below to unlock store stock.
          </div>
        ) : (
          <div className="space-y-3">
            {variants.map((v, index) => (
              <div key={index} className="p-4 bg-zinc-50 dark:bg-[#0C0C10] border border-zinc-200 dark:border-zinc-900 rounded-none grid grid-cols-1 md:grid-cols-12 gap-4 items-center relative group">
                
                {/* ATTRIBUTES INTERFACE LOOPS */}
                <div className="md:col-span-11 grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="space-y-1">
                    <span className="text-[9px] font-mono text-zinc-400 block uppercase">Size</span>
                    <Input value={v.size} onChange={(e) => updateVariant(index, "size", e.target.value.toUpperCase())} placeholder="M" required className="h-9 rounded-none font-mono uppercase" />
                  </div>
                  
                  <div className="space-y-1">
                    <span className="text-[9px] font-mono text-zinc-400 block uppercase">Color Way</span>
                    <Input value={v.color} onChange={(e) => updateVariant(index, "color", e.target.value)} placeholder="Pista" required className="h-9 rounded-none text-xs font-bold tracking-wide uppercase" />
                  </div>

                  <div className="space-y-1">
                    <span className="text-[9px] font-mono text-zinc-400 block uppercase">Sleeve Specs</span>
                    <Input value={v.sleeve} onChange={(e) => updateVariant(index, "sleeve", e.target.value)} placeholder="Long Sleeve / Short" required className="h-9 rounded-none text-xs font-bold tracking-wide uppercase" />
                  </div>

                  <div className="space-y-1">
                    <span className="text-[9px] font-mono text-zinc-400 block uppercase">Stock Units</span>
                    <Input type="number" value={v.stock_quantity} onChange={(e) => updateVariant(index, "stock_quantity", parseInt(e.target.value) || 0)} placeholder="50" required className="h-9 rounded-none font-mono" />
                  </div>
                </div>

                <div className="md:col-span-1 flex justify-end pt-4 md:pt-0">
                  <Button type="button" variant="ghost" size="icon" onClick={() => removeVariantField(index)} className="text-zinc-400 hover:text-red-500 rounded-none h-9 w-9 border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#08080A]">
                    <Trash2 className="w-4 h-4 stroke-[1.5]" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* COMMIT ACTIONS ACTIONS DESK */}
      <div className="pt-6 flex justify-end border-t border-zinc-100 dark:border-zinc-900">
        <Button type="submit" disabled={isSaving} className="bg-black dark:bg-white text-white dark:text-black hover:bg-zinc-800 dark:hover:bg-zinc-200 rounded-none h-14 px-16 text-xs font-black uppercase tracking-[0.25em] transition-transform active:scale-97">
          {isSaving ? "TRANSMITTING EQUIPMENT NODE..." : "COMMIT APPAREL RECORD"}
        </Button>
      </div>
    </form>
  )
}