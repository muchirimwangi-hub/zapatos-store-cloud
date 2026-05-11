import ProductForm from "./ProductForm"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function NewProductPage() {
  return (
    <div className="max-w-4xl mx-auto p-8">
      <div className="flex items-center gap-4 mb-8">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/admin/products"><ArrowLeft className="h-5 w-5" /></Link>
        </Button>
        <h1 className="text-2xl font-black tracking-tighter uppercase">Add New Gear</h1>
      </div>
      <ProductForm />
    </div>
  )
}