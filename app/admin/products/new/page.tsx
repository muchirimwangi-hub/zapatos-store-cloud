import { ProductForm } from "@/components/admin/ProductForm"

export default function NewProductPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-[#08080A] py-12 transition-colors duration-500">
      <div className="max-w-4xl mx-auto p-8">
        <ProductForm />
      </div>
    </div>
  )
}