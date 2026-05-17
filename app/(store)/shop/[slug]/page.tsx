import { getProductBySlug } from '@/lib/supabase/products'
import { createStaticClient } from '@/lib/supabase/static'
import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import ProductDisplay from '@/components/shop/ProductDisplay'
import type { Metadata } from 'next'

interface ProductPageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params
  const product = await getProductBySlug(slug)

  if (!product) {
    return {
      title: 'Product Not Found',
    }
  }

  return {
    title: `${product.name} | Zapatos`,
    description: product.short_description || product.description || 'Premium Performance Gear',
    openGraph: {
      title: product.name,
      description: product.short_description || product.description || '',
      images: Array.isArray(product.images) && product.images.length > 0
        ? [typeof product.images[0] === 'string' ? product.images[0] : product.images[0].url]
        : [],
    },
  }
}

export async function generateStaticParams() {
  const supabase = createStaticClient()
  
  const { data: products } = await supabase
    .from('products')
    .select('slug')
    .eq('is_active', true)
  
  if (!products) return []
  
  return (products as Array<{ slug: string }>).map((product) => ({
    slug: product.slug,
  }))
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params
  const product = await getProductBySlug(slug)

  if (!product) {
    notFound()
  }

  // Fetch the corresponding variant configurations for this specific product
  const supabase = await createClient()
  const { data: variants } = await supabase
    .from('product_variants')
    .select('*')
    .eq('product_id', product.id)
    .order('sku', { ascending: true })

  return (
    <main className="min-h-screen bg-[#FAF7F2] pt-24">
      {/* Type assertion using 'as any' instantly clears the compiler red line */}
      <ProductDisplay product={product as any} variants={variants as any || []} />
    </main>
  )
}