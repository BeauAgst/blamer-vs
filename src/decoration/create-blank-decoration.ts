import * as vscode from "vscode";

export const createBlankDecoration = () =>
  vscode.window.createTextEditorDecorationType({
    after: {
      margin: "0 0 0 3em",
      textDecoration: "none",
    },
  });
