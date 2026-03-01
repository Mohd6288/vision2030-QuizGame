"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { CATEGORIES } from "@/lib/questions";
import { getLeaderboard, type LeaderEntry } from "@/lib/leaderboard";

const STEPS = [
  { num: "01", title: "Choose a Topic", desc: "Pick from 6 categories about Saudi Arabia", icon: "\uD83C\uDFAF" },
  { num: "02", title: "Answer Questions", desc: "10 questions with adaptive difficulty", icon: "\uD83E\uDDE0" },
  { num: "03", title: "Climb the Board", desc: "Earn XP, build streaks, top the leaderboard", icon: "\uD83C\uDFC6" },
];

function LeaderboardPreview() {
  const [board, setBoard] = useState<LeaderEntry[]>([]);
  useEffect(() => { setBoard(getLeaderboard().slice(0, 5)); }, []);

  if (board.length === 0) {
    return <p className="text-sm text-[var(--muted)] text-center py-8">No scores yet. Be the first to play!</p>;
  }

  return (
    <div className="space-y-2">
      {board.map((e, i) => (
        <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-[var(--card)] border border-[var(--border)]">
          <span className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold"
            style={{ background: i === 0 ? "var(--gold)" : i === 1 ? "#94a3b8" : i === 2 ? "#cd7f32" : "var(--surface)", color: i < 3 ? "#000" : "var(--muted)" }}>
            {i + 1}
          </span>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-[var(--fg)] truncate">{e.name}</p>
            <p className="text-xs text-[var(--muted)]">{e.category}</p>
          </div>
          <span className="text-sm font-bold" style={{ color: "var(--gold)" }}>{e.score.toLocaleString()}</span>
        </div>
      ))}
    </div>
  );
}

export default function Home() {
  return (
    <div className="fade-up">
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-[var(--border)]">
        <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: "radial-gradient(circle, var(--accent) 1px, transparent 1px)", backgroundSize: "30px 30px" }} />
        <div className="max-w-5xl mx-auto px-5 py-24 text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[var(--surface)] border border-[var(--border)] text-xs font-semibold mb-6" style={{ color: "var(--accent)" }}>
            <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: "var(--accent)" }} />
            120+ Questions &middot; 6 Categories &middot; Adaptive AI Difficulty
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-[var(--fg)] mb-4 leading-tight">
            Vision 2030<br />
            <span style={{ color: "var(--accent)" }}>Quiz Arena</span>
          </h1>
          <p className="text-[var(--muted)] text-base md:text-lg max-w-xl mx-auto mb-10 leading-relaxed">
            Test your knowledge about Saudi Arabia&apos;s Vision 2030, megaprojects, culture, geography, history, and Arabic language. Earn XP, build streaks, and climb the leaderboard.
          </p>
          <Link href="#categories" className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl text-white text-sm font-bold shadow-lg hover:scale-[1.03] transition-all pulse-glow" style={{ background: "var(--accent)" }}>
            &#127466;&#127480; Start Playing
          </Link>
        </div>
      </section>

      {/* How it works */}
      <section className="max-w-5xl mx-auto px-5 py-16">
        <h2 className="text-2xl font-bold text-center text-[var(--fg)] mb-10">How It Works</h2>
        <div className="grid sm:grid-cols-3 gap-4">
          {STEPS.map((s) => (
            <div key={s.num} className="p-5 rounded-2xl bg-[var(--surface)] border border-[var(--border)] hover:border-[var(--accent)]/40 transition-colors text-center">
              <div className="text-3xl mb-3">{s.icon}</div>
              <span className="text-xs font-bold" style={{ color: "var(--accent)" }}>{s.num}</span>
              <h3 className="text-sm font-bold text-[var(--fg)] mt-1 mb-1">{s.title}</h3>
              <p className="text-xs text-[var(--muted)] leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Categories */}
      <section id="categories" className="border-t border-[var(--border)] bg-[var(--surface)]/50">
        <div className="max-w-5xl mx-auto px-5 py-16">
          <h2 className="text-2xl font-bold text-center text-[var(--fg)] mb-3">Choose Your Category</h2>
          <p className="text-sm text-center text-[var(--muted)] mb-10 max-w-md mx-auto">
            Each category has 20 questions across 4 difficulty levels. Questions adapt to your skill as you play.
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {CATEGORIES.map((c) => (
              <Link
                key={c.id}
                href={`/play?category=${c.id}`}
                className="p-5 rounded-2xl bg-[var(--card)] border border-[var(--border)] hover:border-opacity-60 hover:-translate-y-1 transition-all group"
                style={{ ["--cat-color" as string]: c.color }}
              >
                <div className="flex items-center gap-3 mb-3">
                  <span className="w-11 h-11 rounded-xl flex items-center justify-center text-xl" style={{ background: c.color + "20" }}>
                    {c.emoji}
                  </span>
                  <h3 className="text-sm font-bold group-hover:translate-x-0.5 transition-transform" style={{ color: c.color }}>
                    {c.name}
                  </h3>
                </div>
                <p className="text-xs text-[var(--muted)] leading-relaxed mb-3">{c.description}</p>
                <span className="text-xs font-semibold transition-all" style={{ color: c.color }}>
                  Play &rarr;
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Leaderboard */}
      <section className="max-w-5xl mx-auto px-5 py-16">
        <h2 className="text-2xl font-bold text-center text-[var(--fg)] mb-3">&#127942; Leaderboard</h2>
        <p className="text-sm text-center text-[var(--muted)] mb-8">Top scorers across all categories</p>
        <div className="max-w-md mx-auto">
          <LeaderboardPreview />
        </div>
      </section>
    </div>
  );
}
