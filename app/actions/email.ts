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
    const supabase = await createClient();

    // 1. Fetch the Order Header securely
    const { data: orderData, error: orderErr } = await supabase
      .from("orders")
      .select("total_amount, shipping_cost")
      .eq("id", orderId)
      .single();

    if (orderErr) throw new Error("Order fetch failed");

    // 2. Fetch the Raw Items
    const { data: itemsData } = await supabase
      .from("order_items")
      .select("quantity, price, product_variant_id, product_id")
      .eq("order_id", orderId);

    // 3. Trace the exact Product Names and Variants
    const formattedItems = await Promise.all((itemsData || []).map(async (item) => {
      
      // Fetch variant to get attributes AND the true product_id
      const { data: variantData } = await supabase
        .from("product_variants")
        .select("attributes, product_id")
        .eq("id", item.product_variant_id)
        .single();

      // Figure out which product_id to use (check the item first, then fallback to the variant's parent)
      const targetProductId = item.product_id || variantData?.product_id;
      let exactProductName = "Premium Apparel"; // Absolute last resort fallback

      if (targetProductId) {
        const { data: productData } = await supabase
          .from("products")
          .select("name")
          .eq("id", targetProductId)
          .single();
          
        if (productData?.name) {
          exactProductName = productData.name;
        }
      }

      return {
        name: exactProductName,
        variant: variantData?.attributes ? Object.values(variantData.attributes).join(" / ") : "Standard",
        quantity: item.quantity,
        price: item.price
      };
    }));

    const totalAmount = orderData?.total_amount || 0;
    const shippingCost = orderData?.shipping_cost || 0;

    // 4. Dispatch the exact payload to Resend
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
    console.error("Failed to execute email pipeline:", error);
    return { success: false, error };
  }
}