import { getProductsByCategory } from '@/lib/supabase/products'
import { BodyCareFilter } from '@/components/products/body-care-filter'

export const metadata = {
  title: 'Body Care | Zapatos',
  description: 'Explore our affordable luxury body care collection. Rituals from head to toe.',
}

export default async function BodyCarePage() {
  const products = await getProductsByCategory('bodycare')

  return (
    <div className="min-h-screen">
      {/* Header */}
      <section className="py-20 bg-zapatos-taupe/10">
        <div className="container mx-auto px-6 lg:px-12 text-center">
          <p className="text-sm uppercase tracking-[0.3em] text-zapatos-gold mb-4">
            Our Collection
          </p>
          <h1 className="text-5xl md:text-6xl font-serif font-light mb-6">
            Body Care
          </h1>
          <p className="text-lg text-zapatos-charcoal/80 editorial-spacing max-w-2xl mx-auto">
            Affordable luxury rituals from head to toe. Transform your daily routine
            into a moment of indulgence.
          </p>
        </div>
      </section>

      {/* Products + Filter */}
      <section className="py-16 container mx-auto px-6 lg:px-12">
        {products.length === 0 ? (
          <div className="text-center py-20">
            <h2 className="text-2xl font-serif mb-4">Coming Soon</h2>
            <p className="text-zapatos-charcoal/70 editorial-spacing">
              Our body care collection is being carefully curated. Check back soon!
            </p>
          </div>
        ) : (
          <BodyCareFilter products={products} />
        )}
      </section>
    </div>
  )
}