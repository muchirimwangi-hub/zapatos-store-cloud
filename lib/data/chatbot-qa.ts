export interface ChatQA {
  keywords: string[]
  question: string
  answer: string
  category: 'fragrance' | 'bodycare' | 'general' | 'quiz' | 'gifting' | 'orders'
}

export const chatbotQA: ChatQA[] = [
  // ─── FRAGRANCE BASICS ───
  {
    keywords: ['eau de parfum', 'edp', 'parfum'],
    question: 'What is Eau de Parfum?',
    answer: 'Eau de Parfum (EDP) contains 15–20% fragrance concentration, making it long-lasting (6–8 hours). It\'s our most popular format — rich enough for evenings yet wearable every day.',
    category: 'fragrance',
  },
  {
    keywords: ['eau de toilette', 'edt', 'toilette'],
    question: 'What is Eau de Toilette?',
    answer: 'Eau de Toilette (EDT) has 5–15% concentration. It\'s lighter, fresher, and perfect for daytime or warmer climates. Expect 3–5 hours of wear.',
    category: 'fragrance',
  },
  {
    keywords: ['difference', 'edp vs edt', 'parfum vs toilette', 'concentration'],
    question: 'What\'s the difference between EDP and EDT?',
    answer: 'The main difference is concentration. EDP (15–20%) lasts longer and projects more, while EDT (5–15%) is lighter and ideal for casual wear. EDP tends to cost more due to higher oil content.',
    category: 'fragrance',
  },
  {
    keywords: ['last', 'long', 'lasting', 'longevity', 'how long', 'wear time'],
    question: 'How long does fragrance last?',
    answer: 'It depends on the concentration: Parfum lasts 8–12 hours, EDP 6–8 hours, EDT 3–5 hours. Factors like skin type, hydration, and weather also affect longevity. Moisturised skin holds scent longer.',
    category: 'fragrance',
  },
  {
    keywords: ['make last', 'last longer', 'tips', 'longevity tips'],
    question: 'How can I make my fragrance last longer?',
    answer: 'Apply to pulse points (wrists, neck, behind ears). Moisturise skin first — fragrance clings to hydrated skin. Don\'t rub your wrists together as it breaks down the molecules. Layer with matching body products for extra staying power.',
    category: 'fragrance',
  },
  {
    keywords: ['pulse point', 'where to apply', 'spray', 'apply'],
    question: 'Where should I apply fragrance?',
    answer: 'Spray on pulse points where blood vessels are close to the skin: inner wrists, neck, behind the ears, inside elbows, and behind the knees. These warm areas help diffuse the scent naturally throughout the day.',
    category: 'fragrance',
  },
  {
    keywords: ['top note', 'middle note', 'base note', 'notes', 'pyramid'],
    question: 'What are fragrance notes?',
    answer: 'Fragrances are built in three layers. Top notes (first 15 mins) are the initial impression — citrus, herbs. Middle/heart notes (15 mins–2 hrs) are the core character — florals, spices. Base notes (2+ hrs) are the lasting foundation — woods, musk, amber.',
    category: 'fragrance',
  },
  {
    keywords: ['sillage', 'projection', 'trail'],
    question: 'What is sillage?',
    answer: 'Sillage (see-yazh) is the scent trail you leave as you move. A fragrance with strong sillage can be noticed by people nearby. It\'s different from longevity — a scent can last long on skin but have soft sillage, or vice versa.',
    category: 'fragrance',
  },
  {
    keywords: ['store', 'storage', 'keep', 'preserve'],
    question: 'How should I store my fragrances?',
    answer: 'Keep fragrances in a cool, dark, dry place away from direct sunlight and heat. Avoid bathrooms — humidity breaks down the formula. A bedroom drawer or wardrobe shelf is ideal. Properly stored, most fragrances last 3–5 years.',
    category: 'fragrance',
  },
  {
    keywords: ['expire', 'expiry', 'shelf life', 'go bad', 'old'],
    question: 'Do fragrances expire?',
    answer: 'Most fragrances last 3–5 years if stored properly. Signs of expiration include colour change (darkening), altered scent, or reduced projection. Heavier base-note-dominant scents (oud, amber) often age better than fresh, citrus-forward ones.',
    category: 'fragrance',
  },
  {
    keywords: ['layer', 'layering', 'combine', 'mix'],
    question: 'Can I layer fragrances?',
    answer: 'Absolutely! Layering is a great way to create a signature scent. Start with a heavier base fragrance and add a lighter one on top. Try pairing vanilla with citrus, or oud with rose. Our body care products are designed to layer beautifully with our fragrances.',
    category: 'fragrance',
  },
  {
    keywords: ['signature scent', 'find my scent', 'choose', 'pick', 'select'],
    question: 'How do I find my signature scent?',
    answer: 'Start with our Scent Personality Test — it analyses your lifestyle and preferences to recommend fragrances matched to you. Beyond that, test on skin (not paper), wear it for a full day, and trust your instinct. Your signature should feel like an extension of who you are.',
    category: 'fragrance',
  },
  {
    keywords: ['season', 'summer', 'winter', 'weather', 'warm', 'cold'],
    question: 'Should I change fragrances with seasons?',
    answer: 'Many people do! In warm weather, lighter citrus and aquatic scents project beautifully without being overwhelming. In cooler months, richer scents with amber, oud, and spices feel more appropriate and project further in cold air.',
    category: 'fragrance',
  },
  {
    keywords: ['unisex', 'gender', 'men', 'women', 'masculine', 'feminine'],
    question: 'Are your fragrances unisex?',
    answer: 'We believe scent has no gender. Many of our fragrances are designed to be enjoyed by anyone. Fragrance families like oud, amber, and fresh citrus are universally appealing. Wear what makes you feel confident.',
    category: 'fragrance',
  },
  {
    keywords: ['oud', 'agarwood'],
    question: 'What is oud?',
    answer: 'Oud (agarwood) is one of the most prized fragrance ingredients in the world. It comes from the resinous heartwood of aquilaria trees. It\'s rich, complex, and deeply woody with sweet, animalic undertones. It\'s a cornerstone of Middle Eastern perfumery and increasingly popular worldwide.',
    category: 'fragrance',
  },
  {
    keywords: ['musk', 'musky'],
    question: 'What does musk smell like?',
    answer: 'Modern musk is soft, warm, and skin-like — often described as "clean" or "comforting." Synthetic musks replaced animal-derived ones decades ago and come in varieties: white musk (clean, powdery), dark musk (animalic, sultry), and skin musks (barely-there warmth).',
    category: 'fragrance',
  },
  {
    keywords: ['amber', 'ambergris'],
    question: 'What is amber in fragrance?',
    answer: 'Amber in perfumery isn\'t a single ingredient — it\'s a warm, resinous accord typically blending labdanum, benzoin, and vanilla. It creates a rich, cocooning base that\'s sweet, slightly powdery, and deeply comforting. It\'s one of the most popular base notes worldwide.',
    category: 'fragrance',
  },
  {
    keywords: ['vanilla', 'gourmand', 'sweet'],
    question: 'Why is vanilla so popular in fragrance?',
    answer: 'Vanilla is universally loved because it triggers feelings of warmth and comfort. In perfumery, it adds depth, sweetness, and longevity. It pairs beautifully with oud, rose, sandalwood, and tobacco. Gourmand fragrances featuring vanilla are among our bestsellers.',
    category: 'fragrance',
  },
  {
    keywords: ['floral', 'rose', 'jasmine', 'flower'],
    question: 'What are the most popular floral notes?',
    answer: 'Rose, jasmine, and tuberose are the holy trinity of floral perfumery. Rose can be fresh or deep, jasmine adds an intoxicating sweetness, and tuberose is creamy and opulent. Other popular florals include peony, iris, and lily of the valley.',
    category: 'fragrance',
  },
  {
    keywords: ['niche', 'designer', 'difference niche'],
    question: 'What\'s the difference between niche and designer fragrance?',
    answer: 'Designer fragrances are made by fashion houses (mass-market, widely available). Niche fragrances are from houses focused solely on perfumery — they tend to use rarer ingredients, more complex compositions, and smaller production runs. Zapatos sits in the accessible luxury space, bringing niche-quality at fair prices.',
    category: 'fragrance',
  },
  {
    keywords: ['tester', 'sample', 'try', 'test'],
    question: 'Can I try before I buy?',
    answer: 'We recommend starting with our Scent Personality Test for tailored recommendations. We\'re working on a discovery set program that will let you sample multiple fragrances before committing to a full bottle. Stay tuned!',
    category: 'fragrance',
  },
  {
    keywords: ['allergy', 'allergic', 'sensitive', 'reaction', 'irritation'],
    question: 'Can fragrances cause allergic reactions?',
    answer: 'Some people are sensitive to certain fragrance ingredients. If you have known sensitivities, check our ingredient lists on each product page. Always patch-test new fragrances on a small area of skin first. Avoid spraying directly on sensitive or broken skin.',
    category: 'fragrance',
  },
  {
    keywords: ['alcohol free', 'oil based', 'attar'],
    question: 'Do you have alcohol-free fragrances?',
    answer: 'We\'re expanding our range to include oil-based perfumes (attars) which are alcohol-free and great for sensitive skin. Oil-based formats tend to sit closer to the skin with intimate sillage. Check back for updates on our oil fragrance collection.',
    category: 'fragrance',
  },

  // ─── BODY CARE ───
  {
    keywords: ['body care', 'bodycare', 'body products', 'range'],
    question: 'What body care products do you offer?',
    answer: 'Our body care line includes luxurious body lotions, body oils, shower gels, body scrubs, and hand creams. Each is formulated with nourishing ingredients and scented to complement our fragrance collection for effortless layering.',
    category: 'bodycare',
  },
  {
    keywords: ['body lotion', 'moisturiser', 'moisturizer', 'lotion'],
    question: 'How should I use body lotion?',
    answer: 'Apply generously to clean, slightly damp skin right after showering — this locks in moisture. Focus on dry areas like elbows, knees, and shins. Our scented body lotions double as a fragrance base layer, extending the life of your perfume.',
    category: 'bodycare',
  },
  {
    keywords: ['body oil', 'oil', 'dry oil'],
    question: 'What are the benefits of body oil?',
    answer: 'Body oils deeply nourish and create a luminous glow. They absorb quickly and are excellent for locking in hydration. Apply to damp skin post-shower for best results. Our body oils are formulated to layer beautifully under fragrance.',
    category: 'bodycare',
  },
  {
    keywords: ['body scrub', 'exfoliate', 'exfoliation', 'scrub'],
    question: 'How often should I use a body scrub?',
    answer: 'Use a body scrub 2–3 times per week to remove dead skin cells and promote cell turnover. This keeps skin smooth, glowing, and better at absorbing moisturiser and fragrance. Avoid scrubbing broken or irritated skin.',
    category: 'bodycare',
  },
  {
    keywords: ['dry skin', 'dehydrated', 'flaky'],
    question: 'What products are best for dry skin?',
    answer: 'For dry skin, we recommend our rich body lotion or body oil applied to damp skin. Look for ingredients like shea butter, hyaluronic acid, and natural oils. Exfoliate gently 1–2 times weekly to remove dead skin that blocks moisture absorption.',
    category: 'bodycare',
  },
  {
    keywords: ['oily skin', 'greasy'],
    question: 'What if I have oily skin?',
    answer: 'Even oily skin needs hydration! Opt for lightweight, non-comedogenic body lotions. Our gel-based formulas absorb quickly without leaving residue. Avoid heavy oils on oily areas and focus them on typically drier zones like legs and arms.',
    category: 'bodycare',
  },
  {
    keywords: ['sensitive skin', 'gentle', 'hypoallergenic'],
    question: 'Are your body care products suitable for sensitive skin?',
    answer: 'Many of our body care products are formulated with gentle, skin-friendly ingredients. We always recommend checking the ingredient list on each product page. Patch-test new products and start with our unscented or lightly scented options if you have very reactive skin.',
    category: 'bodycare',
  },
  {
    keywords: ['ingredient', 'ingredients', 'what\'s in', 'formulation'],
    question: 'What ingredients do you use?',
    answer: 'We prioritise high-quality ingredients: shea butter, natural essential oils, vitamin E, hyaluronic acid, and botanical extracts. Every product page lists full ingredients. We avoid parabens and harsh sulphates in our body care range.',
    category: 'bodycare',
  },
  {
    keywords: ['vegan', 'cruelty free', 'cruelty-free', 'animal'],
    question: 'Are your products cruelty-free?',
    answer: 'We are committed to cruelty-free practices. None of our products are tested on animals. We\'re continuously working toward fully vegan formulations across the range. Check individual product pages for vegan status.',
    category: 'bodycare',
  },
  {
    keywords: ['hand cream', 'hand care', 'hands'],
    question: 'Tell me about your hand creams.',
    answer: 'Our hand creams are fast-absorbing, deeply moisturising, and beautifully scented. They\'re perfect for on-the-go hydration without greasiness. Keep one in your bag, at your desk, and on your nightstand. They also make wonderful small gifts.',
    category: 'bodycare',
  },
  {
    keywords: ['shower gel', 'body wash', 'bath'],
    question: 'What makes your shower gels different?',
    answer: 'Our shower gels create a rich, luxurious lather while being gentle on skin. They\'re formulated with moisturising agents so your skin doesn\'t feel stripped after washing. The scents are designed to match our fragrance line for seamless layering.',
    category: 'bodycare',
  },
  {
    keywords: ['routine', 'daily routine', 'skincare routine', 'body routine'],
    question: 'What\'s the ideal body care routine?',
    answer: 'Our recommended routine: 1) Cleanse with shower gel, 2) Exfoliate 2–3x/week with body scrub, 3) Apply body oil or lotion to damp skin, 4) Layer with your fragrance on pulse points. This gives you all-day hydration and scent that lasts.',
    category: 'bodycare',
  },

  // ─── SCENT PERSONALITY / QUIZ ───
  {
    keywords: ['quiz', 'scent personality', 'personality test', 'aura', 'discover'],
    question: 'What is the Scent Personality Test?',
    answer: 'Our signature Scent Personality Test analyses your lifestyle, preferences, and personality to determine your scent profile. It then recommends fragrances and body care products uniquely suited to you. It takes about 2 minutes and it\'s completely free!',
    category: 'quiz',
  },
  {
    keywords: ['take quiz', 'start quiz', 'where quiz'],
    question: 'How do I take the Scent Personality Test?',
    answer: 'Head to the "Discover Your Aura" page from the navigation menu, or I can direct you there! The test walks you through a series of lifestyle and preference questions to find your perfect scent match.',
    category: 'quiz',
  },
  {
    keywords: ['quiz result', 'result accurate', 'retake', 'redo quiz'],
    question: 'Can I retake the quiz?',
    answer: 'Absolutely! Your tastes can evolve over time, so feel free to retake the test whenever you like. Each result gives you fresh recommendations based on your current answers.',
    category: 'quiz',
  },
  {
    keywords: ['scent profile', 'fragrance family', 'family'],
    question: 'What are fragrance families?',
    answer: 'Fragrances are grouped into families: Floral (rose, jasmine), Oriental (amber, vanilla, spice), Woody (sandalwood, cedar, oud), Fresh (citrus, aquatic, green), and Gourmand (vanilla, caramel, coffee). Our quiz helps identify which families resonate with your personality.',
    category: 'quiz',
  },

  // ─── GIFTING ───
  {
    keywords: ['gift', 'gifting', 'present', 'gift box'],
    question: 'How does the Gift Curator work?',
    answer: 'Our Gift Curator lets you hand-pick up to 4 products to create a personalised gift box. Add a heartfelt note, save it to your account, or add the whole box to your cart. It\'s the perfect way to give a curated luxury experience.',
    category: 'gifting',
  },
  {
    keywords: ['gift recommendation', 'gift idea', 'what to gift', 'gift for'],
    question: 'What makes a good fragrance gift?',
    answer: 'If you know their taste — go for a full-size fragrance. If unsure, our discovery sets or body care bundles are safer bets. The Gift Curator is great for building a personalised set. You can also share the Scent Personality Test link so they can discover their own match!',
    category: 'gifting',
  },
  {
    keywords: ['save gift', 'saved gifts', 'gift account'],
    question: 'Can I save my curated gift for later?',
    answer: 'Yes! When you\'re signed in, hit "Save Gift Box" on the Gift Curator page. It\'s stored in your account under "Saved Gifts" in the menu. You can come back and purchase it anytime or share the link with someone.',
    category: 'gifting',
  },
  {
    keywords: ['gift wrap', 'wrapping', 'packaging', 'box'],
    question: 'Do you offer gift wrapping?',
    answer: 'All our products come in premium packaging that\'s gift-ready. Gift boxes curated through our Gift Curator include elegant presentation. We\'re working on adding custom wrapping options at checkout — stay tuned!',
    category: 'gifting',
  },
  {
    keywords: ['gift card', 'voucher', 'gift certificate'],
    question: 'Do you sell gift cards?',
    answer: 'Gift cards are coming soon! In the meantime, our Gift Curator is a great way to create a thoughtful, personalised gift for someone special.',
    category: 'gifting',
  },

  // ─── ORDERS & SHIPPING ───
  {
    keywords: ['order', 'track', 'tracking', 'where is my order'],
    question: 'How do I track my order?',
    answer: 'Once your order ships, you\'ll receive an email with tracking details. You can also check your order status from your account. If you have any issues, reach out to us through our Contact page.',
    category: 'orders',
  },
  {
    keywords: ['shipping', 'delivery', 'how long delivery', 'ship'],
    question: 'What are your shipping options?',
    answer: 'We offer standard shipping (5–7 business days) and express shipping (2–3 business days). Orders over a certain amount qualify for free standard shipping. Check our Shipping page for full details and international availability.',
    category: 'orders',
  },
  {
    keywords: ['international', 'ship abroad', 'outside nigeria', 'worldwide'],
    question: 'Do you ship internationally?',
    answer: 'We\'re expanding our shipping reach! Currently, we ship within Nigeria and are working on international shipping options. Check our Shipping page for the latest updates on available destinations.',
    category: 'orders',
  },
  {
    keywords: ['return', 'refund', 'exchange', 'return policy'],
    question: 'What is your return policy?',
    answer: 'We accept returns on unopened, unused products within 14 days of delivery. Fragrances that have been opened or used cannot be returned for hygiene reasons. Contact us through our Contact page to initiate a return.',
    category: 'orders',
  },
  {
    keywords: ['payment', 'pay', 'payment method', 'card', 'pay with'],
    question: 'What payment methods do you accept?',
    answer: 'We accept major credit/debit cards through our secure checkout. More payment options including bank transfers and mobile payments are being added. All transactions are encrypted and secure.',
    category: 'orders',
  },
  {
    keywords: ['cancel', 'cancel order'],
    question: 'Can I cancel my order?',
    answer: 'You can cancel an order within 2 hour of placing it by contacting us immediately. Once an order enters processing or has shipped, it cannot be cancelled — but you can return it per our return policy.',
    category: 'orders',
  },

  // ─── ABOUT Zapatos / GENERAL ───
  {
    keywords: ['about', 'Zapatos', 'brand', 'who are you', 'what is Zapatos'],
    question: 'What is Zapatos?',
    answer: 'Zapatos is a Nigerian beauty and personal care brand specialising in fragrances and body care essentials. We believe in luxury personal care, accessible without compromise. Beauty, thoughtfully curated for the modern professional.',
    category: 'general',
  },
  {
    keywords: ['nigerian', 'nigeria', 'african', 'local'],
    question: 'Are you a Nigerian brand?',
    answer: 'Yes! We\'re proudly Nigerian. Our brand is rooted in the idea that luxury personal care should be accessible. We draw inspiration from global fragrance traditions while staying true to our identity and serving the aspirational modern professional.',
    category: 'general',
  },
  {
    keywords: ['contact', 'reach', 'email', 'support', 'help'],
    question: 'How can I contact you?',
    answer: 'Visit our Contact page for all the ways to reach us. You can also connect with us on social media. We typically respond within 24 hours during business days.',
    category: 'general',
  },
  {
    keywords: ['contact', 'reach', 'email', 'support', 'help'],
    question: 'what is your email?',
    answer: 'Our email is helloZapatos.atelier@gmail.com.',
    category: 'general',
  },
  {
    keywords: ['price', 'expensive', 'affordable', 'cost', 'budget'],
    question: 'Are your products affordable?',
    answer: 'Our mission is luxury without compromise — and that includes pricing. We work to offer premium-quality fragrances and body care at prices that are accessible. We believe everyone deserves to smell amazing without breaking the bank.',
    category: 'general',
  },
  {
    keywords: ['bestseller', 'best seller', 'popular', 'top', 'recommendation'],
    question: 'What are your bestsellers?',
    answer: 'Our bestsellers shift with the seasons, but our community consistently loves our oud-based fragrances and our signature body lotion. Check the Shop page — featured products are highlighted at the top. Or take our Scent Personality Test for tailored picks!',
    category: 'general',
  },
  {
    keywords: ['new', 'new arrival', 'latest', 'upcoming', 'launch'],
    question: 'Do you have new arrivals?',
    answer: 'We regularly introduce new fragrances and body care products. Keep an eye on our Shop page for the latest drops. Follow us on social media to be the first to know about new launches and exclusive previews.',
    category: 'general',
  },
  {
    keywords: ['account', 'sign up', 'register', 'create account', 'why sign up'],
    question: 'Why should I create an account?',
    answer: 'An account lets you save curated gift boxes, track your orders, view your scent profile from the quiz, and get personalised recommendations. It only takes a moment and enhances your entire Zapatos experience.',
    category: 'general',
  },
  {
    keywords: ['sustainability', 'eco', 'environment', 'green', 'sustainable'],
    question: 'What about sustainability?',
    answer: 'We\'re committed to responsible practices. We use recyclable packaging where possible, avoid unnecessary plastic, and source ingredients ethically. Sustainability is a journey, and we\'re continuously improving our processes.',
    category: 'general',
  },
  {
    keywords: ['hello', 'hi', 'hey', 'good morning', 'good afternoon', 'good evening'],
    question: 'Hello!',
    answer: 'Hello! Welcome to Zapatos. I\'m here to help with anything about our fragrances, body care, the Scent Personality Test, gift curation, or your orders. What can I help you with?',
    category: 'general',
  },
  {
    keywords: ['thank', 'thanks', 'thank you', 'cheers'],
    question: 'Thank you!',
    answer: 'You\'re welcome! If you have any more questions about fragrance, body care, or anything else, I\'m right here. Enjoy your Zapatos experience! ✨',
    category: 'general',
  },
]

export const defaultSuggestions = [
  'What is Eau de Parfum?',
  'How do I make fragrance last longer?',
  'What is the Scent Personality Test?',
  'How does the Gift Curator work?',
  'What body care products do you offer?',
  'What are your shipping options?',
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

    // Bonus for exact question match
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
