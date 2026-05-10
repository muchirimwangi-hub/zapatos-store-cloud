'use client'

import { useState } from 'react'
import { ProductCard } from '@/components/products/product-card'
import type { Product } from '@/lib/types/product'

const SUBCATEGORIES = [
  'All',
  'Body Washes',
  'Body Creams and Oils',
  'Cleansing Essentials',
  'Body Scrubs',
] as const

export function BodyCareFilter({ products }: { products: Product[] }) {
  const [active, setActive] = useState<string>('All')

  const filtered =
    active === 'All'
      ? products
      : products.filter(
          (p) => p.subcategory?.toLowerCase().trim() === active.toLowerCase().trim()
        )

  return (
    <div>
      {/* Filter Tabs */}
      <div className="flex flex-wrap justify-center gap-3 mb-12">
        {SUBCATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setActive(cat)}
            className={`px-5 py-2 text-sm uppercase tracking-widest border transition-all duration-200 ${
              active === cat
                ? 'bg-zapatos-gold text-white border-zapatos-gold'
                : 'bg-transparent text-zapatos-charcoal border-zapatos-charcoal/30 hover:border-zapatos-gold hover:text-zapatos-gold'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Products Grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-zapatos-charcoal/60 editorial-spacing">
            No products in this category yet. Check back soon!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filtered.map((product, index) => (
            <ProductCard key={product.id} product={product} index={index} />
          ))}
        </div>
      )}
    </div>
  )
}