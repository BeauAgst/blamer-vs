import { window } from "vscode";

export const getActiveTextEditor = () => {
  const editor = window.activeTextEditor;

  if (!editor) {
    throw new Error("Unable to find active editor");
  }

  return editor;
};
