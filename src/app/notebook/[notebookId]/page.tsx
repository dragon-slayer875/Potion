import { Button } from "@/components/ui/button";
import { clerkClient } from "@/lib/clerk-server";
import { db } from "@/lib/db";
import { $notebooks } from "@/lib/db/schema";
import { auth } from "@clerk/nextjs/server";
import { and, eq } from "drizzle-orm";
import Link from "next/link";
import { redirect } from "next/navigation";
import React from "react";

type Props = {
  params: {
    notebookId: string;
  };
};

const NotebookPage = async ({ params: { notebookId } }: Props) => {
  const { userId } = await auth();
  if (!userId) {
    return redirect("/dashboard");
  }
  const user = await clerkClient.users.getUser(userId);

  const notebooks = await db
    .select()
    .from($notebooks)
    .where(
      and(
        eq($notebooks.id, parseInt(notebookId)),
        eq($notebooks.userId, userId),
      ),
    );

  if (notebooks.length !== 1) {
    return redirect("/dashboard");
  }

  const notebook = notebooks[0];
  return (
    <div className="min-h-screen grainy p-8">
      <div className="max-w-4xl mx-auto">
        <div className="border shadow-xl border-stone-200 rounded-lg p-4 flex items-center">
          <Link href="/dashboard">
            <Button className="bg-sky-600" size="sm">
              Back
            </Button>
          </Link>
          <div className="w-3"></div>
          <span className="font-semibold">
            {user.firstName} {user.lastName}
          </span>
          <span className="inline-block mx-1">/</span>
          <span className="text-stone-500 font-semibold">{notebook.name}</span>
          <div className="ml-auto">DELETE BUTTON</div>
        </div>
        <div className="h-4"></div>
        <div className="border rounded-lg border-stone-200 shadow-xl px-16 py-8 w-full">
          {/*editor*/}
        </div>
      </div>
    </div>
  );
};

export default NotebookPage;
