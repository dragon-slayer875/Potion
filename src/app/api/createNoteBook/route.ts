// /api/createNoteBook

import { db } from "@/lib/db";
import { $notebooks } from "@/lib/db/schema";
import { generateImage, generateImagePrompt } from "@/lib/groq";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) {
    return new NextResponse("Unauthorized", { status: 401 });
  }
  const body = await req.json();
  const { name } = body;
  const image_description = await generateImagePrompt(name);
  if (!image_description) {
    return new NextResponse("Failed to generate image description", {
      status: 500,
    });
  }
  const imageUrl = await generateImage(image_description);
  if (!imageUrl) {
    return new NextResponse("Failed to generate image", {
      status: 500,
    });
  }
  const notebookId = await db
    .insert($notebooks)
    .values({
      name,
      userId,
      imageUrl,
    })
    .returning({
      id: $notebooks.id,
    });
  return NextResponse.json({
    notebook_id: notebookId[0].id,
  });
}
