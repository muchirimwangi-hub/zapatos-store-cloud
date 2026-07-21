"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ArrowRight, Activity, Cpu, ShieldAlert } from "lucide-react"
import Link from "next/link"

export default function HomePage() {
  const easeQuint = [0.16, 1, 0.3, 1]

  // 1. ATMOSPHERIC WEATHER STATE
  const [weather, setWeather] = useState<{
    theme: "default" | "sunny" | "rainy" | "cloudy"
    temp: number | null
    label: string
  }>({
    theme: "default",
    temp: null,
    label: "DETECTING LOCAL ATMOSPHERE...",
  })

  // 2. SILENT IP & WEATHER FETCH (No Browser Popups)
  useEffect(() => {
    async function fetchLocalAtmosphere() {
      try {
        const ipRes = await fetch("https://ipapi.co/json/")
        const { latitude, longitude, city } = await ipRes.json()

        if (!latitude || !longitude) return

        const meteoRes = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`
        )
        const data = await meteoRes.json()
        const code = data.current_weather.weathercode
        const temp = Math.round(data.current_weather.temperature)

        let theme: "default" | "sunny" | "rainy" | "cloudy" = "default"
        let label = `OPTIMAL // ${city ? city.toUpperCase() : "LOCAL"}`

        // WMO Weather Code Mapping
        if (code === 0 || code === 1) {
          theme = "sunny"
          label = `CLEAR SKY // ${city ? city.toUpperCase() : "LOCAL"}`
        } else if ((code >= 51 && code <= 82) || code >= 95) {
          theme = "rainy"
          label = `PRECIPITATION // ${city ? city.toUpperCase() : "LOCAL"}`
        } else if ((code >= 2 && code <= 3) || (code >= 45 && code <= 48)) {
          theme = "cloudy"
          label = `OVERCAST // ${city ? city.toUpperCase() : "LOCAL"}`
        }

        setWeather({ theme, temp, label })
      } catch (error) {
        setWeather({ theme: "default", temp: null, label: "ATMOSPHERE: STANDARD" })
      }
    }

    fetchLocalAtmosphere()
  }, [])

  // 3. DYNAMIC GRADIENT MAPPING FOR HERO VIGNETTE
  const atmosphericOverlays: Record<string, string> = {
    default: "from-black/60 via-zinc-950/50 to-white dark:to-[#08080A]",
    sunny: "from-amber-950/40 via-zinc-950/60 to-white dark:to-[#08080A]",
    rainy: "from-slate-900/80 via-blue-950/50 to-white dark:to-[#08080A]",
    cloudy: "from-zinc-900/80 via-zinc-950/70 to-white dark:to-[#08080A]",
  }

  return (
    <div className="min-h-screen bg-white dark:bg-[#08080A] text-zinc-900 dark:text-zinc-100 font-sans antialiased transition-colors duration-500 selection:bg-black selection:text-white dark:selection:bg-white dark:selection:text-black">
      
      {/* MINIMALIST GEOMETRIC BACKGROUND OVERLAY */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] dark:opacity-[0.02] bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:40px_40px] z-20" />

      {/* 1. HERO BLOCK WITH PARALLAX & WEATHER BACKDROP */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden border-b border-zinc-100 dark:border-zinc-900/80 bg-black attachment-fixed">
        
        {/* High-Resolution Performance Media Backdrop */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          {/* Mobile Fallback Container */}
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

          {/* DYNAMIC ATMOSPHERIC VIGNETTE LAYER */}
          <div className={`absolute inset-0 bg-gradient-to-b ${atmosphericOverlays[weather.theme]} transition-all duration-1000 z-10`} />

          {/* ⚡ CINEMATIC WEATHER ENGINE ⚡ */}
          <div className="absolute inset-0 pointer-events-none z-20 overflow-hidden">
            
            {/* 🌧️ RAIN EFFECT (30 high-speed vertical streaks) */}
            {weather.theme === "rainy" && (
              <>
                {[...Array(30)].map((_, i) => {
                  const leftPos = (i * 13 + 7) % 100
                  const delay = (i * 0.17) % 1.2
                  const duration = 0.5 + ((i * 0.09) % 0.4)
                  return (
                    <motion.div
                      key={`rain-${i}`}
                      className="absolute top-0 w-[1px] bg-gradient-to-b from-transparent via-white/40 to-white/80"
                      style={{
                        left: `${leftPos}%`,
                        height: `${35 + ((i * 11) % 45)}px`,
                      }}
                      initial={{ y: "-100px", opacity: 0 }}
                      animate={{ y: "100vh", opacity: [0, 1, 1, 0] }}
                      transition={{
                        repeat: Infinity,
                        duration: duration,
                        delay: delay,
                        ease: "linear",
                      }}
                    />
                  )
                })}
              </>
            )}

            {/* ☀️ SUNNY EFFECT (Golden Hour Optical Light Leak & Solar Flare) */}
            {weather.theme === "sunny" && (
              <>
                {/* Primary Top-Right Solar Flare (Dawn Training Glare) */}
                <motion.div 
                  className="absolute -top-[25%] -right-[15%] w-[65vw] h-[65vw] max-w-[800px] max-h-[800px] rounded-full bg-gradient-to-br from-amber-500/25 via-orange-500/10 to-transparent blur-[120px]"
                  animate={{ 
                    scale: [1, 1.15, 1],
                    opacity: [0.35, 0.65, 0.35]
                  }}
                  transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                />
                {/* Secondary Warm Floor Reflection / Bounce Light */}
                <motion.div 
                  className="absolute -bottom-[20%] left-[10%] w-[50vw] h-[400px] rounded-full bg-gradient-to-tr from-amber-700/15 via-yellow-600/5 to-transparent blur-[100px]"
                  animate={{ opacity: [0.15, 0.4, 0.15] }}
                  transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 2 }}
                />
              </>
            )}

            {/* ☁️ CLOUDY EFFECT (Drifting Alpine Mist & Studio Fog Bands) */}
            {weather.theme === "cloudy" && (
              <>
                {/* Primary Alpine Mist Band Drifting Left to Right */}
                <motion.div 
                  className="absolute top-[25%] -left-[30%] w-[80vw] h-[350px] rounded-full bg-gradient-to-r from-transparent via-zinc-300/15 to-transparent blur-[100px]"
                  animate={{ 
                    x: ["0vw", "60vw", "0vw"],
                    opacity: [0.2, 0.5, 0.2]
                  }}
                  transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
                />
                {/* Secondary Heavy Fog Band Drifting Right to Left */}
                <motion.div 
                  className="absolute bottom-[15%] -right-[30%] w-[90vw] h-[450px] rounded-full bg-gradient-to-l from-transparent via-slate-200/10 to-transparent blur-[130px]"
                  animate={{ 
                    x: ["0vw", "-60vw", "0vw"],
                    opacity: [0.15, 0.45, 0.15]
                  }}
                  transition={{ duration: 28, repeat: Infinity, ease: "easeInOut", delay: 4 }}
                />
              </>
            )}

          </div>
        </div>

        {/* Hero Content Panel */}
        <div className="relative z-30 max-w-6xl mx-auto px-6 text-center space-y-8 pt-24">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: easeQuint }}
            className="space-y-6"
          >
            {/* TACTICAL ATMOSPHERE INDICATOR */}
            <div className="inline-flex items-center justify-center gap-2 px-3 py-1 bg-white/5 border border-white/10 backdrop-blur-md">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <p className="text-[10px] font-mono uppercase tracking-[0.3em] text-zinc-300">
                {weather.label} {weather.temp !== null && `[ ${weather.temp}°C ]`}
              </p>
            </div>

            <p className="text-[10px] font-mono uppercase tracking-[0.5em] text-white/90 dark:text-zinc-400 font-bold block">
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