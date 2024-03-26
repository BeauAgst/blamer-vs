import * as vscode from "vscode";
import { createGutterDecoration } from "./create-gutter-decoration";
import { DecorationData } from "./map-blame-to-decoration-data";
import { EXTENSION_CONFIGURATION } from "../const/extension";
import { mapDecorationOptions } from "./map-decoration-options";

export const setDecorationForLine = (
  editor: vscode.TextEditor,
  decorationData: DecorationData,
  action: "blame" | "active_line"
): vscode.TextEditorDecorationType => {
  const decoration = createGutterDecoration(decorationData, action);
  editor?.setDecorations(decoration, mapDecorationOptions(decorationData));
  return decoration;
};
