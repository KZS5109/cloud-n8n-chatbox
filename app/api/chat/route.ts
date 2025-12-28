import { streamText } from "ai"

export async function POST(req: Request) {
  const { messages } = await req.json()

  const result = await streamText({
    model: "openai/gpt-5-mini",
    system:
      "You are a helpful AI cloud drive assistant. You can help users manage, analyze, and understand their files. You have a professional yet high-tech personality.",
    messages,
  })

  return result.toUIMessageStreamResponse()
}
