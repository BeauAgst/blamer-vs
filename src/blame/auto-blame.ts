import * as vscode from "vscode";
import { EXTENSION_CONFIGURATION, EXTENSION_NAME } from "../const/extension";
import { getBlamedFileDecorations } from "../storage/get-blamed-file-decorations";
import { mapDecorationOptions } from "../decoration/map-decoration-options";
import { showBlame } from "./show-blame";

export const autoBlame = async (
  context: vscode.ExtensionContext,
  editor: vscode.TextEditor
) => {
  try {
    const { autoBlame } = vscode.workspace.getConfiguration(
      `${EXTENSION_CONFIGURATION}.blame`
    );

    if (!autoBlame) {
      console.log("Auto-blame configuration is disabled, skipping...");
      return;
    }

    if (!editor) {
      return;
    }

    const { document } = editor;
    const { fileName, isClosed, isUntitled } = document;

    if (isClosed || isUntitled) {
      console.log("File is not open or hasn't been saved, ignoring...");
      return;
    }

    const existingDecorations = await getBlamedFileDecorations(
      context,
      fileName
    );

    if (existingDecorations.length) {
      existingDecorations.map(({ decoration, decorationData }) =>
        editor?.setDecorations(decoration, mapDecorationOptions(decorationData))
      );
      console.log("File is already blamed, skipping...");
      return;
    }

    console.log("Blaming new file...");
    return showBlame(context, editor, fileName);
  } catch (err) {
    console.error("Failed to blame file", err);
    vscode.window.showErrorMessage(`${EXTENSION_NAME}: Something went wrong`);
  }
};
