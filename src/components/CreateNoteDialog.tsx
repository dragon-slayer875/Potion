"use client";
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Loader2, Plus } from "lucide-react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useRouter } from "next/navigation";

type Props = {};

const CreateNoteDialog = (props: Props) => {
  const router = useRouter();
  const [input, setInput] = React.useState("");
  const createNotebook = useMutation({
    mutationFn: async () => {
      const response = await axios.post("api/createNotebook", {
        name: input,
      });
      return response.data;
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (input === "") {
      window.alert("Please enter a name for your Notebook.");
      return;
    }
    createNotebook.mutate(undefined, {
      onSuccess: ({ notebookId }) => {
        console.log("created new note:", notebookId);
        router.push(`/notebook/${notebookId}`);
      },
      onError: (error) => {
        console.error(error);
        window.alert("Failed to create a new notebook.");
      },
    });
  };

  return (
    <Dialog>
      <DialogTrigger>
        <div className="border-dashed border-2 border-sky-600 flex h-full rounded-lg items-center justify-center sm:flex-col hover:shadow-xl transition hover:-translate-y-1 p-4">
          <Plus className="w-6 h-6 text-sky-600" strokeWidth={3} />
          <h2 className="font-semibold text-sky-600 sm:mt-2">New Notebook</h2>
        </div>
      </DialogTrigger>
      <DialogContent className="max-md:bottom-0 max-md:top-auto">
        <DialogHeader>
          <DialogTitle>Create new notebook</DialogTitle>
          <DialogDescription>
            You can create a new notebook by clicking the button below.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} action="">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Notebook name"
          />
          <div className="h-4"></div>
          <div className="flex flex-col  gap-2">
            <Button type="reset" variant={"secondary"}>
              Cancel
            </Button>
            <Button
              className="bg-sky-600"
              type="submit"
              disabled={createNotebook.isPending}
            >
              {createNotebook.isPending && (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              )}
              Create
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateNoteDialog;
