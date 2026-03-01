"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState, Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { CATEGORIES, type CategoryId } from "@/lib/questions";
import { STORIES } from "@/lib/stories";
import { AR } from "@/lib/i18n";
import { sounds } from "@/lib/sounds";

function StoryContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const categoryId = (searchParams.get("category") || "neom") as CategoryId;
  const category = CATEGORIES.find((c) => c.id === categoryId) ?? CATEGORIES[0];
  const slides = STORIES[categoryId] ?? STORIES.neom;

  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState<"next" | "prev">("next");

  const slide = slides[current];
  const isLast = current === slides.length - 1;
  const isFirst = current === 0;

  function goNext() {
    if (isLast) {
      router.push(`/play?category=${categoryId}`);
      return;
    }
    setDirection("next");
    sounds.whoosh();
    setCurrent((c) => c + 1);
  }

  function goPrev() {
    if (isFirst) return;
    setDirection("prev");
    sounds.whoosh();
    setCurrent((c) => c - 1);
  }

  return (
    <div className="max-w-3xl mx-auto px-5 py-10 fade-up relative">
      {/* Category-colored ambient glow */}
      <div className="fixed inset-0 pointer-events-none z-0" style={{
        background: `radial-gradient(ellipse at top, ${category.color}10 0%, transparent 50%)`
      }} />

      <div className="relative z-10">
        {/* Header with skip button */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <span className="w-10 h-10 rounded-xl flex items-center justify-center text-lg" style={{ background: category.color + "20" }}>
              {category.emoji}
            </span>
            <div>
              <h1 className="text-lg font-bold" style={{ color: category.color }}>{category.name}</h1>
              <p className="ar text-xs opacity-50" style={{ color: category.color }}>{category.nameAr}</p>
            </div>
          </div>
          <Link
            href={`/play?category=${categoryId}`}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold border border-[var(--border)] text-[var(--muted)] hover:text-[var(--fg)] hover:border-[var(--accent)]/40 transition-all"
          >
            Skip to Quiz &#9193;
            <span className="ar text-[10px] opacity-50">{AR.storySkip}</span>
          </Link>
        </div>

        {/* Progress bar */}
        <div className="flex items-center gap-2 mb-6">
          {slides.map((_, i) => (
            <div
              key={i}
              className="flex-1 h-1.5 rounded-full transition-all duration-500"
              style={{
                background: i <= current ? category.color : "var(--border)",
                opacity: i <= current ? 1 : 0.3,
                boxShadow: i === current ? `0 0 8px ${category.color}60` : "none",
              }}
            />
          ))}
          <span className="text-xs text-[var(--muted)] font-semibold ml-2">
            {current + 1}/{slides.length}
          </span>
        </div>

        {/* Slide card */}
        <div
          key={current}
          className={`rounded-2xl bg-[var(--surface)] border border-[var(--border)] overflow-hidden mb-6 ${direction === "next" ? "slide-up" : "slide-up"}`}
        >
          {/* SVG illustration */}
          <div className="relative w-full h-48 sm:h-56 overflow-hidden" style={{ background: category.color + "08" }}>
            <Image
              src={slide.image}
              alt={slide.title}
              fill
              className="object-contain p-4"
              priority
            />
          </div>

          {/* Content */}
          <div className="p-6">
            <h2 className="text-xl font-black text-[var(--fg)] mb-1">{slide.title}</h2>
            <p className="ar text-sm opacity-40 mb-4" style={{ color: category.color }}>{slide.titleAr}</p>

            <p className="text-sm text-[var(--muted)] leading-relaxed mb-4">{slide.body}</p>
            <p className="ar text-xs opacity-30 leading-relaxed mb-4" style={{ color: "var(--muted)" }}>{slide.bodyAr}</p>

            {/* Fun fact callout */}
            <div className="p-4 rounded-xl border border-[var(--gold)]/20 bg-[var(--gold)]/5">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-sm">&#11088;</span>
                <span className="text-xs font-bold" style={{ color: "var(--gold)" }}>
                  Did you know? <span className="ar opacity-60">{AR.funFact}</span>
                </span>
              </div>
              <p className="text-xs text-[var(--muted)] leading-relaxed">{slide.funFact}</p>
            </div>
          </div>
        </div>

        {/* Navigation buttons */}
        <div className="flex items-center gap-3">
          <button
            onClick={goPrev}
            disabled={isFirst}
            className="px-5 py-3 rounded-xl text-sm font-bold border border-[var(--border)] text-[var(--muted)] hover:text-[var(--fg)] hover:border-[var(--accent)]/40 transition-all disabled:opacity-20 disabled:cursor-not-allowed"
          >
            &#8592; <span className="ar text-xs opacity-60">{AR.storyPrev}</span>
          </button>

          <button
            onClick={goNext}
            className="flex-1 py-3 rounded-xl text-sm font-bold text-white text-center transition-all glow-hover"
            style={{ background: isLast ? "var(--accent)" : category.color }}
          >
            {isLast ? (
              <>
                Start Quiz &#127919; <span className="ar text-xs opacity-60 ml-1">{AR.storyStart}</span>
              </>
            ) : (
              <>
                Next &#8594; <span className="ar text-xs opacity-60 ml-1">{AR.storyNext}</span>
              </>
            )}
          </button>
        </div>

        {/* Keyboard hint */}
        <p className="text-center text-[10px] text-[var(--muted)] mt-4 opacity-40">
          Use arrow keys &#8592; &#8594; or swipe to navigate
        </p>
      </div>
    </div>
  );
}

export default function StoryPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center py-32">
        <div className="w-8 h-8 border-3 border-[var(--accent)]/30 border-t-[var(--accent)] rounded-full animate-spin" />
      </div>
    }>
      <StoryContent />
    </Suspense>
  );
}
