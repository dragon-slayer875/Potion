import DeleteButton from "@/components/DeleteButton";
import TiptapEditor from "@/components/TiptapEditor";
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
  params: Promise<{
    notebookId: string;
  }>;
};

const NotebookPage = async (props: Props) => {
  const params = await props.params;

  const { notebookId } = params;

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
    <div className="min-h-screen max-h-screen grainy lg:p-8 flex">
      <div className="max-w-4xl mx-auto flex-1 flex flex-col">
        <div className="border shadow-xl border-stone-200 rounded-lg p-4 flex items-center">
          <Link href="/dashboard">
            <Button className="bg-sky-600" size="sm">
              Back
            </Button>
          </Link>
          <div className="w-3"></div>
          <span className="hidden sm:block font-semibold">
            {user.firstName} {user.lastName}
          </span>
          <span className="hidden sm:inline-block mx-1">/</span>
          <span className="text-stone-500 font-semibold">{notebook.name}</span>
          <div className="ml-auto">
            <DeleteButton notebookId={parseInt(notebookId)} />
          </div>
        </div>
        <div className="md:h-4"></div>
        <div className="overflow-scroll border rounded-lg border-stone-200 shadow-xl px-4 md:px-16 py-8 h-full w-full flex-1 flex flex-col">
          <TiptapEditor notebook={notebook} />
        </div>
      </div>
    </div>
  );
};

export default NotebookPage;
