import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Privacy Policy | Zapatos Cave",
  description: "Technical Apparel System user data tracking and security standard guidelines.",
}

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-[#08080A] text-zinc-900 dark:text-zinc-100 font-sans antialiased transition-colors duration-500 py-32 md:py-44">
      <div className="max-w-3xl mx-auto px-6 space-y-16">
        
        {/* Header Block */}
        <div className="space-y-4 border-b border-zinc-100 dark:border-zinc-900 pb-8">
          <p className="text-[10px] font-mono tracking-[0.5em] text-zinc-400 dark:text-zinc-600 uppercase">
            // CORE LEGAL PROTOCOL
          </p>
          <h1 className="text-4xl md:text-5xl font-black tracking-tighter uppercase leading-none">
            Privacy Policy
          </h1>
        </div>

        {/* Content Modules */}
        <div className="space-y-12 text-sm md:text-base text-zinc-600 dark:text-zinc-400 font-light leading-relaxed tracking-wide">
          
          <section className="space-y-3">
            <h2 className="text-xs font-mono font-bold uppercase tracking-widest text-zinc-900 dark:text-white">
              I. Personal Information We Collect
            </h2>
            <p>
              When you visit the Site, we collect certain information necessary to process your purchases. This includes Order Information (Name, billing address, shipping address, payment confirmation metrics including M-Pesa transaction identifiers, and contact telephone lines) and Device Information (Browser version configuration data, network IP architecture, and clickstream interaction maps with our storefront).
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xs font-mono font-bold uppercase tracking-widest text-zinc-900 dark:text-white">
              II. How We Use Your Information
            </h2>
            <p>
              We utilize gathered metrics explicitly to fulfill incoming orders, process digital transactions securely, deliver itemized corporate invoices, and dispatch real-time shipping notifications or performance updates.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xs font-mono font-bold uppercase tracking-widest text-zinc-900 dark:text-white">
              III. Data Protection Standards
            </h2>
            <p>
              Zapatos Cave does not lease, sell, or monetize individual client metrics. Your tracking profiles are isolated and only relayed to essential execution nodes (such as verified cross-country shipping couriers and processing infrastructure layers) strictly necessary to finalize order routing variables.
            </p>
          </section>

          {/* Signoff */}
          <div className="pt-12 border-t border-zinc-100 dark:border-zinc-900 flex justify-between items-center text-[10px] font-mono text-zinc-400 dark:text-zinc-600 uppercase tracking-widest">
            <span>SECURE TERMINAL // CLOSED</span>
            <span>Last updated: May 2026</span>
          </div>

        </div>
      </div>
    </div>
  )
}