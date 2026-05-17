"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Plus, Search, Edit, Trash2, Eye, EyeOff, Package } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { createClient } from "@/lib/supabase/client"
import { formatCurrency } from "@/lib/utils"
const cleanImageUrl = (imgData: any): string => {
  if (!imgData) return "";
  
  // If it's a nested object wrapper, extract the inner url path property
  if (typeof imgData === 'object' && imgData !== null) {
    const targetUrl = imgData.url || imgData.image_url || "";
    return cleanImageUrl(targetUrl);
  }
  
  if (typeof imgData === 'string') {
    // If the database accidentally returns a raw stringified JSON array string
    if (imgData.startsWith('[') || imgData.startsWith('{')) {
      try {
        const parsed = JSON.parse(imgData);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return cleanImageUrl(parsed[0]);
        }
        return cleanImageUrl(parsed);
      } catch {
        // Fall through to standard string cleanup if JSON parsing fails
      }
    }
    
    // Direct string cleanup: strips out formatting quotes and enforces the direct storage link
    return imgData
      .replace(/['"[\]]/g, '') // Removes stray bracket or quotation marks
      .replace('/render/image/public/', '/object/public/')
      .trim();
  }
  
  return "";
};
interface ProductRow {
  id: string
  name: string
  slug: string
  price: number
  category: string
  stock_quantity: number
  is_active: boolean
  is_featured: boolean
  images: unknown
  created_at: string
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<ProductRow[]>([])
  const [search, setSearch] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)

  const loadProducts = async () => {
    const supabase = createClient()
    const { data } = await supabase
      .from("products")
      .select("id, name, slug, price, category, stock_quantity, is_active, is_featured, images, created_at")
      .order("created_at", { ascending: false })

    setProducts((data as ProductRow[]) || [])
    setIsLoading(false)
  }

  useEffect(() => {
    loadProducts()
  }, [])

  const toggleActive = async (id: string, currentValue: boolean) => {
    const supabase = createClient()
    await supabase.from("products").update({ is_active: !currentValue }).eq("id", id)
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, is_active: !currentValue } : p))
    )
  }

  const deleteProduct = async (id: string) => {
    const supabase = createClient()
    await supabase.from("products").delete().eq("id", id)
    setProducts((prev) => prev.filter((p) => p.id !== id))
    setDeleteConfirm(null)
  }

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.category.toLowerCase().includes(search.toLowerCase())
  )

  const getImageUrl = (product: ProductRow): string => {
  const imagesData = product.images;
  if (!imagesData) return "";

  // If it's already an array, pass the first item to our universal cleaner
  if (Array.isArray(imagesData)) {
    return cleanImageUrl(imagesData[0]);
  }
  
  // Otherwise, pass it directly
  return cleanImageUrl(imagesData);
};

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Products</h1>
          <p className="text-sm text-gray-500 mt-1">
            {products.length} product{products.length !== 1 ? "s" : ""} total
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/products/new">
            <Plus className="mr-2 h-4 w-4" />
            Add Product
          </Link>
        </Button>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search products..."
          className="pl-10 bg-white"
        />
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        {isLoading ? (
          <div className="p-12 text-center text-gray-400">Loading products...</div>
        ) : filteredProducts.length === 0 ? (
          <div className="p-12 text-center">
            <Package className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 mb-4">
              {search ? "No products match your search." : "No products yet."}
            </p>
            {!search && (
              <Button asChild>
                <Link href="/admin/products/new">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Your First Product
                </Link>
              </Button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Product
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Price
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Stock
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="text-right px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredProducts.map((product, index) => {
                  const imgUrl = getImageUrl(product)

                  return (
                    <motion.tr
                      key={product.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: index * 0.03 }}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded bg-gray-100 overflow-hidden flex-shrink-0">
                            {imgUrl ? (
                              <Image
                                src={imgUrl}
                                alt={product.name}
                                width={40}
                                height={40}
                                className="w-full h-full object-cover"
                                unoptimized
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <Package className="h-4 w-4 text-gray-300" />
                              </div>
                            )}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900">{product.name}</p>
                            <p className="text-xs text-gray-400">{product.slug}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-gray-600 capitalize">{product.category}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm font-medium">{formatCurrency(product.price)}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`text-sm ${
                            product.stock_quantity <= 5
                              ? "text-red-600 font-medium"
                              : "text-gray-600"
                          }`}
                        >
                          {product.stock_quantity}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => toggleActive(product.id, product.is_active)}
                          className={`inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full transition-colors ${
                            product.is_active
                              ? "bg-green-100 text-green-700 hover:bg-green-200"
                              : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                          }`}
                        >
                          {product.is_active ? (
                            <>
                              <Eye className="h-3 w-3" /> Active
                            </>
                          ) : (
                            <>
                              <EyeOff className="h-3 w-3" /> Draft
                            </>
                          )}
                        </button>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
                            <Link href={`/admin/products/edit/${product.id}`}>
                              <Edit className="h-4 w-4" />
                            </Link>
                          </Button>
                          {deleteConfirm === product.id ? (
                            <div className="flex items-center gap-1">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 text-xs text-red-600 hover:bg-red-50"
                                onClick={() => deleteProduct(product.id)}
                              >
                                Confirm
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 text-xs"
                                onClick={() => setDeleteConfirm(null)}
                              >
                                Cancel
                              </Button>
                            </div>
                          ) : (
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-gray-400 hover:text-red-600"
                              onClick={() => setDeleteConfirm(product.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </td>
                    </motion.tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
