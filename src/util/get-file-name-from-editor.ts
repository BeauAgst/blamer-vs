import * as vscode from "vscode";

export const getFileNameFromEditor = (editor?: vscode.TextEditor) => {
  const { fileName, isUntitled } = editor?.document || {};

  if (!fileName || isUntitled) {
    throw new Error("Unable to get current file path");
  }

  return fileName;
};
