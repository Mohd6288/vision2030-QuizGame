"use client";

import Link from "next/link";
import { useEffect, useState, useRef } from "react";
import { CATEGORIES } from "@/lib/questions";
import { getLeaderboard, type LeaderEntry } from "@/lib/leaderboard";
import { AR } from "@/lib/i18n";

const STEPS = [
  { num: "01", title: "Choose a Topic", titleAr: AR.step1, desc: "Pick from 6 categories about Saudi Arabia", icon: "\uD83C\uDFAF" },
  { num: "02", title: "Answer Questions", titleAr: AR.step2, desc: "10 questions with adaptive difficulty", icon: "\uD83E\uDDE0" },
  { num: "03", title: "Climb the Board", titleAr: AR.step3, desc: "Earn XP, build streaks, top the leaderboard", icon: "\uD83C\uDFC6" },
];

/* ── Animated counter ── */
function CountUp({ target, duration = 1200 }: { target: number; duration?: number }) {
  const [value, setValue] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          const start = Date.now();
          const step = () => {
            const elapsed = Date.now() - start;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setValue(Math.round(eased * target));
            if (progress < 1) requestAnimationFrame(step);
          };
          requestAnimationFrame(step);
          observer.disconnect();
        }
      },
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target, duration]);

  return <span ref={ref}>{value}</span>;
}

