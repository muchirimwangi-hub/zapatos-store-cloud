"use client"

import { useState, useEffect, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { ProductCard } from '@/components/products/product-card'
import { createClient } from '@/lib/supabase/client'
import { X, Search, SlidersHorizontal } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

function ShopCatalogContent() {
  const searchParams = useSearchParams()
  const initialQuery = searchParams.get('q') || ''
  const [products, setProducts] = useState<any[]>([])
  const [searchQuery, setSearchQuery] = useState(initialQuery)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [filteredProducts, setFilteredProducts] = useState<any[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const supabase = createClient()
        
        // Start building the query
        let query = supabase
          .from('products')
          .select('*, product_variants(*)') // Left JOIN ensures we check variant presence
          .order('created_at', { ascending: false })

        // If a category is selected (e.g. "Men" or "Women"), add the filter to the query!
        if (selectedCategory) {
          query = query.eq('category', selectedCategory);
        }

        // Execute the query
        const { data, error } = await query;

        if (error) {
          console.error('Database layout load error:', error)
          setProducts([])
          setFilteredProducts([])
        } else {
          // Safe validation: display items that aren't explicitly deactivated
          const verifiedItems = (data || []).filter((product: any) => product.is_active !== false)
          setProducts(verifiedItems)
          setFilteredProducts(verifiedItems)
        }
      } catch (error) {
        console.error('System inventory fetching failure:', error)
        setProducts([])
        setFilteredProducts([])
      }
    }

    fetchProducts()
  }, [selectedCategory])

  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredProducts(products)
      return
    }

    const filtered = products.filter(product => {
      const query = searchQuery.toLowerCase()
      const name = product.name?.toLowerCase() || ''
      const description = product.description?.toLowerCase() || ''
      const category = product.category?.toLowerCase() || ''
      
      return name.includes(query) || 
             description.includes(query) || 
             category.includes(query)
    })

    setFilteredProducts(filtered)
  }, [searchQuery, products])

  const clearSearch = () => {
    setSearchQuery('')
    setFilteredProducts(products)
    setIsSearchOpen(false)
    const params = new URLSearchParams(searchParams.toString())
    params.delete('q')
    window.history.pushState(null, '', `?${params.toString()}`)
  }

  return (
    <div className="min-h-screen bg-white dark:bg-[#08080A] text-zinc-900 dark:text-zinc-100 transition-colors duration-500 pt-20">
      
      {/* CATALOG FILTERS HEADER AREA */}
      <section className="py-16 border-b border-zinc-100 dark:border-zinc-900 bg-zinc-50/50 dark:bg-[#0C0C10]/30 transition-colors duration-500">
        <div className="max-w-6xl mx-auto px-6 lg:px-12 text-left space-y-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-2">
              <span className="text-[10px] font-mono text-zinc-400 dark:text-zinc-600 tracking-widest uppercase">SHOP ALL APPAREL</span>
              <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter text-zinc-950 dark:text-white">
                Our Collection
              </h1>
            </div>
            
            {/* COMPACT ACTIVEWEAR FILTERS AND SEARCH INJECTION BOX */}
            <div className="w-full md:w-auto flex items-center gap-4">
              <div className="relative flex-1 md:w-72">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-400 pointer-events-none" />
                <Input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
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
              <Button 
                type="button"
                variant="outline" 
                className="h-11 border-zinc-200 dark:border-zinc-900 rounded-none px-4 flex items-center gap-2 text-xs font-bold uppercase tracking-wider bg-white dark:bg-[#08080A]"
              >
                <SlidersHorizontal className="h-3.5 w-3.5 text-zinc-400" />
                Filter
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* CATALOG VIEWPORT ARRAY */}
      <section className="py-20 max-w-6xl mx-auto px-6 lg:px-12">
        
        {/* 👉 CATEGORY BUTTONS PLACED HERE 👈 */}
        <div className="flex gap-4 justify-center mb-12 border-b border-zinc-100 dark:border-zinc-900 pb-8">
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