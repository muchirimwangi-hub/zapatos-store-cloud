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
import { kenyanShippingRates } from "@/lib/utils/shippingRates" 

export default function CheckoutPage() {
  const router = useRouter()
  const { items, getTotal, clearCart } = useCartStore()
  const [isMounted, setIsMounted] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [intaSendLoaded, setIntaSendLoaded] = useState(false) 

  // LOGISTICS FORM STATE
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [address, setAddress] = useState("")
  const [shippingId, setShippingId] = useState("")

  // FINANCIALS
  const subtotal = getTotal();
  const selectedShipping = kenyanShippingRates.find((r: any) => r.id === shippingId);
  const shippingCost = selectedShipping ? selectedShipping.price : 0;
  const finalTotal = subtotal + shippingCost;

  // STATE REF FOR INTASEND CALLBACKS
  const stateRef = useRef({ items, clearCart, router });
  useEffect(() => {
    stateRef.current = { items, clearCart, router };
  }, [items, clearCart, router]);

  useEffect(() => {
    setIsMounted(true)
  }, [])

  // FALLBACK CHECKER: Actively poll the window to see if IntaSend loaded successfully
  useEffect(() => {
    const checkScript = setInterval(() => {
      if (typeof window !== "undefined" && (window as any).IntaSend) {
        setIntaSendLoaded(true);
        clearInterval(checkScript);
      }
    }, 500); // Checks every half-second

    return () => clearInterval(checkScript);
  }, []);

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

        intasend.on("FAILED", (results: any) => {
          console.error("Payment Failed:", results);
          alert("Transaction failed or was cancelled. Please try again.");
        });
      } catch (error) {
        console.error("IntaSend Initialization Error:", error);
      }
    }
  }, [intaSendLoaded]);

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

  const isFormValid = email && phone && firstName && lastName && address && shippingId;

  return (
    <div className="min-h-screen bg-white dark:bg-[#08080A] text-zinc-900 dark:text-zinc-100 transition-colors duration-500 pt-24 pb-24">
      
      {/* INTASEND SDK SCRIPT (Updated to afterInteractive and onReady) */}
      <Script 
        src="https://unpkg.com/intasend-inlinejs-sdk@3.0.4/build/intasend-inline.js" 
        strategy="afterInteractive" 
        onReady={() => setIntaSendLoaded(true)}
      />

      {/* THE PROXY BUTTON (Hidden from user, but IntaSend attaches to this) */}
      <button 
        id="intasend-trigger"
        className="intaSendPayButton hidden"
        style={{ display: 'none' }}
        data-amount={finalTotal}
        data-currency="KES"
        data-email={email}
        data-phone_number={phone}
        data-api_ref="zapatos_checkout"
        data-first_name={firstName}
        data-last_name={lastName}
        data-country="KE"
        data-mobile_tarrif="BUSINESS-PAYS" 
        data-card_tarrif="BUSINESS-PAYS"
      ></button>

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
                  required
                >
                  <option value="" disabled>Select Delivery Destination...</option>
                  {kenyanShippingRates.map((rate: any) => (
                    <option key={rate.id} value={rate.id}>
                      {rate.name} — Ksh {rate.price} ({rate.eta})
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
              
              {/* VISIBLE REACT BUTTON */}
              <button 
                className="w-full h-14 bg-black dark:bg-white text-white dark:text-black uppercase tracking-[0.2em] text-xs font-black flex items-center justify-center gap-2 hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors disabled:opacity-20 disabled:cursor-not-allowed"
                disabled={!isFormValid || isProcessing || !intaSendLoaded}
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById('intasend-trigger')?.click();
                }}
              >
                {!intaSendLoaded 
                  ? "Initializing Gateway..." 
                  : isProcessing 
                    ? "Processing Logistics..." 
                    : "Complete Order"} 
                <ArrowRight className="w-4 h-4" />
              </button>

              {/* OFFICIAL INTASEND TRUST BADGE */}
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