"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ArrowRight, Activity, Cpu, ShieldAlert } from "lucide-react"
import Link from "next/link"

export default function HomePage() {
  const easeQuint = [0.16, 1, 0.3, 1]

  return (
    <div className="min-h-screen bg-white dark:bg-[#08080A] text-zinc-900 dark:text-zinc-100 font-sans antialiased transition-colors duration-500 selection:bg-black selection:text-white dark:selection:bg-white dark:selection:text-black">
      
      {/* TECHNICAL LAYOUT BLUEPRINT GRID OVERLAY */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] dark:opacity-[0.02] bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:40px_40px] z-20" />

      {/* 1. HERO MANIFESTO BLOCK WITH PARALLAX BACKDROP */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden border-b border-zinc-100 dark:border-zinc-900/80 bg-black attachment-fixed">
        
        {/* Cinematic High-Performance Hardware Backdrop (Parallax Optimized) */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <motion.div 
            className="absolute inset-0 bg-no-repeat bg-scroll sm:bg-fixed"
            style={{
              backgroundImage: `url('https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?q=80&w=2069&auto=format&fit=crop')`,
              backgroundSize: 'cover',
              backgroundPosition: 'center center',
            }}
            initial={{ scale: 1.08, opacity: 0 }}
            animate={{ scale: 1, opacity: 0.55 }}
            transition={{ duration: 1.8, ease: easeQuint }}
          />
          {/* Heavy Gritty Vignette Screen */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-zinc-950/40 to-white dark:to-[#08080A] transition-colors duration-500 z-10" />
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
              // ARCHITECTURAL TRAINING SYSTEMS
            </p>
            <h1 className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-black tracking-tighter text-white uppercase leading-[0.85]">
              RAW UTILITY.
              <br />
              <span className="text-zinc-400 dark:text-zinc-600">ZERO EXCESS.</span>
            </h1>
            <p className="text-sm md:text-base text-zinc-200 dark:text-zinc-400 max-w-xl mx-auto font-light leading-relaxed tracking-wide">
              High-end technical activewear, compression matrices, and tracksuits engineered directly for elite biomechanical performance.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
              <Button 
                size="lg" 
                className="group w-full sm:w-auto bg-white text-black hover:bg-zinc-200 rounded-none h-14 px-12 uppercase text-xs font-black tracking-[0.25em] transition-transform active:scale-95"
                asChild
              >
                <Link href="/shop">
                  DEPLOY GEAR
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
                  READ MANIFESTO
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 2. SPECIFICATION CATEGORIES GRID */}
      <section className="relative py-32 max-w-6xl mx-auto px-6 border-b border-zinc-100 dark:border-zinc-900/80 z-30">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: easeQuint }}
          className="space-y-2 mb-20 text-left border-l-2 border-zinc-950 dark:border-white pl-6"
        >
          <span className="text-[10px] font-mono text-zinc-400 dark:text-zinc-600 tracking-widest uppercase">// INFRASTRUCTURE CATEGORIES</span>
          <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter text-zinc-950 dark:text-white leading-none">
            SHOP BY SPECIFICATION
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {[
            {
              title: "Compression Arrays",
              description: "High-tension poly-spandex blueprints built to optimize localized cardiovascular return and lock down structural vibration under performance load.",
              image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=2070&auto=format&fit=crop",
              href: "/shop?category=compression",
              spec: "POLY-SPANDEX V.1"
            },
            {
              title: "Thermal Tracksuits",
              description: "Engineered synthetic matrices built to handle heat transfer insulation loops and keep baseline muscular core warmth locked in across varying climates.",
              image: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=2070&auto=format&fit=crop",
              href: "/shop?category=tracksuits",
              spec: "INSULATED CORE V.2"
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
                    className="absolute inset-0 bg-cover bg-center grayscale contrast-[1.18] brightness-[0.9] dark:brightness-[0.65] transition-transform duration-[4000ms] ease-out group-hover:scale-103"
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

      {/* 3. HARDWARE CAPABILITY MATRIX PANEL */}
      <section className="relative py-32 bg-zinc-50 dark:bg-[#0C0C10] border-b border-zinc-100 dark:border-zinc-900/60 transition-colors duration-500 z-30">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: easeQuint }}
            className="lg:col-span-6 space-y-6 text-left"
          >
            <span className="text-[10px] font-mono text-zinc-400 dark:text-zinc-600 tracking-widest uppercase">// STRUCTURAL OPTIMIZATION</span>
            <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter text-zinc-950 dark:text-white leading-tight">
              BUILT FOR PURIFIED
              <br />
              <span className="text-zinc-400 dark:text-zinc-700">ATHLETIC EXECUTION.</span>
            </h2>
            <p className="text-sm md:text-base text-zinc-500 dark:text-zinc-400 font-light leading-relaxed tracking-wide">
              Every engineered panel vector, low-profile flatlock seam, and localized compression mapping zone runs down to explicit human anatomy. We completely remove superficial design aesthetics to present absolute, distraction-free equipment that outlasts heavy operational routines.
            </p>
            <div className="pt-2">
              <Button 
                size="lg"
                className="bg-black dark:bg-white text-white dark:text-black hover:bg-zinc-800 dark:hover:bg-zinc-200 rounded-none h-12 px-10 uppercase text-xs font-black tracking-widest transition-transform active:scale-95"
                asChild
              >
                <Link href="/about">
                  EXPLORE ARCHITECTURE
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
              className="absolute inset-0 bg-cover bg-center grayscale contrast-[1.2] brightness-[0.8] dark:brightness-[0.6]"
              style={{
                backgroundImage: `url('https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=2070&auto=format&fit=crop')`
              }}
            />
          </motion.div>
        </div>
      </section>

      {/* 4. FINALE BRUTALIST CALL TO ACTION TERMINAL */}
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
              ARMOR YOUR FRAMEWORK.
            </h2>
            <p className="text-sm md:text-base text-zinc-500 dark:text-zinc-400 font-light max-w-xl mx-auto leading-relaxed tracking-wide">
              Deploy raw sporting utility hidden completely beneath an aesthetic of extreme tactical restraint. Access elite technical garments built to survive the heaviest strain blocks.
            </p>
            <div className="pt-4">
              <Button 
                size="lg" 
                className="bg-black dark:bg-white text-white dark:text-black hover:bg-zinc-800 dark:hover:bg-zinc-200 rounded-none h-14 px-16 uppercase text-xs font-black tracking-[0.3em] transition-transform active:scale-95"
                asChild
              >
                <Link href="/shop">
                  DEPLOY EQUIPMENT
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}