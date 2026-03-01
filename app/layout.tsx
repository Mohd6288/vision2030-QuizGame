import type { Metadata } from "next";
import { Tajawal } from "next/font/google";
import Link from "next/link";
import { AR } from "@/lib/i18n";
import "./globals.css";

const tajawal = Tajawal({
  subsets: ["arabic"],
  weight: ["400", "700", "800"],
  variable: "--font-arabic",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Vision 2030 Quiz Arena | ساحة اختبار رؤية ٢٠٣٠",
  description: "Test your knowledge about Saudi Vision 2030, NEOM, culture, geography, history, and Arabic in this interactive AI-powered quiz game.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`min-h-screen flex flex-col ${tajawal.variable}`}>
        <header className="sticky top-0 z-50 glass">
          <nav className="max-w-6xl mx-auto flex items-center justify-between px-5 py-3">
            <Link href="/" className="flex items-center gap-2.5 group">
              <span className="w-9 h-9 rounded-lg bg-[var(--accent)] flex items-center justify-center text-white text-sm glow-accent">
                &#127466;&#127480;
              </span>
              <div className="hidden sm:block">
                <span className="font-bold text-sm text-[var(--fg)] group-hover:text-[var(--accent)] transition-colors block leading-tight">
                  Vision 2030 Quiz
                </span>
                <span className="ar text-[10px] text-[var(--muted)] block leading-tight">{AR.brandName}</span>
              </div>
            </Link>
            <div className="flex items-center gap-1">
              <Link href="/" className="px-3 py-2 rounded-lg text-sm font-medium text-[var(--muted)] hover:text-[var(--fg)] hover:bg-[var(--surface)] transition-all">
                Home
              </Link>
              <Link href="/play" className="px-4 py-2 rounded-lg text-sm font-semibold bg-[var(--accent)] text-white hover:bg-[var(--accent-hover)] transition-all">
                Play Now
              </Link>
            </div>
          </nav>
        </header>

        <main className="flex-1">{children}</main>

        <footer className="border-t border-[var(--border)] relative">
          <div className="absolute top-0 left-0 right-0 h-px" style={{
            background: "linear-gradient(90deg, transparent, var(--accent), var(--gold), var(--accent), transparent)"
          }} />
          <div className="max-w-6xl mx-auto px-5 py-6 flex flex-col sm:flex-row items-center justify-between gap-3">
            <span className="text-xs text-[var(--muted)]">
              Vision 2030 Quiz Arena &copy; {new Date().getFullYear()}
            </span>
            <span className="text-xs text-[var(--muted)] flex items-center gap-2">
              Built with Next.js &middot; Saudi Vision 2030
              <span className="ar text-[10px] opacity-60">{AR.footer}</span>
            </span>
          </div>
        </footer>
      </body>
    </html>
  );
}
