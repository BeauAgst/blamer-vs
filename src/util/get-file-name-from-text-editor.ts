import { TextEditor } from "vscode";

export const getFileNameFromTextEditor = (textEditor?: TextEditor) => {
  const { fileName, isUntitled } = textEditor?.document || {};

  if (!fileName || isUntitled) {
    return undefined;
  }

  return fileName;
};
