import { getProductBySlug } from '@/lib/supabase/products'
import { createStaticClient } from '@/lib/supabase/static'
import { notFound } from 'next/navigation'
import { ProductDetailClient } from '@/components/products/product-detail-client'
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
    description: product.meta_description || product.short_description || product.description,
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
  // Use static client for build-time generation (no cookies needed)
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

  return <ProductDetailClient product={product} />
}
