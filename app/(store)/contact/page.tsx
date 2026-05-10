"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Mail, MapPin, Clock, Send, Phone } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false)
  const [isSending, setIsSending] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' })

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
        throw new Error(data.error || 'Failed to send message')
      }

      setSubmitted(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setIsSending(false)
    }
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <section className="py-24 bg-zapatos-taupe/10">
        <div className="container mx-auto px-6 lg:px-12 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <p className="text-sm uppercase tracking-[0.3em] text-zapatos-gold mb-4">
              Get In Touch
            </p>
            <h1 className="text-5xl md:text-6xl font-serif font-light mb-6">
              Contact Us
            </h1>
            <p className="text-lg text-zapatos-charcoal/80 editorial-spacing max-w-2xl mx-auto">
              We would love to hear from you. Whether you have a question about our 
              products, need assistance with an order, or just want to say hello.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-24">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 max-w-6xl mx-auto">
            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              {submitted ? (
                <div className="luxury-border p-12 text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-6">
                    <Send className="h-8 w-8 text-green-600" />
                  </div>
                  <h2 className="text-3xl font-serif mb-4">Message Sent</h2>
                  <p className="text-zapatos-charcoal/70 editorial-spacing">
                    Thank you for reaching out. We will get back to you within 24 hours.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <h2 className="text-3xl font-serif mb-2">Send a Message</h2>
                  <p className="text-sm text-zapatos-charcoal/60 mb-6">
                    Fill out the form and our team will respond promptly.
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm mb-2">Name *</label>
                      <Input
                        required
                        placeholder="Your name"
                        value={formData.name}
                        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      />
                    </div>
                    <div>
                      <label className="block text-sm mb-2">Email *</label>
                      <Input
                        required
                        type="email"
                        placeholder="you@example.com"
                        value={formData.email}
                        onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm mb-2">Subject</label>
                    <Input
                      placeholder="How can we help?"
                      value={formData.subject}
                      onChange={(e) => setFormData(prev => ({ ...prev, subject: e.target.value }))}
                    />
                  </div>

                  <div>
                    <label className="block text-sm mb-2">Message *</label>
                    <textarea
                      required
                      rows={6}
                      placeholder="Tell us more..."
                      value={formData.message}
                      onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                      className="flex w-full luxury-border bg-transparent px-4 py-3 text-sm transition-colors placeholder:text-zapatos-charcoal/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zapatos-gold/50 disabled:cursor-not-allowed disabled:opacity-50 resize-none"
                    />
                  </div>

                  {error && (
                    <p className="text-sm text-red-600">{error}</p>
                  )}

                  <Button type="submit" size="lg" className="w-full md:w-auto" disabled={isSending}>
                    <Send className="mr-2 h-4 w-4" />
                    {isSending ? 'Sending...' : 'Send Message'}
                  </Button>
                </form>
              )}
            </motion.div>

            {/* Contact Info */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-8"
            >
              <div>
                <h2 className="text-3xl font-serif mb-6">Other Ways to Reach Us</h2>
                <p className="text-zapatos-charcoal/70 editorial-spacing">
                  Our customer care team is here to assist you with anything you need.
                </p>
              </div>

              <div className="space-y-6">
                {[
                  {
                    icon: Mail,
                    title: "Email",
                    detail: "helloZapatos.atelier@gmail.com",
                    // sub: "We respond during work hours",
                  },
                  {
                    icon: Phone,
                    title: "Phone",
                    detail: "+234 815 362 1230",
                    sub: "Call or WhatsApp during business hours",
                  },
                  {
                    icon: MapPin,
                    title: "Location",
                    detail: "Abuja, Nigeria",
                    sub: "Shipping nationwide",
                  },
                  {
                    icon: Clock,
                    title: "Hours",
                    detail: "Mon - Fri: 9am - 6pm WAT Saturday: 10am - 5pm WAT",
                    
                  },
                ].map((item) => (
                  <div key={item.title} className="flex gap-4 luxury-border p-6">
                    <div className="p-3 bg-zapatos-gold/10 rounded-full h-fit">
                      <item.icon className="h-5 w-5 text-zapatos-gold" />
                    </div>
                    <div>
                      <h3 className="font-medium mb-1">{item.title}</h3>
                      <p className="text-sm text-zapatos-charcoal/80">{item.detail}</p>
                      <p className="text-xs text-zapatos-charcoal/50 mt-1">{item.sub}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  )
}
