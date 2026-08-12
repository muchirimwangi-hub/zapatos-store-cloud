import { Metadata } from "next"
import { Package, RotateCcw, Globe, ShieldAlert } from "lucide-react"

export const metadata: Metadata = {
  title: "Legal: Shipping & Returns | Zapatos Cave",
  description: "Binding logistical routing protocols and statutory exchange parameters.",
}

export default function ShippingPage() {
  const policies = [
    {
      icon: Package,
      title: "Nationwide Fulfillment",
      detail: "24–48 Hour Processing",
      sub: "Logistics tariffs calculated at checkout",
    },
    {
      icon: Globe,
      title: "Global & Regional",
      detail: "DHL & Overland Couriers",
      sub: "TZ & UG supported via live checkout rates",
    },
    {
      icon: RotateCcw,
      title: "Exchange Matrix",
      detail: "5-Day Statutory Limit",
      sub: "Goods-for-goods protocol strictly enforced",
    },
  ]

  return (
    <div className="min-h-screen bg-white dark:bg-[#08080A] text-zinc-900 dark:text-zinc-100 font-sans antialiased transition-colors duration-500 py-32 md:py-44">
      <div className="max-w-5xl mx-auto px-6 space-y-16">
        
        {/* Header Block */}
        <div className="space-y-4 border-b border-zinc-100 dark:border-zinc-900 pb-8 max-w-3xl">
          <p className="text-[10px] font-mono tracking-[0.5em] text-zinc-400 dark:text-zinc-600 uppercase">
            
          </p>
          <h1 className="text-4xl md:text-5xl font-black tracking-tighter uppercase leading-none">
            Shipping &amp; Returns
          </h1>
        </div>

        {/* Matrix Metrics Cards Grid - Adjusted to 3 Columns */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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

        {/* Document Specifications Split - Legally Binding Language */}
        <div className="max-w-3xl space-y-12 text-sm md:text-base text-zinc-600 dark:text-zinc-400 font-light leading-relaxed tracking-wide">
          
          <section className="space-y-3">
            <h2 className="text-xs font-mono font-bold uppercase tracking-widest text-zinc-900 dark:text-white">
              I. Dispatch Protocols and Fulfillment Liability
            </h2>
            <div className="space-y-4">
              <p>
                <strong className="text-zinc-900 dark:text-zinc-200">Centralized Dispatch:</strong> All physical merchandise ("Goods") is processed, aggregated, and dispatched exclusively from our primary retail and warehouse facility located in Nakuru, Kenya. 
              </p>
              <p>
                Standard order processing executes within one (1) to two (2) business days following the confirmation of clear funds. Zapatos Cave expressly disclaims liability for transit delays caused by force majeure events, third-party courier negligence, or statutory holiday operational pauses.
              </p>
              <p>
                <strong className="text-zinc-900 dark:text-zinc-200">Freight Tariffs and Jurisdiction:</strong> Domestic, regional (Tanzania and Uganda via overland transit), and international (via DHL) freight rates are dynamically calculated and applied at the point of checkout. All associated shipping tariffs are non-refundable.
              </p>
            </div>
          </section>

          <section className="space-y-3">
            <h2 className="text-xs font-mono font-bold uppercase tracking-widest text-zinc-900 dark:text-white">
              II. Return and Exchange Policy (Strict Non-Refundability)
            </h2>
            <div className="space-y-4">
              <p>
                Zapatos Cave operates under a strict "Goods-for-Goods" exchange framework. <strong className="text-zinc-900 dark:text-zinc-200">Under no legal or operational circumstances shall cash refunds be issued for returned merchandise.</strong> Clients seeking an exchange may select any available inventory item, provided the formal exchange request is initiated within a strict five (5) business-day window commencing from the recorded date of delivery.
              </p>
              <p>
                To qualify for an exchange, all returned Goods must arrive at our facility in their pristine, original condition: wholly unused, exhibiting zero modifications or signs of wear, preserved within the original packaging, and retaining all factory tags and industrial identification markers intact. Proof of purchase must accompany the physical return. Zapatos Cave reserves the unilateral right to reject any exchange that fails to satisfy these condition precedents.
              </p>
              <p className="border-l-2 border-zinc-900 dark:border-white pl-4 text-xs font-mono uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
                Cost Allocation Clause: Zapatos Cave acts strictly as a retailer and assumes zero liability for post-purchase transit costs. The Client assumes full and exclusive financial responsibility for all logistics tariffs associated with the exchange. This includes both the inbound shipping of the returned Goods to our Nakuru base and the outbound dispatch of the replacement asset.
              </p>
            </div>
          </section>

          <section className="space-y-3">
            <h2 className="text-xs font-mono font-bold uppercase tracking-widest text-zinc-900 dark:text-white">
              III. Exchange Initiation and Formal Notice
            </h2>
            <div className="space-y-6">
              <p>
                No exchange shall be processed or acknowledged without prior formal authorization. Clients must transmit a written request via our designated electronic mail or WhatsApp communication channels prior to routing any physical assets. Upon receipt of authorization, the Client shall securely route the parcel at their sole expense and risk to our registered operational address:
              </p>
              
              {/* Tactical Address Block */}
              <div className="bg-zinc-100 dark:bg-[#111115] p-6 md:p-8 border border-zinc-200 dark:border-zinc-800 font-mono text-xs md:text-sm text-zinc-600 dark:text-zinc-400 space-y-1">
                <p className="font-bold text-zinc-950 dark:text-white uppercase tracking-widest mb-4">Zapatos Caves</p>
                <p>LAMS BUILDING, SHOP NO:06,</p>
                <p>KENYATTA AVENUE,</p>
                <p>NAKURU TOWN, KENYA.</p>
                
                <div className="pt-6 space-y-2">
                  <p className="flex items-center gap-2">
                    <span className="text-zinc-400 dark:text-zinc-600 tracking-widest">OFFICIAL COMMS:</span>
                    <a 
                      href="mailto:sales@zapatoscave.com" 
                      className="text-zinc-900 dark:text-white underline underline-offset-4 decoration-zinc-300 dark:decoration-zinc-700 hover:bg-zinc-950 hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors"
                    >
                      sales@zapatoscave.com
                    </a>
                  </p>
                  <p className="flex items-center gap-2">
                    <span className="text-zinc-400 dark:text-zinc-600 tracking-widest">DIRECT LINE:</span>
                    <a 
                      href="https://wa.me/254720383601" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-zinc-900 dark:text-white underline underline-offset-4 decoration-zinc-300 dark:decoration-zinc-700 hover:bg-zinc-950 hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors"
                    >
                      +254 720 383 601
                    </a>
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section className="space-y-3 bg-zinc-50 dark:bg-[#0C0C10] p-6 border border-dashed border-zinc-200 dark:border-zinc-800">
            <div className="flex items-center gap-2 mb-2">
              <ShieldAlert className="w-4 h-4 text-red-600 dark:text-red-400" />
              <h2 className="text-xs font-mono font-bold uppercase tracking-widest text-red-600 dark:text-red-400">
                IV. Statutory Hygiene Exemptions
              </h2>
            </div>
            <p className="text-xs">
              In accordance with public health protocols and biological safety standards, all sales of undergarments, athletic socks, targeted muscular compression baselayers, and virtual digital validation cards are final. These items are strictly exempt from the exchange matrix and are legally ineligible for return under any circumstances.
            </p>
          </section>

        </div>
      </div>
    </div>
  )
}