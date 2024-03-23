import * as vscode from "vscode";
import { getBlamedFileDecorations } from "../storage/get-blamed-file-decorations";
import { getFileNameFromEditor } from "../util/get-file-name-from-editor";
import { clearBlame } from "./clear-blame";
import { showBlame } from "./show-blame";
import { getActiveTextEditor } from "../util/get-active-text-editor";

export const toggleBlame = async (context: vscode.ExtensionContext) => {
  const editor = getActiveTextEditor();
  const filePath = getFileNameFromEditor(editor);
  const decorations = await getBlamedFileDecorations(context, filePath);

  return decorations?.length ? clearBlame(context) : showBlame(context);
};
