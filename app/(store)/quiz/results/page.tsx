"use client"

import { useSearchParams } from "next/navigation"
import { useMemo, useEffect, useState, Suspense } from "react"
import { getArchetypeDetails, matchProducts, Archetype } from "@/lib/utils/quiz-matcher"
import { createStaticClient } from "@/lib/supabase/static"
import { Product } from "@/lib/types/product"
import { ProductCard } from "@/components/products/product-card"
import { motion } from "framer-motion"
import { Activity, Cpu, ShieldCheck } from "lucide-react"

// 1. ISOLATED CORE DATA COMPONENT (Reads search variables safely)
function QuizResultsContent() {
  const searchParams = useSearchParams()
  const [products, setProducts] = useState<Product[]>([])
  const easeQuint = [0.16, 1, 0.3, 1]
  
  // Parse incoming payload secure string safely
  const data = useMemo(() => {
    try {
      return JSON.parse(decodeURIComponent(searchParams.get('data') || '{}'))
    } catch {
      return {}
    }
  }, [searchParams])
  
  // Calculate dominant tactical archetype node metrics
  const type = useMemo(() => {
    const keys = Object.keys(data)
    if (keys.length === 0) return "SPEED" as Archetype // Safe fallback parameter
    return keys.reduce((a, b) => data[a] > data[b] ? a : b) as Archetype
  }, [data])

  const details = getArchetypeDetails(type)

  // Fetch categorized items matching computed baseline node profile
  useEffect(() => {
    async function fetchProducts() {
      const supabase = createStaticClient()
      const { data: allProducts } = await supabase.from('products').select('*')
      if (allProducts) {
        setProducts(matchProducts(allProducts as Product[], type))
      }
    }
    fetchProducts()
  }, [type])

  return (
    <div className="max-w-6xl mx-auto px-6 space-y-16">
      
      {/* MONOLITHIC SPECIFICATION HEADER */}
      <div className="space-y-6 border-b border-zinc-100 dark:border-zinc-900 pb-12 text-left">
        <div className="flex items-center justify-between text-[10px] font-mono tracking-[0.5em] text-zinc-400 dark:text-zinc-600 uppercase">
          <span>// SYSTEM DIAGNOSTIC OUTPUT</span>
          <span>ARCHETYPE: {type}</span>
        </div>
        
        <motion.h1 
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: easeQuint }}
          className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tighter uppercase leading-none text-zinc-950 dark:text-white"
        >
          {details.title}.
        </motion.h1>
        
        <p className="text-base md:text-lg text-zinc-500 dark:text-zinc-400 font-light max-w-3xl leading-relaxed tracking-wide pt-4">
          {details.description}
        </p>
      </div>

      {/* MATCHED HARDWARE EQUIPMENT INDEX */}
      <div className="space-y-6">
        <div className="flex items-center gap-3 text-zinc-400 dark:text-zinc-600">
          <Cpu className="w-4 h-4 stroke-[1.5]" />
          <span className="text-[10px] font-mono uppercase tracking-widest">// DEPLOYED GEAR SUGGESTIONS</span>
        </div>

        {products.length === 0 ? (
          <div className="border border-zinc-100 dark:border-zinc-900 p-12 text-center font-mono text-xs uppercase text-zinc-400 tracking-widest">
            Scanning datastore pipelines for compatible specs...
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 pt-6">
            {products.map((p) => (
              <div key={p.id} className="transition-all duration-300 hover:border-zinc-400 dark:hover:border-zinc-700">
                <ProductCard product={p} />
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  )
}

// 2. MAIN EXPORT SHIELD: Suspense Wraps the Content to Bypass Prerender Blocks
export default function QuizResultsPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-[#08080A] text-zinc-900 dark:text-zinc-100 font-sans antialiased transition-colors duration-500 py-32 md:py-44 relative">
      
      {/* TECHNICAL DIAGRAM GRID MATRIX */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] dark:opacity-[0.02] bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:40px_40px] z-0" />
      
      <Suspense fallback={
        <div className="min-h-[60vh] w-full flex flex-col items-center justify-center space-y-4 font-mono text-[10px] uppercase tracking-[0.3em] text-zinc-400 dark:text-zinc-600">
          <Activity className="w-5 h-5 animate-pulse text-zinc-950 dark:text-white stroke-[1.5]" />
          <span>// PARSING ANATOMICAL LOAD VECTORS...</span>
        </div>
      }>
        <QuizResultsContent />
      </Suspense>
    </div>
  )
}