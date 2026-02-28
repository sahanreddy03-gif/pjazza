/**
 * OpenAI — AI descriptions, concierge, sentiment
 * Enrich business descriptions, product descriptions, review summaries
 */

import OpenAI from "openai";

export async function generateBusinessDescription(
  name: string,
  industry: string,
  locality: string,
  rawText?: string
): Promise<string | null> {
  const key = process.env.OPENAI_API_KEY;
  if (!key) return null;

  const openai = new OpenAI({ apiKey: key });

  try {
    const res = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "You write concise, engaging business descriptions for Malta tourism. 1-2 sentences. Professional tone.",
        },
        {
          role: "user",
          content: `Business: ${name}, Industry: ${industry}, Locality: ${locality}. ${rawText ? `Raw info: ${rawText.slice(0, 300)}` : ""} Write a short description.`,
        },
      ],
      max_tokens: 150,
    });

    const text = res.choices?.[0]?.message?.content?.trim();
    return text || null;
  } catch {
    return null;
  }
}

export async function summarizeReviews(reviews: string[]): Promise<string | null> {
  const key = process.env.OPENAI_API_KEY;
  if (!key || !reviews.length) return null;

  const openai = new OpenAI({ apiKey: key });

  try {
    const res = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "Summarize reviews in 1-2 sentences. Highlight what people love and any heads-up.",
        },
        {
          role: "user",
          content: reviews.slice(0, 10).join("\n"),
        },
      ],
      max_tokens: 100,
    });

    return res.choices?.[0]?.message?.content?.trim() || null;
  } catch {
    return null;
  }
}
