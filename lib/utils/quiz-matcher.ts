import type { Product } from '@/lib/types/product'

export type Archetype = 'minimalist' | 'grinder' | 'hybrid' | 'vanguard';

export function getArchetypeDetails(type: Archetype) {
  const map: Record<Archetype, { title: string; description: string }> = {
    minimalist: { title: "The Kinetic Minimalist", description: "You strip away the unnecessary." },
    grinder: { title: "The Midnight Grinder", description: "Built for the dark. Maximum durability." },
    hybrid: { title: "The Hybrid Operator", description: "Adapt to everything. Technical versatility." },
    vanguard: { title: "The Vanguard", description: "Precision on the field, sophistication off it." }
  };
  return map[type];
}

export function matchProducts(products: Product[], archetype: Archetype): Product[] {
  return products.filter((p) => {
    // We treat tags as a string array, and safely check if it exists
    const productTags = (p as any).tags; 
    return Array.isArray(productTags) && productTags.includes(archetype);
  }).slice(0, 4);
}