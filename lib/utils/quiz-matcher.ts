import type { QuizResponse, PersonalityType } from '@/lib/types/quiz'
import type { Product } from '@/lib/types/product'
import { fragranceQuestions, bodycareQuestions } from '@/lib/data/quiz-questions'

/**
 * Collects all tags the user selected across their quiz responses.
 * Works with both fragrance and body care question sets.
 */
export function collectResponseTags(
  responses: QuizResponse[],
  category: 'fragrance' | 'bodycare'
): string[] {
  const questions = category === 'bodycare' ? bodycareQuestions : fragranceQuestions
  const tags: string[] = []

  responses.forEach(response => {
    const question = questions.find(q => q.id === response.questionId)
    if (!question) return

    response.selectedOptions.forEach(optionId => {
      const option = question.options.find(o => o.id === optionId)
      if (!option) return
      tags.push(...option.tags)
    })
  })

  return tags
}

/**
 * Maps collected tags to a personality archetype.
 * For fragrance: maps scent-family tags to aura types.
 * For body care: maps skin-need tags to care profiles.
 */
export function calculatePersonalityType(
  responses: QuizResponse[],
  category: 'fragrance' | 'bodycare' = 'fragrance'
): PersonalityType {
  const tags = collectResponseTags(responses, category)
  const tagCounts: Record<string, number> = {}
  tags.forEach(tag => {
    tagCounts[tag] = (tagCounts[tag] || 0) + 1
  })

  if (category === 'bodycare') {
    // Body care profiles
    const scored: { type: PersonalityType; score: number }[] = [
      {
        type: 'warm_sensual',
        score: (tagCounts['deep_hydration'] || 0) + (tagCounts['body_butter'] || 0) +
               (tagCounts['body_oil'] || 0) + (tagCounts['shea_butter'] || 0) +
               (tagCounts['thick_cream'] || 0) + (tagCounts['ceramides'] || 0),
      },
      {
        type: 'fresh_natural',
        score: (tagCounts['antioxidant'] || 0) + (tagCounts['purifying'] || 0) +
               (tagCounts['exfoliant'] || 0) + (tagCounts['gel_lotion'] || 0) +
               (tagCounts['squalane'] || 0) + (tagCounts['water_cream'] || 0) +
               (tagCounts['lightweight'] || 0),
      },
      {
        type: 'bold_adventurer',
        score: (tagCounts['aha_bha'] || 0) + (tagCounts['body_serum'] || 0) +
               (tagCounts['resurfacing'] || 0) + (tagCounts['exfoliating_scrub'] || 0) +
               (tagCounts['lactic_acid'] || 0) + (tagCounts['shimmer_oil'] || 0) +
               (tagCounts['illuminating'] || 0) + (tagCounts['radiance'] || 0),
      },
      {
        type: 'gentle_romantic',
        score: (tagCounts['aloe'] || 0) + (tagCounts['soothing'] || 0) +
               (tagCounts['colloidal_oatmeal'] || 0) + (tagCounts['fragrance_free'] || 0) +
               (tagCounts['calming'] || 0) + (tagCounts['vitamin_c'] || 0),
      },
      {
        type: 'sophisticated_minimalist',
        score: (tagCounts['smoothing'] || 0) + (tagCounts['lightweight'] || 0) +
               (tagCounts['squalane'] || 0),
      },
      { type: 'elegant_classic', score: 0 },
    ]

    scored.sort((a, b) => b.score - a.score)
    return scored[0].score > 0 ? scored[0].type : 'gentle_romantic'
  }

  // Fragrance personality mapping
  const scored: { type: PersonalityType; score: number }[] = [
    {
      type: 'fresh_natural',
      score: (tagCounts['fresh'] || 0) + (tagCounts['citrus'] || 0) +
             (tagCounts['aldehydic'] || 0) + (tagCounts['green'] || 0) +
             (tagCounts['bergamot'] || 0) + (tagCounts['neroli'] || 0) +
             (tagCounts['iris'] || 0) + (tagCounts['musk'] || 0) +
             (tagCounts['white_tea'] || 0),
    },
    {
      type: 'warm_sensual',
      score: (tagCounts['oriental'] || 0) + (tagCounts['spicy'] || 0) +
             (tagCounts['gourmand'] || 0) + (tagCounts['amber'] || 0) +
             (tagCounts['skin_scent'] || 0) + (tagCounts['warm'] || 0) +
             (tagCounts['coffee'] || 0) + (tagCounts['vanilla'] || 0),
    },
    {
      type: 'bold_adventurer',
      score: (tagCounts['woody'] || 0) + (tagCounts['smoky'] || 0) +
             (tagCounts['oud'] || 0) + (tagCounts['patchouli'] || 0) +
             (tagCounts['dark_rose'] || 0) + (tagCounts['cedar'] || 0) +
             (tagCounts['vetiver'] || 0) + (tagCounts['oakmoss'] || 0) +
             (tagCounts['pine'] || 0),
    },
    {
      type: 'gentle_romantic',
      score: (tagCounts['soft_floral'] || 0) + (tagCounts['powdery'] || 0) +
             (tagCounts['white_floral'] || 0) + (tagCounts['jasmine'] || 0) +
             (tagCounts['vanilla'] || 0),
    },
    {
      type: 'sophisticated_minimalist',
      score: (tagCounts['musk'] || 0) + (tagCounts['iris'] || 0) +
             (tagCounts['white_tea'] || 0) + (tagCounts['aldehydic'] || 0),
    },
    { type: 'elegant_classic', score: 0 },
  ]

  scored.sort((a, b) => b.score - a.score)
  return scored[0].score > 0 ? scored[0].type : 'elegant_classic'
}

