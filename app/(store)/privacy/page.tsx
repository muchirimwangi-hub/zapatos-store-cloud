import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Privacy Policy | Zapatos",
}

export default function PrivacyPage() {
  return (
    <div className="min-h-screen py-24">
      <div className="container mx-auto px-6 lg:px-12 max-w-3xl">
        <p className="text-sm uppercase tracking-[0.3em] text-zapatos-gold mb-4">
          Legal
        </p>
        <h1 className="text-5xl font-serif font-light mb-12">Privacy Policy</h1>

        <div className="space-y-8 text-zapatos-charcoal/80 editorial-spacing">
          <section>
            <h2 className="text-2xl font-serif mb-4 text-zapatos-obsidian">Information We Collect</h2>
            <p>
              When you visit our site, we collect certain information about your device, your
              interaction with the site, and information necessary to process your purchases.
              We may also collect additional information if you contact us for customer support.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-serif mb-4 text-zapatos-obsidian">How We Use Your Information</h2>
            <p>
              We use the information we collect to fulfill orders, communicate with you,
              screen for potential risk or fraud, and improve our site. We use your email
              address to send order confirmations and, with your consent, promotional
              communications.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-serif mb-4 text-zapatos-obsidian">Sharing Your Information</h2>
            <p>
              We share your personal information with service providers to help us provide
              our services and fulfill our contracts with you, including payment processing
              (Flutterwave) and hosting (Vercel, Supabase). We do not sell your personal data.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-serif mb-4 text-zapatos-obsidian">Data Retention</h2>
            <p>
              We retain your personal information for as long as necessary to provide
              you with our services and as described in this privacy policy. We may also
              retain this information to comply with legal obligations, resolve disputes,
              and enforce our agreements.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-serif mb-4 text-zapatos-obsidian">Your Rights</h2>
            <p>
              You have the right to access, correct, or delete your personal information.
              You may also withdraw consent for us to use your data at any time. Contact
              us at helloZapatos.atelier@gmail.com for any privacy-related requests.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-serif mb-4 text-zapatos-obsidian">Contact</h2>
            <p>
              For more information about our privacy practices, or if you have questions,
              please contact us at helloZapatos.atelier@gmail.com.
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
