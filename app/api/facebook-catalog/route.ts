import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET() {
  const supabase = await createClient()

  // 1. Fetch active products and their stock levels
  const { data: products } = await supabase
    .from('products')
    .select(`
      id,
      name,
      description,
      slug,
      price,
      images,
      product_variants ( stock_quantity )
    `)
    .eq('is_active', true)

  if (!products) return new NextResponse('No products found', { status: 404 })

  const baseUrl = 'https://zapatoscave.com'

  // 2. Start building the XML wrapper
  let xml = `<?xml version="1.0" encoding="UTF-8"?>
  <rss xmlns:g="http://base.google.com/ns/1.0" version="2.0">
  <channel>
    <title>Zapatos Cave Catalog</title>
    <link>${baseUrl}</link>
    <description>Premium Performance Apparel</description>`

  // 3. Loop through your products and map them to Facebook's required tags
  products.forEach((product) => {
    // Check if it's in stock by adding up variant quantities
    const totalStock = product.product_variants?.reduce((sum, v) => sum + (v.stock_quantity || 0), 0) || 0
    const availability = totalStock > 0 ? 'in stock' : 'out of stock'

    // Grab the first image cleanly
    const imageUrl = product.images && product.images.length > 0
      ? (typeof product.images[0] === 'string' ? product.images[0] : product.images[0].url)
      : `${baseUrl}/placeholder.jpg` // Fallback if no image

    xml += `
    <item>
      <g:id>${product.id}</g:id>
      <g:title><![CDATA[${product.name}]]></g:title>
      <g:description><![CDATA[${product.description || product.name}]]></g:description>
      <g:link>${baseUrl}/shop/${product.slug}</g:link>
      <g:image_link>${imageUrl}</g:image_link>
      <g:brand>Zapatos Cave</g:brand>
      <g:condition>new</g:condition>
      <g:availability>${availability}</g:availability>
      <g:price>${product.price} KES</g:price>
    </item>`
  })

  // 4. Close the XML tags
  xml += `
  </channel>
  </rss>`

  // 5. Send it back as a proper XML file
  return new NextResponse(xml, {
    headers: {
      'Content-Type': 'application/xml',
      // Tell Vercel to cache this for 1 hour so Facebook doesn't hammer your database
      'Cache-Control': 's-maxage=3600, stale-while-revalidate', 
    },
  })
}