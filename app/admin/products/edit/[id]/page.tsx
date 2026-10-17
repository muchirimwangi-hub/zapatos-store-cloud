import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { ProductForm } from "@/components/admin/ProductForm";

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  
  // 1. Get the current user
  const { data: { user } } = await supabase.auth.getUser();
  
  // 👉 UPDATED: Auto-detects employees based on domain, excluding the master admin
  const isEmployee = 
    (user?.email?.endsWith('@zapatoscave.com') && user?.email !== 'admin@zapatoscave.com') || 
    user?.user_metadata?.role === "employee";
  
  const { data: product } = await supabase
    .from("products")
    .select("*, product_variants(*)")
    .eq("id", id)
    .single();

  if (!product) return notFound();

  return (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-2xl font-bold mb-8">{isEmployee ? "View Product:" : "Edit:"} {product.name}</h1>
      
      {/* 3. Pass the isEmployee flag to the form */}
      <ProductForm productId={id} initialData={product} isEmployee={isEmployee} />
    </div>
  );
}