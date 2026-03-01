/* ═══════════════════════════════════════
   ARABIC TRANSLATIONS
   Decorative bilingual labels used
   alongside English throughout the UI.
═══════════════════════════════════════ */

export const AR = {
  // Layout
  brandName: "اختبار رؤية ٢٠٣٠",
  home: "الرئيسية",
  playNow: "العب الآن",
  footer: "ساحة اختبار رؤية ٢٠٣٠",

  // Home page
  heroTitle: "ساحة اختبار رؤية ٢٠٣٠",
  heroSubtitle: "اختبر معلوماتك عن المملكة العربية السعودية",
  startPlaying: "ابدأ اللعب",
  howItWorks: "كيف يعمل",
  step1: "اختر موضوعاً",
  step2: "أجب عن الأسئلة",
  step3: "تصدّر اللوحة",
  chooseCategory: "اختر فئتك",
  leaderboard: "لوحة المتصدرين",
  questions: "سؤال",
  categories: "فئات",
  levels: "مستويات",

  // Play page
  question: "سؤال",
  hint: "تلميح",
  hintPenalty: "نصف النقاط",
  easy: "سهل",
  medium: "متوسط",
  hard: "صعب",
  expert: "خبير",
  correct: "!صحيح",
  notQuite: "!ليس تماماً",
  timesUp: "!انتهى الوقت",
  streak: "سلسلة",

  // Results page
  totalScore: "النتيجة الإجمالية",
  accuracy: "الدقة",
  bestStreak: "أفضل سلسلة",
  hintsUsed: "تلميحات",
  level: "المستوى",
  legendary: "أسطوري",
  excellent: "ممتاز",
  great: "رائع",
  good: "جيد",
  keepLearning: "واصل التعلم",
  playAgain: "العب مرة أخرى",
  tryAnother: "جرّب فئة أخرى",
  highScore: "!نتيجة عالية جديدة",
  scoreSaved: "!تم حفظ النتيجة",
  noResults: "لم يتم العثور على نتائج",
  enterName: "أدخل اسمك",

  // Story page
  storyTitle: "تعرّف على الموضوع",
  storySkip: "تخطَّ إلى الاختبار",
  storyNext: "التالي",
  storyPrev: "السابق",
  storyStart: "ابدأ الاختبار",
  funFact: "هل تعلم؟",
  storyProgress: "التقدم",
  readyToPlay: "هل أنت مستعد؟",
} as const;

export const DIFFICULTY_LABELS_AR: Record<number, string> = {
  1: "سهل",
  2: "متوسط",
  3: "صعب",
  4: "خبير",
};
