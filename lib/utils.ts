import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import type { Product } from "@/lib/types/product"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number, currency: string = 'KES'): string {
  return new Intl.NumberFormat('en-KE', {
    style: 'currency',
    currency,
  }).format(amount)
}

export function generateOrderNumber(): string {
  const timestamp = Date.now().toString(36).toUpperCase()
  const random = Math.random().toString(36).substring(2, 7).toUpperCase()
  return `ALL-${timestamp}-${random}`
}

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1588405748880-12d1d2a59d75?w=800&q=80'

export function getProductImageUrl(product: Product, index: number = 0): string {
  if (Array.isArray(product.images) && product.images.length > index) {
    const img = product.images[index]
    return typeof img === 'string' ? img : img.url
  }
  return FALLBACK_IMAGE
}
