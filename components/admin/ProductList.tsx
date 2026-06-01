"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2, Edit2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";

export function ProductList({ products }: { products: any[] }) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure? This will remove the product and all variants.")) return;
    setIsDeleting(true);
    const supabase = createClient();
    await supabase.from("products").delete().eq("id", id);
    router.refresh();
    setIsDeleting(false);
  };

  return (
    <div className="border rounded-lg overflow-hidden">
      <table className="w-full text-sm">
        <thead className="bg-zinc-50 border-b">
          <tr>
            <th className="p-4 text-left">Product</th>
            <th className="p-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((p) => (
            <tr key={p.id} className="border-b">
              <td className="p-4 font-bold">{p.name}</td>
              <td className="p-4 text-right space-x-2">
                <Button variant="outline" size="sm" onClick={() => router.push(`/admin/products/edit/${p.id}`)}>
                  <Edit2 className="w-4 h-4"/>
                </Button>
                <Button variant="destructive" size="sm" onClick={() => handleDelete(p.id)} disabled={isDeleting}>
                  <Trash2 className="w-4 h-4"/>
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}