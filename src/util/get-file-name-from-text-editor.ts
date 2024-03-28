import { TextEditor } from "vscode";

export const getFileNameFromTextEditor = (textEditor?: TextEditor) => {
  const { fileName, isUntitled } = textEditor?.document || {};

  if (!fileName || isUntitled) {
    throw new Error("Unable to identify file name");
  }

  return fileName;
};
