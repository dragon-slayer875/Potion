"use client";
import React from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import { StarterKit } from "@tiptap/starter-kit";
import TiptapMenuBar from "./TiptapMenuBar";
import { Button } from "./ui/button";
import { useDebounce } from "@/lib/Debounce";

type Props = {};

const TiptapEditor = (props: Props) => {
  const [editorState, setEditorState] = React.useState("");
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
    console.log(debouncedEditorState);
  }, [debouncedEditorState]);

  return (
    <>
      <div className="flex">
        {editor && <TiptapMenuBar editor={editor} />}
        <Button>Save</Button>
      </div>
      <div className="prose">
        <EditorContent editor={editor} />
      </div>
    </>
  );
};

export default TiptapEditor;
