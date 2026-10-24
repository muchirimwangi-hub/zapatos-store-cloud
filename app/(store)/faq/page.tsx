import React from "react"
import Script from "next/script"

export const metadata = {
  title: "FAQ | Zapatos Cave",
  description: "Frequently asked questions about Zapatos Cave shipping, M-PESA payments, returns, and premium sportswear sizing in Kenya.",
}

const faqs = [
  {
    category: "Orders & Payments",
    q: "How do I pay for my order?",
    a: "We accept secure, instant mobile payments via M-PESA. Our checkout is powered by IntaSend, allowing you to complete your transaction seamlessly directly on zapatoscave.com."
  },
  {
    category: "Shipping & Location",
    q: "Where is the Zapatos Cave physical store located?",
    a: "Our physical retail studio is located at Lams Building, Shop No. 06, on Kenyatta Avenue in Nakuru Town. You can shop in-store or pick up your online orders here."
  },
  {
    category: "Shipping & Location",
    q: "Do you offer nationwide delivery in Kenya?",
    a: "Yes. We ship our premium athletic wear, tracksuits, and accessories across Kenya. Orders are typically processed and dispatched within 24 hours of receiving your M-PESA payment."
  },
  {
    category: "Returns & Exchanges",
    q: "Can I return or exchange an item if it doesn't fit?",
    a: "We enforce a strict exchange-only policy valid within 5 working days of purchase. We do not issue cash refunds. To qualify for a direct product exchange, the item must be unworn and in its original condition. The customer is responsible for covering the return shipping costs."
  },
  {
    category: "Products & Sizing",
    q: "How do I know which size to order?",
    a: "We provide comprehensive measurements for all men's, women's, and unisex apparel. Please refer to our Size Guide located in the website footer for exact chest, waist, and length measurements in inches."
  },
  {
    category: "Products & Sizing",
    q: "Are your products authentic and high quality?",
    a: "Absolutely. Zapatos Cave imports premium sportswear, activewear, and turf football cleats directly from verified international suppliers to ensure high-performance quality and durability for your training systems."
  }
]

export default function FAQPage() {
  // Generate JSON-LD for SEO & AI Crawlers
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map((faq) => ({
      "@type": "Question",
      "name": faq.q,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.a
      }
    }))
  }

  return (
    <div className="w-full bg-white dark:bg-[#08080A] transition-colors duration-500 pt-32 pb-20 md:pb-8 min-h-screen">
      {/* Inject Structured Data for SEO/AEO */}
      <Script
        id="faq-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="max-w-4xl mx-auto px-6 lg:px-12">
        {/* HEADER */}
        <div className="text-center mb-20">
          <h1 className="tracking-[0.5em] uppercase font-black text-zinc-950 dark:text-white text-2xl md:text-3xl">
            FAQ
          </h1>
          <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-zinc-400 dark:text-zinc-500 mt-4">
            Frequently Asked Questions
          </p>
          <div className="w-8 h-[1px] bg-zinc-900 dark:bg-zinc-800 mx-auto mt-6" />
        </div>

        {/* FAQ LIST */}
        <div className="space-y-12">
          {faqs.map((faq, index) => (
            <div key={index} className="border-b border-zinc-100 dark:border-zinc-900 pb-8">
              <span className="text-[9px] font-mono uppercase tracking-[0.2em] font-bold text-zinc-400 dark:text-zinc-600 mb-3 block">
                {faq.category}
              </span>
              <h2 className="text-sm md:text-base font-black uppercase tracking-wider text-zinc-950 dark:text-white mb-4">
                {faq.q}
              </h2>
              <p className="text-xs md:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed font-medium">
                {faq.a}
              </p>
            </div>
          ))}
        </div>

        {/* SUPPORT CTA */}
        <div className="mt-20 p-8 border border-zinc-100 dark:border-zinc-900 bg-zinc-50/50 dark:bg-[#0C0C10]/20 text-center">
          <h3 className="text-xs font-black uppercase tracking-wider text-zinc-950 dark:text-white mb-2">
            Still require assistance?
          </h3>
          <p className="text-xs text-zinc-500 mb-6">
            Reach out to our studio directly for further inquiries.
          </p>
          <div className="flex justify-center gap-4">
            <a 
              href="https://wa.me/254720383601" 
              target="_blank" 
              rel="noopener noreferrer"
              className="px-6 py-3 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 text-[10px] font-mono uppercase tracking-widest font-bold hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors"
            >
              WhatsApp Us
            </a>
          </div>
        </div>

      </div>
    </div>
  )
}
