"use client"

import { useSearchParams } from "next/navigation"
import { useMemo, useEffect, useState, Suspense } from "react"
import { matchProducts } from "@/lib/utils/quiz-matcher"
import { createStaticClient } from "@/lib/supabase/static"
import { Product } from "@/lib/types/product"
import { ProductCard } from "@/components/products/product-card"
import { motion } from "framer-motion"
import { Activity, Cpu, Crosshair } from "lucide-react"

interface Stats {
  primaryCategory: string;
  displayTitle: string;
  description: string;
  percentages: { name: string; value: number }[];
}

// Hardcoded advanced dictionary
const ARCHETYPE_DATA: Record<string, { title: string, desc: string }> = {
  minimalist: { title: "Minimalist", desc: "You demand gravity-defying weightlessness and zero distractions. Your apparel is an invisible layer." },
  grinder: { title: "Grinder", desc: "You survive on friction. You require heavy-duty, high-tension gear built for extreme repetition and durability." },
  hybrid: { title: "Hybrid", desc: "You transition between disciplines seamlessly. You need highly versatile, intelligent utility gear." },
  vanguard: { title: "Vanguard", desc: "You blend elite athletic performance with sharp aesthetic presentation. Structure and style are paramount." },
  anomaly: { title: "The Anomaly", desc: "SYSTEM ERROR. Perfectly balanced metrics detected. You defy standard categorization. You require the highest tier of adaptable equipment." }
};

function QuizResultsContent() {
  const searchParams = useSearchParams()
  const [products, setProducts] = useState<Product[]>([])
  const easeQuint = [0.16, 1, 0.3, 1]

  // 1. PARSE PAYLOAD (Defined first)
  const rawData = useMemo(() => {
    try { return JSON.parse(decodeURIComponent(searchParams.get('data') || '{}')) } catch { return {} }
  }, [searchParams])

  // 2. ALGORITHM (Defined second, depends on rawData)
  const stats = useMemo<Stats | null>(() => {
    const entries = Object.entries(rawData) as [string, number][];
    if (entries.length === 0) return null;

    const totalScore = entries.reduce((sum, [, score]) => sum + score, 0);
    const sorted = [...entries].sort((a, b) => b[1] - a[1]);
    
    const primary = sorted[0][0];
    const secondary = sorted[1][0];

    const isAnomaly = sorted[0][1] > 0 && sorted[0][1] === sorted[3][1];

    const percentages = sorted.map(([key, val]) => ({
      name: key,
      value: Math.round((val / totalScore) * 100) || 0
    }));

    return {
      primaryCategory: isAnomaly ? 'hybrid' : primary,
      displayTitle: isAnomaly ? "THE ANOMALY" : `THE ${primary.toUpperCase()}-CLASS ${secondary.toUpperCase()}`,
      description: isAnomaly ? ARCHETYPE_DATA.anomaly.desc : ARCHETYPE_DATA[primary]?.desc,
      percentages
    }
  }, [rawData])

  // 3. LOG ANALYTICS (Defined third, depends on stats and rawData)
  useEffect(() => {
    async function logAnalytics() {
      if (!stats) return;
      const supabase = createStaticClient();
      
      // We add 'as any' to tell TypeScript to bypass the strict check
      await (supabase.from('quiz_analytics') as any).insert({
        archetype_result: stats.primaryCategory,
        score_data: rawData
      });
    }
    logAnalytics();
  }, [stats, rawData]);

  // 4. FETCH PRODUCTS (Defined fourth)
  useEffect(() => {
    async function fetchProducts() {
      if (!stats) return;
      const supabase = createStaticClient()
      const { data: allProducts } = await supabase.from('products').select('*')
      if (allProducts) {
        setProducts(matchProducts(allProducts as Product[], stats.primaryCategory as any))
      }
    }
    fetchProducts()
  }, [stats])

  if (!stats) return null;

  return (
    <div className="max-w-6xl mx-auto px-6 space-y-16">
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 border-b border-zinc-100 dark:border-zinc-900 pb-16">
        
        {/* LEFT: THE DIAGNOSTIC READOUT */}
        <div className="lg:col-span-7 space-y-6 text-left">
          <div className="flex items-center gap-3 text-[10px] font-mono tracking-[0.5em] text-zinc-400 uppercase">
            <Crosshair className="w-4 h-4" />
            <span>PROFILE VERIFIED</span>
          </div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: easeQuint }}
            className="text-4xl md:text-5xl lg:text-7xl font-black tracking-tighter uppercase leading-[0.9] text-zinc-950 dark:text-white"
          >
            {stats.displayTitle}.
          </motion.h1>
          
          <p className="text-base md:text-lg text-zinc-500 font-light leading-relaxed tracking-wide pt-4 max-w-xl">
            {stats.description}
          </p>
        </div>

        {/* RIGHT: THE STAT MATRIX */}
        <div className="lg:col-span-5 bg-zinc-50 dark:bg-[#0C0C10] border border-zinc-100 dark:border-zinc-900 p-8">
          <h3 className="text-[10px] font-mono uppercase tracking-widest text-zinc-400 mb-8 border-b border-zinc-200 dark:border-zinc-800 pb-4">
            // Psychological Load Matrix
          </h3>
          <div className="space-y-6">
            {stats.percentages.map((stat, i) => (
              <motion.div 
                key={stat.name}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="space-y-2"
              >
                <div className="flex justify-between text-xs font-black uppercase tracking-widest">
                  <span className="text-zinc-950 dark:text-white">{stat.name}</span>
                  <span className="font-mono text-zinc-500">{stat.value}%</span>
                </div>
                <div className="w-full h-1.5 bg-zinc-200 dark:bg-zinc-900 overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${stat.value}%` }}
                    transition={{ duration: 1, delay: 0.5 + (i * 0.1), ease: "easeOut" }}
                    className="h-full bg-zinc-950 dark:bg-white"
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* MATCHED HARDWARE EQUIPMENT INDEX */}
      <div className="space-y-8">
        <div className="flex items-center gap-3 text-zinc-400 dark:text-zinc-600">
          <Cpu className="w-4 h-4 stroke-[1.5]" />
          <span className="text-[10px] font-mono uppercase tracking-widest">// RECOMMENDED HARDWARE PROTOCOL</span>
        </div>

        {products.length === 0 ? (
          <div className="border border-zinc-100 dark:border-zinc-900 p-12 text-center font-mono text-xs uppercase text-zinc-400 tracking-widest">
            Scanning datastore pipelines for compatible specs...
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
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

export default function QuizResultsPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-[#08080A] text-zinc-900 dark:text-zinc-100 font-sans antialiased transition-colors duration-500 py-32 md:py-44 relative">
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] dark:opacity-[0.02] bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:40px_40px] z-0" />
      <Suspense fallback={
        <div className="min-h-[60vh] w-full flex flex-col items-center justify-center space-y-4 font-mono text-[10px] uppercase tracking-[0.3em] text-zinc-400">
          <Activity className="w-5 h-5 animate-pulse text-zinc-950 dark:text-white stroke-[1.5]" />
          <span>// PARSING ANATOMICAL LOAD VECTORS...</span>
        </div>
      }>
        <QuizResultsContent />
      </Suspense>
    </div>
  )
}