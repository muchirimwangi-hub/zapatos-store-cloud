"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ArrowRight, Activity, Cpu, ShieldAlert } from "lucide-react"
import Link from "next/link"

export default function HomePage() {
  const easeQuint = [0.16, 1, 0.3, 1]

  return (
    <div className="min-h-screen bg-white dark:bg-[#08080A] text-zinc-900 dark:text-zinc-100 font-sans antialiased transition-colors duration-500 selection:bg-black selection:text-white dark:selection:bg-white dark:selection:text-black">
      
      {/* MINIMALIST GEOMETRIC BACKGROUND OVERLAY */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] dark:opacity-[0.02] bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:40px_40px] z-20" />

      {/* 1. HERO BLOCK WITH PARALLAX BACKDROP */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden border-b border-zinc-100 dark:border-zinc-900/80 bg-black attachment-fixed">
        
        {/* High-Resolution Performance Media Backdrop (Parallax Optimized) */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          {/* Mobile Fallback Container (Prevents iOS fixed background zoom bug) */}
          <div className="absolute inset-0 sm:hidden">
            <motion.div 
              className="absolute inset-0 bg-no-repeat bg-cover bg-top"
              style={{
                backgroundImage: `url('https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?q=80&w=2069&auto=format&fit=crop')`,
              }}
              initial={{ scale: 1.08, opacity: 0 }}
              animate={{ scale: 1, opacity: 0.65 }}
              transition={{ duration: 1.8, ease: easeQuint }}
            />
          </div>

          {/* Desktop Parallax Container */}
          <div className="absolute inset-0 hidden sm:block">
            <motion.div 
              className="absolute inset-0 bg-no-repeat bg-fixed bg-cover bg-center"
              style={{
                backgroundImage: `url('https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?q=80&w=2069&auto=format&fit=crop')`,
              }}
              initial={{ scale: 1.08, opacity: 0 }}
              animate={{ scale: 1, opacity: 0.55 }}
              transition={{ duration: 1.8, ease: easeQuint }}
            />
          </div>

          {/* Subtle Vignette Layer */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-zinc-950/50 to-white dark:to-[#08080A] transition-colors duration-500 z-10" />
        </div>

        {/* Hero Content Panel */}
        <div className="relative z-30 max-w-6xl mx-auto px-6 text-center space-y-8 pt-24">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: easeQuint }}
            className="space-y-6"
          >
            <p className="text-[10px] font-mono uppercase tracking-[0.5em] text-white/90 dark:text-zinc-400 font-bold">
              PREMIUM TRAINING SYSTEMS
            </p>
            <h1 className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-black tracking-tighter text-white uppercase leading-[0.85]">
              RAW UTILITY.
              <br />
              <span className="text-zinc-400 dark:text-zinc-600">ZERO EXCESS.</span>
            </h1>
            <p className="text-sm md:text-base text-zinc-200 dark:text-zinc-400 max-w-xl mx-auto font-light leading-relaxed tracking-wide">
              High-end technical activewear, premium compression apparel, and luxury tracksuits designed for elite movement and daily comfort.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
              <Button 
                size="lg" 
                className="group w-full sm:w-auto bg-white text-black hover:bg-zinc-200 rounded-none h-14 px-12 uppercase text-xs font-black tracking-[0.25em] transition-transform active:scale-95"
                asChild
              >
                <Link href="/shop">
                  SHOP COLLECTION
                  <ArrowRight className="ml-2 h-4 w-4 stroke-[2] transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="w-full sm:w-auto border-white text-white hover:bg-white/10 rounded-none h-14 px-12 uppercase text-xs font-black tracking-[0.25em] transition-transform active:scale-95"
                asChild
              >
                <Link href="/about">
                  OUR BRAND MANIFESTO
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 2. CATEGORIES GRID */}
      <section className="relative py-32 max-w-6xl mx-auto px-6 border-b border-zinc-100 dark:border-zinc-900/80 z-30">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: easeQuint }}
          className="space-y-2 mb-20 text-left border-l-2 border-zinc-950 dark:border-white pl-6"
        >
          <span className="text-[10px] font-mono text-zinc-400 dark:text-zinc-600 tracking-widest uppercase">PRODUCT CATEGORIES</span>
          <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter text-zinc-950 dark:text-white leading-none">
            SHOP BY DESIGN
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {[
            {
              title: "Compression Wear",
              description: "High-tension, responsive apparel crafted to support targeted muscle groups and optimize body alignment under load during heavy studio and track sessions.",
              image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=2070&auto=format&fit=crop",
              href: "/shop?category=compression",
              spec: "CORE EDITION V.1"
            },
            {
              title: "Premium Tracksuits",
              description: "Expertly tailored premium synthetic sets designed to balance thermal insulation with breathable properties across changing climates.",
              image: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=2070&auto=format&fit=crop",
              href: "/shop?category=tracksuits",
              spec: "THERMAL CORE V.2"
            }
          ].map((category, index) => (
            <motion.div
              key={category.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: index * 0.12, ease: easeQuint }}
              className="group"
            >
              <Link href={category.href} className="block space-y-4">
                <div className="relative aspect-[16/10] w-full bg-zinc-100 dark:bg-zinc-900 overflow-hidden border border-zinc-200 dark:border-zinc-800">
                  <div 
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-[4000ms] ease-out group-hover:scale-105"
                    style={{ backgroundImage: `url('${category.image}')` }}
                  />
                  <div className="absolute top-4 right-4 bg-zinc-950 text-white font-mono text-[9px] px-2 py-0.5 tracking-widest border border-zinc-800">
                    {category.spec}
                  </div>
                </div>
                
                <div className="space-y-1 text-left">
                  <h3 className="text-xl font-black uppercase tracking-tight text-zinc-950 dark:text-white transition-colors">
                    {category.title}
                  </h3>
                  <p className="text-xs md:text-sm text-zinc-500 dark:text-zinc-400 font-light leading-relaxed">
                    {category.description}
                  </p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

{/* 2.5. SYSTEM DIAGNOSTIC / QUIZ BANNER */}
      <section className="relative py-24 bg-zinc-950 border-y border-zinc-900 overflow-hidden">
        {/* Background Grid Texture */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.05] bg-[linear-gradient(to_right,#ffffff_1px,transparent_1px),linear-gradient(to_bottom,#ffffff_1px,transparent_1px)] bg-[size:40px_40px]" />
        
        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center space-y-6">
          <Activity className="mx-auto h-8 w-8 text-zinc-500 mb-4 stroke-[1.5]" />
          <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter text-white">
            Find Your Blueprint.
          </h2>
          <p className="text-zinc-400 font-light max-w-md mx-auto text-sm leading-relaxed tracking-wide">
            Take our tactical diagnostic test to match your training discipline with the exact Zapatos gear engineered for your environment.
          </p>
          <div className="pt-6">
            <Button 
              size="lg" 
              variant="outline" 
              className="border-zinc-700 text-white hover:bg-white hover:text-black rounded-none h-14 px-12 uppercase text-xs font-black tracking-widest transition-transform active:scale-95" 
              asChild
            >
              <Link href="/quiz">Initiate Diagnostic</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* 3. CAPABILITY MATRIX PANEL */}
      <section className="relative py-32 bg-zinc-50 dark:bg-[#0C0C10] border-b border-zinc-100 dark:border-zinc-900/60 transition-colors duration-500 z-30">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: easeQuint }}
            className="lg:col-span-6 space-y-6 text-left"
          >
            <span className="text-[10px] font-mono text-zinc-400 dark:text-zinc-600 tracking-widest uppercase">DESIGN PHILOSOPHY</span>
            <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter text-zinc-950 dark:text-white leading-tight">
              BUILT FOR ELEVATED
              <br />
              <span className="text-zinc-400 dark:text-zinc-700">ATHLETIC EXECUTION.</span>
            </h2>
            <p className="text-sm md:text-base text-zinc-500 dark:text-zinc-400 font-light leading-relaxed tracking-wide">
              Every curve, low-profile flatlock seam, and localized compression zone maps perfectly to human movement. We filter out unnecessary visual noise to offer absolute, distraction-free garments that look impeccable and outlast heavy workout schedules.
            </p>
            <div className="pt-2">
              <Button 
                size="lg"
                className="bg-black dark:bg-white text-white dark:text-black hover:bg-zinc-800 dark:hover:bg-zinc-200 rounded-none h-12 px-10 uppercase text-xs font-black tracking-widest transition-transform active:scale-95"
                asChild
              >
                <Link href="/about">
                  DISCOVER THE DESIGN
                </Link>
              </Button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: easeQuint }}
            className="lg:col-span-6 relative aspect-square w-full bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 overflow-hidden"
          >
            <div 
              className="absolute inset-0 bg-cover bg-center transition-transform duration-[4000ms] hover:scale-105 ease-out"
              style={{
                backgroundImage: `url('https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=2070&auto=format&fit=crop')`
              }}
            />
          </motion.div>
        </div>
      </section>

      {/* 4. FINALE CALL TO ACTION */}
      <section className="relative py-36 bg-white dark:bg-[#08080A] transition-colors duration-500 z-30">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: easeQuint }}
            className="border border-zinc-200 dark:border-zinc-900 bg-zinc-50 dark:bg-[#0C0C10] p-12 md:p-20 text-center space-y-8 transition-colors duration-500"
          >
            <div className="flex justify-center gap-4 text-zinc-400 dark:text-zinc-600">
              <Cpu className="w-5 h-5 stroke-[1.5]" />
              <Activity className="w-5 h-5 stroke-[1.5]" />
              <ShieldAlert className="w-5 h-5 stroke-[1.5]" />
            </div>
            <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter text-zinc-950 dark:text-white leading-none">
              UPGRADE YOUR APPAREL.
            </h2>
            <p className="text-sm md:text-base text-zinc-500 dark:text-zinc-400 font-light max-w-xl mx-auto leading-relaxed tracking-wide">
              Experience upscale sporting performance styled with luxury aesthetic restraint. Find your new premium activewear built to survive the heavy demands of modern lifestyle paces.
            </p>
            <div className="pt-4">
              <Button 
                size="lg" 
                className="bg-black dark:bg-white text-white dark:text-black hover:bg-zinc-800 dark:hover:bg-zinc-200 rounded-none h-14 px-16 uppercase text-xs font-black tracking-[0.3em] transition-transform active:scale-95"
                asChild
              >
                <Link href="/shop">
                  EXPLORE APPAREL
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}