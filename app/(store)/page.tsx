"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ArrowRight, Sparkles } from "lucide-react"
import Link from "next/link"

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-24 pb-20">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <motion.div 
            className="absolute inset-0 sm:inset-[-10%] bg-no-repeat"
            style={{
              backgroundImage: `url('https://res.cloudinary.com/dufw6bsko/image/upload/v1772719416/WhatsApp_Image_2026-03-02_at_22.06.22_1_rrmuv8.jpg')`,
              backgroundSize: 'cover',
              backgroundPosition: 'center top',
            }}
            initial={{ scale: 1.15, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 2.5, ease: "easeOut" }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-zapatos-obsidian/40 via-zapatos-obsidian/20 to-zapatos-cream" />
        </div>

        {/* Content */}
        <div className="relative z-10 container mx-auto px-6 lg:px-12 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
          >
            <p className="text-sm uppercase tracking-[0.3em] text-zapatos-cream/90 mb-6 editorial-spacing">
              Beauty, Thoughtfully Curated
            </p>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif font-light text-zapatos-cream mb-8 leading-tight">
              Discover Your
              <br />
              <span className="italic">Aura</span>
            </h1>
            <p className="text-lg md:text-xl text-zapatos-cream/80 max-w-2xl mx-auto mb-12 editorial-spacing">
              Experience Luxury-Inspired Personal Care, Without Compromise.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button 
                size="lg" 
                className="group text-base px-10 py-6 bg-zapatos-cream text-zapatos-obsidian hover:bg-white"
                asChild
              >
                <Link href="/shop">
                  Explore Collection
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="group text-base px-10 py-6 border-zapatos-cream text-zapatos-cream hover:bg-zapatos-cream/10"
                asChild
              >
                <Link href="/quiz">
                  <Sparkles className="mr-2 h-5 w-5" />
                  Discover Your Aura
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Featured Categories */}
      <section className="py-24 container mx-auto px-6 lg:px-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-serif font-light mb-4">
            Shop by Category
          </h2>
          <p className="text-zapatos-charcoal/70 editorial-spacing">
            Find What Feels Like You
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {[
            {
              title: "Fragrance",
              description: "Artisanal scents that tell your story",
              image: "https://res.cloudinary.com/dufw6bsko/image/upload/v1776244280/WhatsApp_Image_2026-04-10_at_23.03.01_xbmmcc.jpg",
              href: "/shop/fragrance"
            },
            {
              title: "Body Care",
              description: "Affordable luxury rituals from head to toe",
              image: "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=800&q=80",
              href: "/shop/bodycare"
            }
          ].map((category, index) => (
            <motion.div
              key={category.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Link href={category.href} className="group block">
                <div className="relative aspect-[3/4] overflow-hidden luxury-border mb-4">
                  <div 
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                    style={{ backgroundImage: `url('${category.image}')` }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-zapatos-obsidian/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </div>
                <h3 className="text-2xl font-serif mb-2 group-hover:text-zapatos-gold transition-colors">
                  {category.title}
                </h3>
                <p className="text-sm text-zapatos-charcoal/70 editorial-spacing">
                  {category.description}
                </p>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Experience Section */}
      <section className="py-24 bg-zapatos-taupe/20">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <p className="text-sm uppercase tracking-[0.3em] text-zapatos-gold mb-4">
                The Scent Personality Test
              </p>
              <h2 className="text-4xl md:text-5xl font-serif font-light mb-6">
                Embrace Your
                <br />
                <span className="italic">Zapatos</span>
              </h2>
              <p className="text-lg text-zapatos-charcoal/80 editorial-spacing mb-8">
                Our signature Scent Personality Test cuts through the noise of endless options 
                and curates recommendations tailored to your unique identity and lifestyle. 
                Leave with more than a product, leave with a scent that is unmistakably yours.
              </p>
              <Button size="lg" asChild>
                <Link href="/quiz">
                  Begin Your Consultation
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative aspect-square"
            >
              <div 
                className="absolute inset-0 bg-cover bg-center luxury-border"
                style={{
                  backgroundImage: `url('https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800&q=80')`
                }}
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Gift Curator CTA */}
      <section className="py-24">
        <div className="container mx-auto px-6 lg:px-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="luxury-border p-12 md:p-16 text-center"
          >
            <h2 className="text-4xl md:text-5xl font-serif font-light mb-6">
              Create the Perfect Gift
            </h2>
            <p className="text-lg text-zapatos-charcoal/80 editorial-spacing max-w-2xl mx-auto mb-8">
             Curate a personalized gift box, infuse it with a heartfelt message, and transform a simple gesture into a cherished memory.
            </p>
            <Button size="lg" variant="outline" asChild>
              <Link href="/gift-curator">
                Start Curating
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
