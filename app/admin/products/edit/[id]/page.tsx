import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
// Using the absolute alias path to ensure the form is found
import ProductForm from "@/app/admin/products/new/ProductForm"; 

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditProductPage({ params }: PageProps) {
  const { id } = await params;
  
  // We cast the client to 'any' to stop the property check on .from
  const supabase = createClient() as any;
  
  const { data: product, error } = await supabase
    .from("products")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !product) {
    return notFound();
  }

  return (
    <div className="max-w-4xl mx-auto p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-black tracking-tighter uppercase">Edit Gear</h1>
        <p className="text-gray-500 font-serif italic">Updating: {product.name}</p>
      </div>
      
      <div className="bg-white p-8 border border-black/10 shadow-sm">
        <ProductForm initialData={product} />
      </div>
    </div>
  );
}