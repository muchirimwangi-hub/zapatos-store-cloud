"use client";

import { useSearchParams } from "next/navigation";
import { useMemo } from "react";
import { getArchetypeDetails, matchProducts, Archetype } from "@/lib/utils/quiz-matcher";
import { createStaticClient } from "@/lib/supabase/static";
import { useEffect, useState } from "react";
import { Product } from "@/lib/types/product";
import { ProductCard } from "@/components/products/product-card";

export default function QuizResultsPage() {
  const searchParams = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  
  // 1. Get data from URL
  const data = useMemo(() => JSON.parse(decodeURIComponent(searchParams.get('data') || '{}')), [searchParams]);
  
  // 2. Determine Archetype
  const type = useMemo(() => {
    return Object.keys(data).reduce((a, b) => data[a] > data[b] ? a : b) as Archetype;
  }, [data]);

  const details = getArchetypeDetails(type);

  // 3. Fetch matching products
  useEffect(() => {
    async function fetchProducts() {
      const supabase = createStaticClient();
      const { data: allProducts } = await supabase.from('products').select('*');
      if (allProducts) {
        setProducts(matchProducts(allProducts as Product[], type));
      }
    }
    fetchProducts();
  }, [type]);

  return (
    <div className="bg-white min-h-screen text-black p-12">
      <div className="max-w-3xl mx-auto space-y-8">
        <h1 className="text-6xl font-medium tracking-tighter">{details.title}</h1>
        <p className="text-xl font-light text-neutral-600">{details.description}</p>
        
        <div className="grid grid-cols-2 gap-8 pt-12 border-t border-neutral-200">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </div>
    </div>
  );
}