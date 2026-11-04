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
    
    // 👉 IN-HOUSE COMPRESSION: Tell Supabase to compress it on the fly for WhatsApp
    if (ogImage.includes('/object/public/')) {
      ogImage = ogImage.replace('/object/public/', '/render/image/public/') + '?width=800&height=800&quality=70&resize=contain'
    }
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

  // 1. Fetch current product's variants
  const { data: variants } = await supabase
    .from('product_variants')
    .select('*')
    .eq('product_id', product.id)
    .order('sku', { ascending: true })

  // 2. Fetch ALL product variants in the database so we can instantly resolve parent stock locally!
  const { data: allVariants } = await supabase
    .from('product_variants')
    .select('id, stock_quantity')

  // 3. Map the parent stock directly onto the variants in memory
  const enrichedVariants = (variants || []).map((v: any) => {
    if (v.bundle_parent_id && allVariants) {
      const parentMatch = allVariants.find((pv: any) => pv.id === v.bundle_parent_id);
      return {
        ...v,
        parent: parentMatch ? [parentMatch] : []
      };
    }
    return v;
  });

  return (
    <main className="min-h-screen bg-white dark:bg-[#08080A] pt-12 transition-colors duration-500">
      <ProductDisplay product={product as any} variants={enrichedVariants as any} />
    </main>
  )
}