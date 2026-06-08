"use client"

import { useState, useMemo } from "react"
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

const SIZE_ORDER = ['S', 'M', 'L', 'XL', '2XL', '3XL', '4XL'];

export default function ProductDisplay({ product, variants }: { product: any; variants: any[] }) {
  const [isAdding, setIsAdding] = useState(false)
  const { addItem } = useCartStore();
  const router = useRouter()

  // 1. EXTRACT ALL OPTION CATEGORIES
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

  // 2. SET INITIAL SELECTIONS
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {};
    if (variants && variants.length > 0 && variants[0].attributes) {
      Object.entries(variants[0].attributes).forEach(([key, val]) => {
        initial[key] = val as string;
      });
    }
    return initial;
  });

  // 3. MATCH EXACT VARIANT
  const selectedVariant = useMemo(() => {
    return variants?.find(v => {
      if (!v.attributes) return false;
      return Object.entries(selectedOptions).every(([key, val]) => v.attributes[key] === val);
    });
  }, [selectedOptions, variants]);

  // 4. DYNAMIC IMAGE GALLERY LOGIC
  const displayImages = useMemo(() => {
    // Get all base images
    let imgs = (product.images || []).map(cleanImageUrl).filter(Boolean);
    const vImg = cleanImageUrl(selectedVariant?.image_url);

    // If a variant is selected and has a specific image, push it to the top of the stack
    if (vImg) {
      imgs = [vImg, ...imgs.filter((img: string) => img !== vImg)];
    }
    return imgs;
  }, [selectedVariant, product.images]);

  const handleAddToBag = () => {
    if (!selectedVariant || selectedVariant.stock_quantity <= 0) return;
    setIsAdding(true);
    addItem(product, 1, selectedOptions);
    router.push("/cart");
  };

  // HELPER: Sort options logically
  const sortOptions = (name: string, values: Set<string>) => {
    const arr = Array.from(values);
    if (name.toLowerCase() === 'size') {
      return arr.sort((a, b) => {
        const idxA = SIZE_ORDER.indexOf(a.toUpperCase());
        const idxB = SIZE_ORDER.indexOf(b.toUpperCase());
        if (idxA !== -1 && idxB !== -1) return idxA - idxB;
        if (idxA !== -1) return -1;
        if (idxB !== -1) return 1;
        return a.localeCompare(b);
      });
    }
    return arr.sort(); 
  };

  return (
    // Note the "items-start" here. This is crucial for the sticky right column to work.
    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-6xl mx-auto px-6 py-12 text-zinc-900 dark:text-zinc-100 items-start">
      
      {/* LEFT COLUMN: SCROLLABLE IMAGE GALLERY */}
      <div className="flex flex-col gap-6 w-full">
        {displayImages.length > 0 ? (
          displayImages.map((img: string, idx: number) => (
            <div key={idx} className="aspect-[3/4] bg-zinc-50 dark:bg-[#0C0C10] border border-zinc-100 dark:border-zinc-900 overflow-hidden relative">
              <img src={img} alt={`${product.name} - View ${idx + 1}`} className="w-full h-full object-cover" />
            </div>
          ))
        ) : (
          <div className="aspect-[3/4] bg-zinc-50 dark:bg-[#0C0C10] border border-zinc-100 dark:border-zinc-900 w-full flex items-center justify-center text-[10px] uppercase tracking-widest text-zinc-400">
            Loading Geometry
          </div>
        )}
      </div>

      {/* RIGHT COLUMN: STICKY PRODUCT DETAILS */}
      <div className="sticky top-28 space-y-10 h-fit pb-12">
        
        {/* 1. Title & Price */}
        <div className="space-y-2">
          <h1 className="text-3xl md:text-4xl font-black uppercase tracking-tighter">{product.name}</h1>
          <p className="text-lg font-bold">Ksh {selectedVariant?.price?.toLocaleString() || product.price?.toLocaleString()}</p>
        </div>

        <hr className="border-zinc-100 dark:border-zinc-900" />

        {/* 2. Attributes (Sizes/Colors) */}
        <div className="space-y-8">
          {Object.entries(optionGroups).map(([name, values]) => {
            const sortedValues = sortOptions(name, values);

            return (
              <div key={name} className="space-y-4">
                <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 dark:text-zinc-500">{name}</span>
                <div className="flex flex-wrap gap-2">
                  {sortedValues.map(val => {
                    const isActive = selectedOptions[name] === val;
                    const isAvailable = variants?.some(v => {
                      if (!v.attributes) return false;
                      const hypotheticalSelection = { ...selectedOptions, [name]: val };
                      const isMatch = Object.entries(hypotheticalSelection).every(([k, vVal]) => v.attributes[k] === vVal);
                      return isMatch && v.stock_quantity > 0;
                    });

                    return (
                      <button 
                        key={val}
                        onClick={() => setSelectedOptions(prev => ({ ...prev, [name]: val }))}
                        className={`px-6 py-3 border text-[10px] font-bold uppercase tracking-wider transition-all duration-300 
                          ${isActive 
                            ? 'bg-black text-white border-black dark:bg-white dark:text-black dark:border-white' 
                            : 'bg-transparent text-zinc-600 border-zinc-200 dark:text-zinc-400 dark:border-zinc-800 hover:border-zinc-400'
                          }
                          ${!isAvailable ? 'opacity-30 line-through decoration-2' : ''}
                        `}
                      >
                        {val}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* 3. Add to Bag */}
        <div className="pt-2">
          <Button 
            className={`w-full h-14 uppercase tracking-[0.25em] text-xs font-black rounded-none transition-transform active:scale-95 ${
              (!selectedVariant || selectedVariant.stock_quantity <= 0) ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            onClick={handleAddToBag}
            disabled={!selectedVariant || selectedVariant.stock_quantity <= 0 || isAdding}
          >
            {isAdding ? "Adding..." : (selectedVariant && selectedVariant.stock_quantity > 0) ? "Add to Bag" : "Sold Out"}
          </Button>
        </div>

        {/* 4. Description (Moved to Bottom) */}
        <div className="pt-8 border-t border-zinc-100 dark:border-zinc-900 mt-8">
          <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 dark:text-zinc-500 block mb-4">
            // Product Intel
          </span>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 font-light leading-relaxed whitespace-pre-wrap">
            {product.description}
          </p>
        </div>

      </div>
    </div>
  )
}