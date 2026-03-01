import { NextRequest, NextResponse } from "next/server";
import { CATEGORIES, type CategoryId } from "@/lib/questions";

const HF_TOKEN = process.env.HF_TOKEN;
const MODEL = "mistralai/Mistral-7B-Instruct-v0.3";

export async function POST(req: NextRequest) {
  try {
    if (!HF_TOKEN) {
      return NextResponse.json({ error: "HF_TOKEN not configured" }, { status: 500 });
    }

    const { category, difficulty } = (await req.json()) as {
      category: CategoryId;
      difficulty: 1 | 2 | 3 | 4;
    };

    const cat = CATEGORIES.find((c) => c.id === category);
    if (!cat) {
      return NextResponse.json({ error: "Invalid category" }, { status: 400 });
    }

    const diffLabel = ["", "easy", "medium", "hard", "expert"][difficulty];

    const prompt = `<s>[INST] Generate a ${diffLabel} quiz question about "${cat.name}" related to Saudi Arabia and Vision 2030.

Return ONLY valid JSON in this exact format (no markdown, no extra text):
{"question":"...","options":["A","B","C","D"],"correct":0,"explanation":"..."}

Rules:
- "correct" is the index (0-3) of the right answer
- Make 4 plausible options where only one is correct
- The explanation should be educational (1-2 sentences)
- Difficulty: ${diffLabel} (${difficulty === 1 ? "basic facts" : difficulty === 2 ? "moderate knowledge" : difficulty === 3 ? "specific details" : "expert-level trivia"})
[/INST]`;

    const res = await fetch(`https://router.huggingface.co/hf-inference/models/${MODEL}/v1/chat/completions`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${HF_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [{ role: "user", content: prompt }],
        max_tokens: 300,
        temperature: 0.7,
      }),
    });

    if (!res.ok) {
      const errText = await res.text();
      console.error("HF API error:", errText);
      return NextResponse.json({ error: "AI generation failed" }, { status: 502 });
    }

    const data = await res.json();
    const text = data.choices?.[0]?.message?.content ?? "";

    // Extract JSON from response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return NextResponse.json({ error: "Could not parse AI response" }, { status: 502 });
    }

    const question = JSON.parse(jsonMatch[0]);

    // Validate structure
    if (
      !question.question ||
      !Array.isArray(question.options) ||
      question.options.length !== 4 ||
      typeof question.correct !== "number" ||
      !question.explanation
    ) {
      return NextResponse.json({ error: "Invalid question format from AI" }, { status: 502 });
    }

    return NextResponse.json({
      id: Date.now(),
      category,
      difficulty,
      ...question,
    });
  } catch (err) {
    console.error("Generate error:", err);
    return NextResponse.json({ error: "AI generation failed" }, { status: 500 });
  }
}
