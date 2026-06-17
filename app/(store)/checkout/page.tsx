"use client"

import { useState, useEffect, useRef } from "react"
import { useCartStore } from "@/lib/store/cart-store"
import { useRouter } from "next/navigation"
import { ShieldCheck, Lock, ArrowRight } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import Script from "next/script"
import { createClient } from "@/lib/supabase/client"

export default function CheckoutPage() {
  const router = useRouter()
  const { items, getTotal, clearCart } = useCartStore()
  const [isMounted, setIsMounted] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [intaSendLoaded, setIntaSendLoaded] = useState(false) 

  // HEADLESS SHIPPING DATA STATE
  const [shippingRates, setShippingRates] = useState<any[]>([])
  const [loadingRates, setLoadingRates] = useState(true)

  // LOGISTICS FORM STATE
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [address, setAddress] = useState("")
  const [shippingId, setShippingId] = useState("")
  
  // 👉 FIX: Added the missing state declaration here to remove all the red lines
  const [sessionId, setSessionId] = useState<string>("")

  // FINANCIALS & DYNAMIC WEIGHT CALCULATION
  const subtotal = getTotal();
  const selectedShipping = shippingRates.find((r: any) => r.id === shippingId);
  
  // 1. Calculate the total weight of the cart securely
  const totalCartWeight = items.reduce((total: number, item: any) => {
    // Looks for weight_kg depending on how your cart stores the variant
    const weight = Number(item.weight_kg || item.variant?.weight_kg || item.attributes?.weight_kg || 0);
    return total + (weight * item.quantity);
  }, 0);

  // 2. Run the dynamic logistics math
  let shippingCost = 0;
  if (selectedShipping) {
    shippingCost = Number(selectedShipping.price); // Apply base rate
    
    const weightLimit = Number(selectedShipping.base_weight_limit || 0);
    const overageRate = Number(selectedShipping.overage_price_per_kg || 0);

    // If the route has a limit, an overage fee, AND the cart exceeds the limit
    if (weightLimit > 0 && overageRate > 0 && totalCartWeight > weightLimit) {
      const extraKgs = Math.ceil(totalCartWeight - weightLimit); // Round up to nearest whole kg
      shippingCost += (extraKgs * overageRate);
    }
  }

  const finalTotal = subtotal + shippingCost;

  // STATE REF FOR INTASEND CALLBACKS
  const stateRef = useRef({ items, clearCart, router });
  useEffect(() => {
    stateRef.current = { items, clearCart, router };
  }, [items, clearCart, router]);

  useEffect(() => {
    setIsMounted(true)
  }, [])

  // FETCH HEADLESS RATES FROM SUPABASE
  useEffect(() => {
    async function fetchRates() {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("shipping_rates")
        .select("*")
        .eq("is_active", true)
        .order("name", { ascending: true });

      if (error) {
        console.error("Error pulling dynamic logistics configuration:", error);
      } else if (data) {
        setShippingRates(data);
      }
      setLoadingRates(false);
    }
    fetchRates();
  }, []);

  // FALLBACK CHECKER: Actively poll the window to see if IntaSend loaded successfully
  useEffect(() => {
    const checkScript = setInterval(() => {
      if (typeof window !== "undefined" && (window as any).IntaSend) {
        setIntaSendLoaded(true);
        clearInterval(checkScript);
      }
    }, 500);

    return () => clearInterval(checkScript);
  }, []);

  // 1. Assign a unique tracking ID to this specific browser session
  useEffect(() => {
    // 👉 FIX: Wrapped in window check to prevent Next.js SSR crashes
    if (typeof window !== "undefined") {
      let sid = window.sessionStorage.getItem("zc_checkout_session");
      if (!sid) {
        // Safe fallback if crypto is blocked on localhost
        sid = typeof crypto !== "undefined" && crypto.randomUUID 
          ? crypto.randomUUID() 
          : `zc_${Math.random().toString(36).substring(2, 15)}`;
        
        window.sessionStorage.setItem("zc_checkout_session", sid);
      }
      setSessionId(sid);
    }
  }, []);

  // 2. The Silent Sync (Debounced to protect database limits)
  useEffect(() => {
    if (!sessionId || items.length === 0) return;

    const syncTimeout = setTimeout(async () => {
      const supabase = createClient();
      
      const { error } = await supabase.from("abandoned_carts").upsert({
        session_id: sessionId,
        email: email || null,
        phone: phone || null,
        first_name: firstName || null,
        last_name: lastName || null,
        items: items,
        total_value: finalTotal,
        status: "abandoned",
        last_active: new Date().toISOString()
      }, { onConflict: 'session_id' });

      if (error) console.error("Ghost cart sync failed:", error.message);
    }, 1500); // Waits 1.5s after they stop typing to sync

    return () => clearTimeout(syncTimeout);
  }, [sessionId, items, email, phone, firstName, lastName, finalTotal]);

  // INIT INTASEND ONCE THE SCRIPT LOADS
  useEffect(() => {
    if (intaSendLoaded && typeof window !== "undefined" && (window as any).IntaSend) {
      
      const pubKey = process.env.NEXT_PUBLIC_INTASEND_PUB_KEY;
      if (!pubKey) {
        console.error("CRITICAL ERROR: IntaSend Public Key is missing from .env.local");
      }

      try {
        const intasend = new (window as any).IntaSend({
          publicAPIKey: pubKey, 
          live: true 
        });

        intasend.on("COMPLETE", async (results: any) => {
          setIsProcessing(true);
          const supabase = createClient();
          const { items: currentItems, clearCart: currentClear, router: currentRouter } = stateRef.current;

          try {
            // Lock stock in database
            for (const item of currentItems) {
              const { error } = await supabase.rpc('decrement_stock', {
                p_variant_id: (item as any).id,
                p_quantity: (item as any).quantity
              });
              if (error) throw new Error(`Stock update failed for ${(item as any).product.name}`);
            }

            // Clear cart and redirect
            currentClear();
            currentRouter.push("/checkout/success");

          } catch (err) {
            console.error("Database Stock Update Error:", err);
            alert("Payment received, but there was an error updating inventory. Support has been notified.");
          } finally {
            setIsProcessing(false);
          }
        });

        intasend.on("FAILED", async (results: any) => {
          console.error("Payment Failed:", results);
          alert("Transaction failed or was cancelled. Please try again.");
          
          // Log the hard failure to the shadow table
          const sid = sessionStorage.getItem("zc_checkout_session");
          if (sid) {
            const supabase = createClient();
            await supabase
              .from("abandoned_carts")
              .update({ status: 'payment_failed' })
              .eq("session_id", sid);
          }
        });
      } catch (error) {
        console.error("IntaSend Initialization Error:", error);
      }
    }
  }, [intaSendLoaded]);

  const handlePesapalCheckout = async (e: React.MouseEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    
    try {
      const orderId = `ZC-${Date.now()}`;

      const res = await fetch("/api/pesapal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: finalTotal,
          email: email,
          phone: phone,
          first_name: firstName,
          last_name: lastName,
          order_id: orderId
        })
      });

      const data = await res.json();

      if (data.redirect_url) {
        const supabase = createClient();
        for (const item of items) {
          await supabase.rpc('decrement_stock', {
            p_variant_id: (item as any).id,
            p_quantity: (item as any).quantity
          });
        }
        
        clearCart();
        window.location.href = data.redirect_url;
      } else {
        alert("Pesapal Gateway Error. Please try again.");
        // Log gateway failure
        const supabase = createClient();
        await supabase.from("abandoned_carts").update({ status: 'payment_failed' }).eq("session_id", sessionId);
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong connecting to Pesapal.");
      // Log network failure
      const supabase = createClient();
      await supabase.from("abandoned_carts").update({ status: 'payment_failed' }).eq("session_id", sessionId);
    } finally {
      setIsProcessing(false);
    }
  };

  if (!isMounted) return null;

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-white dark:bg-[#08080A] pt-32 px-6 flex flex-col items-center text-center">
        <h1 className="text-4xl font-black uppercase tracking-tighter mb-4">Your Bag is Empty</h1>
        <p className="text-sm text-zinc-500 mb-8 max-w-md font-light">
          You have not added any apparel to your logistics queue.
        </p>
        <Button asChild className="h-12 px-8 rounded-none uppercase tracking-widest text-xs font-bold">
          <Link href="/shop">Return to Catalog</Link>
        </Button>
      </div>
    )
  }

  const isFormValid = email && phone && firstName && lastName && address && shippingId && !loadingRates;

  return (
    <div className="min-h-screen bg-white dark:bg-[#08080A] text-zinc-900 dark:text-zinc-100 transition-colors duration-500 pt-24 pb-24">
      
      <Script 
        src="https://unpkg.com/intasend-inlinejs-sdk@3.0.4/build/intasend-inline.js" 
        strategy="afterInteractive" 
        onReady={() => setIntaSendLoaded(true)}
      />

      <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-16">
        
        {/* LEFT COLUMN: LOGISTICS FORM */}
        <div className="lg:col-span-7 space-y-12">
          
          <div className="space-y-4 border-b border-zinc-100 dark:border-zinc-900 pb-8">
            <span className="text-[10px] font-mono text-zinc-400 tracking-widest uppercase">Step 01</span>
            <h2 className="text-2xl font-black uppercase tracking-tighter">Contact Protocol</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Email Address</label>
                <Input type="email" value={email} onChange={e => setEmail(e.target.value)} className="h-12 rounded-none border-zinc-200 dark:border-zinc-800 bg-transparent" required />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Phone (M-PESA Number)</label>
                <Input type="tel" value={phone} onChange={e => setPhone(e.target.value)} placeholder="07XX..." className="h-12 rounded-none border-zinc-200 dark:border-zinc-800 bg-transparent" required />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <span className="text-[10px] font-mono text-zinc-400 tracking-widest uppercase">Step 02</span>
            <h2 className="text-2xl font-black uppercase tracking-tighter">Shipping Logistics</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">First Name</label>
                <Input type="text" value={firstName} onChange={e => setFirstName(e.target.value)} className="h-12 rounded-none border-zinc-200 dark:border-zinc-800 bg-transparent" required />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Last Name</label>
                <Input type="text" value={lastName} onChange={e => setLastName(e.target.value)} className="h-12 rounded-none border-zinc-200 dark:border-zinc-800 bg-transparent" required />
              </div>
              <div className="space-y-2 md:col-span-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Delivery Address (Building, Street)</label>
                <Input type="text" value={address} onChange={e => setAddress(e.target.value)} className="h-12 rounded-none border-zinc-200 dark:border-zinc-800 bg-transparent" required />
              </div>
              <div className="space-y-2 md:col-span-2 pt-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Destination Region</label>
                <select 
                  className="w-full h-12 px-3 border border-zinc-200 dark:border-zinc-800 bg-transparent text-sm rounded-none focus:outline-none focus:border-zinc-400 dark:focus:border-zinc-600"
                  value={shippingId}
                  onChange={e => setShippingId(e.target.value)}
                  disabled={loadingRates}
                  required
                >
                  <option value="" disabled>
                    {loadingRates ? "Syncing dynamic transit configurations..." : "Select Delivery Destination..."}
                  </option>
                  {shippingRates.map((rate: any) => (
                    <option key={rate.id} value={rate.id}>
                      {rate.name} — Ksh {Number(rate.price).toLocaleString()} ({rate.eta})
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: CART SUMMARY & INTASEND PAYMENT */}
        <div className="lg:col-span-5 relative">
          <div className="sticky top-32 bg-zinc-50 dark:bg-[#0C0C10] border border-zinc-100 dark:border-zinc-900 p-8 space-y-8">
            
            <h3 className="text-[10px] font-mono text-zinc-400 tracking-widest uppercase border-b border-zinc-200 dark:border-zinc-800 pb-4">Order Summary</h3>
            
            <div className="space-y-6 max-h-[40vh] overflow-y-auto pr-2">
              {items.map((item: any) => {
                const variantData = item.attributes || item.variant || item.options;
                return (
                  <div key={item.id} className="flex gap-4">
                    <div className="flex-1 flex flex-col justify-center">
                      <h4 className="text-xs font-black uppercase tracking-wider">{item.product.name}</h4>
                      {variantData && (
                        <p className="text-[10px] font-mono text-zinc-500 uppercase mt-1">
                          {Object.values(variantData).join(" / ")}
                        </p>
                      )}
                      <p className="text-[10px] font-mono text-zinc-500 mt-1">QTY: {item.quantity}</p>
                    </div>
                    <div className="text-sm font-bold flex items-center">
                      Ksh {(item.product.price * item.quantity).toLocaleString()}
                    </div>
                  </div>
                )
              })}
            </div>

            <div className="space-y-3 pt-6 border-t border-zinc-200 dark:border-zinc-800 text-sm">
              <div className="flex justify-between text-zinc-500 font-light">
                <span>Subtotal</span>
                <span>Ksh {subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-zinc-500 font-light">
                <span>Shipping</span>
                <span>{shippingId ? `Ksh ${shippingCost.toLocaleString()}` : "Pending"}</span>
              </div>
              <div className="flex justify-between text-lg font-black pt-4 border-t border-zinc-200 dark:border-zinc-800">
                <span className="uppercase">Final Total</span>
                <span>Ksh {finalTotal.toLocaleString()}</span>
              </div>
            </div>

            <div className="pt-4 space-y-4">
              
              <button 
                className="intaSendPayButton w-full h-14 bg-black dark:bg-white text-white dark:text-black uppercase tracking-[0.2em] text-xs font-black flex items-center justify-center gap-2 hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors disabled:opacity-20 disabled:cursor-not-allowed"
                data-amount={finalTotal}
                data-currency="KES"
                data-email={email}
                data-phone_number={phone}
                data-api_ref={`zapatos_checkout_${Date.now()}`}
                data-first_name={firstName}
                data-last_name={lastName}
                data-country="KE"
                data-mobile_tarrif="BUSINESS-PAYS" 
                data-card_tarrif="BUSINESS-PAYS"
                disabled={!isFormValid || isProcessing || !intaSendLoaded}
              >
                {!intaSendLoaded 
                  ? "Initializing Gateway..." 
                  : isProcessing 
                    ? "Processing Logistics..." 
                    : "Complete Order"} 
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="relative flex items-center py-2">
                <div className="flex-grow border-t border-zinc-200 dark:border-zinc-800"></div>
                <span className="flex-shrink-0 mx-4 text-zinc-400 text-[10px] uppercase tracking-widest">OR</span>
                <div className="flex-grow border-t border-zinc-200 dark:border-zinc-800"></div>
              </div>

              <button 
                className="w-full h-14 bg-[#00A859] text-white uppercase tracking-[0.2em] text-xs font-black flex items-center justify-center gap-2 hover:bg-[#008c4a] transition-colors disabled:opacity-20 disabled:cursor-not-allowed"
                disabled={!isFormValid || isProcessing}
                onClick={handlePesapalCheckout}
              >
                {isProcessing ? "Connecting to Pesapal..." : "Pay with Pesapal"}
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="flex flex-col items-center justify-center gap-3 pt-2">
                <a href="https://intasend.com/security" target="_blank" rel="noopener noreferrer">
                  <img 
                    src="https://intasend-prod-static.s3.amazonaws.com/img/trust-badges/intasend-trust-badge-with-mpesa-hr-light.png" 
                    width="300px" 
                    alt="IntaSend Secure Payments (PCI-DSS Compliant)" 
                    className="opacity-90 hover:opacity-100 transition-opacity dark:invert"
                  />
                </a>
                <a 
                  href="https://intasend.com/security" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-[9px] uppercase tracking-widest text-zinc-400 hover:text-zinc-800 dark:hover:text-white transition-colors font-bold"
                >
                  Secured by IntaSend Payments
                </a>
              </div>
            
              <div className="flex items-center justify-center gap-2 text-[10px] uppercase tracking-widest text-zinc-400 font-mono">
                <ShieldCheck className="w-3 h-3" /> Secure IntaSend Processing
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  )
}