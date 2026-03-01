/* ═══════════════════════════════════════
   LEADERBOARD
   localStorage-based high score table.
═══════════════════════════════════════ */

export interface LeaderEntry {
  name: string;
  score: number;
  xp: number;
  category: string;
  streak: number;
  date: string;
}

const STORAGE_KEY = "v2030_leaderboard";
const MAX_ENTRIES = 10;

export function getLeaderboard(): LeaderEntry[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as LeaderEntry[];
  } catch {
    return [];
  }
}

export function addToLeaderboard(entry: LeaderEntry): LeaderEntry[] {
  const board = getLeaderboard();
  board.push(entry);
  board.sort((a, b) => b.score - a.score);
  const trimmed = board.slice(0, MAX_ENTRIES);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed));
  return trimmed;
}

export function isTopScore(score: number): boolean {
  const board = getLeaderboard();
  if (board.length < MAX_ENTRIES) return true;
  return score > (board[board.length - 1]?.score ?? 0);
}

export function clearLeaderboard(): void {
  localStorage.removeItem(STORAGE_KEY);
}
