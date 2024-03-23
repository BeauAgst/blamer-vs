import * as vscode from "vscode";
import { mapDecorationOptions } from "./map-decoration-options";
import { createGutterDecoration } from "./create-gutter-decoration";
import { createBlankDecoration } from "./create-blank-decoration";
import { DecorationData } from "./map-revision-log-to-decoration-data";

export const setDecorationForLines = (
  editor: vscode.TextEditor,
  decorationData: DecorationData
): vscode.TextEditorDecorationType => {
  const decoration = decorationData.gutterImagePath
    ? createGutterDecoration(decorationData.gutterImagePath)
    : createBlankDecoration();

  editor?.setDecorations(decoration, mapDecorationOptions(decorationData));

  return decoration;
};
