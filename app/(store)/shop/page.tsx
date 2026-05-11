"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { ProductCard } from '@/components/products/product-card'
import { createClient } from '@/lib/supabase/client'
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function ShopPage() {
  const searchParams = useSearchParams()
  const initialQuery = searchParams.get('q') || ''
  const [products, setProducts] = useState<any[]>([])
  const [searchQuery, setSearchQuery] = useState(initialQuery)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [filteredProducts, setFilteredProducts] = useState<any[]>([])

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const supabase = createClient()
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .eq('is_active', true)
          .order('created_at', { ascending: false })

        if (error) {
          console.error('Error fetching products:', error)
          setProducts([])
          setFilteredProducts([])
        } else {
          setProducts(data || [])
          setFilteredProducts(data || [])
        }
      } catch (error) {
        console.error('Error fetching products:', error)
        setProducts([])
        setFilteredProducts([])
      }
    }

    fetchProducts()
  }, [])

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
    // Update URL without search query
    const params = new URLSearchParams(searchParams)
    params.delete('q')
    window.history.pushState(null, '', `?${params.toString()}`)
  }

  return (
    <div className="min-h-screen">
      {/* Header with Search */}
      <section className="py-20 bg-zapatos-taupe/10">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-serif font-light mb-6">
              Our Collection
            </h1>
            <p className="text-lg text-zapatos-charcoal/80 editorial-spacing max-w-2xl mx-auto mb-8">
  Explore our high-performance sportswear and minimalist gear, 
  meticulously engineered for the modern athlete.
</p>
            
            {/* Inline Search Bar */}
            <div className="max-w-2xl mx-auto relative">
              <div className={`relative transition-all duration-300 ${isSearchOpen ? 'w-full' : 'w-96'}`}>
                <Input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setIsSearchOpen(true)}
                  className="pr-10"
                />
                {searchQuery && (
                  <button
                    onClick={clearSearch}
                    className="absolute right-2 top-1/2 p-1 hover:bg-zapatos-taupe/20 rounded-full transition-colors"
                  >
                    <X className="h-4 w-4 text-zapatos-charcoal/50" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-16 container mx-auto px-6 lg:px-12">
        {filteredProducts.length === 0 ? (
          <div className="text-center py-20">
            <h2 className="text-2xl font-serif mb-4">No products found</h2>
            <p className="text-zapatos-charcoal/70 editorial-spacing">
              Try adjusting your search terms or browse our categories below.
            </p>
          </div>
        ) : (
          <>
            {searchQuery && (
              <p className="text-center text-zapatos-charcoal/70 mb-8">
                Found {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''} for "{searchQuery}"
              </p>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {filteredProducts.map((product, index) => (
                <ProductCard key={product.id} product={product} index={index} />
              ))}
            </div>
          </>
        )}
      </section>
    </div>
  )
}
