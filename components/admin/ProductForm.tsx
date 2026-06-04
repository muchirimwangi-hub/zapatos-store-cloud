"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createClient } from "@/lib/supabase/client";

export function ProductForm({ productId, initialData }: { productId?: string, initialData?: any }) {
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  
  // Basic Info
  const [name, setName] = useState(initialData?.name || "");
  const [category, setCategory] = useState(initialData?.category || "Men");
  const [description, setDescription] = useState(initialData?.description || "");
  const [isActive, setIsActive] = useState<boolean>(initialData?.is_active ?? true);
  
  // Media Array
  const [images, setImages] = useState<string[]>(initialData?.images || []);
  
  // Dynamic Option Categories (e.g., ["Size", "Color"])
  const [optionKeys, setOptionKeys] = useState<string[]>(
    initialData?.product_variants?.[0]?.attributes 
      ? Object.keys(initialData.product_variants[0].attributes) 
      : ["Size", "Color"]
  );

  // Variants Matrix
  const [variants, setVariants] = useState(initialData?.product_variants?.map((v: any) => ({
    attributes: v.attributes || {},
    stock_quantity: v.stock_quantity || 0,
    price: v.price || 0,
    image_url: v.image_url || ""
  })) || []);

  // 👉 NEW: The state for the Viewing Dropdown Filter
  const [variantFilter, setVariantFilter] = useState("");

  // Gets all unique attribute values (e.g., S, M, L, Black, White) across all variants
  const uniqueAttributeValues = Array.from(
    new Set(
      variants.flatMap((v: any) => Object.values(v.attributes).map((val: any) => String(val).trim()))
    )
  ).filter(Boolean) as string[];

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    setIsUploading(true);
    const supabase = createClient();
    const newImageUrls = [...images];

    for (const file of Array.from(e.target.files)) {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
      const filePath = `products/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('product-images')
        .upload(filePath, file);

      if (!uploadError) {
        const { data } = supabase.storage.from('product-images').getPublicUrl(filePath);
        newImageUrls.push(data.publicUrl);
      }
    }
    setImages(newImageUrls);
    setIsUploading(false);
  };

  const addOptionKey = () => setOptionKeys([...optionKeys, `Option ${optionKeys.length + 1}`]);
  const removeOptionKey = (index: number) => {
    const newKeys = optionKeys.filter((_, i) => i !== index);
    setOptionKeys(newKeys);
    const newVariants = variants.map((v: any) => {
      const newAttrs = { ...v.attributes };
      delete newAttrs[optionKeys[index]];
      return { ...v, attributes: newAttrs };
    });
    setVariants(newVariants);
  };

  const updateVariantAttribute = (vIndex: number, key: string, value: string) => {
    const newVariants = [...variants];
    newVariants[vIndex].attributes = { ...newVariants[vIndex].attributes, [key]: value };
    setVariants(newVariants);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    const supabase = createClient();
    const generatedSlug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    const basePrice = variants.length > 0 ? parseFloat(variants[0].price) || 0 : 0;

    const { data: parent, error: pErr } = await supabase.from("products").upsert({
      ...(productId ? { id: productId } : {}),
      name, slug: generatedSlug, price: basePrice, category, description, images, is_active: isActive 
    }).select().single();

    if (!pErr) {
      await supabase.from("product_variants").delete().eq("product_id", parent.id);
      
      if (variants.length > 0) {
        const formattedVariants = variants.map((v: any) => {
          const attrString = Object.values(v.attributes).join("-");
          const randomSuffix = Math.random().toString(36).substring(2, 6);
          const skuCode = `${generatedSlug}-${attrString}-${randomSuffix}`.toLowerCase().replace(/[^a-z0-9-]/g, "");

          return {
            product_id: parent.id,
            sku: skuCode,
            attributes: v.attributes, 
            stock_quantity: parseInt(v.stock_quantity) || 0,
            image_url: v.image_url || "",
            price: parseFloat(v.price) || 0
          };
        });
        await supabase.from("product_variants").insert(formattedVariants);
      }
      router.push("/admin/products");
      router.refresh();
    }
    setIsSaving(false);
  };

  return (
    <form onSubmit={handleSave} className="space-y-8 p-8 max-w-5xl mx-auto border border-zinc-200 dark:border-zinc-800 shadow-sm bg-white dark:bg-[#08080A]">

      {/* SECTION 1: IDENTITY */}
      <div className="space-y-4">
        <div className="flex justify-between items-center border-b border-zinc-100 pb-2">
          <h2 className="text-lg font-bold text-zinc-900 dark:text-white">1. Identity</h2>
          <select 
            className={`border px-3 py-1 text-xs font-bold uppercase tracking-widest rounded-none outline-none ${isActive ? 'bg-green-50 text-green-700 border-green-200' : 'bg-zinc-100 text-zinc-500 border-zinc-200'}`} 
            value={isActive ? "true" : "false"} 
            onChange={e => setIsActive(e.target.value === "true")}
          >
            <option value="true">Live (Active)</option>
            <option value="false">Hidden (Draft)</option>
          </select>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <Input value={name} onChange={e => setName(e.target.value)} placeholder="Product Name" className="rounded-none h-11" required />
          <select className="border px-3 rounded-none h-11 bg-transparent" value={category} onChange={e => setCategory(e.target.value)}>
            <option value="Men">Men</option>
            <option value="Women">Women</option>
            <option value="Unisex">Unisex</option>
          </select>
        </div>
        <textarea className="w-full p-3 border rounded-none min-h-[100px] bg-transparent outline-none" value={description} onChange={e => setDescription(e.target.value)} placeholder="Description..." />
      </div>

      {/* SECTION 2: DIRECT MEDIA UPLOAD */}
      <div className="space-y-4 p-4 border border-zinc-200 bg-zinc-50 dark:bg-[#0C0C10] rounded-none">
        <h2 className="text-lg font-bold">2. Upload Media</h2>
        <div className="flex items-center gap-4">
          <Input type="file" multiple accept="image/*" onChange={handleImageUpload} disabled={isUploading} className="max-w-xs cursor-pointer rounded-none bg-white" />
          {isUploading && <span className="text-xs font-mono text-zinc-500 animate-pulse">Uploading to Database...</span>}
        </div>
        
        {images.length > 0 && (
          <div className="flex flex-wrap gap-4 mt-4 pt-4 border-t border-zinc-200">
            {images.filter(Boolean).map((img, i) => (
              <div key={i} className="relative w-20 h-24 border border-zinc-200 rounded-none overflow-hidden group bg-white shadow-sm">
                <img src={img} alt={`Upload ${i}`} className="w-full h-full object-cover" />
                <button type="button" onClick={() => setImages(images.filter((_, idx) => idx !== i))} className="absolute top-1 right-1 bg-red-500 text-white rounded-none p-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* SECTION 3: DYNAMIC VARIANT BUILDER */}
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-zinc-100 pb-2">
          <h2 className="text-lg font-bold">3. Variant Matrix</h2>
          <Button type="button" variant="outline" size="sm" onClick={addOptionKey} className="rounded-none h-8 text-[10px] uppercase font-bold tracking-widest"><Plus className="w-3.5 h-3.5 mr-1"/> Add Attribute Column</Button>
        </div>

        <div className="flex gap-2 flex-wrap mb-4">
          {optionKeys.map((key, i) => (
            <div key={i} className="flex items-center border rounded-none overflow-hidden max-w-[150px] shadow-sm">
              <Input className="border-0 h-8 text-xs font-bold uppercase tracking-wider bg-zinc-100 rounded-none" value={key} onChange={e => {
                const newKeys = [...optionKeys]; newKeys[i] = e.target.value; setOptionKeys(newKeys);
              }} />
              <button type="button" onClick={() => removeOptionKey(i)} className="px-2 h-8 bg-zinc-100 text-zinc-400 hover:text-red-500 hover:bg-red-50 transition-colors"><X className="w-3 h-3"/></button>
            </div>
          ))}
        </div>

        {/* 👉 THE VIEWING FILTER DROPDOWN */}
        {variants.length > 0 && uniqueAttributeValues.length > 0 && (
          <div className="flex items-center gap-3 bg-zinc-50 p-2 border border-zinc-200 mb-4">
            <span className="text-xs font-bold uppercase tracking-widest text-zinc-500 pl-2">Filter View:</span>
            <select 
              className="h-8 px-2 border border-zinc-200 text-xs font-bold bg-white rounded-none outline-none focus:border-black cursor-pointer"
              value={variantFilter}
              onChange={(e) => setVariantFilter(e.target.value)}
            >
              <option value="">Show All Variants</option>
              {uniqueAttributeValues.map((val: string) => (
                <option key={val} value={val}>Only show: {val}</option>
              ))}
            </select>
          </div>
        )}

        <div className="space-y-2">
          {variants.map((v: any, i: number) => {
            
            // THE FILTER LOGIC: Hides rows that don't match your selection, without changing the array
            if (variantFilter) {
              const rowValues = Object.values(v.attributes).map(val => String(val).trim());
              if (!rowValues.includes(variantFilter)) return null;
            }

            return (
              <div key={i} className="flex flex-wrap gap-2 border border-zinc-200 p-2 pl-3 items-center bg-zinc-50 rounded-none group hover:border-zinc-400 transition-colors">
                
                {optionKeys.map(key => (
                  <Input 
                    key={key} 
                    className="w-24 placeholder:text-zinc-300 rounded-none h-9 text-xs bg-white" 
                    placeholder={key} 
                    value={v.attributes[key] || ""} 
                    onChange={e => updateVariantAttribute(i, key, e.target.value)} 
                  />
                ))}
                
                <Input className="w-20 rounded-none h-9 text-xs font-mono bg-white" type="number" placeholder="Stock" value={v.stock_quantity} onChange={e => { const nv = [...variants]; nv[i].stock_quantity = e.target.value; setVariants(nv); }} />
                <Input className="w-24 rounded-none h-9 text-xs font-mono bg-white" type="number" placeholder="Price" value={v.price} onChange={e => { const nv = [...variants]; nv[i].price = e.target.value; setVariants(nv); }} />
                
                <select className="flex-1 min-w-[150px] border px-2 rounded-none text-xs h-9 bg-white" value={v.image_url} onChange={e => { const nv = [...variants]; nv[i].image_url = e.target.value; setVariants(nv); }}>
                  <option value="">No Variant Image</option>
                  {images.map((img, idx) => (
                    <option key={idx} value={img}>Uploaded Image {idx + 1}</option>
                  ))}
                </select>

                <Button type="button" variant="ghost" size="icon" className="h-9 w-9 text-zinc-400 hover:text-red-600 hover:bg-red-50 rounded-none" onClick={() => setVariants(variants.filter((_: any, idx: number) => idx !== i))}><Trash2 className="w-4 h-4" /></Button>
              </div>
            );
          })}
        </div>
        
        <Button type="button" variant="outline" className="rounded-none h-10 w-full border-dashed border-2 hover:border-black text-xs uppercase tracking-widest font-bold" onClick={() => setVariants([...variants, { attributes: {}, stock_quantity: 0, price: 0, image_url: '' }])}>
          <Plus className="w-4 h-4 mr-2" /> Append Variant Row
        </Button>
      </div>

      <Button type="submit" disabled={isSaving || isUploading} className="w-full h-14 bg-black text-white hover:bg-zinc-800 rounded-none uppercase tracking-[0.2em] font-black">
        {isSaving ? "Transmitting to Database..." : "Commit Apparel Record"}
      </Button>
    </form>
  );
}