"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { ArrowLeft, Save, Plus, X } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { createClient } from "@/lib/supabase/client"

export default function NewProductPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [form, setForm] = useState({
    name: "",
    slug: "",
    description: "",
    short_description: "",
    price: "",
    compare_at_price: "",
    category: "fragrance",
    subcategory: "",
    brand: "",
    sku: "",
    stock_quantity: "0",
    is_active: true,
    is_featured: false,
    volume: "",
    scent_profile: "",
    skin_type: "",
  })

  const SUBCATEGORY_OPTIONS = {
    fragrance: ["Eau de Parfum", "Eau de Toilette", "Body Mist", "Perfume Oil"],
    bodycare: ["Body Washes", "Body Creams and Oils", "Cleansing Essentials", "Body Scrubs"],
    skincare: ["Cleansers", "Moisturizers", "Serums", "Treatments"],
    "gift-set": ["Fragrance Sets", "Body Care Sets", "Complete Sets"],
  }

  const [imageUrls, setImageUrls] = useState<string[]>([""])
  const [ingredients, setIngredients] = useState<string[]>([])
  const [notes, setNotes] = useState<string[]>([])
  const [personalityTags, setPersonalityTags] = useState<string[]>([])
  const [newIngredient, setNewIngredient] = useState("")
  const [newNote, setNewNote] = useState("")
  const [newTag, setNewTag] = useState("")

  const updateField = (field: string, value: string | boolean) => {
    setForm((prev) => ({ ...prev, [field]: value }))

    if (field === "name" && !form.slug) {
      const slug = (value as string)
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "")
      setForm((prev) => ({ ...prev, slug }))
    }

    // Clear subcategory when category changes
    if (field === "category") {
      setForm((prev) => ({ ...prev, subcategory: "" }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)

    if (!form.name || !form.slug || !form.price) {
      setError("Name, slug, and price are required.")
      setIsLoading(false)
      return
    }

    const supabase = createClient()

    const images = imageUrls
      .filter((url) => url.trim())
      .map((url) => ({ url: url.trim() }))

    const { error: insertError } = await supabase.from("products").insert({
      name: form.name,
      slug: form.slug,
      description: form.description || null,
      short_description: form.short_description || null,
      price: parseFloat(form.price),
      compare_at_price: form.compare_at_price ? parseFloat(form.compare_at_price) : null,
      category: form.category,
      subcategory: form.subcategory || null,
      brand: form.brand || null,
      sku: form.sku || null,
      stock_quantity: parseInt(form.stock_quantity) || 0,
      is_active: form.is_active,
      is_featured: form.is_featured,
      volume: form.volume || null,
      scent_profile: form.scent_profile || null,
      skin_type: form.skin_type || null,
      images,
      ingredients: ingredients.length > 0 ? ingredients : null,
      notes: notes.length > 0 ? notes : null,
      personality_tags: personalityTags.length > 0 ? personalityTags : null,
    })

    if (insertError) {
      setError(insertError.message)
      setIsLoading(false)
      return
    }

    router.push("/admin/products")
  }

  const addToList = (
    list: string[],
    setList: React.Dispatch<React.SetStateAction<string[]>>,
    value: string,
    setValue: React.Dispatch<React.SetStateAction<string>>
  ) => {
    if (value.trim() && !list.includes(value.trim())) {
      setList([...list, value.trim()])
      setValue("")
    }
  }

  const removeFromList = (
    list: string[],
    setList: React.Dispatch<React.SetStateAction<string[]>>,
    index: number
  ) => {
    setList(list.filter((_, i) => i !== index))
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/admin/products">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Add New Product</h1>
          <p className="text-sm text-gray-500">Create a new product listing</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg"
          >
            {error}
          </motion.div>
        )}

        {/* Basic Info */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-6">
          <h2 className="text-lg font-medium text-gray-900">Basic Information</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Product Name *</label>
              <Input
                value={form.name}
                onChange={(e) => updateField("name", e.target.value)}
                placeholder="e.g., Midnight Rose Eau de Parfum"
                required
                className="bg-white"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">URL Slug *</label>
              <Input
                value={form.slug}
                onChange={(e) => updateField("slug", e.target.value)}
                placeholder="midnight-rose-edp"
                required
                className="bg-white"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Short Description</label>
            <Input
              value={form.short_description}
              onChange={(e) => updateField("short_description", e.target.value)}
              placeholder="A one-line tagline"
              className="bg-white"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Full Description</label>
            <textarea
              value={form.description}
              onChange={(e) => updateField("description", e.target.value)}
              placeholder="Detailed product description..."
              rows={4}
              className="flex w-full luxury-border bg-transparent px-4 py-3 text-sm transition-colors placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zapatos-gold/50"
            />
          </div>
        </div>

        {/* Pricing & Inventory */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-6">
          <h2 className="text-lg font-medium text-gray-900">Pricing & Inventory</h2>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Price ($) *</label>
              <Input
                type="number"
                step="0.01"
                min="0"
                value={form.price}
                onChange={(e) => updateField("price", e.target.value)}
                placeholder="0.00"
                required
                className="bg-white"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Compare At</label>
              <Input
                type="number"
                step="0.01"
                min="0"
                value={form.compare_at_price}
                onChange={(e) => updateField("compare_at_price", e.target.value)}
                placeholder="0.00"
                className="bg-white"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Stock Qty</label>
              <Input
                type="number"
                min="0"
                value={form.stock_quantity}
                onChange={(e) => updateField("stock_quantity", e.target.value)}
                className="bg-white"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">SKU</label>
              <Input
                value={form.sku}
                onChange={(e) => updateField("sku", e.target.value)}
                placeholder="ABC-123"
                className="bg-white"
              />
            </div>
          </div>
        </div>

        {/* Category & Details */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-6">
          <h2 className="text-lg font-medium text-gray-900">Category & Details</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Category *</label>
              <select
                value={form.category}
                onChange={(e) => updateField("category", e.target.value)}
                className="flex h-12 w-full luxury-border bg-white px-4 py-3 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zapatos-gold/50"
              >
                <option value="fragrance">Fragrance</option>
                <option value="bodycare">Body Care</option>
                <option value="skincare">Skincare</option>
                <option value="gift-set">Gift Set</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Subcategory</label>
              <select
                value={form.subcategory}
                onChange={(e) => updateField("subcategory", e.target.value)}
                disabled={!form.category}
                className="flex h-12 w-full luxury-border bg-white px-4 py-3 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zapatos-gold/50 disabled:bg-gray-50 disabled:text-gray-400"
              >
                <option value="">Select subcategory...</option>
                {SUBCATEGORY_OPTIONS[form.category as keyof typeof SUBCATEGORY_OPTIONS]?.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Brand</label>
              <Input
                value={form.brand}
                onChange={(e) => updateField("brand", e.target.value)}
                placeholder="e.g., Zapatos Atelier"
                className="bg-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Volume</label>
              <Input
                value={form.volume}
                onChange={(e) => updateField("volume", e.target.value)}
                placeholder="e.g., 50ml"
                className="bg-white"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Scent Profile</label>
              <Input
                value={form.scent_profile}
                onChange={(e) => updateField("scent_profile", e.target.value)}
                placeholder="e.g., Woody, Floral"
                className="bg-white"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Skin Type</label>
              <Input
                value={form.skin_type}
                onChange={(e) => updateField("skin_type", e.target.value)}
                placeholder="e.g., All skin types"
                className="bg-white"
              />
            </div>
          </div>
        </div>

        {/* Images */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-6">
          <h2 className="text-lg font-medium text-gray-900">Images</h2>
          <p className="text-sm text-gray-500">Add image URLs for this product.</p>

          {imageUrls.map((url, index) => (
            <div key={index} className="flex gap-2">
              <Input
                value={url}
                onChange={(e) => {
                  const updated = [...imageUrls]
                  updated[index] = e.target.value
                  setImageUrls(updated)
                }}
                placeholder="https://example.com/image.jpg"
                className="bg-white"
              />
              {imageUrls.length > 1 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => setImageUrls(imageUrls.filter((_, i) => i !== index))}
                  className="text-gray-400 hover:text-red-500"
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          ))}

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setImageUrls([...imageUrls, ""])}
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Image
          </Button>
        </div>

        {/* Tags & Lists */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-6">
          <h2 className="text-lg font-medium text-gray-900">Tags & Attributes</h2>

          {/* Ingredients */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-gray-700">Ingredients</label>
            <div className="flex gap-2">
              <Input
                value={newIngredient}
                onChange={(e) => setNewIngredient(e.target.value)}
                placeholder="Add ingredient"
                className="bg-white"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault()
                    addToList(ingredients, setIngredients, newIngredient, setNewIngredient)
                  }
                }}
              />
              <Button
                type="button"
                variant="outline"
                onClick={() =>
                  addToList(ingredients, setIngredients, newIngredient, setNewIngredient)
                }
              >
                Add
              </Button>
            </div>
            {ingredients.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {ingredients.map((item, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center gap-1 text-xs bg-gray-100 px-3 py-1.5 rounded-full"
                  >
                    {item}
                    <button
                      type="button"
                      onClick={() => removeFromList(ingredients, setIngredients, i)}
                    >
                      <X className="h-3 w-3 text-gray-400 hover:text-red-500" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Notes */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-gray-700">Scent Notes</label>
            <div className="flex gap-2">
              <Input
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                placeholder="Add note (e.g., Rose, Sandalwood)"
                className="bg-white"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault()
                    addToList(notes, setNotes, newNote, setNewNote)
                  }
                }}
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => addToList(notes, setNotes, newNote, setNewNote)}
              >
                Add
              </Button>
            </div>
            {notes.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {notes.map((item, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center gap-1 text-xs bg-amber-50 text-amber-700 px-3 py-1.5 rounded-full"
                  >
                    {item}
                    <button type="button" onClick={() => removeFromList(notes, setNotes, i)}>
                      <X className="h-3 w-3 text-amber-400 hover:text-red-500" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Personality Tags */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-gray-700">
              Personality / Quiz Tags
            </label>
            <p className="text-xs text-gray-400">
              Tags used by the quiz matcher (e.g., woody, fresh, citrus, body_oil, calming)
            </p>
            <div className="flex gap-2">
              <Input
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                placeholder="Add tag"
                className="bg-white"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault()
                    addToList(personalityTags, setPersonalityTags, newTag, setNewTag)
                  }
                }}
              />
              <Button
                type="button"
                variant="outline"
                onClick={() =>
                  addToList(personalityTags, setPersonalityTags, newTag, setNewTag)
                }
              >
                Add
              </Button>
            </div>
            {personalityTags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {personalityTags.map((item, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center gap-1 text-xs bg-purple-50 text-purple-700 px-3 py-1.5 rounded-full"
                  >
                    {item}
                    <button
                      type="button"
                      onClick={() => removeFromList(personalityTags, setPersonalityTags, i)}
                    >
                      <X className="h-3 w-3 text-purple-400 hover:text-red-500" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Visibility */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
          <h2 className="text-lg font-medium text-gray-900">Visibility</h2>

          <div className="flex items-center gap-6">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={form.is_active}
                onChange={(e) => updateField("is_active", e.target.checked)}
                className="w-4 h-4 rounded border-gray-300 text-zapatos-gold focus:ring-zapatos-gold"
              />
              <span className="text-sm text-gray-700">Active (visible in store)</span>
            </label>

            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={form.is_featured}
                onChange={(e) => updateField("is_featured", e.target.checked)}
                className="w-4 h-4 rounded border-gray-300 text-zapatos-gold focus:ring-zapatos-gold"
              />
              <span className="text-sm text-gray-700">Featured product</span>
            </label>
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end gap-4">
          <Button variant="outline" type="button" asChild>
            <Link href="/admin/products">Cancel</Link>
          </Button>
          <Button type="submit" disabled={isLoading} className="px-8">
            <Save className="mr-2 h-4 w-4" />
            {isLoading ? "Saving..." : "Create Product"}
          </Button>
        </div>
      </form>
    </div>
  )
}
