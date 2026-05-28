import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Product, CartItem } from '@/lib/types/product'

interface CartStore {
  items: CartItem[]
  addItem: (product: Product, quantity?: number, selectedOptions?: Record<string, string>) => void
  removeItem: (itemId: string) => void
  updateQuantity: (itemId: string, quantity: number) => void
  clearCart: () => void
  getTotal: () => number
  getItemCount: () => number
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (product, quantity = 1, selectedOptions = {}) => {
        set((state) => {
          // Generate a composite key based on ID + selected attributes (Size/Color options)
          const optionsString = JSON.stringify(selectedOptions)
          const generatedItemId = `${product.id}-${optionsString}`

          // Look for an entry matching both the product ID and the exact options chosen
          const existingItem = state.items.find((item) => item.id === generatedItemId)

          if (existingItem) {
            return {
              items: state.items.map((item) =>
                item.id === generatedItemId
                  ? { ...item, quantity: item.quantity + quantity }
                  : item
              ),
            }
          }

          // Build item payload preserving core options
          const newItem: CartItem = {
            id: generatedItemId,
            product,
            quantity,
            // Attaching options explicitly prevents type lint failures in drawers
            selectedOptions
          } as any

          return { 
            items: [...state.items, newItem] 
          }
        })
      },

      removeItem: (itemId) => {
        set((state) => ({
          items: state.items.filter((item) => item.id !== itemId),
        }))
      },

      updateQuantity: (itemId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(itemId)
          return
        }

        set((state) => ({
          items: state.items.map((item) =>
            item.id === itemId ? { ...item, quantity } : item
          ),
        }))
      },

      clearCart: () => {
        set({ items: [] })
      },

      getTotal: () => {
        return get().items.reduce(
          (total, item) => total + item.product.price * item.quantity,
          0
        )
      },

      getItemCount: () => {
        return get().items.reduce((count, item) => count + item.quantity, 0)
      },
    }),
    {
      name: 'zapatos-cart-storage',
    }
  )
)