import type { Metadata, Viewport } from "next"
import { Montserrat } from "next/font/google"
import { Analytics } from '@vercel/analytics/next'
import { SpeedInsights } from "@vercel/speed-insights/next"
import "./globals.css"
import { cn } from "@/lib/utils"
import { AppNavigation } from "@/components/shop/AppNavigation"

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700", "900"],
  variable: "--font-montserrat",
  display: "swap",
})

// Locks down mobile browsers to prevent pinch-zooming and browser chrome bouncing
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover", 
}

export const metadata: Metadata = {
  title: "Zapatos Cave | Technical Apparel System",
  description: "High-performance sportswear and architectural activewear engineered for the modern professional athlete.",
  keywords: ["technical activewear", "sportswear", "compression gear", "minimalist gym wear", "Zapatos Cave"],
  openGraph: {
    type: "website",
    url: "https://zapatoscave.com",
    title: "Zapatos Cave | Technical Apparel System",
    description: "High-performance sportswear and architectural activewear engineered for the modern professional athlete.",
    siteName: "Zapatos Cave",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={cn(montserrat.variable, "h-full scroll-smooth")}>
      <body className="font-sans antialiased bg-background text-foreground min-h-full flex flex-col overflow-x-hidden pb-16 md:pb-0">
        {/* Dynamic Nav Shell Component */}
        <AppNavigation />
        
        {/* Main Content Area */}
        <main className="flex-1 w-full">
          {children}
        </main>
        
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  )
}