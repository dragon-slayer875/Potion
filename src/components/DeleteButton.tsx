"use client";
import React from "react";
import { Button } from "./ui/button";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useRouter } from "next/navigation";

type Props = {
  notebookId: number;
};

const DeleteButton = ({ notebookId }: Props) => {
  const router = useRouter();
  const deleteNote = useMutation({
    mutationFn: async () => {
      const response = await axios.post("/api/deleteNotebook", {
        notebookId,
      });
      return response.data;
    },
  });
  return (
    <Button
      variant={"destructive"}
      size={"sm"}
      disabled={deleteNote.isPending}
      onClick={() => {
        const confirmation = window.confirm(
          "Are you sure you want to delete this notebook?",
        );
        if (!confirmation) return;
        deleteNote.mutate(undefined, {
          onSuccess: () => {
            router.push("/dashboard");
          },
          onError: (error) => {
            console.error(error);
            window.alert("An error occurred while deleting the notebook.");
          },
        });
      }}
    >
      Delete
    </Button>
  );
};

export default DeleteButton;
