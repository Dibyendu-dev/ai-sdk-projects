import { z } from "zod";

export const cricketVerdictUISchema = z.object({
  winner: z.enum(["PLAYER_A", "PLAYER_B", "DRAW"]),
  confidenceScore: z.number(),
  summary: z.string(),
  reasoning: z.array(
    z.object({
      factor: z.string(),
      explanation: z.string(),
      advantage: z.enum(["PLAYER_A", "PLAYER_B", "NEUTRAL"]),
    })
  ),
  keyStatsCompared: z.array(z.string()),
});
