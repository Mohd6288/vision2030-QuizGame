"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState, useEffect, useCallback, useRef, Suspense } from "react";
import { CATEGORIES, type CategoryId } from "@/lib/questions";
import {
  getDifficulty, getTimerSeconds, calculateScore, getStreakEmoji,
  pickNextQuestion, DIFFICULTY_LABELS, DIFFICULTY_COLORS, estimateMaxScore, getRank,
} from "@/lib/game-engine";
import type { Question } from "@/lib/questions";

const TOTAL_QUESTIONS = 10;
const REVEAL_DELAY = 2500;

function GameContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const categoryId = (searchParams.get("category") || "neom") as CategoryId;
  const category = CATEGORIES.find((c) => c.id === categoryId) ?? CATEGORIES[0];

  // Game state
  const [questions, setQuestions] = useState<Question[]>([]);
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [xp, setXp] = useState(0);
  const [streak, setStreak] = useState(0);
  const [maxStreak, setMaxStreak] = useState(0);
  const [difficulty, setDifficulty] = useState<1 | 2 | 3 | 4>(1);
  const [correctCount, setCorrectCount] = useState(0);
  const [phase, setPhase] = useState<"loading" | "question" | "reveal" | "finished">("loading");
  const [selected, setSelected] = useState<number | null>(null);
  const [timeLeft, setTimeLeft] = useState(20);
  const [scorePop, setScorePop] = useState<number | null>(null);

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const usedIdsRef = useRef(new Set<number>());

  // ── Initialize game ──
  useEffect(() => {
    const firstQ = pickNextQuestion(categoryId, 1, usedIdsRef.current);
    if (firstQ) {
      usedIdsRef.current.add(firstQ.id);
      setQuestions([firstQ]);
      setTimeLeft(getTimerSeconds(1));
      setPhase("question");
    }
  }, [categoryId]);

  // ── Timer ──
  useEffect(() => {
    if (phase !== "question") return;
    timerRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          // Time's up
          clearInterval(timerRef.current!);
          handleAnswer(-1); // timeout
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, index]);

  // ── Handle answer ──
  const handleAnswer = useCallback((choice: number) => {
    if (phase !== "question") return;
    if (timerRef.current) clearInterval(timerRef.current);

    const q = questions[index];
    if (!q) return;

    setSelected(choice);
    const isCorrect = choice === q.correct;

    if (isCorrect) {
      const newStreak = streak + 1;
      const pts = calculateScore(difficulty, newStreak, timeLeft);
      setScore((s) => s + pts);
      setXp((x) => x + pts);
      setStreak(newStreak);
      setMaxStreak((m) => Math.max(m, newStreak));
      setCorrectCount((c) => c + 1);
      setScorePop(pts);
      setTimeout(() => setScorePop(null), 800);
    } else {
      setStreak(0);
    }

    setPhase("reveal");

    // Auto-advance after delay
    setTimeout(() => {
      const nextIdx = index + 1;
      if (nextIdx >= TOTAL_QUESTIONS) {
        // Game over — save to sessionStorage and navigate
        const finalScore = isCorrect ? score + calculateScore(difficulty, streak + 1, timeLeft) : score;
        const finalXp = isCorrect ? xp + calculateScore(difficulty, streak + 1, timeLeft) : xp;
        const finalStreak = isCorrect ? Math.max(maxStreak, streak + 1) : maxStreak;
        const finalCorrect = isCorrect ? correctCount + 1 : correctCount;

        sessionStorage.setItem("v2030_results", JSON.stringify({
          score: finalScore,
          xp: finalXp,
          maxStreak: finalStreak,
          correct: finalCorrect,
          total: TOTAL_QUESTIONS,
          category: category.name,
          categoryId: category.id,
        }));
        router.push("/results");
      } else {
        // Next question
        const newStreak = isCorrect ? streak + 1 : 0;
        const newDiff = getDifficulty(newStreak);
        setDifficulty(newDiff);
        const nextQ = pickNextQuestion(categoryId, newDiff, usedIdsRef.current);
        if (nextQ) {
          usedIdsRef.current.add(nextQ.id);
          setQuestions((prev) => [...prev, nextQ]);
        }
        setIndex(nextIdx);
        setSelected(null);
        setTimeLeft(getTimerSeconds(newDiff));
        setPhase("question");
      }
    }, REVEAL_DELAY);
  }, [phase, questions, index, streak, difficulty, timeLeft, score, xp, maxStreak, correctCount, categoryId, category, router]);

  const currentQ = questions[index];

  if (phase === "loading" || !currentQ) {
    return (
      <div className="flex items-center justify-center py-32">
        <div className="w-8 h-8 border-3 border-[var(--accent)]/30 border-t-[var(--accent)] rounded-full animate-spin" />
      </div>
    );
  }

  const timerMax = getTimerSeconds(difficulty);
  const timerPct = (timeLeft / timerMax) * 100;
  const timerColor = timeLeft <= 5 ? "var(--danger)" : timeLeft <= 10 ? "var(--warning)" : "var(--success)";
  const streakEmoji = getStreakEmoji(streak);

  return (
    <div className="max-w-3xl mx-auto px-5 py-8 fade-up">
      {/* HUD */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div className="flex items-center gap-2">
          <span className="w-8 h-8 rounded-lg flex items-center justify-center text-sm" style={{ background: category.color + "20" }}>
            {category.emoji}
          </span>
          <span className="text-xs font-bold" style={{ color: category.color }}>{category.name}</span>
        </div>
        <div className="flex items-center gap-4 text-xs font-semibold">
          <span className="text-[var(--muted)]">Q {index + 1}/{TOTAL_QUESTIONS}</span>
          <span className="px-2 py-0.5 rounded text-[10px] font-bold" style={{ background: DIFFICULTY_COLORS[difficulty] + "20", color: DIFFICULTY_COLORS[difficulty] }}>
            {DIFFICULTY_LABELS[difficulty]}
          </span>
          {streak > 0 && (
            <span className="flex items-center gap-1 streak-fire" style={{ color: "var(--gold)" }}>
              {streakEmoji} {streak}x
            </span>
          )}
          <span style={{ color: "var(--gold)" }}>&#9733; {score.toLocaleString()}</span>
        </div>
      </div>

      {/* Timer bar */}
      <div className="h-1.5 rounded-full bg-[var(--surface)] mb-6 overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-1000 ease-linear ${timeLeft <= 5 ? "timer-urgent" : ""}`}
          style={{ width: `${timerPct}%`, background: timerColor }}
        />
      </div>

      {/* Question */}
      <div className="relative p-6 rounded-2xl bg-[var(--surface)] border border-[var(--border)] mb-6">
        <p className="text-lg md:text-xl font-bold text-[var(--fg)] leading-relaxed">
          {currentQ.question}
        </p>
        <span className="absolute top-4 right-4 text-2xl font-bold tabular-nums" style={{ color: timerColor }}>
          {timeLeft}
        </span>
        {/* Score pop */}
        {scorePop !== null && (
          <span className="absolute top-4 left-4 text-sm font-black score-pop" style={{ color: "var(--gold)" }}>
            +{scorePop}
          </span>
        )}
      </div>

      {/* Options */}
      <div className="grid gap-3">
        {currentQ.options.map((opt, i) => {
          const letter = String.fromCharCode(65 + i);
          let borderColor = "var(--border)";
          let bg = "var(--card)";
          let extraClass = "";

          if (phase === "reveal") {
            if (i === currentQ.correct) {
              borderColor = "var(--success)";
              bg = "rgba(34,197,94,0.1)";
              extraClass = "correct-pulse";
            } else if (i === selected && i !== currentQ.correct) {
              borderColor = "var(--danger)";
              bg = "rgba(239,68,68,0.1)";
              extraClass = "shake";
            }
          }

          return (
            <button
              key={i}
              onClick={() => handleAnswer(i)}
              disabled={phase !== "question"}
              className={`flex items-center gap-4 p-4 rounded-xl border text-left transition-all ${extraClass} ${phase === "question" ? "hover:border-[var(--accent)] hover:bg-[var(--card-hover)] cursor-pointer" : "cursor-default"}`}
              style={{ borderColor, background: bg }}
            >
              <span className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold shrink-0" style={{
                background: phase === "reveal" && i === currentQ.correct ? "var(--success)" : "var(--surface)",
                color: phase === "reveal" && i === currentQ.correct ? "#fff" : "var(--muted)",
              }}>
                {letter}
              </span>
              <span className="text-sm font-medium text-[var(--fg)]">{opt}</span>
              {phase === "reveal" && i === currentQ.correct && (
                <span className="ml-auto text-sm">&#9989;</span>
              )}
              {phase === "reveal" && i === selected && i !== currentQ.correct && (
                <span className="ml-auto text-sm">&#10060;</span>
              )}
            </button>
          );
        })}
      </div>

      {/* Explanation */}
      {phase === "reveal" && (
        <div className="mt-6 p-5 rounded-2xl bg-[var(--card)] border border-[var(--border)] slide-up">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-sm">{selected === currentQ.correct ? "\uD83C\uDF89" : "\uD83D\uDCA1"}</span>
            <span className="text-xs font-bold" style={{ color: selected === currentQ.correct ? "var(--success)" : "var(--warning)" }}>
              {selected === currentQ.correct ? "Correct!" : selected === -1 ? "Time's Up!" : "Not Quite!"}
            </span>
          </div>
          <p className="text-sm text-[var(--muted)] leading-relaxed">{currentQ.explanation}</p>
          {currentQ.funFact && (
            <p className="text-xs text-[var(--muted)] mt-2 italic">Fun fact: {currentQ.funFact}</p>
          )}
        </div>
      )}

      {/* Progress dots */}
      <div className="flex items-center justify-center gap-1.5 mt-8">
        {Array.from({ length: TOTAL_QUESTIONS }).map((_, i) => (
          <span
            key={i}
            className="w-2.5 h-2.5 rounded-full transition-all"
            style={{
              background: i < index ? (questions[i] && selected !== null ? "var(--success)" : "var(--muted)") :
                          i === index ? category.color : "var(--border)",
              transform: i === index ? "scale(1.3)" : "scale(1)",
            }}
          />
        ))}
      </div>
    </div>
  );
}

export default function PlayPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center py-32">
        <div className="w-8 h-8 border-3 border-[var(--accent)]/30 border-t-[var(--accent)] rounded-full animate-spin" />
      </div>
    }>
      <GameContent />
    </Suspense>
  );
}
