import * as vscode from "vscode";

export const createGutterDecoration = (gutterIconPath?: string) =>
  vscode.window.createTextEditorDecorationType({
    gutterIconPath,
    gutterIconSize: "contain",
  });
