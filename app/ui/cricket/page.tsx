"use client";

import { experimental_useObject as useObject } from "@ai-sdk/react";
import { cricketVerdictUISchema } from "@/app/api/cricket/schema";
import { useState } from "react";

export default function CricketComparisonPage() {
  const [playerA, setPlayerA] = useState("");
  const [playerB, setPlayerB] = useState("");
  const [format, setFormat] = useState("TEST");
  const [pitchType, setPitchType] = useState("BALANCED");

  const { object, submit, isLoading, error, stop } = useObject({
    api: "/api/cricket",
    schema: cricketVerdictUISchema,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    submit({
      playerA,
      playerB,
      format,
      pitchType,
      comparisonType: "OVERALL",
    });
  };

  return (
    <div className="flex flex-col w-full max-w-3xl pt-12 pb-32 mx-auto px-4">
      {/* Error */}
      {error && (
        <div className="text-red-500 mb-6 bg-red-50 p-4 rounded">
          {error.message}
        </div>
      )}

      {/* Output */}
      {object && (
        <div className="space-y-6 mb-12">
          <div className="bg-zinc-50 dark:bg-zinc-800 p-6 rounded-lg shadow">
            <h2 className="text-2xl font-bold mb-2">AI Verdict</h2>

            <p className="text-lg mb-2">
              <span className="font-semibold">Winner:</span>{" "}
              {object.winner === "DRAW"
                ? "Draw"
                : object.winner === "PLAYER_A"
                ? playerA
                : playerB}
            </p>

            <p className="text-sm text-zinc-500">
              Confidence: {object.confidenceScore}%
            </p>

            <p className="mt-4">{object.summary}</p>
          </div>

          {/* Reasoning */}
          <div className="bg-zinc-50 dark:bg-zinc-800 p-6 rounded-lg shadow">
            <h3 className="text-xl font-semibold mb-4">Key Factors</h3>

            <div className="space-y-3">
              {object.reasoning?.map((item, idx) => (
                <div
                  key={idx}
                  className="bg-zinc-100 dark:bg-zinc-700 p-4 rounded-md"
                >
                  <div className="flex justify-between mb-1">
                    <span className="font-medium">{item?.factor}</span>
                    <span className="text-sm text-zinc-500">
                      Advantage: {item?.advantage}
                    </span>
                  </div>
                  <p className="text-sm">{item?.explanation}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Compared Stats */}
          <div className="bg-zinc-50 dark:bg-zinc-800 p-6 rounded-lg shadow">
            <h3 className="text-xl font-semibold mb-4">
              Stats Considered
            </h3>
            <div className="flex flex-wrap gap-2">
              {object.keyStatsCompared?.map((stat) => (
                <span
                  key={stat}
                  className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-3 py-1 rounded-full text-sm"
                >
                  {stat}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Input Form */}
      <form
        onSubmit={handleSubmit}
        className="fixed bottom-0 left-0 right-0 bg-zinc-50 dark:bg-zinc-950 border-t border-zinc-200 dark:border-zinc-800 p-4"
      >
        <div className="max-w-3xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-2">
          <input
            value={playerA}
            onChange={(e) => setPlayerA(e.target.value)}
            placeholder="Player A (Virat Kohli)"
            className="dark:bg-zinc-800 p-2 border rounded"
          />

          <input
            value={playerB}
            onChange={(e) => setPlayerB(e.target.value)}
            placeholder="Player B (Steve Smith)"
            className="dark:bg-zinc-800 p-2 border rounded"
          />

          <select
            value={format}
            onChange={(e) => setFormat(e.target.value)}
            className="dark:bg-zinc-800 p-2 border rounded"
          >
            <option>TEST</option>
            <option>ODI</option>
            <option>T20</option>
          </select>

          {isLoading ? (
            <button
              type="button"
              onClick={stop}
              className="bg-red-500 text-white rounded px-4"
            >
              Stop
            </button>
          ) : (
            <button
              type="submit"
              disabled={!playerA || !playerB}
              className="bg-blue-500 text-white rounded px-4 disabled:opacity-50"
            >
              Compare
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
