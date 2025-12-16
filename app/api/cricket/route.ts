import { streamObject } from "ai";
import { openai } from "@ai-sdk/openai";
import { cricketVerdictUISchema } from "./schema";

export async function POST(req: Request) {
  try {
    const { playerA, playerB, format, pitchType, comparisonType } = await req.json();

    const prompt = `
            You are a cricket analytics AI.

            Compare the following two cricketers purely based on statistics and match context.

            Player A:
            ${JSON.stringify(playerA, null, 2)}

            Player B:
            ${JSON.stringify(playerB, null, 2)}

            Match Context:
            - Format: ${format}
            - Pitch Type: ${pitchType}
            - Comparison Type: ${comparisonType}

            Rules:
            - Use only statistical reasoning
            - Be era-aware
            - Do not favor popularity
            - Give a clear winner or draw
            - Provide structured reasoning
            `;

    const result = streamObject({
      model: openai("gpt-5-nano"),
      schema: cricketVerdictUISchema,
      prompt,
    });

    return result.toTextStreamResponse();
  } catch (error) {
    console.error("Error generating cricket comparison:", error);
    return new Response("Failed to generate comparison", { status: 500 });
  }
}
