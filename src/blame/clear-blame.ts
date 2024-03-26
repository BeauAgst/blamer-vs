import * as vscode from "vscode";
import { getBlamedFileDecorations } from "../storage/get-blamed-file-decorations";
import { getFileNameFromEditor } from "../util/get-file-name-from-editor";
import { getActiveTextEditor } from "../util/get-active-text-editor";
import { setBlamedFileDecorations } from "../storage/set-blamed-file-decorations";

export const clearBlame = async (context: vscode.ExtensionContext) => {
  const editor = getActiveTextEditor();
  const filePath = getFileNameFromEditor(editor);

  const decorations = await getBlamedFileDecorations(context, filePath);

  decorations.map(({ decoration }) => decoration?.dispose?.());

  await setBlamedFileDecorations(context, filePath);
};
