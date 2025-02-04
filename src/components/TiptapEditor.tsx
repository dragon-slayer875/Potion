"use client";
import React from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import { StarterKit } from "@tiptap/starter-kit";
import TiptapMenuBar from "./TiptapMenuBar";
import { Button } from "./ui/button";

type Props = {};

const TiptapEditor = (props: Props) => {
  const [editorState, setEditorState] = React.useState("");
  const editor = useEditor({
    autofocus: true,
    extensions: [StarterKit],
    content: editorState,
    onUpdate: ({ editor }) => {
      setEditorState(editor.getHTML());
    },
  });
  return (
    <>
      <div className="flex">
        {editor && <TiptapMenuBar editor={editor} />}
        <Button>Save</Button>
      </div>
      <div>
        <EditorContent editor={editor} />
      </div>
    </>
  );
};

export default TiptapEditor;
