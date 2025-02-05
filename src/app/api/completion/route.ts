import { generateCompletion } from "@/lib/ai";

export const maxDuration = 10;

export async function POST(req: Request) {
  const { prompt }: { prompt: string } = await req.json();

  const response = await generateCompletion(prompt);

  return response?.toTextStreamResponse();
}
