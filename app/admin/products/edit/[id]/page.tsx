import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import ProductForm from "@/app/admin/products/new/ProductForm";

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  
  // This JOIN fetches the product + all variant children
  const { data: product, error } = await supabase
    .from("products")
    .select("*, product_variants(*)")
    .eq("id", id)
    .single();

  if (error || !product) return notFound();

  return (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-2xl font-bold mb-8">Edit: {product.name}</h1>
      <ProductForm initialData={product} />
    </div>
  );
}