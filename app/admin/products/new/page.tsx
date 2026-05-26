import ProductForm from "./ProductForm"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function NewProductPage() {
  return (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-2xl font-bold mb-8">Add New Gear</h1>
      <ProductForm />
    </div>
  )
}