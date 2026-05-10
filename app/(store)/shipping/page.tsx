import { Metadata } from "next"
import { Package, RotateCcw, Clock, MapPin } from "lucide-react"

export const metadata: Metadata = {
  title: "Shipping & Returns | Zapatos",
}

export default function ShippingPage() {
  return (
    <div className="min-h-screen py-24">
      <div className="container mx-auto px-6 lg:px-12 max-w-3xl">
        <p className="text-sm uppercase tracking-[0.3em] text-zapatos-gold mb-4">
          Policies
        </p>
        <h1 className="text-5xl font-serif font-light mb-12">
          Shipping &amp; Returns
        </h1>

        {/* Shipping Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
          {[
            {
              icon: Package,
              title: "Standard Shipping",
              detail: "3-7 business days",
              sub: "Rates Calculated at checkout",
            },
            {
              icon: Clock,
              title: "Express Shipping",
              detail: "1-3 business days",
              sub: "Rates calculated at checkout",
            },
            {
              icon: MapPin,
              title: "Nationwide Delivery",
              detail: "We ship across Nigeria",
              sub: "International shipping coming soon",
            },
            {
              icon: RotateCcw,
              title: "Easy Returns",
              detail: "14-day return window",
              sub: "Hassle-free process",
            },
          ].map((item) => (
            <div key={item.title} className="luxury-border p-6 flex gap-4">
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

        <div className="space-y-8 text-zapatos-charcoal/80 editorial-spacing">
          <section>
            <h2 className="text-2xl font-serif mb-4 text-zapatos-obsidian">Shipping Policy</h2>
            <p>
              All orders are processed within 1-2 business days. Orders placed on
              weekends or holidays will be processed the following business day. You
              will receive a confirmation email with tracking information once your
              order has shipped.

              Delivery/Shipping 
rates are calculated based on your location and order size, with the full cost displayed at checkout
            </p>
          </section>

        

          <section>
            <h2 className="text-2xl font-serif mb-4 text-zapatos-obsidian">Returns &amp; Exchanges</h2>
            <p>
              We accept returns within 14 days of delivery for unused, unopened
              products in their original packaging. To initiate a return, please
              contact our customer care team at helloZapatos.atelier@gmail.com with
              your order number.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-serif mb-4 text-zapatos-obsidian">Refunds</h2>
            <p>
              Once your return is received and inspected, we will send you an email
              notification. Refunds will be processed to your original payment method
              within 5-7 business days. Shipping costs are non-refundable.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-serif mb-4 text-zapatos-obsidian">Damaged or Incorrect Items</h2>
            <p>
              If you receive a damaged or incorrect item, please contact us within
              48 hours of delivery with photos. We will arrange a replacement or full
              refund at no additional cost to you.
            </p>
          </section>

          <p className="text-sm text-zapatos-charcoal/50 pt-8 border-t border-zapatos-taupe/30">
            Last updated: March 2026
          </p>
        </div>
      </div>
    </div>
  )
}
