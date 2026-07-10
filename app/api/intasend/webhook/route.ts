import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  try {
    const payload = await request.json()
    
    // IntaSend sends various event states; we only care when a charge is fully captured
    const state = payload.state || payload.status
    const challenge = payload.challenge // Used by IntaSend to verify endpoint ownership
    
    // 1. Respond to IntaSend's initial URL verification challenge if present
    if (challenge) {
      return NextResponse.json({ challenge })
    }

    // 2. Process Successful Transactions
    if (state === 'COMPLETE' || state === 'SUCCESSFUL' || payload.event === 'CHARGE_COMPLETED') {
      const invoiceId = payload.invoice_id || payload.id
      const amount = Number(payload.value || payload.amount || 0)
      const email = payload.email || payload.customer?.email
      const phone = payload.phone_number || payload.customer?.phone_number
      const apiRef = payload.api_ref // We passed this from the frontend button!

      console.log(`[IntaSend Webhook] Payment verified for Invoice ${invoiceId}. Amount: KES ${amount}`)

      const supabase = await createClient()

      // 3. Prevent Duplicate Processing (Check if order already logged)
      const { data: existingOrder } = await supabase
        .from('orders')
        .select('id')
        .eq('payment_reference', String(invoiceId))
        .single()

      if (existingOrder) {
        console.log(`[IntaSend Webhook] Order for Invoice ${invoiceId} already processed. Skipping.`)
        return NextResponse.json({ received: true, status: 'already_processed' })
      }

      // 4. Retrieve the Customer's Trapped Cart Data from the Shadow Table
      // We try matching by the email or phone captured during checkout
      let cartQuery = supabase.from('abandoned_carts').select('*').eq('status', 'abandoned')
      if (email) {
        cartQuery = cartQuery.eq('email', email)
      } else if (phone) {
        cartQuery = cartQuery.eq('phone', phone)
      }
      
      const { data: abandonedCarts } = await cartQuery.order('last_active', { ascending: false }).limit(1)
      const matchedCart = abandonedCarts && abandonedCarts.length > 0 ? abandonedCarts[0] : null

      if (!matchedCart) {
        console.error(`[IntaSend Webhook] CRITICAL: Paid transaction ${invoiceId} has no matching abandoned cart for ${email || phone}.`)
        // We still return 200 so IntaSend doesn't infinitely retry, but you should log this to an alert system
        return NextResponse.json({ received: true, warning: 'no_matching_cart' })
      }

      // 5. Generate a Clean Order Reference
      const orderNumber = `ZC-${Date.now().toString().slice(-6)}`

      // 6. Insert into the Official Live Orders Table
      const { data: newOrder, error: orderError } = await supabase
        .from('orders')
        .insert({
          order_number: orderNumber,
          user_id: null, // Guest checkout or map if auth is used
          status: 'processing',
          subtotal: amount,
          shipping: 0, // Or extract from matchedCart.total_value math if separated in DB
          tax: 0,
          total: amount,
          currency: 'KES',
          payment_status: 'paid',
          payment_reference: String(invoiceId),
          shipping_address: {
            first_name: matchedCart.first_name,
            last_name: matchedCart.last_name,
            email: matchedCart.email,
            phone: matchedCart.phone,
            region: matchedCart.shipping_region
          }
        })
        .select('id')
        .single()

      if (orderError) {
        console.error('[IntaSend Webhook] Order creation failed:', orderError)
        throw orderError
      }

      // 7. Migrate Line Items & Decrement Inventory
      const items = Array.isArray(matchedCart.items) 
        ? matchedCart.items 
        : (typeof matchedCart.items === 'string' ? JSON.parse(matchedCart.items) : [])

      if (newOrder && items.length > 0) {
        const orderItems = items.map((item: any) => ({
          order_id: newOrder.id,
          product_id: item.product?.id || item.id,
          product_name: item.product?.name || item.name || 'Unknown Apparel',
          quantity: Number(item.quantity || 1),
          unit_price: Number(item.product?.price || item.price || 0),
          total_price: Number(item.product?.price || item.price || 0) * Number(item.quantity || 1)
        }))

        await supabase.from('order_items').insert(orderItems)

        // Securely decrement stock via database RPC
        for (const item of items) {
          if (item.id) {
            await supabase.rpc('decrement_stock', {
              p_variant_id: item.id,
              p_quantity: Number(item.quantity || 1)
            })
          }
        }
      }

      // 8. Update Abandoned Cart Status to Converted
      await supabase
        .from('abandoned_carts')
        .update({ status: 'converted', last_active: new Date().toISOString() })
        .eq('session_id', matchedCart.session_id)

      console.log(`[IntaSend Webhook] Successfully converted cart ${matchedCart.session_id} to Order ${orderNumber}!`)
      
      // 👉 HERE: You can invoke your email/WhatsApp dispatch helper function!
      // await sendOrderConfirmationEmail(matchedCart.email, orderNumber, items, amount);

      return NextResponse.json({ success: true, order_number: orderNumber })
    }

    // Acknowledge all other non-payment events (like PENDING or FAILED)
    return NextResponse.json({ received: true, ignored_state: state })

  } catch (error: any) {
    console.error('[IntaSend Webhook] Fatal Handler Error:', error.message)
    return NextResponse.json({ error: 'Internal Webhook Error' }, { status: 500 })
  }
}