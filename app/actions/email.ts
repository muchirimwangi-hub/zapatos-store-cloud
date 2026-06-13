"use server";

import { Resend } from "resend";
import DispatchEmail from "@/components/emails/DispatchEmail";

// Make sure your .env.local has RESEND_API_KEY=re_gV9tqQDm_...
const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendDispatchNotification(
  customerEmail: string,
  firstName: string,
  orderId: string,
  trackingNumber: string
) {
  try {
    const { data, error } = await resend.emails.send({
      // 1. THIS IS NEW: Your official verified domain
      from: "Zapatos HQ <orders@zapatoscave.com>", 
      
      to: [customerEmail],
      
      // 2. THIS IS NEW: Your internal company copy
      bcc: ["orders@zapatoscave.com"], 
      
      subject: `Zapatos HQ | Order Dispatched: #${orderId.substring(0, 8).toUpperCase()}`,
      react: DispatchEmail({ firstName, orderId, trackingNumber }),
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