"use client"

import { motion } from "framer-motion"
import { Sparkles, Heart, Leaf } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="py-24 bg-zapatos-taupe/10">
        <div className="container mx-auto px-6 lg:px-12 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <p className="text-sm uppercase tracking-[0.3em] text-zapatos-gold mb-4">
              Our Story
            </p>
            <h1 className="text-5xl md:text-6xl font-serif font-light mb-6">
              About Zapatos
            </h1>
            <p className="text-lg text-zapatos-charcoal/80 editorial-spacing max-w-2xl mx-auto">
              Zapatos is a Nigerian beauty and personal
care brand specialising in fragrances and body care
essentials. We exist to bring luxury-inspired personal care
within reach, without compromising on quality or
experience.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Story */}
      <section className="py-24">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <div
                className="aspect-[4/5] luxury-border bg-cover bg-center"
                style={{
                  backgroundImage: `url('https://res.cloudinary.com/dufw6bsko/image/upload/v1776244279/WhatsApp_Image_2026-04-10_at_23.03.00_dndroq.jpg')`,
                }}
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="space-y-6"
            >
              <h2 className="text-4xl font-serif font-light">
                Crafted With Intention
              </h2>
              <p className="text-zapatos-charcoal/80 editorial-spacing">
               Through our signature Scent Personality Test, we cut
through the noise of endless options and curate
recommendations tailored to each customer's unique
identity and lifestyle. Every client leaves with more than a
product, they leave with a scent that is unmistakably
theirs.

              </p>
              <p className="text-zapatos-charcoal/80 editorial-spacing">
               We speak to the Aspirational Modern Professional,
someone who understands that how you smell is part of
how you show up in the world.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-24 bg-zapatos-taupe/10">
        <div className="container mx-auto px-6 lg:px-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-serif font-light mb-4">
              What We Stand For
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-5xl mx-auto">
            {[
              {
                icon: Sparkles,
                title: "Accessible Luxury",
                description:
                  "Premium quality without the premium price tag, because true luxury is how it feels, not what it costs.",
              },
              {
                icon: Heart,
                title: "Personal Connection",
                description:
                  "Our thoughtfully designed quiz gets to know your preferences, guiding you to products that feel effortless, personal, and true to your individuality.",
              },
              {
                icon: Leaf,
                title: "Conscious Beauty",
                description:
                  "We source original products from brands that value quality and mindful practices, with a focus on cleaner ingredients and thoughtful packaging, so you can feel good about every choice.",
              },
            ].map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.15 }}
                className="text-center"
              >
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-zapatos-gold/10 mb-6">
                  <value.icon className="h-6 w-6 text-zapatos-gold" />
                </div>
                <h3 className="text-xl font-serif mb-3">{value.title}</h3>
                <p className="text-sm text-zapatos-charcoal/70 editorial-spacing">
                  {value.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24">
        <div className="container mx-auto px-6 lg:px-12 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl font-serif font-light mb-6">
              Begin Your Journey
            </h2>
            <p className="text-zapatos-charcoal/70 editorial-spacing max-w-xl mx-auto mb-8">
              Discover what makes you unique with our personality quiz, or 
              explore our collection at your own pace.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild>
                <Link href="/quiz">Take the Quiz</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/shop">Explore Collection</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
