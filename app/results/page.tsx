"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getRank, estimateMaxScore, getLevel, xpForLevel } from "@/lib/game-engine";
import { getLeaderboard, addToLeaderboard, isTopScore, type LeaderEntry } from "@/lib/leaderboard";
import { CATEGORIES } from "@/lib/questions";

interface GameResults {
  score: number;
  xp: number;
  maxStreak: number;
  correct: number;
  total: number;
  category: string;
  categoryId: string;
}

export default function ResultsPage() {
  const [results, setResults] = useState<GameResults | null>(null);
  const [board, setBoard] = useState<LeaderEntry[]>([]);
  const [name, setName] = useState("");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const raw = sessionStorage.getItem("v2030_results");
    if (raw) {
      const r = JSON.parse(raw) as GameResults;
      setResults(r);
      setBoard(getLeaderboard());
    }
  }, []);

  if (!results) {
    return (
      <div className="max-w-lg mx-auto px-5 py-32 text-center fade-up">
        <p className="text-4xl mb-4">&#129300;</p>
        <h1 className="text-xl font-bold text-[var(--fg)] mb-2">No Results Found</h1>
        <p className="text-sm text-[var(--muted)] mb-6">Play a quiz first to see your results here.</p>
        <Link href="/" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold text-white" style={{ background: "var(--accent)" }}>
          Go Home
        </Link>
      </div>
    );
  }

  const maxPossible = estimateMaxScore(results.total);
  const rank = getRank(results.score, maxPossible);
  const accuracy = Math.round((results.correct / results.total) * 100);
  const level = getLevel(results.xp);
  const nextLevelXp = xpForLevel(level + 1);
  const canSave = isTopScore(results.score) && !saved;
  const category = CATEGORIES.find((c) => c.id === results.categoryId);

  function handleSave() {
    if (!name.trim()) return;
    const entry: LeaderEntry = {
      name: name.trim(),
      score: results!.score,
      xp: results!.xp,
      category: results!.category,
      streak: results!.maxStreak,
      date: new Date().toLocaleDateString(),
    };
    const updated = addToLeaderboard(entry);
    setBoard(updated);
    setSaved(true);
  }

  return (
    <div className="max-w-lg mx-auto px-5 py-12 fade-up">
      {/* Rank badge */}
      <div className="text-center mb-8">
        <div
          className="inline-flex items-center justify-center w-24 h-24 rounded-full text-5xl font-black mb-4"
          style={{ background: rank.color + "20", color: rank.color, border: `3px solid ${rank.color}` }}
        >
          {rank.letter}
        </div>
        <h1 className="text-2xl font-black text-[var(--fg)]">{rank.label}!</h1>
        <p className="text-sm text-[var(--muted)] mt-1">
          {category?.emoji} {results.category}
        </p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 gap-3 mb-8">
        <div className="p-4 rounded-2xl bg-[var(--surface)] border border-[var(--border)] text-center">
          <p className="text-2xl font-black" style={{ color: "var(--gold)" }}>{results.score.toLocaleString()}</p>
          <p className="text-xs text-[var(--muted)] mt-1">Total Score</p>
        </div>
        <div className="p-4 rounded-2xl bg-[var(--surface)] border border-[var(--border)] text-center">
          <p className="text-2xl font-black" style={{ color: "var(--accent)" }}>{accuracy}%</p>
          <p className="text-xs text-[var(--muted)] mt-1">Accuracy ({results.correct}/{results.total})</p>
        </div>
        <div className="p-4 rounded-2xl bg-[var(--surface)] border border-[var(--border)] text-center">
          <p className="text-2xl font-black" style={{ color: "var(--gold)" }}>
            {results.maxStreak > 0 && "\uD83D\uDD25"} {results.maxStreak}
          </p>
          <p className="text-xs text-[var(--muted)] mt-1">Best Streak</p>
        </div>
        <div className="p-4 rounded-2xl bg-[var(--surface)] border border-[var(--border)] text-center">
          <p className="text-2xl font-black text-[var(--fg)]">Lv.{level}</p>
          <p className="text-xs text-[var(--muted)] mt-1">{results.xp}/{nextLevelXp} XP</p>
        </div>
      </div>

      {/* Leaderboard entry */}
      {canSave && (
        <div className="p-5 rounded-2xl bg-[var(--card)] border border-[var(--gold)]/30 mb-6 slide-up">
          <p className="text-sm font-bold mb-3" style={{ color: "var(--gold)" }}>
            &#127942; New High Score! Enter your name:
          </p>
          <div className="flex gap-2">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSave()}
              placeholder="Your name"
              maxLength={20}
              className="flex-1 px-3 py-2.5 rounded-xl text-sm bg-[var(--surface)] text-[var(--fg)] border border-[var(--border)] placeholder:text-[var(--muted)]/60 focus:outline-none focus:border-[var(--accent)]"
            />
            <button
              onClick={handleSave}
              disabled={!name.trim()}
              className="px-5 py-2.5 rounded-xl text-sm font-bold text-white disabled:opacity-30"
              style={{ background: "var(--accent)" }}
            >
              Save
            </button>
          </div>
        </div>
      )}

      {saved && (
        <div className="p-4 rounded-2xl bg-[var(--accent)]/10 border border-[var(--accent)]/30 mb-6 text-center">
          <p className="text-sm font-semibold" style={{ color: "var(--accent)" }}>&#9989; Score saved to leaderboard!</p>
        </div>
      )}

      {/* Leaderboard */}
      {board.length > 0 && (
        <div className="mb-8">
          <h2 className="text-sm font-bold text-[var(--muted)] uppercase tracking-wider mb-3">Leaderboard</h2>
          <div className="space-y-2">
            {board.map((e, i) => (
              <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-[var(--card)] border border-[var(--border)]">
                <span className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
                  style={{ background: i === 0 ? "var(--gold)" : i === 1 ? "#94a3b8" : i === 2 ? "#cd7f32" : "var(--surface)", color: i < 3 ? "#000" : "var(--muted)" }}>
                  {i + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-[var(--fg)] truncate">{e.name}</p>
                  <p className="text-xs text-[var(--muted)]">{e.category} &middot; {e.date}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-sm font-bold" style={{ color: "var(--gold)" }}>{e.score.toLocaleString()}</p>
                  <p className="text-xs text-[var(--muted)]">{e.streak}x streak</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Link
          href={`/play?category=${results.categoryId}`}
          className="flex-1 py-3 rounded-xl text-sm font-bold text-white text-center"
          style={{ background: "var(--accent)" }}
        >
          Play Again
        </Link>
        <Link
          href="/#categories"
          className="flex-1 py-3 rounded-xl text-sm font-bold text-center border border-[var(--border)] text-[var(--muted)] hover:text-[var(--fg)] hover:border-[var(--accent)]/40 transition-all"
        >
          Try Another Category
        </Link>
      </div>
    </div>
  );
}
