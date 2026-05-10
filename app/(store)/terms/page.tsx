import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Terms of Service | Zapatos",
}

export default function TermsPage() {
  return (
    <div className="min-h-screen py-24">
      <div className="container mx-auto px-6 lg:px-12 max-w-3xl">
        <p className="text-sm uppercase tracking-[0.3em] text-zapatos-gold mb-4">
          Legal
        </p>
        <h1 className="text-5xl font-serif font-light mb-12">Terms of Service</h1>

        <div className="space-y-8 text-zapatos-charcoal/80 editorial-spacing">
          <section>
            <h2 className="text-2xl font-serif mb-4 text-zapatos-obsidian">Overview</h2>
            <p>
              This website is operated by Zapatos. Throughout the site,
              the terms &ldquo;we&rdquo;, &ldquo;us&rdquo; and &ldquo;our&rdquo; refer
              to Zapatos. By visiting our site and/or purchasing something
              from us, you agree to be bound by the following terms and conditions.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-serif mb-4 text-zapatos-obsidian">Online Store Terms</h2>
            <p>
              By agreeing to these Terms of Service, you represent that you are at least
              the age of majority in your state or province of residence. You may not use
              our products for any illegal or unauthorized purpose. A breach or violation
              of any of the terms will result in an immediate termination of your services.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-serif mb-4 text-zapatos-obsidian">Products &amp; Pricing</h2>
            <p>
              Prices for our products are subject to change without notice. We reserve the
              right to modify or discontinue any product at any time. We shall not be liable
              to you or any third-party for any modification, price change, suspension, or
              discontinuance of a product.
            </p>
          </section>

          {/* <section>
            <h2 className="text-2xl font-serif mb-4 text-zapatos-obsidian">Accuracy of Information</h2>
            <p>
              We are not responsible if information made available on this site is not
              accurate, complete, or current. The material on this site is provided for
              general information only and should not be relied upon as the sole basis
              for making decisions.
            </p>
          </section> */}

          <section>
            <h2 className="text-2xl font-serif mb-4 text-zapatos-obsidian">User Account</h2>
            <p>
              You are responsible for maintaining the confidentiality of your account and
              password. You agree to accept responsibility for all activities that occur
              under your account.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-serif mb-4 text-zapatos-obsidian">Contact</h2>
            <p>
              Questions about the Terms of Service should be sent to us at
              helloZapatos.atelier@gmail.com.
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
