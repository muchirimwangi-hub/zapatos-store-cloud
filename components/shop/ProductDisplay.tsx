"use client"

import { useState, useMemo, useEffect } from "react"

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

interface Variant {
  id: string;
  sku: string;
  price: number;
  stock_quantity: number;
  option1_name: string | null;
  option1_value: string | null;
  option2_name: string | null;
  option2_value: string | null;
  option3_name: string | null;
  option3_value: string | null;
  variant_image: string | null;
}

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  images: any;
}

export default function ProductDisplay({ product, variants }: { product: Product; variants: Variant[] }) {
  // Premium micro-interaction states for the button
  const [isAdding, setIsAdding] = useState(false)
  const [addedSuccess, setAddedSuccess] = useState(false)

  const galleryImages = useMemo(() => {
    let rawImages = product.images;
    if (typeof rawImages === 'string') {
      try { rawImages = JSON.parse(rawImages); } catch { rawImages = []; }
    }
    if (!Array.isArray(rawImages)) return [];
    return rawImages.map(img => cleanImageUrl(img)).filter(Boolean);
  }, [product.images]);

  const [mainImage, setMainImage] = useState<string>(galleryImages[0] || "");

  const optionGroups = useMemo(() => {
    const groups: { [key: string]: Set<string> } = {};
    variants.forEach(v => {
      if (v.option1_name && v.option1_value) {
        if (!groups[v.option1_name]) groups[v.option1_name] = new Set();
        groups[v.option1_name].add(v.option1_value);
      }
      if (v.option2_name && v.option2_value) {
        if (!groups[v.option2_name]) groups[v.option2_name] = new Set();
        groups[v.option2_name].add(v.option2_value);
      }
    });
    
    const sizeHierarchy = ["XS", "S", "M", "L", "XL", "XXL", "XXXL"];

    return Object.keys(groups).reduce((acc, key) => {
      const sortedValues = Array.from(groups[key]);

      if (key.toLowerCase().includes("size")) {
        sortedValues.sort((a, b) => {
          const indexA = sizeHierarchy.indexOf(a.toUpperCase());
          const indexB = sizeHierarchy.indexOf(b.toUpperCase());
          if (indexA === -1 && indexB === -1) return a.localeCompare(b);
          if (indexA === -1) return 1;
          if (indexB === -1) return -1;
          return indexA - indexB;
        });
      }

      acc[key] = sortedValues;
      return acc;
    }, {} as { [key: string]: string[] });
  }, [variants]);

  const [selectedOptions, setSelectedOptions] = useState<{ [key: string]: string }>(() => {
    const defaults: { [key: string]: string } = {};
    Object.keys(optionGroups).forEach(key => {
      defaults[key] = optionGroups[key][0] || "";
    });
    return defaults;
  });

  const selectedVariant = useMemo(() => {
    return variants.find(v => {
      const match1 = !v.option1_name || selectedOptions[v.option1_name] === v.option1_value;
      const match2 = !v.option2_name || selectedOptions[v.option2_name] === v.option2_value;
      return match1 && match2;
    });
  }, [selectedOptions, variants]);

  useEffect(() => {
    if (selectedVariant?.variant_image) {
      setMainImage(cleanImageUrl(selectedVariant.variant_image));
    }
  }, [selectedVariant]);

  const handleOptionChange = (optionName: string, value: string) => {
    setSelectedOptions(prev => ({ ...prev, [optionName]: value }));
  };

  const currentPrice = selectedVariant ? selectedVariant.price : product.price;
  
  // Guard clause defaults to true if a base product has no specific variant rows loaded
  const isAvailable = variants.length > 0 
    ? (selectedVariant ? selectedVariant.stock_quantity > 0 : false)
    : true;

  // Handles adding the product with active variants to the cart layout
  const handleAddToBag = () => {
    if (!isAvailable || isAdding) return;
    
    setIsAdding(true);

    const itemPayload = {
      productId: product.id,
      variantId: selectedVariant?.id || null,
      name: product.name,
      sku: selectedVariant?.sku || `zapatos-${product.id}`,
      price: currentPrice,
      image: mainImage,
      selectedOptions: selectedOptions,
      quantity: 1
    };

    // 1. Fires a global document event so your Zustand cart drawer handles or side-bars open natively
    window.dispatchEvent(new CustomEvent("zapatos-add-to-cart", { detail: itemPayload }));

    // 2. Triggers the sleek UI completion check animation
    setTimeout(() => {
      setIsAdding(false);
      setAddedSuccess(true);
      setTimeout(() => setAddedSuccess(false), 1800);
    }, 600);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-16 max-w-6xl mx-auto px-6 py-12">
      <div className="space-y-4">
        <div className="aspect-[3/4] bg-zinc-50 overflow-hidden border border-black/5 relative">
          {mainImage ? (
            mainImage.match(/\.(mp4|webm|mov|ogg)/i) || mainImage.includes("video") ? (
              <video src={mainImage} autoPlay muted loop playsInline className="w-full h-full object-cover" />
            ) : (
              <img src={mainImage} className="w-full h-full object-cover transition-all duration-500" alt="" />
            )
          ) : (
            <div className="w-full h-full flex items-center justify-center text-[10px] uppercase tracking-widest text-zinc-400">Loading Geometry</div>
          )}
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2">
          {galleryImages.map((img, index) => {
            const isThumbVideo = img.match(/\.(mp4|webm|mov|ogg)/i) || img.includes("video");
            return (
              <button key={index} onClick={() => setMainImage(img)} className={`w-16 h-20 border bg-zinc-50 flex-shrink-0 relative ${mainImage === img ? 'border-black' : 'border-black/5'}`}>
                {isThumbVideo ? (
                  <div className="w-full h-full bg-zinc-900 flex items-center justify-center text-[8px] font-bold text-white uppercase tracking-tighter">Video</div>
                ) : (
                  <img src={img} className="w-full h-full object-cover" alt="" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex flex-col justify-start space-y-8 pt-4">
        <div className="space-y-2">
          <h1 className="text-xl font-normal tracking-tight uppercase text-zinc-900">{product.name}</h1>
          <p className="text-sm font-medium text-zinc-500">Ksh {currentPrice.toLocaleString()}</p>
        </div>

        <hr className="border-black/5" />

        <div className="space-y-6">
          {Object.entries(optionGroups).map(([optionName, values]) => (
            <div key={optionName} className="space-y-2">
              <span className="text-[9px] font-bold uppercase tracking-widest text-zinc-400">{optionName}</span>
              <div className="flex flex-wrap gap-2">
                {values.map(value => {
                  const active = selectedOptions[optionName] === value;
                  return (
                    <button
                      key={value}
                      onClick={() => handleOptionChange(optionName, value)}
                      className={`px-4 py-2 text-[10px] uppercase font-bold tracking-wider transition-all border ${
                        active 
                          ? 'border-black bg-black text-white' 
                          : 'border-zinc-200 text-zinc-800 hover:border-black'
                      }`}
                    >
                      {value}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        <div className="space-y-4 pt-4">
          <button
            onClick={handleAddToBag}
            disabled={!isAvailable || isAdding || addedSuccess}
            className={`w-full h-14 uppercase text-[10px] tracking-[0.3em] font-bold transition-all border ${
              addedSuccess
                ? 'bg-zinc-900 text-green-400 border-zinc-900'
                : isAvailable 
                  ? 'bg-black text-white hover:bg-zinc-900 border-black' 
                  : 'bg-zinc-100 text-zinc-400 cursor-not-allowed border-zinc-200'
            }`}
          >
            {addedSuccess ? "Added to Bag ✓" : isAdding ? "Adding..." : isAvailable ? "Add to Bag" : "Sold Out"}
          </button>
        </div>

        <p className="text-xs leading-relaxed text-zinc-600 font-light whitespace-pre-line">{product.description}</p>
      </div>
    </div>
  )
}