import type { QuizQuestion } from '@/lib/types/quiz'

// ─── CORE ATHLETIC DISCIPLINE DATA MATRIX ───
export const fragranceQuestions: QuizQuestion[] = [
  {
    id: 'training_environment',
    question: 'Define your primary training environment:',
    description: 'Determines structural core ventilation mapping requirements.',
    type: 'single',
    tags: [],
    options: [
      { 
        id: 'speed', 
        label: 'Track, open field velocity, or track work.', 
        description: 'Requires high-aeration composite weaves.', 
        image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=600&auto=format&fit=crop', 
        tags: ['SPEED', 'HIGH_VENTILATION'] 
      },
      { 
        id: 'compression', 
        label: 'Heavy powerlifting blocks or mechanical loading.', 
        description: 'Requires structural high-tension joint locks.', 
        image: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=600&auto=format&fit=crop', 
        tags: ['COMPRESSION', 'MUSCLE_STABILIZATION'] 
      },
      { 
        id: 'thermal', 
        label: 'Cold weather outposts or varying climate ranges.', 
        description: 'Requires internal core insulated grid patterns.', 
        image: 'https://images.unsplash.com/photo-1507398941214-572c25f4b1dc?q=80&w=600&auto=format&fit=crop', 
        tags: ['THERMAL', 'INSULATED_MATRICES'] 
      }
    ],
  }
]

export const bodycareQuestions: QuizQuestion[] = []