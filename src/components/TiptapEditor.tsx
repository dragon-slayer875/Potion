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
import { useCompletion } from "ai/react";

type Props = {
  notebook: NotebookType;
};

const TiptapEditor = ({ notebook }: Props) => {
  const [editorState, setEditorState] = React.useState(
    notebook.editorState || `<h1>${notebook.name}</h1>`,
  );

  const { completion, complete } = useCompletion({
    streamProtocol: "text",
  });

  const lastCompletion = React.useRef("");

  const token = React.useMemo(() => {
    if (!completion) return;
    const diff = completion.slice(lastCompletion.current.length);
    lastCompletion.current = completion;
    return diff;
  }, [completion]);

  React.useEffect(() => {
    if (!editor || !token) return;
    editor.commands.insertContent(token);
  }, [token]);

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
          const prompt = this.editor.getText().split(" ").slice(-30).join(" ");
          complete(prompt);
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
