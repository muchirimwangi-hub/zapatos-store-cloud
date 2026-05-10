"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Gift, Trash2, ShoppingBag, ArrowRight, Copy, Check, ExternalLink } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Toast } from "@/components/ui/toast"
import { useCartStore } from "@/lib/store/cart-store"
import { formatCurrency } from "@/lib/utils"
import { createClient } from "@/lib/supabase/client"
import type { Json } from "@/lib/supabase/types"

interface ProductSnapshot {
  name: string
  price: number
  image: string
}

interface GiftBoxItem {
  id: string
  product_id: string
  position: number
  quantity: number
  product_snapshot: ProductSnapshot | null
}

interface GiftBox {
  id: string
  title: string
  gift_note: string | null
  share_token: string
  is_purchased: boolean
  created_at: string
  items: GiftBoxItem[]
}

export default function SavedGiftsPage() {
  const router = useRouter()
  const [giftBoxes, setGiftBoxes] = useState<GiftBox[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState("")
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const addToCart = useCartStore((state) => state.addItem)

  useEffect(() => {
    async function loadGifts() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        router.push("/signin?returnTo=/account/gifts")
        return
      }

      const { data: boxes } = await supabase
        .from("gift_boxes")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })

      if (boxes) {
        const boxesWithItems: GiftBox[] = []

        for (const box of boxes) {
          const { data: items } = await supabase
            .from("gift_box_items")
            .select("*")
            .eq("gift_box_id", box.id)
            .order("position", { ascending: true })

          boxesWithItems.push({
            ...box,
            items: (items || []).map((item) => ({
              ...item,
              product_snapshot: item.product_snapshot as unknown as ProductSnapshot | null,
            })),
          })
        }

        setGiftBoxes(boxesWithItems)
      }

      setIsLoading(false)
    }

    loadGifts()
  }, [router])

  const handleDelete = async (boxId: string) => {
    const supabase = createClient()

    await supabase.from("gift_box_items").delete().eq("gift_box_id", boxId)
    await supabase.from("gift_boxes").delete().eq("id", boxId)

    setGiftBoxes((prev) => prev.filter((b) => b.id !== boxId))
    setToastMessage("Gift box deleted")
    setShowToast(true)
    setTimeout(() => setShowToast(false), 3000)
  }

  const handleCopyShareLink = (shareToken: string, boxId: string) => {
    const url = `${window.location.origin}/gift/${shareToken}`
    navigator.clipboard.writeText(url)
    setCopiedId(boxId)
    setToastMessage("Share link copied!")
    setShowToast(true)
    setTimeout(() => {
      setShowToast(false)
      setCopiedId(null)
    }, 3000)
  }

  const getTotal = (items: GiftBoxItem[]) => {
    return items.reduce((sum, item) => sum + (item.product_snapshot?.price || 0) * item.quantity, 0)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 rounded-full border-2 border-zapatos-gold/20 border-t-zapatos-gold animate-spin mx-auto mb-4" />
          <p className="text-sm text-zapatos-charcoal/60">Loading your saved gifts...</p>
        </div>
      </div>
    )
  }

  return (
    <>
      <Toast
        message={toastMessage}
        isVisible={showToast}
        onClose={() => setShowToast(false)}
      />

      <div className="min-h-screen">
        {/* Header */}
        <section className="py-20 bg-zapatos-taupe/10">
          <div className="container mx-auto px-6 lg:px-12 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-zapatos-gold/10 mb-6">
                <Gift className="h-8 w-8 text-zapatos-gold" />
              </div>
              <h1 className="text-5xl md:text-6xl font-serif font-light mb-4">
                Saved Gifts
              </h1>
              <p className="text-lg text-zapatos-charcoal/80 editorial-spacing max-w-2xl mx-auto">
                Your curated gift boxes, saved for whenever you&apos;re ready.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Gift Boxes */}
        <section className="py-16">
          <div className="container mx-auto px-6 lg:px-12">
            {giftBoxes.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-20 luxury-border max-w-lg mx-auto"
              >
                <Gift className="h-16 w-16 text-zapatos-charcoal/20 mx-auto mb-4" />
                <h2 className="text-2xl font-serif mb-3">No saved gifts yet</h2>
                <p className="text-sm text-zapatos-charcoal/60 mb-6 editorial-spacing">
                  Create a gift box and save it here for easy access later.
                </p>
                <Button asChild>
                  <Link href="/gift-curator">
                    Start Curating
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              </motion.div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {giftBoxes.map((box, index) => (
                  <motion.div
                    key={box.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="luxury-border bg-white overflow-hidden"
                  >
                    {/* Product images grid */}
                    <div className="grid grid-cols-2 gap-px bg-zapatos-taupe/20">
                      {box.items.slice(0, 4).map((item, i) => (
                        <div key={item.id} className="aspect-square bg-zapatos-cream">
                          {item.product_snapshot?.image && (
                            <div
                              className="w-full h-full bg-cover bg-center"
                              style={{ backgroundImage: `url('${item.product_snapshot.image}')` }}
                            />
                          )}
                        </div>
                      ))}
                      {Array.from({ length: Math.max(0, 4 - box.items.length) }).map((_, i) => (
                        <div key={`empty-${i}`} className="aspect-square bg-zapatos-cream/50 flex items-center justify-center">
                          <Gift className="h-6 w-6 text-zapatos-charcoal/10" />
                        </div>
                      ))}
                    </div>

                    {/* Info */}
                    <div className="p-5">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="text-lg font-serif">{box.title}</h3>
                        {box.is_purchased && (
                          <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                            Purchased
                          </span>
                        )}
                      </div>

                      <p className="text-sm text-zapatos-charcoal/60 mb-1">
                        {box.items.length} {box.items.length === 1 ? "item" : "items"}
                      </p>
                      <p className="text-sm font-medium mb-3">
                        {formatCurrency(getTotal(box.items))}
                      </p>

                      {box.gift_note && (
                        <p className="text-xs text-zapatos-charcoal/50 italic mb-4 line-clamp-2">
                          &ldquo;{box.gift_note}&rdquo;
                        </p>
                      )}

                      <p className="text-xs text-zapatos-charcoal/40 mb-4">
                        Created {new Date(box.created_at).toLocaleDateString()}
                      </p>

                      {/* Actions */}
                      <div className="space-y-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="w-full text-xs"
                          onClick={() => handleCopyShareLink(box.share_token, box.id)}
                        >
                          {copiedId === box.id ? (
                            <Check className="mr-1.5 h-3.5 w-3.5" />
                          ) : (
                            <Copy className="mr-1.5 h-3.5 w-3.5" />
                          )}
                          {copiedId === box.id ? "Copied!" : "Copy Share Link"}
                        </Button>

                        <button
                          onClick={() => handleDelete(box.id)}
                          className="w-full text-xs text-zapatos-charcoal/50 hover:text-red-600 transition-colors py-2"
                        >
                          <Trash2 className="inline h-3.5 w-3.5 mr-1" />
                          Delete
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}

            {/* CTA */}
            {giftBoxes.length > 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="text-center mt-12"
              >
                <Button variant="outline" asChild>
                  <Link href="/gift-curator">
                    <Gift className="mr-2 h-5 w-5" />
                    Create Another Gift Box
                  </Link>
                </Button>
              </motion.div>
            )}
          </div>
        </section>
      </div>
    </>
  )
}
