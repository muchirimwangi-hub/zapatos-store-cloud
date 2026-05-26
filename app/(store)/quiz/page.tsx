"use client";
import { useState } from "react";

// Define Types
type ArchetypeKey = 'minimalist' | 'grinder' | 'hybrid' | 'vanguard';
type Scores = Record<ArchetypeKey, number>;

interface Answer {
  text: string;
  weights: Partial<Scores>;
}

interface Question {
  id: number;
  text: string;
  subtitle?: string;
  answers: Answer[];
}

const QUESTIONS: Question[] = [
  {
    id: 1,
    text: "Where is your focus won?",
    subtitle: "Select the environment that aligns with your discipline.",
    answers: [
      { text: "In the absolute silence of an empty space.", weights: { minimalist: 3, vanguard: 1 } },
      { text: "Against the heavy, unyielding resistance of iron.", weights: { grinder: 3 } },
      { text: "In the unpredictable transition between paces and terrains.", weights: { hybrid: 3 } },
      { text: "On the pristine lines of a precisely cut lawn or court.", weights: { vanguard: 3 } },
    ],
  },
  {
    id: 2,
    text: "Choose your primary metric of success.",
    subtitle: "What defines a perfect session?",
    answers: [
      { text: "Flawless, uncompromised execution of form.", weights: { minimalist: 3, vanguard: 2 } },
      { text: "Total physical and mental exhaustion.", weights: { grinder: 3 } },
      { text: "Seamless adaptability to multiple disciplines.", weights: { hybrid: 3 } },
      { text: "Effortless execution with a sharp presentation.", weights: { vanguard: 3 } },
    ],
  },
  {
    id: 3,
    text: "What is your ideal relationship with your gear?",
    answers: [
      { text: "Gravity-defying weightlessness. I want to forget it's there.", weights: { minimalist: 3 } },
      { text: "Armored durability. Built to take a beating.", weights: { grinder: 3 } },
      { text: "Intelligent utility. Hidden pockets, technical fabrics, ultimate versatility.", weights: { hybrid: 3 } },
      { text: "Tailored structure. High-end aesthetic that transitions past the game.", weights: { vanguard: 3 } },
    ],
  },
];

export default function ZapatosQuiz() {
  const [currentStep, setCurrentStep] = useState(0); 
  const [scores, setScores] = useState<Scores>({ minimalist: 0, grinder: 0, hybrid: 0, vanguard: 0 });

  const handleAnswerSelect = (weights: Partial<Scores>) => {
    const nextScores = { ...scores };
    // Safe iteration to avoid red lines
    (Object.keys(weights) as ArchetypeKey[]).forEach((key) => {
      nextScores[key] += weights[key] || 0;
    });
    setScores(nextScores);

    if (currentStep < QUESTIONS.length) {
      setCurrentStep(currentStep + 1);
    } else {
      const data = encodeURIComponent(JSON.stringify(nextScores));
      window.location.href = `/quiz/results?data=${data}`;
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col justify-between p-6 md:p-12 font-sans">
      <header className="w-full max-w-4xl mx-auto flex justify-between items-center py-4 border-b border-neutral-900">
        <span className="text-sm font-bold tracking-widest uppercase">ZAPATOS CAVE</span>
        {currentStep > 0 && <span className="text-xs text-neutral-500 uppercase">Blueprint {currentStep} / {QUESTIONS.length}</span>}
      </header>

      <main className="w-full max-w-2xl mx-auto flex-grow flex flex-col justify-center my-12">
        {currentStep === 0 ? (
          <div className="space-y-8">
            <h1 className="text-4xl md:text-5xl font-medium tracking-tight">Discover your athletic blueprint.</h1>
            <button onClick={() => setCurrentStep(1)} className="bg-neutral-100 text-neutral-950 px-6 py-3.5 text-sm font-medium">Begin Initialization →</button>
          </div>
        ) : (
          <div className="space-y-10">
            <h2 className="text-3xl font-medium">{QUESTIONS[currentStep - 1].text}</h2>
            <div className="grid gap-4">
              {QUESTIONS[currentStep - 1].answers.map((answer, i) => (
                <button key={i} onClick={() => handleAnswerSelect(answer.weights)} className="w-full text-left p-5 border border-neutral-900 hover:border-neutral-700 transition-all">
                  {answer.text}
                </button>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}