export function getPersonalityDescription(type: PersonalityType): { title: string; description: string } {
  const descriptions = {
    bold: {
      title: 'The Bold Leader',
      description: 'You command attention with confidence and strength. Powerful scents and decisive choices define your presence. You make statements, not suggestions.',
    },
    soft: {
      title: 'The Gentle Soul',
      description: 'You approach life with grace and tenderness. Soft florals and comforting textures reflect your nurturing spirit. Your beauty is subtle yet unforgettable.',
    },
    minimal: {
      title: 'The Minimalist',
      description: 'You believe in less is more. Clean scents and streamlined products speak to your refined taste. Your elegance lies in simplicity and intention.',
    },
    sensual: {
      title: 'The Sensual Muse',
      description: 'You embrace warmth and intimacy. Rich textures and inviting scents create your magnetic presence. Your Zapatos is discovered, not announced.',
    },
    sophisticated_minimalist: {
      title: 'The Refined Purist',
      description: 'You gravitate toward precision and clarity. Clean, architectural scents and streamlined rituals speak to your discerning eye. Every detail is intentional, nothing is wasted.',
    },
    bold_adventurer: {
      title: 'The Dark Romantic',
      description: 'Depth and mystery define your aura. You are drawn to raw, smoky, and untamed — scents and textures that leave an unforgettable impression in your wake.',
    },
    gentle_romantic: {
      title: 'The Soft Sensualist',
      description: 'You move through the world with grace and gentleness. Florals, powdery warmth, and soothing textures wrap around you like poetry. Your beauty is quiet but magnetic.',
    },
    fresh_natural: {
      title: 'The Luminous Free Spirit',
      description: 'Bright, vital, and effortlessly alive. You are drawn to scents of sunlight on skin, crisp linens, and morning air. Your energy is infectious and clean.',
    },
    warm_sensual: {
      title: 'The Velvet Indulgent',
      description: 'Luxury is your love language. Rich ambers, opulent textures, and deep nourishment — you believe in wrapping yourself in warmth and never apologizing for pleasure.',
    },
    elegant_classic: {
      title: 'The Timeless Muse',
      description: 'You embody enduring sophistication. Balanced, refined, and versatile — your choices transcend trends and speak to a heritage of impeccable taste.',
    },
  }

  return descriptions[type]
}

export function matchProducts(
  products: Product[],
  responses: QuizResponse[],
  personalityType: PersonalityType,
  category: 'fragrance' | 'bodycare' = 'fragrance'
): Product[] {
  const responseTags = collectResponseTags(responses, category)
  const personalityTags = getPersonalityTags(personalityType)
  const allSearchTags = Array.from(new Set([...responseTags, ...personalityTags]))

  const scoredProducts = products.map(product => {
    let score = 0

    // Match against product personality_tags
    if (product.personality_tags) {
      allSearchTags.forEach(tag => {
        if (product.personality_tags?.includes(tag)) {
          score += 2
        }
      })
    }

    // Also match against product description keywords
    const desc = (product.description || '').toLowerCase()
    responseTags.forEach(tag => {
      const keyword = tag.replace(/_/g, ' ')
      if (desc.includes(keyword)) {
        score += 1
      }
    })

    return { product, score }
  })

  return scoredProducts
    .filter(item => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 4)
    .map(item => item.product)
}

function getPersonalityTags(type: PersonalityType): string[] {
  const tagMap = {
    bold: ['bold', 'powerful', 'statement', 'woody', 'smoky', 'assertive'],
    soft: ['soft', 'gentle', 'romantic', 'soft_floral', 'powdery', 'comfortable'],
    minimal: ['minimal', 'clean', 'understated', 'fresh', 'citrus', 'subtle'],
    sensual: ['sensual', 'warm', 'inviting', 'oriental', 'amber', 'intimate'],
    sophisticated_minimalist: ['iris', 'musk', 'white_tea', 'aldehydic', 'clean', 'lightweight'],
    bold_adventurer: ['woody', 'smoky', 'oud', 'patchouli', 'dark_rose', 'aha_bha', 'resurfacing'],
    gentle_romantic: ['soft_floral', 'powdery', 'jasmine', 'vanilla', 'soothing', 'calming'],
    fresh_natural: ['fresh', 'citrus', 'green', 'bergamot', 'antioxidant', 'gel_lotion'],
    warm_sensual: ['oriental', 'amber', 'gourmand', 'warm', 'body_oil', 'shea_butter', 'deep_hydration'],
    elegant_classic: ['balanced', 'versatile', 'refined'],
  }

  return tagMap[type]
}
