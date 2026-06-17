"use server";

import { Resend } from "resend";
import DispatchEmail from "@/components/emails/DispatchEmail";
import { createClient } from "@/lib/supabase/server";

// Make sure your .env.local has RESEND_API_KEY=re_gV9tqQDm_...
const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendDispatchNotification(
  customerEmail: string,
  firstName: string,
  orderId: string,
  trackingNumber: string
) {
  try {
    // 1. Fetch the exact order details and line items from Supabase
    const supabase = await createClient();
    const { data: orderData } = await supabase
      .from("orders")
      .select(`
        total_amount,
        shipping_cost,
        order_items (
          quantity,
          price,
          products ( name ),
          product_variants ( attributes )
        )
      `)
      .eq("id", orderId)
      .single();

    // 2. Format the items so the email template can read them easily
    const formattedItems = orderData?.order_items?.map((item: any) => ({
      name: item.products?.name || "Premium Apparel",
      variant: item.product_variants?.attributes ? Object.values(item.product_variants.attributes).join(" / ") : "Standard",
      quantity: item.quantity,
      price: item.price
    })) || [];

    const totalAmount = orderData?.total_amount || 0;
    const shippingCost = orderData?.shipping_cost || 0;

    // 3. Send the email with the new payload
    const { data, error } = await resend.emails.send({
      from: "Zapatos HQ <orders@zapatoscave.com>",
      to: [customerEmail],
      bcc: ["orders@zapatoscave.com"], 
      subject: `Zapatos HQ | Order Dispatched: #${orderId.substring(0, 8).toUpperCase()}`,
      react: DispatchEmail({ 
        firstName, 
        orderId, 
        trackingNumber,
        items: formattedItems,
        totalAmount,
        shippingCost
      }),
    });

    if (error) {
      console.error("Resend Error:", error);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (error) {
    console.error("Failed to send email:", error);
    return { success: false, error };
  }
}