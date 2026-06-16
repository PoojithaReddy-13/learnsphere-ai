import { NextResponse } from "next/server";
import { model } from "@/lib/gemini";

export async function POST() {
  try {
    const prompt = `
Generate 5 multiple choice questions about Artificial Intelligence.

Format exactly like this:

1. What is AI?

A) Option 1
B) Option 2
C) Option 3
D) Option 4

Answer: C

2. Next Question

A) Option 1
B) Option 2
C) Option 3
D) Option 4

Answer: A

Leave one blank line between questions.
Do not write explanations.
`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    return NextResponse.json({
      quiz: text,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        quiz: "Quiz generation failed.",
      },
      {
        status: 500,
      }
    );
  }
}