import * as vscode from "vscode";

export const getActiveTextEditor = () => {
  const editor = vscode.window.activeTextEditor;

  if (!editor) {
    throw new Error("Unable to find active editor");
  }

  return editor;
};
