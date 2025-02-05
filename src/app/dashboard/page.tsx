import CreateNoteDialog from "@/components/CreateNoteDialog";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { db } from "@/lib/db";
import { $notebooks } from "@/lib/db/schema";
import { UserButton } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { ArrowLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const DashboardPage = async () => {
  const { userId } = await auth();
  const notebooks = await db
    .select()
    .from($notebooks)
    .where(eq($notebooks.userId, userId!));
  return (
    <>
      <div className="grainy min-h-screen">
        <div className="max-w-7xl mx-auto p-10">
          <div className="h-14"></div>
          <div className="flex justify-between items-center md:flex-row flex-col">
            <div className="flex items-center">
              <Link href="/">
                <Button size={"sm"} className="bg-sky-600">
                  <ArrowLeft className="mr-1 w-4 h-4" strokeWidth={3} />
                  Back
                </Button>
              </Link>
              <div className="w-4"></div>
              <h1 className="text-3xl font-bold text-gray-900">My Notes</h1>
              <div className="w-4"></div>
              <UserButton />
            </div>
          </div>
          <div className="h-8"></div>
          <Separator />
          <div className="h-8"></div>
          {notebooks.length === 0 && (
            <div className="text-center">
              <h2 className="text-xl text-gray-500">You have no notes yet.</h2>
            </div>
          )}
          <div className="grid sm:grid-cols-3 md:grid-cols-5 grid-cols-1 gap-3">
            <CreateNoteDialog />
            {notebooks.map((notebook) => {
              return (
                <Link href={`/notebook/${notebook.id}`} key={notebook.id}>
                  <div className="border border-stone-200 overflow-hidden rounded-lg flex flex-col hover:shadow-xl transition hover:-translate-y-1">
                    <Image
                      src={notebook.imageUrl || ""}
                      alt={notebook.name}
                      width={400}
                      height={200}
                      style={{
                        width: "auto",
                      }}
                    />
                    <div className="p-4">
                      <h3 className="text-xl font-semibold text-gray-900">
                        {notebook.name}
                      </h3>
                      <div className="h-1"></div>
                      <p className="text-sm text-gray-500">
                        {new Date(notebook.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
};

export default DashboardPage;
