/* ═══════════════════════════════════════
   GAME ENGINE
   Scoring, adaptive difficulty, streaks,
   XP calculation, and question selection.
═══════════════════════════════════════ */

import { QUESTIONS, type Question, type CategoryId } from "./questions";

// ── Difficulty based on streak ──
export function getDifficulty(streak: number): 1 | 2 | 3 | 4 {
  if (streak >= 7) return 4;
  if (streak >= 5) return 3;
  if (streak >= 3) return 2;
  return 1;
}

export const DIFFICULTY_LABELS: Record<number, string> = {
  1: "Easy",
  2: "Medium",
  3: "Hard",
  4: "Expert",
};

export const DIFFICULTY_COLORS: Record<number, string> = {
  1: "#22c55e",
  2: "#f59e0b",
  3: "#f97316",
  4: "#ef4444",
};

// ── Timer per difficulty ──
export function getTimerSeconds(difficulty: number): number {
  if (difficulty >= 4) return 10;
  if (difficulty >= 3) return 15;
  return 20;
}

// ── Score calculation ──
export function calculateScore(difficulty: number, streak: number, timeLeft: number): number {
  const base = difficulty * 25;
  const streakBonus = streak * 10;
  const timeBonus = Math.ceil(timeLeft / 5) * 5;
  return base + streakBonus + timeBonus;
}

// ── XP to level ──
export function getLevel(xp: number): number {
  return Math.floor(Math.sqrt(xp / 100));
}

export function xpForLevel(level: number): number {
  return level * level * 100;
}

// ── Performance rank ──
export function getRank(score: number, maxPossible: number): { letter: string; label: string; color: string } {
  const pct = maxPossible > 0 ? score / maxPossible : 0;
  if (pct >= 0.9) return { letter: "S", label: "Legendary", color: "#FFD700" };
  if (pct >= 0.75) return { letter: "A", label: "Excellent", color: "#22c55e" };
  if (pct >= 0.6) return { letter: "B", label: "Great", color: "#06b6d4" };
  if (pct >= 0.4) return { letter: "C", label: "Good", color: "#f59e0b" };
  return { letter: "D", label: "Keep Learning", color: "#ef4444" };
}

// ── Select questions for a round ──
export function selectQuestions(category: CategoryId, count: number = 10): Question[] {
  const pool = QUESTIONS.filter((q) => q.category === category);
  // Shuffle and pick
  const shuffled = [...pool].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

// ── Pick next question based on adaptive difficulty ──
export function pickNextQuestion(
  category: CategoryId,
  difficulty: 1 | 2 | 3 | 4,
  usedIds: Set<number>
): Question | null {
  // Try exact difficulty first
  let pool = QUESTIONS.filter(
    (q) => q.category === category && q.difficulty === difficulty && !usedIds.has(q.id)
  );
  // Fallback: adjacent difficulty
  if (pool.length === 0) {
    pool = QUESTIONS.filter(
      (q) => q.category === category && Math.abs(q.difficulty - difficulty) <= 1 && !usedIds.has(q.id)
    );
  }
  // Fallback: any in category
  if (pool.length === 0) {
    pool = QUESTIONS.filter((q) => q.category === category && !usedIds.has(q.id));
  }
  if (pool.length === 0) return null;
  return pool[Math.floor(Math.random() * pool.length)];
}

// ── Streak fire emoji ──
export function getStreakEmoji(streak: number): string {
  if (streak >= 10) return "\uD83C\uDF1F";
  if (streak >= 7)  return "\uD83D\uDD25\uD83D\uDD25";
  if (streak >= 5)  return "\uD83D\uDD25";
  if (streak >= 3)  return "\u2B50";
  return "";
}

// ── Max possible score estimation (for rank calc) ──
export function estimateMaxScore(numQuestions: number): number {
  // Assume expert difficulty, 10 streak, 15s remaining
  return numQuestions * (100 + 100 + 20);
}
