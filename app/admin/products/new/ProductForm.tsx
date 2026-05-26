"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Upload, X } from "lucide-react" 
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { createClient } from "@/lib/supabase/client"
import { VariantBuilder } from "@/components/admin/VariantBuilder"

const CATEGORIES = [
  "Men: Caps", "Men: Compression Pants", "Men: Jackets & Hoodies", "Men: Jeans", "Men: Joggers", 
  "Men: Tracksuits", "Men: Tshirts", "Men: Shoes", "Men: Shorts", "Men: Socks", "Men: Vests & Tank tops",
  "Women: Bras", "Women: Caps", "Women: Crop Tops", "Women: Jackets & Hoodies", "Women: Joggers", 
  "Women: Leggings & Tights", "Women: Shoes", "Women: Shorts", "Women: Socks", "Women: Tracksuits", 
  "Women: Tshirts", "Women: Vests",
  "Shoes", "Equipment"
];

export default function ProductForm({ initialData }: { initialData?: any }) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [variants, setVariants] = useState<any[]>([])
  const [productImages, setProductImages] = useState<string[]>(initialData?.images?.map((i: any) => i.url) || []) 

  const [form, setForm] = useState({
    name: initialData?.name || "",
    slug: initialData?.slug || "",
    description: initialData?.description || "",
    short_description: initialData?.short_description || "",
    seo_description: initialData?.seo_description || "",
    price: initialData?.price?.toString() || "",
    buying_price: initialData?.buying_price?.toString() || "",
    category: initialData?.category || "Men: Tshirts",
    tags: (initialData?.tags as string[]) || [],
    weight_kg: initialData?.weight_kg?.toString() || "0.3",
    is_active: initialData?.is_active ?? true,
  })

  const toggleTag = (tag: string) => {
    setForm(prev => ({
      ...prev,
      tags: prev.tags.includes(tag) ? prev.tags.filter(t => t !== tag) : [...prev.tags, tag]
    }));
  };

  const updateField = (field: string, value: string) => {
    setForm((prev) => {
      const nextForm = { ...prev, [field]: value };
      if (field === "name" && !initialData) {
        nextForm.slug = value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
      }
      return nextForm;
    });
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    const supabase = createClient();
    const newUrls = [...productImages];
    for (let file of Array.from(files)) {
      const filePath = `products/${Math.random()}_${file.name}`;
      const { error } = await supabase.storage.from('product-images').upload(filePath, file);
      if (!error) {
        const { data } = supabase.storage.from('product-images').getPublicUrl(filePath);
        newUrls.push(data.publicUrl);
      }
    }
    setProductImages(newUrls);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    const supabase = createClient();
    const payload = { ...form, price: parseFloat(form.price), buying_price: parseFloat(form.buying_price), images: productImages.map(url => ({ url })) };

    const { data: savedProduct, error: prodErr } = initialData?.id 
      ? await supabase.from("products").update(payload).eq("id", initialData.id).select().single()
      : await supabase.from("products").insert([payload]).select().single();

    if (prodErr) { alert(prodErr.message); setIsLoading(false); return; }

    await supabase.from("product_variants").delete().eq("product_id", savedProduct.id);
    const variantsPayload = variants.map(v => ({
      product_id: savedProduct.id,
      sku: v.sku || `${savedProduct.slug}-${v.option1?.value || 'v'}`,
      price: parseFloat(v.price) || payload.price,
      stock_quantity: parseInt(v.stock) || 0,
      color: v.option1?.value || null,
      size: v.option2?.value || null
    }));
    await supabase.from("product_variants").insert(variantsPayload);
    router.push("/admin/products");
    router.refresh();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="bg-white p-8 border border-black/10 space-y-6">
        <h2 className="text-[10px] font-bold uppercase tracking-widest border-b pb-4">Product Specs</h2>
        
        <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase text-gray-400">Product Name</label>
            <Input value={form.name} onChange={(e) => updateField("name", e.target.value)} required />
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-bold uppercase text-gray-400">Category</label>
          <select className="w-full border h-11 px-3 text-xs uppercase font-bold rounded-none" 
                  value={form.category} onChange={(e) => updateField("category", e.target.value)}>
            {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
          </select>
        </div>

        <div className="flex gap-6">
          {["new", "men", "women"].map(tag => (
            <label key={tag} className="text-[10px] font-bold uppercase flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={form.tags.includes(tag)} onChange={() => toggleTag(tag)} />
              {tag.toUpperCase()}
            </label>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase text-gray-400">Selling Price (Ksh)</label>
            <Input type="number" value={form.price} onChange={(e) => updateField("price", e.target.value)} />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase text-gray-400">Buying Price (Ksh)</label>
            <Input type="number" value={form.buying_price} onChange={(e) => updateField("buying_price", e.target.value)} />
          </div>
        </div>

        <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase text-gray-400">Short Description</label>
            <Input value={form.short_description} onChange={(e) => updateField("short_description", e.target.value)} />
        </div>
      </div>

      <div className="bg-white p-8 border border-black/10">
        <label className="cursor-pointer bg-black text-white px-6 py-3 text-[9px] font-bold uppercase">
          Upload Media <input type="file" multiple className="hidden" onChange={handleFileUpload} accept="image/*,video/*" />
        </label>
        <div className="grid grid-cols-5 gap-4 mt-4">
          {productImages.map((url, i) => (
            <div key={i} className="relative aspect-square bg-gray-100">
              <img src={url} className="w-full h-full object-cover" />
              <button type="button" onClick={() => setProductImages(productImages.filter((_, idx) => idx !== i))} className="absolute top-0 right-0 bg-red-500 text-white"><X size={12}/></button>
            </div>
          ))}
        </div>
      </div>

      <VariantBuilder onVariantsChange={setVariants} initialVariants={variants} availableImages={productImages} />

      <Button type="submit" disabled={isLoading} className="w-full bg-black text-white h-16 rounded-none">
        {isLoading ? "Saving..." : "Launch Product"}
      </Button>
    </form>
  )
}