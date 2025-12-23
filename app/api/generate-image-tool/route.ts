import { openai } from "@ai-sdk/openai";
import {
  convertToModelMessages,
  experimental_generateImage as generateImage,
  InferUITools,
  stepCountIs,
  streamText,
  tool,
  UIDataTypes,
  UIMessage,
} from "ai";
import z from "zod";

const tools = {
  generateImage: tool({
    description: "Generate an Image",
    inputSchema: z.object({
      prompt: z.string().describe("The prompt is to generate an image for"),
    }),
    execute: async ({ prompt }) => {
      const { image } = generateImage({
        model: openai.imageModel("dall-e-3"),
        prompt,
        size: "1024x1024",
        providerOptions: {
          openai: { style: "vivid", quality: "hd" },
        },
      });
      return image.base64;
    },
    toModelOutput: () => {
      return {
        type: "content",
        value: [
          {
            type: "text",
            text: "generated image in base64",
          },
        ],
      };
    },
  }),
};

export type ChatTools = InferUITools<typeof tools>;
export type ChatMessage = UIMessage<never, UIDataTypes, ChatTools>;

export async function POST(req: Request) {
  try {
    const { messages }: { messages: ChatMessage[] } = await req.json();
    const result = await streamText({
        model: openai("gpt-3.5-turbo"),
        messages: convertToModelMessages(messages),
        tools,
        stopWhen: stepCountIs(2)
    })
    return result.toUIMessageStreamResponse()
  } catch (error) {
    console.error("Error streaming chat completion:", error);
    return new Response("Failed to stream chat completion", { status: 500 });
  }
}
