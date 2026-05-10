"use client"

import { Suspense, useEffect, useMemo, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Sparkles, ArrowRight, RotateCcw } from "lucide-react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ProductCard } from "@/components/products/product-card"
import { calculatePersonalityType, getPersonalityDescription, matchProducts } from "@/lib/utils/quiz-matcher"
import { createStaticClient } from "@/lib/supabase/static"
import type { QuizResponse } from "@/lib/types/quiz"
import type { Product } from "@/lib/types/product"

function ResultsContent() {
  const searchParams = useSearchParams()
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [revealed, setRevealed] = useState(false)

  const responsesData = searchParams.get('data')
  const categoryParam = searchParams.get('category') as 'fragrance' | 'bodycare' || 'fragrance'
  const responses: QuizResponse[] = useMemo(
    () => responsesData ? JSON.parse(decodeURIComponent(responsesData)) : [],
    [responsesData]
  )

  const personalityType = useMemo(() => calculatePersonalityType(responses, categoryParam), [responses, categoryParam])
  const personality = getPersonalityDescription(personalityType)
  const traits = getPersonalityTraits(personalityType)

  useEffect(() => {
    async function loadProducts() {
      const supabase = createStaticClient()
      const { data } = await supabase
        .from('products')
        .select('*')
        .eq('is_active', true)
        .eq('category', categoryParam)

      if (data) {
        const matched = matchProducts(data as Product[], responses, personalityType, categoryParam)
        setProducts(matched.length > 0 ? matched : data.slice(0, 4) as Product[])
      }
      setIsLoading(false)
    }

    loadProducts()

    // Stagger the reveal
    const timer = setTimeout(() => setRevealed(true), 600)
    return () => clearTimeout(timer)
  }, [responses, personalityType, categoryParam])

  return (
    <div className="min-h-screen">
      {/* Hero reveal section — dark bg */}
      <section className="relative bg-zapatos-obsidian overflow-hidden py-32 md:py-40">
        {/* Ambient glow */}
        <div className="absolute inset-0 pointer-events-none">
          <motion.div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full"
            style={{
              background: 'radial-gradient(circle, rgba(183,110,121,0.12) 0%, transparent 60%)',
            }}
            animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
            transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
          />
        </div>

        <div className="relative z-10 container mx-auto px-6 lg:px-12 text-center">
          {/* Sparkle icon */}
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="inline-flex items-center justify-center w-20 h-20 rounded-full border border-zapatos-gold/30 mb-8"
          >
            <Sparkles className="h-9 w-9 text-zapatos-gold" />
          </motion.div>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-sm uppercase tracking-[0.3em] text-zapatos-gold mb-6"
          >
            Your Aura Revealed
          </motion.p>

          {/* Personality title */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="text-5xl md:text-7xl lg:text-8xl font-serif font-light text-zapatos-cream mb-8 leading-tight"
          >
            {personality.title}
          </motion.h1>

          {/* Decorative line */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="h-[1px] w-32 mx-auto mb-8 bg-gradient-to-r from-transparent via-zapatos-gold to-transparent"
          />

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1 }}
            className="text-lg md:text-xl text-zapatos-cream/70 max-w-2xl mx-auto editorial-spacing"
          >
            {personality.description}
          </motion.p>
        </div>
      </section>

      {/* Traits section */}
      <section className="py-20 bg-zapatos-cream">
        <div className="container mx-auto px-6 lg:px-12 max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={revealed ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <p className="text-sm uppercase tracking-[0.3em] text-zapatos-gold mb-3">
              Your Signature Traits
            </p>
            <h2 className="text-3xl md:text-4xl font-serif font-light">
              What Defines You
            </h2>
          </motion.div>

          <div className="flex flex-wrap justify-center gap-3">
            {traits.map((trait, index) => (
              <motion.div
                key={trait}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={revealed ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="px-6 py-3 border border-zapatos-taupe/40 bg-white text-sm uppercase tracking-[0.15em] text-zapatos-charcoal/80 hover:border-zapatos-gold hover:text-zapatos-gold transition-colors duration-300"
              >
                {trait}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Recommended Products */}
      <section className="py-20 bg-zapatos-taupe/10">
        <div className="container mx-auto px-6 lg:px-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-14"
          >
            <p className="text-sm uppercase tracking-[0.3em] text-zapatos-gold mb-3">
              Your Bespoke Collection
            </p>
            <h2 className="text-3xl md:text-4xl font-serif font-light mb-4">
              Curated Just For You
            </h2>
            <p className="text-zapatos-charcoal/60 editorial-spacing max-w-xl mx-auto">
              {categoryParam === 'fragrance' ? 'Fragrances' : 'Body care rituals'} handpicked
              to complement your unique aura.
            </p>
          </motion.div>

          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="space-y-4">
                  <div className="aspect-[3/4] bg-zapatos-taupe/20 luxury-border animate-pulse" />
                  <div className="h-4 w-24 bg-zapatos-taupe/20 rounded animate-pulse" />
                  <div className="h-6 w-full bg-zapatos-taupe/20 rounded animate-pulse" />
                  <div className="h-4 w-16 bg-zapatos-taupe/20 rounded animate-pulse" />
                </div>
              ))}
            </div>
          ) : products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {products.map((product, index) => (
                <ProductCard key={product.id} product={product} index={index} />
              ))}
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16 luxury-border bg-white"
            >
              <Sparkles className="h-10 w-10 text-zapatos-gold mx-auto mb-4" />
              <p className="text-lg font-serif mb-2">Your collection is being curated</p>
              <p className="text-zapatos-charcoal/60 mb-8 editorial-spacing max-w-md mx-auto">
                We&rsquo;re hand-selecting products for your profile. In the meantime, explore our full collection.
              </p>
              <Button asChild>
                <Link href="/shop">
                  Browse All Products
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </motion.div>
          )}
        </div>
      </section>

      {/* Actions */}
      <section className="py-20 bg-zapatos-cream">
        <div className="container mx-auto px-6 lg:px-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h2 className="text-3xl font-serif font-light mb-8">
              What Would You Like to Do Next?
            </h2>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="text-base px-10 py-6" asChild>
                <Link href="/shop">
                  Explore Full Collection
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="text-base px-10 py-6" asChild>
                <Link href="/quiz">
                  <RotateCcw className="mr-2 h-4 w-4" />
                  Retake Consultation
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

