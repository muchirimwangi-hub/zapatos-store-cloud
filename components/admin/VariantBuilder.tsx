"use client"

import { useState, useEffect, useMemo } from "react"
import { Plus, Trash2, Layers, Filter, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface VariantAttribute {
  name: string;
  values: string[];
  rawValues?: string;
}

export function VariantBuilder({ 
  onVariantsChange, 
  initialVariants = [],
  availableImages = [] 
}: { 
  onVariantsChange: (variants: any[]) => void,
  initialVariants?: any[],
  availableImages?: string[] 
}) {
  const [attributes, setAttributes] = useState<VariantAttribute[]>([
    { name: "Size", values: ["S", "M", "L"], rawValues: "S, M, L" }
  ])
  const [generatedVariants, setGeneratedVariants] = useState<any[]>([])
  const [activeFilters, setActiveFilters] = useState<{ [key: string]: string }>({})
  const [isHydrated, setIsHydrated] = useState(false) // Fixes the destructive state loop

  // Hydrate only ONCE on initialization
  useEffect(() => {
    if (initialVariants.length > 0 && !isHydrated) {
      setGeneratedVariants(initialVariants)
      const recoveredAttributes: { [key: string]: Set<string> } = {}
      
      initialVariants.forEach(v => {
        [v.option1, v.option2, v.option3].forEach(opt => {
          if (opt?.name && opt?.value) {
            if (!recoveredAttributes[opt.name]) recoveredAttributes[opt.name] = new Set()
            recoveredAttributes[opt.name].add(opt.value)
          }
        })
      })
      
      const finalAttrs = Object.keys(recoveredAttributes).map(name => {
        const valsArray = Array.from(recoveredAttributes[name])
        return {
          name: name,
          values: valsArray,
          rawValues: valsArray.join(", ")
        }
      })
      
      if (finalAttrs.length > 0) setAttributes(finalAttrs)
      setIsHydrated(true)
    }
  }, [initialVariants, isHydrated])

  const filteredVariants = useMemo(() => {
    return generatedVariants.filter(v => {
      return Object.entries(activeFilters).every(([attrName, filterVal]) => {
        if (!filterVal) return true;
        const match = [v.option1, v.option2, v.option3].find(
          opt => opt?.name === attrName && opt?.value === filterVal
        );
        return !!match;
      });
    });
  }, [generatedVariants, activeFilters]);

  const updateAttributeValues = (idx: number, valString: string) => {
    const newAttrs = [...attributes]
    newAttrs[idx].rawValues = valString 
    newAttrs[idx].values = valString.split(",").map(v => v.trim()).filter(v => v !== "")
    setAttributes(newAttrs)
  }

  const updateVariantField = (index: number, field: string, value: string) => {
    const updated = [...generatedVariants]
    updated[index] = { ...updated[index], [field]: value }
    setGeneratedVariants(updated)
    onVariantsChange(updated)
  }

  // UPGRADED: Merges new combinations with your existing data
  const generateMatrix = () => {
    let matrix: any[] = [{}]
    attributes.forEach((attr, idx) => {
      const newMatrix: any[] = []
      attr.values.forEach(val => {
        matrix.forEach(row => {
          newMatrix.push({ ...row, [`option${idx + 1}`]: { name: attr.name, value: val } })
        })
      })
      matrix = newMatrix
    })

    const final = matrix.map(m => {
      // Look for an identical pre-existing combination
      const existing = generatedVariants.find(gv => 
        gv.option1?.value === m.option1?.value && 
        (m.option2 ? gv.option2?.value === m.option2.value : true) &&
        (m.option3 ? gv.option3?.value === m.option3.value : true)
      )

      // Retain old values if matched, otherwise deploy fresh defaults
      return existing || { sku: "", price: "", stock: "0", image_url: "", ...m }
    })

    setGeneratedVariants(final)
    onVariantsChange(final)
  }

  return (
    <div className="space-y-6 bg-white p-8 border border-black/10">
      <h3 className="text-[10px] font-bold uppercase tracking-widest border-b pb-4">Variant Configuration</h3>
      
      <div className="space-y-4">
        {attributes.map((attr, idx) => (
          <div key={idx} className="flex gap-4 items-end">
            <div className="flex-1 space-y-1">
              <label className="text-[9px] uppercase text-gray-400 font-bold">Attribute Name</label>
              <Input 
                placeholder="e.g. Color" 
                value={attr.name} 
                onChange={e => {
                  const n = [...attributes]; n[idx].name = e.target.value; setAttributes(n);
                }} 
                className="rounded-none border-black/10 focus:border-black" 
              />
            </div>
            
            <div className="flex-[2] space-y-1">
              <label className="text-[9px] uppercase text-gray-400 font-bold">Values (comma separated)</label>
              <Input 
                placeholder="Red, Blue, Green" 
                value={attr.rawValues !== undefined ? attr.rawValues : attr.values.join(", ")} 
                onChange={e => updateAttributeValues(idx, e.target.value)} 
                className="rounded-none border-black/10 focus:border-black" 
              />
            </div>
            <Button type="button" variant="ghost" onClick={() => setAttributes(attributes.filter((_, i) => i !== idx))}><Trash2 className="h-4 w-4"/></Button>
          </div>
        ))}
        <Button type="button" variant="outline" onClick={() => setAttributes([...attributes, { name: "", values: [], rawValues: "" }])} className="w-full border-dashed rounded-none text-[9px] uppercase py-6">+ Add Attribute</Button>
      </div>

      <Button type="button" onClick={generateMatrix} className="w-full bg-black text-white rounded-none uppercase text-[10px] tracking-[0.3em] font-bold h-14">Regenerate Matrix</Button>

      {generatedVariants.length > 0 && (
        <div className="mt-12 space-y-4">
          <div className="flex items-center gap-4 py-3 px-4 bg-zinc-50 border border-black/5">
            <Filter className="h-3 w-3 text-gray-400" />
            <span className="text-[9px] font-bold uppercase tracking-widest text-gray-400">Filter View:</span>
            <div className="flex flex-wrap gap-2">
              {attributes.map((attr) => (
                <select 
                  key={attr.name}
                  className="text-[10px] border border-black/10 bg-white px-2 py-1 outline-none"
                  value={activeFilters[attr.name] || ""}
                  onChange={(e) => setActiveFilters({ ...activeFilters, [attr.name]: e.target.value })}
                >
                  <option value="">All {attr.name}s</option>
                  {attr.values.map(val => <option key={val} value={val}>{val}</option>)}
                </select>
              ))}
              {Object.values(activeFilters).some(v => v !== "") && (
                <Button variant="ghost" size="sm" onClick={() => setActiveFilters({})} className="h-6 text-[9px] uppercase">
                  <X className="mr-1 h-3 w-3" /> Clear
                </Button>
              )}
            </div>
          </div>

          <div className="overflow-x-auto border border-black/5">
            <table className="w-full text-left text-[10px]">
              <thead>
                <tr className="bg-zinc-50 border-b uppercase font-bold text-gray-400">
                  <th className="p-4">Combination ({filteredVariants.length} shown)</th>
                  <th className="p-4">Media Link</th>
                  <th className="p-4">Price</th>
                  <th className="p-4">Stock</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredVariants.map((v, i) => {
                  const originalIndex = generatedVariants.findIndex(gv => gv === v);
                  return (
                    <tr key={i} className="border-b hover:bg-zinc-50/50">
                      <td className="p-4 font-bold uppercase text-zinc-600">
                        {v.option1?.value} {v.option2?.value ? ` / ${v.option2.value}` : ""}
                      </td>
                      
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          {v.image_url ? (
                            <img src={v.image_url} className="h-10 w-10 object-cover border border-black/10" alt="" />
                          ) : (
                            <div className="h-10 w-10 bg-zinc-50 border border-dashed border-black/10 flex items-center justify-center text-zinc-300 text-[8px] uppercase">
                              None
                            </div>
                          )}
                          <select 
                            className="text-[9px] uppercase font-bold tracking-widest bg-transparent outline-none cursor-pointer border border-black/5 p-1"
                            value={v.image_url || ""}
                            onChange={(e) => updateVariantField(originalIndex, 'image_url', e.target.value)}
                          >
                            <option value="">Select Photo</option>
                            {availableImages.map((url, imgIdx) => (
                              <option key={imgIdx} value={url}>Image {imgIdx + 1}</option>
                            ))}
                          </select>
                        </div>
                      </td>

                      <td className="p-4">
                        <Input className="h-9 rounded-none w-24 border-black/5" value={v.price} onChange={e => updateVariantField(originalIndex, 'price', e.target.value)} />
                      </td>
                      <td className="p-4">
                        <Input className="h-9 rounded-none w-20 border-black/5" value={v.stock} onChange={e => updateVariantField(originalIndex, 'stock', e.target.value)} />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}