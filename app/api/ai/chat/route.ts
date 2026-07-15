import { NextResponse } from "next/server";
import { z } from "zod";
import { getAiProvider, getAiRuntimeStatus } from "@/lib/ai/provider";
import { buildOwnerChatMessages } from "@/lib/ai/owner-chat";

const chatRequestSchema = z.object({
  message: z.string().trim().min(2).max(4000),
  history: z
    .array(
      z.object({
        role: z.enum(["user", "assistant"]),
        content: z.string().trim().min(1).max(4000)
      })
    )
    .max(8)
    .optional()
});

export async function POST(request: Request) {
  const parsed = chatRequestSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid chat request" }, { status: 400 });
  }

  const runtime = getAiRuntimeStatus();
  const provider = getAiProvider();
  const messages = buildOwnerChatMessages(parsed.data.message, parsed.data.history);

  try {
    const result = await provider.completeChat({
      messages,
      temperature: 0.2,
      maxTokens: 900
    });

    return NextResponse.json({
      answer: result.content,
      provider: result.provider,
      model: result.model,
      runtime
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown AI provider error";
    return NextResponse.json(
      {
        error: "AI provider failed",
        details: message,
        runtime
      },
      { status: 502 }
    );
  }
}
