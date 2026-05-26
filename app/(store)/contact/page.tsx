"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Mail, MapPin, Clock, Send, Phone, ShieldCheck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false)
  const [isSending, setIsSending] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState({ firstName: '', lastName: '', email: '', message: '' })

  const easeQuint = [0.16, 1, 0.3, 1]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSending(true)
    setError(null)

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Failed to transmit log')
      }

      setSubmitted(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Transmission failure')
    } finally {
      setIsSending(false)
    }
  }

  return (
    <div className="min-h-screen bg-white dark:bg-[#08080A] text-zinc-900 dark:text-zinc-100 font-sans antialiased transition-colors duration-500 selection:bg-black selection:text-white dark:selection:bg-white dark:selection:text-black">
      
      {/* TECHNICAL LAYOUT BLUEPRINT GRID */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] dark:opacity-[0.02] bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:40px_40px]" />

      {/* 1. HERO CONTROLLER LAYER */}
      <section className="relative pt-48 pb-24 md:pt-64 md:pb-32 border-b border-zinc-100 dark:border-zinc-900/80">
        <div className="max-w-6xl mx-auto px-6 space-y-6 text-left">
          <p className="text-[10px] font-mono tracking-[0.5em] text-zinc-400 dark:text-zinc-600 uppercase">
            // TERMINAL INDEX: CONNECT
          </p>
          <motion.h1 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: easeQuint }}
            className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter uppercase leading-none text-zinc-950 dark:text-white"
          >
            SAY HELLO.
          </motion.h1>
          <p className="text-base md:text-lg text-zinc-500 dark:text-zinc-400 font-light max-w-2xl leading-relaxed tracking-wide pt-4 border-t border-zinc-100 dark:border-zinc-900">
            Questions about sizing or an existing order? Our team in Nakuru is ready to help guide your performance architecture.
          </p>
        </div>
      </section>

      {/* 2. MAIN COMPONENT CHANNELS */}
      <section className="py-24 max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24">
          
          {/* HARDWARE APPLICATION INTERFACE FORM */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: easeQuint }}
            className="lg:col-span-7"
          >
            {submitted ? (
              <div className="border border-zinc-200 dark:border-zinc-800 p-12 text-center bg-zinc-50 dark:bg-[#0C0C10] space-y-6 transition-all duration-300">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-zinc-950 dark:bg-white text-white dark:text-black">
                  <ShieldCheck className="h-5 w-5 stroke-[1.5]" />
                </div>
                <h2 className="text-2xl font-black uppercase tracking-tight text-zinc-950 dark:text-white">COMMS DISPATCHED</h2>
                <p className="text-sm text-zinc-500 dark:text-zinc-400 font-light leading-relaxed max-w-sm mx-auto">
                  Log packet safely processed into the pipeline. Review queues are active; expected feedback interval inside 24 operational hours.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="space-y-2">
                  <h2 className="text-2xl font-black uppercase tracking-tighter text-zinc-950 dark:text-white">TRANSMIT PACKET</h2>
                  <p className="text-xs font-mono text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">
                    // INITIALIZE INPUT PIPELINE SEQUENCES
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-mono uppercase tracking-widest text-zinc-400 dark:text-zinc-500">FIRST NAME *</label>
                    <Input
                      required
                      placeholder="First Name"
                      value={formData.firstName}
                      onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
                      className="bg-transparent text-zinc-950 dark:text-white border-zinc-200 dark:border-zinc-800 focus-visible:ring-zinc-950 dark:focus-visible:ring-white rounded-none h-11 transition-colors"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-mono uppercase tracking-widest text-zinc-400 dark:text-zinc-500">LAST NAME *</label>
                    <Input
                      required
                      placeholder="Last Name"
                      value={formData.lastName}
                      onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
                      className="bg-transparent text-zinc-950 dark:text-white border-zinc-200 dark:border-zinc-800 focus-visible:ring-zinc-950 dark:focus-visible:ring-white rounded-none h-11 transition-colors"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-mono uppercase tracking-widest text-zinc-400 dark:text-zinc-500">EMAIL ADDRESS *</label>
                  <Input
                    required
                    type="email"
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    className="bg-transparent text-zinc-950 dark:text-white border-zinc-200 dark:border-zinc-800 focus-visible:ring-zinc-950 dark:focus-visible:ring-white rounded-none h-11 transition-colors"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-mono uppercase tracking-widest text-zinc-400 dark:text-zinc-500">MESSAGE *</label>
                  <textarea
                    required
                    rows={6}
                    placeholder="State technical constraints, hardware orders, or deployment tracking metrics..."
                    value={formData.message}
                    onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                    className="flex w-full border border-zinc-200 dark:border-zinc-800 bg-transparent px-3 py-3 text-sm text-zinc-950 dark:text-white focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-950 dark:focus-visible:ring-white rounded-none resize-none transition-all duration-200 font-light placeholder:text-zinc-300 dark:placeholder:text-zinc-700"
                  />
                </div>

                {error && (
                  <p className="text-xs font-mono font-bold text-red-600 dark:text-red-400 uppercase tracking-wider">// STRUCT_ERR: {error}</p>
                )}

                <Button 
                  type="submit" 
                  size="lg" 
                  className="w-full sm:w-auto bg-black dark:bg-white text-white dark:text-black hover:bg-zinc-800 dark:hover:bg-zinc-200 rounded-none h-12 px-16 uppercase text-xs font-black tracking-[0.2em] transition-transform active:scale-95" 
                  disabled={isSending}
                >
                  <Send className="mr-2 h-3.5 w-3.5 stroke-[1.5]" />
                  {isSending ? 'SENDINGPACKET...' : 'SEND MESSAGE'}
                </Button>
              </form>
            )}
          </motion.div>

          {/* HARDWARE INFRASTRUCTURE CHANNELS INDEX */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: easeQuint }}
            className="lg:col-span-5 space-y-10"
          >
            <div className="space-y-4">
              <h2 className="text-2xl font-black uppercase tracking-tighter text-zinc-950 dark:text-white">SYSTEM HARDWARE INFO</h2>
              <p className="text-xs md:text-sm text-zinc-500 dark:text-zinc-400 font-light leading-relaxed">
                Direct infrastructure logs mapping deployment assets across local nodes. Response systems optimized to device baseline settings.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {[
                {
                  icon: MapPin,
                  title: "Location Matrix",
                  detail: "Lams Business Mall, Nakuru",
                  sub: "Central hub operations & localized talent deployment",
                  href: "https://maps.google.com/?q=Lams+Business+Mall,+Nakuru",
                },
                {
                  icon: Clock,
                  title: "Business Hours Matrix",
                  detail: "Mon — Sat: 8:30am – 5:30pm",
                  sub: "System clocks synchronized to East Africa Time",
                  href: null,
                },
                {
                  icon: Mail,
                  title: "Direct Support Relay",
                  detail: "info@zapatoscave.com",
                  sub: "Monitored constantly during shift frameworks",
                  href: "mailto:info@zapatoscave.com",
                },
                {
                  icon: Phone,
                  title: "Secure Terminal Link",
                  detail: "+254 720 383601",
                  sub: "Direct hardware call / WhatsApp verification",
                  href: "tel:+254720383601",
                  isPhoneLink: true,
                },
              ].map((item) => {
                const Icon = item.icon
                
                const cardContent = (
                  <div className="p-6 bg-zinc-50 dark:bg-[#0C0C10] border border-zinc-200 dark:border-zinc-900 rounded-none flex gap-4 transition-all duration-300 group hover:border-zinc-400 dark:hover:border-zinc-700 w-full text-left">
                    <div className="w-8 h-8 bg-zinc-200 dark:bg-zinc-900 text-zinc-900 dark:text-white flex items-center justify-center rounded-none transition-colors duration-300 group-hover:bg-black group-hover:text-white dark:group-hover:bg-white dark:group-hover:text-black shrink-0">
                      <Icon className="h-4 w-4 stroke-[1.5]" />
                    </div>
                    <div className="space-y-1 w-full">
                      <h3 className="text-[10px] font-mono uppercase tracking-wider font-bold text-zinc-400 dark:text-zinc-500">
                        {item.title}
                      </h3>
                      
                      {item.isPhoneLink ? (
                        <div className="space-y-2 pt-0.5">
                          <p className="text-xs font-black uppercase text-zinc-950 dark:text-white break-all">
                            {item.detail}
                          </p>
                          <div className="flex flex-wrap gap-2 pt-1">
                            <a 
                              href="tel:+254720383601" 
                              className="inline-flex items-center text-[10px] font-mono uppercase bg-zinc-200 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 px-2.5 py-1 border border-zinc-300 dark:border-zinc-800 hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors"
                            >
                              // CALL DIRECT
                            </a>
                            <a 
                              href="https://wa.me/254720383601?text=Hello%20Zapatos%20Cave,%20I%20have%20a%20question%20regarding%20sizing/order..." 
                              target="_blank" 
                              rel="noopener noreferrer" 
                              className="inline-flex items-center text-[10px] font-mono uppercase bg-zinc-200 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 px-2.5 py-1 border border-zinc-300 dark:border-zinc-800 hover:bg-green-600 hover:text-white dark:hover:bg-green-600 dark:hover:text-white transition-colors"
                            >
                              // WHATSAPP
                            </a>
                          </div>
                        </div>
                      ) : (
                        <p className="text-xs font-black uppercase text-zinc-950 dark:text-white">
                          {item.detail}
                        </p>
                      )}

                      <p className="text-[10px] text-zinc-400 dark:text-zinc-600 font-light leading-none pt-0.5">
                        {item.sub}
                      </p>
                    </div>
                  </div>
                )

                if (!item.href || item.isPhoneLink) {
                  return <div key={item.title} className="w-full">{cardContent}</div>
                }

                return (
                  <a 
                    key={item.title} 
                    href={item.href}
                    target={item.href.startsWith('http') ? '_blank' : undefined}
                    rel={item.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                    className="block w-full cursor-pointer"
                  >
                    {cardContent}
                  </a>
                )
              })}
            </div>
          </motion.div>

        </div>
      </section>
    </div>
  )
}