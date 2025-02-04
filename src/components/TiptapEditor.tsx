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
import { Text } from "@tiptap/extension-text";

type Props = {
  notebook: NotebookType;
};

const TiptapEditor = ({ notebook }: Props) => {
  const [editorState, setEditorState] = React.useState(
    notebook.editorState || `<h1>${notebook.name}</h1>`,
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

  const customText = Text.extend({
    addKeyboardShortcuts() {
      return {
        "Alt-a": () => {
          console.log("ai was run");

          return true;
        },
      };
    },
  });

  const editor = useEditor({
    autofocus: true,
    extensions: [StarterKit, customText],
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
