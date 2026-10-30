export const revalidate = 60;
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
      title: 'Product Unresolved | Zapatos Cave',
    }
  }

  // 1. Safely extract the first image URL, with a fallback just in case
  let ogImage = 'https://www.zapatoscave.com/icon.jpeg' 
  if (Array.isArray(product.images) && product.images.length > 0) {
    ogImage = typeof product.images[0] === 'string' ? product.images[0] : product.images[0].url
  }

  const description = product.short_description || product.description || 'Premium Performance Apparel'

  return {
    title: `${product.name} | Zapatos Cave`,
    description: description,
    openGraph: {
      title: product.name,
      description: description,
      url: `https://www.zapatoscave.com/shop/${slug}`,
      siteName: 'Zapatos Cave',
      type: 'website',
      images: [
        {
          url: ogImage,
          width: 800,   // WhatsApp strongly prefers dimensions to be explicitly stated
          height: 800,
          alt: product.name,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image', // Forces the big, full-width image preview
      title: product.name,
      description: description,
      images: [ogImage],
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

  const supabase = await createClient()
  const { data: variants } = await supabase
  .from('product_variants')
  // 👉 CHANGE THIS LINE to fetch 'attributes' instead of size/color/sleeve
  .select('id, sku, price, stock_quantity, attributes, image_url') 
  .eq('product_id', product.id)
  .order('sku', { ascending: true })

  return (
    <main className="min-h-screen bg-white dark:bg-[#08080A] pt-12 transition-colors duration-500">
      <ProductDisplay product={product as any} variants={variants as any || []} />
    </main>
  )
}