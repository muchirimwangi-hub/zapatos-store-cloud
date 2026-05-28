export interface ChatQA {
  keywords: string[]
  question: string
  answer: string
  category: 'compression' | 'tracksuits' | 'general' | 'sizing' | 'logistics' | 'orders'
}

export const chatbotQA: ChatQA[] = [
  // ─── COMPRESSION TECHNOLOGY ───
  {
    keywords: ['compression', 'array', 'arrays', 'tension', 'spandex', 'vibration'],
    question: 'What are Compression Arrays?',
    answer: 'Zapatos Cave Compression Arrays are high-tension poly-spandex structural garments engineered to maximize localized blood flow return, stabilize muscular groups, and eliminate soft-tissue vibration under heavy training loads.',
    category: 'compression',
  },
  {
    keywords: ['benefit', 'benefits', 'why compression', 'performance', 'recovery'],
    question: 'What are the benefits of training in compression gear?',
    answer: 'Compression structures accelerate muscle oxygenation, mitigate delayed onset muscle soreness (DOMS), and increase mechanical proprioception during dynamic movements—keeping your frame stable and locked down.',
    category: 'compression',
  },
  {
    keywords: ['flatlock', 'seams', 'chafing', 'stitch', 'stitching'],
    question: 'How are the panels assembled?',
    answer: 'Every element uses low-profile flatlock stitching. We eliminate raised overlapping seams to prevent structural friction patterns and skin chafing over high-repetition athletic routines.',
    category: 'compression',
  },

  // ─── THERMAL TRACKSUITS ───
  {
    keywords: ['tracksuit', 'tracksuits', 'thermal', 'insulation', 'warmth', 'climate'],
    question: 'How do Thermal Tracksuits work?',
    answer: 'Our tracksuits utilize engineered, double-knit synthetic matrices designed to trap core muscular heat loops while managing vapor transfer to optimize baseline thermal stability across shifting climates.',
    category: 'tracksuits',
  },
  {
    keywords: ['breathable', 'sweat', 'moisture', 'wicking', 'dry'],
    question: 'Are the tracksuits breathable during high-output sessions?',
    answer: 'Yes. The synthetic fabric blend features targeted micro-ventilation mapping vectors that draw ambient moisture away from the skin surface, facilitating rapid evaporation without cooling down major muscle groups.',
    category: 'tracksuits',
  },

  // ─── SIZING SPECIFICATIONS ───
  {
    keywords: ['size', 'sizing', 'fit', 'measurement', 'chart', 'small', 'medium', 'large', 'xl'],
    question: 'What is my Sizing Specification?',
    answer: 'Our gear is tailored for a precise, high-performance fit. Compression components require a strict skin-tight compression layout. If you lean between standard sizing thresholds or prefer an extended range, we highly advise scaling up one size.',
    category: 'sizing',
  },
  {
    keywords: ['tight', 'loose', 'how should it fit', 'compression fit'],
    question: 'How tight should compression gear feel?',
    answer: 'It must lock firmly onto your framework like a second skin without compressing circulation. If you experience restricted mobility around joints or seam stress marks, migrate up to the next specification boundary.',
    category: 'sizing',
  },

  // ─── LOGISTICS & KENYAN SHIPPING ───
  {
    keywords: ['shipping', 'delivery', 'nakuru', 'nairobi', 'g4s', 'fargo', 'how long', 'courier'],
    question: 'What are your shipping options?',
    answer: 'Central hub operations run out of Nakuru. Delivery within Nairobi scales within 24 hours via local courier networks. Upcountry destinations (Mombasa, Kisumu, Eldoret, etc.) dispatch via G4S or Wells Fargo within 24–48 hours.',
    category: 'logistics',
  },
  {
    keywords: ['cost', 'price', 'shipping fee', 'free shipping', 'ksh'],
    question: 'How much does delivery cost within Kenya?',
    answer: 'Standard local courier routing inside Nakuru is KSh 150. Nairobi and adjacent nodes scale from KSh 250 to KSh 400 depending on exact sector drop zones. Consolidations scaling above KSh 8,000 unlock automatic free shipping parameters.',
    category: 'logistics',
  },
  {
    keywords: ['pickup', 'physical store', 'mall', 'lams'],
    question: 'Can I pick up my gear directly?',
    answer: 'Yes. Direct physical verification is accessible at our central node hub located at Lams Business Mall in Nakuru during standard operational operational hours (Mon–Sat: 8:30 AM – 5:30 PM).',
    category: 'logistics',
  },

  // ─── ORDER MANAGEMENT & VERIFICATION ───
  {
    keywords: ['order', 'track', 'tracking', 'status', 'packet'],
    question: 'How do I track my delivery log?',
    answer: 'Upon package compilation, a direct tracking log code paired with your transit carrier receipt (G4S/Wells Fargo manifest) will be piped directly to your dashboard or communication profile.',
    category: 'orders',
  },
  {
    keywords: ['mpesa', 'payment', 'pay', 'stk', 'till', 'lipa'],
    question: 'What payment frameworks do you accept?',
    answer: 'We accept secure M-Pesa tracking verification, mobile till transfers, and standard credit/debit card pipelines at our digital checkout system. All transaction packets are strictly encrypted.',
    category: 'orders',
  },
  {
    keywords: ['return', 'exchange', 'refund', 'policy'],
    question: 'What is your item return protocol?',
    answer: 'Unused, unwashed technical garments in pristine condition with native packaging elements intact can be returned within 14 days of delivery. For hygiene reasons, compression components cannot be returned once unsealed.',
    category: 'orders',
  },

  // ─── GENERAL BRAND SYSTEM MANIFESTO ───
  {
    keywords: ['about', 'zapatos', 'brand', 'who are you', 'cave', 'sportswear'],
    question: 'What is Zapatos Cave?',
    answer: 'Zapatos Cave is an engineered athletic apparel brand specializing in heavy-duty compression arrays and high-performance training systems. We eliminate superficial fashion aesthetics to deliver minimalist, high-utility gear built to survive intense operational strain.',
    category: 'general',
  },
  {
    keywords: ['location', 'kenya', 'kenyan', 'local'],
    question: 'Where is the brand based?',
    answer: 'Zapatos Cave is proudly based in Nakuru, Kenya, serving high-performance athletes, tactical runners, and sports networks across East Africa.',
    category: 'general',
  },
  {
    keywords: ['email', 'contact email', 'support email', 'address'],
    question: 'What is your official system email?',
    answer: 'Our direct monitoring support relay is info@zapatoscave.com.',
    category: 'general',
  },
  {
    keywords: ['hello', 'hi', 'hey', 'greetings', 'jambo'],
    question: 'Hello!',
    answer: 'System initialized. Welcome to Zapatos Cave. Input query parameters regarding activewear specifications, sizing diagnostics, or shipping logs below.',
    category: 'general',
  },
  {
    keywords: ['thank', 'thanks', 'thank you', 'done'],
    question: 'Thank you!',
    answer: 'Transmission process complete. If you require further structural adjustments or configuration lookups, the interface queue remains active. Execute your goals.',
    category: 'general',
  },
]

export const defaultSuggestions = [
  'What are Compression Arrays?',
  'How do Thermal Tracksuits work?',
  'What is my Sizing Specification?',
  'What are your shipping options?',
  'How do I track my delivery log?',
]

export function findBestMatch(input: string): ChatQA | null {
  const normalised = input.toLowerCase().trim()

  if (normalised.length < 2) return null

  let bestMatch: ChatQA | null = null
  let bestScore = 0

  for (const qa of chatbotQA) {
    let score = 0

    for (const keyword of qa.keywords) {
      if (normalised.includes(keyword.toLowerCase())) {
        score += keyword.length
      }
    }

    // Exact question baseline matching booster
    if (normalised === qa.question.toLowerCase()) {
      score += 100
    }

    if (score > bestScore) {
      bestScore = score
      bestMatch = qa
    }
  }

  return bestScore >= 2 ? bestMatch : null
}