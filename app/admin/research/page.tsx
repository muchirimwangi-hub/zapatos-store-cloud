"use client";
import { useEffect, useState, useMemo } from "react";
import { createClient } from "@/lib/supabase/client";

// THE INVESTMENT STRATEGY MAP
const INVESTMENT_STRATEGY: Record<string, { title: string, meaning: string, investmentFocus: string }> = {
  minimalist: { 
    title: "Minimalist", 
    meaning: "Focus on purity, low-clutter, and essentialism.", 
    investmentFocus: "Budget for premium lightweight technical fabrics (Nylon/Spandex blends) & simplified supply chain." 
  },
  grinder: { 
    title: "Grinder", 
    meaning: "Focus on high-output, durability, and resilience.", 
    investmentFocus: "Invest in reinforced stitching, heavy-duty abrasion-resistant textiles, and high-volume restocks." 
  },
  hybrid: { 
    title: "Hybrid", 
    meaning: "Focus on multi-functional, adaptive utility.", 
    investmentFocus: "Invest in 'all-weather' versatility, modular designs, and pockets/storage utility." 
  },
  vanguard: { 
    title: "Vanguard", 
    meaning: "Focus on aesthetic authority and elite presentation.", 
    investmentFocus: "Invest in high-end studio photography, limited-edition colorways, and lifestyle crossover marketing." 
  }
};

export default function ResearchCentre() {
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    async function fetchResearch() {
      const supabase = createClient();
      const { data } = await supabase.from('quiz_analytics').select('*');
      setData(data || []);
    }
    fetchResearch();
  }, []);

  // Calculate Aggregates for Global Trends
  const trends = useMemo(() => {
    const counts = data.reduce((acc, row) => {
      acc[row.archetype_result] = (acc[row.archetype_result] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    return counts;
  }, [data]);

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-12">
      {/* 1. GLOBAL TRENDS - THE EXECUTIVE SUMMARY */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {Object.entries(INVESTMENT_STRATEGY).map(([key, strat]) => (
          <div key={key} className="p-6 bg-zinc-900 text-white">
            <h3 className="text-[10px] uppercase font-black tracking-widest text-zinc-500 mb-2">{key}</h3>
            <div className="text-3xl font-black mb-4">{trends[key] || 0}</div>
            <p className="text-[10px] text-zinc-400 font-light leading-relaxed">{strat.investmentFocus}</p>
          </div>
        ))}
      </section>

      {/* 2. THE RESEARCH LIST */}
      <section>
        <h2 className="text-xs font-black uppercase tracking-widest mb-6">// RAW DIAGNOSTIC LOGS</h2>
        <div className="bg-white border border-zinc-200">
           {data.map((row) => (
            <div key={row.id} className="p-4 border-b border-zinc-100 flex justify-between items-center text-xs font-mono">
              <span className="font-bold">{row.archetype_result.toUpperCase()}</span>
              <span className="text-zinc-400">{new Date(row.created_at).toLocaleDateString()}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}