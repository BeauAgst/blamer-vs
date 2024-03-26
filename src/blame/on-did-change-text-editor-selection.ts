import * as vscode from "vscode";
import { getFileNameFromEditor } from "../util/get-file-name-from-editor";
import { EXTENSION_NAME } from "../const/extension";
import { getBlamedFileDecorations } from "../storage/get-blamed-file-decorations";
import { setDecorationForLines } from "../decoration/set-decoration-for-line";
import { setBlamedFileDecorations } from "../storage/set-blamed-file-decorations";
export const onDidChangeTextEditorSelection = async (
  context: vscode.ExtensionContext,
  event: vscode.TextEditorSelectionChangeEvent
) => {
  try {
    const editor = event.textEditor;
    const filePath = getFileNameFromEditor(editor);
    const existingDecorations = await getBlamedFileDecorations(
      context,
      filePath
    );

    if (!existingDecorations?.length) {
      return;
    }

    const activeLine = (event.textEditor.selection.active.line + 1).toString();
    const decorationIndex = existingDecorations.findIndex(
      ({ decorationData }) => decorationData.lines.includes(activeLine)
    );

    if (decorationIndex === -1) {
      return;
    }

    const decorationForLine = existingDecorations[decorationIndex];

    decorationForLine?.decoration.dispose();

    const updatedDecoration = setDecorationForLines(
      editor,
      decorationForLine?.decorationData,
      "active_line"
    );

    existingDecorations[decorationIndex] = {
      decorationData: decorationForLine.decorationData,
      decoration: updatedDecoration,
    };

    await setBlamedFileDecorations(context, filePath, existingDecorations);
  } catch (err) {
    console.error("Failed to blame file", err);
    vscode.window.showErrorMessage(`${EXTENSION_NAME}: Something went wrong`);
  }
};
