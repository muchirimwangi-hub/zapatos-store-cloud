import { Metadata } from "next"
import { Package, RotateCcw, Clock, ShieldAlert } from "lucide-react"

export const metadata: Metadata = {
  title: "Shipping & Returns | Zapatos Cave",
  description: "Logistical routing protocols and item exchange return parameters.",
}

export default function ShippingPage() {
  const policies = [
    {
      icon: Clock,
      title: "Nairobi Logistics",
      detail: "24-Hour Dispatch Matrix",
      sub: "KSh 250 — KSh 400 fixed assessment",
    },
    {
      icon: Package,
      title: "Upcountry Routing",
      detail: "24–48 Hour Fulfillment",
      sub: "Dispatched securely via G4S / Wells Fargo",
    },
    {
      icon: ShieldAlert,
      title: "Free Freight Threshold",
      detail: "Automatic waiver application",
      sub: "Valid on all orders scaling above KSh 8,000",
    },
    {
      icon: RotateCcw,
      title: "Return Window Matrix",
      detail: "7-Day Examination Limit",
      sub: "Strict criteria evaluation parameters",
    },
  ]

  return (
    <div className="min-h-screen bg-white dark:bg-[#08080A] text-zinc-900 dark:text-zinc-100 font-sans antialiased transition-colors duration-500 py-32 md:py-44">
      <div className="max-w-5xl mx-auto px-6 space-y-16">
        
        {/* Header Block */}
        <div className="space-y-4 border-b border-zinc-100 dark:border-zinc-900 pb-8 max-w-3xl">
          <p className="text-[10px] font-mono tracking-[0.5em] text-zinc-400 dark:text-zinc-600 uppercase">
            // DISTRIBUTION INDEX
          </p>
          <h1 className="text-4xl md:text-5xl font-black tracking-tighter uppercase leading-none">
            Shipping &amp; Returns
          </h1>
        </div>

        {/* Matrix Metrics Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {policies.map((item) => {
            const Icon = item.icon
            return (
              <div 
                key={item.title} 
                className="p-6 bg-zinc-50 dark:bg-[#0C0C10] border border-zinc-200 dark:border-zinc-900 rounded-none flex flex-col space-y-4 transition-all duration-300"
              >
                <div className="w-8 h-8 bg-zinc-950 dark:bg-white text-white dark:text-black flex items-center justify-center rounded-none">
                  <Icon className="h-4 w-4 stroke-[1.5]" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-xs uppercase tracking-wider font-black text-zinc-950 dark:text-white">
                    {item.title}
                  </h3>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 font-light leading-relaxed">
                    {item.detail}
                  </p>
                  <p className="text-[10px] text-zinc-400 dark:text-zinc-600 font-mono uppercase tracking-wide pt-1">
                    {item.sub}
                  </p>
                </div>
              </div>
            )
          })}
        </div>

        {/* Document Specifications Split */}
        <div className="max-w-3xl space-y-12 text-sm md:text-base text-zinc-600 dark:text-zinc-400 font-light leading-relaxed tracking-wide">
          
          <section className="space-y-3">
            <h2 className="text-xs font-mono font-bold uppercase tracking-widest text-zinc-900 dark:text-white">
              I. Processing & Fulfullment Time
            </h2>
            <p>
              All equipment arrays and hardware gear orders are compiled and processed within 1-2 business days. System loads assigned on holiday frames migrate automatically to the subsequent functional business layout date.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xs font-mono font-bold uppercase tracking-widest text-zinc-900 dark:text-white">
              II. Return Eligibility Framework
            </h2>
            <p>
              Items returned for process scaling must arrive completely unused, exhibiting zero custom modifications, preserved within pristine original container frameworks, and retaining all industrial identification tags intact. Proof of transaction configuration must accompany the parcel vector.
            </p>
          </section>

          <section className="space-y-3 bg-zinc-50 dark:bg-[#0C0C10] p-6 border border-dashed border-zinc-200 dark:border-zinc-800">
            <h2 className="text-xs font-mono font-bold uppercase tracking-widest text-red-600 dark:text-red-400">
              ⚠️ Strict Hygiene Exemptions
            </h2>
            <p className="text-xs mt-2">
              For explicit protective biology and biological hygiene preservation guidelines: undergarments, athletic socks, targeted muscular compression baselayers, and virtual digital validation cards are structurally locked from secondary exchange matrices.
            </p>
          </section>

        </div>
      </div>
    </div>
  )
}