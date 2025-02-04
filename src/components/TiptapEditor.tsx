"use client";
import React from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import { StarterKit } from "@tiptap/starter-kit";
import TiptapMenuBar from "./TiptapMenuBar";
import { Button } from "./ui/button";
import { useDebounce } from "@/lib/Debounce";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { NotebookType } from "@/lib/db/schema";

type Props = {
  notebook: NotebookType;
};

const TiptapEditor = ({ notebook }: Props) => {
  const [editorState, setEditorState] = React.useState(
    notebook.editorState || "",
  );

  const saveNotebook = useMutation({
    mutationFn: async () => {
      const response = await axios.post("/api/saveNotebook", {
        notebookId: notebook.id,
        editorState,
      });
      return response.data;
    },
  });

  const editor = useEditor({
    autofocus: true,
    extensions: [StarterKit],
    content: editorState,
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      setEditorState(editor.getHTML());
    },
  });

  const debouncedEditorState = useDebounce(editorState, 1000);

  React.useEffect(() => {
    if (!debouncedEditorState) return;
    saveNotebook.mutate(undefined, {
      onSuccess: () => {
        console.log("Saved successfully.");
      },
      onError: (error) => {
        console.error(error);
        window.alert("Failed to save notebook.");
      },
    });
  }, [debouncedEditorState]);

  return (
    <>
      <div className="flex">
        {editor && <TiptapMenuBar editor={editor} />}
        <Button disabled variant={"outline"}>
          {saveNotebook.isPending ? "Saving..." : "Saved"}
        </Button>
      </div>
      <div className="prose">
        <EditorContent editor={editor} />
      </div>
    </>
  );
};

export default TiptapEditor;
