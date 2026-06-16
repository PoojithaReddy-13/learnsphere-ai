import { NextResponse } from "next/server";
import { model } from "@/lib/gemini";
import { extractTextFromPDF } from "@/lib/pdf";

export async function POST(req: Request) {
  try {
    const { message, fileName, hasPdf } = await req.json();
    console.log("Question:", message);
console.log("PDF:", fileName);
console.log("Has PDF:", hasPdf);

    const result = await model.generateContent(message);
    const response = await result.response;
    const text = response.text();

    return NextResponse.json({
      reply: text,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        reply: "Something went wrong.",
      },
      {
        status: 500,
      }
    );
  }
}