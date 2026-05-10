import { getProductsByCategory } from '@/lib/supabase/products'
import { ProductCard } from '@/components/products/product-card'

export const metadata = {
  title: 'Fragrances | Zapatos',
  description: 'Discover our collection of affordable luxury fragrances. Artisanal scents that tell your story.',
}

export default async function FragrancePage() {
  const products = await getProductsByCategory('fragrance')

  return (
    <div className="min-h-screen">
      {/* Header */}
      <section className="py-20 bg-zapatos-taupe/10">
        <div className="container mx-auto px-6 lg:px-12 text-center">
          <p className="text-sm uppercase tracking-[0.3em] text-zapatos-gold mb-4">
            Our Collection
          </p>
          <h1 className="text-5xl md:text-6xl font-serif font-light mb-6">
            Fragrances
          </h1>
          <p className="text-lg text-zapatos-charcoal/80 editorial-spacing max-w-2xl mx-auto">
            Artisanal scents that tell your story. Each fragrance is crafted with 
            precision and inspired by life&apos;s most memorable moments.
          </p>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-16 container mx-auto px-6 lg:px-12">
        {products.length === 0 ? (
          <div className="text-center py-20">
            <h2 className="text-2xl font-serif mb-4">Coming Soon</h2>
            <p className="text-zapatos-charcoal/70 editorial-spacing">
              Our fragrance collection is being carefully curated. Check back soon!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {products.map((product, index) => (
              <ProductCard key={product.id} product={product} index={index} />
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
