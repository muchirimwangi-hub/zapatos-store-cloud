"use client"

import { useState, useMemo, useEffect } from "react"
import { kenyanShippingRates } from "@/lib/utils/shippingRates"
import { createClient } from "@/lib/supabase/client"
import { useCartStore } from "@/lib/store/cart-store"

export default function CheckoutForm({ cartItems }: { cartItems: any[] }) {
  const supabase = createClient()
  
  // 1. Customer Personal Fields
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [email, setEmail] = useState("")
  const [phoneNumber, setPhoneNumber] = useState("")
  
  // 2. Localized Shipping Route Coordinates
  const [selectedLocationId, setSelectedLocationId] = useState(kenyanShippingRates[0].id)
  const [streetAddress, setStreetAddress] = useState("")
  const [buildingName, setBuildingName] = useState("")
  const [houseOfficeNumber, setHouseOfficeNumber] = useState("")
  
  // 3. Optional Account Flags
  const [createAccount, setCreateAccount] = useState(false)
  const [password, setPassword] = useState("")

  // 4. Processing States
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [intasendLoaded, setIntasendLoaded] = useState(false)

  // FIXED: Injects the verified official live CDN script source correctly
  useEffect(() => {
    if (typeof window !== "undefined" && !(window as any).IntaSend) {
      const script = document.createElement("script")
      script.src = "https://unpkg.com/intasend-inlinejs-sdk@4.0.7/build/intasend-inline.js"
      script.async = true
      script.onload = () => {
        console.log("IntaSend Secure Gateway Loaded Successfully.")
        setIntasendLoaded(true)
      }
      script.onerror = () => {
        console.error("Failed to load IntaSend SDK from CDN.")
      }
      document.body.appendChild(script)
    } else if ((window as any).IntaSend) {
      setIntasendLoaded(true)
    }
  }, [])

  // Universal Adapter: Normalizes internal item objects cleanly
  const normalizedItems = useMemo(() => {
    if (!Array.isArray(cartItems)) return [];
    return cartItems.map((item: any) => ({
      id: item.id || item.productId || Math.random().toString(),
      name: item.name || item.title || item.product?.name || "Activewear Item",
      price: parseFloat(item.price || item.product?.price || 0),
      quantity: parseInt(item.quantity || item.qty || 1, 10),
      weight_kg: parseFloat(item.weight_kg || item.product?.weight_kg || 0.3)
    }));
  }, [cartItems]);

  // Aggregate Calculations
  const subtotal = useMemo(() => {
    return normalizedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  }, [normalizedItems])

  const totalWeightKg = useMemo(() => {
    return normalizedItems.reduce((sum, item) => sum + (item.weight_kg * item.quantity), 0)
  }, [normalizedItems])

  const activeShippingLocation = useMemo(() => {
    return kenyanShippingRates.find(loc => loc.id === selectedLocationId) || kenyanShippingRates[0]
  }, [selectedLocationId])

  const shippingCost = useMemo(() => {
    if (!activeShippingLocation) return 0
    if (totalWeightKg > activeShippingLocation.maxWeightKg) {
      const extraWeight = totalWeightKg - activeShippingLocation.maxWeightKg
      return activeShippingLocation.price + Math.ceil(extraWeight) * 50 
    }
    return activeShippingLocation.price
  }, [activeShippingLocation, totalWeightKg])

  const totalCost = subtotal + shippingCost

  // Transaction Processing Engine
  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault()
    if (isSubmitting) return
    
    if (!intasendLoaded || !(window as any).IntaSend) {
      alert("Payment gateway loading timeout. Please verify your connection setup and try again.")
      return
    }

    setIsSubmitting(true)

    try {
      // Step A: Save base order header context directly to your Supabase Admin Backend
      const { data: orderRecord, error: orderInsertError } = await supabase
        .from("orders")
        .insert([{
          email: email.trim(),
          status: "pending", 
          total_amount: totalCost,
          shipping_cost: shippingCost,
          tax: 0,
          shipping_address: {
            first_name: firstName.trim(),
            last_name: lastName.trim(),
            phone: phoneNumber.trim(),
            town_route: activeShippingLocation.name,
            street: streetAddress.trim(),
            building: buildingName.trim(),
            unit_no: houseOfficeNumber.trim()
          }
        }])
        .select()
        .single()

      if (orderInsertError || !orderRecord) {
        throw new Error(`Database Initialization Error: ${orderInsertError?.message}`)
      }

      // Step B: Write itemized list entries to order_items tracking records
      const itemsPayload = normalizedItems.map(item => ({
        order_id: orderRecord.id,
        product_id: item.id.includes("-") ? null : item.id, 
        quantity: item.quantity,
        price: item.price
      }))

      const { error: itemsInsertError } = await supabase
        .from("order_items")
        .insert(itemsPayload)

      if (itemsInsertError) {
        throw new Error(`Database Items Reference Error: ${itemsInsertError.message}`)
      }

      // Step C: Initialize the IntaSend Live Checkout overlay modal container
      const intasendInstance = new (window as any).IntaSend({
        // FIXED: Now reads dynamically and securely from your local environment setup
        publicAPIKey: process.env.NEXT_PUBLIC_INTASEND_PUB_KEY,
        live: true
      })

      intasendInstance.run({
        amount: totalCost,
        currency: "KES",
        email: email.trim(),
        phone_number: phoneNumber.trim(),
        first_name: firstName.trim(),
        last_name: lastName.trim(),
        external_reference: orderRecord.id 
      })

      // Step D: Listen to transaction authorization streams
      intasendInstance.on("COMPLETE", async (results: any) => {
        await supabase
          .from("orders")
          .update({ status: "processing" })
          .eq("id", orderRecord.id)

        alert("Payment captured successfully! Thank you for your purchase.")
        
        try {
          const clearAction = (useCartStore.getState() as any).clearCart || (useCartStore.getState() as any).reset;
          if (typeof clearAction === "function") clearAction()
        } catch (err) {
          console.error("Cache reset hook exception:", err)
        }

        window.location.href = "/shop"
      })

      intasendInstance.on("FAILED", async (results: any) => {
        await supabase
          .from("orders")
          .update({ status: "failed" })
          .eq("id", orderRecord.id)
        alert("Transaction authorization declined. Please try an alternative payment source.")
        setIsSubmitting(false)
      })

    } catch (err: any) {
      console.error("Pipeline Exception Trace:", err)
      alert(err.message || "An unhandled transaction pipeline failure occurred.")
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-16 max-w-6xl mx-auto px-6 py-12 bg-[#FAF7F2]">
      
      {/* LEFT COLUMN: Customer Credentials Selection Form */}
      <div className="lg:col-span-7 space-y-12">
        
        {/* Section 1: Customer Identity */}
        <div className="space-y-6">
          <h2 className="text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-400 border-b pb-3">1. Personal Identification</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input type="text" required placeholder="First Name *" value={firstName} onChange={e => setFirstName(e.target.value)} className="w-full border border-black/10 h-12 px-4 text-xs bg-white rounded-none focus:border-black outline-none font-sans" />
            <input type="text" required placeholder="Last Name *" value={lastName} onChange={e => setLastName(e.target.value)} className="w-full border border-black/10 h-12 px-4 text-xs bg-white rounded-none focus:border-black outline-none font-sans" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input type="email" required placeholder="Email Address *" value={email} onChange={e => setEmail(e.target.value)} className="w-full border border-black/10 h-12 px-4 text-xs bg-white rounded-none focus:border-black outline-none font-sans" />
            <input type="tel" required placeholder="M-Pesa Phone Number * (e.g. 07xx...)" value={phoneNumber} onChange={e => setPhoneNumber(e.target.value)} className="w-full border border-black/10 h-12 px-4 text-xs bg-white rounded-none focus:border-black outline-none font-sans" />
          </div>
        </div>

        {/* Section 2: Shipping Coordinates */}
        <div className="space-y-6">
          <h2 className="text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-400 border-b pb-3">2. Delivery Routing Coordinates</h2>
          
          <div className="space-y-2">
            <label className="text-[9px] font-bold uppercase tracking-widest text-zinc-400">Town / Courier Hub Route *</label>
            <div className="relative">
              <select 
                value={selectedLocationId} 
                onChange={e => setSelectedLocationId(e.target.value)}
                className="w-full border border-black/10 h-12 px-4 text-xs bg-white rounded-none focus:border-black outline-none appearance-none font-sans"
              >
                {kenyanShippingRates.map((loc) => (
                  <option key={loc.id} value={loc.id}>
                    {loc.name} — Ksh {loc.price.toLocaleString()} ({loc.eta})
                  </option>
                ))}
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-400 text-xs">▼</div>
            </div>
          </div>

          <div className="space-y-4">
            <input type="text" required placeholder="Street Name / Road * (e.g. Kenyatta Avenue)" value={streetAddress} onChange={e => setStreetAddress(e.target.value)} className="w-full border border-black/10 h-12 px-4 text-xs bg-white rounded-none focus:border-black outline-none font-sans" />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input type="text" required placeholder="Building Name / Apartment *" value={buildingName} onChange={e => setBuildingName(e.target.value)} className="w-full border border-black/10 h-12 px-4 text-xs bg-white rounded-none focus:border-black outline-none font-sans" />
              <input type="text" required placeholder="House, Shop, or Office Number *" value={houseOfficeNumber} onChange={e => setHouseOfficeNumber(e.target.value)} className="w-full border border-black/10 h-12 px-4 text-xs bg-white rounded-none focus:border-black outline-none font-sans" />
            </div>
          </div>
        </div>

        {/* Section 3: Optional Account Save */}
        <div className="space-y-4 pt-2">
          <label className="flex items-center space-x-3 cursor-pointer select-none">
            <input type="checkbox" checked={createAccount} onChange={e => setCreateAccount(e.target.checked)} className="h-4 w-4 accent-black rounded-none border-zinc-300" />
            <span className="text-[10px] uppercase font-bold tracking-widest text-zinc-700">Save my information for a premium account experience</span>
          </label>

          {createAccount && (
            <input type="password" required={createAccount} placeholder="Create Secure Password *" value={password} onChange={e => setPassword(e.target.value)} className="w-full border border-black/10 h-12 px-4 text-xs bg-white rounded-none focus:border-black outline-none font-sans transition-all duration-300" />
          )}
        </div>
      </div>

      {/* RIGHT COLUMN: Summary Balance Display */}
      <div className="lg:col-span-5 bg-white p-8 border border-black/5 h-fit space-y-6">
        <h2 className="text-[10px] font-bold uppercase tracking-[0.3em] border-b pb-4">Bag Summary</h2>
        
        <div className="space-y-4 max-h-60 overflow-y-auto pr-2">
          {normalizedItems.map((item) => (
            <div key={item.id} className="flex justify-between items-start text-xs text-zinc-700">
              <div>
                <p className="font-medium uppercase tracking-tight">{item.name}</p>
                <p className="text-[10px] text-zinc-400 pt-0.5">Qty: {item.quantity} ({(item.weight_kg * item.quantity).toFixed(2)} kg)</p>
              </div>
              <span className="font-medium">Ksh {(item.price * item.quantity).toLocaleString()}</span>
            </div>
          ))}
        </div>

        <hr className="border-zinc-100" />

        <div className="space-y-3 text-xs">
          <div className="flex justify-between text-zinc-500">
            <span>Subtotal</span>
            <span>Ksh {subtotal.toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-zinc-500">
            <span>Shipping Logistics Total ({totalWeightKg.toFixed(2)} kg)</span>
            <span>Ksh {shippingCost.toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-zinc-400 text-[11px]">
            <span>Estimated VAT / Tax Duties</span>
            <span>Ksh 0.00</span>
          </div>
          <hr className="border-zinc-100 pt-1" />
          <div className="flex justify-between font-bold text-sm text-zinc-900 pt-1">
            <span>Grand Total</span>
            <span>Ksh {totalCost.toLocaleString()}</span>
          </div>
        </div>

        <button 
          type="submit" 
          disabled={isSubmitting}
          className="w-full h-14 bg-black text-white text-[10px] uppercase font-bold tracking-[0.3em] hover:bg-zinc-900 transition-colors pt-1 rounded-none disabled:bg-zinc-400 disabled:cursor-not-allowed"
        >
          {isSubmitting ? "Processing Checkout..." : "Complete Purchase"}
        </button>
      </div>
    </form>
  )
}