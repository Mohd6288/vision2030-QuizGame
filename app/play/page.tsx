"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState, useEffect, useCallback, useRef, Suspense } from "react";
import { CATEGORIES, type CategoryId } from "@/lib/questions";
import {
  getDifficulty, getTimerSeconds, calculateScore, getStreakEmoji,
  pickNextQuestion, DIFFICULTY_LABELS, DIFFICULTY_COLORS, estimateMaxScore, getRank,
} from "@/lib/game-engine";
import { AR, DIFFICULTY_LABELS_AR } from "@/lib/i18n";
import { sounds } from "@/lib/sounds";
import type { Question } from "@/lib/questions";

const TOTAL_QUESTIONS = 10;
const REVEAL_DELAY = 2500;
const MAX_HINTS = 3;

/* ── Confetti burst on correct answer ── */
function ConfettiBurst() {
  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {Array.from({ length: 20 }).map((_, i) => (
        <div
          key={i}
          className="absolute w-2 h-2 rounded-sm"
          style={{
            left: `${30 + Math.random() * 40}%`,
            top: "40%",
            background: ["var(--accent)", "var(--gold)", "var(--success)", "#ec4899"][i % 4],
            animation: `confettiFall ${1 + Math.random()}s ease-out forwards`,
            animationDelay: `${Math.random() * 0.3}s`,
            transform: `rotate(${Math.random() * 360}deg)`,
          }}
        />
      ))}
    </div>
  );
}

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

  // Hint state
  const [hintsRemaining, setHintsRemaining] = useState(MAX_HINTS);
  const [hintVisible, setHintVisible] = useState(false);
  const [hintUsedThisQuestion, setHintUsedThisQuestion] = useState(false);
  const [hintsUsed, setHintsUsed] = useState(0);

  // Confetti state
  const [showConfetti, setShowConfetti] = useState(false);

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
        if (t <= 6) sounds.tick(); // tick sound for last 5 seconds
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
      sounds.correct();
      const newStreak = streak + 1;
      const pts = calculateScore(difficulty, newStreak, timeLeft, hintUsedThisQuestion);
      setScore((s) => s + pts);
      setXp((x) => x + pts);
      setStreak(newStreak);
      setMaxStreak((m) => Math.max(m, newStreak));
      setCorrectCount((c) => c + 1);
      setScorePop(pts);
      setShowConfetti(true);
      setTimeout(() => { setScorePop(null); setShowConfetti(false); }, 1000);
    } else {
      if (choice === -1) {
        sounds.timeout();
      } else {
        sounds.incorrect();
      }
      setStreak(0);
    }

    setPhase("reveal");

    // Auto-advance after delay
    setTimeout(() => {
      const nextIdx = index + 1;
      if (nextIdx >= TOTAL_QUESTIONS) {
        // Game over — save to sessionStorage and navigate
        const finalScore = isCorrect ? score + calculateScore(difficulty, streak + 1, timeLeft, hintUsedThisQuestion) : score;
        const finalXp = isCorrect ? xp + calculateScore(difficulty, streak + 1, timeLeft, hintUsedThisQuestion) : xp;
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
          hintsUsed,
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
        setHintVisible(false);
        setHintUsedThisQuestion(false);
        setPhase("question");
      }
    }, REVEAL_DELAY);
  }, [phase, questions, index, streak, difficulty, timeLeft, score, xp, maxStreak, correctCount, categoryId, category, router, hintUsedThisQuestion, hintsUsed]);

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
  const CIRCUMFERENCE = 2 * Math.PI * 28;

  return (
    <div className="max-w-3xl mx-auto px-5 py-8 fade-up relative">
      {/* Category-colored ambient glow */}
      <div className="fixed inset-0 pointer-events-none z-0" style={{
        background: `radial-gradient(ellipse at top, ${category.color}08 0%, transparent 50%)`
      }} />

      {/* Confetti */}
      {showConfetti && <ConfettiBurst />}

      <div className="relative z-10">
        {/* HUD */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg flex items-center justify-center text-sm" style={{ background: category.color + "20" }}>
              {category.emoji}
            </span>
            <div>
              <span className="text-xs font-bold block" style={{ color: category.color }}>{category.name}</span>
              <span className="ar text-[10px] opacity-50 block" style={{ color: category.color }}>{category.nameAr}</span>
            </div>
          </div>
          <div className="flex items-center gap-3 text-xs font-semibold">
            <span className="text-[var(--muted)]">
              <span className="ar text-[10px] opacity-50 mr-1">{AR.question}</span>
              Q {index + 1}/{TOTAL_QUESTIONS}
            </span>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold" style={{ background: DIFFICULTY_COLORS[difficulty] + "20", color: DIFFICULTY_COLORS[difficulty] }}>
              {DIFFICULTY_LABELS[difficulty]} <span className="ar opacity-60">{DIFFICULTY_LABELS_AR[difficulty]}</span>
            </span>
            {streak > 0 && (
              <span className="flex items-center gap-1 streak-fire" style={{ color: "var(--gold)" }}>
                {streakEmoji} {streak}x
              </span>
            )}
            <span style={{ color: "var(--gold)" }}>&#9733; {score.toLocaleString()}</span>
          </div>
        </div>

        {/* Circular timer + hint button row */}
        <div className="flex items-center justify-center gap-6 mb-6">
          {/* Circular timer */}
          <div className="relative w-16 h-16">
            <svg className="timer-ring w-full h-full" viewBox="0 0 64 64">
              <circle cx="32" cy="32" r="28" fill="none" stroke="var(--surface)" strokeWidth="4" />
              <circle
                cx="32" cy="32" r="28"
                fill="none"
                stroke={timerColor}
                strokeWidth="4"
                strokeLinecap="round"
                strokeDasharray={CIRCUMFERENCE}
                strokeDashoffset={CIRCUMFERENCE * (1 - timerPct / 100)}
              />
            </svg>
            <span className={`absolute inset-0 flex items-center justify-center text-lg font-black tabular-nums ${timeLeft <= 5 ? "timer-urgent" : ""}`} style={{ color: timerColor }}>
              {timeLeft}
            </span>
          </div>

          {/* Hint button */}
          <button
            onClick={() => {
              if (hintsRemaining > 0 && !hintVisible && phase === "question") {
                setHintVisible(true);
                setHintUsedThisQuestion(true);
                setHintsRemaining((h) => h - 1);
                setHintsUsed((h) => h + 1);
              }
            }}
            disabled={hintsRemaining <= 0 || hintVisible || phase !== "question"}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold hint-button"
            title="Use a hint (-50% score)"
          >
            <span className="text-base">&#128161;</span>
            <span>{hintsRemaining}/{MAX_HINTS}</span>
            <span className="ar text-[10px] opacity-60">{AR.hint}</span>
          </button>
        </div>

        {/* Question card */}
        <div key={index} className="relative p-6 rounded-2xl bg-[var(--surface)] border border-[var(--border)] mb-4 slide-up glass">
          <p className="text-lg md:text-xl font-bold text-[var(--fg)] leading-relaxed pr-2">
            {currentQ.question}
          </p>
          {/* Score pop */}
          {scorePop !== null && (
            <span className="absolute top-4 right-4 text-sm font-black score-pop" style={{ color: "var(--gold)" }}>
              +{scorePop}
            </span>
          )}
        </div>

        {/* Hint callout */}
        {hintVisible && (
          <div className="mb-4 p-4 rounded-xl border border-[var(--warning)]/40 bg-[var(--warning)]/5 slide-up">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-sm">&#128161;</span>
              <span className="text-xs font-bold" style={{ color: "var(--warning)" }}>
                Hint <span className="ar opacity-60">{AR.hint}</span>
              </span>
              <span className="text-[10px] text-[var(--muted)] ml-auto">-50% score</span>
            </div>
            <p className="text-sm text-[var(--muted)] leading-relaxed">{currentQ.hint}</p>
          </div>
        )}

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
                className={`flex items-center gap-4 p-4 rounded-xl border text-left transition-all ${extraClass} ${phase === "question" ? "hover:border-[var(--accent)] hover:bg-[var(--card-hover)] hover:shadow-[0_0_20px_rgba(0,108,53,0.15)] cursor-pointer" : "cursor-default"}`}
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
                <span className="ar ml-2 opacity-60">
                  {selected === currentQ.correct ? AR.correct : selected === -1 ? AR.timesUp : AR.notQuite}
                </span>
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
                background: i < index ? "var(--success)" :
                            i === index ? category.color : "var(--border)",
                transform: i === index ? "scale(1.3)" : "scale(1)",
                boxShadow: i === index ? `0 0 8px ${category.color}60` : "none",
              }}
            />
          ))}
        </div>
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
