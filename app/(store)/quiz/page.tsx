"use client";
import { useState } from "react";
import { Activity } from "lucide-react";

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
      { text: "In the absolute silence of an isolated space.", weights: { minimalist: 3, vanguard: 1 } },
      { text: "Against the heavy, unyielding resistance of iron.", weights: { grinder: 3 } },
      { text: "In the unpredictable transition between paces and terrains.", weights: { hybrid: 3 } },
      { text: "On the pristine lines of a precisely cut court or track.", weights: { vanguard: 3 } },
    ],
  },
  {
    id: 2,
    text: "Choose your primary metric of success.",
    subtitle: "What defines a perfect execution?",
    answers: [
      { text: "Flawless, uncompromised execution of form.", weights: { minimalist: 3, vanguard: 2 } },
      { text: "Total physical and mental exhaustion. Leaving nothing behind.", weights: { grinder: 3 } },
      { text: "Seamless adaptability to multiple changing disciplines.", weights: { hybrid: 3 } },
      { text: "Effortless performance paired with a sharp presentation.", weights: { vanguard: 3 } },
    ],
  },
  {
    id: 3,
    text: "How do you handle a system failure? (Fatigue or Setback)",
    answers: [
      { text: "I recalibrate. Strip away variables until the core is stable.", weights: { minimalist: 3 } },
      { text: "I push through brute force. Pain is just a data point.", weights: { grinder: 3 } },
      { text: "I pivot. If one vector closes, I immediately exploit another.", weights: { hybrid: 3 } },
      { text: "I analyze the flaw, correct the technique, and execute perfectly next time.", weights: { vanguard: 3 } },
    ],
  },
  {
    id: 4,
    text: "What is your ideal relationship with your gear?",
    answers: [
      { text: "Gravity-defying weightlessness. I want to forget it's there.", weights: { minimalist: 3 } },
      { text: "Armored durability. Built to survive extreme friction.", weights: { grinder: 3 } },
      { text: "Intelligent utility. Hidden pockets, multi-climate technical fabrics.", weights: { hybrid: 3 } },
      { text: "Tailored structure. High-end aesthetic that transitions past the session.", weights: { vanguard: 3 } },
    ],
  },
  {
    id: 5,
    text: "What defines your ideal recovery protocol?",
    answers: [
      { text: "Stillness. Total sensory deprivation and reset.", weights: { minimalist: 3 } },
      { text: "Active recovery. Keeping the engine warm for the next strike.", weights: { grinder: 3, hybrid: 1 } },
      { text: "Dynamic stretching and varied mobility flows.", weights: { hybrid: 3 } },
      { text: "High-end therapeutics and structured rest intervals.", weights: { vanguard: 3 } },
    ],
  },
  {
    id: 6,
    text: "Identify your ultimate end-state.",
    subtitle: "Why do you initiate the protocol?",
    answers: [
      { text: "To achieve absolute clarity and empty the mind.", weights: { minimalist: 4 } },
      { text: "To conquer physical limitations through sheer repetition.", weights: { grinder: 4 } },
      { text: "To remain a highly versatile, unpredictable asset.", weights: { hybrid: 4 } },
      { text: "To set the standard of elite capability and aesthetic dominance.", weights: { vanguard: 4 } },
    ],
  },
];

export default function ZapatosQuiz() {
  const [currentStep, setCurrentStep] = useState(0); 
  const [scores, setScores] = useState<Scores>({ minimalist: 0, grinder: 0, hybrid: 0, vanguard: 0 });

  const handleAnswerSelect = (weights: Partial<Scores>) => {
    const nextScores = { ...scores };
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
    <div className="min-h-screen bg-[#08080A] text-zinc-100 flex flex-col justify-between p-6 md:p-12 font-sans selection:bg-white selection:text-black">
      <header className="w-full max-w-4xl mx-auto flex justify-between items-center py-4 border-b border-zinc-900">
        <span className="text-sm font-black tracking-[0.3em] uppercase">ZAPATOS CAVE</span>
        {currentStep > 0 && <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">Blueprint {currentStep} / {QUESTIONS.length}</span>}
      </header>

      <main className="w-full max-w-2xl mx-auto flex-grow flex flex-col justify-center my-12">
        {currentStep === 0 ? (
          <div className="space-y-8 text-center md:text-left">
            <Activity className="w-12 h-12 stroke-[1.5] text-zinc-600 mx-auto md:mx-0" />
            <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter leading-none">
              Discover your <br/> <span className="text-zinc-500">athletic blueprint.</span>
            </h1>
            <p className="text-zinc-400 font-light text-sm md:text-base leading-relaxed max-w-lg">
              Take the tactical diagnostic to map your psychological profile to our performance gear. Find out how your environment dictates your apparel needs.
            </p>
            <div className="pt-4">
              <button onClick={() => setCurrentStep(1)} className="bg-white text-black hover:bg-zinc-200 px-10 h-14 text-xs font-black uppercase tracking-[0.2em] transition-transform active:scale-95">
                Initiate Diagnostic →
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-10">
            <div className="space-y-2">
              <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tighter">{QUESTIONS[currentStep - 1].text}</h2>
              {QUESTIONS[currentStep - 1].subtitle && (
                <p className="text-xs font-mono text-zinc-500 tracking-widest uppercase">{QUESTIONS[currentStep - 1].subtitle}</p>
              )}
            </div>
            <div className="grid gap-3">
              {QUESTIONS[currentStep - 1].answers.map((answer, i) => (
                <button key={i} onClick={() => handleAnswerSelect(answer.weights)} className="w-full text-left p-6 border border-zinc-900 hover:border-white bg-[#0C0C10] hover:bg-zinc-900 transition-all group">
                  <span className="text-sm font-medium tracking-wide group-hover:text-white text-zinc-300">
                    {answer.text}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}