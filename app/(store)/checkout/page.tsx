"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/lib/store/cart-store";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function CheckoutPage() {
  const { items, getTotal, clearCart } = useCartStore();
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handlePayment = async () => {
    setLoading(true);
    const supabase = createClient();

    try {
      // 1. Process your M-Pesa / Stripe Payment here
      // const payment = await processMyPayment(getTotal());

      // 2. If Payment Success -> Loop through items and lock stock
      for (const item of items) {
        // Use an RPC function to ensure stock is checked AND decremented atomically
        const { error } = await supabase.rpc('decrement_stock', {
          p_variant_id: item.id, // Your variant SKU ID
          p_quantity: item.quantity
        });

        if (error) {
          throw new Error(`Failed to update stock for ${item.product.name}: ${error.message}`);
        }
      }

      // 3. Clear cart and redirect to success
      clearCart();
      router.push("/checkout/success");
      
    } catch (err) {
      alert("Transaction failed: " + (err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-8 space-y-8">
      <h1 className="text-3xl font-black uppercase">Finalize Logistics</h1>
      
      <div className="space-y-4">
        {items.map(item => (
          <div key={item.id} className="flex justify-between border-b pb-2">
            <span>{item.product.name} (x{item.quantity})</span>
            <span>Ksh {(item.product.price * item.quantity).toLocaleString()}</span>
          </div>
        ))}
        <div className="text-xl font-bold">Total: Ksh {getTotal().toLocaleString()}</div>
      </div>

      <Button 
        className="w-full h-14 uppercase tracking-widest" 
        onClick={handlePayment} 
        disabled={loading}
      >
        {loading ? "Processing Payment..." : "Pay with M-Pesa"}
      </Button>
    </div>
  );
}