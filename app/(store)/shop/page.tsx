"use client"

import { useState, useEffect, Suspense, useMemo } from "react"
import { useSearchParams } from "next/navigation"
import { ProductCard } from '@/components/products/product-card'
import { createClient } from '@/lib/supabase/client'
import { X, Search, SlidersHorizontal } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"

function ShopCatalogContent() {
  const searchParams = useSearchParams()
  const initialQuery = searchParams.get('q') || ''
  const [products, setProducts] = useState<any[]>([])
  const [searchQuery, setSearchQuery] = useState(initialQuery)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [filteredProducts, setFilteredProducts] = useState<any[]>([])
  // --- NEW ATTRIBUTE FILTER STATE ---
  const [selectedAttributes, setSelectedAttributes] = useState<Record<string, string[]>>({})

  // Extract all unique attributes (Sizes, Colors, etc.) from the fetched inventory
  const availableAttributes = useMemo(() => {
    const attrs: Record<string, Set<string>> = {}
    products.forEach(p => {
      p.product_variants?.forEach((v: any) => {
        if (v.attributes) {
          Object.entries(v.attributes).forEach(([key, val]) => {
            if (!attrs[key]) attrs[key] = new Set()
            attrs[key].add(val as string)
          })
        }
      })
    })
    return attrs
  }, [products])

  const toggleAttribute = (key: string, value: string) => {
    setSelectedAttributes(prev => {
      const current = prev[key] || []
      const updated = current.includes(value)
        ? current.filter(v => v !== value)
        : [...current, value]

      if (updated.length === 0) {
        const newState = { ...prev }
        delete newState[key]
        return newState
      }
      return { ...prev, [key]: updated }
    })
  }
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value
    setSearchQuery(val)
    
    // Update the URL silently as they type
    const params = new URLSearchParams(searchParams.toString())
    if (val.trim()) {
      params.set('q', val)
    } else {
      params.delete('q')
    }
    window.history.replaceState(null, '', `?${params.toString()}`)
  }
  const [selectedCategory, setSelectedCategory] = useState<string | null>(() => {
    const cat = searchParams.get('category');
    return cat ? cat.charAt(0).toUpperCase() + cat.slice(1) : null;
  });

  // 2. Sync state if the user clicks a nav link while already on the shop page
  useEffect(() => {
    const cat = searchParams.get('category');
    setSelectedCategory(cat ? cat.charAt(0).toUpperCase() + cat.slice(1) : null);
  }, [searchParams]);

  // FIX 3 Part A: We now fetch ALL products exactly ONCE on page load (much faster)
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const supabase = createClient()
        
        const { data, error } = await supabase
          .from('products')
          .select('*, product_variants(*)') 
          .order('created_at', { ascending: false })

        if (error) {
          console.error('Database layout load error:', error)
          setProducts([])
        } else {
          const verifiedItems = (data || []).filter((product: any) => product.is_active !== false)
          setProducts(verifiedItems)
        }
      } catch (error) {
        console.error('System inventory fetching failure:', error)
        setProducts([])
      }
    }

    fetchProducts()
  }, []) // Removed selectedCategory from dependencies!

  // FIX 3 Part B: Apply Category, Search, AND Attribute filters
  useEffect(() => {
    let result = products;

    // 1. Smart Category Filter
    if (selectedCategory) {
      if (selectedCategory === "Men") {
        result = result.filter(p => ['men', 'unisex'].includes(p.category?.toLowerCase()));
      } else if (selectedCategory === "Women") {
        result = result.filter(p => ['women', 'unisex'].includes(p.category?.toLowerCase()));
      } else if (selectedCategory === "Unisex") {
        result = result.filter(p => p.category?.toLowerCase() === 'unisex');
      } else if (selectedCategory === "Compression") {
        // Catches any product with "compression" in its name
        result = result.filter(p => p.name?.toLowerCase().includes('compression'));
      } else if (selectedCategory === "Tracksuits") {
        // Catches both "tracksuit" and "tracksuits" in the name
        result = result.filter(p => p.name?.toLowerCase().includes('tracksuit'));
      }
    }

    // 2. Search Box Filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(p => 
        p.name?.toLowerCase().includes(query) || 
        p.description?.toLowerCase().includes(query) || 
        p.category?.toLowerCase().includes(query)
      );
    }

    // 3. Attribute Filter (Sizes, Colors, etc.)
    if (Object.keys(selectedAttributes).length > 0) {
      result = result.filter(p => {
        // A product must satisfy ALL active filter categories (e.g., must be 'Blue' AND 'XL')
        return Object.entries(selectedAttributes).every(([attrKey, selectedValues]) => {
          if (selectedValues.length === 0) return true;
          // Check if the product has at least one variant matching the selected attribute value
          return p.product_variants?.some((v: any) =>
            v.attributes && selectedValues.includes(v.attributes[attrKey])
          );
        });
      });
    }

    setFilteredProducts(result);
  }, [searchQuery, selectedCategory, products, selectedAttributes])

  const clearSearch = () => {
    setSearchQuery('')
    setIsSearchOpen(false)
    const params = new URLSearchParams(searchParams.toString())
    params.delete('q')
    window.history.pushState(null, '', `?${params.toString()}`)
  }

  return (
    <div className="min-h-screen bg-white dark:bg-[#08080A] text-zinc-900 dark:text-zinc-100 transition-colors duration-500 pt-20">
      
      <section className="py-16 border-b border-zinc-100 dark:border-zinc-900 bg-zinc-50/50 dark:bg-[#0C0C10]/30 transition-colors duration-500">
        <div className="max-w-6xl mx-auto px-6 lg:px-12 text-left space-y-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-2">
              <span className="text-[10px] font-mono text-zinc-400 dark:text-zinc-600 tracking-widest uppercase">SHOP ALL APPAREL</span>
              <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter text-zinc-950 dark:text-white">
                Our Collection
              </h1>
            </div>
            
            <div className="w-full md:w-auto flex items-center gap-4">
              <div className="relative flex-1 md:w-72">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-400 pointer-events-none" />
                <Input
  type="text"
  placeholder="Search products..."
  value={searchQuery}
  onChange={handleSearchChange}
  onFocus={() => setIsSearchOpen(true)}
  className="pl-10 pr-10 h-11 bg-white dark:bg-[#08080A] border-zinc-200 dark:border-zinc-900 text-xs uppercase tracking-wider rounded-none font-medium focus-visible:ring-zinc-400"
/>
                {searchQuery && (
                  <button
                    onClick={clearSearch}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-zinc-400 hover:text-zinc-950 dark:hover:text-white transition-colors"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>
              <Sheet>
                <SheetTrigger asChild>
                  <Button 
                    type="button"
                    variant="outline" 
                    className="h-11 border-zinc-200 dark:border-zinc-900 rounded-none px-4 flex items-center gap-2 text-xs font-bold uppercase tracking-wider bg-white dark:bg-[#08080A] relative"
                  >
                    <SlidersHorizontal className="h-3.5 w-3.5 text-zinc-400" />
                    Filter
                    {Object.keys(selectedAttributes).length > 0 && (
                      <span className="absolute -top-2 -right-2 h-4 w-4 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-full flex items-center justify-center text-[9px] font-bold">
                        {Object.values(selectedAttributes).flat().length}
                      </span>
                    )}
                  </Button>
                </SheetTrigger>
                <SheetContent className="bg-white dark:bg-[#08080A] border-zinc-200 dark:border-zinc-900 rounded-none overflow-y-auto w-full sm:max-w-md p-8">
                  <SheetHeader className="mb-8 border-b border-zinc-100 dark:border-zinc-900 pb-6">
                    <div className="text-[10px] font-mono tracking-widest text-zinc-400 uppercase">Refine Search</div>
                    <SheetTitle className="text-2xl font-black uppercase tracking-tight text-zinc-900 dark:text-white">Filter Parameters</SheetTitle>
                  </SheetHeader>
                  
                  <div className="space-y-8">
                    {Object.keys(availableAttributes).length === 0 ? (
                      <p className="text-xs font-mono text-zinc-400 uppercase">No attributes available.</p>
                    ) : (
                      Object.entries(availableAttributes).map(([key, valuesSet]) => (
                        <div key={key} className="space-y-3">
                          <h3 className="text-[11px] font-mono font-bold tracking-widest uppercase text-zinc-900 dark:text-white">{key}</h3>
                          <div className="flex flex-wrap gap-2">
                            {Array.from(valuesSet).map(val => {
                              const isSelected = selectedAttributes[key]?.includes(val);
                              return (
                                <button
                                  key={val}
                                  onClick={() => toggleAttribute(key, val)}
                                  className={`px-4 py-2 text-xs font-bold uppercase tracking-wider border rounded-none transition-all ${
                                    isSelected 
                                      ? 'bg-zinc-900 text-white border-zinc-900 dark:bg-white dark:text-zinc-900' 
                                      : 'bg-transparent text-zinc-600 border-zinc-200 hover:border-zinc-900 dark:border-zinc-800 dark:text-zinc-400 dark:hover:border-white'
                                  }`}
                                >
                                  {val}
                                </button>
                              )
                            })}
                          </div>
                        </div>
                      ))
                    )}

                    {Object.keys(selectedAttributes).length > 0 && (
                      <div className="pt-8 border-t border-zinc-100 dark:border-zinc-900">
                        <Button 
                          onClick={() => setSelectedAttributes({})} 
                          variant="outline" 
                          className="w-full h-12 rounded-none uppercase text-xs tracking-widest font-bold border-zinc-200 dark:border-zinc-800"
                        >
                          Clear All Filters
                        </Button>
                      </div>
                    )}
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 max-w-6xl mx-auto px-6 lg:px-12">
        
        {/* FIX 3 Part C: Added the Unisex Button */}
        <div className="flex gap-4 justify-center mb-12 border-b border-zinc-100 dark:border-zinc-900 pb-8 flex-wrap">
          <Button 
            variant={selectedCategory === null ? "default" : "outline"} 
            onClick={() => setSelectedCategory(null)}
            className="rounded-none uppercase tracking-widest text-xs font-bold px-8"
          >
            All
          </Button>
          <Button 
            variant={selectedCategory === "Men" ? "default" : "outline"} 
            onClick={() => setSelectedCategory("Men")}
            className="rounded-none uppercase tracking-widest text-xs font-bold px-8"
          >
            Men
          </Button>
          <Button 
            variant={selectedCategory === "Women" ? "default" : "outline"} 
            onClick={() => setSelectedCategory("Women")}
            className="rounded-none uppercase tracking-widest text-xs font-bold px-8"
          >
            Women
          </Button>
          <Button 
            variant={selectedCategory === "Unisex" ? "default" : "outline"} 
            onClick={() => setSelectedCategory("Unisex")}
            className="rounded-none uppercase tracking-widest text-xs font-bold px-8"
          >
            Unisex
          </Button>
        </div>

        {filteredProducts.length === 0 ? (
          <div className="text-center py-24 border border-zinc-100 dark:border-zinc-900 bg-zinc-50/50 dark:bg-[#0C0C10]/20">
            <h2 className="text-sm font-black uppercase tracking-wider text-zinc-950 dark:text-white">No products located</h2>
            <p className="text-xs text-zinc-400 dark:text-zinc-500 font-light mt-2 max-w-xs mx-auto leading-relaxed">
              Adjust your filter parameters or search expressions to view available inventory layers.
            </p>
          </div>
        ) : (
          <div className="space-y-12">
            {searchQuery && (
              <p className="text-xs font-mono text-zinc-400 dark:text-zinc-600 uppercase tracking-widest text-left">
                Indexed {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''} under lookup query &quot;{searchQuery}&quot;
              </p>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-16">
              {filteredProducts.map((product, index) => (
                <ProductCard key={product.id} product={product} index={index} />
              ))}
            </div>
          </div>
        )}
      </section>
    </div>
  )
}

export default function ShopPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-white dark:bg-[#08080A] flex items-center justify-center font-mono text-[10px] uppercase tracking-[0.3em] text-zinc-400">
        Initializing Inventory...
      </div>
    }>
      <ShopCatalogContent />
    </Suspense>
  )
}