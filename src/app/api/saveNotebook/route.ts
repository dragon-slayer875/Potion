import { db } from "@/lib/db";
import { $notebooks } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { editorState } = body;
    let { notebookId } = body;
    if (!notebookId || !editorState) {
      return new NextResponse("Missing notebookId or editorState", {
        status: 400,
      });
    }

    notebookId = parseInt(notebookId);

    const notebooks = await db
      .select()
      .from($notebooks)
      .where(eq($notebooks.id, notebookId));

    if (notebooks.length !== 1) {
      return new NextResponse("Failed to update notebook", { status: 500 });
    }

    const notebook = notebooks[0];

    if (notebook.editorState !== editorState) {
      await db
        .update($notebooks)
        .set({ editorState })
        .where(eq($notebooks.id, notebookId));
    }

    return NextResponse.json(
      {
        success: true,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      {
        success: false,
      },
      { status: 500 },
    );
  }
}
