import { NextRequest, NextResponse } from 'next/server'
import { initializePayment } from '@/lib/flutterwave/server'
import { flutterwaveConfig } from '@/lib/flutterwave/config'
import { generateOrderNumber } from '@/lib/utils'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      email,
      name,
      phone,
      amount,
      currency = 'NGN',
      items,
      subtotal,
      shipping,
      tax,
      shippingAddress,
    } = body

    if (!email || !name || !amount) {
      return NextResponse.json(
        { error: 'Missing required fields: email, name, amount' },
        { status: 400 }
      )
    }

    const tx_ref = generateOrderNumber()

    const paymentData = await initializePayment({
      tx_ref,
      amount,
      currency,
      customer: {
        email,
        name,
        phone_number: phone,
      },
      customizations: {
        title: 'Zapatos',
        description: `Order ${tx_ref}`,
      },
      redirect_url: `${flutterwaveConfig.appUrl}/orders/confirmation?tx_ref=${tx_ref}`,
      meta: {
        items,
        source: 'zapatos-beauty-atelier',
      },
    })

    // The standard redirect flow returns a hosted checkout link
    const link = paymentData.data?.link

    if (!link) {
      throw new Error('No payment link returned from Flutterwave. Response: ' + JSON.stringify(paymentData))
    }

    // Create a pending order in Supabase
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        order_number: tx_ref,
        user_id: user?.id || null,
        status: 'pending',
        subtotal: subtotal || amount,
        shipping: shipping || 0,
        tax: tax || 0,
        total: amount,
        currency,
        flw_tx_ref: tx_ref,
        payment_status: 'pending',
        shipping_address: shippingAddress || null,
      })
      .select('id')
      .single()

    if (orderError) {
      console.error('Failed to create pending order:', orderError)
      // Don't block payment — log and continue
    }

    // If we have an order, insert order items
    if (order && items?.length) {
      const orderItems = items.map((item: { id: string; name: string; qty: number; price: number }) => ({
        order_id: order.id,
        product_id: item.id,
        product_name: item.name,
        quantity: item.qty,
        unit_price: item.price,
        total_price: item.price * item.qty,
      }))

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems)

      if (itemsError) {
        console.error('Failed to create order items:', itemsError)
      }
    }

    return NextResponse.json({
      tx_ref,
      link,
    })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Payment initialization failed'
    console.error('Payment init error:', error)
    return NextResponse.json({ error: message, details: String(error) }, { status: 500 })
  }
}
