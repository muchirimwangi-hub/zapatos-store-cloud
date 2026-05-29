import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { ProductForm } from "@/components/admin/ProductForm";

interface EditProductPageProps {
  params: Promise<{ id: string }>
}

export default async function EditProductPage({ params }: EditProductPageProps) {
  const { id } = await params;
  const supabase = await createClient();
  
  const { data: product, error } = await supabase
    .from("products")
    .select("*, product_variants(*)")
    .eq("id", id)
    .single();

  if (error || !product) return notFound();

  return (
    <div className="min-h-screen bg-white dark:bg-[#08080A] py-12 transition-colors duration-500">
      <div className="max-w-4xl mx-auto p-8">
        <ProductForm productId={id} />
      </div>
    </div>
  );
}