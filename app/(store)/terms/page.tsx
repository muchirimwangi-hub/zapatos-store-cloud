import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Terms of Service | Zapatos Cave",
  description: "Standard industrial execution rules and transactional procurement terms.",
}

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-[#08080A] text-zinc-900 dark:text-zinc-100 font-sans antialiased transition-colors duration-500 py-32 md:py-44">
      <div className="max-w-3xl mx-auto px-6 space-y-16">
        
        {/* Header Block */}
        <div className="space-y-4 border-b border-zinc-100 dark:border-zinc-900 pb-8">
          <p className="text-[10px] font-mono tracking-[0.5em] text-zinc-400 dark:text-zinc-600 uppercase">
            // INTERFACE STACK CONDITIONS
          </p>
          <h1 className="text-4xl md:text-5xl font-black tracking-tighter uppercase leading-none">
            Terms of Service
          </h1>
        </div>

        {/* Content Paragraph Block */}
        <div className="space-y-12 text-sm md:text-base text-zinc-600 dark:text-zinc-400 font-light leading-relaxed tracking-wide">
          
          <section className="space-y-3">
            <h2 className="text-xs font-mono font-bold uppercase tracking-widest text-zinc-900 dark:text-white">
              I. Operational Overview
            </h2>
            <p>
              This digital architecture is deployed and operated by Zapatos Cave systems. Access mapping, infrastructure execution, and equipment procurement routines remain strictly bound to compliance with these outlined execution frameworks. By engaging the environment, you authenticate authorization status.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xs font-mono font-bold uppercase tracking-widest text-zinc-900 dark:text-white">
              II. Asset Distribution & Procurement Modifiers
            </h2>
            <p>
              Pricing parameters, production lots, and technical spec descriptions are prone to shift or close completely without administrative notification matrices. We hold the absolute right to throttle item access allocations or modify pipeline parameters without bearing computational liability to proxy networks or third-party gateways.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xs font-mono font-bold uppercase tracking-widest text-zinc-900 dark:text-white">
              III. Profile Integrity Verification
            </h2>
            <p>
              The individual operator holds absolute manual responsibility for maintaining data isolation profiles, security encryption string states, and authentication access keys. Any operations, checkout procedures, or dynamic modifications routed through your validation token fall directly under your liability domain.
            </p>
          </section>

        </div>
      </div>
    </div>
  )
}