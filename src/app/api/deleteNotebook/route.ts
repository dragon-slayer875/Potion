import { db } from "@/lib/db";
import { $notebooks } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { notebookId } = await req.json();
    await db.delete($notebooks).where(eq($notebooks.id, parseInt(notebookId)));
    return new NextResponse("Notebook deleted successfully", {
      status: 200,
    });
  } catch (error) {
    console.error(error);
  }
}
