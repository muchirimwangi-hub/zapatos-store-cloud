import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import ProductForm from "@/app/admin/products/new/ProductForm";

// In Next.js 16, params MUST be treated as a Promise in the type definition
interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditProductPage({ params }: PageProps) {
  // 1. Explicitly await the params (Next 16 Requirement)
  const resolvedParams = await params;
  const id = resolvedParams.id;

  try {
    // 2. Await the server client (Common cause for 500 errors)
    const supabase = await createClient();
    
    // 3. Fetch the product
    const { data: product, error } = await (supabase as any)
      .from("products")
      .select("*")
      .eq("id", id)
      .single();

    // 4. Safety check: If the ID is wrong or database is down
    if (error || !product) {
      console.error("Edit Page Error:", error);
      return notFound();
    }

    return (
      <div className="max-w-4xl mx-auto p-8">
        <div className="mb-8">
          <h1 className="text-2xl font-black tracking-tighter uppercase">Edit Gear</h1>
          <p className="text-gray-500 font-serif italic text-sm">
            Updating specifications for: {product.name}
          </p>
        </div>
        
        <div className="bg-white p-8 border border-black/10 shadow-sm">
          {/* Pass the data to the client-side form */}
          <ProductForm initialData={product} />
        </div>
      </div>
    );
  } catch (err) {
    // This will force the error into your Vercel Logs so we can see the real culprit
    console.error("Critical Server Error:", err);
    throw err; 
  }
}