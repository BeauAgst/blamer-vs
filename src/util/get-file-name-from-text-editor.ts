import { TextEditor, workspace } from "vscode";

export const getFileNameFromTextEditor = async (textEditor?: TextEditor) => {
  const { fileName, isUntitled, uri } = textEditor?.document || {};

  if (!fileName || isUntitled || !uri) {
    return undefined;
  }

  try {
    await workspace.fs.stat(uri);
  } catch {
    return undefined;
  }

  return fileName;
};
