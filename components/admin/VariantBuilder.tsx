"use client"

import { useState } from "react"
import { Plus, Trash2, Layers } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export function VariantBuilder({ onVariantsChange }: { onVariantsChange: (variants: any[]) => void }) {
  const [options, setOptions] = useState([{ name: "Size", values: ["S", "M", "L"] }])
  const [generatedVariants, setGeneratedVariants] = useState<any[]>([])

  const generateMatrix = () => {
    // Logic to cross-multiply options into a matrix
    let matrix: any[] = [{}];
    
    options.forEach((opt, index) => {
      const newMatrix: any[] = [];
      opt.values.forEach(val => {
        matrix.forEach(row => {
          newMatrix.push({ ...row, [`option${index + 1}`]: { name: opt.name, value: val } });
        });
      });
      matrix = newMatrix;
    });

    const finalVariants = matrix.map(m => ({
      sku: "",
      price: "0",
      stock: "0",
      ...m
    }));

    setGeneratedVariants(finalVariants);
    onVariantsChange(finalVariants);
  }

  return (
    <div className="space-y-6 bg-white p-6 border border-black/10">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-bold uppercase tracking-widest">Variant Configurator</h3>
        <Button 
  type="button" // <--- ADD THIS LINE
  variant="outline" 
  size="sm" 
  onClick={generateMatrix}
>
  <Layers className="mr-2 h-4 w-4" /> Generate Matrix
</Button>
      </div>

      {/* Matrix Table */}
      {generatedVariants.length > 0 && (
        <div className="overflow-x-auto border-t pt-4">
          <table className="w-full text-xs">
            <thead>
              <tr className="text-gray-400 uppercase tracking-tighter">
                <th className="text-left py-2">Variant</th>
                <th className="text-left py-2">SKU</th>
                <th className="text-left py-2">Price (Ksh)</th>
                <th className="text-left py-2">Stock</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {generatedVariants.map((v, i) => (
                <tr key={i}>
                  <td className="py-3 font-bold">
                    {v.option1?.value} {v.option2?.value ? `/ ${v.option2.value}` : ""}
                  </td>
                  <td><Input className="h-8 rounded-none" placeholder="SKU-001" /></td>
                  <td><Input className="h-8 rounded-none" placeholder="2100" /></td>
                  <td><Input className="h-8 rounded-none" placeholder="10" /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}