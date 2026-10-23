import React from "react"

export const metadata = {
  title: "Size Guide | Zapatos Cave",
  description: "Detailed size measurements for Zapatos Cave premium training systems, apparel, and accessories.",
}

export default function SizeGuide() {
  return (
    <div className="w-full bg-white dark:bg-[#08080A] transition-colors duration-500 pt-32 pb-20 md:pb-8 min-h-screen">
      <div className="max-w-6xl mx-auto px-6 lg:px-12">
        
        {/* HEADER */}
        <div className="text-center mb-20">
          <h1 className="tracking-[0.5em] uppercase font-black text-zinc-950 dark:text-white text-2xl md:text-3xl">
            Size Guide
          </h1>
          <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-zinc-400 dark:text-zinc-500 mt-4">
            Measurements in inches unless stated otherwise
          </p>
          <div className="w-8 h-[1px] bg-zinc-900 dark:bg-zinc-800 mx-auto mt-6" />
        </div>

        <div className="space-y-20 max-w-4xl mx-auto">
          
          {/* MEN'S & UNISEX T-SHIRTS & POLOS */}
          <section>
            <h2 className="text-[10px] font-mono uppercase tracking-[0.2em] font-bold text-zinc-400 dark:text-zinc-600 mb-6 border-b border-zinc-100 dark:border-zinc-900 pb-3">
              Men's & Unisex T-Shirts & Polos
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left whitespace-nowrap">
                <thead className="text-[10px] font-mono uppercase tracking-widest text-zinc-500 dark:text-zinc-400">
                  <tr>
                    <th className="py-4 pr-6 font-bold">Size</th>
                    <th className="py-4 px-6 font-normal">Vapor Polo (Chest / Length)</th>
                    <th className="py-4 px-6 font-normal">Onli Fresh (Chest / Length)</th>
                    <th className="py-4 px-6 font-normal">Run Div. Dri-Fit (Chest / Length)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100 dark:divide-zinc-900 text-xs font-medium text-zinc-700 dark:text-zinc-300">
                  <tr><td className="py-4 pr-6 font-black uppercase">S</td><td className="py-4 px-6">-</td><td className="py-4 px-6">34-38" / 26"</td><td className="py-4 px-6">-</td></tr>
                  <tr><td className="py-4 pr-6 font-black uppercase">M</td><td className="py-4 px-6">36-40" / 26"</td><td className="py-4 px-6">36-40" / 26"</td><td className="py-4 px-6">36-40" / 26"</td></tr>
                  <tr><td className="py-4 pr-6 font-black uppercase">L</td><td className="py-4 px-6">38-42" / 27"</td><td className="py-4 px-6">38-42" / 27"</td><td className="py-4 px-6">38-42" / 27"</td></tr>
                  <tr><td className="py-4 pr-6 font-black uppercase">XL</td><td className="py-4 px-6">40-44" / 28"</td><td className="py-4 px-6">40-44" / 28"</td><td className="py-4 px-6">40-44" / 28"</td></tr>
                  <tr><td className="py-4 pr-6 font-black uppercase">2XL</td><td className="py-4 px-6">42-46" / 29"</td><td className="py-4 px-6">42-46" / 29"</td><td className="py-4 px-6">42-46" / 29"</td></tr>
                  <tr><td className="py-4 pr-6 font-black uppercase">3XL</td><td className="py-4 px-6">-</td><td className="py-4 px-6">44-48" / 30"</td><td className="py-4 px-6">44-48" / 30"</td></tr>
                  <tr><td className="py-4 pr-6 font-black uppercase">4XL</td><td className="py-4 px-6">-</td><td className="py-4 px-6">-</td><td className="py-4 px-6">46-50" / 31"</td></tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* MEN'S JACKETS */}
          <section>
            <h2 className="text-[10px] font-mono uppercase tracking-[0.2em] font-bold text-zinc-400 dark:text-zinc-600 mb-6 border-b border-zinc-100 dark:border-zinc-900 pb-3">
              Men's & Unisex Jackets
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left whitespace-nowrap">
                <thead className="text-[10px] font-mono uppercase tracking-widest text-zinc-500 dark:text-zinc-400">
                  <tr>
                    <th className="py-4 pr-6 font-bold">Size</th>
                    <th className="py-4 px-6 font-normal">Trailwind & Tracksuit (Chest)</th>
                    <th className="py-4 px-6 font-normal">Nike Stripe Dri-Fit (Chest / Sleeve / Length)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100 dark:divide-zinc-900 text-xs font-medium text-zinc-700 dark:text-zinc-300">
                  <tr><td className="py-4 pr-6 font-black uppercase">M</td><td className="py-4 px-6">40-44"</td><td className="py-4 px-6">42" / 24.5" / 26"</td></tr>
                  <tr><td className="py-4 pr-6 font-black uppercase">L</td><td className="py-4 px-6">42-46"</td><td className="py-4 px-6">42.5" / 25" / 26.5"</td></tr>
                  <tr><td className="py-4 pr-6 font-black uppercase">XL</td><td className="py-4 px-6">44-48"</td><td className="py-4 px-6">43" / 25.5" / 27"</td></tr>
                  <tr><td className="py-4 pr-6 font-black uppercase">2XL</td><td className="py-4 px-6">46-50"</td><td className="py-4 px-6">43.5" / 46" / 27.5"</td></tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* MEN'S BOTTOMS */}
          <section>
            <h2 className="text-[10px] font-mono uppercase tracking-[0.2em] font-bold text-zinc-400 dark:text-zinc-600 mb-6 border-b border-zinc-100 dark:border-zinc-900 pb-3">
              Men's & Unisex Bottoms
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left whitespace-nowrap">
                <thead className="text-[10px] font-mono uppercase tracking-widest text-zinc-500 dark:text-zinc-400">
                  <tr>
                    <th className="py-4 pr-6 font-bold">Size</th>
                    <th className="py-4 px-6 font-normal">Titleist Golf Trousers (Waist)</th>
                    <th className="py-4 px-6 font-normal">Tracksuit Joggers (Waist)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100 dark:divide-zinc-900 text-xs font-medium text-zinc-700 dark:text-zinc-300">
                  <tr><td className="py-4 pr-6 font-black uppercase">M</td><td className="py-4 px-6">28-30"</td><td className="py-4 px-6">28-30"</td></tr>
                  <tr><td className="py-4 pr-6 font-black uppercase">L</td><td className="py-4 px-6">30-32"</td><td className="py-4 px-6">30-32"</td></tr>
                  <tr><td className="py-4 pr-6 font-black uppercase">XL</td><td className="py-4 px-6">32-34"</td><td className="py-4 px-6">32-34"</td></tr>
                  <tr><td className="py-4 pr-6 font-black uppercase">2XL</td><td className="py-4 px-6">34-36"</td><td className="py-4 px-6">34-38"</td></tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* WOMEN'S TOPS */}
          <section>
            <h2 className="text-[10px] font-mono uppercase tracking-[0.2em] font-bold text-zinc-400 dark:text-zinc-600 mb-6 border-b border-zinc-100 dark:border-zinc-900 pb-3">
              Women's Tops
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left whitespace-nowrap">
                <thead className="text-[10px] font-mono uppercase tracking-widest text-zinc-500 dark:text-zinc-400">
                  <tr>
                    <th className="py-4 pr-6 font-bold">Size</th>
                    <th className="py-4 px-6 font-normal">Seamless T-Shirts (Chest)</th>
                    <th className="py-4 px-6 font-normal">Titleist Polo (Chest)</th>
                    <th className="py-4 px-6 font-normal">Run Div. Crop (Bust / Length)</th>
                    <th className="py-4 px-6 font-normal">Classic Plus Size (Chest)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100 dark:divide-zinc-900 text-xs font-medium text-zinc-700 dark:text-zinc-300">
                  <tr><td className="py-4 pr-6 font-black uppercase">S</td><td className="py-4 px-6">-</td><td className="py-4 px-6">24-28"</td><td className="py-4 px-6">-</td><td className="py-4 px-6">-</td></tr>
                  <tr><td className="py-4 pr-6 font-black uppercase">M</td><td className="py-4 px-6">26-30"</td><td className="py-4 px-6">26-30"</td><td className="py-4 px-6">31-32" / 17"</td><td className="py-4 px-6">-</td></tr>
                  <tr><td className="py-4 pr-6 font-black uppercase">L</td><td className="py-4 px-6">28-32"</td><td className="py-4 px-6">28-32"</td><td className="py-4 px-6">33-34" / 17.5"</td><td className="py-4 px-6">-</td></tr>
                  <tr><td className="py-4 pr-6 font-black uppercase">XL</td><td className="py-4 px-6">30-34"</td><td className="py-4 px-6">30-34"</td><td className="py-4 px-6">35-36" / 17.5"</td><td className="py-4 px-6">-</td></tr>
                  <tr><td className="py-4 pr-6 font-black uppercase">2XL</td><td className="py-4 px-6">32-36"</td><td className="py-4 px-6">-</td><td className="py-4 px-6">37-38.5" / 18"</td><td className="py-4 px-6">32-36"</td></tr>
                  <tr><td className="py-4 pr-6 font-black uppercase">3XL</td><td className="py-4 px-6">34-40"</td><td className="py-4 px-6">-</td><td className="py-4 px-6">40-42" / 18"</td><td className="py-4 px-6">34-38"</td></tr>
                  <tr><td className="py-4 pr-6 font-black uppercase">4XL</td><td className="py-4 px-6">-</td><td className="py-4 px-6">-</td><td className="py-4 px-6">-</td><td className="py-4 px-6">36-40"</td></tr>
                  <tr><td className="py-4 pr-6 font-black uppercase">5XL</td><td className="py-4 px-6">-</td><td className="py-4 px-6">-</td><td className="py-4 px-6">-</td><td className="py-4 px-6">38-44"</td></tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* WOMEN'S BOTTOMS */}
          <section>
            <h2 className="text-[10px] font-mono uppercase tracking-[0.2em] font-bold text-zinc-400 dark:text-zinc-600 mb-6 border-b border-zinc-100 dark:border-zinc-900 pb-3">
              Women's Bottoms
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left whitespace-nowrap">
                <thead className="text-[10px] font-mono uppercase tracking-widest text-zinc-500 dark:text-zinc-400">
                  <tr>
                    <th className="py-4 pr-6 font-bold">Size</th>
                    <th className="py-4 px-6 font-normal">Run Division Leggings (Waist / Hips)</th>
                    <th className="py-4 px-6 font-normal">College One Capri (Waist / Hips)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100 dark:divide-zinc-900 text-xs font-medium text-zinc-700 dark:text-zinc-300">
                  <tr><td className="py-4 pr-6 font-black uppercase">M</td><td className="py-4 px-6">24-25" / 34-35"</td><td className="py-4 px-6">26-30" / 33-38"</td></tr>
                  <tr><td className="py-4 pr-6 font-black uppercase">L</td><td className="py-4 px-6">26-27" / 36-37"</td><td className="py-4 px-6">28-32" / 35-40"</td></tr>
                  <tr><td className="py-4 pr-6 font-black uppercase">XL</td><td className="py-4 px-6">28-29" / 38-39"</td><td className="py-4 px-6">30-34" / 37-42"</td></tr>
                  <tr><td className="py-4 pr-6 font-black uppercase">2XL</td><td className="py-4 px-6">30-31.5" / 40-41.5"</td><td className="py-4 px-6">32-36" / 39-44"</td></tr>
                  <tr><td className="py-4 pr-6 font-black uppercase">3XL</td><td className="py-4 px-6">33-35" / 43-45"</td><td className="py-4 px-6">34-40" / 41-48"</td></tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* ACCESSORIES & GEAR */}
          <section>
            <h2 className="text-[10px] font-mono uppercase tracking-[0.2em] font-bold text-zinc-400 dark:text-zinc-600 mb-6 border-b border-zinc-100 dark:border-zinc-900 pb-3">
              Accessories & Gear
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left whitespace-nowrap">
                <thead className="text-[10px] font-mono uppercase tracking-widest text-zinc-500 dark:text-zinc-400">
                  <tr>
                    <th className="py-4 pr-6 font-bold">Product</th>
                    <th className="py-4 px-6 font-normal">Size Options / Dimensions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100 dark:divide-zinc-900 text-xs font-medium text-zinc-700 dark:text-zinc-300">
                  <tr><td className="py-4 pr-6 font-black uppercase">FitUp Life Gym Gloves</td><td className="py-4 px-6">Small (7-7.5"), Medium (7.5-8"), Large (8-9"), XL (9-10")</td></tr>
                  <tr><td className="py-4 pr-6 font-black uppercase">Jackal Gym Gloves</td><td className="py-4 px-6">Large (8-9"), X-Large (9-10"), 2X-Large (10-11")</td></tr>
                  <tr><td className="py-4 pr-6 font-black uppercase">Wilson Duffel Bag</td><td className="py-4 px-6">30 Litres Capacity (25 x 50 x 25 cm)</td></tr>
                  <tr><td className="py-4 pr-6 font-black uppercase">Onli_Fresh Caps</td><td className="py-4 px-6">ONE SIZE (Adjustable)</td></tr>
                  <tr><td className="py-4 pr-6 font-black uppercase">Support Knee Brace</td><td className="py-4 px-6">Adjustable Fit (Meniscus Support)</td></tr>
                  <tr><td className="py-4 pr-6 font-black uppercase">Swim Cap</td><td className="py-4 px-6">Universal Fit</td></tr>
                </tbody>
              </table>
            </div>
          </section>

        </div>
      </div>
    </div>
  )
}