"use client";
import React from "react";
import TypewriterComponent from "typewriter-effect";

type Props = {};

const TypewriterTitle = (props: Props) => {
  return (
    <TypewriterComponent
      options={{ loop: true }}
      onInit={(typewriter) => {
        typewriter
          .typeString("WYSIWYG")
          .pauseFor(1000)
          .deleteAll()
          .typeString("Markdown")
          .pauseFor(1000)
          .deleteAll()
          .typeString("BYOAI")
          .pauseFor(1000)
          .start();
      }}
    />
  );
};

export default TypewriterTitle;