/* ── Leaderboard preview ── */
function LeaderboardPreview() {
  const [board, setBoard] = useState<LeaderEntry[]>([]);
  useEffect(() => { setBoard(getLeaderboard().slice(0, 5)); }, []);

  if (board.length === 0) {
    return <p className="text-sm text-[var(--muted)] text-center py-8">No scores yet. Be the first to play!</p>;
  }

  return (
    <div className="space-y-2">
      {board.map((e, i) => (
        <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-[var(--card)] border border-[var(--border)] hover:border-[var(--accent)]/30 transition-colors">
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
      {/* ═══ Hero ═══ */}
      <section className="relative overflow-hidden border-b border-[var(--border)]">
        {/* Islamic geometric pattern */}
        <div className="absolute inset-0 pattern-islamic opacity-30" />

        {/* Radial gradient overlay */}
        <div className="absolute inset-0" style={{
          background: "radial-gradient(ellipse at center, transparent 0%, var(--bg) 70%)"
        }} />

        {/* Decorative rotating shapes */}
        <div className="absolute top-10 left-10 w-32 h-32 opacity-[0.07] rotate-slow pointer-events-none">
          <svg viewBox="0 0 100 100" fill="none" stroke="var(--accent)" strokeWidth="1">
            <polygon points="50,0 61,35 100,35 69,57 80,92 50,70 20,92 31,57 0,35 39,35" />
          </svg>
        </div>
        <div className="absolute bottom-10 right-10 w-24 h-24 opacity-[0.07] rotate-slow float-delayed pointer-events-none">
          <svg viewBox="0 0 100 100" fill="none" stroke="var(--gold)" strokeWidth="1">
            <polygon points="50,5 95,50 50,95 5,50" />
          </svg>
        </div>
        <div className="absolute top-1/2 right-20 w-20 h-20 opacity-[0.05] float pointer-events-none hidden lg:block">
          <svg viewBox="0 0 100 100" fill="none" stroke="var(--accent)" strokeWidth="0.8">
            <circle cx="50" cy="50" r="45" />
            <polygon points="50,5 95,50 50,95 5,50" />
          </svg>
        </div>

        {/* Floating particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="absolute w-1.5 h-1.5 rounded-full"
              style={{
                left: `${12 + i * 12}%`,
                background: i % 2 === 0 ? "var(--accent)" : "var(--gold)",
                opacity: 0.2,
                animation: `particleFloat ${8 + i * 2}s linear ${i * 1.5}s infinite`,
              }}
            />
          ))}
        </div>

        {/* Hero content */}
        <div className="max-w-5xl mx-auto px-5 py-24 text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[var(--surface)] border border-[var(--border)] text-xs font-semibold mb-6" style={{ color: "var(--accent)" }}>
            <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: "var(--accent)" }} />
            120+ Questions &middot; 6 Categories &middot; Adaptive AI Difficulty
          </div>

          <p className="ar text-lg mb-3 opacity-40" style={{ color: "var(--gold)" }}>
            {AR.heroTitle}
          </p>

          <h1 className="text-4xl md:text-6xl font-black text-[var(--fg)] mb-4 leading-tight">
            Vision 2030<br />
            <span className="shimmer-text">Quiz Arena</span>
          </h1>

          <p className="text-[var(--muted)] text-base md:text-lg max-w-xl mx-auto mb-3 leading-relaxed">
            Test your knowledge about Saudi Arabia&apos;s Vision 2030, megaprojects, culture, geography, history, and Arabic language.
          </p>
          <p className="ar text-sm opacity-40 mb-10" style={{ color: "var(--muted)" }}>
            {AR.heroSubtitle}
          </p>

          <Link href="#categories" className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl text-white text-sm font-bold shadow-lg hover:scale-[1.03] transition-all pulse-glow" style={{ background: "var(--accent)" }}>
            &#127466;&#127480; Start Playing
          </Link>
        </div>
      </section>

      {/* ═══ How it works ═══ */}
      <section className="max-w-5xl mx-auto px-5 py-16">
        <p className="ar text-xs text-center mb-1 opacity-40" style={{ color: "var(--accent)" }}>{AR.howItWorks}</p>
        <h2 className="text-2xl font-bold text-center text-[var(--fg)] mb-10">How It Works</h2>
        <div className="grid sm:grid-cols-3 gap-4">
          {STEPS.map((s) => (
            <div key={s.num} className="p-5 rounded-2xl bg-[var(--surface)] border border-[var(--border)] hover:border-[var(--accent)]/40 transition-colors text-center group">
              <div className="text-3xl mb-3">{s.icon}</div>
              <span className="inline-block text-xs font-bold shimmer-text mb-1">{s.num}</span>
              <h3 className="text-sm font-bold text-[var(--fg)] mt-1 mb-0.5">{s.title}</h3>
              <p className="ar text-[10px] opacity-40 mb-2" style={{ color: "var(--accent)" }}>{s.titleAr}</p>
              <p className="text-xs text-[var(--muted)] leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ═══ Animated Stats ═══ */}
      <section className="border-t border-b border-[var(--border)]">
        <div className="max-w-5xl mx-auto px-5 py-12">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="count-fade">
              <p className="text-3xl md:text-4xl font-black" style={{ color: "var(--accent)" }}>
                <CountUp target={120} />+
              </p>
              <p className="text-xs text-[var(--muted)] mt-1">Questions</p>
              <p className="ar text-[10px] opacity-40" style={{ color: "var(--accent)" }}>{AR.questions}</p>
            </div>
            <div className="count-fade" style={{ animationDelay: "0.15s" }}>
              <p className="text-3xl md:text-4xl font-black" style={{ color: "var(--gold)" }}>
                <CountUp target={6} duration={800} />
              </p>
              <p className="text-xs text-[var(--muted)] mt-1">Categories</p>
              <p className="ar text-[10px] opacity-40" style={{ color: "var(--gold)" }}>{AR.categories}</p>
            </div>
            <div className="count-fade" style={{ animationDelay: "0.3s" }}>
              <p className="text-3xl md:text-4xl font-black" style={{ color: "var(--success)" }}>
                <CountUp target={4} duration={800} />
              </p>
              <p className="text-xs text-[var(--muted)] mt-1">Difficulty Levels</p>
              <p className="ar text-[10px] opacity-40" style={{ color: "var(--success)" }}>{AR.levels}</p>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ Categories ═══ */}
      <section id="categories" className="bg-[var(--surface)]/50">
        <div className="max-w-5xl mx-auto px-5 py-16">
          <p className="ar text-xs text-center mb-1 opacity-40" style={{ color: "var(--accent)" }}>{AR.chooseCategory}</p>
          <h2 className="text-2xl font-bold text-center text-[var(--fg)] mb-3">Choose Your Category</h2>
          <p className="text-sm text-center text-[var(--muted)] mb-10 max-w-md mx-auto">
            Each category has 20 questions across 4 difficulty levels. Questions adapt to your skill as you play.
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {CATEGORIES.map((c) => (
              <Link
                key={c.id}
                href={`/play?category=${c.id}`}
                className="category-card p-5 rounded-2xl bg-[var(--card)] border border-[var(--border)] group relative overflow-hidden"
              >
                {/* Hover glow */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl pointer-events-none"
                  style={{ background: `radial-gradient(circle at center, ${c.color}12 0%, transparent 70%)` }}
                />
                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="w-11 h-11 rounded-xl flex items-center justify-center text-xl" style={{ background: c.color + "20" }}>
                      {c.emoji}
                    </span>
                    <div>
                      <h3 className="text-sm font-bold group-hover:translate-x-0.5 transition-transform" style={{ color: c.color }}>
                        {c.name}
                      </h3>
                      <span className="ar text-[10px] opacity-50" style={{ color: c.color }}>{c.nameAr}</span>
                    </div>
                  </div>
                  <p className="text-xs text-[var(--muted)] leading-relaxed mb-3">{c.description}</p>
                  <span className="text-xs font-semibold transition-all group-hover:translate-x-1 inline-block" style={{ color: c.color }}>
                    Play &rarr;
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ Leaderboard ═══ */}
      <section className="max-w-5xl mx-auto px-5 py-16">
        <p className="ar text-xs text-center mb-1 opacity-40" style={{ color: "var(--gold)" }}>{AR.leaderboard}</p>
        <h2 className="text-2xl font-bold text-center text-[var(--fg)] mb-3">&#127942; Leaderboard</h2>
        <p className="text-sm text-center text-[var(--muted)] mb-8">Top scorers across all categories</p>
        <div className="max-w-md mx-auto">
          <LeaderboardPreview />
        </div>
      </section>
    </div>
  );
}
