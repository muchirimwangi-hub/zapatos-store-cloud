"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Upload, X } from "lucide-react" 
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { createClient } from "@/lib/supabase/client"
import { VariantBuilder } from "@/components/admin/VariantBuilder"

const cleanImageUrl = (imgData: any): string => {
  if (!imgData) return "";
  if (typeof imgData === 'object' && imgData !== null) {
    const targetUrl = imgData.url || imgData.image_url || "";
    return cleanImageUrl(targetUrl);
  }
  if (typeof imgData === 'string') {
    if (imgData.startsWith('[') || imgData.startsWith('{')) {
      try {
        const parsed = JSON.parse(imgData);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return cleanImageUrl(parsed[0]);
        }
        return cleanImageUrl(parsed);
      } catch {}
    }
    return imgData
      .replace(/['"[\]]/g, '') 
      .replace('/render/image/public/', '/object/public/')
      .trim();
  }
  return "";
};

interface ProductFormProps {
  initialData?: any;
}

export default function ProductForm({ initialData }: ProductFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [variants, setVariants] = useState<any[]>([])
  const [productImages, setProductImages] = useState<string[]>([]) 
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
    weight_kg: initialData?.weight_kg?.toString() || "0.3", // Added weight state tracking
    is_active: initialData?.is_active ?? true,
    is_featured: initialData?.is_featured ?? false,
  })

  useEffect(() => {
    if (initialData?.images) {
      let parsed = initialData.images;
      if (typeof parsed === 'string') {
        try { parsed = JSON.parse(parsed); } catch { }
      }
      if (Array.isArray(parsed)) {
        const cleanedUrls = parsed.map(img => cleanImageUrl(img)).filter(Boolean);
        setProductImages(cleanedUrls);
      } else if (parsed) {
        const singleUrl = cleanImageUrl(parsed);
        if (singleUrl) setProductImages([singleUrl]);
      }
    }
  }, [initialData]);

  useEffect(() => {
    if (initialData?.id) {
      const fetchVariants = async () => {
        const supabase = createClient();
        const { data, error: fetchError } = await supabase
          .from("product_variants")
          .select("*")
          .eq("product_id", initialData.id);
        
        if (fetchError) {
          console.error("Error fetching database variants:", fetchError.message);
          return;
        }

        if (data && data.length > 0) {
          const formatted = data.map(v => ({
            id: v.id,
            sku: v.sku,
            price: v.price ? v.price.toString() : form.price,
            stock: v.stock_quantity !== undefined ? v.stock_quantity.toString() : "0",
            option1: v.option1_name ? { name: v.option1_name, value: v.option1_value } : null,
            option2: v.option2_name ? { name: v.option2_name, value: v.option2_value } : null,
            option3: v.option3_name ? { name: v.option3_name, value: v.option3_value } : null,
            image_url: v.variant_image ? v.variant_image.replace(/['"]/g, '').replace('/render/image/public/', '/object/public/').trim() : null 
          }));
          setVariants(formatted);
        }
      };
      fetchVariants();
    }
  }, [initialData]);

  const compressImageBeforeUpload = (file: File): Promise<Blob | File> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target?.result as string;
        img.onload = () => {
          const canvas = document.createElement("canvas");
          let width = img.width;
          let height = img.height;
          const MAX_WIDTH = 1200;
          if (width > MAX_WIDTH) {
            height = Math.round((height * MAX_WIDTH) / width);
            width = MAX_WIDTH;
          }
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext("2d");
          ctx?.drawImage(img, 0, 0, width, height);
          canvas.toBlob((blob) => {
            if (blob) {
              resolve(new File([blob], file.name, { type: "image/jpeg" }));
            } else {
              resolve(file);
            }
          }, "image/jpeg", 0.82);
        };
      };
    });
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    setIsUploading(true);
    const supabase = createClient();
    const newUrls = [...productImages]; 

    for (let file of Array.from(files)) {
      const isVideo = file.type.startsWith("video/");
      if (!isVideo && file.type.startsWith("image/")) {
        file = (await compressImageBeforeUpload(file)) as File;
      }
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `products/${fileName}`;

      const { data, error: uploadError } = await supabase.storage
        .from('product-images')
        .upload(filePath, file, {
          contentType: file.type,
          cacheControl: '31536000', 
          upsert: false
        });

      if (uploadError) {
        alert(`Upload Error: ${uploadError.message}`);
        setIsUploading(false);
        return;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('product-images')
        .getPublicUrl(filePath);
        
      const directUrl = publicUrl.replace('/render/image/public/', '/object/public/');
      newUrls.push(directUrl);
    }
    
    setProductImages(newUrls); 
    setIsUploading(false);
  };

  const updateField = (field: string, value: string | boolean) => {
    setForm((prev) => {
      const nextForm = { ...prev, [field]: value };
      if (field === "name" && !initialData) {
        const baseSlug = (value as string)
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)/g, "");
        const randomSuffix = Math.random().toString(36).substring(2, 5);
        nextForm.slug = `${baseSlug}-${randomSuffix}`;
      }
      return nextForm;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    const supabase = createClient();
    const calculatedTotalStock = variants.reduce((sum, v) => sum + (parseInt(v.stock) || 0), 0);

    const payload = {
      name: form.name,
      slug: form.slug,
      description: form.description,
      short_description: form.short_description,
      price: parseFloat(form.price) || 0,
      compare_at_price: form.compare_at_price ? parseFloat(form.compare_at_price) : null,
      category: form.category.toLowerCase(),
      brand: form.brand,
      is_active: form.is_active,
      is_featured: form.is_featured,
      stock_quantity: calculatedTotalStock,
      weight_kg: parseFloat(form.weight_kg) || 0.3, // Saved directly to database row item
      images: productImages.map(url => ({ url })), 
    };

    let response;
    if (initialData?.id) {
      response = await supabase.from("products").update(payload).eq("id", initialData.id).select();
    } else {
      response = await supabase.from("products").insert([payload]).select();
    }

    if (response.error) {
      alert(`Database Save Error: ${response.error.message}`);
      setIsLoading(false);
      return;
    }

    const savedProduct = response.data?.[0];
    if (savedProduct && variants.length > 0) {
      if (initialData?.id) {
        await supabase.from("product_variants").delete().eq("product_id", savedProduct.id);
      }

      const variantsPayload = variants.map(v => {
        const skuParts = [savedProduct.slug];
        if (v.option1?.value) skuParts.push(v.option1.value);
        if (v.option2?.value) skuParts.push(v.option2.value);
        if (v.option3?.value) skuParts.push(v.option3.value);
        
        const uniqueGeneratedSku = skuParts.join("-").toLowerCase().replace(/\s+/g, "-");

        return {
          product_id: savedProduct.id,
          sku: v.sku || uniqueGeneratedSku,
          price: v.price && v.price !== "" ? parseFloat(v.price) : payload.price,
          stock_quantity: v.stock && v.stock !== "" ? parseInt(v.stock) : 0,
          option1_name: v.option1?.name || null,
          option1_value: v.option1?.value || null,
          option2_name: v.option2?.name || null,
          option2_value: v.option2?.value || null,
          option3_name: v.option3?.name || null,
          option3_value: v.option3?.value || null,
          variant_image: v.image_url || null 
        };
      });

      const { error: variantInsertError } = await supabase
        .from("product_variants")
        .insert(variantsPayload);

      if (variantInsertError) {
        console.error("Variant Insert System Error Details:", variantInsertError);
        alert(`Database rejected variants: ${variantInsertError.message}`);
        setIsLoading(false);
        return;
      }
    }

    router.push("/admin/products");
    router.refresh();
  };

  return (
    <div className="max-w-4xl mx-auto pb-20 space-y-8">
      {error && <div className="p-4 bg-red-50 text-red-700 border border-red-200">{error}</div>}
      
      <div className="bg-white p-8 border border-black/10 space-y-6">
        <h2 className="text-[10px] font-bold uppercase tracking-widest border-b pb-4">Product Specs</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Category</label>
            <select 
              className="w-full border border-black/10 h-11 px-3 text-[10px] uppercase font-bold tracking-widest rounded-none bg-white outline-none focus:border-black appearance-none"
              value={form.category}
              onChange={(e) => setForm({...form, category: e.target.value})}
            >
              {["Training", "Running", "Gym", "T-Shirts", "Shorts", "Outerwear", "Footwear"].map(cat => (
                <option key={cat} value={cat.toLowerCase()}>{cat}</option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase text-gray-400">URL Slug</label>
            <input value={form.slug} readOnly className="w-full border border-black/10 h-11 px-3 text-xs bg-gray-50 rounded-none text-gray-400 outline-none" />
          </div>
        </div>
        <div className="space-y-2">
          <label className="text-[10px] font-bold uppercase text-gray-400">Product Name</label>
          <Input value={form.name} onChange={(e) => updateField("name", e.target.value)} required className="rounded-none h-11" />
        </div>
        <div className="space-y-2">
          <label className="text-[10px] font-bold uppercase text-gray-400">Description</label>
          <textarea 
            className="w-full border border-black/10 p-3 text-sm min-h-[100px] outline-none focus:border-black rounded-none" 
            value={form.description}
            onChange={(e) => updateField("description", e.target.value)}
          />
        </div>
      </div>

      <div className="bg-white p-8 border border-black/10 space-y-6">
        <div className="flex justify-between items-center border-b border-black/5 pb-4">
          <h2 className="text-[10px] font-bold uppercase tracking-[0.3em]">Media Gallery</h2>
          <label className="cursor-pointer bg-black text-white px-6 py-3 text-[9px] font-bold uppercase tracking-widest hover:bg-zinc-800 transition-colors">
            {isUploading ? "Uploading..." : "Upload from Device"}
            <input type="file" multiple className="hidden" onChange={handleFileUpload} accept="image/*,video/*" disabled={isUploading} />
          </label>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {productImages.filter(url => url && url.trim() !== "").map((url, idx) => {
            const isVideoAsset = url.match(/\.(mp4|webm|mov|ogg)/i) || url.includes("video");
            return (
              <div key={idx} className="relative aspect-square border border-black/5 group bg-zinc-50">
                {isVideoAsset ? (
                  <video src={url} muted className="w-full h-full object-cover" />
                ) : (
                  <img src={url} className="w-full h-full object-cover" alt={`Gallery ${idx}`} />
                )}
                <button 
                  type="button"
                  onClick={() => setProductImages(productImages.filter((_, i) => i !== idx))}
                  className="absolute top-2 right-2 bg-white/90 p-1.5 opacity-0 group-hover:opacity-100 transition-opacity border border-black/5 hover:text-red-600"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            );
          })}
          {productImages.length === 0 && (
            <div className="col-span-full py-12 text-center border-2 border-dashed border-black/5 text-[9px] uppercase text-gray-400 tracking-[0.2em]">
              Select gear photos or videos to build your gallery.
            </div>
          )}
        </div>
      </div>

      {/* FIXED: Form entry matrix now explicitly splits base rates and total packaging unit weight variables */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-white p-8 border border-black/10">
         <div className="space-y-2">
           <label className="text-[10px] font-bold uppercase text-gray-400">Base Price (Ksh)</label>
           <Input type="number" value={form.price} onChange={(e) => updateField("price", e.target.value)} className="rounded-none h-11" />
         </div>
         <div className="space-y-2">
           <label className="text-[10px] font-bold uppercase text-gray-400">Unit Weight (Kg)</label>
           <Input type="number" step="0.01" value={form.weight_kg} onChange={(e) => updateField("weight_kg", e.target.value)} className="rounded-none h-11" />
         </div>
         <div className="space-y-2">
           <label className="text-[10px] font-bold uppercase text-gray-400">Calculated Stock</label>
           <Input type="number" value={form.stock_quantity} readOnly className="bg-gray-50 rounded-none h-11" />
         </div>
      </div>

      <VariantBuilder 
        onVariantsChange={(v) => setVariants(v)} 
        initialVariants={variants} 
        availableImages={productImages} 
      />

      <Button 
        onClick={handleSubmit}
        disabled={isLoading || isUploading} 
        className="w-full bg-black text-white h-16 uppercase tracking-[0.3em] font-bold text-xs rounded-none"
      >
        {isLoading ? "Synchronizing..." : initialData ? "Update Gear" : "Launch Product"}
      </Button>
    </div>
  )
}