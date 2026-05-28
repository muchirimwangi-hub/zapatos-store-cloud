"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"

export default function AboutPage() {
  const easeQuint = [0.16, 1, 0.3, 1]

  const lineVariants = {
    initial: { scaleX: 0 },
    animate: { scaleX: 1, transition: { duration: 1, ease: easeQuint } }
  }

  return (
    <div className="min-h-screen bg-white dark:bg-[#08080A] text-black dark:text-white font-sans antialiased selection:bg-black selection:text-white dark:selection:bg-white dark:selection:text-black transition-colors duration-500">
      
      {/* MINIMALIST BACKGROUND LAYOUT LINES */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] dark:opacity-[0.02] bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:40px_40px]" />

      {/* 1. HERO MANIFESTO: MONOLITHIC STRUCTURAL TYPOGRAPHY */}
      <section className="relative pt-48 pb-24 md:pt-64 md:pb-36 border-b border-zinc-100 dark:border-zinc-900/80">
        <div className="max-w-6xl mx-auto px-6 space-y-12">
          
          <div className="flex items-center justify-between text-[10px] font-mono tracking-[0.5em] text-zinc-400 dark:text-zinc-600 uppercase">
            <span>ZAPATOS CAVE MANIFESTO</span>
            <span>ESTABLISHED 2026</span>
          </div>

          <div className="space-y-4">
            <motion.h1
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.9, ease: easeQuint }}
              className="text-6xl sm:text-8xl lg:text-9xl font-black tracking-tighter uppercase leading-[0.85] text-zinc-950 dark:text-white"
            >
              RAW UTILITY.<br />
              <span className="text-zinc-300 dark:text-zinc-800">ZERO EXCESS.</span>
            </motion.h1>
          </div>

          <motion.div 
            variants={lineVariants}
            initial="initial"
            animate="animate"
            className="w-full h-[1px] bg-zinc-900 dark:bg-zinc-800"
          />

          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pt-4">
            <div className="md:col-span-4 text-[11px] font-mono tracking-widest text-zinc-400 dark:text-zinc-500 uppercase">
              OUR MISSION
            </div>
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: easeQuint }}
              className="md:col-span-8 text-base md:text-lg text-zinc-600 dark:text-zinc-400 font-light leading-relaxed tracking-wide"
            >
              Zapatos Cave is a premium athleisure brand designing high-performance compression wear, luxury tracksuits, and elite training apparel. We create sophisticated garments exclusively for individuals who manage their physical conditioning and lifestyle with absolute precision.
            </motion.p>
          </div>
        </div>
      </section>

      {/* 2. BRUTALIST MEDIA DISPLAY */}
      <section className="py-20 bg-zinc-50 dark:bg-[#0C0C10] border-b border-zinc-100 dark:border-zinc-900/60 transition-colors duration-500">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, ease: easeQuint }}
            className="relative aspect-[16/8] w-full bg-zinc-100 dark:bg-zinc-900 overflow-hidden border border-zinc-200 dark:border-zinc-800"
          >
            <Image 
              src="https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=2070&auto=format&fit=crop" 
              alt="Premium performance apparel training"
              fill
              priority
              className="object-cover grayscale contrast-[1.2] brightness-[0.9] dark:brightness-[0.65] dark:contrast-[1.25] transition-transform duration-[4000ms] ease-out hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-zinc-50 via-transparent to-transparent dark:from-[#0C0C10]" />
          </motion.div>
        </div>
      </section>

      {/* 3. SPLIT DESIGN PHILOSOPHY */}
      <section className="py-32 bg-white dark:bg-[#08080A] border-b border-zinc-100 dark:border-zinc-900/80 transition-colors duration-500">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-16">
          <div className="lg:col-span-4 space-y-4">
            <span className="text-[10px] font-mono text-zinc-400 dark:text-zinc-600 tracking-widest uppercase">DESIGN PHILOSOPHY</span>
            <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tighter text-zinc-950 dark:text-white leading-none">
              BUILT FOR <br />
              KINETIC <br />
              <span className="text-zinc-300 dark:text-zinc-700">MOVEMENT.</span>
            </h2>
          </div>
          
          <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-12 text-zinc-500 dark:text-zinc-400 font-light leading-relaxed tracking-wide text-sm md:text-base">
            <div className="space-y-4">
              <div className="h-[1px] w-8 bg-zinc-900 dark:bg-white" />
              <p>
                We completely reject standard, mass-market decorative textiles. Every structural panel, double-knit fabric finish, and flatlock stitch line is mapped intentionally to enhance your body’s natural range of motion. Our apparel minimizes friction, handles high training stress, and stabilizes active muscles.
              </p>
            </div>
            <div className="space-y-4">
              <div className="h-[1px] w-8 bg-zinc-300 dark:bg-zinc-800" />
              <p>
                Our collections are curated directly for the modern professional. For individuals who view physical consistency, sharp aesthetic presentation, and personal performance as one unified target.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. FABRIC TECHNOLOGY INDEX */}
      <section className="py-36 bg-zinc-50 dark:bg-[#0C0C10] border-b border-zinc-100 dark:border-zinc-900/80 transition-colors duration-500">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-16 md:gap-12">
            {[
              {
                idx: "01 FABRIC",
                title: "Premium Advanced Synthetics",
                description: "Heavyweight nylon-spandex stretch blends engineered to manage moisture, dissipate heat, and retain their perfect shape over extensive active wear.",
              },
              {
                idx: "02 FIT",
                title: "Anatomical Panel Mapping",
                description: "Garment panels tailored specifically along natural muscle trajectories, keeping posture aligned while offering entirely unrestrained mobility.",
              },
              {
                idx: "03 STYLE",
                title: "Minimalist Performance Standards",
                description: "Completely stripped of unnecessary visual clutter. Crafted carefully to focus on structural strength, clean lines, and long-lasting fabric durability.",
              },
            ].map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.12, ease: easeQuint }}
                className="p-8 bg-white dark:bg-[#08080A] border border-zinc-200 dark:border-zinc-900 group hover:border-zinc-900 dark:hover:border-zinc-700 transition-all duration-300 rounded-none shadow-sm dark:shadow-none"
              >
                <div className="text-4xl font-black font-mono tracking-tighter text-zinc-200 dark:text-zinc-800 group-hover:text-zinc-900 dark:group-hover:text-white transition-colors duration-300">
                  {value.idx.split(" ")[0]}
                </div>
                <div className="text-[9px] font-mono text-zinc-400 uppercase tracking-widest mt-1 mb-6">
                  {value.idx.split(" ")[1] || ""}
                </div>
                <div className="space-y-2">
                  <h3 className="text-xs uppercase tracking-widest font-black text-zinc-950 dark:text-white">{value.title}</h3>
                  <p className="text-xs md:text-sm text-zinc-500 dark:text-zinc-400 font-light leading-relaxed">
                    {value.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. FINALE CALL TO ACTION */}
      <section className="py-44 bg-white dark:bg-[#08080A] transition-colors duration-500">
        <div className="max-w-4xl mx-auto px-6 text-center space-y-8">
          <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter text-zinc-950 dark:text-white leading-none">
            ELEVATE YOUR ATHLETIC WEAR.
          </h2>
          <p className="text-zinc-400 dark:text-zinc-500 font-light text-sm md:text-base max-w-md mx-auto leading-relaxed tracking-wide">
            Explore activewear tailored with high-end fabric performance and premium aesthetic restraint.
          </p>
          <div className="pt-4">
            <Button 
              size="lg" 
              className="bg-black dark:bg-white text-white dark:text-black hover:bg-zinc-800 dark:hover:bg-zinc-200 rounded-none h-14 px-16 uppercase text-xs font-black tracking-[0.3em] border border-black dark:border-white transition-transform active:scale-95"
              asChild
            >
              <Link href="/shop">EXPLORE APPAREL</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}