import * as vscode from "vscode";
import { EXTENSION_NAME } from "../const/extension";
import { getBlamedFileDecorations } from "../storage/get-blamed-file-decorations";
import { setDecorationForLine } from "./set-decoration-for-line";
import { setBlamedFileDecorations } from "../storage/set-blamed-file-decorations";

export const displayInlineBlame = async (
  context: vscode.ExtensionContext,
  editor?: vscode.TextEditor
) => {
  try {
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

    if (!existingDecorations) {
      return;
    }

    const activeLine = (editor.selection.active.line + 1).toString();

    const decorationIndex = existingDecorations.lines.findIndex(
      ({ metadata }) => metadata.line === activeLine
    );

    if (decorationIndex === -1) {
      return;
    }

    const decorationForLine = existingDecorations.lines?.[decorationIndex];
    decorationForLine?.decoration.dispose();

    const updatedDecoration = setDecorationForLine(
      editor,
      decorationForLine?.metadata,
      "active_line"
    );

    existingDecorations.lines[decorationIndex] = {
      metadata: decorationForLine.metadata,
      decoration: updatedDecoration,
    };

    await setBlamedFileDecorations(context, fileName, existingDecorations);
  } catch (err) {
    console.error("Failed to blame file", err);
    vscode.window.showErrorMessage(`${EXTENSION_NAME}: Something went wrong`);
  }
};