function getPersonalityTraits(type: string): string[] {
  const traitMap: Record<string, string[]> = {
    sophisticated_minimalist: ['Refined', 'Intentional', 'Quality-Focused', 'Timeless', 'Elegant', 'Curated'],
    bold_adventurer: ['Daring', 'Unique', 'Confident', 'Expressive', 'Adventurous', 'Statement-Making'],
    gentle_romantic: ['Soft', 'Classic', 'Nurturing', 'Elegant', 'Delicate', 'Graceful'],
    fresh_natural: ['Pure', 'Organic', 'Effortless', 'Authentic', 'Clean', 'Balanced'],
    warm_sensual: ['Indulgent', 'Rich', 'Intimate', 'Luxurious', 'Enveloping', 'Sensory'],
    elegant_classic: ['Sophisticated', 'Versatile', 'Balanced', 'Refined', 'Heritage', 'Timeless'],
  }

  return traitMap[type] || traitMap.elegant_classic
}

export default function QuizResultsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-zapatos-obsidian flex items-center justify-center">
        <motion.div
          className="w-12 h-12 rounded-full border-2 border-zapatos-gold/20"
          style={{ borderTopColor: '#B76E79' }}
          animate={{ rotate: 360 }}
          transition={{ duration: 1.2, repeat: Infinity, ease: 'linear' }}
        />
      </div>
    }>
      <ResultsContent />
    </Suspense>
  )
}
