"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Gift, Plus, X, ArrowRight, ShoppingBag, Heart, Save, Trash2, Edit2, Check } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Toast } from "@/components/ui/toast"
import { AuthGateModal } from "@/components/auth/auth-gate-modal"
import { useCartStore } from "@/lib/store/cart-store"
import { formatCurrency } from "@/lib/utils"
import type { Product } from "@/lib/types/product"
import { createStaticClient } from "@/lib/supabase/static"
import { createClient } from "@/lib/supabase/client"

const BOX_SIZE_OPTIONS = [2, 4, 6, 8, 10] as const
type BoxSize = typeof BOX_SIZE_OPTIONS[number]

interface GiftBoxSlot {
  product: Product | null
}

interface GiftBox {
  id: string
  name: string
  slots: GiftBoxSlot[]
  giftNote: string
  size: BoxSize
}

export default function GiftCuratorPage() {
  const router = useRouter()
  const [products, setProducts] = useState<Product[]>([])
  const [boxes, setBoxes] = useState<GiftBox[]>([
    {
      id: crypto.randomUUID(),
      name: "Gift Box 1",
      slots: Array.from({ length: 4 }, () => ({ product: null })),
      giftNote: "",
      size: 4,
    },
  ])
  const [activeBoxId, setActiveBoxId] = useState<string>("")
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState("")
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [editingBoxId, setEditingBoxId] = useState<string | null>(null)
  const [editingBoxName, setEditingBoxName] = useState("")
  const addToCart = useCartStore((state) => state.addItem)

  const activeBox = boxes.find((b) => b.id === activeBoxId) || boxes[0]
  const slots = activeBox.slots
  const giftNote = activeBox.giftNote

  useEffect(() => {
    if (!activeBoxId && boxes.length > 0) {
      setActiveBoxId(boxes[0].id)
    }
  }, [boxes, activeBoxId])

  useEffect(() => {
    async function loadProducts() {
      const supabase = createStaticClient()
      const { data } = await supabase
        .from("products")
        .select("*")
        .eq("is_active", true)
        .order("created_at", { ascending: false })

      if (data) {
        setProducts(data as Product[])
      }
      setIsLoading(false)
    }
    loadProducts()
  }, [])

  const filledSlots = slots.filter((s) => s.product !== null)
  const totalPrice = filledSlots.reduce(
    (sum, s) => sum + (s.product?.price || 0),
    0
  )

  const updateActiveBox = (updates: Partial<GiftBox>) => {
    setBoxes((prev) =>
      prev.map((box) =>
        box.id === activeBoxId ? { ...box, ...updates } : box
      )
    )
  }

  const addToSlot = (product: Product) => {
    const alreadyAdded = slots.some((s) => s.product?.id === product.id)
    if (alreadyAdded) {
      setToastMessage("This product is already in your gift box")
      setShowToast(true)
      setTimeout(() => setShowToast(false), 3000)
      return
    }

    const emptyIndex = slots.findIndex((s) => s.product === null)
    if (emptyIndex === -1) {
      setToastMessage("Gift box is full! Remove a product first.")
      setShowToast(true)
      setTimeout(() => setShowToast(false), 3000)
      return
    }

    const newSlots = [...slots]
    newSlots[emptyIndex] = { product }
    updateActiveBox({ slots: newSlots })
    setToastMessage(`${product.name} added to gift box`)
    setShowToast(true)
    setTimeout(() => setShowToast(false), 3000)
  }

  const removeFromSlot = (index: number) => {
    const newSlots = [...slots]
    newSlots[index] = { product: null }
    updateActiveBox({ slots: newSlots })
  }

  const changeBoxSize = (newSize: BoxSize) => {
    const currentSlots = [...slots]
    if (newSize > currentSlots.length) {
      // Add empty slots
      const additionalSlots = Array.from(
        { length: newSize - currentSlots.length },
        () => ({ product: null })
      )
      updateActiveBox({ size: newSize, slots: [...currentSlots, ...additionalSlots] })
    } else {
      // Remove slots (keep filled ones if possible)
      const newSlots = currentSlots.slice(0, newSize)
      updateActiveBox({ size: newSize, slots: newSlots })
    }
  }

  const createNewBox = () => {
    const newBox: GiftBox = {
      id: crypto.randomUUID(),
      name: `Gift Box ${boxes.length + 1}`,
      slots: Array.from({ length: 4 }, () => ({ product: null })),
      giftNote: "",
      size: 4,
    }
    setBoxes((prev) => [...prev, newBox])
    setActiveBoxId(newBox.id)
    setToastMessage("New gift box created")
    setShowToast(true)
    setTimeout(() => setShowToast(false), 3000)
  }

  const deleteBox = (boxId: string) => {
    if (boxes.length === 1) {
      setToastMessage("You must have at least one gift box")
      setShowToast(true)
      setTimeout(() => setShowToast(false), 3000)
      return
    }
    setBoxes((prev) => prev.filter((b) => b.id !== boxId))
    if (activeBoxId === boxId) {
      setActiveBoxId(boxes.find((b) => b.id !== boxId)?.id || "")
    }
    setToastMessage("Gift box deleted")
    setShowToast(true)
    setTimeout(() => setShowToast(false), 3000)
  }

  const handleAddAllToCart = () => {
    filledSlots.forEach((slot) => {
      if (slot.product) addToCart(slot.product)
    })
    setToastMessage(`${filledSlots.length} items added to cart`)
    setShowToast(true)
    setTimeout(() => setShowToast(false), 3000)
  }

  const handleSaveGift = async () => {
    if (filledSlots.length === 0) return

    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      setShowAuthModal(true)
      return
    }

    setIsSaving(true)
    try {
      const shareToken = crypto.randomUUID().slice(0, 8)

      const { data: giftBox, error: boxError } = await supabase
        .from('gift_boxes')
        .insert({
          user_id: user.id,
          title: `Gift Box — ${new Date().toLocaleDateString()}`,
          gift_note: giftNote || null,
          share_token: shareToken,
        })
        .select()
        .single()

      if (boxError || !giftBox) throw boxError

      const items = filledSlots.map((slot, index) => ({
        gift_box_id: giftBox.id,
        product_id: slot.product!.id,
        position: index,
        quantity: 1,
        product_snapshot: {
          name: slot.product!.name,
          price: slot.product!.price,
          image: getImageUrl(slot.product!),
        },
      }))

      const { error: itemsError } = await supabase
        .from('gift_box_items')
        .insert(items)

      if (itemsError) throw itemsError

      setToastMessage('Gift box saved to your account!')
      setShowToast(true)
      setTimeout(() => setShowToast(false), 3000)
    } catch (error) {
      console.error('Error saving gift:', error)
      setToastMessage('Failed to save gift box. Please try again.')
      setShowToast(true)
      setTimeout(() => setShowToast(false), 3000)
    } finally {
      setIsSaving(false)
    }
  }

  const getImageUrl = (product: Product) => {
    if (Array.isArray(product.images) && product.images.length > 0) {
      return typeof product.images[0] === "string"
        ? product.images[0]
        : product.images[0].url
    }
    return "https://images.unsplash.com/photo-1588405748880-12d1d2a59d75?w=400&q=80"
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
              <h1 className="text-5xl md:text-6xl font-serif font-light mb-6">
                Gift Curator
              </h1>
              <p className="text-lg text-zapatos-charcoal/80 editorial-spacing max-w-2xl mx-auto">
                Curate personalized gift boxes with handpicked products and pair them with a heartfelt note.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Builder */}
        <section className="py-16">
          <div className="container mx-auto px-6 lg:px-12">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              {/* Product List (left) */}
              <div className="lg:col-span-2">
                <h2 className="text-2xl font-serif mb-6">
                 Curate Your Favourites {/* UPDATED TEXT */}
                </h2>

                {isLoading ? (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                    {Array.from({ length: 6 }).map((_, i) => (
                      <div key={i} className="space-y-3">
                        <div className="aspect-square bg-zapatos-taupe/20 luxury-border animate-pulse" />
                        <div className="h-4 bg-zapatos-taupe/20 rounded animate-pulse" />
                        <div className="h-4 w-20 bg-zapatos-taupe/20 rounded animate-pulse" />
                      </div>
                    ))}
                  </div>
                ) : products.length === 0 ? (
                  <div className="text-center py-20 luxury-border">
                    <p className="text-zapatos-charcoal/70">
                      No products available yet. Check back soon!
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                    {products.map((product) => {
                      const isAdded = slots.some(
                        (s) => s.product?.id === product.id
                      )
                      return (
                        <motion.div
                          key={product.id}
                          initial={{ opacity: 0, y: 20 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true }}
                          className="group"
                        >
                          <div className="relative aspect-square luxury-border overflow-hidden mb-3 bg-zapatos-cream/50">
                            <div
                              className="w-full h-full bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                              style={{
                                backgroundImage: `url('${getImageUrl(product)}')`,
                              }}
                            />
                            <button
                              onClick={() => addToSlot(product)}
                              disabled={isAdded}
                              className={`absolute bottom-3 right-3 p-2.5 rounded-full shadow-lg transition-all ${
                                isAdded
                                  ? "bg-zapatos-gold text-white cursor-default"
                                  : "bg-zapatos-cream text-zapatos-obsidian hover:bg-white opacity-0 group-hover:opacity-100"
                              }`}
                            >
                              {isAdded ? (
                                <Heart className="h-4 w-4 fill-current" />
                              ) : (
                                <Plus className="h-4 w-4" />
                              )}
                            </button>
                          </div>
                          <h3 className="text-sm font-serif truncate">
                            {product.name}
                          </h3>
                          <p className="text-sm font-medium">
                            {formatCurrency(product.price)}
                          </p>
                        </motion.div>
                      )
                    })}
                  </div>
                )}
              </div>

              {/* Gift Box (right) */}
              <div className="lg:col-span-1">
                <div className="sticky top-24">
                  {/* Number of Boxes Selector */}
                  <div className="mb-4">
                    <label className="block text-xs text-zapatos-charcoal/60 mb-2">
                      Number of Gift Boxes
                    </label>
                    <div className="flex gap-2 flex-wrap">
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                        <button
                          key={num}
                          onClick={() => {
                            if (num > boxes.length) {
                              const newBoxes = Array.from(
                                { length: num - boxes.length },
                                (_, i) => ({
                                  id: crypto.randomUUID(),
                                  name: `Gift Box ${boxes.length + i + 1}`,
                                  slots: Array.from({ length: 4 }, () => ({ product: null })),
                                  giftNote: "",
                                  size: 4 as BoxSize,
                                })
                              )
                              setBoxes((prev) => [...prev, ...newBoxes])
                            } else if (num < boxes.length) {
                              setBoxes((prev) => prev.slice(0, num))
                              if (!boxes.slice(0, num).find((b) => b.id === activeBoxId)) {
                                setActiveBoxId(boxes[0].id)
                              }
                            }
                          }}
                          className={`w-9 h-9 rounded-full text-sm font-medium transition-all ${
                            boxes.length === num
                              ? "bg-zapatos-gold text-white"
                              : "bg-zapatos-taupe/10 text-zapatos-charcoal/70 hover:bg-zapatos-taupe/20"
                          }`}
                        >
                          {num}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Box Tabs */}
                  <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
                    {boxes.map((box) => (
                      <button
                        key={box.id}
                        onClick={() => setActiveBoxId(box.id)}
                        className={`px-4 py-2 text-sm rounded-full whitespace-nowrap transition-all ${
                          box.id === activeBoxId
                            ? "bg-zapatos-gold text-white"
                            : "bg-zapatos-taupe/10 text-zapatos-charcoal/70 hover:bg-zapatos-taupe/20"
                        }`}
                      >
                        {box.name}
                      </button>
                    ))}
                  </div>

                  {/* Box Size Selector */}
                  <div className="mb-4">
                    <label className="block text-xs text-zapatos-charcoal/60 mb-2">
                      Box Size
                    </label>
                    <div className="flex gap-2">
                      {BOX_SIZE_OPTIONS.map((size) => (
                        <button
                          key={size}
                          onClick={() => changeBoxSize(size)}
                          className={`flex-1 py-2 text-sm rounded transition-all ${
                            activeBox.size === size
                              ? "bg-zapatos-obsidian text-white"
                              : "bg-zapatos-taupe/10 text-zapatos-charcoal/70 hover:bg-zapatos-taupe/20"
                          }`}
                        >
                          {size} items
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex justify-between items-center mb-6">
                    {editingBoxId === activeBoxId ? (
                      <div className="flex items-center gap-2 flex-1">
                        <input
                          type="text"
                          value={editingBoxName}
                          onChange={(e) => setEditingBoxName(e.target.value)}
                          className="flex-1 text-xl font-serif luxury-border bg-transparent px-3 py-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zapatos-gold/50"
                          autoFocus
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              updateActiveBox({ name: editingBoxName })
                              setEditingBoxId(null)
                            } else if (e.key === 'Escape') {
                              setEditingBoxId(null)
                            }
                          }}
                        />
                        <button
                          onClick={() => {
                            updateActiveBox({ name: editingBoxName })
                            setEditingBoxId(null)
                          }}
                          className="p-2 text-zapatos-gold hover:bg-zapatos-gold/10 rounded-full transition-colors"
                        >
                          <Check className="h-4 w-4" />
                        </button>
                      </div>
                    ) : (
                      <h2 className="text-2xl font-serif flex items-center gap-2">
                        {activeBox.name}
                        <button
                          onClick={() => {
                            setEditingBoxId(activeBoxId)
                            setEditingBoxName(activeBox.name)
                          }}
                          className="p-1.5 text-zapatos-charcoal/40 hover:text-zapatos-gold hover:bg-zapatos-gold/10 rounded-full transition-colors"
                          title="Rename box"
                        >
                          <Edit2 className="h-3.5 w-3.5" />
                        </button>
                      </h2>
                    )}
                    {boxes.length > 1 && (
                      <button
                        onClick={() => deleteBox(activeBoxId)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-full transition-colors"
                        title="Delete this box"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>

                  {/* Slots */}
                  <div className={`grid gap-3 mb-6 ${
                    activeBox.size === 2 ? "grid-cols-2" :
                    activeBox.size === 4 ? "grid-cols-2" :
                    activeBox.size === 6 ? "grid-cols-3" :
                    activeBox.size === 8 ? "grid-cols-4" :
                    "grid-cols-5"
                  }`}>
                    {slots.map((slot, index) => (
                      <div
                        key={index}
                        className={`aspect-square luxury-border relative flex items-center justify-center transition-all ${
                          slot.product
                            ? "bg-zapatos-cream"
                            : "bg-zapatos-taupe/5 border-dashed"
                        }`}
                      >
                        {slot.product ? (
                          <>
                            <div
                              className="absolute inset-0 bg-cover bg-center"
                              style={{
                                backgroundImage: `url('${getImageUrl(slot.product)}')`,
                              }}
                            />
                            <button
                              onClick={() => removeFromSlot(index)}
                              className="absolute top-2 right-2 p-1 bg-white rounded-full shadow-md hover:bg-red-50 transition-colors z-10"
                            >
                              <X className="h-3 w-3" />
                            </button>
                            <div className="absolute bottom-0 left-0 right-0 bg-white/90 backdrop-blur-sm p-2 z-10">
                              <p className="text-xs font-medium truncate">
                                {slot.product.name}
                              </p>
                            </div>
                          </>
                        ) : (
                          <div className="text-center">
                            <Plus className="h-6 w-6 text-zapatos-charcoal/30 mx-auto mb-1" />
                            <p className="text-xs text-zapatos-charcoal/40">
                              Slot {index + 1}
                            </p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Gift Note */}
                  <div className="mb-6">
                    <label className="block text-sm mb-2">
                      Gift Note (optional)
                    </label>
                    <textarea
                      value={giftNote}
                      onChange={(e) => updateActiveBox({ giftNote: e.target.value })}
                      rows={3}
                      placeholder="Add a personal message..."
                      className="flex w-full luxury-border bg-transparent px-4 py-3 text-sm transition-colors placeholder:text-zapatos-charcoal/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zapatos-gold/50 resize-none"
                    />
                  </div>

                  {/* Summary */}
                  <div className="luxury-border p-4 mb-6 bg-zapatos-taupe/5">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-zapatos-charcoal/70">
                        {filledSlots.length} of {activeBox.size} items
                      </span>
                      <span className="font-medium">
                        {formatCurrency(totalPrice)}
                      </span>
                    </div>
                    <div className="h-1.5 bg-zapatos-taupe/20 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-zapatos-gold transition-all duration-300 rounded-full"
                        style={{
                          width: `${(filledSlots.length / activeBox.size) * 100}%`,
                        }}
                      />
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="space-y-3">
                    <Button
                      size="lg"
                      className="w-full"
                      disabled={filledSlots.length === 0}
                      onClick={handleAddAllToCart}
                    >
                      <ShoppingBag className="mr-2 h-5 w-5" />
                      Add Gift Box to Cart
                    </Button>
                    <Button
                      size="lg"
                      variant="secondary"
                      className="w-full"
                      disabled={filledSlots.length === 0 || isSaving}
                      onClick={handleSaveGift}
                    >
                      <Save className="mr-2 h-5 w-5" />
                      {isSaving ? 'Saving...' : 'Save Gift Box'}
                    </Button>
                    <Button
                      size="lg"
                      variant="outline"
                      className="w-full"
                      asChild
                    >
                      <Link href="/shop">
                        View Full Collection
                        <ArrowRight className="ml-2 h-5 w-5" />
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      <AuthGateModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        title="Save your gift box"
        message="Sign in or create an account to save your curated gift box and access it anytime."
        returnTo="/gift-curator"
      />
    </>
  )
}
