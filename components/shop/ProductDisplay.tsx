"use client"

import { useState, useEffect, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { useCartStore } from "@/lib/store/cart-store"
import { useRouter } from "next/navigation"

const cleanImageUrl = (imgData: any): string => {
  if (!imgData) return "";
  if (typeof imgData === 'object' && imgData !== null) return cleanImageUrl(imgData.url || imgData.image_url || "");
  if (typeof imgData === 'string') {
    return imgData.replace(/['"[\]]/g, '').replace('/render/image/public/', '/object/public/').trim();
  }
  return "";
};

export default function ProductDisplay({ product, variants }: { product: any; variants: any[] }) {
  const [isAdding, setIsAdding] = useState(false)
  const { addItem, openCart } = useCartStore();
  const [mainImage, setMainImage] = useState(cleanImageUrl(product.images?.[0] || ""));
const router = useRouter()

  // 1. DYNAMICALLY EXTRACT ALL OPTION CATEGORIES (e.g., Size, Color, Fit)
  const optionGroups = useMemo(() => {
    const groups: Record<string, Set<string>> = {};
    if (variants) {
      variants.forEach(v => {
        if (v.attributes) {
          Object.entries(v.attributes).forEach(([key, val]) => {
            if (typeof val === 'string' && val.trim() !== '') {
              if (!groups[key]) groups[key] = new Set();
              groups[key].add(val);
            }
          });
        }
      });
    }
    return groups;
  }, [variants]);

  // 2. DYNAMICALLY SET INITIAL SELECTIONS
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {};
    if (variants && variants.length > 0 && variants[0].attributes) {
      Object.entries(variants[0].attributes).forEach(([key, val]) => {
        initial[key] = val as string;
      });
    }
    return initial;
  });

  // 3. MATCH THE EXACT VARIANT BASED ON SELECTIONS
  const selectedVariant = useMemo(() => {
    return variants?.find(v => {
      if (!v.attributes) return false;
      // Check if every selected option matches this variant's JSON attributes
      return Object.entries(selectedOptions).every(([key, val]) => v.attributes[key] === val);
    });
  }, [selectedOptions, variants]);

  // Update Image when Variant Changes
  useEffect(() => {
    if (selectedVariant?.image_url) {
      setMainImage(cleanImageUrl(selectedVariant.image_url));
    } else if (product.images?.[0]) {
      setMainImage(cleanImageUrl(product.images[0]));
    }
  }, [selectedVariant, product.images]);

  const handleAddToBag = () => {
    if (!selectedVariant || selectedVariant.stock_quantity <= 0) return;
    setIsAdding(true);
    addItem(product, 1, selectedOptions);
    
    // Instantly redirect the user to the cart page!
    router.push("/cart");
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-6xl mx-auto px-6 py-12 text-zinc-900 dark:text-zinc-100">
      
      {/* IMAGE DISPLAY */}
      <div className="aspect-[3/4] bg-zinc-50 dark:bg-[#0C0C10] border border-zinc-100 dark:border-zinc-900 overflow-hidden relative">
        {mainImage ? (
          <img src={mainImage} alt={product.name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-[10px] uppercase tracking-widest text-zinc-400">Loading Geometry</div>
        )}
      </div>

      {/* PRODUCT DETAILS */}
      <div className="space-y-8 pt-4">
        <div className="space-y-2">
          <h1 className="text-3xl md:text-4xl font-black uppercase tracking-tighter">{product.name}</h1>
          <p className="text-lg font-bold">Ksh {selectedVariant?.price?.toLocaleString() || product.price?.toLocaleString()}</p>
        </div>

        <p className="text-sm text-zinc-500 dark:text-zinc-400 font-light leading-relaxed">
          {product.description}
        </p>

        <hr className="border-zinc-100 dark:border-zinc-900" />

        {/* DYNAMIC ATTRIBUTE SELECTORS */}
        <div className="space-y-6">
          {Object.entries(optionGroups).map(([name, values]) => (
            <div key={name} className="space-y-3">
              <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 dark:text-zinc-500">{name}</span>
              <div className="flex flex-wrap gap-2">
                {Array.from(values).map(val => {
                  const isActive = selectedOptions[name] === val;
                  return (
                    <button 
                      key={val}
                      onClick={() => setSelectedOptions(prev => ({ ...prev, [name]: val }))}
                      className={`px-6 py-3 border text-[10px] font-bold uppercase tracking-wider transition-all duration-300 ${
                        isActive 
                          ? 'bg-black text-white border-black dark:bg-white dark:text-black dark:border-white' 
                          : 'bg-transparent text-zinc-600 border-zinc-200 dark:text-zinc-400 dark:border-zinc-800 hover:border-zinc-400'
                      }`}
                    >
                      {val}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        <div className="pt-4">
          <Button 
            className={`w-full h-14 uppercase tracking-[0.25em] text-xs font-black rounded-none transition-transform active:scale-95 ${
              (!selectedVariant || selectedVariant.stock_quantity === 0) ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            onClick={handleAddToBag}
            disabled={!selectedVariant || selectedVariant.stock_quantity === 0 || isAdding}
          >
            {isAdding ? "Adding..." : selectedVariant?.stock_quantity > 0 ? "Add to Bag" : "Sold Out"}
          </Button>
        </div>
      </div>
    </div>
  )
}